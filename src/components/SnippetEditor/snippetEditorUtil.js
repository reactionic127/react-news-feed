export function getSelectedNode() {
  if (document.selection) {
    return document.selection.createRange().parentElement();
  }

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    return selection.getRangeAt(0).startContainer.parentNode;
  }

  return null;
}

export function getSelectionBoundaryElement(isStart) {
  let range;
  let container;

  if (document.selection) {
    range = document.selection.createRange();
    range.collapse(isStart);
    return range.parentElement();
  }

  const sel = window.getSelection();
  if (sel.getRangeAt) {
    if (sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    }
  } else {
    // olld webKit
    range = document.createRange();
    range.setStart(sel.anchorNode, sel.anchorOffset);
    range.setEnd(sel.focusNode, sel.focusOffset);

    // handle the case when the selection was selected backwards
    // (from the end to the start in the document)
    if (range.collapsed !== sel.isCollapsed) {
      range.setStart(sel.focusNode, sel.focusOffset);
      range.setEnd(sel.anchorNode, sel.anchorOffset);
    }
  }

  if (range) {
    container = range[isStart ? 'startContainer' : 'endContainer'];

    // check if the container is a text node and return its parent if so
    return container.nodeType === 3 ? container.parentNode : container;
  }

  return null;
}

export function getLastTopLevelParagraphWithChildren(state) {
  const { document } = state;

  const lastTopLevelNode = document.nodes.last();

  if (lastTopLevelNode.length > 0) {
    return lastTopLevelNode;
  }

  return null;
}

export function getTopLevelParagraphWithNoChildren(state, block) {
  const { document } = state;

  let b;
  if (!block) {
    if (!state.selection.startKey) {
      return null;
    }
    b = state.startBlock;
  }

  const child = document.getChild(b.key);
  const parent = document.getParent(b.key);

  if (parent.kind !== 'document') {
    return null;
  }

  if (child.type === 'paragraph' && child.length === 0) {
    return child;
  }

  return null;
}

export const isEmptyDocument = (state) => {
  const { document } = state;

  if (!state.selection.startKey) return false;

  const block = state.startBlock;
  const child = document.getChild(block.key);
  const parent = document.getParent(block.key);

  if (parent.kind !== 'document') {
    return false;
  }

  if (parent.nodes.size === 1 && child.length === 0) {
    return true;
  }

  return false;
};
