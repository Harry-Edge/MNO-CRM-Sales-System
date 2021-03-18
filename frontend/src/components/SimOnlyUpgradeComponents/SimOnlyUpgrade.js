import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ChooseSimOnlyTariff from "./ChooseSimOnlyTariff";
import FinaliseSimOnly from "./FinaliseSimOnly";


const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
    test: {
        backgroundColor: 'blue'
    }

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
                                            teststate={this.state}
                                            state={state}/>

                       : <FinaliseSimOnly onNewCTNClicked={onNewCTNClicked}
                                          fixedHeightPaper={fixedHeightPaper}
                                          onDeleteTariffClicked={this.handleDeleteTariff}
                                          finaliseSim={true}
                                          state={state}/>
               }
           </div>
        )
    }
}
export default withStyles(styles)(SimOnlyUpgrade)