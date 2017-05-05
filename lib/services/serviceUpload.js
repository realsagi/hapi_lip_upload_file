"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp = require("mkdirp");
const fs = require("fs");
const FileType = require("file-type");
const readChunk = require("read-chunk");
const images_1 = require("../models/images");
class ServiceUpload {
    constructor(server, options) {
        this.server = server;
        this.options = options;
        let db = server.plugins['hapi-mongoose'].connection;
        this.imagesModel = new images_1.Images(this.server, db);
    }
    randomString() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        let countLoop = 50;
        for (let i = 0; i < countLoop; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    createDirectory(path, pathFile) {
        return new Promise((resolve, reject) => {
            mkdirp(path, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }
    createFile(pathFile, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(pathFile, data, "binary", (err) => {
                if (err) {
                    reject(err);
                }
                let endBinary = 4100;
                let buffer = readChunk.sync(pathFile, 0, endBinary);
                let mime = FileType(buffer);
                if (mime == null || this.options.mimeValidate.indexOf(mime.mime) < 0) {
                    fs.unlinkSync(pathFile);
                    reject("fille is not image");
                }
                else {
                    resolve(pathFile);
                }
            });
        });
    }
    writeFile(data) {
        let now = new Date();
        let subPath = "/" + now.getFullYear() + "/" + now.getMonth() + "/" + now.getDay();
        let path = this.options.rootPath + subPath + "/";
        let fileType = data.fileName.substring(data.fileName.indexOf("."));
        let pathFile = path + this.randomString() + fileType;
        return this.createDirectory(path, pathFile).then((result) => {
            return this.createFile(pathFile, data.fileBinary);
        }).then((result) => {
            return result;
        });
    }
    uploadImages(data) {
        return this.writeFile(data).then((result) => {
            let dataForSave = {
                tableName: data.tableName,
                idTableName: data.idTableName,
                type: data.type,
                imagePath: result
            };
            let images = new this.imagesModel(dataForSave);
            return images.save();
        });
    }
}
exports.default = ServiceUpload;
//# sourceMappingURL=serviceUpload.js.map