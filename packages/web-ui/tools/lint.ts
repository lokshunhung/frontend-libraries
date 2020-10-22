import path from "path";
import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {workspaceRootDirectory, projectDirectory} = pathMap;

export default function lint() {
    const relativePath = path.relative(workspaceRootDirectory, projectDirectory);
    runCommand(workspaceRootDirectory)(
        String.raw`yarn \
        workspace:eslint \
        --config .eslintrc.js \
        --ignore-path .eslintignore \
        --ext .js,.jsx,.ts,.tsx \
        "${relativePath}"`
    );
}
