interface Versioned {
  version: number;
  updatedAt: Date | string;
}

// Last-Write-Wins: higher version wins; tie-break by newer updatedAt.
// Structured so a CRDT/merge strategy can replace it later.
export function isRemoteNewer(local: Versioned, remote: Versioned): boolean {
  if (remote.version !== local.version) return remote.version > local.version;
  return new Date(remote.updatedAt).getTime() > new Date(local.updatedAt).getTime();
}
