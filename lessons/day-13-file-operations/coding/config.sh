#!/bin/bash

# Configuration Management Script
# Central configuration file for multi-cloud infrastructure deployment
# Practice file operations: sourcing files, navigating between configurations

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Project configuration
export PROJECT_NAME="multi-cloud-infra"
export ENVIRONMENT="${ENVIRONMENT:-production}"
export DEPLOYMENT_DATE="$(date +%Y%m%d)"
export DEPLOYMENT_TIME="$(date +%H%M%S)"

# Directory structure
export SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export BASE_DIR="${SCRIPT_DIR%/*}"
export LOG_DIR="${BASE_DIR}/logs"
export BACKUP_DIR="${BASE_DIR}/backups"
export TEMP_DIR="${BASE_DIR}/tmp"
export CONFIG_DIR="${BASE_DIR}/config"

# Cloud provider configuration
export CLOUD_PROVIDER="${CLOUD_PROVIDER:-aws}"  # aws, gcp, azure

# Common network configuration
export VPC_CIDR="10.0.0.0/16"
export SUBNET_CIDRS=(
    "10.0.1.0/24"
    "10.0.2.0/24"
    "10.0.3.0/24"
    "10.0.4.0/24"
)

# DNS configuration
export DNS_ZONE="example.com"
export DNS_SUBDOMAIN="api"

# SSL/TLS configuration
export SSL_EMAIL="admin@example.com"
export SSL_ORGANIZATION="Example Organization"
export SSL_COUNTRY="US"
export SSL_STATE="California"
export SSL_CITY="San Francisco"

# =============================================================================
# AWS Configuration
# =============================================================================

if [[ "$CLOUD_PROVIDER" == "aws" ]]; then
    # AWS specific configuration
    export AWS_REGION="${AWS_REGION:-us-west-2}"
    export AWS_PROFILE="${AWS_PROFILE:-default}"

    # AWS availability zones
    export AVAILABILITY_ZONES=(
        "${AWS_REGION}a"
        "${AWS_REGION}b"
        "${AWS_REGION}c"
    )

    # EKS configuration
    export EKS_VERSION="1.28"
    export EKS_NODE_TYPE="t3.medium"
    export EKS_MIN_NODES="2"
    export EKS_MAX_NODES="10"
    export EKS_DESIRED_NODES="3"

    # RDS configuration
    export RDS_ENGINE="postgres"
    export RDS_ENGINE_VERSION="15.4"
    export RDS_INSTANCE_CLASS="db.t3.micro"
    export RDS_ALLOCATED_STORAGE="20"
    export RDS_MAX_ALLOCATED_STORAGE="100"
    export RDS_STORAGE_TYPE="gp2"
    export RDS_DATABASE_NAME="appdb"
    export RDS_USERNAME="dbadmin"
    export RDS_PASSWORD="SecurePassword123!"
    export RDS_BACKUP_RETENTION="7"
    export RDS_MAINTENANCE_WINDOW="sun:03:00-sun:04:00"
    export RDS_BACKUP_WINDOW="02:00-03:00"

    # ElastiCache configuration
    export REDIS_NODE_TYPE="cache.t3.micro"
    export REDIS_NUM_NODES="2"
    export REDIS_VERSION="7.0"

    # S3 configuration
    export S3_BUCKET_PREFIX="${PROJECT_NAME}-${ENVIRONMENT}"
    export S3_VERSIONING="Enabled"
    export S3_ENCRYPTION="AES256"

    # VPC endpoints
    export VPC_ENDPOINTS=(
        "s3"
        "ec2"
        "ecr.dkr"
        "logs"
        "monitoring"
    )

    # SSH key configuration
    export SSH_KEY_NAME="${PROJECT_NAME}-${ENVIRONMENT}-key"

fi

# =============================================================================
# Google Cloud Platform Configuration
# =============================================================================

if [[ "$CLOUD_PROVIDER" == "gcp" ]]; then
    # GCP specific configuration
    export GCP_PROJECT_ID="${GCP_PROJECT_ID:-my-gcp-project}"
    export GCP_REGION="${GCP_REGION:-us-west1}"
    export GCP_ZONE="${GCP_ZONE:-us-west1-a}"

    # GCP regions for multi-region deployment
    export GCP_REGIONS=(
        "us-west1"
        "us-central1"
        "us-east1"
    )

    # GKE configuration
    export GKE_VERSION="1.28"
    export GKE_MACHINE_TYPE="e2-medium"
    export GKE_NUM_NODES="3"
    export GKE_MIN_NODES="1"
    export GKE_MAX_NODES="10"
    export GKE_DISK_SIZE="50"
    export GKE_DISK_TYPE="pd-standard"
    export GKE_IMAGE_TYPE="COS_CONTAINERD"

    # Cloud SQL configuration
    export CLOUD_SQL_VERSION="POSTGRES_15"
    export CLOUD_SQL_TIER="db-f1-micro"
    export CLOUD_SQL_STORAGE_SIZE="20"
    export CLOUD_SQL_STORAGE_TYPE="PD_SSD"
    export CLOUD_SQL_BACKUP_TIME="03:00"
    export CLOUD_SQL_DATABASE_FLAGS="max_connections=200"

    # Cloud Storage configuration
    export GCS_BUCKET_PREFIX="${PROJECT_NAME}-${ENVIRONMENT}"
    export GCS_STORAGE_CLASS="STANDARD"
    export GCS_LOCATION="US"

    # Cloud Memorystore (Redis) configuration
    export MEMORYSTORE_TIER="STANDARD_HA"
    export MEMORYSTORE_SIZE="1"
    export MEMORYSTORE_VERSION="REDIS_7_0"

    # Compute Engine configuration
    export GCE_MACHINE_TYPE="e2-medium"
    export GCE_BOOT_DISK_SIZE="20"
    export GCE_BOOT_DISK_TYPE="pd-standard"
    export GCE_IMAGE_FAMILY="ubuntu-2004-lts"
    export GCE_IMAGE_PROJECT="ubuntu-os-cloud"

fi

# =============================================================================
# Microsoft Azure Configuration
# =============================================================================

if [[ "$CLOUD_PROVIDER" == "azure" ]]; then
    # Azure specific configuration
    export AZURE_SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID:-your-subscription-id}"
    export AZURE_LOCATION="${AZURE_LOCATION:-West US 2}"
    export AZURE_RESOURCE_GROUP="${PROJECT_NAME}-rg"

    # Azure regions for multi-region deployment
    export AZURE_LOCATIONS=(
        "West US 2"
        "East US 2"
        "Central US"
    )

    # AKS configuration
    export AKS_VERSION="1.28"
    export AKS_NODE_SIZE="Standard_D2s_v3"
    export AKS_NODE_COUNT="3"
    export AKS_MIN_NODES="1"
    export AKS_MAX_NODES="10"
    export AKS_OS_DISK_SIZE="50"
    export AKS_OS_DISK_TYPE="Managed"
    export AKS_VM_SET_TYPE="VirtualMachineScaleSets"

    # Azure Database for PostgreSQL configuration
    export POSTGRES_SKU="B_Gen5_1"
    export POSTGRES_VERSION="15"
    export POSTGRES_STORAGE_SIZE="51200"  # in MB
    export POSTGRES_USERNAME="dbadmin"
    export POSTGRES_PASSWORD="SecurePassword123!"
    export POSTGRES_BACKUP_RETENTION="7"
    export POSTGRES_GEO_REDUNDANT_BACKUP="Enabled"

    # Azure Database specific
    export AZURE_DB_SKU="GP_Gen5_2"
    export AZURE_DB_STORAGE_SIZE="51200"
    export AZURE_DB_BACKUP_RETENTION="7"

    # Azure Storage configuration
    export STORAGE_ACCOUNT_NAME="${PROJECT_NAME}${ENVIRONMENT}storage"
    export STORAGE_SKU="Standard_LRS"
    export STORAGE_KIND="StorageV2"
    export STORAGE_TIER="Hot"

    # Azure Cache for Redis configuration
    export REDIS_SKU="Standard"
    export REDIS_FAMILY="C"
    export REDIS_CAPACITY="1"
    export REDIS_VERSION="6"

    # Virtual Machine configuration
    export VM_SIZE="Standard_D2s_v3"
    export VM_OS_DISK_SIZE="50"
    export VM_OS_DISK_TYPE="Premium_LRS"
    export VM_IMAGE_PUBLISHER="Canonical"
    export VM_IMAGE_OFFER="0001-com-ubuntu-server-focal"
    export VM_IMAGE_SKU="20_04-lts-gen2"

fi

# =============================================================================
# Kubernetes Configuration
# =============================================================================

export K8S_NAMESPACE="${PROJECT_NAME}"
export K8S_VERSION="1.28"

# Application configuration
export MICROSERVICES=(
    "api-gateway"
    "user-service"
    "auth-service"
    "payment-service"
    "order-service"
    "notification-service"
    "inventory-service"
    "analytics-service"
)

# Container registry configuration
export CONTAINER_REGISTRY_URL="registry.example.com"
export CONTAINER_REGISTRY_NAMESPACE="${PROJECT_NAME}"
export CONTAINER_IMAGE_TAG="${DEPLOYMENT_DATE}-${DEPLOYMENT_TIME}"

# Ingress controller configuration
export INGRESS_CLASS="nginx"
export INGRESS_CONTROLLER_VERSION="1.8.2"

# Cert-manager configuration
export CERT_MANAGER_VERSION="1.13.1"
export CERT_MANAGER_EMAIL="$SSL_EMAIL"
export LETSENCRYPT_SERVER="https://acme-v02.api.letsencrypt.org/directory"

# Prometheus and Grafana configuration
export PROMETHEUS_VERSION="2.47.0"
export GRAFANA_VERSION="10.1.0"
export ALERTMANAGER_VERSION="0.26.0"

# =============================================================================
# Application Configuration
# =============================================================================

# Database configuration
export DATABASE_HOST="localhost"
export DATABASE_PORT="5432"
export DATABASE_NAME="$RDS_DATABASE_NAME"
export DATABASE_USERNAME="$RDS_USERNAME"
export DATABASE_PASSWORD="$RDS_PASSWORD"
export DATABASE_SSL_MODE="require"
export DATABASE_MAX_CONNECTIONS="100"
export DATABASE_CONNECTION_TIMEOUT="30"

# Redis configuration
export REDIS_HOST="localhost"
export REDIS_PORT="6379"
export REDIS_PASSWORD=""
export REDIS_MAX_CONNECTIONS="10"
export REDIS_TIMEOUT="5"

# Message queue configuration (RabbitMQ/SQS)
export MQ_HOST="localhost"
export MQ_PORT="5672"
export MQ_USERNAME="admin"
export MQ_PASSWORD="SecurePassword123!"
export MQ_VIRTUAL_HOST="/"

# Monitoring configuration
export METRICS_PORT="9090"
export HEALTH_CHECK_ENDPOINT="/health"
export METRICS_ENDPOINT="/metrics"
export LOG_LEVEL="INFO"
export LOG_FORMAT="json"

# Security configuration
export JWT_SECRET="super-secret-jwt-key-change-in-production"
export JWT_EXPIRY="3600"  # 1 hour
export API_RATE_LIMIT="1000"  # requests per minute
export CORS_ORIGINS="https://${DNS_SUBDOMAIN}.${DNS_ZONE}"

# Feature flags
export ENABLE_DEBUG="false"
export ENABLE_PROFILING="false"
export ENABLE_TRACING="true"
export ENABLE_METRICS="true"

# =============================================================================
# Tool Requirements
# =============================================================================

export REQUIRED_TOOLS=(
    "kubectl"
    "helm"
    "docker"
    "git"
    "jq"
    "curl"
    "wget"
    "terraform"
)

# Version requirements
export MIN_KUBECTL_VERSION="1.25"
export MIN_HELM_VERSION="3.10"
export MIN_DOCKER_VERSION="20.10"
export MIN_TERRAFORM_VERSION="1.5"

# =============================================================================
# Backup and Maintenance Configuration
# =============================================================================

export BACKUP_SCHEDULE="0 2 * * *"  # Daily at 2 AM
export BACKUP_RETENTION_DAYS="30"
export LOG_RETENTION_DAYS="7"
export MAINTENANCE_WINDOW="sun:03:00-sun:05:00"

# =============================================================================
# Load Testing Configuration
# =============================================================================

export LOAD_TEST_DURATION="300"  # 5 minutes
export LOAD_TEST_VUS="50"        # Virtual users
export LOAD_TEST_RPS="100"       # Requests per second
export LOAD_TEST_ENDPOINT="https://${DNS_SUBDOMAIN}.${DNS_ZONE}/api/health"

# =============================================================================
# Notification Configuration
# =============================================================================

export SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
export EMAIL_SMTP_SERVER="smtp.gmail.com"
export EMAIL_SMTP_PORT="587"
export EMAIL_USERNAME="${EMAIL_USERNAME:-}"
export EMAIL_PASSWORD="${EMAIL_PASSWORD:-}"
export EMAIL_FROM="noreply@${DNS_ZONE}"
export EMAIL_TO="admin@${DNS_ZONE}"

# =============================================================================
# Environment-specific Overrides
# =============================================================================

case "$ENVIRONMENT" in
    "development")
        export EKS_MIN_NODES="1"
        export EKS_DESIRED_NODES="1"
        export RDS_INSTANCE_CLASS="db.t3.micro"
        export REDIS_NODE_TYPE="cache.t3.micro"
        export LOG_LEVEL="DEBUG"
        export ENABLE_DEBUG="true"
        ;;
    "staging")
        export EKS_MIN_NODES="2"
        export EKS_DESIRED_NODES="2"
        export RDS_INSTANCE_CLASS="db.t3.small"
        export REDIS_NODE_TYPE="cache.t3.small"
        export LOG_LEVEL="INFO"
        ;;
    "production")
        export EKS_MIN_NODES="3"
        export EKS_DESIRED_NODES="5"
        export RDS_INSTANCE_CLASS="db.t3.medium"
        export REDIS_NODE_TYPE="cache.t3.medium"
        export LOG_LEVEL="WARN"
        export ENABLE_PROFILING="true"
        ;;
esac

# =============================================================================
# Validation Functions
# =============================================================================

validate_config() {
    local validation_errors=()

    # Validate required environment variables
    local required_vars=(
        "PROJECT_NAME"
        "ENVIRONMENT"
        "CLOUD_PROVIDER"
        "VPC_CIDR"
    )

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            validation_errors+=("Missing required variable: $var")
        fi
    done

    # Validate cloud provider specific variables
    case "$CLOUD_PROVIDER" in
        "aws")
            if [[ -z "${AWS_REGION:-}" ]]; then
                validation_errors+=("Missing AWS_REGION for AWS deployment")
            fi
            ;;
        "gcp")
            if [[ -z "${GCP_PROJECT_ID:-}" ]]; then
                validation_errors+=("Missing GCP_PROJECT_ID for GCP deployment")
            fi
            ;;
        "azure")
            if [[ -z "${AZURE_SUBSCRIPTION_ID:-}" ]]; then
                validation_errors+=("Missing AZURE_SUBSCRIPTION_ID for Azure deployment")
            fi
            ;;
        *)
            validation_errors+=("Invalid CLOUD_PROVIDER: $CLOUD_PROVIDER (must be aws, gcp, or azure)")
            ;;
    esac

    # Validate network configuration
    if [[ ! "$VPC_CIDR" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}/[0-9]{1,2}$ ]]; then
        validation_errors+=("Invalid VPC_CIDR format: $VPC_CIDR")
    fi

    # Return validation results
    if [[ ${#validation_errors[@]} -eq 0 ]]; then
        return 0
    else
        echo "Configuration validation failed:" >&2
        for error in "${validation_errors[@]}"; do
            echo "  - $error" >&2
        done
        return 1
    fi
}

# =============================================================================
# Helper Functions
# =============================================================================

print_config_summary() {
    echo "=== Configuration Summary ==="
    echo "Project: $PROJECT_NAME"
    echo "Environment: $ENVIRONMENT"
    echo "Cloud Provider: $CLOUD_PROVIDER"
    echo "Deployment Date: $DEPLOYMENT_DATE"
    echo "VPC CIDR: $VPC_CIDR"

    case "$CLOUD_PROVIDER" in
        "aws")
            echo "AWS Region: $AWS_REGION"
            echo "EKS Version: $EKS_VERSION"
            echo "RDS Engine: $RDS_ENGINE $RDS_ENGINE_VERSION"
            ;;
        "gcp")
            echo "GCP Project: $GCP_PROJECT_ID"
            echo "GCP Region: $GCP_REGION"
            echo "GKE Version: $GKE_VERSION"
            ;;
        "azure")
            echo "Azure Location: $AZURE_LOCATION"
            echo "Azure Subscription: $AZURE_SUBSCRIPTION_ID"
            echo "AKS Version: $AKS_VERSION"
            ;;
    esac

    echo "Microservices: ${#MICROSERVICES[@]} services"
    echo "Kubernetes Namespace: $K8S_NAMESPACE"
    echo "============================="
}

export_config_to_file() {
    local output_file="${1:-${CONFIG_DIR}/current-config.env}"

    # Create config directory if it doesn't exist
    mkdir -p "$CONFIG_DIR"

    # Export all configuration to file
    (
        echo "# Generated configuration file"
        echo "# Date: $(date)"
        echo "# Environment: $ENVIRONMENT"
        echo "# Cloud Provider: $CLOUD_PROVIDER"
        echo ""

        # Export all variables that start with common prefixes
        env | grep -E "^(PROJECT|ENVIRONMENT|CLOUD|AWS|GCP|AZURE|K8S|DATABASE|REDIS|VPC|SUBNET)" | sort

    ) > "$output_file"

    echo "Configuration exported to: $output_file"
}

# =============================================================================
# Initialization
# =============================================================================

# Validate configuration when sourced
if ! validate_config; then
    echo "Configuration validation failed. Please fix the errors above." >&2
    exit 1
fi

# Print configuration summary if running directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-summary}" in
        "summary")
            print_config_summary
            ;;
        "export")
            export_config_to_file "${2:-}"
            ;;
        "validate")
            if validate_config; then
                echo "Configuration validation passed!"
            else
                exit 1
            fi
            ;;
        *)
            echo "Usage: $0 [summary|export|validate]"
            exit 1
            ;;
    esac
fi

# Export logging functions for use in other scripts
log_info() {
    echo -e "\033[0;32m[INFO]\033[0m $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_warn() {
    echo -e "\033[1;33m[WARN]\033[0m $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

# Make functions available to other scripts
export -f log_info log_warn log_error log_success validate_config print_config_summary export_config_to_file