'use strict';

// Third-parties
import Reflux from 'reflux';
import React from 'react';
import { remote } from 'electron';

// Reflux store
import ControlPanelStore from "../store/ControlPanelStore";

// Reflux action
import ControlPanelActions from '../action/ControlPanelActions'

// Singleton service

// constants utilities
import Constants from '../util/Constants';

class States extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = ControlPanelStore;

        this.state = {
            unixTime: 123213,
            localTime: null,
            defaultGasPrice: 20
        }
        this.controlPanel = remote.getGlobal("controlPanel");
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
        })
    }

    hasNumberOfPendingReceipts = () => {
        let pendingQs = Object.keys(this.state.receipts).filter(Q => {
            return this.state.receipts[Q] && this.state.receipts[Q].length > 0 && this.hasPendingReceipt(this.state.receipts[Q])
        })

        return pendingQs.length;
    }

    getReceiptComponent = () => {
        let n = this.hasNumberOfPendingReceipts();
        return <table>
            <tbody>
                <tr>
		    <td style={{border: '0px', width: '480px'}}>
                    		{ 
				  n > 0 
			   		? <div align="right" className="loader"></div> 
			   		: <div></div> 
		    		}
		    </td>
                    <td style={{border: '0px'}}>
                        <input type="button" className="button" value={n > 0 ? "Receipts(" + n + ")" : "Receipts"} onClick={this.handleClick} />
                    </td>
                </tr>
            </tbody>
        </table>
    }

    hasPendingReceipt = (receipts) => {
        for (let i in receipts) {
            if (this.getStatus(receipts[i]) == Constants.Pending) {
                return true;
            }
        }
        return false;
    }

    getStatus(receipt) {
        if (receipt.status === "0x0") {
            return Constants.Failed;
        } else if (receipt.status === "0x1") {
            return Constants.Succeeded;
        }else if(receipt.error){
            return Constants.Errored;
        }
        return Constants.Pending;
    }

    handleClick() {
        ControlPanelActions.changeView("Receipts");
    }

    render = () => {

	if (this.state.unlocked) {
            return (
                  <div className="state sunlocked">
                      <div className="item tblockheight"><p>Block Height : </p></div>
                      <div className="item tblockstamp"><p>Block Stamp : </p></div>
                      <div className="item tlocaltime"><p>Local Time : </p></div>
                      <div className="item tgasprice"><p>Gas Price : </p></div>
                      <div className="item blockheight"><p id="cbh" >{this.state.blockHeight}</p></div>
                      <div className="item blockstamp"><p id="cbs">{this.state.blockTime}</p></div>
                      <div className="item localtime"><p id="clt">{String(this.state.localTime).substring(0,24)}</p></div>
                      <div className="item gasprice"><p id="cgp">{20}</p></div>
                  </div>
            )
	} else {
            return (
                  <div className="state slocked">
                      <div className="item tversion"><p>Platform Ver. : </p></div>
                      <div className="item tblockheight"><p>Block Height : </p></div>
                      <div className="item tblockstamp"><p>Block Stamp : </p></div>
                      <div className="item tlocaltime"><p>Local Time : </p></div>
                      <div className="item tgasprice"><p>Gas Price : </p></div>
                      <div className="item pversion"><p>{this.state.version}</p></div>
                      <div className="item blockheight"><p id="cbh" >{this.state.blockHeight}</p></div>
                      <div className="item blockstamp"><p id="cbs">{this.state.blockTime}</p></div>
                      <div className="item localtime"><p id="clt">{String(this.state.localTime).substring(0,24)}</p></div>
                      <div className="item gasprice"><p id="cgp">{20}</p></div>
                  </div>
            )
	}
    }
}

export default States;
