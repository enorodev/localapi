import { JsonDatabase } from './src/utils/jsondb.js';
export default new (class Config extends JsonDatabase {
    constructor(path) {
        super(path, {
            richPresence: {
                profile: {
                    status: 'free',
                    description: '',
                    details: ''
                }
            }
        });
    }
})('config_.json');
