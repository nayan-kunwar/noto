import { loginSchema, registerSchema } from '@repo/shared';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import {
  createUser,
  findRefreshToken,
  findUserByEmail,
  findUserById,
  revokeRefreshToken,
  storeRefreshToken,
  type DbClient,
} from './auth.repository.js';

export class AuthError extends Error {
  status: number;
  code: string;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

interface TokenSigner {
  (payload: Record<string, unknown>, expiresIn: string): string;
}

export class AuthService {
  constructor(
    private readonly database: DbClient,
    private readonly signAccess: TokenSigner,
    private readonly signRefresh: TokenSigner,
  ) {}

  async register(email: string, password: string) {
    const parsed = registerSchema.parse({ email, password });
    const existing = await findUserByEmail(this.database, parsed.email);
    if (existing) throw new AuthError('EMAIL_TAKEN', 'Email already registered', 409);
    const passwordHash = await hashPassword(parsed.password);
    const user = await createUser(this.database, parsed.email, passwordHash);
    const accessToken = this.signAccess({ sub: user.id }, '15m');
    const refreshToken = this.signRefresh({ sub: user.id }, '30d');
    await storeRefreshToken(this.database, user.id, refreshToken, new Date(Date.now() + 30 * 864e5));
    return { user: { id: user.id, email: user.email }, tokens: { accessToken, refreshToken } };
  }

  async login(email: string, password: string) {
    const parsed = loginSchema.parse({ email, password });
    const user = await findUserByEmail(this.database, parsed.email);
    if (!user) throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    const ok = await verifyPassword(user.passwordHash, parsed.password);
    if (!ok) throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    const accessToken = this.signAccess({ sub: user.id }, '15m');
    const refreshToken = this.signRefresh({ sub: user.id }, '30d');
    await storeRefreshToken(this.database, user.id, refreshToken, new Date(Date.now() + 30 * 864e5));
    return { user: { id: user.id, email: user.email }, tokens: { accessToken, refreshToken } };
  }

  async refresh(token: string) {
    const stored = await findRefreshToken(this.database, token);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new AuthError('INVALID_REFRESH', 'Invalid refresh token', 401);
    }
    await revokeRefreshToken(this.database, token);
    const user = await findUserById(this.database, stored.userId);
    if (!user) throw new AuthError('USER_NOT_FOUND', 'User not found', 404);
    const accessToken = this.signAccess({ sub: user.id }, '15m');
    const refreshToken = this.signRefresh({ sub: user.id }, '30d');
    await storeRefreshToken(this.database, user.id, refreshToken, new Date(Date.now() + 30 * 864e5));
    return { accessToken, refreshToken };
  }

  async me(userId: string) {
    const user = await findUserById(this.database, userId);
    if (!user) throw new AuthError('USER_NOT_FOUND', 'User not found', 404);
    return { id: user.id, email: user.email };
  }
}
