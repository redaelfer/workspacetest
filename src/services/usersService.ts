import crypto from 'crypto';
import { promisify } from 'util';
import db from '@/db';
import type Interfaces from '@/ts/Interfaces';
import HttpError from '@/ts/HttpError';

const SCRYPT_KEY_LENGTH_BYTES = 64;
const MIN_PASSWORD_LENGTH = 12;
const scryptAsync = promisify(crypto.scrypt);

/**
 * Stores password hashes as `scrypt$<hex-salt>$<hex-derived-key>`.
 * The derived key is 64 bytes from Node's scrypt defaults; future hash
 * migrations should keep this prefix/version check before accepting a hash.
 */
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(
    password,
    salt,
    SCRYPT_KEY_LENGTH_BYTES
  )) as Buffer;

  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

function parseUserId(rawId: string): number {
  const userId = Number(rawId);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new HttpError(400, 'Invalid user id');
  }

  return userId;
}

function validatePassword(password: string): void {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (
    password.length < MIN_PASSWORD_LENGTH ||
    !hasLowercase ||
    !hasUppercase ||
    !hasNumber ||
    !hasSymbol
  ) {
    throw new HttpError(
      400,
      'Password must be at least 12 characters and include uppercase, lowercase, number, and symbol characters'
    );
  }
}

function validateCreateUserBody(
  body: Partial<Interfaces['CreateUserRequestBody']>
): Interfaces['CreateUserRequestBody'] {
  const { email, password } = body;

  if (typeof email !== 'string' || !email.trim()) {
    throw new HttpError(400, 'Email is required');
  }

  if (typeof password !== 'string' || !password) {
    throw new HttpError(400, 'Password is required');
  }

  validatePassword(password);

  return { email: email.trim(), password };
}

async function getUserById(userId: number): Promise<Interfaces['UserResponseDto']> {
  const result = await db.query<Interfaces['UserResponseDto']>(
    'SELECT id, email FROM users WHERE id = $1',
    [userId]
  );

  if (!result.rows.length) {
    throw new HttpError(404, 'User not found');
  }

  return result.rows[0];
}

async function createUser(
  body: Partial<Interfaces['CreateUserRequestBody']>
): Promise<Interfaces['UserResponseDto']> {
  const { email, password } = validateCreateUserBody(body);
  const passwordHash = await hashPassword(password);
  const result = await db.query<Interfaces['UserResponseDto']>(
    'INSERT INTO users (email, password_hash, is_admin) VALUES ($1, $2, false) RETURNING id, email',
    [email, passwordHash]
  );

  return result.rows[0];
}

export default {
  createUser,
  getUserById,
  parseUserId,
};
