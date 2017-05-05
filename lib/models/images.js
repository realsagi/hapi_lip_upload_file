"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Images {
    constructor(server, db) {
        this.server = server;
        this.db = db;
        this.mongoose = server.plugins['hapi-mongoose'].lib;
        let imagesSchema = new this.mongoose.Schema({
            tableName: String,
            idTableName: String,
            type: String,
            imagePath: String
        });
        return this.db.model('images', imagesSchema);
    }
}
exports.Images = Images;
//# sourceMappingURL=images.js.map