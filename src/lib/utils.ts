import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getPosts() {
	const posts: any[] = [];

	const rootDir = process.cwd();
	const postsDir = path.join(rootDir, "src/posts");

	const files = fs.readdirSync(postsDir);
	const temp: { permalink: string; date: string; data: any }[] = [];

	for (const file of files) {
		const filePath = path.join(postsDir, file);
		const content = fs.readFileSync(filePath, "utf8");
		const { data } = matter(content);

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
		let permalink = _title
			.normalize("NFC")
			.replace(/ /g, "-")
			.toLowerCase()
			.replace(/-+/g, "-")
			.replace(/[^\p{Script=Hangul}a-z0-9-]/gu, "")
			.replace(/^-+|-+$/g, "");

		temp.push({
			permalink,
			date: data.date,
			data: { ...data, withOutSeries: _title, seriesIndex }
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