export type AgentStatus = 'working' | 'idle' | 'meeting'

export type DepartmentType = 'marketing' | 'sales' | 'admin' | 'tech' | 'operations'

export interface Agent {
  id: string
  name: string
  type: 'Claude' | 'VM Open Claw'
  department: DepartmentType
  status: AgentStatus
  currentTask: string
  position: { x: number; y: number; z: number }
  productivity: number
  tasksCompleted: number
  recentActivities: string[]
}

export interface Department {
  id: DepartmentType
  name: string
  color: string
  icon: string
  position: { x: number; z: number }
  size: { width: number; depth: number }
  agents: Agent[]
}
