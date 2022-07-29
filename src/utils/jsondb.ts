import * as fs from 'fs';


export class JsonDatabase<T> {
    public path: string;
    public defaultData: T;
    private _data: T;
    private _cache: string;


    constructor(path: string, defaultData?: T) {
        this.path = path;
        this.defaultData = defaultData;
        this.init();
    }

    private get load() {
        return fs.readFileSync(this.path).toString();
    }

    private set file(data: any) {
        fs.writeFileSync(this.path, Buffer.from(JSON.stringify(data, null, 4)));
    }

    public init() {
        let rawData = this.load;

        if (!rawData || rawData === '{}' || rawData === '[]') {
            this._data = this.defaultData;
        } else {
            this._data = JSON.parse(rawData);
        }

        this.update();
    }

    public get data() {
        let rawData = this.load;
        if (rawData !== this._cache) {
            this._cache = rawData;
            this._data = JSON.parse(rawData);
        }

        return this._data;
    }

    public wipe() {
        this._data = this.defaultData;
        this.update();
    }

    public update() {
        this.file = this._data;
        this._cache = this.load;
    }
}