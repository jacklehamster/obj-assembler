import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
export default class TextTransfomer extends AssetTransformer<string | undefined> {
    constructor(loader: Loader);
}
