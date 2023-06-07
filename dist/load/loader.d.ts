import SourceData from "../source-types/source-data";
import { yamlFetch } from "yaml-fetch";
type SourceType = SourceData["type"];
type Result = {
    object?: any;
    text?: string;
    src?: string;
};
export default class Loader {
    private cache;
    private fetch?;
    constructor({ fetch }?: {
        fetch: typeof yamlFetch | typeof global.fetch;
    });
    get(path: string, type: SourceType): Promise<Result>;
    private load;
}
export {};
