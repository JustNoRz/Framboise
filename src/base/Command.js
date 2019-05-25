module.exports = class Command {
    constructor(client, {
      name = null,
      description = false,
      category = 'Non definis',
      usage = false,
      enabled = true,
      guildOnly = false,
      aliases = new Array(),
      permission = false,
      botpermissions = new Array(),
      nsfw = false,
      examples = false,
      owner = false
    })
    {
      this.client = client;
      this.conf = { enabled, guildOnly, aliases, permission, botpermissions, nsfw, owner};
      this.help = { name, description, category, usage, examples };
    };
  };
