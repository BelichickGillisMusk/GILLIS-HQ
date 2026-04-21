import { useState, useEffect } from 'react'
import { Agent, Project, Task } from '@/lib/types'
import { hrAgent, HRInsight, HRRecommendation } from '@/lib/hrAgent'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  User,
  TrendUp,
  TrendDown,
  MinusCircle,
  CheckCircle,
  WarningCircle,
  XCircle,
  Lightbulb,
  GraduationCap,
  UsersThree,
  CurrencyDollar
} from '@phosphor-icons/react'

interface HRDashboardProps {
  agents: Agent[]
  projects: Project[]
  tasks: Task[]
}

export function HRDashboard({ agents, projects, tasks }: HRDashboardProps) {
  const [insights, setInsights] = useState<HRInsight[]>([])
  const [recommendations, setRecommendations] = useState<HRRecommendation[]>([])
  const [skillGaps, setSkillGaps] = useState<{ skill: string; currentCount: number; neededCount: number; gap: number }[]>([])

  useEffect(() => {
    const newInsights = hrAgent.analyzeWorkforce(agents, projects, tasks)
    const newRecommendations = hrAgent.generateRecommendations(agents, projects, tasks)
    const newSkillGaps = hrAgent.identifySkillGaps(agents, projects, tasks)

    setInsights(newInsights)
    setRecommendations(newRecommendations)
    setSkillGaps(newSkillGaps.slice(0, 10))
  }, [agents, projects, tasks])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle size={24} weight="fill" className="text-success" />
      case 'good': return <TrendUp size={24} weight="fill" className="text-accent" />
      case 'concerning': return <WarningCircle size={24} weight="fill" className="text-warning" />
      case 'critical': return <XCircle size={24} weight="fill" className="text-destructive" />
      default: return <MinusCircle size={24} className="text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'border-success bg-success/5'
      case 'good': return 'border-accent bg-accent/5'
      case 'concerning': return 'border-warning bg-warning/5'
      case 'critical': return 'border-destructive bg-destructive/5'
      default: return 'border-border bg-background'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <XCircle size={18} weight="fill" className="text-destructive" />
      case 'high': return <WarningCircle size={18} weight="fill" className="text-warning" />
      case 'medium': return <TrendUp size={18} className="text-accent" />
      case 'low': return <Lightbulb size={18} className="text-muted-foreground" />
      default: return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hire': return <User size={18} weight="duotone" />
      case 'training': return <GraduationCap size={18} weight="duotone" />
      case 'rotation': return <UsersThree size={18} weight="duotone" />
      case 'rebalance': return <TrendUp size={18} weight="duotone" />
      default: return <Lightbulb size={18} weight="duotone" />
    }
  }

  const criticalInsights = insights.filter(i => i.status === 'critical' || i.status === 'concerning')
  const criticalRecommendations = recommendations.filter(r => r.priority === 'critical' || r.priority === 'high')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <User size={32} weight="duotone" className="text-accent" />
          HR Command Center
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Workforce analytics, recommendations, and skill gap analysis
        </p>
      </div>

      {criticalInsights.length > 0 && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <div className="flex items-start gap-3">
            <WarningCircle size={32} className="text-destructive flex-shrink-0" weight="fill" />
            <div>
              <p className="font-semibold text-destructive-foreground">Critical Attention Required</p>
              <p className="text-sm text-destructive-foreground/80 mt-1">
                {criticalInsights.length} workforce metric{criticalInsights.length > 1 ? 's need' : ' needs'} immediate attention
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Workforce Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className={`p-5 ${getStatusColor(insight.status)}`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(insight.status)}
                      <p className="font-semibold">{insight.metric}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {insight.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold font-mono">{Math.round(insight.value)}</p>
                    <p className="text-xs text-muted-foreground">
                      Target: {insight.benchmark}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">vs Target</span>
                    <span className="font-mono">
                      {insight.value > insight.benchmark ? (
                        <span className="text-success flex items-center gap-1">
                          <TrendUp size={12} weight="bold" />
                          {Math.round(((insight.value - insight.benchmark) / insight.benchmark) * 100)}%
                        </span>
                      ) : (
                        <span className="text-destructive flex items-center gap-1">
                          <TrendDown size={12} weight="bold" />
                          {Math.round(((insight.benchmark - insight.value) / insight.benchmark) * 100)}%
                        </span>
                      )}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((insight.value / insight.benchmark) * 100, 100)} 
                    className="h-2"
                  />
                </div>

                <Separator />

                <p className="text-sm text-foreground">
                  {insight.recommendation}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb size={24} weight="duotone" className="text-accent" />
            HR Recommendations
            {criticalRecommendations.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                {criticalRecommendations.length} Urgent
              </Badge>
            )}
          </h3>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <Card key={index} className={`p-4 ${
                rec.priority === 'critical' ? 'border-destructive bg-destructive/5' :
                rec.priority === 'high' ? 'border-warning bg-warning/5' :
                'border-border bg-background'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getPriorityIcon(rec.priority)}
                        <p className="font-semibold">{rec.description}</p>
                        <Badge variant="secondary" className="text-xs gap-1">
                          {getTypeIcon(rec.type)}
                          {rec.type}
                        </Badge>
                        <Badge 
                          variant={
                            rec.priority === 'critical' ? 'destructive' :
                            rec.priority === 'high' ? 'default' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{rec.impact}</p>

                      {rec.skillsNeeded && rec.skillsNeeded.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">Skills needed:</span>
                          {rec.skillsNeeded.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {rec.costSavings && rec.costSavings > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <CurrencyDollar size={16} weight="duotone" className="text-success" />
                          <span className="text-sm text-success font-semibold">
                            Potential savings: {rec.costSavings.toLocaleString()} tokens
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {skillGaps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap size={24} weight="duotone" className="text-accent" />
            Skill Gap Analysis
          </h3>

          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              {skillGaps.map((gap, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        gap.gap > 5 ? 'bg-destructive' :
                        gap.gap > 2 ? 'bg-warning' :
                        'bg-accent'
                      }`} />
                      <span className="font-medium">{gap.skill}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <span className="text-muted-foreground">Current: </span>
                        <span className="font-mono font-semibold">{gap.currentCount}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Needed: </span>
                        <span className="font-mono font-semibold">{gap.neededCount}</span>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <Badge 
                          variant={gap.gap > 5 ? 'destructive' : gap.gap > 2 ? 'default' : 'secondary'}
                          className="font-mono"
                        >
                          -{gap.gap}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(gap.currentCount / gap.neededCount) * 100} 
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-accent/5 border-accent">
            <div className="flex items-start gap-3">
              <Lightbulb size={24} className="text-accent flex-shrink-0" weight="duotone" />
              <div className="text-sm">
                <p className="font-semibold text-accent-foreground">Recommended Actions</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Cross-train existing agents in high-demand skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Rotate agents to projects that expose them to needed skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Consider hiring specialists for critical skill gaps</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
