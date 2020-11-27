import Parcel from "@parcel/core";
import type {FileSystem} from "@parcel/fs";
import {NodeFS} from "@parcel/fs";
import type {PackageManager} from "@parcel/package-manager";
import {NodePackageManager} from "@parcel/package-manager";
import type {InitialParcelOptions} from "@parcel/types";

interface ParcelServerStarterOptions extends Omit<InitialParcelOptions, "packageManager"> {}

export class ParcelServerStarter {
    private readonly fs: FileSystem;
    private readonly packageManager: PackageManager;
    private readonly parcel: Parcel;

    private unsubscribe?: () => Promise<any>;
    private isExiting = false;

    constructor(options: ParcelServerStarterOptions) {
        this.fs = new NodeFS();
        this.packageManager = new NodePackageManager(this.fs);
        this.parcel = new Parcel({
            packageManager: this.packageManager,
            ...options,
        });
    }

    run() {
        this.parcel
            .watch((err, buildEvent) => {
                if (err) {
                    throw err;
                }
            })
            .then(_ => {
                this.unsubscribe = _.unsubscribe;
            });
        process.stdin.on("end", this.exit);
        process.on("SIGINT", this.exit);
        process.on("SIGTERM", this.exit);
    }

    private async exit(exitCode: number = 0) {
        if (this.isExiting) {
            return;
        }
        this.isExiting = true;
        if (this.unsubscribe !== undefined) {
            await this.unsubscribe();
        }
        process.exit(exitCode);
    }
}
