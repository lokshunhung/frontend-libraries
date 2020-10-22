import path from "path";
import {runCommand} from "../src/util";

const workspaceRootDirectory = path.join(__dirname, "../../..");
const projectDirectory = path.join(__dirname, "..");

export default function checkFormat() {
    const relativePath = path.relative(workspaceRootDirectory, projectDirectory);
    runCommand(workspaceRootDirectory)(
        String.raw`yarn \
        workspace:prettier \
        --config prettier.config.js \
        --ignore-path .prettierignore \
        --check \
        "${relativePath}/**/*.ts"`
    );
}
