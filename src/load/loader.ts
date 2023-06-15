import SourceData from "../source-types/source-data";
import { resolve } from "url";
import { actualType } from "../utils/extension";
import {yamlFetch} from "yaml-fetch";
const yaml = require('js-yaml');

type SourceType = SourceData["type"];

type FetcherResponse = Response & {
  yaml?(): Promise<any>;
}

type Result = {
  object?: any;
  text?: string;
  src?: string;
}

interface CacheResult extends Result {
  pendingLoads: Set<(result: CacheResult) => void>;
  loaded: boolean;
}

export default class Loader {
  private cache: Record<string, CacheResult> = {};
  private fetch?: typeof yamlFetch | typeof global.fetch;

  constructor({ fetch }: { fetch: typeof yamlFetch | typeof global.fetch } = { fetch: yamlFetch }) {
    this.fetch = fetch;
  }

  async get(path: string, type: SourceType): Promise<Result> {
    const fixedPath = resolve(location.href, path);
    if (this.cache[fixedPath]) {
      if (this.cache[fixedPath].loaded) {
        return this.cache[fixedPath];
      } else {
        return new Promise(resolve => this.cache[fixedPath].pendingLoads.add(resolve));
      }
    }
    const theType: Exclude<SourceType, undefined> = type ?? actualType(fixedPath);
    const cacheResult: CacheResult = this.cache[fixedPath] = { pendingLoads: new Set(), loaded: false };

    switch (theType) {
      case "image":
      case "audio":
        const blob = await this.load(fixedPath, response => response.blob());
        cacheResult.src = URL.createObjectURL(blob);
        break;
      case "json":
        cacheResult.object = await this.load(fixedPath, response => response.json());
        break;
      case "yaml":
        cacheResult.object = await this.load(fixedPath, response => (response.yaml?.() ?? response.text().then(text => yaml.load(text))));
        break;
      case "text":
      default:
        cacheResult.text = await this.load(fixedPath, response => response.text());
        break;
    }
    cacheResult.loaded = true;
    cacheResult.pendingLoads.forEach(pendingLoad => pendingLoad(cacheResult));
    return cacheResult;
  }

  private async load<T>(path: string, transform: (response: FetcherResponse) => Promise<T>): Promise<T> {
    const response = await this.fetch!(path);
    if (!response.ok) {
      throw new Error(`Invalid response: ${response.status}`);
    }
    return await transform(response);
  }

  clear() {
    Object.values(this.cache).forEach(cacheResult => {
      if (cacheResult.src) {
        URL.revokeObjectURL(cacheResult.src);
      }
    });
    Object.keys(this.cache).forEach(key => delete this.cache[key]);
  }
}