import { getPermalink } from "$lib/utils.js";
import { getPosts } from "$lib/utils.server";

export function load({ params }) {
    const posts = getPosts();
    // console.log(posts.map(post => post.category.map((category: string) => getPermalink(category.toLowerCase())).join("")).map(item => ({ slug: item })));
    return { posts };
}

export function entries() {
    const posts = getPosts();
    console.log(posts.map(post => post.category.map((category: string) => getPermalink(category.toLowerCase())).join("")).map(item => ({ slug: item.slice(1) })));
    // // console.log(posts.map(post => ({ slug: post.permalink })));
    // return posts.map(post => ({ slug: post.permalink }));

    return posts.map(post => post.category.map((category: string) => getPermalink(category.toLowerCase())).join("")).map(item => ({ slug: item.slice(1) }));
};