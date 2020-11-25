import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import type webpack from "webpack";

interface TerserPluginOptions {
    sourceMap: boolean;
}

/**
 * Applies Terser to minimize javascript
 * after bundles/chunks are built.
 */
export function terserPlugin({sourceMap}: TerserPluginOptions): webpack.WebpackPluginInstance {
    return new TerserWebpackPlugin({
        terserOptions: {
            sourceMap,
        },
    });
}

/**
 * Provides fast refresh for react (formerly known as hot reloading) during development.
 * Should not be used in production. Uses the package "react-refresh" under the hood.
 * Using "react-refresh" relies on the babel plugin "react-refresh/plugin" to inject
 * custom code during compilation, so "babel-loader" and "@babel/core" is needed.
 *
 * @see https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/103d0a889dd58c0ea1bbd072d443bd18d760f6aa/examples/typescript-without-babel/webpack.config.js#L21
 * @see https://github.com/facebook/react/issues/16604#issuecomment-528663101
 */
export function reactRefreshWebpackPlugin(): webpack.WebpackPluginInstance {
    return new ReactRefreshWebpackPlugin();
}
