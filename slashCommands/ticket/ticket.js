const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const TicketSetup = require('../../Schemas/ticketSetup');
const config = require('../../config');
const { application } = require('express');

module.exports = {
  name: 'ticket',
  description: 'A command to setup the ticket system.',
  default_member_permissions: 'ManageChannels',
  type: ApplicationCommandOptionType.ChatInput,
  options: [
    {
      name: 'channel',
      description: 'Select the channel where the tickets should be created.',
      required: true,
      type: ApplicationCommandOptionType.Channel
    },
    {
      name: 'category',
      description: 'Select the parent where the tickets should be created.',
      required: true,
      type: ApplicationCommandOptionType.Channel
    },
    {
      name: 'transcripts',
      description: 'Select the channel where the transcripts should be sent.',
      required: true,
      type: ApplicationCommandOptionType.Channel
    },
    {
      name: 'handlers',
      description: 'Select the ticket handlers role.',
      required: true,
      type: ApplicationCommandOptionType.Role
    },
    {
      name: 'everyone',
      description: 'Select the everyone role.',
      required: true,
      type: ApplicationCommandOptionType.Role
    },
    {
      name: 'description',
      description: 'Choose a description for the ticket embed.',
      required: true,
      type: ApplicationCommandOptionType.String
    },
    {
      name: 'button',
      description: 'Choose a name for the ticket embed.',
      required: true,
      type: ApplicationCommandOptionType.String
    },
    {
      name: 'emoji',
      description: 'Choose a style, so choose a emoji.',
      required: true,
      type: ApplicationCommandOptionType.String
    }
  ],
  run: async (client, interaction) => {
    const { guild, options } = interaction;
    try {
      const channel = options.getChannel('channel');
      const category = options.getChannel('category');
      const transcripts = options.getChannel('transcripts');
      const handlers = options.getRole('handlers');
      const everyone = options.getRole('everyone');
      const description = options.getString('description');
      const button = options.getString('button');
      const emoji = options.getString('emoji');
      await TicketSetup.findOneAndUpdate(
        { GuildID: guild.id },
        {
          Channel: channel.id,
          Category: category.id,
          Transcripts: transcripts.id,
          Handlers: handlers.id,
          Everyone: everyone.id,
          Description: description,
          Button: button,
          Emoji: emoji,
        },
        {
          new: true,
          upsert: true,
        }
      );
      const embed = new EmbedBuilder().setDescription(description);
      const buttonshow = new ButtonBuilder()
        .setCustomId(button)
        .setLabel(button)
        .setEmoji(emoji)
        .setStyle(ButtonStyle.Primary);
      await guild.channels.cache.get(channel.id).send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(buttonshow)],
      }).catch(error => { return });
      return interaction.reply({ embeds: [new EmbedBuilder().setDescription('The ticket panel was successfully created.').setColor('Green')], ephemeral: true });
    } catch (err) {
      console.log(err);
      const errEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketError);
      return interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(error => { return });
    }
  },
};
