import { ButtonInteraction, ChatInputCommandInteraction, Client, Collection, EmbedBuilder, IntentsBitField, MessageInteraction } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Button from "./Button";
import Command from "./Command";
import SubCommand from "./SubCommand";
import Modal from "./Modal";
import Select from "./Select";

export default class CustomClient extends Client implements ICustomClient {
    bitoucouilles: Collection<string, string>;
    buttons: Collection<string, Button>;
    commands: Collection<string, Command>;
    config: IConfig;
    cooldowns: Collection<string, Collection<string, number>>;
    handler: Handler;
    modals: Collection<string, Modal>;
    selects: Collection<string, Select>;
    subCommands: Collection<string, SubCommand>;

    constructor() {
        super({intents:["Guilds"]});

        this.config = require(`${process.cwd()}/data/config.json`);
        this.handler = new Handler(this);
        this.modals = new Collection();
        this.buttons = new Collection();
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
        this.bitoucouilles = new Collection();
        this.selects = new Collection();
    }
    
    Init(): void {
        this.LoadHandlers();
        this.login(this.config.token)
            .catch((err) => console.error(err));
    }

    LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
        this.handler.LoadButtons();
        this.handler.LoadModals();
        this.handler.LoadSelects();
    }

    async HandleBitOuCouilles(interaction: ButtonInteraction, choix: string) {
        let bitoucouilles = this.bitoucouilles.get(interaction.id);
        if (!bitoucouilles) return;

        let won = (bitoucouilles === choix);

        let description = `${won ? 'Gagné' : 'Perdu'} c'était ${bitoucouilles === "bite" ? "ma bite 🍆" : "mes couilles 🥜"}.\n`
        description += `<@${interaction.user.id}> a choisi ${bitoucouilles == "bite" ? "ma bite 🍆" : "mes couilles 🥜"}.`;


        const embed = new EmbedBuilder()
            .setTitle("Ma bite ou mes couilles")
            .setColor(won ? 0x95A472 : 0xDB5461)
            .setAuthor({
                name: "Boudin Bar",
                iconURL: "https://scontent-cdg4-1.cdninstagram.com/v/t51.2885-19/271455202_281415883877044_7642955895468919978_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2AEF7bf2dgALy6wmc1bwxLM05l255fem91xHORuntRdIckkVgCE4QoCRBh1JUSyqN1Q&_nc_ohc=z3j9lFrkcTcQ7kNvgHjnY6w&_nc_gid=bdaadfcf4644494b8fa055f4b12cfbed&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AYDhyrs2bKDeC5aQyqGgf7f0c6nqrNUgVQqph4266i_4rg&oe=67C23F9A&_nc_sid=8b3546"
            })
            .setDescription(description);

        await interaction.message.edit({ embeds: [embed], components: [], content: "" });
    }
}