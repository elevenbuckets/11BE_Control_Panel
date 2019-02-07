'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Accounts = require('accMgr/Accounts');

var _Accounts2 = _interopRequireDefault(_Accounts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const remote = require('electron').remote;

class AcctMgrService {
    constructor() {
        this.controlPanel = remote.getGlobal("controlPanel");
        this.accMgr = new _Accounts2.default(this.controlPanel.topDir);
    }
}

const AcctMgrServ = new AcctMgrService();
console.log(AcctMgrServ.accMgr.config);

exports.default = AcctMgrServ;