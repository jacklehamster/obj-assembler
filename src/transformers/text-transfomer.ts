import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
import { TransformError } from "./transformer";

export default class TextTransfomer extends AssetTransformer<string | TransformError> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir): Promise<string | TransformError> => {
      try {
        const { text } = await loader.get(`${dir}${data.reference}`, data.type);
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
