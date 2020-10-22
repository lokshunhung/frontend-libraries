import path from "path";
import {createPrint, runCommand} from "../src/util";
import checkFormat from "./check-format";

const print = createPrint("build");

const projectDirectory = path.join(__dirname, "..");

export default function build() {
    print.task("Check code style");
    checkFormat();

    print.task("Compiling...");
    runCommand(projectDirectory)(
        String.raw`yarn \
        workspace:tsc --project tsconfig.json`
    );

    print.info("Build successful");
}
