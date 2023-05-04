const { ActivityType } = require('discord.js');
const client = require('..');
const chalk = require('chalk');
// Add this to the top of the file
const { connect } = require('mongoose')
require('dotenv').config() // remove this line if you are using replit


client.on("ready", () => {

  // Add this to your ready.js file
   connect(process.env.MONGO_URI).then(() => {
      console.log(chalk.yellow(`✅ >>> Successfully connected to MongoDB!`));
    })
    .catch((err) => {
      console.log(err);
    });

  const activities = [
    { name: `${client.guilds.cache.size} Servers`, type: ActivityType.Listening },
    { name: `${client.channels.cache.size} Channels`, type: ActivityType.Playing },
    { name: `${client.users.cache.size} Users`, type: ActivityType.Watching },
    { name: `Discord.js v14`, type: ActivityType.Competing },
    { name: `Created by Daffa`, type: ActivityType.Listening }
  ];
  const status = [
    'online',
    'dnd',
    'idle'
  ];
  let i = 0;
  setInterval(() => {
    if (i >= activities.length) i = 0
    client.user.setActivity(activities[i])
    i++;
  }, 5000);

  let s = 0;
  setInterval(() => {
    if (s >= activities.length) s = 0
    client.user.setStatus(status[s])
    s++;
  }, 30000);
  console.log(chalk.red(`Logged in as ${client.user.tag}!`))
});