'use strict';

// Major third-party modules
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
const ipcRenderer = require('electron').ipcRenderer;
import path from 'path';

// Reflux store
import ControlPanelStore from '../store/ControlPanelStore';

// Reflux actions
import ControlPanelActions from '../action/ControlPanelActions';

// Service
import ConfigWriterService from '../service/ConfigWriterService';

// Views
import SideBarView from './SideBarView'
import ReceiptsView from './ReceiptsView';
import TokenSettingsView from './TokenSettingsView';
import AppLauncherView from './AppLauncherView';
import States from './States';
import Login from './Login';
import AccountsView from './AccountsView';

class MainView extends Reflux.Component {
	constructor(props) {
		super(props);
		this.store = ControlPanelStore;
		// this.controlPanel = remote.getGlobal("controlPanel");
		// this.controlPanel.client.subscribe('newJobs');
		// this.controlPanel.client.on('newJobs', this.handleNewJobs);
		// this.controlPanel.syncTokenInfo();
		this.state = {
			currentView: "AppLauncher"
		}

		this.storeKeys = [
			"unlocked",
			"currentView",
			"modalIsOpen",
			"scheduleModalIsOpen",
			"retrying",
			"rpcfailed",
			"configured",
			"userCfgDone",
			"syncInProgress",
			"blockHeight",
			"highestBlock",
			"version"
		];

	}

	updateState = (key, view) => {
		this.setState({ [key]: view });
	}

	updateStateForEvent = (key, e) => {
		this.setState({ [key]: e.target.value });
	}

	passAccRef = () => {
		return ReactDOM.findDOMNode(this.refs.Accounts).firstChild;
	}

	relaunch = () => { ipcRenderer.send('reload', true); };

	setupdone = () => {
		// confine config fields
		const mainFields = ["configDir"];
		const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI",
			"condition", "networkID", "tokens", "watchTokens", "passVault"];
		const ipfsFields = ["lockerpathjs", "repoPathJs", "lockerpathgo", "repoPathGo", "ipfsBinary"];

		// ConfigWriter instances
		let mainWriter = ConfigWriterService.getFileWriter("../../../.local/bootstrap_config.json", mainFields);
		let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.state.defaultCfgDir + "/config.json"), castIronFields);
		let ipfsWriter = ConfigWriterService.getFileWriter(path.join(this.state.defaultCfgDir, "/ipfsserv.json"), ipfsFields);

		// internal config update
		let mainJson = { "configDir": this.state.defaultCfgDir };
		mainWriter.writeJSON(mainJson);

		// castiron config update
		let castIronJson = {
			"datadir": this.state.defaultDataDir,
			"rpcAddr": "http://127.0.0.1:8545",
			"ipcPath": path.join(this.state.defaultDataDir, "geth.ipc"),
			"defaultGasPrice": "20000000000",
			"gasOracleAPI": "https://ethgasstation.info/json/ethgasAPI.json",
			"condition": "sanity",
			"networkID": this.state.defaultNetID,
			"passVault": path.join(this.state.defaultCfgDir, "myArchive.bcup"),
			"tokens": {},
			"watchTokens": []
		}

		castIronWriter.writeJSON(castIronJson);

		// ipfs config update
		let ipfsJson = {
			"lockerpathjs": path.join(this.state.defaultCfgDir, ".ipfslock"),
			"lockerpathgo": path.join(this.state.defaultCfgDir, ".ipfslock_go"),
			"repoPathGo": this.state.defaultRepoDir
		}

		ipfsWriter.writeJSON(ipfsJson);

		this.setState({ userCfgDone: true })
	};


	render() {
		console.log("In MainView render(); syncInProgress = " + this.state.syncInProgress);
		if (this.state.configured === false) {
			document.body.style.background = "linear-gradient(-120deg, rgb(17, 31, 47), rgb(24, 156, 195))";
			return (
				<div className="container locked" style={{ background: "none" }}>
					<div className="item list" style={{ background: "none" }}>
						<div style={{ border: "2px solid white", padding: "20px", textAlign: "center", background: "none" }}>
							<p style={{ alignSelf: "flex-end", fontSize: "20px" }}>
								Welcome, dApp developers!
				</p><br />
							<p style={{ alignSelf: "flex-end", fontSize: "20px" }}>
								Thank you for trying out ElevenBuckets Environment (11BE)!
				</p><br />
							<p style={{ alignSelf: "flex-end", fontSize: "20px" }}>
								Please setup the following paths to continue:
				</p><br />
							<Login updateState={this.updateStateForEvent}
								defaultCfgDir={this.state.defaultCfgDir}
								defaultDataDir={this.state.defaultDataDir}
								defaultNetID={this.state.defaultNetID}
								defaultRepoDir={this.state.defaultRepoDir}
							/>
							{
								this.state.userCfgDone ? <input style={{ marginTop: "25px" }}
									type="button" className="button reload" style={{ color: "white" }} value="restart" onClick={this.relaunch} />
									: <input style={{ marginTop: "25px" }}
										type="button" className="button reload"  style={{ color: "white" }} value="confirm" onClick={this.setupdone} />
							}
						</div>
					</div>
				</div>
			);
		} else if (this.state.connected === false) {
			document.body.style.background = "rgb(17, 31, 47)";
			return (
				<div className="container locked" style={{ background: "rgb(17, 31, 47)" }}>
					<div className="item list" style={{ background: "none" }}>
						<div style={{ border: "2px solid white", padding: "40px", textAlign: "center" }}>
							<div className="loader syncpage"></div><br />
							<p style={{ alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" }}>
								Lost local Ethereum node connection ...
						</p>
						</div>
					</div>
				</div>
			);
		} else if (this.state.wait4peers === true) {
			document.body.style.background = "rgb(17, 31, 47)";
			return (
				<div className="container locked" style={{ background: "rgb(17, 31, 47)" }}>
					<div className="item list" style={{ background: "none" }}>
						<div style={{ border: "2px solid white", padding: "40px", textAlign: "center" }}>
							<div className="loader syncpage"></div><br />
							<p style={{ alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" }}>
								Awaiting incomming blocks from peers ...
						</p>
						</div>
					</div>
				</div>
			);
		} else if (this.state.syncInProgress === true) {
			document.body.style.background = "linear-gradient(-180deg, rgb(17, 31, 47), rgb(24, 156, 195))";
			return (
				<div className="container locked" style={{ background: "none" }}>
					<div className="item list" style={{ background: "none" }}>
						<div style={{ border: "2px solid white", padding: "40px", textAlign: "center" }}>
							<div className="loader"></div><br />
							<p style={{ alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" }}>
								Block syncing in progress {this.state.blockHeight} / {this.state.highestBlock} ...
						</p>
						</div>
					</div>
				</div>
			);
		} else if (this.state.unlocked === false) {
			document.body.style.background = "url(./assets/blockwall.png)";
			return (
				<div className="container locked">
					<States />
					<Login />
				</div>
			);
		}
		else {
			document.body.style.background = "#f4f0fa";
			return (
				<div className="wrapper">
					<SideBarView currentView={this.state.currentView} updateView={this.updateState.bind(this, "currentView")} />
					<div className="item version" style={{ border: "5px solid #34475c", borderRadius: '0px', borderRight: "1px solid white" }}>
						<p> Platform Ver : </p><p style={{ color: "rgba(250,250,250,0.66)" }}> {this.state.version} </p>
					</div>
					<div className="content">
						{this.state.currentView == "TokenSettings" ? <TokenSettingsView />
							: this.state.currentView == "AppLauncher" ? <AppLauncherView />
								: this.state.currentView == "AccountManager" ? <AccountsView /> : <ReceiptsView />}
					</div>
					<States />
				</div>
			)
		}
	}
}

export default MainView;

