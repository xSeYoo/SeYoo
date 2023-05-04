const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  ApplicationCommandType } = require('discord.js');
  module.exports = {
    id: 'timeOut',
    permissions: [],
    run: async(client, interaction) => {
          //FAIL EMBED
      const failEmbed = new EmbedBuilder()
        .setColor('#20C20E')
        .setDescription(`Failed to moderate ${target}.`)
        .setFooter({ text: `SeYoo - Moderation Made Easier.`, iconURL: `` })
      // Time Out
       const timeoutEmbed = new EmbedBuilder()
          .setColor('#20C20E')
          .setTitle(`You Were Timeouted In ${guild.name}`)
          .setDescription(`\`Reason: ${reason}. \n Length: ${length} minute(s).\``)
          .setFooter({ text: ` - Moderation Made Easier.`, iconURL: `` })
  
      const timeoutEmbed2 = new EmbedBuilder()
          .setColor('#20C20E')
          .setTitle(`${target.tag} is **\`TIMEOUTED\`**`)
          .addFields({ name: `Moderator:`, value: `${interaction.user.tag}`, inline: true })
          .addFields({ name: `Target:`, value: `${target}`, inline: true })
          .addFields({ name: `Length`, value: `${length} minute(s)`, inline: true })
          .setFooter({ text: ` - Moderation Made Easier.`, iconURL: `` })
  
       target.send({ embeds: [timeoutEmbed] }).catch((err) => { interaction.channel.send({ content: "Failed to DM user" }) });  
                  let timeout = await member.timeout(length * 60000).catch((err) => {
                      console.log("Error with timeout command: " + err)
                  })
                  await interaction.channel.send({ embeds: [timeoutEmbed2] });
                  if(!timeout) {
                      await interaction.reply({ embeds: [failEmbed], ephemeral: true })
                  }
      // --------------------------------
    }
  }