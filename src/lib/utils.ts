import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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