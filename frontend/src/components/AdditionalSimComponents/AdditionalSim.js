import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
});

class AdditionalSim extends Component {

    render() {

        return (
           <div>
               <Typography>AdditionalSim</Typography>
           </div>
        )
    }
}
export default withStyles(styles)(AdditionalSim)