interface TweetThreadProps {
  tweets: string[];
}

export const TweetThread: React.FC<TweetThreadProps> = ({ tweets }) => {
  if (!tweets.length) return null;

  // Split tweets into two columns
  const leftColumn = tweets.slice(0, 4);
  const rightColumn = tweets.slice(4, 8);

  const TweetCard = ({ tweet, index }: { tweet: string; index: number }) => {
    const MAX_CHARS = 280;
    const remainingChars = MAX_CHARS - tweet.length;
    const charCountColor = remainingChars < 20 
      ? 'text-red-500' 
      : remainingChars < 50 
        ? 'text-yellow-500' 
        : 'text-gray-400';

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(tweet);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    };

    return (
      <div className="relative group">
        <div className="absolute -left-8 top-2 text-gray-400 font-medium">
          {index + 1}
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
          <p className="text-gray-800 leading-snug mb-2">{tweet}</p>
          <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
            <span className={`text-sm font-sans ${charCountColor}`}>
              {remainingChars} characters remaining
            </span>
            <button 
              onClick={handleCopy}
              className="text-gray-400 hover:text-blue-500 text-sm transition-colors"
            >
              Copy
            </button>
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