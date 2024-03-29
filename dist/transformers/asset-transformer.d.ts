import { AssemlyParams } from "../assembler";
import Loader from "../load/loader";
import SourceData from "../source-types/source-data";
import Transformer from "./transformer";
export default class AssetTransformer<T> extends Transformer<T> {
    loader: Loader;
    assetFactory: (data: SourceData, loader: Loader, dir: string, property: string, params: AssemlyParams) => Promise<T>;
    constructor(loader: Loader, factory: (data: SourceData, loader: Loader, dir: string, property: string, params: AssemlyParams) => Promise<T>);
    private cleanPath;
    loadAsset(data: SourceData, loader: Loader, dir: string, type?: string): Promise<{
        object?: any;
        text?: string | undefined;
        src?: string | undefined;
    }>;
    process(data: SourceData, dir: string, property: string, params: AssemlyParams): Promise<T>;
}
