module.exports = {
    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------
  
    name: "Graj",
  
    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------
  
    section: "Audio Control",
  
    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------
  
    subtitle(data, presets) {
      return `${data.url}`;
    },
  
    //---------------------------------------------------------------------
    // Action Meta Data
    //
    // Helps check for updates and provides info if a custom mod.
    // If this is a third-party mod, please set "author" and "authorUrl".
    //
    // It's highly recommended "preciseCheck" is set to false for third-party mods.
    // This will make it so the patch version (0.0.X) is not checked.
    //---------------------------------------------------------------------
  
    meta: { version: "2.1.5", preciseCheck: true, author: 'Gotowka', authorUrl: null, downloadUrl: null },
  
    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
  
    fields: ["url", "type"],
  
    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editing actions.
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information,
    // so edit the HTML to reflect this.
    //---------------------------------------------------------------------
  
    html(isEvent, data) {
      return `
      <div>
      <p>
          <u>Mod Info:</u><br>
          Created by money#6283
      </p>
  </div><br>
  <div>
      <span class="dbminputlabel">YouTube</span><br>
      <input id="url" class="round" type="text" placeholder="Podaj link albo tytul">
      
      <br>

      <span class="dbminputlabel">Type</span><br>
      <select id="type" class="round">
            <option value="0">Link</option>
            <option value="1">Tytul</option>
      </select>
  </div>`;
    },
  
    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------
  
    init() {},
  
    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter,
    // so be sure to provide checks for variable existence.
    //---------------------------------------------------------------------
  
    async action(cache) {
      const data = cache.actions[cache.index];
      const { QueryType } = require("discord-player")
      const { Player } = require('discord-player')
      const { Client, Intents } = require('discord.js')
      const type = data.type
      const client = new Client({ intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      ], partials: [
        "MESSAGE",
        "CHANNEL",
        "GUILD_MEMBER",
        "REACTION"
      ]});
      client.player = new Player(client, {
      ytdlOptions: {
          quality: "highestaudio",
          highWaterMark: 1 << 25
      }
      })
      const { interaction } = cache
      const url = this.evalMessage(data.url, cache)

      if (!interaction.member.voice.channel) return interaction.editReply("Błąd: Musisz być na kanale by użyć tej komendy!")
      const queue = await client.player.createQueue(interaction.guild)
      if (!queue.connection) queue.connect(interaction.member.voice.channel)
let song
      if (type === '0') {
        const result = await client.player.search(url, {
            requestedBy: interaction.member,
            searchEngine: QueryType.YOUTUBE_VIDEO
        })
        if (result.tracks.length === 0) interaction.editReply('Błąd nie znaleziono piosenki')
        
        song = result.tracks[0]
        await queue.addTrack(song)
    }
    
     if (type === '1') {
        const result = await client.player.search(url, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        })
        if (result.tracks.length === 0) interaction.editReply('Błąd nie znaleziono piosenki')
        
        song = result.tracks[0]
        await queue.addTrack(song)
     }

     this.storeValue(song.title, 1, 'name', cache);
     this.storeValue(song.url, 1, 'url', cache);
     this.storeValue(song.author, 1, 'author', cache);
     this.storeValue(song.views, 1, 'views', cache);
     this.storeValue(song.thumbnail, 1, 'thumbnail', cache);
     this.storeValue(song.duration, 1, 'duration', cache);
    if (!queue.playing) await queue.play()
    this.callNextAction(cache);
    },
  
    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflicts between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------
  
    mod() {},
};