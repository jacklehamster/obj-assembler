import SourceData from "./source-types/source-data";
import Transformer from "./transformers/transformer";
import { yamlFetch } from "yaml-fetch";
declare type Fetch = typeof yamlFetch | typeof global.fetch;
declare type RegisteryType = Exclude<SourceData["type"], undefined>;
export interface AssemlyParams {
    objects: Record<string, any>;
    pendingPromises: Promise<any>[];
    referenceDepth: number;
}
export declare class Assembler {
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
