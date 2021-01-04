export interface WebIconFontGeneratorOptions {
    iconComponentDirectory: string;
    staticDirectory: string;
    // TODO: provide default template (ref UB/web/shared), then remove
    templateDirectory: string;
    // TODO: below really useful?
    cssURL?: string;
    // TODO/dion: do not remove this now, i will check again
    fontFamily?: string;
}

export interface AppIconFontGeneratorOptions {
    iconComponentDirectory: string;
    androidFontPath: string;
    iosFontPath: string;
    // TODO: can provide default template?
    templateDirectory: string;
    // TODO: below really useful?
    cssURL?: string;
}
