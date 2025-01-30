import React, { useEffect, useState } from 'react';
import { supabase, SavedTweet } from '../../../config/supabase';

export const SavedTweets: React.FC = () => {
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([]);

  useEffect(() => {
    fetchSavedTweets();
  }, []);

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
    <div className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Saved Tweets</h2>
      <div className="space-y-4">
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
  );
}; 