# Epic Estimator

A web-based capacity planning and sprint allocation tool for software development teams. Estimate project timelines by breaking down epics into features, manually allocating work across sprints, and tracking actual vs. estimated progress.

## Features

### Phase 1A (Current)
- Create and manage epics
- Add features with t-shirt sizing (S=30, M=60, L=90 points)
- Auto-generated sprint timeline (10-day sprints, Tuesday-Monday)
- Sprint capacity visualization
- localStorage persistence
- Responsive 3-panel layout

### Coming Soon (Phase 1B)
- Manual sprint allocation matrix
- Real-time allocation validation
- Feature completion sprint calculation
- Settings panel for velocity configuration

### Planned (Phase 1C)
- Feature status tracking (Not Started, In Progress, Blocked, Complete)
- Actual vs. estimated completion tracking
- Variance analysis and reporting

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Create an Epic**: Click "Add" in the Epics panel to create your first epic
2. **Select Epic**: Click an epic card to select it
3. **Add Features**: With an epic selected, add features using the form in the Features panel
4. **View Timeline**: The Sprint Timeline panel shows your sprint capacity and utilization

## Technology Stack

- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for styling
- **date-fns** for date calculations
- **localStorage** for data persistence (Phase 1 MVP)

## Project Structure

```
src/
├── components/      # React components by domain
├── context/        # Global state management
├── utils/          # Utility functions
├── types/          # TypeScript definitions
└── constants/      # App constants
```

## Documentation

- **CLAUDE.md** - Developer guide for working with this codebase
- **DESIGN.md** - Complete technical design and architecture
- **epic-estimator.md** - Product Requirements Document (PRD)

## License

ISC

## Contributing

This is a personal project, but suggestions and feedback are welcome!
