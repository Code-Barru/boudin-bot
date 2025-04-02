import { ChatInputCommandInteraction, MessageFlags, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class BitOuCouille extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "bitoucouilles",
            description: "Joue au jeu de ma bite ou mes couilles.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        return await interaction.reply({content: "laisse moi dev enculé", flags: MessageFlags.Ephemeral});
        
        // await interaction.deferReply();

        // const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        //     new ButtonBuilder()
        //         .setCustomId('bite')
        //         .setLabel('Bite🍆')
        //         .setStyle(ButtonStyle.Secondary),
        //     new ButtonBuilder()
        //         .setCustomId('couilles')
        //         .setLabel('Couilles🥜')
        //         .setStyle(ButtonStyle.Secondary)
        // );

        // const choices = ['bite', 'couilles'];
        // const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        // this.client.bitoucouilles.set(interaction.id, randomChoice);

        // await interaction.editReply({ content: "Ma bite ou mes couilles:", components: [row] });
    }
}