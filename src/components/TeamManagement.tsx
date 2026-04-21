import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Agent, Project, Task } from '@/lib/types'
import { Team, TeamRecommendation, formOptimalTeam, shouldRotateTeam, rotateTeamMembers, analyzeProjectSkillRequirements, calculateSkillCoverage } from '@/lib/teamFormation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Users, 
  ArrowsClockwise, 
  Sparkle, 
  TrendUp, 
  CheckCircle,
  WarningCircle,
  Lightning,
  Brain
} from '@phosphor-icons/react'

interface TeamManagementProps {
  agents: Agent[]
  projects: Project[]
  tasks: Task[]
  onTeamUpdate: (team: Team) => void
}

export function TeamManagement({ agents, projects, tasks, onTeamUpdate }: TeamManagementProps) {
  const [teams, setTeams] = useKV<Team[]>('office-teams', [])
  const [autoRotate, setAutoRotate] = useKV<boolean>('auto-rotate-teams', true)
  const [recommendations, setRecommendations] = useState<TeamRecommendation[]>([])
  const [processingProjectId, setProcessingProjectId] = useState<string | null>(null)

  useEffect(() => {
    generateRecommendations()
  }, [projects, agents, tasks])

  const generateRecommendations = () => {
    const activeProjects = projects.filter(p => 
      p.status === 'in-progress' || p.status === 'planning'
    )

    const newRecommendations = activeProjects.map(project => {
      const existingTeam = teams?.find(t => t.projectId === project.id)
      
      if (existingTeam) {
        const teamMembers = agents.filter(a => existingTeam.members.includes(a.id))
        if (shouldRotateTeam(existingTeam, project) && autoRotate) {
          return rotateTeamMembers(existingTeam, teamMembers, project, tasks, agents)
        }
        return null
      }

      return formOptimalTeam(project, tasks, agents)
    }).filter((r): r is TeamRecommendation => r !== null)

    setRecommendations(newRecommendations)
  }

  const createTeam = (recommendation: TeamRecommendation) => {
    setProcessingProjectId(recommendation.projectId)

    const project = projects.find(p => p.id === recommendation.projectId)
    if (!project) return

    const newTeam: Team = {
      id: recommendation.teamId,
      name: `Team ${project.name.split(' ').slice(0, 2).join(' ')}`,
      projectId: recommendation.projectId,
      members: recommendation.members.map(m => m.id),
      skillsCoverage: recommendation.skillsCoverage,
      formationDate: Date.now(),
      rotationCount: 0,
      efficiency: recommendation.members.reduce((sum, m) => sum + m.efficiency, 0) / recommendation.members.length,
      completedTasks: 0,
      learningScore: recommendation.learningPotential
    }

    setTeams((currentTeams) => [...(currentTeams || []), newTeam])
    onTeamUpdate(newTeam)

    toast.success('Team Created', {
      description: `${recommendation.members.length} agents assembled for ${project.name}`
    })

    setProcessingProjectId(null)
    generateRecommendations()
  }

  const rotateTeam = (teamId: string) => {
    const team = teams?.find(t => t.id === teamId)
    if (!team) return

    const project = projects.find(p => p.id === team.projectId)
    if (!project) return

    const currentMembers = agents.filter(a => team.members.includes(a.id))
    const recommendation = rotateTeamMembers(team, currentMembers, project, tasks, agents)

    const updatedTeam: Team = {
      ...team,
      id: recommendation.teamId,
      members: recommendation.members.map(m => m.id),
      skillsCoverage: recommendation.skillsCoverage,
      rotationCount: team.rotationCount + 1,
      efficiency: recommendation.members.reduce((sum, m) => sum + m.efficiency, 0) / recommendation.members.length,
      learningScore: recommendation.learningPotential
    }

    setTeams((currentTeams) => 
      (currentTeams || []).map(t => t.id === teamId ? updatedTeam : t)
    )
    onTeamUpdate(updatedTeam)

    toast.success('Team Rotated', {
      description: `Fresh perspectives added to ${project.name}`
    })

    generateRecommendations()
  }

  const dissolveTeam = (teamId: string) => {
    setTeams((currentTeams) => (currentTeams || []).filter(t => t.id !== teamId))
    toast.info('Team Dissolved', {
      description: 'Agents returned to general pool'
    })
    generateRecommendations()
  }

  const activeProjects = projects.filter(p => p.status === 'in-progress' || p.status === 'planning')
  const assignedProjects = activeProjects.filter(p => 
    teams?.some(t => t.projectId === p.id)
  )
  const unassignedProjects = activeProjects.filter(p => 
    !teams?.some(t => t.projectId === p.id)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {teams?.length || 0} active teams • {unassignedProjects.length} projects need teams
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={autoRotate ? 'default' : 'secondary'} className="gap-1">
            <ArrowsClockwise size={14} weight="bold" />
            Auto-Rotation {autoRotate ? 'ON' : 'OFF'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAutoRotate((current) => !current)}
          >
            Toggle
          </Button>
        </div>
      </div>

      {unassignedProjects.length > 0 && (
        <Card className="p-6 bg-accent/10 border-accent">
          <div className="flex items-start gap-3">
            <Brain size={32} className="text-accent flex-shrink-0" weight="duotone" />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">HR Recommendations</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-powered team formation based on skills, diversity, and cost efficiency
                </p>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec) => {
                  const project = projects.find(p => p.id === rec.projectId)
                  if (!project) return null

                  const requiredSkills = analyzeProjectSkillRequirements(project, tasks)
                  const { coverage, gaps } = calculateSkillCoverage(rec.members, requiredSkills)

                  return (
                    <Card key={rec.teamId} className="p-4 bg-card border-border">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{rec.reasoning}</p>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => createTeam(rec)}
                            disabled={processingProjectId === rec.projectId}
                            className="gap-1"
                          >
                            <Sparkle size={16} weight="fill" />
                            Form Team
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Diversity</p>
                            <p className="font-mono font-semibold text-accent">{Math.round(rec.diversityScore)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Cost Eff.</p>
                            <p className="font-mono font-semibold text-success">{Math.round(rec.costEfficiency)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Learning</p>
                            <p className="font-mono font-semibold text-info">{Math.round(rec.learningPotential)}%</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Skill Coverage</span>
                            <span className="font-mono">{Math.round(coverage)}%</span>
                          </div>
                          <Progress value={coverage} className="h-1.5" />
                          {gaps.length > 0 && (
                            <p className="text-xs text-warning mt-1">
                              Missing: {gaps.map(g => g.skill).join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {rec.members.map(member => (
                            <Badge key={member.id} variant="secondary" className="text-xs">
                              {member.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {assignedProjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Teams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams?.map(team => {
              const project = projects.find(p => p.id === team.projectId)
              if (!project) return null

              const teamMembers = agents.filter(a => team.members.includes(a.id))
              const requiredSkills = analyzeProjectSkillRequirements(project, tasks)
              const { coverage } = calculateSkillCoverage(teamMembers, requiredSkills)
              const needsRotation = shouldRotateTeam(team, project)

              return (
                <Card key={team.id} className={`p-4 bg-card ${needsRotation ? 'border-warning' : 'border-border'}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {team.name}
                          {needsRotation && (
                            <WarningCircle size={18} className="text-warning" weight="fill" />
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground">{project.name}</p>
                      </div>
                      <div className="flex gap-1">
                        {needsRotation && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => rotateTeam(team.id)}
                            className="gap-1"
                          >
                            <ArrowsClockwise size={14} />
                            Rotate
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="font-mono font-semibold">{team.members.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Efficiency</p>
                        <p className="font-mono font-semibold">{Math.round(team.efficiency)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rotations</p>
                        <p className="font-mono font-semibold">{team.rotationCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tasks</p>
                        <p className="font-mono font-semibold">{team.completedTasks}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Coverage</span>
                        <span className="font-mono">{Math.round(coverage)}%</span>
                      </div>
                      <Progress value={coverage} className="h-1.5" />
                    </div>

                    <Separator />

                    <div className="flex flex-wrap gap-1">
                      {teamMembers.map(member => (
                        <Badge 
                          key={member.id} 
                          variant={member.type === 'Claude' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {member.name.split(' ')[0]}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full text-xs text-destructive hover:text-destructive"
                      onClick={() => dissolveTeam(team.id)}
                    >
                      Dissolve Team
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
