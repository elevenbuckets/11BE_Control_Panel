"use strict";

// Third-parties

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _AcctMgrService = require('../service/AcctMgrService');

var _AcctMgrService2 = _interopRequireDefault(_AcctMgrService);

var _electron = require('electron');

var _ControlPanelStore = require('../store/ControlPanelStore');

var _ControlPanelStore2 = _interopRequireDefault(_ControlPanelStore);

var _ControlPanelActions = require('../action/ControlPanelActions');

var _ControlPanelActions2 = _interopRequireDefault(_ControlPanelActions);

var _AlertModal = require('../components/AlertModal');

var _AlertModal2 = _interopRequireDefault(_AlertModal);

var _AlertModalUser = require('../common/AlertModalUser');

var _AlertModalUser2 = _interopRequireDefault(_AlertModalUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Singleton service

// Modals


// Reflux store
class Login extends _AlertModalUser2.default {
	constructor(props) {
		super(props);

		this.handleClick = () => {
			this.toggleSettings();
		};

		this.isCustomGasPriceValid = () => {
			return this.state.gasPriceOption != "custom" || this.state.customGasPrice;
		};

		this.toggleSettings = () => {
			this.setState({ visible: !this.state.visible });
		};

		this.handleChange = event => {
			_ControlPanelActions2.default.startUpdate(event.value, this.refs.canvas);
		};

		this.handleToggle = event => {
			let pt = !this.state.ptoggle;
			let sb = pt ? 'none' : 'inline-block';
			let pf = pt ? '100px' : '283px';
			this.setState({ ptoggle: pt, pfield: pf, sbutton: sb });
			_ControlPanelActions2.default.masterUpdate(this.refs.mp.value);
		};

		this.handleGasPriceSelect = event => {
			_ControlPanelActions2.default.gasPriceOptionSelect(event.currentTarget.defaultValue);
		};

		this.handleCustomGasPriceUpdate = price => {
			_ControlPanelActions2.default.customGasPriceUpdate(price);
		};

		this.handleEnter = event => {
			if (event.keyCode === 13) {
				let variable = this.refs.mp.value;
				this.refs.mp.value = '';
				this.accMgr.password(variable);
				_ControlPanelActions2.default.masterUpdate(variable);
			}
		};

		this.copyAddress = () => {
			var dummy = document.createElement("input");
			document.body.appendChild(dummy);
			dummy.setAttribute("id", "dummy_id");
			document.getElementById("dummy_id").value = this.state.address;
			dummy.select();
			document.execCommand("copy");
			document.body.removeChild(dummy);
		};

		this.updateVar = event => {
			this.variable = event.target.value;
		};

		this.handleReveal = event => {
			this.setState({ reveal: !this.state.reveal });
		};

		this.handleNewArch = event => {
			this.accMgr.newArchive(this.variable).then(() => {
				this.variable = undefined;
				this.openModal("New archive created. It still needs to be unlocked before use.");
			});
			// Should we update config.json with actual archive path, instead of pre-defined? 
			// Should we *also* update config.json to store custom gas price, if set?
		};

		this.render = () => {
			if (!this.state.configured) {
				return _react2.default.createElement(
					'div',
					{ className: 'item configTable' },
					_react2.default.createElement(
						'table',
						{ style: { border: "2px solid white", backgroundColor: "rgba(255,255,255,0.11)" } },
						_react2.default.createElement(
							'tbody',
							null,
							_react2.default.createElement(
								'tr',
								null,
								_react2.default.createElement(
									'td',
									{ style: { padding: "10px 15px 0px 5px", fontWeight: "bold", textAlign: "center", fontSize: "22px" } },
									'Main config folder:'
								),
								_react2.default.createElement(
									'td',
									{ style: { padding: "5px" } },
									_react2.default.createElement('input', { type: 'text', style: {
											width: "350px",
											backgroundColor: "rgba(255,255,255,0.11)",
											border: "2px solid white",
											fontSize: "20px",
											color: "white",
											padding: "0 5px 0 5px",
											textAlign: "center"
										},
										defaultValue: this.props.defaultCfgDir,
										placeholder: 'Please choose 11BE top-level config folder',
										onChange: this.props.updateState.bind(this, "defaultCfgDir") })
								)
							),
							_react2.default.createElement(
								'tr',
								null,
								_react2.default.createElement(
									'td',
									{ style: { padding: "10px 15px 0px 5px", fontWeight: "bold", textAlign: "center", fontSize: "22px" } },
									'Geth data folder:'
								),
								_react2.default.createElement(
									'td',
									{ style: { padding: "5px" } },
									_react2.default.createElement('input', { type: 'text', style: {
											width: "350px",
											backgroundColor: "rgba(255,255,255,0.11)",
											border: "2px solid white",
											fontSize: "20px",
											color: "white",
											padding: "0 5px 0 5px",
											textAlign: "center"
										},
										defaultValue: this.props.defaultDataDir,
										placeholder: 'Please enter geth datadir',
										onChange: this.props.updateState.bind(this, "defaultDataDir") })
								)
							),
							_react2.default.createElement(
								'tr',
								null,
								_react2.default.createElement(
									'td',
									{ style: { padding: "10px 15px 0px 5px", fontWeight: "bold", textAlign: "center", fontSize: "22px" } },
									'Network ID:'
								),
								_react2.default.createElement(
									'td',
									{ style: { padding: "5px" } },
									_react2.default.createElement('input', { type: 'text', style: {
											width: "350px",
											backgroundColor: "rgba(255,255,255,0.11)",
											border: "2px solid white",
											fontSize: "20px",
											color: "white",
											padding: "0 5px 0 5px",
											textAlign: "center"
										},
										defaultValue: this.props.defaultNetID,
										placeholder: 'Please enter Ethereum network ID',
										onChange: this.props.updateState.bind(this, "defaultNetID") })
								)
							),
							_react2.default.createElement(
								'tr',
								null,
								_react2.default.createElement(
									'td',
									{ style: { padding: "10px 15px 0px 5px", fontWeight: "bold", textAlign: "center", fontSize: "22px" } },
									'IPFS repo folder:'
								),
								_react2.default.createElement(
									'td',
									{ style: { padding: "5px 5px 15px 5px" } },
									_react2.default.createElement('input', { type: 'text', style: {
											width: "350px",
											backgroundColor: "rgba(255,255,255,0.11)",
											border: "2px solid white",
											fontSize: "20px",
											color: "white",
											padding: "0 5px 0 5px",
											textAlign: "center"
										},
										defaultValue: this.props.defaultRepoDir,
										placeholder: 'Please enter IPFS repo path (uninitialized)',
										onChange: this.props.updateState.bind(this, "defaultRepoDir") })
								)
							)
						)
					)
				);
			} else if (this.state.configured && _fs2.default.existsSync(this.controlPanel.cfgObjs.geth.passVault) === false) {
				// create new buttercup archive using one time password input
				return _react2.default.createElement(
					'div',
					{ className: 'item list' },
					_react2.default.createElement(
						'table',
						{ style: { border: "2px solid white", backgroundColor: "rgba(255,255,255,0.31)" } },
						_react2.default.createElement(
							'tbody',
							null,
							_react2.default.createElement(
								'tr',
								null,
								_react2.default.createElement(
									'td',
									{ style: { padding: "25px" } },
									_react2.default.createElement(
										'fieldset',
										{ style: {
												display: "inline-block", padding: "20px", textAlign: "center"
											} },
										_react2.default.createElement(
											'legend',
											{ style: { fontWeight: 'bold', marginBottom: '3px' } },
											'Please Enter New Master Password:'
										),
										_react2.default.createElement('input', { autoFocus: true, type: this.state.reveal ? "text" : "password", style: {
												width: "250px",
												backgroundColor: "rgba(5,5,5,0.41)",
												border: "2px solid white",
												fontSize: "24px",
												color: "white"
											}, onChange: this.updateVar }),
										_react2.default.createElement('input', { type: 'button', className: 'button', value: this.state.reveal ? "Hide" : "Reveal", style: {
												fontSize: "22px",
												margin: "0 10px 0 10px"
											}, onClick: this.handleReveal }),
										_react2.default.createElement('input', { type: 'button', className: 'button', value: 'Set Master Password', style: {
												fontSize: "22px"

											}, onClick: this.handleNewArch })
									)
								)
							)
						)
					),
					_react2.default.createElement(_AlertModal2.default, { content: this.state.alertContent, isAlertModalOpen: this.state.isAlertModalOpen, close: this.closeModal })
				);
			} else {
				return _react2.default.createElement(
					'div',
					{ className: 'item list' },
					_react2.default.createElement(
						'table',
						{ style: { border: "2px solid white", backgroundColor: "rgba(255,255,255,0.11)" } },
						_react2.default.createElement(
							'tbody',
							null,
							_react2.default.createElement(
								'tr',
								null,
								_react2.default.createElement(
									'td',
									{ style: { padding: "25px", color: 'red' } },
									_react2.default.createElement(
										'label',
										{ style: { fontWeight: 'bold' } },
										'Master Password'
									)
								)
							),
							_react2.default.createElement(
								'tr',
								null,
								_react2.default.createElement(
									'td',
									{ style: { textAlign: "center", margin: "25px" } },
									_react2.default.createElement('input', { autoFocus: true, ref: 'mp', type: 'password', style: {
											width: "65%",
											marginBottom: '35px',
											backgroundColor: "rgba(0,0,0,0.51)",
											border: "2px solid white",
											fontSize: "24px",
											color: "white"
										}, onKeyUp: this.handleEnter })
								)
							)
						)
					)
				);
			}
		};

		this.store = _ControlPanelStore2.default;
		this.state = {
			reveal: false,
			ptoggle: true,
			pfield: '28px',
			visible: false,
			sbutton: 'none'
		};
		this.controlPanel = _electron.remote.getGlobal("controlPanel");
		this.accMgr = _AcctMgrService2.default.accMgr;
		this.variable = undefined;
	}

}

// Reflux action
exports.default = Login;