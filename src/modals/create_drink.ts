import { ModalSubmitInteraction } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import Modal from "../base/classes/Modal";
import { PrismaClient } from "@prisma/client";

export default class CreateDrink extends Modal {
    constructor(client: CustomClient) {
        super(client, 'create_drink');
    }

    async Execute(interaction: ModalSubmitInteraction) {    
        await interaction.deferReply({ephemeral: true});

        const name = interaction.fields.getTextInputValue('create_drink_name');
        const price = Number(interaction.fields.getTextInputValue('create_drink_price'));

        if (!name || !price) {
            await interaction.reply("T'as pas mis le prix ou le nom de la boisson");
            return;
        }

        const prisma = new PrismaClient();

        await prisma.drinks.create({
            data: {
                name,
                price
            }
        });

        // @ts-ignore
        const previousMessage = await interaction.channel?.messages.fetch(interaction.message.id);

        await interaction.editReply({ content: "Boisson ajoutée!" });

        if (!previousMessage || previousMessage.flags?.has('Ephemeral'))
            return;

        await previousMessage.delete();
    }
}