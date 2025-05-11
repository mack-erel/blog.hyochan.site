import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getPermalink } from "./utils.ts";

export function getPosts() {
    const posts: any[] = [];

    const rootDir = process.cwd();
    const postsDir = path.join(rootDir, "src/posts");

    const files = fs.readdirSync(postsDir);
    const temp: { permalink: string; date: string; data: any }[] = [];

    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const _content = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(_content);

        let _title = data.title.replace(/\(([^)]*?)\)/g, "");
        let seriesIndex = null;
        if (data?.series) {
            const match = _title.match(new RegExp(`^\\[${data.series} #(\\d+)\\] `));
            if (match) {
                seriesIndex = parseInt(match[1], 10);
                _title = _title.replace(new RegExp(`^\\[${data.series} #\\d+\\] `), "");
            }
        }

        // 한글 유니코드 포함, normalize로 조합형 정리
        const permalink = getPermalink(_title);

        temp.push({
            permalink,
            date: data.date,
            data: { ...data, withOutSeries: _title, seriesIndex, content }
        });
    }

    // date 기준 오름차순 정렬
    temp.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 중복 permalink 처리
    const permalinkCount: { [key: string]: number } = {};
    for (const post of temp) {
        const key = post.permalink as string;
        if (!permalinkCount[key]) {
            permalinkCount[key] = 1;
            post.data.permalink = key;
        } else {
            permalinkCount[key]++;
            post.data.permalink = `${key}-${permalinkCount[key]}`;
        }
        posts.push(post.data);
    }

    return posts;
}

export type CategoryTree = { [key: string]: CategoryTree | number };

export function getCategoryList() {
    const posts = getPosts();
    const _category = posts.map(post => post.category);
    const category: CategoryTree = {};

    for (const arr of _category) {
        let cur = category;
        for (let i = 0; i < arr.length; i++) {
            const key = arr[i];
            if (i === arr.length - 1) {
                if (typeof cur[key] === 'number') {
                    cur[key] = (cur[key] as number) + 1;
                } else {
                    cur[key] = 1;
                }
            } else {
                if (!cur[key] || typeof cur[key] === 'number') {
                    cur[key] = {};
                }
                cur = cur[key] as CategoryTree;
            }
        }
    }
    return moveDeprecatedLast(category);
}

function moveDeprecatedLast(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;

    const keys = Object.keys(obj);
    const normalKeys = keys.filter(k => k !== 'Deprecated');
    const result: any = {};

    // 일반 키 먼저
    for (const key of normalKeys) {
        result[key] = moveDeprecatedLast(obj[key]);
    }
    // Deprecated 키 마지막에
    if (keys.includes('Deprecated')) {
        result['Deprecated'] = moveDeprecatedLast(obj['Deprecated']);
    }
    return result;
}