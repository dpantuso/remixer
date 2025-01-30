import React, { useState } from 'react';

interface TweetThreadProps {
  tweets: string[];
}

export const TweetThread: React.FC<TweetThreadProps> = ({ tweets }) => {
  if (!tweets.length) return null;

  // Split tweets into two columns
  const leftColumn = tweets.slice(0, 4);
  const rightColumn = tweets.slice(4, 8);

  const TweetCard = ({ tweet, index }: { tweet: string; index: number }) => {
    const [tweetText, setTweetText] = useState(tweet);
    const MAX_CHARS = 280;
    const remainingChars = MAX_CHARS - tweetText.length;
    const charCountColor = remainingChars < 20 
      ? 'text-red-500' 
      : remainingChars < 50 
        ? 'text-yellow-500' 
        : 'text-gray-400';

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(tweetText);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    };

    const handleTweet = () => {
      const encodedTweet = encodeURIComponent(tweetText);
      window.open(`https://twitter.com/intent/tweet?text=${encodedTweet}`, '_blank');
    };

    return (
      <div className="relative group h-55">
        <div className="absolute -left-8 top-2 text-gray-400 font-medium">
          {index + 1}
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors h-full flex flex-col">
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            className="w-full text-gray-800 leading-snug mb-2 resize-none border-0 focus:ring-0 p-0 flex-grow"
            rows={7}
          />
          <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
            <span className={`text-sm font-sans ${charCountColor}`}>
              {remainingChars} characters remaining
            </span>
            <div className="space-x-3">
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-blue-500 text-sm transition-colors"
              >
                Copy
              </button>
              <button 
                onClick={handleTweet}
                className="text-gray-400 hover:text-blue-500 text-sm transition-colors"
              >
                Share on X
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-3 pl-8">
        {leftColumn.map((tweet, index) => (
          <TweetCard key={index} tweet={tweet} index={index} />
        ))}
      </div>
      
      {/* Right column */}
      <div className="space-y-3 pl-8">
        {rightColumn.map((tweet, index) => (
          <TweetCard key={index + 4} tweet={tweet} index={index + 4} />
        ))}
      </div>
    </div>
  );
}; 