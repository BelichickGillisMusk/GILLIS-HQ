import { Agent, Project, Task } from './types'
import { TeamRecommendation, formOptimalTeam, calculateSkillCoverage, analyzeProjectSkillRequirements } from './teamFormation'

export interface HRRecommendation {
  type: 'hire' | 'training' | 'rotation' | 'rebalance'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
  impact: string
  skillsNeeded?: string[]
  agentsAffected?: string[]
  costSavings?: number
}

export interface HRInsight {
  category: 'workload' | 'skills' | 'efficiency' | 'cost' | 'collaboration'
  metric: string
  value: number
  benchmark: number
  status: 'excellent' | 'good' | 'concerning' | 'critical'
  recommendation: string
}

export class HRAgent {
  analyzeWorkforce(agents: Agent[], projects: Project[], tasks: Task[]): HRInsight[] {
    const insights: HRInsight[] = []

    const avgUtilization = agents.reduce((sum, a) => sum + (a.currentLoad / a.capacity), 0) / agents.length
    insights.push({
      category: 'workload',
      metric: 'Average Agent Utilization',
      value: avgUtilization * 100,
      benchmark: 75,
      status: avgUtilization > 0.9 ? 'critical' : avgUtilization > 0.8 ? 'concerning' : avgUtilization > 0.6 ? 'good' : 'excellent',
      recommendation: avgUtilization > 0.8 
        ? 'Consider hiring additional agents or redistributing workload to prevent burnout.'
        : 'Utilization is healthy. Monitor for changes as projects evolve.'
    })

    const allSkills = new Set(agents.flatMap(a => a.skills))
    const avgSkillsPerAgent = agents.reduce((sum, a) => sum + a.skills.length, 0) / agents.length
    insights.push({
      category: 'skills',
      metric: 'Skill Diversity',
      value: allSkills.size,
      benchmark: 25,
      status: allSkills.size > 30 ? 'excellent' : allSkills.size > 20 ? 'good' : 'concerning',
      recommendation: allSkills.size < 25
        ? 'Implement cross-training programs to increase skill diversity and team flexibility.'
        : 'Strong skill diversity. Continue fostering learning opportunities.'
    })

    const avgEfficiency = agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length
    insights.push({
      category: 'efficiency',
      metric: 'Team Efficiency',
      value: avgEfficiency,
      benchmark: 80,
      status: avgEfficiency > 85 ? 'excellent' : avgEfficiency > 75 ? 'good' : avgEfficiency > 65 ? 'concerning' : 'critical',
      recommendation: avgEfficiency < 80
        ? 'Review processes and provide targeted training to improve efficiency scores.'
        : 'Efficiency is strong. Share best practices across teams.'
    })

    const avgCost = agents.reduce((sum, a) => sum + a.tokenCostPerTask, 0) / agents.length
    insights.push({
      category: 'cost',
      metric: 'Average Cost per Task',
      value: avgCost,
      benchmark: 150,
      status: avgCost < 120 ? 'excellent' : avgCost < 160 ? 'good' : avgCost < 200 ? 'concerning' : 'critical',
      recommendation: avgCost > 160
        ? 'Consider optimizing task allocation to leverage more cost-effective agents.'
        : 'Cost efficiency is good. Continue monitoring per-task costs.'
    })

    const claudeCount = agents.filter(a => a.type === 'Claude').length
    const vmCount = agents.filter(a => a.type === 'VM Open Claw').length
    const ratio = claudeCount / (vmCount || 1)
    insights.push({
      category: 'collaboration',
      metric: 'Agent Type Balance',
      value: ratio,
      benchmark: 1,
      status: Math.abs(ratio - 1) < 0.3 ? 'excellent' : Math.abs(ratio - 1) < 0.5 ? 'good' : 'concerning',
      recommendation: Math.abs(ratio - 1) > 0.5
        ? 'Rebalance agent types to ensure diverse perspectives and approaches.'
        : 'Agent mix is well-balanced across types.'
    })

    return insights
  }

  generateRecommendations(agents: Agent[], projects: Project[], tasks: Task[]): HRRecommendation[] {
    const recommendations: HRRecommendation[] = []

    const overloadedAgents = agents.filter(a => a.currentLoad >= a.capacity)
    if (overloadedAgents.length > 0) {
      recommendations.push({
        type: 'rebalance',
        priority: 'high',
        description: `${overloadedAgents.length} agents are at or over capacity`,
        impact: 'Risk of burnout, reduced quality, and project delays',
        agentsAffected: overloadedAgents.map(a => a.id),
        costSavings: 0
      })
    }

    const activeProjects = projects.filter(p => p.status === 'in-progress')
    for (const project of activeProjects) {
      const requiredSkills = analyzeProjectSkillRequirements(project, tasks)
      const assignedAgents = agents.filter(a => project.assignedAgents.includes(a.id))
      
      if (assignedAgents.length > 0) {
        const { coverage, gaps } = calculateSkillCoverage(assignedAgents, requiredSkills)
        
        if (coverage < 70) {
          recommendations.push({
            type: 'training',
            priority: 'medium',
            description: `Project "${project.name}" has only ${Math.round(coverage)}% skill coverage`,
            impact: 'May delay project completion or reduce quality',
            skillsNeeded: gaps.map(g => g.skill)
          })
        }
      }
    }

    const lowEfficiencyAgents = agents.filter(a => a.efficiency < 60)
    if (lowEfficiencyAgents.length > 3) {
      recommendations.push({
        type: 'training',
        priority: 'high',
        description: `${lowEfficiencyAgents.length} agents have efficiency scores below 60%`,
        impact: 'Reduced productivity and increased project costs',
        agentsAffected: lowEfficiencyAgents.map(a => a.id)
      })
    }

    const departments = [...new Set(agents.map(a => a.department))]
    const deptSizes = departments.map(dept => ({
      dept,
      count: agents.filter(a => a.department === dept).length
    }))
    const avgSize = deptSizes.reduce((sum, d) => sum + d.count, 0) / deptSizes.length
    const unbalanced = deptSizes.filter(d => Math.abs(d.count - avgSize) > avgSize * 0.4)
    
    if (unbalanced.length > 0) {
      recommendations.push({
        type: 'rebalance',
        priority: 'medium',
        description: 'Some departments are significantly over or under-staffed',
        impact: 'Inefficient resource allocation across the organization'
      })
    }

    const highCostAgents = agents.filter(a => a.tokenCostPerTask > 200)
    const lowUtilizationHighCost = highCostAgents.filter(a => (a.currentLoad / a.capacity) < 0.5)
    
    if (lowUtilizationHighCost.length > 0) {
      const potentialSavings = lowUtilizationHighCost.reduce((sum, a) => {
        return sum + (a.capacity - a.currentLoad) * a.tokenCostPerTask * 0.3
      }, 0)
      
      recommendations.push({
        type: 'rotation',
        priority: 'medium',
        description: `${lowUtilizationHighCost.length} high-cost agents are underutilized`,
        impact: 'Inefficient use of premium resources',
        agentsAffected: lowUtilizationHighCost.map(a => a.id),
        costSavings: Math.round(potentialSavings)
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  findOptimalTeamComposition(
    project: Project,
    tasks: Task[],
    allAgents: Agent[],
    iterations: number = 5
  ): TeamRecommendation {
    const availableAgents = allAgents.filter(a => a.currentLoad < a.capacity)
    
    if (availableAgents.length < 3) {
      return formOptimalTeam(project, tasks, allAgents)
    }

    let bestRecommendation = formOptimalTeam(project, tasks, availableAgents)
    let bestScore = this.scoreTeamComposition(bestRecommendation)

    for (let i = 0; i < iterations; i++) {
      const shuffledAgents = [...availableAgents].sort(() => Math.random() - 0.5)
      const recommendation = formOptimalTeam(project, tasks, shuffledAgents)
      const score = this.scoreTeamComposition(recommendation)

      if (score > bestScore) {
        bestScore = score
        bestRecommendation = recommendation
      }
    }

    return bestRecommendation
  }

  private scoreTeamComposition(recommendation: TeamRecommendation): number {
    return (
      recommendation.diversityScore * 0.3 +
      recommendation.costEfficiency * 0.3 +
      recommendation.learningPotential * 0.4
    )
  }

  generateSkillMatrix(agents: Agent[]): {
    skills: string[]
    matrix: { agentId: string; agentName: string; skillLevels: number[] }[]
  } {
    const allSkills = [...new Set(agents.flatMap(a => a.skills))].sort()
    
    const matrix = agents.map(agent => ({
      agentId: agent.id,
      agentName: agent.name,
      skillLevels: allSkills.map(skill => agent.skills.includes(skill) ? 1 : 0)
    }))

    return { skills: allSkills, matrix }
  }

  identifySkillGaps(
    agents: Agent[],
    projects: Project[],
    tasks: Task[]
  ): { skill: string; currentCount: number; neededCount: number; gap: number }[] {
    const currentSkills = agents.flatMap(a => a.skills)
    const skillCounts = currentSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const requiredSkills: Record<string, number> = {}
    projects.filter(p => p.status === 'in-progress' || p.status === 'planning').forEach(project => {
      const skills = analyzeProjectSkillRequirements(project, tasks)
      skills.forEach(skill => {
        requiredSkills[skill] = (requiredSkills[skill] || 0) + 1
      })
    })

    const gaps = Object.keys(requiredSkills).map(skill => ({
      skill,
      currentCount: skillCounts[skill] || 0,
      neededCount: requiredSkills[skill],
      gap: Math.max(0, requiredSkills[skill] - (skillCounts[skill] || 0))
    }))

    return gaps.filter(g => g.gap > 0).sort((a, b) => b.gap - a.gap)
  }
}

export const hrAgent = new HRAgent()
