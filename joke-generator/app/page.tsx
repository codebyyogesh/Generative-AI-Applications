'use client'

import { useEffect, useState } from 'react'
import { useChat } from 'ai/react'

export default function Chat() {
  const { messages, append, isLoading } = useChat()
  const [lastEvaluatedMessage, setLastEvaluatedMessage] = useState(false)
  const [evaluation, setEvaluation] = useState({
    funny: 'None',
    appropriate: 'None',
    offensive: 'None',
  })
  const topics = [
    { emoji: '🧙', value: 'Work' },
    { emoji: '🕵️', value: 'People' },
    { emoji: '💑', value: 'Animals' },
    { emoji: '🚀', value: 'Food' },
  ]
  const tones = [
    { emoji: '😊', value: 'Witty' },
    { emoji: '😢', value: 'Dark' },
    { emoji: '😏', value: 'Silly' },
    { emoji: '😂', value: 'Sarcasm' },
  ]

  const types = [
    { emoji: '🤔', value: 'Pun' },
    { emoji: '🤗', value: 'knock-knock' },
    { emoji: '😂', value: 'Story' },
    { emoji: '🤔', value: 'One-Liner' },
  ]
  const [state, setState] = useState({
    topic: '',
    tone: '',
    type: '',
  })

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    })
  }
  // Evalute Joke
  const evaluateJoke = async (joke: string) => {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ joke }),
    })
    const data = await response.json()
    setEvaluation(data)
  }

  useEffect(() => {
    if (
      messages.length > 0 &&
      !messages[messages.length - 1].content.startsWith('Generate')
    ) {
      const lastMessage = messages[messages.length - 1].content
      if (lastMessage.length > 0) {
        evaluateJoke(lastMessage)
        setLastEvaluatedMessage(true)
      }
    }
  }, [lastEvaluatedMessage])

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">AI Joke Generator App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the Joke by selecting the topic, tone and type
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Topics</h3>

            <div className="flex flex-wrap justify-center">
              {topics.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="topic"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tones</h3>

            <div className="flex flex-wrap justify-center">
              {tones.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="tone"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Types</h3>

            <div className="flex flex-wrap justify-center">
              {types.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="type"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || !state.topic || !state.tone || !state.type}
            onClick={() =>
              append({
                role: 'user',
                content: `Generate a joke on ${state.topic} in a ${state.tone} tone with a ${state.type} type`,
              })
            }
          >
            Generate Joke
          </button>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith('Generate')
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Evaluation</h4>
              <p>Funny: {evaluation.funny}</p>
              <p>Appropriate: {evaluation.appropriate}</p>
              <p>Offensive: {evaluation.offensive}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
