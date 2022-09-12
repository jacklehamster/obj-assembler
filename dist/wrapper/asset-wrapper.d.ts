import Loader from "../load/loader";
import SourceData from "../source-types/source-data";
interface Asset {
    src: string;
    addEventListener(event: string, callback: () => void): void;
}
export default class AssetWrapper<T extends Asset> {
    private readonly sourceData;
    private state?;
    asset: T;
    constructor(sourceData: SourceData, loader: Loader, asset: T, readyEvent: string);
    waitReady(asset: T, readyEvent: string): Promise<void>;
    toJSON(): {
        state: "LOADING" | "READY" | undefined;
        type: string;
        src: string;
        params?: Record<string, any> | undefined;
    };
}
export {};
