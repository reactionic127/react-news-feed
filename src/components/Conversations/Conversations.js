import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import pickBy from 'lodash.pickby';
import { withRouter, Link } from 'react-router-dom';
import { FormControl } from 'react-bootstrap';
import dateformat from 'dateformat';
import { loadLists } from '../../actions/lists';
import { loadNewsletters } from '../../actions/newsletters';
import { loadConversations } from '../../actions/conversations';
import { loadMessages, createNewMessage } from '../../actions/messages';
import './Conversations.css';

function Message({ message, sentByStaff }) {
  return (
    <div className={`Conversation-message-container ${sentByStaff ? 'Conversation-message-container--outgoing' : ''}`}>
      <div className="Conversation-message-data">
        <div className="Conversation-message-from">
          {message.sender.fullName}
        </div>
        <div className="Conversation-message-sentAt">
          {dateformat(message.createdAt, 'shortTime')}
        </div>
      </div>
      <div className={`Conversation-message-body ${sentByStaff ? 'Conversation-message-body--outgoing' : ''}`}>
        {message.text}
      </div>
    </div>
  );
}

function Conversation({ subject, messages = {}, conversation = {}, newMessageText = '', ...props }) {
  return (
    <div className="Conversation-container">
      <div className="Conversation-subject">
        {subject}
      </div>
      <div
        ref={(node) => {
          props.refNode(node);
        }}
        className="Conversation-messages"
      >
        {Object.values(messages).map(message => (
          <Message
            key={message.id}
            message={message}
            sentByStaff={message.sender.id === conversation.owner.id}
          />
        ))}
      </div>
      <div className="Conversation-new-message">
        <FormControl
          value={newMessageText}
          placeholder="Type a message…"
          onChange={event => props.onChangeMessageText(event.target.value)}
          onKeyUp={event => props.onKeyUpMessageText(event.key)}
        />
      </div>
    </div>
  );
}

function ConversationPlaceholder() {
  return (
    <div className="Conversation-placeholder">
      Select a conversation
    </div>
  );
}

class Conversations extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
    this.handleKeyUpMessageText = this.handleKeyUpMessageText.bind(this);
  }

  componentDidMount() {
    const { orgId } = this.props;

    this.props.loadLists(orgId);
  }

  componentWillReceiveProps(nextProps) {
    const { orgId, lists } = this.props;
    const { match: { params: { conversationId } } } = nextProps;

    if (this.props.match.params.conversationId !== conversationId) {
      this.props.loadMessages(orgId, conversationId);
    }

    if (Object.keys(lists).length < Object.keys(nextProps.lists).length) {
      Object.values(nextProps.lists).map(list => this.props.loadNewsletters(orgId, list.id));
    }
  }

  componentDidUpdate(prevProps) {
    // FIXME: very optimistic, might be improved
    const prevMessagesCount = Object.keys(prevProps.messages).length;
    const currentMessagesCount = Object.keys(this.props.messages).length;

    if (currentMessagesCount > prevMessagesCount && this.messagesElement) {
      this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
    }
  }

  handleKeyUpMessageText(key) {
    const {
      orgId,
      match: { params: { conversationId } },
    } = this.props;
    const {
      [conversationId]: message,
    } = this.state;

    if (key === 'Enter') {
      this.setState(() => ({ [conversationId]: '' }));
      this.props.createNewMessage(orgId, conversationId, message);
    }
  }

  render() {
    const { orgId, lists, newsletters, conversations, messages } = this.props;
    const {
      match: { params: { newsletterId, conversationId } },
    } = this.props;
    const displayedConversations = pickBy(conversations, e => e.newsletterId === newsletterId);
    const displayedMessages = pickBy(messages, e => e.conversationId === conversationId);

    return (
      <div className="Conversations-container">
        <div className="Conversations-newsletters-list">
          {Object.values(newsletters).map(newsletter => (
            <Link
              key={newsletter.id}
              to={`/messages/${newsletter.id}`}
              className={`Conversations-list-item ${newsletter.id === newsletterId ? 'Conversations-list-item--highlighted' : ''}`}
              onClick={() => this.props.loadConversations(orgId, newsletter.id)}
            >
              <div className="Conversation-list-item-owner">{lists[newsletter.listId].name}</div>
              <div className="Conversation-list-item-subject">{newsletter.content.headline}</div>
            </Link>
          ))}
        </div>
        <div className="Conversations-list">
          {Object.values(displayedConversations).map(conversation => (
            <Link
              key={conversation.id}
              to={`/messages/${newsletterId}/${conversation.id}`}
              className={`Conversations-list-item ${conversation.id === conversationId ? 'Conversations-list-item--highlighted' : ''}`}
              onClick={() => this.props.loadMessages(orgId, conversation.id)}
            >
              <div className="Conversation-list-item-owner">{conversation.owner.fullName}</div>
              <div className="Conversation-list-item-subject">{conversation.subject}</div>
              <div className="Conversation-list-item-createdAt">{dateformat(conversation.createdAt, 'shortDate')}</div>
            </Link>
          ))}
        </div>
        {conversationId && conversations[conversationId] ? (
          <Conversation
            refNode={(node) => {
              this.messagesElement = node;
            }}
            subject={conversations[conversationId].subject}
            messages={displayedMessages}
            conversation={conversations[conversationId]}
            newMessageText={this.state[conversationId]}
            onChangeMessageText={value => this.setState(() => ({ [conversationId]: value }))}
            onKeyUpMessageText={this.handleKeyUpMessageText}
          />
        ) : (
          <ConversationPlaceholder />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    orgId: state.userSession.org.id,
    lists: state.entities.lists,
    newsletters: state.entities.newsletters,
    conversations: state.entities.conversations,
    messages: state.entities.messages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadLists: (...args) => dispatch(loadLists(...args)),
    loadNewsletters: (...args) => dispatch(loadNewsletters(...args)),
    loadConversations: (...args) => dispatch(loadConversations(...args)),
    loadMessages: (...args) => dispatch(loadMessages(...args)),
    createNewMessage: (...args) => dispatch(createNewMessage(...args)),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(Conversations);
