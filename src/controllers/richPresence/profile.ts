export type Field = string | Function | Sequence;


const renderField = async (field: Field) => {
    if (typeof field === 'string') {
        return field;
    } else if (field instanceof Function) {
        let response = await field();
        return response;
    } else if (field instanceof Sequence) {
        let response = await field.get();
        return response;
    }
}


export class Sequence {
    public list: Field[];
    public idleEvery: number;
    public idleStack: number = 0;
    public index: number = 0;

    public next() {
        this.index++;
        if (this.index >= this.list.length) this.index = 0;
    }

    public async get() {
        let value = await renderField(this.list[this.index]);

        if (this.idleEvery) {
            this.idleStack++;
            if (this.idleStack >= this.idleEvery) {
                this.idleStack = 0;
                this.next();
            };
        } else {
            this.next();
        }

        return value;
    }
    
    constructor(list: Field[], idleEvery?: number) {
        this.list = list;
        this.idleEvery = idleEvery;
    }
}


export type Profile = {
    largeImageKey?: Field,
    details?: Field,
    largeImageText?: Field,
    smallImageKey?: Field,
    smallImageText?: Field,
    state?: Field,
    buttons?: [
        { label: Field, url: Field },
        { label: Field, url: Field }?
    ]
};

export type RawProfile = {
    largeImageKey?: string,
    details?: string,
    largeImageText?: string,
    smallImageKey?: string,
    smallImageText?: string,
    state?: string,
    buttons?: [
        { label: string, url: string },
        { label: string, url: string }?
    ]
};


export default class ProfileRenderer {
    public profile: Profile;

    async render(): Promise<RawProfile> {
        let profileEntries = Object.entries(this.profile);

        for (let i = 0; i < profileEntries.length; i++) {
            let [ k, v ] = profileEntries[i];
            if (k === 'buttons') {
                profileEntries[i] = [ k, [
                    { label: await renderField(v[0].label), url: await renderField(v[0].url) }
                ] ];
                if (v[1]) (profileEntries[i][1] as any)
                    .push({ label: await renderField(v[1].label), url: await renderField(v[1].url) });
            } else {
                let fieldRender = await renderField(v as Field);
                profileEntries[i] = fieldRender ? [ k, await renderField(v as Field) ] : null;
            }
        }

        return Object.fromEntries(profileEntries.filter(e => e)) as RawProfile;
    }

    constructor(profile: Profile) {
        this.profile = profile;
    }
}