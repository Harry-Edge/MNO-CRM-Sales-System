import React, {Component} from 'react';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Box from "@material-ui/core/Box";
import SearchBar from "material-ui-search-bar";
import Button from "@material-ui/core/Button";
import CTNDetails from "./CTNDetails";
import Menu from "./Menu";
import HouseholdView from "./HouseholdView";
import UpgradeOptions from "./UpgradeOptions";
import SimOnlyUpgrade from "./SimOnlyUpgradeComponents/SimOnlyUpgrade";
import HandsetUpgrade from "./HandsetUpgradeComponents/HandsetUpgrade";
import AdditionalSim from "./AdditionalSimComponents/AdditionalSim";
import AdditionalHandset from "./AdditionalHandsetComponents/AdditionalHandset";
import CustomerProfile from "./CustomerProfileComponents/CustomerProfile";
import SimOnlyRecommendations from "./SimOnlyRecommendations";
import HandsetRecommendations from "./HandsetRecommendations";
import Notes from "./NotesComponents/Notes";
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen';
import CircularProgress from "@material-ui/core/CircularProgress";


const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  test: {
    justifyContent: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 5,
    color: '#009999',
    float: 'left'
  },
  toolbarIcon: {
    float: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#009999',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    backgroundColor: '#009999',
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 50,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    fontWeight: 650
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 270,
  },
  logoutButton: {
    fontWeight: 650
  },
  username: {
    fontWeight: 650,
    paddingRight: 10,
    paddingLeft: 60
  },
  searchBox: {
    height: '30px',
    display: 'flex',

  },
  progressLoader: {
      color:'#009999',
       position: 'relative',
      marginTop: '20px',
      marginLeft: '45%'
  },

});

class Dashboard extends Component{

  state = {mobileAccount: null,
           customer: null,
           employee: null,
           otherLines: null,
           simOnlyRecommendations: null,
           handsetRecommendations: null,
           leftPanelOpen: false,
           dashboard: false,
           simOnlyUpgrade: false,
           handsetUpgrade: false,
           additionalSim: false,
           additionalHandset: false,
           customerProfile: false,
           loadingNewCTN: false
            }
            //Currently selected rather than so many variables

   constructor(props) {
       super(props);
       this.handleNewCTN = this.handleNewCTN.bind(this)
   }

  async componentDidMount() {

       const employeeDataRequestOptions = {
            headers: {'Authorization': `JWT ${localStorage.getItem('token')}`
            }}

       await fetch("http://127.0.0.1:8000/api/get-employee", employeeDataRequestOptions)
            .then((response) => response.json())
              .then((data) => this.setState({employee: data}))


      // The below fetches a number if it has been saved on the local storage due to the user
      // accidentally closing the program so they can resume with the CTN they were last on
      if (localStorage.getItem('currentCTN')){
          this.setState({loadingNewCTN: true})
          const ctnInContextRequestOptions = {
              method: 'POST',
              headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
              body: JSON.stringify({number: localStorage.getItem('currentCTN'),
                                          account_last_accessed_by: this.state.employee.username})
          }

          fetch("http://127.0.0.1:8000/api/get-customer", ctnInContextRequestOptions)
            .then((response) => response.json())
              .then((data) => {this.setState({mobileAccount: data.mobile_account,
                                                      customer: data.customer,
                                                      otherLines: data.other_lines,
                                                      simOnlyRecommendations: data.sim_only_recommendations,
                                                      handsetRecommendations: data.handset_recommendations})
                                this.handleReturnToDashboard()
                                console.log(this.state)
                                this.setState({loadingNewCTN: false})})

  }}

    handleNewCTN(ctn) {
    this.setState({loadingNewCTN: true})

    const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({number: ctn,
                                        account_last_accessed_by: this.state.employee.username})
         }

    fetch("http://127.0.0.1:8000/api/get-customer", requestOptions)
         .then((response) => {
             if (response.ok) {
                 return response.json()
             }else {
                 throw new Error("Incorrect CTN")
             }
         })
        .then((data) => {
             this.setState({mobileAccount: data.mobile_account,
                                      customer: data.customer,
                                      otherLines: data.other_lines,
                                      simOnlyRecommendations: data.sim_only_recommendations,
                                      handsetRecommendations: data.handset_recommendations},
                                        )
             localStorage.setItem('currentCTN', data.mobile_account.number)
             this.handleReturnToDashboard()
             this.setState({loadingNewCTN: false})
        }).catch((error) => {
            console.log(error)
            window.alert('Invalid CTN!')
            this.setState({loadingNewCTN: false})})

  }

  // The below needs massively sorting
  // and improving

  handleDrawerOpen = () => {
    this.setState({leftPanelOpen: true})
  };
  handleDrawerClose = () => {
    this.setState({leftPanelOpen: false})
  };
  handleSimOnlyUpgradeClicked = () => {
    this.setState({simOnlyUpgrade: true, dashboard: false})
  };
  handleHandsetUpgradeClicked = () => {
    this.setState({handsetUpgrade: true, dashboard: false})
  };
  handleReturnToDashboard = () => {
    this.setState({dashboard: true, additionalSim: false, additionalHandset: false, handsetUpgrade: false,
                          customerProfile: false, simOnlyUpgrade: false })
  };
  handleAdditionalSimClicked = () => {
    this.setState({dashboard: false, simOnlyUpgrade: false, handsetUpgrade: false, additionalHandset: false,
                          customerProfile: false, additionalSim: true})
  };
  handleAdditionalHandsetClicked = () => {
      this.setState({dashboard: false, simOnlyUpgrade: false, handsetUpgrade: false, additionalSim: false,
                           customerProfile: false, additionalHandset: true })
  }
  handleCustomerProfileClicked = () => {
      this.setState({dashboard: false, simOnlyUpgrade: false, handsetUpgrade: false, additionalSim: false,
                           additionalHandset: false, customerProfile: true})
  }

  render() {

    const {classes} = this.props
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);


      return (
        <div className={classes.root}>
          <CssBaseline />

          {/* Top Nav */}
          <AppBar position="absolute" className={this.state.leftPanelOpen ? classes.appBarShift : classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={this.state.leftPanelOpen ? classes.menuButtonHidden : classes.menuButton}
              >

                <MenuIcon/>
              </IconButton>

              <Typography component="h1" variant="h5" color="inherit" noWrap className={classes.title}>
                Excalibur Pro
              </Typography>
              <SearchBar className={classes.searchBox}
                          placeholder='Search CTN'
                          onRequestSearch={(ctn) => this.handleNewCTN(ctn)}/>
              <Box display={{ xs: 'none', sm: 'block'}}>
                  {
                      this.state.employee ?
                          <Typography  className={classes.username}>{`${this.state.employee.first_name} 
                                                                        ${this.state.employee.last_name}`}
                                                          ({this.state.employee.username})</Typography>
                      : <Typography className={classes.username}> </Typography>
                  }
              </Box>
              <Button className={classes.logoutButton} variant='contained' color='secondary' size='small'
                      onClick={() => this.props.onLogout()}>Logout</Button>
            </Toolbar>
          </AppBar>

          {/* Left Nav */}
             <Drawer
                variant="permanent"
                classes={{
                  paper: clsx(classes.drawerPaper, !this.state.leftPanelOpen && classes.drawerPaperClose),
                }}
                open={this.state.leftPanelOpen}>
                <div>
                  <Grid item xs={6} className={classes.test}>
                      <AddToHomeScreenIcon className={classes.test} fontSize='large'/>
                  </Grid>
                  <Grid item xs={6} className={classes.toolbarIcon}>
                    <IconButton onClick={this.handleDrawerClose}>
                      <ChevronLeftIcon />
                    </IconButton>
                  </Grid>
                </div>
                <Divider />
                  <List>
                    <Menu onReturnToDashboard={this.handleReturnToDashboard}
                          onAdditionalSimClicked={this.handleAdditionalSimClicked}
                          onAdditionalHandsetClicked={this.handleAdditionalHandsetClicked}
                          onCustomerProfileClicked={this.handleCustomerProfileClicked}
                            />
                  </List>
                <Divider />
                <Grid>
                  {
                    this.state.mobileAccount ?  <CTNDetails customer={this.state.customer}
                                                            mobileAccount={this.state.mobileAccount} />
                                                            : null
                  }
                </Grid>
          </Drawer>

          {/* Main Dashboard */}
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              {
                this.state.loadingNewCTN ?
                    <div>
                        <CircularProgress className={classes.progressLoader}/>
                        <br/>
                        <br/>
                        <br/>
                    </div> : null
              }
              {
                this.state.dashboard ?
                    <Grid container spacing={2}>
                      {/* Upgrade Options */}
                      <Grid item xs={12} md={8} lg={8}>
                        <Paper className={fixedHeightPaper}>
                          {
                            this.state.customer ? <UpgradeOptions mobileAccount={this.state.mobileAccount}
                                                                  onHandsetUpgradeClicked={this.handleHandsetUpgradeClicked}
                                                                  onSimOnlyUpgradeClicked={this.handleSimOnlyUpgradeClicked}
                            /> :     <CircularProgress className={classes.progressLoader}/>
                          }
                        </Paper>
                      </Grid>
                      {/* HouseHoldView */}
                      <Grid item xs={12} md={4} lg={4}>
                        <Paper className={fixedHeightPaper}>
                          {
                            this.state.customer ? <HouseholdView currentCTN={this.state.mobileAccount.number}
                                                                 onNewCTNClicked={this.handleNewCTN}
                                                                 customer={this.state.customer}
                                                                 otherLines={this.state.otherLines}
                            /> :     <CircularProgress className={classes.progressLoader}/>
                          }
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                          <Notes customer={this.state.customer} employee={this.state.employee}/>
                      </Grid>
                      {/* Recommendations */}
                      <Grid item xs={12}>
                          {
                              this.state.simOnlyRecommendations ?
                                  <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                      <SimOnlyRecommendations
                                                            onSelectedRecommendation={this.handleSimOnlyUpgradeClicked}
                                                            ctn={this.state.mobileAccount.number}
                                                            recommendedTariffs={this.state.simOnlyRecommendations}/>
                                    </Paper>
                                  </Grid>: null
                          }
                        <Paper className={classes.paper}>
                            {
                                this.state.loadingNewCTN?
                                    <CircularProgress className={classes.progressLoader}/>
                                    : <HandsetRecommendations
                                                            ctn={this.state.mobileAccount.number}
                                                            onSelectedRecommended={this.handleHandsetUpgradeClicked}
                                                            recommendedTariffs={this.state.handsetRecommendations}/>
                            }
                        </Paper>
                      </Grid>
                    </Grid> : null
              }
              {
                this.state.simOnlyUpgrade ?
                    <SimOnlyUpgrade fixedHeightPaper={fixedHeightPaper} state={this.state}
                                    onNewCTNClicked={this.handleNewCTN}
                                    onReturnToDashboard={this.handleReturnToDashboard}/> : null
              }
              {
                this.state.handsetUpgrade ?
                    <HandsetUpgrade fixedHeightPaper={fixedHeightPaper} state={this.state}
                                    onNewCTNClicked={this.handleNewCTN}
                                    onReturnToDashboard={this.handleReturnToDashboard}/> : null
              }
              {
                this.state.additionalSim ?
                    <AdditionalSim fixedHeightPaper={fixedHeightPaper} state={this.state}
                                    onNewCTNClicked={this.handleNewCTN}
                                    onReturnToDashboard={this.handleReturnToDashboard}/> : null
              }
              {
                this.state.additionalHandset ?
                    <AdditionalHandset/>: null
              }
              {
                this.state.customerProfile ?
                    <CustomerProfile customer={this.state.customer}/> : null
              }
            </Container>
          </main>
        </div>

      );
  }
}
export default withStyles(styles)(Dashboard)