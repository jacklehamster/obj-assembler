import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";

export default class TextTransfomer extends AssetTransformer<string | undefined> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir): Promise<string | undefined> => {
      const { text } = await loader.get(`${dir}${data.reference}`, data.type);
      return text;
    });
  }
}
