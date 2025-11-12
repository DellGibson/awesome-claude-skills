---
name: kubernetes-manifest-generator
description: Generates production-ready Kubernetes YAML manifests including Deployments, Services, ConfigMaps, Secrets, Ingress, and HPA configurations for container orchestration
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: development
tags:
  - kubernetes
  - k8s
  - devops
  - containers
  - orchestration
  - yaml
  - deployment
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# Kubernetes Manifest Generator

Automatically generate production-ready Kubernetes YAML manifests for containerized applications. This skill creates complete Kubernetes configurations including Deployments, Services, ConfigMaps, Secrets, Ingress, Horizontal Pod Autoscalers, and more—following cloud-native best practices.

## What It Does

The Kubernetes Manifest Generator skill:

1. **Generates Deployments** - Creates Deployment manifests with replicas, rolling updates, and resource limits
2. **Creates Services** - Generates ClusterIP, NodePort, and LoadBalancer Service configurations
3. **Builds ConfigMaps & Secrets** - Manages application configuration and sensitive data
4. **Configures Ingress** - Sets up HTTP/HTTPS routing with TLS support
5. **Enables Autoscaling** - Creates Horizontal Pod Autoscaler (HPA) configurations
6. **Multi-Environment Support** - Generates configs for dev, staging, and production environments
7. **Best Practices** - Implements health checks, resource quotas, security contexts, and labels

## Key Features

- **Complete Manifest Suite**: Deployment, Service, ConfigMap, Secret, Ingress, HPA
- **Multi-Environment**: Separate configs for dev, staging, production with appropriate settings
- **Resource Management**: CPU/memory requests and limits based on environment
- **Health Checks**: Liveness, readiness, and startup probes
- **Security**: Security contexts, non-root users, read-only root filesystems
- **Scaling**: Horizontal Pod Autoscaler with CPU/memory-based scaling
- **Networking**: Ingress with TLS, service mesh ready
- **Best Practices**: Labels, annotations, namespace organization

## When to Use This Skill

Use the Kubernetes Manifest Generator when you need to:

- Deploy containerized applications to Kubernetes clusters
- Create production-ready K8s configurations quickly
- Generate multi-environment deployment configs
- Implement Kubernetes best practices consistently
- Migrate from Docker Compose to Kubernetes
- Set up auto-scaling for applications
- Configure ingress routing and load balancing
- Manage application configuration and secrets

## Supported Resources

### Core Resources
- **Deployment**: Application deployment with rolling updates
- **Service**: ClusterIP, NodePort, LoadBalancer types
- **ConfigMap**: Application configuration management
- **Secret**: Sensitive data management (credentials, tokens, certificates)

### Scaling & Networking
- **Horizontal Pod Autoscaler (HPA)**: Auto-scaling based on metrics
- **Ingress**: HTTP/HTTPS routing with TLS termination
- **NetworkPolicy**: Traffic control between pods (optional)

### Configuration
- **Namespace**: Logical cluster partitioning
- **ServiceAccount**: Pod identity and RBAC (optional)
- **PersistentVolumeClaim**: Persistent storage (optional)

## Example Usage

### Input: Application Requirements

```yaml
Application: web-api
Language: Node.js
Port: 3000
Environment: production
Replicas: 3
Database: PostgreSQL (external)
```

### Output: Generated Kubernetes Manifests

#### 1. Deployment (deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-api
  namespace: production
  labels:
    app: web-api
    environment: production
    version: v1.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: web-api
  template:
    metadata:
      labels:
        app: web-api
        environment: production
        version: v1.0.0
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
      - name: web-api
        image: myregistry/web-api:1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          value: production
        - name: PORT
          value: "3000"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: web-api-config
              key: database_host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: web-api-secrets
              key: database_password
        resources:
          requests:
            cpu: 250m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
```

#### 2. Service (service.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-api
  namespace: production
  labels:
    app: web-api
spec:
  type: ClusterIP
  selector:
    app: web-api
  ports:
  - name: http
    port: 80
    targetPort: 3000
    protocol: TCP
  sessionAffinity: None
```

#### 3. ConfigMap (configmap.yaml)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: web-api-config
  namespace: production
  labels:
    app: web-api
data:
  database_host: postgres.database.svc.cluster.local
  database_port: "5432"
  database_name: webapi_prod
  log_level: info
  cache_ttl: "3600"
```

#### 4. Secret (secret.yaml)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: web-api-secrets
  namespace: production
  labels:
    app: web-api
type: Opaque
stringData:
  database_password: <BASE64_ENCODED>
  api_key: <BASE64_ENCODED>
  jwt_secret: <BASE64_ENCODED>
```

#### 5. Ingress (ingress.yaml)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-api
  namespace: production
  labels:
    app: web-api
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: web-api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-api
            port:
              number: 80
```

#### 6. Horizontal Pod Autoscaler (hpa.yaml)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-api
  namespace: production
  labels:
    app: web-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
      - type: Pods
        value: 2
        periodSeconds: 30
      selectPolicy: Max
```

## Environment-Specific Configurations

### Development Environment
- **Replicas**: 1
- **Resources**: requests: 100m CPU, 256Mi RAM; limits: 200m CPU, 512Mi RAM
- **Health Checks**: Relaxed timings
- **Ingress**: HTTP only (no TLS)
- **Autoscaling**: Disabled

### Staging Environment
- **Replicas**: 2
- **Resources**: requests: 200m CPU, 512Mi RAM; limits: 400m CPU, 1Gi RAM
- **Health Checks**: Standard timings
- **Ingress**: TLS with staging certificates
- **Autoscaling**: min 2, max 5

### Production Environment
- **Replicas**: 3+
- **Resources**: requests: 250m CPU, 512Mi RAM; limits: 500m CPU, 1Gi RAM
- **Health Checks**: Strict timings
- **Ingress**: TLS with production certificates
- **Autoscaling**: min 3, max 10+

## Best Practices Implemented

### Security
- ✅ Non-root containers (runAsNonRoot: true)
- ✅ Read-only root filesystem
- ✅ Dropped capabilities (drop: ALL)
- ✅ Security contexts at pod and container level
- ✅ Secrets for sensitive data (not ConfigMaps)

### Reliability
- ✅ Liveness and readiness probes
- ✅ Rolling update strategy with maxUnavailable: 0
- ✅ Resource requests and limits
- ✅ PodDisruptionBudget for high availability (optional)
- ✅ Graceful shutdown with terminationGracePeriodSeconds

### Observability
- ✅ Comprehensive labels (app, environment, version)
- ✅ Annotations for metadata
- ✅ Prometheus scraping annotations (optional)
- ✅ Structured logging configuration

### Scalability
- ✅ Horizontal Pod Autoscaler with appropriate metrics
- ✅ Resource-based scaling (CPU and memory)
- ✅ Scale-up and scale-down policies
- ✅ Stabilization windows to prevent flapping

## Integration with Docker Compose

Migrating from Docker Compose? This skill can:
- Convert docker-compose.yml services to Kubernetes Deployments
- Map Docker volumes to PersistentVolumeClaims
- Transform environment variables to ConfigMaps/Secrets
- Convert service networking to Kubernetes Services

**Example:** Use with `docker-compose-builder` to:
1. Generate docker-compose.yml for local development
2. Generate Kubernetes manifests for cloud deployment
3. Maintain configuration parity across environments

## Limitations

- **Stateful Applications**: Basic StatefulSet support; complex stateful apps may need manual tuning
- **Custom Resources**: CRDs and operators require manual definition
- **Multi-Cluster**: Focuses on single cluster; multi-cluster needs additional tooling
- **Storage**: Basic PVC support; advanced storage (CSI drivers) may need customization
- **Service Mesh**: Service mesh configs (Istio, Linkerd) require separate configuration

## Tips

- **Start Simple**: Begin with basic Deployment + Service, add complexity as needed
- **Use Namespaces**: Organize resources by environment or team
- **Version Control**: Store manifests in Git alongside application code
- **GitOps**: Use with ArgoCD or Flux for automated deployments
- **Validate Before Apply**: Use `kubectl apply --dry-run=client` or `kubeval` to validate
- **Monitor Resources**: Use `kubectl top` and metrics server to tune resource limits
- **Helm Integration**: Generated manifests can be templated with Helm for reusability

## Related Skills

- **docker-compose-builder**: Generate Docker Compose configs for local development
- **ci-cd-pipeline-generator**: Create CI/CD workflows that deploy to Kubernetes
- **technical-documentation-writer**: Document Kubernetes architecture and runbooks
- **log-analyzer-debugger**: Debug issues in Kubernetes logs

## Installation

This skill is available for use in:
- Claude.ai web interface
- Claude Code (desktop application)
- Claude API integrations

No additional installation required - activate the skill and start generating Kubernetes manifests!
