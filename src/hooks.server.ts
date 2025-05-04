import { getPosts } from "./lib/utils.server";

export function handle({ event, resolve }) {
    event.locals.posts = getPosts();

    return resolve(event);
}