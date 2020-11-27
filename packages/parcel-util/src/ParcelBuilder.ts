import Parcel from "@parcel/core";
import type {FileSystem} from "@parcel/fs";
import {NodeFS} from "@parcel/fs";
import type {PackageManager} from "@parcel/package-manager";
import {NodePackageManager} from "@parcel/package-manager";
import type {InitialParcelOptions} from "@parcel/types";

interface ParcelBuilderOptions extends Omit<InitialParcelOptions, "packageManager"> {}

export class ParcelBuilder {
    private readonly fs: FileSystem;
    private readonly packageManager: PackageManager;
    private readonly parcel: Parcel;

    private isExiting = false;

    constructor(options: ParcelBuilderOptions) {
        this.fs = new NodeFS();
        this.packageManager = new NodePackageManager(this.fs);
        this.parcel = new Parcel({
            packageManager: this.packageManager,
            ...options,
        });
    }

    run() {
        this.parcel
            .run()
            .then(() => this.exit())
            .catch(err => {
                // eslint-disable-next-line @typescript-eslint/no-var-requires -- Wip
                if (!(err instanceof require("@parcel/core").BuildError)) {
                    console.error("Unexpected error during parcel building:");
                    console.error(err);
                }
                return this.exit(1);
            });
    }

    private async exit(exitCode: number = 0) {
        if (this.isExiting) {
            return;
        }
        this.isExiting = true;
        process.exit(exitCode);
    }
}
