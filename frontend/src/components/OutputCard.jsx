import React from 'react';
import toast from 'react-hot-toast';

const OutputCard = ({ generatedMessage, onRegenerate, onFeedback }) => {
  if (!generatedMessage) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast.success('Message copied to clipboard!');
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedMessage], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "testimonial_request.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded as TXT');
  };

  const [hoverStar, setHoverStar] = React.useState(0);
  const [submittedRating, setSubmittedRating] = React.useState(0);

  const handleStarClick = (rating) => {
    setSubmittedRating(rating);
    onFeedback(rating);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Generated Message</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">AI Generated</span>
      </div>
      
      <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100 relative group">
        <p className="text-gray-700 whitespace-pre-wrap">{generatedMessage}</p>
        
        <button 
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-white p-2 rounded-md shadow-sm border border-gray-200 text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={handleCopy} className="flex-1 min-w-[120px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <span>📋</span> Copy
        </button>
        <button onClick={handleDownloadTxt} className="flex-1 min-w-[120px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <span>💾</span> Save TXT
        </button>
        <button onClick={onRegenerate} className="flex-1 min-w-[120px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <span>🔄</span> Regenerate
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-3 text-center">
          {submittedRating ? 'Thank you for your feedback!' : 'Rate this output to help improve the prompt:'}
        </p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverStar(star)}
              onMouseLeave={() => setHoverStar(0)}
              className={`text-3xl transition-all focus:outline-none ${
                star <= (hoverStar || submittedRating) 
                  ? 'text-yellow-400 scale-110 drop-shadow-sm' 
                  : 'text-gray-200 hover:text-yellow-200'
              }`}
              title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              disabled={!!submittedRating}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutputCard;
