const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  ApplicationCommandType } = require('discord.js');
  
  module.exports = {
    id: 'kick',
    permissions: [],
    run: async (client, interaction) => {
      let guild = await interaction.guild.fetch();
  
      const failEmbed = new EmbedBuilder()
        .setColor('#20C20E')
        .setDescription(`Failed to moderate ${targetUser}.`)
        .setFooter({ text: `SeYoo - Moderation Made Easier.`, iconURL: `` })
  
      const kickEmbed = new EmbedBuilder()
        .setColor('#20C20E')
        .setTitle(`You Were Kicked From ${guild.name}`)
        .setDescription(`\`Reason: ${reason}.\``)
        .setFooter({ text: `SeYoo - Moderation Made Easier.`, iconURL: `` })
      const kickEmbed2 = new EmbedBuilder()
        .setColor('#20C20E')
        .setTitle(`${targetUser.tag} is **\`KICKED\`**`)
        .addFields({ name: `Moderator:`, value: `${interaction.user.tag}`, inline: true })
        .addFields({ name: `Target:`, value: `${targetUser}`, inline: true })
        .setFooter({ text: `SeYoo - Moderation Made Easier.`, iconURL: `` })
  
  
      targetUser.send({ embeds: [kickEmbed] }).catch((err) => { interaction.channel.send({ content: "Failed to DM user" }) });
      let kick = await guild.members.kick(targetUser).catch((err) => {
        console.log("Error with Kick command: " + err)
      })
      await interaction.channel.send({ embeds: [kickEmbed2] });
      if (!kick) {
        await interaction.reply({ embeds: [failEmbed], ephemeral: true })
      }
  
  
    }
  }