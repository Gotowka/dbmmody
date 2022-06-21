module.exports = {

	name: "Uprawnienia",


	section: "Autorskie",



	subtitle(data, presets) {
        return `Reply Embed`;
      },

	fields: ["perms", "brak"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="padding-left: 0%; float: left; width: 55%;">
		Interpretation Style:<br>
		<select id="interpretation" class="round">
			<option default value="0" selected>Sprawdzanie kodu!</option>
		</select>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Kod djs:<br>
	<textarea id="code" rows="9" name="is-eval" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>`;
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function() {
		const { glob, document } = this;

		glob.variableChange(document.getElementById("storage"), "varNameContainer");
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function(cache) {
		const data = cache.actions[cache.index];
		let code;
		if(data.interpretation === "0") {
			code = this.evalMessage(data.code, cache);
		} else {
			code = data.code;
		}
		const result = this.eval(code, cache);
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		this.storeValue(result, storage, varName, cache);
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function() {}
}; // End of module
