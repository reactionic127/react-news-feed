import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadNewsletters } from '../../actions/newsletters';

import DummyNewsletterCard from './DummyNewsletterCard';
import FlipCard from './FlipCard';

class LatestNewsletterCard extends Component {

  componentWillMount() {
    this.props.loadNewsletters(this.props.currentOrg.id, this.props.list.id);
  }

  render() {
    const newsletter = this.props.newsletter;
    const list = this.props.list;

    let latestNewsletter;
    if (newsletter) {
      latestNewsletter = (
        <div style={{ minWidth: '456px' }}>
          <FlipCard list={list} newsletter={newsletter} />
        </div>
      );
    } else {
      latestNewsletter = (
        <div className="Home-cardWrapper">
          <DummyNewsletterCard list={list} />
        </div>
      );
    }

    return latestNewsletter;
  }
}

function mapStateToProps(state) {
  return {
    currentOrg: state.userSession.org,
  };
}

export default connect(mapStateToProps, {
  loadNewsletters,
})(LatestNewsletterCard);
