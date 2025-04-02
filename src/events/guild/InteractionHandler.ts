import { ButtonInteraction, type ChatInputCommandInteraction, Collection, EmbedBuilder, Events, MessageFlags, ModalSubmitInteraction, StringSelectMenuComponent, StringSelectMenuInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Command from "../../base/classes/Command";

export default class InteractionHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Handles interactions",
            once: false
        })
    }

    Execute(interaction: ChatInputCommandInteraction | ModalSubmitInteraction | StringSelectMenuInteraction) {
        if (interaction.isButton()) return this.handle_buttons(interaction);
        if (interaction.isChatInputCommand()) return this.handle_commands(interaction);
        if (interaction.isModalSubmit()) return this.handle_modals(interaction);
        if (interaction.isStringSelectMenu()) return this.handle_selects(interaction);
    }

    handle_buttons(interaction: ButtonInteraction) {
        const button = this.client.buttons.get(interaction.customId);

        //@ts-ignore
        if (!button) return interaction.reply({ content: "This button does not exist", flags: MessageFlags.Ephemeral }) && this.client.buttons.delete(interaction.customId);
        
        return button.Execute(interaction);
    }
    
    handle_commands(interaction: ChatInputCommandInteraction) {
        const command: Command = this.client.commands.get(interaction.commandName)!;

        //@ts-ignore
        if (!command) return interaction.reply({ content: "This command does not exist", flags: MessageFlags.Ephemeral }) && this.client.commands.delete(interaction.commandName);

        const { cooldowns } = this.client;
        if(!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name)!;
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(interaction.user.id) && (now < (timestamps?.get(interaction.user.id) || 0) + cooldownAmount)) {
            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`TROP VITE LE BOUDIN ATTENDS.`)
            ], ephemeral: true });

        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            const subCommandGroup = interaction.options.getSubcommandGroup(false);
            const subCommand = `${interaction.commandName}${subCommandGroup ? `${subCommandGroup}`: ""}.${interaction.options.getSubcommand(false) || ""}`
            return this.client.subCommands.get(subCommand)?.Execute(interaction) || command.Execute(interaction);
        } catch (err) {
            console.error(err);
        }
    }

    handle_modals(interaction: ModalSubmitInteraction) {
        const modal = this.client.modals.get(interaction.customId);

        // @ts-ignore
        if (!modal) return interaction.reply({content: "This modal does not exist", flags: MessageFlags.Ephemeral}) && this.client.modals.delete(interaction.customId);

        return modal.Execute(interaction);
    }

    handle_selects(interaction: StringSelectMenuInteraction) {
        const select = this.client.selects.get(interaction.customId);

        // @ts-ignore
        if (!select) return interaction.reply({content: "This select does not exist", flags: MessageFlags.Ephemeral}) && this.client.selects.delete(interaction.customId);

        return select.Execute(interaction);
    }
}