import { AssemlyParams } from "../assembler";
import SourceData from "../source-types/source-data";
import Transformer from "./transformer";
import { resolve } from "url";

const REFERENCE_SEARCH_LIMIT = 3000;

export default class ReferenceTransformer extends Transformer<any> {
  async process(data: SourceData, _: string, property: string, params: AssemlyParams): Promise<any> {
    const path = data.reference.startsWith("#") ? data.reference : "#" + resolve(property.substring(1), data.reference);
    const ref: any = await new Promise((resolve) => {
      const start = Date.now();
      function findReference() {
        if (params.objects[path] !== undefined) {
          resolve(params.objects[path]);
        } else if (Date.now() - start < REFERENCE_SEARCH_LIMIT) {
          setTimeout(findReference, 100);
        } else {
          const error = `Unable to find reference for: ${path}`;
          console.warn(error);
          resolve({...data, error});
        }
      }
      findReference();
    });
    return ref;
  }
}
