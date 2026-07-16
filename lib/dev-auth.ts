/** Local-only gate for password auto-login. Never true when NODE_ENV is production. */
export function isDevAutoLoginEnabled(env: {
  NODE_ENV?: string;
  DEV_AUTO_LOGIN?: string;
  DEV_LOGIN_PASSWORD?: string;
  ALLOWED_EMAIL?: string;
}): boolean {
  return (
    env.NODE_ENV === "development" &&
    env.DEV_AUTO_LOGIN === "true" &&
    Boolean(env.DEV_LOGIN_PASSWORD) &&
    Boolean(env.ALLOWED_EMAIL)
  );
}
