import SourceData from "../source-types/source-data";

export default abstract class Transformer<T> {
  abstract process(data: SourceData, dir: string, property: string, objects: Record<string, any>): Promise<T>;
}
