import React, { Component } from 'react';
import AnchoredPortal from './AnchoredPortal';

class SideMenuPortal extends Component {
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

  render() {
    return (
      <AnchoredPortal
        menuAnchor="bottom right"
        nodeAnchor="bottom left"
        node={this.props.node}
        offset={{ y: -8 }}
      >
        <div style={{ backgroundColor: 'transparent' }}>
          <div className="SideMenu">
            {this.renderButton(
              'add-snippet',
              'Paragraph',
              () => !!this.props.trackedSnippetIndex,
              this.props.onClickAddSnippet,
            )}
          </div>
        </div>
      </AnchoredPortal>
    );
  }
}

export default SideMenuPortal;
