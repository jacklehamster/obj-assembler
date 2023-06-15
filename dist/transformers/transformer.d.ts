import { AssemlyParams } from "../assembler";
import SourceData from "../source-types/source-data";
export default abstract class Transformer<T> {
    abstract process(data: SourceData, dir: string, property: string, params: AssemlyParams): Promise<T>;
}
