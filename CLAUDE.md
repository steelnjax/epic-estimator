# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Epic Estimator is a web-based capacity planning and sprint allocation tool for software development teams. It helps teams estimate project timelines by breaking down epics into features, manually allocating work across sprints, and tracking actual vs. estimated progress.

**Current Status:** Phase 1A complete - Core planning features implemented
- See `epic-estimator.md` for the complete PRD
- See `DESIGN.md` for the technical design and architecture
- See `README.md` for getting started guide

## Core Concepts

### Dual-Mode Design
The tool operates in two modes:
1. **Planning Mode**: Initial estimation and sprint allocation
2. **Tracking Mode**: Recording actual progress against estimates for variance analysis

### Data Model
Key entities are:
- **Epic**: Top-level container for features
- **Feature**: Work item with t-shirt sizing (S=30, M=60, L=90 story points)
- **Sprint**: 10-day cycle (Tuesday-Monday) with defined velocity
- **Allocation**: Manual assignment of feature story points to specific sprints

### Sprint Rules
- Fixed 10-day sprints starting Tuesday, ending Monday
- Team velocity (story points per sprint) is constant
- Features can be split across multiple sprints
- Allocations cannot exceed sprint velocity

### Tracking Requirements
When features complete, the system must record:
- Actual completion sprint vs. estimated completion sprint
- Variance (sprints ahead/behind)
- Status history with timestamps
- Optional: actual story points if different from estimate

## Development Constraints (Phase 1 MVP)

- **No backend**: Data stored in browser localStorage only
- **Single-user**: No multi-user collaboration
- **Manual data entry**: No integration with external tools (Jira, etc.)
- **Web-responsive**: Must work on tablets/mobile, but no native app

## Key Functional Requirements

### Sprint Planning (FR-10 to FR-15)
- Set team velocity and number of sprints
- Sprint 1 start date defaults to next Tuesday
- Auto-calculate all sprint date ranges

### Manual Allocation (FR-16 to FR-21)
- Users manually allocate story points per feature per sprint
- System prevents over-allocation with visual warnings
- Real-time calculation of feature completion sprint
- Support partial allocation across sprints

### Variance Analysis (Use Case 6)
- Compare estimated vs. actual completion for each feature
- Calculate overall epic variance
- Export reports for retrospectives
- Identify patterns in estimation accuracy

## Technology Stack

**Frontend:** React 18+ with TypeScript, Vite, Tailwind CSS
**State Management:** React Context API + useReducer
**Storage:** localStorage (Phase 1 MVP)
**Date Handling:** date-fns

See `DESIGN.md` Section 1 for full stack details and rationale.

## Architecture Overview

The application uses a three-panel layout (Epic List | Feature List | Sprint Timeline) with an Allocation Matrix for manual sprint allocation. Global state is managed via React Context with a reducer pattern. All data persists to localStorage after state changes.

Key calculations:
- Sprint dates auto-generated from start date (Tuesdays only)
- Feature completion sprint calculated from cumulative allocations
- Variance = actual completion sprint - estimated completion sprint

See `DESIGN.md` Sections 2-6 for detailed architecture, component hierarchy, and business logic.

## Important PRD Sections

Read these sections from `epic-estimator.md` when implementing:
- **Section 5**: User Stories and Use Cases (especially Use Case 3 for allocation logic and Use Case 6 for variance tracking)
- **Section 6**: Functional Requirements (FR-16 to FR-21 are critical for allocation)
- **Section 9**: Data Model (Feature and Sprint objects have specific required fields)
- **Section 11**: Success Criteria (MVP checklist)

## Important Design Sections

Read these sections from `DESIGN.md` when implementing:
- **Section 3**: TypeScript interfaces for all data types
- **Section 4**: State management structure and reducer actions
- **Section 5**: Component hierarchy and responsibilities
- **Section 6**: Business logic for sprint calculation, allocation validation, variance
- **Section 8**: File structure and organization

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server (starts at http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run lint
```

## Project Structure

```
src/
├── components/          # React components organized by domain
│   ├── layout/         # Header, panels, main layout
│   ├── epics/          # Epic CRUD components
│   ├── features/       # Feature CRUD components
│   ├── sprints/        # Sprint timeline components
│   ├── allocation/     # Allocation matrix (TODO: Phase 1B)
│   ├── tracking/       # Status tracking (TODO: Phase 1C)
│   ├── settings/       # Config settings (TODO)
│   └── common/         # Shared components
├── context/            # AppContext, AppProvider, AppReducer
├── hooks/              # Custom React hooks
├── utils/              # Utility functions (date, calculations, validation)
├── types/              # TypeScript type definitions
└── constants/          # App constants (SIZE_TO_POINTS, etc.)
```

## State Management

The app uses React Context with useReducer for state management:
- **AppContext**: Provides global state and dispatch
- **AppReducer**: Handles all state mutations
- **AppProvider**: Wraps the app and handles localStorage persistence

All state changes automatically persist to localStorage via a useEffect in AppProvider.

## Key Implementation Notes

1. **Sprint Generation**: Sprints are auto-generated based on config (src/utils/dateUtils.ts:generateSprints)
2. **Completion Calculation**: Feature completion sprint calculated from cumulative allocations (src/utils/calculations.ts:calculateCompletionSprint)
3. **Validation**: Allocation validation prevents over-allocation (src/utils/validation.ts)
4. **Computed Values**: Epic/Feature/Sprint data computed on-the-fly, not stored

## What's Implemented (Phase 1A)

- Epic CRUD (create, select, delete)
- Feature CRUD (create, delete) with t-shirt sizing
- Sprint configuration and timeline display
- Sprint capacity visualization
- localStorage persistence
- Responsive 3-panel layout

## Next Steps (Phase 1B)

- Allocation Matrix component for manual sprint allocation
- Allocation validation and visual feedback
- Feature completion sprint display
- Settings panel for velocity/sprint config
