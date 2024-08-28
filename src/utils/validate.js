export const validateHtmlContent = (content) => {
    // This regex pattern allows only the tags and attributes we've specified as safe
    const safePattern = /^(?:<(?:p|b|i|em|strong|u|span|br)(?:\s+style="[^"]*")?>[^<]*<\/(?:p|b|i|em|strong|u|span)>|<br\s*\/?>|\s)*$/i;
    return safePattern.test(content);
  };