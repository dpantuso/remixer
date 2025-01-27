import { useState, FormEvent, ChangeEvent } from 'react'

interface RemixOption {
  value: string
  label: string
}

interface ContentFormProps {
  onSubmit: (input: string, remixType: string) => Promise<void>
  isLoading: boolean
}

const REMIX_OPTIONS: RemixOption[] = [
  { value: 'professional', label: 'Professional Remix' },
  { value: 'casual', label: 'Casual Remix' },
  { value: 'funny', label: 'Funny Remix' },
  { value: 'poetic', label: 'Poetic Remix' },
  { value: 'tweet', label: 'Tweet Remix' }
]

function ContentForm({ onSubmit, isLoading }: ContentFormProps): JSX.Element {
  const [input, setInput] = useState<string>('')
  const [remixType, setRemixType] = useState<string>('professional')

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    onSubmit(input, remixType)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">
          Paste Your Content to Remix
        </label>
        <textarea
          id="content"
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          rows={8}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Paste any text you want to remix..."
          required
        />
      </div>

      <div>
        <label htmlFor="remix-type" className="block text-lg font-medium text-gray-700 mb-2">
          Choose Remix Style
        </label>
        <select
          id="remix-type"
          value={remixType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setRemixType(e.target.value)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {REMIX_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-lg font-medium"
      >
        {isLoading ? 'Remixing...' : 'Remix Content'}
      </button>
    </form>
  )
}

export default ContentForm 