import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ChooseSimOnlyTariff from "../SimOnlyUpgradeComponents/ChooseSimOnlyTariff";
import FinaliseSimOnly from "../SimOnlyUpgradeComponents/FinaliseSimOnly";


const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
});

class AdditionalSim extends Component {

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

                       : null
               }
           </div>
        )
    }
}
export default withStyles(styles)(AdditionalSim)