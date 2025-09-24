#!/bin/bash
# Comprehensive DevOps Pipeline Script
# Practice file for Day 16: Screen Navigation (H M L zt zz zb)
# Focus: Long file with many functions for screen navigation practice

set -euo pipefail

# Global Configuration Variables
DOCKER_REGISTRY="company-registry.com"
KUBERNETES_NAMESPACE="production"
MONITORING_NAMESPACE="monitoring"
DATABASE_NAMESPACE="databases"
BACKUP_BUCKET="s3://company-backups"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
RETRY_COUNT=3
TIMEOUT=300

# Logging Functions
function log_info() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [INFO] $*" >&2
}

function log_error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [ERROR] $*" >&2
}

function log_debug() {
    [[ "$LOG_LEVEL" == "DEBUG" ]] && echo "[$(date +'%Y-%m-%d %H:%M:%S')] [DEBUG] $*" >&2
}

# Utility Functions
function check_prerequisites() {
    local tools=("docker" "kubectl" "helm" "aws" "jq" "curl" "grep" "sed" "awk")

    log_info "Checking prerequisites..."
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            log_error "Required tool not found: $tool"
            exit 1
        fi
    done
    log_info "All prerequisites satisfied"
}

function wait_for_condition() {
    local condition="$1"
    local timeout="$2"
    local interval="${3:-5}"
    local elapsed=0

    log_info "Waiting for condition: $condition"
    while ! eval "$condition"; do
        sleep "$interval"
        elapsed=$((elapsed + interval))
        if [[ $elapsed -ge $timeout ]]; then
            log_error "Timeout waiting for condition: $condition"
            return 1
        fi
        log_debug "Waiting... elapsed: ${elapsed}s"
    done
    log_info "Condition satisfied: $condition"
}

function retry_command() {
    local cmd="$1"
    local retries="$2"
    local delay="${3:-5}"

    for ((i=1; i<=retries; i++)); do
        log_debug "Attempt $i/$retries: $cmd"
        if eval "$cmd"; then
            return 0
        fi
        if [[ $i -lt $retries ]]; then
            log_info "Command failed, retrying in ${delay}s..."
            sleep "$delay"
        fi
    done
    log_error "Command failed after $retries attempts: $cmd"
    return 1
}

# Docker Container Management
function build_docker_image() {
    local image_name="$1"
    local dockerfile_path="$2"
    local build_context="$3"
    local tag="${4:-latest}"

    log_info "Building Docker image: $image_name:$tag"

    docker build \
        -f "$dockerfile_path" \
        -t "$image_name:$tag" \
        -t "$DOCKER_REGISTRY/$image_name:$tag" \
        --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --build-arg VCS_REF="$(git rev-parse HEAD 2>/dev/null || echo 'unknown')" \
        --label "org.opencontainers.image.created=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --label "org.opencontainers.image.revision=$(git rev-parse HEAD 2>/dev/null || echo 'unknown')" \
        "$build_context"

    log_info "Docker image built successfully"
}

function push_docker_image() {
    local image_name="$1"
    local tag="${2:-latest}"

    log_info "Pushing Docker image: $DOCKER_REGISTRY/$image_name:$tag"

    docker push "$DOCKER_REGISTRY/$image_name:$tag"

    log_info "Docker image pushed successfully"
}

function scan_docker_image() {
    local image_name="$1"
    local tag="${2:-latest}"

    log_info "Scanning Docker image for vulnerabilities: $image_name:$tag"

    # Using Trivy for vulnerability scanning
    if command -v trivy >/dev/null 2>&1; then
        trivy image --format json --output "/tmp/scan-$image_name-$tag.json" "$image_name:$tag"

        local critical_count=$(jq '.Results[]?.Vulnerabilities[]? | select(.Severity=="CRITICAL") | length' "/tmp/scan-$image_name-$tag.json" | wc -l)
        local high_count=$(jq '.Results[]?.Vulnerabilities[]? | select(.Severity=="HIGH") | length' "/tmp/scan-$image_name-$tag.json" | wc -l)

        log_info "Vulnerability scan completed - Critical: $critical_count, High: $high_count"

        if [[ $critical_count -gt 0 ]]; then
            log_error "Critical vulnerabilities found in image"
            return 1
        fi
    else
        log_info "Trivy not available, skipping vulnerability scan"
    fi
}

function cleanup_docker_resources() {
    log_info "Cleaning up Docker resources"

    # Remove stopped containers
    docker container prune -f

    # Remove unused images
    docker image prune -f

    # Remove unused volumes
    docker volume prune -f

    # Remove unused networks
    docker network prune -f

    log_info "Docker cleanup completed"
}

# Kubernetes Deployment Functions
function create_kubernetes_namespace() {
    local namespace="$1"
    local labels="$2"

    log_info "Creating Kubernetes namespace: $namespace"

    kubectl create namespace "$namespace" --dry-run=client -o yaml | \
        kubectl label --local -f - $labels -o yaml | \
        kubectl apply -f -

    log_info "Namespace created successfully"
}

function deploy_kubernetes_application() {
    local app_name="$1"
    local image="$2"
    local namespace="$3"
    local replicas="${4:-3}"
    local port="${5:-8080}"
    local cpu_request="${6:-100m}"
    local memory_request="${7:-128Mi}"
    local cpu_limit="${8:-500m}"
    local memory_limit="${9:-512Mi}"

    log_info "Deploying Kubernetes application: $app_name"

    cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $app_name
  namespace: $namespace
  labels:
    app: $app_name
    version: v1
spec:
  replicas: $replicas
  selector:
    matchLabels:
      app: $app_name
  template:
    metadata:
      labels:
        app: $app_name
        version: v1
    spec:
      containers:
      - name: $app_name
        image: $image
        ports:
        - containerPort: $port
        resources:
          requests:
            cpu: $cpu_request
            memory: $memory_request
          limits:
            cpu: $cpu_limit
            memory: $memory_limit
        livenessProbe:
          httpGet:
            path: /health
            port: $port
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: $port
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: PORT
          value: "$port"
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: $app_name-service
  namespace: $namespace
  labels:
    app: $app_name
spec:
  selector:
    app: $app_name
  ports:
  - port: 80
    targetPort: $port
    protocol: TCP
  type: ClusterIP
EOF

    wait_for_condition "kubectl get deployment $app_name -n $namespace -o jsonpath='{.status.readyReplicas}' | grep -q $replicas" "$TIMEOUT"

    log_info "Application deployed successfully"
}

function create_ingress_rule() {
    local app_name="$1"
    local namespace="$2"
    local hostname="$3"
    local path="${4:-/}"
    local service_port="${5:-80}"

    log_info "Creating ingress rule for $app_name"

    cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: $app_name-ingress
  namespace: $namespace
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - $hostname
    secretName: $app_name-tls
  rules:
  - host: $hostname
    http:
      paths:
      - path: $path
        pathType: Prefix
        backend:
          service:
            name: $app_name-service
            port:
              number: $service_port
EOF

    log_info "Ingress rule created successfully"
}

function scale_kubernetes_deployment() {
    local deployment="$1"
    local namespace="$2"
    local replicas="$3"

    log_info "Scaling deployment $deployment to $replicas replicas"

    kubectl scale deployment "$deployment" --replicas="$replicas" -n "$namespace"

    wait_for_condition "kubectl get deployment $deployment -n $namespace -o jsonpath='{.status.readyReplicas}' | grep -q $replicas" "$TIMEOUT"

    log_info "Deployment scaled successfully"
}

function rollout_kubernetes_deployment() {
    local deployment="$1"
    local namespace="$2"
    local image="$3"

    log_info "Rolling out new image for deployment: $deployment"

    kubectl set image deployment/"$deployment" "$deployment=$image" -n "$namespace"

    kubectl rollout status deployment/"$deployment" -n "$namespace" --timeout="${TIMEOUT}s"

    log_info "Rollout completed successfully"
}

function rollback_kubernetes_deployment() {
    local deployment="$1"
    local namespace="$2"
    local revision="${3:-}"

    log_info "Rolling back deployment: $deployment"

    if [[ -n "$revision" ]]; then
        kubectl rollout undo deployment/"$deployment" -n "$namespace" --to-revision="$revision"
    else
        kubectl rollout undo deployment/"$deployment" -n "$namespace"
    fi

    kubectl rollout status deployment/"$deployment" -n "$namespace" --timeout="${TIMEOUT}s"

    log_info "Rollback completed successfully"
}

# Monitoring and Observability
function install_prometheus_stack() {
    local namespace="$1"
    local storage_class="${2:-gp2}"
    local retention_period="${3:-30d}"

    log_info "Installing Prometheus monitoring stack"

    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update

    helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
        --namespace "$namespace" \
        --create-namespace \
        --set prometheus.prometheusSpec.retention="$retention_period" \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.storageClassName="$storage_class" \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi \
        --set grafana.persistence.enabled=true \
        --set grafana.persistence.storageClassName="$storage_class" \
        --set grafana.persistence.size=10Gi \
        --set grafana.adminPassword="$(openssl rand -base64 32)" \
        --set alertmanager.alertmanagerSpec.storage.volumeClaimTemplate.spec.storageClassName="$storage_class" \
        --set alertmanager.alertmanagerSpec.storage.volumeClaimTemplate.spec.resources.requests.storage=10Gi

    log_info "Prometheus stack installed successfully"
}

function configure_alerting_rules() {
    local namespace="$1"

    log_info "Configuring alerting rules"

    cat <<EOF | kubectl apply -f -
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: infrastructure-alerts
  namespace: $namespace
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
        summary: "High CPU usage detected on {{ \$labels.instance }}"
        description: "CPU usage is {{ \$value }}% for more than 5 minutes"
        runbook_url: "https://runbooks.company.com/high-cpu"

    - alert: HighMemoryUsage
      expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
      for: 5m
      labels:
        severity: critical
        team: infrastructure
      annotations:
        summary: "High memory usage detected on {{ \$labels.instance }}"
        description: "Memory usage is {{ \$value }}% for more than 5 minutes"
        runbook_url: "https://runbooks.company.com/high-memory"

    - alert: PodCrashLooping
      expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
      for: 5m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "Pod {{ \$labels.namespace }}/{{ \$labels.pod }} is crash looping"
        description: "Pod has restarted {{ \$value }} times in the last 15 minutes"
        runbook_url: "https://runbooks.company.com/pod-crash-loop"

    - alert: DeploymentReplicasMismatch
      expr: kube_deployment_spec_replicas != kube_deployment_status_ready_replicas
      for: 10m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "Deployment {{ \$labels.namespace }}/{{ \$labels.deployment }} has mismatched replicas"
        description: "Deployment has {{ \$labels.spec_replicas }} desired but {{ \$labels.ready_replicas }} ready"
        runbook_url: "https://runbooks.company.com/deployment-replicas"
EOF

    log_info "Alerting rules configured successfully"
}

function setup_log_aggregation() {
    local namespace="$1"
    local elasticsearch_storage="${2:-50Gi}"

    log_info "Setting up log aggregation with ELK stack"

    helm repo add elastic https://helm.elastic.co
    helm repo update

    # Install Elasticsearch
    helm upgrade --install elasticsearch elastic/elasticsearch \
        --namespace "$namespace" \
        --create-namespace \
        --set volumeClaimTemplate.resources.requests.storage="$elasticsearch_storage" \
        --set replicas=3 \
        --set minimumMasterNodes=2

    # Install Kibana
    helm upgrade --install kibana elastic/kibana \
        --namespace "$namespace" \
        --set elasticsearchHosts="http://elasticsearch-master:9200"

    # Install Filebeat
    helm upgrade --install filebeat elastic/filebeat \
        --namespace "$namespace" \
        --set daemonset.enabled=true \
        --set deployment.enabled=false

    log_info "Log aggregation setup completed"
}

# Database Management
function deploy_postgresql_cluster() {
    local cluster_name="$1"
    local namespace="$2"
    local storage_size="${3:-100Gi}"
    local replicas="${4:-3}"

    log_info "Deploying PostgreSQL cluster: $cluster_name"

    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update

    helm upgrade --install "$cluster_name" bitnami/postgresql-ha \
        --namespace "$namespace" \
        --create-namespace \
        --set postgresql.replicaCount="$replicas" \
        --set persistence.size="$storage_size" \
        --set postgresql.auth.postgresPassword="$(openssl rand -base64 32)" \
        --set postgresql.auth.replicationPassword="$(openssl rand -base64 32)" \
        --set metrics.enabled=true \
        --set metrics.serviceMonitor.enabled=true

    wait_for_condition "kubectl get statefulset $cluster_name-postgresql -n $namespace -o jsonpath='{.status.readyReplicas}' | grep -q $replicas" "$TIMEOUT"

    log_info "PostgreSQL cluster deployed successfully"
}

function backup_postgresql_database() {
    local cluster_name="$1"
    local namespace="$2"
    local database_name="$3"
    local backup_name="${4:-backup-$(date +%Y%m%d-%H%M%S)}"

    log_info "Creating PostgreSQL backup: $backup_name"

    kubectl exec -n "$namespace" "$cluster_name-postgresql-0" -- \
        pg_dump -U postgres -d "$database_name" > "/tmp/$backup_name.sql"

    gzip "/tmp/$backup_name.sql"

    aws s3 cp "/tmp/$backup_name.sql.gz" "$BACKUP_BUCKET/postgresql/$cluster_name/"

    rm "/tmp/$backup_name.sql.gz"

    log_info "PostgreSQL backup completed and uploaded"
}

function restore_postgresql_database() {
    local cluster_name="$1"
    local namespace="$2"
    local database_name="$3"
    local backup_file="$4"

    log_info "Restoring PostgreSQL database from backup: $backup_file"

    aws s3 cp "$BACKUP_BUCKET/postgresql/$cluster_name/$backup_file" "/tmp/$backup_file"

    gunzip "/tmp/$backup_file"

    kubectl cp "/tmp/${backup_file%.gz}" "$namespace/$cluster_name-postgresql-0:/tmp/restore.sql"

    kubectl exec -n "$namespace" "$cluster_name-postgresql-0" -- \
        psql -U postgres -d "$database_name" -f "/tmp/restore.sql"

    kubectl exec -n "$namespace" "$cluster_name-postgresql-0" -- rm "/tmp/restore.sql"

    rm "/tmp/${backup_file%.gz}"

    log_info "PostgreSQL database restored successfully"
}

# CI/CD Pipeline Functions
function run_tests() {
    local test_type="$1"
    local test_path="${2:-.}"

    log_info "Running $test_type tests"

    case "$test_type" in
        "unit")
            npm test -- --coverage --watchAll=false
            ;;
        "integration")
            npm run test:integration
            ;;
        "e2e")
            npm run test:e2e
            ;;
        "security")
            npm audit --audit-level moderate
            ;;
        *)
            log_error "Unknown test type: $test_type"
            return 1
            ;;
    esac

    log_info "$test_type tests completed successfully"
}

function build_and_push_image() {
    local app_name="$1"
    local version="$2"
    local dockerfile="${3:-Dockerfile}"
    local context="${4:-.}"

    log_info "Building and pushing image for $app_name:$version"

    build_docker_image "$app_name" "$dockerfile" "$context" "$version"
    scan_docker_image "$app_name" "$version"
    push_docker_image "$app_name" "$version"

    log_info "Image built and pushed successfully"
}

function deploy_to_environment() {
    local app_name="$1"
    local environment="$2"
    local version="$3"
    local namespace="${4:-$environment}"

    log_info "Deploying $app_name:$version to $environment"

    local image="$DOCKER_REGISTRY/$app_name:$version"

    deploy_kubernetes_application "$app_name" "$image" "$namespace"

    # Run smoke tests
    local service_url="http://$app_name-service.$namespace.svc.cluster.local"
    wait_for_condition "curl -f $service_url/health" 60

    log_info "Deployment to $environment completed successfully"
}

function run_pipeline() {
    local app_name="$1"
    local version="$2"
    local target_environment="$3"

    log_info "Starting CI/CD pipeline for $app_name:$version"

    # Run tests
    run_tests "unit"
    run_tests "integration"
    run_tests "security"

    # Build and push image
    build_and_push_image "$app_name" "$version"

    # Deploy to staging first
    if [[ "$target_environment" != "staging" ]]; then
        deploy_to_environment "$app_name" "staging" "$version"

        # Run E2E tests in staging
        run_tests "e2e"
    fi

    # Deploy to target environment
    deploy_to_environment "$app_name" "$target_environment" "$version"

    log_info "CI/CD pipeline completed successfully"
}

# Main execution function
function main() {
    local command="${1:-help}"

    log_info "Starting DevOps automation script"

    check_prerequisites

    case "$command" in
        "build")
            shift
            build_and_push_image "$@"
            ;;
        "deploy")
            shift
            deploy_to_environment "$@"
            ;;
        "pipeline")
            shift
            run_pipeline "$@"
            ;;
        "monitor")
            shift
            install_prometheus_stack "$@"
            configure_alerting_rules "$@"
            ;;
        "logs")
            shift
            setup_log_aggregation "$@"
            ;;
        "database")
            shift
            deploy_postgresql_cluster "$@"
            ;;
        "backup")
            shift
            backup_postgresql_database "$@"
            ;;
        "restore")
            shift
            restore_postgresql_database "$@"
            ;;
        "cleanup")
            cleanup_docker_resources
            ;;
        "help"|*)
            echo "Usage: $0 {build|deploy|pipeline|monitor|logs|database|backup|restore|cleanup}"
            echo ""
            echo "Commands:"
            echo "  build <app> <version> [dockerfile] [context]    - Build and push Docker image"
            echo "  deploy <app> <env> <version> [namespace]        - Deploy application"
            echo "  pipeline <app> <version> <env>                  - Run full CI/CD pipeline"
            echo "  monitor <namespace> [storage-class] [retention] - Install monitoring"
            echo "  logs <namespace> [es-storage]                   - Setup log aggregation"
            echo "  database <name> <namespace> [size] [replicas]   - Deploy database"
            echo "  backup <cluster> <namespace> <db> [name]        - Backup database"
            echo "  restore <cluster> <namespace> <db> <file>       - Restore database"
            echo "  cleanup                                         - Clean up resources"
            ;;
    esac

    log_info "DevOps automation script completed"
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi