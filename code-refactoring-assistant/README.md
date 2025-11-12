# Code Refactoring Assistant

Analyze code for quality issues and get specific refactoring recommendations. Detects code smells, calculates complexity metrics, and provides before/after examples for JavaScript, TypeScript, Python, and Go.

## Features

- **Code Smell Detection**: Long methods, complex conditionals, duplicate code
- **Complexity Metrics**: Cyclomatic, cognitive, Halstead complexity
- **Refactoring Suggestions**: Extract method, simplify conditionals, remove duplication
- **Before/After Examples**: Clear demonstrations of improvements
- **Measurable Improvements**: Quantifies complexity reduction and LOC savings
- **Testing Guidance**: Suggests how to test refactored code
- **Multi-Language**: JavaScript, TypeScript, Python, Go

## Installation

### Claude.ai

1. Open [Claude.ai](https://claude.ai)
2. Start a new conversation
3. Upload or reference the `code-refactoring-assistant` skill
4. Claude will automatically use this skill for code refactoring tasks

### Claude Code

1. Open Claude Code
2. Navigate to Skills > Install Skill
3. Select `code-refactoring-assistant`
4. Activate the skill in your project

### Claude API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["code-refactoring-assistant"],
    messages=[{
        "role": "user",
        "content": "Analyze this code and suggest refactorings: [paste code]"
    }]
)
```

## Usage

### Basic Example

Ask Claude:
> "Analyze this function and suggest refactorings to improve maintainability: [paste your code]"

### Output

Claude will provide:

1. **Issue Report** - Detected code smells with severity
2. **Refactored Code** - Improved version with explanations
3. **Metrics Comparison** - Before/after complexity metrics
4. **Refactoring List** - Applied improvements with benefits
5. **Testing Suggestions** - How to test the refactored code

### Advanced Usage

Specify your goals:

- **reduce-complexity**: Focus on lowering cyclomatic complexity
- **improve-readability**: Make code easier to understand
- **remove-duplication**: Eliminate repeated code
- **extract-functions**: Break down large methods

Example prompt:
> "Refactor this 100-line function focusing on reducing complexity below 10 and extracting smaller functions"

## Best Practices

### Keep Functions Small

```javascript
// Before: 50 lines, complexity 15
function processEverything(data) {
  // validation
  // transformation
  // calculation
  // formatting
}

// After: 5-10 lines each, complexity 2-3
function processEverything(data) {
  validate(data);
  const transformed = transform(data);
  const result = calculate(transformed);
  return format(result);
}
```

### Use Early Returns

```javascript
// Before: Nested if statements
function getDiscount(user) {
  if (user) {
    if (user.isPremium) {
      if (user.loyaltyPoints > 1000) {
        return 0.2;
      }
    }
  }
  return 0;
}

// After: Early returns
function getDiscount(user) {
  if (!user) return 0;
  if (!user.isPremium) return 0;
  if (user.loyaltyPoints <= 1000) return 0;
  return 0.2;
}
```

### Extract Constants

```javascript
// Before: Magic numbers
if (price > 100 && quantity > 5) {
  discount = price * 0.15;
}

// After: Named constants
const BULK_PRICE_THRESHOLD = 100;
const BULK_QUANTITY_THRESHOLD = 5;
const BULK_DISCOUNT_RATE = 0.15;

if (price > BULK_PRICE_THRESHOLD && quantity > BULK_QUANTITY_THRESHOLD) {
  discount = price * BULK_DISCOUNT_RATE;
}
```

### Replace Conditionals

```javascript
// Before: Long if-else chain
function getShippingCost(method) {
  if (method === 'standard') return 5;
  else if (method === 'express') return 15;
  else if (method === 'overnight') return 25;
  else return 10;
}

// After: Object lookup
const SHIPPING_COSTS = {
  standard: 5,
  express: 15,
  overnight: 25,
  default: 10
};

function getShippingCost(method) {
  return SHIPPING_COSTS[method] || SHIPPING_COSTS.default;
}
```

## Complexity Guidelines

### Target Metrics

- **Cyclomatic Complexity**: < 10 (ideal), < 15 (acceptable)
- **Function Length**: < 20 lines (ideal), < 50 (max)
- **Parameters**: < 4 (ideal), < 6 (max)
- **Nesting Depth**: < 3 levels (ideal), < 4 (max)

### Measuring Complexity

```javascript
// Cyclomatic Complexity = decision points + 1
function example(x, y) {  // +1 (entry point)
  if (x > 0) {           // +1 (decision)
    if (y > 0) {         // +1 (decision)
      return x + y;
    }
  }
  return 0;
}
// Total: 3
```

## Common Refactoring Patterns

### Extract Method

Break large functions into smaller ones:

```javascript
// Extract validation
// Extract calculation
// Extract formatting
```

### Replace Temp with Query

Replace temporary variables with method calls:

```javascript
// Before
const basePrice = quantity * itemPrice;
const discount = basePrice * 0.1;
return basePrice - discount;

// After
return getBasePrice() - getDiscount();
```

### Introduce Parameter Object

Group related parameters:

```javascript
// Before
function createUser(name, email, age, address, phone) {}

// After
function createUser(userInfo) {
  // userInfo = { name, email, age, address, phone }
}
```

### Decompose Conditional

Extract complex conditions:

```javascript
// Before
if (date.before(SUMMER_START) || date.after(SUMMER_END)) {}

// After
if (isWinter(date)) {}

function isWinter(date) {
  return date.before(SUMMER_START) || date.after(SUMMER_END);
}
```

## Integration Ideas

### Pre-Commit Hooks

```bash
# .git/hooks/pre-commit
npm run lint
npm run complexity-check
```

### CI/CD Pipeline

```yaml
# .github/workflows/quality.yml
- name: Check complexity
  run: |
    npm run complexity -- --max 10
```

### Code Review

Use refactoring assistant before submitting PRs to catch issues early.

## Limitations

- May not understand domain-specific business logic
- Some refactorings may impact performance
- Subjective style preferences
- May require test updates

## Related Skills

- **performance-profiler-optimizer**: Optimize performance bottlenecks
- **technical-documentation-writer**: Document refactored code
- **security-scanner**: Check for security issues

## Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
