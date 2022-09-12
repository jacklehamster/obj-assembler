import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";

export default class ImageTransformer extends AssetTransformer<HTMLImageElement> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir) => {
      const image = new Image();
      const { src } = await loader.get(`${dir}${data.src}`, data.type);
      if (src) {
        image.src = src;
      }
      return image;
    })
  }
}
