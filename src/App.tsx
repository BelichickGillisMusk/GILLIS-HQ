import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const CORAL = '#FF6B6B'
const BG = 'linear-gradient(135deg, #fef5f0 0%, #fff9f5 100%)'

const SYSTEM = `You are Samantha, a highly capable AI assistant. You are helpful, warm, and direct.`

const QUICK_ACTIONS = [
  { emoji: '📊', label: 'Show me the dashboard' },
  { emoji: '✅', label: 'What needs to be done?' },
  { emoji: '👥', label: 'Team status' },
]

function App() {
  const [messages, setMessages] = useKV<Message[]>('samantha-messages', [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('samantha_voice') === 'true'
  )
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (window.speechSynthesis) {
      speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices()
    }
  }, [])

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text.replace(/\*\*/g, '').replace(/\*/g, ''))
    const voices = speechSynthesis.getVoices()
    const v =
      voices.find(v => v.name.includes('Samantha') || v.name.includes('Karen')) ||
      voices.find(v => v.lang.startsWith('en-'))
    if (v) u.voice = v
    u.rate = 1.05
    speechSynthesis.speak(u)
  }

  const toggleVoice = () => {
    setVoiceEnabled(prev => {
      const next = !prev
      localStorage.setItem('samantha_voice', String(next))
      if (!next) window.speechSynthesis?.cancel()
      return next
    })
  }

  const sendMessage = async (text: string) => {
    text = text.trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...(prev || []), userMsg])
    setInput('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    setIsLoading(true)
    try {
      const currentMessages = await new Promise<Message[]>((resolve) => {
        setMessages((prev) => {
          resolve(prev || [])
          return prev
        })
      })

      const history = currentMessages
        .slice(-20)
        .map(m => `${m.role === 'user' ? 'User' : 'Samantha'}: ${m.content}`)
        .join('\n\n')

      const prompt = spark.llmPrompt`${SYSTEM}

Conversation so far:
${history}

Respond as Samantha (do not include the "Samantha:" prefix in your reply):`

      const response = await spark.llm(prompt)

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }
      setMessages(prev => [...(prev || []), assistantMsg])
      speak(response)
    } catch (err) {
      console.error('Samantha chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const clearChat = () => {
    setMessages([])
    window.speechSynthesis?.cancel()
  }

  const msgs = messages || []

  return (
    <div
      style={{
        background: BG,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        color: '#2D2D2D',
      }}
    >
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #f0e6d5',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: CORAL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>Samantha</div>
            <div style={{ fontSize: 11, color: '#8B8B8B' }}>Your AI assistant</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={toggleVoice}
            title={voiceEnabled ? 'Voice on — tap to mute' : 'Voice off — tap to enable'}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: voiceEnabled ? `${CORAL}22` : '#f3f4f6',
              color: voiceEnabled ? CORAL : '#8B8B8B',
              cursor: 'pointer',
              fontSize: 16,
              transition: 'all 0.15s',
            }}
          >
            🔊
          </button>
          {msgs.length > 0 && (
            <button
              onClick={clearChat}
              title="Clear conversation"
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: 'none',
                background: '#f3f4f6',
                color: '#8B8B8B',
                cursor: 'pointer',
                fontSize: 14,
                transition: 'all 0.15s',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 680,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {msgs.length === 0 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 64,
              gap: 24,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 8, color: CORAL }}>✦</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>
                Hey there.
              </div>
              <div style={{ fontSize: 15, color: '#8B8B8B', marginTop: 4 }}>
                What can I help you with?
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {QUICK_ACTIONS.map(qa => (
                <button
                  key={qa.label}
                  onClick={() => sendMessage(qa.label)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: '1px solid #f0e6d5',
                    background: '#fff',
                    color: '#2D2D2D',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {qa.emoji} {qa.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius:
                  msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                background: msg.role === 'user' ? CORAL : '#fff',
                color: msg.role === 'user' ? '#fff' : '#2D2D2D',
                fontSize: 14,
                lineHeight: 1.55,
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '18px 18px 18px 4px',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                display: 'flex',
                gap: 5,
                alignItems: 'center',
              }}
            >
              {[0, 150, 300].map(delay => (
                <span
                  key={delay}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: CORAL,
                    display: 'inline-block',
                    animation: `samDot 1.2s ease-in-out ${delay}ms infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          background: '#fff',
          borderTop: '1px solid #f0e6d5',
          padding: '10px 16px 12px',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message Samantha…"
            disabled={isLoading}
            rows={1}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 20,
              border: '1.5px solid #f0e6d5',
              background: '#f9f5f0',
              color: '#2D2D2D',
              fontSize: 14,
              outline: 'none',
              resize: 'none',
              lineHeight: 1.5,
              maxHeight: 120,
              overflow: 'auto',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.target.style.borderColor = CORAL)}
            onBlur={e => (e.target.style.borderColor = '#f0e6d5')}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: input.trim() && !isLoading ? CORAL : '#e5e7eb',
              color: '#fff',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
              transition: 'background 0.15s',
              fontFamily: 'inherit',
            }}
          >
            ↑
          </button>
        </div>
      </div>

      <style>{`
        @keyframes samDot {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <Toaster />
    </div>
  )
}

export default App
