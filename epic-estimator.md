# Epic Estimator - Product Requirements Document

## 1. Executive Summary

The Epic Estimator is a web-based capacity planning and sprint allocation tool designed to help software development teams estimate project completion timelines AND track actual progress against those estimates. It enables teams to break down high-level epics into features, assign complexity sizing (t-shirt sizes), prioritize work, and manually allocate features across sprints while accounting for real-world team constraints and velocity limitations. The tool supports dual modes: planning mode for initial estimation and tracking mode for monitoring actual vs. estimated progress, enabling management visibility into how the team performed relative to initial forecasts.

**Version:** 1.0  
**Last Updated:** October 2025  
**Status:** In Development

---

## 2. Problem Statement

Software development teams struggle with realistic timeline estimation and progress tracking because:

- Epic complexity is difficult to translate into concrete delivery schedules
- Automated allocation algorithms don't account for team collaboration constraints
- Teams need flexibility to adjust allocations based on actual capacity (not all team members can work on all features)
- There's no single source of truth for tracking work across feature hierarchies and sprint boundaries
- Traditional estimation lacks visibility into which sprint a feature will actually complete
- Once projects begin, there's limited visibility into how actual progress compares to initial estimates
- Management lacks real-time data to answer "Are we on track?" or "Why are we ahead/behind?"
- Retro-fitting actuals into planning tools is manual and error-prone
- Historical comparison between estimates and actuals is rarely captured for process improvement

This tool solves these problems by providing a structured workflow that respects team dynamics for initial estimation, while simultaneously capturing actual completion data to enable meaningful comparison and learning.

---

## 3. Goals and Objectives

### Primary Goals
1. **Enable realistic sprint planning** - Teams can see exactly how much capacity they have and allocate work accordingly
2. **Improve estimation accuracy** - Hierarchical structure (Epic → Feature → Sprint) creates clarity about scope
3. **Reduce planning overhead** - Streamline the process of breaking down epics and scheduling sprints
4. **Support iterative adjustments** - Teams can quickly adjust allocations to test different scenarios
5. **Track actual vs. estimated performance** - Capture which sprint features actually complete in relative to initial estimates
6. **Provide management visibility** - Enable leaders to see progress against forecasts and identify trends
7. **Enable continuous improvement** - Use historical data to improve future estimation accuracy

### Success Metrics
- Teams can estimate epic completion dates with ±1 sprint accuracy
- Planning time reduced by 50% compared to manual spreadsheet methods
- 90% of allocated work completed within the estimated sprint window
- Teams using this tool complete features 15% faster (due to better planning clarity)
- **Actual completion variance tracked within ±15% of estimate** (e.g., estimated 8 sprints vs. actual 7-9)
- **Management can identify trending patterns** in estimation accuracy (getting better/worse over time)
- **Retro-planning time eliminated** through integrated tracking

---

## 4. User Personas

### Persona 1: Engineering Manager / Scrum Master
- **Needs:** High-level visibility into timeline, capacity tracking, ability to adjust sprint count
- **Pain Points:** Manual sprint planning is time-consuming; stakeholders always want dates
- **Goals:** Quickly generate realistic project timelines; manage stakeholder expectations

### Persona 2: Product Manager / Tech Lead
- **Needs:** Feature prioritization; understand which features fit in each sprint
- **Pain Points:** Difficulty communicating constraints to stakeholders; scope creep management
- **Goals:** Have a definitive answer for "when will X ship?"

### Persona 3: Team Lead / Senior Developer
- **Needs:** Granular control over feature allocation; understanding of realistic constraints
- **Pain Points:** Frustration with over-optimistic timelines that don't account for team dynamics
- **Goals:** Create achievable schedules that the team can actually meet

---

## 5. User Stories and Use Cases

### Use Case 1: Initial Project Setup
**Actor:** Engineering Manager  
**Flow:**
1. User creates a new Epic with a name (e.g., "Authentication System Redesign")
2. User enters the team's velocity (story points per sprint)
3. User sets the number of anticipated sprints
4. User specifies the start date for Sprint 1 (defaults to next Tuesday)
5. System calculates sprint date ranges (10-day sprints, Tuesday start to Monday end)

**Acceptance Criteria:**
- Epic is created and ready for features
- Sprint dates are accurately calculated
- Velocity is stored and used for capacity planning

### Use Case 2: Feature Definition and Prioritization
**Actor:** Product Manager  
**Flow:**
1. User adds features to the epic
2. For each feature, user assigns:
   - Feature name
   - T-shirt size (S=30, M=60, L=90 story points)
   - Priority (High, Medium, Low)
3. User can reorder features by priority
4. System displays total epic scope

**Acceptance Criteria:**
- Features are added and displayed under the correct epic
- Story points are automatically calculated from t-shirt size
- Features can be reordered or deleted
- Total epic story points are visible

### Use Case 3: Manual Sprint Allocation
**Actor:** Tech Lead  
**Flow:**
1. User views the sprint timeline with available capacity (velocity)
2. For each feature, user manually allocates story points across sprints
3. User can allocate partial story points to a feature across multiple sprints
4. System prevents over-allocation (total allocated ≤ velocity per sprint)
5. System calculates which sprint each feature completes in
6. User can adjust allocations as constraints become clear

**Acceptance Criteria:**
- User can see available capacity per sprint
- Allocation prevents exceeding sprint velocity
- System calculates completion sprint for each feature
- User receives visual feedback on over-allocation
- Changes update completion estimates in real-time

### Use Case 4: Timeline Visualization
**Actor:** Engineering Manager (presenting to stakeholders)  
**Flow:**
1. User views epic overview showing all features and their completion sprints
2. System displays sprint timeline with:
   - Sprint number
   - Start date (Tuesday)
   - End date (Monday)
   - Features completing in that sprint
   - Cumulative completion percentage
3. User exports or shares the timeline with stakeholders

**Acceptance Criteria:**
- All sprints and dates are clearly visible
- Features grouped by completion sprint
- Completion percentage shown
- Timeline is easy to understand for non-technical stakeholders

### Use Case 5: Tracking Actual Progress
**Actor:** Scrum Master / Team Lead  
**Flow:**
1. User marks features as completed when work is actually done
2. For each completed feature, system records:
   - Actual sprint completion date
   - Actual story points (if different from estimate)
   - Notes or blockers
3. System compares actual completion sprint to estimated completion sprint
4. User can update feature status (In Progress, Blocked, Complete)
5. System tracks when features were actually completed vs. the forecast

**Acceptance Criteria:**
- Features can be marked complete with an actual completion sprint
- Actual vs. estimated sprint is clearly visible
- Variance (sprints ahead/behind) is calculated
- Historical completion data is preserved
- Status changes are timestamped

### Use Case 6: Variance Analysis and Reporting
**Actor:** Engineering Manager (retrospective analysis)  
**Flow:**
1. User views completed epic with actual vs. estimated timelines
2. System displays:
   - Each feature's estimated completion sprint vs. actual
   - Overall epic variance (e.g., "Completed 2 sprints ahead of estimate")
   - Per-feature variance breakdown
   - Total story points completed vs. story points in scope
   - Sprint-by-sprint comparison (planned vs. actual velocity)
3. User identifies patterns (what types of features tend to be over/under-estimated)
4. User can export variance report for team retrospectives

**Acceptance Criteria:**
- Variance clearly shown for each feature and epic
- Positive/negative variance highlighted appropriately
- Data presented in both table and visual formats
- Historical data from multiple projects visible for comparison
- Reports are exportable for sharing

---

## 6. Functional Requirements

### 6.1 Epic Management
- **FR-1:** Create, edit, and delete epics
- **FR-2:** Display epic name, total story points, and feature count
- **FR-3:** Expand/collapse epic details for better UI navigation
- **FR-4:** Show epic completion sprint based on latest feature completion

### 6.2 Feature Management
- **FR-5:** Add features to epics with name, t-shirt size, and priority
- **FR-6:** Delete features from epics
- **FR-7:** T-shirt size mapping: S=30, M=60, L=90 story points
- **FR-8:** Reorder features by priority
- **FR-9:** Display remaining story points for each feature as work is allocated

### 6.3 Sprint Planning
- **FR-10:** Set team velocity (story points per sprint)
- **FR-11:** Set the number of sprints
- **FR-12:** Specify Sprint 1 start date (Tuesday)
- **FR-13:** Auto-calculate sprint date ranges (10-day sprints, Tuesday-Monday)
- **FR-14:** Display sprint number, start date, end date
- **FR-15:** Show available capacity per sprint

### 6.4 Sprint Allocation
- **FR-16:** Allow users to manually enter story point allocation for each feature per sprint
- **FR-17:** Prevent total allocations in a sprint from exceeding velocity
- **FR-18:** Highlight over-allocation with visual warning
- **FR-19:** Update remaining points for features as allocations change
- **FR-20:** Calculate which sprint a feature completes in based on allocations
- **FR-21:** Support allocating partial work across multiple sprints

### 6.5 Visualization
- **FR-22:** Show timeline view with sprints and their corresponding features
- **FR-23:** Display completion percentage for each sprint
- **FR-24:** Show estimated variance vs. velocity (actual vs. planned)
- **FR-25:** Use color coding to indicate sprint health (green=on track, orange=at risk, red=over capacity)
- **FR-26:** Display epic completion sprint prominently

### 6.6 Data Persistence
- **FR-27:** Save all data to browser local storage (initial phase)
- **FR-28:** Support importing/exporting project data as JSON
- **FR-29:** Clear data with confirmation dialog

---

## 7. Non-Functional Requirements

### 7.1 Performance
- **NFR-1:** Application loads in under 2 seconds
- **NFR-2:** Real-time updates to calculations when allocations change
- **NFR-3:** Handle up to 10 epics with 50+ features without performance degradation

### 7.2 Usability
- **NFR-4:** Mobile-responsive design for viewing on tablets and phones
- **NFR-5:** Keyboard navigation support
- **NFR-6:** Clear error messages for invalid inputs
- **NFR-7:** Intuitive UI requiring minimal onboarding

### 7.3 Reliability
- **NFR-8:** Data loss prevention through regular local storage saving
- **NFR-9:** Clear indication when data has been modified but not saved

### 7.4 Accessibility
- **NFR-10:** WCAG 2.1 AA compliance for color contrast and readability
- **NFR-11:** Proper semantic HTML for screen reader support
- **NFR-12:** Focus indicators for keyboard navigation

---

## 8. User Interface Requirements

### 8.1 Layout Structure
- **Header:** Application title, velocity indicator, sprint count
- **Left Panel:** Epic list with expand/collapse, add epic button
- **Center Panel:** Feature list for selected epic, add feature form
- **Right Panel:** Sprint timeline and allocation matrix
- **Footer:** Save/reset controls

### 8.2 Visual Components

**Epic Card:**
- Epic name (editable)
- Total story points
- Feature count
- Delete button
- Expand/collapse toggle

**Feature Row:**
- Feature name
- T-shirt size badge with story point value
- Priority indicator
- Remaining story points
- Delete button

**Sprint Column:**
- Sprint number
- Date range (Tue, MM/DD - Mon, MM/DD)
- Available capacity indicator
- Allocated work visualization
- Completion percentage bar

**Allocation Input:**
- Numeric input field per feature/sprint intersection
- Validation error on over-allocation
- Real-time recalculation

### 8.3 Color Scheme
- **Primary colors:** Blue and teal for interactive elements
- **Status colors:** Green (on-track), Orange (at-risk), Red (over-capacity)
- **T-shirt sizes:** 
  - Small: Light blue
  - Medium: Teal
  - Large: Dark blue

---

## 9. Data Model

### Epic Object
```
{
  id: string (UUID),
  name: string,
  features: Feature[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Feature Object
```
{
  id: string (UUID),
  epicId: string,
  name: string,
  size: "S" | "M" | "L",
  points: number (30, 60, or 90),
  priority: "High" | "Medium" | "Low",
  estimatedCompletionSprint: number,
  status: "Not Started" | "In Progress" | "Blocked" | "Complete",
  actualCompletionSprint: number (null if not complete),
  actualPoints: number (null if not tracked, defaults to points),
  blockers: string[],
  notes: string,
  statusHistory: [
    {
      status: string,
      timestamp: timestamp,
      notes: string
    }
  ],
  createdAt: timestamp
}
```

### Sprint Object
```
{
  id: string,
  number: number,
  startDate: date,
  endDate: date,
  velocity: number,
  allocations: {
    [featureId]: number (story points allocated)
  }
}
```

### Project State
```
{
  epics: Epic[],
  sprints: Sprint[],
  velocity: number,
  firstSprintStart: date,
  numSprints: number
}
```

---

## 10. Out of Scope (Phase 1)

- Multi-user collaboration and permissions (read: who can edit what)
- Real-time sync across team members
- Advanced historical velocity tracking with trend lines
- Burndown charts or velocity charts
- Team member capacity constraints or individual assignment
- Dependency management between features
- Integration with Jira, Azure DevOps, or other tools
- Mobile app (web-responsive only)
- Backend data persistence (local storage only in Phase 1)
- Machine learning-based estimation recommendations
- Automated actuals capture from external systems

---

## 11. Success Criteria

### MVP Completion (Planning Phase)
- [x] Create and manage epics
- [x] Add and prioritize features
- [x] Set velocity and sprint count
- [x] Calculate sprint dates
- [x] Manually allocate features to sprints
- [x] Display timeline with completion estimates
- [x] Prevent over-allocation
- [x] Show sprint capacity and utilization

### Tracking Phase Completion
- [ ] Mark features as completed with actual sprint
- [ ] Display estimated vs. actual completion side-by-side
- [ ] Calculate variance (sprints ahead/behind) for each feature
- [ ] Show feature status (Not Started, In Progress, Blocked, Complete)
- [ ] Track status change history with timestamps
- [ ] Generate variance analysis reports
- [ ] Compare actual vs. planned velocity per sprint
- [ ] Identify estimation patterns (which types are over/under-estimated)
- [ ] Export variance reports for retrospectives
- [ ] Support multi-project historical comparison

### Phase 2 Enhancements
- [ ] Backend integration (Supabase or Firebase)
- [ ] Multi-user support with sharing and permissions
- [ ] Import from Jira/Azure DevOps
- [ ] Automated actuals capture from tool integrations
- [ ] Team member assignment and individual capacity tracking
- [ ] Machine learning-based estimation improvement
- [ ] Advanced analytics and trend visualization

---

## 12. Assumptions and Constraints

### Assumptions
- Teams follow consistent 10-day sprint cycles
- Sprints always start on Tuesday and end on Monday
- Team velocity remains relatively constant across sprints (within ±20%)
- Features can be split across multiple sprints
- Story points are the primary unit of capacity
- T-shirt sizes are fixed (S=30, M=60, L=90)
- **Actuals are recorded manually by the team (Scrum Master or team lead)**
- **Actual completion sprint is the sprint in which the feature was completed**
- **Historical data from past epics is valuable for improving future estimation**

### Constraints
- No server-side persistence in MVP (browser storage only)
- Data limited to browser local storage capacity (~5-10MB per domain)
- No offline sync capability
- Single-user experience in MVP (no multi-user collaboration)
- Browser must support ES6 and modern JavaScript
- **Manual data entry required for actuals (no automated capture in Phase 1)**
- **Team discipline required to consistently update feature status**

---

## 13. Future Considerations

### Phase 2 Features
1. **Backend Integration:** Move to Supabase for multi-user support and data persistence
2. **Automated Actuals:** Capture completion data from Jira, Azure DevOps, or GitHub
3. **Team Management:** Track individual team member capacity and assign work
4. **Advanced Analytics:** Velocity trends, burndown charts, forecast accuracy over time
5. **Integration APIs:** Two-way sync with external project management tools
6. **Estimation AI:** Machine learning recommendations based on historical data

### Phase 3 - Advanced Tracking
1. **Predictive Variance Detection:** Flag epics likely to miss estimates early
2. **Risk Buffer Optimization:** Recommend sprint buffers based on historical variance
3. **Team Specialization:** Track which team members/areas have better estimation accuracy
4. **Scenario Planning:** What-if analysis for different allocation strategies
5. **Continuous Learning:** Feedback loop where team estimates improve over time
6. **Portfolio View:** Compare multiple projects and identify systemic estimation issues

### Long-term Vision
- **Estimation Accuracy Dashboard:** Enterprise-wide visibility into estimation quality across teams
- **Historical Benchmark Database:** Compare your team's variance against industry standards
- **Predictive AI Models:** Based on feature type, team composition, and historical patterns
- **Organizational Learning:** Cross-team insights to improve company-wide estimation
- **Capacity Optimization:** Recommendations for team structure based on historical performance data

---

## 14. Approval and Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | | | |
| Engineering Lead | | | |
| Stakeholder | | | |

---

## 15. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 2025 | | Initial PRD creation |