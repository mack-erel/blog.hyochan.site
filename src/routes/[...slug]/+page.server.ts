import matter from "gray-matter";
import { marked } from 'marked';
import fs from "fs";
import path from "path";
import { error, redirect } from '@sveltejs/kit';

export async function load({ params }) {
    const { slug } = params;
    const rootDir = process.cwd();
    const postsDir = path.join(rootDir, "src/posts");

    const slugParts = slug.split('/');
    const lastPart = slugParts[slugParts.length - 1];

    const isDatePath = /^\d{4}\/\d{2}\/\d{2}\/.*$/.test(slug);

    const filePath = path.join(postsDir, `${lastPart}.md`);

    if (!fs.existsSync(filePath))
        throw error(404, 'Post not found');

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    if (!data.date)
        throw error(404, 'Post not found');

    const correctDatePath = data.date.toISOString().split("T")[0].replace(/-/g, "/");

    if (isDatePath) {
        const datePath = slugParts.slice(0, 3).join('/');
        if (datePath !== correctDatePath)
            throw error(404, 'Post not found');
    } else
        throw redirect(301, `/${correctDatePath}/${encodeURIComponent(lastPart)}`);

    // 시리즈 네비게이션용 데이터 추가
    let seriesList = [];
    if (data.series) {
        // 모든 .md 파일에서 같은 series를 가진 글만 추출
        const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
        seriesList = files.map(file => {
            const filePath = path.join(postsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data: fm } = matter(fileContent);
            if (fm.deploy === false) return null;
            if (!fm.series || fm.series !== data.series) return null;
            const slug = path.parse(file).name;
            let fullSlug = slug;
            if (fm.date) {
                const datePath = fm.date.toISOString().split("T")[0].replace(/-/g, "/");
                fullSlug = `${datePath}/${slug}`;
            }
            return {
                slug: fullSlug,
                title: fm.title,
                date: fm.date ? new Date(fm.date) : null,
                series: fm.series
            };
        }).filter(Boolean)
        .sort((a, b) => a.date - b.date);
    }

    return {
        slug,
        content: marked(content),
        subject: data.title,
        description: data.description,
        date: data.date.toISOString().replace("T", " ").replace("Z", "").replace(".000", ""),
        updated: data.updated?.toISOString().replace("T", " ").replace("Z", "").replace(".000", ""),
        data,
        seriesList
    };
}

export function entries() {
    const rootDir = process.cwd();
    const postsDir = path.join(rootDir, "src/posts");

    // 모든 .md 파일 가져오기
    const files = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'));

    const entries = [];

    for (const file of files) {
        // 파일 내용 읽기
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);

        // deploy가 false인 경우 건너뛰기
        if (data.deploy === false) continue;

        // 파일명에서 확장자 제거
        const slug = path.parse(file).name;

        // date가 있으면 날짜 기반 경로 추가
        if (data.date) {
            const correctDatePath = data.date.toISOString().split("T")[0].replace(/-/g, "/");

            // 날짜가 있는 경로 추가
            entries.push({
                slug: `${correctDatePath}/${slug}`
            });
        }

        // 날짜가 없는 경로도 추가
        entries.push({ slug });
    }

    return entries;
}