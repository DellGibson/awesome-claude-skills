/**
 * Tests for Data Visualization Builder
 */

const DataVisualizationBuilder = require('../src/index');

describe('DataVisualizationBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new DataVisualizationBuilder();
  });

  describe('constructor', () => {
    it('should initialize with supported chart types', () => {
      expect(builder.supportedChartTypes).toContain('bar');
      expect(builder.supportedChartTypes).toContain('line');
      expect(builder.supportedChartTypes).toContain('pie');
      expect(builder.supportedChartTypes).toContain('scatter');
    });

    it('should support multiple output formats', () => {
      expect(builder.outputFormats).toContain('chartjs');
      expect(builder.outputFormats).toContain('d3');
      expect(builder.outputFormats).toContain('plotly');
    });
  });

  describe('build', () => {
    const sampleData = [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
      { name: 'C', value: 30 }
    ];

    it('should generate visualization code', () => {
      const result = builder.build(sampleData, 'bar', 'chartjs', {});

      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('config');
      expect(result).toHaveProperty('html');
    });

    it('should include data analysis', () => {
      const result = builder.build(sampleData, 'bar', 'chartjs', {
        includeAnalysis: true
      });

      expect(result).toHaveProperty('analysis');
    });
  });

  describe('analyzeData', () => {
    it('should detect data types', () => {
      const data = [
        { category: 'A', value: 10, date: '2024-01-01' }
      ];

      const analysis = builder.analyzeData(data);

      expect(analysis).toHaveProperty('columns');
      expect(analysis.columns).toHaveProperty('category');
      expect(analysis.columns).toHaveProperty('value');
    });

    it('should calculate statistics', () => {
      const data = [
        { value: 10 },
        { value: 20 },
        { value: 30 }
      ];

      const analysis = builder.analyzeData(data);

      expect(analysis).toHaveProperty('statistics');
      expect(analysis.statistics.value).toHaveProperty('min');
      expect(analysis.statistics.value).toHaveProperty('max');
      expect(analysis.statistics.value).toHaveProperty('mean');
    });
  });

  describe('recommendChartType', () => {
    it('should recommend bar chart for categorical data', () => {
      const data = [
        { category: 'A', value: 10 },
        { category: 'B', value: 20 }
      ];

      const recommendation = builder.recommendChartType(data);

      expect(recommendation).toHaveProperty('type');
      expect(['bar', 'column']).toContain(recommendation.type);
    });

    it('should recommend line chart for time series', () => {
      const data = [
        { date: '2024-01-01', value: 10 },
        { date: '2024-01-02', value: 20 }
      ];

      const recommendation = builder.recommendChartType(data);

      expect(recommendation.type).toBe('line');
    });

    it('should recommend scatter for correlation analysis', () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 }
      ];

      const recommendation = builder.recommendChartType(data);

      expect(recommendation).toHaveProperty('type');
    });
  });

  describe('generateChartJS', () => {
    it('should generate Chart.js configuration', () => {
      const data = [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 }
      ];

      const config = builder.generateChartJS(data, 'bar', {});

      expect(config).toHaveProperty('type');
      expect(config).toHaveProperty('data');
      expect(config).toHaveProperty('options');
    });

    it('should include labels and datasets', () => {
      const data = [
        { label: 'Item 1', value: 100 },
        { label: 'Item 2', value: 200 }
      ];

      const config = builder.generateChartJS(data, 'bar', {});

      expect(config.data).toHaveProperty('labels');
      expect(config.data).toHaveProperty('datasets');
      expect(config.data.datasets.length).toBeGreaterThan(0);
    });
  });

  describe('generateD3', () => {
    it('should generate D3.js code', () => {
      const data = [{ x: 1, y: 2 }];
      const code = builder.generateD3(data, 'scatter', {});

      expect(code).toContain('d3');
      expect(typeof code).toBe('string');
    });
  });

  describe('generatePlotly', () => {
    it('should generate Plotly configuration', () => {
      const data = [{ name: 'A', value: 10 }];
      const config = builder.generatePlotly(data, 'bar', {});

      expect(config).toHaveProperty('data');
      expect(config).toHaveProperty('layout');
    });
  });

  describe('generateHTML', () => {
    it('should create standalone HTML page', () => {
      const chartCode = 'console.log("chart");';
      const html = builder.generateHTML(chartCode, 'chartjs', {
        title: 'My Chart'
      });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('My Chart');
    });

    it('should include required libraries', () => {
      const html = builder.generateHTML('', 'chartjs', {});

      expect(html).toContain('chart.js');
    });
  });

  describe('customizeColors', () => {
    it('should apply color scheme', () => {
      const config = {
        data: {
          datasets: [{ data: [1, 2, 3] }]
        }
      };

      const customized = builder.customizeColors(config, 'blue');

      expect(customized.data.datasets[0]).toHaveProperty('backgroundColor');
    });

    it('should support custom color arrays', () => {
      const config = {
        data: {
          datasets: [{ data: [1, 2] }]
        }
      };

      const customized = builder.customizeColors(config, ['#ff0000', '#00ff00']);

      expect(Array.isArray(customized.data.datasets[0].backgroundColor)).toBe(true);
    });
  });

  describe('integration', () => {
    it('should build complete visualization from raw data', () => {
      const salesData = [
        { month: 'Jan', revenue: 45000, expenses: 32000 },
        { month: 'Feb', revenue: 52000, expenses: 35000 },
        { month: 'Mar', revenue: 48000, expenses: 33000 },
        { month: 'Apr', revenue: 61000, expenses: 38000 },
        { month: 'May', revenue: 55000, expenses: 36000 },
        { month: 'Jun', revenue: 67000, expenses: 41000 }
      ];

      const result = builder.build(salesData, 'line', 'chartjs', {
        title: 'Monthly Revenue & Expenses',
        includeAnalysis: true,
        responsive: true,
        legend: true,
        colorScheme: 'professional'
      });

      expect(result.code).toBeTruthy();
      expect(result.config).toHaveProperty('type', 'line');
      expect(result.config.data.labels.length).toBe(6);
      expect(result.config.data.datasets.length).toBeGreaterThan(0);
      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.html).toContain('Monthly Revenue & Expenses');
      expect(result.analysis).toBeDefined();
      expect(result.analysis.statistics).toBeDefined();
    });
  });
});
