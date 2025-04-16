import { isPreview } from "$env/static/private"

export function load() {
    return {
        isPreview
    };
}

export const prerender = true;