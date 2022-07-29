import { Controller, Get, Request } from "../../controller";
import ProfileRenderer from "./profile";
import DefaultProfile from './profiles/default';


export default class RichPresenceController extends Controller {
    public static profile = 'default';
    public static profiles: { [ key: string ]: ProfileRenderer } = {
        default: DefaultProfile
    };

    @Get('/richPresence')
    public static async index(request: Request) {
        let profile = this.profiles[this.profile];
        let profileRender = await profile.render();
        request.response(await profile.render());
    }
}