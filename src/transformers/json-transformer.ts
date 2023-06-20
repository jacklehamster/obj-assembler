import {Assembler} from "../assembler";
import Loader from "../load/loader";
import AssetTransformer from "./asset-transformer";

export default class ObjTransformer extends AssetTransformer<any> {
  constructor(loader: Loader, assembler: Assembler) {
    super(loader, async (data, loader, dir, property, params) => {
      try {
        const { object } = await loader.get(`${dir}/${data.reference}`, data.type);
        const replacedObject = this.paramsReplacement(object, data?.params);
        return await assembler.assemble(replacedObject, dir, property, {...params, referenceDepth: params.referenceDepth + 1});
      } catch (e) {
        return {
          ...data,
          error: `Invalid object: ${data.reference}`,
        }
      }
    });
  }

  private paramsReplacement(obj: any, params?: Record<string, any>): any {
    if (!params) {
      return obj;
    }
    if (typeof (obj) === "string" && typeof (params[obj]) !== "undefined") {
      return params[obj];
    }
    if (typeof (obj) !== 'object' || !obj) {
      return obj;
    }
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = this.paramsReplacement(obj[i], params);
      }
    } else {
      for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
          obj[i] = this.paramsReplacement(obj[i], params);
        }
      }
    }
    return obj;
  }
}
