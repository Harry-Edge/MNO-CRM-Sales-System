import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
});

class AdditionalSim extends Component {

    render() {

        return (
           <div>
               <h1>ADDITIONAL SIM</h1>
           </div>
        )
    }
}
export default withStyles(styles)(AdditionalSim)