'use strict';

// Major third-party modules
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';

// Reflux store
import ControlPanelStore from '../store/ControlPanelStore';

// Reflux actions
import ControlPanelActions from '../action/ControlPanelActions';

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

	}

	updateState = (key, view) => {
		this.setState({ [key]: view });
	}

	passAccRef = () => {
		return ReactDOM.findDOMNode(this.refs.Accounts).firstChild;
	}

	render() {
		console.log("In MainView render(); syncInProgress = " + this.state.syncInProgress);
		if (this.state.connected === false) {
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
					<div className="item version" style={{border: "5px solid #34475c", borderRadius: '0px', borderRight: "1px solid white"}}>
						<p> Platform Ver : </p><p style={{color: "rgba(250,250,250,0.66)"}}> {this.state.version} </p>
					</div>
					<div className="content">
						{this.state.currentView == "TokenSettings" ? <TokenSettingsView />
							: this.state.currentView == "AppLauncher" ? <AppLauncherView /> 
							: this.state.currentView == "AccountManager"? <AccountsView/>: <ReceiptsView />}
					</div>
					<States />
				</div>
			)
		}
	}
}

export default MainView;

