import SourceData from "./source-types/source-data";
import Transformer from "./transformers/transformer";
import { yamlFetch } from "yaml-fetch";
type Fetch = typeof yamlFetch | typeof global.fetch;
type RegisteryType = Exclude<SourceData["type"], undefined>;
export interface AssemlyParams {
    objects: Record<string, any>;
    pendingPromises: Promise<any>[];
    referenceDepth: number;
}
export default class Assembler {
    private transformers;
    private loader;
    constructor({ fetch }?: {
        fetch: Fetch;
    });
    register<T>(type: RegisteryType | RegisteryType[], transformer: Transformer<T>): void;
    clear(): void;
    assemble(obj: any | SourceData, dir?: string | null, property?: string, params?: AssemlyParams): Promise<any>;
    private initialize;
}
export {};
