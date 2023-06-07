import SourceData from "../source-types/source-data";
import Transformer from "./transformer";
import { resolve } from "url";

export default class ReferenceTransformer extends Transformer<any> {
  async process(data: SourceData, dir: string, property: string, objects: Record<string, any>): Promise<any> {
    const path = data.reference.startsWith("#") ? data.reference : "#" + resolve(property.substring(1), data.reference);
    const ref: any = await new Promise(resolve => {
      function findReference() {
        if (objects[path] !== undefined) {
          resolve(objects[path]);
        } else {
          requestAnimationFrame(findReference);
        }
      }
      findReference();
    });
    return ref;
  }
}
