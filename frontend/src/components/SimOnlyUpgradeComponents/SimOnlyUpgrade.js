import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ChooseSimOnlyTariff from "./ChooseSimOnlyTariff";
import FinaliseSimOnly from "./FinaliseSimOnly";


const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
});

class SimOnlyUpgrade extends Component {
    state = {chooseSimTariff: true}

    handleFinaliseSimOnly = () => {
        this.setState({chooseSimTariff: false})
    }

    handleDeleteTariff = () => {
        this.setState({chooseSimTariff: true})
    }

    render() {

        const {fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               {
                   this.state.chooseSimTariff ?
                       <ChooseSimOnlyTariff onNewCTNClicked={onNewCTNClicked}
                                            fixedHeightPaper={fixedHeightPaper}
                                            onFinaliseSimOnlyClicked={this.handleFinaliseSimOnly}
                                            onDeleteTariffClicked={this.handleDeleteTariff}
                                            state={state}/>

                       : <FinaliseSimOnly onNewCTNClicked={onNewCTNClicked}
                                          fixedHeightPaper={fixedHeightPaper}
                                          onDeleteTariffClicked={this.handleDeleteTariff}
                                          finaliseSim={true}
                                          state={state}
                                          onReturnToDashboard={this.props.onReturnToDashboard}/>
               }
           </div>
        )
    }
}
export default withStyles(styles)(SimOnlyUpgrade)