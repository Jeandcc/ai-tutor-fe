import preval from "next-plugin-preval";
import resolveConfig from "tailwindcss/resolveConfig";
import { Config } from "tailwindcss";

import tailwindConfig from "../../tailwind.config.js";

async function getTheme() {
  const fullTWConfig = resolveConfig(tailwindConfig as Config);
  return fullTWConfig.theme;
}

export default preval(getTheme());
