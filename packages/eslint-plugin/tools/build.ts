import fs from "fs-extra";
import yargs from "yargs";
import {pathMap} from "../config/path-map";
import checkFormat from "./check-format";
import lint from "./lint";
import {createPrint, runCommand} from "./util";

const {projectDirectory, distDirectory, configDirectory} = pathMap;

const print = createPrint("build.ts");

export default function build() {
    const isFastMode = yargs.argv.mode === "fast";
    if (isFastMode) {
        print.info("Fast mode enabled, skipping format checking and testing");
    } else {
        print.task("Check code style");
        checkFormat();

        print.task("Check lint");
        lint();

        print.task("Run tests");
        runCommand(projectDirectory)(
            String.raw`yarn \
            workspace:jest \
            --config "${configDirectory}/jest.config.js" \
            --runInBand`
        );
    }
    {
        print.task("Cleaning dist directory");
        if (fs.existsSync(distDirectory) && fs.statSync(distDirectory).isDirectory()) {
            fs.removeSync(distDirectory);
        }
    }
    {
        print.task("Compiling...");
        runCommand(projectDirectory)(
            String.raw`yarn \
            parcel build src/index.ts \
            --no-autoinstall`
        );
    }
    print.info("Finishing...");
}
