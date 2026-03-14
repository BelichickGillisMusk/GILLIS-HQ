import { Agent } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'

interface OfficeStatsProps {
  agents: Agent[]
}

export function OfficeStats({ agents }: OfficeStatsProps) {
  const totalAgents = agents.length
  const claudeAgents = agents.filter(a => a.type === 'Claude').length
  const vmAgents = agents.filter(a => a.type === 'VM Open Claw').length
  const working = agents.filter(a => a.status === 'working').length
  const avgProductivity = Math.round(agents.reduce((sum, a) => sum + a.productivity, 0) / totalAgents)

  return (
    <Card className="absolute top-4 right-4 z-10 bg-card/90 backdrop-blur border-border shadow-xl">
      <CardContent className="p-4">
        <h3 className="text-sm font-bold mb-3 text-foreground">Office Statistics</h3>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Total Agents:</span>
            <span className="font-semibold text-primary">{totalAgents}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Claude:</span>
            <span className="font-semibold text-foreground">{claudeAgents}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">VM Open Claw:</span>
            <span className="font-semibold text-foreground">{vmAgents}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Currently Working:</span>
            <span className="font-semibold text-green-500">{working}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Avg Productivity:</span>
            <span className="font-semibold text-primary">{avgProductivity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
