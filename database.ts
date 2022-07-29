import * as fs from 'fs';
import { DatabaseModel } from './src/typing/database';
import { JsonDatabase } from './src/utils/jsondb';


export default new (
    class Database extends JsonDatabase<DatabaseModel> {
        constructor(path: string) {
            super(path, {
                authentications: {
                    discord: {
                        repCounter: []
                    }
                }
            });
        }
    }
)('database_.json');