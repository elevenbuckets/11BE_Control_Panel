"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AlertModalUser extends _reflux2.default.Component {

	// This needs to be used with AlertModal, one can refer to ../view/Settings.js for usage
	constructor(props) {
		super(props);

		this.openModal = content => {
			this.setState({
				alertContent: content,
				isAlertModalOpen: true
			});
		};

		this.closeModal = () => {
			this.setState({
				alertContent: "",
				isAlertModalOpen: false
			});
		};

		this.state = {
			alertContent: "",
			isAlertModalOpen: false
		};
	}

}

exports.default = AlertModalUser;