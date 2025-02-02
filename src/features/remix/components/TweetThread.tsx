import React, { useState } from 'react';
import { supabase } from '../../../config/supabase';

interface TweetThreadProps {
  tweets: string[];
  onTweetSaved: () => Promise<void>;
}

export const TweetThread: React.FC<TweetThreadProps> = ({ tweets, onTweetSaved }) => {
  if (!tweets.length) return null;

  const MAX_CHARS = 280; // Move MAX_CHARS to component level so it can be used by both functions

  const cleanTweetText = (text: string): string => {
    const cleaned = text
      .replace(/^\|+/, '') // Remove leading pipe characters
      .trim(); // Remove leading/trailing whitespace
    
    // Truncate to MAX_CHARS if the initial tweet is too long
    return cleaned.length > MAX_CHARS ? cleaned.slice(0, MAX_CHARS) : cleaned;
  };

  const TweetCard = ({ tweet, index }: { tweet: string; index: number }) => {
    const [tweetText, setTweetText] = useState(cleanTweetText(tweet));
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const remainingChars = MAX_CHARS - tweetText.length;
    const charCountColor = remainingChars < 20 
      ? 'text-red-500' 
      : remainingChars < 50 
        ? 'text-yellow-500' 
        : 'text-gray-400';

    // Adjust textarea height on mount and content change
    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    }, [tweetText]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTweetText(e.target.value);
    };

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={tweetText}
            onChange={handleTextChange}
            className="w-full text-gray-800 text-[15px] leading-snug resize-none border-0 focus:ring-0 p-0 mb-3 overflow-hidden"
            placeholder="Write your tweet..."
          />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              {remainingChars} characters remaining
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCopy}
                className="hover:text-gray-800"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
              <button 
                onClick={handleTweet}
                className="hover:text-[#1DA1F2]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`hover:text-green-500 ${saveStatus === 'success' ? 'text-green-500' : ''}`}
              >
                {saveStatus === 'success' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Generated Tweets:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tweets.map((tweet, index) => (
          <TweetCard key={index} tweet={tweet} index={index} />
        ))}
      </div>
    </div>
  );
}; 