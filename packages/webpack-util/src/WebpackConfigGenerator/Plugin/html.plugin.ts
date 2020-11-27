import HTMLWebpackPlugin from "html-webpack-plugin";
import ScriptExtHTMLWebpackPlugin from "script-ext-html-webpack-plugin";
import type webpack from "webpack";
import type {HTMLEntryDescriptor, WebpackConfigGeneratorSerializableType} from "../../type";

interface HTMLPluginOptions {
    entry: HTMLEntryDescriptor;
}

/**
 * Creates a html file from a template with <script> and <link> injected
 * with the respective hashed output filenames.
 */
export function htmlPlugin({entry}: HTMLPluginOptions): webpack.WebpackPluginInstance {
    const options: HTMLWebpackPlugin.Options = {
        template: entry.htmlPath,
        filename: `${entry.name}.html`,
        chunks: [entry.name],
        minify: {
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            includeAutoGeneratedTags: false,
            keepClosingSlash: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeTagWhitespace: true,
            useShortDoctype: true,
        },
    };
    const plugin = new HTMLWebpackPlugin(options);
    return Object.defineProperty(plugin, "toWebpackConfigGeneratorSerializableType", {
        value: (): WebpackConfigGeneratorSerializableType => ({
            "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall",
            pluginName: "HTMLWebpackPlugin",
            pluginOptions: options,
        }),
    });
}

/**
 * Adds attributes to `<script>` tag inside html file generated by
 * HTMLWebpackPlugin. Used to add `crossorigin="anonymous"`.
 */
export function crossOriginScriptTagPlugin(): webpack.WebpackPluginInstance {
    const options: ScriptExtHTMLWebpackPlugin.Options = {
        custom: {
            test: /\.js$/,
            attribute: "crossorigin",
            value: "anonymous",
        },
    };
    const plugin = new ScriptExtHTMLWebpackPlugin(options);
    return Object.defineProperty(plugin, "toWebpackConfigGeneratorSerializableType", {
        value: (): WebpackConfigGeneratorSerializableType => ({
            "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall",
            pluginName: "ScriptExtHTMLWebpackPlugin",
            pluginOptions: options,
        }),
    });
}
