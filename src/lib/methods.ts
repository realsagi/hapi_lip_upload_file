import * as Hapi from "hapi";
import ServiceUpload from "./services/serviceUpload";
import {IOptions} from "./interfaces";

export default class UploadFile{

    private server: Hapi.Server;
    private options: IOptions;

    constructor (server: Hapi.Server, options: IOptions) {
        this.server = server;
        this.options = options;
    }

    public init (): void {
        let uploadImages: any = new ServiceUpload(this.server, this.options);
        uploadImages.registerMethod();
    }
}