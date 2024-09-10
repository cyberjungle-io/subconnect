export const validateHtmlContent = (content) => {
    // This regex pattern allows for more flexible content, including text nodes
    const safePattern = /^(?:<(?:p|b|i|em|strong|u|span|br)(?:\s+style="[^"]*")?>[^<]*(?:<\/(?:p|b|i|em|strong|u|span)>)?|<br\s*\/?>|\s|[^<>])*$/i;
    return safePattern.test(content);
  };