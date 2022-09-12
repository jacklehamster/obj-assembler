---------

Usage
---------
The purpose of ObjAssembler is to assemble an object from a series of file, including JSON, image assets, audio assets, text files... all located in some directory structure.

## Transform json

```typescript
import Assembler from "obj-assembler"

const assembler = new Assembler();
assembler.assemble({
  myField: {
    type: "json",
    src: "some-file.json",
  }
});
```
Here, the assembler will load `"some-file.json"` and will replace `myField` with that.

For example of other types of objects that can be loaded, check the demo.


## Custom transfomers

First, register your custom transformer:

```typescript
import Assembler from "obj-assembler"

const assembler = new Assembler();
assembler.register("custom", new CustomTransformer());
```
Your transformer will be able to process an object with type "custom", and will return an appropriate object. Below is an example of CustomTransformer, which just extract a field from data and displays it:

```typescript
class CustomTransfomer implements Transformer<string> {
  async process(data: SourceData, dir: string, property: string, objects: Record<string, any>): Promise<T> {
      return data["field"];
  }
}
```

Then your assembler is able to transform your object chunk:
```typescript
const result = assembler.assemble({ "myObject": { type: "custom", field: 123 } });
console.log(result);  //  { myObject: 123 }
```

In the process method, dir is the directory where the file loaded is located (in case you're loading files), property is the path to the field you're changing, and objects is a hash of objects that are assembled, with `objects["#"]` being the root. Objects are referenced in the format: `objects["#/path/to/object"]`. So in the example above, `objects["#/myObject"] = 123`.

-----
For sample data, see [sample-data.json](../data/sample-data.json).
