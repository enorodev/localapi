import * as express from 'express';
const routeCallback = (target, method) => {
    return async ({ query }, res) => {
        let methodData = target[`@${method}`];
        let queryKeys = Object.keys(query);
        let missingParameters = methodData.requires.filter(e => !queryKeys.includes(e));
        if (missingParameters.length) {
            res.send({
                error: {
                    code: 'query.missingParameters',
                    message: `Missing required parameters. (${missingParameters.join(', ')})`
                }
            });
        }
        else {
            let request = {
                closed: false,
                data: query,
                response: response => {
                    if (request.closed)
                        return;
                    res.send(JSON.stringify(response));
                    request.closed = true;
                    return response;
                },
                error: error => {
                    if (request.closed)
                        return;
                    res.send(JSON.stringify({ error: error }));
                    request.closed = true;
                    return error;
                }
            };
            for (let method of methodData.use) {
                if (request.closed)
                    return;
                await method(request);
            }
            target[method](request);
        }
    };
};
export class Controller {
    static get bind() {
        let router = express.Router();
        let descriptors = Object.getOwnPropertyDescriptors(this);
        let routes = Object.entries(descriptors).map(e => e[0].startsWith('@') ? e[1].value : null).filter(e => e);
        for (let route of routes) {
            router[route.type](route.path, route.callback);
        }
        return router;
    }
}
const initRoute = (target, method) => {
    target[`@${method}`] = {
        type: null,
        path: null,
        requires: [],
        use: [],
        callback: routeCallback(target, method)
    };
};
export const Get = (path) => {
    return function (target, method) {
        let key = `@${method}`;
        if (!target[key])
            initRoute(target, method);
        target[key] = Object.assign(target[key], {
            type: 'get',
            path: path
        });
    };
};
export const Post = (path) => {
    return function (target, method) {
        let key = `@${method}`;
        if (!target[key])
            initRoute(target, method);
        target[key] = Object.assign(target[key], {
            type: 'post',
            path: path
        });
    };
};
export const Requires = (...keys) => {
    return function (target, method) {
        let key = `@${method}`;
        if (!target[key])
            initRoute(target, method);
        target[key] = Object.assign(target[key], {
            requires: keys
        });
    };
};
export const Use = (...externalMethods) => {
    return function (target, method) {
        let key = `@${method}`;
        if (!target[key])
            initRoute(target, method);
        target[key] = Object.assign(target[key], {
            use: target[key].use.concat(externalMethods)
        });
    };
};
