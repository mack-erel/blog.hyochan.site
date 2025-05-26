import type { User } from './user';

// 댓글 타입 정의
export interface Comment {
	id: number;
	content: string;
	createdAt: string;
	updatedAt: string;
	postId: number;
	userId: number;
	author: User;
} 