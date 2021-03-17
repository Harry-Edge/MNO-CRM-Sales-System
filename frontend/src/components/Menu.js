import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SimCardIcon from "@material-ui/icons/SimCard";
import SmartphoneIcon from "@material-ui/icons/Smartphone";
import PeopleIcon from "@material-ui/icons/People";
import AddIcon from '@material-ui/icons/Add';

const styles = (theme) => ({
    currentlySelected: {
        backgroundColor: '#f2f2f2'
    }

});

class CTNDetails extends Component {
    state = {currentlySelected: 'dashboard'}

    render() {

        const {classes,} = this.props

        return (
           <div>
               <ListItem button className={this.state.currentlySelected === 'dashboard' ? classes.currentlySelected : null}
                                onClick={() => {
                                                this.props.onReturnToDashboard()
                                                this.setState({currentlySelected: 'dashboard'})}}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText  primary="Dashboard" />
                </ListItem>
                <ListItem button className={this.state.currentlySelected === 'additionalSim' ? classes.currentlySelected : null}
                                 onClick={() => {this.props.onAdditionalSimClicked()
                                                 this.setState({currentlySelected: 'additionalSim'})}}>
                  <ListItemIcon>
                    <SimCardIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Additional Sim" />
                </ListItem>
                 <ListItem button className={this.state.currentlySelected === 'additionalHandset' ? classes.currentlySelected : null}
                                  onClick={() => {this.props.onAdditionalHandsetClicked()
                                                  this.setState({currentlySelected: 'additionalHandset'})}}>
                  <ListItemIcon>
                    <SmartphoneIcon />
                  </ListItemIcon>
                  <ListItemText primary="Additional Handset" />
                </ListItem>
               <ListItem button>
                  <ListItemIcon>
                    <AddIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Add To Plan" />
                </ListItem>
                <ListItem button className={this.state.currentlySelected === 'customerProfile' ? classes.currentlySelected : null}
                                 onClick={() => {this.props.onCustomerProfileClicked()
                                                 this.setState({currentlySelected: 'customerProfile'})}} >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Toolkit" />
                </ListItem>
           </div>
        )
    }
}
export default withStyles(styles)(CTNDetails)