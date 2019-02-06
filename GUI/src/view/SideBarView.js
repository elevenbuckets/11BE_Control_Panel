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

	updateView = (view) => {
		this.props.updateView(view);
	}

	passAccRef = () => {
		return ReactDOM.findDOMNode(this.refs.Accounts).firstChild;
	}

	render() {
		//console.log("In MainView render()");
		return (
			<div className="sidebar">
				<div className="item" style={{ margin: '7px' }}>
					<img src="assets/icon/11be_logo.png" style={{ width: '80px', alignSelf: 'right' }} />
				</div>
				<div className="sidebarButton" style={{ color: this.props.currentView === 'Receipts' ? '#ff4200' : 'white' }}
					onClick={this.updateView.bind(this, 'Receipts')}>Receipts</div>
				<div className="sidebarButton" style={{ color: this.props.currentView === 'TokenSettings' ? '#ff4200' : 'white' }}
					onClick={this.updateView.bind(this, 'TokenSettings')}>Tokens</div>
				<div className="sidebarButton" style={{ color: this.props.currentView === 'AppLauncher' ? '#ff4200' : 'white' }}
					onClick={this.updateView.bind(this, 'AppLauncher')}>App Store</div>
				<div className="sidebarButton" style={{ color: this.props.currentView === 'AccountManager' ? '#ff4200' : 'white' }}
					onClick={this.updateView.bind(this, 'AccountManager')}>Accounts</div>
			</div>
		)

	}
}

export default SideBarView;

