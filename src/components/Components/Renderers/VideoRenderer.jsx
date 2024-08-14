import React from "react";

const VideoRenderer = ({ component, globalSettings }) => {
  const { youtubeUrl, autoplay, controls, loop, mute } = component.props;

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const embedUrl = youtubeUrl ? getYouTubeEmbedUrl(youtubeUrl) : '';
  const autoplayParam = autoplay ? 1 : 0;
  const controlsParam = controls ? 1 : 0;
  const loopParam = loop ? 1 : 0;
  const muteParam = mute ? 1 : 0;

  const finalUrl = `${embedUrl}?autoplay=${autoplayParam}&controls=${controlsParam}&loop=${loopParam}&mute=${muteParam}`;

  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globalSettings.generalComponentStyle.backgroundColor,
    borderRadius: globalSettings.generalComponentStyle.borderRadius,
    boxShadow: globalSettings.generalComponentStyle.boxShadow,
  };

  const placeholderStyle = {
    padding: '20px',
    backgroundColor: globalSettings.generalComponentStyle.backgroundColor,
    borderRadius: globalSettings.generalComponentStyle.borderRadius,
    fontFamily: globalSettings.generalComponentStyle.fontFamily,
    fontSize: globalSettings.generalComponentStyle.fontSize,
    color: globalSettings.generalComponentStyle.color,
  };

  return (
    <div style={containerStyle}>
      {embedUrl ? (
        <iframe
          width="100%"
          height="100%"
          src={finalUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div style={placeholderStyle}>
          Please enter a valid YouTube URL
        </div>
      )}
    </div>
  );
};

export default VideoRenderer;