import config from "../../../../config.js";
import ProfileRenderer from "../profile.js";
import Status from "../status.js";
export default new ProfileRenderer({
    largeImageKey: 'avatar_round',
    details: () => config.data.richPresence.profile.description,
    state: () => config.data.richPresence.profile.details,
    smallImageKey: () => Status.get(config.data.richPresence.profile.status).icon,
    smallImageText: () => Status.get(config.data.richPresence.profile.status).description,
    // buttons: [ { label: '+rep', url: 'https://discord.com/api/oauth2/authorize?client_id=1002031029080563732&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord%2FrepCounter&response_type=code&scope=identify' } ]
});
