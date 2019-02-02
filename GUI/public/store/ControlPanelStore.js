'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _Utils = require('../util/Utils');

var _ControlPanelActions = require('../action/ControlPanelActions');

var _ControlPanelActions2 = _interopRequireDefault(_ControlPanelActions);

var _loopasync = require('loopasync');

var _loopasync2 = _interopRequireDefault(_loopasync);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ControlPanelStore extends _reflux2.default.Store {
	constructor() {
		super();

		this.onWatchedTokenUpdate = tokenSymbolList => {
			this.setState({ watchedTokenSymbolList: tokenSymbolList });
		};

		this.state = {
			tokenBalance: [],
			passManaged: {},
			accounts: [],
			lesDelay: false,
			blockHeight: null,
			blockTime: null,
			highestBlock: 0,
			gasPrice: 0,
			address: null,
			selected_token_name: '',
			balances: { 'ETH': 0 },
			gasPriceOption: "high",
			customGasPrice: null,
			gasPriceInfo: null,
			tokenList: [],
			showingBlock: 0,
			syncInProgress: false,
			unlocked: false,
			configured: true,
			Qs: [],
			receipts: {},
			watchedTokenSymbolList: []
		};

		this.listenables = _ControlPanelActions2.default;
		this.controlPanel = _electron.remote.getGlobal('controlPanel');

		this.controlPanel.client.subscribe('ethstats');
		this.setState({ gasPrice: this.controlPanel.configs.defaultGasPrice });

		this.addressUpdate = () => {
			if (this.state.lesDelay === true) return; // do nothing, since statusUpdate is doing it already
			console.log(`DEBUG: address Update is called`);
			this._count = 0;
			this._target = this.state.tokenList.length + 1;
			this._balances = { 'ETH': 0 };
			this._tokenBalance = [];

			this.controlPanel.linkAccount(this.state.address).then(r => {
				this.setState({ passManaged: { [this.state.address]: r.result } });
				(0, _loopasync2.default)(['ETH', ...this.state.tokenList], _ControlPanelActions2.default.statusUpdate, 1);
			}).catch(err => {
				console.trace(err);
				//this.setState({address: null});
				//ControlPanelActions.finishUpdate();
			});
		};
		this.controlPanel.handleStats = stats => {
			if (stats.connected === false) {
				return this.setState({ connected: false });
			} else if (stats.blockHeight === 0) {
				return this.setState({ wait4peers: true, connected: true });
			} else if (stats.blockHeight !== stats.highestBlock) {
				return this.setState({ syncInProgress: true, connected: true, wait4peers: false });
			} else {
				this.setState(_extends({}, stats, { wait4peers: false, syncInProgress: false }));
			}

			// this.controlPanel.allAccounts().then((addrs) => {
			// 	if (addrs.length !== this.state.accounts.length) this.setState({ accounts: addrs });

			// 	if (this.state.address !== null) {
			// 		return this.addressUpdate();
			// 	} else {
			// 		this.setState({ balances: { 'ETH': 0 }, selected_token_name: '' });
			// 	}
			// });

			this.controlPanel.gasPriceEst().then(est => {
				this.setState({ gasPriceInfo: est, gasPrice: est[this.state.gasPriceOption] });
			});
		};

		this.controlPanel.client.on('ethstats', this.controlPanel.handleStats);

		this.handleNewJobs = obj => {
			_ControlPanelActions2.default.newJobs(obj);
		};

		this._count;
		this._target;
		this.retryTimer;
		this.controlPanel.handleStats({}); // Init
		this.controlPanel.watchTokens(this.controlPanel.TokenList).then(rc => {
			this.controlPanel.syncTokenInfo().then(info => {
				_ControlPanelActions2.default.watchedTokenUpdate(Object.keys(this.controlPanel.TokenInfo));
			});
		});

		this.controlPanel.client.subscribe('newJobs');
		this.controlPanel.client.on('newJobs', this.handleNewJobs);
		this.controlPanel.hasPass().then(data => {
			this.setState({ unlocked: data });
		});
	}

	// Reflux Action responses
	onStartUpdate(address, canvas) {
		console.log(`DEBUG: calling start Update Reflux Action......`);

		clearTimeout(this.retryTimer);this.retryTimer = undefined;

		if (this.state.showingBlock != 0 && this.state.showingBlock < this.state.blockHeight) {
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!retrying status update soon...");
			this.setState({ address: address, lesDelay: true, tokenBalance: [], showingBlock: 0 }); // is this correct ???
			(0, _Utils.createCanvasWithAddress)(canvas, this.state.address);
			this.retryTimer = setTimeout(() => {
				return _ControlPanelActions2.default.startUpdate(address, canvas);
			}, 997);
			return;
		}

		this.setState({ showingBlock: this.state.blockHeight });
		this._count = 0;
		this._target = this.state.tokenList.length + 1;
		this._balances = { 'ETH': 0 };
		this._tokenBalance = [];
		let stage = Promise.resolve();

		stage = stage.then(() => {
			this.setState({ address: address, lesDelay: true, tokenBalance: [] });
			(0, _Utils.createCanvasWithAddress)(canvas, this.state.address);
			return this.controlPanel.linkAccount(address); // define app specific 'userWallet' as class attribute if returns 'true'
		});

		stage = stage.then(r => {
			this.setState({ passManaged: { [this.state.address]: r.result } });
			(0, _loopasync2.default)(['ETH', ...this.state.tokenList], _ControlPanelActions2.default.statusUpdate, 1);
		}).catch(err => {
			console.trace(err);
			//this.setState({address: null});
			//createCanvasWithAddress(canvas, '0x');
			//ControlPanelActions.finishUpdate();
		});
	}

	onStatusUpdate(symbol) {
		if (symbol != 'ETH') {
			this.controlPanel.addrTokenBalance(symbol)(this.state.address).then(b => {
				let b9 = Number(this.controlPanel.toEth(b, this.controlPanel.TokenInfo[symbol].decimals).toFixed(9));
				if (b9 > 0) {
					let stats = { [symbol]: b9 };
					let a = [...this._tokenBalance, `${symbol}: ${b9}`];
					this._balances = _extends({}, this._balances, stats);
					this._tokenBalance = [...new Set(a)];
				}
				this._count++;
				if (this._count == this._target) _ControlPanelActions2.default.finishUpdate();
			});
		} else {
			this.controlPanel.addrEtherBalance(this.state.address).then(b => {
				let b9 = Number(this.controlPanel.toEth(b, 18).toFixed(9));
				let stats = { [symbol]: b9 };
				this._balances = _extends({}, this._balances, stats);
				this._count++;
				if (this._count == this._target) _ControlPanelActions2.default.finishUpdate();
			});
		}
	}

	onFinishUpdate() {
		this.setState({ lesDelay: false, balances: this._balances, tokenBalance: this._tokenBalance, showingBlock: this.state.blockHeight });
		this._balances = { 'ETH': 0 };
		this._tokenBalance = [];
	}

	onMasterUpdate(value) {

		this.controlPanel.client.call('unlock', [value]).then(rc => {
			this.controlPanel.hasPass().then(data => {
				this.setState({ unlocked: data });
			});
		});
	}

	onSelectedTokenUpdate(value) {
		this.setState({ selected_token_name: value });
	}

	onSend(fromAddr, addr, type, amount) {
		if (fromAddr !== this.controlPanel.userWallet) {
			console.log("no password");return;
		}
		let weiAmount = type === 'ETH' ? this.controlPanel.toWei(amount, 18).toString() : this.controlPanel.toWei(amount, this.controlPanel.TokenInfo[type].decimals).toString();
		this.controlPanel.sendTx(type)(addr, weiAmount).then(qid => {
			return this.controlPanel.getReceipts(qid);
		}).then(r => {
			console.dir(r);
		}).catch(err => {
			console.trace(err);
		});
	}

	onNewJobs(obj) {
		this.setState({ Qs: [obj.qid, ...this.state.Qs] });
		// this.controlPanel.getReceipts(obj.qid).then(data => {
		// 	this.setState({ receipts: { [obj.qid]: data, ...this.state.receipts } });
		// })

		this.controlPanel.syncRcdQ(obj.qid).then(data => {
			let r = {
				Q: obj.qid,
				data: data
			};
			_ControlPanelActions2.default.updateReceipts(r);
			return this.controlPanel.getReceipts(obj.qid).then(data => {
				return { data, Q: obj.qid };
			});
		}).then(r => {
			console.log("Receipts:");
			console.log(r.data);
			_ControlPanelActions2.default.updateReceipts(r);
		});
	}

	onUpdateReceipts(r) {
		let data = r.data;
		if (typeof this.state.receipts[r.Q] !== "undefined") {
			data = this.merge(["transactionHash", "tx"], r.data, this.state.receipts[r.Q]);
		}

		data.map(d => {
			if (!d.tx) {
				d.tx = "0x0000000000000000000000000000000000000000000000000000000000000000";
			}
		});

		this.setState({ receipts: _extends({}, this.state.receipts, { [r.Q]: data }) });
	}

	merge(keys, receipt, rcdq) {
		let oout = [];
		rcdq.map(rc => {
			receipt.map(o => {
				if (o[keys[0]] === rc[keys[1]]) oout = [...oout, _extends({}, rc, o)];
			});
		});
		return oout;
	}

}

exports.default = ControlPanelStore;