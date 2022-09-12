import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
export default class ImageTransformer extends AssetTransformer<HTMLImageElement> {
    constructor(loader: Loader);
}
