import { getPosts } from '$lib/utils.server.js';

export async function load({ params }) {
    const posts = getPosts();
    const _category = posts.map(post => post.category);

    type CategoryTree = { [key: string]: CategoryTree | number };

    const category: CategoryTree = {};

    for (const arr of _category) {
        let cur = category;
        for (let i = 0; i < arr.length; i++) {
            const key = arr[i];
            if (i === arr.length - 1) {
                if (typeof cur[key] === 'number') {
                    cur[key] = (cur[key] as number) + 1;
                } else {
                    cur[key] = 1;
                }
            } else {
                if (!cur[key] || typeof cur[key] === 'number') {
                    cur[key] = {};
                }
                cur = cur[key] as CategoryTree;
            }
        }
    }

    return {
        category
    }
}