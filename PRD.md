# Planning Guide

A virtual 3D office environment where AI agents (Claude and VM Open Claw) work across different departments, featuring interactive department zones with agent activities and real-time status updates.

**Experience Qualities**: 
1. **Immersive** - Users should feel like they're exploring a real tech company headquarters with bustling activity
2. **Dynamic** - Constant movement and status updates create a sense of living workspace with AI agents actively working
3. **Organized** - Clear visual separation between departments with intuitive navigation and color-coding

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This requires 3D rendering with Three.js, multiple interactive zones, real-time agent status management, department-specific data, and a sophisticated spatial navigation system.

## Essential Features

### 3D Office Environment
- **Functionality**: Renders an isometric or 3D top-down view of a large office space divided into 5 distinct department zones
- **Purpose**: Creates an immersive, visually engaging way to see AI agent distribution and activities
- **Trigger**: Automatically loads on app start
- **Progression**: App loads → 3D scene initializes → Camera positions to overview → Departments render with distinct colors/layouts → Agents populate their zones
- **Success criteria**: Smooth 60fps rendering, distinct visual zones, agents visible and identifiable

### Department Zones (Marketing, Sales, Admin, Tech, Operations)
- **Functionality**: Each department has unique visual styling, multiple desks/workstations, and assigned agents
- **Purpose**: Organize agents by function and create a realistic corporate structure
- **Trigger**: Rendered as part of initial scene load
- **Progression**: User views office → Departments are color-coded → Each zone shows desks and agents → User can identify department by visual cues
- **Success criteria**: 5 distinct zones, clear boundaries, thematic styling per department

### Agent Management System
- **Functionality**: Display agent avatars, names, current status (working/idle/meeting), and current task
- **Purpose**: Show what each AI agent is doing in real-time
- **Trigger**: Agents load with their department assignments
- **Progression**: Agent appears in department → Shows avatar/icon → Displays name tag → Status indicator updates → Task description visible on hover/click
- **Success criteria**: All agents visible, status updates every few seconds, smooth animations

### Interactive Camera Controls
- **Functionality**: Pan, zoom, and rotate camera to explore different office areas
- **Purpose**: Allow users to navigate and focus on specific departments or agents
- **Trigger**: Mouse drag, scroll, or on-screen controls
- **Progression**: User clicks/drags → Camera smoothly moves → Focus shifts to selected area → Department detail becomes visible
- **Success criteria**: Intuitive controls, smooth transitions, no clipping issues

### Agent Detail Panel
- **Functionality**: Click on any agent to see detailed information (full task list, productivity metrics, recent activities)
- **Purpose**: Provide deeper insights into agent operations
- **Trigger**: User clicks on an agent avatar
- **Progression**: User clicks agent → Panel slides in from side → Shows agent details → User can view tasks → Close button returns to overview
- **Success criteria**: Smooth panel animation, comprehensive agent data, easy to close

## Edge Case Handling

- **No Agents Available**: Show empty desks with "Hiring" signs in departments
- **Performance on Low-End Devices**: Fallback to 2D isometric view if WebGL performance is poor
- **Camera Out of Bounds**: Implement boundaries to keep camera within office space
- **Rapid Agent Clicks**: Debounce click handlers to prevent UI conflicts
- **Long Task Names**: Truncate with ellipsis and show full text on hover
- **Department Overcrowding**: Implement multi-row desk layouts for scalability

## Design Direction

The design should evoke a futuristic, tech-forward workspace that feels alive and productive. Think cyberpunk office meets modern startup - energetic, organized, and distinctly digital with neon accents and holographic UI elements.

## Color Selection

A vibrant, department-specific color scheme with neon accents on a dark office environment.

- **Primary Color**: Deep Space Blue (oklch(0.20 0.05 250)) - Main office floor and base structures, communicates professionalism and tech sophistication
- **Secondary Colors**: 
  - Marketing: Energetic Pink (oklch(0.65 0.20 350)) - Creative and attention-grabbing
  - Sales: Success Green (oklch(0.60 0.18 145)) - Growth and achievement oriented
  - Admin: Reliable Purple (oklch(0.55 0.15 290)) - Organized and systematic
  - Tech: Electric Cyan (oklch(0.70 0.18 200)) - Innovation and digital focus
  - Operations: Industrial Orange (oklch(0.65 0.19 50)) - Productivity and efficiency
- **Accent Color**: Neon Cyan (oklch(0.85 0.20 195)) - Holographic UI elements, active agent indicators, interactive highlights
- **Foreground/Background Pairings**:
  - Deep Space Blue (oklch(0.20 0.05 250)): White text (oklch(0.98 0 0)) - Ratio 12.3:1 ✓
  - Marketing Pink (oklch(0.65 0.20 350)): White text (oklch(0.98 0 0)) - Ratio 5.8:1 ✓
  - Sales Green (oklch(0.60 0.18 145)): White text (oklch(0.98 0 0)) - Ratio 4.9:1 ✓
  - Admin Purple (oklch(0.55 0.15 290)): White text (oklch(0.98 0 0)) - Ratio 4.5:1 ✓
  - Tech Cyan (oklch(0.70 0.18 200)): Dark text (oklch(0.15 0.02 250)) - Ratio 10.2:1 ✓
  - Operations Orange (oklch(0.65 0.19 50)): Dark text (oklch(0.15 0.02 250)) - Ratio 8.1:1 ✓

## Font Selection

Sharp, geometric typefaces that convey technical precision and futuristic corporate identity.

- **Typographic Hierarchy**: 
  - H1 (Office Title): Space Grotesk Bold/36px/tight letter spacing (-0.02em)
  - H2 (Department Names): Space Grotesk Bold/24px/normal spacing
  - H3 (Agent Names): Space Grotesk Medium/16px/normal spacing
  - Body (Status/Tasks): JetBrains Mono Regular/14px/relaxed line height (1.6)
  - Small (Metadata): JetBrains Mono Regular/12px/normal spacing

## Animations

Animations should create a sense of bustling office activity - agents moving between states, status indicators pulsing, subtle idle movements. Camera transitions should be smooth and physics-based with easing. Agent status changes should have a quick fade transition (200ms). Hovering over agents should trigger a gentle scale-up (1.05x) with a 150ms ease-out. The detail panel should slide in from the right with a 300ms cubic-bezier ease.

## Component Selection

- **Components**: 
  - Card for agent detail panel and department info cards
  - Badge for agent status indicators (Working/Idle/Meeting)
  - Tooltip for quick agent info on hover
  - Tabs for switching between floor views if expanding later
  - ScrollArea for task lists in agent detail panel
  - Button for camera controls and panel close actions
  - Separator for dividing panel sections
- **Customizations**: 
  - Custom Three.js canvas component for 3D office rendering
  - Custom agent avatar components with animated status rings
  - Custom department zone overlays with glassmorphic styling
  - Custom camera control widget with direction buttons
- **States**: 
  - Buttons: Default with subtle glow, hover with increased glow and 1.05 scale, active with pressed appearance
  - Agent avatars: Idle (subtle pulse), working (rotating ring), meeting (group indicator)
  - Department zones: Default with semi-transparent overlay, hover with increased opacity and border glow
- **Icon Selection**: 
  - Briefcase for Sales
  - ChartLine for Marketing  
  - Gear for Operations
  - Code for Tech
  - ClipboardText for Admin
  - User/UserCircle for agents
  - Eye for view controls
  - X for close actions
  - ArrowsOut for zoom controls
- **Spacing**: 
  - Office grid: 8-unit (32px) spacing between desks
  - Panel padding: p-6 (24px)
  - Card gaps: gap-4 (16px) for content sections
  - Agent spacing: gap-2 (8px) between status elements
- **Mobile**: 
  - Switch to 2D top-down view on mobile
  - Touch controls for pan/zoom (pinch to zoom, drag to pan)
  - Bottom sheet instead of side panel for agent details
  - Simplified department layout with vertical scrolling
  - Larger tap targets (min 44px) for agents
