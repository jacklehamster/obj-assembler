export default interface SourceData {
  readonly type?: "json" | "image" | "audio" | "text" | "ref" | "csv" | "yaml" | string;
  readonly reference: string;
  readonly params?: Record<string, any>;
  readonly [key: string]: any;
}