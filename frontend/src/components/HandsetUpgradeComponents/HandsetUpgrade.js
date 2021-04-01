import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ChooseHandset from "./ChooseHandset";

const styles = () => ({
     headingText: {
        fontWeight: 650
    },

});

class HandsetUpgrade extends Component {

    render() {

        const {fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <ChooseHandset fixedHeightPaper={fixedHeightPaper} onNewCTNClicked={onNewCTNClicked} state={state}/>
           </div>
        )
    }
}
export default withStyles(styles)(HandsetUpgrade)