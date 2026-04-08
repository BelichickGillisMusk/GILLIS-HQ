import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { ChatMessage, Agent, Project, Task } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  PaperPlaneRight, 
  Robot, 
  Brain, 
  Briefcase,
  Link as LinkIcon,
  ChatCircleText,
  Sparkle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AgentChatProps {
  agents: Agent[]
  projects: Project[]
  tasks: Task[]
  selectedProject?: string
  selectedTask?: string
}

export function AgentChat({ agents, projects, tasks, selectedProject, selectedTask }: AgentChatProps) {
  const [globalChat, setGlobalChat] = useKV<ChatMessage[]>('global-chat', [])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [globalChat])

  const getAgentById = (id: string) => agents.find(a => a.id === id)
  const getProjectById = (id: string) => projects.find(p => p.id === id)
  const getTaskById = (id: string) => tasks.find(t => t.id === id)

  const generateAgentResponse = async (userMessage: string, agentId: string): Promise<string> => {
    const agent = getAgentById(agentId)
    if (!agent) return "Agent not found."

    const context = selectedProject 
      ? getProjectById(selectedProject)
      : selectedTask 
      ? getTaskById(selectedTask)
      : null

    const contextInfo = context 
      ? `Related to: ${selectedProject ? 'Project' : 'Task'} - ${(context as any).name || (context as any).title}`
      : 'General discussion'

    const skills = agent.skills?.join(', ') || 'general tasks'

    try {
      const promptText = `You are ${agent.name}, a ${agent.type} AI agent working in the ${agent.department} department. Your specializations are: ${skills}. Context: ${contextInfo}. A user or colleague just said: "${userMessage}". Respond naturally as this agent, sharing insights, ideas, or asking relevant questions about the work. Keep it conversational and professional. Be helpful and collaborative. Limit response to 2-3 sentences.`
      
      const response = await window.spark.llm(promptText, 'gpt-4o-mini')
      return response
    } catch (error) {
      console.error('Failed to generate agent response:', error)
      return "I'm processing that information. Let me get back to you shortly."
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender: 'You',
      senderType: 'system',
      message: inputMessage,
      timestamp: Date.now(),
      relatedProjectId: selectedProject,
      relatedTaskId: selectedTask
    }

    setGlobalChat((current) => [...(current || []), newMessage])
    setInputMessage('')

    if (selectedAgent && selectedAgent !== 'all') {
      setIsGeneratingResponse(true)
      try {
        const response = await generateAgentResponse(inputMessage, selectedAgent)
        
        const agentMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          sender: selectedAgent,
          senderType: 'agent',
          message: response,
          timestamp: Date.now(),
          relatedProjectId: selectedProject,
          relatedTaskId: selectedTask
        }

        setGlobalChat((current) => [...(current || []), agentMessage])
        toast.success(`${getAgentById(selectedAgent)?.name} responded`)
      } catch (error) {
        toast.error('Failed to get agent response')
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
    
    const boardMembers = ['Claude', 'Gemini', 'Grok', 'ChatGPT', 'Llama']
    const randomBoard = boardMembers[Math.floor(Math.random() * boardMembers.length)]

    try {
      const promptText = `You are ${randomBoard}, a board member providing strategic advice. Project: ${project.name}. Description: ${project.description}. Department: ${project.department}. Status: ${project.status}. Budget: $${project.budget}. Current Cost: $${project.actualCost}. Provide strategic advice on how to improve this project, reduce costs, or increase efficiency. Keep it concise (2-3 sentences).`
      
      const advice = await window.spark.llm(promptText, 'gpt-4o-mini')
      
      const boardMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        sender: randomBoard,
        senderType: 'board',
        message: advice,
        timestamp: Date.now(),
        relatedProjectId: selectedProject
      }

      setGlobalChat((current) => [...(current || []), boardMessage])
      toast.success(`${randomBoard} provided strategic advice`)
    } catch (error) {
      toast.error('Failed to get board advice')
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
      const promptText = `You are the COO focused on operational efficiency and cost optimization. Project: ${project.name}. Description: ${project.description}. Budget: $${project.budget}. Current Cost: $${project.actualCost}. Team Size: ${project.assignedAgents.length} agents. Provide specific, actionable advice on how to do this project better and cheaper. Focus on cost savings and efficiency. Keep it concise (2-3 sentences).`
      
      const advice = await window.spark.llm(promptText, 'gpt-4o-mini')
      
      const cooMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        sender: 'COO',
        senderType: 'coo',
        message: advice,
        timestamp: Date.now(),
        relatedProjectId: selectedProject
      }

      setGlobalChat((current) => [...(current || []), cooMessage])
      toast.success('COO provided operational advice')
    } catch (error) {
      toast.error('Failed to get COO advice')
    } finally {
      setIsGeneratingResponse(false)
    }
  }

  const getMessageSenderInfo = (message: ChatMessage) => {
    if (message.senderType === 'agent') {
      const agent = getAgentById(message.sender)
      return {
        name: agent?.name || 'Unknown Agent',
        role: agent?.department || 'Unknown',
        initials: agent?.name.split(' ').map(n => n[0]).join('') || 'A'
      }
    } else if (message.senderType === 'board') {
      return {
        name: message.sender,
        role: 'Board of Directors',
        initials: message.sender.substring(0, 2)
      }
    } else if (message.senderType === 'coo') {
      return {
        name: 'Chief Operating Officer',
        role: 'Operations',
        initials: 'CO'
      }
    } else {
      return {
        name: 'You',
        role: 'Manager',
        initials: 'YO'
      }
    }
  }

  const getMessageColor = (type: ChatMessage['senderType']) => {
    switch (type) {
      case 'agent': return 'border-l-accent'
      case 'board': return 'border-l-primary'
      case 'coo': return 'border-l-warning'
      default: return 'border-l-muted'
    }
  }

  const filteredMessages = globalChat?.filter(msg => {
    if (selectedProject && msg.relatedProjectId !== selectedProject) return false
    if (selectedTask && msg.relatedTaskId !== selectedTask) return false
    return true
  }) || []

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChatCircleText size={28} weight="duotone" className="text-accent" />
            <div>
              <h2 className="text-2xl font-bold">Agent Collaboration Hub</h2>
              <p className="text-sm text-muted-foreground">
                Discuss projects, share ideas, and get strategic advice
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={requestBoardAdvice}
              disabled={!selectedProject || isGeneratingResponse}
              variant="outline"
              size="sm"
            >
              <Brain size={16} className="mr-2" />
              Board Advice
            </Button>
            <Button
              onClick={requestCOOAdvice}
              disabled={!selectedProject || isGeneratingResponse}
              variant="outline"
              size="sm"
            >
              <Briefcase size={16} className="mr-2" />
              COO Advice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                Active Agents
              </p>
              <div className="space-y-2">
                <Button
                  variant={selectedAgent === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => setSelectedAgent('all')}
                >
                  <ChatCircleText size={16} className="mr-2" />
                  All Agents
                </Button>
                {agents?.slice(0, 8).map(agent => (
                  <Button
                    key={agent.id}
                    variant={selectedAgent === agent.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <Robot size={16} className="mr-2" />
                    <span className="truncate">{agent.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-9 space-y-4">
            <ScrollArea className="h-[500px] rounded-lg border border-border bg-muted/30 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Sparkle size={48} className="text-muted-foreground mb-4" weight="duotone" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start a conversation with your agents
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((message) => {
                    const senderInfo = getMessageSenderInfo(message)
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 p-4 rounded-lg bg-card border-l-4 transition-all hover:shadow-sm",
                          getMessageColor(message.senderType)
                        )}
                      >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className={cn(
                            message.senderType === 'board' && 'bg-primary text-primary-foreground',
                            message.senderType === 'coo' && 'bg-warning text-warning-foreground',
                            message.senderType === 'agent' && 'bg-accent text-accent-foreground',
                            message.senderType === 'system' && 'bg-muted text-muted-foreground'
                          )}>
                            {senderInfo.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{senderInfo.name}</p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {senderInfo.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{message.message}</p>
                          {message.relatedProjectId && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <LinkIcon size={12} />
                              <span>
                                {getProjectById(message.relatedProjectId)?.name || 'Unknown Project'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
                {isGeneratingResponse && (
                  <div className="flex gap-3 p-4 rounded-lg bg-card border-l-4 border-l-accent animate-pulse">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">Thinking...</p>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder={selectedAgent && selectedAgent !== 'all' 
                  ? `Message ${getAgentById(selectedAgent)?.name}...` 
                  : "Type a message to all agents..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                disabled={isGeneratingResponse}
                className="flex-1"
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
