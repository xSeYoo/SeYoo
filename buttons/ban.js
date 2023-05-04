const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  ApplicationCommandType } = require('discord.js');
  module.exports = {
    id: 'ban',
    permissions: [],
    run: async(client, interaction) => {
          //FAIL EMBED
      const failEmbed = new EmbedBuilder()
        .setColor('#20C20E')
        .setDescription(`Failed to moderate ${target}.`)
        .setFooter({ text: `SeYoo - Moderation Made Easier.`, iconURL: `` })
      
          // BAN
       const banEmbed = new EmbedBuilder()
          .setColor('#20C20E')
          .setTitle(`You Were Banned From ${guild.name}.`)
          .setDescription(`\`Reason: ${reason}\``)
          .setFooter({ text: `- Moderation Made Easier.`, iconURL: `` })
      const banEmbed2 = new EmbedBuilder()
          .setColor('#20C20E')
          .setTitle(`${target.tag} is **\`BANNED\`**`)
          .addFields({ name: `Moderator:`, value: `${interaction.user.tag}`, inline: true })
          .addFields({ name: `Target:`, value: `${target}`, inline: true })
          .setFooter({ text: `- Moderation Made Easier.`, iconURL: `` })
       target.send({ embeds: [banEmbed] }).catch((err) => { interaction.channel.send({ content: "Failed to DM user" }) });  
                  await interaction.channel.send({ embeds: [banEmbed2] });
                  let ban = await guild.members.ban(target, { reason: `${reason}`}).catch((err) => { 
                      console.log("Error with Ban command: " + err) 
                  })
                  if(!ban) {
                      await interaction.reply({ embeds: [failEmbed], ephemeral: true })
                  }
  
  
      // --------------------------------
      
    }
  }