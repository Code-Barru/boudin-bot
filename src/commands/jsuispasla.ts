import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import Command from "../base/classes/Command";
import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";


export default class JsuisPasLa extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "jsuispasla",
            description: "Ajoute à la liste de mecs pas là.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 0,
            options: [
                {
                    name: "user",
                    description: "L'utilisateur qui est pas là",
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const discordUser = interaction.options.getUser("user") || interaction.user;
        const userId = discordUser.id;
        
        const prisma = new PrismaClient();
        const user = await prisma.discordUser.findUnique({
            where: {
                discordId: userId,
            },
        });

        if (!user) {
            return await interaction.editReply({
                content: "Cet utilisateur n'est pas enregistré. (/enregistremoi)",
            });
        }

        if (!user.jwtToken) {
            return await interaction.editReply({
                content: "Cet utilisateur n'a pas de token enregistré. (/enregistremoi)",
            });
        }
        
        const isPresent = await saveToFile("data/pasla.json", user);

        if (isPresent) {
            return await interaction.editReply({
                content: "Cet utilisateur est déjà enregistré comme étant pas là.",
            });
        }

        await interaction.editReply({
            content: `L'utilisateur <@${discordUser.id}> a été enregistré comme étant pas là.`,
        });
    }
}

async function saveToFile(filePath: string, user: any) {

    let data;
    try {
        await fs.access(filePath);
        const fileContent = await fs.readFile(filePath, "utf-8");
        data = JSON.parse(fileContent);
        return true;
    } catch {
        data = [];
    }

    data.push({
        discordId: user.discordId,
        jwtToken: user.jwtToken,
    });

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return false;
}
