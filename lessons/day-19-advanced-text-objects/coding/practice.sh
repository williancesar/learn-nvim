#!/bin/bash
# Comprehensive DevOps Automation with Extensive Comments
# Practice file for Day 19: Advanced Text Objects (commenting and documentation)
# Focus: Extensive comments for text object practice with comment blocks

set -euo pipefail

###############################################################################
# GLOBAL CONFIGURATION SECTION
# This section contains all the global variables and configuration parameters
# used throughout the script. Modify these values to customize behavior.
###############################################################################

# Primary configuration variables for infrastructure management
readonly SCRIPT_VERSION="2.1.0"                    # Current script version
readonly SCRIPT_NAME="devops-automation"           # Script identifier
readonly LOG_LEVEL="${LOG_LEVEL:-INFO}"             # Logging verbosity level
readonly DRY_RUN="${DRY_RUN:-false}"               # Enable dry-run mode
readonly TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-300}"  # Default operation timeout

# Cloud provider configuration
readonly AWS_REGION="${AWS_REGION:-us-west-2}"                     # Default AWS region
readonly AWS_PROFILE="${AWS_PROFILE:-default}"                     # AWS CLI profile
readonly AZURE_SUBSCRIPTION="${AZURE_SUBSCRIPTION:-}"              # Azure subscription ID
readonly GCP_PROJECT="${GCP_PROJECT:-}"                           # Google Cloud project ID

# Kubernetes cluster configuration
readonly CLUSTER_NAME="${CLUSTER_NAME:-production-cluster}"        # K8s cluster name
readonly NAMESPACE_PREFIX="${NAMESPACE_PREFIX:-company}"           # Namespace prefix
readonly KUBECONFIG_PATH="${KUBECONFIG_PATH:-~/.kube/config}"     # Kubeconfig location

# Container registry configuration
readonly DOCKER_REGISTRY="${DOCKER_REGISTRY:-registry.company.com}"   # Private registry
readonly REGISTRY_NAMESPACE="${REGISTRY_NAMESPACE:-production}"        # Registry namespace
readonly IMAGE_TAG_PREFIX="${IMAGE_TAG_PREFIX:-v}"                     # Image tag prefix

# Monitoring and observability configuration
readonly PROMETHEUS_URL="${PROMETHEUS_URL:-http://prometheus.monitoring.svc.cluster.local:9090}"
readonly GRAFANA_URL="${GRAFANA_URL:-http://grafana.monitoring.svc.cluster.local:3000}"
readonly ALERTMANAGER_URL="${ALERTMANAGER_URL:-http://alertmanager.monitoring.svc.cluster.local:9093}"

###############################################################################
# UTILITY FUNCTIONS SECTION
# This section contains helper functions used throughout the script for
# common operations like logging, error handling, and validation.
###############################################################################

# Logging function with different severity levels
# Arguments: $1 = log level, $2 = message
# Example: log_message "INFO" "Operation completed successfully"
function log_message() {
    local level="$1"           # Log level (DEBUG, INFO, WARN, ERROR)
    local message="$2"         # The message to log
    local timestamp            # Current timestamp for log entry

    # Generate timestamp in ISO 8601 format for consistency
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Only log if the level is appropriate based on LOG_LEVEL setting
    case "$LOG_LEVEL" in
        "DEBUG")
            echo "[$timestamp] [$level] $message" >&2
            ;;
        "INFO")
            if [[ "$level" != "DEBUG" ]]; then
                echo "[$timestamp] [$level] $message" >&2
            fi
            ;;
        "WARN")
            if [[ "$level" =~ ^(WARN|ERROR)$ ]]; then
                echo "[$timestamp] [$level] $message" >&2
            fi
            ;;
        "ERROR")
            if [[ "$level" == "ERROR" ]]; then
                echo "[$timestamp] [$level] $message" >&2
            fi
            ;;
    esac
}

# Error handling function that logs errors and exits
# Arguments: $1 = error message, $2 = exit code (optional, defaults to 1)
# Example: handle_error "Failed to connect to database" 2
function handle_error() {
    local error_message="$1"            # The error message to display
    local exit_code="${2:-1}"           # Exit code (default: 1)
    local caller_info                   # Information about the calling function

    # Get caller information for better debugging
    caller_info=$(caller 0)

    # Log the error with context information
    log_message "ERROR" "Error in ${caller_info}: $error_message"

    # Exit with the specified code unless in dry-run mode
    if [[ "$DRY_RUN" != "true" ]]; then
        exit "$exit_code"
    else
        log_message "INFO" "Dry-run mode: would exit with code $exit_code"
    fi
}

# Validation function for checking prerequisites
# Arguments: $1 = command name to check
# Example: check_command "kubectl" || handle_error "kubectl not found"
function check_command() {
    local command_name="$1"     # Name of the command to check

    # Check if command exists in PATH
    if ! command -v "$command_name" >/dev/null 2>&1; then
        log_message "ERROR" "Required command not found: $command_name"
        return 1
    fi

    log_message "DEBUG" "Command available: $command_name"
    return 0
}

# Retry mechanism for unreliable operations
# Arguments: $1 = max attempts, $2 = delay between attempts, $3+ = command to execute
# Example: retry_with_backoff 3 5 curl -f https://api.example.com/health
function retry_with_backoff() {
    local max_attempts="$1"     # Maximum number of retry attempts
    local delay="$2"            # Initial delay between retries (seconds)
    shift 2                     # Remove first two arguments, leaving command
    local attempt=1             # Current attempt counter
    local current_delay="$delay" # Current delay (for exponential backoff)

    # Execute command with retry logic
    while [[ $attempt -le $max_attempts ]]; do
        log_message "DEBUG" "Attempt $attempt/$max_attempts: $*"

        # Execute the command and check if it succeeds
        if "$@"; then
            log_message "INFO" "Command succeeded on attempt $attempt"
            return 0
        fi

        # If not the last attempt, wait before retrying
        if [[ $attempt -lt $max_attempts ]]; then
            log_message "WARN" "Command failed, retrying in ${current_delay}s..."
            sleep "$current_delay"

            # Exponential backoff: double the delay for next attempt
            current_delay=$((current_delay * 2))
        fi

        ((attempt++))
    done

    # All attempts failed
    log_message "ERROR" "Command failed after $max_attempts attempts: $*"
    return 1
}

###############################################################################
# INFRASTRUCTURE MANAGEMENT FUNCTIONS
# This section contains functions for managing cloud infrastructure including
# virtual machines, networking, storage, and security configurations.
###############################################################################

# Create and configure cloud infrastructure
# Arguments: $1 = infrastructure type, $2 = environment name
# Example: setup_infrastructure "aws" "production"
function setup_infrastructure() {
    local provider="$1"         # Cloud provider (aws, azure, gcp)
    local environment="$2"      # Target environment name
    local config_file          # Path to infrastructure configuration file

    log_message "INFO" "Setting up infrastructure on $provider for $environment"

    # Determine configuration file based on provider and environment
    config_file="./infrastructure/${provider}/${environment}.tf"

    # Validate that configuration file exists
    if [[ ! -f "$config_file" ]]; then
        handle_error "Infrastructure configuration not found: $config_file"
    fi

    # Initialize Terraform workspace for the environment
    # This ensures we're working with the correct state file
    log_message "INFO" "Initializing Terraform workspace"
    terraform -chdir="./infrastructure/${provider}" init \
        -backend-config="key=${environment}/terraform.tfstate"

    # Select or create workspace for environment isolation
    terraform -chdir="./infrastructure/${provider}" workspace select "$environment" 2>/dev/null || \
        terraform -chdir="./infrastructure/${provider}" workspace new "$environment"

    # Plan infrastructure changes before applying
    log_message "INFO" "Planning infrastructure changes"
    terraform -chdir="./infrastructure/${provider}" plan \
        -var-file="${environment}.tfvars" \
        -out="${environment}.tfplan"

    # Apply changes unless in dry-run mode
    if [[ "$DRY_RUN" != "true" ]]; then
        log_message "INFO" "Applying infrastructure changes"
        terraform -chdir="./infrastructure/${provider}" apply "${environment}.tfplan"
    else
        log_message "INFO" "Dry-run mode: skipping infrastructure apply"
    fi

    log_message "INFO" "Infrastructure setup completed for $environment"
}

# Configure network security groups and firewall rules
# Arguments: $1 = security profile name
# Example: configure_security_groups "web-tier"
function configure_security_groups() {
    local profile_name="$1"     # Security profile identifier

    log_message "INFO" "Configuring security groups for profile: $profile_name"

    # Define security rules based on profile type
    case "$profile_name" in
        "web-tier")
            # Web tier allows HTTP/HTTPS traffic from internet
            log_message "DEBUG" "Configuring web-tier security rules"
            create_security_rule "allow-http" "tcp" "80" "0.0.0.0/0"
            create_security_rule "allow-https" "tcp" "443" "0.0.0.0/0"
            create_security_rule "allow-ssh" "tcp" "22" "10.0.0.0/8"
            ;;
        "app-tier")
            # Application tier allows traffic only from web tier
            log_message "DEBUG" "Configuring app-tier security rules"
            create_security_rule "allow-app-port" "tcp" "8080" "10.0.1.0/24"
            create_security_rule "allow-management" "tcp" "8443" "10.0.0.0/16"
            ;;
        "db-tier")
            # Database tier allows traffic only from application tier
            log_message "DEBUG" "Configuring db-tier security rules"
            create_security_rule "allow-postgres" "tcp" "5432" "10.0.2.0/24"
            create_security_rule "allow-mysql" "tcp" "3306" "10.0.2.0/24"
            create_security_rule "allow-redis" "tcp" "6379" "10.0.2.0/24"
            ;;
        *)
            handle_error "Unknown security profile: $profile_name"
            ;;
    esac

    log_message "INFO" "Security groups configured for $profile_name"
}

# Helper function to create individual security rules
# Arguments: $1 = rule name, $2 = protocol, $3 = port, $4 = source CIDR
function create_security_rule() {
    local rule_name="$1"        # Descriptive name for the rule
    local protocol="$2"         # Network protocol (tcp, udp, icmp)
    local port="$3"            # Port number or range
    local source_cidr="$4"     # Source IP range in CIDR notation

    log_message "DEBUG" "Creating security rule: $rule_name ($protocol:$port from $source_cidr)"

    # Implementation would depend on cloud provider
    # This is a placeholder for actual cloud API calls
    if [[ "$DRY_RUN" == "true" ]]; then
        log_message "INFO" "Dry-run: would create rule $rule_name"
    else
        # Actual implementation would make cloud provider API calls here
        log_message "INFO" "Created security rule: $rule_name"
    fi
}

###############################################################################
# KUBERNETES DEPLOYMENT FUNCTIONS
# This section handles Kubernetes cluster operations including deployments,
# services, ingress rules, and resource management.
###############################################################################

# Deploy application to Kubernetes cluster
# Arguments: $1 = application name, $2 = image tag, $3 = namespace
# Example: deploy_to_kubernetes "web-app" "v2.1.0" "production"
function deploy_to_kubernetes() {
    local app_name="$1"         # Application identifier
    local image_tag="$2"        # Docker image tag to deploy
    local namespace="$3"        # Target Kubernetes namespace
    local deployment_file       # Path to deployment manifest
    local service_file          # Path to service manifest

    log_message "INFO" "Deploying $app_name:$image_tag to namespace $namespace"

    # Validate Kubernetes connectivity
    if ! kubectl cluster-info >/dev/null 2>&1; then
        handle_error "Cannot connect to Kubernetes cluster"
    fi

    # Create namespace if it doesn't exist
    kubectl create namespace "$namespace" --dry-run=client -o yaml | kubectl apply -f -

    # Set deployment and service manifest paths
    deployment_file="./k8s/${app_name}/deployment.yaml"
    service_file="./k8s/${app_name}/service.yaml"

    # Validate that required manifest files exist
    if [[ ! -f "$deployment_file" ]]; then
        handle_error "Deployment manifest not found: $deployment_file"
    fi

    # Update deployment with new image tag
    # This uses kustomize to patch the image tag dynamically
    log_message "DEBUG" "Updating deployment with image tag $image_tag"
    kubectl patch -f "$deployment_file" \
        --type='merge' \
        --patch="{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"$app_name\",\"image\":\"$DOCKER_REGISTRY/$app_name:$image_tag\"}]}}}}" \
        --dry-run=client -o yaml | kubectl apply -n "$namespace" -f -

    # Apply service configuration if it exists
    if [[ -f "$service_file" ]]; then
        log_message "DEBUG" "Applying service configuration"
        kubectl apply -n "$namespace" -f "$service_file"
    fi

    # Wait for deployment to be ready
    log_message "INFO" "Waiting for deployment to be ready..."
    kubectl wait --for=condition=available \
        --timeout="${TIMEOUT_SECONDS}s" \
        -n "$namespace" \
        deployment/"$app_name"

    # Verify deployment status
    local ready_replicas
    ready_replicas=$(kubectl get deployment "$app_name" -n "$namespace" -o jsonpath='{.status.readyReplicas}')
    log_message "INFO" "Deployment ready: $ready_replicas replicas"
}

# Scale Kubernetes deployment
# Arguments: $1 = deployment name, $2 = namespace, $3 = replica count
# Example: scale_deployment "web-app" "production" 5
function scale_deployment() {
    local deployment_name="$1"  # Name of the deployment to scale
    local namespace="$2"        # Kubernetes namespace
    local replica_count="$3"    # Desired number of replicas

    log_message "INFO" "Scaling $deployment_name to $replica_count replicas in $namespace"

    # Validate replica count is a positive integer
    if ! [[ "$replica_count" =~ ^[0-9]+$ ]] || [[ "$replica_count" -lt 0 ]]; then
        handle_error "Invalid replica count: $replica_count"
    fi

    # Scale the deployment
    kubectl scale deployment "$deployment_name" \
        --replicas="$replica_count" \
        --namespace="$namespace"

    # Wait for scaling operation to complete
    log_message "INFO" "Waiting for scaling operation to complete..."
    kubectl wait --for=condition=available \
        --timeout="${TIMEOUT_SECONDS}s" \
        -n "$namespace" \
        deployment/"$deployment_name"

    # Verify final replica count
    local current_replicas
    current_replicas=$(kubectl get deployment "$deployment_name" -n "$namespace" -o jsonpath='{.status.readyReplicas}')

    if [[ "$current_replicas" == "$replica_count" ]]; then
        log_message "INFO" "Scaling completed successfully: $current_replicas/$replica_count replicas ready"
    else
        handle_error "Scaling failed: expected $replica_count replicas, got $current_replicas"
    fi
}

###############################################################################
# MONITORING AND OBSERVABILITY FUNCTIONS
# This section includes functions for setting up monitoring, alerting,
# and logging infrastructure for comprehensive system observability.
###############################################################################

# Setup comprehensive monitoring stack
# Arguments: $1 = monitoring namespace, $2 = retention period
# Example: setup_monitoring "monitoring" "30d"
function setup_monitoring() {
    local monitoring_namespace="$1"    # Namespace for monitoring components
    local retention_period="$2"        # Data retention period

    log_message "INFO" "Setting up monitoring stack in namespace $monitoring_namespace"

    # Add Prometheus Helm repository
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update

    # Install kube-prometheus-stack with custom configuration
    helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
        --namespace "$monitoring_namespace" \
        --create-namespace \
        --set prometheus.prometheusSpec.retention="$retention_period" \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi \
        --set grafana.persistence.enabled=true \
        --set grafana.persistence.size=10Gi \
        --set alertmanager.alertmanagerSpec.storage.volumeClaimTemplate.spec.resources.requests.storage=10Gi

    # Wait for monitoring components to be ready
    log_message "INFO" "Waiting for monitoring components to be ready..."
    kubectl wait --for=condition=ready \
        --timeout="${TIMEOUT_SECONDS}s" \
        -n "$monitoring_namespace" \
        pod -l app.kubernetes.io/name=prometheus

    log_message "INFO" "Monitoring stack setup completed"
}

# Configure alerting rules for system monitoring
# Arguments: $1 = alert configuration file path
# Example: configure_alerts "./monitoring/alerts.yaml"
function configure_alerts() {
    local alert_config_file="$1"   # Path to alert configuration file

    log_message "INFO" "Configuring alerting rules from $alert_config_file"

    # Validate alert configuration file exists
    if [[ ! -f "$alert_config_file" ]]; then
        handle_error "Alert configuration file not found: $alert_config_file"
    fi

    # Apply alert rules to Prometheus
    kubectl apply -f "$alert_config_file"

    # Verify alert rules are loaded
    log_message "INFO" "Verifying alert rules are loaded in Prometheus..."

    # Check Prometheus API for loaded rules
    local prometheus_pod
    prometheus_pod=$(kubectl get pods -n monitoring -l app.kubernetes.io/name=prometheus -o jsonpath='{.items[0].metadata.name}')

    if [[ -n "$prometheus_pod" ]]; then
        kubectl port-forward -n monitoring pod/"$prometheus_pod" 9090:9090 &
        local port_forward_pid=$!

        # Give port-forward time to establish connection
        sleep 5

        # Query Prometheus API for rules
        local rules_count
        rules_count=$(curl -s http://localhost:9090/api/v1/rules | jq '.data.groups | length')

        # Clean up port-forward
        kill $port_forward_pid 2>/dev/null || true

        log_message "INFO" "Loaded $rules_count alert rule groups"
    else
        log_message "WARN" "Could not verify alert rules - Prometheus pod not found"
    fi
}

###############################################################################
# MAIN EXECUTION FUNCTION
# This is the primary entry point that orchestrates all operations based on
# command-line arguments and configuration parameters.
###############################################################################

# Main function that coordinates all script operations
# Arguments: $@ = all command-line arguments passed to script
function main() {
    local command="${1:-help}"      # Primary command (defaults to help)

    log_message "INFO" "Starting $SCRIPT_NAME v$SCRIPT_VERSION"
    log_message "DEBUG" "Command: $command, Arguments: ${*:2}"

    # Validate common prerequisites for all operations
    local required_tools=("kubectl" "helm" "terraform" "jq" "curl")
    for tool in "${required_tools[@]}"; do
        if ! check_command "$tool"; then
            handle_error "Required tool not found: $tool"
        fi
    done

    # Execute appropriate function based on command
    case "$command" in
        "infrastructure")
            # Infrastructure management operations
            shift
            setup_infrastructure "${1:-aws}" "${2:-development}"
            ;;
        "security")
            # Security configuration operations
            shift
            configure_security_groups "${1:-web-tier}"
            ;;
        "deploy")
            # Application deployment operations
            shift
            deploy_to_kubernetes "${1:-demo-app}" "${2:-latest}" "${3:-default}"
            ;;
        "scale")
            # Scaling operations
            shift
            scale_deployment "${1:-demo-app}" "${2:-default}" "${3:-3}"
            ;;
        "monitoring")
            # Monitoring setup operations
            shift
            setup_monitoring "${1:-monitoring}" "${2:-30d}"
            ;;
        "alerts")
            # Alert configuration operations
            shift
            configure_alerts "${1:-./monitoring/alerts.yaml}"
            ;;
        "help"|*)
            # Display help information
            echo "Usage: $0 {infrastructure|security|deploy|scale|monitoring|alerts}"
            echo ""
            echo "Commands:"
            echo "  infrastructure [provider] [environment]  - Setup cloud infrastructure"
            echo "  security [profile]                       - Configure security groups"
            echo "  deploy [app] [tag] [namespace]           - Deploy application"
            echo "  scale [deployment] [namespace] [count]   - Scale deployment"
            echo "  monitoring [namespace] [retention]       - Setup monitoring"
            echo "  alerts [config-file]                     - Configure alerts"
            echo ""
            echo "Environment Variables:"
            echo "  LOG_LEVEL    - Logging verbosity (DEBUG|INFO|WARN|ERROR)"
            echo "  DRY_RUN      - Enable dry-run mode (true|false)"
            echo "  AWS_REGION   - AWS region for operations"
            echo "  CLUSTER_NAME - Kubernetes cluster name"
            ;;
    esac

    log_message "INFO" "$SCRIPT_NAME execution completed"
}

# Script execution entry point
# Only execute main function if script is run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi