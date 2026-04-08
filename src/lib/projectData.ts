import { Project, Task, BoardMember, DepartmentType, TaskPriority, ProjectStatus } from './types'

const PROJECT_TEMPLATES = {
  marketing: [
    'Q4 Brand Campaign Launch',
    'Social Media Engagement Initiative',
    'SEO Optimization Project',
    'Content Strategy Overhaul',
    'Customer Sentiment Analysis',
    'Email Marketing Automation'
  ],
  sales: [
    'Enterprise Client Acquisition',
    'CRM System Implementation',
    'Sales Process Optimization',
    'Lead Nurturing Campaign',
    'Product Demo Automation',
    'Sales Enablement Platform'
  ],
  admin: [
    'Office Management System Upgrade',
    'Vendor Contract Negotiations',
    'Employee Onboarding Process',
    'Document Management Initiative',
    'Budget Planning & Tracking',
    'Compliance Documentation Project'
  ],
  tech: [
    'Microservices Migration',
    'Platform Performance Optimization',
    'Security Audit & Remediation',
    'API Gateway Implementation',
    'Testing Framework Modernization',
    'DevOps Pipeline Enhancement'
  ],
  operations: [
    'Supply Chain Optimization',
    'Quality Metrics Dashboard',
    'Process Automation Initiative',
    'Resource Allocation System',
    'Vendor Integration Platform',
    'Operational Excellence Program'
  ]
}

const BOARD_MEMBERS: BoardMember[] = ['Claude', 'Gemini', 'Grok', 'ChatGPT', 'Llama']

export function generateProjectId(): string {
  return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateInitialProjects(departments: DepartmentType[]): Project[] {
  const projects: Project[] = []
  
  departments.forEach(dept => {
    const projectCount = 2 + Math.floor(Math.random() * 2)
    const templates = PROJECT_TEMPLATES[dept]
    
    for (let i = 0; i < projectCount; i++) {
      const template = templates[i % templates.length]
      const startDate = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      const budget = 10000 + Math.floor(Math.random() * 90000)
      const estimatedCost = budget * (0.7 + Math.random() * 0.25)
      
      projects.push({
        id: generateProjectId(),
        name: template,
        description: `Strategic ${dept} initiative to drive business growth and operational excellence`,
        department: dept,
        status: ['planning', 'in-progress', 'in-progress'][Math.floor(Math.random() * 3)] as ProjectStatus,
        priority: ['medium', 'high'][Math.floor(Math.random() * 2)] as TaskPriority,
        budget,
        estimatedCost,
        actualCost: estimatedCost * (0.3 + Math.random() * 0.4),
        startDate,
        dueDate: startDate + (30 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000,
        assignedAgents: [],
        tasks: [],
        boardAdvice: [],
        cooAdvice: [],
        collaborationLog: [],
        links: [],
        metrics: {
          completionRate: 20 + Math.floor(Math.random() * 50),
          budgetUtilization: 30 + Math.floor(Math.random() * 40),
          teamEfficiency: 60 + Math.floor(Math.random() * 30),
          onTimeDelivery: Math.random() > 0.5,
          qualityScore: 70 + Math.floor(Math.random() * 25)
        }
      })
    }
  })
  
  return projects
}

export function generateBoardAdvice(projectId: string, projectName: string, department: DepartmentType): string {
  const adviceTemplates = {
    Claude: [
      `For ${projectName}, consider implementing a phased rollout approach to minimize risk and gather iterative feedback.`,
      `I recommend establishing clear success metrics before proceeding with ${projectName} to ensure measurable outcomes.`,
      `The project scope could benefit from stakeholder alignment workshops to ensure all perspectives are considered.`,
      `Consider leveraging existing frameworks and best practices to accelerate ${projectName} delivery.`
    ],
    Gemini: [
      `${projectName} presents an opportunity to integrate data-driven decision making at every stage.`,
      `I suggest exploring multi-modal approaches that combine quantitative and qualitative analysis for this initiative.`,
      `The technical architecture should prioritize scalability and flexibility for future enhancements.`,
      `Consider establishing cross-functional collaboration channels to maximize knowledge sharing.`
    ],
    Grok: [
      `Let's inject some innovation into ${projectName} - don't be afraid to challenge conventional approaches.`,
      `This project could benefit from rapid prototyping and fail-fast experimentation methodologies.`,
      `Consider the disruptive potential here - what if we completely reimagined the problem space?`,
      `The competitive landscape is evolving quickly. Ensure ${projectName} positions us ahead of the curve.`
    ],
    ChatGPT: [
      `For optimal outcomes on ${projectName}, I recommend clear communication protocols and regular stakeholder updates.`,
      `Consider implementing agile methodologies to maintain flexibility and respond to changing requirements.`,
      `Documentation and knowledge transfer should be prioritized to ensure long-term sustainability.`,
      `Risk mitigation strategies should be established early, particularly around dependencies and resource constraints.`
    ],
    Llama: [
      `${projectName} aligns well with our strategic objectives. Ensure resource allocation reflects its priority.`,
      `I recommend establishing clear governance structures to maintain project momentum and accountability.`,
      `Consider the broader ecosystem impact - how does this initiative connect with our other strategic efforts?`,
      `Quality benchmarks should be established early and monitored continuously throughout execution.`
    ]
  }
  
  const categories = ['strategy', 'technical', 'financial', 'risk', 'innovation'] as const
  const randomMember = BOARD_MEMBERS[Math.floor(Math.random() * BOARD_MEMBERS.length)]
  const randomTemplate = adviceTemplates[randomMember][Math.floor(Math.random() * adviceTemplates[randomMember].length)]
  
  return randomTemplate
}

export function generateCOOAdvice(projectName: string, department: DepartmentType): {
  advice: string
  costSavings: number
  efficiencyGain: number
  category: 'process' | 'resource' | 'timeline' | 'budget' | 'quality'
} {
  const cooAdviceTemplates = [
    {
      template: `Consolidate vendor contracts for ${projectName} to leverage volume discounts and reduce administrative overhead.`,
      category: 'budget' as const,
      savingsRange: [5000, 15000],
      efficiencyRange: [5, 15]
    },
    {
      template: `Implement automation for repetitive tasks in ${projectName} to free up team capacity for high-value activities.`,
      category: 'process' as const,
      savingsRange: [8000, 20000],
      efficiencyRange: [15, 30]
    },
    {
      template: `Optimize resource allocation by cross-training team members to increase flexibility and reduce idle time.`,
      category: 'resource' as const,
      savingsRange: [3000, 10000],
      efficiencyRange: [10, 20]
    },
    {
      template: `Accelerate timeline by running parallel workstreams where dependencies allow, reducing critical path duration.`,
      category: 'timeline' as const,
      savingsRange: [10000, 25000],
      efficiencyRange: [20, 35]
    },
    {
      template: `Establish quality gates early in ${projectName} to catch issues before they become expensive to fix.`,
      category: 'quality' as const,
      savingsRange: [7000, 18000],
      efficiencyRange: [12, 25]
    },
    {
      template: `Leverage existing platforms and tools instead of building custom solutions to reduce development time and cost.`,
      category: 'budget' as const,
      savingsRange: [15000, 40000],
      efficiencyRange: [25, 40]
    }
  ]
  
  const randomAdvice = cooAdviceTemplates[Math.floor(Math.random() * cooAdviceTemplates.length)]
  
  return {
    advice: randomAdvice.template,
    costSavings: randomAdvice.savingsRange[0] + Math.floor(Math.random() * (randomAdvice.savingsRange[1] - randomAdvice.savingsRange[0])),
    efficiencyGain: randomAdvice.efficiencyRange[0] + Math.floor(Math.random() * (randomAdvice.efficiencyRange[1] - randomAdvice.efficiencyRange[0])),
    category: randomAdvice.category
  }
}
