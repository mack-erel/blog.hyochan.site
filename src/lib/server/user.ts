// 사용자 역할 타입
export type UserRole = 'user' | 'admin';

// 사용자 타입 정의
export interface User {
	id: number;
	username: string;
	email: string;
	role: UserRole;
	createdAt: string;
} 