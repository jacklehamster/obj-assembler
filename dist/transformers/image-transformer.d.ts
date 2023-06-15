import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
import { TransformError } from "./transformer";
export default class ImageTransformer extends AssetTransformer<HTMLImageElement | TransformError> {
    constructor(loader: Loader);
}
