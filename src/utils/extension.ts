import SourceData from "../source-types/source-data";

function strEndsWith(str: string, suffix: string): boolean {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function actualType(path: string) {
    const actualType: Exclude<SourceData["type"], undefined> =
    strEndsWith(path, ".json") ? "json"
      : strEndsWith(path, ".png") || strEndsWith(path, ".jpg") || strEndsWith(path, ".jpeg") ? "image"
      : strEndsWith(path, ".mp3") ? "audio"
      : strEndsWith(path, ".csv") ? "csv"
      : strEndsWith(path, ".yaml") || strEndsWith(path, ".yml") ? "yaml"
      : "text";
    return actualType;
}