# easyAuditLogger - Simplify Discord Audit Logging

easyAuditLogger is a lightweight and easy-to-use module designed to simplify the process of capturing and logging audit events in your Discord bot. Whether you're tracking role changes, message deletions, or user updates, easyAuditLogger handles it smoothly.

## Installation

You can install easyAuditLogger using npm:

```bash
npm install easyauditlogger
```

## How to Use

easyAuditLogger is designed to be simple and intuitive. Below is an example of how to use it to log when a role is created:

```js
const Logger = require('easyauditlogger');

//roleCreate
client.on('roleCreate', async (role) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the role was created
  const guildID = role.guild.id;

  // Generate an embed with the role creation details
  const logEmbed = await logger.logRoleCreate(role);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('012345678901234567').send({ embeds: [logEmbed] });//Replace with your channel ID, or database entry for the ID
});
```

## Supported Events

easyAuditLogger supports logging for the following Discord events:

**Channel Events**
- `channelCreate` - Extended on this is - `category` - `media` - `forum`, these are the other types that channelCreate logs!
- `channelUpdate`
- `channelDelete`

**Emoji Events**
- `emojiCreate`
- `emojiUpdate`
- `emojiDelete`

**Role Events**
- `roleCreate`
- `roleUpdate`
- `roleDelete`

**Message Events**
- `messageCreate` (Currently logs poll creation)
- `messageUpdate`
- `messageDelete` (Works with the example code on the github)
- `messageDeleteBulk` 

**Member Events**
- `guildMemberUpdate`

**Ban Events**
- `guildBanAdd` (Includes ban reason)
- `guildBanRemove`

**Voice Events**
- `voiceStateUpdate` (First time join is still experimental)

**Sticker Events**
- `stickerCreate`
- `stickerUpdate`
- `stickerDelete`

**Thread Events**
- `threadCreate`
- `threadUpdate`
- `threadDelete`

**Scheduled Events**
- `guildScheduledEventCreate`
- `guildScheduledEventUpdate`
- `guildScheduledEventUserAdd`
- `guildScheduledEventUserRemove`
- `guildScheduledEventDelete`

## Customization

You can easily customize the appearance of the logs by modifying the embed colors, adding additional fields, or changing the default settings. For example:

```js
  logger.newColour('#DF927D')//has to be hexdecimal code (https://www.color-hex.com/) for a specific colour of choice
  //Pre-defined colours
  logger.newColour('red')
  logger.newColour('yellow')
  logger.newColour('orange')
  logger.newColour('green')
  logger.newColour('smokeygrape')
```

## Support

If you encounter any issues or have questions, feel free to join the [Discord server](https://discord.gg/Nq8Qc8Xufs) for support.

Please note that updates may not always be immediate, as this project is maintained alongside other commitments.

## License

This project is licensed under the BSD-3-Clause License. See the [LICENSE](./LICENSE) file for more details.

## Request

I Rarrorr (Tomtomvader298), would like to request that anyone who uses my package wont redistribute if anyone (*you) alters the file source,<br>
Since I am a solo developer it takes time for me to add additional things, or fix minor hiccups!

# Enjoy
