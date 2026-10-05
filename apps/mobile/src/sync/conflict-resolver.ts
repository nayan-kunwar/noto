// Last-Write-Wins for local apply. Remote wins if newer version or timestamp.
export function shouldApplyRemote(localUpdatedAt: string, localVersion: number, remoteUpdatedAt: string, remoteVersion: number): boolean {
  if (remoteVersion !== localVersion) return remoteVersion > localVersion;
  return new Date(remoteUpdatedAt).getTime() > new Date(localUpdatedAt).getTime();
}
