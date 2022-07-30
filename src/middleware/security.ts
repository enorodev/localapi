import 'dotenv/config';
import { Request } from "../controller";


export default class Security {
    public static developer(request: Request) {
        if (request.data.key != process.env.DEVELOPER_KEY) {
            request.error({
                code: 'security.restricted',
                message: 'Restricted.'
            })
        }
    };
}