"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const methods_1 = require("./methods");
class Plugin {
    constructor() {
        this.register = (server, options, next) => {
            let uploadFile = new methods_1.default(server, options);
            uploadFile.init();
            next();
        };
        this.register.attributes = {
            pkg: require("../package.json")
        };
    }
    errorInit(error) {
        if (error) {
            console.log('Error: Failed to load plugin (' + this.register.attributes.pkg.name + '):', error);
        }
    }
}
exports.default = Plugin;
//# sourceMappingURL=plugin.js.map