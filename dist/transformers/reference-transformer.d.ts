import { AssemlyParams } from "../assembler";
import SourceData from "../source-types/source-data";
import Transformer from "./transformer";
export default class ReferenceTransformer extends Transformer<any> {
    process(data: SourceData, _: string, property: string, params: AssemlyParams): Promise<any>;
}
