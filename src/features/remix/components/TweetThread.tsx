import React, { useState } from 'react';
import { supabase } from '../../../config/supabase';

interface TweetThreadProps {
  tweets: string[];
  onTweetSaved: () => Promise<void>;
}

export const TweetThread: React.FC<TweetThreadProps> = ({ tweets, onTweetSaved }) => {
  if (!tweets.length) return null;

  // Split tweets into two columns
  const leftColumn = tweets.slice(0, 4);
  const rightColumn = tweets.slice(4, 8);

  const TweetCard = ({ tweet, index }: { tweet: string; index: number }) => {
    const [tweetText, setTweetText] = useState(tweet);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
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

    const handleSave = async () => {
      setIsSaving(true);
      setSaveStatus('idle');
      try {
        console.log('Saving tweet:', tweetText);
        const { data, error } = await supabase
          .from('saved_tweets')
          .insert([{ content: tweetText }])
          .select();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Tweet saved successfully:', data);
        setSaveStatus('success');
        await onTweetSaved();
        
        // Reset success message after 2 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (err) {
        console.error('Error saving tweet:', err);
        setSaveStatus('error');
      } finally {
        setIsSaving(false);
      }
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
            <div className="space-x-3 flex items-center">
              {saveStatus === 'success' && (
                <span className="text-green-500 text-sm">Saved!</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-500 text-sm">Error saving</span>
              )}
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
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="text-gray-400 hover:text-blue-500 text-sm transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
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