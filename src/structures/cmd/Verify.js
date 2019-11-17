const Utils = require("./Utils");

module.exports = class Verify extends Utils {
  constructor(client) {
    super(client)
  };
  
  async cmdVerify(command, context, { message, author, t, developer } = context) {
    const ClientNeedPerm = ({ need: false, perms: [] });
    const UserNeedPerm = ({ need: false, perms: [] });

    if(message.guild) {
      if(this.permissions.client.length) {
        await this.clientPermission(this.permissions.client, message, author, ClientNeedPerm, t)
      };
      if((!developer) && (this.permissions.user.length)) {
        await this.memberPermission(this.permissions.user, message, author, UserNeedPerm, t)
      };
    };

    if(!ClientNeedPerm.need && !UserNeedPerm.need) {
      return await command.run(context, t)
    } else {
      context = null
      return false;
    };
  };

  clientPermission(perms, message, user, ClientNeedPerm, t, ERR_USAGE = '') {
    for(const perm of perms) {
      if(!(message.channel.permissionsFor(this.client.user).has(perm))) {
        ClientNeedPerm.perms.push(perm)
      };
    };

    if(ClientNeedPerm.perms.length) {
      ClientNeedPerm.need = true
      if(ClientNeedPerm.perms.length > 1) {
        ERR_USAGE = 'errors:permissions.client.multiple'
      } else {
        ERR_USAGE = 'errors:permissions.client.one'
      };

      const client_permission = ClientNeedPerm.perms.map(perm => perm).join(", ");

      return message.channel.send(t(`${ERR_USAGE}`, {
        emoji: this.client.getEmoji('error').all,
        user: user.username,
        permission: t(`permissions:${client_permission}`)
      }));
    } else {
      return true;
    };
  };

  memberPermission(perms, message, user, UserNeedPerm, t, ERR_USAGE = '') {
    for(const perm of perms) {
      if(!(message.channel.permissionsFor(user).has(perm))) {
        UserNeedPerm.perms.push(perm)
      };
    };

    if(UserNeedPerm.perms.length) {
      UserNeedPerm.need = true
      if(UserNeedPerm.perms.length > 1) {
        ERR_USAGE = 'errors:permissions.user.multiple'
      } else {
        ERR_USAGE = 'errors:permissions.user.one'
      };

      const userPermission = UserNeedPerm.perms.map(perm => perm).join(", ");

      return message.channel.send(t(`${ERR_USAGE}`, {
        emoji: this.client.getEmoji('error').all,
        user: user.username,
        permission: t(`permissions:${userPermission}`)
      }));
    } else {
      return true;
    };
  };
};