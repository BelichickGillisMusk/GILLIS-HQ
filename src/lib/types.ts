export type AgentStatus = 'working' | 'idle' | 'meeting'

export type DepartmentType = 'marketing' | 'sales' | 'admin' | 'tech' | 'operations'

export type BoardMember = 'Claude' | 'Gemini' | 'Grok' | 'ChatGPT' | 'Llama'

export type ProjectStatus = 'planning' | 'in-progress' | 'blocked' | 'completed' | 'archived'

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

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
  assignedProjects: string[]
  skills: string[]
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

export interface Task {
  id: string
  title: string
  description: string
  projectId: string
  assignedTo: string[]
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: TaskPriority
  department: DepartmentType
  createdAt: number
  updatedAt: number
  dueDate?: number
  collaborators: string[]
  chatHistory: ChatMessage[]
  links: ResourceLink[]
}

export interface Project {
  id: string
  name: string
  description: string
  department: DepartmentType
  status: ProjectStatus
  priority: TaskPriority
  budget: number
  estimatedCost: number
  actualCost: number
  startDate: number
  dueDate?: number
  completedDate?: number
  assignedAgents: string[]
  tasks: string[]
  boardAdvice: BoardAdvice[]
  cooAdvice: COOAdvice[]
  collaborationLog: CollaborationEntry[]
  links: ResourceLink[]
  metrics: ProjectMetrics
}

export interface ChatMessage {
  id: string
  sender: string
  senderType: 'agent' | 'board' | 'coo' | 'system'
  message: string
  timestamp: number
  relatedTaskId?: string
  relatedProjectId?: string
}

export interface BoardAdvice {
  id: string
  boardMember: BoardMember
  projectId: string
  advice: string
  category: 'strategy' | 'technical' | 'financial' | 'risk' | 'innovation'
  timestamp: number
  implemented: boolean
}

export interface COOAdvice {
  id: string
  projectId: string
  advice: string
  costSavings: number
  efficiencyGain: number
  category: 'process' | 'resource' | 'timeline' | 'budget' | 'quality'
  timestamp: number
  implemented: boolean
  priority: TaskPriority
}

export interface CollaborationEntry {
  id: string
  projectId: string
  taskId?: string
  participants: string[]
  activity: string
  timestamp: number
  outcome?: string
}

export interface ResourceLink {
  id: string
  title: string
  url: string
  type: 'documentation' | 'reference' | 'tool' | 'research' | 'asset'
  addedBy: string
  timestamp: number
}

export interface ProjectMetrics {
  completionRate: number
  budgetUtilization: number
  teamEfficiency: number
  onTimeDelivery: boolean
  qualityScore: number
}
