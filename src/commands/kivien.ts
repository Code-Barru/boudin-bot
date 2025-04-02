import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import { PrismaClient } from "@prisma/client";

export default class Kivien extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "kivi1",
            description: "Demande qui vient au boudin.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 36000,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        return await interaction.reply({ content: "Cette commande est temporairement désactivée." });
        const prisma = new PrismaClient();
        
        const existingSession = await prisma.session.findFirst({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
                open: true,
            },
        });
        // if (existingSession) {
        //     return await interaction.reply({ content: "Il y a déjà une session active.", ephemeral: true });
        // }

        
        const embed = new EmbedBuilder()
        .setTitle("Qui vient au boudin ?")
        .setColor(0x00AE86)
        .setAuthor({
            name: "Boudin Bar",
            iconURL: "https://scontent-cdg4-1.cdninstagram.com/v/t51.2885-19/271455202_281415883877044_7642955895468919978_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2AEF7bf2dgALy6wmc1bwxLM05l255fem91xHORuntRdIckkVgCE4QoCRBh1JUSyqN1Q&_nc_ohc=z3j9lFrkcTcQ7kNvgHjnY6w&_nc_gid=bdaadfcf4644494b8fa055f4b12cfbed&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AYDhyrs2bKDeC5aQyqGgf7f0c6nqrNUgVQqph4266i_4rg&oe=67C23F9A&_nc_sid=8b3546"
        })
        
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
            .setCustomId('ouijeviens')
            .setLabel('JE VEUX BOIRE')
            .setStyle(ButtonStyle.Danger)
            
        );
        
        await interaction.reply({
            content: "",
            embeds: [embed],
            components: [row]
        });

        let reply = await interaction.fetchReply();
        
        await prisma.session.create({
            data: {
                interactionId: reply.id,
            },
        });


    }
}