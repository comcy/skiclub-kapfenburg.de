/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  // Strips a trailing ".js" from our own relative imports (source uses
  // Node-ESM-style ".js" specifiers pointing at compiled output; ts-jest
  // needs the bare specifier to resolve the .ts file instead). Written with
  // doubled backslashes so the *string* actually contains "\." — a single
  // backslash before a plain character is dropped by JS string literal
  // parsing, silently turning "\." into an unescaped "." (= "any character")
  // once Jest compiles it into a RegExp. That bug made this also match e.g.
  // dependencies' internal "./util.cjs" imports, breaking any test that
  // transitively pulls one in.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }]
  }
};
