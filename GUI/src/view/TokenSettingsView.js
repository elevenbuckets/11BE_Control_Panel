"use strict";
// Third-parties
import React, { Component } from 'react';
import Reflux from 'reflux';
import { remote } from 'electron';

import ConfigWriter from 'ConfigWriter/build/ConfigJSONFileWriter';

// Reflux store
import ControlPanelStore from '../store/ControlPanelStore';
import ControlPanelActions from '../action/ControlPanelActions';

class TokenSettingsView extends Reflux.Component {
	constructor(props) {
		super(props);
		this.store = ControlPanelStore;
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
			tokenDisplay: [],
		}

		this.storeKeys = [
			"tokenList",
			"watchedTokenSymbolList"
		];
		this.controlPanel = remote.getGlobal("controlPanel");
		let path = require("path");
		this.tokenConfigsFile = path.join(this.controlPanel.topDir, "Tokens.json");
	}

	initializeAvaibleTokens = () => {
		let tokenConfigs = require(this.tokenConfigsFile);
		let availableTokens = tokenConfigs[this.controlPanel.networkID];
		Object.keys(availableTokens).map((key) => {
			availableTokens[key] = {
				...availableTokens[key],
				category: "default", watched: this.state.tokenList.includes(key)
			}
		})

		this.state.availableTokens = { ...availableTokens };
	}


	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.availableTokens != this.state.availableTokens || prevState.filteredTokens != this.state.filteredTokens ||
			prevState.selectedTokens != this.state.selectedTokens) {
			this.setTokenDisplayAsyc();
		}
		return true;
	}

	componentDidMount = () => {
		console.log("Settings: Starting initializing token...");
		setTimeout(this.initializeAvaibleTokens);
		this.setTokenDisplayAsyc();
		console.log("Settings: Finished initializing token.")
	}

	handleTokenActionUpdate = (action) => {
		if (this.state.tokenAction === "Search") {
			this.setState({ tokenFilter: {}, filteredTokens: [] })
		}
		if (this.state.tokenAction === action) {
			this.setState({ tokenAction: "" })
		} else {
			this.setState({ tokenAction: action })
		}

	}

	setTokenDisplayAsyc = () => {

		setTimeout(() => {
			let tokenDisplay = this.state.filteredTokens.length === 0 ? Object.keys(this.state.availableTokens).filter(key => {
				return key != "ETH"
			}).map((key) => {
				let token = this.state.availableTokens[key];
				return (
					<tr>
						<td
							width='10%'><input
								name="check"
								type="checkbox"
								checked={this.state.selectedTokens.includes(key)}
								onChange={this.checkToken.bind(this, key)}
								style={{ width: "16px", height: "16px" }} /></td>
						<td width='10%'>{key}</td>
						<td width='40%'>{token.addr}</td>
						<td width='10%'>{token.name}</td>
						<td width='10%'>{token.decimals}</td>
						<td width='10%'>{token.category}</td>
						<td width='10%'>{this.state.watchedTokenSymbolList.includes(key) ? "Yes" : "No"}</td>

					</tr>
				);
			}) : this.state.filteredTokens.filter(token => {
				return token.symbol != "ETH"
			}).map((token) => {
				return (
					<tr>
						<td
							width='10%'><input
								name="check"
								type="checkbox"
								checked={this.state.selectedTokens.includes(token.symbol)}
								onChange={this.checkToken.bind(this, token.symbol)}
								style={{ width: "16px", height: "16px" }} /></td>
						<td width='10%'>{token.symbol}</td>
						<td width='40%'>{token.addr}</td>
						<td width='10%'>{token.name}</td>
						<td width='10%'>{token.decimals}</td>
						<td width='10%'>{token.category}</td>
						<td width='10%'>{this.state.watchedTokenSymbolList.includes(token.symbol) ? "Yes" : "No"}</td>

					</tr>
				);
			})

			this.setState({ tokenDisplay: tokenDisplay })
		})

	}
	getTokenDisplay = () => {
		return this.state.tokenDisplay;
	}

	changeTokenFilter = (field, event) => {
		let filter = { ...this.state.tokenFilter, [field]: event.target.value }
		if (event.target.value == "") {
			delete filter[field];
		}

		this.filterTokens(filter);
		this.setState({ tokenFilter: filter });

	}

	filterTokens = (filter) => {
		setTimeout(() => {
			if (Object.keys(filter).length === 0) {
				this.setState({ filteredTokens: [] });
				return;
			}
			let filterTokens = Object.keys(this.state.availableTokens).map((key) => {
				return { symbol: key, ...this.state.availableTokens[key] }
			})
			filterTokens = filterTokens.filter(q => {
				return Object.keys(filter).reduce((match, key) => {
					if (typeof (q[key]) === "boolean") {
						return match && (q[key] ? "Yes" : "No").includes(filter[key]);
					}
					return match && q[key].toString().toLowerCase().includes(filter[key].toLowerCase());
				}, true)
			})
			this.setState({ filteredTokens: filterTokens });
		})

	}

	selectedTokensCanBeDeleted = () => {
		if (this.state.selectedTokens.length === 0) {
			return false;
		} else {
			return true;
		}
	}

	addToken = tokenToAdd => {
		this.setState({ availableTokens: { ...this.state.availableTokens, [tokenToAdd.symbol]: tokenToAdd.token } });

		// udpate the tokenList in BladeIron Server
		this.controlPanel.addToken(tokenToAdd.symbol, tokenToAdd.token.name)(tokenToAdd.token.addr)(tokenToAdd.token.decimals);

		// udpate the tokens in configuration file
		let json = require(this.tokenConfigsFile)
		let availableTokens = json[this.controlPanel.networkID];
		let configWriter = new ConfigWriter(this.tokenConfigsFile);
		availableTokens = {
			...availableTokens, [tokenToAdd.symbol]:
				{ addr: tokenToAdd.token.addr, name: tokenToAdd.token.name, decimals: tokenToAdd.token.decimals }
		};

		this.filterTokens(this.state.tokenFilter);

		//TODO: change it to use addKeyValue in future
		json[this.controlPanel.networkID] = availableTokens;
		configWriter.writeJSON(json);
	}

	handleClickAddToken = () => {
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
	}

	checkToken = (token, event) => {
		if (event.target.checked) {
			if (!this.state.selectedTokens.includes(token)) {
				this.setState({ selectedTokens: [...this.state.selectedTokens, token] })
			}
		} else {
			if (this.state.selectedTokens.includes(token)) {
				let selectedTokens = [...this.state.selectedTokens];
				selectedTokens.splice(selectedTokens.indexOf(token), 1);
				this.setState({ selectedTokens: selectedTokens })
			}

		}
	}

	handleClickDeleteToken = () => {

		let selectedTokens = this.state.selectedTokens;
		let stateAvailableTokens = this.state.availableTokens;
		this.state.selectedTokens.map((tokenSymbol) => {
			delete stateAvailableTokens[tokenSymbol];
		})

		// udpate the tokenList in BladeIron Server
		this.state.selectedTokens.map((tokenSymbol) => {
			this.controlPanel.removeToken(tokenSymbol);
		})

		this.setState({ availableTokens: stateAvailableTokens, selectedTokens: [] });

		// udpate the tokens in configuration file
		let json = require(this.tokenConfigsFile);
		let availableTokens = json[this.controlPanel.networkID];
		let configWriter = new ConfigWriter(this.tokenConfigsFile);
		selectedTokens.map((tokenSymbol) => {
			delete availableTokens[tokenSymbol];
		})

		this.filterTokens(this.state.tokenFilter);

		//TODO: change it to use addKeyValue in future
		json[this.controlPanel.networkID] = availableTokens;
		configWriter.writeJSON(json);
	}
	handleClickWatchToken = () => {
		let selectedTokens = this.state.selectedTokens;
		selectedTokens.map((token) => {
			let availableTokens = this.state.availableTokens;
			if (!availableTokens[token].watched) {
				// CastIronActions.watchedTokenUpdate("Add", token);
				availableTokens[token].watched = true;
			}
			this.setState({ availableTokens: availableTokens });
		})
		let watchedTokenSymbolList = [...this.state.watchedTokenSymbolList];
		watchedTokenSymbolList = [...watchedTokenSymbolList, ...selectedTokens];

		this.controlPanel.watchTokens(watchedTokenSymbolList).then((rc) => {
			this.controlPanel.syncTokenInfo().then((info) =>{
				ControlPanelActions.watchedTokenUpdate(Object.keys(this.controlPanel.TokenInfo));
				this.setState({ selectedTokens: [] });
			})
		})

		

		// // udpate the tokens in configuration file
		// const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI",
		// 	"condition", "networkID", "tokens", "watchTokens", "passVault"];
		// this.cfgobj = remote.getGlobal('cfgobj');
		// let json = require(path.join(this.cfgobj.configDir, "config.json"))
		// let watchTokens = json.watchTokens;
		// let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.cfgobj.configDir, "config.json"), castIronFields);
		// watchTokens = [...watchTokens, ...selectedTokens];

		// this.filterTokens(this.state.tokenFilter);
		// CastIronActions.selectedTokenUpdate('');
		// CastIronActions.infoUpdate();

		// //TODO: change it to use addKeyValue in future
		// json.watchTokens = watchTokens;
		// castIronWriter.writeJSON(json);


	}

	handleClickUnWatchToken = () => {
		let selectedTokens = this.state.selectedTokens;
		let watchedTokenSymbolList = [...this.state.watchedTokenSymbolList];
		selectedTokens.map((token) => {
			let availableTokens = this.state.availableTokens;
			if (availableTokens[token].watched) {
				// CastIronActions.watchedTokenUpdate("Remove", token);
				availableTokens[token].watched = false;
			}
			if (watchedTokenSymbolList.includes(token)) {
				watchedTokenSymbolList.splice(watchedTokenSymbolList.indexOf(token), 1);
			}
			this.setState({ availableTokens: availableTokens });
		})

		this.controlPanel.unwatchTokens(selectedTokens).then((rc) => {
			this.controlPanel.syncTokenInfo().then((info) =>{
				ControlPanelActions.watchedTokenUpdate(Object.keys(this.controlPanel.TokenInfo));
				this.setState({ selectedTokens: [] });
			})
		})

		



		// // udpate the tokens in configuration file
		// const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI",
		// 	"condition", "networkID", "tokens", "watchTokens", "passVault"];
		// let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.cfgobj.configDir, "config.json"), castIronFields);

		// this.filterTokens(this.state.tokenFilter);
		// CastIronActions.selectedTokenUpdate('');
		// CastIronActions.infoUpdate();

		// //TODO: change it to use addKeyValue in future
		// json.watchTokens = watchTokens;
		// castIronWriter.writeJSON(json);
	}

	changeNewTokenField = (field, e) => {
		let tokenToAdd = this.state.tokenToAdd;
		if (field === "symbol") {
			tokenToAdd[field] = e.target.value;
		} else {
			tokenToAdd.token[field] = e.target.value;
		}

		this.setState({ tokenToAdd: tokenToAdd })
	}

	render() {
		console.log("in TokenSettingsView render()");
		return (
			<div>
				<div className="tokenAction">

					<input type="button" className="button tokenActionButtonNew" value='New' onClick={this.handleTokenActionUpdate.bind(this, "New")} />
					<input type="button" className="button tokenActionButtonSearch" value='Search' onClick={this.handleTokenActionUpdate.bind(this, "Search")} />
					<input type="button" className="button tokenActionButtonDelete" value='Delete' disabled={!this.selectedTokensCanBeDeleted()}
						onClick={this.handleClickDeleteToken} />
					<input type="button" className="button tokenActionButtonWatch" value='Watch'
						disabled={this.state.selectedTokens.length === 0} onClick={this.handleClickWatchToken} />
					<input type="button" className="button tokenActionButtonUnWatch" value='UnWatch'
						disabled={this.state.selectedTokens.length === 0} onClick={this.handleClickUnWatchToken} />

					<br style={{ border: '2px solid white' }} />
					<table className="tokenTitleTable">
						<tbody>
							<tr>
								<td width='10%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Select</td>
								<td width='10%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Symbol</td>
								<td width='40%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Address</td>
								<td width='10%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Name</td>
								<td width='10%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Decimals</td>
								<td width='10%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Catgory</td>
								<td width='10%'>Watched</td>
							</tr>
							<tr hidden={!(this.state.tokenAction === "New")} style={{ backgroundColor: "rgb(34, 169, 202)" }}>
								<td width='10%'>N/A</td>
								<td width='10%'><input type='text' size='3'
									value={this.state.tokenToAdd.symbol === undefined ? "" : this.state.tokenToAdd.symbol}
									onChange={this.changeNewTokenField.bind(this, "symbol")}
								/></td>
								<td width='40%'><input type='text' size='20'
									value={this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.addr}
									onChange={this.changeNewTokenField.bind(this, "addr")}
								/></td>
								<td width='10%'><input type='text' size='10'
									value={this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.name}
									onChange={this.changeNewTokenField.bind(this, "name")}
								/></td>
								<td width='10%'><input type='text' size='10'
									value={this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.decimals}
									onChange={this.changeNewTokenField.bind(this, "decimals")}
								/></td>
								<td width='10%'></td>
								<td width='10%'><input type='button'
									className="button" value='Add'
									style={{ height: '23px', backgroundColor: 'rgba(0,0,0,0)', fontSize: '13px', fontWeight: 'bold' }}
									onClick={this.handleClickAddToken}
								/></td>

							</tr>
							<tr hidden={!(this.state.tokenAction === "Search")}>
								<td width='10%'>N/A</td>
								<td width='10%'><input type='text' size='3'
									value={this.state.tokenFilter.symbol === undefined ? "" : this.state.tokenFilter.symbol}
									onChange={this.changeTokenFilter.bind(this, "symbol")}
								/></td>
								<td width='40%'><input type='text' size='20'
									value={this.state.tokenFilter.addr === undefined ? "" : this.state.tokenFilter.addr}
									onChange={this.changeTokenFilter.bind(this, "addr")}
								/></td>
								<td width='10%'><input type='text' size='10'
									value={this.state.tokenFilter.name === undefined ? "" : this.state.tokenFilter.name}
									onChange={this.changeTokenFilter.bind(this, "name")}
								/></td>
								<td width='10%'><input type='text' size='10'
									value={this.state.tokenFilter.decimals === undefined ? "" : this.state.tokenFilter.decimals}
									onChange={this.changeTokenFilter.bind(this, "decimals")}
								/></td>
								<td width='10%'><input type='text' size='5'
									value={this.state.tokenFilter.category === undefined ? "" : this.state.tokenFilter.category}
									onChange={this.changeTokenFilter.bind(this, "category")}
								/></td>
								<td width='10%'><input type='text' size='10'
									value={this.state.tokenFilter.watched === undefined ? "" : this.state.tokenFilter.watched}
									onChange={this.changeTokenFilter.bind(this, "watched")}
								/></td>

							</tr>
						</tbody>
					</table>
				</div>

				<div className="TKList">
					<table style={{ width: "100%" }}>
						<tbody>
							{this.getTokenDisplay()}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}

export default TokenSettingsView;