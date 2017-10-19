import React, { Component } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { Grid, Col, Row, Panel, PageHeader } from 'react-bootstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dateformat from 'dateformat';
import Spinner from 'react-spinkit';
import uuid from 'uuid';

import ControlPane from './ControlPane';
import Body from './Body';

import { loadNewsletter } from '../../actions/newsletter';
import { createNewsletter, updateNewsletter } from '../../actions/newsletters';

import { createEmptySnippetState } from '../SnippetEditor/snippetEditorConstants';

class NewsletterEditor extends Component {
  constructor(props) {
    super(props);

    let newsletter = {
      content: {
        headline: '',
        snippets: [{
          id: uuid.v4(),
          body: createEmptySnippetState(),
          published: false,
        }],
        imageUrl: undefined,
      },
    };

    if (props.newsletter) {
      newsletter = {
        ...props.newsletter,
      };
    }

    this.state = {
      previewMode: 'Desktop',
      lastTimeSaved: null,
      autoSave: true,
      newsletter,
    };

    this.autoSaveTimer = null;
  }

  componentWillMount() {
    this.changePreviewMode = this.changePreviewMode.bind(this);

    this.handleInsertSnippet = this.handleInsertSnippet.bind(this);
    this.handleDeleteSnippet = this.handleDeleteSnippet.bind(this);
    this.handleUpdateSnippet = this.handleUpdateSnippet.bind(this);

    this.handleUpdateHeadline = this.handleUpdateHeadline.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    // this.props.loadLists(this.props.currentOrg.id);
    // this.props.loadNewsletters(this.props.currentOrg.id, this.props.match.params.listId);
    this.props.loadNewsletter(this.props.currentOrg.id, this.props.match.params.listId);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.newsletter) {
      return;
    }

    if (nextProps.newsletter !== this.props.newsletter) {
      this.setState(() => ({
        newsletter: {
          ...nextProps.newsletter,
        },
      }));
    }
  }

  handleUpdateSnippet(snippetIndex, objectKey, paragraphValue) {
    const newsletter = this.state.newsletter;

    const snippets = newsletter.content.snippets.map((snippet, index) => {
      if (index !== snippetIndex) {
        return snippet;
      }
      return {
        ...snippet,
        [objectKey]: paragraphValue,
      };
    });

    this.setState({
      newsletter: {
        ...this.state.newsletter,
        content: {
          ...this.state.newsletter.content,
          snippets,
        },
      },
    }, () => {
      this.scheduleAutoSave();
    });
  }

  handleUpdateHeadline(e) {
    this.setState({
      newsletter: {
        ...this.state.newsletter,
        content: {
          ...this.state.newsletter.content,
          headline: e.target.value,
        },
      },
    }, () => {
      this.scheduleAutoSave();
    });
  }

  handleInsertSnippet(index) {
    const snippets = [...this.state.newsletter.content.snippets];
    snippets.splice(index || this.state.newsletter.content.snippets, 0, {
      id: uuid.v4(),
      body: createEmptySnippetState(),
      published: false,
    });

    this.setState({
      newsletter: {
        ...this.state.newsletter,
        content: {
          ...this.state.newsletter.content,
          snippets,
        },
      },
    }, () => {
      this.scheduleAutoSave();
    });
  }

  handleDeleteSnippet(index) {
    const snippets = [...this.state.newsletter.content.snippets];

    // bail if we are deleting the only snippet
    if (snippets.length === 1) {
      return;
    }

    snippets.splice(index, 1);

    this.setState(prevState => ({
      newsletter: {
        ...prevState.newsletter,
        content: {
          ...prevState.newsletter.content,
          snippets,
        },
      },
    }), () => {
      this.scheduleAutoSave();
    });
  }

  scheduleAutoSave() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    this.autoSaveTimer = setTimeout(() => {
      this.handleSave();
    }, 5000);
  }

  handleSave(event) {
    if (event) {
      event.preventDefault();
    }

    const {
      orgId,
      list,
      newsletter,
      match,
    } = this.props;

    if (!match.params.newsletterId) {
      this.props.createNewsletter(orgId, list.id, this.state.newsletter).then((newsletterId) => {
        if (newsletterId) {
          this.props.history.replace(`/lists/${list.id}/newsletters/${newsletterId}`);
        }
      });
    } else {
      this.props.updateNewsletter(orgId, list.id, newsletter.id, this.state.newsletter);
    }

    this.setState(() => ({ lastTimeSaved: new Date() }));
  }

  changePreviewMode(previewMode) {
    this.setState({
      previewMode,
    });
  }

  render() {
    const {
      list,
      errorMessage,
      isLoading,
      isSaving,
    } = this.props;
    const {
      lastTimeSaved,
    } = this.state;

    if (isLoading) {
      return (
        <Grid>
          <PageHeader>
            <Spinner spinnerName="three-bounce" />
          </PageHeader>
        </Grid>
      );
    }

    let truncatedHeadline = this.state.newsletter.content.headline;
    if (truncatedHeadline && truncatedHeadline.length > 50) {
      truncatedHeadline = `${truncatedHeadline.substring(0, 50)}...`;
    }

    return (
      <StickyContainer>
        <Grid>
          <PageHeader>
            {list.name} <small>{truncatedHeadline}</small>{' '}
          </PageHeader>
          <Row>
            <Col />
            <Col>
              <Sticky style={{ zIndex: 1 }}>
                <Panel>
                  <ControlPane
                    newsletter={this.state.newsletter}
                    previewMode={this.state.previewMode}
                    errorMessage={errorMessage}
                    isSaving={isSaving}
                    lastTimeSaved={lastTimeSaved && dateformat(lastTimeSaved, 'shortTime')}
                    onSaveNewsletter={this.handleSave}
                    onMobilePreviewClick={() => this.changePreviewMode('Mobile')}
                    onDesktopPreviewClick={() => this.changePreviewMode('Desktop')}
                  />
                </Panel>
              </Sticky>
            </Col>
            <Col />
          </Row>

          <Row>
            <Col>
              <Body
                style={{ zIndex: 0 }}
                list={list}
                newsletter={this.state.newsletter}
                previewMode={this.state.previewMode}
                onChangeTitle={this.handleUpdateHeadline}
                onUpdateSnippet={this.handleUpdateSnippet}
                onDeleteSnippet={this.handleDeleteSnippet}
                onAddSnippet={this.handleInsertSnippet}
              />
            </Col>
          </Row>

        </Grid>
      </StickyContainer>
    );
  }
}

function mapStateToProps(state, props) {
  let isLoading = false;

  const listId = props.match.params.listId;
  const newsletterId = props.match.params.newsletterId;

  const list = state.entities.lists[listId];
  const newsletter = state.entities.newsletters[newsletterId];
  const currentOrg = state.userSession.org;

  if (!list) {
    isLoading = true;
  }

  if (newsletterId && !newsletter) {
    isLoading = true;
  }

  return {
    orgId: state.userSession.org.id,
    list,
    newsletter,
    currentOrg,
    isLoading,
    isSaving: state.newsletters.isSaving,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadNewsletter: (...args) => dispatch(loadNewsletter(...args)),
    createNewsletter: (...args) => dispatch(createNewsletter(...args)),
    updateNewsletter: (...args) => dispatch(updateNewsletter(...args)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(NewsletterEditor);
