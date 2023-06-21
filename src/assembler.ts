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

const MAX_DEPTH = 1000;

export interface AssemlyParams {
  objects: Record<string, any>;
  pendingPromises: Promise<any>[];
  referenceDepth: number;
}

export class Assembler {
  private transformers: Map<string, Transformer<any>> = new Map<string, Transformer<any>>();
  private loader: Loader;

  constructor({ fetch }: { fetch: Fetch } = { fetch: yamlFetch }) {
    this.loader = new Loader({ fetch });
    this.initialize();
  }

  register<T>(type: RegisteryType | RegisteryType[], transformer: Transformer<T>) {
    const types = Array.isArray(type) ? type : [type];
    types.forEach(type => this.transformers.set(type, transformer));
  }

  clear() {
    this.initialize();
  }

  async load(path: string): Promise<any> {
    const result = await this.loader.get(path, undefined);
    if (result.text) {
      return result.text;
    }
    if (typeof(result.object) === "object") {
      const split = path.split("/");
      split.pop();
      const dir = split.join("/");
      return await this.assemble(result.object, dir);
    }
    return result.object;
  }

  async assemble(obj: any | SourceData, dir: string | null = null, property: string = "#", params?: AssemlyParams) {
    const init = !params;
    if (!params) {
      params = { objects: {}, pendingPromises: [], referenceDepth: 0 };
    }

    if (dir === null) {
      dir = global.location.href;
    }
    
    if (params.referenceDepth > MAX_DEPTH) {
      const error = `Reference depth exceeded on ${property}`;
      console.warn(error);
      return {...obj, error};
    }
    if (typeof (obj) !== 'object' || !obj) {
      return params.objects[property] = obj;
    }

    if (Array.isArray(obj)) {
      obj.forEach((value, index, array) => {
        params?.pendingPromises?.push(
          this.assemble(value, dir, `${property}/${index}`, params).then(result => array[index] = result)
        )
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        params?.pendingPromises?.push(        
          this.assemble(value, dir, `${property}/${key}`, params).then(result => obj[key] = result)
        )
      });
    }

    params.objects[property] = obj;
    if (typeof obj.reference === "string") {
      const path = obj.reference;
      const type: Exclude<SourceData["type"], undefined> = obj.type ?? actualType(path);
  
      const transformer = this.transformers.get(type);
      if (transformer) {
        params.objects[property] = await transformer.process(obj, dir, property, params);
      }
    }

    if (init) {
      await Promise.all(params.pendingPromises);
      this.loader.clear();
    }
    return params.objects[property];
  }

  private initialize() {
    this.loader.clear();
    this.transformers.clear();
    this.register("image", new ImageTransformer(this.loader));
    this.register("audio", new AudioTransfomer(this.loader));
    this.register("text", new TextTransfomer(this.loader));
    this.register(["json", "yaml", "yml"], new ObjTransformer(this.loader, this));
    this.register("ref", new ReferenceTransformer());
    this.register("csv", new CsvTransformer(this.loader));
  }
}
