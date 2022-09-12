import SourceData from "../source-types/source-data";
declare type SourceType = SourceData["type"];
declare type Result = {
    json?: any;
    text?: string;
    src?: string;
};
export default class Loader {
    private cache;
    get(path: string, type: SourceType): Promise<Result>;
    private load;
}
export {};
