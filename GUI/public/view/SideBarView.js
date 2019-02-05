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

var _ControlPanelStore = require('../store/ControlPanelStore');

var _ControlPanelStore2 = _interopRequireDefault(_ControlPanelStore);

var _ControlPanelActions = require('../action/ControlPanelActions');

var _ControlPanelActions2 = _interopRequireDefault(_ControlPanelActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Views

// Reflux store
class SideBarView extends _reflux2.default.Component {
	constructor(props) {
		super(props);

		this.updateView = view => {
			this.props.updateView(view);
		};

		this.passAccRef = () => {
			return _reactDom2.default.findDOMNode(this.refs.Accounts).firstChild;
		};

		this.store = _ControlPanelStore2.default;
	}

	render() {
		//console.log("In MainView render()");
		return _react2.default.createElement(
			'div',
			{ className: 'sidebar' },
			_react2.default.createElement(
				'div',
				{ className: 'sidebarButton', style: { color: this.props.currentView === 'Receipts' ? '#ff4200' : 'white' },
					onClick: this.updateView.bind(this, 'Receipts') },
				'Receipts'
			),
			_react2.default.createElement(
				'div',
				{ className: 'sidebarButton', style: { color: this.props.currentView === 'TokenSettings' ? '#ff4200' : 'white' },
					onClick: this.updateView.bind(this, 'TokenSettings') },
				'Tokens'
			),
			_react2.default.createElement(
				'div',
				{ className: 'sidebarButton', style: { color: this.props.currentView === 'AppLauncher' ? '#ff4200' : 'white' },
					onClick: this.updateView.bind(this, 'AppLauncher') },
				'App Store'
			)
		);
	}
}

// Reflux actions
exports.default = SideBarView;