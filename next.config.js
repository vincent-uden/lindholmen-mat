/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { env } from "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {};
if (env.NODE_ENV == "production") {
  config.typescript = { ...config.typescript, ignoreBuildErrors: true };
}

export default config;
