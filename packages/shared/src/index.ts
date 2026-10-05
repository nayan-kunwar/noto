export * from './enums/index.js';
export * from './types/note.js';
export * from './types/user.js';
export * from './types/sync.js';
export * from './schemas/note.schema.js';
export * from './schemas/auth.schema.js';
export * from './schemas/sync.schema.js';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  error: null;
}

export interface ApiFailure {
  success: false;
  data: null;
  error: { code: string; message: string };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
