import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";

const styles = (theme) => ({
    container: {
        justifyContent: 'flex-end',
        display: 'flex',
        height: '62vh',
        overflow: 'scroll',

    },
    text: {
      padding: 3,
      fontSize: 13
    },
    textSuccess: {
        color: 'green'
    },
    textDanger: {
        color: 'red'
    },
    textWarning: {
        color: '#cccc00'
    },
    divider:{
        display: 'flex',
    },

    title: {
        fontWeight: 500,
        fontSize: 14,
        color: '#808080',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 7,
        inset: 'auto'
    }

});

class CTNDetails extends Component {

    state = {insuranceColour: null,
             daysRemainingColour: null,
             earlyUpgradeFeeColour: null,
             spendCapColour: null, }

    componentDidMount() {
        this.handleGetColourOptions()
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        // Calls the Colour change text options if CTN data has been changed
        if (prevProps.mobileAccount !== this.props.mobileAccount){
            this.handleGetColourOptions()
        }
    };

    handleGetColourOptions = () => {
        this.handleDaysRemainingColour()
        this.handleSpendCapColour()
        this.handleEarlyUpgradeFeeColour()
        this.handleInsuranceColour()
    };
    handleInsuranceColour = () => {
        if (this.props.mobileAccount.insurance === true){
            this.setState({insuranceColour: this.props.classes.textSuccess})
        } else {
            this.setState({insuranceColour: this.props.classes.textDanger})
        }
    };
    handleSpendCapColour = () => {
        if (this.props.mobileAccount.spend_cap <= 0){
            this.setState({spendCapColour: this.props.classes.textSuccess})
        }else if (this.props.mobileAccount.spend_cap > 0 && this.props.mobileAccount.spend_cap <= 40 ){
            this.setState({spendCapColour: this.props.classes.textWarning})
        }else {
            this.setState({spendCapColour: this.props.classes.textDanger})
        }
    };
    handleEarlyUpgradeFeeColour = () => {
        if (this.props.mobileAccount.early_upgrade_fee === 0){
            this.setState({earlyUpgradeFeeColour: this.props.classes.textSuccess})
        }else if (this.props.mobileAccount.early_upgrade_fee <= 120 ){
            this.setState({earlyUpgradeFeeColour: this.props.classes.textWarning})
        }else {
            this.setState({earlyUpgradeFeeColour: this.props.classes.textDanger})
        }
    };
    handleDaysRemainingColour = () => {
        if (this.props.mobileAccount.days_remaining <= 0){
            this.setState({daysRemainingColour: this.props.classes.textSuccess})
        }else if (this.props.mobileAccount.days_remaining <= 100){
            this.setState({daysRemainingColour: this.props.classes.textWarning})
        }else {
            this.setState({daysRemainingColour: this.props.classes.textDanger})
        }
    };

    render() {

        const {classes, customer, mobileAccount} = this.props

        return (
              <div>
                <Box className={classes.container} m={1}>
                    <div >
                        <Typography className={classes.title}>CTN Details</Typography>
                        <Typography className={classes.text}>Account Holder: <strong>{customer.first_name} {customer.last_name}</strong></Typography>
                        <Typography className={classes.text}>Postcode: <strong>{customer.postcode}</strong></Typography>
                        <Typography className={classes.text}>Address: <strong>{customer.first_line_address}</strong></Typography>
                        <Typography className={classes.text}>Account Number: <strong>{customer.id}</strong></Typography>
                        <div>
                            <br/>
                        </div>
                        <Divider className={classes.divider}/>
                        <div>
                            <br/>
                        </div>
                        <Typography className={classes.text}>CTN: <strong>{mobileAccount.number}</strong></Typography>
                        <Typography className={classes.text}>User: <strong>{mobileAccount.user}</strong></Typography>
                        <Typography className={classes.text}>Plan: <strong>{mobileAccount.plan} {mobileAccount.data_allowance}GB £{mobileAccount.mrc}</strong></Typography>
                        <Typography className={classes.text}>Device: <strong>{mobileAccount.device_manufacture} {mobileAccount.device_model}</strong></Typography>
                        <Typography className={classes.text}>Insurance: <strong className={this.state.insuranceColour}>{mobileAccount.insurance_option}</strong></Typography>
                        <Typography className={classes.text}>Average Bill: <strong>£{Math.round(mobileAccount.mrc * 1.025)}</strong></Typography>
                        <Typography className={classes.text}>Spend Cap: <strong className={this.state.spendCapColour}>£{mobileAccount.spend_cap}</strong></Typography>
                        <div>
                            <br/>
                        </div>
                        <Divider/>
                        <div>
                            <br/>
                        </div>
                        <Typography className={classes.text}>Data 3m: <strong>{mobileAccount.data_usage_3m}GB</strong></Typography>
                        <Typography className={classes.text}>Text 3m: <strong> {mobileAccount.texts_sent_3m}</strong></Typography>
                        <Typography className={classes.text}>Voice 3m: <strong>{mobileAccount.call_mins}</strong></Typography>
                        <Typography className={classes.text}>MMS 3m: <strong>{mobileAccount.mms_sent}</strong></Typography>
                        <div>
                            <br/>
                        </div>
                        <Divider/>
                        <div>
                            <br/>
                        </div>
                        <Typography className={classes.text}>Upgrade Date: <strong> {mobileAccount.upgrade_date}</strong></Typography>
                        <Typography className={classes.text}>Early Upgrade Fee: <strong className={this.state.earlyUpgradeFeeColour}>£{mobileAccount.early_upgrade_fee}</strong></Typography>
                        <Typography className={classes.text}>Contract Start: <strong>{mobileAccount.contract_start}</strong></Typography>
                        <Typography className={classes.text}>Contract End: <strong>{mobileAccount.contract_end}</strong></Typography>
                        <Typography className={classes.text}>Days Remaining: <strong className={this.state.daysRemainingColour}>{mobileAccount.days_remaining} Days</strong></Typography>
                        <Typography className={classes.text}>Contract Length: <strong>{mobileAccount.contract_length_months} Months</strong></Typography>
                        <div>
                            <br/>
                        </div>
                        <Divider/>
                        <div>
                            <br/>
                        </div>
                        <Typography className={classes.text}>Friends and Family: <strong> {mobileAccount.friends_and_family ? 'Yes' : 'No'}</strong></Typography>
                        <div>
                            <br/>
                        </div>
                    </div>
                </Box>
              </div>
        )
    }
}
export default withStyles(styles)(CTNDetails)