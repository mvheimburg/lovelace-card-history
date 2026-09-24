import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
// The History card, bundled with Lit, for HACS. The library in dist/ (tsc) is
// what other cards bundle themselves.
export default {
  input: "src/card/history-card.ts",
  output: { file: "dist/lovelace-card-history.js", format: "es", sourcemap: false },
  plugins: [
    resolve({ browser: true }),
    typescript({ tsconfig: "./tsconfig.json", include: ["src/**/*.ts"], compilerOptions: { declaration: false, sourceMap: false } }),
  ],
};
