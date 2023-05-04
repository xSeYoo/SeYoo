const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  ApplicationCommandType } = require('discord.js');
  
  module.exports = {
    name: 'modpanel',
    description: "moderation panel dashboard",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'Administrator',
    options: [
      {
        name: 'channel',
        description: 'The channel of verification',
        type: ApplicationCommandOptionType.Channel,
        required: true
      }
    ],
    run: async (client, interaction) => {
      const channel = interaction.options.get('channel').channel;
      let guild = await interaction.guild.fetch();
  
  
      const embed = new EmbedBuilder()
        .setTitle('Mod Panel')
        .setDescription(`Click the button.`)
        .setColor('Green')
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
      const timeout = new ButtonBuilder()
                        .setLabel('Time Out')
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId('timeOut')
      const ban = new ButtonBuilder()
                              .setCustomId('ban')
                              .setLabel('Ban')
                              .setStyle(ButtonStyle.Danger)
      const kick = new ButtonBuilder()
                              .setCustomId('kick')
                              .setLabel('Kick')
                              .setStyle(ButtonStyle.Danger)
  
       const buttons = new ActionRowBuilder()
                  .addComponents(timeout, ban, kick);
      
          
      await channel.send({ embeds: [embed], components: [buttons] });
    }
  }