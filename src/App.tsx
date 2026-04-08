import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Agent, Project } from '@/lib/types'
import { generateAgents, getDepartments } from '@/lib/officeData'
import { generateInitialProjects } from '@/lib/projectData'
import { OfficeScene } from '@/components/OfficeScene'
import { AgentDetailPanel } from '@/components/AgentDetailPanel'
import { DepartmentLegend } from '@/components/DepartmentLegend'
import { OfficeStats } from '@/components/OfficeStats'
import { LotionPanel } from '@/components/LotionPanel'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { ListChecks } from '@phosphor-icons/react'

function App() {
  const [agents, setAgents] = useKV<Agent[]>('office-agents', [])
  const [projects, setProjects] = useKV<Project[]>('office-projects', [])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showLotion, setShowLotion] = useState(false)

  useEffect(() => {
    if (!agents || agents.length === 0) {
      setAgents(generateAgents())
    }
  }, [agents, setAgents])

  useEffect(() => {
    if (!projects || projects.length === 0) {
      setProjects(generateInitialProjects(['marketing', 'sales', 'admin', 'tech', 'operations']))
    }
  }, [projects, setProjects])

  const departments = useMemo(() => {
    return getDepartments(agents || [])
  }, [agents])

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(currentAgents => {
        if (!currentAgents || currentAgents.length === 0) return currentAgents || []
        
        return currentAgents.map(agent => {
          const shouldUpdate = Math.random() > 0.7
          
          if (!shouldUpdate) return agent
          
          const statuses: Array<'working' | 'idle' | 'meeting'> = ['working', 'idle', 'meeting']
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
          
          const deptTasks = {
            marketing: [
              'Analyzing campaign performance metrics',
              'Creating social media content strategy',
              'Drafting email marketing campaigns',
              'Researching competitor strategies',
              'Optimizing SEO keywords',
              'Designing brand guidelines',
              'Planning product launch campaign',
              'Analyzing customer sentiment data'
            ],
            sales: [
              'Following up with leads',
              'Preparing sales presentations',
              'Updating CRM records',
              'Conducting product demos',
              'Negotiating contract terms',
              'Analyzing sales pipeline',
              'Drafting proposals',
              'Meeting with potential clients'
            ],
            admin: [
              'Processing invoices',
              'Scheduling team meetings',
              'Managing office supplies inventory',
              'Organizing company documents',
              'Coordinating travel arrangements',
              'Updating employee records',
              'Preparing quarterly reports',
              'Handling vendor communications'
            ],
            tech: [
              'Debugging production issues',
              'Reviewing pull requests',
              'Architecting new features',
              'Optimizing database queries',
              'Writing unit tests',
              'Deploying to staging environment',
              'Refactoring legacy code',
              'Conducting security audit'
            ],
            operations: [
              'Optimizing supply chain logistics',
              'Analyzing operational efficiency',
              'Coordinating with vendors',
              'Managing inventory levels',
              'Streamlining workflows',
              'Monitoring quality metrics',
              'Planning resource allocation',
              'Updating process documentation'
            ]
          }
          
          const tasks = deptTasks[agent.department]
          const newTask = tasks[Math.floor(Math.random() * tasks.length)]
          
          return {
            ...agent,
            status: newStatus,
            currentTask: newTask,
            productivity: Math.max(0, Math.min(100, agent.productivity + (Math.random() * 10 - 5))),
            tasksCompleted: newStatus === 'working' ? agent.tasksCompleted + 1 : agent.tasksCompleted
          }
        })
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [setAgents])

  return (
    <div className="w-full h-screen bg-background overflow-hidden relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <h1 className="text-3xl font-bold text-primary tracking-tight drop-shadow-lg">
          AI Agent Office
        </h1>
        <p className="text-center text-sm text-muted-foreground font-mono mt-1">
          Virtual Headquarters
        </p>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <Button 
          onClick={() => setShowLotion(!showLotion)}
          className="gap-2"
          variant={showLotion ? 'default' : 'secondary'}
        >
          <ListChecks size={20} weight="duotone" />
          Lotion Projects
        </Button>
      </div>

      <DepartmentLegend departments={departments} />

      <OfficeStats agents={agents || []} />

      <OfficeScene
        departments={departments}
        agents={agents || []}
        onAgentClick={setSelectedAgent}
        selectedAgent={selectedAgent}
      />

      <AgentDetailPanel
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />

      {showLotion && (
        <LotionPanel
          projects={projects || []}
          onClose={() => setShowLotion(false)}
          onUpdate={setProjects}
        />
      )}

      <Toaster />
    </div>
  )
}

export default App