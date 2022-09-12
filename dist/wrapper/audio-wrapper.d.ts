import AssetWrapper from "./asset-wrapper";
export default class AudioWrapper extends AssetWrapper<HTMLAudioElement> {
    createAsset(): HTMLAudioElement;
    waitReady(asset: HTMLAudioElement): Promise<void>;
}
