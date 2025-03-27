import type { Handle } from "@sveltejs/kit";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sequence } from "@sveltejs/kit/hooks";

const getPost: Handle = async ({ event, resolve }) => {
    const postsDirectory = path.join(process.cwd(), 'src/posts');
    const files = fs.readdirSync(postsDirectory);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    const posts = mdFiles.reduce((acc, file) => {
        const filePath = path.join(postsDirectory, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);
        const slug = file.replace('.md', '');
        acc[slug] = {
            ...data,
            date: data.date.toISOString().replace("T", " ").replace("Z", "").replace(".000", "") || '1970-01-01 00:00:00' // date가 없으면 최초 날짜로 설정
        };
        return acc;
    }, {} as { [key: string]: any });

    // date 순으로 정렬
    event.locals.posts = Object.fromEntries(
        Object.entries(posts).sort(([, a], [, b]) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
    );

    return resolve(event);
}

export const handle: Handle = sequence(getPost);