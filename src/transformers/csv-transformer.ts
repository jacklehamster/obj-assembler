import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";

export default class CsvTransformer extends AssetTransformer<string[][] | undefined> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir): Promise<string[][] | undefined> => {
      const { text } = await loader.get(`${dir}${data.reference}`, "text");
      return text?.split("\n").filter(line => line.length).map(line => line.trim().split(","));
    });
  }
}
