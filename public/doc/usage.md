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

## Other Built-in transformers

ObjAssembler doesn't just load JSON. It also lets you load text files, images, sounds...

### Image

```json
{
  "type": "image",
  "src": "../assets/dobuki.png"
}
```
This loads a png into the object as Image.

### Audio

```json
{
  "type": "audio",
  "src": "../assets/beepbop.mp3"
}
```
This loads an mp3 as Audio

### Text

```json
{
  "type": "text",
  "src": "sample-text.txt"
}
```
This will read the text file and turn that into a string.

### Grid

```json
{
    "type": "csv",
    "src": "resource/grid.csv"
}
```
This loads the csv into a grid, which is a double array of string.

### JSON with params

```json
{
    "type": "json",
    "src": "data-with-params.json",
    "params": {
      "$param1": 123,
      "$param2": "testing",
      "{alsoParam}": true
    }
}
```
You can pass parameters through `params`. This will cause ObjAssembler to traverse the JSON and replace all values matching the key in params. In the example above, every value in the form "$param1" will be replaced with the number 123. This only replaces values, not keys.

### Reference

You can use this to generate reference to itself within the JSON.

```json
{
   "fieldA": [123, 456],
   "fieldB": {
      "type": "ref",
      "src": "#/fieldA"
   },
   "fieldC": {
      "type": "ref",
      "src": "../fieldA"
   }
}
```
In this example, both "fieldB" and "fieldC" point to the array contained in "fieldA". Those are direct reference, so if you modify the array content of fieldA, both fieldB and fieldC will change. However, if fieldA was a primitive value (like a number or a string), modifying fieldA would not cause fieldB and fieldC to change.

*Note: ObjAssembler generates an object that might not be serializable.*

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
