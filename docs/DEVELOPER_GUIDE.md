# Developer Guide - New Architecture

## Quick Start

### Understanding the Flow

```
User Action → Smart Component (Page) → Hook → Service → Business Logic → Render
```

### Example: Refactoring a Feature

Let's say you want to add a "Generate Report" feature:

#### Step 1: Define Domain Types
```typescript
// src/domain/index.ts
export interface Report {
  id: string;
  title: string;
  generatedAt: Date;
  format: 'pdf' | 'csv';
}
```

#### Step 2: Create Service (Business Logic)
```typescript
// src/services/reportService.ts
class ReportService {
  generateReport(data: any): Report {
    return {
      id: `RPT-${Date.now()}`,
      title: 'Generated Report',
      generatedAt: new Date(),
      format: 'pdf',
    };
  }

  exportReport(report: Report): void {
    // Export logic
  }
}

export default new ReportService();
```

#### Step 3: Create Hook (State Management)
```typescript
// src/hooks/useReportGeneration.ts
import { useState, useCallback } from 'react';
import { Report } from '../domain';
import { reportService } from '../services';

export function useReportGeneration() {
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState(false);

  const generateReport = useCallback(async (data: any) => {
    setGenerating(true);
    try {
      const report = reportService.generateReport(data);
      setReports((prev) => [...prev, report]);
    } finally {
      setGenerating(false);
    }
  }, []);

  return { reports, generating, generateReport };
}
```

#### Step 4: Create Presentational Component
```typescript
// src/components/ReportCard.tsx
import React from 'react';
import { Report } from '../domain';

interface ReportCardProps {
  report: Report;
  onExport?: () => void;
  onDelete?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onExport,
  onDelete,
}) => (
  <div className="border rounded-lg p-4">
    <h3>{report.title}</h3>
    <p>{report.generatedAt.toLocaleString()}</p>
    <button onClick={onExport}>Export</button>
    <button onClick={onDelete}>Delete</button>
  </div>
);
```

#### Step 5: Use in Page Component
```typescript
// src/pages/ReportsDashboard.tsx
import React from 'react';
import { useReportGeneration } from '../hooks';
import { ReportCard } from '../components';

const ReportsDashboard: React.FC = () => {
  const { reports, generating, generateReport } = useReportGeneration();

  return (
    <div>
      <button onClick={() => generateReport({})}>
        {generating ? 'Generating...' : 'Generate Report'}
      </button>
      <div>
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
};

export default ReportsDashboard;
```

---

## Service Layer Guide

### Creating a New Service

1. **Identify the domain** - What business area does this service cover?
   - Example: "Accident Management" → `accidentService`

2. **Define the interface**
   ```typescript
   interface IAccidentService {
     analyzeAccident(folder: FootageFolder): Promise<string>;
     updateRemarks(folder: FootageFolder, remarks: string): FootageFolder;
   }
   ```

3. **Implement the service**
   ```typescript
   class AccidentService implements IAccidentService {
     async analyzeAccident(folder: FootageFolder): Promise<string> {
       // Pure business logic
     }
   }
   ```

4. **Export as singleton**
   ```typescript
   export default new AccidentService();
   ```

5. **Use in hooks/pages**
   ```typescript
   import { accidentService } from '../services';
   const result = accidentService.analyzeAccident(folder);
   ```

### Service Best Practices

✅ **DO**
- Keep methods focused on one responsibility
- Use pure functions (no side effects)
- Return consistent types
- Handle errors properly
- Document complex logic

❌ **DON'T**
- Mix concerns (don't call unrelated services)
- Directly modify React state
- Import React components
- Create side effects
- Log extensively (create a logger service instead)

---

## Hook Usage Guide

### When to Create a Hook

1. **Managing component state** → Create a hook
2. **Reusing state logic** → Create a hook
3. **Encapsulating effect logic** → Create a hook

### Hook Naming Convention

```
use<Domain><Operation>

useAccidentFolders      ✅ Clear
useAnalytics           ✅ Clear
useCameraManagement    ✅ Clear
useCustomLogic         ❌ Too vague
```

### Hook Return Structure

```typescript
export function useMyFeature() {
  const [state, setState] = useState(...);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const action = useCallback(() => { ... }, []);

  return {
    // State
    state,
    loading,
    error,
    
    // Actions
    action,
  };
}
```

### Hook Dependency Management

```typescript
// ✅ Good: useCallback with dependencies
const action = useCallback(() => {
  setData(newData);
}, [dependency]);

// ✅ Good: useMemo for expensive calculations
const filteredData = useMemo(() => {
  return data.filter(/* complex logic */);
}, [data, filter]);

// ❌ Bad: Missing dependencies
const action = useCallback(() => {
  // Uses 'data' but not in dependencies array
}, []);
```

---

## Component Best Practices

### Presentational vs Smart Components

```typescript
// PRESENTATIONAL (Dumb)
// - Only receives props
// - Renders UI
// - No hooks (except styled-components)
// - Pure function
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}>{label}</button>
);

// SMART (Container)
// - Uses hooks
// - Manages state
// - Orchestrates logic
// - Renders other components
const Dashboard: React.FC = () => {
  const { data, loading, fetchData } = useMyHook();
  return <DataDisplay data={data} onRefresh={fetchData} />;
};
```

### Prop Types

```typescript
// ✅ Good: Small, focused interfaces (ISP)
interface HeaderProps {
  brandName: string;
  logoUrl: string;
  userRole: string;
}

// ❌ Bad: Large, catch-all interface
interface HeaderProps {
  [key: string]: any;
}

// ✅ Good: Segregate related props
interface FormProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => void;
}

interface FormUIProps {
  isLoading: boolean;
  error?: string;
}
```

---

## Testing the New Architecture

### Service Testing

```typescript
// tests/services/accidentService.test.ts
import { accidentService } from '../../services';

describe('accidentService', () => {
  it('should update folder remarks', () => {
    const folder = { /* ... */, remarks: 'old' };
    const result = accidentService.updateFolderRemarks(folder, 'new');
    expect(result.remarks).toBe('new');
  });
});
```

### Hook Testing

```typescript
// tests/hooks/useAccidentFolders.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAccidentFolders } from '../../hooks';

describe('useAccidentFolders', () => {
  it('should initialize with folders', () => {
    const { result } = renderHook(() => useAccidentFolders(initialFolders));
    expect(result.current.folders).toEqual(initialFolders);
  });

  it('should update remarks', () => {
    const { result } = renderHook(() => useAccidentFolders(initialFolders));
    act(() => {
      result.current.updateRemarks('F-001', 'New remark');
    });
    // Assert the update
  });
});
```

### Component Testing

```typescript
// tests/components/CCTVFeed.test.tsx
import { render, screen } from '@testing-library/react';
import { CCTVFeed } from '../../components';

describe('CCTVFeed', () => {
  it('should render camera name', () => {
    const feed = { id: '1', name: 'Platform 1', /* ... */ };
    render(<CCTVFeed feed={feed} />);
    expect(screen.getByText('Platform 1')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    const feed = { /* ... */ };
    const { getByRole } = render(<CCTVFeed feed={feed} onClick={onClick} />);
    getByRole('button').click();
    expect(onClick).toHaveBeenCalled();
  });
});
```

---

## Debugging Tips

### 1. Trace Data Flow
```
Component Render
  → Check hooks being used
    → Check service being called
      → Check business logic
```

### 2. Use React DevTools
- View component tree
- Check props being passed
- Track hook state changes

### 3. Add Console Logs Strategically
```typescript
// In service (temporary debug)
console.log('[AccidentService] Analyzing:', folder);

// In hook
console.log('[useAccidentAnalytics] Period changed:', period);

// In component (less common)
console.log('[Dashboard] Rendering with props:', props);
```

### 4. Browser DevTools
- Network tab: Check API calls
- Storage tab: Check localStorage
- Console: Look for errors/warnings

---

## Common Patterns

### Pattern 1: Async Operations in Hooks

```typescript
export function useAsyncOperation<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}
```

### Pattern 2: Using Derived State

```typescript
export function useAccidentAnalytics() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  
  // Derived state - not stored in useState
  const stats = useMemo(() => {
    return analyticsService.getStatsForWeek(0, 'day');
  }, [period]);

  const totalCases = useMemo(() => {
    return stats.reduce((sum, stat) => sum + stat.value, 0);
  }, [stats]);

  return { period, setPeriod, stats, totalCases };
}
```

### Pattern 3: Composition Over Inheritance

```typescript
// Instead of extending a class, compose services

class ComplexService {
  constructor(
    private accidentService: typeof accidentService,
    private analyticsService: typeof analyticsService,
  ) {}

  async generateReport(folder: FootageFolder) {
    const analysis = await this.accidentService.analyzeAccidentFootage(folder);
    const trends = this.analyticsService.calculateTrend('weekly');
    return { analysis, trends };
  }
}
```

---

## Performance Optimization Checklist

- [ ] Services use singleton pattern (only one instance)
- [ ] Hooks use useMemo for expensive calculations
- [ ] Hooks use useCallback for function references
- [ ] Components are memoized if receiving many props
- [ ] No unnecessary re-renders in lists
- [ ] Images are optimized (lazy loading)
- [ ] Large lists use virtualization if needed
- [ ] API calls are debounced/throttled

---

## Migration Checklist for Developers

When refactoring an existing page:

- [ ] Identify domain types needed
- [ ] Extract business logic to service
- [ ] Create custom hook for state management
- [ ] Split components into presentational pieces
- [ ] Replace prop drilling with hooks
- [ ] Update tests
- [ ] Documentation
- [ ] Code review
- [ ] Merge to main

---

## Troubleshooting

### Issue: "Cannot find module 'services'"
**Solution**: Check import path - should be `from '../services'` with relative path

### Issue: Stale closures in hooks
**Solution**: Add dependencies to useCallback/useMemo

### Issue: Component not re-rendering
**Solution**: 
1. Check if state is being modified directly (avoid mutations)
2. Check useCallback/useMemo dependencies
3. Check if parent component re-renders

### Issue: Performance problems
**Solution**:
1. Profile with React DevTools
2. Add useMemo to expensive calculations
3. Split into smaller components
4. Use React.memo if needed

---

## Resources

- React Documentation: https://react.dev
- SOLID Principles: https://en.wikipedia.org/wiki/SOLID
- Clean Code: https://www.oreilly.com/library/view/clean-code-a/9780136083238/

---

**Last Updated**: February 2026  
**SOLID Compliance**: ✅ Full  
**Test Coverage**: Ready for implementation
