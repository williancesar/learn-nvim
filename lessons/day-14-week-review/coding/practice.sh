#!/bin/bash

# Comprehensive DevOps Automation Script - Week Review Practice
# This script combines all week's concepts: undo/redo, character search, visual mode,
# change operations, number operations, file operations, and general automation
#
# Practice all Vim techniques learned this week:
# - Day 8: Undo/redo (u, Ctrl-r, :earlier, :later)
# - Day 9: Character search (f, F, t, T, ;, ,)
# - Day 10: Visual mode (v, V, Ctrl-v, visual selections)
# - Day 11: Change operations (cw, ciw, c$, cc, C, ct, cf, ci", ci', ci(, etc.)
# - Day 12: Number operations (Ctrl-a, Ctrl-x on ports, versions, replicas)
# - Day 13: File operations (:e, :split, :vsplit, Ctrl-w, :bn, :bp)

set -euo pipefail

# ============================================================================
# Global Configuration and State Management
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTOMATION_VERSION="3.2.1"
BUILD_NUMBER="2847"
DEPLOYMENT_ID="dep-$(date +%Y%m%d%H%M%S)"
EXECUTION_START_TIME="$(date +%s)"

# Environment detection and configuration
ENVIRONMENT="${ENVIRONMENT:-production}"
CLOUD_PROVIDER="${CLOUD_PROVIDER:-aws}"
REGION="${REGION:-us-west-2}"
PROJECT_NAME="${PROJECT_NAME:-enterprise-platform}"

# Logging and state management
LOG_DIR="${SCRIPT_DIR}/logs"
STATE_DIR="${SCRIPT_DIR}/state"
BACKUP_DIR="${SCRIPT_DIR}/backups"
TEMP_DIR="${SCRIPT_DIR}/temp"
REPORTS_DIR="${SCRIPT_DIR}/reports"

# Create directories
for dir in "$LOG_DIR" "$STATE_DIR" "$BACKUP_DIR" "$TEMP_DIR" "$REPORTS_DIR"; do
    mkdir -p "$dir"
done

# Comprehensive service configuration with various numeric values
declare -A SERVICE_CONFIG=(
    ["api-gateway"]="port:8080,replicas:3,cpu:500,memory:1024,version:2.3.4"
    ["user-service"]="port:8081,replicas:5,cpu:300,memory:512,version:1.8.2"
    ["auth-service"]="port:8082,replicas:2,cpu:200,memory:256,version:1.5.1"
    ["payment-service"]="port:8083,replicas:4,cpu:400,memory:768,version:2.1.0"
    ["order-service"]="port:8084,replicas:6,cpu:350,memory:640,version:1.9.3"
    ["inventory-service"]="port:8085,replicas:3,cpu:250,memory:384,version:1.7.5"
    ["notification-service"]="port:8086,replicas:2,cpu:150,memory:192,version:1.4.2"
    ["analytics-service"]="port:8087,replicas:2,cpu:600,memory:1536,version:2.0.7"
    ["logging-service"]="port:8088,replicas:1,cpu:100,memory:128,version:1.2.3"
    ["monitoring-service"]="port:8089,replicas:2,cpu:300,memory:512,version:1.6.1"
)

# Infrastructure scaling parameters with numeric values for practice
MIN_REPLICAS="1"
MAX_REPLICAS="20"
SCALE_UP_THRESHOLD="75"
SCALE_DOWN_THRESHOLD="25"
CPU_REQUEST_BASE="100"
MEMORY_REQUEST_BASE="128"
HEALTH_CHECK_TIMEOUT="30"
READINESS_TIMEOUT="15"
STARTUP_TIMEOUT="120"

# Database and storage configuration
DB_CONNECTIONS_POOL_SIZE="50"
DB_CONNECTION_TIMEOUT="30"
DB_QUERY_TIMEOUT="60"
DB_MAINTENANCE_WINDOW_START="2"
DB_MAINTENANCE_WINDOW_END="4"
DB_BACKUP_RETENTION_DAYS="30"
DB_LOG_RETENTION_DAYS="7"

# Load balancer and network configuration
LB_HEALTH_CHECK_INTERVAL="10"
LB_HEALTH_CHECK_RETRIES="3"
LB_REQUEST_TIMEOUT="60"
LB_CONNECTION_TIMEOUT="30"
SSL_CERT_EXPIRY_DAYS="90"
CDN_TTL_STATIC="86400"
CDN_TTL_DYNAMIC="300"

# Monitoring and alerting thresholds
CPU_ALERT_WARNING="70"
CPU_ALERT_CRITICAL="85"
MEMORY_ALERT_WARNING="80"
MEMORY_ALERT_CRITICAL="90"
DISK_ALERT_WARNING="75"
DISK_ALERT_CRITICAL="90"
RESPONSE_TIME_ALERT_MS="1000"
ERROR_RATE_ALERT_PERCENT="5"
AVAILABILITY_SLA_PERCENT="99.95"

# Security and compliance settings
PASSWORD_MIN_LENGTH="12"
PASSWORD_MAX_AGE_DAYS="90"
SESSION_TIMEOUT_MINUTES="30"
LOGIN_ATTEMPT_LIMIT="5"
ACCOUNT_LOCKOUT_DURATION="15"
API_RATE_LIMIT_PER_MINUTE="10000"
JWT_EXPIRY_HOURS="24"
REFRESH_TOKEN_EXPIRY_DAYS="30"

# ============================================================================
# Color Output and Logging Functions
# ============================================================================

setup_colors() {
    if [[ -t 1 ]]; then
        export RED='\033[0;31m'
        export GREEN='\033[0;32m'
        export YELLOW='\033[1;33m'
        export BLUE='\033[0;34m'
        export PURPLE='\033[0;35m'
        export CYAN='\033[0;36m'
        export WHITE='\033[1;37m'
        export BOLD='\033[1m'
        export NC='\033[0m'
    else
        export RED='' GREEN='' YELLOW='' BLUE='' PURPLE='' CYAN='' WHITE='' BOLD='' NC=''
    fi
}

# Comprehensive logging system with multiple log files
log_message() {
    local level="$1"
    local component="${2:-MAIN}"
    local message="$3"
    local timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
    local log_entry="[${timestamp}] [${level}] [${component}] ${message}"

    # Write to appropriate log files
    echo "$log_entry" >> "${LOG_DIR}/automation.log"
    echo "$log_entry" >> "${LOG_DIR}/automation-${level,,}.log"

    # Console output with colors
    case "$level" in
        "INFO")
            echo -e "${GREEN}[INFO]${NC} ${CYAN}[${component}]${NC} ${message}" >&2
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} ${CYAN}[${component}]${NC} ${message}" >&2
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} ${CYAN}[${component}]${NC} ${message}" >&2
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} ${CYAN}[${component}]${NC} ${message}" >&2
            ;;
        "DEBUG")
            if [[ "${DEBUG:-false}" == "true" ]]; then
                echo -e "${BLUE}[DEBUG]${NC} ${CYAN}[${component}]${NC} ${message}" >&2
            fi
            ;;
    esac
}

log_info() { log_message "INFO" "${1:-MAIN}" "$2"; }
log_warn() { log_message "WARN" "${1:-MAIN}" "$2"; }
log_error() { log_message "ERROR" "${1:-MAIN}" "$2"; }
log_success() { log_message "SUCCESS" "${1:-MAIN}" "$2"; }
log_debug() { log_message "DEBUG" "${1:-MAIN}" "$2"; }

# ============================================================================
# State Management and Progress Tracking
# ============================================================================

save_automation_state() {
    local component="$1"
    local status="$2"
    local details="${3:-}"
    local timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    echo "${component}|${status}|${timestamp}|${details}" >> "${STATE_DIR}/automation.state"
    log_debug "STATE" "Saved state: ${component} = ${status}"
}

load_automation_state() {
    local component="$1"

    if [[ -f "${STATE_DIR}/automation.state" ]]; then
        grep "^${component}|" "${STATE_DIR}/automation.state" | tail -1 | cut -d'|' -f2
    else
        echo "unknown"
    fi
}

get_automation_progress() {
    if [[ ! -f "${STATE_DIR}/automation.state" ]]; then
        echo "0"
        return
    fi

    local total_components="10"
    local completed_components
    completed_components=$(grep "|completed|" "${STATE_DIR}/automation.state" | wc -l)

    echo $((completed_components * 100 / total_components))
}

# ============================================================================
# Infrastructure Discovery and Inventory
# ============================================================================

discover_infrastructure() {
    log_info "DISCOVERY" "Starting infrastructure discovery..."

    local discovery_file="${STATE_DIR}/infrastructure-inventory.json"

    # Discover Kubernetes resources
    discover_kubernetes_resources > "${TEMP_DIR}/k8s-resources.json"

    # Discover cloud resources based on provider
    case "$CLOUD_PROVIDER" in
        "aws")
            discover_aws_resources > "${TEMP_DIR}/aws-resources.json"
            ;;
        "gcp")
            discover_gcp_resources > "${TEMP_DIR}/gcp-resources.json"
            ;;
        "azure")
            discover_azure_resources > "${TEMP_DIR}/azure-resources.json"
            ;;
    esac

    # Discover databases
    discover_database_resources > "${TEMP_DIR}/database-resources.json"

    # Combine all discoveries into comprehensive inventory
    create_infrastructure_inventory "$discovery_file"

    save_automation_state "infrastructure-discovery" "completed" "Resources: $(jq '.total_resources' "$discovery_file")"
    log_success "DISCOVERY" "Infrastructure discovery completed"
}

discover_kubernetes_resources() {
    log_info "K8S-DISCOVERY" "Discovering Kubernetes resources..."

    local resources=""

    # Discover namespaces
    local namespaces
    namespaces=$(kubectl get namespaces -o json 2>/dev/null || echo '{"items":[]}')

    # Discover deployments across all namespaces
    local deployments
    deployments=$(kubectl get deployments --all-namespaces -o json 2>/dev/null || echo '{"items":[]}')

    # Discover services
    local services
    services=$(kubectl get services --all-namespaces -o json 2>/dev/null || echo '{"items":[]}')

    # Discover ingresses
    local ingresses
    ingresses=$(kubectl get ingresses --all-namespaces -o json 2>/dev/null || echo '{"items":[]}')

    # Combine into structured JSON
    cat <<EOF
{
  "kubernetes": {
    "cluster_info": $(kubectl cluster-info dump 2>/dev/null | head -10 | jq -Rs . || echo '""'),
    "namespaces": $namespaces,
    "deployments": $deployments,
    "services": $services,
    "ingresses": $ingresses,
    "discovery_time": "$(date -Iseconds)"
  }
}
EOF
}

discover_aws_resources() {
    log_info "AWS-DISCOVERY" "Discovering AWS resources..."

    local ec2_instances=""
    local rds_instances=""
    local elb_instances=""
    local s3_buckets=""

    # Discover EC2 instances
    if command -v aws &>/dev/null; then
        ec2_instances=$(aws ec2 describe-instances --region "$REGION" 2>/dev/null || echo '{"Reservations":[]}')
        rds_instances=$(aws rds describe-db-instances --region "$REGION" 2>/dev/null || echo '{"DBInstances":[]}')
        elb_instances=$(aws elbv2 describe-load-balancers --region "$REGION" 2>/dev/null || echo '{"LoadBalancers":[]}')
        s3_buckets=$(aws s3api list-buckets 2>/dev/null || echo '{"Buckets":[]}')
    fi

    cat <<EOF
{
  "aws": {
    "region": "$REGION",
    "ec2_instances": $ec2_instances,
    "rds_instances": $rds_instances,
    "load_balancers": $elb_instances,
    "s3_buckets": $s3_buckets,
    "discovery_time": "$(date -Iseconds)"
  }
}
EOF
}

discover_gcp_resources() {
    log_info "GCP-DISCOVERY" "Discovering GCP resources..."

    local compute_instances=""
    local sql_instances=""
    local storage_buckets=""

    if command -v gcloud &>/dev/null; then
        compute_instances=$(gcloud compute instances list --format=json 2>/dev/null || echo '[]')
        sql_instances=$(gcloud sql instances list --format=json 2>/dev/null || echo '[]')
        storage_buckets=$(gcloud storage buckets list --format=json 2>/dev/null || echo '[]')
    fi

    cat <<EOF
{
  "gcp": {
    "project": "${GCP_PROJECT_ID:-unknown}",
    "region": "$REGION",
    "compute_instances": $compute_instances,
    "sql_instances": $sql_instances,
    "storage_buckets": $storage_buckets,
    "discovery_time": "$(date -Iseconds)"
  }
}
EOF
}

discover_azure_resources() {
    log_info "AZURE-DISCOVERY" "Discovering Azure resources..."

    local vm_instances=""
    local sql_servers=""
    local storage_accounts=""

    if command -v az &>/dev/null; then
        vm_instances=$(az vm list --output json 2>/dev/null || echo '[]')
        sql_servers=$(az sql server list --output json 2>/dev/null || echo '[]')
        storage_accounts=$(az storage account list --output json 2>/dev/null || echo '[]')
    fi

    cat <<EOF
{
  "azure": {
    "subscription": "${AZURE_SUBSCRIPTION_ID:-unknown}",
    "location": "$REGION",
    "virtual_machines": $vm_instances,
    "sql_servers": $sql_servers,
    "storage_accounts": $storage_accounts,
    "discovery_time": "$(date -Iseconds)"
  }
}
EOF
}

discover_database_resources() {
    log_info "DB-DISCOVERY" "Discovering database resources..."

    cat <<EOF
{
  "databases": {
    "postgresql": {
      "instances": [],
      "connection_pools": $DB_CONNECTIONS_POOL_SIZE,
      "timeout_settings": {
        "connection": $DB_CONNECTION_TIMEOUT,
        "query": $DB_QUERY_TIMEOUT
      }
    },
    "redis": {
      "instances": [],
      "cache_settings": {
        "ttl": 3600,
        "max_memory": "1gb"
      }
    },
    "discovery_time": "$(date -Iseconds)"
  }
}
EOF
}

create_infrastructure_inventory() {
    local output_file="$1"

    log_info "INVENTORY" "Creating comprehensive infrastructure inventory..."

    # Combine all discovery files
    local k8s_data=""
    local cloud_data=""
    local db_data=""

    if [[ -f "${TEMP_DIR}/k8s-resources.json" ]]; then
        k8s_data=$(cat "${TEMP_DIR}/k8s-resources.json")
    fi

    if [[ -f "${TEMP_DIR}/aws-resources.json" ]]; then
        cloud_data=$(cat "${TEMP_DIR}/aws-resources.json")
    elif [[ -f "${TEMP_DIR}/gcp-resources.json" ]]; then
        cloud_data=$(cat "${TEMP_DIR}/gcp-resources.json")
    elif [[ -f "${TEMP_DIR}/azure-resources.json" ]]; then
        cloud_data=$(cat "${TEMP_DIR}/azure-resources.json")
    fi

    if [[ -f "${TEMP_DIR}/database-resources.json" ]]; then
        db_data=$(cat "${TEMP_DIR}/database-resources.json")
    fi

    # Create comprehensive inventory
    cat <<EOF > "$output_file"
{
  "inventory_metadata": {
    "generated_at": "$(date -Iseconds)",
    "automation_version": "$AUTOMATION_VERSION",
    "deployment_id": "$DEPLOYMENT_ID",
    "environment": "$ENVIRONMENT",
    "cloud_provider": "$CLOUD_PROVIDER",
    "region": "$REGION"
  },
  "infrastructure": {
    "kubernetes": $(echo "$k8s_data" | jq '.kubernetes // {}'),
    "cloud": $(echo "$cloud_data" | jq '.aws // .gcp // .azure // {}'),
    "databases": $(echo "$db_data" | jq '.databases // {}')
  },
  "services": $(generate_service_inventory),
  "total_resources": $(calculate_total_resources),
  "health_summary": $(generate_health_summary)
}
EOF

    log_success "INVENTORY" "Infrastructure inventory created: $output_file"
}

generate_service_inventory() {
    cat <<EOF
{
$(for service in "${!SERVICE_CONFIG[@]}"; do
    local config="${SERVICE_CONFIG[$service]}"
    local port=$(echo "$config" | sed 's/.*port:\([0-9]*\).*/\1/')
    local replicas=$(echo "$config" | sed 's/.*replicas:\([0-9]*\).*/\1/')
    local cpu=$(echo "$config" | sed 's/.*cpu:\([0-9]*\).*/\1/')
    local memory=$(echo "$config" | sed 's/.*memory:\([0-9]*\).*/\1/')
    local version=$(echo "$config" | sed 's/.*version:\([^,]*\).*/\1/')

    echo "  \"$service\": {"
    echo "    \"port\": $port,"
    echo "    \"replicas\": $replicas,"
    echo "    \"resources\": {"
    echo "      \"cpu\": \"${cpu}m\","
    echo "      \"memory\": \"${memory}Mi\""
    echo "    },"
    echo "    \"version\": \"$version\","
    echo "    \"status\": \"$(get_service_status "$service")\""
    echo "  }$([ "$service" != "${!SERVICE_CONFIG[*]: -1:1}" ] && echo ",")"
done)
}
EOF
}

get_service_status() {
    local service="$1"

    if kubectl get deployment "$service" &>/dev/null; then
        local ready_replicas
        ready_replicas=$(kubectl get deployment "$service" -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
        local desired_replicas
        desired_replicas=$(kubectl get deployment "$service" -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")

        if [[ "$ready_replicas" == "$desired_replicas" && "$ready_replicas" != "0" ]]; then
            echo "healthy"
        else
            echo "unhealthy"
        fi
    else
        echo "not-deployed"
    fi
}

calculate_total_resources() {
    local total=0

    # Count Kubernetes resources
    local k8s_count
    k8s_count=$(kubectl get all --all-namespaces 2>/dev/null | wc -l || echo "0")
    total=$((total + k8s_count))

    # Count cloud resources (simplified)
    total=$((total + 10)) # Placeholder

    echo "$total"
}

generate_health_summary() {
    local healthy_services=0
    local total_services=${#SERVICE_CONFIG[@]}

    for service in "${!SERVICE_CONFIG[@]}"; do
        local status
        status=$(get_service_status "$service")
        if [[ "$status" == "healthy" ]]; then
            healthy_services=$((healthy_services + 1))
        fi
    done

    local health_percentage=$((healthy_services * 100 / total_services))

    cat <<EOF
{
  "total_services": $total_services,
  "healthy_services": $healthy_services,
  "health_percentage": $health_percentage,
  "status": "$([ $health_percentage -ge 90 ] && echo "excellent" || [ $health_percentage -ge 70 ] && echo "good" || echo "poor")"
}
EOF
}

# ============================================================================
# Automated Health Checks and Monitoring
# ============================================================================

perform_comprehensive_health_checks() {
    log_info "HEALTH" "Starting comprehensive health checks..."

    local health_report="${REPORTS_DIR}/health-report-$(date +%Y%m%d-%H%M%S).json"
    local failed_checks=()

    # Infrastructure health checks
    check_kubernetes_health || failed_checks+=("kubernetes")
    check_cloud_resources_health || failed_checks+=("cloud-resources")
    check_database_health || failed_checks+=("databases")
    check_network_connectivity || failed_checks+=("network")
    check_ssl_certificates || failed_checks+=("ssl-certificates")

    # Application health checks
    check_service_health_endpoints || failed_checks+=("service-endpoints")
    check_load_balancer_health || failed_checks+=("load-balancer")
    check_monitoring_systems || failed_checks+=("monitoring")
    check_log_aggregation || failed_checks+=("logging")

    # Security and compliance checks
    check_security_policies || failed_checks+=("security")
    check_backup_integrity || failed_checks+=("backups")

    # Generate health report
    generate_health_report "$health_report" "${failed_checks[@]}"

    if [[ ${#failed_checks[@]} -eq 0 ]]; then
        save_automation_state "health-checks" "completed" "All checks passed"
        log_success "HEALTH" "All health checks passed successfully"
        return 0
    else
        save_automation_state "health-checks" "failed" "Failed: ${failed_checks[*]}"
        log_error "HEALTH" "Health checks failed: ${failed_checks[*]}"
        return 1
    fi
}

check_kubernetes_health() {
    log_info "K8S-HEALTH" "Checking Kubernetes cluster health..."

    # Check cluster connectivity
    if ! kubectl cluster-info &>/dev/null; then
        log_error "K8S-HEALTH" "Cannot connect to Kubernetes cluster"
        return 1
    fi

    # Check node health
    local unhealthy_nodes
    unhealthy_nodes=$(kubectl get nodes --no-headers | grep -v Ready | wc -l)
    if [[ "$unhealthy_nodes" -gt 0 ]]; then
        log_error "K8S-HEALTH" "${unhealthy_nodes} unhealthy nodes found"
        return 1
    fi

    # Check system pods
    local failed_system_pods
    failed_system_pods=$(kubectl get pods -n kube-system --no-headers | grep -v Running | grep -v Completed | wc -l)
    if [[ "$failed_system_pods" -gt 0 ]]; then
        log_error "K8S-HEALTH" "${failed_system_pods} failed system pods found"
        return 1
    fi

    # Check application deployments
    for service in "${!SERVICE_CONFIG[@]}"; do
        if ! check_deployment_health "$service"; then
            log_error "K8S-HEALTH" "Deployment $service is unhealthy"
            return 1
        fi
    done

    log_success "K8S-HEALTH" "Kubernetes cluster is healthy"
    return 0
}

check_deployment_health() {
    local service="$1"

    if ! kubectl get deployment "$service" &>/dev/null; then
        return 1
    fi

    local ready_replicas
    ready_replicas=$(kubectl get deployment "$service" -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
    local desired_replicas
    desired_replicas=$(kubectl get deployment "$service" -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")

    [[ "$ready_replicas" == "$desired_replicas" && "$ready_replicas" != "0" ]]
}

check_cloud_resources_health() {
    log_info "CLOUD-HEALTH" "Checking cloud resources health..."

    case "$CLOUD_PROVIDER" in
        "aws")
            check_aws_resources_health
            ;;
        "gcp")
            check_gcp_resources_health
            ;;
        "azure")
            check_azure_resources_health
            ;;
        *)
            log_warn "CLOUD-HEALTH" "Unknown cloud provider: $CLOUD_PROVIDER"
            return 0
            ;;
    esac
}

check_aws_resources_health() {
    if ! command -v aws &>/dev/null; then
        log_warn "AWS-HEALTH" "AWS CLI not available, skipping AWS health checks"
        return 0
    fi

    # Check AWS service status
    if ! aws sts get-caller-identity &>/dev/null; then
        log_error "AWS-HEALTH" "AWS authentication failed"
        return 1
    fi

    log_success "AWS-HEALTH" "AWS resources are accessible"
    return 0
}

check_gcp_resources_health() {
    if ! command -v gcloud &>/dev/null; then
        log_warn "GCP-HEALTH" "gcloud CLI not available, skipping GCP health checks"
        return 0
    fi

    # Check GCP authentication
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 &>/dev/null; then
        log_error "GCP-HEALTH" "GCP authentication failed"
        return 1
    fi

    log_success "GCP-HEALTH" "GCP resources are accessible"
    return 0
}

check_azure_resources_health() {
    if ! command -v az &>/dev/null; then
        log_warn "AZURE-HEALTH" "Azure CLI not available, skipping Azure health checks"
        return 0
    fi

    # Check Azure authentication
    if ! az account show &>/dev/null; then
        log_error "AZURE-HEALTH" "Azure authentication failed"
        return 1
    fi

    log_success "AZURE-HEALTH" "Azure resources are accessible"
    return 0
}

check_database_health() {
    log_info "DB-HEALTH" "Checking database health..."

    # This would normally check actual database connections
    # For demo purposes, we'll simulate database health checks
    local db_response_time="45"  # milliseconds
    local db_connection_count="23"
    local db_cpu_usage="35"      # percentage

    if [[ "$db_response_time" -gt 100 ]]; then
        log_error "DB-HEALTH" "Database response time too high: ${db_response_time}ms"
        return 1
    fi

    if [[ "$db_connection_count" -gt "$DB_CONNECTIONS_POOL_SIZE" ]]; then
        log_error "DB-HEALTH" "Too many database connections: $db_connection_count"
        return 1
    fi

    if [[ "$db_cpu_usage" -gt 80 ]]; then
        log_error "DB-HEALTH" "Database CPU usage too high: ${db_cpu_usage}%"
        return 1
    fi

    log_success "DB-HEALTH" "Database health checks passed"
    return 0
}

check_network_connectivity() {
    log_info "NET-HEALTH" "Checking network connectivity..."

    # Check DNS resolution
    if ! nslookup google.com &>/dev/null; then
        log_error "NET-HEALTH" "DNS resolution failed"
        return 1
    fi

    # Check internet connectivity
    if ! curl -s --connect-timeout 5 https://httpbin.org/status/200 &>/dev/null; then
        log_error "NET-HEALTH" "Internet connectivity failed"
        return 1
    fi

    log_success "NET-HEALTH" "Network connectivity checks passed"
    return 0
}

check_ssl_certificates() {
    log_info "SSL-HEALTH" "Checking SSL certificate health..."

    local domains=(
        "api.example.com"
        "app.example.com"
        "admin.example.com"
    )

    for domain in "${domains[@]}"; do
        local expiry_days
        expiry_days=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null |
                     openssl x509 -noout -dates | grep notAfter | sed 's/notAfter=//' |
                     xargs -I {} date -d {} +%s 2>/dev/null || echo "0")

        if [[ "$expiry_days" -gt 0 ]]; then
            local days_until_expiry=$(( (expiry_days - $(date +%s)) / 86400 ))

            if [[ "$days_until_expiry" -lt "$SSL_CERT_EXPIRY_DAYS" ]]; then
                log_warn "SSL-HEALTH" "SSL certificate for $domain expires in $days_until_expiry days"
            fi
        fi
    done

    log_success "SSL-HEALTH" "SSL certificate checks completed"
    return 0
}

check_service_health_endpoints() {
    log_info "SVC-HEALTH" "Checking service health endpoints..."

    local failed_services=()

    for service in "${!SERVICE_CONFIG[@]}"; do
        local config="${SERVICE_CONFIG[$service]}"
        local port=$(echo "$config" | sed 's/.*port:\([0-9]*\).*/\1/')

        # Simulate health endpoint check
        local health_url="http://localhost:${port}/health"

        # In a real scenario, this would make actual HTTP calls
        # For demo, we'll randomly simulate some failures
        if [[ $((RANDOM % 10)) -eq 0 ]]; then
            failed_services+=("$service")
            log_error "SVC-HEALTH" "Health check failed for $service ($health_url)"
        else
            log_debug "SVC-HEALTH" "Health check passed for $service"
        fi
    done

    if [[ ${#failed_services[@]} -eq 0 ]]; then
        log_success "SVC-HEALTH" "All service health endpoints are responding"
        return 0
    else
        log_error "SVC-HEALTH" "Failed service health checks: ${failed_services[*]}"
        return 1
    fi
}

check_load_balancer_health() {
    log_info "LB-HEALTH" "Checking load balancer health..."

    # Simulate load balancer health metrics
    local lb_response_time="250"  # milliseconds
    local lb_error_rate="1"       # percentage
    local lb_active_connections="1250"

    if [[ "$lb_response_time" -gt "$LB_REQUEST_TIMEOUT" ]]; then
        log_error "LB-HEALTH" "Load balancer response time too high: ${lb_response_time}ms"
        return 1
    fi

    if [[ "$lb_error_rate" -gt "$ERROR_RATE_ALERT_PERCENT" ]]; then
        log_error "LB-HEALTH" "Load balancer error rate too high: ${lb_error_rate}%"
        return 1
    fi

    log_success "LB-HEALTH" "Load balancer health checks passed"
    return 0
}

check_monitoring_systems() {
    log_info "MON-HEALTH" "Checking monitoring systems..."

    # Check if Prometheus is accessible
    if kubectl get pods -n monitoring | grep prometheus &>/dev/null; then
        log_success "MON-HEALTH" "Prometheus monitoring is running"
    else
        log_warn "MON-HEALTH" "Prometheus monitoring not detected"
    fi

    # Check if Grafana is accessible
    if kubectl get pods -n monitoring | grep grafana &>/dev/null; then
        log_success "MON-HEALTH" "Grafana dashboards are available"
    else
        log_warn "MON-HEALTH" "Grafana dashboards not detected"
    fi

    return 0
}

check_log_aggregation() {
    log_info "LOG-HEALTH" "Checking log aggregation systems..."

    # Check log disk usage
    local log_disk_usage
    log_disk_usage=$(df "$LOG_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')

    if [[ "$log_disk_usage" -gt "$DISK_ALERT_WARNING" ]]; then
        log_warn "LOG-HEALTH" "Log disk usage high: ${log_disk_usage}%"

        # Cleanup old logs
        find "$LOG_DIR" -name "*.log" -mtime +$LOG_RETENTION_DAYS -delete
        log_info "LOG-HEALTH" "Cleaned up logs older than $LOG_RETENTION_DAYS days"
    fi

    log_success "LOG-HEALTH" "Log aggregation systems are healthy"
    return 0
}

check_security_policies() {
    log_info "SEC-HEALTH" "Checking security policies..."

    # Check network policies
    local network_policies
    network_policies=$(kubectl get networkpolicies --all-namespaces --no-headers | wc -l)

    if [[ "$network_policies" -eq 0 ]]; then
        log_warn "SEC-HEALTH" "No network policies found"
    else
        log_success "SEC-HEALTH" "$network_policies network policies in place"
    fi

    # Check RBAC policies
    local rbac_roles
    rbac_roles=$(kubectl get roles --all-namespaces --no-headers | wc -l)

    if [[ "$rbac_roles" -eq 0 ]]; then
        log_warn "SEC-HEALTH" "No RBAC roles found"
    else
        log_success "SEC-HEALTH" "$rbac_roles RBAC roles configured"
    fi

    return 0
}

check_backup_integrity() {
    log_info "BACKUP-HEALTH" "Checking backup integrity..."

    # Check backup age
    local latest_backup_age="2"  # days

    if [[ "$latest_backup_age" -gt "$DB_BACKUP_RETENTION_DAYS" ]]; then
        log_error "BACKUP-HEALTH" "Latest backup is $latest_backup_age days old"
        return 1
    fi

    # Check backup size consistency
    local backup_size_variance="5"  # percentage

    if [[ "$backup_size_variance" -gt 20 ]]; then
        log_warn "BACKUP-HEALTH" "Backup size variance is high: ${backup_size_variance}%"
    fi

    log_success "BACKUP-HEALTH" "Backup integrity checks passed"
    return 0
}

generate_health_report() {
    local output_file="$1"
    shift
    local failed_checks=("$@")

    local total_checks=11
    local passed_checks=$((total_checks - ${#failed_checks[@]}))
    local health_score=$((passed_checks * 100 / total_checks))

    cat <<EOF > "$output_file"
{
  "health_report": {
    "generated_at": "$(date -Iseconds)",
    "automation_version": "$AUTOMATION_VERSION",
    "deployment_id": "$DEPLOYMENT_ID",
    "environment": "$ENVIRONMENT",
    "total_checks": $total_checks,
    "passed_checks": $passed_checks,
    "failed_checks": ${#failed_checks[@]},
    "health_score": $health_score,
    "status": "$([ $health_score -ge 90 ] && echo "excellent" || [ $health_score -ge 70 ] && echo "good" || [ $health_score -ge 50 ] && echo "fair" || echo "poor")",
    "failed_components": $(printf '%s\n' "${failed_checks[@]}" | jq -R . | jq -s .),
    "recommendations": $(generate_health_recommendations "${failed_checks[@]}")
  },
  "detailed_results": {
    "infrastructure": {
      "kubernetes": "$(load_automation_state "kubernetes" | grep -q "failed" && echo "failed" || echo "passed")",
      "cloud_resources": "$(load_automation_state "cloud-resources" | grep -q "failed" && echo "failed" || echo "passed")",
      "databases": "$(load_automation_state "databases" | grep -q "failed" && echo "failed" || echo "passed")",
      "network": "$(load_automation_state "network" | grep -q "failed" && echo "failed" || echo "passed")"
    },
    "applications": {
      "service_endpoints": "$(load_automation_state "service-endpoints" | grep -q "failed" && echo "failed" || echo "passed")",
      "load_balancer": "$(load_automation_state "load-balancer" | grep -q "failed" && echo "failed" || echo "passed")",
      "monitoring": "$(load_automation_state "monitoring" | grep -q "failed" && echo "failed" || echo "passed")",
      "logging": "$(load_automation_state "logging" | grep -q "failed" && echo "failed" || echo "passed")"
    },
    "security": {
      "policies": "$(load_automation_state "security" | grep -q "failed" && echo "failed" || echo "passed")",
      "backups": "$(load_automation_state "backups" | grep -q "failed" && echo "failed" || echo "passed")",
      "certificates": "$(load_automation_state "ssl-certificates" | grep -q "failed" && echo "failed" || echo "passed")"
    }
  }
}
EOF

    log_success "HEALTH" "Health report generated: $output_file"
}

generate_health_recommendations() {
    local failed_checks=("$@")

    if [[ ${#failed_checks[@]} -eq 0 ]]; then
        echo '["System is healthy - maintain current monitoring and maintenance schedules"]'
        return
    fi

    local recommendations=()

    for check in "${failed_checks[@]}"; do
        case "$check" in
            "kubernetes")
                recommendations+=("Check Kubernetes cluster nodes and system pods")
                recommendations+=("Review deployment configurations and resource limits")
                ;;
            "databases")
                recommendations+=("Optimize database queries and connection pools")
                recommendations+=("Consider scaling database resources")
                ;;
            "network")
                recommendations+=("Check network connectivity and DNS resolution")
                recommendations+=("Review firewall rules and security groups")
                ;;
            "service-endpoints")
                recommendations+=("Investigate failed service health endpoints")
                recommendations+=("Check application logs for errors")
                ;;
            "security")
                recommendations+=("Review and implement security policies")
                recommendations+=("Ensure RBAC and network policies are in place")
                ;;
            "backups")
                recommendations+=("Check backup schedules and integrity")
                recommendations+=("Test backup restoration procedures")
                ;;
        esac
    done

    printf '%s\n' "${recommendations[@]}" | jq -R . | jq -s .
}

# ============================================================================
# Automated Scaling and Resource Optimization
# ============================================================================

perform_automatic_scaling() {
    log_info "SCALING" "Starting automatic scaling operations..."

    local scaling_decisions=()

    # Analyze each service for scaling needs
    for service in "${!SERVICE_CONFIG[@]}"; do
        local scaling_decision
        scaling_decision=$(analyze_service_scaling_needs "$service")

        if [[ "$scaling_decision" != "no-action" ]]; then
            scaling_decisions+=("$service:$scaling_decision")
            execute_scaling_action "$service" "$scaling_decision"
        fi
    done

    # Generate scaling report
    generate_scaling_report "${scaling_decisions[@]}"

    save_automation_state "automatic-scaling" "completed" "Decisions: ${#scaling_decisions[@]}"
    log_success "SCALING" "Automatic scaling operations completed"
}

analyze_service_scaling_needs() {
    local service="$1"
    local config="${SERVICE_CONFIG[$service]}"
    local current_replicas
    current_replicas=$(echo "$config" | sed 's/.*replicas:\([0-9]*\).*/\1/')

    # Simulate metrics (in a real scenario, these would come from monitoring systems)
    local cpu_usage=$((RANDOM % 100))
    local memory_usage=$((RANDOM % 100))
    local request_rate=$((RANDOM % 1000))
    local response_time=$((RANDOM % 2000))

    log_debug "SCALING" "Service $service metrics: CPU=${cpu_usage}%, MEM=${memory_usage}%, RPS=${request_rate}, RT=${response_time}ms"

    # Scaling decision logic
    local scale_up_needed=false
    local scale_down_needed=false

    # Scale up conditions
    if [[ "$cpu_usage" -gt "$SCALE_UP_THRESHOLD" ]] ||
       [[ "$memory_usage" -gt "$SCALE_UP_THRESHOLD" ]] ||
       [[ "$response_time" -gt "$RESPONSE_TIME_ALERT_MS" ]]; then
        scale_up_needed=true
    fi

    # Scale down conditions
    if [[ "$cpu_usage" -lt "$SCALE_DOWN_THRESHOLD" ]] &&
       [[ "$memory_usage" -lt "$SCALE_DOWN_THRESHOLD" ]] &&
       [[ "$response_time" -lt $((RESPONSE_TIME_ALERT_MS / 2)) ]] &&
       [[ "$current_replicas" -gt "$MIN_REPLICAS" ]]; then
        scale_down_needed=true
    fi

    # Determine action
    if [[ "$scale_up_needed" == "true" ]] && [[ "$current_replicas" -lt "$MAX_REPLICAS" ]]; then
        echo "scale-up"
    elif [[ "$scale_down_needed" == "true" ]]; then
        echo "scale-down"
    else
        echo "no-action"
    fi
}

execute_scaling_action() {
    local service="$1"
    local action="$2"
    local config="${SERVICE_CONFIG[$service]}"
    local current_replicas
    current_replicas=$(echo "$config" | sed 's/.*replicas:\([0-9]*\).*/\1/')

    local new_replicas="$current_replicas"

    case "$action" in
        "scale-up")
            new_replicas=$((current_replicas + SCALE_UP_REPLICAS))
            if [[ "$new_replicas" -gt "$MAX_REPLICAS" ]]; then
                new_replicas="$MAX_REPLICAS"
            fi
            log_info "SCALING" "Scaling up $service from $current_replicas to $new_replicas replicas"
            ;;
        "scale-down")
            new_replicas=$((current_replicas - SCALE_DOWN_REPLICAS))
            if [[ "$new_replicas" -lt "$MIN_REPLICAS" ]]; then
                new_replicas="$MIN_REPLICAS"
            fi
            log_info "SCALING" "Scaling down $service from $current_replicas to $new_replicas replicas"
            ;;
    esac

    # Execute scaling (simulate kubectl command)
    if [[ "$new_replicas" != "$current_replicas" ]]; then
        # kubectl scale deployment "$service" --replicas="$new_replicas"
        log_info "SCALING" "Would execute: kubectl scale deployment $service --replicas=$new_replicas"

        # Update our configuration
        local new_config
        new_config=$(echo "$config" | sed "s/replicas:[0-9]*/replicas:$new_replicas/")
        SERVICE_CONFIG[$service]="$new_config"

        log_success "SCALING" "Scaled $service to $new_replicas replicas"
    fi
}

generate_scaling_report() {
    local scaling_decisions=("$@")
    local report_file="${REPORTS_DIR}/scaling-report-$(date +%Y%m%d-%H%M%S).json"

    local total_services=${#SERVICE_CONFIG[@]}
    local scaled_services=${#scaling_decisions[@]}

    cat <<EOF > "$report_file"
{
  "scaling_report": {
    "generated_at": "$(date -Iseconds)",
    "automation_version": "$AUTOMATION_VERSION",
    "deployment_id": "$DEPLOYMENT_ID",
    "total_services": $total_services,
    "scaled_services": $scaled_services,
    "scaling_efficiency": $((scaled_services * 100 / total_services))
  },
  "scaling_actions": [
$(for decision in "${scaling_decisions[@]}"; do
    local service=$(echo "$decision" | cut -d: -f1)
    local action=$(echo "$decision" | cut -d: -f2)
    local config="${SERVICE_CONFIG[$service]}"
    local replicas=$(echo "$config" | sed 's/.*replicas:\([0-9]*\).*/\1/')

    echo "    {"
    echo "      \"service\": \"$service\","
    echo "      \"action\": \"$action\","
    echo "      \"new_replicas\": $replicas,"
    echo "      \"timestamp\": \"$(date -Iseconds)\""
    echo "    }$([ "$decision" != "${scaling_decisions[*]: -1:1}" ] && echo ",")"
done)
  ],
  "resource_optimization": {
    "total_cpu_allocated": $(calculate_total_cpu),
    "total_memory_allocated": $(calculate_total_memory),
    "estimated_cost_impact": "$(calculate_cost_impact)"
  }
}
EOF

    log_success "SCALING" "Scaling report generated: $report_file"
}

calculate_total_cpu() {
    local total_cpu=0

    for service in "${!SERVICE_CONFIG[@]}"; do
        local config="${SERVICE_CONFIG[$service]}"
        local replicas=$(echo "$config" | sed 's/.*replicas:\([0-9]*\).*/\1/')
        local cpu=$(echo "$config" | sed 's/.*cpu:\([0-9]*\).*/\1/')

        total_cpu=$((total_cpu + (replicas * cpu)))
    done

    echo "${total_cpu}"
}

calculate_total_memory() {
    local total_memory=0

    for service in "${!SERVICE_CONFIG[@]}"; do
        local config="${SERVICE_CONFIG[$service]}"
        local replicas=$(echo "$config" | sed 's/.*replicas:\([0-9]*\).*/\1/')
        local memory=$(echo "$config" | sed 's/.*memory:\([0-9]*\).*/\1/')

        total_memory=$((total_memory + (replicas * memory)))
    done

    echo "${total_memory}"
}

calculate_cost_impact() {
    # Simplified cost calculation
    local total_cpu
    total_cpu=$(calculate_total_cpu)
    local total_memory
    total_memory=$(calculate_total_memory)

    local estimated_monthly_cost=$(( (total_cpu / 1000) * 50 + (total_memory / 1024) * 25 ))

    echo "\$${estimated_monthly_cost}/month"
}

# ============================================================================
# Security Auditing and Compliance Checking
# ============================================================================

perform_security_audit() {
    log_info "SECURITY" "Starting comprehensive security audit..."

    local security_issues=()
    local audit_report="${REPORTS_DIR}/security-audit-$(date +%Y%m%d-%H%M%S).json"

    # Kubernetes security checks
    audit_kubernetes_security || security_issues+=("kubernetes-security")

    # Network security checks
    audit_network_security || security_issues+=("network-security")

    # Application security checks
    audit_application_security || security_issues+=("application-security")

    # Data security checks
    audit_data_security || security_issues+=("data-security")

    # Access control checks
    audit_access_controls || security_issues+=("access-controls")

    # Certificate and encryption checks
    audit_encryption_standards || security_issues+=("encryption")

    # Generate security audit report
    generate_security_audit_report "$audit_report" "${security_issues[@]}"

    if [[ ${#security_issues[@]} -eq 0 ]]; then
        save_automation_state "security-audit" "completed" "No issues found"
        log_success "SECURITY" "Security audit completed - no critical issues found"
        return 0
    else
        save_automation_state "security-audit" "issues-found" "Issues: ${security_issues[*]}"
        log_warn "SECURITY" "Security audit found issues: ${security_issues[*]}"
        return 1
    fi
}

audit_kubernetes_security() {
    log_info "K8S-SEC" "Auditing Kubernetes security configurations..."

    local issues_found=false

    # Check for privileged containers
    local privileged_containers
    privileged_containers=$(kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.name}{" "}{.spec.securityContext.privileged}{"\n"}{end}' 2>/dev/null | grep -c true || echo "0")

    if [[ "$privileged_containers" -gt 0 ]]; then
        log_warn "K8S-SEC" "Found $privileged_containers privileged containers"
        issues_found=true
    fi

    # Check for containers running as root
    local root_containers
    root_containers=$(kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.name}{" "}{.spec.securityContext.runAsUser}{"\n"}{end}' 2>/dev/null | grep -c " 0$" || echo "0")

    if [[ "$root_containers" -gt 0 ]]; then
        log_warn "K8S-SEC" "Found $root_containers containers running as root"
        issues_found=true
    fi

    # Check for missing security contexts
    local pods_without_security_context
    pods_without_security_context=$(kubectl get pods --all-namespaces -o json 2>/dev/null | jq '[.items[] | select(.spec.securityContext == null)] | length')

    if [[ "$pods_without_security_context" -gt 0 ]]; then
        log_warn "K8S-SEC" "Found $pods_without_security_context pods without security contexts"
        issues_found=true
    fi

    # Check for network policies
    local network_policies
    network_policies=$(kubectl get networkpolicies --all-namespaces --no-headers 2>/dev/null | wc -l)

    if [[ "$network_policies" -eq 0 ]]; then
        log_warn "K8S-SEC" "No network policies found - network segmentation not enforced"
        issues_found=true
    fi

    if [[ "$issues_found" == "false" ]]; then
        log_success "K8S-SEC" "Kubernetes security audit passed"
        return 0
    else
        return 1
    fi
}

audit_network_security() {
    log_info "NET-SEC" "Auditing network security configurations..."

    local issues_found=false

    # Check for open ports (simulated)
    local open_ports=("22" "80" "443" "8080" "9090")
    local suspicious_ports=("23" "21" "3389")

    for port in "${suspicious_ports[@]}"; do
        # In reality, this would check actual network configurations
        if [[ $((RANDOM % 10)) -eq 0 ]]; then
            log_warn "NET-SEC" "Potentially risky port $port appears to be open"
            issues_found=true
        fi
    done

    # Check SSL/TLS configurations
    local weak_ssl_configs=0

    # Simulate SSL configuration check
    if [[ $((RANDOM % 5)) -eq 0 ]]; then
        weak_ssl_configs=1
        log_warn "NET-SEC" "Weak SSL/TLS configuration detected"
        issues_found=true
    fi

    if [[ "$issues_found" == "false" ]]; then
        log_success "NET-SEC" "Network security audit passed"
        return 0
    else
        return 1
    fi
}

audit_application_security() {
    log_info "APP-SEC" "Auditing application security configurations..."

    local issues_found=false

    # Check for hard-coded secrets
    for service in "${!SERVICE_CONFIG[@]}"; do
        # Simulate secret scanning
        if [[ $((RANDOM % 8)) -eq 0 ]]; then
            log_warn "APP-SEC" "Potential hard-coded secrets found in $service"
            issues_found=true
        fi
    done

    # Check API security configurations
    local insecure_apis=0

    # Check for APIs without authentication
    for service in "${!SERVICE_CONFIG[@]}"; do
        if [[ $((RANDOM % 6)) -eq 0 ]]; then
            insecure_apis=$((insecure_apis + 1))
            log_warn "APP-SEC" "Service $service may have unauthenticated endpoints"
            issues_found=true
        fi
    done

    # Check rate limiting
    if [[ "$API_RATE_LIMIT_PER_MINUTE" -gt 50000 ]]; then
        log_warn "APP-SEC" "API rate limit is very high: $API_RATE_LIMIT_PER_MINUTE requests/minute"
        issues_found=true
    fi

    if [[ "$issues_found" == "false" ]]; then
        log_success "APP-SEC" "Application security audit passed"
        return 0
    else
        return 1
    fi
}

audit_data_security() {
    log_info "DATA-SEC" "Auditing data security and encryption..."

    local issues_found=false

    # Check database encryption
    if [[ "${DATABASE_SSL_MODE:-}" != "require" ]]; then
        log_warn "DATA-SEC" "Database SSL not enforced"
        issues_found=true
    fi

    # Check backup encryption
    local unencrypted_backups=0

    # Simulate backup encryption check
    if [[ $((RANDOM % 4)) -eq 0 ]]; then
        unencrypted_backups=1
        log_warn "DATA-SEC" "Unencrypted backups detected"
        issues_found=true
    fi

    # Check data retention policies
    if [[ "$LOG_RETENTION_DAYS" -gt 90 ]]; then
        log_warn "DATA-SEC" "Log retention period is very long: $LOG_RETENTION_DAYS days"
        issues_found=true
    fi

    if [[ "$issues_found" == "false" ]]; then
        log_success "DATA-SEC" "Data security audit passed"
        return 0
    else
        return 1
    fi
}

audit_access_controls() {
    log_info "ACCESS-SEC" "Auditing access controls and authentication..."

    local issues_found=false

    # Check password policies
    if [[ "$PASSWORD_MIN_LENGTH" -lt 8 ]]; then
        log_warn "ACCESS-SEC" "Password minimum length is too short: $PASSWORD_MIN_LENGTH"
        issues_found=true
    fi

    if [[ "$PASSWORD_MAX_AGE_DAYS" -gt 365 ]]; then
        log_warn "ACCESS-SEC" "Password max age is too long: $PASSWORD_MAX_AGE_DAYS days"
        issues_found=true
    fi

    # Check session timeouts
    if [[ "$SESSION_TIMEOUT_MINUTES" -gt 480 ]]; then
        log_warn "ACCESS-SEC" "Session timeout is too long: $SESSION_TIMEOUT_MINUTES minutes"
        issues_found=true
    fi

    # Check login attempt limits
    if [[ "$LOGIN_ATTEMPT_LIMIT" -gt 10 ]]; then
        log_warn "ACCESS-SEC" "Login attempt limit is too high: $LOGIN_ATTEMPT_LIMIT"
        issues_found=true
    fi

    # Check RBAC configurations
    local rbac_roles
    rbac_roles=$(kubectl get roles,clusterroles --no-headers 2>/dev/null | wc -l)

    if [[ "$rbac_roles" -lt 5 ]]; then
        log_warn "ACCESS-SEC" "Few RBAC roles configured: $rbac_roles"
        issues_found=true
    fi

    if [[ "$issues_found" == "false" ]]; then
        log_success "ACCESS-SEC" "Access control audit passed"
        return 0
    else
        return 1
    fi
}

audit_encryption_standards() {
    log_info "CRYPTO-SEC" "Auditing encryption standards and certificates..."

    local issues_found=false

    # Check JWT configuration
    if [[ "${JWT_SECRET}" == "super-secret-jwt-key-change-in-production" ]]; then
        log_error "CRYPTO-SEC" "Default JWT secret is being used!"
        issues_found=true
    fi

    if [[ "$JWT_EXPIRY_HOURS" -gt 168 ]]; then  # 1 week
        log_warn "CRYPTO-SEC" "JWT expiry is very long: $JWT_EXPIRY_HOURS hours"
        issues_found=true
    fi

    # Check certificate expiry
    local certs_expiring_soon=0

    # Simulate certificate expiry check
    if [[ $((RANDOM % 3)) -eq 0 ]]; then
        certs_expiring_soon=1
        log_warn "CRYPTO-SEC" "SSL certificates expiring within $SSL_CERT_EXPIRY_DAYS days"
        issues_found=true
    fi

    if [[ "$issues_found" == "false" ]]; then
        log_success "CRYPTO-SEC" "Encryption and certificate audit passed"
        return 0
    else
        return 1
    fi
}

generate_security_audit_report() {
    local output_file="$1"
    shift
    local security_issues=("$@")

    local total_checks=6
    local passed_checks=$((total_checks - ${#security_issues[@]}))
    local security_score=$((passed_checks * 100 / total_checks))

    cat <<EOF > "$output_file"
{
  "security_audit": {
    "generated_at": "$(date -Iseconds)",
    "automation_version": "$AUTOMATION_VERSION",
    "deployment_id": "$DEPLOYMENT_ID",
    "environment": "$ENVIRONMENT",
    "total_checks": $total_checks,
    "passed_checks": $passed_checks,
    "failed_checks": ${#security_issues[@]},
    "security_score": $security_score,
    "risk_level": "$([ $security_score -ge 90 ] && echo "low" || [ $security_score -ge 70 ] && echo "medium" || echo "high")",
    "failed_categories": $(printf '%s\n' "${security_issues[@]}" | jq -R . | jq -s .),
    "recommendations": $(generate_security_recommendations "${security_issues[@]}")
  },
  "detailed_findings": {
    "kubernetes_security": {
      "privileged_containers": 0,
      "root_containers": 0,
      "missing_security_contexts": 0,
      "network_policies": $(kubectl get networkpolicies --all-namespaces --no-headers 2>/dev/null | wc -l)
    },
    "network_security": {
      "open_ports": [],
      "ssl_configuration": "secure",
      "firewall_rules": "configured"
    },
    "application_security": {
      "api_authentication": "enabled",
      "rate_limiting": $API_RATE_LIMIT_PER_MINUTE,
      "input_validation": "implemented"
    },
    "data_security": {
      "encryption_at_rest": "enabled",
      "encryption_in_transit": "enabled",
      "backup_encryption": "enabled"
    },
    "access_controls": {
      "password_policy": {
        "min_length": $PASSWORD_MIN_LENGTH,
        "max_age_days": $PASSWORD_MAX_AGE_DAYS
      },
      "session_timeout_minutes": $SESSION_TIMEOUT_MINUTES,
      "mfa_enabled": true
    },
    "compliance": {
      "gdpr_compliant": true,
      "pci_compliant": false,
      "sox_compliant": true
    }
  }
}
EOF

    log_success "SECURITY" "Security audit report generated: $output_file"
}

generate_security_recommendations() {
    local security_issues=("$@")

    if [[ ${#security_issues[@]} -eq 0 ]]; then
        echo '["Security posture is excellent - maintain current policies and conduct regular audits"]'
        return
    fi

    local recommendations=()

    for issue in "${security_issues[@]}"; do
        case "$issue" in
            "kubernetes-security")
                recommendations+=("Implement pod security standards and policies")
                recommendations+=("Review container security contexts and remove privileged access")
                recommendations+=("Deploy network policies for micro-segmentation")
                ;;
            "network-security")
                recommendations+=("Review and restrict network access rules")
                recommendations+=("Implement Web Application Firewall (WAF)")
                recommendations+=("Enable DDoS protection")
                ;;
            "application-security")
                recommendations+=("Implement OAuth 2.0 or similar authentication")
                recommendations+=("Add input validation and sanitization")
                recommendations+=("Enable comprehensive API logging and monitoring")
                ;;
            "data-security")
                recommendations+=("Enable encryption for all data at rest and in transit")
                recommendations+=("Implement data classification and handling policies")
                recommendations+=("Regular backup encryption verification")
                ;;
            "access-controls")
                recommendations+=("Strengthen password policies and implement MFA")
                recommendations+=("Review and optimize RBAC configurations")
                recommendations+=("Implement just-in-time access where possible")
                ;;
            "encryption")
                recommendations+=("Update SSL/TLS certificates and configurations")
                recommendations+=("Implement proper key management practices")
                recommendations+=("Use strong encryption algorithms and key lengths")
                ;;
        esac
    done

    printf '%s\n' "${recommendations[@]}" | jq -R . | jq -s .
}

# ============================================================================
# Comprehensive Reporting and Analytics
# ============================================================================

generate_comprehensive_report() {
    log_info "REPORTING" "Generating comprehensive automation report..."

    local report_file="${REPORTS_DIR}/comprehensive-report-$(date +%Y%m%d-%H%M%S).json"
    local execution_end_time="$(date +%s)"
    local execution_duration=$((execution_end_time - EXECUTION_START_TIME))

    # Gather all component states
    local infrastructure_state
    infrastructure_state=$(load_automation_state "infrastructure-discovery")

    local health_state
    health_state=$(load_automation_state "health-checks")

    local scaling_state
    scaling_state=$(load_automation_state "automatic-scaling")

    local security_state
    security_state=$(load_automation_state "security-audit")

    # Calculate overall progress
    local overall_progress
    overall_progress=$(get_automation_progress)

    # Generate comprehensive report
    cat <<EOF > "$report_file"
{
  "comprehensive_report": {
    "metadata": {
      "generated_at": "$(date -Iseconds)",
      "automation_version": "$AUTOMATION_VERSION",
      "build_number": "$BUILD_NUMBER",
      "deployment_id": "$DEPLOYMENT_ID",
      "environment": "$ENVIRONMENT",
      "cloud_provider": "$CLOUD_PROVIDER",
      "region": "$REGION",
      "execution_duration_seconds": $execution_duration,
      "overall_progress": $overall_progress
    },
    "infrastructure": {
      "discovery_status": "$infrastructure_state",
      "total_services": ${#SERVICE_CONFIG[@]},
      "kubernetes_cluster": "$(kubectl cluster-info 2>/dev/null | head -1 | grep -o 'https://[^[:space:]]*' || echo 'not-available')",
      "resource_utilization": {
        "total_cpu_allocated": "$(calculate_total_cpu)m",
        "total_memory_allocated": "$(calculate_total_memory)Mi",
        "estimated_monthly_cost": "$(calculate_cost_impact)"
      }
    },
    "health_monitoring": {
      "status": "$health_state",
      "last_check": "$(date -Iseconds)",
      "availability_sla": "${AVAILABILITY_SLA_PERCENT}%",
      "monitoring_thresholds": {
        "cpu_warning": "${CPU_ALERT_WARNING}%",
        "cpu_critical": "${CPU_ALERT_CRITICAL}%",
        "memory_warning": "${MEMORY_ALERT_WARNING}%",
        "memory_critical": "${MEMORY_ALERT_CRITICAL}%",
        "response_time_alert": "${RESPONSE_TIME_ALERT_MS}ms"
      }
    },
    "scaling_operations": {
      "status": "$scaling_state",
      "auto_scaling_enabled": true,
      "scaling_bounds": {
        "min_replicas": $MIN_REPLICAS,
        "max_replicas": $MAX_REPLICAS,
        "scale_up_threshold": "${SCALE_UP_THRESHOLD}%",
        "scale_down_threshold": "${SCALE_DOWN_THRESHOLD}%"
      }
    },
    "security_posture": {
      "audit_status": "$security_state",
      "last_audit": "$(date -Iseconds)",
      "compliance_frameworks": ["SOX", "GDPR", "ISO27001"],
      "security_policies": {
        "password_min_length": $PASSWORD_MIN_LENGTH,
        "session_timeout_minutes": $SESSION_TIMEOUT_MINUTES,
        "login_attempt_limit": $LOGIN_ATTEMPT_LIMIT,
        "api_rate_limit": $API_RATE_LIMIT_PER_MINUTE
      }
    },
    "service_inventory": $(generate_service_summary),
    "operational_metrics": {
      "uptime_target": "${AVAILABILITY_SLA_PERCENT}%",
      "backup_retention_days": $BACKUP_RETENTION_DAYS,
      "log_retention_days": $LOG_RETENTION_DAYS,
      "maintenance_window": "${DB_MAINTENANCE_WINDOW_START}:00-${DB_MAINTENANCE_WINDOW_END}:00"
    },
    "recommendations": $(generate_overall_recommendations),
    "next_actions": $(generate_next_actions)
  }
}
EOF

    # Also generate a human-readable summary
    generate_human_readable_summary "$report_file"

    save_automation_state "comprehensive-reporting" "completed" "Report: $report_file"
    log_success "REPORTING" "Comprehensive report generated: $report_file"
}

generate_service_summary() {
    cat <<EOF
{
$(for service in "${!SERVICE_CONFIG[@]}"; do
    local config="${SERVICE_CONFIG[$service]}"
    local port=$(echo "$config" | sed 's/.*port:\([0-9]*\).*/\1/')
    local replicas=$(echo "$config" | sed 's/.*replicas:\([0-9]*\).*/\1/')
    local version=$(echo "$config" | sed 's/.*version:\([^,]*\).*/\1/')
    local status=$(get_service_status "$service")

    echo "  \"$service\": {"
    echo "    \"version\": \"$version\","
    echo "    \"port\": $port,"
    echo "    \"replicas\": $replicas,"
    echo "    \"status\": \"$status\""
    echo "  }$([ "$service" != "${!SERVICE_CONFIG[*]: -1:1}" ] && echo ",")"
done)
}
EOF
}

generate_overall_recommendations() {
    cat <<EOF
[
  "Implement automated backup verification procedures",
  "Consider implementing chaos engineering practices",
  "Enhance monitoring with custom business metrics",
  "Implement automated security scanning in CI/CD pipeline",
  "Consider multi-region deployment for disaster recovery",
  "Optimize resource allocation based on usage patterns",
  "Implement comprehensive logging correlation",
  "Regular security policy reviews and updates",
  "Consider implementing service mesh for better observability",
  "Automate certificate renewal and rotation"
]
EOF
}

generate_next_actions() {
    cat <<EOF
[
  "Schedule next security audit in 30 days",
  "Review and update scaling policies based on recent performance data",
  "Implement missing network policies for micro-segmentation",
  "Plan capacity scaling for upcoming traffic growth",
  "Update disaster recovery procedures and test them",
  "Review and optimize database performance",
  "Implement advanced monitoring dashboards",
  "Schedule infrastructure cost optimization review"
]
EOF
}

generate_human_readable_summary() {
    local json_report="$1"
    local summary_file="${REPORTS_DIR}/executive-summary-$(date +%Y%m%d-%H%M%S).txt"

    cat <<EOF > "$summary_file"
================================
DEVOPS AUTOMATION EXECUTIVE SUMMARY
================================

Date: $(date)
Environment: $ENVIRONMENT
Cloud Provider: $CLOUD_PROVIDER
Automation Version: $AUTOMATION_VERSION

INFRASTRUCTURE STATUS:
- Services Deployed: ${#SERVICE_CONFIG[@]}
- Total CPU Allocated: $(calculate_total_cpu)m
- Total Memory Allocated: $(calculate_total_memory)Mi
- Estimated Monthly Cost: $(calculate_cost_impact)

HEALTH STATUS:
- Overall Health Score: $(jq -r '.comprehensive_report.health_monitoring.status // "unknown"' "$json_report" 2>/dev/null || echo "unknown")
- Availability Target: ${AVAILABILITY_SLA_PERCENT}%
- Last Health Check: $(date)

SECURITY STATUS:
- Security Audit Status: $(jq -r '.comprehensive_report.security_posture.audit_status // "unknown"' "$json_report" 2>/dev/null || echo "unknown")
- Password Policy: ${PASSWORD_MIN_LENGTH} char min, ${PASSWORD_MAX_AGE_DAYS} day max age
- Session Timeout: ${SESSION_TIMEOUT_MINUTES} minutes

SCALING CONFIGURATION:
- Min Replicas: $MIN_REPLICAS
- Max Replicas: $MAX_REPLICAS
- Scale Up Threshold: ${SCALE_UP_THRESHOLD}%
- Scale Down Threshold: ${SCALE_DOWN_THRESHOLD}%

KEY RECOMMENDATIONS:
1. Implement automated backup verification
2. Enhance security monitoring and alerting
3. Optimize resource allocation based on usage patterns
4. Consider multi-region deployment strategy
5. Implement comprehensive disaster recovery testing

NEXT REVIEW: $(date -d '+30 days')

================================
Generated by DevOps Automation v${AUTOMATION_VERSION}
Deployment ID: $DEPLOYMENT_ID
================================
EOF

    log_success "REPORTING" "Executive summary generated: $summary_file"
}

# ============================================================================
# Main Orchestration and Workflow
# ============================================================================

cleanup_automation_environment() {
    log_info "CLEANUP" "Cleaning up automation environment..."

    # Clean up temporary files
    if [[ -d "$TEMP_DIR" ]]; then
        find "$TEMP_DIR" -type f -mtime +1 -delete 2>/dev/null || true
        log_info "CLEANUP" "Cleaned up temporary files"
    fi

    # Rotate log files
    if [[ -d "$LOG_DIR" ]]; then
        find "$LOG_DIR" -name "*.log" -mtime +$LOG_RETENTION_DAYS -delete 2>/dev/null || true
        log_info "CLEANUP" "Rotated old log files"
    fi

    # Compress old reports
    if [[ -d "$REPORTS_DIR" ]]; then
        find "$REPORTS_DIR" -name "*.json" -mtime +7 -exec gzip {} \; 2>/dev/null || true
        log_info "CLEANUP" "Compressed old reports"
    fi

    # Clean up old state files
    if [[ -f "${STATE_DIR}/automation.state" ]]; then
        # Keep only the last 100 entries
        tail -100 "${STATE_DIR}/automation.state" > "${STATE_DIR}/automation.state.tmp" &&
        mv "${STATE_DIR}/automation.state.tmp" "${STATE_DIR}/automation.state"
        log_info "CLEANUP" "Cleaned up state file"
    fi

    log_success "CLEANUP" "Environment cleanup completed"
}

show_automation_status() {
    echo ""
    echo "=== DevOps Automation Status ==="
    echo "Version: $AUTOMATION_VERSION"
    echo "Build: $BUILD_NUMBER"
    echo "Environment: $ENVIRONMENT"
    echo "Cloud Provider: $CLOUD_PROVIDER"
    echo "Deployment ID: $DEPLOYMENT_ID"
    echo ""

    echo "Services Configuration:"
    for service in "${!SERVICE_CONFIG[@]}"; do
        local config="${SERVICE_CONFIG[$service]}"
        local port=$(echo "$config" | sed 's/.*port:\([0-9]*\).*/\1/')
        local replicas=$(echo "$config" | sed 's/.*replicas:\([0-9]*\).*/\1/')
        local version=$(echo "$config" | sed 's/.*version:\([^,]*\).*/\1/')

        printf "  %-20s | Port: %-5s | Replicas: %-2s | Version: %s\n" \
            "$service" "$port" "$replicas" "$version"
    done

    echo ""
    echo "Progress: $(get_automation_progress)%"
    echo "Execution Time: $(($(date +%s) - EXECUTION_START_TIME)) seconds"
    echo "================================"
    echo ""
}

main_automation_workflow() {
    setup_colors

    log_info "MAIN" "Starting comprehensive DevOps automation workflow..."
    log_info "MAIN" "Version: $AUTOMATION_VERSION, Build: $BUILD_NUMBER"
    log_info "MAIN" "Environment: $ENVIRONMENT, Cloud: $CLOUD_PROVIDER"

    # Step 1: Infrastructure Discovery
    discover_infrastructure

    # Step 2: Health Checks
    perform_comprehensive_health_checks

    # Step 3: Automatic Scaling
    perform_automatic_scaling

    # Step 4: Security Audit
    perform_security_audit

    # Step 5: Generate Reports
    generate_comprehensive_report

    # Step 6: Cleanup
    cleanup_automation_environment

    # Show final status
    show_automation_status

    local final_progress
    final_progress=$(get_automation_progress)

    if [[ "$final_progress" -eq 100 ]]; then
        log_success "MAIN" "DevOps automation workflow completed successfully!"
        log_info "MAIN" "All systems operational and optimized"
        return 0
    else
        log_warn "MAIN" "DevOps automation workflow completed with some issues"
        log_info "MAIN" "Progress: ${final_progress}% - Check reports for details"
        return 1
    fi
}

# ============================================================================
# Script Execution and Command Line Interface
# ============================================================================

show_help() {
    cat <<EOF
DevOps Automation Script v${AUTOMATION_VERSION}

USAGE:
    $0 [COMMAND] [OPTIONS]

COMMANDS:
    main, full       Run complete automation workflow
    discover         Infrastructure discovery only
    health           Health checks only
    scale            Automatic scaling only
    security         Security audit only
    report           Generate comprehensive report only
    status           Show current automation status
    cleanup          Clean up environment only
    help             Show this help message

EXAMPLES:
    $0                          # Run full automation workflow
    $0 health                   # Run only health checks
    $0 security                 # Run only security audit
    $0 scale                    # Run only scaling operations
    $0 status                   # Show current status

ENVIRONMENT VARIABLES:
    ENVIRONMENT                 deployment environment (default: production)
    CLOUD_PROVIDER             cloud provider (aws|gcp|azure, default: aws)
    REGION                     cloud region (default: us-west-2)
    PROJECT_NAME               project name (default: enterprise-platform)
    DEBUG                      enable debug logging (true|false, default: false)

FILES AND DIRECTORIES:
    ${LOG_DIR}/                Automation logs
    ${STATE_DIR}/              State and progress tracking
    ${REPORTS_DIR}/            Generated reports
    ${BACKUP_DIR}/             Backup files

For more information, visit: https://docs.example.com/devops-automation
EOF
}

# Main execution logic
case "${1:-main}" in
    "main"|"full"|"")
        main_automation_workflow
        ;;
    "discover")
        setup_colors
        discover_infrastructure
        ;;
    "health")
        setup_colors
        perform_comprehensive_health_checks
        ;;
    "scale")
        setup_colors
        perform_automatic_scaling
        ;;
    "security")
        setup_colors
        perform_security_audit
        ;;
    "report")
        setup_colors
        generate_comprehensive_report
        ;;
    "status")
        setup_colors
        show_automation_status
        ;;
    "cleanup")
        setup_colors
        cleanup_automation_environment
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "Error: Unknown command '$1'"
        echo "Run '$0 help' for usage information."
        exit 1
        ;;
esac