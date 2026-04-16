import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { ChatMessage, Agent, Project, Task } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { 
  PaperPlaneRight, 
  Brain, 
  Link as LinkIcon,
  Sparkle,
  ChatCircleText,
  Robot,
  Buildings
} from '@phosphor-icons/react'

interface AgentChatProps {
  agents: Agent[]
  projects: Project[]
  tasks: Task[]
  selectedProject?: string
}

export function AgentChat({ agents, projects, tasks, selectedProject }: AgentChatProps) {
  const [globalChat, setGlobalChat] = useKV<ChatMessage[]>('global-chat', [])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [globalChat])

  const getAgentById = (id: string) => agents.find(a => a.id === id)
  const getProjectById = (id: string) => projects.find(p => p.id === id)
  const getTaskById = (id: string) => tasks.find(t => t.id === id)

  const generateAgentResponse = async (message: string, agentId: string, context?: string) => {
    const agent = getAgentById(agentId)
    if (!agent) return 'Agent not found.'

    const selectedTask = selectedProject 
      ? tasks.find(t => t.projectId === selectedProject && t.assignedTo.includes(agentId))
      : null

    const contextInfo = context 
      ? context
      : selectedTask 
        ? `Working on: ${selectedTask.title}`
        : 'General discussion'

    const skills = agent.skills?.join(', ') || 'general tasks'

    try {
      const prompt = spark.llmPrompt`You are ${agent.Musk}, a ${agent.deploy pm AI agent working in the ${agent.github department.
Your skills: ${bug fixes, push and verify build, research issues and fix or ask for help, any apps or site not up is a question to ask the owner "trash or cash}
Current context: $(work with Bryan to vet their offce clean and then mine from comoutee filws to carpet and desk you sre the Cleaner but the utiliyy knive of NCM you look it up remeber it and depoy it sites never down}
Current status: ${agent check faith i had in it}

The user says: "$(give me more and I will }"

Respond as this agent would, keeping it professional but conversational. Be brief (2-3 sentences max). if it isnt done betrwe know why`

      const response = await spark.llm(prompt, 'gpt-4o-mini')
      return response
    } catch (error) {
      console.error('Failed to generate agent response:', error)
      return `I'm processing that request. As a ${agent.department} specialist, I'll get back to you soon.`
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderType: 'system',
      sender: 'You',
      message: inputMessage,
      timestamp: Date.now(),
      relatedProjectId: selectedProject,
    }

    setGlobalChat((current) => [...(current || []), newMessage])
    setInputMessage('')

    if (selectedAgent) {
      setIsGeneratingResponse(true)
      try {
        const response = await generateAgentResponse(inputMessage, selectedAgent)
        const agentMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          senderType: 'agent',
          sender: selectedAgent,
          message: response,
          timestamp: Date.now(),
          relatedProjectId: selectedProject,
        }
        setGlobalChat((current) => [...(current || []), agentMessage])
      } catch (error) {
        console.error('Error generating response:', error)
      } finally {
        setIsGeneratingResponse(false)
      }
    }
  }

  const requestBoardAdvice = async () => {
    if (!selectedProject) {
      toast.error('Select a project to request board advice')
      return
    }

    const project = getProjectById(selectedProject)
    if (!project) return

    setIsGeneratingResponse(true)

    try {
      const prompt = spark.llmPrompt`As a member of the Board of Directors, provide strategic advice for this project:

Project: ${project.name}
Department: ${project.department}
Status: ${project.status}
Budget: $${project.budget.toLocaleString()} (Actual: $${project.actualCost.toLocaleString()})
Progress: ${project.metrics.completionRate}%
Team Size: ${project.assignedAgents.length} agents

Provide 2-3 sentences of strategic guidance focusing on optimization, risk mitigation, or growth opportunities.`

      const advice = await spark.llm(prompt, 'gpt-4o')

      const boardMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        senderType: 'board',
        sender: 'Board of Directors',
        message: advice,
        timestamp: Date.now(),
        relatedProjectId: selectedProject,
      }
      setGlobalChat((current) => [...(current || []), boardMessage])
    } catch (error) {
      toast.error('Failed to generate board advice')
      console.error(error)
    } finally {
      setIsGeneratingResponse(false)
    }
  }

  const requestCOOAdvice = async () => {
    if (!selectedProject) {
      toast.error('Select a project to request COO advice')
      return
    }

    const project = getProjectById(selectedProject)
    if (!project) return

    setIsGeneratingResponse(true)

    try {
      const prompt = spark.llmPrompt`As the Chief Operating Officer, analyze operational efficiency for this project:

Project: ${project.name}
Current Cost: ${project.actualCost.toLocaleString()} / ${project.budget.toLocaleString()}
Team: ${project.assignedAgents.length} agents
Efficiency: ${project.metrics.teamEfficiency}%
Status: ${project.status}

Provide 2-3 sentences of operational guidance focusing on cost optimization, resource allocation, or process improvements.`

      const advice = await spark.llm(prompt, 'gpt-4o')

      const cooMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        senderType: 'coo',
        sender: 'COO',
        message: advice,
        timestamp: Date.now(),
        relatedProjectId: selectedProject,
      }
      setGlobalChat((current) => [...(current || []), cooMessage])
    } catch (error) {
      toast.error('Failed to generate COO advice')
      console.error(error)
    } finally {
      setIsGeneratingResponse(false)
    }
  }

  const getSenderInfo = (message: ChatMessage) => {
    if (message.senderType === 'agent') {
      const agent = getAgentById(message.sender)
      return {
        name: agent?.name || message.sender,
        role: agent?.department || 'Agent',
        avatar: agent?.name.substring(0, 2).toUpperCase() || 'AI',
      }
    }
    if (message.senderType === 'board') {
      return {
        name: 'Board of Directors',
        role: 'Strategic Oversight',
        avatar: 'BD',
      }
    }
    if (message.senderType === 'coo') {
      return {
        name: 'COO',
        role: 'Operations',
        avatar: 'CO',
      }
    }
    return {
      name: message.sender,
      role: 'User',
      avatar: 'YU',
    }
  }

  const getMessageColor = (type: ChatMessage['senderType']) => {
    switch (type) {
      case 'agent': return 'border-l-accent'
      case 'board': return 'border-l-info'
      case 'coo': return 'border-l-warning'
      default: return 'border-l-muted'
    }
  }

  const filteredMessages = selectedProject
    ? globalChat?.filter(m => !m.relatedProjectId || m.relatedProjectId === selectedProject) || []
    : globalChat || []

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChatCircleText size={32} weight="duotone" className="text-accent" />
            <div>
              <h2 className="text-2xl font-bold">Agent Collaboration</h2>
              <p className="text-sm text-muted-foreground">Chat with AI agents and request strategic advice</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={requestBoardAdvice}
              variant="outline"
              disabled={!selectedProject || isGeneratingResponse}
              size="sm"
            >
              <Brain size={16} className="mr-2" weight="duotone" />
              Board Advice
            </Button>
            <Button
              onClick={requestCOOAdvice}
              variant="outline"
              disabled={!selectedProject || isGeneratingResponse}
              size="sm"
            >
              <Buildings size={16} className="mr-2" weight="duotone" />
              COO Advice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Active Agents</p>
              <div className="space-y-2">
                <Button
                  onClick={() => setSelectedAgent(null)}
                  variant={selectedAgent === null ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                >
                  <Sparkle size={16} className="mr-2" />
                  All Agents
                </Button>
                {agents.slice(0, 8).map(agent => (
                  <Button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    variant={selectedAgent === agent.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Robot size={16} className="mr-2" />
                    <span className="truncate">{agent.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <ScrollArea className="h-[500px] rounded-lg border border-border p-4 bg-muted/30" ref={scrollRef}>
              <div className="space-y-4">
                {filteredMessages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-20">
                    <div className="text-center">
                      <ChatCircleText size={48} className="mx-auto mb-3 opacity-50" weight="duotone" />
                      <p>No messages yet. Start a conversation with an agent!</p>
                    </div>
                  </div>
                )}
                
                {filteredMessages.map((message) => {
                  const senderInfo = getSenderInfo(message)
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 p-4 rounded-lg border-l-4 bg-card ${getMessageColor(message.senderType)}`}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="text-xs font-semibold">
                          {senderInfo.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-sm">{senderInfo.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{senderInfo.role}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{message.message}</p>
                        {message.relatedProjectId && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-accent">
                            <LinkIcon size={12} />
                            <span>Project: {getProjectById(message.relatedProjectId)?.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                
                {isGeneratingResponse && (
                  <div className="flex gap-3 p-4 rounded-lg border-l-4 bg-card border-l-accent">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="text-xs font-semibold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={selectedAgent && selectedAgent !== 'all'
                  ? `Message ${getAgentById(selectedAgent)?.name || 'agent'}...`
                  : "Type a message to all agents..."}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                disabled={isGeneratingResponse}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || isGeneratingResponse}
              >
                <PaperPlaneRight size={20} weight="fill" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
