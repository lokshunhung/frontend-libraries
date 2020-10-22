import path from "path";
import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {workspaceRootDirectory, projectDirectory} = pathMap;

export default function format() {
    const relativePath = path.relative(workspaceRootDirectory, projectDirectory);
    runCommand(workspaceRootDirectory)(
        String.raw`yarn \
        workspace:prettier \
        --config prettier.config.js \
        --ignore-path .prettierignore \
        --write \
        "${relativePath}/**/*.{less,js,json,jsx,ts,tsx}"`
    );
}
