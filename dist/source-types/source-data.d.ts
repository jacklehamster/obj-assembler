export default interface SourceData {
    readonly type: "json" | "image" | "audio" | "text" | "ref" | string;
    readonly src: string;
    readonly params?: Record<string, any>;
    readonly [key: string]: any;
}
