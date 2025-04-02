import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import { PrismaClient } from "@prisma/client";

export default class FermeLa extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "fermela",
            description: "Ferme ta gueule.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [],
        });
    }   

    async Execute(interaction: ChatInputCommandInteraction) {
        return await interaction.reply({ content: "Cette commande est temporairement désactivée." });
        // const prisma = new PrismaClient();
        // await interaction.deferReply();
        // const lastSession = await prisma.session.findFirst({
        //     where: {
        //         open: true,
        //     },
        //     include: {
        //         users: true,
        //     }
        // });
        // if (!lastSession) {
        //     return await interaction.editReply({ content: "Y'A PAS DE SESSION BOUDIN ACTIVE (/kivi1)"});
        // }
        
        // for (const user of lastSession.users) {
        //     sendDM(this.client, user.discordId, new Date(lastSession.createdAt).toLocaleDateString('fr-FR'));
        // }

        // await prisma.session.update({
        //     where: { id: lastSession.id },
        //     data: {
        //         open: false,
        //     },
        // });

        // const channel = await this.client.channels.fetch(interaction.channelId);
        // if (!channel) {
        //     return await interaction.editReply({ content: "Erreur en essayant de récupérer le channel." });
        // }
        // if (!channel.isTextBased()) {
        //     return await interaction.editReply({ content: "Erreur en essayant de récupérer le channel." });
        // }

        // const message = await channel.messages.fetch(lastSession.interactionId);
        // if (!message) {
        //     return await interaction.editReply({ content: "Erreur en essayant de récupérer le message." });
        // }
        
        // await message.edit({ components: [] });
        // await interaction.editReply({ content: "La session boudin est terminée." });
    }
}

async function sendDM(client: CustomClient, discordId: string, date: string) {
    const user = await client.users.fetch(discordId);
    if (!user) {
        return;
    }
    
    const embed = new EmbedBuilder()
        .setTitle("Session boudin terminée")
        .setDescription(`La session du ${date} est terminée.\nDis moi ce que tu as bu`)
        .setColor(0xDB5461);
    
    const add_button = new ButtonBuilder()
        .setCustomId("add_drink")
        .setLabel("Ajouter Boisson")
        .setStyle(ButtonStyle.Primary);
    
    const remove_button = new ButtonBuilder()
        .setCustomId("remove_drink")
        .setLabel("Enlever Boisson")
        .setStyle(ButtonStyle.Danger);
    
    const confirm_button = new ButtonBuilder()
        .setCustomId("confirm_drink")
        .setLabel("C'est bon chef")
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(add_button)
        .addComponents(remove_button)
        .addComponents(confirm_button)

    await user.send({ embeds: [embed], components: [row] });
}