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
    this.cache[fixedPath] = { pendingLoads: new Set(), loaded: false };

    const theType: Exclude<SourceType, undefined> = type ?? actualType(fixedPath);

    switch (theType) {
      case "image":
      case "audio":
        const blob = await this.load(fixedPath, response => response.blob());
        this.cache[fixedPath].src = URL.createObjectURL(blob);
        break;
      case "json":
        this.cache[fixedPath].object = await this.load(fixedPath, response => response.json());
        break;
      case "yaml":
        this.cache[fixedPath].object = await this.load(fixedPath, response => (response.yaml?.() ?? response.text().then(text => yaml.load(text))));
        break;
      case "text":
      default:
        this.cache[fixedPath].text = await this.load(fixedPath, response => response.text());
        break;
    }
    this.cache[fixedPath].loaded = true;
    return this.cache[fixedPath];
  }

  private async load<T>(path: string, transform: (response: FetcherResponse) => Promise<T>): Promise<T> {
    const response = await this.fetch!(path);
    return await transform(response);
  }
}