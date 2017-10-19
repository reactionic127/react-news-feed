import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import { dateToString } from '../../utils/dateUtils';

import './NewsletterCard.css';

export default class NewsletterCard extends Component {
  render() {
    let newsletterDateStr;
    if (this.props.newsletter && this.props.newsletter.publishAt) {
      const datestring = dateToString(this.props.newsletter.publishAt);
      newsletterDateStr = `${datestring.time} | ${datestring.date}`;
    }

    let imageUrl = this.props.list.imageUrl;
    if (this.props.newsletter.content.imageUrl) {
      imageUrl = this.props.newsletter.content.imageUrl;
    }

    return (
      <div className="NewsletterCard">
        <Link
          style={{ textDecoration: 'none' }}
          to={`/lists/${this.props.list.id}/newsletters/${this.props.newsletter.id}`}
        >
          <div
            className="NewsletterCard-wrapper"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: '456px 216px',
            }}
          >
            <div className="NewsletterCard-logo-container">
              <img
                alt=""
                className="NewsletterCard-logo"
                src="/images/dummy/cnn.png"
              />
            </div>
            <div className="NewsletterCard--headline">
              <span className="NewsletterCard-list-name">
                {this.props.list.name}
              </span>
              <div>
                <span className="ListItem-newsletter-title">
                  {this.props.newsletter &&
                    this.props.newsletter.content.headline}
                </span>
              </div>
            </div>
          </div>
        </Link>
        <div className="NewsletterCard-footer">
          {this.props.list.name}
          <div className="NewsletterCard-footer-date">
            {newsletterDateStr}
          </div>
          <div className="NewsletterCard-footer-more-options">
            <ButtonToolbar>
              <ButtonGroup>
                <Button
                  bsStyle="link"
                  bsSize="sm"
                  onClick={this.props.onOptionsClick}
                >
                  <Glyphicon glyph="option-horizontal" />
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    );
  }
}
