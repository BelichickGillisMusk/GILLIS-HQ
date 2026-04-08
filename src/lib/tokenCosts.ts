import { Agent, Task, Project } from './types'

export interface TokenCostAnalytics {
  totalCost: number
  costByDepartment: Record<string, number>
  costByAgentType: Record<string, number>
  taskCount: number
  avgCostPerTask: number
  optimizationPotential: number
}

export interface CostOptimization {
  currentCost: number
  optimizedCost: number
  savings: number
  savingsPercentage: number
  recommendation: string
}

export function calculateTokenCost(agent: Agent, tasksCompleted: number = 1): number {
  return agent.tokenCostPerTask * tasksCompleted
}

export function analyzeTokenCosts(agents: Agent[], tasks: Task[]): TokenCostAnalytics {
  let totalCost = 0
  const costByDepartment: Record<string, number> = {}
  const costByAgentType: Record<string, number> = {
    'Claude': 0,
    'VM Open Claw': 0
  }

  for (const agent of agents) {
    const agentCost = calculateTokenCost(agent, agent.tasksCompleted)
    totalCost += agentCost

    if (!costByDepartment[agent.department]) {
      costByDepartment[agent.department] = 0
    }
    costByDepartment[agent.department] += agentCost

    costByAgentType[agent.type] += agentCost
  }

  const taskCount = tasks.length
  const avgCostPerTask = taskCount > 0 ? totalCost / taskCount : 0

  const claudeAgents = agents.filter(a => a.type === 'Claude')
  const vmAgents = agents.filter(a => a.type === 'VM Open Claw')
  const avgClaudeCost = claudeAgents.length > 0
    ? claudeAgents.reduce((sum, a) => sum + a.tokenCostPerTask, 0) / claudeAgents.length
    : 0
  const avgVMCost = vmAgents.length > 0
    ? vmAgents.reduce((sum, a) => sum + a.tokenCostPerTask, 0) / vmAgents.length
    : 0

  const potentialSavings = avgClaudeCost > avgVMCost
    ? (avgClaudeCost - avgVMCost) * (claudeAgents.reduce((sum, a) => sum + a.tasksCompleted, 0))
    : 0

  return {
    totalCost: Math.round(totalCost),
    costByDepartment,
    costByAgentType,
    taskCount,
    avgCostPerTask: Math.round(avgCostPerTask),
    optimizationPotential: Math.round(potentialSavings)
  }
}

export function suggestCostOptimization(
  task: Partial<Task>,
  agents: Agent[]
): CostOptimization | null {
  if (!task.department) return null

  const departmentAgents = agents.filter(a => a.department === task.department && a.currentLoad < a.capacity)
  if (departmentAgents.length === 0) return null

  const currentAgent = agents.find(a => a.id === task.assignedTo?.[0])
  if (!currentAgent) {
    const cheapestAgent = departmentAgents.reduce((min, agent) =>
      agent.tokenCostPerTask < min.tokenCostPerTask ? agent : min
    )

    return {
      currentCost: 0,
      optimizedCost: cheapestAgent.tokenCostPerTask,
      savings: 0,
      savingsPercentage: 0,
      recommendation: `Assign to ${cheapestAgent.name} for optimal cost (${cheapestAgent.tokenCostPerTask} tokens/task)`
    }
  }

  const cheaperAgents = departmentAgents.filter(a =>
    a.tokenCostPerTask < currentAgent.tokenCostPerTask &&
    a.efficiency >= currentAgent.efficiency * 0.9
  )

  if (cheaperAgents.length === 0) return null

  const bestAgent = cheaperAgents.reduce((best, agent) => {
    const costEfficiency = (agent.efficiency / agent.tokenCostPerTask)
    const bestCostEfficiency = (best.efficiency / best.tokenCostPerTask)
    return costEfficiency > bestCostEfficiency ? agent : best
  })

  const savings = currentAgent.tokenCostPerTask - bestAgent.tokenCostPerTask
  const savingsPercentage = (savings / currentAgent.tokenCostPerTask) * 100

  return {
    currentCost: currentAgent.tokenCostPerTask,
    optimizedCost: bestAgent.tokenCostPerTask,
    savings: Math.round(savings),
    savingsPercentage: Math.round(savingsPercentage),
    recommendation: `Reassign to ${bestAgent.name} to save ${Math.round(savings)} tokens (${Math.round(savingsPercentage)}% reduction) with ${Math.round(bestAgent.efficiency)}% efficiency`
  }
}

export function trackTokenSpend(currentSpend: number, budget: number): {
  status: 'healthy' | 'warning' | 'critical'
  percentage: number
  message: string
} {
  const percentage = (currentSpend / budget) * 100

  if (percentage >= 90) {
    return {
      status: 'critical',
      percentage: Math.round(percentage),
      message: `Token budget ${Math.round(percentage)}% utilized. Immediate cost reduction needed.`
    }
  }

  if (percentage >= 70) {
    return {
      status: 'warning',
      percentage: Math.round(percentage),
      message: `Token budget ${Math.round(percentage)}% utilized. Consider optimization strategies.`
    }
  }

  return {
    status: 'healthy',
    percentage: Math.round(percentage),
    message: `Token budget ${Math.round(percentage)}% utilized. On track.`
  }
}
