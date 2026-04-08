import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Agent, Project, Task } from '@/lib/types'
import { generateAgents } from '@/lib/officeData'
import { generateInitialProjects } from '@/lib/projectData'
import { analyzeTokenCosts } from '@/lib/tokenCosts'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { AgentChat } from '@/components/AgentChat'
import { 
  Users, 
  ChartBar, 
  CurrencyDollar, 
  CheckCircle, 
  WarningCircle,
  Brain,
  TrendUp,
  ListChecks,
  ChatCircleText
} from '@phosphor-icons/react'

function App() {
  const [agents, setAgents] = useKV<Agent[]>('office-agents', [])
  const [projects, setProjects] = useKV<Project[]>('office-projects', [])
  const [tasks] = useKV<Task[]>('office-tasks', [])
  const [duplicatesPrevented] = useKV<number>('duplicates-prevented', 0)
  const [totalTokensSaved] = useKV<number>('total-tokens-saved', 0)
  const [selectedProject, setSelectedProject] = useState<string | undefined>()

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

  const analytics = analyzeTokenCosts(agents || [], tasks || [])
  
  const totalAgents = agents?.length || 0
  const availableAgents = agents?.filter(a => a.currentLoad < a.capacity).length || 0
  const overloadedAgents = agents?.filter(a => a.currentLoad >= a.capacity).length || 0
  const activeProjects = projects?.filter(p => p.status === 'in-progress').length || 0
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              AI Office Command Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Intelligent delegation, cost optimization, and project management
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-3xl font-bold mt-1">{totalAgents}</p>
                <p className="text-xs text-success mt-1">
                  {availableAgents} available
                </p>
              </div>
              <Users size={40} className="text-accent" weight="duotone" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold mt-1">{activeProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedProjects} completed
                </p>
              </div>
              <ListChecks size={40} className="text-accent" weight="duotone" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Token Costs</p>
                <p className="text-3xl font-bold mt-1 font-mono">{analytics.totalCost.toLocaleString()}</p>
                <p className="text-xs text-info mt-1">
                  Avg: {analytics.avgCostPerTask}/task
                </p>
              </div>
              <CurrencyDollar size={40} className="text-accent" weight="duotone" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Optimization</p>
                <p className="text-3xl font-bold mt-1 font-mono">{(duplicatesPrevented || 0) + Math.round(analytics.optimizationPotential / 1000)}k</p>
                <p className="text-xs text-success mt-1">
                  Tokens saved
                </p>
              </div>
              <TrendUp size={40} className="text-accent" weight="duotone" />
            </div>
          </Card>
        </div>

        {overloadedAgents > 0 && (
          <Card className="p-4 bg-warning/10 border-warning">
            <div className="flex items-start gap-3">
              <WarningCircle size={24} className="text-warning flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <p className="font-semibold text-warning-foreground">Workload Alert</p>
                <p className="text-sm text-warning-foreground/80 mt-1">
                  {overloadedAgents} agent{overloadedAgents > 1 ? 's are' : ' is'} at or over capacity. Consider redistributing tasks to maintain efficiency.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="chat">Agent Chat</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents?.slice(0, 12).map(agent => {
                const utilization = (agent.currentLoad / agent.capacity) * 100
                let statusColor = 'bg-success'
                if (utilization >= 100) statusColor = 'bg-destructive'
                else if (utilization >= 90) statusColor = 'bg-warning'

                return (
                  <Card key={agent.id} className="p-4 bg-card border-border hover:border-accent transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.type}</p>
                        </div>
                        <Badge variant={agent.status === 'working' ? 'default' : 'secondary'} className="text-xs">
                          {agent.status}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Capacity</span>
                          <span className="font-mono">{agent.currentLoad}/{agent.capacity}</span>
                        </div>
                        <Progress value={utilization} className={`h-2 ${statusColor}`} />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Cost/task</span>
                        <span className="font-mono text-accent">{agent.tokenCostPerTask}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Efficiency</span>
                        <span className="font-mono">{agent.efficiency}%</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects?.map(project => {
                const budgetUtilization = (project.actualCost / project.budget) * 100
                let budgetStatus = 'text-success'
                if (budgetUtilization >= 100) budgetStatus = 'text-destructive'
                else if (budgetUtilization >= 80) budgetStatus = 'text-warning'

                return (
                  <Card 
                    key={project.id} 
                    className={`p-6 bg-card border-border hover:border-accent transition-colors cursor-pointer ${selectedProject === project.id ? 'ring-2 ring-accent' : ''}`}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{project.department}</p>
                        </div>
                        <Badge className="capitalize">{project.status}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-mono">{project.metrics.completionRate}%</span>
                        </div>
                        <Progress value={project.metrics.completionRate} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Budget</p>
                          <p className={`font-mono font-semibold ${budgetStatus}`}>
                            ${project.actualCost.toLocaleString()} / ${project.budget.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Team</p>
                          <p className="font-semibold">{project.assignedAgents.length} agents</p>
                        </div>
                      </div>

                      {project.boardAdvice && project.boardAdvice.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-info">
                          <Brain size={16} weight="duotone" />
                          <span>{project.boardAdvice.length} board recommendation{project.boardAdvice.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <AgentChat 
              agents={agents || []}
              projects={projects || []}
              tasks={tasks || []}
              selectedProject={selectedProject}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ChartBar size={24} weight="duotone" className="text-accent" />
                  Cost by Agent Type
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.costByAgentType).map(([type, cost]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{type}</span>
                        <span className="font-mono text-sm">{cost.toLocaleString()} tokens</span>
                      </div>
                      <Progress 
                        value={(cost / analytics.totalCost) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CurrencyDollar size={24} weight="duotone" className="text-accent" />
                  Cost by Department
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.costByDepartment).map(([dept, cost]) => (
                    <div key={dept}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm capitalize">{dept}</span>
                        <span className="font-mono text-sm">{cost.toLocaleString()} tokens</span>
                      </div>
                      <Progress 
                        value={(cost / analytics.totalCost) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-success/10 border-success">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CheckCircle size={24} weight="fill" className="text-success" />
                Optimization Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold font-mono text-success">{duplicatesPrevented}</p>
                  <p className="text-sm text-success-foreground/80 mt-1">Duplicates Prevented</p>
                </div>
                <div>
                  <p className="text-3xl font-bold font-mono text-success">{analytics.optimizationPotential.toLocaleString()}</p>
                  <p className="text-sm text-success-foreground/80 mt-1">Tokens Saved</p>
                </div>
                <div>
                  <p className="text-3xl font-bold font-mono text-success">{Math.round((analytics.optimizationPotential / analytics.totalCost) * 100 || 0)}%</p>
                  <p className="text-sm text-success-foreground/80 mt-1">Cost Reduction</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  )
}

export default App