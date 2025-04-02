import { ButtonInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import Button from "../base/classes/Button";
import CustomClient from "../base/classes/CustomClient";
import { PrismaClient } from "@prisma/client";

export default class Bite extends Button {
    constructor(client: CustomClient) {
        super(client, "bite");
    }

    async Execute(interaction: ButtonInteraction) {
        if (!interaction.message.interaction)
            return await interaction.reply({ content: "Tu n'as pas joué au jeu de ma bite ou mes couilles.", flags: MessageFlags.Ephemeral });

        const bitoucouilles = this.client.bitoucouilles.get(interaction.message.interaction.id);
        if (!bitoucouilles)
            return await interaction.reply({ content: "Tu n'as pas joué au jeu de ma bite ou mes couilles.", flags: MessageFlags.Ephemeral });

        if (interaction.user.id !== interaction.message.interaction.user.id)
            return await interaction.reply({ content: "C'EST PAS A TOI DE JOUER.", flags: MessageFlags.Ephemeral });
        

        let won = (bitoucouilles === "bite");
        let description = `${won ? 'Gagné' : 'Perdu'} c'était ${bitoucouilles === "bite" ? "ma bite 🍆" : "mes couilles 🥜"}!\n`
        description += `<@${interaction.user.id}> a choisi bite 🍆.`;

        const embed = new EmbedBuilder()
            .setTitle("Ma bite ou mes couilles")
            .setColor(won ? 0x95A472 : 0xDB5461)
            .setAuthor({
                name: "Boudin Bar",
                iconURL: "https://scontent-cdg4-1.cdninstagram.com/v/t51.2885-19/271455202_281415883877044_7642955895468919978_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2AEF7bf2dgALy6wmc1bwxLM05l255fem91xHORuntRdIckkVgCE4QoCRBh1JUSyqN1Q&_nc_ohc=z3j9lFrkcTcQ7kNvgHjnY6w&_nc_gid=bdaadfcf4644494b8fa055f4b12cfbed&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AYDhyrs2bKDeC5aQyqGgf7f0c6nqrNUgVQqph4266i_4rg&oe=67C23F9A&_nc_sid=8b3546"
            })
            .setDescription(description);

        await interaction.message.edit({ embeds: [embed], components: [], content: "" });

        const prisma = new PrismaClient();
        await prisma.biteOuCouilles.upsert({
                    where: {
                        discordId: interaction.user.id,
                    },
                    update: {
                        won: {
                            increment: won ? 1 : 0,
                        },
                        lost: {
                            increment: won ? 0 : 1,
                        }
                    },
                    create: {
                        discordId: interaction.user.id,
                        won: won ? 1 : 0,
                        lost: won ? 0 : 1,
                    }
                })
    }
}