export class SmartPunctuation {
  public static REGEX = /[\u2018\u2019\u201C\u201D]/g;
  public static mappedCharacters = {
    "\u2018": "'",
    "\u201B": "'",
    "\u2019": "'",
    "\u2032": "'",
    "\u2035": "'",
    "\u201C": '"',
    "\u201D": '"',
    "\u201F": '"',
    "\u2033": '"',
    "\u2036": '"',
    "\u2013": "-",
    "\u2014": "-",
  } as const;

  public static sanitizeKeys<D extends Record<string, any>>(
    data: D,
    keys: Set<keyof D>,
  ) {
    const result = {} as D;
    for (const key in data) {
      if (typeof data[key] === "string" && keys.has(key)) {
        // @ts-ignore
        result[key] = this.sanitizeInput(data[key]);
      } else {
        result[key] = data[key];
      }
    }
    return result;
  }

  public static sanitizeInput(str: string) {
    let output = "";
    const map = this.coerceMap();
    for (const char of str) {
      if (char in map) {
        output += map[char];
      } else {
        output += char;
      }
    }
    return output;
  }

  private static coerceMap() {
    return this.mappedCharacters as unknown as Record<string, string>;
  }
}
