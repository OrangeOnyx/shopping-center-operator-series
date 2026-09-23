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
