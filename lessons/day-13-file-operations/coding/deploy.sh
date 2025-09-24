#!/bin/bash

# Multi-Cloud Infrastructure Deployment Script
# Part of a multi-file project demonstrating file operations
# Practice: :e, :split, :vsplit, Ctrl-w navigation, :bn, :bp, :ls, etc.

set -euo pipefail

# Source configuration and setup scripts
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/config.sh"
source "${SCRIPT_DIR}/setup.sh"

# Deployment state management
DEPLOYMENT_STATE_FILE="${SCRIPT_DIR}/deployment.state"
DEPLOYMENT_LOG_FILE="${LOG_DIR}/deployment-$(date +%Y%m%d-%H%M%S).log"
ERROR_LOG_FILE="${LOG_DIR}/deployment-errors.log"

# Color output functions
setup_colors() {
    if [[ -t 1 ]]; then
        export RED='\033[0;31m'
        export GREEN='\033[0;32m'
        export YELLOW='\033[1;33m'
        export BLUE='\033[0;34m'
        export PURPLE='\033[0;35m'
        export CYAN='\033[0;36m'
        export WHITE='\033[1;37m'
        export NC='\033[0m'
    else
        export RED='' GREEN='' YELLOW='' BLUE='' PURPLE='' CYAN='' WHITE='' NC=''
    fi
}

# Logging functions
log_info() {
    local message="$1"
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - ${message}" | tee -a "${DEPLOYMENT_LOG_FILE}"
}

log_warn() {
    local message="$1"
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - ${message}" | tee -a "${DEPLOYMENT_LOG_FILE}"
}

log_error() {
    local message="$1"
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - ${message}" | tee -a "${DEPLOYMENT_LOG_FILE}" "${ERROR_LOG_FILE}"
}

log_success() {
    local message="$1"
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - ${message}" | tee -a "${DEPLOYMENT_LOG_FILE}"
}

# Save deployment state
save_deployment_state() {
    local component="$1"
    local status="$2"
    local timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    echo "${component}:${status}:${timestamp}" >> "${DEPLOYMENT_STATE_FILE}"
    log_info "Saved deployment state: ${component} = ${status}"
}

# Load deployment state
load_deployment_state() {
    if [[ -f "${DEPLOYMENT_STATE_FILE}" ]]; then
        log_info "Loading deployment state from ${DEPLOYMENT_STATE_FILE}"
        while IFS=':' read -r component status timestamp; do
            echo "  ${component}: ${status} (${timestamp})"
        done < "${DEPLOYMENT_STATE_FILE}"
    else
        log_info "No previous deployment state found"
    fi
}

# Validate prerequisites
validate_prerequisites() {
    log_info "Validating deployment prerequisites..."

    local missing_tools=()

    # Check required tools
    for tool in "${REQUIRED_TOOLS[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_error "Please install missing tools and retry deployment"
        exit 1
    fi

    # Check cloud provider credentials
    case "$CLOUD_PROVIDER" in
        "aws")
            if ! aws sts get-caller-identity &>/dev/null; then
                log_error "AWS credentials not configured or expired"
                exit 1
            fi
            ;;
        "gcp")
            if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 &>/dev/null; then
                log_error "GCP credentials not configured"
                exit 1
            fi
            ;;
        "azure")
            if ! az account show &>/dev/null; then
                log_error "Azure credentials not configured"
                exit 1
            fi
            ;;
    esac

    log_success "Prerequisites validation completed"
}

# Deploy infrastructure
deploy_infrastructure() {
    log_info "Starting infrastructure deployment to ${CLOUD_PROVIDER}"

    case "$CLOUD_PROVIDER" in
        "aws")
            deploy_aws_infrastructure
            ;;
        "gcp")
            deploy_gcp_infrastructure
            ;;
        "azure")
            deploy_azure_infrastructure
            ;;
        *)
            log_error "Unsupported cloud provider: $CLOUD_PROVIDER"
            exit 1
            ;;
    esac
}

# AWS deployment
deploy_aws_infrastructure() {
    log_info "Deploying AWS infrastructure..."

    # Create VPC
    log_info "Creating VPC..."
    aws ec2 create-vpc \
        --cidr-block "$VPC_CIDR" \
        --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=${PROJECT_NAME}-vpc},{Key=Environment,Value=${ENVIRONMENT}}]" \
        --query 'Vpc.VpcId' \
        --output text > "${SCRIPT_DIR}/vpc-id.txt"

    local vpc_id=$(cat "${SCRIPT_DIR}/vpc-id.txt")
    save_deployment_state "aws-vpc" "created"
    log_success "VPC created: $vpc_id"

    # Create subnets
    log_info "Creating subnets..."
    for i in "${!SUBNET_CIDRS[@]}"; do
        local subnet_cidr="${SUBNET_CIDRS[$i]}"
        local az="${AVAILABILITY_ZONES[$i]}"

        aws ec2 create-subnet \
            --vpc-id "$vpc_id" \
            --cidr-block "$subnet_cidr" \
            --availability-zone "$az" \
            --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-subnet-${i}},{Key=Environment,Value=${ENVIRONMENT}}]" \
            --query 'Subnet.SubnetId' \
            --output text > "${SCRIPT_DIR}/subnet-${i}-id.txt"

        save_deployment_state "aws-subnet-${i}" "created"
        log_success "Subnet created in $az: $(cat ${SCRIPT_DIR}/subnet-${i}-id.txt)"
    done

    # Create security groups
    create_aws_security_groups "$vpc_id"

    # Deploy EKS cluster
    deploy_aws_eks_cluster "$vpc_id"

    # Deploy RDS instances
    deploy_aws_rds_instances "$vpc_id"
}

# Create AWS security groups
create_aws_security_groups() {
    local vpc_id="$1"

    log_info "Creating security groups..."

    # Web security group
    aws ec2 create-security-group \
        --group-name "${PROJECT_NAME}-web-sg" \
        --description "Security group for web servers" \
        --vpc-id "$vpc_id" \
        --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=${PROJECT_NAME}-web-sg}]" \
        --query 'GroupId' \
        --output text > "${SCRIPT_DIR}/web-sg-id.txt"

    local web_sg_id=$(cat "${SCRIPT_DIR}/web-sg-id.txt")

    # Add rules to web security group
    aws ec2 authorize-security-group-ingress \
        --group-id "$web_sg_id" \
        --protocol tcp \
        --port 80 \
        --cidr 0.0.0.0/0

    aws ec2 authorize-security-group-ingress \
        --group-id "$web_sg_id" \
        --protocol tcp \
        --port 443 \
        --cidr 0.0.0.0/0

    save_deployment_state "aws-web-sg" "created"
    log_success "Web security group created: $web_sg_id"

    # Database security group
    aws ec2 create-security-group \
        --group-name "${PROJECT_NAME}-db-sg" \
        --description "Security group for database servers" \
        --vpc-id "$vpc_id" \
        --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=${PROJECT_NAME}-db-sg}]" \
        --query 'GroupId' \
        --output text > "${SCRIPT_DIR}/db-sg-id.txt"

    local db_sg_id=$(cat "${SCRIPT_DIR}/db-sg-id.txt")

    # Add rules to database security group
    aws ec2 authorize-security-group-ingress \
        --group-id "$db_sg_id" \
        --protocol tcp \
        --port 5432 \
        --source-group "$web_sg_id"

    save_deployment_state "aws-db-sg" "created"
    log_success "Database security group created: $db_sg_id"
}

# Deploy AWS EKS cluster
deploy_aws_eks_cluster() {
    local vpc_id="$1"

    log_info "Deploying EKS cluster..."

    # Create EKS cluster
    eksctl create cluster \
        --name "${PROJECT_NAME}-cluster" \
        --region "$AWS_REGION" \
        --version "$EKS_VERSION" \
        --vpc-id "$vpc_id" \
        --with-oidc \
        --ssh-access \
        --ssh-public-key "$SSH_KEY_NAME" \
        --managed \
        --node-type "$EKS_NODE_TYPE" \
        --nodes "$EKS_MIN_NODES" \
        --nodes-min "$EKS_MIN_NODES" \
        --nodes-max "$EKS_MAX_NODES" \
        --tags "Environment=${ENVIRONMENT},Project=${PROJECT_NAME}"

    save_deployment_state "aws-eks-cluster" "created"
    log_success "EKS cluster deployed successfully"

    # Update kubeconfig
    aws eks update-kubeconfig --region "$AWS_REGION" --name "${PROJECT_NAME}-cluster"
    log_success "Kubeconfig updated for EKS cluster"
}

# Deploy AWS RDS instances
deploy_aws_rds_instances() {
    local vpc_id="$1"

    log_info "Deploying RDS instances..."

    # Create DB subnet group
    aws rds create-db-subnet-group \
        --db-subnet-group-name "${PROJECT_NAME}-db-subnet-group" \
        --db-subnet-group-description "DB subnet group for ${PROJECT_NAME}" \
        --subnet-ids $(ls "${SCRIPT_DIR}"/subnet-*-id.txt | xargs cat | tr '\n' ' ') \
        --tags "Key=Environment,Value=${ENVIRONMENT}" "Key=Project,Value=${PROJECT_NAME}"

    save_deployment_state "aws-db-subnet-group" "created"
    log_success "DB subnet group created"

    # Create RDS instance
    aws rds create-db-instance \
        --db-instance-identifier "${PROJECT_NAME}-primary-db" \
        --db-instance-class "$RDS_INSTANCE_CLASS" \
        --engine "$RDS_ENGINE" \
        --engine-version "$RDS_ENGINE_VERSION" \
        --allocated-storage "$RDS_ALLOCATED_STORAGE" \
        --storage-type "$RDS_STORAGE_TYPE" \
        --storage-encrypted \
        --db-name "$RDS_DATABASE_NAME" \
        --master-username "$RDS_USERNAME" \
        --master-user-password "$RDS_PASSWORD" \
        --db-subnet-group-name "${PROJECT_NAME}-db-subnet-group" \
        --vpc-security-group-ids $(cat "${SCRIPT_DIR}/db-sg-id.txt") \
        --backup-retention-period "$RDS_BACKUP_RETENTION" \
        --multi-az \
        --tags "Key=Environment,Value=${ENVIRONMENT}" "Key=Project,Value=${PROJECT_NAME}"

    save_deployment_state "aws-rds-primary" "created"
    log_success "Primary RDS instance deployment initiated"
}

# GCP deployment
deploy_gcp_infrastructure() {
    log_info "Deploying GCP infrastructure..."

    # Set project
    gcloud config set project "$GCP_PROJECT_ID"

    # Create VPC
    log_info "Creating VPC network..."
    gcloud compute networks create "${PROJECT_NAME}-vpc" \
        --subnet-mode custom \
        --bgp-routing-mode global

    save_deployment_state "gcp-vpc" "created"
    log_success "VPC network created"

    # Create subnets
    log_info "Creating subnets..."
    for i in "${!SUBNET_CIDRS[@]}"; do
        local subnet_cidr="${SUBNET_CIDRS[$i]}"
        local region="${GCP_REGIONS[$i]}"

        gcloud compute networks subnets create "${PROJECT_NAME}-subnet-${i}" \
            --network="${PROJECT_NAME}-vpc" \
            --range="$subnet_cidr" \
            --region="$region"

        save_deployment_state "gcp-subnet-${i}" "created"
        log_success "Subnet created in $region: ${PROJECT_NAME}-subnet-${i}"
    done

    # Deploy GKE cluster
    deploy_gcp_gke_cluster

    # Deploy Cloud SQL instances
    deploy_gcp_cloud_sql
}

# Deploy GCP GKE cluster
deploy_gcp_gke_cluster() {
    log_info "Deploying GKE cluster..."

    gcloud container clusters create "${PROJECT_NAME}-cluster" \
        --zone "$GCP_ZONE" \
        --network "${PROJECT_NAME}-vpc" \
        --subnetwork "${PROJECT_NAME}-subnet-0" \
        --cluster-version "$GKE_VERSION" \
        --machine-type "$GKE_MACHINE_TYPE" \
        --num-nodes "$GKE_NUM_NODES" \
        --enable-autoscaling \
        --min-nodes "$GKE_MIN_NODES" \
        --max-nodes "$GKE_MAX_NODES" \
        --enable-autorepair \
        --enable-autoupgrade \
        --labels "environment=${ENVIRONMENT},project=${PROJECT_NAME}"

    save_deployment_state "gcp-gke-cluster" "created"
    log_success "GKE cluster deployed successfully"

    # Get credentials
    gcloud container clusters get-credentials "${PROJECT_NAME}-cluster" --zone "$GCP_ZONE"
    log_success "Kubeconfig updated for GKE cluster"
}

# Deploy GCP Cloud SQL
deploy_gcp_cloud_sql() {
    log_info "Deploying Cloud SQL instances..."

    gcloud sql instances create "${PROJECT_NAME}-primary-db" \
        --database-version="$CLOUD_SQL_VERSION" \
        --tier="$CLOUD_SQL_TIER" \
        --storage-size="$CLOUD_SQL_STORAGE_SIZE" \
        --storage-type="$CLOUD_SQL_STORAGE_TYPE" \
        --region="$GCP_REGION" \
        --backup-start-time="$CLOUD_SQL_BACKUP_TIME" \
        --enable-bin-log \
        --labels="environment=${ENVIRONMENT},project=${PROJECT_NAME}"

    save_deployment_state "gcp-cloud-sql" "created"
    log_success "Cloud SQL instance deployment initiated"
}

# Azure deployment
deploy_azure_infrastructure() {
    log_info "Deploying Azure infrastructure..."

    # Create resource group
    log_info "Creating resource group..."
    az group create \
        --name "${PROJECT_NAME}-rg" \
        --location "$AZURE_LOCATION" \
        --tags "Environment=${ENVIRONMENT}" "Project=${PROJECT_NAME}"

    save_deployment_state "azure-resource-group" "created"
    log_success "Resource group created"

    # Create virtual network
    log_info "Creating virtual network..."
    az network vnet create \
        --resource-group "${PROJECT_NAME}-rg" \
        --name "${PROJECT_NAME}-vnet" \
        --address-prefix "$VPC_CIDR" \
        --location "$AZURE_LOCATION" \
        --tags "Environment=${ENVIRONMENT}" "Project=${PROJECT_NAME}"

    save_deployment_state "azure-vnet" "created"
    log_success "Virtual network created"

    # Create subnets
    log_info "Creating subnets..."
    for i in "${!SUBNET_CIDRS[@]}"; do
        local subnet_cidr="${SUBNET_CIDRS[$i]}"

        az network vnet subnet create \
            --resource-group "${PROJECT_NAME}-rg" \
            --vnet-name "${PROJECT_NAME}-vnet" \
            --name "${PROJECT_NAME}-subnet-${i}" \
            --address-prefix "$subnet_cidr"

        save_deployment_state "azure-subnet-${i}" "created"
        log_success "Subnet created: ${PROJECT_NAME}-subnet-${i}"
    done

    # Deploy AKS cluster
    deploy_azure_aks_cluster

    # Deploy Azure Database
    deploy_azure_database
}

# Deploy Azure AKS cluster
deploy_azure_aks_cluster() {
    log_info "Deploying AKS cluster..."

    az aks create \
        --resource-group "${PROJECT_NAME}-rg" \
        --name "${PROJECT_NAME}-cluster" \
        --location "$AZURE_LOCATION" \
        --kubernetes-version "$AKS_VERSION" \
        --node-count "$AKS_NODE_COUNT" \
        --node-vm-size "$AKS_NODE_SIZE" \
        --enable-cluster-autoscaler \
        --min-count "$AKS_MIN_NODES" \
        --max-count "$AKS_MAX_NODES" \
        --vnet-subnet-id "/subscriptions/$AZURE_SUBSCRIPTION_ID/resourceGroups/${PROJECT_NAME}-rg/providers/Microsoft.Network/virtualNetworks/${PROJECT_NAME}-vnet/subnets/${PROJECT_NAME}-subnet-0" \
        --tags "Environment=${ENVIRONMENT}" "Project=${PROJECT_NAME}"

    save_deployment_state "azure-aks-cluster" "created"
    log_success "AKS cluster deployed successfully"

    # Get credentials
    az aks get-credentials --resource-group "${PROJECT_NAME}-rg" --name "${PROJECT_NAME}-cluster"
    log_success "Kubeconfig updated for AKS cluster"
}

# Deploy Azure Database
deploy_azure_database() {
    log_info "Deploying Azure Database..."

    az postgres server create \
        --resource-group "${PROJECT_NAME}-rg" \
        --name "${PROJECT_NAME}-primary-db" \
        --location "$AZURE_LOCATION" \
        --admin-user "$POSTGRES_USERNAME" \
        --admin-password "$POSTGRES_PASSWORD" \
        --sku-name "$AZURE_DB_SKU" \
        --storage-size "$AZURE_DB_STORAGE_SIZE" \
        --backup-retention "$AZURE_DB_BACKUP_RETENTION" \
        --geo-redundant-backup "Enabled" \
        --tags "Environment=${ENVIRONMENT}" "Project=${PROJECT_NAME}"

    save_deployment_state "azure-postgres" "created"
    log_success "Azure Database deployment initiated"
}

# Deploy applications
deploy_applications() {
    log_info "Deploying applications to Kubernetes..."

    # Apply namespace
    kubectl create namespace "$K8S_NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

    # Deploy each microservice
    for service in "${MICROSERVICES[@]}"; do
        log_info "Deploying $service..."

        # Apply service manifests (these would be loaded from files)
        if [[ -f "${SCRIPT_DIR}/k8s/${service}.yaml" ]]; then
            kubectl apply -f "${SCRIPT_DIR}/k8s/${service}.yaml" -n "$K8S_NAMESPACE"
            save_deployment_state "k8s-${service}" "deployed"
            log_success "$service deployed successfully"
        else
            log_warn "Manifest file not found for $service, skipping..."
        fi
    done

    # Wait for deployments
    log_info "Waiting for deployments to be ready..."
    for service in "${MICROSERVICES[@]}"; do
        kubectl wait --for=condition=available deployment "$service" -n "$K8S_NAMESPACE" --timeout=300s || {
            log_error "Deployment $service failed to become ready"
            return 1
        }
    done

    log_success "All applications deployed successfully"
}

# Perform health checks
perform_health_checks() {
    log_info "Performing post-deployment health checks..."

    local failed_checks=()

    # Check Kubernetes cluster health
    if ! kubectl cluster-info &>/dev/null; then
        failed_checks+=("kubernetes-cluster")
        log_error "Kubernetes cluster health check failed"
    fi

    # Check deployed services
    for service in "${MICROSERVICES[@]}"; do
        if ! kubectl get deployment "$service" -n "$K8S_NAMESPACE" &>/dev/null; then
            failed_checks+=("$service")
            log_error "Service $service not found"
        fi
    done

    # Check database connectivity (this would be more sophisticated in practice)
    case "$CLOUD_PROVIDER" in
        "aws")
            # AWS RDS health check would go here
            log_info "Checking AWS RDS connectivity..."
            ;;
        "gcp")
            # GCP Cloud SQL health check would go here
            log_info "Checking GCP Cloud SQL connectivity..."
            ;;
        "azure")
            # Azure Database health check would go here
            log_info "Checking Azure Database connectivity..."
            ;;
    esac

    if [[ ${#failed_checks[@]} -eq 0 ]]; then
        log_success "All health checks passed"
        return 0
    else
        log_error "Failed health checks: ${failed_checks[*]}"
        return 1
    fi
}

# Generate deployment summary
generate_deployment_summary() {
    local summary_file="${SCRIPT_DIR}/deployment-summary.txt"

    log_info "Generating deployment summary..."

    cat <<EOF > "$summary_file"
=== DEPLOYMENT SUMMARY ===
Date: $(date)
Environment: ${ENVIRONMENT}
Cloud Provider: ${CLOUD_PROVIDER}
Project: ${PROJECT_NAME}

INFRASTRUCTURE COMPONENTS:
$(grep "created\|deployed" "${DEPLOYMENT_STATE_FILE}" | sort)

KUBERNETES CLUSTER:
Cluster Name: ${PROJECT_NAME}-cluster
Namespace: ${K8S_NAMESPACE}
Services Deployed: ${#MICROSERVICES[@]}

LOGS:
Deployment Log: ${DEPLOYMENT_LOG_FILE}
Error Log: ${ERROR_LOG_FILE}
State File: ${DEPLOYMENT_STATE_FILE}

EOF

    log_success "Deployment summary generated: $summary_file"
    cat "$summary_file"
}

# Cleanup function
cleanup_deployment() {
    log_info "Starting deployment cleanup..."

    case "$CLOUD_PROVIDER" in
        "aws")
            cleanup_aws_resources
            ;;
        "gcp")
            cleanup_gcp_resources
            ;;
        "azure")
            cleanup_azure_resources
            ;;
    esac

    # Clean up local files
    rm -f "${SCRIPT_DIR}"/*-id.txt
    rm -f "${DEPLOYMENT_STATE_FILE}"

    log_success "Cleanup completed"
}

# Main deployment orchestration
main() {
    setup_colors
    initialize_directories

    log_info "Starting deployment process..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Cloud Provider: $CLOUD_PROVIDER"
    log_info "Project: $PROJECT_NAME"

    # Load previous state if it exists
    load_deployment_state

    # Validate and deploy
    validate_prerequisites
    deploy_infrastructure

    # Wait for infrastructure to be ready
    log_info "Waiting for infrastructure to be ready..."
    sleep 60

    # Deploy applications
    deploy_applications

    # Perform health checks
    if perform_health_checks; then
        generate_deployment_summary
        save_deployment_state "deployment" "completed"
        log_success "Deployment completed successfully!"
    else
        log_error "Deployment completed with errors. Check logs for details."
        exit 1
    fi
}

# Script execution
case "${1:-main}" in
    "main"|"deploy")
        main
        ;;
    "cleanup")
        cleanup_deployment
        ;;
    "health")
        perform_health_checks
        ;;
    "summary")
        generate_deployment_summary
        ;;
    *)
        echo "Usage: $0 [deploy|cleanup|health|summary]"
        exit 1
        ;;
esac