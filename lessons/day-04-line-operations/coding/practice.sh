#!/bin/bash

# =============================================================================
# Day 04: Line Operations Practice Script
# =============================================================================
#
# LINE OPERATION PRACTICE INSTRUCTIONS:
# 1. Use 'dd' to delete entire lines
# 2. Use 'yy' to yank (copy) entire lines
# 3. Use 'p' to paste below, 'P' to paste above
# 4. Use '>>' to indent lines, '<<' to unindent
# 5. Use 'J' to join current line with next line
# 6. Use numbers with operations: '3dd' deletes 3 lines, '5yy' copies 5 lines
# 7. Practice with numbered sections below - jump to specific sections
# 8. Use ':set number' to show line numbers for practice
#
# NUMBERED SECTIONS FOR PRACTICE:
# Section 1 (Lines 25-40): Global Configuration
# Section 2 (Lines 41-65): Database Setup
# Section 3 (Lines 66-90): Security Configuration
# Section 4 (Lines 91-115): Monitoring Setup
# Section 5 (Lines 116-140): Container Management
# Section 6 (Lines 141-165): Load Balancing
# Section 7 (Lines 166-190): Backup Operations
# Section 8 (Lines 191-215): Network Configuration
# =============================================================================

set -euo pipefail

# ============================================================================
# SECTION 1: Global Configuration (Lines 25-40)
# ============================================================================
readonly INFRASTRUCTURE_SCRIPT_VERSION="4.1.2"
readonly INFRASTRUCTURE_AUTHOR="Platform Engineering Team"
readonly INFRASTRUCTURE_CREATED="2024-02-01"
readonly INFRASTRUCTURE_MODIFIED="2024-03-28"
readonly SCRIPT_DESCRIPTION="Enterprise Infrastructure Management System"

export DEPLOYMENT_TARGET="${DEPLOYMENT_TARGET:-production}"
export CLOUD_PROVIDER="${CLOUD_PROVIDER:-aws}"
export REGION_PRIMARY="${REGION_PRIMARY:-us-west-2}"
export REGION_SECONDARY="${REGION_SECONDARY:-us-east-1}"
export AVAILABILITY_ZONES="${AVAILABILITY_ZONES:-us-west-2a,us-west-2b,us-west-2c}"

readonly COMPANY_NAME="TechCorp Industries"
readonly DEPARTMENT="Platform Engineering"
readonly COST_CENTER="INFRA-2024"
readonly PROJECT_CODE="PLAT-001"
readonly ENVIRONMENT_TIER="tier-1"

# ============================================================================
# SECTION 2: Database Setup (Lines 41-65)
# ============================================================================
readonly DATABASE_ENGINE="${DATABASE_ENGINE:-postgresql}"
readonly DATABASE_VERSION="${DATABASE_VERSION:-15.2}"
readonly DATABASE_HOST="${DATABASE_HOST:-db-cluster.internal}"
readonly DATABASE_PORT="${DATABASE_PORT:-5432}"
readonly DATABASE_NAME="${DATABASE_NAME:-platform_db}"
readonly DATABASE_SCHEMA="${DATABASE_SCHEMA:-public}"
readonly DATABASE_USER="${DATABASE_USER:-platform_user}"
readonly DATABASE_PASSWORD_SECRET="${DATABASE_PASSWORD_SECRET:-db-credentials}"

readonly DATABASE_MAX_CONNECTIONS="${DATABASE_MAX_CONNECTIONS:-200}"
readonly DATABASE_SHARED_BUFFERS="${DATABASE_SHARED_BUFFERS:-256MB}"
readonly DATABASE_EFFECTIVE_CACHE_SIZE="${DATABASE_EFFECTIVE_CACHE_SIZE:-1GB}"
readonly DATABASE_MAINTENANCE_WORK_MEM="${DATABASE_MAINTENANCE_WORK_MEM:-64MB}"
readonly DATABASE_CHECKPOINT_COMPLETION_TARGET="${DATABASE_CHECKPOINT_COMPLETION_TARGET:-0.7}"
readonly DATABASE_WAL_BUFFERS="${DATABASE_WAL_BUFFERS:-16MB}"
readonly DATABASE_DEFAULT_STATISTICS_TARGET="${DATABASE_DEFAULT_STATISTICS_TARGET:-100}"

readonly BACKUP_SCHEDULE="${BACKUP_SCHEDULE:-0 2 * * *}"
readonly BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
readonly BACKUP_STORAGE_BUCKET="${BACKUP_STORAGE_BUCKET:-platform-db-backups}"
readonly BACKUP_ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-backup-encryption-key}"
readonly BACKUP_COMPRESSION="${BACKUP_COMPRESSION:-gzip}"
readonly BACKUP_VERIFICATION="${BACKUP_VERIFICATION:-enabled}"
readonly POINT_IN_TIME_RECOVERY="${POINT_IN_TIME_RECOVERY:-enabled}"
readonly REPLICA_LAG_THRESHOLD="${REPLICA_LAG_THRESHOLD:-1000}"

# ============================================================================
# SECTION 3: Security Configuration (Lines 66-90)
# ============================================================================
readonly SSL_CERTIFICATE_PATH="${SSL_CERTIFICATE_PATH:-/etc/ssl/platform}"
readonly SSL_CERTIFICATE_FILE="${SSL_CERTIFICATE_FILE:-platform.crt}"
readonly SSL_PRIVATE_KEY_FILE="${SSL_PRIVATE_KEY_FILE:-platform.key}"
readonly SSL_CA_CERTIFICATE_FILE="${SSL_CA_CERTIFICATE_FILE:-ca.crt}"
readonly SSL_CIPHER_SUITES="${SSL_CIPHER_SUITES:-ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20}"
readonly SSL_PROTOCOLS="${SSL_PROTOCOLS:-TLSv1.2,TLSv1.3}"
readonly SSL_HSTS_MAX_AGE="${SSL_HSTS_MAX_AGE:-31536000}"

readonly FIREWALL_ENABLED="${FIREWALL_ENABLED:-true}"
readonly FIREWALL_DEFAULT_POLICY="${FIREWALL_DEFAULT_POLICY:-DROP}"
readonly FIREWALL_ALLOWED_PORTS="${FIREWALL_ALLOWED_PORTS:-22,80,443,8080,9090}"
readonly FIREWALL_ALLOWED_NETWORKS="${FIREWALL_ALLOWED_NETWORKS:-10.0.0.0/8,172.16.0.0/12,192.168.0.0/16}"
readonly INTRUSION_DETECTION="${INTRUSION_DETECTION:-enabled}"
readonly FAIL2BAN_ENABLED="${FAIL2BAN_ENABLED:-true}"
readonly FAIL2BAN_JAIL_TIME="${FAIL2BAN_JAIL_TIME:-3600}"

readonly VULNERABILITY_SCANNING="${VULNERABILITY_SCANNING:-enabled}"
readonly SECURITY_SCANNING_SCHEDULE="${SECURITY_SCANNING_SCHEDULE:-0 3 * * 1}"
readonly COMPLIANCE_FRAMEWORK="${COMPLIANCE_FRAMEWORK:-SOC2}"
readonly AUDIT_LOGGING="${AUDIT_LOGGING:-enabled}"
readonly AUDIT_LOG_RETENTION="${AUDIT_LOG_RETENTION:-2555}"
readonly SECURITY_HEADERS="${SECURITY_HEADERS:-enabled}"
readonly CONTENT_SECURITY_POLICY="${CONTENT_SECURITY_POLICY:-default-src 'self'; script-src 'self' 'unsafe-inline'}"
readonly X_FRAME_OPTIONS="${X_FRAME_OPTIONS:-DENY}"
readonly X_CONTENT_TYPE_OPTIONS="${X_CONTENT_TYPE_OPTIONS:-nosniff}"

# ============================================================================
# SECTION 4: Monitoring Setup (Lines 91-115)
# ============================================================================
readonly MONITORING_ENABLED="${MONITORING_ENABLED:-true}"
readonly PROMETHEUS_VERSION="${PROMETHEUS_VERSION:-2.45.0}"
readonly PROMETHEUS_RETENTION="${PROMETHEUS_RETENTION:-30d}"
readonly PROMETHEUS_STORAGE_SIZE="${PROMETHEUS_STORAGE_SIZE:-100Gi}"
readonly PROMETHEUS_SCRAPE_INTERVAL="${PROMETHEUS_SCRAPE_INTERVAL:-30s}"
readonly PROMETHEUS_EVALUATION_INTERVAL="${PROMETHEUS_EVALUATION_INTERVAL:-30s}"

readonly GRAFANA_VERSION="${GRAFANA_VERSION:-10.0.0}"
readonly GRAFANA_ADMIN_USER="${GRAFANA_ADMIN_USER:-admin}"
readonly GRAFANA_ADMIN_PASSWORD_SECRET="${GRAFANA_ADMIN_PASSWORD_SECRET:-grafana-admin-password}"
readonly GRAFANA_DATABASE_TYPE="${GRAFANA_DATABASE_TYPE:-postgres}"
readonly GRAFANA_SMTP_ENABLED="${GRAFANA_SMTP_ENABLED:-true}"
readonly GRAFANA_SMTP_HOST="${GRAFANA_SMTP_HOST:-smtp.company.com}"

readonly ALERTMANAGER_VERSION="${ALERTMANAGER_VERSION:-0.25.0}"
readonly ALERTMANAGER_RETENTION="${ALERTMANAGER_RETENTION:-120h}"
readonly ALERT_NOTIFICATION_CHANNELS="${ALERT_NOTIFICATION_CHANNELS:-slack,email,pagerduty}"
readonly SLACK_WEBHOOK_URL_SECRET="${SLACK_WEBHOOK_URL_SECRET:-slack-webhook}"
readonly PAGERDUTY_SERVICE_KEY_SECRET="${PAGERDUTY_SERVICE_KEY_SECRET:-pagerduty-key}"

readonly LOG_AGGREGATION_ENABLED="${LOG_AGGREGATION_ENABLED:-true}"
readonly ELASTICSEARCH_VERSION="${ELASTICSEARCH_VERSION:-8.8.0}"
readonly ELASTICSEARCH_CLUSTER_SIZE="${ELASTICSEARCH_CLUSTER_SIZE:-3}"
readonly ELASTICSEARCH_HEAP_SIZE="${ELASTICSEARCH_HEAP_SIZE:-2g}"
readonly KIBANA_VERSION="${KIBANA_VERSION:-8.8.0}"
readonly LOGSTASH_VERSION="${LOGSTASH_VERSION:-8.8.0}"
readonly LOG_RETENTION_POLICY="${LOG_RETENTION_POLICY:-30d}"

# ============================================================================
# SECTION 5: Container Management (Lines 116-140)
# ============================================================================
readonly CONTAINER_RUNTIME="${CONTAINER_RUNTIME:-containerd}"
readonly KUBERNETES_VERSION="${KUBERNETES_VERSION:-1.27.0}"
readonly KUBERNETES_CLUSTER_NAME="${KUBERNETES_CLUSTER_NAME:-platform-cluster}"
readonly KUBERNETES_NODE_COUNT="${KUBERNETES_NODE_COUNT:-5}"
readonly KUBERNETES_NODE_INSTANCE_TYPE="${KUBERNETES_NODE_INSTANCE_TYPE:-m5.xlarge}"
readonly KUBERNETES_MIN_NODES="${KUBERNETES_MIN_NODES:-3}"
readonly KUBERNETES_MAX_NODES="${KUBERNETES_MAX_NODES:-20}"

readonly CONTAINER_REGISTRY="${CONTAINER_REGISTRY:-registry.company.com}"
readonly CONTAINER_REGISTRY_PROJECT="${CONTAINER_REGISTRY_PROJECT:-platform}"
readonly IMAGE_PULL_POLICY="${IMAGE_PULL_POLICY:-Always}"
readonly IMAGE_SCAN_ENABLED="${IMAGE_SCAN_ENABLED:-true}"
readonly IMAGE_VULNERABILITY_THRESHOLD="${IMAGE_VULNERABILITY_THRESHOLD:-HIGH}"

readonly HELM_VERSION="${HELM_VERSION:-3.12.0}"
readonly HELM_CHART_REPOSITORY="${HELM_CHART_REPOSITORY:-https://charts.company.com}"
readonly HELM_RELEASE_NAMESPACE="${HELM_RELEASE_NAMESPACE:-platform}"
readonly HELM_TIMEOUT="${HELM_TIMEOUT:-600s}"
readonly HELM_ATOMIC_INSTALL="${HELM_ATOMIC_INSTALL:-true}"

readonly SERVICE_MESH_ENABLED="${SERVICE_MESH_ENABLED:-true}"
readonly SERVICE_MESH_PROVIDER="${SERVICE_MESH_PROVIDER:-istio}"
readonly ISTIO_VERSION="${ISTIO_VERSION:-1.18.0}"
readonly MUTUAL_TLS_MODE="${MUTUAL_TLS_MODE:-STRICT}"
readonly INGRESS_GATEWAY_TYPE="${INGRESS_GATEWAY_TYPE:-istio}"
readonly EGRESS_POLICY="${EGRESS_POLICY:-ALLOW_ANY}"
readonly CIRCUIT_BREAKER_ENABLED="${CIRCUIT_BREAKER_ENABLED:-true}"

# ============================================================================
# SECTION 6: Load Balancing (Lines 141-165)
# ============================================================================
readonly LOAD_BALANCER_TYPE="${LOAD_BALANCER_TYPE:-application}"
readonly LOAD_BALANCER_SCHEME="${LOAD_BALANCER_SCHEME:-internet-facing}"
readonly LOAD_BALANCER_SUBNETS="${LOAD_BALANCER_SUBNETS:-subnet-12345,subnet-67890,subnet-abcde}"
readonly LOAD_BALANCER_SECURITY_GROUPS="${LOAD_BALANCER_SECURITY_GROUPS:-sg-web,sg-api}"
readonly LOAD_BALANCER_IDLE_TIMEOUT="${LOAD_BALANCER_IDLE_TIMEOUT:-60}"
readonly LOAD_BALANCER_ACCESS_LOGS="${LOAD_BALANCER_ACCESS_LOGS:-enabled}"
readonly LOAD_BALANCER_ACCESS_LOG_BUCKET="${LOAD_BALANCER_ACCESS_LOG_BUCKET:-platform-lb-logs}"

readonly TARGET_GROUP_PROTOCOL="${TARGET_GROUP_PROTOCOL:-HTTP}"
readonly TARGET_GROUP_PORT="${TARGET_GROUP_PORT:-8080}"
readonly TARGET_GROUP_HEALTH_CHECK_PATH="${TARGET_GROUP_HEALTH_CHECK_PATH:-/health}"
readonly TARGET_GROUP_HEALTH_CHECK_INTERVAL="${TARGET_GROUP_HEALTH_CHECK_INTERVAL:-30}"
readonly TARGET_GROUP_HEALTH_CHECK_TIMEOUT="${TARGET_GROUP_HEALTH_CHECK_TIMEOUT:-5}"
readonly TARGET_GROUP_HEALTHY_THRESHOLD="${TARGET_GROUP_HEALTHY_THRESHOLD:-2}"
readonly TARGET_GROUP_UNHEALTHY_THRESHOLD="${TARGET_GROUP_UNHEALTHY_THRESHOLD:-3}"

readonly CDN_ENABLED="${CDN_ENABLED:-true}"
readonly CDN_DISTRIBUTION_COMMENT="${CDN_DISTRIBUTION_COMMENT:-Platform CDN Distribution}"
readonly CDN_PRICE_CLASS="${CDN_PRICE_CLASS:-PriceClass_100}"
readonly CDN_CACHE_POLICY="${CDN_CACHE_POLICY:-CachingOptimized}"
readonly CDN_ORIGIN_REQUEST_POLICY="${CDN_ORIGIN_REQUEST_POLICY:-CORS-S3Origin}"
readonly CDN_COMPRESS="${CDN_COMPRESS:-true}"
readonly CDN_DEFAULT_TTL="${CDN_DEFAULT_TTL:-86400}"
readonly CDN_MAX_TTL="${CDN_MAX_TTL:-31536000}"
readonly CDN_VIEWER_PROTOCOL_POLICY="${CDN_VIEWER_PROTOCOL_POLICY:-redirect-to-https}"

# ============================================================================
# SECTION 7: Backup Operations (Lines 166-190)
# ============================================================================
readonly BACKUP_STRATEGY="${BACKUP_STRATEGY:-3-2-1}"
readonly BACKUP_FREQUENCY="${BACKUP_FREQUENCY:-daily}"
readonly BACKUP_WINDOW="${BACKUP_WINDOW:-02:00-04:00}"
readonly BACKUP_STORAGE_TYPE="${BACKUP_STORAGE_TYPE:-s3}"
readonly BACKUP_STORAGE_CLASS="${BACKUP_STORAGE_CLASS:-STANDARD_IA}"
readonly BACKUP_LIFECYCLE_POLICY="${BACKUP_LIFECYCLE_POLICY:-enabled}"
readonly BACKUP_TRANSITION_TO_IA_DAYS="${BACKUP_TRANSITION_TO_IA_DAYS:-30}"
readonly BACKUP_TRANSITION_TO_GLACIER_DAYS="${BACKUP_TRANSITION_TO_GLACIER_DAYS:-90}"
readonly BACKUP_EXPIRATION_DAYS="${BACKUP_EXPIRATION_DAYS:-2555}"

readonly SNAPSHOT_ENABLED="${SNAPSHOT_ENABLED:-true}"
readonly SNAPSHOT_FREQUENCY="${SNAPSHOT_FREQUENCY:-4h}"
readonly SNAPSHOT_RETENTION_COUNT="${SNAPSHOT_RETENTION_COUNT:-72}"
readonly SNAPSHOT_CROSS_REGION_COPY="${SNAPSHOT_CROSS_REGION_COPY:-enabled}"
readonly SNAPSHOT_ENCRYPTION="${SNAPSHOT_ENCRYPTION:-enabled}"
readonly SNAPSHOT_KMS_KEY="${SNAPSHOT_KMS_KEY:-alias/platform-snapshot-key}"

readonly DISASTER_RECOVERY_ENABLED="${DISASTER_RECOVERY_ENABLED:-true}"
readonly DISASTER_RECOVERY_RTO="${DISASTER_RECOVERY_RTO:-4h}"
readonly DISASTER_RECOVERY_RPO="${DISASTER_RECOVERY_RPO:-1h}"
readonly DISASTER_RECOVERY_SITE="${DISASTER_RECOVERY_SITE:-us-east-1}"
readonly DISASTER_RECOVERY_TESTING_SCHEDULE="${DISASTER_RECOVERY_TESTING_SCHEDULE:-0 0 1 * *}"
readonly BUSINESS_CONTINUITY_PLAN="${BUSINESS_CONTINUITY_PLAN:-enabled}"
readonly FAILOVER_AUTOMATION="${FAILOVER_AUTOMATION:-manual}"
readonly RECOVERY_VALIDATION="${RECOVERY_VALIDATION:-enabled}"

# ============================================================================
# SECTION 8: Network Configuration (Lines 191-215)
# ============================================================================
readonly VPC_CIDR_BLOCK="${VPC_CIDR_BLOCK:-10.0.0.0/16}"
readonly PRIVATE_SUBNET_CIDRS="${PRIVATE_SUBNET_CIDRS:-10.0.1.0/24,10.0.2.0/24,10.0.3.0/24}"
readonly PUBLIC_SUBNET_CIDRS="${PUBLIC_SUBNET_CIDRS:-10.0.101.0/24,10.0.102.0/24,10.0.103.0/24}"
readonly DATABASE_SUBNET_CIDRS="${DATABASE_SUBNET_CIDRS:-10.0.201.0/24,10.0.202.0/24,10.0.203.0/24}"
readonly ENABLE_DNS_HOSTNAMES="${ENABLE_DNS_HOSTNAMES:-true}"
readonly ENABLE_DNS_SUPPORT="${ENABLE_DNS_SUPPORT:-true}"

readonly NAT_GATEWAY_ENABLED="${NAT_GATEWAY_ENABLED:-true}"
readonly NAT_GATEWAY_TYPE="${NAT_GATEWAY_TYPE:-public}"
readonly INTERNET_GATEWAY_ENABLED="${INTERNET_GATEWAY_ENABLED:-true}"
readonly VPC_ENDPOINTS_ENABLED="${VPC_ENDPOINTS_ENABLED:-true}"
readonly VPC_ENDPOINT_SERVICES="${VPC_ENDPOINT_SERVICES:-s3,dynamodb,ecr.api,ecr.dkr,ec2,ssm}"

readonly NETWORK_ACL_ENABLED="${NETWORK_ACL_ENABLED:-true}"
readonly FLOW_LOGS_ENABLED="${FLOW_LOGS_ENABLED:-true}"
readonly FLOW_LOGS_DESTINATION="${FLOW_LOGS_DESTINATION:-cloudwatch}"
readonly FLOW_LOGS_RETENTION="${FLOW_LOGS_RETENTION:-30}"
readonly TRANSIT_GATEWAY_ENABLED="${TRANSIT_GATEWAY_ENABLED:-false}"
readonly VPN_CONNECTION_ENABLED="${VPN_CONNECTION_ENABLED:-false}"
readonly DIRECT_CONNECT_ENABLED="${DIRECT_CONNECT_ENABLED:-false}"

readonly DNS_ZONE_NAME="${DNS_ZONE_NAME:-platform.company.com}"
readonly DNS_RECORD_TTL="${DNS_RECORD_TTL:-300}"
readonly DNS_HEALTH_CHECK_ENABLED="${DNS_HEALTH_CHECK_ENABLED:-true}"

echo "Infrastructure configuration loaded successfully"
echo "Configuration sections: 8"
echo "Total configuration parameters: $(grep -c '^readonly' "${0}")"