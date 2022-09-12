import AssetWrapper from "./asset-wrapper";
export default class ImageWrapper extends AssetWrapper<HTMLImageElement> {
    createAsset(): HTMLImageElement;
    waitReady(asset: HTMLImageElement): Promise<void>;
}
