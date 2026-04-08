import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { ChatMessage, Agent, Project, Task } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/
  PaperPlaneRight, 
  Brain, 
  Link as LinkIcon,
  Sparkle
import { 

  agents: Agent[]
  tasks: Task[]
  selecte

  const [globalChat, setGlobal
  const [selectedAgent, setSelec

  useEffect(() => {
      scrollRef.c
  }, [globalChat])
  const getAgen
  const getTaskById = (id:
  const generateAgentRe
 

      : selectedTask 
      : null
    const contextInfo = context 
      : 'General discussion'
    const skills = agent.skills?.join(', ') || '
    try {

      return respon
      console.error('Failed 
    }

    if (!inputMess

      sender: 'You',
      message: inputMessage,
      relatedProjectId: selectedProject,

    setGlobalChat((current) => [...(current || []), newMessage])

      setIsGeneratingR

        const agentMessage: ChatMess
          sender: selectedAgent,
          message: re
          relatedProjectId: selec
        }

      } catch (error) {
      } finally {
      }

  const requestBoardAdvice = async () => {
      toast.error('Select a project to request board 

    const project = get

    

    try {

      
        id: `msg-${Date.now()}-${Math.random()}`,
        senderType: '
        timestamp: Da
      }
      setGlobalChat((current) => [...(current || []), boardMessage])
    }
   


    if (!selectedProject) {


    if (!project) return
    setIsGeneratingR
    try {
      
      
        id: `msg-${Date.now()}-${Math.ra
        senderType: 'coo',
     

      setGlobalChat((current) => [...(current || []), co
    } catch (error) {

    }

    if (mes
      return {
        
      }
      return {
        role: 'Board of Director
      }
      return {
        role: 'Operations',
      }
      return {
        r

  }
  const getMessageColor = (type: ChatMessage['senderType']) => {
      case 'agent': ret
      case 'coo': return 'border-l-warning'
    }

    if 
    r


        <div className="flex items-center 
            <ChatCircleText
              <h2 className="text-2xl font-bold">Agent Collab
            
     

              onClick={requestBoardAdvice}
              variant="o

              Board Advice
    
              disabled={!selectedProject || isGeneratingResponse}
              size="sm"

            </Button>

        <div className="
            <div>
                Active Agents
              <div classN
                  variant=
                  size="sm"

                  All Agents

         
                    className="w-full justify-start"
      
                    <Robot size={16} clas
                  </Button>
              </div>
          </div>
          <div className
              <div className="
                  <div className="flex fl
       

                  </div>
                  filteredMessages.map((message) => {
                    r
                        key={message.id}
               
                        )}
     
   

                          )}>
                          <
                        <div className="flex-1 min-w-0">
            
     

                            </span>
                        

                              <sp

                          )}

                  })
                {isGeneratingRespon
                    <Avata
                        AI
                    </Avatar>

                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />

         
                )}
      
            <div className="flex gap-2"
                placeholder={selectedAgent && sel
                  : "T
                onChange={
                  if (e.
                    sendMessag
                }}
       

                disabled={!inputMessage.trim() || isGenera
                <PaperPlaneRight size={20} weight="fil
            </div>
        </div>
    </div>
}



























































































































































































































