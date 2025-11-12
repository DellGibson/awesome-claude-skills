# Kubernetes Manifest Generator

Generate production-ready Kubernetes YAML manifests for containerized applications. Creates complete K8s configurations including Deployments, Services, ConfigMaps, Secrets, Ingress, and Horizontal Pod Autoscalers—following cloud-native best practices.

## Features

- **Complete Manifest Suite**: Deployment, Service, ConfigMap, Secret, Ingress, HPA
- **Multi-Environment Support**: Dev, staging, and production configurations
- **Production Best Practices**: Security contexts, health checks, resource limits, autoscaling
- **Flexible Configuration**: Customize every aspect or use smart defaults
- **Docker Compose Integration**: Migrate easily from Docker Compose to Kubernetes
- **Cost Estimation**: Rough monthly cost estimates based on resource allocation

## Installation

### Claude.ai

1. Open [Claude.ai](https://claude.ai)
2. Start a new conversation
3. Upload or reference the `kubernetes-manifest-generator` skill
4. Claude will automatically use this skill when you need to generate K8s manifests

### Claude Code

1. Open Claude Code
2. Navigate to Skills > Install Skill
3. Select `kubernetes-manifest-generator`
4. Activate the skill in your project

### Claude API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["kubernetes-manifest-generator"],
    messages=[{
        "role": "user",
        "content": "Generate Kubernetes manifests for a Node.js API on port 3000"
    }]
)
```

## Usage

### Basic Example

Ask Claude:
> "Generate Kubernetes manifests for my web application. It's a Node.js app running on port 3000, using the image 'myregistry/web-app:v1.0.0'. I need production configuration with autoscaling."

Claude will generate:
- ✅ Deployment with 3 replicas, health checks, resource limits
- ✅ ClusterIP Service
- ✅ Horizontal Pod Autoscaler (3-10 replicas)
- ✅ Best practices recommendations
- ✅ kubectl deployment commands

### Advanced Example

```
Generate Kubernetes manifests for:
- App: api-gateway
- Image: myregistry/api-gateway:2.1.0
- Port: 8080
- Environment: production
- Namespace: gateway
- Enable Ingress with domain: api.example.com
- Enable TLS
- Environment variables: API_VERSION=v2, RATE_LIMIT=1000
- Secrets: JWT_SECRET, DATABASE_PASSWORD
- Min replicas: 5, Max replicas: 20
```

### Environment-Specific Configs

**Development:**
```
Generate dev Kubernetes manifests for my Python Flask app on port 5000
```
- 1 replica
- Lower resource limits
- Relaxed health checks
- No ingress/autoscaling

**Staging:**
```
Generate staging Kubernetes manifests with ingress for testing.example.com
```
- 2 replicas
- Moderate resources
- Ingress with staging TLS
- Autoscaling 2-5 replicas

**Production:**
```
Generate production Kubernetes manifests with full autoscaling and monitoring
```
- 3+ replicas
- Production resource limits
- Strict health checks
- Full autoscaling (3-10+)
- TLS with production certs

## Generated Resources

### Always Generated
1. **Deployment**: Application deployment with rolling updates
2. **Service**: ClusterIP, NodePort, or LoadBalancer

### Conditionally Generated
3. **ConfigMap**: If environment variables provided
4. **Secret**: If secrets provided
5. **Ingress**: If `enableIngress: true`
6. **HPA**: If `enableAutoscaling: true`

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `appName` | string | required | Application name |
| `image` | string | required | Container image |
| `port` | integer | required | Application port |
| `environment` | enum | `dev` | Target environment (dev/staging/production) |
| `namespace` | string | `default` | Kubernetes namespace |
| `replicas` | integer | env-based | Number of replicas |
| `serviceType` | enum | `ClusterIP` | Service type (ClusterIP/NodePort/LoadBalancer) |
| `enableIngress` | boolean | `false` | Generate Ingress resource |
| `ingressHost` | string | - | Ingress hostname |
| `enableTLS` | boolean | `true` | Enable TLS for Ingress |
| `enableAutoscaling` | boolean | `false` | Generate HPA |
| `minReplicas` | integer | `2` | Min replicas for HPA |
| `maxReplicas` | integer | `10` | Max replicas for HPA |
| `envVars` | object | `{}` | Environment variables |
| `secrets` | object | `{}` | Secret values |
| `healthCheckPath` | string | `/health` | Liveness probe path |
| `readinessCheckPath` | string | `/ready` | Readiness probe path |

## Best Practices Implemented

### Security ✅
- Non-root containers (`runAsNonRoot: true`)
- Read-only root filesystem
- Dropped all capabilities
- Security contexts at pod and container level
- Secrets for sensitive data

### Reliability ✅
- Liveness and readiness probes
- Rolling update strategy (zero downtime)
- Resource requests and limits
- Graceful shutdown handling

### Scalability ✅
- Horizontal Pod Autoscaler with CPU/memory metrics
- Scale-up and scale-down policies
- Stabilization windows to prevent flapping

### Observability ✅
- Comprehensive labels (app, environment, version)
- Metadata annotations
- Structured logging configuration

## Example Output

### Deployment Commands

After generation, Claude provides kubectl commands:

```bash
# Create namespace
kubectl create namespace production

# Apply manifests
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml

# Check deployment status
kubectl rollout status deployment/web-api -n production

# Get pods
kubectl get pods -n production -l app=web-api

# Get ingress
kubectl get ingress -n production
```

### Cost Estimation

Claude estimates monthly costs:
```
Estimated Cost: $50-150/month
(Based on 3 replicas × 250m CPU + 512Mi RAM)
```

## Deployment Workflow

### 1. Generate Manifests

Ask Claude to generate manifests with your requirements.

### 2. Save to Files

Save each manifest to a separate file:
```bash
deployment.yaml
service.yaml
configmap.yaml
secret.yaml
ingress.yaml
hpa.yaml
```

### 3. Review & Customize

Review generated manifests and customize as needed.

### 4. Apply to Cluster

```bash
kubectl apply -f .
```

### 5. Verify Deployment

```bash
kubectl get all -n <namespace>
kubectl logs -f deployment/<app-name> -n <namespace>
```

## Integration with Other Skills

### docker-compose-builder
Generate Docker Compose for local dev, then K8s manifests for production:
```
1. Generate docker-compose.yml for local development
2. Generate Kubernetes manifests for cloud deployment
3. Maintain configuration parity
```

### ci-cd-pipeline-generator
Create CI/CD pipelines that deploy to Kubernetes:
```
1. Generate K8s manifests
2. Generate GitHub Actions workflow
3. Automate: build → test → deploy to K8s
```

### technical-documentation-writer
Document your Kubernetes architecture:
```
1. Generate K8s manifests
2. Generate architecture docs
3. Create runbooks and troubleshooting guides
```

## Migration from Docker Compose

Migrating from Docker Compose? This skill can help:

1. **Convert Services**: Docker Compose services → K8s Deployments
2. **Map Volumes**: Docker volumes → PersistentVolumeClaims
3. **Transform Env Vars**: Environment variables → ConfigMaps/Secrets
4. **Network Services**: Docker networks → Kubernetes Services

**Example:**
```
I have this docker-compose.yml with 3 services.
Generate equivalent Kubernetes manifests:
[paste docker-compose.yml]
```

## Advanced Use Cases

### Multi-Container Pods

```
Generate K8s manifests for:
- Main app container (port 8080)
- Sidecar nginx proxy (port 80)
- Init container for database migrations
```

### StatefulSet for Databases

```
Generate StatefulSet manifests for PostgreSQL with:
- 3 replicas
- Persistent storage (10Gi per pod)
- Headless service
```

### Blue-Green Deployment

```
Generate two deployment sets (blue/green) for zero-downtime releases
```

### Canary Deployment

```
Generate manifests for canary deployment:
- Stable version: 90% traffic
- Canary version: 10% traffic
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n <namespace>

# Check events
kubectl get events -n <namespace> --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n <namespace>
```

### Ingress Not Working

```bash
# Check ingress
kubectl describe ingress <ingress-name> -n <namespace>

# Check ingress controller
kubectl get pods -n ingress-nginx

# Test DNS
nslookup <your-domain>
```

### Autoscaling Not Triggering

```bash
# Check HPA status
kubectl get hpa -n <namespace>

# Check metrics server
kubectl top pods -n <namespace>

# Verify metrics-server is running
kubectl get deployment metrics-server -n kube-system
```

## Limitations

- **StatefulSets**: Basic support; complex stateful apps may need manual tuning
- **CRDs**: Custom Resource Definitions require manual definition
- **Multi-Cluster**: Focuses on single cluster deployments
- **Service Mesh**: Istio/Linkerd configs require separate configuration

## Tips

- **Start Simple**: Begin with Deployment + Service, add complexity gradually
- **Use Namespaces**: Organize by environment or team
- **Version Control**: Store manifests in Git with your app code
- **GitOps**: Use ArgoCD or Flux for automated deployments
- **Validate First**: Use `kubectl apply --dry-run=client -f manifest.yaml`
- **Monitor Resources**: Tune limits based on actual usage with `kubectl top`
- **Test Locally**: Use Minikube or kind for local testing

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Production Readiness Checklist](https://kubernetes.io/docs/tasks/debug-application-cluster/)

## Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
