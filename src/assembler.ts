import Loader from "./load/loader";
import SourceData from "./source-types/source-data";
import AudioTransfomer from "./transformers/audio-transformer";
import CsvTransformer from "./transformers/csv-transformer";
import ImageTransformer from "./transformers/image-transformer";
import ObjTransformer from "./transformers/json-transformer";
import ReferenceTransformer from "./transformers/reference-transformer";
import TextTransfomer from "./transformers/text-transfomer";
import Transformer from "./transformers/transformer";
import { actualType } from "./utils/extension";
import {yamlFetch} from "yaml-fetch";

type Fetch = typeof yamlFetch | typeof global.fetch;

type RegisteryType = Exclude<SourceData["type"], undefined>;

export default class Assembler {
  private transformers: Map<string, Transformer<any>> = new Map<string, Transformer<any>>();
  private fetch: Fetch;

  constructor({ fetch }: { fetch: Fetch } = { fetch: yamlFetch }) {
    this.fetch = fetch;
    this.initialize();
  }

  register<T>(type: RegisteryType | RegisteryType[], transformer: Transformer<T>) {
    const types = Array.isArray(type) ? type : [type];
    types.forEach(type => this.transformers.set(type, transformer));
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

    if (typeof obj.reference === "string") {
      const path = obj.reference;
      const type: Exclude<SourceData["type"], undefined> = obj.type ?? actualType(path);
  
      const transformer = this.transformers.get(type);
      if (transformer) {
        return objects[property] = await transformer.process(obj, dir, property, objects);
      }
    }
    return objects[property] = obj;
  }

  private initialize() {
    this.transformers.clear();
    const loader: Loader = new Loader({ fetch: this.fetch });
    this.register("image", new ImageTransformer(loader));
    this.register("audio", new AudioTransfomer(loader));
    this.register("text", new TextTransfomer(loader));
    this.register(["json", "yaml"], new ObjTransformer(loader, this));
    this.register("ref", new ReferenceTransformer());
    this.register("csv", new CsvTransformer(loader));
  }
}
