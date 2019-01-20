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

class SideBarView extends Reflux.Component {
	constructor(props) {
		super(props);
		this.store = ControlPanelStore;
	}

	updateState = (key, e) => {
		this.setState({ [key]: e.target.value });
	}

	passAccRef = () => {
		return ReactDOM.findDOMNode(this.refs.Accounts).firstChild;
	}

	updateView = view =>{
		this.props.updateView(view);
	}

	render() {
		console.log("In MainView render()");
		return (
            <div className="sidebar">
            <input type="button" className="sidebarButton" value="Receipts" onClick={this.updateView}/>
			<input type="button" className="sidebarButton" value="TokenSettings" onClick={this.updateView}/>
			<input type="button" className="sidebarButton" value="AppLauncher" onClick={this.updateView}/>
            </div>
		)

	}
}

export default SideBarView;

