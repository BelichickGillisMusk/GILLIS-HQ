import { Agent } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { X, User, ChartLine } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface AgentDetailPanelProps {
  agent: Agent | null
  onClose: () => void
}

const statusColors = {
  working: 'bg-green-500',
  idle: 'bg-yellow-500',
  meeting: 'bg-blue-500'
}

const statusLabels = {
  working: 'Working',
  idle: 'Idle',
  meeting: 'In Meeting'
}

const departmentColors = {
  marketing: 'text-[#f472b6]',
  sales: 'text-[#4ade80]',
  admin: 'text-[#a78bfa]',
  tech: 'text-[#38bdf8]',
  operations: 'text-[#fb923c]'
}

export function AgentDetailPanel({ agent, onClose }: AgentDetailPanelProps) {
  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-full md:w-96 bg-card border-l border-border z-50 shadow-2xl"
        >
          <Card className="h-full rounded-none border-0 bg-card/95 backdrop-blur">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center ${departmentColors[agent.department]}`}>
                    <User size={24} weight="duotone" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">
                      {agent.type}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10">
                  <X size={20} />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {agent.department}
                </Badge>
                <Badge className={`${statusColors[agent.status]} text-white border-0`}>
                  {statusLabels[agent.status]}
                </Badge>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ChartLine size={18} className="text-primary" weight="duotone" />
                  <h3 className="font-semibold text-sm">Performance Metrics</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Productivity</span>
                      <span className="font-mono font-semibold">{agent.productivity}%</span>
                    </div>
                    <Progress value={agent.productivity} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tasks Completed</span>
                    <span className="font-mono font-semibold">{agent.tasksCompleted}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-sm mb-2">Current Task</h3>
                <p className="text-sm text-muted-foreground font-mono bg-secondary/50 p-3 rounded-md border border-border">
                  {agent.currentTask}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-sm mb-3">Recent Activities</h3>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {agent.recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="text-xs font-mono p-3 bg-secondary/30 rounded border border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        {activity}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground font-mono space-y-1">
                <div>Position: ({agent.position.x.toFixed(1)}, {agent.position.z.toFixed(1)})</div>
                <div>Agent ID: {agent.id}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
