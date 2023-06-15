import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
import { TransformError } from "./transformer";
export default class AudioTransfomer extends AssetTransformer<HTMLAudioElement | TransformError> {
    constructor(loader: Loader);
}
