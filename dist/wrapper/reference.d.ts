import SourceData from "../source-types/source-data";
declare enum State {
    LINKED = "LINKED",
    INVALID = "INVALID"
}
export default class Reference {
    private readonly path;
    private readonly objects;
    constructor(sourceData: SourceData, property: string, objects: Record<string, any>);
    get ref(): any;
    toJSON(): {
        path: string;
        state: State;
    };
}
export {};
