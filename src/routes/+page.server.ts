export const load = async ({ locals }) => {
    console.log(locals.posts);
    return {
        posts: locals.posts
    }
}