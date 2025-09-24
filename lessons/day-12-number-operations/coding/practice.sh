#!/bin/bash

# Container Resource Management and Scaling Script
# This script contains numerous numeric values for practicing Ctrl-a/Ctrl-x operations
# Practice incrementing/decrementing: ports, replicas, timeouts, versions, etc.

set -euo pipefail

# Version and release configuration
APP_VERSION="2.1.3"
API_VERSION="v1"
CHART_VERSION="1.5.2"
IMAGE_TAG="2024.03.15"
BUILD_NUMBER="1247"
RELEASE_CANDIDATE="rc3"

# Network and port configuration
API_GATEWAY_PORT="8080"
USER_SERVICE_PORT="8081"
AUTH_SERVICE_PORT="8082"
PAYMENT_SERVICE_PORT="8083"
ORDER_SERVICE_PORT="8084"
INVENTORY_PORT="8085"
NOTIFICATION_PORT="8086"
ANALYTICS_PORT="8087"
HEALTH_CHECK_PORT="9090"
METRICS_PORT="9091"
DEBUG_PORT="40000"

# Load balancer ports
LB_HTTP_PORT="80"
LB_HTTPS_PORT="443"
LB_ADMIN_PORT="8443"
LB_STATS_PORT="1936"

# Database configuration
DB_PRIMARY_PORT="5432"
DB_REPLICA_PORT="5433"
DB_ADMIN_PORT="5434"
DB_BACKUP_PORT="5435"
REDIS_PORT="6379"
REDIS_CLUSTER_PORTS="6380 6381 6382 6383 6384 6385"
MONGODB_PORT="27017"
ELASTICSEARCH_PORT="9200"
ELASTICSEARCH_TRANSPORT_PORT="9300"

# Resource limits and requests
API_GATEWAY_REPLICAS="3"
USER_SERVICE_REPLICAS="5"
AUTH_SERVICE_REPLICAS="2"
PAYMENT_SERVICE_REPLICAS="4"
ORDER_SERVICE_REPLICAS="6"
INVENTORY_REPLICAS="2"
NOTIFICATION_REPLICAS="3"
ANALYTICS_REPLICAS="2"

# CPU resources (in millicores)
API_GATEWAY_CPU_REQUEST="200"
API_GATEWAY_CPU_LIMIT="500"
USER_SERVICE_CPU_REQUEST="150"
USER_SERVICE_CPU_LIMIT="300"
AUTH_SERVICE_CPU_REQUEST="100"
AUTH_SERVICE_CPU_LIMIT="250"
PAYMENT_CPU_REQUEST="300"
PAYMENT_CPU_LIMIT="600"
ORDER_CPU_REQUEST="250"
ORDER_CPU_LIMIT="500"

# Memory resources (in Mi)
API_GATEWAY_MEM_REQUEST="256"
API_GATEWAY_MEM_LIMIT="512"
USER_SERVICE_MEM_REQUEST="128"
USER_SERVICE_MEM_LIMIT="256"
AUTH_SERVICE_MEM_REQUEST="64"
AUTH_SERVICE_MEM_LIMIT="128"
PAYMENT_MEM_REQUEST="512"
PAYMENT_MEM_LIMIT="1024"
ORDER_MEM_REQUEST="256"
ORDER_MEM_LIMIT="512"

# Storage configuration
DB_STORAGE_SIZE="50"
REDIS_STORAGE_SIZE="10"
LOG_STORAGE_SIZE="20"
BACKUP_STORAGE_SIZE="100"
METRICS_STORAGE_SIZE="30"
ELASTICSEARCH_STORAGE_SIZE="200"

# Timeout configuration (in seconds)
HEALTH_CHECK_TIMEOUT="5"
READINESS_TIMEOUT="3"
LIVENESS_TIMEOUT="10"
CONNECTION_TIMEOUT="30"
REQUEST_TIMEOUT="60"
SHUTDOWN_TIMEOUT="30"
STARTUP_TIMEOUT="120"
DEPLOYMENT_TIMEOUT="600"

# Scaling configuration
MIN_REPLICAS="1"
MAX_REPLICAS="10"
TARGET_CPU_PERCENTAGE="70"
TARGET_MEMORY_PERCENTAGE="80"
SCALE_UP_REPLICAS="2"
SCALE_DOWN_REPLICAS="1"
COOLDOWN_PERIOD="300"

# Monitoring and alerting thresholds
CPU_ALERT_THRESHOLD="85"
MEMORY_ALERT_THRESHOLD="90"
DISK_ALERT_THRESHOLD="80"
NETWORK_ALERT_THRESHOLD="75"
ERROR_RATE_THRESHOLD="5"
RESPONSE_TIME_THRESHOLD="500"
AVAILABILITY_THRESHOLD="99.9"

# Backup and retention settings
BACKUP_RETENTION_DAYS="30"
LOG_RETENTION_DAYS="7"
METRIC_RETENTION_DAYS="90"
SNAPSHOT_RETENTION_COUNT="5"
ARCHIVE_RETENTION_MONTHS="12"

# Security settings
SESSION_TIMEOUT_MINUTES="30"
TOKEN_EXPIRY_HOURS="24"
PASSWORD_MIN_LENGTH="8"
PASSWORD_MAX_AGE_DAYS="90"
LOGIN_ATTEMPT_LIMIT="3"
ACCOUNT_LOCKOUT_MINUTES="15"
API_RATE_LIMIT_PER_MINUTE="1000"
CONCURRENT_SESSION_LIMIT="5"

# Deployment configuration
ROLLING_UPDATE_MAX_SURGE="25%"
ROLLING_UPDATE_MAX_UNAVAILABLE="25%"
REVISION_HISTORY_LIMIT="10"
PROGRESS_DEADLINE_SECONDS="600"

# Function to generate deployment configuration with numeric values
generate_deployment_config() {
    local service_name="$1"
    local replicas="$2"
    local port="$3"
    local cpu_request="$4"
    local cpu_limit="$5"
    local mem_request="$6"
    local mem_limit="$7"

    cat <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service_name}
  labels:
    app: ${service_name}
    version: "${APP_VERSION}"
spec:
  replicas: ${replicas}
  revisionHistoryLimit: ${REVISION_HISTORY_LIMIT}
  progressDeadlineSeconds: ${PROGRESS_DEADLINE_SECONDS}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: ${ROLLING_UPDATE_MAX_SURGE}
      maxUnavailable: ${ROLLING_UPDATE_MAX_UNAVAILABLE}
  selector:
    matchLabels:
      app: ${service_name}
  template:
    metadata:
      labels:
        app: ${service_name}
        version: "${APP_VERSION}"
    spec:
      containers:
      - name: ${service_name}
        image: myregistry.io/${service_name}:${IMAGE_TAG}
        ports:
        - containerPort: ${port}
          name: http
        - containerPort: ${HEALTH_CHECK_PORT}
          name: health
        - containerPort: ${METRICS_PORT}
          name: metrics
        resources:
          requests:
            cpu: "${cpu_request}m"
            memory: "${mem_request}Mi"
          limits:
            cpu: "${cpu_limit}m"
            memory: "${mem_limit}Mi"
        env:
        - name: PORT
          value: "${port}"
        - name: HEALTH_PORT
          value: "${HEALTH_CHECK_PORT}"
        - name: METRICS_PORT
          value: "${METRICS_PORT}"
        - name: VERSION
          value: "${APP_VERSION}"
        - name: BUILD_NUMBER
          value: "${BUILD_NUMBER}"
        - name: MAX_CONNECTIONS
          value: "100"
        - name: WORKER_THREADS
          value: "4"
        - name: CONNECTION_POOL_SIZE
          value: "20"
        - name: CACHE_SIZE_MB
          value: "64"
        livenessProbe:
          httpGet:
            path: /health
            port: ${HEALTH_CHECK_PORT}
          initialDelaySeconds: ${STARTUP_TIMEOUT}
          periodSeconds: ${LIVENESS_TIMEOUT}
          timeoutSeconds: ${HEALTH_CHECK_TIMEOUT}
          failureThreshold: 3
          successThreshold: 1
        readinessProbe:
          httpGet:
            path: /ready
            port: ${HEALTH_CHECK_PORT}
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: ${READINESS_TIMEOUT}
          failureThreshold: 3
          successThreshold: 1
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sleep", "${SHUTDOWN_TIMEOUT}"]
EOF
}

# HPA configuration with numeric thresholds
generate_hpa_config() {
    local service_name="$1"
    local min_replicas="$2"
    local max_replicas="$3"
    local target_cpu="$4"

    cat <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${service_name}-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${service_name}
  minReplicas: ${min_replicas}
  maxReplicas: ${max_replicas}
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: ${target_cpu}
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: ${TARGET_MEMORY_PERCENTAGE}
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: ${SCALE_UP_REPLICAS}
        periodSeconds: 15
      selectPolicy: Max
    scaleDown:
      stabilizationWindowSeconds: ${COOLDOWN_PERIOD}
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
      - type: Pods
        value: ${SCALE_DOWN_REPLICAS}
        periodSeconds: 60
      selectPolicy: Min
EOF
}

# Database deployment with storage and resource specifications
generate_database_config() {
    local db_type="$1"
    local storage_size="$2"
    local port="$3"
    local cpu_request="$4"
    local memory_request="$5"

    cat <<EOF
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ${db_type}
spec:
  serviceName: ${db_type}
  replicas: 1
  selector:
    matchLabels:
      app: ${db_type}
  template:
    metadata:
      labels:
        app: ${db_type}
    spec:
      containers:
      - name: ${db_type}
        image: ${db_type}:13
        ports:
        - containerPort: ${port}
          name: ${db_type}
        env:
        - name: POSTGRES_DB
          value: "appdb"
        - name: POSTGRES_USER
          value: "appuser"
        - name: POSTGRES_PASSWORD
          value: "securepass123"
        - name: MAX_CONNECTIONS
          value: "200"
        - name: SHARED_BUFFERS
          value: "256MB"
        - name: EFFECTIVE_CACHE_SIZE
          value: "1GB"
        - name: CHECKPOINT_COMPLETION_TARGET
          value: "0.9"
        - name: WAL_BUFFERS
          value: "16MB"
        resources:
          requests:
            cpu: "${cpu_request}m"
            memory: "${memory_request}Mi"
          limits:
            cpu: "$((cpu_request * 2))m"
            memory: "$((memory_request * 2))Mi"
        volumeMounts:
        - name: ${db_type}-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: ${db_type}-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: ${storage_size}Gi
EOF
}

# Load balancer configuration with port mappings
generate_loadbalancer_config() {
    cat <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  nginx.conf: |
    upstream api_gateway {
        least_conn;
        server api-gateway-1:${API_GATEWAY_PORT} max_fails=3 fail_timeout=30s;
        server api-gateway-2:${API_GATEWAY_PORT} max_fails=3 fail_timeout=30s;
        server api-gateway-3:${API_GATEWAY_PORT} max_fails=3 fail_timeout=30s;
    }

    upstream user_service {
        least_conn;
        server user-service-1:${USER_SERVICE_PORT} max_fails=2 fail_timeout=20s;
        server user-service-2:${USER_SERVICE_PORT} max_fails=2 fail_timeout=20s;
        server user-service-3:${USER_SERVICE_PORT} max_fails=2 fail_timeout=20s;
        server user-service-4:${USER_SERVICE_PORT} max_fails=2 fail_timeout=20s;
        server user-service-5:${USER_SERVICE_PORT} max_fails=2 fail_timeout=20s;
    }

    server {
        listen ${LB_HTTP_PORT};
        listen ${LB_HTTPS_PORT} ssl;

        ssl_certificate /etc/ssl/certs/app.crt;
        ssl_certificate_key /etc/ssl/private/app.key;
        ssl_session_timeout ${SESSION_TIMEOUT_MINUTES}m;
        ssl_session_cache shared:SSL:10m;
        ssl_protocols TLSv1.2 TLSv1.3;

        client_max_body_size 10m;
        client_body_timeout ${REQUEST_TIMEOUT}s;
        client_header_timeout ${CONNECTION_TIMEOUT}s;
        keepalive_timeout 65s;

        location /api/ {
            proxy_pass http://api_gateway/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_connect_timeout ${CONNECTION_TIMEOUT}s;
            proxy_send_timeout ${REQUEST_TIMEOUT}s;
            proxy_read_timeout ${REQUEST_TIMEOUT}s;
            proxy_next_upstream_timeout 0;
            proxy_next_upstream_tries 3;
        }

        location /users/ {
            proxy_pass http://user_service/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_connect_timeout ${CONNECTION_TIMEOUT}s;
            proxy_send_timeout ${REQUEST_TIMEOUT}s;
            proxy_read_timeout ${REQUEST_TIMEOUT}s;
        }
    }

    server {
        listen ${LB_STATS_PORT};
        location /nginx_status {
            stub_status on;
            access_log off;
            allow 10.0.0.0/8;
            allow 172.16.0.0/12;
            allow 192.168.0.0/16;
            deny all;
        }
    }
EOF
}

# Monitoring configuration with thresholds and intervals
generate_monitoring_config() {
    cat <<EOF
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: application-alerts
spec:
  groups:
  - name: application.rules
    interval: 30s
    rules:
    - alert: HighCPUUsage
      expr: rate(container_cpu_usage_seconds_total[5m]) * 100 > ${CPU_ALERT_THRESHOLD}
      for: 2m
      labels:
        severity: warning
      annotations:
        summary: "High CPU usage detected"
        description: "CPU usage is above ${CPU_ALERT_THRESHOLD}% for {{ \$labels.pod }}"

    - alert: HighMemoryUsage
      expr: (container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100 > ${MEMORY_ALERT_THRESHOLD}
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "High memory usage detected"
        description: "Memory usage is above ${MEMORY_ALERT_THRESHOLD}% for {{ \$labels.pod }}"

    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100 > ${ERROR_RATE_THRESHOLD}
      for: 2m
      labels:
        severity: critical
      annotations:
        summary: "High error rate detected"
        description: "Error rate is above ${ERROR_RATE_THRESHOLD}% for {{ \$labels.service }}"

    - alert: SlowResponseTime
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) * 1000 > ${RESPONSE_TIME_THRESHOLD}
      for: 3m
      labels:
        severity: warning
      annotations:
        summary: "Slow response time detected"
        description: "95th percentile response time is above ${RESPONSE_TIME_THRESHOLD}ms"

    - alert: LowAvailability
      expr: (up == 0) * 100 < ${AVAILABILITY_THRESHOLD}
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Service availability is low"
        description: "Service availability is below ${AVAILABILITY_THRESHOLD}%"

    - alert: DiskSpaceHigh
      expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < (100 - ${DISK_ALERT_THRESHOLD})
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "Disk space usage is high"
        description: "Disk usage is above ${DISK_ALERT_THRESHOLD}% on {{ \$labels.device }}"
EOF
}

# Function to perform load testing with configurable parameters
perform_load_test() {
    local target_url="$1"
    local concurrent_users="${2:-10}"
    local test_duration="${3:-60}"
    local ramp_up_time="${4:-30}"
    local requests_per_second="${5:-100}"

    echo "Starting load test with ${concurrent_users} users for ${test_duration} seconds"
    echo "Ramp-up time: ${ramp_up_time} seconds"
    echo "Target RPS: ${requests_per_second}"

    # Simulate load test configuration
    cat <<EOF > load-test-config.yaml
scenarios:
  default:
    executor: ramping-vus
    stages:
      - duration: ${ramp_up_time}s
        target: ${concurrent_users}
      - duration: ${test_duration}s
        target: ${concurrent_users}
      - duration: ${ramp_up_time}s
        target: 0
    options:
      rps: ${requests_per_second}

thresholds:
  http_req_duration:
    - p(95)<${RESPONSE_TIME_THRESHOLD}
  http_req_failed:
    - rate<0.05
  checks:
    - rate>0.95

options:
  hosts:
    api.example.com: 127.0.0.1:${API_GATEWAY_PORT}
EOF
}

# Resource cleanup with configurable retention
cleanup_resources() {
    local retention_days="${1:-${LOG_RETENTION_DAYS}}"
    local backup_retention="${2:-${BACKUP_RETENTION_DAYS}}"

    echo "Cleaning up resources older than ${retention_days} days"
    echo "Backup retention: ${backup_retention} days"

    # Cleanup completed jobs
    kubectl delete job --field-selector=status.successful=1 --all-namespaces

    # Cleanup old pods
    kubectl delete pod --field-selector=status.phase=Succeeded --all-namespaces
    kubectl delete pod --field-selector=status.phase=Failed --all-namespaces

    # Cleanup logs (simulated)
    echo "Would clean up logs older than ${retention_days} days"
    echo "Would clean up backups older than ${backup_retention} days"
}

# Main deployment function
main() {
    echo "Starting deployment with version ${APP_VERSION}"
    echo "Build number: ${BUILD_NUMBER}"
    echo "Chart version: ${CHART_VERSION}"

    # Deploy all services with their specific configurations
    generate_deployment_config "api-gateway" "$API_GATEWAY_REPLICAS" "$API_GATEWAY_PORT" \
        "$API_GATEWAY_CPU_REQUEST" "$API_GATEWAY_CPU_LIMIT" \
        "$API_GATEWAY_MEM_REQUEST" "$API_GATEWAY_MEM_LIMIT" | kubectl apply -f -

    generate_deployment_config "user-service" "$USER_SERVICE_REPLICAS" "$USER_SERVICE_PORT" \
        "$USER_SERVICE_CPU_REQUEST" "$USER_SERVICE_CPU_LIMIT" \
        "$USER_SERVICE_MEM_REQUEST" "$USER_SERVICE_MEM_LIMIT" | kubectl apply -f -

    generate_deployment_config "payment-service" "$PAYMENT_SERVICE_REPLICAS" "$PAYMENT_SERVICE_PORT" \
        "$PAYMENT_CPU_REQUEST" "$PAYMENT_CPU_LIMIT" \
        "$PAYMENT_MEM_REQUEST" "$PAYMENT_MEM_LIMIT" | kubectl apply -f -

    # Setup horizontal pod autoscalers
    generate_hpa_config "api-gateway" "$MIN_REPLICAS" "$MAX_REPLICAS" "$TARGET_CPU_PERCENTAGE" | kubectl apply -f -
    generate_hpa_config "user-service" "2" "8" "$TARGET_CPU_PERCENTAGE" | kubectl apply -f -
    generate_hpa_config "payment-service" "1" "6" "80" | kubectl apply -f -

    # Deploy databases
    generate_database_config "postgresql" "$DB_STORAGE_SIZE" "$DB_PRIMARY_PORT" "500" "1024" | kubectl apply -f -
    generate_database_config "redis" "$REDIS_STORAGE_SIZE" "$REDIS_PORT" "100" "256" | kubectl apply -f -

    # Setup monitoring
    generate_monitoring_config | kubectl apply -f -

    # Configure load balancer
    generate_loadbalancer_config | kubectl apply -f -

    echo "Deployment completed successfully"
    echo "Services deployed: 8"
    echo "Total replicas: $((API_GATEWAY_REPLICAS + USER_SERVICE_REPLICAS + PAYMENT_SERVICE_REPLICAS + 3))"
    echo "Monitoring thresholds: CPU ${CPU_ALERT_THRESHOLD}%, Memory ${MEMORY_ALERT_THRESHOLD}%, Error rate ${ERROR_RATE_THRESHOLD}%"
}

# Execute based on argument
case "${1:-main}" in
    "deploy")
        main
        ;;
    "test")
        perform_load_test "http://api.example.com" "50" "300" "60" "200"
        ;;
    "cleanup")
        cleanup_resources "14" "60"
        ;;
    "scale")
        # Scale specific service
        kubectl scale deployment api-gateway --replicas="${2:-5}"
        kubectl scale deployment user-service --replicas="${3:-8}"
        ;;
    *)
        main
        ;;
esac