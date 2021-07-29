import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

/**
 * Handles dependency requests to image assets (".png", ".jpeg", ".jpg", ".gif")
 * by inlining as images as DataURL,
 * or emitting as separate files if file size is too large.
 *
 * @see https://webpack.js.org/guides/asset-modules/
 */
export function imageRule(): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".png", ".jpeg", ".jpg", ".gif"),
        type: "asset",
        generator: {
            filename: "static/img/[name][hash:8][ext][query]",
        },
        parser: {
            dataUrlCondition: {
                maxSize: 1024,
            },
        },
    };
}
