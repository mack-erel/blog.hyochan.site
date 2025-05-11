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

    //

    return {
        category: moveDeprecatedLast(category)
    }
}

function moveDeprecatedLast(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;

    const keys = Object.keys(obj);
    const normalKeys = keys.filter(k => k !== 'Deprecated');
    const result: any = {};

    // 일반 키 먼저
    for (const key of normalKeys) {
        result[key] = moveDeprecatedLast(obj[key]);
    }
    // Deprecated 키 마지막에
    if (keys.includes('Deprecated')) {
        result['Deprecated'] = moveDeprecatedLast(obj['Deprecated']);
    }
    return result;
}