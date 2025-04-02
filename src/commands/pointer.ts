import {  ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import { promises as fs } from "fs";
import axios from "axios";

export default class Pointer extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "pointer",
            description: "Pointe pour une session.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [
                {
                    name: "url",
                    description: "L'URL de la session à pointer.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const baseUrl = interaction.options.getString("url", true);
        
        const { url, token } = decomposeUrl(baseUrl);

        const usersToValidate = await getUsersToValidate();
        const cookiesObj = await getCookies();

        if (cookiesObj.exp < Date.now()) {
            console.error("Les cookies ont expiré.");
            return await interaction.editReply({ content: "Les cookies ont expiré." });
        }
        const cookies = cookiesObj.cookies;

        let results = [];

        for (const user of usersToValidate) {
            const status = await validatePresence(url, token, user, cookies);

            if (status === 200) {
                results.push({ user: user.discordId, status: `<@${user.discordId}> a pointé.` });
            } else if (status === 500) {
                results.push({ user: user.discordId, status: `<@${user.discordId}> a déjà pointé.` });
            } else if (status === 403) {
                results.push({ user: user.discordId, status: `<@${user.discordId}> n'a pas pu pointer (token expiré).` });
            } else {
                results.push({ user: user.discordId, status: `<@${user.discordId}> a rencontré une erreur.` });
            }
            cookies.pop();
        }

        let resultString = results.map(result => result.status).join("\n");

        await interaction.editReply({
            content: resultString,
        });

        await fs.unlink("data/pasla.json");
    }
}

function decomposeUrl(url: string) {
    const array = url.split("/registered?token=");
    if (array.length !== 2) {
        throw new Error("URL mal formée");
    }
    return {
        url: array[0],
        token: array[1]
    }
}

async function getUsersToValidate() {
    return fs.readFile("data/pasla.json")
        .then(data => {
            const users = JSON.parse(data.toString());
            return users;
        })
        .catch(err => {
            console.error(err);
            throw new Error("Erreur en essayant de lire le fichier.");
        });
}

async function getCookies() {
    return fs.readFile("data/cookies.json")
        .then(data => {
            const cookies = JSON.parse(data.toString());
            return cookies;
        })
        .catch(err => {
            console.error(err);
            throw new Error("Erreur en essayant de lire le fichier.");
        });
}

async function validatePresence(url: string, token: string, user: {discordId: string, jwtToken: string}, cookies: [any]) {
    const jwtCookie = {
        name: 'user',
        value: user.jwtToken,
        domain: "intra.epitech.eu",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 86400,
        size: 173,
        httpOnly: true,
        secure: true,
        session: false,
        priority: "Medium",
        sameParty: false,
        sourcescheme: "Secure",
        sourcePort: 443,
    };

    cookies.push(jwtCookie);
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");

    try {
        await axios.post(url + '/token?format=json', {
            "token": token,
            "rate": 1,
            "comment": ""
        }, {
            headers: {
                'Cookie': cookieString,
            }
        }
    );
    } catch (error) {
        // @ts-ignore
        return error.response.status;
    }

    return 200;
}

// https://intra.epitech.eu/module/2024/G-RES-000/LIL-0-1/acti-676606/event-621244/registered?token=17652155