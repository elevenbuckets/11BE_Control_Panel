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
class TokenSettingsView extends _reflux2.default.Component {
    constructor(props) {
        super(props);

        this.store = _ControlPanelStore2.default;
    }

    render() {
        console.log("in TokenSettingsView render()");
        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                { className: 'tokenAction' },
                _react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonNew', value: 'New', onClick: this.handleTokenActionUpdate.bind(this, "New") }),
                _react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonSearch', value: 'Search', onClick: this.handleTokenActionUpdate.bind(this, "Search") }),
                _react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonDelete', value: 'Delete', disabled: !this.selectedTokensCanBeDeleted(),
                    onClick: this.handleClickDeleteToken }),
                _react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonWatch', value: 'Watch',
                    disabled: this.state.selectedTokens.length === 0, onClick: this.handleClickWatchToken }),
                _react2.default.createElement('input', { type: 'button', className: 'button tokenActionButtonUnWatch', value: 'UnWatch',
                    disabled: this.state.selectedTokens.length === 0, onClick: this.handleClickUnWatchToken }),
                _react2.default.createElement('br', { style: { border: '2px solid white' } }),
                _react2.default.createElement(
                    'table',
                    { className: 'tokenTitleTable' },
                    _react2.default.createElement(
                        'tbody',
                        null,
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'td',
                                { width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
                                'Select'
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
                                'Symbol'
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '40%', style: { borderRight: '2px solid rgb(17,31,47)' } },
                                'Address'
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
                                'Name'
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
                                'Decimals'
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%', style: { borderRight: '2px solid rgb(17,31,47)' } },
                                'Catgory'
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                'Watched'
                            )
                        ),
                        _react2.default.createElement(
                            'tr',
                            { hidden: !(this.state.tokenAction === "New"), style: { backgroundColor: "rgb(34, 169, 202)" } },
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                'N/A'
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'text', size: '3',
                                    value: this.state.tokenToAdd.symbol === undefined ? "" : this.state.tokenToAdd.symbol,
                                    onChange: this.changeNewTokenField.bind(this, "symbol")
                                })
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '40%' },
                                _react2.default.createElement('input', { type: 'text', size: '20',
                                    value: this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.addr,
                                    onChange: this.changeNewTokenField.bind(this, "addr")
                                })
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'text', size: '10',
                                    value: this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.name,
                                    onChange: this.changeNewTokenField.bind(this, "name")
                                })
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'text', size: '10',
                                    value: this.state.tokenToAdd.token === undefined ? "" : this.state.tokenToAdd.token.decimals,
                                    onChange: this.changeNewTokenField.bind(this, "decimals")
                                })
                            ),
                            _react2.default.createElement('td', { width: '10%' }),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'button',
                                    className: 'button', value: 'Add',
                                    style: { height: '23px', backgroundColor: 'rgba(0,0,0,0)', fontSize: '13px', fontWeight: 'bold' },
                                    onClick: this.handleClickAddToken
                                })
                            )
                        ),
                        _react2.default.createElement(
                            'tr',
                            { hidden: !(this.state.tokenAction === "Search") },
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                'N/A'
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'text', size: '3',
                                    value: this.state.tokenFilter.symbol === undefined ? "" : this.state.tokenFilter.symbol,
                                    onChange: this.changeTokenFilter.bind(this, "symbol")
                                })
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '40%' },
                                _react2.default.createElement('input', { type: 'text', size: '20',
                                    value: this.state.tokenFilter.addr === undefined ? "" : this.state.tokenFilter.addr,
                                    onChange: this.changeTokenFilter.bind(this, "addr")
                                })
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'text', size: '10',
                                    value: this.state.tokenFilter.name === undefined ? "" : this.state.tokenFilter.name,
                                    onChange: this.changeTokenFilter.bind(this, "name")
                                })
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'text', size: '10',
                                    value: this.state.tokenFilter.decimals === undefined ? "" : this.state.tokenFilter.decimals,
                                    onChange: this.changeTokenFilter.bind(this, "decimals")
                                })
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'text', size: '5',
                                    value: this.state.tokenFilter.category === undefined ? "" : this.state.tokenFilter.category,
                                    onChange: this.changeTokenFilter.bind(this, "category")
                                })
                            ),
                            _react2.default.createElement(
                                'td',
                                { width: '10%' },
                                _react2.default.createElement('input', { type: 'text', size: '10',
                                    value: this.state.tokenFilter.watched === undefined ? "" : this.state.tokenFilter.watched,
                                    onChange: this.changeTokenFilter.bind(this, "watched")
                                })
                            )
                        )
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'TKList' },
                _react2.default.createElement(
                    'table',
                    { style: { width: "100%" } },
                    _react2.default.createElement(
                        'tbody',
                        null,
                        this.getTokenDisplay()
                    )
                )
            )
        );
    }
}

// Components
exports.default = TokenSettingsView;