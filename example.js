const fs = require('fs');
const { Client, GatewayIntentBits, Partials, MessageFlags, Collection } = require('discord.js');
const { token } = require('./config.json');
const Logger = require('easyAuditLogger');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildExpressions, GatewayIntentBits.GuildScheduledEvents
  ], partials: [Partials.Channel, Partials.Message,]
});
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

client.on("ready", () => {
  setInterval(() => {
    const statuses = [
      `Being: ${client.user.username}`
    ];
    const Activity = [
      0,
      1,
      2,
      3,
      5,
    ];
    const s = statuses[Math.floor(Math.random() * statuses.length)];
    const act = Activity[Math.floor(Math.random() * Activity.length)];
    client.user.setPresence({ activities: [{ name: `${s}`, type: act }], status: 'online' });
  }, 20000);
})
//
client.commands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else { client.on(event.name, (...args) => event.execute(...args)); }
}

client.on('interactionCreate', async interaction => {
  console.log(`${interaction.user.tag} in #${interaction.channel.name} from ${interaction.guild.name} triggered an interaction (Slash Command: ${interaction.commandName}) .`);
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return; try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const errorStack = error.stack;
    const fileLineRegex = /at .* \((.*?):(\d+):\d+\)/;
    const match = fileLineRegex.exec(errorStack);
    let errorLocation = "Unknown location";
    if (match) {
      const [, filePath, lineNumber] = match;
      const fileName = filePath.split(/[\\/]/).pop(); 
      errorLocation = `Error in file ${fileName}, line ${lineNumber}`;
    }

    const errorString = `Error: ${errorLocation}: ${error.toString()}`;

    const errorEmbed = new EmbedBuilder().setColor('Yellow').setTitle(`Error`)
      .setDescription('```diff\n-A Error Has Occured, Please Report It To The Support Server! \n``` \n[Support Sever](<https://discord.com> "Discord") \nError To Give: ```yaml\n' + errorString + '\n```')
    if (interaction.deferred) {
      return interaction.editReply({
        embeds: [errorEmbed], ephemeral: true
      });
    } else {
      return interaction.reply({
        embeds: [errorEmbed], ephemeral: true
      });
    }  }
});

//roleCreate
client.on('roleCreate', async (role) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  //set custom embed colour
  logger.newColour('#DF927D')//has to be hexdecimal code (https://www.color-hex.com/)

  // Retrieve the guild ID where the role was created
  const guildID = role.guild.id;

  // Generate an embed with the role creation details
  const logEmbed = await logger.logRoleCreate(role);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
});

//roleUpdate
client.on('roleUpdate', async (oldRole, newRole) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the role was created
  const guildID = oldRole.guild.id;

  // Generate an embed with the role creation details
  const logEmbed = await logger.logRoleUpdate(oldRole, newRole);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
});

//roleDelete
client.on('roleDelete', async (role) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the role was created
  const guildID = role.guild.id;

  // Generate an embed with the role creation details
  const logEmbed = await logger.logRoleDelete(role);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
});


//emojiCreate
client.on('emojiCreate', async (emoji) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the emoji was created
  const guildID = emoji.guild.id;

  // Generate an embed with the emoji creation details
  const logEmbed = await logger.logEmojiCreate(emoji);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
});

//emojiUpdate
client.on('emojiUpdate', async (oldEmoji, newEmoji) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the emoji was created
  const guildID = oldEmoji.guild.id;

  // Generate an embed with the emoji update details
  const logEmbed = await logger.logEmojiUpdate(oldEmoji, newEmoji);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
});

//emojiDelete
client.on('emojiDelete', async (emoji) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the emoji was created
  const guildID = emoji.guild.id;

  // Generate an embed with the emoji deletion details
  const logEmbed = await logger.logEmojiDelete(emoji);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
});


//guildMemberUpdate
client.on('guildMemberUpdate', async (oldMember, newMember) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the member array was created
  const guildID = oldMember.guild.id;

  // Generate an embed with the member details
  const logEmbed = await logger.logGuildMemberUpdate(oldMember, newMember);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
});


//stickerCreate
client.on('stickerCreate', async (sticker) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the sticker was created
  const guildID = sticker.guild.id;

  // Generate an embed with the sticker creation details
  const logEmbed = await logger.logStickerCreate(sticker);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });

});

//stickerUpdate
client.on('stickerUpdate', async (oldSticker, newSticker) => {
  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the sticker was created
  const guildID = oldSticker.guild.id;

  // Generate an embed with the sticker update details
  const logEmbed = await logger.logStickerUpdate(oldSticker, newSticker);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });

});

//stickerDelete
client.on('stickerDelete', async (sticker) => {
  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the sticker was created
  const guildID = sticker.guild.id;

  // Generate an embed with the sticker deletion details
  const logEmbed = await logger.logStickerDelete(sticker);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });

});

//messageCreate
client.on('messageCreate', async (message) => {

  //Ingore direct messages to the bot
  if (message.channel.type === 1) {
    return;
  }

  //Ignore bot messages
  if (message.author.bot) {
    return;
  }

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the message was created
  const guildID = message.guild.id;

  //Check if the message is a poll before logging
  if (message.poll) {
    // Generate an embed with the poll creation details
    const logEmbed = await logger.logMessageCreate(message);

    // Send the embed to the desired logging channel
    await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });

    return;//Cancel logger if its not a poll
  }

  if (message.flags.has(MessageFlags.HasSnapshot)) {
    // Generate an embed with the forwarded message details
    const logEmbed = await logger.logMessageCreate(message);

    // Send the embed to the desired logging channel
    await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });

    return;//Cancel logger if its not forwarded message
  }

});

//messageUpdate - current bug
client.on('messageUpdate', async (oldMessage, newMessage) => {

  //Ingore direct messages to the bot
  if (oldMessage.channel.type === 1) {
    return;
  }

  //Ignore bot messages
  if (oldMessage.author.bot) {
    return;
  }

  //Ignore threads being deleted through this function
  if (!oldMessage.channel.threads) {
    return;
  }

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the message was created
  const guildID = oldMessage.guild.id;

  // Generate an embed with the message update details
  const logEmbed = await logger.logMessageUpdate(oldMessage, newMessage);
 

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });

});

//messageDelete
client.on('messageDelete', async (message) => {
  // To ensure message is defined and has an author, lets check
  if (!message || !message.author) {
    console.error('Message object or author is null or undefined.');
    return;
  }

  // Ignore direct messages to the bot
  if (message.channel.type === 1) {
    return;
  }

  // Ignore bot messages
  if (message.author.bot) {
    return;
  }

  // Check if 'sent' property is set to avoid reprocessing
  if (!message.sent) {
    message.sent = true;

    try {
      // Ensure it only grabs This Event
      const logger = new Logger();

      // Retrieve the guild ID where the message was created
      const guildID = message.guild.id;

      // Generate an embed with the message deletion details
      const logEmbed = await logger.logMessageDelete(message);

      // Send the embed to the desired logging channel
      setTimeout(async () => {
        await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
      }, 2000);
    } catch (error) {
      console.error('Error processing message deletion:', error);
    }
  }
});

//messageDeleteBulk
client.on('messageDeleteBulk', async (messages) => {

  if (!messages.sent) {
    messages.sent = true;

    try {
      // Ensure it only grabs This Event
      const logger = new Logger();

      // Retrieve the guild ID where the message was created
      const firstMessage = messages.first();
      const guildID = firstMessage.guild.id;

      // Generate an embed with the message deletion details
      const logEmbed = await logger.logMessageDeleteBulk(messages);

      // Send the embed to the desired logging channel
      setTimeout(async () => {
        await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
      }, 2000);
    } catch (error) {
      console.error('Error processing message deletion:', error);
    }
  }
});

//voiceStateUpdate
client.on('voiceStateUpdate', async (oldState, newState) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the voice channel connection spawn was created
  const guildID = oldState.guild.id;

  // Generate an embed with the voice logging details (Experimental - Logs weirdly to start with then runs fine)
  const logEmbed = await logger.logVoiceStateUpdate(oldState, newState);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//threadCreate
client.on('threadCreate', async (thread) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the thread was created
  const guildID = thread.guild.id;

  // Generate an embed with the voice logging details
  const logEmbed = await logger.logThreadCreate(thread);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//threadUpdate
client.on('threadUpdate', async (oldThread, newThread) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the thread was created
  const guildID = oldThread.guild.id;

  // Generate an embed with the voice logging details
  const logEmbed = await logger.logThreadUpdate(oldThread, newThread);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//threadDelete
client.on('threadDelete', async (thread) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the thread was created
  const guildID = thread.guild.id;

  // Generate an embed with the voice logging details
  const logEmbed = await logger.logThreadDelete(thread);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})


//channelCreate
client.on('channelCreate', async (channel) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the channel was created
  const guildID = channel.guild.id;

  // Generate an embed with the channel logging details
  const logEmbed = await logger.logChannelCreate(channel);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//channelUpdate
client.on('channelUpdate', async (oldChannel, newChannel) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the channel was created
  const guildID = oldChannel.guild.id;

  // Generate an embed with the channel logging details
  const logEmbed = await logger.logChannelUpdate(oldChannel, newChannel);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//channelDelete
client.on('channelDelete', async (channel) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the channel was created
  const guildID = channel.guild.id;

  // Generate an embed with the channel logging details
  const logEmbed = await logger.logChannelDelete(channel);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//guildBanAdd
client.on('guildBanAdd', async (ban) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  //Custom embed colour
  logger.newColour('#DB7E7F')//has to be hexdecimal code (https://www.color-hex.com/)

  // Retrieve the guild ID where the ban was created
  const guildID = ban.guild.id;

  // Generate an embed with the ban details are
  const logEmbed = await logger.logGuildBanAdd(ban);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//guildBanRemove
client.on('guildBanRemove', async (ban) => {

  //Ensure it only grabs This Event
  const logger = new Logger();
  logger.newColour('#7FDB7E')
  // Retrieve the guild ID where the ban was created
  const guildID = ban.guild.id;

  // Generate an embed with the ban details are
  const logEmbed = await logger.logGuildBanRemove(ban);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//guildScheduledEventCreate
client.on('guildScheduledEventCreate', async (event) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where the event was created
  const guildID = event.guild.id;

  // Generate an embed with the event details 
  const logEmbed = await logger.logGuildScheduledEventCreate(event);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//guildScheduledEventUpdate
client.on('guildScheduledEventUpdate', async (oldEvent, newEvent) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where event ban was created
  const guildID = oldEvent.guild.id;

  // Generate an embed with the event details 
  const logEmbed = await logger.logGuildScheduledEventUpdate(oldEvent, newEvent);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//guildScheduledEventUserAdd
client.on('guildScheduledEventUserAdd', async (event, user) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where event ban was created
  const guildID = event.guild.id;

  // Generate an embed with the event details 
  const logEmbed = await logger.logGuildScheduledEventUserAdd(event, user);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//guildScheduledEventUserRemove
client.on('guildScheduledEventUserRemove', async (event, user) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where event ban was created
  const guildID = event.guild.id;

  // Generate an embed with the event details 
  const logEmbed = await logger.logGuildScheduledEventUserRemove(event, user);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

//guildScheduledEventDelete
client.on('guildScheduledEventDelete', async (event) => {

  //Ensure it only grabs This Event
  const logger = new Logger();

  // Retrieve the guild ID where event ban was created
  const guildID = event.guild.id;

  // Generate an embed with the event details 
  const logEmbed = await logger.logGuildScheduledEventDelete(event);

  // Send the embed to the desired logging channel
  await client.guilds.cache.get(guildID).channels.cache.get('0000YourChannelID0000').send({ embeds: [logEmbed] });
})

client.login(token);
