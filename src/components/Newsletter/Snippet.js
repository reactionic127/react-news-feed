import React, { Component } from 'react';
import SnippetEditor from '../SnippetEditor/SnippetEditor';

export default class Snippet extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: '1pc',
          borderLeft: '4px solid #ddd',
        }}
      >
        <div
          style={{
            flex: 1,
            paddingLeft: '2pc',
            paddingRight: '2pc',
          }}
        >
          <SnippetEditor
            index={this.props.index}
            content={this.props.content}
            onAddSnippet={this.props.onAddSnippet}
            onDeleteSnippet={this.props.onDeleteSnippet}
            onChange={this.props.onChange}
            onBackspaceDown={(state, empty) => {
              if (empty) {
                this.props.onDeleteSnippet(this.props.index);
              }
            }}
          />
        </div>
      </div>
    );
  }
}
