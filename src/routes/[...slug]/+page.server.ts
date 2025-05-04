// import matter from "gray-matter";
// import { marked } from 'marked';
// import fs from "fs";
// import path from "path";
// import { error, redirect } from '@sveltejs/kit';

import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/utils';

export function load({ params, locals }) {
    // console.log(locals.posts);
    // console.log(params.slug);

    const post = locals.posts.find(post => post.permalink === params.slug);
    if (!post)
        return error(404, "Not found");

    console.log(post);

    return { post };
}

export function entries() {
    const posts = getPosts();
    console.log(posts.map(post => ({ slug: post.permalink })));
    return posts.map(post => ({ slug: post.permalink }));
};