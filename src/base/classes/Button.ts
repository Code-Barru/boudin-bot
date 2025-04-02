import { ButtonInteraction } from "discord.js";
import CustomClient from "./CustomClient";

export default class Button {
    client: CustomClient;
    customId: string;
    constructor(client: CustomClient, name: string) {
        this.client = client;
        this.customId = name;
    }

    Execute(interaction: ButtonInteraction): void {
        throw new Error(`Method not implemented for ${this.customId}.`);
    }

}