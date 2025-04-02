import { ActionRow, ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Button from "../base/classes/Button";
import CustomClient from "../base/classes/CustomClient";

export default class AddDrink extends Button {
    constructor(client: CustomClient)  {
        super(client, "create_drink");
    }

    async Execute(interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId("create_drink")
            .setTitle("Créer une boisson");

        const name = new TextInputBuilder()
            .setCustomId("create_drink_name")
            .setLabel("Nom de la boisson")
            .setStyle(TextInputStyle.Short);

        const price = new TextInputBuilder()
            .setCustomId("create_drink_price")
            .setLabel("Prix de la boisson")
            .setStyle(TextInputStyle.Short);
        
        const row_1 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(name);
        const row_2 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(price);

        modal.addComponents(row_1, row_2);

        await interaction.showModal(modal);

    }
}