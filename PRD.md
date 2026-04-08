# Planning Guide

An intelligent AI office management system that teaches proper delegation, eliminates work duplication, and optimizes resource allocation through smart task routing, token cost tracking, and collaborative project management where AI agents work across departments with real-time coordination.

**Experience Qualities**: 
1. **Educational** - Teaches users proper delegation principles, resource optimization, and project management best practices through interactive feedback
2. **Efficient** - Actively prevents duplicate work, optimizes token costs per task type, and routes tasks to the most cost-effective agents
3. **Cohesive** - All departments work together seamlessly with shared context, coordinated efforts, and transparent communication

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This requires intelligent task routing, duplication detection, token cost tracking per agent/task type, cross-department collaboration systems, LLM integration with cost optimization, comprehensive project/task management with delegation workflows, and persistent state management.

## Essential Features

### Smart Task Delegation System
- **Functionality**: Intelligent routing of tasks to the most appropriate agent based on skills, workload, token cost efficiency, and specialization
- **Purpose**: Teach users how to delegate properly by showing optimal agent selection and preventing over/under-utilization
- **Trigger**: User creates a task or system auto-suggests delegation
- **Progression**: Task created → System analyzes requirements → Suggests best agent based on cost/skill/availability → User approves or overrides → System explains reasoning → Task assigned with cost estimate
- **Success criteria**: 90%+ accurate suggestions, clear cost comparisons shown, delegation explanations educational

### Duplication Detection & Prevention
- **Functionality**: Scans existing tasks and projects to identify similar work, merges duplicates, and prevents redundant assignments
- **Purpose**: Eliminate wasted resources by catching duplicate efforts before they happen
- **Trigger**: Automatic when creating tasks/projects or manual scan
- **Progression**: User creates task → System checks for similar tasks → Flags potential duplicates → Shows similarity score → User can merge, link, or proceed → System learns from decision
- **Success criteria**: Detects 85%+ duplicates, suggests merges intelligently, tracks duplicate prevention savings

### Token Cost Tracking & Optimization
- **Functionality**: Tracks token usage per agent type, task category, and department with cost breakdowns and optimization suggestions
- **Purpose**: Show true operational costs and teach resource optimization through data
- **Trigger**: Continuously tracks all LLM interactions
- **Progression**: Agent works → Tokens consumed → Cost calculated → Aggregated by type/department → Dashboard shows costs → System suggests cheaper alternatives for repetitive tasks → User implements optimizations
- **Success criteria**: Real-time cost tracking, clear visualizations, actionable optimization recommendations, ROI tracking

### Cross-Department Collaboration Hub
- **Functionality**: Central workspace where agents from different departments collaborate on shared projects with visible handoffs and context preservation
- **Purpose**: Show how departments should work together cohesively without information silos
- **Trigger**: Projects requiring multiple departments or manual collaboration setup
- **Progression**: Project spans departments → Collaboration hub created → Shared context visible to all → Handoffs tracked → Communication logged → Dependencies mapped → Team sees full picture
- **Success criteria**: No lost context, clear handoff visualization, all departments see relevant info

### Agent Capacity & Workload Management
- **Functionality**: Visual dashboard showing each agent's current workload, capacity, efficiency rating, and token costs
- **Purpose**: Teach load balancing and prevent agent burnout/underutilization
- **Trigger**: Always visible in agent panels and department views
- **Progression**: User views agents → Sees capacity bars and current assignments → Identifies overloaded/idle agents → System suggests rebalancing → User redistributes work → Efficiency improves
- **Success criteria**: Real-time capacity updates, clear visualization, rebalancing suggestions work

### Unified Project Dashboard (Lotion)
- **Functionality**: Comprehensive view of all projects with dependency mapping, resource allocation, cost tracking, and delegation flows
- **Purpose**: Central command center for understanding how all work interconnects and flows through the organization
- **Trigger**: Click "Lotion Dashboard" button
- **Progression**: User opens dashboard → Sees all projects with status → Views dependencies between projects → Checks resource allocation → Identifies bottlenecks → Makes adjustments → Tracks impact
- **Success criteria**: Clear project relationships, easy navigation, actionable insights, delegation paths visible

### Smart Task Routing & Assignment
- **Functionality**: AI-powered suggestions for task assignment based on agent skills, current load, cost efficiency, and past performance
- **Purpose**: Show users optimal delegation patterns and teach skill-task matching
- **Trigger**: Creating or reassigning tasks
- **Progression**: User has task → Clicks assign → System shows ranked agent recommendations with reasoning → Displays cost/efficiency tradeoffs → User selects → System explains why it's good/bad choice
- **Success criteria**: Accurate rankings, clear reasoning, learns from user preferences

### Board of Directors Strategic Advice
- **Functionality**: Request high-level strategic guidance from board members (Claude, Gemini, Grok, ChatGPT, Llama) with cost tracking
- **Purpose**: Provide strategic oversight while teaching when to seek expert input vs handle internally
- **Trigger**: User requests advice on project or strategic question
- **Progression**: User selects board member → Enters question → System estimates token cost → User confirms → Board member responds → Advice logged → Implementation tracked → Cost/value analyzed
- **Success criteria**: Quality advice, cost transparency, value tracking, usage patterns educate on ROI

### COO Operational Optimization
- **Functionality**: Cost-focused recommendations for improving efficiency, reducing token spend, and optimizing workflows
- **Purpose**: Teach operational excellence and cost management through specific, measurable improvements
- **Trigger**: Automatic suggestions or manual request
- **Progression**: System analyzes operations → Identifies inefficiencies → Generates cost-saving recommendations → Shows potential savings → User implements → System tracks actual savings → Reports ROI
- **Success criteria**: Actionable recommendations, accurate savings predictions, proven ROI tracking

### Delegation Education System
- **Functionality**: Interactive tutorials and feedback when users make delegation decisions, explaining good vs poor choices
- **Purpose**: Actively teach delegation best practices through real-time coaching
- **Trigger**: User delegates tasks or makes resource decisions
- **Progression**: User assigns task → System analyzes decision → Provides immediate feedback (good/bad/optimal) → Explains reasoning → Suggests improvements → Tracks user learning curve → Celebrates good decisions
- **Success criteria**: Helpful feedback, non-intrusive, measurably improves delegation quality over time

### Work Context Preservation
- **Functionality**: All task/project context automatically preserved and shared with relevant team members
- **Purpose**: Eliminate "what's the status?" questions and ensure everyone has the information they need
- **Trigger**: Automatic as work progresses
- **Progression**: Work happens → Context captured → Shared with relevant parties → Accessible from multiple views → Search and filter available → No information lost in transitions
- **Success criteria**: Zero context loss, fast retrieval, intuitive access, reduces redundant communication

## Edge Case Handling

- **No Agents Available**: Show hiring recommendations based on workload analysis
- **Overloaded Agent**: Alert user and suggest redistribution with specific recommendations
- **Duplicate Task Creation**: Block creation and show similar existing tasks
- **LLM API Failure**: Show error, queue request for retry, offer template-based fallback
- **Token Budget Exceeded**: Alert user, suggest cheaper alternatives, show cost breakdown
- **Circular Dependencies**: Detect and prevent, visualize dependency chain, suggest fixes
- **Unassigned High-Priority Task**: Alert user and show best agent matches
- **Skill Gap**: Identify when no agent has required skills, suggest training or hiring
- **Project Scope Creep**: Detect increasing task count/budget and alert user
- **Cross-Department Blockers**: Identify and surface inter-department dependencies blocking progress
- **Conflicting Assignments**: Prevent double-booking agents on simultaneous tasks
- **Stale Projects**: Flag projects with no activity and suggest archiving or reactivation
- **Cost Anomalies**: Alert when token costs spike unexpectedly

## Design Direction

The design should evoke a sophisticated command center for intelligent resource management - clean, data-rich, and confidence-inspiring. Think modern SaaS dashboard meets strategic war room - purposeful, efficient, and clearly showing the value of optimization.

## Color Selection

A professional, high-contrast color scheme emphasizing clarity and data visualization with strategic use of color to indicate status and priority.

- **Primary Color**: Deep Indigo (oklch(0.25 0.08 270)) - Main interface foundation, communicates intelligence and strategic thinking
- **Secondary Colors**: 
  - Success Green (oklch(0.65 0.18 145)) - Optimized tasks, cost savings, efficiency gains
  - Warning Amber (oklch(0.70 0.15 50)) - Needs attention, potential duplicates, capacity warnings
  - Critical Red (oklch(0.55 0.22 25)) - Overloaded agents, budget overruns, blockers
  - Info Blue (oklch(0.60 0.12 240)) - Educational tips, delegation feedback, suggestions
- **Accent Color**: Bright Cyan (oklch(0.75 0.15 195)) - Interactive elements, selected items, primary actions
- **Foreground/Background Pairings**:
  - Deep Indigo (oklch(0.25 0.08 270)): White text (oklch(0.98 0 0)) - Ratio 11.2:1 ✓
  - Success Green (oklch(0.65 0.18 145)): White text (oklch(0.98 0 0)) - Ratio 5.1:1 ✓
  - Warning Amber (oklch(0.70 0.15 50)): Dark text (oklch(0.20 0.05 270)) - Ratio 8.7:1 ✓
  - Critical Red (oklch(0.55 0.22 25)): White text (oklch(0.98 0 0)) - Ratio 4.6:1 ✓
  - Info Blue (oklch(0.60 0.12 240)): White text (oklch(0.98 0 0)) - Ratio 5.0:1 ✓
  - Bright Cyan (oklch(0.75 0.15 195)): Dark text (oklch(0.20 0.05 270)) - Ratio 10.5:1 ✓

## Font Selection

Clean, highly readable typefaces that emphasize clarity and professionalism while maintaining personality for data-heavy interfaces.

- **Typographic Hierarchy**: 
  - H1 (Dashboard Title): Inter Bold/32px/tight letter spacing (-0.01em)
  - H2 (Section Headers): Inter Semi-Bold/24px/normal spacing
  - H3 (Card Titles): Inter Medium/18px/normal spacing
  - Body (Content): Inter Regular/14px/relaxed line height (1.6)
  - Data (Metrics/Costs): IBM Plex Mono Medium/14px/tabular numbers
  - Small (Labels): Inter Regular/12px/slightly increased letter spacing (0.01em)

## Animations

Animations should feel responsive and purposeful - reinforcing actions and providing clear feedback without unnecessary decoration. State transitions (200ms ease), loading states with skeleton screens, success confirmations with subtle scale pulse (150ms), cost savings with satisfying counter animations (500ms), delegation feedback with gentle highlighting (300ms).

## Component Selection

- **Components**: 
  - Card for agent panels, project cards, and metric displays
  - Badge for status indicators, priority levels, and cost tiers
  - Table for task lists and resource allocations
  - Progress bars for capacity, budget utilization, and completion
  - Tabs for switching between views (Projects, Agents, Analytics)
  - Dialog for delegation decisions and confirmation modals
  - Tooltip for educational hints and detailed explanations
  - Alert for warnings about duplicates, overloads, and optimizations
  - Sheet for side panels with detailed information
  - Select for agent assignment and filtering
  - Command palette for quick actions
- **Customizations**: 
  - Agent capacity meters with color-coded zones (green/yellow/red)
  - Cost comparison cards showing token efficiency
  - Duplication similarity indicators with merge UI
  - Delegation confidence scores with reasoning tooltips
  - Interactive dependency graph visualization
- **States**: 
  - Buttons: Clear hierarchy (primary/secondary/ghost), disabled for processing, success state with checkmark
  - Agent cards: Available (green border), busy (amber pulse), overloaded (red glow)
  - Tasks: Todo (neutral), in-progress (blue accent), duplicate warning (amber), completed (green check)
  - Projects: On-track (green indicator), at-risk (amber), blocked (red)
- **Icon Selection**: 
  - Users/UsersThree for team and collaboration
  - ChartBar/TrendUp for metrics and optimization
  - Warning/WarningCircle for alerts
  - CheckCircle for completions
  - CurrencyDollar for costs
  - Brain for AI insights
  - GitBranch for dependencies
  - Copy for duplicates
  - Timer for capacity
- **Spacing**: 
  - Dashboard grid: gap-6 (24px) between major sections
  - Card padding: p-6 (24px) for content
  - List items: gap-3 (12px) between items
  - Metrics: gap-4 (16px) between stat groups
- **Mobile**: 
  - Single column layout with priority-based ordering
  - Bottom sheet for quick actions
  - Swipe gestures for agent assignment
  - Simplified metrics (show top 3)
  - Collapsible sections for detailed data
