#!/bin/bash
# Comprehensive Motion Review Script
# Practice file for Day 28: Motion Combinations Review
# Focus: All types of content for comprehensive practice

set -euo pipefail

###############################################################################
# COMPREHENSIVE DEVOPS AUTOMATION SCRIPT
# This script combines all the concepts learned in the previous days
# Use this for practicing all vim motions and text objects
###############################################################################

# Global configuration with clear paragraph boundaries
readonly SCRIPT_VERSION="3.0.0"
readonly ENVIRONMENT="${ENVIRONMENT:-production}"
readonly AWS_REGION="${AWS_REGION:-us-west-2}"
readonly CLUSTER_NAME="comprehensive-k8s-cluster"
readonly DOCKER_REGISTRY="registry.company.com"

# Array of services for visual block practice
declare -a MICROSERVICES=(
    "user-service      v2.1.0    3     100m    256Mi   500m    1Gi     web-tier"
    "order-service     v1.8.1    5     200m    512Mi   1000m   2Gi     web-tier"
    "payment-service   v3.2.0    2     500m    1Gi     2000m   4Gi     secure-tier"
    "auth-service      v1.5.2    3     100m    128Mi   500m    512Mi   web-tier"
    "notification-svc  v1.2.0    1     50m     64Mi    200m    256Mi   web-tier"
    "api-gateway       v2.0.1    2     200m    256Mi   1000m   1Gi     gateway-tier"
    "database          v13.7     1     1000m   2Gi     4000m   8Gi     data-tier"
    "redis-cache       v6.2      2     100m    256Mi   500m    1Gi     cache-tier"
    "monitoring        v2.36     1     500m    1Gi     2000m   4Gi     monitor-tier"
    "logging           v8.2      1     300m    512Mi   1000m   2Gi     monitor-tier"
)

# Complex configuration with nested quotes and brackets
declare -A ENVIRONMENT_CONFIGS=(
    ["production"]='{"replicas": 5, "resources": {"cpu": "500m", "memory": "1Gi"}, "features": ["authentication", "monitoring", "ssl"]}'
    ["staging"]='{"replicas": 2, "resources": {"cpu": "200m", "memory": "256Mi"}, "features": ["authentication", "monitoring"]}'
    ["development"]='{"replicas": 1, "resources": {"cpu": "100m", "memory": "128Mi"}, "features": ["authentication"]}'
)

# SECTION 1: Infrastructure Management
# This section contains infrastructure provisioning functions
# Practice paragraph navigation with { } motions

function provision_cloud_infrastructure() {
    echo "=== PROVISIONING CLOUD INFRASTRUCTURE ==="

    # Validate prerequisites with searchable patterns
    local required_tools=("terraform" "kubectl" "helm" "aws" "jq")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            echo "ERROR: Required tool not found: $tool"
            return 1
        fi
    done

    # Initialize Terraform with long command lines for formatting practice
    terraform init -backend-config="bucket=company-terraform-state" -backend-config="key=infrastructure/production.tfstate" -backend-config="region=$AWS_REGION" -backend-config="encrypt=true" -backend-config="dynamodb_table=terraform-locks"

    # Plan and apply infrastructure changes
    terraform plan -var-file="environments/${ENVIRONMENT}.tfvars" -out="${ENVIRONMENT}.tfplan"
    terraform apply "${ENVIRONMENT}.tfplan"

    echo "Cloud infrastructure provisioning completed"
}

function setup_kubernetes_cluster() {
    echo "=== SETTING UP KUBERNETES CLUSTER ==="

    # Create namespaces with clear boundaries for paragraph practice
    local namespaces=("production" "staging" "development" "monitoring" "ingress-nginx" "databases" "security")

    for namespace in "${namespaces[@]}"; do
        kubectl create namespace "$namespace" --dry-run=client -o yaml | kubectl apply -f -
        kubectl label namespace "$namespace" "env=$namespace" --overwrite
    done

    # Install essential cluster components
    install_ingress_controller
    install_cert_manager
    install_cluster_autoscaler

    echo "Kubernetes cluster setup completed"
}

# SECTION 2: Application Deployment
# Practice with text objects and operator combinations

function deploy_microservices_stack() {
    echo "=== DEPLOYING MICROSERVICES STACK ==="

    # Deploy each microservice with detailed configuration
    for service_config in "${MICROSERVICES[@]}"; do
        # Parse service configuration (practice word motions)
        read -r service version replicas cpu_req mem_req cpu_lim mem_lim tier <<< "$service_config"

        echo "Deploying $service version $version to $tier"

        # Create deployment with complex YAML structure
        cat > "/tmp/$service-deployment.yaml" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $service
  namespace: $ENVIRONMENT
  labels:
    app: $service
    version: $version
    tier: $tier
  annotations:
    deployment.kubernetes.io/revision: "1"
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
spec:
  replicas: $replicas
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: $service
  template:
    metadata:
      labels:
        app: $service
        version: $version
        tier: $tier
    spec:
      serviceAccountName: $service-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      containers:
      - name: $service
        image: $DOCKER_REGISTRY/$service:$version
        imagePullPolicy: Always
        ports:
        - name: http
          containerPort: 8080
          protocol: TCP
        - name: metrics
          containerPort: 9090
          protocol: TCP
        env:
        - name: ENVIRONMENT
          value: "$ENVIRONMENT"
        - name: SERVICE_NAME
          value: "$service"
        - name: SERVICE_VERSION
          value: "$version"
        resources:
          requests:
            cpu: $cpu_req
            memory: $mem_req
          limits:
            cpu: $cpu_lim
            memory: $mem_lim
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
EOF

        kubectl apply -f "/tmp/$service-deployment.yaml"

        # Create service for each deployment
        create_service_for_deployment "$service" "$ENVIRONMENT"
    done

    echo "Microservices stack deployment completed"
}

# SECTION 3: Monitoring and Observability
# Long section for screen navigation practice (H M L zt zz zb)

function setup_comprehensive_monitoring() {
    echo "=== SETTING UP COMPREHENSIVE MONITORING ==="

    # Install Prometheus stack with extensive configuration
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update

    # Deploy Prometheus with detailed values
    helm install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set prometheus.prometheusSpec.retention=30d \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi \
        --set prometheus.prometheusSpec.resources.requests.cpu=500m \
        --set prometheus.prometheusSpec.resources.requests.memory=1Gi \
        --set prometheus.prometheusSpec.resources.limits.cpu=2000m \
        --set prometheus.prometheusSpec.resources.limits.memory=4Gi \
        --set grafana.persistence.enabled=true \
        --set grafana.persistence.size=10Gi \
        --set grafana.adminPassword="$(openssl rand -base64 32)" \
        --set alertmanager.alertmanagerSpec.storage.volumeClaimTemplate.spec.resources.requests.storage=10Gi

    # Configure custom alerting rules with extensive coverage
    create_comprehensive_alert_rules

    # Setup log aggregation with ELK stack
    setup_elasticsearch_logging_stack

    # Deploy distributed tracing with Jaeger
    setup_jaeger_tracing

    echo "Comprehensive monitoring setup completed"
}

function create_comprehensive_alert_rules() {
    # Create extensive alert rules for search pattern practice
    cat > "/tmp/comprehensive-alerts.yaml" << 'EOF'
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: comprehensive-alerts
  namespace: monitoring
  labels:
    prometheus: kube-prometheus
    role: alert-rules
spec:
  groups:
  - name: infrastructure.rules
    interval: 30s
    rules:
    - alert: HighCPUUsage
      expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
      for: 5m
      labels:
        severity: warning
        team: infrastructure
      annotations:
        summary: "High CPU usage on {{ $labels.instance }}"
        description: "CPU usage is {{ $value }}% for more than 5 minutes"
        runbook_url: "https://runbooks.company.com/high-cpu"

    - alert: HighMemoryUsage
      expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
      for: 5m
      labels:
        severity: critical
        team: infrastructure
      annotations:
        summary: "High memory usage on {{ $labels.instance }}"
        description: "Memory usage is {{ $value }}% for more than 5 minutes"
        runbook_url: "https://runbooks.company.com/high-memory"

    - alert: DiskSpaceLow
      expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 10
      for: 2m
      labels:
        severity: critical
        team: infrastructure
      annotations:
        summary: "Low disk space on {{ $labels.instance }}"
        description: "Disk space is {{ $value }}% available"

    - alert: PodCrashLooping
      expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
      for: 5m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is crash looping"
        description: "Pod has restarted {{ $value }} times in the last 15 minutes"

    - alert: ServiceDown
      expr: up == 0
      for: 1m
      labels:
        severity: critical
        team: oncall
      annotations:
        summary: "Service {{ $labels.instance }} is down"
        description: "Service has been down for more than 1 minute"

    - alert: HighResponseTime
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
      for: 10m
      labels:
        severity: warning
        team: development
      annotations:
        summary: "High response time detected"
        description: "95th percentile response time is {{ $value }}s"

    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
      for: 5m
      labels:
        severity: warning
        team: development
      annotations:
        summary: "High error rate detected"
        description: "Error rate is {{ $value | humanizePercentage }}"

  - name: application.rules
    interval: 30s
    rules:
    - alert: DatabaseConnectionFailure
      expr: up{job="database"} == 0
      for: 1m
      labels:
        severity: critical
        team: database
      annotations:
        summary: "Database connection failure"
        description: "Cannot connect to database"

    - alert: CacheMemoryHigh
      expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.9
      for: 5m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "Redis memory usage high"
        description: "Redis memory usage is {{ $value | humanizePercentage }}"

    - alert: QueueBacklog
      expr: queue_size > 1000
      for: 5m
      labels:
        severity: warning
        team: development
      annotations:
        summary: "Message queue backlog"
        description: "Queue size is {{ $value }} messages"
EOF

    kubectl apply -f "/tmp/comprehensive-alerts.yaml"
}

# SECTION 4: Security Configuration
# Practice with marks and jumps

function implement_security_framework() {
    echo "=== IMPLEMENTING SECURITY FRAMEWORK ==="
    # MARK A: Network Security

    # Configure network policies for zero-trust architecture
    create_network_security_policies

    # MARK B: RBAC Configuration
    setup_role_based_access_control

    # MARK C: Pod Security Standards
    implement_pod_security_standards

    # MARK D: Secret Management
    setup_external_secrets_operator

    echo "Security framework implementation completed"
}

function create_network_security_policies() {
    # Comprehensive network policies with detailed rules
    cat > "/tmp/network-security-policies.yaml" << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-controller
  namespace: production
spec:
  podSelector:
    matchLabels:
      tier: web-tier
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-database-access
  namespace: production
spec:
  podSelector:
    matchLabels:
      tier: data-tier
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: web-tier
    - podSelector:
        matchLabels:
          tier: secure-tier
    ports:
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379
EOF

    kubectl apply -f "/tmp/network-security-policies.yaml"
}

# SECTION 5: Disaster Recovery and Backup
# Practice with visual block operations on tabular data

function setup_disaster_recovery_procedures() {
    echo "=== SETTING UP DISASTER RECOVERY PROCEDURES ==="

    # Install Velero for cluster backups
    install_velero_backup_solution

    # Configure database backup strategies
    setup_database_backup_procedures

    # Implement cross-region replication
    configure_cross_region_replication

    # Create recovery testing procedures
    create_recovery_testing_framework

    echo "Disaster recovery procedures setup completed"
}

function create_backup_schedule_matrix() {
    # Tabular backup schedule data for visual block practice
    cat > "/tmp/backup-schedule.txt" << 'EOF'
# Backup Schedule Matrix
SERVICE              FREQUENCY    RETENTION    METHOD        DESTINATION
user-service         daily        30d          snapshot      s3://backups/services/
order-service        daily        30d          snapshot      s3://backups/services/
payment-service      hourly       30d          snapshot      s3://backups/services/
database             hourly       90d          pg_dump       s3://backups/databases/
redis-cache          daily        7d           snapshot      s3://backups/cache/
monitoring-data      weekly       180d         tar           s3://backups/monitoring/
configuration        daily        365d         git           s3://backups/config/
secrets              weekly       365d         sealed        s3://backups/secrets/
logs                 daily        30d          compressed    s3://backups/logs/
metrics              monthly      365d         export        s3://backups/metrics/
EOF

    echo "Backup schedule matrix created"
}

# SECTION 6: Performance Optimization
# Long function for line navigation practice

function optimize_cluster_performance() {
    echo "=== OPTIMIZING CLUSTER PERFORMANCE ==="

    # Implement horizontal pod autoscaling for all services
    for service_config in "${MICROSERVICES[@]}"; do
        read -r service version replicas cpu_req mem_req cpu_lim mem_lim tier <<< "$service_config"

        # Calculate autoscaling parameters based on service tier
        case "$tier" in
            "web-tier")
                min_replicas=2
                max_replicas=20
                cpu_threshold=70
                memory_threshold=80
                ;;
            "secure-tier")
                min_replicas=2
                max_replicas=10
                cpu_threshold=60
                memory_threshold=70
                ;;
            "data-tier")
                min_replicas=1
                max_replicas=3
                cpu_threshold=80
                memory_threshold=85
                ;;
            *)
                min_replicas=1
                max_replicas=10
                cpu_threshold=70
                memory_threshold=80
                ;;
        esac

        # Create HPA configuration
        cat > "/tmp/$service-hpa.yaml" << EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: $service-hpa
  namespace: $ENVIRONMENT
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: $service
  minReplicas: $min_replicas
  maxReplicas: $max_replicas
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: $cpu_threshold
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: $memory_threshold
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
EOF

        kubectl apply -f "/tmp/$service-hpa.yaml"
    done

    # Configure cluster autoscaler
    configure_cluster_autoscaler

    # Optimize resource quotas and limits
    configure_resource_quotas

    echo "Cluster performance optimization completed"
}

# Main orchestration function combining all operations
function main() {
    local operation="${1:-help}"

    case "$operation" in
        "infrastructure")
            provision_cloud_infrastructure      # Go to infrastructure section
            setup_kubernetes_cluster
            ;;
        "applications")
            deploy_microservices_stack         # Go to application section
            ;;
        "monitoring")
            setup_comprehensive_monitoring     # Go to monitoring section
            ;;
        "security")
            implement_security_framework      # Go to security section
            ;;
        "disaster-recovery")
            setup_disaster_recovery_procedures # Go to DR section
            create_backup_schedule_matrix
            ;;
        "performance")
            optimize_cluster_performance       # Go to performance section
            ;;
        "full-deployment")
            echo "Executing comprehensive deployment pipeline..."
            provision_cloud_infrastructure
            setup_kubernetes_cluster
            deploy_microservices_stack
            setup_comprehensive_monitoring
            implement_security_framework
            setup_disaster_recovery_procedures
            optimize_cluster_performance
            echo "Full deployment pipeline completed successfully"
            ;;
        "practice-motions")
            echo "Motion Practice Guide:"
            echo "1. Use { } to navigate between sections"
            echo "2. Practice w e b for word motions"
            echo "3. Use / and ? to search for patterns like 'service' or 'config'"
            echo "4. Try visual block mode on the backup schedule matrix"
            echo "5. Use marks (ma, 'a) to bookmark important sections"
            echo "6. Practice line jumps with G and gg"
            echo "7. Use text objects like ci\" da{ yi) on configuration blocks"
            ;;
        "help"|*)
            echo "Comprehensive DevOps Automation Script v$SCRIPT_VERSION"
            echo "Usage: $0 {infrastructure|applications|monitoring|security|disaster-recovery|performance|full-deployment|practice-motions}"
            echo ""
            echo "This script combines all vim motion practice concepts:"
            echo "  - Paragraph navigation with section boundaries"
            echo "  - Long content for screen navigation"
            echo "  - Text objects with quotes, brackets, and parentheses"
            echo "  - Searchable patterns and repeated terms"
            echo "  - Tabular data for visual block operations"
            echo "  - Mark-worthy sections for bookmarking"
            echo "  - Line numbers and content for jumping practice"
            echo ""
            echo "Operations:"
            echo "  infrastructure     - Provision cloud infrastructure and K8s cluster"
            echo "  applications       - Deploy comprehensive microservices stack"
            echo "  monitoring         - Setup monitoring, alerting, and observability"
            echo "  security           - Implement security framework and policies"
            echo "  disaster-recovery  - Setup backup and disaster recovery procedures"
            echo "  performance        - Optimize cluster performance and autoscaling"
            echo "  full-deployment    - Execute complete deployment pipeline"
            echo "  practice-motions   - Display motion practice guide"
            ;;
    esac
}

# Script execution with comprehensive error handling
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi