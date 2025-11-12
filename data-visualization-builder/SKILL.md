---
name: data-visualization-builder
description: Creates Chart.js and D3.js visualizations, generates interactive dashboards, and produces static charts from CSV and JSON data with insights
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: creative-media
tags:
  - visualization
  - charts
  - dashboard
  - data-analysis
  - d3
  - chartjs
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# Data Visualization Builder

Generate interactive charts, dashboards, and data visualizations from CSV/JSON data using Chart.js, D3.js, and static exports. Includes automated insights and chart recommendations.

## What It Does

1. **Creates Charts** - Line, bar, pie, scatter, heatmaps
2. **Generates Code** - Chart.js, D3.js, Python (matplotlib)
3. **Analyzes Data** - Finds trends, outliers, correlations
4. **Recommends Charts** - Best visualization for data type
5. **Interactive Dashboards** - Multi-chart layouts
6. **Export Options** - PNG, SVG, PDF static exports

## Key Features

- **Chart Types**: Line, bar, pie, scatter, heatmap, area, radar
- **Libraries**: Chart.js, D3.js, matplotlib, Plotly
- **Data Formats**: CSV, JSON, arrays, objects
- **Insights**: Automatic trend detection
- **Responsive**: Mobile-friendly charts
- **Customization**: Colors, themes, labels

## When to Use

- Visualize data analysis results
- Create dashboards for reports
- Generate charts for presentations
- Explore data patterns
- Share insights visually

## Example Output

### Chart.js Bar Chart

```javascript
const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});
```

### Insights

- **Trend**: Sales peaked in February
- **Total**: 44 units sold
- **Average**: 7.3 units per month
- **Recommendation**: Investigate February spike

## Installation

Available in Claude.ai, Claude Code, and Claude API.

## License

Apache-2.0
