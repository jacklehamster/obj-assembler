import SourceData from "./source-types/source-data";
import Transformer from "./transformers/transformer";
export default class Assembler {
    private transformers;
    constructor();
    register<T>(type: SourceData["type"], transformer: Transformer<T>): void;
    clear(): void;
    assemble(obj: any | SourceData, dir?: string | null, property?: string, objects?: Record<string, any>): Promise<any>;
    private initialize;
}
