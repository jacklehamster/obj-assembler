import { Assembler } from "../assembler";
import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";
export default class ObjTransformer extends AssetTransformer<any> {
    constructor(loader: Loader, assembler: Assembler);
    private paramsReplacement;
}
