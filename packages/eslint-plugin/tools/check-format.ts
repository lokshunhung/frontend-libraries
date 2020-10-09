import * as path from "path";
import {paths} from "./paths";
import {runCommand} from "./run-command";

const {workspaceRootDirectory, configDirectory, srcDirectory, testDirectory, toolsDirectory} = paths;

export default function checkFormat() {
    runCommand(
        String.raw`yarn run prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --list-different \
        "${configDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --list-different \
        "${srcDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --list-different \
        "${testDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --list-different \
        "${toolsDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
}
