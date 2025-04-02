import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, MessageFlags, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import { PrismaClient } from "@prisma/client";

export default class ListGensKiVien extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "listlesgenskivien",
            description: "Liste les gens qui viennent au boudin.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        return await interaction.reply({ content: "Cette commande est temporairement désactivée." });
        // const prisma = new PrismaClient();

        // const currentSession = await prisma.session.findFirst({
        //     where: {
        //         open: true,
        //     },
        //     include: {
        //         users: true
        //     }
        // });

        // if (!currentSession) {
        //     return await interaction.reply({ content: "Y'A PAS DE SESSION BOUDIN ACTIVE (/kivi1)", flags: MessageFlags.Ephemeral });
        // }

        // const participants = currentSession.users.map(user => `- <@${user.discordId}>` ).join("\n");

        // const embed = {
        //     color: 0x0099ff,
        //     title: 'Qui vient au boudin ?',
        //     description: "### Participants :\n" + participants || "Aucun participant pour le moment.",
        //     timestamp: new Date().toISOString(),
        // };

        // const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        //     new ButtonBuilder()
        //         .setCustomId('ouijeviens')
        //         .setLabel('JE VEUX BOIRE')
        //         .setStyle(ButtonStyle.Danger)
                
        // );

        // await interaction.reply({
        //     content: "",
        //     embeds: [embed],
        //     components: [row]
        // });
        
    }
}