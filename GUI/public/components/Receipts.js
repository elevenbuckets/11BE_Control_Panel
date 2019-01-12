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

var _Constants = require('../util/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Receipts extends _reflux2.default.Component {
    constructor(props) {
        super(props);

        this.simplifyTxHash = content => {
            if (content) {
                let res = content.substring(0, 5);
                res = res + "...";
                let length = content.length;
                res = res + content.substring(length - 5, length);
                return res;
            } else {
                return null;
            }
        };

        this.getGasPrice = receipt => {
            return this.controlPanel.toEth(this.controlPanel.hex2num(receipt.gasPrice), 9).toFixed(9);
        };

        this.getStatusComponent = receipt => {
            let status = this.getStatus(receipt);

            return _react2.default.createElement(
                'td',
                {
                    onMouseEnter: status == _Constants2.default.Errored ? this.infoDisplay.bind(this, 'Erorr Info ', receipt.error) : () => {},
                    onMouseLeave: status == _Constants2.default.Errored ? this.infoClear.bind(this) : () => {}, width: '8%' },
                status
            );
        };

        this.receipts = () => {
            if (this.props.receipts) {
                return this.props.receipts.map(receipt => {
                    return _react2.default.createElement(
                        'tr',
                        null,
                        _react2.default.createElement(
                            'td',
                            {
                                onMouseEnter: this.infoDisplay.bind(this, 'txHash', receipt.tx),
                                onMouseLeave: this.infoClear.bind(this),
                                width: '10%' },
                            this.simplifyTxHash(receipt.tx)
                        ),
                        _react2.default.createElement(
                            'td',
                            {
                                onMouseEnter: this.infoDisplay.bind(this, 'From', receipt.from),
                                onMouseLeave: this.infoClear.bind(this),
                                width: '10%' },
                            this.simplifyTxHash(receipt.from)
                        ),
                        _react2.default.createElement(
                            'td',
                            {
                                onMouseEnter: this.infoDisplay.bind(this, 'To', receipt.to),
                                onMouseLeave: this.infoClear.bind(this),
                                width: '10%' },
                            this.simplifyTxHash(receipt.to)
                        ),
                        _react2.default.createElement(
                            'td',
                            { width: '8%' },
                            this.getType(receipt)
                        ),
                        _react2.default.createElement(
                            'td',
                            { width: '8%' },
                            this.getAmount(receipt)
                        ),
                        _react2.default.createElement(
                            'td',
                            { width: '8%' },
                            receipt.gasUsed
                        ),
                        _react2.default.createElement(
                            'td',
                            { width: '8%' },
                            this.getGasPrice(receipt)
                        ),
                        _react2.default.createElement(
                            'td',
                            { width: '8%' },
                            receipt.blockNumber
                        ),
                        this.getStatusComponent(receipt)
                    );
                });
            }
        };

        this.controlPanel = _electron.remote.getGlobal('controlPanel');
        this.clearTout = undefined;
    }

    getType(receipt) {
        if (_Constants2.default.Token === receipt.type || _Constants2.default.Web3 === receipt.type) {
            return receipt.contract;
        }
        return "Function";
    }

    getAmount(receipt) {
        if (_Constants2.default.Web3 === receipt.type && _Constants2.default.ETH === receipt.contract) {
            return this.controlPanel.toEth(this.controlPanel.hex2num(receipt.value), this.controlPanel.TokenList[_Constants2.default.ETH].decimals).toFixed(9);
        } else if (_Constants2.default.Token === receipt.type) {
            return this.controlPanel.toEth(this.controlPanel.hex2num(receipt.amount), this.controlPanel.TokenList[receipt.contract].decimals).toFixed(9);
        }
        return receipt.amount;
    }

    getStatus(receipt) {
        if (receipt.status === "0x0") {
            return _Constants2.default.Failed;
        } else if (receipt.status === "0x1") {
            return _Constants2.default.Succeeded;
        } else if (receipt.error) {
            return _Constants2.default.Errored;
        }
        return _Constants2.default.Pending;
    }

    infoDisplay(name, data) {
        event.preventDefault(); // is this necessary?
        clearTimeout(this.clearTout);
        this.refs.infocache.value = name + ': ' + data;
    }

    infoClear() {
        this.clearTout = setTimeout(() => {
            this.refs.infocache.value = '';
        }, 5000);
    }

    render() {

        return _react2.default.createElement(
            'div',
            { className: 'ReceiptContainer' },
            _react2.default.createElement(
                'table',
                { className: 'ReceiptMainTable' },
                _react2.default.createElement(
                    'tbody',
                    null,
                    _react2.default.createElement(
                        'tr',
                        null,
                        _react2.default.createElement(
                            'th',
                            { width: '10%' },
                            'TxHash'
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '10%' },
                            'From'
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '10%' },
                            'To'
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '8%' },
                            'Type'
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '8%' },
                            'Amount'
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '8%' },
                            'Gas'
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '8%' },
                            'Gas Price'
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '8%' },
                            'Block No.'
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '8%' },
                            'Status'
                        )
                    ),
                    this.receipts()
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'ReceiptToolTipArea' },
                _react2.default.createElement('input', { type: 'text', ref: 'infocache', value: '' })
            )
        );
    }

}

// Utils
exports.default = Receipts;