import { ButtonInteraction } from "discord.js";
import Button from "../base/classes/Button";
import CustomClient from "../base/classes/CustomClient";

export default class ConfirmDrink extends Button {
    constructor(client: CustomClient)  {
        super(client, "confirm_drink");
    }

    Execute(interaction: ButtonInteraction): void {
        console.log(interaction);
    }
}