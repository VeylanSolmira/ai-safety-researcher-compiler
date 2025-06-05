# Understanding Mounting and Two-Pass Rendering in Next.js

## What is "Mounting"?

In React, **mounting** is when a component is created and inserted into the DOM for the first time. Think of it like:
- **Mounting**: Component is born and placed on the page
- **Updating**: Component changes its state/props
- **Unmounting**: Component is removed from the page

## The SSR + Hydration Timeline

Here's what happens with Next.js SSR:

```
1. SERVER RENDERS (no JavaScript)
   └─> Runs React components
   └─> Generates HTML string
   └─> Sends HTML to browser

2. BROWSER RECEIVES HTML
   └─> Shows static HTML immediately (fast!)
   └─> Starts downloading JavaScript

3. HYDRATION BEGINS
   └─> React runs on client
   └─> Re-renders components
   └─> Compares with existing HTML
   └─> If mismatch: ERROR! ❌

4. MOUNTING COMPLETE
   └─> useEffect runs NOW
   └─> Component is interactive
   └─> Can update based on client state
```

## The Problem We Were Having

```javascript
// This code causes hydration errors:
const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost'

return (
  <div>
    {isDevelopment && <button>Edit</button>}
  </div>
)
```

**Why it fails:**
- Server: `window` doesn't exist → `isDevelopment = false` → No button
- Client: `window` exists → `isDevelopment = true` → Shows button
- Hydration: HTML doesn't match! Error!

## Two-Pass Rendering Solution

```javascript
// This fixes it:
const [isDevelopment, setIsDevelopment] = useState(false)  // Always false initially

useEffect(() => {
  // This runs AFTER mounting/hydration
  setIsDevelopment(window.location.hostname === 'localhost')
}, [])

return (
  <div>
    {isDevelopment && <button>Edit</button>}
  </div>
)
```

**Why it works:**

### Pass 1: Initial Render (Server + Client Hydration)
- Server: `isDevelopment = false` → No button
- Client: `isDevelopment = false` → No button
- ✅ They match! Hydration succeeds

### Pass 2: After Mount (Client Only)
- `useEffect` runs (only on client, after mount)
- Updates `isDevelopment` based on actual environment
- React re-renders with the button if needed

## Visual Timeline

```
Server          Client
  |               |
  |-- Render ---> |
  | (no button)   |
  |               |-- Receive HTML (no button)
  |               |
  |               |-- Hydrate (no button) ✅ Matches!
  |               |
  |               |-- Mount Complete
  |               |
  |               |-- useEffect runs
  |               |
  |               |-- setState → Re-render
  |               |
  |               |-- Show button (if localhost)
```

## Key Concepts

1. **useEffect only runs on the client** - Never on the server
2. **useEffect runs AFTER mounting** - After hydration is complete
3. **useState initial value** - Used by both server and client
4. **Hydration requires perfect match** - Server HTML must match initial client render

## Common Patterns

```javascript
// Pattern 1: Client-only features
const [isClient, setIsClient] = useState(false)
useEffect(() => setIsClient(true), [])

// Pattern 2: Loading state
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
useEffect(() => {
  fetchData().then(setData).finally(() => setLoading(false))
}, [])

// Pattern 3: Browser-specific values
const [windowWidth, setWindowWidth] = useState(1024) // Safe default
useEffect(() => {
  setWindowWidth(window.innerWidth)
}, [])
```

## Real-World Examples from Our Codebase

### ViewModeToggle Component
```javascript
// Problem: localStorage is client-only
const [viewMode, setViewMode] = useState('academic')
const [isClient, setIsClient] = useState(false)

useEffect(() => {
  setIsClient(true)
  const saved = localStorage.getItem('viewMode')
  if (saved) setViewMode(saved)
}, [])

// Render placeholder until client-side
if (!isClient) {
  return <div className="placeholder" />
}
```

### ProgressButtons Component
```javascript
// Problem: Progress data comes from client-side API
const [isComplete, setIsComplete] = useState(false)
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

useEffect(() => {
  if (!mounted) return
  // Now safe to fetch client-side data
  checkProgress().then(setIsComplete)
}, [mounted])
```

## The Key Insight

**Accept that the first render will be generic**, then customize after mounting when you have access to client-specific information. This ensures:
- Fast initial page loads (SSR benefit)
- No hydration errors
- Smooth transition to interactive features