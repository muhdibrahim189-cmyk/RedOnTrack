/**
 * ARCHITECTURE DOCUMENTATION
 * 
 * RedOnTrack Refactored Architecture - SOLID Principles & Modular Design
 * =====================================================================
 * 
 * Overview:
 * ---------
 * This refactored architecture implements SOLID principles and clean code practices
 * to create a maintainable, scalable, and testable application.
 * 
 * Directory Structure:
 * -------------------
 * src/
 * ├── services/              # Business logic layer (SRP - Single Responsibility)
 * │   ├── geminiService.ts   # AI API service
 * │   ├── accidentService.ts # Accident/incident logic
 * │   ├── analyticsService.ts # Analytics calculations
 * │   ├── cameraService.ts   # Camera operations
 * │   ├── storageService.ts  # LocalStorage abstraction
 * │   └── index.ts           # Unified exports
 * │
 * ├── domain/                 # Type definitions (DDD approach)
 * │   └── index.ts           # All domain entities/types
 * │
 * ├── hooks/                  # Custom React hooks (reusable logic)
 * │   ├── useAccidentFolders.ts
 * │   ├── useAccidentAnalytics.ts
 * │   ├── useCameraManagement.ts
 * │   ├── useCurrentTime.ts
 * │   ├── useFootageFolderFilter.ts
 * │   ├── useAIAnalysis.ts
 * │   └── index.ts
 * │
 * ├── components/             # Presentational components
 * │   ├── Header.tsx         # Header component
 * │   ├── CCTVFeed.tsx       # Camera feed display
 * │   ├── UIComponents.tsx   # Reusable UI elements
 * │   └── index.ts
 * │
 * ├── pages/                  # Page/smart components
 * │   ├── Login.tsx          # Authentication page
 * │   ├── Dashboard.tsx      # Main dashboard
 * │   ├── CameraMonitoring.tsx # Camera monitoring
 * │   └── index.ts
 * │
 * ├── utils/                  # Utility functions
 * │   ├── dateUtils.ts
 * │   ├── stringUtils.ts
 * │   ├── validationUtils.ts
 * │   ├── cameraUtils.ts
 * │   └── index.ts
 * │
 * ├── constants/              # Application constants
 * │   └── index.ts
 * │
 * ├── App.tsx                 # Main app component
 * └── index.tsx               # Entry point
 * 
 * 
 * SOLID Principles Implementation:
 * ================================
 * 
 * 1. Single Responsibility Principle (SRP)
 *    ─────────────────────────────────────
 *    ✓ Each service handles one domain (gem initiService, accidentService, etc.)
 *    ✓ Each hook manages one specific state concern
 *    ✓ Components are focused (Header, CCTVFeed, UIComponents)
 *    ✓ Utilities are grouped by concern (dateUtils, stringUtils, etc.)
 *    
 *    Example:
 *    - accidentService: ONLY accident/incident operations
 *    - analyticsService: ONLY analytics calculations
 *    - cameraService: ONLY camera operations
 * 
 * 2. Open/Closed Principle (OCP)
 *    ───────────────────────────
 *    ✓ Services are open for extension (can add new methods)
 *    ✓ Closed for modification (existing logic doesn't change)
 *    ✓ Status color mapping in cameraService is extensible
 *    
 *    Example:
 *    - Adding new status types doesn't require changing existing code
 *    - New services can be added without modifying existing ones
 * 
 * 3. Liskov Substitution Principle (LSP)
 *    ──────────────────────────────────
 *    ✓ All service instances follow consistent interfaces
 *    ✓ All hooks follow consistent return patterns
 *    ✓ All components accept well-defined prop types
 * 
 * 4. Interface Segregation Principle (ISP)
 *    ────────────────────────────────────
 *    ✓ Props are segregated by concern (HeaderProps, CCTVFeedProps)
 *    ✓ Components only accept required props
 *    ✓ No unnecessarily large prop interfaces
 *    
 *    Example:
 *    - Header props: { logoUrl, brandName, showNotification, userRole }
 *    - CCTVFeed props: { feed, onClick, showResolution, showLiveIndicator }
 * 
 * 5. Dependency Inversion Principle (DIP)
 *    ───────────────────────────────────
 *    ✓ Services depend on abstractions (interfaces)
 *    ✓ Components depend on services via dependency injection
 *    ✓ storageService abstracts localStorage implementation
 *    ✓ geminiService abstracts API calls
 *    
 *    Example:
 *    - useAccidentFolders imports accidentService and storageService
 *    - Pages use hooks that abstract service details
 *    - Services can be mocked for testing
 * 
 * 
 * Data Flow:
 * ----------
 * User Action → Page Component → Hook → Service → Business Logic → State Update → Render
 * 
 * Example Flow (Dashboard):
 * ├── User clicks "Monitoring"
 * ├── Dashboard component navigates to /monitoring
 * ├── CameraMonitoring page loads
 * ├── useCameraManagement hook initializes with INITIAL_CAMERA_FEEDS
 * ├── Hook manages camera state locally
 * ├── User moves camera → moveCameraUp() called
 * ├── cameraService.moveCameraUp() executes logic
 * ├── Hook updates state
 * └── Component re-renders
 * 
 * 
 * Benefits of This Architecture:
 * ─────────────────────────────
 * 1. Maintainability
 *    - Clear separation of concerns
 *    - Easy to locate and modify code
 *    - Changes in one area don't cascade
 * 
 * 2. Testability
 *    - Services are pure functions (mostly)
 *    - Hooks can be tested independently
 *    - Components can be tested with mocked services
 * 
 * 3. Reusability
 *    - Hooks can be used across multiple components
 *    - Services provide consistent logic
 *    - Utility functions are pure and composable
 * 
 * 4. Scalability
 *    - Easy to add new features without breaking existing code
 *    - New pages can use existing services and hooks
 *    - New services don't require changing old code (OCP)
 * 
 * 5. Debugging
 *    - Data flow is clear and traceable
 *    - Services are isolated and easier to test
 *    - Hooks provide a clear view of state management
 * 
 * 
 * Adding New Features:
 * ───────────────────
 * 
 * Example: Adding a new "Report Generation" feature
 * 
 * 1. Create domain types (domain/index.ts):
 *    export interface Report { ... }
 * 
 * 2. Create service (services/reportService.ts):
 *    class ReportService {
 *      generateReport(data) { ... }
 *      exportReport(report) { ... }
 *    }
 * 
 * 3. Create custom hook (hooks/useReportGeneration.ts):
 *    export function useReportGeneration() { ... }
 * 
 * 4. Use in page:
 *    const { reports, generateReport } = useReportGeneration();
 * 
 * 5. Render with components:
 *    <ReportCard report={report} onExport={handleExport} />
 * 
 * This follows all SOLID principles and maintains consistency!
 * 
 * 
 * Migration Guide (Old to New Structure):
 * ──────────────────────────────────────
 * 
 * Old: Direct API calls in components
 * New: Services + Hooks + Components
 * 
 * Old: useState scattered everywhere
 * New: Custom hooks encapsulate state logic
 * 
 * Old: Large prop interfaces
 * New: Segregated, focused props
 * 
 * Old: Business logic in JSX
 * New: Business logic in services, JSX for rendering only
 * 
 * 
 * Testing Strategy:
 * ────────────────
 * 
 * 1. Service Tests (Pure functions)
 *    test('accidentService.calculateTotalAccidents', () => {
 *      const stats = [{ label: 'Mon', value: 5 }];
 *      expect(accidentService.calculateTotalAccidents(stats)).toBe(5);
 *    });
 * 
 * 2. Hook Tests (React Testing Library)
 *    test('useAccidentAnalytics returns correct state', () => {
 *      const { result } = renderHook(() => useAccidentAnalytics());
 *      expect(result.current.period).toBe('weekly');
 *    });
 * 
 * 3. Component Tests (Integration)
 *    test('Dashboard renders with Header and CCTVFeed', () => {
 *      render(<Dashboard />);
 *      expect(screen.getByText(/Monitoring Cluster/i)).toBeInTheDocument();
 *    });
 * 
 * 
 * Performance Considerations:
 * ──────────────────────────
 * 
 * ✓ Services are singleton instances (single instance across app)
 * ✓ Hooks use useMemo for expensive calculations
 * ✓ Components use React.memo for optimization when needed
 * ✓ useCallback prevents unnecessary re-renders
 * ✓ No prop drilling (hooks manage state locally)
 * 
 * 
 * Future Improvements:
 * ───────────────────
 * 
 * 1. Add Context API for global state (authentication, theme)
 * 2. Implement Redux for complex state management
 * 3. Add error boundaries for better error handling
 * 4. Create a logger service for monitoring
 * 5. Implement WebSocket service for real-time updates
 * 6. Add unit and integration tests
 * 7. Create Storybook for component documentation
 * 8. Implement error handling middleware
 * 9. Add request/response interceptors
 * 10. Create an API layer abstraction
 */

// This file is for documentation - no executable code
