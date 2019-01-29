'use strict';

// Major third-party modules

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _electron = require('electron');

var _ControlPanelStore = require('../store/ControlPanelStore');

var _ControlPanelStore2 = _interopRequireDefault(_ControlPanelStore);

var _ControlPanelActions = require('../action/ControlPanelActions');

var _ControlPanelActions2 = _interopRequireDefault(_ControlPanelActions);

var _SideBarView = require('./SideBarView');

var _SideBarView2 = _interopRequireDefault(_SideBarView);

var _ReceiptsView = require('./ReceiptsView');

var _ReceiptsView2 = _interopRequireDefault(_ReceiptsView);

var _TokenSettingsView = require('./TokenSettingsView');

var _TokenSettingsView2 = _interopRequireDefault(_TokenSettingsView);

var _AppLauncherView = require('./AppLauncherView');

var _AppLauncherView2 = _interopRequireDefault(_AppLauncherView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Views


// Reflux store
class MainView extends _reflux2.default.Component {
	constructor(props) {
		super(props);

		this.updateState = (key, e) => {
			this.setState({ [key]: e.target.value });
		};

		this.passAccRef = () => {
			return _reactDom2.default.findDOMNode(this.refs.Accounts).firstChild;
		};

		this.store = _ControlPanelStore2.default;
		this.controlPanel = _electron.remote.getGlobal("controlPanel");
		// this.controlPanel.client.subscribe('newJobs');
		// this.controlPanel.client.on('newJobs', this.handleNewJobs);
		// this.controlPanel.syncTokenInfo();
		this.state = {
			currentView: "AppLauncher"
		};
	}

	// handleNewJobs = (obj) => {
	// 	ControlPanelActions.newJobs(obj);
	// }

	render() {
		console.log("In MainView render(); syncInProgress = " + this.state.syncInProgress);
		if (this.state.connected === false) {
			document.body.style.background = "rgb(17, 31, 47)";
			return _react2.default.createElement(
				'div',
				{ className: 'container locked', style: { background: "rgb(17, 31, 47)" } },
				_react2.default.createElement(
					'div',
					{ className: 'item list', style: { background: "none" } },
					_react2.default.createElement(
						'div',
						{ style: { border: "2px solid white", padding: "40px", textAlign: "center" } },
						_react2.default.createElement('div', { className: 'loader syncpage' }),
						_react2.default.createElement('br', null),
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" } },
							'Lost local Ethereum node connection ...'
						)
					)
				)
			);
		} else if (this.state.wait4peers === true) {
			document.body.style.background = "rgb(17, 31, 47)";
			return _react2.default.createElement(
				'div',
				{ className: 'container locked', style: { background: "rgb(17, 31, 47)" } },
				_react2.default.createElement(
					'div',
					{ className: 'item list', style: { background: "none" } },
					_react2.default.createElement(
						'div',
						{ style: { border: "2px solid white", padding: "40px", textAlign: "center" } },
						_react2.default.createElement('div', { className: 'loader syncpage' }),
						_react2.default.createElement('br', null),
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" } },
							'Awaiting incomming blocks from peers ...'
						)
					)
				)
			);
		} else if (this.state.syncInProgress === true) {
			document.body.style.background = "linear-gradient(-180deg, rgb(17, 31, 47), rgb(24, 156, 195))";
			return _react2.default.createElement(
				'div',
				{ className: 'container locked', style: { background: "none" } },
				_react2.default.createElement(
					'div',
					{ className: 'item list', style: { background: "none" } },
					_react2.default.createElement(
						'div',
						{ style: { border: "2px solid white", padding: "40px", textAlign: "center" } },
						_react2.default.createElement('div', { className: 'loader' }),
						_react2.default.createElement('br', null),
						_react2.default.createElement(
							'p',
							{ style: { alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" } },
							'Block syncing in progress ',
							this.state.blockHeight,
							' / ',
							this.state.highestBlock,
							' ...'
						)
					)
				)
			);
		} else {
			document.body.style.background = "#f4f0fa";
			return _react2.default.createElement(
				'div',
				{ className: 'wrapper' },
				_react2.default.createElement(_SideBarView2.default, { updateView: this.updateState.bind(this, "currentView") }),
				_react2.default.createElement(
					'div',
					{ className: 'content' },
					this.state.currentView == "TokenSettings" ? _react2.default.createElement(_TokenSettingsView2.default, null) : this.state.currentView == "AppLauncher" ? _react2.default.createElement(_AppLauncherView2.default, null) : _react2.default.createElement(_ReceiptsView2.default, null)
				)
			);
		}
	}
}

// Reflux actions
exports.default = MainView;