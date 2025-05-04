import matter from "gray-matter";
import fs from "fs";
import path from "path";

import { getPosts } from "./lib/utils";

export function handle({ event, resolve }) {
    event.locals.posts = getPosts();

    return resolve(event);
}