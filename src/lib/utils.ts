import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import removeMd from "remove-markdown";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getPermalink(title: string) {
	return "/" + title
		.normalize("NFC")
		.replace(/ /g, "-")
		.toLowerCase()
		.replace(/-+/g, "-")
		.replace(/[^\p{Script=Hangul}a-z0-9-]/gu, "")
		.replace(/^-+|-+$/g, "");
}

export function getStructuredData({ routeId, pathname, post, head_title, head_description }: { routeId: string, pathname: string, post: any, head_title: string, head_description: string }) {
	if (routeId === "/") {
		return [
			{
				"@context": "https://schema.org",
				"@type": "WebSite",
				"name": "ㅂㄹㄱ",
				"url": "https://blog.hyochan.site",
				"description": "개발자의 일상을 담은 블로그",
				"publisher": {
					"@type": "Organization",
					"name": "ㅂㄹㄱ",
					"logo": {
						"@type": "ImageObject",
						"url": "https://blog.hyochan.site/favicon.png"
					}
				},
				"sameAs": [
					"https://github.com/mack-erel",
					"mailto:jang@hyochan.site"
				],
				"inLanguage": "ko",
				"potentialAction": {
					"@type": "SearchAction",
					"target": "https://blog.hyochan.site/search?q={search_term_string}",
					"query-input": "required name=search_term_string"
				}
			},
			{
				"@context": "https://schema.org",
				"@type": "WebPage",
				"name": "ㅂㄹㄱ",
				"url": "https://blog.hyochan.site",
				"description": "개발자의 일상을 담은 블로그",
				"mainEntity": {
					"@type": "WebSite",
					"@id": "https://blog.hyochan.site"
				},
				"inLanguage": "ko"
			}
		];
	}
	if (routeId?.startsWith("/about")) {
		return [{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "About | ㅂㄹㄱ",
			"url": "https://blog.hyochan.site/about",
			"description": "저에 대한 소개와 함께 블로그 소개를 정리해보았어요."
		}];
	}
	if (routeId?.startsWith("/category")) {
		return [{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "Category | ㅂㄹㄱ",
			"url": "https://blog.hyochan.site" + pathname,
			"description": "이 블로그에 게시된 글들의 카테고리를 정리해보았어요."
		}];
	}
	if (routeId?.startsWith("/tags")) {
		return [{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "Tags | ㅂㄹㄱ",
			"url": "https://blog.hyochan.site" + pathname,
			"description": "이 블로그에 게시된 글들의 태그를 정리해보았어요."
		}];
	}
	if (routeId?.startsWith("/search")) {
		return [{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "Search | ㅂㄹㄱ",
			"url": "https://blog.hyochan.site" + pathname,
			"description": "블로그에서 필요한 정보가 있다면 검색해보세요! 결과를 보여줄게요."
		}];
	}
	if (routeId?.startsWith("/[...slug]") && post) {
		return [{
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			"headline": head_title,
			"description": head_description,
			"datePublished": post.date,
			"dateModified": post.updated || post.date,
			"author": {
				"@type": "Person",
				"name": "hyochan"
			},
			"publisher": {
				"@type": "Organization",
				"name": "ㅂㄹㄱ",
				"logo": {
					"@type": "ImageObject",
					"url": "https://blog.hyochan.site/favicon.png"
				}
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://blog.hyochan.site" + pathname
			},
			"image": post.thumbnail || "https://blog.hyochan.site/og-image.png",
			"articleBody": post.content ? removeMd(post.content).slice(0, 400) : "",
			"keywords": Array.isArray(post.tags) ? post.tags.join(", ") : "",
			"articleSection": Array.isArray(post.category) ? post.category.join(", ") : ""
		}];
	}
	return [];
}