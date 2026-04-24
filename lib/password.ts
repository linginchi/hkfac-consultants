import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/**
 * Only bcrypt (`$2a$` / `$2b$` / `$2y$`) is accepted. Generate a row value with
 * `npm run hash:admin-password -- <password>` and update `admin_users.password_hash` in Supabase.
 */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return bcrypt.compare(plain, stored);
  }
  return false;
}
