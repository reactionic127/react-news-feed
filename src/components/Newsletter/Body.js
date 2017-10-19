import React from 'react';

import FittedImage from 'react-fitted-image';
import 'react-fitted-image/lib/react-fitted-image.css';
import { Panel } from 'react-bootstrap';

import Snippet from './Snippet';
import ContentSwapper from './ContentSwapper';

import './Body.css';

const NewsletterCover = ({ newsletter, list }) => {
  let imageUrl = list.imageUrl;
  let headline;
  if (newsletter && newsletter.content) {
    if (newsletter.content.imageUrl) {
      imageUrl = newsletter.content.imageUrl;
    }
    headline = newsletter.content.headline;
  }

  return (
    <div>

      <ContentSwapper
        transitionName="cross-fade"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
      >
        <div key="uniqueValue1" className="Body-newsletter-cover-image-wrapper">
          <FittedImage fit="cover" src={list.imageUrl} />
        </div>

        <div key="uniqueValue2" className="Body-newsletter-cover-image-wrapper">

          <FittedImage fit="cover" src={imageUrl} />

          <div className="NewsletterCard--headline">
            <span className="NewsletterCard-list-name">
              {list.name}
            </span>
            <div>
              <span className="ListItem-newsletter-title">
                {headline}
              </span>
            </div>
          </div>

        </div>
      </ContentSwapper>

    </div>
  );
};

const Body = ({
  list,
  newsletter,
  previewMode,
  onChangeTitle,
  onUpdateSnippet,
  onDeleteSnippet,
  onAddSnippet,
}) => {
  const snippesElements = newsletter.content.snippets.map((snippet, index) => (
    <Snippet
      content={snippet.body}
      key={snippet.id}
      index={index}
      onAddSnippet={onAddSnippet}
      onDeleteSnippet={onDeleteSnippet}
      onChange={(state, Raw) => {
        const value = Raw.serialize(state, { terse: true });
        onUpdateSnippet(index, 'body', value);
      }}
    />
  ));

  let maybeContent = (
    <div>
      {previewMode} preview is not available.
    </div>
  );

  if (previewMode === 'Desktop') {
    maybeContent = (
      <div>

        <NewsletterCover list={list} newsletter={newsletter} />

        <div className="Body-newsletter-title-input-wrapper">
          <input
            type="text"
            placeholder="Title"
            className="Body-newsletter-title-input"
            onChange={onChangeTitle}
            value={newsletter.content.headline}
          />
        </div>

        {snippesElements}

      </div>
    );
  }

  return (
    <Panel>
      {maybeContent}
    </Panel>
  );
};

export default Body;
