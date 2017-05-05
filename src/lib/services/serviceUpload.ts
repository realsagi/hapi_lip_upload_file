import * as Hapi from "hapi";
import * as mkdirp from "mkdirp";
import * as fs from 'fs';
import * as FileType from 'file-type';
import * as readChunk from 'read-chunk';

import {IOptions, IImages, IUploadImages, ISaveImagesMongoose} from "../interfaces";
import {Images} from "../models/images";

export default class ServiceUpload implements IImages {

    private server: Hapi.Server;
    private options: IOptions;
    private imagesModel: any;

    constructor (server: Hapi.Server, options: IOptions) {
        this.server = server;
        this.options = options;
        let db: any = server.plugins['hapi-mongoose'].connection;
        this.imagesModel = new Images(this.server, db);
    }

    private randomString (): string {
        let text: string = "";
        let possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        let countLoop: number = 50;
        for ( let i: number = 0; i < countLoop ; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private createDirectory (path: string, pathFile: String): Promise<any> {
        return new Promise((resolve: any, reject: any): void => {
            mkdirp(path, (err: any) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    private createFile (pathFile: any, data: any): Promise<any> {
        return new Promise((resolve: any, reject: any): void => {
            fs.writeFile(pathFile, data, "binary", (err: any) => {
                if (err) {
                    reject(err);
                }
                let endBinary: number = 4100;
                let buffer: any = readChunk.sync(pathFile, 0, endBinary);
                let mime: FileType = FileType(buffer);
                if (mime == null || this.options.mimeValidate.indexOf(mime.mime) < 0) {
                    fs.unlinkSync(pathFile);
                    reject("fille is not image");
                }else {
                    resolve(pathFile);
                }
            });
        });
    }

    private writeFile (data: any): Promise<any> {
        let now: Date = new Date();
        let subPath: string = "/" + now.getFullYear() + "/" + now.getMonth() + "/" + now.getDay();
        let path: string = this.options.rootPath + subPath + "/";
        let fileType: string = data.fileName.substring(data.fileName.indexOf("."));
        let pathFile: string = path + this.randomString() + fileType;

        return this.createDirectory(path, pathFile).then((result: any) => {
            return this.createFile(pathFile, data.fileBinary);
        }).then((result: any) => {
            return result;
        });
    }

    public uploadImages = (data: IUploadImages): any => {
        return this.writeFile(data).then((result: any) => {
            let dataForSave: ISaveImagesMongoose = {
                tableName: data.tableName,
                idTableName: data.idTableName,
                type: data.type,
                imagePath: result
            };
            let images: any = new this.imagesModel(dataForSave);
            return images.save();
        });
    }

     public registerMethod (): void {
       this.server.method({
            name: 'upload.file',
            method: this.uploadImages,
            options: {
                callback: false
            }
        });
    }
}