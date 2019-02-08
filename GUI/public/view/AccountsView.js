"use strict";
// Third-parties

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _electron = require('electron');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ControlPanelStore = require('../store/ControlPanelStore');

var _ControlPanelStore2 = _interopRequireDefault(_ControlPanelStore);

var _ControlPanelActions = require('../action/ControlPanelActions');

var _ControlPanelActions2 = _interopRequireDefault(_ControlPanelActions);

var _AlertModal = require('../components/AlertModal');

var _AlertModal2 = _interopRequireDefault(_AlertModal);

var _AlertModalUser = require('../common/AlertModalUser');

var _AlertModalUser2 = _interopRequireDefault(_AlertModalUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Modals


// Reflux store
class AccountsView extends _AlertModalUser2.default {
	constructor(props) {
		super(props);

		this.handleNewAcct = event => {
			let stage = Promise.resolve();
			let pw = this.variable;
			this.variable = undefined;

			if (typeof pw === 'undefined' || pw.length === 0) {
				this.setState({ waiting: false });
				this.openModal("Creation Failed");
				return false;
			}

			stage.then(() => {
				return this.setState({ waiting: true });
			}).then(() => {
				return this.updateNew(pw);
			});
		};

		this.updateNew = pw => {
			console.log("calling update now");
			return this.accMgr.newAccount(pw).then(address => {
				this.setState({ waiting: false });
				this.openModal("New Address: " + address);
			}).catch(err => {
				this.setState({ waiting: false });
				this.openModal("Creation Failed");
			});
		};

		this.handleAccChange = tabName => {
			this.setState({ currentAccSettings: tabName });
		};

		this.updatePath = event => {
			console.log(this.refs.vif.files[0].path);
			this.keypath = this.refs.vif.files[0].path;
		};

		this.updateVar = event => {
			this.variable = event.target.value;
		};

		this.handleReveal = event => {
			this.setState({ reveal: !this.state.reveal });
		};

		this.handleReveal2 = event => {
			this.setState({ reveal2: !this.state.reveal2 });
		};

		this.handleImport = event => {
			let kp = this.keypath;
			let pw = this.variable;
			this.keypath = undefined;
			this.variable = undefined;

			// sanity check
			if (!_fs2.default.existsSync(kp) || typeof kp === 'undefined') {
				this.setState({ waiting: false });
				this.openModal("Import Failed!");
				return false;
			} else {
				console.log("Importing " + kp);
				this.setState({ waiting: true });
			}

			this.accMgr.importFromJSON(kp, pw).then(r => {
				this.accMgr.update(r.keyObj, r.password).then(address => {
					r = {};
					this.setState({ waiting: false });
					this.openModal("Imported Address: " + address);
				});
			}).catch(err => {
				this.setState({ waiting: false });
				this.openModal("Import Failed!");
			});
		};

		this.accountMgr = () => {
			if (this.state.waiting === true) {
				return _react2.default.createElement(
					'div',
					{ className: 'item newAccTab' },
					_react2.default.createElement(
						'p',
						{ className: 'item nawaiting' },
						'Please Wait ...'
					)
				);
			} else {
				const __oldAcc = () => {
					return _react2.default.createElement(
						'div',
						{ className: 'item newAccTab' },
						_react2.default.createElement(
							'p',
							{ className: 'item nafile' },
							'Please Select File:',
							_react2.default.createElement('input', { ref: 'vif', style: { margin: '15px' }, type: 'file', onChange: this.updatePath })
						),
						_react2.default.createElement(
							'p',
							{ className: 'natitle' },
							'Please Enter Password of The Account:'
						),
						_react2.default.createElement('input', { ref: 'vip1', className: 'napass', type: this.state.reveal ? "text" : "password", defaultValue: '', onChange: this.updateVar }),
						_react2.default.createElement('input', { type: 'button', style: { margin: "15px" }, className: 'button nareveal', value: this.state.reveal ? "Hide" : "Reveal", onClick: this.handleReveal }),
						_react2.default.createElement('input', { type: 'button', style: { margin: "15px" }, className: 'button nacreate', value: 'Import', onClick: this.handleImport })
					);
				};

				const __newAcc = () => {
					return _react2.default.createElement(
						'div',
						{ className: 'item newAccTab' },
						_react2.default.createElement(
							'p',
							{ className: 'natitle' },
							'Please Enter Password For New Account:'
						),
						_react2.default.createElement('input', { ref: 'vip2', className: 'napass', type: this.state.reveal2 ? "text" : "password", defaultValue: '', onChange: this.updateVar }),
						_react2.default.createElement('input', { type: 'button', style: { margin: "15px" }, className: 'button nareveal', value: this.state.reveal2 ? "Hide" : "Reveal", onClick: this.handleReveal2 }),
						_react2.default.createElement('input', { type: 'button', style: { margin: "15px" },
							className: 'button nacreate',
							value: 'Create',
							onClick: this.handleNewAcct })
					);
				};

				return _react2.default.createElement(
					'div',
					{ className: 'item accMgr' },
					_react2.default.createElement(
						'fieldset',
						{ className: 'accSettings' },
						_react2.default.createElement(
							'legend',
							{ className: 'item accTabs' },
							_react2.default.createElement('input', { type: 'button', className: 'button tabset', value: 'Create New Account', style: {
									backgroundColor: this.state.currentAccSettings === 'new' ? "#f4f0fa" : "rgba(0,0,0,0)",
									color: this.state.currentAccSettings === 'new' ? "#34475c" : "#cccccc"
								},
								onClick: this.handleAccChange.bind(this, "new") }),
							_react2.default.createElement('input', { type: 'button', className: 'button tabset', value: 'Import Existing Account', style: {
									backgroundColor: this.state.currentAccSettings === 'old' ? "#f4f0fa" : "rgba(0,0,0,0)",
									color: this.state.currentAccSettings === 'old' ? "#34475c" : "#cccccc"
								},
								onClick: this.handleAccChange.bind(this, "old") })
						),
						this.state.currentAccSettings === 'new' ? __newAcc() : this.state.currentAccSettings === 'old' ? __oldAcc() : this.setState({ currentAccSettings: 'old' })
					),
					_react2.default.createElement(_AlertModal2.default, { content: this.state.alertContent, isAlertModalOpen: this.state.isAlertModalOpen, close: this.closeModal })
				);
			}
		};

		this.store = _ControlPanelStore2.default;

		this.state = {
			reveal: false,
			reveal2: false,
			waiting: false,
			currentAccSettings: 'old'
		};
		this.storeKeys = [];
		this.accMgr = _electron.remote.getGlobal('controlPanel').accMgr;
		this.keypath = undefined;
		this.variable = undefined;
	}

	render() {
		console.log("in AccountsView render()");
		return this.accountMgr();
	}
}

exports.default = AccountsView;