#!/bin/bash
# DevOps Infrastructure Management Script
# Practice file for Day 15: Paragraph Motion
# Focus: Clear paragraph boundaries for { } navigation

# Container Management Functions
# This section handles Docker container operations
# Use { } to jump between function blocks

function deploy_container() {
    local image_name="$1"
    local container_name="$2"
    local port_mapping="$3"

    echo "Deploying container: $container_name"
    docker run -d \
        --name "$container_name" \
        -p "$port_mapping" \
        --restart unless-stopped \
        --health-cmd="curl -f http://localhost/health || exit 1" \
        --health-interval=30s \
        --health-timeout=3s \
        --health-retries=3 \
        "$image_name"

    echo "Container deployed successfully"
    docker logs "$container_name"
}

function cleanup_containers() {
    echo "Starting container cleanup process"

    # Stop all running containers
    docker stop $(docker ps -q) 2>/dev/null || true

    # Remove exited containers
    docker container prune -f

    # Remove unused images
    docker image prune -f

    echo "Container cleanup completed"
}

# Kubernetes Deployment Functions
# This section manages Kubernetes cluster operations
# Practice navigating between these logical blocks

function deploy_to_kubernetes() {
    local deployment_name="$1"
    local namespace="$2"
    local image="$3"
    local replicas="${4:-3}"

    echo "Deploying $deployment_name to namespace $namespace"

    kubectl create namespace "$namespace" --dry-run=client -o yaml | kubectl apply -f -

    kubectl create deployment "$deployment_name" \
        --image="$image" \
        --replicas="$replicas" \
        --namespace="$namespace"

    kubectl expose deployment "$deployment_name" \
        --port=80 \
        --target-port=8080 \
        --type=LoadBalancer \
        --namespace="$namespace"

    echo "Deployment created, waiting for rollout"
    kubectl rollout status deployment/"$deployment_name" -n "$namespace"
}

function scale_deployment() {
    local deployment="$1"
    local namespace="$2"
    local replicas="$3"

    echo "Scaling $deployment to $replicas replicas"
    kubectl scale deployment "$deployment" --replicas="$replicas" -n "$namespace"

    kubectl get pods -n "$namespace" -l app="$deployment"

    echo "Scaling operation completed"
}

# Monitoring and Alerting Functions
# This section handles system monitoring
# Each function represents a distinct operational block

function setup_monitoring() {
    echo "Setting up comprehensive monitoring stack"

    # Deploy Prometheus
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update

    helm install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set grafana.adminPassword=admin123 \
        --set alertmanager.persistentVolume.enabled=true \
        --set prometheus.prometheusSpec.retention=30d

    echo "Prometheus monitoring stack deployed"
}

function configure_alerts() {
    local webhook_url="$1"

    echo "Configuring alerting rules"

    cat > /tmp/alerts.yaml << 'EOF'
groups:
- name: infrastructure.rules
  rules:
  - alert: HighCPUUsage
    expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High CPU usage detected
      description: "CPU usage is above 80% for more than 5 minutes"

  - alert: HighMemoryUsage
    expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High memory usage detected
      description: "Memory usage is above 85% for more than 5 minutes"
EOF

    kubectl apply -f /tmp/alerts.yaml
    echo "Alert rules configured successfully"
}

# Database Operations
# This section manages database deployments and maintenance
# Practice moving between database operation blocks

function deploy_database() {
    local db_type="$1"
    local db_name="$2"
    local storage_size="$3"

    echo "Deploying $db_type database: $db_name"

    case "$db_type" in
        "postgresql")
            helm install "$db_name" bitnami/postgresql \
                --set auth.postgresPassword=secretpassword \
                --set primary.persistence.size="$storage_size" \
                --set metrics.enabled=true \
                --namespace databases \
                --create-namespace
            ;;
        "mongodb")
            helm install "$db_name" bitnami/mongodb \
                --set auth.rootPassword=secretpassword \
                --set persistence.size="$storage_size" \
                --set metrics.enabled=true \
                --namespace databases \
                --create-namespace
            ;;
        "redis")
            helm install "$db_name" bitnami/redis \
                --set auth.password=secretpassword \
                --set master.persistence.size="$storage_size" \
                --namespace databases \
                --create-namespace
            ;;
    esac

    echo "Database $db_name deployed successfully"
}

function backup_database() {
    local db_name="$1"
    local backup_location="$2"
    local timestamp=$(date +"%Y%m%d_%H%M%S")

    echo "Starting database backup for $db_name"

    kubectl exec -n databases deployment/"$db_name" -- \
        pg_dump -U postgres -h localhost postgres > "$backup_location/backup_$timestamp.sql"

    # Compress the backup
    gzip "$backup_location/backup_$timestamp.sql"

    # Upload to S3
    aws s3 cp "$backup_location/backup_$timestamp.sql.gz" \
        s3://company-backups/databases/

    echo "Database backup completed and uploaded"
}

# Main Execution Block
# This is the primary execution flow
# Practice paragraph navigation to move between sections

function main() {
    echo "Starting DevOps automation script"

    # Environment setup
    export KUBECONFIG=/home/user/.kube/config
    export AWS_REGION=us-west-2

    # Check prerequisites
    command -v docker >/dev/null 2>&1 || { echo "Docker is required"; exit 1; }
    command -v kubectl >/dev/null 2>&1 || { echo "kubectl is required"; exit 1; }
    command -v helm >/dev/null 2>&1 || { echo "Helm is required"; exit 1; }

    echo "All prerequisites satisfied"

    # Execute operations based on arguments
    case "${1:-help}" in
        "deploy")
            deploy_container "nginx:latest" "web-server" "80:80"
            deploy_to_kubernetes "api-service" "production" "myapp:latest" 5
            ;;
        "monitor")
            setup_monitoring
            configure_alerts "https://hooks.slack.com/webhook"
            ;;
        "database")
            deploy_database "postgresql" "main-db" "10Gi"
            backup_database "main-db" "/backups"
            ;;
        "cleanup")
            cleanup_containers
            kubectl delete namespace test-env --ignore-not-found
            ;;
        "help"|*)
            echo "Usage: $0 {deploy|monitor|database|cleanup}"
            echo "  deploy   - Deploy containers and Kubernetes resources"
            echo "  monitor  - Setup monitoring and alerting"
            echo "  database - Deploy and backup databases"
            echo "  cleanup  - Clean up resources"
            ;;
    esac

    echo "DevOps automation script completed"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi