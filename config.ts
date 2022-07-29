import * as fs from 'fs';
import { ConfigModel } from './src/typing/config.js';
import { JsonDatabase } from './src/utils/jsondb.js';


export default new (
    class Config extends JsonDatabase<ConfigModel> {
        constructor(path: string) {
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
    }
)('config_.json');