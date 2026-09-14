// Package branches lists the Discord release channels this tool understands.
package branches

// Branch describes one Discord release channel (stable, PTB, Canary, ...).
type Branch struct {
	Key   string
	Label string
	Dir   string
	// AppName is the `name` field of the branch's original package.json.
	// Electron derives %APPDATA%\<AppName> from it, so a wrong value costs
	// the user their login, cache and settings.
	AppName    string
	Executable string
}

// All is every branch this tool knows how to find, most common first.
var All = []Branch{
	{Key: "stable", Label: "Discord", Dir: "Discord", AppName: "discord", Executable: "Discord.exe"},
	{Key: "ptb", Label: "Discord PTB", Dir: "DiscordPTB", AppName: "discordptb", Executable: "DiscordPTB.exe"},
	{Key: "canary", Label: "Discord Canary", Dir: "DiscordCanary", AppName: "discordcanary", Executable: "DiscordCanary.exe"},
	{Key: "development", Label: "Discord Development", Dir: "DiscordDevelopment", AppName: "discorddevelopment", Executable: "DiscordDevelopment.exe"},
}
