import { ModalSubmitInteraction } from "discord.js";
import CustomClient from "./CustomClient";

export default class Modal {
    client: CustomClient;
    customId: string;

    constructor(client: CustomClient, name: string) {
        this.client = client;
        this.customId = name;
    }

    Execute(interaction: ModalSubmitInteraction): void {
        throw new Error("Method not implemented.");
    }
}