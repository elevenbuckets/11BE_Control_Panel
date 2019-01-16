'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ControlPanelActions = require('../action/ControlPanelActions');

var _ControlPanelActions2 = _interopRequireDefault(_ControlPanelActions);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppLauncherView extends _reflux2.default.Component {
	constructor(props) {
		super(props);

		this.launchApp = appName => {
			const path = require('path');

			const gui = Promise.resolve();

			return gui.then(() => {
				const spawn = require('child_process').spawn;
				let cwd = process.cwd();
				cwd = path.join(cwd, "../../..");
				let topdir = path.join(cwd, 'dapps', appName, 'GUI');
				let configDir = require(path.join(cwd, '.local', 'bootstrap_config.json')).configDir;

				const subprocess = spawn(path.join(topdir, 'node_modules', '.bin', 'electron'), ['.'], {
					cwd: topdir,
					env: { DISPLAY: process.env.DISPLAY, XAUTHORITY: process.env.XAUTHORITY, configDir },
					detached: true,
					stdio: 'ignore'
				});

				subprocess.unref();

				return true;
			});

			// const spawn = require('child_process').spawn;
			// const path = require('path');
			// let cwd = process.cwd(); console.log(cwd);

			// let topdir = path.join(cwd, 'dapps', appName);
			// let configDir = require(path.join(cwd, 'public', '.local', 'bootstrap_config.json')).configDir;

			// const subprocess = spawn(path.join(topdir, 'node_modules', '.bin', 'electron'), ['.'], {
			// 	cwd: topdir,
			// 	env: { DISPLAY: process.env.DISPLAY, XAUTHORITY: process.env.XAUTHORITY, configDir },
			// 	detached: true,
			// 	stdio: 'ignore'
			// });

			// subprocess.unref();
		};

		this.getDappIcons = () => {
			let dapps = ["Wallet"];

			return dapps.map(key => {
				let src = "../dapps/" + key + "/icon.png";
				return _react2.default.createElement(
					'div',
					{ className: 'card appcard', onClick: this.launchApp.bind(this, key) },
					_react2.default.createElement('img', { src: src, className: 'cardicon' }),
					_react2.default.createElement(
						'p',
						{ className: 'cardtext' },
						key
					)
				);
			});
		};

		this.render = () => {
			console.log("in render() of Drawer");
			return _react2.default.createElement(
				'div',
				{ className: 'dAppsViewInner' },
				_react2.default.createElement(
					'div',
					{ className: 'appHolder' },
					this.getDappIcons()
				)
			);
		};
	}

}

exports.default = AppLauncherView;