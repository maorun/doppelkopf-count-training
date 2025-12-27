# Copilot Instructions

**Always reference these instructions first and fallback to search or bash comma
nds only when you encounter unexpected information that does not match the info
here.**

## Documentation Requirements

**When implementing new or changed features, always update the README.md to refl
ect these changes.** Document new functionality clearly in the appropriate secti
ons without using "Neu" or similar markers - integrate them naturally into the e
xisting documentation structure.

## Working Effectively

### Setup and Build Process

**⚠️ CRITICAL: Always run `npm install` first!**

Before running any other commands (linting, testing, building, or starting the d
ev server), you **MUST** install dependencies first. Running commands without in
stalling dependencies will result in errors.

**Correct command sequence:**

```bash
# 1. FIRST: Install dependencies (always required in a fresh clone)
npm install

# 2. THEN: Run other commands as needed
npm run lint
npm run test
npm run build
npm run dev
```

**❌ INCORRECT - Will fail with errors:**

```bash
npm run lint    # ERROR: Dependencies not installed
npm run test    # ERROR: Dependencies not installed
```

#### Installation Details

- **Install dependencies**: `npm install` -- takes 1-2 minutes. NEVER CANCEL. Se
t timeout to 10+ minutes.
  - Expect peer dependency warnings about React version mismatches - these are n
ormal due to React 19 upgrade
  - Will show 7 moderate severity vulnerabilities - this is expected and doesn't
 block development
  - Uses standard npm package resolution
  - **This command MUST be run first** before any other npm commands

#### Other Commands (require npm install first)

- **Build the application**: `npm run build` -- takes 3-5 seconds. NEVER CANCEL.
 Set timeout to 2+ minutes.
  - Will show Vite build output - expected behavior
  - Uses Vite for fast bundling and optimization
  - **Requires**: `npm install` must be run first
- **Type checking**: `npm run typecheck` -- takes 10-15 seconds. NEVER CANCEL. S
et timeout to 2+ minutes.
  - Expect no TypeScript errors - application functions correctly
  - Main application code is well-typed
  - **Requires**: `npm install` must be run first
- **Linting**: `npm run lint` -- lints code and checks markdown files
  - Automatically runs `npm run typecheck` first (prelint hook)
  - Should pass with max 319 warnings
  - **Requires**: `npm install` must be run first
- **Development server**: `npm run dev` -- starts in 5-6 seconds. NEVER CANCEL.
Set timeout to 2+ minutes.
  - Runs on <http://localhost:5173> (Vite default port)
  - Hot module reloading works correctly
  - Will show Vite development server output
  - **Requires**: `npm install` must be run first
- **Testing**: `npm run test` -- runs 578 tests across 77 files in ~32 seconds
  - Automatically runs `npm run lint` first (pretest hook), which runs `npm run
typecheck`
  - All tests should pass
  - Uses Vitest for testing
  - Comprehensive test coverage including integration, component, and utility te
sts
  - **Requires**: `npm install` must be run first

#### Command Dependencies

Understanding the automatic command chains:

- `npm run test` → automatically runs `npm run lint` (pretest hook) → automatica
lly runs `npm run typecheck` (prelint hook)
- `npm run lint` → automatically runs `npm run typecheck` (prelint hook)

This means running `npm run test` will execute typecheck, lint, and then test -
all of which require `npm install` to have been run first.

### Known Issues and Workarounds

- **ESLint Configuration**: Uses modern ESLint with flat config (eslint.config.j
s)
  - Basic configuration supports JavaScript and TypeScript files
  - Linting works correctly with max 0 warnings enforced
- **React 19 Compatibility**: Updated to React 19
  - All functionality works correctly
  - Uses standard npm package resolution
- **TypeScript**: Well-typed application with no errors
- **UI Framework**: **shadcn/ui components** - Migration from RSuite to shadcn/u
i is **COMPLETE**
  - All user-facing components use modern shadcn/ui components
  - New components should use shadcn/ui components from `src/components/ui/`
  - No legacy RSuite components remain in the codebase

## Validation and Testing

### Manual Validation Requirements

After making changes, ALWAYS test the complete user workflow:

1. **Start the application**: `npm run dev`
2. **Navigate to <http://localhost:5173>** and verify the page loads

### Essential Commands for Development

**⚠️ PREREQUISITE: Always run `npm install` first in a fresh clone or after pull
ing changes that modify package.json**

- `npm install` - **MUST BE RUN FIRST** - Install all dependencies (1-2 minutes)
- `npm run dev` - Start development server (never cancel, wait for startup)
- `npm run build` - Build for production (6-7 seconds, never cancel)
- `npm run typecheck` - Run TypeScript checks (expect errors, but useful for new
 code)
- `npm run lint` - Run linting (automatically runs typecheck first via prelint h
ook)
- `npm run test` - Run all tests (automatically runs lint and typecheck first vi
a hooks)

## Development Patterns

### State Management

- Uses React hooks (useState, useEffect, useCallback) for local state
- Client-side calculations with immediate updates
- No external state management library

### HTML ID Management - CRITICAL REQUIREMENT

**NEVER create duplicate HTML IDs** - this violates HTML standards and causes ac
cessibility issues.

#### Mandatory Guidelines

- **Use unique ID utility functions** from `src/utils/unique-id.ts` for all form
 elements
- **Always import and use**: `generateFormId()`, `generateInstanceId()`, or `gen
erateUniqueId()`
- **Use `useMemo`** to ensure stable IDs within component lifecycle
- **Apply context-specific prefixes** to distinguish between component instances

#### Required Implementation Pattern

```typescript
import { generateFormId } from '../utils/unique-id'

export function MyComponent() {
  // Generate unique IDs for each form field
  const enabledSwitchId = useMemo(() => generateFormId('component-name', 'enable
d'), [])
  const monthlyAmountId = useMemo(() => generateFormId('component-name', 'monthl
y-amount'), [])

  return (
    <>
      <Switch id={enabledSwitchId} />
      <Label htmlFor={enabledSwitchId}>Enable</Label>

      <Input id={monthlyAmountId} />
      <Label htmlFor={monthlyAmountId}>Monthly Amount</Label>
    </>
  )
}
```

#### For Multi-Instance Components

```typescript
// When component may be rendered multiple times
const uniqueId = useMemo(() => generateFormId('component', 'field', instanceCont
ext), [instanceContext])
```

#### Validation Requirements

- **Test for duplicates**: Run `find . -name "*.tsx" | xargs grep -h "id=" | gre
p -o 'id="[^"]*"' | sort | uniq -c | sort -nr | grep -E "^\s*[2-9]"`
- **All tests must pass** after implementing unique IDs
- **Manual testing required** to ensure accessibility is maintained

## Common Development Tasks

### Adding New Features

1. **Ensure dependencies are installed** with `npm install` (if in a fresh clone
)
2. **Always run `npm run dev` first** to ensure baseline functionality
3. **Run tests with `npm run test`** to verify existing functionality
4. **Update both calculation logic** (helpers/ or src/utils/) and UI components
5. **Validate with complete user scenarios** - don't just test isolated changes

### Debugging Issues

1. **Check browser console** for runtime errors (ignore Vercel Analytics warning
s)
2. **Run tests** to verify calculation logic
3. **Test with different input values** to isolate calculation vs UI issues
4. **Use TypeScript errors** - most should be resolved in main application code

### Performance Considerations

- Calculations run client-side for immediate responsiveness
- Real-time updates on every input change - calculations are fast
- Large year ranges render efficiently

## Deployment Information

- **Production URL**: <https://zinszins-simulation.vercel.app/>
- **Platform**: Vercel (configured for Vite/React deployment)
- **Build**: Uses Vite build process (`npm run build`)
- **Analytics**: Vercel Analytics integrated (causes expected console warnings)

## Development Workflow with Code Review

### IMPORTANT: Use Context7 for Development Documentation

When developing new features or making changes to this codebase, always use **Co
ntext7** to access up-to-date documentation and examples:

### Context7 Integration

- **Library Documentation**: Use Context7 to get current documentation for any l
ibraries or frameworks
- **Best Practices**: Context7 provides current best practices and patterns for
React 19, TypeScript, and shadcn/ui
- **Code Examples**: Get real-world examples and implementation patterns through
 Context7
- **Problem Solving**: Use Context7 to research solutions for complex technical
challenges
- **API References**: Access the latest API documentation for dependencies and f
rameworks

**Always consult Context7 first** for documentation and examples before implemen
ting new features or making architectural changes.

When making changes to this codebase, follow this complete workflow to ensure hi
gh-quality, reliable code:

**IMPORTANT: The following instructions about testing are not optional. They are
 the most critical part of the workflow.**

## Step-by-Step Development Approach (Teilschritt commits)

This project follows a **step-by-step commit approach** where development work i
s broken into discrete, focused steps that are individually implemented, tested,
 and committed. This approach ensures:

- **Better code quality** through focused changes
- **Easier code review** with smaller, understandable commits
- **Progressive validation** where each step is verified before proceeding
- **Clear progress tracking** through detailed checklists
- **Reduced risk** of introducing bugs through smaller change sets

### Using the report_progress Tool

The `report_progress` tool is central to the step-by-step approach and should be
 used:

#### Initial Planning

- **Start with `report_progress`** to outline your complete plan as a detailed c
hecklist
- **Break down the work** into 3-8 discrete steps that can be implemented indepe
ndently
- **Use markdown checklists** with `- [ ]` for pending items and `- [x]` for com
pleted items
- **Include "Fixes #XXX."** as the last line of the PR description

#### After Each Step

- **Use `report_progress`** immediately after completing and validating each ste
p
- **Update the checklist** to mark the current step as completed (`- [x]`)
- **Provide a clear commit message** describing what was accomplished
- **Review the committed files** to ensure only relevant changes are included
- **Never skip this step** - every meaningful unit of work must be committed ind
ividually

#### Progress Tracking Guidelines

- **Maintain consistent checklist structure** between updates while being accura
te
- **Update step descriptions** if the implementation differs from the original p
lan
- **Add new steps** if additional work is discovered during implementation
- **Keep stakeholders informed** with regular progress updates
- **Document any changes** in approach or scope in the progress updates

#### Example Progress Flow

```markdown
Initial Plan:
- [ ] Step 1: Analyze current implementation and identify changes needed
- [ ] Step 2: Add new utility function with comprehensive tests
- [ ] Step 3: Update component to use new utility function
- [ ] Step 4: Update documentation and validate complete workflow

After Step 1:
- [x] Step 1: Analyze current implementation and identify changes needed
- [ ] Step 2: Add new utility function with comprehensive tests
- [ ] Step 3: Update component to use new utility function
- [ ] Step 4: Update documentation and validate complete workflow

After Step 2:
- [x] Step 1: Analyze current implementation and identify changes needed
- [x] Step 2: Add new utility function with comprehensive tests
- [ ] Step 3: Update component to use new utility function
- [ ] Step 4: Update documentation and validate complete workflow
```

### Component Refactoring Best Practices

When components become too large (> 500-800 lines), follow this refactoring appr
oach:

#### 1. Extract Display Components

- **Extract simulation/results display** into separate components (e.g., `Entnah
meSimulationDisplay.tsx`)
- **Keep display logic together**: Move related UI rendering, formatting, and pr
esentation logic together
- **Maintain component interfaces**: Ensure props are well-typed and focused on
what the component needs
- **Example pattern**: `ComponentNameDisplay.tsx` for rendering logic, `Componen
tNameConfig.tsx` for configuration forms

#### 2. Extract Business Logic into Custom Hooks

- **Configuration management**: Extract state and config management into `useCom
ponentConfig` hooks
- **Calculation logic**: Extract complex calculations into `useComponentCalculat
ions` hooks
- **Modal/UI state**: Extract modal and interaction state into `useComponentModa
ls` hooks
- **Keep simple useState**: Don't extract trivial state management - focus on co
mplex logic

#### 3. Extract Utility Functions

- **Pure functions**: Extract formatting, validation, and transformation functio
ns
- **Currency formatting**: Use shared `formatCurrency` utility from `src/utils/c
urrency.ts`
- **Helper functions**: Extract helper functions that don't need React context
- **UI Components**: Prefer shadcn/ui components from `src/components/ui/` for n
ew extractions

#### 4. Maintain Test Coverage - MANDATORY

- **Test extracted components**: Each new component needs comprehensive tests
- **Test custom hooks**: Use `renderHook` to test custom hooks in isolation
- **Test utility functions**: Unit test pure functions thoroughly
- **Integration tests**: Ensure the refactored components work together correctl
y
- **UI Migration Testing**: Test both shadcn/ui components and legacy RSuite com
patibility
- **Fix test failures**: When components are extracted, existing tests may fail
due to multiple DOM elements with same text. Use `getAllByText()` instead of `ge
tByText()` when content appears in multiple places

#### 5. Refactoring Process - Testing & Linting at Every Step

1. **Identify extraction boundaries**: Look for distinct UI sections or logical
groupings
2. **Extract in small steps**: Start with one component or hook at a time
3. **Test immediately after each extraction**:
   - Run `npm run test` after each component extraction
   - Fix any test failures immediately before proceeding
   - Tests may fail due to duplicate content across components - update tests to
 handle this
4. **Lint immediately after each extraction**:
   - Run `npm run lint` to ensure code style compliance
   - Fix any linting issues before proceeding
5. **Build verification**: Run `npm run build` to ensure TypeScript compilation
works
6. **Update imports gradually**: Fix import paths and dependencies systematicall
y
7. **Final validation**: Run full test suite and linting before considering refa
ctoring complete

**CRITICAL: Never proceed to the next extraction if tests are failing or linting
 issues exist. Each step must be validated before moving forward.**

#### Example Refactoring (EntnahmeSimulationsAusgabe)

```typescript
// Before: 2463 lines in one file
export function EntnahmeSimulationsAusgabe() {
  // All logic mixed together
}

// After: Separated into focused pieces
export function EntnahmeSimulationsAusgabe() {
  // Use custom hooks for logic
  const { currentConfig, updateConfig } = useWithdrawalConfig();
  const { withdrawalData } = useWithdrawalCalculations();
  const { handleModalClick } = useWithdrawalModals();

  return (
    <>
      {/* Configuration forms */}
      <Panel>...</Panel>

      {/* Extracted display component */}
      <EntnahmeSimulationDisplay
        withdrawalData={withdrawalData}
        onCalculationInfoClick={handleModalClick}
      />
    </>
  );
}
```

This approach resulted in:

- Main component: 2463 → 1131 lines (54% reduction)
- Better separation of concerns
- Easier testing and maintenance
- Reusable components and logic

#### Common Testing Issues During Refactoring

**Multiple Element Error**: When components are extracted and display the same c
ontent in multiple places (e.g., base strategy summary + comparison table), test
s using `getByText()` will fail:

```typescript
// ❌ This will fail if "5%" appears multiple times
expect(screen.getByText('5%')).toBeInTheDocument();

// ✅ Fix by using getAllByText() instead
expect(screen.getAllByText('5%')).toHaveLength(2);

// ✅ Or use more specific queries
expect(screen.getByText(/📊 Basis-Strategie.*5%/)).toBeInTheDocument();
```

**Common patterns that need `getAllByText()`**:

- Currency amounts (e.g., "498.000,00 €") appearing in cards + tables
- Percentages (e.g., "5%") in summaries + tables
- Duration text (e.g., "25 Jahre", "unbegrenzt") in multiple sections
- Strategy names appearing in headers + table rows

**Always run tests after each component extraction** and fix these issues immedi
ately before proceeding to the next extraction.

### Development Workflow Steps

The development workflow follows a **step-by-step commit approach (Teilschritt c
ommits)** where each discrete development step is implemented, validated, and co
mmitted individually. This ensures focused, reviewable commits and better progre
ss tracking.

#### Planning Phase

1. **Analyze the requirements** thoroughly before making any changes
2. **Break down the work** into discrete, focused steps that can be implemented
independently
3. **Create an initial plan** using `report_progress` with a checklist of all id
entified steps
4. **Prioritize steps** to ensure dependencies are handled correctly

#### Initial Setup (Fresh Clone)

**⚠️ CRITICAL:** Before starting development work in a fresh clone:

1. **Install dependencies FIRST**: `npm install` (takes 1-2 minutes, NEVER CANCE
L)
2. **Verify installation**: Check that `node_modules/` directory exists
3. **Only then proceed** with other commands like lint, test, build, or dev

**Without running `npm install` first, all other commands will fail with errors.
**

#### Step-by-Step Implementation

For each individual step in your plan:

1. **Development Phase**
   - Implement **only one focused change** that addresses a single step from you
r plan
   - Make minimal, surgical changes that address the specific step requirements
   - Follow existing code patterns and architectural decisions
   - Update documentation (README.md) when implementing new features that affect
 user-facing functionality

2. **Testing and Linting Phase - MANDATORY**
   - **PREREQUISITE**: Ensure `npm install` has been run (check for `node_module
s/` directory)
   - **No Exceptions:** For **every single change or addition** of a feature, co
rresponding tests **must** be added or adapted. This is a mandatory requirement
for every step.
   - **Run all tests:** `npm run test` (should pass all 578+ tests across 77 fil
es). If you add new features, add new tests. If you change features, adapt exist
ing tests.
   - **Run linting:** `npm run lint` (should pass with max 319 warnings)
   - **Run type checking:** `npm run typecheck` (expect minimal errors)
   - **Run build:** `npm run build` (should complete successfully)
   - **If any errors are found**: Fix them and return to Development Phase. Do n
ot proceed if tests are failing.

3. **Individual Step Commit**
   - **Use `report_progress`** to commit each completed step individually
   - **Update the checklist** to mark the current step as completed
   - **Provide a clear commit message** describing what was accomplished in this
 step
   - **Review committed files** to ensure only relevant changes are included
   - **Do not proceed** to the next step until the current step is fully committ
ed

4. **Step Validation Phase**
   - **Manual testing:** Verify the specific functionality changed in this step
works correctly
   - **Integration testing:** Ensure the step doesn't break existing functionali
ty
   - **Check browser console** for new errors (ignore expected Vercel Analytics
warnings)
   - **Take screenshots** of any UI changes to document the impact of this step

#### Final Review Phase

After all steps are completed:

1. **Comprehensive Code Review**
   - Review all changes across all commits thoroughly
   - **Crucially, verify that the testing requirements have been met for each st
ep.**
   - Check for code quality, maintainability, and adherence to project standards
   - Verify changes align with German financial requirements and tax calculation
s
   - Ensure no unintended side effects or regressions across the entire change s
et
   - **If issues are found**: Address them in additional individual commits

2. **Complete Manual Validation**
   - Start the development server: `npm run dev`
   - Test the complete user workflow as documented in "Manual Validation Require
ments"
   - Verify all interactive features work correctly across the entire change set
   - Ensure the full integration works as expected

#### Step-by-Step Commit Benefits

- **Focused changes**: Each commit addresses a single, well-defined aspect
- **Better reviewability**: Reviewers can understand and validate individual ste
ps
- **Easier debugging**: Issues can be traced to specific steps
- **Progressive validation**: Each step is tested before proceeding
- **Clear progress tracking**: The checklist shows exactly what has been complet
ed
- **Safer development**: Smaller changes reduce the risk of introducing bugs

#### Commit Message Guidelines

- Use clear, descriptive commit messages for each step
- Format: `[Step X/Y] Brief description of what was accomplished`
- Example: `[Step 2/5] Add withdrawal calculation validation with comprehensive
tests`
- Include the step number and total steps when possible
- Focus on what was accomplished, not what will be done next

### Code Review Guidelines

When performing code review, examine the following aspects:

#### Code Quality & Standards

- **Minimal Changes**: Are changes surgical and focused? Avoid unnecessary modif
ications
- **TypeScript**: Are types properly defined? No `any` types without justificati
on
- **React Patterns**: Proper use of hooks, state management, and component struc
ture
- **UI Framework**: Use shadcn/ui components for new development; avoid mixing U
I frameworks
- **Styling Guidelines**: Use only Tailwind CSS utility classes - never create c
ustom CSS classes or separate CSS files
- **ESLint Rules**: **NEVER add `eslint-disable` comments during development**.
Instead, refactor code to fix the underlying issue:
  - For complexity warnings: Extract helper functions or break down conditional
logic
  - For max-lines-per-function: Break large functions into smaller, focused comp
onents or helper functions
  - For other warnings: Address the root cause rather than suppressing the warni
ng
- **Performance**: No unnecessary re-renders or expensive calculations
- **Error Handling**: Appropriate error handling for user inputs and edge cases

#### User Experience

- **UI Consistency**: shadcn/ui components used appropriately and consistently;
avoid mixing UI frameworks
- **Responsiveness**: Mobile and desktop layouts work correctly
- **Real-time Updates**: Changes reflect immediately in calculations and display
s
- **German Language**: Proper German terminology and user-facing text
- **Navigation**: Sticky overview and section navigation work smoothly

#### Testing & Documentation

- **Test Coverage**: **Is there sufficient test coverage for the new functionali
ty? This is not a suggestion, it is a requirement.**
- **Documentation Updates**: README.md updated for new features
- **Code Comments**: Complex German tax calculations are well documented
- **Backwards Compatibility**: Changes don't break existing functionality

### Code Review Checklist

Before approving changes, verify:

- [ ] **Dependencies installed (`npm install` completed successfully)**
- [ ] **All tests pass (`npm run test`) - This is the most important check.**
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing confirms functionality works
- [ ] **Step-by-step approach followed**: Changes are broken into logical, focus
ed commits
- [ ] **Progress tracking used**: `report_progress` was used appropriately for e
ach step
- [ ] **Commit messages are clear**: Each step has a descriptive commit message
- [ ] Changes are minimal and focused per step
- [ ] **UI Framework**: New components use shadcn/ui; no mixing of UI frameworks
- [ ] **Styling uses only Tailwind CSS utility classes** - no custom CSS classes
 created
- [ ] UI/UX remains consistent and responsive
- [ ] Documentation is updated appropriately
- [ ] No unintended side effects or regressions
- [ ] Code follows existing patterns and standards

### When Issues Are Found

If the code review identifies problems:

1. Document the specific issues clearly
2. Provide actionable feedback for improvement
3. Return to Development Phase (step 1) to address the feedback
4. Repeat the entire workflow until all issues are resolved

This iterative approach ensures high-quality, maintainable code that serves user
s effectively while maintaining the application's reliability and accuracy.
