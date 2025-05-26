import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// 사용자 역할 열거형
export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
	GUEST = 'guest'
}

export const user = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	email: text('email').notNull().unique(),
	role: text('role', { enum: ['admin', 'user', 'guest'] }).notNull().default('user'),
	createdAt: text('created_at').notNull().default(String(new Date().toISOString()))
});

export const authSession = sqliteTable('auth_session', {
	id: text('id').primaryKey(),
	userId: integer('user_id').references(() => user.id).notNull(),
	expiresAt: text('expires_at').notNull()
});

export const blogPost = sqliteTable('blog_post', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	content: text('content').notNull(),
	category: text('category'),
	createdAt: text('created_at').notNull().default(String(new Date().toISOString())),
	updatedAt: text('updated_at').notNull().default(String(new Date().toISOString())),
	authorId: integer('author_id').references(() => user.id)
});

export const blogComment = sqliteTable('blog_comment', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	content: text('content').notNull(),
	createdAt: text('created_at').notNull().default(String(new Date().toISOString())),
	authorId: integer('author_id').references(() => user.id),
	postId: integer('post_id').references(() => blogPost.id)
});
