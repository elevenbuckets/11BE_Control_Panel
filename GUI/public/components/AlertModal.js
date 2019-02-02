'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AlertModal extends _react2.default.Component {

    // For ex, <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal}/>
    // need three props : content, isAlertModalOpen, close
    constructor(props) {
        super(props);
    }

    render() {
        return _react2.default.createElement(
            _reactModal2.default,
            { ariaHideApp: false, isOpen: this.props.isAlertModalOpen, style: {
                    overlay: { width: '100%', maxHeight: '100%', zIndex: '5', backgroundColor: "rgba(0,12,20,0.75)" },
                    content: {
                        top: '40%', left: '30%', right: '30%', bottom: '40%',
                        border: "2px solid yellow",
                        backgroundColor: "black",
                        borderRadius: "6px",
                        color: "yellow",
                        textAlign: "center",
                        fontSize: "22px",
                        display: "grid",
                        padding: "0px",
                        gridTemplateRows: "1fr 1fr",
                        gridTemplateColumns: "1fr",
                        alignItems: "center" }
                } },
            ' ',
            this.props.content,
            _react2.default.createElement(
                'div',
                { style: {
                        justifyItems: "center",
                        alignItems: "center",
                        textAlign: "center"
                    } },
                _react2.default.createElement('input', { type: 'button', className: 'button',
                    value: 'OK', onClick: this.props.close
                })
            )
        );
    }

}

exports.default = AlertModal;