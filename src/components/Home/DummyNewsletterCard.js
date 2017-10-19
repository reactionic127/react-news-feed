import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import colorPlease from 'pleasejs';

import { dateToString } from '../../utils/dateUtils';

import './NewsletterCard.css';

const COLOR_PLEASE_OPTIONS = [
  {
    h: 130,
    s: 0.7,
    v: 0.75,
  },
  {
    scheme_type: 'complement',
  },
];

export default class NewsletterCard extends Component {
  render() {
    let newsletterDateStr;
    if (this.props.newsletter && this.props.newsletter.publishAt) {
      const datestring = dateToString(this.props.newsletter.publishAt);
      newsletterDateStr = `${datestring.time} | ${datestring.date}`;
    }

    return (
      <div
        className="NewsletterCard"
      >
        <div
          className="NewsletterCard-wrapper"
          style={{
            backgroundColor: colorPlease.make_color(...COLOR_PLEASE_OPTIONS),
          }}
        >
          <div className="NewsletterCard--headline">
            <span className="list-name">
              {this.props.list.name}
            </span>
            <Spinner spinnerName="wave" />
          </div>
        </div>
        <div className="NewsletterCard-footer">
          {this.props.list.name}
          <div className="NewsletterCard-footer-date">
            {newsletterDateStr}
          </div>
        </div>
      </div>
    );
  }
}
