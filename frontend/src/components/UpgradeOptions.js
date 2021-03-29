import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const styles = (theme) => ({
    headingText: {
        fontWeight: 650
    },
    button: {
        textTransform: 'none',
        backgroundColor: '#009999',
        borderColor: '#009999',

        '&:hover': {
          backgroundColor: '#008080',
          borderColor: '#008080'
         },
    },
    textLink: {
        color: 'blue'
    },
    textDanger: {
        color: 'red'
    },

});

class UpgradeOptions extends Component {

    render() {

        const {classes, mobileAccount} = this.props

        return (
            <Box>
                <Grid container>
                    <Grid item xs={5} >
                        <Typography className={classes.headingText}>Handset Upgrade</Typography>
                        {
                            mobileAccount.is_eligible ?
                                <Box m={1}>
                                    <Button className={classes.button} endIcon={<KeyboardArrowUpIcon/>}
                                            size='small'
                                            variant='contained'
                                            color="primary"
                                            onClick={() => this.props.onHandsetUpgradeClicked()}>Upgrade</Button>
                                </Box>
                                :
                                <Box m={1}>
                                    <Button className={classes.button} endIcon={<KeyboardArrowUpIcon/>}
                                            size='small'
                                            variant='contained'
                                            color="primary">Early Upgrade
                                        <strong> (£{mobileAccount.early_upgrade_fee} Fee)</strong></Button>
                                </Box>
                        }
                    </Grid>
                    <Grid item xs={2}>
                        <Divider orientation='vertical' className={classes.test}/>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography className={classes.headingText}>Sim-Only Upgrade </Typography>
                           <Box m={1}>
                               {
                                   mobileAccount.is_eligible ?
                                                            <Button className={classes.button} endIcon={<KeyboardArrowUpIcon/>}
                                                               size='small'
                                                               variant='contained'
                                                               color="primary"
                                                               onClick={() => this.props.onSimOnlyUpgradeClicked()} >Upgrade</Button>

                                   : <Typography>Available On: <strong className={classes.textDanger}
                                       >{mobileAccount.upgrade_date}</strong></Typography>
                               }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}
export default withStyles(styles)(UpgradeOptions)