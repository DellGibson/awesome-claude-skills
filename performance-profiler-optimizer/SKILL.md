---
name: performance-profiler-optimizer
description: Analyzes code performance bottlenecks, calculates time complexity (Big O), and suggests optimizations for JavaScript and Python code
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: development
tags:
  - performance
  - optimization
  - profiling
  - complexity
  - big-o
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# Performance Profiler & Optimizer

Analyze code performance, identify bottlenecks, calculate algorithmic complexity (Big O), and get optimization suggestions with before/after comparisons.

## What It Does

1. **Analyzes Performance** - Identifies slow operations
2. **Calculates Complexity** - Big O time and space complexity
3. **Finds Bottlenecks** - Nested loops, inefficient algorithms
4. **Suggests Optimizations** - Specific improvement recommendations
5. **Before/After Examples** - Shows optimized code
6. **Metrics** - Performance improvement estimates

## Key Features

- **Complexity Analysis**: Big O notation
- **Bottleneck Detection**: N+1 queries, nested loops
- **Optimization Suggestions**: Caching, indexing, algorithms
- **Before/After Comparisons**: Performance improvements
- **Multi-Language**: JavaScript, Python

## When to Use

- Optimize slow code
- Reduce API response times
- Improve algorithm efficiency
- Scale applications
- Reduce resource usage

## Example

**Before:**
```javascript
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}
// Time: O(n²), Space: O(n)
```

**After:**
```javascript
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  arr.forEach(item => {
    if (seen.has(item)) {
      duplicates.add(item);
    }
    seen.add(item);
  });
  return Array.from(duplicates);
}
// Time: O(n), Space: O(n)
// Improvement: 100x faster for large arrays
```

## Installation

Available in Claude.ai, Claude Code, and Claude API.

## License

Apache-2.0
