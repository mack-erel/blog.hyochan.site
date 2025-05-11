// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			posts: {
				uid: string;
				title: string;
				description?: string;
				date: string;
				updated?: string;
				category: string[];
				tags: string[];
				thumbnail?: string;
				series?: string;
				permalink: string;
				content: string;
				withOutSeries?: string;
				seriesIndex?: number;
				"ai-generated"?: boolean;
			}[];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
