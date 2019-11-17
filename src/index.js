const cmdStructure = require("./structures/cmd");

module.exports = {
  // Structure Command
  Cmd: cmdStructure.Cmd,
  CmdCtx: cmdStructure.Ctx,
  CmdManager: cmdStructure.Manager,
  CmdUtils: cmdStructure.Utils,
  CmdVerify: cmdStructure.Verify,

  // Structures
  Listener: require("./structures/Listener"),
  Embed: require("./structures/Embed"),  

  // Utils
  Constants: require("./utils/Constants")
};