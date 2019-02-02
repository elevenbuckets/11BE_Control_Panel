'use strict';

// Third-parties

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _electron = require('electron');

var _ControlPanelStore = require('../store/ControlPanelStore');

var _ControlPanelStore2 = _interopRequireDefault(_ControlPanelStore);

var _ControlPanelActions = require('../action/ControlPanelActions');

var _ControlPanelActions2 = _interopRequireDefault(_ControlPanelActions);

var _Constants = require('../util/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Reflux action
class States extends _reflux2.default.Component {
    constructor(props) {
        super(props);

        this.hasNumberOfPendingReceipts = () => {
            let pendingQs = Object.keys(this.state.receipts).filter(Q => {
                return this.state.receipts[Q] && this.state.receipts[Q].length > 0 && this.hasPendingReceipt(this.state.receipts[Q]);
            });

            return pendingQs.length;
        };

        this.getReceiptComponent = () => {
            let n = this.hasNumberOfPendingReceipts();
            return _react2.default.createElement(
                'table',
                null,
                _react2.default.createElement(
                    'tbody',
                    null,
                    _react2.default.createElement(
                        'tr',
                        null,
                        _react2.default.createElement(
                            'td',
                            { style: { border: '0px', width: '480px' } },
                            n > 0 ? _react2.default.createElement('div', { align: 'right', className: 'loader' }) : _react2.default.createElement('div', null)
                        ),
                        _react2.default.createElement(
                            'td',
                            { style: { border: '0px' } },
                            _react2.default.createElement('input', { type: 'button', className: 'button', value: n > 0 ? "Receipts(" + n + ")" : "Receipts", onClick: this.handleClick })
                        )
                    )
                )
            );
        };

        this.hasPendingReceipt = receipts => {
            for (let i in receipts) {
                if (this.getStatus(receipts[i]) == _Constants2.default.Pending) {
                    return true;
                }
            }
            return false;
        };

        this.render = () => {
            if (this.state.unlocked == false) {
                return _react2.default.createElement(
                    'div',
                    { className: 'state slocked' },
                    _react2.default.createElement(
                        'div',
                        { className: 'item tblockheight' },
                        _react2.default.createElement(
                            'p',
                            null,
                            'Block Height'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item tblockstamp' },
                        _react2.default.createElement(
                            'p',
                            null,
                            'Block Stamp'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item tlocaltime' },
                        _react2.default.createElement(
                            'p',
                            null,
                            'Local Time'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item tgasprice' },
                        _react2.default.createElement(
                            'p',
                            null,
                            'Gas Price'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item blockheight' },
                        _react2.default.createElement(
                            'p',
                            { id: 'cbh' },
                            this.state.blockHeight
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item blockstamp' },
                        _react2.default.createElement(
                            'p',
                            { id: 'cbs' },
                            this.state.blockTime
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item localtime' },
                        _react2.default.createElement(
                            'p',
                            { id: 'clt' },
                            String(this.state.localTime).substring(0, 24)
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item gasprice' },
                        _react2.default.createElement(
                            'p',
                            { id: 'cgp' },
                            20
                        )
                    )
                );
            } else {
                return _react2.default.createElement(
                    'div',
                    { className: 'state sunlocked' },
                    _react2.default.createElement(
                        'div',
                        { className: 'item tblockheight', style: { borderBottom: "0px" } },
                        _react2.default.createElement(
                            'p',
                            null,
                            'Block Height'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item tblockstamp', style: { borderBottom: "0px" } },
                        _react2.default.createElement(
                            'p',
                            null,
                            'Block Stamp'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item tlocaltime', style: { borderBottom: "0px" } },
                        _react2.default.createElement(
                            'p',
                            null,
                            'Local Time'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item tgasprice', style: { borderBottom: "0px", borderRight: "2px solid white" } },
                        _react2.default.createElement(
                            'p',
                            null,
                            'Gas Price'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item blockheight', style: { borderLeft: "2px solid white" } },
                        _react2.default.createElement(
                            'p',
                            { id: 'cbh' },
                            this.state.blockHeight
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item blockstamp' },
                        _react2.default.createElement(
                            'p',
                            { id: 'cbs' },
                            this.state.blockTime
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item localtime' },
                        _react2.default.createElement(
                            'p',
                            { id: 'clt' },
                            String(this.state.localTime).substring(0, 24)
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'item gasprice' },
                        _react2.default.createElement(
                            'p',
                            { id: 'cgp' },
                            20
                        )
                    )
                );
            }
        };

        this.store = _ControlPanelStore2.default;

        this.state = {
            unixTime: 123213,
            localTime: null,
            defaultGasPrice: 20
        };
        this.controlPanel = _electron.remote.getGlobal("controlPanel");
        this.getDashInfo = this.getDashInfo.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        this.getDashInfo();
    }

    componentDidMount() {
        this.timer = setInterval(this.getDashInfo, 1000);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearInterval(this.timer);
    }

    getDashInfo() {
        this.setState(() => {
            return { localTime: new Date(), unixTime: Date.now() / 1000 };
        });
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

    handleClick() {
        _ControlPanelActions2.default.changeView("Receipts");
    }

}

// Singleton service

// constants utilities


// Reflux store
exports.default = States;