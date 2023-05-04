const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  const { Types } = require("mongoose");
  
  const ticketSchema = require("../schemas/ticketSchema");
  const userSchema = require("../schemas/userSchema");
  
  const { createTranscript } = require("discord-html-transcripts");
  
  module.exports = {
    id: 'claimTicket',
    permissions: [],
    run: async (client, interaction) => {
      const { channel, member, guild, customId } = interaction;
  const ticketDat = await ticketSchema.findOne({
      guildId: guild.id,
    });
    const userDat = await userSchema.findOne({
      guildId: guild.id,
      ticketId: channel.id,
    });
  
    if (userDat.claimed === true)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Ticket has been claimed already.`),
        ],
        ephemeral: true,
      });
  
    if (!member.roles.cache.find((r) => r.id === ticketDat.supportId))
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Your not allowed to use this button.`),
        ],
        ephemeral: true,
      });
  
    await userSchema.updateMany(
      {
        ticketId: channel.id,
      },
      {
        claimed: true,
        claimer: member.id,
      }
    );
  
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`Ticket has been claimed`),
      ],
      ephemeral: true
    });
    }
  }