import SourceData from "../source-types/source-data";
import Transformer from "./transformer";
export default class ReferenceTransformer extends Transformer<any> {
    process(data: SourceData, dir: string, property: string, objects: Record<string, any>): Promise<any>;
}
