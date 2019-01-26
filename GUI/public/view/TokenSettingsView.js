"use strict";
// Third-parties

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Reflux store


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _electron = require('electron');

var _ConfigJSONFileWriter = require('ConfigWriter/build/ConfigJSONFileWriter');

var _ConfigJSONFileWriter2 = _interopRequireDefault(_ConfigJSONFileWriter);

var _ControlPanelStore = require('../store/ControlPanelStore');

var _ControlPanelStore2 = _interopRequireDefault(_ControlPanelStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TokenSettingsView extends _reflux2.default.Component {
	constructor(props) {
		super(props);

		_initialiseProps.call(this);

		this.store = _ControlPanelStore2.default;
		this.state = {
			waiting: false,
			tokenAction: "",
			tokenToAdd: {
				symbol: '',
				token: {
					addr: '',
					name: '',
					decimals: "",
					category: 'Customized',
					watched: false
				}
			},
			selectedTokens: [],
			tokenFilter: {},
			filteredTokens: [],
			tokenDisplay: []
		};

		this.storeKeys = ["tokenList"];
		this.controlPanel = _electron.remote.getGlobal("controlPanel");
		let path = require("path");
		this.tokenConfigsFile = path.join(this.controlPanel.topDir, "Tokens.json");
	}

	render() {
		console.log("in TokenSettingsView render()");
		return _react2.default.createElement(
			'div',
			null,
			_react2.default.createElement(
				'div',
				{ className: 'tokenAction' },
				_react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonNew', value: 'New', onClick: this.handleTokenActionUpdate.bind(this, "New") }),
				_react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonSearch', value: 'Search', onClick: this.handleTokenActionUpdate.bind(this, "Search") }),
				_react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonDelete', value: 'Delete', disabled: !this.selectedTokensCanBeDeleted(),
					onClick: this.handleClickDeleteToken }),
				_react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonWatch', value: 'Watch',
					disabled: this.state.selectedTokens.length === 0, onClick: this.handleClickWatchToken }),
				_react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonUnWatch', value: 'UnWatch',
					disabled: this.state.selectedTokens.length === 0, onClick: this.handleClickUnWatchToken }),
				_react2.default.createElement('br', { style: { border: '2px solid white' } }),
				_react2.default.createElement(
					'table',
					{ className: 'tokenTitleTable' },
					_react2.default.createElement(
						'tbody',
						null,
						_react2.default.createElement(
							'tr',
							null,
							_react2.default.createElement(
								'td',
								{ width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
								'Select'
							),
							_react2.default.createElement(
								'td',
								{ width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
								'Symbol'
							),
							_react2.default.createElement(
								'td',
								{ width: '40%', style: { borderRight: '2px solid rgb(17,31,47)' } },
								'Address'
							),
							_react2.default.createElement(
								'td',
								{ width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
								'Name'
							),
							_react2.default.createElement(
								'td',
								{ width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
								'Decimals'
							),
							_react2.default.createElement(
								'td',
								{ width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
								'Catgory'
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								'Watched'
							)
						),
						_react2.default.createElement(
							'tr',
							{ hidden: !(this.state.tokenAction === "New"), style: { backgroundColor: "rgb(34, 169, 202)" } },
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								'N/A'
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'text', size: '3',
									value: this.state.tokenToAdd.symbol === undefined ? "" : this.state.tokenToAdd.symbol,
									onChange: this.changeNewTokenField.bind(this, "symbol")
								})
							),
							_react2.default.createElement(
								'td',
								{ width: '40%' },
								_react2.default.createElement('input', { type: 'text', size: '20',
									value: this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.addr,
									onChange: this.changeNewTokenField.bind(this, "addr")
								})
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'text', size: '10',
									value: this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.name,
									onChange: this.changeNewTokenField.bind(this, "name")
								})
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'text', size: '10',
									value: this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.decimals,
									onChange: this.changeNewTokenField.bind(this, "decimals")
								})
							),
							_react2.default.createElement('td', { width: '10%' }),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'button',
									className: 'button', value: 'Add',
									style: { height: '23px', backgroundColor: 'rgba(0,0,0,0)', fontSize: '13px', fontWeight: 'bold' },
									onClick: this.handleClickAddToken
								})
							)
						),
						_react2.default.createElement(
							'tr',
							{ hidden: !(this.state.tokenAction === "Search") },
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								'N/A'
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'text', size: '3',
									value: this.state.tokenFilter.symbol === undefined ? "" : this.state.tokenFilter.symbol,
									onChange: this.changeTokenFilter.bind(this, "symbol")
								})
							),
							_react2.default.createElement(
								'td',
								{ width: '40%' },
								_react2.default.createElement('input', { type: 'text', size: '20',
									value: this.state.tokenFilter.addr === undefined ? "" : this.state.tokenFilter.addr,
									onChange: this.changeTokenFilter.bind(this, "addr")
								})
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'text', size: '10',
									value: this.state.tokenFilter.name === undefined ? "" : this.state.tokenFilter.name,
									onChange: this.changeTokenFilter.bind(this, "name")
								})
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'text', size: '10',
									value: this.state.tokenFilter.decimals === undefined ? "" : this.state.tokenFilter.decimals,
									onChange: this.changeTokenFilter.bind(this, "decimals")
								})
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'text', size: '5',
									value: this.state.tokenFilter.category === undefined ? "" : this.state.tokenFilter.category,
									onChange: this.changeTokenFilter.bind(this, "category")
								})
							),
							_react2.default.createElement(
								'td',
								{ width: '10%' },
								_react2.default.createElement('input', { type: 'text', size: '10',
									value: this.state.tokenFilter.watched === undefined ? "" : this.state.tokenFilter.watched,
									onChange: this.changeTokenFilter.bind(this, "watched")
								})
							)
						)
					)
				)
			),
			_react2.default.createElement(
				'div',
				{ className: 'TKList' },
				_react2.default.createElement(
					'table',
					{ style: { width: "100%" } },
					_react2.default.createElement(
						'tbody',
						null,
						this.getTokenDisplay()
					)
				)
			)
		);
	}
}

var _initialiseProps = function () {
	this.initializeAvaibleTokens = () => {
		let tokenConfigs = require(this.tokenConfigsFile);
		let availableTokens = tokenConfigs[this.controlPanel.networkID];
		Object.keys(availableTokens).map(key => {
			availableTokens[key] = _extends({}, availableTokens[key], {
				category: "default", watched: this.state.tokenList.includes(key)
			});
		});

		this.state.availableTokens = _extends({}, availableTokens);
	};

	this.componentDidUpdate = (prevProps, prevState) => {
		if (prevState.availableTokens != this.state.availableTokens || prevState.filteredTokens != this.state.filteredTokens || prevState.selectedTokens != this.state.selectedTokens) {
			this.setTokenDisplayAsyc();
		}
		return true;
	};

	this.componentDidMount = () => {
		console.log("Settings: Starting initializing token...");
		setTimeout(this.initializeAvaibleTokens);
		this.setTokenDisplayAsyc();
		console.log("Settings: Finished initializing token.");
	};

	this.handleTokenActionUpdate = action => {
		if (this.state.tokenAction === "Search") {
			this.setState({ tokenFilter: {}, filteredTokens: [] });
		}
		if (this.state.tokenAction === action) {
			this.setState({ tokenAction: "" });
		} else {
			this.setState({ tokenAction: action });
		}
	};

	this.setTokenDisplayAsyc = () => {

		setTimeout(() => {
			let tokenDisplay = this.state.filteredTokens.length === 0 ? Object.keys(this.state.availableTokens).map(key => {
				let token = this.state.availableTokens[key];
				return _react2.default.createElement(
					'tr',
					null,
					_react2.default.createElement(
						'td',
						{
							width: '10%' },
						_react2.default.createElement('input', {
							name: 'check',
							type: 'checkbox',
							checked: this.state.selectedTokens.includes(key),
							onChange: this.checkToken.bind(this, key),
							style: { width: "16px", height: "16px" } })
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						key
					),
					_react2.default.createElement(
						'td',
						{ width: '40%' },
						token.addr
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.name
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.decimals
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.category
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.watched ? "Yes" : "No"
					)
				);
			}) : this.state.filteredTokens.map(token => {
				return _react2.default.createElement(
					'tr',
					null,
					_react2.default.createElement(
						'td',
						{
							width: '10%' },
						_react2.default.createElement('input', {
							name: 'check',
							type: 'checkbox',
							checked: this.state.selectedTokens.includes(token.symbol),
							onChange: this.checkToken.bind(this, token.symbol),
							style: { width: "16px", height: "16px" } })
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.symbol
					),
					_react2.default.createElement(
						'td',
						{ width: '40%' },
						token.addr
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.name
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.decimals
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.category
					),
					_react2.default.createElement(
						'td',
						{ width: '10%' },
						token.watched ? "Yes" : "No"
					)
				);
			});

			this.setState({ tokenDisplay: tokenDisplay });
		});
	};

	this.getTokenDisplay = () => {
		return this.state.tokenDisplay;
	};

	this.changeTokenFilter = (field, event) => {
		let filter = _extends({}, this.state.tokenFilter, { [field]: event.target.value });
		if (event.target.value == "") {
			delete filter[field];
		}

		this.filterTokens(filter);
		this.setState({ tokenFilter: filter });
	};

	this.filterTokens = filter => {
		setTimeout(() => {
			if (Object.keys(filter).length === 0) {
				this.setState({ filteredTokens: [] });
				return;
			}
			let filterTokens = Object.keys(this.state.availableTokens).map(key => {
				return _extends({ symbol: key }, this.state.availableTokens[key]);
			});
			filterTokens = filterTokens.filter(q => {
				return Object.keys(filter).reduce((match, key) => {
					if (typeof q[key] === "boolean") {
						return match && (q[key] ? "Yes" : "No").includes(filter[key]);
					}
					return match && q[key].toString().toLowerCase().includes(filter[key].toLowerCase());
				}, true);
			});
			this.setState({ filteredTokens: filterTokens });
		});
	};

	this.selectedTokensCanBeDeleted = () => {
		if (this.state.selectedTokens.length === 0) {
			return false;
		} else {
			return true;
		}
	};

	this.addToken = tokenToAdd => {
		this.setState({ availableTokens: _extends({}, this.state.availableTokens, { [tokenToAdd.symbol]: tokenToAdd.token }) });

		// udpate the tokenList in BladeIron Server
		this.controlPanel.addToken(tokenToAdd.symbol, tokenToAdd.token.name)(tokenToAdd.token.addr)(tokenToAdd.token.decimals);

		// udpate the tokens in configuration file
		let json = require(this.tokenConfigsFile);
		let availableTokens = json[this.controlPanel.networkID];
		let configWriter = new _ConfigJSONFileWriter2.default(this.tokenConfigsFile);
		availableTokens = _extends({}, availableTokens, { [tokenToAdd.symbol]: { addr: tokenToAdd.token.addr, name: tokenToAdd.token.name, decimals: tokenToAdd.token.decimals }
		});

		this.filterTokens(this.state.tokenFilter);

		//TODO: change it to use addKeyValue in future
		json[this.controlPanel.networkID] = availableTokens;
		configWriter.writeJSON(json);
	};

	this.handleClickAddToken = () => {
		this.addToken(this.state.tokenToAdd);
		this.setState({
			tokenToAdd: {
				symbol: '',
				token: {
					addr: '',
					name: '',
					decimals: "",
					category: 'Customized',
					watched: false
				}
			}
		});
	};

	this.checkToken = (token, event) => {
		if (event.target.checked) {
			if (!this.state.selectedTokens.includes(token)) {
				this.setState({ selectedTokens: [...this.state.selectedTokens, token] });
			}
		} else {
			if (this.state.selectedTokens.includes(token)) {
				let selectedTokens = [...this.state.selectedTokens];
				selectedTokens.splice(selectedTokens.indexOf(token), 1);
				this.setState({ selectedTokens: selectedTokens });
			}
		}
	};

	this.handleClickDeleteToken = () => {

		let selectedTokens = this.state.selectedTokens;
		let stateAvailableTokens = this.state.availableTokens;
		this.state.selectedTokens.map(tokenSymbol => {
			delete stateAvailableTokens[tokenSymbol];
		});

		// udpate the tokenList in BladeIron Server
		this.state.selectedTokens.map(tokenSymbol => {
			this.controlPanel.removeToken(tokenSymbol);
		});

		this.setState({ availableTokens: stateAvailableTokens, selectedTokens: [] });

		// udpate the tokens in configuration file
		let json = require(this.tokenConfigsFile);
		let availableTokens = json[this.controlPanel.networkID];
		let configWriter = new _ConfigJSONFileWriter2.default(this.tokenConfigsFile);
		selectedTokens.map(tokenSymbol => {
			delete availableTokens[tokenSymbol];
		});

		this.filterTokens(this.state.tokenFilter);

		//TODO: change it to use addKeyValue in future
		json[this.controlPanel.networkID] = availableTokens;
		configWriter.writeJSON(json);
	};

	this.handleClickWatchToken = () => {
		let selectedTokens = this.state.selectedTokens;
		selectedTokens.map(token => {
			let availableTokens = this.state.availableTokens;
			if (!availableTokens[token].watched) {
				CastIronActions.watchedTokenUpdate("Add", token);
				availableTokens[token].watched = true;
			}
			this.setState({ availableTokens: availableTokens });
		});

		this.setState({ selectedTokens: [] });

		// udpate the tokens in configuration file
		const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI", "condition", "networkID", "tokens", "watchTokens", "passVault"];
		this.cfgobj = _electron.remote.getGlobal('cfgobj');
		let json = require(path.join(this.cfgobj.configDir, "config.json"));
		let watchTokens = json.watchTokens;
		let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.cfgobj.configDir, "config.json"), castIronFields);
		watchTokens = [...watchTokens, ...selectedTokens];

		this.filterTokens(this.state.tokenFilter);
		CastIronActions.selectedTokenUpdate('');
		CastIronActions.infoUpdate();

		//TODO: change it to use addKeyValue in future
		json.watchTokens = watchTokens;
		castIronWriter.writeJSON(json);
	};

	this.handleClickUnWatchToken = () => {
		this.cfgobj = _electron.remote.getGlobal('cfgobj');
		let json = require(path.join(this.cfgobj.configDir, "config.json"));
		let watchTokens = json.watchTokens;
		let selectedTokens = this.state.selectedTokens;
		selectedTokens.map(token => {
			let availableTokens = this.state.availableTokens;
			if (availableTokens[token].watched) {
				CastIronActions.watchedTokenUpdate("Remove", token);
				availableTokens[token].watched = false;
				if (watchTokens.includes(token)) {
					watchTokens.splice(watchTokens.indexOf(token), 1);
				}
			}
			this.setState({ availableTokens: availableTokens });
		});
		this.setState({ selectedTokens: [] });

		// udpate the tokens in configuration file
		const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI", "condition", "networkID", "tokens", "watchTokens", "passVault"];
		let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.cfgobj.configDir, "config.json"), castIronFields);

		this.filterTokens(this.state.tokenFilter);
		CastIronActions.selectedTokenUpdate('');
		CastIronActions.infoUpdate();

		//TODO: change it to use addKeyValue in future
		json.watchTokens = watchTokens;
		castIronWriter.writeJSON(json);
	};

	this.changeNewTokenField = (field, e) => {
		let tokenToAdd = this.state.tokenToAdd;
		if (field === "symbol") {
			tokenToAdd[field] = e.target.value;
		} else {
			tokenToAdd.token[field] = e.target.value;
		}

		this.setState({ tokenToAdd: tokenToAdd });
	};
};

exports.default = TokenSettingsView;