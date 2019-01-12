"use strict";

// Third-parties

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _reactDropdown = require('react-dropdown');

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

var _ControlPanelStore = require('../store/ControlPanelStore');

var _ControlPanelStore2 = _interopRequireDefault(_ControlPanelStore);

var _Receipts = require('../components/Receipts');

var _Receipts2 = _interopRequireDefault(_Receipts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Reflux store
class ReceiptsView extends _reflux2.default.Component {
    constructor(props) {
        super(props);

        this.componentDidMount = () => {
            if (this.state.Qs.length > 0 && this.state.selectedQ === "") {
                this.setState({ selectedQ: [...this.state.Qs].splice(-1)[0] });
            }
        };

        this.handleChange = event => {
            this.setState({ selectedQ: event.value });
        };

        this.getReceipts = () => {
            return this.state.receipts[this.state.selectedQ];
        };

        this.store = _ControlPanelStore2.default;
        this.state = {
            selectedQ: ""
        };
        this.storeKeys = ["receipts", "Qs"];

        this.getReceipts = this.getReceipts.bind(this);
    }

    render() {
        console.log("in ReceiptsView render()");
        return _react2.default.createElement(
            'div',
            { className: 'item ReceiptsLayout' },
            _react2.default.createElement(
                'label',
                { className: 'item RLabel' },
                'Queue IDs:'
            ),
            _react2.default.createElement(_reactDropdown2.default, { className: 'item ReceiptsDrop', options: this.state.Qs, onChange: this.handleChange,
                value: this.state.selectedQ, placeholder: 'Please select a Queue ID' }),
            _react2.default.createElement(_Receipts2.default, { receipts: this.getReceipts() })
        );
    }
}

// Components
exports.default = ReceiptsView;