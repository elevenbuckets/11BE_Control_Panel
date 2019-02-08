"use strict";
// Third-parties
import React, { Component } from 'react';
import Reflux from 'reflux';
import { remote } from 'electron';
import fs from 'fs';

// Reflux store
import ControlPanelStore from '../store/ControlPanelStore';
import ControlPanelActions from '../action/ControlPanelActions';

// Modals
import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser';

class AccountsView extends AlertModalUser {
	constructor(props) {
		super(props);
		this.store = ControlPanelStore;
        
        
		this.state = {
			reveal: false,
			reveal2: false,
			waiting: false,
            currentAccSettings: 'old'
		}
		this.storeKeys = [
		];
	this.accMgr = remote.getGlobal('controlPanel').accMgr;
        this.keypath = undefined;
		this.variable = undefined;
	}

    handleNewAcct = (event) => {
		let stage = Promise.resolve();
		let pw = this.variable;
		this.variable = undefined;

		if (typeof (pw) === 'undefined' || pw.length === 0) {
			this.setState({ waiting: false });
			this.openModal("Creation Failed");
			return false;
		}

		stage
			.then(() => {
				return this.setState({ waiting: true })
			})
			.then(() => {
				return this.updateNew(pw);
			});
    }

    updateNew = (pw) => {
		console.log("calling update now");
		return this.accMgr.newAccount(pw).then((address) => {
			this.setState({ waiting: false });
			this.openModal("New Address: " + address);
		})
			.catch((err) => {
				this.setState({ waiting: false });
				this.openModal("Creation Failed");
			});
	}
    
    handleAccChange = (tabName) => {
        this.setState({ currentAccSettings: tabName });
    }

    updatePath = (event) => {
		console.log(this.refs.vif.files[0].path);
		this.keypath = this.refs.vif.files[0].path;
    }
    
    updateVar = (event) => {
		this.variable = event.target.value;
    }
    
	handleReveal = (event) => {
		this.setState({ reveal: !this.state.reveal });
    }

    handleReveal2 = (event) => {
		this.setState({ reveal2: !this.state.reveal2 });
	}
    
    handleImport = (event) => {
		let kp = this.keypath;
		let pw = this.variable;
		this.keypath = undefined;
		this.variable = undefined;

		// sanity check
		if (!fs.existsSync(kp) || typeof (kp) === 'undefined') {
			this.setState({ waiting: false });
			this.openModal("Import Failed!");
			return false;
		} else {
			console.log("Importing " + kp);
			this.setState({ waiting: true });
		}

		this.accMgr.importFromJSON(kp, pw).then((r) => {
			this.accMgr.update(r.keyObj, r.password).then((address) => {
				r = {};
				this.setState({ waiting: false });
				this.openModal("Imported Address: " + address);
			});
		})
			.catch((err) => {
				this.setState({ waiting: false });
				this.openModal("Import Failed!");
			})
	}

    accountMgr = () => {
		if (this.state.waiting === true) {
			return (
				<div className="item newAccTab">
					<p className="item nawaiting">Please Wait ...</p>
				</div>
			)
		} else {
			const __oldAcc = () => {
				return (
					<div className="item newAccTab">
						<p className="item nafile">Please Select File:
				      		<input ref="vif" style={{ margin: '15px' }} type='file' onChange={this.updatePath} />
						</p>
						<p className="natitle">Please Enter Password of The Account:</p>
						<input ref="vip1" className="napass" type={this.state.reveal ? "text" : "password"} defaultValue='' onChange={this.updateVar} />
						<input type="button" style={{ margin: "15px" }} className="button nareveal" value={this.state.reveal ? "Hide" : "Reveal"} onClick={this.handleReveal} />
						<input type="button" style={{ margin: "15px" }} className='button nacreate' value='Import' onClick={this.handleImport} />
					</div>
				)
			}

			const __newAcc = () => {
				return (
					<div className="item newAccTab">
						<p className="natitle" >Please Enter Password For New Account:</p>
						<input ref="vip2" className="napass" type={this.state.reveal2 ? "text" : "password"} defaultValue='' onChange={this.updateVar} />
						<input type="button" style={{ margin: "15px" }} className="button nareveal" value={this.state.reveal2 ? "Hide" : "Reveal"} onClick={this.handleReveal2} />
						<input type="button" style={{ margin: "15px" }}
							className='button nacreate'
							value='Create'
							onClick={this.handleNewAcct} />
					</div>
				)
            }
            


			return (
				<div className="item accMgr">
					<fieldset className="accSettings">
						<legend className="item accTabs">
							<input type="button" className="button tabset" value="Create New Account" style=
								{{
									backgroundColor: this.state.currentAccSettings === 'new' ? "#f4f0fa" : "rgba(0,0,0,0)",
									color: this.state.currentAccSettings === 'new' ? "#34475c" : "#cccccc"
								}}
								onClick={this.handleAccChange.bind(this, "new")} />
							<input type="button" className="button tabset" value="Import Existing Account" style=
								{{
									backgroundColor: this.state.currentAccSettings === 'old' ? "#f4f0fa" : "rgba(0,0,0,0)",
									color: this.state.currentAccSettings === 'old' ? "#34475c" : "#cccccc"
								}}
								onClick={this.handleAccChange.bind(this, "old")} />
						</legend>
						{this.state.currentAccSettings === 'new' ? __newAcc()
							: this.state.currentAccSettings === 'old' ? __oldAcc()
								: this.setState({ currentAccSettings: 'old' })}
                    </fieldset>
                    <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
				</div>
			)
		}
	}

	

	render() {
		console.log("in AccountsView render()");
		return this.accountMgr();
	}
}

export default AccountsView;
