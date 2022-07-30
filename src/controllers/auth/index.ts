import url from 'url';
import 'dotenv/config';
import axios from "axios";
import { Controller, Get, Request, Use } from "../../controller.js";
import database from '../../../database.js';
import Type from '../../middleware/type.js';
import Security from '../../middleware/security.js';


export default class AuthController extends Controller {
    private static async extractDiscordUser(request: Request, redirectURI: string) {
        let { code } = request.data;

        if (code) {
            console.log(code);
            try {
                let tokenRequest = await axios.post(
                    'https://discord.com/api/v8/oauth2/token',
                    new url.URLSearchParams({
                        client_id: process.env.DISCORD_OAUTH_CLIENT_ID,
                        client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
                        redirect_uri: redirectURI,
                        grant_type: 'authorization_code',
                        code: code.toString()
                    }).toString(),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );

                let { access_token, token_type } = tokenRequest.data;

                let userRequest = await axios.get(
                    'https://discord.com/api/v8/users/@me',
                    {
                        headers: {
                            'Authorization': `${token_type} ${access_token}`
                        }
                    }
                );

                return userRequest.data;
            } catch (e) {
                console.log(e);
            }
        }
    }

    @Get('/auth/discord/reputation')
    public static async reputation(request: Request) {
        if (request.data.dump) {
            return request.response(database.data.authentications.discord.reputation);
        }

        let user = await this.extractDiscordUser(request, 'http://185.188.182.186:3000/auth/discord/reputation');

        if (user) {
            if (!database.data.authentications.discord.reputation.includes(user.id)) {
                database.data.authentications.discord.reputation.push(user.id);
                database.update();
                request.response('спасибо <3');
            } else {
                request.response('owo');
            }
        } else {
            request.response('что-то пошло не так...');
        }
    }

    @Get('/auth/discord/dump')
    @Use(Security.developer)
    public static async repCounter(request: Request) {
        return request.response(database.data.authentications.discord.reputation);
    }
}