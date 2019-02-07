import Accounts from 'accMgr/Accounts';
const remote = require('electron').remote;

class AcctMgrService {
    constructor() {
        this.controlPanel = remote.getGlobal("controlPanel");
        this.accMgr = new Accounts(this.controlPanel.topDir);
    }
}

const AcctMgrServ = new AcctMgrService();
console.log(AcctMgrServ.accMgr.config);

export default AcctMgrServ;
