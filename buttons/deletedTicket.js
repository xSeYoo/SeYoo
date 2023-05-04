module.exports = {
    id:'deletedTicket',
    permissions: [],
    run: async(client, interaction) => {
      const { channel, member, guild, customId } = interaction;
  const tksData = await ticketSchema.findOne({
      guildId: guild.id,
    });
    const usrData = await userSchema.findOne({
      guildId: interaction.guild.id,
      ticketId: channel.id,
    });
  
    if (!member.roles.cache.find((r) => r.id === tksData.supportId)) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Your not allowed to use this button.`),
        ],
        ephemeral: true,
      });
    }
  
    interaction.message.edit({
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("ticket-close")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        ),
      ],
    });
  
    userSchema
      .findOneAndDelete({
        guildId: guild.id,
      })
      .catch((err) => console.log(err));
  
    setTimeout(
      () => channel.delete().catch((err) => console.log(err)),
      5 * 1000
    );
  
    const transcript = await createTranscript(channel, {
      limit: -1,
      returnBuffer: false,
      fileName: `Ticket-${member.user.username}.html`,
    });
  
    await client.channels.cache
      .get(tksData.logsId)
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle("closed ticket.")
            .setDescription(`Transcript: (download)[${transcript}]`)
            .addFields(
              {
                name: "Closer",
                value: `<@${usrData.closer}>`
              },
              {
                name: "Ticket Deleted By",
                value: `<@${member.user.id}>`
              },
              {
                name: "Deleted At",
                value: `${new Date().toLocaleString()}`
              }
            )
            .setColor("Blue"),
        ],
        files: [transcript],
      })
      .catch((err) => console.log(err));
  
    await interaction
      .reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("closed ticket.")
            .setDescription(`Deleted by ${member.user.tag}`)
            .addFields({
              name: "Time",
              value: "Ticket will be Deleted in 5 seconds...",
            })
            .setColor("Blue"),
        ],
      })
      .catch((err) => console.log(err));
  
    }
  }