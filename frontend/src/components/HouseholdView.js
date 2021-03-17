import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import HomeIcon from '@material-ui/icons/Home';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link"
import TableContainer from '@material-ui/core/TableContainer'

const styles = () => ({
    title: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650,
        paddingBottom: 4
    },
    houseIcon: {
        padding: '4px ',
    },
    overviewText: {
        paddingTop: 8,
        display: 'flex',
    },
    text: {
        display: 'flex',
        justifyContent: 'center',
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
    table: {
        paddingTop: 10,
        height: '15vh',
        overflow: 'scroll',
        color: 'blue'
    },
    tableColor:{
        backgroundColor: '#fdfcfe'
    },
    tableHeading:{
        fontWeight: 580
    }
});

class HouseholdView extends Component {


    componentDidMount() {
        this.handleUpgradeDateColour()
    }

    handleUpgradeDateColour = (line) => {
        if (line <= 0){
            return this.props.classes.textSuccess
        }else if (line <= 100){
            return this.props.classes.textWarning
        }else {
            return this.props.classes.textDanger
        }
    }
    
    render() {

        const {classes, customer, otherLines} = this.props

        return (
           <div>
                <Box>
                    <Grid container>
                        <Grid item xs={10}>
                            <Typography className={classes.title} variant='h6'>Household View</Typography>
                        </Grid>
                        <Grid item xs={2} className={classes.houseIcon}>
                             <HomeIcon/>
                        </Grid>
                    </Grid>
                    <Divider/>
                    <Box>
                        <Grid container className={classes.overviewText}>
                            <Grid className={classes.text} item xs={3}>
                                <Typography>CTNs: <strong className={classes.textSuccess}>{customer.total_lines}</strong></Typography>
                            </Grid>
                            <Grid className={classes.text} item xs={5}>
                                <Typography>Credit Class: <strong className={classes.textSuccess}>{customer.credit_class}</strong></Typography>
                            </Grid>
                              <Grid className={classes.text} item xs={4}>
                                <Typography>Add Line: <strong className={classes.textSuccess}>{customer.add_lines_available}</strong></Typography>
                            </Grid>
                        </Grid>
                        <Box className={classes.table}>
                            <TableContainer component={Paper}>
                                <Table size="small" className={classes.tableColor}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tableHeading}>CTN</TableCell>
                                            <TableCell className={classes.tableHeading} align='right'>User</TableCell>
                                            <TableCell className={classes.tableHeading} align='right'>Upgrade</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            otherLines.map((otherLine, index) => {
                                                const colour = this.handleUpgradeDateColour(otherLine.days_remaining)
                                                return (
                                                        <TableRow hover={true} key={index}>
                                                            <TableCell className={classes.tableHeading}><Link onClick={() => {this.props.onNewCTNClicked(otherLine.number)}}>{otherLine.number}</Link></TableCell>
                                                            <TableCell align='right'>{otherLine.user}</TableCell>
                                                            <TableCell className={colour} align='right'>{otherLine.upgrade_date}</TableCell>
                                                        </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                    </Box>
                </Box>
           </div>
        )
    }
}
export default withStyles(styles)(HouseholdView)