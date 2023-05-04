const {
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ApplicationCommandOptionType
  } = require("discord.js");
  
  const { Types } = require("mongoose");
  
  const ticketSchema = require("../../schemas/ticketSchema.js");
  
  module.exports = {
    name: "ticket",
    description: "Configure the ticket system",
    default_member_permissions: "ManageChannels",
    options: [
      {
        name: "setup",
        description: "Setup the ticket system",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "channel to send the ticket message in",
            required: true,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            name: "category",
            description: "The channel to send the ticket panel in.",
            required: true,
            type: ApplicationCommandOptionType.Channel
          },
          {
            name: "ticket_logs",
            description: "Logs a ticket after its been closed",
            required: true,
            type: ApplicationCommandOptionType.Channel
          },
          {
            name: "support_role",
            description: "The Role to assign to support tickets.",
            required: true,
            type: ApplicationCommandOptionType.Role
          },
          {
            name: "description",
            description: "The ticket systems description",
            required: false,
            type: ApplicationCommandOptionType.String
          }
        ]
      },
      {
        name: "delete",
        description: "Deletes config for the tickets",
        type: ApplicationCommandOptionType.Subcommand
      }
    ],
    run: async (client, interaction) => {
      const ticketSystem = await ticketSchema.findOne({
        guildId: interaction.guild.id,
      });
  
      if (interaction.options._subcommand === "setup") {
        const channel = interaction.options.get("channel").channel
        const category = interaction.options.get("category").channel
        const supportRole = interaction.options.get("support_role").role
        const description = interaction.options.get("description");
        const ticketLogs = interaction.options.get("ticket_logs").channel
  
        const data = await ticketSchema.findOne({
          guildId: interaction.guild.id,
        });
  
        if (data) {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("You have already created the ticket system")
                .addFields({
                  name: "<:channelemoji:1015242699277873192> Channel",
                  value: `<:reply:1015235235195146301> <#${data.channelId}>`,
                  inline: true,
                }),
            ],
            ephemeral: true,
          });
          return;
        }
  
        const newSchema = new ticketSchema({
         // _id: Types.ObjectId(),
          guildId: interaction.guild.id,
          channelId: channel.id,
          supportId: supportRole.id,
          categoryId: category.id,
          logsId: ticketLogs.id,
        });
  
        newSchema.save().catch((err) => console.log(err));
  
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ticket System")
              .setDescription("Successfully setup ticket system!")
              .addFields(
                {
                  name: "<:channelemoji:1015242699277873192> Channel",
                  value: `<:reply:1015235235195146301>  <#${channel.id}>`,
                  inline: true,
                },
                {
                  name: "<:6974orangenwand:1015234855379943454> Support Role",
                  value: `<:reply:1015235235195146301>  <@&${supportRole.id}>`,
                  inline: true,
                },
                {
                  name: "<:Discussions:1015242700993351711> Panel Description",
                  value: `<:reply:1015235235195146301>  ${description}`,
                  inline: true,
                },
                {
                  name: "Ticket Logs",
                  value: `<#${ticketLogs}>`,
                }
              ),
          ],
          ephemeral: true,
        })
          .catch(async (err) => {
            console.log(err);
            await interaction.reply({
              content: "An error has occurred...",
            });
          });
  
        const sampleMessage =
          'Welcome to tickets! Click the "Create Ticket" button to create a ticket and the support team will be right with you!';
  
        client.channels.cache.get(channel.id).send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ticket System")
              .setDescription(description == null ? sampleMessage : description)
              .setImage(
                "https://cdn.discordapp.com/attachments/1015320163169611870/1016335587344654346/UTS.png"
              ),
          ],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setCustomId("createTicket")
                .setLabel("Create")
                .setEmoji("<:ticketbadge:1010601796374364171>")
                .setStyle(ButtonStyle.Primary)
            ),
          ],
        });
      }
      if (interaction.options.getSubcommand() === "delete") {
        const ticketData = await ticketSchema.findOne({
          guildId: interaction.guild.id,
        });
  
        if (!ticketData) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Ticket System")
                .setDescription("You already have a ticket system setup!")
                .addFields(
                  {
                    name: "<:SlashCmd:1016055567724326912> Usage",
                    value: "<:reply:1015235235195146301>  /tickets setup",
                    inline: true,
                  },
                  {
                    name: "<:channelemoji:1015242699277873192> Existing channel",
                    value: `<:reply:1015235235195146301>  <#${ticketData.channelId}>`,
                  }
                ),
            ],
            ephemeral: true,
          });
        }
  
        ticketSchema
          .findOneAndDelete({
            guildId: interaction.guild.id,
          })
          .catch((err) => console.log(err));
  
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ticket System")
              .setDescription("Successfully deleted the ticket system!"),
          ],
          ephemeral: true,
        });
      };
    }
  }