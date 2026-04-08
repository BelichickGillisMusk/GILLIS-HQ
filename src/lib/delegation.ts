import { Agent, Task, DepartmentType } from './types'

export interface DelegationRecommendation {
  agentId: string
  confidence: number
  reasoning: string
  costEstimate: number
  efficiency: number
  skillMatch: number
  workloadScore: number
}

export interface DelegationFeedback {
  quality: 'excellent' | 'good' | 'poor'
  message: string
  suggestion?: string
}

export function calculateSkillMatch(agent: Agent, taskSkills: string[]): number {
  if (taskSkills.length === 0) return 50

  const matchedSkills = taskSkills.filter(skill =>
    agent.skills.some(agentSkill =>
      agentSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(agentSkill.toLowerCase())
    )
  )

  return (matchedSkills.length / taskSkills.length) * 100
}

export function calculateWorkloadScore(agent: Agent): number {
  const utilization = agent.currentLoad / agent.capacity
  
  if (utilization >= 1) return 0
  if (utilization >= 0.9) return 20
  if (utilization >= 0.7) return 60
  if (utilization >= 0.4) return 100
  if (utilization >= 0.2) return 80
  return 50
}

export function recommendAgents(
  agents: Agent[],
  task: Partial<Task>,
  taskSkills: string[] = []
): DelegationRecommendation[] {
  const department = task.department
  const departmentAgents = department
    ? agents.filter(a => a.department === department)
    : agents

  const recommendations = departmentAgents.map(agent => {
    const skillMatch = calculateSkillMatch(agent, taskSkills)
    const workloadScore = calculateWorkloadScore(agent)
    const efficiency = agent.efficiency

    const costEstimate = agent.tokenCostPerTask

    const confidence =
      (skillMatch * 0.4) +
      (workloadScore * 0.3) +
      (efficiency * 0.3)

    let reasoning = ''
    if (skillMatch > 80) {
      reasoning = `${agent.name} has excellent skill match (${Math.round(skillMatch)}%). `
    } else if (skillMatch > 50) {
      reasoning = `${agent.name} has good skill overlap (${Math.round(skillMatch)}%). `
    } else {
      reasoning = `${agent.name} has limited skill match (${Math.round(skillMatch)}%). `
    }

    if (workloadScore > 80) {
      reasoning += `Currently well-balanced capacity. `
    } else if (workloadScore > 50) {
      reasoning += `Has available capacity. `
    } else if (workloadScore < 30) {
      reasoning += `Currently near or at capacity. `
    }

    if (agent.tokenCostPerTask < 100) {
      reasoning += `Cost-efficient option.`
    } else if (agent.tokenCostPerTask > 200) {
      reasoning += `Premium option with higher cost.`
    }

    return {
      agentId: agent.id,
      confidence: Math.round(confidence),
      reasoning,
      costEstimate,
      efficiency: Math.round(efficiency),
      skillMatch: Math.round(skillMatch),
      workloadScore: Math.round(workloadScore)
    }
  })

  return recommendations.sort((a, b) => b.confidence - a.confidence)
}

export function provideDelegationFeedback(
  agent: Agent,
  task: Partial<Task>,
  taskSkills: string[]
): DelegationFeedback {
  const skillMatch = calculateSkillMatch(agent, taskSkills)
  const workloadScore = calculateWorkloadScore(agent)

  if (agent.currentLoad >= agent.capacity) {
    return {
      quality: 'poor',
      message: `${agent.name} is at full capacity (${agent.currentLoad}/${agent.capacity} tasks). This could delay progress.`,
      suggestion: 'Consider redistributing existing tasks or choosing a less loaded agent.'
    }
  }

  if (skillMatch < 30) {
    return {
      quality: 'poor',
      message: `${agent.name} has weak skill alignment for this task (${Math.round(skillMatch)}% match).`,
      suggestion: 'Look for agents with stronger skill overlap to ensure quality and efficiency.'
    }
  }

  if (workloadScore > 70 && skillMatch > 70) {
    return {
      quality: 'excellent',
      message: `Great choice! ${agent.name} has the right skills and available capacity. Cost: ${agent.tokenCostPerTask} tokens/task.`,
    }
  }

  if (skillMatch > 60 && workloadScore > 40) {
    return {
      quality: 'good',
      message: `Solid delegation. ${agent.name} can handle this effectively. Cost: ${agent.tokenCostPerTask} tokens/task.`,
    }
  }

  return {
    quality: 'good',
    message: `${agent.name} can handle this task. Cost: ${agent.tokenCostPerTask} tokens/task.`,
    suggestion: workloadScore < 50 ? 'Agent is getting busy - monitor workload.' : undefined
  }
}
