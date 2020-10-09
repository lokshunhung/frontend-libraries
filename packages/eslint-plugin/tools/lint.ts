import * as path from "path";
import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {workspaceRootDirectory, projectDirectory, srcDirectory, testDirectory, toolsDirectory} = pathMap;

export default function lint() {
    runCommand(
        String.raw`yarn run \
        --cwd="${projectDirectory}" \
        eslint \
        --config ${(path.join(projectDirectory), ".eslintrc.js")} \
        --ignore-path ${(path.join(workspaceRootDirectory), ".eslintignore")} \
        --ext .js,.jsx,.ts,.tsx \
        "${srcDirectory}"`
    );
    runCommand(
        String.raw`yarn run \
        --cwd="${projectDirectory}" \
        eslint \
        --config ${(path.join(projectDirectory), ".eslintrc.js")} \
        --ignore-path ${(path.join(workspaceRootDirectory), ".eslintignore")} \
        --ext .js,.jsx,.ts,.tsx \
        "${testDirectory}"`
    );
    runCommand(
        String.raw`yarn run \
        --cwd="${projectDirectory}" \
        eslint \
        --config ${(path.join(projectDirectory), ".eslintrc.js")} \
        --ignore-path ${(path.join(workspaceRootDirectory), ".eslintignore")} \
        --ext .js,.jsx,.ts,.tsx \
        "${toolsDirectory}"`
    );
}
