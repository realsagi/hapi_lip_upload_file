import UploadFile from "./methods";
import {IRegister} from "./interfaces";

export default
class Plugin {
    constructor () {
        this.register.attributes = {
            pkg: require("../package.json")
        };
    }

    register: IRegister = (server, options, next) => {
        let uploadFile: UploadFile = new UploadFile(server, options);
        uploadFile.init();
        next();
    }

    errorInit (error: any): void {
        if (error) {
            console.log('Error: Failed to load plugin (' + this.register.attributes.pkg.name + '):', error);
        }
    }
}