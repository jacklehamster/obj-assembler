import SourceData from "../source-types/source-data";
import { resolve } from "url";

type SourceType = SourceData["type"];

type Result = {
  json?: any;
  text?: string;
  src?: string;
}

interface CacheResult extends Result {
  pendingLoads: Set<(result: CacheResult) => void>;
  loaded: boolean;
}

export default class Loader {
  private cache: Record<string, CacheResult> = {};

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

    switch (type) {
      case "text":
        this.cache[fixedPath].text = await this.load(fixedPath, response => response.text());
        break;
      case "image":
      case "audio":
        const blob = await this.load(fixedPath, response => response.blob());
        this.cache[fixedPath].src = URL.createObjectURL(blob);
        break;
      default:
        this.cache[fixedPath].json = await this.load(fixedPath, response => response.json());
    }
    this.cache[fixedPath].loaded = true;
    return this.cache[fixedPath];
  }

  private async load<T>(path: string, transform: (response: Response) => Promise<T>): Promise<T> {
    const response = await fetch(path);
    return await transform(response);
  }
}