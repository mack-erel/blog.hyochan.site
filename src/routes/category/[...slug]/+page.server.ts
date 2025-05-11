import { getPermalink } from "$lib/utils.ts";
import { getCategoryList, getPosts } from "$lib/utils.server.ts";

function findCategoryBySlug(categoryTree: any, slugArr: any) {
    let cur = categoryTree;
    let path = [];
    let found = true;
    for (let i = 0; i < slugArr.length; i++) {
        const slug = '/' + slugArr[i];
        let matchedKey = null;
        for (const key of Object.keys(cur)) {
            if (getPermalink(key) === slug) {
                matchedKey = key;
                break;
            }
        }
        if (!matchedKey) {
            found = false;
            break;
        }
        path.push(matchedKey);
        cur = cur[matchedKey];
    }
    return {
        found,
        current: cur,
        path
    };
}

function getCategoryTreeList(obj: any): any[] {
    if (!obj || typeof obj !== 'object') return [];
    return Object.keys(obj).map(key => {
        if (typeof obj[key] === 'object') {
            return {
                name: key,
                children: getCategoryTreeList(obj[key])
            };
        } else {
            return {
                name: key,
                children: []
            };
        }
    });
}

function getFullCategoryTree(category: any, path: string[]): any {
    if (!path.length) return null;
    let cur = category;
    let node = null;
    for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (!cur[key]) break;
        // 마지막 노드면 children까지 붙임, number면 빈 배열
        let children;
        if (i === path.length - 1) {
            if (typeof cur[key] === 'object') {
                children = getCategoryTreeList(cur[key]);
            } else {
                // 마지막 노드가 number(글 개수)면 children: []
                children = [];
            }
        } else {
            children = [];
        }
        node = {
            name: key,
            children
        };
        cur = cur[key];
        if (i !== path.length - 1) {
            node = {
                name: key,
                children: [node]
            };
        }
    }
    // path를 역순으로 감싸기
    for (let i = path.length - 2; i >= 0; i--) {
        node = {
            name: path[i],
            children: [node]
        };
    }
    return node;
}

export function load({ params }) {
    const slugArr = typeof params.slug === 'string' ? params.slug.split('/').filter(Boolean) : [];
    const category = getCategoryList();
    const { found, current, path } = findCategoryBySlug(category, slugArr);

    let tree = null;
    if (path.length) {
        tree = getFullCategoryTree(category, path);
    } else if (slugArr.length === 1) {
        // slug가 하나만 들어왔는데 path가 비어있으면(최상위 leaf)
        tree = { name: slugArr[0], children: [] };
    }

    // 최하위 leaf(글 개수만 있는 경우)도 트리로 반환
    if (!tree && slugArr.length) {
        tree = { name: slugArr[slugArr.length - 1], children: [] };
    }

    return {
        found,
        currentCategory: current,
        path,
        slug: slugArr,
        tree
    };
}

export function entries() {
    const posts = getPosts();
    console.log(posts.map(post => post.category.map((category: string) => getPermalink(category.toLowerCase())).join(""))
        .map(item => ({ slug: item.slice(1) })));
    return posts.map(post => post.category.map((category: string) => getPermalink(category.toLowerCase())).join(""))
        .map(item => ({ slug: item.slice(1) }));
};