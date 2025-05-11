import { getPosts } from "./lib/utils.server.ts";

export function handle({ event, resolve }) {
    event.locals.posts = getPosts();

    return resolve(event);
}