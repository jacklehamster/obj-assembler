import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
import { TransformError } from "./transformer";

export default class CsvTransformer extends AssetTransformer<string[][] | TransformError> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir): Promise<string[][] | TransformError> => {
      try {
        const { text } = await this.loadAsset(data, loader, dir, "text");
        return text!.split("\n").filter(line => line.length).map(line => line.trim().split(","));  
      } catch(e) {
        return {
          ...data,
          error: `Invalid csv: ${data.reference}`,
        };
      }
    });
  }
}
