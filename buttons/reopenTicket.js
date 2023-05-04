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
    id: 'reopenTicket',
    permissions: [],
    run: async (client, interaction) => {
      const { channel, member, guild, customId } = interaction;
      const uData = await userSchema.findOne({
        guildId: guild.id,
        ticketId: channel.id,
      });
  
      if (!uData.closed)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder().setDescription("The ticket is not closed.").setColor("0x2F3136")
          ]
        });
  
      await userSchema.updateMany(
        {
          ticketId: channel.id,
        },
        {
          closed: false,
        }
      );
  
      interaction.message.edit({
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("ticket-reopen")
              .setLabel("Reopen")
              .setEmoji("🔓")
              .setStyle(ButtonStyle.Success)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("ticket-delete")
              .setLabel("Delete")
              .setEmoji("⛔")
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true)
          ),
        ],
      });
  
      client.channels.cache
        .get(uData.ticketId)
        .permissionOverwrites.edit(uData.creatorId, {
          ViewChannel: true,
        });
  
      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Reopened ticket!")
              .setDescription(`Reopened by ${member.user.tag}`)
              .setColor("Blue"),
          ],
          ephemeral: true
        })
        .catch((err) => console.log(err));
    }
  }