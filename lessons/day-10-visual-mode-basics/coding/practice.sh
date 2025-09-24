#!/bin/bash

# Container Orchestration and Service Discovery Script
# Designed for visual mode practice - structured blocks, arrays, and functions
# Practice selecting: functions, arrays, config blocks, heredocs, and structured data

set -euo pipefail

# Service discovery configuration array - practice visual selection
declare -A SERVICE_REGISTRY=(
    ["api-gateway"]="api-gateway.internal:8080"
    ["user-service"]="user-service.internal:8081"
    ["auth-service"]="auth-service.internal:8082"
    ["payment-service"]="payment-service.internal:8083"
    ["notification-service"]="notification-service.internal:8084"
    ["order-service"]="order-service.internal:8085"
    ["inventory-service"]="inventory-service.internal:8086"
    ["shipping-service"]="shipping-service.internal:8087"
    ["analytics-service"]="analytics-service.internal:8088"
    ["monitoring-service"]="monitoring-service.internal:8089"
)

# Environment configuration - practice selecting entire blocks
ENVIRONMENT="production"
CLUSTER_NAME="prod-cluster"
NAMESPACE="microservices"
DOCKER_REGISTRY="registry.company.com"
LOAD_BALANCER_CLASS="nginx"
TLS_SECRET_NAME="wildcard-tls"
MONITORING_NAMESPACE="observability"
LOGGING_NAMESPACE="logging"

# Color output functions - practice selecting function blocks
setup_colors() {
    if [[ -t 1 ]]; then
        RED='\033[0;31m'
        GREEN='\033[0;32m'
        YELLOW='\033[1;33m'
        BLUE='\033[0;34m'
        PURPLE='\033[0;35m'
        CYAN='\033[0;36m'
        WHITE='\033[1;37m'
        NC='\033[0m'
    else
        RED=''
        GREEN=''
        YELLOW=''
        BLUE=''
        PURPLE=''
        CYAN=''
        WHITE=''
        NC=''
    fi
}

# Logging functions - practice selecting multiple similar functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_debug() {
    if [[ "${DEBUG:-false}" == "true" ]]; then
        echo -e "${BLUE}[DEBUG]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
    fi
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

# Service health check function - practice selecting function with arrays
check_service_health() {
    local service_name="$1"
    local service_url="$2"
    local max_attempts="${3:-5}"
    local timeout="${4:-10}"

    log_info "Checking health of ${service_name} at ${service_url}"

    for ((attempt=1; attempt<=max_attempts; attempt++)); do
        if curl -sf --max-time "${timeout}" "${service_url}/health" >/dev/null 2>&1; then
            log_success "Service ${service_name} is healthy (attempt ${attempt}/${max_attempts})"
            return 0
        else
            log_warn "Service ${service_name} health check failed (attempt ${attempt}/${max_attempts})"
            if [[ $attempt -lt $max_attempts ]]; then
                sleep $((attempt * 2))
            fi
        fi
    done

    log_error "Service ${service_name} failed all health checks"
    return 1
}

# Generate service configuration - practice selecting heredoc blocks
generate_service_config() {
    local service_name="$1"
    local service_port="$2"
    local replicas="${3:-3}"
    local cpu_request="${4:-100m}"
    local memory_request="${5:-128Mi}"
    local cpu_limit="${6:-500m}"
    local memory_limit="${7:-512Mi}"

    cat <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service_name}
  namespace: ${NAMESPACE}
  labels:
    app: ${service_name}
    version: "1.0"
    environment: ${ENVIRONMENT}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${service_name}
  template:
    metadata:
      labels:
        app: ${service_name}
        version: "1.0"
    spec:
      containers:
      - name: ${service_name}
        image: ${DOCKER_REGISTRY}/${service_name}:latest
        ports:
        - containerPort: ${service_port}
          name: http
          protocol: TCP
        resources:
          requests:
            cpu: "${cpu_request}"
            memory: "${memory_request}"
          limits:
            cpu: "${cpu_limit}"
            memory: "${memory_limit}"
        livenessProbe:
          httpGet:
            path: /health
            port: ${service_port}
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
        readinessProbe:
          httpGet:
            path: /ready
            port: ${service_port}
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
        env:
        - name: SERVICE_NAME
          value: "${service_name}"
        - name: SERVICE_PORT
          value: "${service_port}"
        - name: ENVIRONMENT
          value: "${ENVIRONMENT}"
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
    targetPort: ${service_port}
    protocol: TCP
    name: http
  type: ClusterIP
EOF
}

# Database configuration generator - practice selecting complex heredocs
generate_database_config() {
    local db_name="$1"
    local db_user="$2"
    local storage_size="${3:-20Gi}"

    cat <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: ${db_name}-credentials
  namespace: ${NAMESPACE}
type: Opaque
data:
  username: $(echo -n "${db_user}" | base64)
  password: $(openssl rand -base64 32 | tr -d '\n' | base64)
  database: $(echo -n "${db_name}" | base64)
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ${db_name}
  namespace: ${NAMESPACE}
spec:
  serviceName: ${db_name}
  replicas: 1
  selector:
    matchLabels:
      app: ${db_name}
  template:
    metadata:
      labels:
        app: ${db_name}
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
          name: postgres
        env:
        - name: POSTGRES_DB
          valueFrom:
            secretKeyRef:
              name: ${db_name}-credentials
              key: database
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: ${db_name}-credentials
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: ${db_name}-credentials
              key: password
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            cpu: "250m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "2Gi"
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: ${storage_size}
EOF
}

# Load balancer configuration - practice selecting structured configuration
configure_load_balancer() {
    local services=("$@")

    log_info "Configuring load balancer for services: ${services[*]}"

    cat <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: microservices-ingress
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/ingress.class: "${LOAD_BALANCER_CLASS}"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /\$2
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.company.com
    secretName: ${TLS_SECRET_NAME}
  rules:
  - host: api.company.com
    http:
      paths:
EOF

    for service in "${services[@]}"; do
        cat <<EOF
      - path: /${service}(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: ${service}
            port:
              number: 80
EOF
    done
}

# Monitoring configuration array - practice selecting array elements
declare -a MONITORING_ENDPOINTS=(
    "prometheus:http://prometheus.${MONITORING_NAMESPACE}:9090"
    "grafana:http://grafana.${MONITORING_NAMESPACE}:3000"
    "alertmanager:http://alertmanager.${MONITORING_NAMESPACE}:9093"
    "jaeger:http://jaeger.${MONITORING_NAMESPACE}:16686"
    "kibana:http://kibana.${LOGGING_NAMESPACE}:5601"
    "elasticsearch:http://elasticsearch.${LOGGING_NAMESPACE}:9200"
)

# Service discovery registration - practice selecting loop blocks
register_services() {
    log_info "Registering services in service discovery"

    for service_name in "${!SERVICE_REGISTRY[@]}"; do
        local service_url="${SERVICE_REGISTRY[$service_name]}"
        log_info "Registering ${service_name} at ${service_url}"

        # Register service in Consul
        curl -X PUT "http://consul.service.consul:8500/v1/agent/service/register" \
            -H "Content-Type: application/json" \
            -d "{
                \"ID\": \"${service_name}-$(hostname)\",
                \"Name\": \"${service_name}\",
                \"Address\": \"$(echo ${service_url} | cut -d: -f1)\",
                \"Port\": $(echo ${service_url} | cut -d: -f2),
                \"Check\": {
                    \"HTTP\": \"http://${service_url}/health\",
                    \"Interval\": \"10s\",
                    \"Timeout\": \"3s\"
                },
                \"Tags\": [\"${ENVIRONMENT}\", \"microservice\", \"v1.0\"]
            }"
    done
}

# Deployment pipeline configuration - practice selecting complex structures
setup_deployment_pipeline() {
    local pipeline_name="$1"

    cat <<EOF
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: ${pipeline_name}
  namespace: ${NAMESPACE}
spec:
  params:
  - name: git-url
    type: string
    description: Git repository URL
  - name: git-revision
    type: string
    default: main
    description: Git revision to build
  - name: image-name
    type: string
    description: Container image name
  - name: image-tag
    type: string
    default: latest
    description: Container image tag

  workspaces:
  - name: shared-data
    description: Workspace for sharing data between tasks
  - name: docker-credentials
    description: Docker registry credentials

  tasks:
  - name: fetch-source
    taskRef:
      name: git-clone
    workspaces:
    - name: output
      workspace: shared-data
    params:
    - name: url
      value: \$(params.git-url)
    - name: revision
      value: \$(params.git-revision)

  - name: run-tests
    runAfter: ["fetch-source"]
    taskRef:
      name: golang-test
    workspaces:
    - name: source
      workspace: shared-data

  - name: build-image
    runAfter: ["run-tests"]
    taskRef:
      name: buildah
    workspaces:
    - name: source
      workspace: shared-data
    - name: dockerconfig
      workspace: docker-credentials
    params:
    - name: IMAGE
      value: \$(params.image-name):\$(params.image-tag)

  - name: security-scan
    runAfter: ["build-image"]
    taskRef:
      name: trivy-scanner
    params:
    - name: IMAGE
      value: \$(params.image-name):\$(params.image-tag)

  - name: deploy-to-staging
    runAfter: ["security-scan"]
    taskRef:
      name: kubernetes-deploy
    params:
    - name: IMAGE
      value: \$(params.image-name):\$(params.image-tag)
    - name: NAMESPACE
      value: staging
EOF
}

# Main orchestration function - practice selecting entire function blocks
main() {
    setup_colors

    log_info "Starting container orchestration and service discovery setup"
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Cluster: ${CLUSTER_NAME}"
    log_info "Namespace: ${NAMESPACE}"

    # Create namespace if it doesn't exist
    kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -
    kubectl create namespace "${MONITORING_NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -
    kubectl create namespace "${LOGGING_NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

    # Deploy core services
    log_info "Deploying core services..."
    for service_name in "${!SERVICE_REGISTRY[@]}"; do
        local port=$(echo "${SERVICE_REGISTRY[$service_name]}" | cut -d: -f2)
        generate_service_config "${service_name}" "${port}" 2 "200m" "256Mi" "500m" "512Mi" | kubectl apply -f -
    done

    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    for service_name in "${!SERVICE_REGISTRY[@]}"; do
        kubectl wait --for=condition=available deployment "${service_name}" -n "${NAMESPACE}" --timeout=300s
    done

    # Configure load balancer
    log_info "Configuring load balancer..."
    configure_load_balancer "${!SERVICE_REGISTRY[@]}" | kubectl apply -f -

    # Register services for discovery
    register_services

    # Setup monitoring
    log_info "Configuring monitoring endpoints..."
    for endpoint in "${MONITORING_ENDPOINTS[@]}"; do
        local name=$(echo "$endpoint" | cut -d: -f1)
        local url=$(echo "$endpoint" | cut -d: -f2,3)
        log_info "Monitoring endpoint configured: ${name} -> ${url}"
    done

    # Generate database configurations
    log_info "Setting up databases..."
    generate_database_config "userdb" "app_user" "50Gi" | kubectl apply -f -
    generate_database_config "orderdb" "order_user" "100Gi" | kubectl apply -f -
    generate_database_config "analyticsdb" "analytics_user" "200Gi" | kubectl apply -f -

    # Setup deployment pipeline
    log_info "Setting up deployment pipeline..."
    setup_deployment_pipeline "microservices-pipeline" | kubectl apply -f -

    log_success "Container orchestration and service discovery setup completed!"
    log_info "Services registered: ${#SERVICE_REGISTRY[@]} services"
    log_info "Monitoring endpoints: ${#MONITORING_ENDPOINTS[@]} endpoints"
    log_info "Load balancer configured for all services"
}

# Health check function for all services - practice selecting conditional blocks
perform_health_checks() {
    local failed_services=()

    for service_name in "${!SERVICE_REGISTRY[@]}"; do
        local service_url="http://${SERVICE_REGISTRY[$service_name]}"

        if ! check_service_health "${service_name}" "${service_url}" 3 5; then
            failed_services+=("${service_name}")
        fi
    done

    if [[ ${#failed_services[@]} -eq 0 ]]; then
        log_success "All services are healthy"
        return 0
    else
        log_error "Failed services: ${failed_services[*]}"
        return 1
    fi
}

# Cleanup function - practice selecting cleanup blocks
cleanup_resources() {
    local cleanup_older_than="${1:-7d}"

    log_info "Cleaning up resources older than ${cleanup_older_than}"

    # Clean up completed jobs
    kubectl delete job --field-selector=status.successful=1 -n "${NAMESPACE}"

    # Clean up old replica sets
    kubectl delete rs --field-selector=status.replicas=0 -n "${NAMESPACE}"

    # Clean up old pods
    kubectl delete pod --field-selector=status.phase=Succeeded -n "${NAMESPACE}"
    kubectl delete pod --field-selector=status.phase=Failed -n "${NAMESPACE}"

    log_success "Cleanup completed"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-main}" in
        "main")
            main
            ;;
        "health")
            perform_health_checks
            ;;
        "cleanup")
            cleanup_resources "${2:-7d}"
            ;;
        "register")
            register_services
            ;;
        *)
            echo "Usage: $0 [main|health|cleanup|register]"
            exit 1
            ;;
    esac
fi