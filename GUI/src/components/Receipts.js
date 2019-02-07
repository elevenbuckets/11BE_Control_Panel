"use strict";

// Third-parties
import React, { Component } from 'react';
import Reflux from 'reflux';

import {remote} from 'electron'


// Utils
import Constants from '../util/Constants'

class Receipts extends Reflux.Component {
    constructor(props) {
        super(props);
        this.controlPanel = remote.getGlobal('controlPanel');
        this.clearTout = undefined;
    }

    simplifyTxHash = (content) => {
        if (content) {
            let res = content.substring(0, 5);
            res = res + "...";
            let length = content.length;
            res = res + content.substring(length - 5, length);
            return res;
        } else {
            return null;
        }
    }

    getType(receipt) {
        if (Constants.Token === receipt.type || Constants.Web3 === receipt.type) {
            return receipt.contract;
        }
        return "Function"
    }

    getAmount(receipt) {
        if (Constants.Web3 === receipt.type && Constants.ETH === receipt.contract) {
            return this.controlPanel.toEth(this.controlPanel.hex2num(receipt.value),
                18).toFixed(9);
        } else if (Constants.Token === receipt.type) {
            return this.controlPanel.toEth(this.controlPanel.hex2num(receipt.amount),
                this.controlPanel.TokenInfo[receipt.contract].decimals).toFixed(9);
        }
        return receipt.amount;
    }

    getGasPrice = (receipt) => {
        let gasPrice = receipt.gasPrice? receipt.gasPrice :0;
        return this.controlPanel.toEth(this.controlPanel.hex2num(receipt.gasPrice), 9).toFixed(9);
    }

    getStatus(receipt) {
        if (receipt.status === "0x0") {
            return Constants.Failed;
        } else if (receipt.status === "0x1") {
            return Constants.Succeeded;
        } else if (receipt.error) {
            return Constants.Errored;
        }
        return Constants.Pending;
    }

    infoDisplay(name, data) {
        event.preventDefault(); // is this necessary?
        clearTimeout(this.clearTout);
        this.refs.infocache.value = name + ': ' + data;
    }

    infoClear() {
        this.clearTout = setTimeout(() => { this.refs.infocache.value = '' }, 5000);
    }

    getStatusComponent = (receipt) => {
        let status = this.getStatus(receipt);

        return <td 
            onMouseEnter={status==Constants.Errored ? this.infoDisplay.bind(this, 'Erorr Info ', receipt.error) : () =>{} }
            onMouseLeave={status==Constants.Errored ? this.infoClear.bind(this):() =>{} } width='8%'>{status}</td>
    }

    receipts = () => {
        if (this.props.receipts) {
            return this.props.receipts.map((receipt) => {
                return (
                    <tr >
                        <td 
                            onMouseEnter={this.infoDisplay.bind(this, 'txHash', receipt.tx)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.tx)}</td>
                        <td 
                            onMouseEnter={this.infoDisplay.bind(this, 'From', receipt.from)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.from)}</td>
                        <td 
                            onMouseEnter={this.infoDisplay.bind(this, 'To', receipt.to)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.to)}</td>
                        <td width='8%'>{this.getType(receipt)}</td>
                        <td width='8%'>{this.getAmount(receipt)}</td>
                        <td width='8%'>{receipt.gasUsed}</td>
                        <td width='8%'>{this.getGasPrice(receipt)}</td>
                        <td width='8%'>{receipt.blockNumber}</td>
                        {this.getStatusComponent(receipt)}
                    </tr>
                );
            })
        }
    }

    render() {

        return (
            <div className="ReceiptContainer">
                <table className="ReceiptMainTable">
                    <thead>
                        <tr>
                            <th width='10%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>TxHash</th>
                            <th width='10%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>From</th>
                            <th width='10%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>To</th>
                            <th width='8%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Type</th>
                            <th width='8%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Amount</th>
                            <th width='8%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Gas</th>
                            <th width='8%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Gas Price</th>
                            <th width='8%' style={{ borderRight: '2px solid rgb(17,31,47)' }}>Block No.</th>
                            <th width='8%'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.receipts()}
                    </tbody>
                </table>
                <div className="ReceiptToolTipArea">
                    <input type='text' ref='infocache' value='' />
                </div>
            </div>
        )
    }


}

export default Receipts
