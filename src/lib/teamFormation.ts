import { Agent, Project, Task, DepartmentType } from './types'

export interface Team {
  id: string
  name: string
  projectId: string
  members: string[]
  skillsCoverage: string[]
  formationDate: number
  rotationCount: number
  efficiency: number
  completedTasks: number
  learningScore: number
}

export interface SkillGap {
  skill: string
  currentCoverage: number
  required: number
  gap: number
}

export interface TeamRecommendation {
  teamId: string
  projectId: string
  members: Agent[]
  skillsCoverage: string[]
  diversityScore: number
  costEfficiency: number
  learningPotential: number
  reasoning: string
}

export function analyzeProjectSkillRequirements(project: Project, tasks: Task[]): string[] {
  const projectTasks = tasks.filter(t => t.projectId === project.id)
  const skillMap: Record<DepartmentType, string[]> = {
    marketing: ['Content Creation', 'SEO', 'Analytics', 'Social Media', 'Brand Strategy', 'Campaign Management'],
    sales: ['Lead Generation', 'CRM', 'Negotiation', 'Product Knowledge', 'Pipeline Management', 'Client Relations'],
    admin: ['Scheduling', 'Documentation', 'Process Management', 'Communication', 'Organization', 'Vendor Management'],
    tech: ['Programming', 'Architecture', 'DevOps', 'Testing', 'Security', 'Code Review', 'System Design'],
    operations: ['Logistics', 'Process Optimization', 'Quality Control', 'Resource Planning', 'Vendor Coordination', 'Metrics Analysis']
  }

  const baseSkills = skillMap[project.department] || []
  const additionalSkills: string[] = []

  if (project.priority === 'critical' || project.priority === 'high') {
    additionalSkills.push('Project Management', 'Risk Assessment')
  }

  if (project.budget > 50000) {
    additionalSkills.push('Budget Management', 'Financial Planning')
  }

  if (projectTasks.some(t => t.collaborators.length > 3)) {
    additionalSkills.push('Team Coordination', 'Communication')
  }

  return [...new Set([...baseSkills.slice(0, 5), ...additionalSkills])]
}

export function calculateSkillCoverage(agents: Agent[], requiredSkills: string[]): {
  coverage: number
  gaps: SkillGap[]
  strengths: string[]
} {
  const agentSkills = agents.flatMap(a => a.skills)
  const skillCounts = agentSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const gaps: SkillGap[] = []
  const strengths: string[] = []

  requiredSkills.forEach(skill => {
    const currentCoverage = skillCounts[skill] || 0
    const required = 2
    if (currentCoverage < required) {
      gaps.push({ skill, currentCoverage, required, gap: required - currentCoverage })
    } else {
      strengths.push(skill)
    }
  })

  const coverage = requiredSkills.length > 0 
    ? (requiredSkills.filter(skill => skillCounts[skill] >= 1).length / requiredSkills.length) * 100
    : 100

  return { coverage, gaps, strengths }
}

export function calculateTeamDiversity(agents: Agent[]): number {
  if (agents.length === 0) return 0

  const typeVariety = new Set(agents.map(a => a.type)).size
  const deptVariety = new Set(agents.map(a => a.department)).size
  const skillVariety = new Set(agents.flatMap(a => a.skills)).size

  const typeScore = (typeVariety / 2) * 100
  const deptScore = (deptVariety / 5) * 100
  const skillScore = Math.min((skillVariety / 10) * 100, 100)

  return (typeScore * 0.3 + deptScore * 0.3 + skillScore * 0.4)
}

export function calculateLearningPotential(agents: Agent[], requiredSkills: string[]): number {
  let learningScore = 0

  agents.forEach(agent => {
    const newSkills = requiredSkills.filter(skill => !agent.skills.includes(skill))
    learningScore += newSkills.length * 10

    const hasComplementarySkills = agents.some(other => 
      other.id !== agent.id && other.skills.some(skill => !agent.skills.includes(skill))
    )
    if (hasComplementarySkills) learningScore += 15
  })

  return Math.min(learningScore, 100)
}

export function formOptimalTeam(
  project: Project,
  tasks: Task[],
  availableAgents: Agent[]
): TeamRecommendation {
  const requiredSkills = analyzeProjectSkillRequirements(project, tasks)
  const teamSize = Math.min(Math.max(3, Math.ceil(requiredSkills.length / 2)), 6)

  const scoredAgents = availableAgents.map(agent => {
    const skillMatch = agent.skills.filter(s => requiredSkills.includes(s)).length
    const capacityScore = ((agent.capacity - agent.currentLoad) / agent.capacity) * 100
    const costScore = (1 / (agent.tokenCostPerTask / 100)) * 100
    const efficiencyScore = agent.efficiency

    const totalScore = 
      skillMatch * 30 + 
      capacityScore * 0.2 + 
      costScore * 0.2 + 
      efficiencyScore * 0.3

    return { agent, score: totalScore, skillMatch }
  })

  scoredAgents.sort((a, b) => b.score - a.score)

  const selectedAgents: Agent[] = []
  const coveredSkills = new Set<string>()

  for (const scored of scoredAgents) {
    if (selectedAgents.length >= teamSize) break

    const newSkills = scored.agent.skills.filter(s => !coveredSkills.has(s))
    if (selectedAgents.length === 0 || newSkills.length > 0) {
      selectedAgents.push(scored.agent)
      scored.agent.skills.forEach(s => coveredSkills.add(s))
    }
  }

  while (selectedAgents.length < teamSize && scoredAgents.length > selectedAgents.length) {
    const remaining = scoredAgents.filter(s => !selectedAgents.includes(s.agent))
    if (remaining.length === 0) break
    selectedAgents.push(remaining[0].agent)
  }

  const diversityScore = calculateTeamDiversity(selectedAgents)
  const avgCost = selectedAgents.reduce((sum, a) => sum + a.tokenCostPerTask, 0) / selectedAgents.length
  const costEfficiency = Math.max(0, 100 - (avgCost / 2))
  const learningPotential = calculateLearningPotential(selectedAgents, requiredSkills)

  const skillsCoverage = [...coveredSkills]
  const { coverage } = calculateSkillCoverage(selectedAgents, requiredSkills)

  const reasoning = `Assembled ${selectedAgents.length}-person team with ${Math.round(coverage)}% skill coverage. ` +
    `Team includes ${selectedAgents.filter(a => a.type === 'Claude').length} Claude and ` +
    `${selectedAgents.filter(a => a.type === 'VM Open Claw').length} VM agents for balanced perspectives. ` +
    `Diversity score: ${Math.round(diversityScore)}%, Learning potential: ${Math.round(learningPotential)}%.`

  return {
    teamId: `team-${project.id}-${Date.now()}`,
    projectId: project.id,
    members: selectedAgents,
    skillsCoverage,
    diversityScore,
    costEfficiency,
    learningPotential,
    reasoning
  }
}

export function shouldRotateTeam(team: Team, project: Project): boolean {
  const daysSinceFormation = (Date.now() - team.formationDate) / (1000 * 60 * 60 * 24)
  
  if (daysSinceFormation < 7) return false
  
  if (team.efficiency < 60) return true
  
  if (team.learningScore > 80 && daysSinceFormation > 14) return true
  
  if (team.rotationCount === 0 && daysSinceFormation > 21) return true
  
  return false
}

export function rotateTeamMembers(
  currentTeam: Team,
  currentMembers: Agent[],
  project: Project,
  tasks: Task[],
  allAgents: Agent[]
): TeamRecommendation {
  const requiredSkills = analyzeProjectSkillRequirements(project, tasks)
  const availableAgents = allAgents.filter(a => 
    !currentMembers.some(cm => cm.id === a.id) && 
    a.currentLoad < a.capacity
  )

  const membersToKeep = Math.ceil(currentMembers.length * 0.5)
  const topPerformers = currentMembers
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, membersToKeep)

  const newMembersNeeded = currentMembers.length - topPerformers.length

  const candidateAgents = availableAgents.map(agent => {
    const skillMatch = agent.skills.filter(s => requiredSkills.includes(s)).length
    const hasNewSkills = agent.skills.some(s => 
      !topPerformers.some(tp => tp.skills.includes(s))
    )
    const differentType = !topPerformers.every(tp => tp.type === agent.type)

    const score = skillMatch * 30 + 
      (hasNewSkills ? 20 : 0) + 
      (differentType ? 15 : 0) + 
      agent.efficiency * 0.35

    return { agent, score }
  })

  candidateAgents.sort((a, b) => b.score - a.score)
  const newMembers = candidateAgents.slice(0, newMembersNeeded).map(c => c.agent)

  const finalTeam = [...topPerformers, ...newMembers]

  const diversityScore = calculateTeamDiversity(finalTeam)
  const avgCost = finalTeam.reduce((sum, a) => sum + a.tokenCostPerTask, 0) / finalTeam.length
  const costEfficiency = Math.max(0, 100 - (avgCost / 2))
  const learningPotential = calculateLearningPotential(finalTeam, requiredSkills)
  const skillsCoverage = [...new Set(finalTeam.flatMap(a => a.skills))]

  const reasoning = `Rotated team: kept ${topPerformers.length} top performers, added ${newMembers.length} fresh members. ` +
    `New diversity: ${Math.round(diversityScore)}%, Learning boost: ${Math.round(learningPotential)}%.`

  return {
    teamId: `team-${project.id}-rot-${Date.now()}`,
    projectId: project.id,
    members: finalTeam,
    skillsCoverage,
    diversityScore,
    costEfficiency,
    learningPotential,
    reasoning
  }
}

export function generateDeploymentChecklist(projects: Project[], teams: Team[]): {
  category: string
  items: { task: string; status: 'pending' | 'in-progress' | 'done'; priority: 'low' | 'medium' | 'high' }[]
}[] {
  return [
    {
      category: 'Code Quality & Testing',
      items: [
        { task: 'Run full test suite across all projects', status: 'pending', priority: 'high' },
        { task: 'Code review for recent changes', status: 'pending', priority: 'high' },
        { task: 'Security vulnerability scan', status: 'pending', priority: 'high' },
        { task: 'Performance benchmarking', status: 'pending', priority: 'medium' },
        { task: 'Accessibility audit', status: 'pending', priority: 'medium' },
      ]
    },
    {
      category: 'Documentation',
      items: [
        { task: 'Update API documentation', status: 'pending', priority: 'high' },
        { task: 'Review deployment runbook', status: 'pending', priority: 'high' },
        { task: 'Update team rotation schedules', status: 'pending', priority: 'medium' },
        { task: 'Document new features and changes', status: 'pending', priority: 'medium' },
        { task: 'Update architecture diagrams', status: 'pending', priority: 'low' },
      ]
    },
    {
      category: 'Infrastructure',
      items: [
        { task: 'Verify staging environment matches production', status: 'pending', priority: 'high' },
        { task: 'Database backup verification', status: 'pending', priority: 'high' },
        { task: 'Load balancer health check', status: 'pending', priority: 'high' },
        { task: 'SSL certificate expiration check', status: 'pending', priority: 'medium' },
        { task: 'CDN cache invalidation plan', status: 'pending', priority: 'medium' },
      ]
    },
    {
      category: 'Monitoring & Alerts',
      items: [
        { task: 'Configure production monitoring dashboards', status: 'pending', priority: 'high' },
        { task: 'Set up error tracking and alerting', status: 'pending', priority: 'high' },
        { task: 'Performance metrics baseline', status: 'pending', priority: 'medium' },
        { task: 'Configure log aggregation', status: 'pending', priority: 'medium' },
        { task: 'Test rollback procedures', status: 'pending', priority: 'high' },
      ]
    },
    {
      category: 'Team & Process',
      items: [
        { task: 'Assign on-call rotation schedule', status: 'pending', priority: 'high' },
        { task: 'Brief all teams on deployment timeline', status: 'pending', priority: 'high' },
        { task: 'Prepare incident response plan', status: 'pending', priority: 'high' },
        { task: 'Schedule post-deployment retrospective', status: 'pending', priority: 'medium' },
        { task: 'Update stakeholder communication templates', status: 'pending', priority: 'low' },
      ]
    },
    {
      category: 'Git & Code Management',
      items: [
        { task: 'Create release branch from main', status: 'pending', priority: 'high' },
        { task: 'Tag release version in Git', status: 'pending', priority: 'high' },
        { task: 'Verify all PRs are merged', status: 'pending', priority: 'high' },
        { task: 'Update CHANGELOG.md', status: 'pending', priority: 'medium' },
        { task: 'Archive old feature branches', status: 'pending', priority: 'low' },
      ]
    }
  ]
}
