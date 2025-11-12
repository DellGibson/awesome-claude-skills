/**
 * Data Visualization Builder
 * Creates charts and dashboards from data
 */

class DataVisualizationBuilder {
  constructor() {
    this.chartTypes = ['line', 'bar', 'pie', 'scatter', 'heatmap', 'area'];
    this.libraries = ['chartjs', 'd3', 'matplotlib', 'plotly'];
  }

  /**
   * Build visualization
   */
  build(data, options = {}) {
    const parsedData = this.parseData(data);
    const chartType = options.chartType === 'auto' ? this.recommendChartType(parsedData) : options.chartType;
    const chartCode = this.generateChartCode(parsedData, chartType, options.library);
    const htmlTemplate = this.generateHTML(chartCode, options.library);
    const insights = options.includeInsights ? this.analyzeData(parsedData) : [];
    const chartRecommendation = this.explainRecommendation(parsedData, chartType);

    return {
      chartCode,
      htmlTemplate,
      insights,
      chartRecommendation,
      chartType
    };
  }

  /**
   * Parse data from CSV or JSON
   */
  parseData(data) {
    // Try JSON first
    try {
      return JSON.parse(data);
    } catch (e) {
      // Parse as CSV
      return this.parseCSV(data);
    }
  }

  /**
   * Parse CSV data
   */
  parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = isNaN(values[idx]) ? values[idx] : Number(values[idx]);
      });
      data.push(row);
    }

    return { headers, data };
  }

  /**
   * Recommend chart type based on data
   */
  recommendChartType(parsedData) {
    const data = parsedData.data || parsedData;

    if (Array.isArray(data) && data.length > 0) {
      const firstRow = data[0];
      const keys = Object.keys(firstRow);

      // Time series data
      if (keys.some(k => k.toLowerCase().includes('date') || k.toLowerCase().includes('time') || k.toLowerCase().includes('month'))) {
        return 'line';
      }

      // Categorical data
      if (keys.length === 2 && typeof firstRow[keys[1]] === 'number') {
        return 'bar';
      }

      // Multiple numeric columns
      const numericCols = keys.filter(k => typeof firstRow[k] === 'number');
      if (numericCols.length >= 2) {
        return 'scatter';
      }
    }

    return 'bar'; // default
  }

  /**
   * Generate Chart.js code
   */
  generateChartCode(parsedData, chartType, library) {
    if (library === 'chartjs') {
      return this.generateChartJS(parsedData, chartType);
    } else if (library === 'd3') {
      return this.generateD3(parsedData, chartType);
    } else if (library === 'matplotlib') {
      return this.generateMatplotlib(parsedData, chartType);
    }

    return this.generateChartJS(parsedData, chartType);
  }

  /**
   * Generate Chart.js code
   */
  generateChartJS(parsedData, chartType) {
    const data = parsedData.data || parsedData;
    const labels = data.map(row => Object.values(row)[0]);
    const values = data.map(row => Object.values(row)[1]);

    let code = `const ctx = document.getElementById('myChart').getContext('2d');\n`;
    code += `new Chart(ctx, {\n`;
    code += `  type: '${chartType}',\n`;
    code += `  data: {\n`;
    code += `    labels: ${JSON.stringify(labels)},\n`;
    code += `    datasets: [{\n`;
    code += `      label: 'Dataset',\n`;
    code += `      data: ${JSON.stringify(values)},\n`;
    code += `      backgroundColor: 'rgba(54, 162, 235, 0.5)',\n`;
    code += `      borderColor: 'rgba(54, 162, 235, 1)',\n`;
    code += `      borderWidth: 1\n`;
    code += `    }]\n`;
    code += `  },\n`;
    code += `  options: {\n`;
    code += `    responsive: true,\n`;
    code += `    plugins: {\n`;
    code += `      legend: { position: 'top' },\n`;
    code += `      title: { display: true, text: 'Data Visualization' }\n`;
    code += `    }\n`;
    code += `  }\n`;
    code += `});\n`;

    return code;
  }

  /**
   * Generate D3.js code
   */
  generateD3(parsedData, chartType) {
    let code = `// D3.js visualization\n`;
    code += `const data = ${JSON.stringify(parsedData.data || parsedData)};\n\n`;
    code += `const svg = d3.select('body')\n`;
    code += `  .append('svg')\n`;
    code += `  .attr('width', 600)\n`;
    code += `  .attr('height', 400);\n\n`;
    code += `// Add your D3 visualization code here\n`;

    return code;
  }

  /**
   * Generate matplotlib code
   */
  generateMatplotlib(parsedData, chartType) {
    const data = parsedData.data || parsedData;
    const labels = data.map(row => Object.values(row)[0]);
    const values = data.map(row => Object.values(row)[1]);

    let code = `import matplotlib.pyplot as plt\n\n`;
    code += `labels = ${JSON.stringify(labels)}\n`;
    code += `values = ${JSON.stringify(values)}\n\n`;
    code += `plt.${chartType}(labels, values)\n`;
    code += `plt.xlabel('Category')\n`;
    code += `plt.ylabel('Value')\n`;
    code += `plt.title('Data Visualization')\n`;
    code += `plt.show()\n`;

    return code;
  }

  /**
   * Generate HTML template
   */
  generateHTML(chartCode, library) {
    let html = `<!DOCTYPE html>\n`;
    html += `<html lang="en">\n`;
    html += `<head>\n`;
    html += `  <meta charset="UTF-8">\n`;
    html += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
    html += `  <title>Data Visualization</title>\n`;

    if (library === 'chartjs') {
      html += `  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n`;
    } else if (library === 'd3') {
      html += `  <script src="https://d3js.org/d3.v7.min.js"></script>\n`;
    }

    html += `</head>\n`;
    html += `<body>\n`;
    html += `  <canvas id="myChart"></canvas>\n`;
    html += `  <script>\n`;
    html += `    ${chartCode}\n`;
    html += `  </script>\n`;
    html += `</body>\n`;
    html += `</html>\n`;

    return html;
  }

  /**
   * Analyze data for insights
   */
  analyzeData(parsedData) {
    const insights = [];
    const data = parsedData.data || parsedData;

    if (Array.isArray(data) && data.length > 0) {
      const values = data.map(row => Object.values(row)[1]).filter(v => typeof v === 'number');

      if (values.length > 0) {
        // Total
        const total = values.reduce((sum, val) => sum + val, 0);
        insights.push({
          type: 'total',
          description: 'Total sum',
          value: total.toFixed(2)
        });

        // Average
        const avg = total / values.length;
        insights.push({
          type: 'average',
          description: 'Average value',
          value: avg.toFixed(2)
        });

        // Max
        const max = Math.max(...values);
        const maxIndex = values.indexOf(max);
        insights.push({
          type: 'maximum',
          description: `Highest value at index ${maxIndex}`,
          value: max.toString()
        });

        // Trend
        if (values.length >= 3) {
          const firstHalf = values.slice(0, Math.floor(values.length / 2));
          const secondHalf = values.slice(Math.floor(values.length / 2));
          const firstAvg = firstHalf.reduce((s, v) => s + v, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((s, v) => s + v, 0) / secondHalf.length;

          const trend = secondAvg > firstAvg ? 'increasing' : 'decreasing';
          insights.push({
            type: 'trend',
            description: `Data is ${trend} over time`,
            value: `${((secondAvg / firstAvg - 1) * 100).toFixed(1)}%`
          });
        }
      }
    }

    return insights;
  }

  /**
   * Explain chart recommendation
   */
  explainRecommendation(parsedData, chartType) {
    const explanations = {
      line: 'Line chart recommended for time series data to show trends over time',
      bar: 'Bar chart recommended for categorical data comparison',
      pie: 'Pie chart recommended for showing proportions of a whole',
      scatter: 'Scatter plot recommended for showing correlation between two variables',
      heatmap: 'Heatmap recommended for showing patterns in multi-dimensional data',
      area: 'Area chart recommended for cumulative data visualization'
    };

    return explanations[chartType] || 'Chart type selected based on data structure';
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataVisualizationBuilder;
}

// Demo
if (require.main === module) {
  const builder = new DataVisualizationBuilder();

  const csvData = `month,sales
Jan,12
Feb,19
Mar,3
Apr,5
May,2
Jun,3`;

  const result = builder.build(csvData, {
    chartType: 'auto',
    library: 'chartjs',
    includeInsights: true,
    theme: 'light'
  });

  console.log('=== Chart Code ===');
  console.log(result.chartCode);
  console.log('\n=== Insights ===');
  console.log(JSON.stringify(result.insights, null, 2));
}
