'use strict';

// Major third-party modules

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ControlPanelStore = require('../store/ControlPanelStore');

var _ControlPanelStore2 = _interopRequireDefault(_ControlPanelStore);

var _ControlPanelActions = require('../action/ControlPanelActions');

var _ControlPanelActions2 = _interopRequireDefault(_ControlPanelActions);

var _ConfigWriterService = require('../service/ConfigWriterService');

var _ConfigWriterService2 = _interopRequireDefault(_ConfigWriterService);

var _SideBarView = require('./SideBarView');

var _SideBarView2 = _interopRequireDefault(_SideBarView);

var _ReceiptsView = require('./ReceiptsView');

var _ReceiptsView2 = _interopRequireDefault(_ReceiptsView);

var _TokenSettingsView = require('./TokenSettingsView');

var _TokenSettingsView2 = _interopRequireDefault(_TokenSettingsView);

var _AppLauncherView = require('./AppLauncherView');

var _AppLauncherView2 = _interopRequireDefault(_AppLauncherView);

var _States = require('./States');

var _States2 = _interopRequireDefault(_States);

var _Login = require('./Login');

var _Login2 = _interopRequireDefault(_Login);

var _AccountsView = require('./AccountsView');

var _AccountsView2 = _interopRequireDefault(_AccountsView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ipcRenderer = require('electron').ipcRenderer;

// Reflux store


// Reflux actions


// Service


// Views


class MainView extends _reflux2.default.Component {
	constructor(props) {
		super(props);

		this.updateState = (key, view) => {
			this.setState({ [key]: view });
		};

		this.updateStateForEvent = (key, e) => {
			this.setState({ [key]: e.target.value });
		};

		this.passAccRef = () => {
			return _reactDom2.default.findDOMNode(this.refs.Accounts).firstChild;
		};

		this.relaunch = () => {
			ipcRenderer.send('reload', true);
		};

		this.setupdone = () => {
			// confine config fields
			const mainFields = ["configDir"];
			const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI", "condition", "networkID", "tokens", "watchTokens", "passVault"];
			const ipfsFields = ["lockerpathjs", "repoPathJs", "lockerpathgo", "repoPathGo", "ipfsBinary"];

			// ConfigWriter instances
			let mainWriter = _ConfigWriterService2.default.getFileWriter("../../../.local/bootstrap_config.json", mainFields);
			let castIronWriter = _ConfigWriterService2.default.getFileWriter(_path2.default.join(this.state.defaultCfgDir + "/config.json"), castIronFields);
			let ipfsWriter = _ConfigWriterService2.default.getFileWriter(_path2.default.join(this.state.defaultCfgDir, "/ipfsserv.json"), ipfsFields);

			// internal config update
			let mainJson = { "configDir": this.state.defaultCfgDir };
			mainWriter.writeJSON(mainJson);

			// castiron config update
			let castIronJson = {
				"datadir": this.state.defaultDataDir,
				"rpcAddr": "http://127.0.0.1:8545",
				"ipcPath": _path2.default.join(this.state.defaultDataDir, "geth.ipc"),
				"defaultGasPrice": "20000000000",
				"gasOracleAPI": "https://ethgasstation.info/json/ethgasAPI.json",
				"condition": "sanity",
				"networkID": this.state.defaultNetID,
				"passVault": _path2.default.join(this.state.defaultCfgDir, "myArchive.bcup"),
				"tokens": {},
				"watchTokens": []
			};

			castIronWriter.writeJSON(castIronJson);

			// ipfs config update
			let ipfsJson = {
				"lockerpathjs": _path2.default.join(this.state.defaultCfgDir, ".ipfslock"),
				"lockerpathgo": _path2.default.join(this.state.defaultCfgDir, ".ipfslock_go"),
				"repoPathGo": this.state.defaultRepoDir
			};

			ipfsWriter.writeJSON(ipfsJson);

			this.setState({ userCfgDone: true });
		};

		this.store = _ControlPanelStore2.default;
		// this.controlPanel = remote.getGlobal("controlPanel");
		// this.controlPanel.client.subscribe('newJobs');
		// this.controlPanel.client.on('newJobs', this.handleNewJobs);
		// this.controlPanel.syncTokenInfo();
		this.state = {
			currentView: "AppLauncher"
		};

		this.storeKeys = ["unlocked", "currentView", "modalIsOpen", "scheduleModalIsOpen", "retrying", "rpcfailed", "configured", "userCfgDone", "syncInProgress", "blockHeight", "highestBlock"];
	}

	render() {
		console.log("In MainView render(); syncInProgress = " + this.state.syncInProgress);
		if (this.state.configured === false) {
			document.body.style.background = "linear-gradient(-120deg, rgb(17, 31, 47), rgb(24, 156, 195))";
			return _react2.default.createElement(
				'div',
				{ className: 'container locked', style: { background: "none" } },
				_react2.default.createElement(
					'div',
					{ className: 'item list', style: { background: "none" } },
					_react2.default.createElement(
						'div',
						{ style: { border: "2px solid white", padding: "40px", textAlign: "center", background: "none" } },
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px" } },
							'Welcome, dApp developers!'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px" } },
							'Thank you for trying out ElevenBuckets Build Environment (11BE)!'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px" } },
							'Please setup the following paths to continue:'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement(_Login2.default, { updateState: this.updateStateForEvent,
							defaultCfgDir: this.state.defaultCfgDir,
							defaultDataDir: this.state.defaultDataDir,
							defaultNetID: this.state.defaultNetID,
							defaultRepoDir: this.state.defaultRepoDir
						}),
						this.state.userCfgDone ? _react2.default.createElement('input', { style: { marginTop: "25px" },
							type: 'button', className: 'button reload', value: 'restart', onClick: this.relaunch }) : _react2.default.createElement('input', { style: { marginTop: "25px" },
							type: 'button', className: 'button reload', value: 'confirm', onClick: this.setupdone })
					)
				)
			);
		} else if (this.state.connected === false) {
			document.body.style.background = "rgb(17, 31, 47)";
			return _react2.default.createElement(
				'div',
				{ className: 'container locked', style: { background: "rgb(17, 31, 47)" } },
				_react2.default.createElement(
					'div',
					{ className: 'item list', style: { background: "none" } },
					_react2.default.createElement(
						'div',
						{ style: { border: "2px solid white", padding: "40px", textAlign: "center" } },
						_react2.default.createElement('div', { className: 'loader syncpage' }),
						_react2.default.createElement('br', null),
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" } },
							'Lost local Ethereum node connection ...'
						)
					)
				)
			);
		} else if (this.state.wait4peers === true) {
			document.body.style.background = "rgb(17, 31, 47)";
			return _react2.default.createElement(
				'div',
				{ className: 'container locked', style: { background: "rgb(17, 31, 47)" } },
				_react2.default.createElement(
					'div',
					{ className: 'item list', style: { background: "none" } },
					_react2.default.createElement(
						'div',
						{ style: { border: "2px solid white", padding: "40px", textAlign: "center" } },
						_react2.default.createElement('div', { className: 'loader syncpage' }),
						_react2.default.createElement('br', null),
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" } },
							'Awaiting incomming blocks from peers ...'
						)
					)
				)
			);
		} else if (this.state.syncInProgress === true) {
			document.body.style.background = "linear-gradient(-180deg, rgb(17, 31, 47), rgb(24, 156, 195))";
			return _react2.default.createElement(
				'div',
				{ className: 'container locked', style: { background: "none" } },
				_react2.default.createElement(
					'div',
					{ className: 'item list', style: { background: "none" } },
					_react2.default.createElement(
						'div',
						{ style: { border: "2px solid white", padding: "40px", textAlign: "center" } },
						_react2.default.createElement('div', { className: 'loader' }),
						_react2.default.createElement('br', null),
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" } },
							'Block syncing in progress ',
							this.state.blockHeight,
							' / ',
							this.state.highestBlock,
							' ...'
						)
					)
				)
			);
		} else if (this.state.unlocked === false) {
			document.body.style.background = "url(./assets/blockwall.png)";
			return _react2.default.createElement(
				'div',
				{ className: 'container locked' },
				_react2.default.createElement(_States2.default, null),
				_react2.default.createElement(_Login2.default, null)
			);
		} else {
			document.body.style.background = "#f4f0fa";
			return _react2.default.createElement(
				'div',
				{ className: 'wrapper' },
				_react2.default.createElement(_SideBarView2.default, { currentView: this.state.currentView, updateView: this.updateState.bind(this, "currentView") }),
				_react2.default.createElement(
					'div',
					{ className: 'item version', style: { border: "5px solid #34475c", borderRadius: '0px', borderRight: "1px solid white" } },
					_react2.default.createElement(
						'p',
						null,
						' Platform Ver : '
					),
					_react2.default.createElement(
						'p',
						{ style: { color: "rgba(250,250,250,0.66)" } },
						' ',
						this.state.version,
						' '
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'content' },
					this.state.currentView == "TokenSettings" ? _react2.default.createElement(_TokenSettingsView2.default, null) : this.state.currentView == "AppLauncher" ? _react2.default.createElement(_AppLauncherView2.default, null) : this.state.currentView == "AccountManager" ? _react2.default.createElement(_AccountsView2.default, null) : _react2.default.createElement(_ReceiptsView2.default, null)
				),
				_react2.default.createElement(_States2.default, null)
			);
		}
	}
}

exports.default = MainView;