import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";

export default class AudioTransfomer extends AssetTransformer<HTMLAudioElement> {
  constructor(loader: Loader) {
    super(loader, async (data, loader, dir) => {
      const audio = new Audio();
      const { src } = await loader.get(`${dir}${data.src}`, data.type);
      if (src) {
        audio.src = src;
      }
      return audio;
    })
  }
}
