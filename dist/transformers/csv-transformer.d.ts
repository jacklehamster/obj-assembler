import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
import { TransformError } from "./transformer";
export default class CsvTransformer extends AssetTransformer<string[][] | TransformError> {
    constructor(loader: Loader);
}
