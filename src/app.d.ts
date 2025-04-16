/// <reference types="@sveltejs/kit" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			posts: {
				[key: string]: {
					[key: string]: any;
				};
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// gtag 전역 타입 정의
declare function gtag(...args: any[]): void;
declare global {
	interface Window {
		gtag: typeof gtag;
		dataLayer: any[];
	}
}

export {};
