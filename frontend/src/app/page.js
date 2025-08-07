// // // // frontend/src/app/page.js
// 'use client';
// import { useState } from 'react';
// import { CldImage } from 'next-cloudinary';

// export default function Home() {
//   const [prompt, setPrompt] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleGenerate = async () => {
//     if (!prompt) {
//       setError('Please enter a prompt');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setImageUrl('');

//     try {
//       const res = await fetch('/api/generate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await res.json();
//       if (data.imageUrl) {
//         setImageUrl(data.imageUrl);
//       } else {
//         setError(data.error || 'Failed to generate image');
//       }
//     } catch (err) {
//       console.error('Frontend error:', err);
//       setError('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-100 to-purple-100">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">FLUX.1‑dev Image Generator</h1>

//       <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Describe the image you want..."
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//           rows="3"
//         />

//         <button
//           onClick={handleGenerate}
//           disabled={loading || !prompt}
//           className={`w-full p-3 text-white font-semibold rounded-lg mt-4 ${
//             loading || !prompt ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? 'Generating...' : 'Generate Image'}
//         </button>

//         {error && (
//           <p className="mt-4 text-red-600 text-sm">{error}</p>
//         )}

//         {imageUrl && (
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold text-gray-700 mb-3">Generated Image:</h3>
//             <CldImage
//               src={imageUrl}
//               width="1024"
//               height="1024"
//               alt="Generated Image"
//               crop="fill"
//               sizes="100vw"
//               className="rounded-lg shadow-md w-full"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { CldImage } from 'next-cloudinary';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sample prompts for inspiration
  const samplePrompts = [
    'A futuristic city at sunset',
    'A serene forest with glowing fireflies',
    'A dragon flying over mountains',
    'A cyberpunk street scene at night',
    'A steampunk robot in a desert',
  ];

  // Load history and dark mode preference from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('imageHistory') || '[]');
    setHistory(savedHistory);

    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save to history
  const saveToHistory = (newImage) => {
    const updatedHistory = [newImage, ...history].slice(0, 10); // Keep last 10 images
    setHistory(updatedHistory);
    localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }
    setLoading(true);
    setImageUrl('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        saveToHistory({ prompt, imageUrl: data.imageUrl, timestamp: Date.now() });
        toast.success('Image generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Frontend error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSamplePrompt = (sample) => {
    setPrompt(sample);
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'generated-image.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-chatgpt-bg to-purple-50 dark:bg-chatgpt-bg flex flex-col text-gray-900 dark:text-chatgpt-text transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 dark:bg-chatgpt-panel/90 backdrop-blur-md shadow-sm p-4 flex justify-between items-center z-10 transition-colors duration-300">
        {/* <h1 className="text-2xl font-bold text-gray-800 dark:text-chatgpt-text">KINPLUS-dev Image Generator</h1> */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-chatgpt-text"><img src="https://res.cloudinary.com/dl4a6kmzr/image/upload/v1746012081/kinplusBluelogo_yyxikf.png" alt="" /></h1>
        <div className="flex gap-2 items-center">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-chatgpt-input text-gray-700 dark:text-chatgpt-text transition-colors duration-300 shadow"
            aria-label={`Toggle ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-chatgpt-panel"
            aria-label="Toggle history panel"
            onClick={() => setShowHistory(!showHistory)}
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-chatgpt-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 p-6 gap-6">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-chatgpt-panel rounded-xl shadow-lg p-6 transition-all duration-300">
            {/* Prompt Input */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want..."
                className="w-full p-4 border border-gray-200 dark:border-chatgpt-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-chatgpt-accent resize-none text-gray-700 dark:text-chatgpt-text bg-white dark:bg-chatgpt-input"
                rows="4"
                maxLength="200"
                aria-label="Image prompt input"
              />
              <span className="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-chatgpt-textSecondary">
                {prompt.length}/200
              </span>
            </div>

            {/* Sample Prompts */}
            <div className="mt-4 flex flex-wrap gap-2">
              {samplePrompts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSamplePrompt(sample)}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-chatgpt-input text-blue-700 dark:text-chatgpt-textSecondary rounded-full hover:bg-blue-200 dark:hover:bg-chatgpt-panel transition"
                >
                  {sample}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className={`w-full p-3 mt-4 text-white font-semibold rounded-lg flex items-center justify-center transition-all duration-300 ${
                loading || !prompt
                  ? 'bg-gray-400 dark:bg-chatgpt-input cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-chatgpt-accent dark:to-chatgpt-accent hover:from-blue-700 hover:to-purple-700 dark:hover:from-chatgpt-accentHover dark:hover:to-chatgpt-accentHover'
              }`}
              aria-label={loading ? 'Generating image' : 'Generate image'}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
              ) : null}
              {loading ? 'Generating...' : 'Generate Image'}
            </button>

            {/* Generated Image */}
            {imageUrl && (
              <div className="mt-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-chatgpt-textSecondary mb-3">Generated Image:</h3>
                <div className="relative group">
                  <CldImage
                    src={imageUrl}
                    width="1024"
                    height="1024"
                    alt="Generated Image"
                    crop="fill"
                    sizes="100vw"
                    className="rounded-lg shadow-md w-full transition-transform group-hover:scale-105 border border-gray-200 dark:border-chatgpt-input"
                  />
                  <button
                    onClick={handleDownload}
                    className="absolute bottom-2 right-2 bg-blue-600 dark:bg-chatgpt-accent text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    aria-label="Download generated image"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="w-80 bg-white dark:bg-chatgpt-panel rounded-xl shadow-lg p-4 h-fit max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-chatgpt-textSecondary mb-4">Recent Generations</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 dark:text-chatgpt-textSecondary text-sm">No images generated yet.</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="mb-4">
                  <CldImage
                    src={item.imageUrl}
                    width="200"
                    height="200"
                    alt={`Generated from: ${item.prompt}`}
                    crop="fill"
                    className="rounded-md shadow-sm w-full cursor-pointer hover:opacity-80 border border-gray-200 dark:border-chatgpt-input"
                    onClick={() => setImageUrl(item.imageUrl)}
                  />
                  <p className="text-sm text-gray-600 dark:text-chatgpt-textSecondary mt-1 truncate">{item.prompt}</p>
                  <p className="text-xs text-gray-400 dark:text-chatgpt-textSecondary">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#2d3748' : '#ffffff',
            color: isDarkMode ? '#e2e8f0' : '#1a202c',
            border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
          },
        }}
      />
      <footer className="w-full mt-8 py-6 bg-gray-900 text-gray-300 flex flex-col md:flex-row items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg text-blue-400">AI Image Generator</span>
            <span className="text-xs text-gray-500">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-4 mt-2 md:mt-0 items-center">
            <a
              href="https://github.com/JOcular1234/kinplus-text-to-image-ai.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              GitHub
            </a>
            <span className="text-xs text-gray-500">Made with ❤️ by Kinplus Technologies</span>
          </div>
        </footer>
    </div>

  );
}