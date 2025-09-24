#!/bin/bash

# =============================================================================
# Day 07: Copy & Paste Practice Script
# =============================================================================
#
# COPY & PASTE PRACTICE INSTRUCTIONS:
# 1. Use 'yy' to yank (copy) entire line, '3yy' to copy 3 lines
# 2. Use 'yw' to yank word, 'y$' to yank to end of line
# 3. Use 'p' to paste after cursor, 'P' to paste before cursor
# 4. Use 'yi(' to yank inside parentheses, 'ya(' to yank around parentheses
# 5. Use visual mode 'v' to select text, then 'y' to copy selection
# 6. Practice copying and duplicating the patterns below:
#    - Copy database configuration and create staging version
#    - Duplicate monitoring functions for different services
#    - Copy security patterns and adapt for different environments
#    - Replicate deployment functions for multiple applications
# =============================================================================

set -euo pipefail

# Script configuration
readonly SCRIPT_NAME="pattern_replication_manager"
readonly SCRIPT_VERSION="1.0.0"
readonly AUTHOR="DevOps Engineering Team"

# ============================================================================
# DATABASE CONFIGURATION PATTERN - COPY AND MODIFY FOR STAGING/DEV
# ============================================================================
# Production database configuration
function configure_production_database() {
    local db_host="prod-db.company.com"
    local db_port="5432"
    local db_name="production_app"
    local db_user="prod_user"
    local db_password_secret="prod-db-password"
    local max_connections="200"
    local shared_buffers="512MB"
    local effective_cache_size="2GB"

    echo "=== Production Database Configuration ==="
    echo "Host: ${db_host}"
    echo "Port: ${db_port}"
    echo "Database: ${db_name}"
    echo "User: ${db_user}"
    echo "Max Connections: ${max_connections}"
    echo "Shared Buffers: ${shared_buffers}"
    echo "Cache Size: ${effective_cache_size}"

    # Create connection string
    local connection_string="postgresql://${db_user}@${db_host}:${db_port}/${db_name}"
    echo "Connection String: ${connection_string}"

    # Configure backup settings
    local backup_schedule="0 2 * * *"
    local backup_retention="30"
    local backup_bucket="prod-db-backups"

    echo "Backup Schedule: ${backup_schedule}"
    echo "Backup Retention: ${backup_retention} days"
    echo "Backup Bucket: ${backup_bucket}"
}

# TODO: Copy the production function above and create:
# - configure_staging_database() with staging-specific values
# - configure_development_database() with dev-specific values

# ============================================================================
# MONITORING FUNCTION PATTERN - DUPLICATE FOR DIFFERENT SERVICES
# ============================================================================
# Web service monitoring
function monitor_web_service() {
    local service_name="web-app"
    local health_endpoint="/health"
    local metrics_endpoint="/metrics"
    local port="8080"
    local check_interval="30s"
    local timeout="10s"
    local retries="3"

    echo "=== ${service_name} Monitoring Configuration ==="
    echo "Health Check: http://localhost:${port}${health_endpoint}"
    echo "Metrics: http://localhost:${port}${metrics_endpoint}"
    echo "Check Interval: ${check_interval}"
    echo "Timeout: ${timeout}"
    echo "Retries: ${retries}"

    # Prometheus scrape configuration
    cat << EOF
  - job_name: '${service_name}'
    static_configs:
      - targets: ['localhost:${port}']
    metrics_path: '${metrics_endpoint}'
    scrape_interval: '${check_interval}'
    scrape_timeout: '${timeout}'
EOF
}

# TODO: Copy and modify the web service monitoring for:
# - monitor_api_service() for API service on port 3000
# - monitor_database_service() for database on port 5432
# - monitor_redis_service() for Redis on port 6379

# ============================================================================
# SECURITY CONFIGURATION PATTERN - REPLICATE FOR ENVIRONMENTS
# ============================================================================
# Production security configuration
function apply_production_security() {
    local environment="production"
    local ssl_enabled="true"
    local tls_version="1.3"
    local cipher_suites="ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305"
    local hsts_max_age="31536000"
    local security_headers="true"
    local rbac_enabled="true"
    local network_policies="strict"
    local pod_security_standard="restricted"

    echo "=== ${environment} Security Configuration ==="
    echo "SSL Enabled: ${ssl_enabled}"
    echo "TLS Version: ${tls_version}"
    echo "Cipher Suites: ${cipher_suites}"
    echo "HSTS Max Age: ${hsts_max_age}"
    echo "Security Headers: ${security_headers}"
    echo "RBAC Enabled: ${rbac_enabled}"
    echo "Network Policies: ${network_policies}"
    echo "Pod Security: ${pod_security_standard}"

    # Security policy template
    cat << EOF
apiVersion: v1
kind: SecurityPolicy
metadata:
  name: ${environment}-security-policy
spec:
  ssl:
    enabled: ${ssl_enabled}
    tlsVersion: "${tls_version}"
    cipherSuites: "${cipher_suites}"
  headers:
    hsts:
      maxAge: ${hsts_max_age}
    securityHeaders: ${security_headers}
  rbac:
    enabled: ${rbac_enabled}
  networkPolicies: ${network_policies}
  podSecurity: ${pod_security_standard}
EOF
}

# TODO: Copy the production security function and create:
# - apply_staging_security() with relaxed settings for testing
# - apply_development_security() with minimal security for dev work

# ============================================================================
# DEPLOYMENT PATTERN - COPY FOR MULTIPLE APPLICATIONS
# ============================================================================
# Frontend application deployment
function deploy_frontend_application() {
    local app_name="frontend-app"
    local app_version="2.1.0"
    local image_registry="registry.company.com"
    local namespace="production"
    local replicas="3"
    local cpu_request="100m"
    local cpu_limit="500m"
    local memory_request="256Mi"
    local memory_limit="512Mi"
    local port="8080"

    echo "=== ${app_name} Deployment ==="
    echo "Version: ${app_version}"
    echo "Registry: ${image_registry}"
    echo "Namespace: ${namespace}"
    echo "Replicas: ${replicas}"
    echo "CPU Request/Limit: ${cpu_request}/${cpu_limit}"
    echo "Memory Request/Limit: ${memory_request}/${memory_limit}"
    echo "Port: ${port}"

    # Kubernetes deployment manifest
    cat << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${app_name}
  namespace: ${namespace}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${app_name}
  template:
    metadata:
      labels:
        app: ${app_name}
        version: ${app_version}
    spec:
      containers:
      - name: ${app_name}
        image: ${image_registry}/${app_name}:${app_version}
        ports:
        - containerPort: ${port}
        resources:
          requests:
            cpu: ${cpu_request}
            memory: ${memory_request}
          limits:
            cpu: ${cpu_limit}
            memory: ${memory_limit}
EOF

    # Service manifest
    cat << EOF
---
apiVersion: v1
kind: Service
metadata:
  name: ${app_name}-service
  namespace: ${namespace}
spec:
  selector:
    app: ${app_name}
  ports:
  - port: 80
    targetPort: ${port}
  type: ClusterIP
EOF
}

# TODO: Copy the frontend deployment and create:
# - deploy_backend_application() for backend service on port 3000
# - deploy_worker_application() for background workers
# - deploy_scheduler_application() for cron jobs

# ============================================================================
# LOAD BALANCER PATTERN - DUPLICATE FOR DIFFERENT TIERS
# ============================================================================
# Public load balancer configuration
function configure_public_load_balancer() {
    local lb_name="public-lb"
    local lb_type="application"
    local scheme="internet-facing"
    local protocol="HTTPS"
    local port="443"
    local target_port="8080"
    local health_check_path="/health"
    local health_check_interval="30"
    local healthy_threshold="2"
    local unhealthy_threshold="3"

    echo "=== ${lb_name} Configuration ==="
    echo "Type: ${lb_type}"
    echo "Scheme: ${scheme}"
    echo "Protocol: ${protocol}"
    echo "Port: ${port} -> ${target_port}"
    echo "Health Check Path: ${health_check_path}"
    echo "Health Check Interval: ${health_check_interval}s"
    echo "Healthy Threshold: ${healthy_threshold}"
    echo "Unhealthy Threshold: ${unhealthy_threshold}"

    # Load balancer configuration
    cat << EOF
LoadBalancer:
  Name: ${lb_name}
  Type: ${lb_type}
  Scheme: ${scheme}
  Listeners:
    - Protocol: ${protocol}
      Port: ${port}
      TargetPort: ${target_port}
  HealthCheck:
    Path: ${health_check_path}
    Interval: ${health_check_interval}
    HealthyThreshold: ${healthy_threshold}
    UnhealthyThreshold: ${unhealthy_threshold}
EOF
}

# TODO: Copy the public load balancer function and create:
# - configure_internal_load_balancer() for internal services
# - configure_api_load_balancer() for API gateway

# ============================================================================
# STORAGE PATTERN - REPLICATE FOR DIFFERENT DATA TYPES
# ============================================================================
# Database storage configuration
function configure_database_storage() {
    local storage_name="database-storage"
    local storage_class="fast-ssd"
    local volume_size="100Gi"
    local access_mode="ReadWriteOnce"
    local backup_enabled="true"
    local encryption_enabled="true"
    local iops="3000"
    local throughput="125"

    echo "=== ${storage_name} Configuration ==="
    echo "Storage Class: ${storage_class}"
    echo "Volume Size: ${volume_size}"
    echo "Access Mode: ${access_mode}"
    echo "Backup Enabled: ${backup_enabled}"
    echo "Encryption: ${encryption_enabled}"
    echo "IOPS: ${iops}"
    echo "Throughput: ${throughput} MiB/s"

    # Persistent volume claim
    cat << EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ${storage_name}-pvc
spec:
  accessModes:
    - ${access_mode}
  storageClassName: ${storage_class}
  resources:
    requests:
      storage: ${volume_size}
  annotations:
    backup.enabled: "${backup_enabled}"
    encryption.enabled: "${encryption_enabled}"
    storage.iops: "${iops}"
    storage.throughput: "${throughput}"
EOF
}

# TODO: Copy the database storage function and create:
# - configure_cache_storage() for Redis/cache storage
# - configure_logs_storage() for log aggregation storage
# - configure_backup_storage() for backup storage

# ============================================================================
# SCALING PATTERN - COPY FOR DIFFERENT SCALING STRATEGIES
# ============================================================================
# Horizontal Pod Autoscaler configuration
function configure_horizontal_scaling() {
    local hpa_name="web-app-hpa"
    local target_deployment="web-app"
    local min_replicas="2"
    local max_replicas="10"
    local target_cpu="70"
    local target_memory="80"
    local scale_up_period="300"
    local scale_down_period="600"

    echo "=== ${hpa_name} Configuration ==="
    echo "Target: ${target_deployment}"
    echo "Min/Max Replicas: ${min_replicas}/${max_replicas}"
    echo "Target CPU: ${target_cpu}%"
    echo "Target Memory: ${target_memory}%"
    echo "Scale Up Period: ${scale_up_period}s"
    echo "Scale Down Period: ${scale_down_period}s"

    # HPA manifest
    cat << EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${hpa_name}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${target_deployment}
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
        averageUtilization: ${target_memory}
  behavior:
    scaleUp:
      stabilizationWindowSeconds: ${scale_up_period}
    scaleDown:
      stabilizationWindowSeconds: ${scale_down_period}
EOF
}

# TODO: Copy the horizontal scaling function and create:
# - configure_vertical_scaling() for VPA configuration
# - configure_cluster_scaling() for cluster autoscaler

# ============================================================================
# MAIN FUNCTION - COPY PATTERN FOR DIFFERENT EXECUTION MODES
# ============================================================================
function main() {
    echo "=== Pattern Replication Manager ==="
    echo "Version: ${SCRIPT_VERSION}"
    echo "Author: ${AUTHOR}"
    echo "Timestamp: $(date)"

    # Execute configuration functions
    echo ""
    configure_production_database
    echo ""
    monitor_web_service
    echo ""
    apply_production_security
    echo ""
    deploy_frontend_application
    echo ""
    configure_public_load_balancer
    echo ""
    configure_database_storage
    echo ""
    configure_horizontal_scaling

    echo ""
    echo "=== Pattern execution completed ==="
}

# Execute main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

# TODO: Copy the main function and create specialized versions:
# - main_staging() for staging environment setup
# - main_development() for development environment setup
# - main_disaster_recovery() for DR environment setup