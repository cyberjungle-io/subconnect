import React from 'react';

const VideoDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Video component provides a streamlined way to embed and control YouTube videos in your projects.
          It offers customizable playback controls and responsive embedding capabilities.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>YouTube video embedding with URL parsing</li>
          <li>Customizable playback controls</li>
          <li>Autoplay and loop functionality</li>
          <li>Responsive container sizing</li>
          <li>Global styling integration</li>
        </ul>
      </section>

      <section id="video-controls" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Video Controls</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Settings</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Video URL:</strong> Accepts YouTube video URLs</li>
          <li><strong>Autoplay:</strong> Automatically starts playback when loaded</li>
          <li><strong>Controls:</strong> Shows/hides YouTube player controls</li>
          <li><strong>Loop:</strong> Continuously replays the video</li>
          <li><strong>Muted:</strong> Controls initial audio state</li>
        </ul>
      </section>

      <section id="implementation" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Implementation Examples</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Video Implementation</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
{`// Basic video with default settings
const MyVideo = () => (
  <VideoRenderer
    component={{
      props: {
        youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID",
        controls: true,
        autoplay: false,
        loop: false,
        mute: false
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Auto-Playing Video</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
{`// Video with autoplay enabled (requires mute)
const AutoplayVideo = () => (
  <VideoRenderer
    component={{
      props: {
        youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID",
        autoplay: true,
        mute: true
      }
    }}
  />
)`}
          </pre>
        </div>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Always use valid YouTube URLs</li>
          <li>Enable mute when using autoplay (browser requirement)</li>
          <li>Consider mobile users when setting default controls</li>
          <li>Use appropriate container sizes for responsive layouts</li>
        </ul>
      </section>

      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Common Issues</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Video not playing:</strong>
              <p>Ensure the YouTube URL is correct and the video is publicly available.</p>
            </li>
            <li>
              <strong>Autoplay not working:</strong>
              <p>Browsers require videos to be muted for autoplay to function.</p>
            </li>
            <li>
              <strong>Sizing issues:</strong>
              <p>Check container dimensions and ensure proper responsive styling.</p>
            </li>
          </ul>
        </div>
      </section>

      <section id="limitations" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Limitations & Considerations</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Currently supports YouTube videos only</li>
            <li>Autoplay requires muted audio (browser policy)</li>
            <li>Some features may be restricted by YouTube's embed policies</li>
            <li>Video availability depends on YouTube's content restrictions</li>
          </ul>
        </div>
      </section>

      <section id="accessibility" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Keyboard Controls:</strong>
              <p>YouTube's embedded player provides built-in keyboard navigation</p>
            </li>
            <li>
              <strong>Screen Readers:</strong>
              <p>Use appropriate titles and descriptions for embedded videos</p>
            </li>
            <li>
              <strong>Captions:</strong>
              <p>Enable closed captions when available through YouTube's controls</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default VideoDocs;