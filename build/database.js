import { JsonDatabase } from './src/utils/jsondb.js';
export default new (class Database extends JsonDatabase {
    constructor(path) {
        super(path, {
            authentications: {
                discord: {
                    repCounter: []
                }
            }
        });
    }
})('database_.json');
