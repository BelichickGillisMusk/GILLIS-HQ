import { Task, Project } from './types'

export interface DuplicationMatch {
  itemId: string
  itemType: 'task' | 'project'
  similarityScore: number
  reason: string
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  if (s1 === s2) return 100
  
  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  
  const commonWords = words1.filter(w => words2.includes(w))
  const totalWords = Math.max(words1.length, words2.length)
  
  if (totalWords === 0) return 0
  
  return (commonWords.length / totalWords) * 100
}

export function detectDuplicateTasks(
  newTask: Partial<Task>,
  existingTasks: Task[]
): DuplicationMatch[] {
  const matches: DuplicationMatch[] = []
  
  if (!newTask.title) return matches
  
  for (const task of existingTasks) {
    if (task.status === 'done') continue
    
    const titleSimilarity = calculateSimilarity(newTask.title, task.title)
    const descSimilarity = newTask.description && task.description
      ? calculateSimilarity(newTask.description, task.description)
      : 0
    
    const overallSimilarity = (titleSimilarity * 0.7) + (descSimilarity * 0.3)
    
    if (titleSimilarity > 80) {
      matches.push({
        itemId: task.id,
        itemType: 'task',
        similarityScore: Math.round(overallSimilarity),
        reason: `Title is almost identical`
      })
    } else if (overallSimilarity > 70) {
      matches.push({
        itemId: task.id,
        itemType: 'task',
        similarityScore: Math.round(overallSimilarity),
        reason: `Very similar content and description`
      })
    } else if (titleSimilarity > 60 && newTask.department === task.department) {
      matches.push({
        itemId: task.id,
        itemType: 'task',
        similarityScore: Math.round(overallSimilarity),
        reason: `Similar task in same department`
      })
    }
  }
  
  return matches.sort((a, b) => b.similarityScore - a.similarityScore)
}

export function detectDuplicateProjects(
  newProject: Partial<Project>,
  existingProjects: Project[]
): DuplicationMatch[] {
  const matches: DuplicationMatch[] = []
  
  if (!newProject.name) return matches
  
  for (const project of existingProjects) {
    if (project.status === 'completed' || project.status === 'archived') continue
    
    const nameSimilarity = calculateSimilarity(newProject.name, project.name)
    const descSimilarity = newProject.description && project.description
      ? calculateSimilarity(newProject.description, project.description)
      : 0
    
    const overallSimilarity = (nameSimilarity * 0.6) + (descSimilarity * 0.4)
    
    if (nameSimilarity > 75) {
      matches.push({
        itemId: project.id,
        itemType: 'project',
        similarityScore: Math.round(overallSimilarity),
        reason: `Project name is very similar`
      })
    } else if (overallSimilarity > 65 && newProject.department === project.department) {
      matches.push({
        itemId: project.id,
        itemType: 'project',
        similarityScore: Math.round(overallSimilarity),
        reason: `Similar project in same department`
      })
    }
  }
  
  return matches.sort((a, b) => b.similarityScore - a.similarityScore)
}

export function calculateDuplicationSavings(preventedDuplicates: number, avgTaskCost: number = 200): number {
  return preventedDuplicates * avgTaskCost
}
