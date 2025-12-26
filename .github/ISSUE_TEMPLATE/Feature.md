---
name: feature
about: Feature implementation template for GitHub Copilot
title: 'Feature: [Feature Name from features.md]'
labels: Copilot
assignees: 'Copilot'

---

## Feature Implementation Request

### 📋 Instructions for Copilot

**CRITICAL: Read the complete `.github/copilot-instructions.md` file before starting development.**

### 🎯 Feature Selection

Select the most promising feature from `features.md` and implement it. After successful implementation:
1. **Remove the implemented feature from `features.md`**
2. **Do NOT add comments like "implemented" or "done" in `features.md`** - just remove the feature completely
3. **Update the `README.md`** to document the new feature in the appropriate section

### 📝 Implementation Requirements

#### 1. Analysis Phase
- [ ] Read and understand the selected feature from `features.md`
- [ ] Review existing code patterns and architecture
- [ ] Identify all files that need to be modified
- [ ] Plan the minimal changes needed

#### 2. Development Phase
- [ ] **MANDATORY: Run `npm install` first** (required in fresh clone)
- [ ] Implement the feature following existing code patterns
- [ ] Use **shadcn/ui components** from `src/components/ui/` for any UI elements
- [ ] Use **TypeScript** with proper types (no `any` types without justification)
- [ ] Use **Tailwind CSS utility classes only** (no custom CSS classes or files)
- [ ] Follow the **step-by-step commit approach** (Teilschritt commits)
  - Break work into 3-8 discrete steps
  - Use `report_progress` after each completed step
  - Update checklist to track progress

#### 3. Testing Requirements - MANDATORY
**This is NOT optional. Every feature change MUST have corresponding tests.**

- [ ] Add new tests for the implemented feature
- [ ] Update existing tests if behavior changed
- [ ] Run `npm run test` - all tests must pass (578+ tests)
- [ ] Run `npm run lint` - must pass with max 319 warnings
- [ ] Run `npm run typecheck` - verify TypeScript compilation
- [ ] Run `npm run build` - verify production build works

#### 4. Documentation Requirements
- [ ] Update `README.md` with new feature description
  - Add to the appropriate section (Features, How to Play, etc.)
  - Integrate naturally without "New" or "Neu" markers
  - Use clear German language for user-facing documentation
- [ ] Add code comments for complex logic
- [ ] Update component documentation if needed

#### 5. Manual Validation
- [ ] Start development server: `npm run dev`
- [ ] Navigate to http://localhost:5173
- [ ] Test the complete user workflow
- [ ] Verify feature works in both light and dark mode
- [ ] Test responsive behavior (desktop and mobile)
- [ ] Take screenshots of UI changes
- [ ] Check browser console for errors (ignore Vercel Analytics warnings)

#### 6. Cleanup
- [ ] Remove the implemented feature from `features.md`
- [ ] Do NOT add implementation notes to `features.md`
- [ ] Ensure no temporary files or test artifacts are committed
- [ ] Review all committed files with `report_progress`

### 🔧 Technical Guidelines

#### Component Development
- Use **React hooks** (useState, useEffect, useCallback) for state management
- Use **useMemo** for stable IDs (see HTML ID Management in copilot-instructions.md)
- Extract complex components into smaller, focused components if they exceed 500-800 lines
- Follow existing component patterns in `src/components/`

#### Styling
- Use **shadcn/ui components** for all new UI elements
- Apply **Tailwind CSS utility classes** only
- Never create custom CSS classes or separate CSS files
- Maintain consistent styling with existing components

#### State Management
- Use React hooks for local component state
- Client-side calculations with immediate updates
- No external state management library needed

#### ID Management (CRITICAL)
- Use `generateFormId()` from `src/utils/unique-id.ts` for form elements
- Use `useMemo` to ensure stable IDs within component lifecycle
- Never create duplicate HTML IDs (accessibility violation)

### 📊 Quality Checklist

Before considering the feature complete:

- [ ] All automated tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing confirms functionality works
- [ ] Feature works in both light and dark mode
- [ ] Feature is responsive on mobile and desktop
- [ ] README.md is updated with feature documentation
- [ ] Implemented feature is removed from `features.md`
- [ ] No test artifacts or temporary files committed
- [ ] All steps committed individually using `report_progress`

### 🚀 Workflow Summary

1. **Setup**: Run `npm install` (CRITICAL - must be first)
2. **Plan**: Use `report_progress` to outline implementation steps
3. **Implement**: Make changes following step-by-step approach
4. **Test**: Run tests after EACH step (mandatory)
5. **Commit**: Use `report_progress` after each completed step
6. **Validate**: Manual testing with development server
7. **Document**: Update README.md and remove from features.md
8. **Finalize**: Complete all checklist items above

### ⚠️ Common Pitfalls to Avoid

- ❌ Don't skip `npm install` - all other commands will fail
- ❌ Don't skip testing - tests are mandatory for every change
- ❌ Don't create custom CSS classes - use Tailwind utilities only
- ❌ Don't add "implemented" comments to features.md - just remove the feature
- ❌ Don't mix UI frameworks - use shadcn/ui only
- ❌ Don't create duplicate HTML IDs - use unique-id utilities
- ❌ Don't skip manual validation - test the complete user workflow
- ❌ Don't make large commits - use step-by-step approach

### 📚 Reference Documentation

- **Development Guidelines**: `.github/copilot-instructions.md` (READ THIS FIRST)
- **Feature Ideas**: `features.md`
- **Project Documentation**: `README.md`
- **UI Components**: `src/components/ui/` (shadcn/ui)
- **Utilities**: `src/utils/` (unique-id, currency, etc.)

---

**Remember**: This is a Doppelkopf card counting training application. Maintain focus on helping users practice counting cards effectively while keeping the UI clean, intuitive, and responsive.
