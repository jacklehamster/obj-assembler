import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
import { TransformError } from "./transformer";

export default class AudioTransfomer extends AssetTransformer<HTMLAudioElement | TransformError> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir): Promise<HTMLAudioElement | TransformError> => {
      try {
        const audio = new Audio() as HTMLAudioElement & { toJSON: () => any };
        const { src } = await loader.get(`${dir}${data.reference}`, data.type);
        if (src) {
          audio.src = src;
          audio.toJSON = () => ({
            type: "audio", src,
          });
        }
        return audio;  
      } catch (e) {
        return {
          ...data,
          error: `Invalid audio: ${data.reference}`,
        };
      }
    })
  }
}
