import Loader from "./load/loader";
import SourceData from "./source-types/source-data";
import AudioTransfomer from "./transformers/audio-transformer";
import CsvTransformer from "./transformers/csv-transformer";
import ImageTransformer from "./transformers/image-transformer";
import JSONTransformer from "./transformers/json-transformer";
import ReferenceTransformer from "./transformers/reference-transformer";
import TextTransfomer from "./transformers/text-transfomer";
import Transformer from "./transformers/transformer";

export default class Assembler {
  private transformers: Map<string, Transformer<any>> = new Map<string, Transformer<any>>();

  constructor() {
    this.initialize();
  }

  register<T>(type: SourceData["type"], transformer: Transformer<T>) {
    this.transformers.set(type, transformer);
  }

  clear() {
    this.initialize();
  }

  async assemble(obj: any | SourceData, dir: string | null = null, property: string = "#", objects: Record<string, any> = {}) {
    if (dir === null) {
      dir = location.href;
    }
    if (typeof (obj) !== 'object' || !obj) {
      return objects[property] = obj;
    }
    if (Array.isArray(obj)) {
      obj.forEach((value, index, array) => {
        this.assemble(value, dir, `${property}/${index}`, objects).then(result => array[index] = result);
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        this.assemble(value, dir, `${property}/${key}`, objects).then(result => obj[key] = result);
      });
    }

    if (obj.type && obj.src) {
      const transformer = this.transformers.get(obj.type);
      if (transformer) {
        return objects[property] = await transformer.process(obj, dir, property, objects);
      }
    }
    return objects[property] = obj;
  }

  private initialize() {
    this.transformers.clear();
    const loader: Loader = new Loader();
    this.register("image", new ImageTransformer(loader));
    this.register("audio", new AudioTransfomer(loader));
    this.register("text", new TextTransfomer(loader));
    this.register("json", new JSONTransformer(loader, this));
    this.register("ref", new ReferenceTransformer());
    this.register("csv", new CsvTransformer(loader));
  }
}
