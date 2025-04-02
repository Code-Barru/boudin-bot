import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageActionRowComponentBuilder, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import Button from "../base/classes/Button";
import CustomClient from "../base/classes/CustomClient";
import { PrismaClient } from "@prisma/client";

export default class AddDrink extends Button {
    constructor(client: CustomClient)  {
        super(client, "add_drink");
    }

    async Execute(interaction: ButtonInteraction) {
        const prisma = new PrismaClient();

        const drinks = await prisma.drinks.findMany();

        const items = [];

        for (const drink of drinks ) {
            const selectOption = new StringSelectMenuOptionBuilder()
                .setLabel(drink.name)
                .setValue(drink.id.toString())
            
            items.push(selectOption);
        }
        const createDrinks = new ButtonBuilder()
            .setCustomId('create_drink')
            .setLabel('Créer une boisson')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        
        if (items.length === 0) {
            row.addComponents(createDrinks);
            await interaction.reply({ content: "Aucune boisson trouvée", flags: MessageFlags.Ephemeral, components: [row] });
        } else {            
            const select = new StringSelectMenuBuilder()
            .setCustomId('select_drink')
            .setPlaceholder('Sélectionnez une boisson')
            .addOptions(items);
             
            row.addComponents(select);

            const second_row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
            second_row.addComponents(createDrinks);
                

            await interaction.reply({ content: "Sélectionne une boisson", components: [row, second_row] });
        }
    }
}