import { StringSelectMenuInteraction } from "discord.js";
import CustomClient from "./CustomClient";

export default class Select {
    client: CustomClient;
    customId: string;
    constructor(client: CustomClient, name: string) {
        this.client = client;
        this.customId = name;
    }

    Execute(interaction: StringSelectMenuInteraction): void {
        throw new Error(`Method not implemented for ${this.customId}.`);
    }
}