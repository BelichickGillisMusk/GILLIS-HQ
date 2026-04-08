import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, BoardMember, COOAdvice, BoardAdvice } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ListChecks, TrendUp, CurrencyDollar, Clock, Users, 
  Lightbulb, CheckCircle, Link as LinkIcon, X, Sparkle,
  Brain
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateBoardAdvice, generateCOOAdvice } from '@/lib/projectData'
import { toast } from 'sonner'

interface LotionPanelProps {
  projects: Project[]
  onClose: () => void
  onUpdate: (projects: Project[]) => void
}

const BOARD_AVATARS: Record<BoardMember, string> = {
  Claude: '🎭',
  Gemini: '♊',
  Grok: '🚀',
  ChatGPT: '💬',
  Llama: '🦙'
}

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500'
}

const statusColors = {
  planning: 'bg-purple-500',
  'in-progress': 'bg-blue-500',
  blocked: 'bg-red-500',
  completed: 'bg-green-500',
  archived: 'bg-gray-500'
}

export function LotionPanel({ projects, onClose, onUpdate }: LotionPanelProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false)

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalActualCost = projects.reduce((sum, p) => sum + p.actualCost, 0)
  const avgCompletion = projects.reduce((sum, p) => sum + p.metrics.completionRate, 0) / (projects.length || 1)
  const totalSavings = projects.reduce((sum, p) => 
    sum + p.cooAdvice.filter(a => a.implemented).reduce((s, a) => s + a.costSavings, 0), 0
  )

  const requestBoardAdvice = async (project: Project) => {
    setIsGeneratingAdvice(true)
    
    try {
      const boardMembers: BoardMember[] = ['Claude', 'Gemini', 'Grok', 'ChatGPT', 'Llama']
      const randomMember = boardMembers[Math.floor(Math.random() * boardMembers.length)]
      
      const focus = Math.random() > 0.5 ? 'innovation and competitive advantage' : 'risk mitigation and operational excellence'
      
      const promptText = `You are ${randomMember}, a board member providing strategic advice.
      
Project: ${project.name}
Department: ${project.department}
Status: ${project.status}
Budget: $${project.budget}
Current Completion: ${project.metrics.completionRate}%

Provide one specific, actionable piece of strategic advice (2-3 sentences max) to improve this project's success. Focus on ${focus}.`

      const advice = await window.spark.llm(promptText, 'gpt-4o-mini')
      
      const newAdvice: BoardAdvice = {
        id: `advice-${Date.now()}`,
        boardMember: randomMember,
        projectId: project.id,
        advice: advice.trim(),
        category: ['strategy', 'technical', 'financial', 'risk', 'innovation'][Math.floor(Math.random() * 5)] as any,
        timestamp: Date.now(),
        implemented: false
      }
      
      const updatedProjects = projects.map(p => 
        p.id === project.id 
          ? { ...p, boardAdvice: [...p.boardAdvice, newAdvice] }
          : p
      )
      
      onUpdate(updatedProjects)
      setSelectedProject(updatedProjects.find(p => p.id === project.id) || null)
      toast.success(`${randomMember} provided strategic advice!`)
    } catch (error) {
      toast.error('Failed to get board advice')
    } finally {
      setIsGeneratingAdvice(false)
    }
  }

  const requestCOOAdvice = async (project: Project) => {
    setIsGeneratingAdvice(true)
    
    try {
      const promptText = `You are the COO providing operational efficiency advice.

Project: ${project.name}
Department: ${project.department}  
Budget: $${project.budget}
Actual Cost: $${project.actualCost}
Efficiency: ${project.metrics.teamEfficiency}%

Provide one specific, actionable recommendation (2-3 sentences max) to reduce costs and improve efficiency. Include specific tactics the team can implement immediately.`

      const advice = await window.spark.llm(promptText, 'gpt-4o-mini')
      
      const cooData = generateCOOAdvice(project.name, project.department)
      
      const newAdvice: COOAdvice = {
        id: `coo-${Date.now()}`,
        projectId: project.id,
        advice: advice.trim(),
        costSavings: cooData.costSavings,
        efficiencyGain: cooData.efficiencyGain,
        category: cooData.category,
        timestamp: Date.now(),
        implemented: false,
        priority: 'high'
      }
      
      const updatedProjects = projects.map(p => 
        p.id === project.id 
          ? { ...p, cooAdvice: [...p.cooAdvice, newAdvice] }
          : p
      )
      
      onUpdate(updatedProjects)
      setSelectedProject(updatedProjects.find(p => p.id === project.id) || null)
      toast.success(`COO advice: Potential savings of $${cooData.costSavings.toLocaleString()}!`)
    } catch (error) {
      toast.error('Failed to get COO advice')
    } finally {
      setIsGeneratingAdvice(false)
    }
  }

  const implementAdvice = (projectId: string, adviceId: string, type: 'board' | 'coo') => {
    const updatedProjects = projects.map(p => {
      if (p.id !== projectId) return p
      
      if (type === 'board') {
        return {
          ...p,
          boardAdvice: p.boardAdvice.map(a => 
            a.id === adviceId ? { ...a, implemented: true } : a
          )
        }
      } else {
        const advice = p.cooAdvice.find(a => a.id === adviceId)
        if (!advice || advice.implemented) return p
        
        return {
          ...p,
          cooAdvice: p.cooAdvice.map(a => 
            a.id === adviceId ? { ...a, implemented: true } : a
          ),
          actualCost: Math.max(0, p.actualCost - advice.costSavings),
          metrics: {
            ...p.metrics,
            teamEfficiency: Math.min(100, p.metrics.teamEfficiency + advice.efficiencyGain),
            budgetUtilization: Math.max(0, ((p.actualCost - advice.costSavings) / p.budget) * 100)
          }
        }
      }
    })
    
    onUpdate(updatedProjects)
    setSelectedProject(updatedProjects.find(p => p.id === projectId) || null)
    toast.success('Advice implemented successfully!')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 h-[80vh] bg-card border-t border-border z-50 shadow-2xl"
      >
        <Card className="h-full rounded-none border-0 bg-gradient-to-br from-card via-card to-secondary/20">
          <CardHeader className="border-b border-border bg-secondary/30 backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <ListChecks size={28} weight="duotone" className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Lotion</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">
                      Project & Task Management System
                    </CardDescription>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <CurrencyDollar size={18} className="text-green-500" weight="duotone" />
                    <div>
                      <div className="text-xs text-muted-foreground">Total Budget</div>
                      <div className="font-mono font-semibold">${(totalBudget / 1000).toFixed(0)}k</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendUp size={18} className="text-blue-500" weight="duotone" />
                    <div>
                      <div className="text-xs text-muted-foreground">Avg Completion</div>
                      <div className="font-mono font-semibold">{avgCompletion.toFixed(0)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkle size={18} className="text-yellow-500" weight="duotone" />
                    <div>
                      <div className="text-xs text-muted-foreground">COO Savings</div>
                      <div className="font-mono font-semibold text-green-500">${(totalSavings / 1000).toFixed(0)}k</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-orange-500" weight="duotone" />
                    <div>
                      <div className="text-xs text-muted-foreground">Active Projects</div>
                      <div className="font-mono font-semibold">{projects.filter(p => p.status === 'in-progress').length}</div>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10">
                <X size={20} />
              </Button>
            </div>
          </CardHeader>

          <div className="flex h-[calc(100%-140px)]">
            <div className="w-1/3 border-r border-border">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {projects.map(project => (
                    <Card
                      key={project.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedProject?.id === project.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm">{project.name}</CardTitle>
                            <CardDescription className="text-xs capitalize mt-1">
                              {project.department}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className={`${statusColors[project.status]} text-white border-0 text-xs`}>
                              {project.status}
                            </Badge>
                            <Badge className={`${priorityColors[project.priority]} text-white border-0 text-xs`}>
                              {project.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-mono">{project.metrics.completionRate}%</span>
                          </div>
                          <Progress value={project.metrics.completionRate} className="h-1.5" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex-1">
              {selectedProject ? (
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">{selectedProject.name}</h2>
                      <p className="text-sm text-muted-foreground mb-4">{selectedProject.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Budget</div>
                          <div className="font-mono font-semibold">${selectedProject.budget.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Actual Cost</div>
                          <div className="font-mono font-semibold">${selectedProject.actualCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Est. Cost</div>
                          <div className="font-mono font-semibold">${selectedProject.estimatedCost.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Team Efficiency</div>
                          <Progress value={selectedProject.metrics.teamEfficiency} className="h-2" />
                          <div className="text-xs font-mono mt-1">{selectedProject.metrics.teamEfficiency}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Budget Utilization</div>
                          <Progress value={selectedProject.metrics.budgetUtilization} className="h-2" />
                          <div className="text-xs font-mono mt-1">{selectedProject.metrics.budgetUtilization.toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <Tabs defaultValue="board" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="board">
                          <Brain size={16} className="mr-2" weight="duotone" />
                          Board of Directors
                        </TabsTrigger>
                        <TabsTrigger value="coo">
                          <Lightbulb size={16} className="mr-2" weight="duotone" />
                          COO Advice
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="board" className="mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Strategic Guidance</h3>
                            <Button 
                              size="sm" 
                              onClick={() => requestBoardAdvice(selectedProject)}
                              disabled={isGeneratingAdvice}
                            >
                              <Sparkle size={16} className="mr-2" weight="duotone" />
                              Request Advice
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            {selectedProject.boardAdvice.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground text-sm">
                                No board advice yet. Request strategic guidance above.
                              </div>
                            ) : (
                              selectedProject.boardAdvice.map(advice => (
                                <Card key={advice.id} className={advice.implemented ? 'bg-green-500/5 border-green-500/20' : ''}>
                                  <CardHeader className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl">{BOARD_AVATARS[advice.boardMember]}</span>
                                        <div>
                                          <div className="font-semibold text-sm">{advice.boardMember}</div>
                                          <div className="text-xs text-muted-foreground capitalize">{advice.category}</div>
                                        </div>
                                      </div>
                                      {!advice.implemented && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => implementAdvice(selectedProject.id, advice.id, 'board')}
                                        >
                                          <CheckCircle size={14} className="mr-1" />
                                          Implement
                                        </Button>
                                      )}
                                      {advice.implemented && (
                                        <Badge className="bg-green-500 text-white">Implemented</Badge>
                                      )}
                                    </div>
                                    <p className="text-sm mt-3">{advice.advice}</p>
                                    <div className="text-xs text-muted-foreground mt-2">
                                      {new Date(advice.timestamp).toLocaleString()}
                                    </div>
                                  </CardHeader>
                                </Card>
                              ))
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="coo" className="mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Operational Efficiency</h3>
                            <Button 
                              size="sm" 
                              onClick={() => requestCOOAdvice(selectedProject)}
                              disabled={isGeneratingAdvice}
                            >
                              <Lightbulb size={16} className="mr-2" weight="duotone" />
                              Request Advice
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            {selectedProject.cooAdvice.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground text-sm">
                                No COO advice yet. Request operational guidance above.
                              </div>
                            ) : (
                              selectedProject.cooAdvice.map(advice => (
                                <Card key={advice.id} className={advice.implemented ? 'bg-green-500/5 border-green-500/20' : ''}>
                                  <CardHeader className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="font-semibold text-sm capitalize">COO - {advice.category} Optimization</div>
                                        <div className="flex gap-3 mt-1">
                                          <span className="text-xs text-green-500 font-mono">
                                            💰 ${advice.costSavings.toLocaleString()} savings
                                          </span>
                                          <span className="text-xs text-blue-500 font-mono">
                                            ⚡ +{advice.efficiencyGain}% efficiency
                                          </span>
                                        </div>
                                      </div>
                                      {!advice.implemented && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => implementAdvice(selectedProject.id, advice.id, 'coo')}
                                        >
                                          <CheckCircle size={14} className="mr-1" />
                                          Implement
                                        </Button>
                                      )}
                                      {advice.implemented && (
                                        <Badge className="bg-green-500 text-white">Implemented</Badge>
                                      )}
                                    </div>
                                    <p className="text-sm mt-3">{advice.advice}</p>
                                    <div className="text-xs text-muted-foreground mt-2">
                                      {new Date(advice.timestamp).toLocaleString()}
                                    </div>
                                  </CardHeader>
                                </Card>
                              ))
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <ListChecks size={64} weight="duotone" className="mx-auto mb-4 opacity-50" />
                    <p>Select a project to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
