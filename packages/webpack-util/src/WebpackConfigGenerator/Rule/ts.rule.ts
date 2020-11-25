import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    tsconfigFilepath: string;
}

/**
 * Handles dependency requests to typescript files by compiling with `tsc`.
 *
 * @see https://github.com/TypeStrong/ts-loader
 */
export function tsRule({tsconfigFilepath}: Deps): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".ts", ".tsx"),
        use: [
            {
                loader: require.resolve("ts-loader"),
                options: {
                    colors: false,
                    configFile: tsconfigFilepath,
                    compilerOptions: {
                        module: "esnext",
                        target: "es5",
                    },
                },
            },
        ],
    };
}

/**
 * Handles dependency requests to typescript files by compiling with `tsc`.
 * And injects code for "react-refresh" to work properly with babel.
 * Should not be used in production.
 *
 * See ts.plugin.ts#reactRefreshWebpackPlugin for a more detailed description.
 */
export function tsRuleForDevelopment({tsconfigFilepath}: Deps): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".ts", ".tsx"),
        use: [
            {
                loader: require.resolve("babel-loader"),
                options: {
                    plugins: [
                        [require.resolve("react-refresh/babel")], //
                    ],
                },
            },
            {
                loader: require.resolve("ts-loader"),
                options: {
                    colors: false,
                    configFile: tsconfigFilepath,
                    compilerOptions: {
                        module: "esnext",
                        target: "es5",
                    },
                },
            },
        ],
    };
}
