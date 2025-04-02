import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags } from "discord.js";
import Button from "../base/classes/Button";
import CustomClient from "../base/classes/CustomClient";
import { PrismaClient } from "@prisma/client";

export default class OuiJeViens extends Button {
    constructor(client: CustomClient) {
        super(client, "ouijeviens");
    }

    async Execute(interaction: ButtonInteraction) {
        const prisma = new PrismaClient();

        if (!interaction.message.id) {
            return await interaction.reply({ content: "Interaction non trouvée.", flags: MessageFlags.Ephemeral });
        }       
        const lastSession = await prisma.session.findFirst({
            where: {
                interactionId: interaction.message.id,
            },
            include: {
                users: true,
            }
        });
        if (!lastSession) {
            return await interaction.reply({ content: "Session non trouvée.", flags: MessageFlags.Ephemeral });
        }

        if (!lastSession.open) {
            return await interaction.reply({ content: `La session du ${new Date(lastSession.createdAt).toLocaleDateString('fr-FR')} est fermée.`, ephemeral: true });
        }

        const userInSession = await prisma.session.findFirst({
            where: {
                id: lastSession.id,
                users: {
                    some: {
                        discordId: interaction.user.id,
                    },
                },
            },
        });

        if (userInSession) {
            return await interaction.reply({ content: "Tu es déjà dans la session", flags: MessageFlags.Ephemeral });
        }

        const user = await prisma.discordUser.upsert({
            where: { discordId: interaction.user.id },
            update: {},
            create: {
                discordId: interaction.user.id,
            },
        });

        await prisma.session.update({
            where: { id: lastSession.id },
            data: {
                users: {
                    connect: { discordId: user.discordId },
                },
            },
        });
        lastSession.users.push(user);
        const participants = lastSession.users.map(user => `- <@${user.discordId}>` ).join("\n");


        const embed = {
            color: 0x0099ff,
            title: 'Qui vient au boudin ?',
            description: "### Participants :\n" + participants || "Aucun participant pour le moment.",
            timestamp: new Date().toISOString(),
        };

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('ouijeviens')
                .setLabel('Je viens boire')
                .setStyle(ButtonStyle.Danger)
                
        );

        await interaction.message.edit({
            content: "",
            embeds: [embed],
            components: [row]
        });
 
        await interaction.reply({ content: `Je t'ai ajouté à la session boudin du ${new Date(lastSession.createdAt).toLocaleDateString('fr-FR')}!`, flags: MessageFlags.Ephemeral });
    }
}