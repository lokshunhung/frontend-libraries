import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {projectDirectory} = pathMap;

export default function lint() {
    runCommand(projectDirectory)(
        String.raw`yarn \
        workspace:eslint \
        --config .eslintrc.js \
        --ext .js,.jsx,.ts,.tsx \
        .`
    );
}
