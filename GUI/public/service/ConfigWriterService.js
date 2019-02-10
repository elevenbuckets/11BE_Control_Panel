'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ConfigJSONFileWriter = require('ConfigWriter/build/ConfigJSONFileWriter');

var _ConfigJSONFileWriter2 = _interopRequireDefault(_ConfigJSONFileWriter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConfigWriterService {
    constructor() {
        this.getFileWriter = (filePath, allowedFields) => {
            if (filePath in this.writers) {
                return this.writers[filePath];
            } else {
                let configWriter = new _ConfigJSONFileWriter2.default(filePath, allowedFields);
                this.writers[filePath] = configWriter;
                return configWriter;
            }
        };

        this.writers = {};
    }

}

const configWriterService = new ConfigWriterService();
exports.default = configWriterService;