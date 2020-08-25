import { reduce, map, filter } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { safeLoad } from 'js-yaml';
import { readdirSync } from "fs";

import { Story } from "./Story";
import { join, resolve } from "path";
import { readFileSync } from "fs";

const stringToStory = (content: string) =>
    safeLoad(content) as Story;

export const readStoryFromFile = (filename: string): Story =>
    pipe(
        readFileSync(filename, { encoding: 'UTF-8' }),
        stringToStory
    )

export const readStoriesFromFolder = (folder_name: string): Story[] =>
    pipe(
        readdirSync(folder_name),
        map(filename => resolve(join(folder_name, filename))),
        filter(filename => filename.toUpperCase().endsWith(".YML") || filename.toUpperCase().endsWith(".YAML")),
        map(readStoryFromFile)
    )
