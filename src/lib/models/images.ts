import * as Hapi from "hapi";

export class Images {
    private server: Hapi.Server;
    private mongoose: any;
    private db: any;
    constructor (server: Hapi.Server, db: any) {
        this.server = server;
        this.db = db;
        this.mongoose = server.plugins['hapi-mongoose'].lib;

        let imagesSchema: any = new this.mongoose.Schema({
            tableName: String,
            idTableName: String,
            type: String,
            imagePath: String
        });
        return this.db.model('images', imagesSchema);
    }
}