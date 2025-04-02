import Button from "../base/classes/Button";
import CustomClient from "../base/classes/CustomClient";

export default class RemoveButton extends Button {
    constructor(client: CustomClient)  {
        super(client, "remove_drink");
    }
}