import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
import { TransformError } from "./transformer";

export default class TextTransfomer extends AssetTransformer<string | TransformError> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir): Promise<string | TransformError> => {
      try {
        const { text } = await this.loadAsset(data, loader, dir);
        return text!;  
      } catch (e) {
        return {
          ...data,
          error: `Invalid text file: ${data.reference}`,
        }
      }
    });
  }
}
