
const EnvInfo = require("./next.config.js");

const isProd = process.env.NODE_ENV === "production";

const Setting = {
  isProd,
  title: "Img2Excel",
  basePath: EnvInfo.basePath,
};

export default Setting;
