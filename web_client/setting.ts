
const EnvInfo = require("./next.config.js");

const isProd = process.env.NODE_ENV === "production";

const Setting = {
  isProd,
  title: "My Next App",
  basePath: EnvInfo.basePath,
};

export default Setting;
