import React, { useState, Fragment,useEffect } from 'react';
import clsx from 'clsx';
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HelpIcon from '@material-ui/icons/Help';
import PublishIcon from '@material-ui/icons/Publish';
import AskQuestion from './components/AskQuestion'
import SubmitParagraph from './components/SubmitParagraph'
import Paragraphs from './components/Paragraphs'
import Questions from './components/Questions'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-mui'
import { ListItemIcon } from '@material-ui/core';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import DescriptionIcon from '@material-ui/icons/Description';
import * as qna from '@tensorflow-models/qna';
import * as tf from '@tensorflow/tfjs-core'

const drawerWidth = 240;
const history = createBrowserHistory();
// var model;
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarMargin: theme.mixins.toolbar,
  aboveDrawer: {
    zIndex: theme.zIndex.drawer + 1
  }
});

const MyToolbar = withStyles(styles)(
  ({ classes, title, onMenuClick }) => (
    <Fragment>
      <AppBar className={classes.aboveDrawer}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            className={classes.flex}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </Fragment>
  )
);

const MyDrawer = withStyles(styles)(
  ({ classes, variant, open, onClose, onItemClick,loading,model }) => (
    <Router history={history}>
    <Drawer variant={variant} open={open} onClose={onClose}
                classes={{
                  paper: classes.drawerPaper
                }}
    >
      <div
        className={clsx({
          [classes.toolbarMargin]: variant === 'persistent'
        })}
      />
      <List>
       
        <ListItem button component={Link} to="/" onClick={onItemClick('Ask Question')}>
        <ListItemIcon><HelpIcon/></ListItemIcon>
          <ListItemText>Ask Question</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/SubmitParagraph" onClick={onItemClick('Submit Paragraph')}>
          <ListItemIcon><PublishIcon/></ListItemIcon>
          <ListItemText>Submit Paragraph</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/Paragraphs" onClick={onItemClick('Paragraphs')}>
          <ListItemIcon><DescriptionIcon/></ListItemIcon>
          <ListItemText>Paragraphs</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/Questions" onClick={onItemClick('Questions')}>
          <ListItemIcon><LiveHelpIcon/></ListItemIcon>
          <ListItemText>Questions</ListItemText>
        </ListItem>
      </List>
    </Drawer>
    <main className={classes.content}>
        <Route exact path="/"><AskQuestion loading={loading} model={model}/></Route>
        <Route path="/SubmitParagraph" component={SubmitParagraph} />
        <Route path="/Paragraphs" component={Paragraphs} />
        <Route path="/Questions" component={Questions} />
    </main>
    </Router>
  )
);

function AppBarInteraction({ classes, variant }) {
  const [drawer, setDrawer] = useState(false);
  const [title, setTitle] = useState('Ask Question');
  const [loading,setLoading] = React.useState(true)
  const [model,setModel] = React.useState()

  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  useEffect(()=>{
    tf.setBackend('webgl')
    qna.load().then(models => {
      setLoading(false)
  setModel(models)
    })
  },[])

  const onItemClick = title => () => {
    setTitle(title);
    setDrawer(variant === 'temporary' ? false : drawer);
    setDrawer(!drawer);
  };

  return (
    <AlertProvider template={AlertTemplate} {...options}>
    <div className={classes.root}>
      <MyToolbar title={title} onMenuClick={toggleDrawer} />
      <MyDrawer
        loading={loading}
        model={model}
        open={drawer}
        onClose={toggleDrawer}
        onItemClick={onItemClick}
        variant={variant}
      />
    </div>
    </AlertProvider>
  );
}

export default withStyles(styles)(AppBarInteraction);