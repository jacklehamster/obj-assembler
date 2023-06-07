import SourceData from "./source-types/source-data";
import Transformer from "./transformers/transformer";
import { yamlFetch } from "yaml-fetch";
type Fetch = typeof yamlFetch | typeof global.fetch;
type RegisteryType = Exclude<SourceData["type"], undefined>;
export default class Assembler {
    private transformers;
    private fetch;
    constructor({ fetch }?: {
        fetch: Fetch;
    });
    register<T>(type: RegisteryType | RegisteryType[], transformer: Transformer<T>): void;
    clear(): void;
    assemble(obj: any | SourceData, dir?: string | null, property?: string, objects?: Record<string, any>): Promise<any>;
    private initialize;
}
export {};
