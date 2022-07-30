import { Field } from "./profile"


export type StatusModel = {
    icon: string,
    description: Field
};

export default class Status {
    private static statusMap: { [key: string]: StatusModel } = {
        'free': { icon: 'free', description: 'Ничем не занят'  },
        'busy': { icon: 'busy', description: 'Занят' },
        'inactive': { icon: 'inactive', description: 'Не на месте' },
        'working': { icon: 'working', description: 'Работаю' },
        'casting': { icon: 'casting', description: 'Провожу событие' },
        'watching': { icon: 'watching', description: 'Занят просмотром' },
        'elysium_mod': { icon: 'elysium', description: 'Модерирую Elysium' }
    }

    public static get(name: string) {
        let status = this.statusMap[name];
        if (status) return status;
        
        /**
         * Preventing from crashing Better Discord plugin.
         */
        return { icon: '', description: '' };
    }
}