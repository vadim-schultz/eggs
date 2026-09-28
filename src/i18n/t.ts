import { strings } from "./strings.de";

export function t(key: keyof typeof strings): string {
  return strings[key];
}
