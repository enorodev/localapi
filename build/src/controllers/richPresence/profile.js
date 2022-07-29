const renderField = async (field) => {
    if (typeof field === 'string') {
        return field;
    }
    else if (field instanceof Function) {
        let response = await field();
        return response;
    }
    else if (field instanceof Sequence) {
        let response = await field.get();
        return response;
    }
};
export class Sequence {
    list;
    idleEvery;
    idleStack = 0;
    index = 0;
    next() {
        this.index++;
        if (this.index >= this.list.length)
            this.index = 0;
    }
    async get() {
        let value = await renderField(this.list[this.index]);
        if (this.idleEvery) {
            this.idleStack++;
            if (this.idleStack >= this.idleEvery) {
                this.idleStack = 0;
                this.next();
            }
            ;
        }
        else {
            this.next();
        }
        return value;
    }
    constructor(list, idleEvery) {
        this.list = list;
        this.idleEvery = idleEvery;
    }
}
export default class ProfileRenderer {
    profile;
    async render() {
        let profileEntries = Object.entries(this.profile);
        for (let i = 0; i < profileEntries.length; i++) {
            let [k, v] = profileEntries[i];
            if (k === 'buttons') {
                profileEntries[i] = [k, [
                        { label: await renderField(v[0].label), url: await renderField(v[0].url) }
                    ]];
                if (v[1])
                    profileEntries[i][1]
                        .push({ label: await renderField(v[1].label), url: await renderField(v[1].url) });
            }
            else {
                let fieldRender = await renderField(v);
                profileEntries[i] = fieldRender ? [k, await renderField(v)] : null;
            }
        }
        return Object.fromEntries(profileEntries.filter(e => e));
    }
    constructor(profile) {
        this.profile = profile;
    }
}
