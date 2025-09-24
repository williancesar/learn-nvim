#!/bin/bash

# DevOps Infrastructure Setup Script - Contains intentional errors for undo/redo practice
# This script deploys a microservices architecture with monitoring

set -e

# Configuration variables
CLUSTER_NAME="prod-k8s-cluster"
REGION="us-west-2"
NAMESPACE="microservices"
MONITORING_NAMESPACE="monitoring"
DOCKER_REGISTRY="myregistry.azurecr.io"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Error: Missing function parameter
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi

    # Check if helm is installed
    if ! command -v helm > /dev/null; then
        log_error "helm is not installed"
        exit 1
    fi

    # Error: Wrong comparison operator
    if [ "$EUID" = 0 ]; then
        log_error "Please do not run this script as root"
        exit 1
    fi

    log_info "Prerequisites check passed"
}

# Error: Function name typo
create_namspaces() {
    log_info "Creating Kubernetes namespaces..."

    # Create application namespace
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    kubectl label namespace ${NAMESPACE} app=microservices

    # Create monitoring namespace
    kubectl create namespace ${MONITORING_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    kubectl label namespace ${MONITORING_NAMESPACE} app=monitoring

    log_info "Namespaces created successfully"
}

deploy_database() {
    log_info "Deploying PostgreSQL database..."

    # Error: Missing quote
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update

    # Deploy PostgreSQL with custom values
    helm upgrade --install postgresql bitnami/postgresql \
        --namespace ${NAMESPACE} \
        --set auth.postgresPassword="securepassword123" \
        --set auth.database="microservices_db" \
        --set primary.persistence.size="20Gi" \
        --set primary.resources.requests.cpu="500m" \
        --set primary.resources.requests.memory="1Gi" \
        --set primary.resources.limits.cpu="1000m" \
        --set primary.resources.limits.memory="2Gi"

    # Wait for PostgreSQL to be ready
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=postgresql -n ${NAMESPACE} --timeout=300s

    log_info "PostgreSQL deployed successfully"
}

deploy_redis() {
    log_info "Deploying Redis cache..."

    # Error: Wrong flag syntax
    helm upgrade --install redis bitnami/redis \
        --namespace ${NAMESPACE} \
        --set auth.enabled=true \
        --set auth.password="redispassword123" \
        --set master.persistence.size="10Gi" \
        --set replica.replicaCount=2 \
        --set metrics.enabled=true \
        --set metrics.serviceMonitor.enabled=true

    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=redis -n ${NAMESPACE} --timeout=300s

    log_info "Redis deployed successfully"
}

# Error: Function parameter issue
deploy_microservices($service_name) {
    log_info "Deploying microservice: ${service_name}"

    # Error: Incorrect variable reference
    IMAGE_TAG="${DOCKER_REGISTRY}/${service_nam}:latest"

    cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service_name}
  namespace: ${NAMESPACE}
  labels:
    app: ${service_name}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${service_name}
  template:
    metadata:
      labels:
        app: ${service_name}
    spec:
      containers:
      - name: ${service_name}
        image: ${IMAGE_TAG}
        ports:
        - containerPort: 8080
        env:
        - name: DB_HOST
          value: "postgresql.${NAMESPACE}.svc.cluster.local"
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgresql
              key: postgres-password
        - name: REDIS_HOST
          value: "redis-master.${NAMESPACE}.svc.cluster.local"
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: redis
              key: redis-password
        resources:
          requests:
            cpu: "200m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ${service_name}
  namespace: ${NAMESPACE}
  labels:
    app: ${service_name}
spec:
  selector:
    app: ${service_name}
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
  type: ClusterIP
EOF

    log_info "Microservice ${service_name} deployed"
}

deploy_ingress() {
    log_info "Deploying NGINX Ingress Controller..."

    # Install NGINX Ingress Controller
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update

    # Error: Missing parameter value
    helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.replicaCount= \
        --set controller.service.type=LoadBalancer \
        --set controller.metrics.enabled=true \
        --set controller.metrics.serviceMonitor.enabled=true

    kubectl wait --namespace ingress-nginx \
        --for=condition=ready pod \
        --selector=app.kubernetes.io/component=controller \
        --timeout=300s

    log_info "NGINX Ingress Controller deployed"
}

deploy_monitoring() {
    log_info "Deploying monitoring stack..."

    # Add Prometheus community helm repo
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update

    # Deploy kube-prometheus-stack
    helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
        --namespace ${MONITORING_NAMESPACE} \
        --set prometheus.prometheusSpec.retention="30d" \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage="50Gi" \
        --set grafana.adminPassword="admin123" \
        --set grafana.persistence.enabled=true \
        --set grafana.persistence.size="10Gi" \
        --set alertmanager.alertmanagerSpec.storage.volumeClaimTemplate.spec.resources.requests.storage="10Gi"

    # Wait for Prometheus to be ready
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=prometheus -n ${MONITORING_NAMESPACE} --timeout=600s

    log_info "Monitoring stack deployed successfully"
}

# Error: Missing closing bracket
configure_monitoring_alerts() {
    log_info "Configuring monitoring alerts..."

    cat <<EOF | kubectl apply -f -
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: microservices-alerts
  namespace: ${MONITORING_NAMESPACE}
  labels:
    prometheus: kube-prometheus
    role: alert-rules
spec:
  groups:
  - name: microservices.rules
    rules:
    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "High error rate detected"
        description: "Error rate is above 10% for {{ $labels.service }}"

    - alert: HighMemoryUsage
      expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High memory usage detected"
        description: "Memory usage is above 90% for {{ $labels.pod }}"

    - alert: PodCrashLooping
      expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "Pod is crash looping"
        description: "Pod {{ $labels.pod }} is crash looping in namespace {{ $labels.namespace }"
EOF

    log_info "Monitoring alerts configured"

# Error: Function missing main execution flow
setup_logging() {
    log_info "Setting up centralized logging..."

    # Add Elastic helm repository
    helm repo add elastic https://helm.elastic.co
    helm repo update

    # Deploy Elasticsearch
    helm upgrade --install elasticsearch elastic/elasticsearch \
        --namespace ${MONITORING_NAMESPACE} \
        --set replicas=1 \
        --set minimumMasterNodes=1 \
        --set resources.requests.cpu="1000m" \
        --set resources.requests.memory="2Gi" \
        --set resources.limits.cpu="2000m" \
        --set resources.limits.memory="4Gi" \
        --set volumeClaimTemplate.resources.requests.storage="30Gi"

    # Deploy Kibana
    helm upgrade --install kibana elastic/kibana \
        --namespace ${MONITORING_NAMESPACE} \
        --set resources.requests.cpu="500m" \
        --set resources.requests.memory="1Gi"

    # Deploy Fluentd
    helm repo add fluent https://fluent.github.io/helm-charts
    helm upgrade --install fluentd fluent/fluentd \
        --namespace ${MONITORING_NAMESPACE} \
        --set output.elasticsearch.enabled=true \
        --set output.elasticsearch.host="elasticsearch-master" \
        --set output.elasticsearch.port=9200

    log_info "Centralized logging setup complete"
}

# Error: Wrong variable name
cleanup_old_resources() {
    log_info "Cleaning up old resources..."

    # Remove old deployments
    kubectl delete deployment --selector=version=old -n ${NAMESPACE} --ignore-not-found=true

    # Remove unused ConfigMaps older than 7 days
    kubectl get configmap -n ${NAMESPACE} --sort-by=.metadata.creationTimestamp | \
        awk 'NR>1 && (systime() - mktime(gensub(/-|T|:/, " ", "g", $5))) > 604800 {print $1}' | \
        xargs -I {} kubectl delete configmap {} -n ${NAMESPCE}

    # Clean up completed jobs
    kubectl delete job --field-selector=status.successful=1 -n ${NAMESPACE}

    log_info "Cleanup completed"
}

# Main execution
main() {
    log_info "Starting DevOps infrastructure deployment..."

    check_prerequisites
    create_namspaces

    deploy_database
    deploy_redis

    # Deploy microservices
    SERVICES=("user-service" "order-service" "payment-service" "notification-service")
    for service in "${SERVICES[@]}"; do
        deploy_microservices $service
    done

    deploy_ingress
    deploy_monitoring
    configure_monitoring_alerts
    setup_logging
    cleanup_old_resources

    log_info "Infrastructure deployment completed successfully!"
    log_info "Access Grafana: kubectl port-forward svc/prometheus-grafana 3000:80 -n ${MONITORING_NAMESPACE}"
    log_info "Access Kibana: kubectl port-forward svc/kibana-kibana 5601:5601 -n ${MONITORING_NAMESPACE}"
}

# Error: Missing condition
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
# Missing fi statement