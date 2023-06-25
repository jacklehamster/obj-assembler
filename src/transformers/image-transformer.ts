import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
import { TransformError } from "./transformer";

export default class ImageTransformer extends AssetTransformer<HTMLImageElement | TransformError> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir) => {
      try {
        const image = new Image() as HTMLImageElement & { toJSON: () => any };;
        const { src } = await this.loadAsset(data, loader, dir);
        if (src) {
          image.src = src;
          image.toJSON = () => ({
            type: "image", src,
          });
        }
        return image;  
      } catch (e) {
        return {
          ...data,
          error: `Invalid image: ${data.reference}`,
        };
      }
    })
  }
}
