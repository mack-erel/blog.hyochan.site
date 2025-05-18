import { getCategoryList } from '$lib/utils.server.ts';

export async function load({ params }) {
    const category = getCategoryList();
    return {
        category
    }
}