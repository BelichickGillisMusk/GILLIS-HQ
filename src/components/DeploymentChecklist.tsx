import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, Task } from '@/lib/types'
import { Team, generateDeploymentChecklist } from '@/lib/teamFormation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  CheckCircle,
  GitBranch,
  Rocket,
  ListChecks,
  Clock,
  WarningCircle
} from '@phosphor-icons/react'

interface DeploymentChecklistProps {
  projects: Project[]
  teams: Team[]
}

export function DeploymentChecklist({ projects, teams }: DeploymentChecklistProps) {
  const [checklist, setChecklist] = useKV<ReturnType<typeof generateDeploymentChecklist>>('deployment-checklist', [])
  const [isInitialized, setIsInitialized] = useState(false)

  if (!isInitialized && (!checklist || checklist.length === 0)) {
    setChecklist(generateDeploymentChecklist(projects, teams))
    setIsInitialized(true)
  }

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    setChecklist((current) => {
      const updated = [...(current || [])]
      const item = updated[categoryIndex].items[itemIndex]
      
      if (item.status === 'pending') {
        item.status = 'in-progress'
        toast.info('Task Started', {
          description: item.task
        })
      } else if (item.status === 'in-progress') {
        item.status = 'done'
        toast.success('Task Completed', {
          description: item.task
        })
      } else {
        item.status = 'pending'
      }
      
      return updated
    })
  }

  const resetChecklist = () => {
    setChecklist(generateDeploymentChecklist(projects, teams))
    toast.success('Checklist Reset', {
      description: 'All items reset to pending status'
    })
  }

  const totalItems = checklist?.reduce((sum, cat) => sum + cat.items.length, 0) || 0
  const completedItems = checklist?.reduce((sum, cat) => 
    sum + cat.items.filter(i => i.status === 'done').length, 0
  ) || 0
  const inProgressItems = checklist?.reduce((sum, cat) => 
    sum + cat.items.filter(i => i.status === 'in-progress').length, 0
  ) || 0
  const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const highPriorityPending = checklist?.reduce((sum, cat) => 
    sum + cat.items.filter(i => i.priority === 'high' && i.status !== 'done').length, 0
  ) || 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive'
      case 'medium': return 'text-warning'
      case 'low': return 'text-muted-foreground'
      default: return 'text-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle size={20} weight="fill" className="text-success" />
      case 'in-progress': return <Clock size={20} weight="fill" className="text-accent" />
      case 'pending': return <ListChecks size={20} className="text-muted-foreground" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rocket size={32} weight="duotone" className="text-accent" />
            Deployment Checklist
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pre-deployment validation and code management tasks
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={resetChecklist}
          className="gap-2"
        >
          <GitBranch size={16} />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-3xl font-bold font-mono">{Math.round(completionRate)}%</p>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedItems} of {totalItems} tasks completed
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold font-mono text-accent">{inProgressItems}</p>
            <div className="flex items-center gap-2">
              <Clock size={16} weight="fill" className="text-accent" />
              <span className="text-xs text-muted-foreground">Currently active tasks</span>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${highPriorityPending > 0 ? 'bg-destructive/10 border-destructive' : 'bg-success/10 border-success'}`}>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">High Priority Pending</p>
            <p className="text-3xl font-bold font-mono text-destructive">{highPriorityPending}</p>
            <div className="flex items-center gap-2">
              {highPriorityPending > 0 ? (
                <>
                  <WarningCircle size={16} weight="fill" className="text-destructive" />
                  <span className="text-xs text-destructive-foreground">Requires attention</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} weight="fill" className="text-success" />
                  <span className="text-xs text-success-foreground">All critical items done</span>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      {completionRate === 100 && (
        <Card className="p-6 bg-success/10 border-success">
          <div className="flex items-start gap-3">
            <CheckCircle size={40} className="text-success flex-shrink-0" weight="fill" />
            <div>
              <h3 className="font-semibold text-lg text-success-foreground">Ready to Deploy!</h3>
              <p className="text-sm text-success-foreground/80 mt-1">
                All checklist items completed. Your code is ready for production deployment.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {checklist?.map((category, categoryIndex) => {
          const categoryCompleted = category.items.filter(i => i.status === 'done').length
          const categoryTotal = category.items.length
          const categoryProgress = (categoryCompleted / categoryTotal) * 100

          return (
            <Card key={category.category} className="p-6 bg-card border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{category.category}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {categoryCompleted} of {categoryTotal} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold font-mono">{Math.round(categoryProgress)}%</p>
                  </div>
                </div>

                <Progress value={categoryProgress} className="h-2" />

                <Separator />

                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                        item.status === 'done' 
                          ? 'bg-success/5 border-success/20' 
                          : item.status === 'in-progress'
                          ? 'bg-accent/5 border-accent/20'
                          : 'bg-background border-border'
                      }`}
                    >
                      <Checkbox 
                        checked={item.status === 'done'}
                        onCheckedChange={() => toggleItem(categoryIndex, itemIndex)}
                        className="mt-0.5"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-medium ${item.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                            {item.task}
                          </p>
                          <Badge 
                            variant={
                              item.priority === 'high' ? 'destructive' : 
                              item.priority === 'medium' ? 'default' : 
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleItem(categoryIndex, itemIndex)}
                        className="flex-shrink-0"
                      >
                        {getStatusIcon(item.status)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6 bg-muted border-border">
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <GitBranch size={20} weight="bold" />
            Git & Code Management Checklist
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Create release branch from main: <code className="bg-background px-2 py-0.5 rounded text-xs font-mono">git checkout -b release/v1.0.0</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Tag the release: <code className="bg-background px-2 py-0.5 rounded text-xs font-mono">git tag -a v1.0.0 -m "Release v1.0.0"</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Push tags to remote: <code className="bg-background px-2 py-0.5 rounded text-xs font-mono">git push origin --tags</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Verify CI/CD pipeline passes all checks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Update version in package.json and commit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Create GitHub release with changelog and deployment notes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Merge release branch to main after successful deployment</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
