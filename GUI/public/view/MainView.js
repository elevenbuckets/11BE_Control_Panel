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

		this.handleNewJobs = obj => {
			_ControlPanelActions2.default.newJobs(obj);
		};

		this.store = _ControlPanelStore2.default;
		this.controlPanel = _electron.remote.getGlobal("controlPanel");
		console.log("subscribing New jobs in Mainview");
		this.controlPanel.client.subscribe('newJobs');
		this.controlPanel.client.on('newJobs', this.handleNewJobs);
	}

	render() {
		console.log("In MainView render()");

		document.body.style.background = "#f4f0fa";
		return _react2.default.createElement(
			'div',
			{ className: 'wrapper' },
			_react2.default.createElement(_SideBarView2.default, null),
			_react2.default.createElement(
				'div',
				{ className: 'content' },
				_react2.default.createElement(_ReceiptsView2.default, null)
			)
		);
	}
}

// Reflux actions
exports.default = MainView;