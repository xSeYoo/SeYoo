const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    BaseInteraction,
    ButtonStyle,
  } = require("discord.js");
  const { Types } = require("mongoose");
  
  const ticketSchema = require("../schemas/ticketSchema");
  const userSchema = require("../schemas/userSchema");
  
  const { createTranscript } = require("discord-html-transcripts");
  
  module.exports = {
    id: 'createTicket',
    permissions: [],
    /**
      * @param {BaseInteraction} interaction 
      * @param {client} client 
      */
    run: async (client, interaction) => {
      const { channel, member, guild, customId } = interaction;
  const userId = interaction.user.id;
    
  const data = await ticketSchema.findOne({
    guildId: guild.id,
  });
  
  if (!data)
    return await interaction.reply({
      content: "You have not setup the ticket system yet.",
      ephemeral: true,
    });
  
  const channelPermissions = [
    "ViewChannel",
    "SendMessages",
    "AddReactions",
    "ReadMessageHistory",
    "AttachFiles",
    "EmbedLinks",
    "UseApplicationCommands",
  ];
  
  const ticketEmbed = new EmbedBuilder().setColor("Blurple");
  
  interaction.guild.channels.create({
      name: `${interaction.user.username}-ticket`,
      channel_types: [ChannelType.GuildText],
      parent: data.categoryId,
      permissionOverwrites: [
        {
          id: userId,
          allow: [channelPermissions],
        },
        {
          id: data.supportId,
          allow: [channelPermissions],
        },
        {
          id: interaction.guild.roles.everyone.id,
          deny: ["ViewChannel"],
        },
      ],
    })
    .then(async (channel) => {
      userSchema.create({
        _id: Types.ObjectId(),
        guildId: guild.id,
        ticketId: channel.id,
        claimed: false,
        closed: false,
        deleted: false,
        creatorId: userId,
        claimer: null,
      });
  
      channel.setRateLimitPerUser(2);
  
      ticketEmbed
        .setTitle(`Welcome to ${interaction.channel.name}!`)
        .setDescription(
          `Welcome <@${userId}> to your ticket. Please wait for the support team to respond to your ticket, in the meantime please explain your situation!`
        );
  
      channel.send({
        embeds: [ticketEmbed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("claimTicket")
              .setLabel("Claim")
              .setEmoji("<:4402yesicon:1015234867530829834>")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("closeTicket")
              .setLabel("Close")
              .setEmoji("<:9061squareleave:1015234841190600756>")
              .setStyle(ButtonStyle.Success)
          ),
        ],
      });
  
      await channel
        .send({
          content: `${member}`,
        })
        .then((message) => {
          setTimeout(() => {
            message.delete().catch((err) => console.log(err));
          }, 5 * 1000);
        });
  
      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Your ticket has been successfully created in <#${channel.id}>!`
              )
              .setColor("Green"),
          ],
          ephemeral: true,
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(async (err) => {
      console.log(err);
    });
    }
  }