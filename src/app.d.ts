// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, User } from '@auth/core/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession?: () => Promise<Session | null>;
			auth: () => Promise<Session | null>;
			supabase?: any;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
