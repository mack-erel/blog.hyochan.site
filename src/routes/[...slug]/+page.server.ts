// import matter from "gray-matter";
import { marked } from 'marked';
// import fs from "fs";
// import path from "path";
// import { error, redirect } from '@sveltejs/kit';

import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/utils.server';

export function load({ params, locals }) {
    const post = locals.posts.find(item => item.permalink === "/" + params.slug);
    if (!post)
        return error(404, "Not found");

    const series = locals.posts
        .filter(item => item.series === post.series)
        .map(item => ({
            seriesIndex: item.seriesIndex,
            title: item.withOutSeries,
            permalink: item.permalink,
        }));

    const content = marked(post.content);

    return { post, content, series };
}

export function entries() {
    const posts = getPosts();
    // console.log(posts.map(post => ({ slug: post.permalink })));
    return posts.map(post => ({ slug: post.permalink.slice(1) }));
};