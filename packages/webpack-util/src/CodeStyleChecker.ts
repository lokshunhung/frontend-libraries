// @ts-ignore -- devtool-util/src/index.d.ts is not found inside the monorepo, so typescript reports an error.
import {PrettierUtil, Utility} from "@pinnacle0/devtool-util";
import path from "path";
import {InternalCheckerOptions} from "./type";

const print = Utility.createConsoleLogger("CodeStyleChecker");

export class CodeStyleChecker {
    private readonly checkableSrcDirectories: [string, ...string[]];

    constructor({projectDirectory, extraCheckDirectories = []}: InternalCheckerOptions) {
        this.checkableSrcDirectories = [path.join(projectDirectory, "src")];
        for (const directory of extraCheckDirectories) {
            this.checkableSrcDirectories.push(path.join(directory, "src"));
        }
    }

    run() {
        this.checkPrettier();
        this.checkESLint();
        this.checkStylelint();
    }

    private checkPrettier() {
        print.task(`Running \`prettier --check\` on "src/"`);
        for (const srcDirectory of this.checkableSrcDirectories) {
            PrettierUtil.check(srcDirectory);
        }
    }

    private checkESLint() {
        print.task(`Running \`eslint\` on "src/"`);
        for (const srcDirectory of this.checkableSrcDirectories) {
            Utility.runCommand("eslint", ["--no-error-on-unmatched-pattern", "--max-warnings=1", "--ext=.js,.jsx,.ts,.tsx", srcDirectory]);
        }
    }

    private checkStylelint() {
        print.task(`Running \`stylelint\` on "src/"`);
        for (const srcDirectory of this.checkableSrcDirectories) {
            Utility.runCommand("stylelint", ["--allow-empty-input", "--max-warnings=1", path.join(srcDirectory, "**/*.{css,less}")]);
        }
    }
}
