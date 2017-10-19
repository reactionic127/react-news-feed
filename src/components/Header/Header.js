import React, { Component } from 'react';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import { deleteUserSessionSuccess } from '../../actions/userSession';

import './styles.css';

class Header extends Component {
  render() {
    if (!this.props.token) {
      return (
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              Debut
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
      );
    }

    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link className={'active'} to={'/'}>
              Debut
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/">
              <NavItem eventKey={1.1}>
                Newsletters
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/messages">
              <NavItem eventKey={1.1}>
                Messages
              </NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <NavDropdown id="logOut" eventKey={1} title={this.props.currentUser.fullName}>
              <LinkContainer to="/profile">
                <MenuItem eventKey={1.1}>
                  Publisher Profile
                </MenuItem>
              </LinkContainer>

              <LinkContainer to="/settings">
                <MenuItem eventKey={1.1}>
                  Settings
                </MenuItem>
              </LinkContainer>

              <MenuItem divider />
              <MenuItem eventKey={1.1} href="#" onClick={this.props.logOut}>
                Log Out
              </MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>

      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.userSession.token,
    currentUser: state.userSession.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(deleteUserSessionSuccess()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
