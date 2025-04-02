import { CacheType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import Command from "../base/classes/Command";
import { PrismaClient } from "@prisma/client";

export default class Leaderboard extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "leaderboard",
            description: "Affiche le leaderboard.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [],
        })
    }

    async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
        return await interaction.reply({ content: "Cette commande est temporairement désactivée." });
        await interaction.deferReply();
        const prisma = new PrismaClient();
        const bitoucouilles_usrs = await prisma.biteOuCouilles.findMany({
            orderBy: {
                won: "desc",
            },
            take: 10,
        })

        bitoucouilles_usrs.forEach(usr => {
            // @ts-ignore
            usr.winrate = ((usr.won / (usr.won + usr.lost)) * 100).toFixed(2);
        });
        // @ts-ignore
        bitoucouilles_usrs.sort((a, b) => b.winrate - a.winrate);
        let description = "";

        for (const usr of bitoucouilles_usrs) {
            const user = await this.client.users.fetch(usr.discordId);
            const winrate = ((usr.won / (usr.won + usr.lost)) * 100).toFixed(2);
            description += `- <@${user.id}> a gagné ${usr.won} fois (**${winrate}%** wr).\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle("Leaderboard de Bite Ou Couilles")
            .setDescription(description)
            .setColor(0x00AE86)

        await interaction.editReply({ embeds: [embed] });
    }
}