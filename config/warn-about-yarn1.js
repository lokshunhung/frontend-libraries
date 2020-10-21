#!/usr/bin/env node

/**
 * This script is copied from yarnpkg/berry github.
 * It should be consumed by ".yarnrc" (without .yml extension) only.
 * See: https://github.com/yarnpkg/berry/blob/f1b67c460b2723442c06a9a23542328f87e27953/scripts/warn-about-yarn1.js
 */

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, no-console -- copied */

const {execSync} = require(`child_process`);

console.log(`Your global Yarn binary isn't recent enough; please upgrade to 1.17.2 or higher.`);

let info;
try {
    if (process.platform === `win32`) {
        info = `Binary: ${execSync(`where yarn`).toString().trim()} (${execSync(`yarn --version`).toString().trim()})`;
    } else {
        info = `Binary: ${execSync(`which yarn`).toString().trim()} (${execSync(`yarn --version`).toString().trim()})`;
    }
} catch (error) {
    info = null;
}

if (info !== null) console.log(info);

process.exitCode = 1;
