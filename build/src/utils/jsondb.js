import * as fs from 'fs';
export class JsonDatabase {
    path;
    defaultData;
    _data;
    _cache;
    constructor(path, defaultData) {
        this.path = path;
        this.defaultData = defaultData;
        this.init();
    }
    get load() {
        return fs.readFileSync(this.path).toString();
    }
    set file(data) {
        fs.writeFileSync(this.path, Buffer.from(JSON.stringify(data, null, 4)));
    }
    init() {
        let rawData = this.load;
        if (!rawData || rawData === '{}' || rawData === '[]') {
            this._data = this.defaultData;
        }
        else {
            this._data = JSON.parse(rawData);
        }
        this.update();
    }
    get data() {
        let rawData = this.load;
        if (rawData !== this._cache) {
            this._cache = rawData;
            this._data = JSON.parse(rawData);
        }
        return this._data;
    }
    wipe() {
        this._data = this.defaultData;
        this.update();
    }
    update() {
        this.file = this._data;
        this._cache = this.load;
    }
}
