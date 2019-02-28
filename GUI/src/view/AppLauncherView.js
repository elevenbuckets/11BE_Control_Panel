'use strict'
import ControlPanelActions from '../action/ControlPanelActions'
import React from 'react';
import Reflux from 'reflux';

// Reflux store
import ControlPanelStore from "../store/ControlPanelStore";

class AppLauncherView extends Reflux.Component {
	constructor(props) {
		super(props);
		this.store = ControlPanelStore;
		this.storeKeys = [
			"rpcHost"
		];
	}


	launchApp = (appName) => {
		const path = require('path');

		const gui = Promise.resolve();

		return gui.then(() => {
			const spawn = require('child_process').spawn;
			let cwd = process.cwd();
			cwd = path.join(cwd, "../../..")
			let topdir = path.join(cwd, 'dapps', appName, 'GUI');
			let configDir = require(path.join(cwd, '.local', 'bootstrap_config.json')).configDir;
			let rpchost = this.state.rpcHost;

			// const subprocess = spawn(path.join(topdir, 'node_modules', '.bin', 'electron'), ['.'], {
			// 	cwd: topdir,
			// 	env: { DISPLAY: process.env.DISPLAY, XAUTHORITY: process.env.XAUTHORITY, configDir, PATH: process.env.PATH, rpchost },
			// 	detached: true,
			// 	stdio: 'ignore'
			// });
			const subprocess = spawn(path.join(cwd, 'node_modules', '.bin', 'bladecli') , [appName + " autoGUI:true"] , {
				cwd: cwd,
				env: { DISPLAY: process.env.DISPLAY, XAUTHORITY: process.env.XAUTHORITY, configDir, PATH: process.env.PATH, rpchost },
				detached: true,
				stdio: 'ignore',
				shell: true
			});
			subprocess.unref();

			return true;
		})

	}

	getDappIcons = () => {
		let dapps = ["Wallet", "Erebor"]

		return dapps.map((key) => {
			let src = "../dapps/" + key + "/icon.png";
			return (<div className="card appcard" onClick={this.launchApp.bind(this, key)}>
				<img src={src} className="cardicon" />
				<p className="cardtext">{key}</p>
			</div>)
		})
	}


	render = () => {
		console.log("in render() of Drawer")
		return (
			<div className="dAppsViewInner">
				<div className="appHolder">
					{this.getDappIcons()}
				</div>
			</div>
		)
	}
}

export default AppLauncherView;
