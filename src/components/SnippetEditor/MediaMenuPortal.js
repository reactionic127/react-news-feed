import React, { Component } from 'react';
import AnchoredPortal from './AnchoredPortal';

class MediaMenuPortal extends Component {
  renderButton = (type, icon, isActive, handleMouseDown) => {
    // Render a mark-toggling toolbar button.
    const onMouseDown = e => handleMouseDown(e, type);
    const active = isActive(type);

    return (
      <span
        className="SnippetEditor-button"
        onMouseDown={onMouseDown}
        data-active={active}
      >
        <img
          src={`/images/editor-icons/${icon}.png`}
          alt="img"
          style={{
            width: '20px',
            height: '20px',
            opacity: active ? 1 : 0.5,
          }}
        />
      </span>
    );
  };

  hasBlock = type => {
    // Check if the any of the currently selected blocks are of `type`.
    return this.props.editorState.blocks.some(node => node.type === type);
  };

  render() {
    return (
      <AnchoredPortal node={this.props.node} offset={{ y: -8 }}>
        <div style={{ backgroundColor: 'transparent' }}>
          <div className="MediaMenu">
            {this.renderButton(
              'image',
              'Image',
              () => false,
              this.props.onClickImage,
            )}
            {this.renderButton(
              'video',
              'Video',
              () => false,
              this.props.onClickVideo,
            )}
            {this.renderButton(
              'read-more',
              'Read More',
              this.hasBlock,
              this.props.onClickBlock,
            )}
          </div>
        </div>
      </AnchoredPortal>
    );
  }
}

export default MediaMenuPortal;
