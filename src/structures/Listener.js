module.exports = class Listener {
  constructor(client) {
    this.client = client;
  };

  async databaseView(message) {
    try{
      const userVerify = await this.client.database.users.verificar(message.author.id);
      if(!userVerify) {
        await this.client.database.users.add({
          _id: message.author.id
        });
      };

      const guildVerify = (message.guild ? await this.client.database.guilds.verificar(message.guild.id) : true);
      if(!guildVerify) {
        await this.client.database.guilds.add({
          _id: message.guild.id
        });
      };

      return true;
    } catch (error) {
      this.client.logError(err, 'EventDatabaseViewError');
      return false;
    };
  };

  async userUtils(user, verify = false) {
    verify = await this.client.database.users.verificar(user.id);
    try{
      if(!verify) {        
        await this.client.database.users.add({
          _id: user.id
        })
        this.client.logs.user(user);
      }
      
      return this.client.database.users.update(
        user.id, {
          $inc: {
            usedCommands: 1
          }
        }
      );
    } catch (err) {
      this.client.logError(err, 'EventUserUtilsError')
    };    
  };

  async commandUtils(cmd, verify = false) {
    verify = await this.client.database.commands.verificar(cmd.name);
    try{
        if(!verify) {
          await this.client.database.commands.add({
            _id: cmd.name
          });
        };

        return this.client.database.commands.update(
          cmd.name, {
            $inc: {
              usages: 1
            }
          }
        );
    } catch (err) {
      this.client.logError(err, 'EventCommandUtilsError')
    };
  };

  async commandVerify({ blacklist, developer }, command, verfy = false) {
    verfy = await this.client.database.commands.verificar(command.name);    
    try{
      if(!verfy) {
        await this.client.database.commands.add({
          _id: command.name
        });
      };

      const clientUtils = await this.client.database.clientUtils.get(this.client.user.id);
      const { maintenance } = await this.client.database.commands.findOne(command.name);

      if(blacklist) {
        return {
          aproved: false,
          because: 'events:userBlacklist'
        };
      } else if (maintenance && (!developer)) {
        return {
          aproved: false,
          because: 'events:commandMaintenance'
        };
      } else if (clientUtils.maintenance && (!developer)) {
        return {
          aproved: false,
          because: 'events:clientMaintenance'
        }
      }

      return {
        aproved: true
      };
    } catch (error) {
      this.client.logError(error, 'EventCommandVerifyError');
    };
  };
};