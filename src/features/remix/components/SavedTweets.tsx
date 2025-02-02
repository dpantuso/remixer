import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { supabase, SavedTweet } from '../../../config/supabase';

export interface SavedTweetsRef {
  refreshTweets: () => Promise<void>;
}

interface SavedTweetsProps {
  onCollapse: (isCollapsed: boolean) => void;
}

export const SavedTweets = forwardRef<SavedTweetsRef, SavedTweetsProps>(({ onCollapse }, ref) => {
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapse(collapsed);
  };

  const fetchSavedTweets = async () => {
    const { data, error } = await supabase
      .from('saved_tweets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved tweets:', error);
    } else {
      setSavedTweets(data || []);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshTweets: fetchSavedTweets
  }));

  useEffect(() => {
    fetchSavedTweets();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('saved_tweets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tweet:', error);
    } else {
      setSavedTweets(tweets => tweets.filter(tweet => tweet.id !== id));
    }
  };

  return (
    <div 
      className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}
    >
      <button
        onClick={() => handleCollapse(!isCollapsed)}
        className="absolute -left-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
      >
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
          />
        </svg>
      </button>

      <div className={`p-4 ${isCollapsed ? 'hidden' : ''}`}>
        <h2 className="text-xl font-semibold mb-4">Saved Tweets</h2>
        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          {savedTweets.map(tweet => (
            <div key={tweet.id} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-800 text-sm mb-2">{tweet.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(tweet.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(tweet.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}); 