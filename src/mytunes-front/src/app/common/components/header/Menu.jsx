import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {Drawer, IconButton, MenuItem} from "material-ui";
import {Link} from "react-router-dom";

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
  
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.setMenuOpeness = this.setMenuOpeness.bind(this);
    this.state = {
      open : false
    };
  }
  
  toggleMenu() {
    this.setState({
      ...this.state,
      open: !this.state.open
    })
  }
  setMenuOpeness(open) {
    this.setState({
      ...this.state,
      open
    })
  }
  closeMenu() {
    this.setMenuOpeness(false);
  }
  
  render() {
    return (
      <div id={"menuIcon"}>
        <IconButton onClick={ this.toggleMenu }>
          <FontIcon className="material-icons">menu</FontIcon>
        </IconButton>
        <Drawer
          docked={false}
          width={250}
          open={this.state.open}
          className={ "menuDrawer" }
          onRequestChange={ this.setMenuOpeness }
        >
          <MenuItem containerElement={<Link to="/" />} onClick={ this.closeMenu }>
            <FontIcon className="material-icons">library_music</FontIcon>
            Liste musiques
          </MenuItem>
          <MenuItem containerElement={<Link to="/genres" />} onClick={ this.closeMenu }>
            <FontIcon className="material-icons">dashboard</FontIcon>
            Liste par genre
          </MenuItem>
          <MenuItem containerElement={<Link to="/test" />} onClick={ this.closeMenu }>
            <FontIcon className="material-icons">dashboard</FontIcon>
            Test tableau
          </MenuItem>
        </Drawer>
      </div>
    );
  }
}

Menu.propTypes = {
};
