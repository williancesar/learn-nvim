#!/bin/bash

# =============================================================================
# Day 02: Basic Navigation Practice Script
# =============================================================================
#
# NAVIGATION PRACTICE INSTRUCTIONS:
# 1. Use h/j/k/l for left/down/up/right movement
# 2. Use gg to go to top of file, G to go to bottom
# 3. Use Ctrl+f to page down, Ctrl+b to page up
# 4. Use 0 to go to beginning of line, $ to go to end
# 5. Use H/M/L for High/Middle/Low of screen
# 6. Use :<line_number> to jump to specific lines
#
# NAVIGATION TARGETS (practice jumping to these):
# - Line 42: Database configuration
# - Line 67: SSL certificate settings
# - Line 98: Monitoring endpoints
# - Line 125: Container orchestration
# - Line 156: Load balancer configuration
# =============================================================================

set -euo pipefail

# Script metadata and configuration
readonly SCRIPT_NAME="infrastructure_manager"
readonly SCRIPT_VERSION="2.1.4"
readonly SCRIPT_AUTHOR="DevOps Team"
readonly CREATED_DATE="2024-01-15"
readonly LAST_MODIFIED="2024-03-22"

# Global environment variables
export DEPLOYMENT_ENV="${DEPLOYMENT_ENV:-production}"
export AWS_REGION="${AWS_REGION:-us-west-2}"
export KUBERNETES_NAMESPACE="${KUBERNETES_NAMESPACE:-default}"
export MONITORING_ENABLED="${MONITORING_ENABLED:-true}"
export DEBUG_MODE="${DEBUG_MODE:-false}"

# Infrastructure configuration arrays
declare -A ENVIRONMENT_CONFIGS=(
    ["development"]="dev.env"
    ["staging"]="staging.env"
    ["production"]="prod.env"
    ["testing"]="test.env"
)

declare -A SERVICE_PORTS=(
    ["web"]="8080"
    ["api"]="3000"
    ["database"]="5432"
    ["redis"]="6379"
    ["elasticsearch"]="9200"
    ["kibana"]="5601"
    ["prometheus"]="9090"
    ["grafana"]="3001"
)

declare -A CONTAINER_IMAGES=(
    ["nginx"]="nginx:1.21-alpine"
    ["postgres"]="postgres:14-alpine"
    ["redis"]="redis:7-alpine"
    ["node"]="node:18-alpine"
    ["python"]="python:3.11-slim"
)

# Database configuration section - TARGET LINE 42
readonly DB_HOST="${DB_HOST:-localhost}"
readonly DB_PORT="${DB_PORT:-5432}"
readonly DB_NAME="${DB_NAME:-infrastructure_db}"
readonly DB_USER="${DB_USER:-admin}"
readonly DB_PASSWORD_FILE="${DB_PASSWORD_FILE:-/secrets/db_password}"
readonly DB_MAX_CONNECTIONS="${DB_MAX_CONNECTIONS:-100}"
readonly DB_CONNECTION_TIMEOUT="${DB_CONNECTION_TIMEOUT:-30}"
readonly DB_BACKUP_SCHEDULE="${DB_BACKUP_SCHEDULE:-0 2 * * *}"
readonly DB_BACKUP_RETENTION="${DB_BACKUP_RETENTION:-30}"

# Logging and monitoring configuration
readonly LOG_LEVEL="${LOG_LEVEL:-INFO}"
readonly LOG_FORMAT="${LOG_FORMAT:-json}"
readonly LOG_FILE="${LOG_FILE:-/var/log/infrastructure.log}"
readonly LOG_MAX_SIZE="${LOG_MAX_SIZE:-100M}"
readonly LOG_MAX_FILES="${LOG_MAX_FILES:-10}"

# Network and security settings
readonly NETWORK_INTERFACE="${NETWORK_INTERFACE:-eth0}"
readonly FIREWALL_ENABLED="${FIREWALL_ENABLED:-true}"
readonly VPN_ENABLED="${VPN_ENABLED:-false}"
readonly PROXY_HOST="${PROXY_HOST:-proxy.company.com}"
readonly PROXY_PORT="${PROXY_PORT:-8080}"

# SSL certificate settings - TARGET LINE 67
readonly SSL_CERT_PATH="${SSL_CERT_PATH:-/etc/ssl/certs}"
readonly SSL_KEY_PATH="${SSL_KEY_PATH:-/etc/ssl/private}"
readonly SSL_CA_PATH="${SSL_CA_PATH:-/etc/ssl/ca}"
readonly SSL_CERT_FILE="${SSL_CERT_FILE:-server.crt}"
readonly SSL_KEY_FILE="${SSL_KEY_FILE:-server.key}"
readonly SSL_CA_FILE="${SSL_CA_FILE:-ca.crt}"
readonly SSL_CIPHER_SUITE="${SSL_CIPHER_SUITE:-ECDHE-RSA-AES256-GCM-SHA384}"
readonly SSL_PROTOCOL_VERSION="${SSL_PROTOCOL_VERSION:-TLSv1.2}"
readonly SSL_CERT_RENEWAL_DAYS="${SSL_CERT_RENEWAL_DAYS:-30}"
readonly SSL_OCSP_STAPLING="${SSL_OCSP_STAPLING:-on}"

# Resource limits and quotas
readonly CPU_LIMIT="${CPU_LIMIT:-2}"
readonly MEMORY_LIMIT="${MEMORY_LIMIT:-4Gi}"
readonly STORAGE_LIMIT="${STORAGE_LIMIT:-50Gi}"
readonly REQUEST_CPU="${REQUEST_CPU:-500m}"
readonly REQUEST_MEMORY="${REQUEST_MEMORY:-1Gi}"
readonly REQUEST_STORAGE="${REQUEST_STORAGE:-10Gi}"

# Auto-scaling configuration
readonly MIN_REPLICAS="${MIN_REPLICAS:-2}"
readonly MAX_REPLICAS="${MAX_REPLICAS:-10}"
readonly TARGET_CPU_PERCENTAGE="${TARGET_CPU_PERCENTAGE:-70}"
readonly TARGET_MEMORY_PERCENTAGE="${TARGET_MEMORY_PERCENTAGE:-80}"
readonly SCALE_UP_COOLDOWN="${SCALE_UP_COOLDOWN:-180}"
readonly SCALE_DOWN_COOLDOWN="${SCALE_DOWN_COOLDOWN:-300}"

# Backup and disaster recovery
readonly BACKUP_ENABLED="${BACKUP_ENABLED:-true}"
readonly BACKUP_SCHEDULE="${BACKUP_SCHEDULE:-0 1 * * *}"
readonly BACKUP_RETENTION_POLICY="${BACKUP_RETENTION_POLICY:-30d}"
readonly BACKUP_ENCRYPTION="${BACKUP_ENCRYPTION:-true}"
readonly DISASTER_RECOVERY_REGION="${DISASTER_RECOVERY_REGION:-us-east-1}"

# Monitoring endpoints - TARGET LINE 98
readonly HEALTH_CHECK_ENDPOINT="${HEALTH_CHECK_ENDPOINT:-/health}"
readonly METRICS_ENDPOINT="${METRICS_ENDPOINT:-/metrics}"
readonly STATUS_ENDPOINT="${STATUS_ENDPOINT:-/status}"
readonly READINESS_ENDPOINT="${READINESS_ENDPOINT:-/ready}"
readonly LIVENESS_ENDPOINT="${LIVENESS_ENDPOINT:-/alive}"
readonly PROMETHEUS_SCRAPE_PATH="${PROMETHEUS_SCRAPE_PATH:-/metrics}"
readonly PROMETHEUS_SCRAPE_INTERVAL="${PROMETHEUS_SCRAPE_INTERVAL:-30s}"
readonly ALERTMANAGER_URL="${ALERTMANAGER_URL:-http://alertmanager:9093}"
readonly GRAFANA_DASHBOARD_ID="${GRAFANA_DASHBOARD_ID:-infrastructure-overview}"

# Performance tuning parameters
readonly WORKER_PROCESSES="${WORKER_PROCESSES:-auto}"
readonly WORKER_CONNECTIONS="${WORKER_CONNECTIONS:-1024}"
readonly KEEPALIVE_TIMEOUT="${KEEPALIVE_TIMEOUT:-65}"
readonly CLIENT_MAX_BODY_SIZE="${CLIENT_MAX_BODY_SIZE:-10m}"
readonly PROXY_CONNECT_TIMEOUT="${PROXY_CONNECT_TIMEOUT:-60s}"
readonly PROXY_SEND_TIMEOUT="${PROXY_SEND_TIMEOUT:-60s}"
readonly PROXY_READ_TIMEOUT="${PROXY_READ_TIMEOUT:-60s}"

# Cache configuration
readonly CACHE_ENABLED="${CACHE_ENABLED:-true}"
readonly CACHE_TTL="${CACHE_TTL:-3600}"
readonly CACHE_MAX_SIZE="${CACHE_MAX_SIZE:-1000m}"
readonly CACHE_INACTIVE="${CACHE_INACTIVE:-60m}"
readonly REDIS_MAXMEMORY="${REDIS_MAXMEMORY:-2gb}"
readonly REDIS_MAXMEMORY_POLICY="${REDIS_MAXMEMORY_POLICY:-allkeys-lru}"

# Container orchestration - TARGET LINE 125
declare -A KUBERNETES_RESOURCES=(
    ["deployment"]="infrastructure-deployment.yaml"
    ["service"]="infrastructure-service.yaml"
    ["configmap"]="infrastructure-configmap.yaml"
    ["secret"]="infrastructure-secret.yaml"
    ["ingress"]="infrastructure-ingress.yaml"
    ["hpa"]="infrastructure-hpa.yaml"
    ["pdb"]="infrastructure-pdb.yaml"
    ["networkpolicy"]="infrastructure-netpol.yaml"
)

declare -A DOCKER_COMPOSE_SERVICES=(
    ["web"]="web-service"
    ["api"]="api-service"
    ["database"]="postgres-service"
    ["cache"]="redis-service"
    ["queue"]="rabbitmq-service"
    ["worker"]="celery-worker"
    ["scheduler"]="celery-beat"
    ["monitor"]="prometheus-service"
)

# Service mesh configuration
readonly SERVICE_MESH_ENABLED="${SERVICE_MESH_ENABLED:-false}"
readonly ISTIO_NAMESPACE="${ISTIO_NAMESPACE:-istio-system}"
readonly JAEGER_ENDPOINT="${JAEGER_ENDPOINT:-http://jaeger:14268/api/traces}"
readonly ZIPKIN_ENDPOINT="${ZIPKIN_ENDPOINT:-http://zipkin:9411/api/v2/spans}"

# API Gateway settings
readonly API_GATEWAY_ENABLED="${API_GATEWAY_ENABLED:-true}"
readonly RATE_LIMIT_REQUESTS="${RATE_LIMIT_REQUESTS:-1000}"
readonly RATE_LIMIT_WINDOW="${RATE_LIMIT_WINDOW:-3600}"
readonly API_TIMEOUT="${API_TIMEOUT:-30s}"
readonly API_RETRY_ATTEMPTS="${API_RETRY_ATTEMPTS:-3}"

# Load balancer configuration - TARGET LINE 156
readonly LOAD_BALANCER_TYPE="${LOAD_BALANCER_TYPE:-nginx}"
readonly LOAD_BALANCER_ALGORITHM="${LOAD_BALANCER_ALGORITHM:-round_robin}"
readonly LOAD_BALANCER_HEALTH_CHECK="${LOAD_BALANCER_HEALTH_CHECK:-/health}"
readonly LOAD_BALANCER_HEALTH_INTERVAL="${LOAD_BALANCER_HEALTH_INTERVAL:-10s}"
readonly LOAD_BALANCER_HEALTH_TIMEOUT="${LOAD_BALANCER_HEALTH_TIMEOUT:-5s}"
readonly LOAD_BALANCER_HEALTH_RETRIES="${LOAD_BALANCER_HEALTH_RETRIES:-3}"
readonly STICKY_SESSIONS="${STICKY_SESSIONS:-false}"
readonly SESSION_AFFINITY="${SESSION_AFFINITY:-None}"
readonly UPSTREAM_KEEPALIVE="${UPSTREAM_KEEPALIVE:-32}"
readonly UPSTREAM_KEEPALIVE_REQUESTS="${UPSTREAM_KEEPALIVE_REQUESTS:-100}"

# CDN and static assets
readonly CDN_ENABLED="${CDN_ENABLED:-true}"
readonly CDN_PROVIDER="${CDN_PROVIDER:-cloudflare}"
readonly STATIC_ASSETS_PATH="${STATIC_ASSETS_PATH:-/static}"
readonly ASSETS_CACHE_CONTROL="${ASSETS_CACHE_CONTROL:-public, max-age=31536000}"
readonly GZIP_COMPRESSION="${GZIP_COMPRESSION:-true}"
readonly BROTLI_COMPRESSION="${BROTLI_COMPRESSION:-true}"

# Security hardening
readonly SECURITY_HEADERS_ENABLED="${SECURITY_HEADERS_ENABLED:-true}"
readonly HSTS_MAX_AGE="${HSTS_MAX_AGE:-31536000}"
readonly CSP_POLICY="${CSP_POLICY:-default-src 'self'"}"
readonly X_FRAME_OPTIONS="${X_FRAME_OPTIONS:-DENY}"
readonly X_CONTENT_TYPE_OPTIONS="${X_CONTENT_TYPE_OPTIONS:-nosniff}"
readonly REFERRER_POLICY="${REFERRER_POLICY:-strict-origin-when-cross-origin}"

# Feature flags
readonly FEATURE_FLAGS_ENABLED="${FEATURE_FLAGS_ENABLED:-false}"
readonly FEATURE_FLAGS_PROVIDER="${FEATURE_FLAGS_PROVIDER:-launchdarkly}"
readonly FEATURE_FLAGS_SDK_KEY="${FEATURE_FLAGS_SDK_KEY:-}"
readonly FEATURE_FLAGS_CACHE_TTL="${FEATURE_FLAGS_CACHE_TTL:-300}"

# Compliance and auditing
readonly AUDIT_LOGGING="${AUDIT_LOGGING:-true}"
readonly COMPLIANCE_MODE="${COMPLIANCE_MODE:-SOC2}"
readonly DATA_RETENTION_POLICY="${DATA_RETENTION_POLICY:-7y}"
readonly ENCRYPTION_AT_REST="${ENCRYPTION_AT_REST:-true}"
readonly ENCRYPTION_IN_TRANSIT="${ENCRYPTION_IN_TRANSIT:-true}"

echo "Infrastructure Manager v${SCRIPT_VERSION} loaded successfully"
echo "Environment: ${DEPLOYMENT_ENV}"
echo "Total configuration lines: $(wc -l < "${0}")"