declare module "@parcel/core" {
    export default class Parcel {
        constructor(options: object);

        watch(cb?: (err?: Error | null | undefined, buildEvent?: any) => any): Promise<import("@parcel/types").AsyncSubscription>;

        run(): Promise<any>;
    }
}

declare module "@parcel/fs" {
    export interface FileSystem {}
    export class NodeFS implements FileSystem {}
}

declare module "@parcel/package-manager" {
    export interface PackageManager {}
    export class NodePackageManager implements PackageManager {
        constructor(fs: import("@parcel/fs").FileSystem, installer?: any);
    }
}

declare module "@parcel/types" {
    export type FilePath = string;
    export type SemverRange = string;
    export type ModuleSpecifier = string;
    export type HMROptions = {port?: number; host?: string; [_: string]: unknown};
    export type BuildMode = "development" | "production" | string;
    export type LogLevel = "none" | "error" | "warn" | "info" | "verbose";
    export type InitialServerOptions = {
        publicUrl?: string;
        host?: string;
        port: number;
        https?: HTTPSOptions | boolean;
    };
    export type HTTPSOptions = {cert: FilePath; key: FilePath};
    export type ResolvedParcelConfigFile = {[_: string]: any};
    export type Engines = {
        browsers?: string | Array<string>;
        electron?: SemverRange;
        node?: SemverRange;
        parcel?: SemverRange;
        [_: string]: any;
    };

    export type InitialParcelOptions = {
        entries?: FilePath | Array<FilePath>;
        rootDir?: FilePath; // TODO: Renamed to `entryRoot` at HEAD
        // entryRoot?: FilePath;
        config?: ResolvedParcelConfigFile; // TODO: Changed to type `ModuleSpecifier` at HEAD
        // config?: ModuleSpecifier;
        defaultConfig?: ResolvedParcelConfigFile; // TODO: Changed to type `ModuleSpecifier` at HEAD
        // defaultConfig?: ModuleSpecifier;
        env?: {[key: string]: string | void};
        targets?: Array<string> | {[_: string]: any} | null | undefined;

        disableCache?: boolean;
        cacheDir?: FilePath;
        killWorkers?: boolean;
        mode?: BuildMode;
        scopeHoist?: boolean;
        sourceMaps?: boolean;
        publicUrl?: string;
        distDir?: FilePath;
        hot?: HMROptions | null | undefined;
        contentHash?: boolean;
        serve?: InitialServerOptions | false;
        autoinstall?: boolean;
        logLevel?: LogLevel;
        profile?: boolean;
        patchConsole?: boolean;

        inputFS?: import("@parcel/fs").FileSystem;
        outputFS?: import("@parcel/fs").FileSystem;
        workerFarm?: any;
        packageManager?: import("@parcel/package-manager").PackageManager;
        defaultEngines?: Engines;
        detailedReport?: number | boolean;
    };

    export interface AsyncSubscription {
        unsubscribe(): Promise<any>;
    }
}
