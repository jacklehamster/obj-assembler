import { JSDOM } from 'jsdom';
import { Assembler } from './assembler';

const dom = new JSDOM();
global.Image = dom.window.Image;
global.Audio = dom.window.Audio;
global.location = dom.window.location;

const fetch = jest.fn();

describe('testing Assembler', () => {
  beforeEach(() => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ test: 100 }),
      text: () => Promise.resolve({ test: 100 }),
    }));
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  const assembler = new Assembler({ fetch });
  test('assembler loading a simple json', async () => {
    const json = { test: { abc: 123 } };
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve(json),
    }));

    const objects: Record<string, any> = {};
    const result = await assembler.assemble({
      type: "json",
      reference: "dummy_path",
    }, "", "#", {objects, referenceDepth: 0, pendingPromises: []});
    expect(result.test.abc).toEqual(123);
    expect(objects["#/test/abc"]).toEqual(123);
  });

  test('assembler loading a simple json without type', async () => {
    const json = { test: { abc: 123 } };
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve(json),
    }));

    const result = await assembler.assemble({
      ok: true,
      reference: "dummy_path.json",
    });
    expect(result.test.abc).toEqual(123);
  });

  test('assembler loading parameterized json', async () => {
    const json = { test: { abc: "{var1}" } };
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve(json),
    }));

    const objects: Record<string, any> = {};
    const result = await assembler.assemble({
      type: "json",
      reference: "dummy_path2",
      params: { "{var1}": 555 },
    }, "", "#", {objects, referenceDepth: 0, pendingPromises: []});
    expect(result.test.abc).toEqual(555);
    expect(objects["#/test/abc"]).toEqual(555);
  });

  test('assembler loading text', async () => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      text: () => Promise.resolve("Testing"),
    }));

    const result = await assembler.assemble({
      type: "text",
      reference: "dummy_path3",
    }, "");
    expect(result).toEqual("Testing");
  });

  test('assemling reference', async () => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        abc: { xyz: 333 },
        reference: {
          type: "ref",
          reference: "#/abc",
        },
      }),
    }));

    const result = await assembler.assemble({
      type: "json",
      reference: "dummy_path4",
    }, "");
    expect(result.reference).toEqual({ xyz: 333 });
  });


  test('assemling forward reference', async () => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        reference: {
          type: "ref",
          reference: "#/abc",
        },
        abc: { xyz: 333 },
      }),
    }));

    const result = await assembler.assemble({
      type: "json",
      reference: "dummy_path4",
    }, "");
    expect(result.reference).toEqual({ xyz: 333 });
  });

  test('assemling invalid reference', async () => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        reference: {
          type: "ref",
          reference: "#/abc",
        },
      }),
    }));

    const result = await assembler.assemble({
      reference: "dummy_path4.json",
    }, "");
    expect(result.reference.error).toEqual("Unable to find reference for: #/abc");
  });

  test('assembling csv', async () => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      text: () => Promise.resolve("a,b,c\nd,e,f"),
    }));

    const result = await assembler.assemble({
      type: "csv",
      reference: "dummy_path5",
    }, "");
    expect(result).toEqual([
      ["a", "b", "c"],
      ["d", "e", "f"]
    ]);
  });

  test('assemling yaml', async() => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      yaml: () => Promise.resolve({yaml: ["test"]}),
    }));

    const result = await assembler.assemble({
      type: "yaml",
      reference: "dummy_path5",
    }, "");
    expect(result).toEqual({yaml: ["test"]});
  });

    test('assemling yaml text', async() => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      text: () => Promise.resolve(`
        yaml:
        - test
      `),
    }));

    const result = await assembler.assemble({
      type: "yaml",
      reference: "dummy_path5",
    }, "");
    expect(result).toEqual({yaml: ["test"]});
  });

  test('assembler loading circular reference', async () => {
    const json = { reference: "dummy_path.json" };
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve(json),
    }));

    const objects: Record<string, any> = {};
    const result = await assembler.assemble({
      reference: "dummy_path.json",
    }, "", "#", {objects, referenceDepth: 0, pendingPromises: []});
    expect(result.error).toEqual("Reference depth exceeded on #");
  });
});