import * as Hapi from "hapi";

export interface IRegister {
    (server: Hapi.Server, options: any, next: () => void) : void;
    attributes?: any;
}

export interface IOptions {
    rootPath: string;
    mimeValidate: Array<string>;
    mongooseConnection: any;
}

export interface IUploadImages {
    tableName: string;
    idTableName: string;
    type: string;
    fileBinary: string;
    fileName: string;
}

export interface ISaveImagesMongoose {
    tableName: string;
    idTableName: string;
    type: string;
    imagePath: string;
}

export interface IImages {
    uploadImages (data: IUploadImages): any;
}