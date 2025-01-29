import { useState } from 'react'
import ContentForm from './components/ContentForm'
import { tweetsFromPosts } from './services/claudeService'

function RemixPage(): JSX.Element {
  const [output, setOutput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleTransform = async (input: string): Promise<void> => {
    setIsLoading(true)
    setError('')
    try {
      const result = await tweetsFromPosts(input)
      setOutput(result)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to remix content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-60 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Content Remix Tool</h1>
        <p className="text-gray-600 text-center mb-8">Transform your content with AI-powered remixing</p>
        
        <div className="mb-8">
          <ContentForm onSubmit={handleTransform} isLoading={isLoading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-8">
            {error}
          </div>
        )}

        {output && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Remixed Content</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{output}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RemixPage 