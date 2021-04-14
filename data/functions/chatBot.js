const { MessageEmbed } = require("discord.js")

async function chatBot(message, input, uuid = 0101) {
    if (!message)
        throw new ReferenceError('reconlx => "message" is not defined');
    if (!input) throw new ReferenceError('reconlx => "input" is not defined');
    const fetch = require("node-fetch");
    fetch(
        `https://api.monkedev.com/fun/chat?msg=${encodeURIComponent(
            input
        )}&uid=${uuid}`
    )
        .then((res) => res.json())
        .then(async (json) => {
            var Google = ["#0F9D58", "#DB4437", "#4285F4", "#FFBF00"];
      var gcolor = Google[Math.round(Math.random() * (Google.length - 1))];
      const embed = new MessageEmbed()
        .setColor(gcolor)
        .setFooter(
          `${json.response}`,
          "https://cdn.discordapp.com/emojis/646994210939076618.gif"
        );
     return message.channel.send(`${message.author}`, embed);
        });
}
module.exports = chatBot;
