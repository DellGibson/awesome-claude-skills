/**
 * Tests for Kubernetes Manifest Generator
 */

const KubernetesManifestGenerator = require('../src/index');

describe('KubernetesManifestGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new KubernetesManifestGenerator();
  });

  describe('constructor', () => {
    it('should initialize with environment defaults', () => {
      expect(generator.environmentDefaults).toHaveProperty('dev');
      expect(generator.environmentDefaults).toHaveProperty('staging');
      expect(generator.environmentDefaults).toHaveProperty('production');
    });

    it('should define resource requirements for each environment', () => {
      expect(generator.environmentDefaults.dev.replicas).toBe(1);
      expect(generator.environmentDefaults.staging.replicas).toBe(2);
      expect(generator.environmentDefaults.production.replicas).toBe(3);
    });
  });

  describe('generate', () => {
    const basicConfig = {
      appName: 'test-app',
      image: 'myregistry/test-app:1.0.0',
      port: 3000
    };

    it('should generate complete manifest set', () => {
      const result = generator.generate(basicConfig);

      expect(result).toHaveProperty('manifests');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('deploymentCommands');
      expect(result).toHaveProperty('bestPractices');
    });

    it('should always generate deployment and service', () => {
      const result = generator.generate(basicConfig);

      expect(result.manifests).toHaveProperty('deployment');
      expect(result.manifests).toHaveProperty('service');
    });

    it('should generate ConfigMap when env vars provided', () => {
      const result = generator.generate({
        ...basicConfig,
        envVars: { API_URL: 'https://api.example.com' }
      });

      expect(result.manifests).toHaveProperty('configMap');
    });

    it('should generate Secret when secrets provided', () => {
      const result = generator.generate({
        ...basicConfig,
        secrets: { DB_PASSWORD: 'secret123' }
      });

      expect(result.manifests).toHaveProperty('secret');
    });

    it('should generate Ingress when enabled', () => {
      const result = generator.generate({
        ...basicConfig,
        enableIngress: true,
        ingressHost: 'app.example.com'
      });

      expect(result.manifests).toHaveProperty('ingress');
    });

    it('should generate HPA when autoscaling enabled', () => {
      const result = generator.generate({
        ...basicConfig,
        enableAutoscaling: true
      });

      expect(result.manifests).toHaveProperty('hpa');
    });
  });

  describe('buildConfig', () => {
    it('should apply environment defaults', () => {
      const config = generator.buildConfig({
        appName: 'test',
        image: 'test:1.0.0',
        port: 8080,
        environment: 'production'
      });

      expect(config.replicas).toBe(3);
      expect(config.environment).toBe('production');
    });

    it('should allow overriding defaults', () => {
      const config = generator.buildConfig({
        appName: 'test',
        image: 'test:1.0.0',
        port: 8080,
        environment: 'production',
        replicas: 5
      });

      expect(config.replicas).toBe(5);
    });

    it('should default to dev environment', () => {
      const config = generator.buildConfig({
        appName: 'test',
        image: 'test:1.0.0',
        port: 8080
      });

      expect(config.environment).toBe('dev');
    });
  });

  describe('generateDeployment', () => {
    it('should generate valid Deployment YAML', () => {
      const config = {
        appName: 'test-app',
        image: 'nginx:latest',
        port: 80,
        namespace: 'default',
        replicas: 2,
        environment: 'production',
        resources: {
          requests: { cpu: '100m', memory: '128Mi' },
          limits: { cpu: '200m', memory: '256Mi' }
        },
        healthCheckPath: '/health',
        readinessCheckPath: '/ready',
        healthCheckConfig: {
          initialDelaySeconds: 30,
          periodSeconds: 10,
          timeoutSeconds: 5,
          failureThreshold: 3
        }
      };

      const deployment = generator.generateDeployment(config);

      expect(deployment).toContain('apiVersion: apps/v1');
      expect(deployment).toContain('kind: Deployment');
      expect(deployment).toContain('name: test-app');
      expect(deployment).toContain('replicas: 2');
      expect(deployment).toContain('image: nginx:latest');
    });

    it('should include security context', () => {
      const config = {
        appName: 'secure-app',
        image: 'app:1.0.0',
        port: 8080,
        namespace: 'default',
        replicas: 1,
        environment: 'dev',
        resources: {},
        healthCheckPath: '/health',
        readinessCheckPath: '/ready',
        healthCheckConfig: {}
      };

      const deployment = generator.generateDeployment(config);

      expect(deployment).toContain('runAsNonRoot: true');
      expect(deployment).toContain('allowPrivilegeEscalation: false');
    });

    it('should include health checks', () => {
      const config = {
        appName: 'app',
        image: 'app:1.0.0',
        port: 8080,
        namespace: 'default',
        replicas: 1,
        environment: 'dev',
        resources: {},
        healthCheckPath: '/health',
        readinessCheckPath: '/ready',
        healthCheckConfig: {
          initialDelaySeconds: 10,
          periodSeconds: 30,
          timeoutSeconds: 5,
          failureThreshold: 5
        }
      };

      const deployment = generator.generateDeployment(config);

      expect(deployment).toContain('livenessProbe:');
      expect(deployment).toContain('readinessProbe:');
      expect(deployment).toContain('/health');
      expect(deployment).toContain('/ready');
    });
  });

  describe('generateService', () => {
    it('should generate valid Service YAML', () => {
      const config = {
        appName: 'test-app',
        port: 3000,
        namespace: 'default',
        serviceType: 'ClusterIP'
      };

      const service = generator.generateService(config);

      expect(service).toContain('apiVersion: v1');
      expect(service).toContain('kind: Service');
      expect(service).toContain('name: test-app');
      expect(service).toContain('type: ClusterIP');
    });

    it('should map ports correctly', () => {
      const config = {
        appName: 'app',
        port: 8080,
        namespace: 'default',
        serviceType: 'LoadBalancer'
      };

      const service = generator.generateService(config);

      expect(service).toContain('port: 80');
      expect(service).toContain('targetPort: 8080');
    });
  });

  describe('generateConfigMap', () => {
    it('should generate ConfigMap with env vars', () => {
      const config = {
        appName: 'app',
        namespace: 'default',
        envVars: {
          LOG_LEVEL: 'info',
          API_URL: 'https://api.example.com'
        }
      };

      const configMap = generator.generateConfigMap(config);

      expect(configMap).toContain('kind: ConfigMap');
      expect(configMap).toContain('LOG_LEVEL: info');
      expect(configMap).toContain('API_URL: https://api.example.com');
    });
  });

  describe('generateSecret', () => {
    it('should generate Secret manifest', () => {
      const config = {
        appName: 'app',
        namespace: 'default',
        secrets: {
          DB_PASSWORD: 'secret123',
          API_KEY: 'key456'
        }
      };

      const secret = generator.generateSecret(config);

      expect(secret).toContain('kind: Secret');
      expect(secret).toContain('type: Opaque');
      expect(secret).toContain('DB_PASSWORD:');
      expect(secret).toContain('API_KEY:');
    });
  });

  describe('generateIngress', () => {
    it('should generate Ingress with host', () => {
      const config = {
        appName: 'app',
        namespace: 'default',
        ingressHost: 'app.example.com',
        environment: 'production',
        enableTLS: true
      };

      const ingress = generator.generateIngress(config);

      expect(ingress).toContain('kind: Ingress');
      expect(ingress).toContain('host: app.example.com');
    });

    it('should include TLS configuration when enabled', () => {
      const config = {
        appName: 'app',
        namespace: 'default',
        ingressHost: 'secure.example.com',
        environment: 'production',
        enableTLS: true
      };

      const ingress = generator.generateIngress(config);

      expect(ingress).toContain('tls:');
      expect(ingress).toContain('secretName:');
    });
  });

  describe('generateHPA', () => {
    it('should generate HorizontalPodAutoscaler', () => {
      const config = {
        appName: 'app',
        namespace: 'default',
        minReplicas: 2,
        maxReplicas: 10
      };

      const hpa = generator.generateHPA(config);

      expect(hpa).toContain('kind: HorizontalPodAutoscaler');
      expect(hpa).toContain('minReplicas: 2');
      expect(hpa).toContain('maxReplicas: 10');
    });

    it('should include CPU and memory metrics', () => {
      const config = {
        appName: 'app',
        namespace: 'default',
        minReplicas: 2,
        maxReplicas: 10
      };

      const hpa = generator.generateHPA(config);

      expect(hpa).toContain('cpu');
      expect(hpa).toContain('memory');
    });
  });

  describe('generateSummary', () => {
    it('should provide deployment summary', () => {
      const config = {
        appName: 'my-app',
        environment: 'production',
        namespace: 'prod',
        replicas: 3,
        resources: {
          requests: { cpu: '250m', memory: '512Mi' }
        }
      };
      const manifests = { deployment: 'yaml', service: 'yaml' };

      const summary = generator.generateSummary(config, manifests);

      expect(summary).toHaveProperty('appName', 'my-app');
      expect(summary).toHaveProperty('environment', 'production');
      expect(summary).toHaveProperty('replicas', 3);
      expect(summary).toHaveProperty('estimatedCost');
    });
  });

  describe('generateDeploymentCommands', () => {
    it('should provide kubectl commands', () => {
      const config = {
        appName: 'app',
        namespace: 'production',
        enableIngress: true
      };
      const manifests = {
        deployment: 'yaml',
        service: 'yaml',
        ingress: 'yaml'
      };

      const commands = generator.generateDeploymentCommands(config, manifests);

      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
      expect(commands.some(c => c.command.includes('kubectl apply'))).toBe(true);
    });

    it('should include namespace creation for non-default namespace', () => {
      const config = {
        appName: 'app',
        namespace: 'custom-namespace'
      };
      const manifests = { deployment: 'yaml' };

      const commands = generator.generateDeploymentCommands(config, manifests);

      expect(commands.some(c => c.command.includes('create namespace'))).toBe(true);
    });
  });

  describe('generateBestPractices', () => {
    it('should list implemented best practices', () => {
      const config = {
        enableAutoscaling: true,
        enableIngress: true,
        enableTLS: true
      };

      const practices = generator.generateBestPractices(config);

      expect(Array.isArray(practices)).toBe(true);
      expect(practices.length).toBeGreaterThan(0);
      expect(practices.every(p => p.hasOwnProperty('implemented'))).toBe(true);
    });
  });

  describe('integration', () => {
    it('should generate production-ready Kubernetes manifests', () => {
      const config = {
        appName: 'web-api',
        image: 'myregistry/web-api:1.0.0',
        port: 3000,
        environment: 'production',
        namespace: 'production',
        enableIngress: true,
        ingressHost: 'api.example.com',
        enableTLS: true,
        enableAutoscaling: true,
        minReplicas: 3,
        maxReplicas: 10,
        envVars: {
          NODE_ENV: 'production',
          LOG_LEVEL: 'info'
        },
        secrets: {
          DATABASE_PASSWORD: 'secretpass',
          API_KEY: 'secret-key'
        }
      };

      const result = generator.generate(config);

      // Check all manifests are generated
      expect(result.manifests.deployment).toBeTruthy();
      expect(result.manifests.service).toBeTruthy();
      expect(result.manifests.configMap).toBeTruthy();
      expect(result.manifests.secret).toBeTruthy();
      expect(result.manifests.ingress).toBeTruthy();
      expect(result.manifests.hpa).toBeTruthy();

      // Check summary
      expect(result.summary.appName).toBe('web-api');
      expect(result.summary.environment).toBe('production');
      expect(result.summary.resourcesGenerated.length).toBe(6);

      // Check deployment commands
      expect(result.deploymentCommands.length).toBeGreaterThan(0);

      // Check best practices
      expect(result.bestPractices.length).toBeGreaterThan(0);
      expect(result.bestPractices.some(p => p.category === 'Security' && p.implemented)).toBe(true);
    });
  });
});
