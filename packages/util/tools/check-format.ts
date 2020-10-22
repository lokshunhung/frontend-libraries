import path from "path";
import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {workspaceRootDirectory, projectDirectory} = pathMap;

export default function checkFormat() {
    const relativePath = path.relative(workspaceRootDirectory, projectDirectory);
    runCommand(workspaceRootDirectory)(
        String.raw`yarn \
        workspace:prettier \
        --config prettier.config.js \
        --ignore-path .prettierignore \
        --check \
        "${relativePath}/**/*.{js,json,jsx,ts,tsx}"`
    );
}
