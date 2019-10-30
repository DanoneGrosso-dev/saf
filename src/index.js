const cmdStructure = require("./structures/cmd");

module.exports = {
  Cmd: cmdStructure.Cmd,
  CmdCtx: cmdStructure.CmdCtx,

  HTTP: require("./http/server")
};