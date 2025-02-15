import {PrettierUtil, TaskRunner, Utility} from "@pinnacle0/devtool-util";
import fs from "fs";
import {copySync as fsExtraCopySync} from "fs-extra";
import path from "path";

const FilePath = {
    project: path.join(__dirname, ".."),
    config: path.join(__dirname, "../config"),
    build: path.join(__dirname, "../build"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),

    jestConfig: path.join(__dirname, "../config/jest.config.ts"),
    tsConfigForSrc: path.join(__dirname, "../config/tsconfig.src.json"),
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectReadMe: path.join(__dirname, "../README.md"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
    buildPackageJSON: path.join(__dirname, "../build/package.json"),
    buildReadMe: path.join(__dirname, "../build/README.md"),
    buildLicense: path.join(__dirname, "../build/LICENSE.md"),
};

new TaskRunner("build").execute([
    {
        name: "prettier",
        skipInFastMode: true,
        execute: () => {
            PrettierUtil.check(FilePath.config);
            PrettierUtil.check(FilePath.script);
            PrettierUtil.check(FilePath.src);
            PrettierUtil.check(FilePath.test);
        },
    },
    {
        name: "eslint",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", FilePath.src]);
            Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", FilePath.test]);
        },
    },
    {
        name: "stylelint",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("stylelint", [path.join(FilePath.src, "**/*.{css,less}")]);
            Utility.runCommand("stylelint", [path.join(FilePath.test, "**/*.{css,less}")]);
        },
    },
    {
        name: "unit test",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("jest", ["--config", FilePath.jestConfig, "--bail"]);
        },
    },
    {
        name: "prepare build directory",
        execute: () => {
            Utility.prepareEmptyDirectory(FilePath.build);
        },
    },
    {
        name: "compile with tsc",
        execute: () => {
            Utility.runCommand("tsc", ["--project", FilePath.tsConfigForSrc]);
        },
    },
    {
        name: "copy assets to build directory",
        execute: () => {
            const print = Utility.createConsoleLogger("build");
            const supportedExtensions = [".less", ".css", ".json", ".jpg", ".png", ".gif", ".mp3", ".mp4", ".wmv"];
            fsExtraCopySync(FilePath.src, FilePath.build, {
                filter: source => {
                    const extension = path.extname(source);
                    // source may be a directory or a file under the directory.
                    if (fs.statSync(source).isDirectory()) {
                        return true;
                    } else if (supportedExtensions.includes(extension)) {
                        print.info(`Asset (${extension}) copied from "${path.relative(FilePath.src, source)}"`);
                        return true;
                    } else {
                        if (extension !== ".tsx" && extension !== ".ts") {
                            print.error(`Asset (${extension}) is unsupported, skipped "${path.relative(FilePath.src, source)}"`);
                        }
                        return false;
                    }
                },
                dereference: true,
            });
        },
    },
    {
        name: "copy package.json, markdown files",
        execute: () => {
            fs.copyFileSync(FilePath.projectPackageJSON, FilePath.buildPackageJSON);
            fs.copyFileSync(FilePath.projectReadMe, FilePath.buildReadMe);
            fs.copyFileSync(FilePath.projectLicense, FilePath.buildLicense);
        },
    },
]);
