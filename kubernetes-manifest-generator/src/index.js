/**
 * Kubernetes Manifest Generator
 * Generates production-ready Kubernetes YAML manifests for containerized applications
 */

class KubernetesManifestGenerator {
  constructor() {
    this.environmentDefaults = {
      dev: {
        replicas: 1,
        resources: {
          requests: { cpu: '100m', memory: '256Mi' },
          limits: { cpu: '200m', memory: '512Mi' }
        },
        healthCheckConfig: {
          initialDelaySeconds: 10,
          periodSeconds: 30,
          timeoutSeconds: 5,
          failureThreshold: 5
        }
      },
      staging: {
        replicas: 2,
        resources: {
          requests: { cpu: '200m', memory: '512Mi' },
          limits: { cpu: '400m', memory: '1Gi' }
        },
        healthCheckConfig: {
          initialDelaySeconds: 20,
          periodSeconds: 15,
          timeoutSeconds: 5,
          failureThreshold: 3
        }
      },
      production: {
        replicas: 3,
        resources: {
          requests: { cpu: '250m', memory: '512Mi' },
          limits: { cpu: '500m', memory: '1Gi' }
        },
        healthCheckConfig: {
          initialDelaySeconds: 30,
          periodSeconds: 10,
          timeoutSeconds: 5,
          failureThreshold: 3
        }
      }
    };
  }

  /**
   * Main entry point - generates complete Kubernetes manifest set
   */
  generate(options) {
    const config = this.buildConfig(options);
    const manifests = {};

    // Generate core resources
    manifests.deployment = this.generateDeployment(config);
    manifests.service = this.generateService(config);

    // Generate optional resources
    if (config.envVars && Object.keys(config.envVars).length > 0) {
      manifests.configMap = this.generateConfigMap(config);
    }

    if (config.secrets && Object.keys(config.secrets).length > 0) {
      manifests.secret = this.generateSecret(config);
    }

    if (config.enableIngress) {
      manifests.ingress = this.generateIngress(config);
    }

    if (config.enableAutoscaling) {
      manifests.hpa = this.generateHPA(config);
    }

    // Generate deployment summary and commands
    const summary = this.generateSummary(config, manifests);
    const deploymentCommands = this.generateDeploymentCommands(config, manifests);
    const bestPractices = this.generateBestPractices(config);

    return {
      manifests,
      summary,
      deploymentCommands,
      bestPractices
    };
  }

  /**
   * Build configuration with defaults
   */
  buildConfig(options) {
    const envDefaults = this.environmentDefaults[options.environment || 'dev'];

    return {
      appName: options.appName,
      image: options.image,
      port: options.port,
      environment: options.environment || 'dev',
      namespace: options.namespace || 'default',
      replicas: options.replicas || envDefaults.replicas,
      serviceType: options.serviceType || 'ClusterIP',
      enableIngress: options.enableIngress || false,
      ingressHost: options.ingressHost,
      enableTLS: options.enableTLS !== false,
      enableAutoscaling: options.enableAutoscaling || false,
      minReplicas: options.minReplicas || 2,
      maxReplicas: options.maxReplicas || 10,
      envVars: options.envVars || {},
      secrets: options.secrets || {},
      healthCheckPath: options.healthCheckPath || '/health',
      readinessCheckPath: options.readinessCheckPath || '/ready',
      resources: options.resources || envDefaults.resources,
      healthCheckConfig: envDefaults.healthCheckConfig
    };
  }

  /**
   * Generate Deployment manifest
   */
  generateDeployment(config) {
    const labels = {
      app: config.appName,
      environment: config.environment,
      version: 'v1.0.0'
    };

    const deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: config.appName,
        namespace: config.namespace,
        labels: labels
      },
      spec: {
        replicas: config.replicas,
        strategy: {
          type: 'RollingUpdate',
          rollingUpdate: {
            maxSurge: 1,
            maxUnavailable: 0
          }
        },
        selector: {
          matchLabels: { app: config.appName }
        },
        template: {
          metadata: {
            labels: labels
          },
          spec: {
            securityContext: {
              runAsNonRoot: true,
              runAsUser: 1000,
              fsGroup: 1000
            },
            containers: [{
              name: config.appName,
              image: config.image,
              imagePullPolicy: 'IfNotPresent',
              ports: [{
                containerPort: config.port,
                name: 'http',
                protocol: 'TCP'
              }],
              env: this.buildEnvVars(config),
              resources: config.resources,
              livenessProbe: {
                httpGet: {
                  path: config.healthCheckPath,
                  port: config.port
                },
                ...config.healthCheckConfig
              },
              readinessProbe: {
                httpGet: {
                  path: config.readinessCheckPath,
                  port: config.port
                },
                initialDelaySeconds: 10,
                periodSeconds: 5,
                timeoutSeconds: 3,
                failureThreshold: 2
              },
              securityContext: {
                allowPrivilegeEscalation: false,
                readOnlyRootFilesystem: true,
                capabilities: {
                  drop: ['ALL']
                }
              }
            }]
          }
        }
      }
    };

    return this.toYAML(deployment);
  }

  /**
   * Build environment variables for container
   */
  buildEnvVars(config) {
    const envVars = [];

    // Add ConfigMap references
    for (const [key, value] of Object.entries(config.envVars)) {
      if (Object.keys(config.envVars).length > 0) {
        envVars.push({
          name: key,
          valueFrom: {
            configMapKeyRef: {
              name: `${config.appName}-config`,
              key: key
            }
          }
        });
      } else {
        envVars.push({ name: key, value: value });
      }
    }

    // Add Secret references
    for (const key of Object.keys(config.secrets)) {
      envVars.push({
        name: key,
        valueFrom: {
          secretKeyRef: {
            name: `${config.appName}-secrets`,
            key: key
          }
        }
      });
    }

    return envVars;
  }

  /**
   * Generate Service manifest
   */
  generateService(config) {
    const service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: config.appName,
        namespace: config.namespace,
        labels: { app: config.appName }
      },
      spec: {
        type: config.serviceType,
        selector: { app: config.appName },
        ports: [{
          name: 'http',
          port: 80,
          targetPort: config.port,
          protocol: 'TCP'
        }],
        sessionAffinity: 'None'
      }
    };

    return this.toYAML(service);
  }

  /**
   * Generate ConfigMap manifest
   */
  generateConfigMap(config) {
    const configMap = {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: `${config.appName}-config`,
        namespace: config.namespace,
        labels: { app: config.appName }
      },
      data: config.envVars
    };

    return this.toYAML(configMap);
  }

  /**
   * Generate Secret manifest
   */
  generateSecret(config) {
    const secret = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: `${config.appName}-secrets`,
        namespace: config.namespace,
        labels: { app: config.appName }
      },
      type: 'Opaque',
      stringData: config.secrets
    };

    return this.toYAML(secret);
  }

  /**
   * Generate Ingress manifest
   */
  generateIngress(config) {
    const annotations = {
      'nginx.ingress.kubernetes.io/ssl-redirect': 'true',
      'nginx.ingress.kubernetes.io/rate-limit': '100'
    };

    if (config.enableTLS) {
      annotations['cert-manager.io/cluster-issuer'] =
        config.environment === 'production' ? 'letsencrypt-prod' : 'letsencrypt-staging';
    }

    const ingress = {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Ingress',
      metadata: {
        name: config.appName,
        namespace: config.namespace,
        labels: { app: config.appName },
        annotations: annotations
      },
      spec: {
        ingressClassName: 'nginx',
        rules: [{
          host: config.ingressHost,
          http: {
            paths: [{
              path: '/',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: config.appName,
                  port: { number: 80 }
                }
              }
            }]
          }
        }]
      }
    };

    if (config.enableTLS && config.ingressHost) {
      ingress.spec.tls = [{
        hosts: [config.ingressHost],
        secretName: `${config.appName}-tls`
      }];
    }

    return this.toYAML(ingress);
  }

  /**
   * Generate Horizontal Pod Autoscaler manifest
   */
  generateHPA(config) {
    const hpa = {
      apiVersion: 'autoscaling/v2',
      kind: 'HorizontalPodAutoscaler',
      metadata: {
        name: config.appName,
        namespace: config.namespace,
        labels: { app: config.appName }
      },
      spec: {
        scaleTargetRef: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: config.appName
        },
        minReplicas: config.minReplicas,
        maxReplicas: config.maxReplicas,
        metrics: [
          {
            type: 'Resource',
            resource: {
              name: 'cpu',
              target: {
                type: 'Utilization',
                averageUtilization: 70
              }
            }
          },
          {
            type: 'Resource',
            resource: {
              name: 'memory',
              target: {
                type: 'Utilization',
                averageUtilization: 80
              }
            }
          }
        ],
        behavior: {
          scaleDown: {
            stabilizationWindowSeconds: 300,
            policies: [{
              type: 'Percent',
              value: 50,
              periodSeconds: 60
            }]
          },
          scaleUp: {
            stabilizationWindowSeconds: 0,
            policies: [
              {
                type: 'Percent',
                value: 100,
                periodSeconds: 30
              },
              {
                type: 'Pods',
                value: 2,
                periodSeconds: 30
              }
            ],
            selectPolicy: 'Max'
          }
        }
      }
    };

    return this.toYAML(hpa);
  }

  /**
   * Generate deployment summary
   */
  generateSummary(config, manifests) {
    const resourcesGenerated = Object.keys(manifests).map(key => {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
    });

    // Rough cost estimation
    const cpuCost = parseInt(config.resources.requests.cpu) * 0.04; // ~$0.04 per vCPU/month
    const memCost = parseInt(config.resources.requests.memory) * 0.005; // ~$0.005 per GB/month
    const totalCost = (cpuCost + memCost) * config.replicas;
    const estimatedCost = `$${Math.round(totalCost)}-${Math.round(totalCost * 3)}/month`;

    return {
      appName: config.appName,
      environment: config.environment,
      namespace: config.namespace,
      replicas: config.replicas,
      resourcesGenerated,
      estimatedCost
    };
  }

  /**
   * Generate deployment commands
   */
  generateDeploymentCommands(config, manifests) {
    const commands = [];

    // Create namespace if needed
    if (config.namespace !== 'default') {
      commands.push({
        description: 'Create namespace',
        command: `kubectl create namespace ${config.namespace}`
      });
    }

    // Apply manifests in order
    const applyOrder = ['configMap', 'secret', 'deployment', 'service', 'ingress', 'hpa'];

    for (const resource of applyOrder) {
      if (manifests[resource]) {
        commands.push({
          description: `Apply ${resource}`,
          command: `kubectl apply -f ${resource}.yaml`
        });
      }
    }

    // Verification commands
    commands.push({
      description: 'Check deployment status',
      command: `kubectl rollout status deployment/${config.appName} -n ${config.namespace}`
    });

    commands.push({
      description: 'Get pods',
      command: `kubectl get pods -n ${config.namespace} -l app=${config.appName}`
    });

    if (config.enableIngress) {
      commands.push({
        description: 'Get ingress',
        command: `kubectl get ingress -n ${config.namespace}`
      });
    }

    return commands;
  }

  /**
   * Generate best practices recommendations
   */
  generateBestPractices(config) {
    return [
      {
        category: 'Security',
        recommendation: 'Non-root containers with read-only root filesystem',
        implemented: true
      },
      {
        category: 'Security',
        recommendation: 'Dropped all capabilities except required',
        implemented: true
      },
      {
        category: 'Reliability',
        recommendation: 'Liveness and readiness probes configured',
        implemented: true
      },
      {
        category: 'Reliability',
        recommendation: 'Rolling update strategy with zero downtime',
        implemented: true
      },
      {
        category: 'Scalability',
        recommendation: 'Horizontal Pod Autoscaler for dynamic scaling',
        implemented: config.enableAutoscaling
      },
      {
        category: 'Networking',
        recommendation: 'Ingress with TLS for secure external access',
        implemented: config.enableIngress && config.enableTLS
      },
      {
        category: 'Observability',
        recommendation: 'Comprehensive labels for filtering and monitoring',
        implemented: true
      },
      {
        category: 'Cost Optimization',
        recommendation: 'Resource requests and limits defined',
        implemented: true
      },
      {
        category: 'Production Readiness',
        recommendation: 'Consider PodDisruptionBudget for high availability',
        implemented: false
      },
      {
        category: 'Production Readiness',
        recommendation: 'Consider NetworkPolicy for network segmentation',
        implemented: false
      }
    ];
  }

  /**
   * Convert JavaScript object to YAML string
   */
  toYAML(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    let yaml = '';

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        for (const item of value) {
          if (typeof item === 'object') {
            yaml += `${spaces}- \n`;
            yaml += this.toYAML(item, indent + 1).replace(new RegExp(`^${'  '.repeat(indent + 1)}`, 'gm'), `${spaces}  `);
          } else {
            yaml += `${spaces}- ${this.formatValue(item)}\n`;
          }
        }
      } else if (typeof value === 'object') {
        yaml += `${spaces}${key}:\n`;
        yaml += this.toYAML(value, indent + 1);
      } else {
        yaml += `${spaces}${key}: ${this.formatValue(value)}\n`;
      }
    }

    return yaml;
  }

  /**
   * Format value for YAML output
   */
  formatValue(value) {
    if (typeof value === 'string') {
      // Quote strings that might be interpreted as other types
      if (/^(true|false|null|[0-9]+)$/i.test(value) || value.includes(':') || value.includes('#')) {
        return `"${value}"`;
      }
      return value;
    }
    return value;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KubernetesManifestGenerator;
}

// Demo usage
if (require.main === module) {
  const generator = new KubernetesManifestGenerator();

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
      LOG_LEVEL: 'info',
      PORT: '3000'
    },
    secrets: {
      DATABASE_PASSWORD: 'secretpass123',
      API_KEY: 'secret-key-12345'
    }
  };

  const result = generator.generate(config);

  console.log('=== DEPLOYMENT MANIFEST ===');
  console.log(result.manifests.deployment);
  console.log('\n=== SERVICE MANIFEST ===');
  console.log(result.manifests.service);
  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(result.summary, null, 2));
  console.log('\n=== DEPLOYMENT COMMANDS ===');
  result.deploymentCommands.forEach(cmd => {
    console.log(`# ${cmd.description}`);
    console.log(cmd.command);
  });
}
