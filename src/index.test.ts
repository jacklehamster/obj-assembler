import Assembler from "./index"

import { JSDOM } from 'jsdom';

const dom = new JSDOM();
global.Image = dom.window.Image;
global.Audio = dom.window.Audio;
global.location = dom.window.location;

const fetchResult = jest.fn().mockReturnValue({ test: 100 });

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fetchResult()),
    text: () => Promise.resolve(fetchResult()),
  }),
) as jest.Mock;

describe('testing Assembler', () => {
  const assembler = new Assembler();
  test('assembler loading a simple json', async () => {
    const json = { test: { abc: 123 } };
    fetchResult.mockReturnValueOnce(json);

    const objects: Record<string, any> = {};
    const result = await assembler.assemble({
      type: "json",
      src: "dummy_path",
    }, "", "#", objects);
    expect(result.test.abc).toEqual(123);
    expect(objects["#/test/abc"]).toEqual(123);
  });

  test('assembler loading parameterized json', async () => {
    const json = { test: { abc: "{var1}" } };
    fetchResult.mockReturnValueOnce(json);

    const objects: Record<string, any> = {};
    const result = await assembler.assemble({
      type: "json",
      src: "dummy_path2",
      params: { "{var1}": 555 },
    }, "", "#", objects);
    expect(result.test.abc).toEqual(555);
    expect(objects["#/test/abc"]).toEqual(555);
  });

  test('assembler loading text', async () => {
    fetchResult.mockReturnValueOnce("Testing");

    const result = await assembler.assemble({
      type: "text",
      src: "dummy_path3",
    }, "");
    expect(result).toEqual("Testing");
  });

  test('assemling reference', async () => {
    fetchResult.mockReturnValueOnce({
      abc: { xyz: 333 },
      reference: {
        type: "ref",
        src: "#/abc",
      },
    });

    const result = await assembler.assemble({
      type: "json",
      src: "dummy_path4",
    }, "");
    expect(result.reference).toEqual({ xyz: 333 });
  });

  test('assembling csv', async () => {
    fetchResult.mockReturnValueOnce("a,b,c\nd,e,f");

    const result = await assembler.assemble({
      type: "csv",
      src: "dummy_path5",
    }, "");
    expect(result).toEqual([
      ["a", "b", "c"],
      ["d", "e", "f"]
    ]);
  });

});