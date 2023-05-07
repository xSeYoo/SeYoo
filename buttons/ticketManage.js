const { EmbedBuilder, PermissionFlagsBits, UserSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const TicketSetup = require('../../Schemas/TicketSetup');
const TicketSchema = require('../../Schemas/Ticket');
const config = require('../../config');

module.exports = {
    id: 'ticket-manage',
    permissions: [],
    run: async (client, interaction) => {
        const {guild, member, customId, channel } = interaction;
        const {ManageChannels, SendMessages} = PermissionFlagsBits;
        if(!interaction.isButton()) return;
        if(!['ticket-close', 'ticket-lock', 'ticket-unlock', 'ticket-manage', 'ticket-claim'].includes(customId)) return;
        const docs = await TicketSetup.findOne({GuildID: guild.id});
        if (!docs) return;
        const errorEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketError);
        if (!guild.members.me.permissions.has((r) => r.id === docs.Handlers)) return interaction.reply({embeds: [errorEmbed], ephemeral: true}).catch(error => {return});
        const nopermissionsEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketNoPermissions);
        TicketSchema.findOne({ GuildID: guild.id, ChannelID: channel.id }, async (err, data) => {
            if (err) throw err;
            if (!data) return;
            await guild.members.cache.get(data.MemberID);
            await guild.members.cache.get(data.OwnerID);
            if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has(docs.Handlers))) return interaction.reply({ embeds: [nopermissionsEmbed], ephemeral: true }).catch(error => { return });
                    const menu = new UserSelectMenuBuilder()
                        .setCustomId('ticket-manage-menu')
                        .setPlaceholder(config.ticketManageMenuEmoji + config.ticketManageMenuTitle)
                        .setMinValues(1)
                        .setMaxValues(1)
                    return interaction.reply({ components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true }).catch(error => { return });
        })
    }
}