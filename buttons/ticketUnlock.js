const { EmbedBuilder, PermissionFlagsBits, UserSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const TicketSetup = require('../../Schemas/TicketSetup');
const TicketSchema = require('../../Schemas/Ticket');
const config = require('../../config');

module.exports = {
    id: 'ticket-unlock',
    permissions: [],
    run: async (client, interaction) => {
        const { guild, member, customId, channel } = interaction;
        const { ManageChannels, SendMessages } = PermissionFlagsBits;
        const docs = await TicketSetup.findOne({ GuildID: guild.id });
        if (!docs) return;
        const errorEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketError);
        if (!guild.members.me.permissions.has((r) => r.id === docs.Handlers)) return interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(error => { return });
        const executeEmbed = new EmbedBuilder().setColor('Aqua');
        const nopermissionsEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketNoPermissions);
        const alreadyEmbed = new EmbedBuilder().setColor('Orange');
        TicketSchema.findOne({ GuildID: guild.id, ChannelID: channel.id }, async (err, data) => {
            if (err) throw err;
            if (!data) return;
            await guild.members.cache.get(data.MemberID);
            await guild.members.cache.get(data.OwnerID);
            if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has(docs.Handlers))) return interaction.reply({ embeds: [nopermissionsEmbed], ephemeral: true }).catch(error => { return });
            alreadyEmbed.setDescription(config.ticketAlreadyUnlocked);
            if (data.Locked == false) return interaction.reply({ embeds: [alreadyEmbed], ephemeral: true }).catch(error => { return });
            await TicketSchema.updateOne({ ChannelID: channel.id }, { Locked: false });
            executeEmbed.setDescription(config.ticketSuccessUnlocked);
            data.MembersID.forEach((m) => { channel.permissionOverwrites.edit(m, { SendMessages: true }).catch(error => { return }) });
            channel.permissionOverwrites.edit(data.OwnerID, { SendMessages: true }).catch(error => { return });
            interaction.deferUpdate().catch(error => { return });
            return interaction.channel.send({ embeds: [executeEmbed] }).catch(error => { return });
        })
    }
}