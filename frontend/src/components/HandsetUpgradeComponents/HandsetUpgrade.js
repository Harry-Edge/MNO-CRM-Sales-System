import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ChooseHandset from "./ChooseHandset";
import ChooseHandsetTariff from "./ChooseHandsetTariff";
import FinaliseHandset from "./FinaliseHandsetUpgrade";

const styles = () => ({
     headingText: {
        fontWeight: 650
    },

});

class HandsetUpgrade extends Component {

    state = {chooseHandset: true,
             currentStage: 'chooseHandset',
             chooseHandsetTariff: false}

    handleDeleteHandsetOrder = () => {
        this.setState({currentStage: 'chooseHandset'})
    }
    handleChooseHandsetTariff = () => {
        this.setState({chooseHandset: false, chooseHandsetTariff: true, currentStage: 'chooseHandsetTariff'})
    }
    handleFinaliseHandset = () => {
        this.setState({currentStage: 'finaliseHandset'})
    }

    render() {

        const {fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               {
                   this.state.currentStage === 'chooseHandset' ?
                       <ChooseHandset fixedHeightPaper={fixedHeightPaper}
                                      onNewCTNClicked={onNewCTNClicked}
                                      onChooseHandsetTariffClicked={this.handleChooseHandsetTariff}
                                      currentStage={this.state.currentStage}
                                      state={state}/> : null
               }
               {
                   this.state.currentStage === 'chooseHandsetTariff' ?
                       <ChooseHandsetTariff fixedHeightPaper={fixedHeightPaper}
                                            onFinaliseHandsetClicked={this.handleFinaliseHandset}
                                            onHandsetOrderDeleted={this.handleDeleteHandsetOrder}
                                            currentStage={this.state.currentStage}
                                            onNewCTNClicked={onNewCTNClicked} state={state}/>: null
               }
               {
                   this.state.currentStage === 'finaliseHandset' ?
                       <FinaliseHandset fixedHeightPaper={fixedHeightPaper}
                                        onHandsetOrderDeleted={this.handleDeleteHandsetOrder}
                                        currentStage={this.state.currentStage}
                                        onNewCTNClicked={onNewCTNClicked} state={state}/> : null
               }
           </div>
        )
    }
}
export default withStyles(styles)(HandsetUpgrade)