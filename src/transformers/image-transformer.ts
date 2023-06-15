import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";

export default class ImageTransformer extends AssetTransformer<HTMLImageElement> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir) => {
      const image = new Image() as HTMLImageElement & { toJSON: () => any };;
      const { src } = await loader.get(`${dir}${data.reference}`, data.type);
      if (src) {
        image.src = src;
        image.toJSON = () => ({
          type: "image", src,
        });
      }
      return image;
    })
  }
}
