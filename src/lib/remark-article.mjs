/** Remove the first H1 from the body: the layout renders the title from front matter. */
export function remarkStripFirstH1() {
  return (tree) => {
    const i = tree.children.findIndex((n) => n.type === 'heading' && n.depth === 1);
    if (i !== -1) tree.children.splice(i, 1);
  };
}

/** Remove the trailing "---" + italic disclaimer paragraph: the layout renders its own. */
export function remarkStripFooter() {
  return (tree) => {
    const c = tree.children;
    const last = c[c.length - 1];
    const prev = c[c.length - 2];
    const isDisclaimer =
      last && last.type === 'paragraph' &&
      last.children[0] && last.children[0].type === 'emphasis' &&
      /^Cypress Command builds/.test(mdText(last.children[0]));
    if (isDisclaimer && prev && prev.type === 'thematicBreak') c.splice(c.length - 2, 2);
    else if (isDisclaimer) c.splice(c.length - 1, 1);
  };
}

function mdText(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(mdText).join('');
}

/**
 * Wrap "The view from …" H2/H3 sections in a field-note aside, and the closing
 * "The practical next step" H2 section in a next-step aside. Operates on
 * tree.children directly; walks forward, adjusting the cursor past each
 * wrapped region as it splices the open/close html nodes in.
 */
export function remarkPlates() {
  return (tree) => {
    const children = tree.children;
    let i = 0;
    while (i < children.length) {
      const node = children[i];
      if (
        node.type === 'heading' &&
        (node.depth === 2 || node.depth === 3) &&
        /^the view from/i.test(mdText(node).trim().toLowerCase())
      ) {
        const boundaryDepth = node.depth;
        let j = i + 1;
        while (j < children.length && !(children[j].type === 'heading' && children[j].depth <= boundaryDepth)) j++;
        children.splice(j, 0, { type: 'html', value: '</aside>' });
        children.splice(i, 0, {
          type: 'html',
          value: '<aside class="plate-note wash-ink"><span class="plate-label">FIELD NOTE · ARNOULD BLVD</span>',
        });
        i = j + 2;
        continue;
      }
      if (node.type === 'heading' && node.depth === 2 && mdText(node).trim().toLowerCase() === 'the practical next step') {
        let j = i + 1;
        while (j < children.length && !(children[j].type === 'heading' && children[j].depth === 2)) j++;
        children.splice(j, 0, { type: 'html', value: '</aside>' });
        children.splice(i, 0, {
          type: 'html',
          value: '<aside class="plate-note wash-olive next-step"><span class="plate-label">NEXT STEPS</span>',
        });
        i = j + 2;
        continue;
      }
      i++;
    }
  };
}
