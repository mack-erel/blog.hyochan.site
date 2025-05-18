import { getCategoryList } from '$lib/utils.server.ts';
import { getPosts } from "$lib/utils.server.ts";
export async function load({ params }) {
    const category = getCategoryList();
    let posts = getPosts();
    posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
        category,
        posts
    }
}