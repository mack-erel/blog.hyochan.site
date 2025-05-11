import { getPosts } from "$lib/utils.server.ts";

export function load() {
    let posts = getPosts();
    posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    // console.log(posts);
    return { posts };
}