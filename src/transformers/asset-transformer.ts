import { AssemlyParams } from "../assembler";
import Loader from "../load/loader";
import SourceData from "../source-types/source-data";
import Transformer from "./transformer";

export default class AssetTransformer<T> extends Transformer<T> {
  loader: Loader;
  assetFactory: (data: SourceData, loader: Loader, dir: string, property: string, params: AssemlyParams) => Promise<T>;
  constructor(loader: Loader, factory: (data: SourceData, loader: Loader, dir: string, property: string, params: AssemlyParams) => Promise<T>) {
    super();
    this.loader = loader;
    this.assetFactory = factory;
  }

  private cleanPath(path: string): string {
    return path.split("//").join("/");
  }

  loadAsset(data: SourceData, loader: Loader, dir: string, type?: string) {
    return loader.get(this.cleanPath(`${dir}/${data.reference}`), type ?? data.type);    
  }

  async process(data: SourceData, dir: string, property: string, params: AssemlyParams): Promise<T> {
    return await this.assetFactory(data, this.loader, dir, property, params);
  }
}
