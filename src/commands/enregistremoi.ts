import { ApplicationCommandOptionType, ChatInputCommandInteraction, MessageFlags, PermissionsBitField } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import Command from "../base/classes/Command";
import { PrismaClient } from "@prisma/client";

export default class Enregistremoi extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "enregistremoi",
            description: "Enregistre ton token jwt.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 0,
            options: [
                {
                    name: "token",
                    description: "Ton token jwt pour intra.epitech.eu",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const prisma = new PrismaClient();

        const token = interaction.options.getString("token", true);
        const userId = interaction.user.id;        
        let user = await prisma.discordUser.findUnique({
            where: {
                discordId: userId,
            },
        });

        if (!user) {
            user = await prisma.discordUser.create({
                data: {
                    discordId: userId,
                    jwtToken: token,
                },
            });
        }

        if (user.jwtToken !== token) {
            await prisma.discordUser.update({
                where: {
                    discordId: userId,
                },
                data: {
                    jwtToken: token,
                },
            });
        }

        await interaction.reply({
            content: "Ton token a bien été enregistré.",
            flags: MessageFlags.Ephemeral
        });
    }
}