import * as fs from "fs";
import * as path from "path";
import {Utility} from "../Utility";

/**
 * Runs `prettier --check` over the provided path. Throws an error if failed.
 *
 * If the path is a file, runs check over the file only.
 * If the path is a directory, runs check over all files with extension cjs, css, html, js, json, jsx, less, mjs, ts, tsx.
 *
 * Prettier config is resolved by relying on prettier's internal config resolution.
 *
 * @param fileOrDirectory Path to a file or a directory.
 */
export function check(fileOrDirectory: string): void {
    if (!fs.existsSync(fileOrDirectory)) {
        throw new Error(`Cannot format "${fileOrDirectory}" because it does not exists.`);
    }
    if (fs.statSync(fileOrDirectory).isDirectory()) {
        const quotedGlobPattern = path.join(fileOrDirectory, `"**/*.{cjs,css,html,js,json,jsx,less,mjs,ts,tsx}"`);
        Utility.runCommand("prettier", ["--check", quotedGlobPattern]);
        return;
    }
    if (fs.statSync(fileOrDirectory).isFile()) {
        const file = fileOrDirectory;
        Utility.runCommand("prettier", ["--check", file]);
        return;
    }
    throw new Error(`Cannot format "${fileOrDirectory}" because it is not a file or directory.`);
}
