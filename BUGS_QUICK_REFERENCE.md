# Quick Bug Reference - History Amazing Frontend

## 🔴 HIGH PRIORITY (Fix Immediately)

### Bug #1: Race Condition - URL Hash Sync (App.tsx:128-148)
- **Problem**: Two effects fighting over URL hash updates
- **Fix**: Add guard flag `isRestoringFromURL` to prevent feedback loops
- **Impact**: Causes extra re-renders and potential bugs

### Bug #2: Wrong Dependency - Boolean Instead of Array (App.tsx:148)
- **Problem**: `[state.filteredEvents.length > 0]` is a boolean, not the array
- **Fix**: Change to `[state.filteredEvents, state.setSelectedEvent]`
- **Impact**: URL restoration fails when adding events to filtered list

### Bug #3: Missing Error Boundary (main.tsx:1-10)
- **Problem**: No error boundary + unsafe root element access with `!`
- **Fix**: Add ErrorBoundary component and safe element check
- **Impact**: App crashes silently with blank page if component fails

---

## 🟡 MEDIUM PRIORITY (Fix This Sprint)

### Bug #4: Missing Dependency (App.tsx:77)
```typescript
// ❌ Current
}, [state.selectedEvent])

// ✅ Fix
}, [state.selectedEvent, progress.markRead])
```

### Bug #5: Memory Leak in NavDropdown (App.tsx:738-745)
- **Problem**: Handler function not memoized, recreated every render
- **Fix**: Wrap `handleClickOutside` in `useCallback`

### Bug #6: Media Query Inconsistency (useIsMobile.ts:10-14)
```typescript
// ❌ Current: Uses window.innerWidth instead of media query
const onChange = () => {
  setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
}

// ✅ Fix: Use media query result
const onChange = (e: MediaQueryListEvent) => {
  setIsMobile(e.matches)
}
```

### Bug #7: Keyboard Shortcut Logic Error (useKeyboardShortcuts.ts:74)
```typescript
// ❌ Current: Ctrl+K works even inside text input
if ((e.key === '/' && !isInput) || (e.key === 'k' && (e.metaKey || e.ctrlKey)))

// ✅ Fix: Check isInput for both shortcuts
if (!isInput && ((e.key === '/') || (e.key === 'k' && (e.metaKey || e.ctrlKey))))
```

---

## 🟠 LOW PRIORITY (Polish)

### Bug #8: Missing Try-Catch (useTheme.ts:19-28)
- Wrap DOM manipulation in try-catch

### Bug #9: Redundant Dependencies (useTimelineState.ts:162-184)
- Use `[queryKey]` instead of `[query, queryKey]`

### Bug #10: ESLint Compliance (useFavorites.ts:40)
- Add `// eslint-disable-next-line` for module-level function

---

## Fix Timeline
- **Today**: Bugs #1, #2, #3 (HIGH)
- **This Week**: Bugs #4, #5, #6, #7 (MEDIUM)
- **Next Sprint**: Bugs #8, #9, #10 (LOW)

**Total Estimated Time**: 
- HIGH: 1-2 hours
- MEDIUM: 2-3 hours
- LOW: 30 minutes
