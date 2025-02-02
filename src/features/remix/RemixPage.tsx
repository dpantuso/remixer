import { useState, useRef } from 'react'
import ContentForm from './components/ContentForm'
import { TweetThread } from './components/TweetThread'
import { SavedTweets, SavedTweetsRef } from './components/SavedTweets'
import { transformContent } from './services/claudeService'

function RemixPage(): JSX.Element {
  const [tweets, setTweets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const savedTweetsRef = useRef<SavedTweetsRef>(null);

  const handleTransform = async (input: string): Promise<void> => {
    setIsLoading(true)
    setError('')
    try {
      const result = await transformContent(input)
      setTweets(result)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to remix content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTweetSaved = async () => {
    await savedTweetsRef.current?.refreshTweets();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className={`max-w-4xl mx-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'pr-12' : 'pr-80'
      }`}>
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Tweet Thread Generator</h1>
        <p className="text-gray-600 text-center mb-8">Transform your content into engaging tweet threads</p>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <ContentForm onSubmit={handleTransform} isLoading={isLoading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-8">
            {error}
          </div>
        )}

        {tweets.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your Tweet Thread</h2>
            <TweetThread tweets={tweets} onTweetSaved={handleTweetSaved} />
          </div>
        )}
      </div>
      <SavedTweets 
        ref={savedTweetsRef} 
        onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
      />
    </div>
  )
}

export default RemixPage 