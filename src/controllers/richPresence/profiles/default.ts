import config from "../../../../config";
import database from "../../../../database";
import ProfileRenderer, { Sequence } from "../profile";


const statusTemplate = (status: string) => {
    switch (status) {
        case 'free':
            return 'Свободен';
        case 'busy':
            return 'Занят';
        case 'inactive':
            return 'Не на месте';
        case 'working':
            return 'Работаю';
        case 'casting':
            return 'Проводит событие';
        case 'watching':
            return 'Занят просмотром';
    }
}


export default new ProfileRenderer({
    largeImageKey: 'avatar_round',
    details: () => config.data.richPresence.profile.description,
    state: () => `${database.data.authentications.discord.repCounter.length} +rep`,
    smallImageKey: () => config.data.richPresence.profile.status,
    smallImageText: () => statusTemplate(config.data.richPresence.profile.status),
    buttons: [ { label: '+rep', url: 'https://discord.com/api/oauth2/authorize?client_id=1002031029080563732&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord%2FrepCounter&response_type=code&scope=identify' } ]
});