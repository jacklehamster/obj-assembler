import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
export default class AudioTransfomer extends AssetTransformer<HTMLAudioElement> {
    constructor(loader: Loader);
}
