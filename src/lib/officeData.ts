import { Agent, Department, DepartmentType } from './types'

export const DEPARTMENT_CONFIGS: Record<DepartmentType, { name: string; color: string; icon: string }> = {
  marketing: { name: 'Marketing', color: '#f472b6', icon: 'ChartLine' },
  sales: { name: 'Sales', color: '#4ade80', icon: 'Briefcase' },
  admin: { name: 'Admin', color: '#a78bfa', icon: 'ClipboardText' },
  tech: { name: 'Tech', color: '#38bdf8', icon: 'Code' },
  operations: { name: 'Operations', color: '#fb923c', icon: 'Gear' }
}

const TASKS = {
  marketing: [
    'Analyzing campaign performance metrics',
    'Creating social media content strategy',
    'Drafting email marketing campaigns',
    'Researching competitor strategies',
    'Optimizing SEO keywords',
    'Designing brand guidelines',
    'Planning product launch campaign',
    'Analyzing customer sentiment data'
  ],
  sales: [
    'Following up with leads',
    'Preparing sales presentations',
    'Updating CRM records',
    'Conducting product demos',
    'Negotiating contract terms',
    'Analyzing sales pipeline',
    'Drafting proposals',
    'Meeting with potential clients'
  ],
  admin: [
    'Processing invoices',
    'Scheduling team meetings',
    'Managing office supplies inventory',
    'Organizing company documents',
    'Coordinating travel arrangements',
    'Updating employee records',
    'Preparing quarterly reports',
    'Handling vendor communications'
  ],
  tech: [
    'Debugging production issues',
    'Reviewing pull requests',
    'Architecting new features',
    'Optimizing database queries',
    'Writing unit tests',
    'Deploying to staging environment',
    'Refactoring legacy code',
    'Conducting security audit'
  ],
  operations: [
    'Optimizing supply chain logistics',
    'Analyzing operational efficiency',
    'Coordinating with vendors',
    'Managing inventory levels',
    'Streamlining workflows',
    'Monitoring quality metrics',
    'Planning resource allocation',
    'Updating process documentation'
  ]
}

const CLAUDE_NAMES = [
  'Claude Alpha', 'Claude Beta', 'Claude Gamma', 'Claude Delta',
  'Claude Epsilon', 'Claude Zeta', 'Claude Eta', 'Claude Theta'
]

const VM_NAMES = [
  'VM Apex', 'VM Nexus', 'VM Prime', 'VM Vortex',
  'VM Echo', 'VM Nova', 'VM Pulse', 'VM Zen'
]

function getDepartmentSkills(dept: DepartmentType): string[] {
  const skillSets: Record<DepartmentType, string[]> = {
    marketing: ['Content Creation', 'SEO', 'Analytics', 'Social Media', 'Brand Strategy', 'Campaign Management'],
    sales: ['Lead Generation', 'CRM', 'Negotiation', 'Product Knowledge', 'Pipeline Management', 'Client Relations'],
    admin: ['Scheduling', 'Documentation', 'Process Management', 'Communication', 'Organization', 'Vendor Management'],
    tech: ['Programming', 'Architecture', 'DevOps', 'Testing', 'Security', 'Code Review', 'System Design'],
    operations: ['Logistics', 'Process Optimization', 'Quality Control', 'Resource Planning', 'Vendor Coordination', 'Metrics Analysis']
  }
  return skillSets[dept].slice(0, 3 + Math.floor(Math.random() * 3))
}

export function generateAgents(): Agent[] {
  const agents: Agent[] = []
  const departments: DepartmentType[] = ['marketing', 'sales', 'admin', 'tech', 'operations']
  
  let claudeIndex = 0
  let vmIndex = 0
  
  departments.forEach((dept, deptIndex) => {
    const agentsPerDept = 6 + Math.floor(Math.random() * 4)
    
    for (let i = 0; i < agentsPerDept; i++) {
      const isClaude = Math.random() > 0.5
      const name = isClaude ? CLAUDE_NAMES[claudeIndex % CLAUDE_NAMES.length] : VM_NAMES[vmIndex % VM_NAMES.length]
      
      if (isClaude) claudeIndex++
      else vmIndex++
      
      const row = Math.floor(i / 3)
      const col = i % 3
      
      const baseX = (deptIndex % 3) * 20 - 20
      const baseZ = Math.floor(deptIndex / 3) * 20 - 10
      
      const skills = getDepartmentSkills(dept)
      const capacity = 10
      const currentLoad = Math.floor(Math.random() * 8)
      const tokenCostPerTask = isClaude ? 150 + Math.random() * 100 : 80 + Math.random() * 60
      const efficiency = 70 + Math.random() * 30
      
      agents.push({
        id: `agent-${dept}-${i}`,
        name: `${name} #${i + 1}`,
        type: isClaude ? 'Claude' : 'VM Open Claw',
        department: dept,
        status: ['working', 'idle', 'meeting'][Math.floor(Math.random() * 3)] as any,
        currentTask: TASKS[dept][Math.floor(Math.random() * TASKS[dept].length)],
        position: {
          x: baseX + col * 4 - 4,
          y: 0,
          z: baseZ + row * 4
        },
        productivity: 60 + Math.floor(Math.random() * 40),
        tasksCompleted: Math.floor(Math.random() * 50),
        recentActivities: Array(5).fill(null).map(() => 
          TASKS[dept][Math.floor(Math.random() * TASKS[dept].length)]
        ),
        assignedProjects: [],
        skills,
        capacity,
        currentLoad,
        tokenCostPerTask: Math.round(tokenCostPerTask),
        efficiency: Math.round(efficiency),
        specializations: skills.slice(0, 2)
      })
    }
  })
  
  return agents
}

export function getDepartments(agents: Agent[]): Department[] {
  const departments: DepartmentType[] = ['marketing', 'sales', 'admin', 'tech', 'operations']
  
  return departments.map((dept, index) => {
    const config = DEPARTMENT_CONFIGS[dept]
    const deptAgents = agents.filter(a => a.department === dept)
    
    const baseX = (index % 3) * 20 - 20
    const baseZ = Math.floor(index / 3) * 20 - 10
    
    return {
      id: dept,
      name: config.name,
      color: config.color,
      icon: config.icon,
      position: { x: baseX, z: baseZ },
      size: { width: 16, depth: 16 },
      agents: deptAgents
    }
  })
}
