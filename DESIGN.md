# Epic Estimator - Technical Design Document

**Version:** 1.0
**Date:** October 2025
**Status:** Design Phase

---

## 1. Technology Stack

### Core Technologies
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite (fast dev server, optimized builds)
- **Styling:** Tailwind CSS (responsive, utility-first)
- **State Management:** React Context API + useReducer
- **Storage:** localStorage (Phase 1 MVP)
- **Date Handling:** date-fns (lightweight, tree-shakeable)
- **ID Generation:** crypto.randomUUID() (native browser API)

### Rationale
- **React + TypeScript:** Type safety, component reusability, strong ecosystem
- **Vite:** Lightning-fast HMR, optimized builds, modern dev experience
- **Tailwind:** Rapid UI development, responsive design patterns, minimal CSS
- **Context + useReducer:** Sufficient for Phase 1, predictable state updates, no external deps
- **localStorage:** Zero backend complexity for MVP, instant reads/writes

---

## 2. Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Header    │  │   Settings   │  │   Controls   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │     Epic     │  │   Feature    │  │    Sprint    │ │
│  │     List     │  │     List     │  │   Timeline   │ │
│  │              │  │              │  │              │ │
│  │  (Left)      │  │   (Center)   │  │   (Right)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │         Allocation Matrix (Bottom)               │   │
│  │     (Features x Sprints Grid)                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   AppContext Store   │
              │  (Global State)      │
              └──────────────────────┘
                         │
                         ▼
                 ┌──────────────┐
                 │ localStorage │
                 └──────────────┘
```

### State Flow Pattern
```
User Action → Component Event → Dispatch Action → Reducer →
New State → Context Update → Component Re-render → localStorage Sync
```

---

## 3. Data Model (TypeScript Interfaces)

### Core Types
```typescript
// T-shirt sizes map to fixed story points
type TShirtSize = 'S' | 'M' | 'L';
type Priority = 'High' | 'Medium' | 'Low';
type FeatureStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Complete';

const SIZE_TO_POINTS: Record<TShirtSize, number> = {
  S: 30,
  M: 60,
  L: 90
};

interface Epic {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

interface Feature {
  id: string;
  epicId: string;
  name: string;
  size: TShirtSize;
  points: number; // Derived from size, but stored for consistency
  priority: Priority;
  status: FeatureStatus;

  // Tracking fields
  estimatedCompletionSprint: number | null; // Calculated from allocations
  actualCompletionSprint: number | null;
  actualPoints: number | null; // null = use estimated points
  notes: string;
  blockers: string[];

  statusHistory: StatusHistoryEntry[];
  createdAt: number;
}

interface StatusHistoryEntry {
  status: FeatureStatus;
  timestamp: number;
  notes: string;
}

interface Sprint {
  id: string;
  number: number; // 1-indexed
  startDate: Date; // Always Tuesday
  endDate: Date;   // Always Monday (10 days later)
  velocity: number; // Story points capacity
}

interface Allocation {
  featureId: string;
  sprintId: string;
  points: number; // Portion of feature allocated to this sprint
}

interface ProjectConfig {
  velocity: number;        // Default: 100 points per sprint
  numSprints: number;      // Default: 10
  firstSprintStart: Date;  // Default: next Tuesday
}

interface AppState {
  config: ProjectConfig;
  epics: Epic[];
  features: Feature[];
  sprints: Sprint[];
  allocations: Allocation[];
  selectedEpicId: string | null;
}
```

### Computed Values
```typescript
// These are calculated on-the-fly, not stored
interface ComputedFeatureData {
  totalAllocated: number;
  remainingPoints: number;
  completionSprint: number | null; // Sprint where feature reaches 100%
  variance: number | null; // actualCompletionSprint - estimatedCompletionSprint
}

interface ComputedSprintData {
  totalAllocated: number;
  remainingCapacity: number;
  utilizationPercent: number;
  completingFeatures: Feature[]; // Features that finish in this sprint
  isOverallocated: boolean;
}

interface ComputedEpicData {
  totalPoints: number;
  featureCount: number;
  completionSprint: number | null; // Max of all feature completion sprints
  completedFeatureCount: number;
  progressPercent: number;
  overallVariance: number | null; // For completed epics
}
```

---

## 4. State Management

### Context Structure
```typescript
// AppContext.tsx
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;

  // Computed selectors (memoized)
  getEpicFeatures: (epicId: string) => Feature[];
  getFeatureAllocations: (featureId: string) => Allocation[];
  getSprintAllocations: (sprintId: string) => Allocation[];
  computeFeatureData: (featureId: string) => ComputedFeatureData;
  computeSprintData: (sprintId: string) => ComputedSprintData;
  computeEpicData: (epicId: string) => ComputedEpicData;
}
```

### Reducer Actions
```typescript
type Action =
  // Epic actions
  | { type: 'ADD_EPIC'; payload: { name: string } }
  | { type: 'UPDATE_EPIC'; payload: { id: string; name: string } }
  | { type: 'DELETE_EPIC'; payload: { id: string } }

  // Feature actions
  | { type: 'ADD_FEATURE'; payload: { epicId: string; name: string; size: TShirtSize; priority: Priority } }
  | { type: 'UPDATE_FEATURE'; payload: { id: string; updates: Partial<Feature> } }
  | { type: 'DELETE_FEATURE'; payload: { id: string } }
  | { type: 'REORDER_FEATURES'; payload: { epicId: string; featureIds: string[] } }

  // Allocation actions
  | { type: 'SET_ALLOCATION'; payload: { featureId: string; sprintId: string; points: number } }
  | { type: 'CLEAR_ALLOCATION'; payload: { featureId: string; sprintId: string } }
  | { type: 'CLEAR_FEATURE_ALLOCATIONS'; payload: { featureId: string } }

  // Sprint configuration
  | { type: 'UPDATE_CONFIG'; payload: Partial<ProjectConfig> }
  | { type: 'REGENERATE_SPRINTS' } // Recalculate all sprint dates

  // Tracking actions
  | { type: 'UPDATE_FEATURE_STATUS'; payload: { featureId: string; status: FeatureStatus; notes?: string } }
  | { type: 'MARK_FEATURE_COMPLETE'; payload: { featureId: string; actualSprint: number; actualPoints?: number; notes?: string } }

  // UI actions
  | { type: 'SELECT_EPIC'; payload: { epicId: string | null } }

  // Data management
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET_STATE' }
  | { type: 'IMPORT_DATA'; payload: AppState }
  | { type: 'EXPORT_DATA' };
```

### Reducer Logic (Key Rules)
1. **Allocation validation:** Never allow total allocations in a sprint to exceed velocity
2. **Completion calculation:** Feature completes in the sprint where cumulative allocated points >= feature points
3. **Sprint regeneration:** When config changes (velocity, numSprints, start date), recalculate all sprint date ranges
4. **Automatic timestamps:** Always update `updatedAt` when modifying epics/features
5. **Status history:** Append to statusHistory whenever status changes
6. **localStorage sync:** After every reducer action, persist state to localStorage

---

## 5. Component Architecture

### Component Hierarchy
```
App
├── AppProvider (Context wrapper)
├── Header
│   ├── AppTitle
│   ├── VelocityDisplay
│   └── SprintCountDisplay
├── SettingsPanel
│   ├── VelocityInput
│   ├── SprintCountInput
│   └── StartDatePicker
├── MainLayout
│   ├── LeftPanel (Epic List)
│   │   ├── EpicList
│   │   │   └── EpicCard (x N)
│   │   │       ├── EpicHeader
│   │   │       ├── EpicStats
│   │   │       └── DeleteButton
│   │   └── AddEpicForm
│   ├── CenterPanel (Feature List)
│   │   ├── FeatureList
│   │   │   └── FeatureRow (x N)
│   │   │       ├── FeatureName
│   │   │       ├── SizeBadge
│   │   │       ├── PriorityIndicator
│   │   │       ├── StatusBadge
│   │   │       ├── RemainingPoints
│   │   │       ├── CompletionSprintBadge
│   │   │       ├── VarianceBadge (if completed)
│   │   │       └── ActionsMenu
│   │   ├── AddFeatureForm
│   │   └── EmptyState (when no epic selected)
│   └── RightPanel (Sprint Timeline)
│       ├── SprintTimeline
│       │   └── SprintColumn (x N)
│       │       ├── SprintHeader (number, dates)
│       │       ├── CapacityBar
│       │       ├── UtilizationMeter
│       │       └── CompletingFeaturesList
│       └── TimelineControls
├── AllocationMatrix
│   ├── MatrixHeader (sprint columns)
│   ├── MatrixBody
│   │   └── AllocationRow (x N features)
│   │       ├── FeatureLabel
│   │       └── AllocationCell (x N sprints)
│   │           ├── AllocationInput
│   │           └── ValidationIndicator
│   └── MatrixFooter (totals per sprint)
├── TrackingPanel (toggle view)
│   ├── FeatureStatusUpdater
│   ├── VarianceReport
│   │   ├── EpicVarianceSummary
│   │   └── FeatureVarianceTable
│   └── ExportReportButton
└── Footer
    ├── SaveIndicator
    ├── ImportButton
    ├── ExportButton
    └── ResetButton
```

### Key Component Responsibilities

#### `AllocationMatrix`
- Renders grid of features (rows) x sprints (columns)
- Each cell contains an input for allocation points
- Real-time validation: highlight over-allocated sprints
- Update allocations on blur/change
- Show remaining points for each feature
- Responsive: horizontal scroll on small screens

#### `AllocationCell`
- Validates input: cannot allocate more than remaining feature points
- Validates sprint: cannot cause sprint to exceed velocity
- Shows warning if allocation would over-allocate
- Debounced input to avoid excessive re-renders

#### `SprintColumn`
- Displays sprint number, date range
- Capacity bar: visual representation of allocated/available points
- List of features completing in this sprint
- Color-coded status: green (healthy), orange (near capacity), red (over-allocated)

#### `FeatureRow`
- Shows feature details: name, size, priority, status
- Displays calculated completion sprint
- For completed features: shows variance badge (e.g., "+2 sprints" or "-1 sprint")
- Click to expand status history

#### `VarianceReport`
- Generates report comparing estimated vs. actual for completed features
- Shows epic-level summary (total variance)
- Per-feature breakdown with notes and blockers
- Export to JSON/CSV

---

## 6. Business Logic & Calculations

### Sprint Date Calculation
```typescript
function generateSprints(
  numSprints: number,
  startDate: Date
): Sprint[] {
  const sprints: Sprint[] = [];
  let currentStart = startOfNextTuesday(startDate);

  for (let i = 1; i <= numSprints; i++) {
    const endDate = addDays(currentStart, 9); // 10-day sprint
    sprints.push({
      id: crypto.randomUUID(),
      number: i,
      startDate: currentStart,
      endDate: endDate,
      velocity: 100 // from config
    });
    currentStart = addDays(endDate, 1); // Next Tuesday
  }

  return sprints;
}

function startOfNextTuesday(date: Date): Date {
  const day = getDay(date);
  const daysUntilTuesday = (2 - day + 7) % 7 || 7;
  return addDays(startOfDay(date), daysUntilTuesday);
}
```

### Completion Sprint Calculation
```typescript
function calculateCompletionSprint(
  feature: Feature,
  allocations: Allocation[],
  sprints: Sprint[]
): number | null {
  const sortedSprints = sprints.sort((a, b) => a.number - b.number);
  let cumulativePoints = 0;

  for (const sprint of sortedSprints) {
    const allocation = allocations.find(
      a => a.featureId === feature.id && a.sprintId === sprint.id
    );

    if (allocation) {
      cumulativePoints += allocation.points;
    }

    if (cumulativePoints >= feature.points) {
      return sprint.number;
    }
  }

  return null; // Feature not fully allocated
}
```

### Variance Calculation
```typescript
function calculateVariance(feature: Feature): number | null {
  if (!feature.actualCompletionSprint || !feature.estimatedCompletionSprint) {
    return null;
  }

  // Positive = late, Negative = early
  return feature.actualCompletionSprint - feature.estimatedCompletionSprint;
}
```

### Sprint Allocation Validation
```typescript
function validateAllocation(
  sprintId: string,
  newAllocation: number,
  existingAllocations: Allocation[],
  velocity: number
): { valid: boolean; message?: string } {
  const currentTotal = existingAllocations
    .filter(a => a.sprintId === sprintId)
    .reduce((sum, a) => sum + a.points, 0);

  const newTotal = currentTotal + newAllocation;

  if (newTotal > velocity) {
    return {
      valid: false,
      message: `Sprint capacity exceeded: ${newTotal}/${velocity} points`
    };
  }

  return { valid: true };
}
```

---

## 7. UI/UX Design Specifications

### Layout
- **Desktop (>1280px):** 3-column layout (Epic | Feature | Sprint)
- **Tablet (768-1280px):** 2-column layout with tabs for Sprint view
- **Mobile (<768px):** Single column, accordion-style navigation

### Color Palette
```css
/* Primary Colors */
--primary-blue: #3B82F6;
--primary-teal: #14B8A6;
--dark-blue: #1E40AF;

/* Status Colors */
--status-green: #10B981;  /* On track */
--status-orange: #F59E0B; /* At risk */
--status-red: #EF4444;    /* Over capacity */
--status-gray: #6B7280;   /* Not started */

/* T-shirt Size Colors */
--size-small: #BFDBFE;    /* Light blue */
--size-medium: #5EEAD4;   /* Teal */
--size-large: #3B82F6;    /* Blue */

/* Background Colors */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;
```

### Typography
- **Headings:** Inter, font-weight: 600
- **Body:** Inter, font-weight: 400
- **Code/Numbers:** JetBrains Mono (for story points, sprint numbers)

### Spacing
- **Base unit:** 4px (Tailwind's spacing scale)
- **Component padding:** 16px (p-4)
- **Section margins:** 24px (my-6)

### Interactive Elements
- **Buttons:** Rounded corners (rounded-lg), hover states with scale-105
- **Inputs:** Border on focus (ring-2), validation colors
- **Cards:** Shadow on hover (hover:shadow-lg), smooth transitions

### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation: Tab, Enter, Escape
- Focus indicators: 2px ring with primary color
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Screen reader announcements for allocation changes

---

## 8. File Structure

```
epic-estimator/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── LeftPanel.tsx
│   │   │   ├── CenterPanel.tsx
│   │   │   ├── RightPanel.tsx
│   │   │   └── Footer.tsx
│   │   ├── epics/
│   │   │   ├── EpicList.tsx
│   │   │   ├── EpicCard.tsx
│   │   │   ├── AddEpicForm.tsx
│   │   │   └── EpicStats.tsx
│   │   ├── features/
│   │   │   ├── FeatureList.tsx
│   │   │   ├── FeatureRow.tsx
│   │   │   ├── AddFeatureForm.tsx
│   │   │   ├── SizeBadge.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── VarianceBadge.tsx
│   │   ├── sprints/
│   │   │   ├── SprintTimeline.tsx
│   │   │   ├── SprintColumn.tsx
│   │   │   ├── CapacityBar.tsx
│   │   │   └── UtilizationMeter.tsx
│   │   ├── allocation/
│   │   │   ├── AllocationMatrix.tsx
│   │   │   ├── AllocationRow.tsx
│   │   │   ├── AllocationCell.tsx
│   │   │   └── MatrixHeader.tsx
│   │   ├── tracking/
│   │   │   ├── TrackingPanel.tsx
│   │   │   ├── FeatureStatusUpdater.tsx
│   │   │   ├── VarianceReport.tsx
│   │   │   └── StatusHistoryList.tsx
│   │   ├── settings/
│   │   │   ├── SettingsPanel.tsx
│   │   │   ├── VelocityInput.tsx
│   │   │   └── SprintCountInput.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       └── EmptyState.tsx
│   ├── context/
│   │   ├── AppContext.tsx
│   │   ├── AppProvider.tsx
│   │   └── AppReducer.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useComputedData.ts
│   │   └── useDebounce.ts
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── calculations.ts
│   │   ├── validation.ts
│   │   └── exportUtils.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── enums.ts
│   ├── constants/
│   │   └── index.ts (SIZE_TO_POINTS, DEFAULT_VELOCITY, etc.)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 9. Data Flow Examples

### Example 1: Adding a Feature
```
User fills form → Click "Add Feature"
  ↓
Component dispatches: ADD_FEATURE action
  ↓
Reducer:
  - Generates UUID
  - Creates Feature object with size → points mapping
  - Adds to state.features array
  - Updates epic.updatedAt
  ↓
Context updates
  ↓
Components re-render (FeatureList shows new feature)
  ↓
useEffect in AppProvider syncs to localStorage
```

### Example 2: Allocating Points
```
User types "30" in AllocationCell (Feature X, Sprint 3)
  ↓
Input onChange (debounced 300ms)
  ↓
Validation:
  - Check if Sprint 3 capacity allows +30 points
  - Check if Feature X has 30 remaining points
  ↓
If valid:
  Component dispatches: SET_ALLOCATION
  ↓
Reducer:
  - Updates or creates Allocation record
  - Recalculates feature.estimatedCompletionSprint
  ↓
Context updates
  ↓
AllocationCell, SprintColumn, FeatureRow re-render
  - AllocationCell shows value
  - SprintColumn updates capacity bar
  - FeatureRow shows new completion sprint
  ↓
localStorage sync
```

### Example 3: Marking Feature Complete
```
User clicks "Mark Complete" on Feature Y
  ↓
Modal opens: "Which sprint did this complete in?"
  ↓
User selects Sprint 5, enters notes
  ↓
Component dispatches: MARK_FEATURE_COMPLETE
  ↓
Reducer:
  - Sets feature.status = 'Complete'
  - Sets feature.actualCompletionSprint = 5
  - Calculates variance (5 - estimatedCompletionSprint)
  - Adds StatusHistoryEntry with timestamp
  ↓
Context updates
  ↓
FeatureRow shows:
  - Status badge: "Complete"
  - Variance badge: "+1 sprint" (if estimate was 4)
  ↓
VarianceReport updates to include this feature
  ↓
localStorage sync
```

---

## 10. Performance Optimizations

### Memoization Strategy
```typescript
// In AppContext
const computedValues = useMemo(() => ({
  epicData: memoizeComputeEpicData(state),
  featureData: memoizeComputeFeatureData(state),
  sprintData: memoizeComputeSprintData(state)
}), [state]);
```

### Component Optimization
- Use `React.memo` for expensive components (AllocationMatrix, SprintTimeline)
- Virtualize long lists (if >100 features) using react-window
- Debounce input in AllocationCell (300ms)
- Lazy load TrackingPanel (code splitting)

### localStorage Strategy
- Debounced writes (500ms after last state change)
- Compress data before storing (if >1MB)
- Versioned schema for future migrations

---

## 11. Testing Strategy

### Unit Tests
- **Utils:** Date calculations, validation logic, variance calculations
- **Reducer:** All actions produce correct state transformations
- **Hooks:** useComputedData returns correct values

### Integration Tests
- Complete user flows (add epic → add features → allocate → mark complete)
- State persistence (localStorage round-trip)
- Validation edge cases (over-allocation, negative values)

### E2E Tests (Optional for Phase 1)
- Full user journey from project setup to variance reporting
- Export/import functionality
- Responsive layout on different screen sizes

---

## 12. Phase 1 MVP Scope

### Must Have
- [x] Epic CRUD operations
- [x] Feature CRUD with t-shirt sizing
- [x] Sprint configuration (velocity, count, start date)
- [x] Manual allocation matrix with validation
- [x] Completion sprint calculation
- [x] Feature status tracking
- [x] Actual vs. estimated variance display
- [x] localStorage persistence
- [x] Export/import JSON

### Should Have
- Status history timeline
- Variance report export
- Responsive design (mobile-friendly)
- Keyboard navigation

### Nice to Have
- Drag-and-drop feature reordering
- Color-coded variance visualization
- Undo/redo functionality
- Dark mode

---

## 13. Future Enhancements (Phase 2+)

### Backend Integration
- Replace localStorage with Supabase/Firebase
- Real-time sync across users
- User authentication

### Advanced Tracking
- Automated actuals from Jira/Azure DevOps API
- Burndown charts
- Velocity trends over time

### Collaboration
- Multi-user editing with conflict resolution
- Comments on features
- @mentions and notifications

### Analytics
- Estimation accuracy dashboard
- Team performance metrics
- Historical comparison across projects

---

## 14. Open Questions & Decisions Needed

1. **Date display format:** MM/DD/YYYY or DD/MM/YYYY? (Assume US format for Phase 1)
2. **Decimal story points:** Allow 0.5 increments in allocation? (Start with integers only)
3. **Feature dependencies:** Track blockers/dependencies? (Phase 2)
4. **Export formats:** JSON only, or also CSV/Excel? (JSON for Phase 1)
5. **Historical data retention:** Keep completed epics indefinitely? (Yes, in localStorage)

---

## 15. Development Phases

### Phase 1A: Core Planning (Weeks 1-2)
- Set up Vite + React + TypeScript + Tailwind
- Implement state management (Context + Reducer)
- Build Epic and Feature CRUD
- Sprint configuration and date calculation

### Phase 1B: Allocation (Weeks 3-4)
- Build AllocationMatrix component
- Implement validation logic
- Completion sprint calculation
- Capacity visualization

### Phase 1C: Tracking (Weeks 5-6)
- Feature status management
- Actual completion recording
- Variance calculation and display
- VarianceReport component

### Phase 1D: Polish (Week 7)
- Responsive design
- Accessibility improvements
- Export/import functionality
- Testing and bug fixes

---

**Next Steps:**
1. Set up project scaffolding with Vite
2. Create base TypeScript types and constants
3. Implement AppContext and reducer
4. Build layout components (Header, Panels)
5. Start with Epic/Feature CRUD components
