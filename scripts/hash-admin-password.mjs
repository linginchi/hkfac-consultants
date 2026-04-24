#!/usr/bin/env node
/**
 * Generate a bcrypt hash for `admin_users.password_hash` (same algorithm as lib/password.ts).
 * Usage: npm run hash:admin-password -- "your-secret-password"
 * Then in Supabase SQL: update admin_users set password_hash = '<output>' where email = '...';
 */
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;
const plain = process.argv[2];
if (!plain) {
  console.error("Usage: npm run hash:admin-password -- <password>");
  process.exit(1);
}
const hash = await bcrypt.hash(plain, BCRYPT_ROUNDS);
console.log(hash);
