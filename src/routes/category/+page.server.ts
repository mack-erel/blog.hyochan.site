import { getCategoryList } from '$lib/utils.server.ts';

export async function load({ params }) {
    const category = getCategoryList();
    console.log(category);
    return {
        category
    }
}