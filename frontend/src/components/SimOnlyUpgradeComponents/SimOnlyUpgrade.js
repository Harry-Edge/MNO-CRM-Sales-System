import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ChooseSimOnlyTariff from "./ChooseSimOnlyTariff";


const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
    test: {
        backgroundColor: 'blue'
    }

});

class SimOnlyUpgrade extends Component {

    render() {

        const {fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <ChooseSimOnlyTariff onNewCTNClicked={onNewCTNClicked}fixedHeightPaper={fixedHeightPaper} state={state}/>
           </div>
        )
    }
}
export default withStyles(styles)(SimOnlyUpgrade)