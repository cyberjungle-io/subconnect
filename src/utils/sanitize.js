import DOMPurify from 'dompurify';

export const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'u', 'span', 'br'],
    ALLOWED_ATTR: ['style'],
  });
};