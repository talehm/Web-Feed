import React, { useState, useEffect }  from 'react';
import { fade, makeStyles,withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import RepeatIcon from '@material-ui/icons/Repeat';
import Update from '@material-ui/icons/Update';
import LogIcon from '@material-ui/icons/LibraryBooks';
import AccountCircle from '@material-ui/icons/AccountCircle';
import GoogleFontLoader from 'react-google-font-loader';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateProviders,getLogs, changeUpdateInterval,changeAgingInterval,fetchSettings } from '../actions/Actions';
import Fab from '@material-ui/core/Fab';
import ModalContainer from './Modal';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import logo from '../logo.svg';

import Link from '@material-ui/core/Link';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Moment from 'react-moment';
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);


const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const agingSelect = [
  {
    value: 'SECOND',
    label: 'Seconds',
  },
  {
    value: 'MINUTE',
    label: 'Minutes',
  },
  {
    value: 'HOUR',
    label: 'Hours',
  },
  {
    value: 'DAY',
    label: 'Days',
  },
  {
    value: 'WEEK',
    label: 'Weeks',
  },
  {
    value: 'MONTH',
    label: 'Months',
  },
  {
    value: 'YEAR',
    label: 'Years',
  },
]
const updateSelect = [
  {
    value: 1000,
    label: 'Seconds',
  },
  {
    value: 60000,
    label: 'Minutes',
  },
  {
    value: 3600000,
    label: 'Hours',
  },
  {
    value: 86400000,
    label: 'Days',
  },
  {
    value: 604800000,
    label: 'Weeks',
  },
  {
    value: 2592000000,
    label: 'Months',
  },
  {
    value: 31536000000,
    label: 'Years',
  },
];

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function Navbar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpenModal] = React.useState(false);
  const [openType,setOpenType]=React.useState(false);
  const [values, setValues] = React.useState({
    age: '',
    update:'',
    updateInterval: '60000',
    agingInterval:'DAY',
  });
  const [reloading, setReload]=React.useState(null);
  const [errorUpdate, setUpdateError]=React.useState(null);
  const [errorAging, setAgingError]=React.useState(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  function updateFeeds(){
      //console.log("Ss");
      props.updateProviders();

  }
  function setUpdateInterval(){
    setOpenType("updateInterval")
    setOpenModal(true);

  }
  function setAgingInterval(){
    setOpenType("agingInterval")
    setOpenModal(true);

  }
  function handleClose(){
    setOpenModal(false);
  }

  function handleUpdateInterval(){
    var number=document.getElementById("update").value
    var interval=document.getElementById("updateInterval").value
    if(number && interval){
      props.changeUpdateInterval(number*interval);
      handleClose();
    }
    else{
      setUpdateError("Please fill the Form")
    }


  }
  function getLogs(){
    props.getLogs();
    console.log(props.logs);

    setOpenType("logs")
    setOpenModal(true);


  }
  function handleAgingInterval(){
    var number=document.getElementById("aging").value
    var interval=document.getElementById("agingInterval").value
    if(number && interval){
      props.changeAgingInterval(number+" "+interval);
      handleClose()
    }
    else{
      setAgingError("Please fill the Form")
    }
  }
  function getOwnFeed(){
    setOpenType("getOwnFeed")
    setOpenModal(true);

  }
  function reload(){
    window.location.reload();
  }
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="Show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="Show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="Account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );



  let modalContent="";
  if(openType=="updateInterval"){
     modalContent=(<Grid container  spacing={5} justify="center"   >
    <Grid item xs={12}>
            <Typography variant="h6" component="h2" align="center" >
              Set Update Interval
            </Typography>
            </Grid>
    <Grid item xs={6}>
      <TextField
          id="update"
          label="Number"
          value={values.update}
          onChange={handleChange('update')}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          variant="outlined"
        />
        </Grid>
        <Grid item xs={6}>

        <TextField
          id="updateInterval"
          select
          label="Interval"
          className={classes.textField}
          value={values.updateInterval}
          onChange={handleChange('updateInterval')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select your currency"
          margin="normal"
          variant="outlined"
        >
          {updateSelect.map(option => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        </Grid>
      
            <Grid item xs={12} >

      <Typography variant="subtitle1" component="p" color="secondary" align="center" >
                  {errorUpdate}
          </Typography></Grid>
        <Button variant="contained" color="primary" className={classes.button} onClick={handleUpdateInterval} >
                Set
              </Button>

        </Grid>

  );
  }
  else if(openType=="agingInterval"){
     modalContent=(<Grid container  spacing={5} justify="center"   >
    <Grid item xs={12}>
            <Typography variant="h6" component="h2" align="center" >
                    Set Aging Interval
            </Typography>
            </Grid>
    <Grid item xs={6}>
      <TextField
          id="aging"
          label="Number"
          value={values.age}
          onChange={handleChange('age')}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          variant="outlined"
        />
        </Grid>
        <Grid item xs={6}>

        <TextField
          id="agingInterval"
          select
          label="Interval"
          className={classes.textField}
          value={values.agingInterval}
          onChange={handleChange('agingInterval')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select your currency"
          margin="normal"
          variant="outlined"
        >
          {agingSelect.map(option => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h6" component="h2" align="center" >
             Now, It is set to
              {" "+props.settings[1].timing}
            </Typography>
            </Grid>
            <Grid item xs={12} >

<Typography variant="subtitle1" component="p" color="secondary" align="center" >
            {errorAging}
    </Typography></Grid>
        <Button variant="contained" color="primary" className={classes.button} onClick={handleAgingInterval} >
                Set
              </Button>

        </Grid>

  );
  }
  else if(openType=="logs"){
    modalContent=<Grid container>
          <Grid item xs={12}><Typography variant="h6" component="h2" align="center" >
          Logs
        </Typography>
        <Paper >
        <Table >
          <TableHead>
            <TableRow>
              <StyledTableCell style={{fontSize:16}}>Date</StyledTableCell>
              <StyledTableCell align="right" style={{fontSize:16}}>Type</StyledTableCell>
              <StyledTableCell align="right" style={{fontSize:16}}>Row Count</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.logs.map(row => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                <Moment format="DD MMM, YYYY HH:mm:ss">
                {row.date}
                  </Moment>                </StyledTableCell>
                <StyledTableCell align="right">{row.type}</StyledTableCell>
                <StyledTableCell align="right">{row.text}</StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      </Grid>
              </Grid>
  }
  else if(openType=="getOwnFeed"){
    const feeds=['provide_rss_feed','provide_atom_feed'];
    modalContent=<Grid container>
      <Grid item xs={12}>
            <Typography variant="h6" component="h2" align="center" >
                    Our Feeds
            </Typography>
            </Grid>
              {feeds.map((value)=><Grid key={value} item xs={12}>
              <Link
                  color="textSecondary"
                  component="button"
                  variant="h6">
                  <a href={"http://www.ourteam.com:3200/"+value} target="_blank"> http://www.ourteam.com:3200/{value} </a>
              </Link>
              </Grid>)}

            </Grid>
  }
/*if(reloading){
  return(<div className="App">
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>
      Edit <code>src/App.js</code> and save to reload.
    </p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </header>
</div>)
}else{*/
  return (

    <div className={classes.grow}>
       <GoogleFontLoader
      fonts={[
        {
          font: 'Roboto',
          weights: [400, '400i'],
        },
        {
          font: 'Roboto Mono',
          weights: [400, 700],
        },
      ]}
      subsets={['cyrillic-ext', 'greek']}
    />
      <AppBar position="static" style={{backgroundColor:'#005f50'}} className="navbar">
      <ModalContainer data={{open:open, content:modalContent}} handleClose={handleClose}/>
        <Toolbar>
        <img src={require("../images/logo.png")} style={{height:70,cursor:'pointer'}} onClick={reload}/>
          <Typography className={classes.title} variant="h6" style={{cursor:'pointer', fontFamily:'Armata'}} noWrap onClick={reload}>
            TUC NEWS
          </Typography>

          <div className={classes.grow} />

            <Button variant="contained"  color="default" className={classes.button} style={{marginRight:15}}onClick={getLogs}>

              <LogIcon /> Logs
            </Button>
            <Button variant="contained"  color="primary" className={classes.button} style={{marginRight:15}} onClick={updateFeeds}>

               Update Now <Update />
            </Button>
            <Button variant="contained"  color="primary" className={classes.button} style={{marginRight:15}} onClick={setUpdateInterval}>

            Set Update Time  <RepeatIcon />
            </Button>
            <Button variant="contained"  color="primary" className={classes.button} style={{marginRight:15}}onClick={setAgingInterval}>

            <RepeatIcon /> Set Aging            </Button>
            <Button variant="contained"  color="primary" className={classes.button} style={{marginRight:15}} onClick={getOwnFeed}>

            <RepeatIcon /> Get Your Own Feed            </Button>

          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="Show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
//}

Navbar.propTypes={
    providers: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
    providers: state.redux.providers,
    settings:state.redux.settings,
    logs:state.redux.logs,
  });

  export default connect(mapStateToProps, {getLogs,fetchSettings,changeAgingInterval,updateProviders,changeUpdateInterval})(Navbar);
