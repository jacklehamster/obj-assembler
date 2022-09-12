import Loader from "../load/loader";
import SourceData from "../source-types/source-data";
import Transformer from "./transformer";

export default class AssetTransformer<T> extends Transformer<T> {
  loader: Loader;
  assetFactory: (data: SourceData, loader: Loader, dir: string, property: string, objects: Record<string, any>) => Promise<T>;
  constructor(loader: Loader, factory: (data: SourceData, loader: Loader, dir: string, property: string, objects: Record<string, any>) => Promise<T>) {
    super();
    this.loader = loader;
    this.assetFactory = factory;
  }

  async process(data: SourceData, dir: string, property: string, objects: Record<string, any>): Promise<T> {
    return await this.assetFactory(data, this.loader, dir, property, objects);
  }
}
