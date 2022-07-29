var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import url from 'url';
import 'dotenv/config';
import axios from "axios";
import { Controller, Get } from "../../controller.js";
import database from '../../../database.js';
export default class AuthController extends Controller {
    static async extractDiscordUser(request, redirectURI) {
        let { code } = request.data;
        if (code) {
            console.log(code);
            try {
                let tokenRequest = await axios.post('https://discord.com/api/v8/oauth2/token', new url.URLSearchParams({
                    client_id: process.env.DISCORD_OAUTH_CLIENT_ID,
                    client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
                    redirect_uri: redirectURI,
                    grant_type: 'authorization_code',
                    code: code.toString()
                }).toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                let { access_token, token_type } = tokenRequest.data;
                let userRequest = await axios.get('https://discord.com/api/v8/users/@me', {
                    headers: {
                        'Authorization': `${token_type} ${access_token}`
                    }
                });
                return userRequest.data;
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    static async repCounter(request) {
        let user = await this.extractDiscordUser(request, 'http://localhost:8080/auth/discord/repCounter');
        if (user) {
            if (!database.data.authentications.discord.repCounter.includes(user.id)) {
                database.data.authentications.discord.repCounter.push(user.id);
                database.update();
                request.response('спасибо <3');
            }
            else {
                request.response('owo');
            }
        }
        else {
            request.response('что-то пошло не так...');
        }
    }
}
__decorate([
    Get('/auth/discord/repCounter')
], AuthController, "repCounter", null);
