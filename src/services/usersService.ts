import crypto from 'crypto';
import { promisify } from 'util';
import db from '@/db';
import type { CreateUserRequestBody, UserResponseDto } from '../types/users';
import { HttpError } from '../types/users';

const SCRYPT_KEY_LENGTH_BYTES = 64;
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

export function parseUserId(rawId: string): number {
  const userId = Number(rawId);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new HttpError(400, 'Invalid user id');
  }

  return userId;
}

function validateCreateUserBody(body: Partial<CreateUserRequestBody>): CreateUserRequestBody {
  const { email, password } = body;

  if (typeof email !== 'string' || !email.trim()) {
    throw new HttpError(400, 'Email is required');
  }

  if (typeof password !== 'string' || !password) {
    throw new HttpError(400, 'Password is required');
  }

  return { email: email.trim(), password };
}

export async function getUserById(userId: number): Promise<UserResponseDto> {
  const result = await db.query<UserResponseDto>(
    'SELECT id, email FROM users WHERE id = $1',
    [userId]
  );

  if (!result.rows.length) {
    throw new HttpError(404, 'User not found');
  }

  return result.rows[0];
}

export async function createUser(body: Partial<CreateUserRequestBody>): Promise<UserResponseDto> {
  const { email, password } = validateCreateUserBody(body);
  const passwordHash = await hashPassword(password);
  const result = await db.query<UserResponseDto>(
    'INSERT INTO users (email, password_hash, is_admin) VALUES ($1, $2, false) RETURNING id, email',
    [email, passwordHash]
  );

  return result.rows[0];
}
