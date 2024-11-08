import DOMPurify from 'dompurify';

export const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'span', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['style', 'class'],
    ALLOWED_STYLES: {
      '*': ['text-align', 'text-decoration', 'font-weight', 'font-style', 'color', 
            'font-family', 'font-size', 'line-height', 'letter-spacing']
    }
  });
};