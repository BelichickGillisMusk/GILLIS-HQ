import { Department } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartLine, Briefcase, ClipboardText, Code, Gear } from '@phosphor-icons/react'

interface DepartmentLegendProps {
  departments: Department[]
}

const iconMap = {
  marketing: ChartLine,
  sales: Briefcase,
  admin: ClipboardText,
  tech: Code,
  operations: Gear
}

const colorClasses = {
  marketing: 'bg-[#f472b6]/20 text-[#f472b6] border-[#f472b6]/40',
  sales: 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/40',
  admin: 'bg-[#a78bfa]/20 text-[#a78bfa] border-[#a78bfa]/40',
  tech: 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40',
  operations: 'bg-[#fb923c]/20 text-[#fb923c] border-[#fb923c]/40'
}

export function DepartmentLegend({ departments }: DepartmentLegendProps) {
  return (
    <Card className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur border-border shadow-xl">
      <CardContent className="p-4">
        <h3 className="text-sm font-bold mb-3 text-foreground">Departments</h3>
        <div className="space-y-2">
          {departments.map(dept => {
            const Icon = iconMap[dept.id]
            return (
              <div key={dept.id} className="flex items-center gap-3">
                <div className={`p-2 rounded border ${colorClasses[dept.id]}`}>
                  <Icon size={16} weight="duotone" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{dept.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {dept.agents.length} agents
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs font-mono ${colorClasses[dept.id]}`}
                >
                  {dept.agents.filter(a => a.status === 'working').length}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
