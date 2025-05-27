function sanitizeSvgContent(content) {
  if (!content) return "";
  
  // Fix common XML issues
  return content
      // Ensure XML declaration is correct
      .replace(/^<\?xml[^>]*\?>/, '<?xml version="1.0" encoding="UTF-8" standalone="no"?>')
      // Fix self-closing tags
      .replace(/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*)\/>/g, '<$1 $2></$1>')
      // Remove any control characters
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Fix unclosed CDATA sections
      .replace(/<!\[CDATA\[([^\]]*)(?!\]\]>)/g, '<![CDATA[$1]]>')
      // Fix unescaped ampersands
      .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
}

/*
Removes stuff like this:
<sodipodi:namedview id="namedview726" pagecolor="#ffffff" bordercolor="#999999" borderopacity="1" showgrid="false" inkscape:showpageshadow="0" inkscape:pageopacity="0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:zoom="0.84852812" inkscape:cx="463.74421" inkscape:cy="344.12531" inkscape:window-width="1872" inkscape:window-height="1027" inkscape:window-x="62" inkscape:window-y="25" inkscape:window-maximized="1" inkscape:current-layer="template"/> 
*/
function removeNamedViews(document) {
  // Use namespace-aware selector to avoid pseudo-class error
  const namedViews = document.getElementsByTagNameNS('*', 'namedview');
  Array.from(namedViews).forEach(view => {
    view.parentNode.removeChild(view);
  });
}


module.exports = {
  removeNamedViews,
  sanitizeSvgContent
}; 