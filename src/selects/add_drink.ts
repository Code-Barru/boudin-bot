import { MessageFlags, StringSelectMenuInteraction } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import Select from "../base/classes/Select";

export default class AddDrink extends Select {
    constructor(client: CustomClient) {
        super(client, 'select_drink');
    }

    async Execute(interaction: StringSelectMenuInteraction) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const drink = interaction.values[0];

        await interaction.editReply({ content: `Boisson ajoutée: ${drink}` });
         
        const previousMessage = await interaction.channel?.messages.fetch(interaction.message.id);
        if (!previousMessage || previousMessage.flags?.has('Ephemeral'))
            return;

        await previousMessage.delete()
    }
}