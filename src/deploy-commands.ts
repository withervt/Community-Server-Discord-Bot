import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import dotenv from "dotenv";

dotenv.config();


const commands = [];

const folderPath = join(__dirname, "commands", "Interaction");
const commandFolders = readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = join(folderPath, folder);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js") || file.endsWith(".ts")); /** Allow for DEBUG and PRODUCTION */

    for (const file of commandFiles) {
        const path = join(commandsPath, file);
        const { command } = require(path);

        commands.push(command.data.toJSON());
    }
}
const rest = new REST({ version: '10' }).setToken(process.env.token || "");

(async () => {
    try {
        console.log(`Started refreshing application (/) commands. (${commands.length})`);

        const data = await rest.put(Routes.applicationGuildCommands("1158588180459683860", process.env.guild_id || ""), { body: commands });

        // @ts-ignore
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();