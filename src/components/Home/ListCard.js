import React, { Component } from 'react';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './ListCard.css';

export default class ListCard extends Component {
  render() {
    return (
      <div className="ListCard">
        <div
          className="ListCard-wrapper"
          style={{
            backgroundImage: `url(${this.props.list.imageUrl})`,
            backgroundSize: '456px 216px',
          }}
        >
          <div className="ListCard-body">
            <ButtonToolbar>
              <ButtonGroup className="pull-left">
                <Link className="active" to={`/lists/${this.props.list.id}/newsletters`}>
                  <Button bsStyle="default" bsSize="sm">
                    Write a Newsletter
                  </Button>
                </Link>
              </ButtonGroup>
              <ButtonGroup className="pull-right">
                <Link className="active" to={`/lists/${this.props.list.id}/listsetting`}>
                  <Button bsStyle="default" bsSize="sm">
                    <img
                      alt="setting"
                      src="/images/settings_icon.png"
                    />
                  </Button>
                </Link>
              </ButtonGroup>
            </ButtonToolbar>
          </div>
        </div>
        <div className="ListCard-footer">
          {this.props.list.name}
          <div className="ListCard-footer-more-options">
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="link" bsSize="sm" onClick={this.props.onOptionsClick}>
                  <Glyphicon glyph="menu-left" />
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    );
  }
}
