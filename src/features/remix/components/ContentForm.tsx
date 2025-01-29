import { useState, FormEvent, ChangeEvent } from 'react'

interface ContentFormProps {
  onSubmit: (input: string) => Promise<void>
  isLoading: boolean
}

function ContentForm({ onSubmit, isLoading }: ContentFormProps): JSX.Element {
  const [input, setInput] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    onSubmit(input)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">
          Paste Your Blog Post
        </label>
        <textarea
          id="content"
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          rows={8}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Paste your blog post here to convert it into tweets..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-lg font-medium"
      >
        {isLoading ? 'Creating Tweets...' : 'Create Tweet Thread'}
      </button>
    </form>
  )
}

export default ContentForm 