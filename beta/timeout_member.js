module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Timeout Member",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Discord Bots Poland",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getMemberText(data.member, data.varName)}`;
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

  meta: { version: "2.1.4", preciseCheck: true, author: 'Gotowka', authorUrl: 'https://github.com/Gotowka/autorskieakcje/blob/main/timeout_member.js', downloadUrl: 'https://github.com/Gotowka/autorskieakcje/blob/main/timeout_member.js' },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["member", "varName", "czas", "ilosc", "reason"],

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
<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br><br>

<div style="float: left; width: 45%;">
<span class="dbminputlabel">Time</span><br>
<select id="czas" class="round">
  <option value="1" selected>Seconds</option>
  <option value="2">Minutes</option>
  <option value="3">Hours</option>
  <option value="4">Days</option>
</select>
</div>
<div style="float: right; width: 50%;">
<span class="dbminputlabel">Amount</span><br>
<input id="ilosc" class="round" type="text">
</div><br><br><br>

<div style="padding-top: 16px;">
  <span class="dbminputlabel">Reason</span><br>
  <textarea id="reason" class="dbm_monospace" rows="5" placeholder="Insert reason here..." style="white-space: nowrap; resize: none;"></textarea>
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
    const member = await this.getMemberFromData(data.member, data.varName, cache);
    const czas = parseInt(data.czas, 10)

    let time = this.evalMessage(data.ilosc, cache);

    switch (czas) {
      case 1: 
      time = time ? Date.now() + time * 1000 : null;
      break;
      case 2: 
      time = time ? Date.now() + time * 60000 : null;
      break;
      case 3:
      time = time ? Date.now() + time * 3600000 : null;
      break;
      case 4:
      time = time ? Date.now() + time * 86400000 : null;
      break;
      default:
      break;
    }
    const reason = this.evalMessage(data.reason, cache);

    if (Array.isArray(member)) {
      this.callListFunc(member, "disableCommunicationUntil", [time, reason])
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else if (member?.disableCommunicationUntil) {
      member.disableCommunicationUntil(time, reason)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
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
