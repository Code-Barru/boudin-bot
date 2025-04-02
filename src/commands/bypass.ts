import {  ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import puppeteer from 'puppeteer';
import fs from 'fs';
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";


export default class Bypass extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "bypass",
            description: "Bypass l'anti-flood d'intra.epitech.eu.",
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        await gatherCookies("https://intra.epitech.eu/");

        await interaction.editReply({
            content: "Cookies collectés et sauvegardés pour 30 minutes."
        })
    }
}

async function gatherCookies(url: string) {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ]
    });
    
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    await page.waitForFunction(() => {
        return document.cookie.split('; ').length > 7;
    }, { timeout: 20000 });
    
    let cookies = await browser.defaultBrowserContext().cookies();

    const output = {
        exp: Date.now() + 30 * 60 * 1000,
        cookies
    };
    fs.writeFileSync("data/cookies.json", JSON.stringify(output, null, 4));
    await browser.close();
}