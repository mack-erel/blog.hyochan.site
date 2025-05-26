import { db } from '$lib/server/db';
import { blogPost, blogComment, user } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { User } from './auth';

export type BlogPost = typeof blogPost.$inferSelect;
export type NewBlogPost = typeof blogPost.$inferInsert;
export type BlogComment = typeof blogComment.$inferSelect & {
  author?: {
    username: string;
    id: number;
  }
};
export type NewBlogComment = typeof blogComment.$inferInsert;

// Blog Post CRUD
export async function getAllPosts() {
  return await db.select().from(blogPost).orderBy(desc(blogPost.createdAt));
}

export async function getPostById(id: number) {
  const posts = await db.select().from(blogPost).where(eq(blogPost.id, id));
  return posts[0] || null;
}

export async function createPost(post: NewBlogPost, user: User) {
  // 작성자 ID 설정
  const postWithAuthor = {
    ...post,
    authorId: user.id
  };
  
  const result = await db.insert(blogPost).values(postWithAuthor).returning();
  return result[0];
}

export async function updatePost(id: number, post: Partial<NewBlogPost>, user: User) {
  // 관리자나 글 작성자만 수정 가능
  const existingPost = await getPostById(id);
  if (!existingPost) throw new Error('포스트를 찾을 수 없습니다');
  
  if (existingPost.authorId !== user.id && user.role !== 'admin') {
    throw new Error('포스트를 수정할 권한이 없습니다');
  }
  
  const result = await db
    .update(blogPost)
    .set({ ...post, updatedAt: new Date().toISOString() })
    .where(eq(blogPost.id, id))
    .returning();
  return result[0];
}

export async function deletePost(id: number, user: User) {
  // 관리자나 글 작성자만 삭제 가능
  const existingPost = await getPostById(id);
  if (!existingPost) throw new Error('포스트를 찾을 수 없습니다');
  
  if (existingPost.authorId !== user.id && user.role !== 'admin') {
    throw new Error('포스트를 삭제할 권한이 없습니다');
  }
  
  // Delete associated comments first
  await db.delete(blogComment).where(eq(blogComment.postId, id));
  // Then delete the post
  return await db.delete(blogPost).where(eq(blogPost.id, id));
}

// Blog Comment CRUD
export async function getCommentsByPostId(postId: number) {
  // 댓글 조회 시 작성자 정보도 함께 가져오기
  const comments = await db
    .select({
      id: blogComment.id,
      content: blogComment.content,
      createdAt: blogComment.createdAt,
      authorId: blogComment.authorId,
      postId: blogComment.postId,
      author: {
        id: user.id,
        username: user.username
      }
    })
    .from(blogComment)
    .leftJoin(user, eq(blogComment.authorId, user.id))
    .where(eq(blogComment.postId, postId))
    .orderBy(blogComment.createdAt);
    
  return comments;
}

export async function createComment(comment: NewBlogComment, user: User | null) {
  // 로그인한 사용자면 작성자 ID 설정
  const commentWithAuthor = {
    ...comment,
    authorId: user ? user.id : undefined
  };
  
  const result = await db.insert(blogComment).values(commentWithAuthor).returning();
  return result[0];
}

export async function deleteComment(id: number, user: User | null) {
  // 관리자, 댓글 작성자, 또는 해당 게시물의 작성자만 삭제 가능
  if (!user) throw new Error('댓글을 삭제할 권한이 없습니다');
  
  const comments = await db.select().from(blogComment).where(eq(blogComment.id, id));
  const comment = comments[0];
  
  if (!comment) throw new Error('댓글을 찾을 수 없습니다');
  
  // 관리자는 모든 댓글 삭제 가능
  if (user.role === 'admin') {
    return await db.delete(blogComment).where(eq(blogComment.id, id));
  }
  
  // 본인이 작성한 댓글만 삭제 가능
  if (comment.authorId && comment.authorId === user.id) {
    return await db.delete(blogComment).where(eq(blogComment.id, id));
  }
  
  // 글 작성자는 모든 댓글 삭제 가능
  if (comment.postId) {
    const post = await getPostById(Number(comment.postId));
    if (post && post.authorId === user.id) {
      return await db.delete(blogComment).where(eq(blogComment.id, id));
    }
  }
  
  throw new Error('댓글을 삭제할 권한이 없습니다');
} 