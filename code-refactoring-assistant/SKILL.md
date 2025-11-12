---
name: code-refactoring-assistant
description: Analyzes code for smells and complexity issues, suggests refactorings like extract function and remove duplication, calculates cyclomatic complexity metrics
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: development
tags:
  - refactoring
  - code-quality
  - clean-code
  - complexity
  - maintainability
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# Code Refactoring Assistant

Automatically analyze code for quality issues and suggest refactorings. This skill detects code smells, calculates complexity metrics, and provides specific refactoring recommendations with before/after examples for JavaScript, Python, TypeScript, and Go.

## What It Does

The Code Refactoring Assistant skill:

1. **Detects Code Smells** - Identifies long methods, duplicate code, large classes
2. **Calculates Complexity** - Measures cyclomatic complexity, cognitive complexity
3. **Suggests Refactorings** - Extract function, extract class, simplify conditionals
4. **Provides Examples** - Shows before/after code with explanations
5. **Measures Improvements** - Quantifies complexity reduction
6. **Naming Suggestions** - Recommends better variable and function names
7. **Pattern Recognition** - Identifies design pattern opportunities

## Key Features

- **Multi-Language Support**: JavaScript, TypeScript, Python, Go
- **Code Smell Detection**: Long methods, duplicate code, complex conditionals
- **Complexity Metrics**: Cyclomatic, cognitive, Halstead complexity
- **Refactoring Patterns**: Extract method, replace conditional, remove duplication
- **Before/After Examples**: Clear demonstrations of improvements
- **LOC Reduction**: Measures lines of code saved
- **Maintainability Index**: Overall code health score
- **Best Practices**: Follows language-specific conventions

## When to Use This Skill

Use the Code Refactoring Assistant when you need to:

- Improve code maintainability before code review
- Reduce technical debt in legacy code
- Prepare code for new features
- Meet complexity thresholds for CI/CD
- Learn refactoring techniques
- Clean up after rapid prototyping
- Improve test coverage by simplifying code

## Supported Languages

- **JavaScript/TypeScript**: ES6+ syntax, async/await, classes
- **Python**: Functions, classes, list comprehensions, decorators
- **Go**: Functions, methods, goroutines, interfaces
- **Java**: Classes, methods, lambdas (basic support)

## Example Usage

### Input: Complex JavaScript Function

```javascript
function processOrder(order, user, inventory) {
  if (order && order.items && order.items.length > 0) {
    let total = 0;
    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      if (inventory[item.productId] && inventory[item.productId].stock >= item.quantity) {
        const price = inventory[item.productId].price;
        const discount = user.isPremium ? 0.1 : 0;
        const itemTotal = price * item.quantity * (1 - discount);
        total += itemTotal;
        inventory[item.productId].stock -= item.quantity;
      } else {
        throw new Error('Insufficient stock for ' + item.productId);
      }
    }
    if (user.isPremium && total > 100) {
      total *= 0.95;
    }
    order.total = total;
    order.status = 'processed';
    return order;
  } else {
    throw new Error('Invalid order');
  }
}
```

### Output: Refactoring Analysis

#### Detected Issues

1. **Long Method** (Complexity: 8, LOC: 25)
   - Too many responsibilities in one function
   - Difficult to test individual parts
   - Hard to understand logic flow

2. **Nested Conditionals** (Depth: 4)
   - Multiple levels of if statements
   - Difficult to follow logic
   - High cognitive load

3. **Magic Numbers** (0.1, 0.95, 100)
   - Unexplained constants
   - Difficult to maintain
   - Unclear business rules

4. **Mixed Concerns**
   - Validation, calculation, and mutation in one function
   - Violates Single Responsibility Principle

#### Suggested Refactorings

**1. Extract Functions**

```javascript
// Refactored version
function processOrder(order, user, inventory) {
  validateOrder(order);
  const subtotal = calculateSubtotal(order, user, inventory);
  const total = applyDiscounts(subtotal, user);
  return completeOrder(order, total);
}

function validateOrder(order) {
  if (!order || !order.items || order.items.length === 0) {
    throw new Error('Invalid order');
  }
}

function calculateSubtotal(order, user, inventory) {
  return order.items.reduce((sum, item) => {
    validateInventory(item, inventory);
    const price = getItemPrice(item, inventory, user);
    updateInventory(item, inventory);
    return sum + price;
  }, 0);
}

function validateInventory(item, inventory) {
  const product = inventory[item.productId];
  if (!product || product.stock < item.quantity) {
    throw new Error(`Insufficient stock for ${item.productId}`);
  }
}

function getItemPrice(item, inventory, user) {
  const basePrice = inventory[item.productId].price * item.quantity;
  const discount = user.isPremium ? PREMIUM_DISCOUNT : 0;
  return basePrice * (1 - discount);
}

function updateInventory(item, inventory) {
  inventory[item.productId].stock -= item.quantity;
}

function applyDiscounts(subtotal, user) {
  if (user.isPremium && subtotal > BULK_DISCOUNT_THRESHOLD) {
    return subtotal * (1 - BULK_DISCOUNT_RATE);
  }
  return subtotal;
}

function completeOrder(order, total) {
  order.total = total;
  order.status = 'processed';
  return order;
}

// Constants
const PREMIUM_DISCOUNT = 0.1;
const BULK_DISCOUNT_RATE = 0.05;
const BULK_DISCOUNT_THRESHOLD = 100;
```

**2. Extract Configuration**

```javascript
const DISCOUNTS = {
  premium: 0.1,
  bulk: 0.05,
  bulkThreshold: 100
};
```

#### Metrics Improvement

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Cyclomatic Complexity | 8 | 2 (avg) | 75% reduction |
| Lines of Code | 25 | 8 (main) | 68% reduction |
| Function Length | 25 | 5 (avg) | 80% reduction |
| Cognitive Complexity | 12 | 3 (avg) | 75% reduction |
| Testability Score | 3/10 | 9/10 | 200% improvement |

#### Benefits

- **Easier Testing**: Each function can be unit tested independently
- **Better Readability**: Clear function names explain intent
- **Maintainability**: Changes are localized to specific functions
- **Reusability**: Utility functions can be used elsewhere
- **Debugging**: Easier to isolate issues

## Common Refactoring Patterns

### Extract Method
Break large functions into smaller, focused functions

### Replace Conditional with Polymorphism
Use classes/objects instead of switch statements

### Introduce Parameter Object
Group related parameters into an object

### Replace Magic Number with Constant
Define meaningful constant names

### Decompose Conditional
Extract complex conditions into named functions

### Remove Duplicate Code
Create shared functions for repeated logic

## Output Components

The skill generates:

1. **Issue Report** - List of detected code smells
2. **Refactored Code** - Improved version with explanations
3. **Metrics Comparison** - Before/after complexity metrics
4. **Benefits Analysis** - Why each refactoring helps
5. **Testing Suggestions** - How to test refactored code

## Best Practices

### For Optimal Refactoring

1. **One Change at a Time**: Refactor incrementally
2. **Test Coverage**: Ensure tests pass before and after
3. **Meaningful Names**: Use clear, descriptive names
4. **Small Functions**: Keep functions under 20 lines
5. **Single Responsibility**: One function, one purpose
6. **DRY Principle**: Don't Repeat Yourself
7. **Early Returns**: Reduce nesting with guard clauses

### Complexity Guidelines

- **Cyclomatic Complexity**: Keep under 10
- **Function Length**: Under 20 lines ideal
- **Parameters**: Max 3-4 parameters
- **Nesting**: Max 3 levels deep

## Limitations

- **Context Understanding**: May miss business logic nuances
- **Performance Trade-offs**: Some refactorings may add overhead
- **Style Preferences**: Subjective coding style choices
- **Existing Tests**: May need test updates after refactoring

## Tips

- Run refactoring assistant regularly during development
- Combine with linters and formatters
- Use complexity thresholds in CI/CD pipelines
- Refactor before adding new features
- Document why refactorings were made
- Get peer review on major refactorings

## Related Skills

- **performance-profiler-optimizer**: Optimize performance bottlenecks
- **technical-documentation-writer**: Document refactored code
- **security-scanner**: Check for security issues

## Installation

This skill is available for use in:
- Claude.ai web interface
- Claude Code (desktop application)
- Claude API integrations

No additional installation required - activate the skill and start refactoring!
