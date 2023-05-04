const { verifyRole } = require('../config.json');
const { ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField } = require('discord.js');

module.exports = {
  id: 'verify_button',
  permissions: [],
  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setCustomId('register')
      .setTitle('Register');

    // Add components to modal

    // Create the text input components
    const nama = new TextInputBuilder()
      .setCustomId('nama')
      // The label is the prompt the user sees for this input
      .setLabel("Masukkan namamu!")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(nama);
    // Add inputs to the modal
    modal.addComponents(firstActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);

    client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isModalSubmit()) return;
      //   if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "<:red_fail_cross:1092216978132963488> You do not have permission to execute this command!", ephemeral: true})
      const { member } = interaction;
      const newNickname = interaction.fields.getTextInputValue('nama');

      if (interaction.customId === 'register') {
        if (!interaction.member.roles.cache.get(verifyRole)) {
          await interaction.member.roles.add(verifyRole)
          await member.setNickname(`{WARGA} ${newNickname}`);
        } return interaction.reply({ content: `${interaction.user}, Kamu Sudah Terdaftar.`, ephemeral: true })

        /* if (interaction.member.roles.cache.get(verifyRole)) {
            await member.setNickname(newNickname);
            interaction.reply({ content: `${interaction.user}, Kamu Sudah Terdaftar.`, ephemeral: true })*/

      } return interaction.reply({ content: `✅ ${interaction.user}, Berhasil Mendaftar.`, ephemeral: true })

    })
  }
}