import { db } from '$lib/server/db';
import { user, authSession, UserRole } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, type Cookies } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof authSession.$inferSelect;

// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// 사용자 생성 (회원가입)
export async function createUser(userData: Omit<NewUser, 'password'> & { password: string }): Promise<User> {
  const hashedPassword = await hashPassword(userData.password);

  const newUser = {
    ...userData,
    password: hashedPassword
  };

  const result = await db.insert(user).values(newUser).returning();
  return result[0];
}

// 사용자명으로 사용자 찾기
export async function getUserByUsername(username: string): Promise<User | null> {
  const users = await db.select().from(user).where(eq(user.username, username));
  return users[0] || null;
}

// 이메일로 사용자 찾기
export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await db.select().from(user).where(eq(user.email, email));
  return users[0] || null;
}

// ID로 사용자 찾기
export async function getUserById(id: number): Promise<User | null> {
  const users = await db.select().from(user).where(eq(user.id, id));
  return users[0] || null;
}

// 세션 생성
export async function createSession(userId: number): Promise<Session> {
  const sessionId = nanoid();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 세션 7일 유효

  const session = {
    id: sessionId,
    userId,
    expiresAt: expiresAt.toISOString()
  };

  const result = await db.insert(authSession).values(session).returning();
  return result[0];
}

// 세션 검증
export async function getSessionByID(sessionId: string): Promise<Session | null> {
  const sessions = await db.select().from(authSession).where(eq(authSession.id, sessionId));
  const session = sessions[0];

  if (!session) return null;

  // 만료된 세션 체크
  if (new Date(session.expiresAt) < new Date()) {
    await db.delete(authSession).where(eq(authSession.id, sessionId));
    return null;
  }

  return session;
}

// 세션 삭제 (로그아웃)
export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(authSession).where(eq(authSession.id, sessionId));
}

// 쿠키에서 세션 ID 가져오기
export function getSessionFromCookies(cookies: Cookies): string | undefined {
  return cookies.get('session');
}

// 현재 로그인한 사용자 가져오기
export async function getCurrentUser(cookies: Cookies): Promise<User | null> {
  const sessionId = getSessionFromCookies(cookies);
  if (!sessionId) return null;

  const session = await getSessionByID(sessionId);
  if (!session) return null;

  return await getUserById(session.userId);
}

// 권한 확인 (관리자 여부)
export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role === UserRole.ADMIN;
}

// 인증 필요 라우트 미들웨어
export async function requireAuth(cookies: Cookies): Promise<User> {
  const user = await getCurrentUser(cookies);
  if (!user) {
    return redirect(302, '/login?redirect=' + encodeURIComponent('/'));
  }
  return user;
}

// 관리자 권한 필요 라우트 미들웨어
export async function requireAdmin(cookies: Cookies): Promise<User> {
  const user = await requireAuth(cookies);
  if (user.role !== UserRole.ADMIN) {
    return redirect(302, '/');
  }
  return user;
} 