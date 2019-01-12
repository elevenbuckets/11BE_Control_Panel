'use strict';

// Major third-party modules
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
import {remote} from 'electron'

// Reflux store
import ControlPanelStore from '../store/ControlPanelStore';

// Reflux actions
import ControlPanelActions from '../action/ControlPanelActions';

// Views
import SideBarView from './SideBarView'
import ReceiptsView from './ReceiptsView';

class MainView extends Reflux.Component {
	constructor(props) {
		super(props);
		this.store = ControlPanelStore;
		this.controlPanel = remote.getGlobal("controlPanel");
		console.log("subscribing New jobs in Mainview");
		this.controlPanel.client.subscribe('newJobs');
		this.controlPanel.client.on('newJobs', this.handleNewJobs);  
	}

	updateState = (key, e) => {
		this.setState({ [key]: e.target.value });
	}

	passAccRef = () => {
		return ReactDOM.findDOMNode(this.refs.Accounts).firstChild;
	}

	handleNewJobs = (obj)=>{
		ControlPanelActions.newJobs(obj);	
	} 

	render() {
		console.log("In MainView render()");


		document.body.style.background = "#f4f0fa";
		return (
			<div className="wrapper">
				<SideBarView />
				<div className="content">
					<ReceiptsView />
				</div>
			</div>
		)

	}
}

export default MainView;

