import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
export default class CsvTransformer extends AssetTransformer<string[][] | undefined> {
    constructor(loader: Loader);
}
