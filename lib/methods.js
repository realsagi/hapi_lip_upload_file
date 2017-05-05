"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceUpload_1 = require("./services/serviceUpload");
class UploadFile {
    constructor(server, options) {
        this.server = server;
        this.options = options;
    }
    init() {
        let uploadImages = new serviceUpload_1.default(this.server, this.options);
        uploadImages.registerMethod();
    }
}
exports.default = UploadFile;
//# sourceMappingURL=methods.js.map