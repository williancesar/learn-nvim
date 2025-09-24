#!/bin/bash

# CI/CD Pipeline Management Script - Designed for f/F/t/T character search practice
# This script orchestrates continuous integration and deployment workflows

set -euo pipefail

# Global configuration constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="${SCRIPT_DIR}/.."
readonly BUILD_DIR="${PROJECT_ROOT}/build"
readonly ARTIFACTS_DIR="${PROJECT_ROOT}/artifacts"
readonly LOGS_DIR="${PROJECT_ROOT}/logs"
readonly CONFIG_FILE="${PROJECT_ROOT}/ci-config.yaml"

# Pipeline environment variables
export DOCKER_REGISTRY="${DOCKER_REGISTRY:-harbor.company.com}"
export KUBERNETES_NAMESPACE="${KUBERNETES_NAMESPACE:-production}"
export HELM_CHART_VERSION="${HELM_CHART_VERSION:-1.0.0}"
export GIT_COMMIT_SHA="${GIT_COMMIT_SHA:-$(git rev-parse HEAD)}"
export BUILD_NUMBER="${BUILD_NUMBER:-$(date +%Y%m%d%H%M%S)}"

# Color codes for terminal output
readonly COLOR_RED='\033[0;31m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_YELLOW='\033[1;33m'
readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_PURPLE='\033[0;35m'
readonly COLOR_CYAN='\033[0;36m'
readonly COLOR_RESET='\033[0m'

# Logging functions with specific characters for search practice
log_info() {
    echo -e "${COLOR_GREEN}[INFO:$(date '+%H:%M:%S')]${COLOR_RESET} $*" | tee -a "${LOGS_DIR}/pipeline.log"
}

log_warn() {
    echo -e "${COLOR_YELLOW}[WARN:$(date '+%H:%M:%S')]${COLOR_RESET} $*" | tee -a "${LOGS_DIR}/pipeline.log"
}

log_error() {
    echo -e "${COLOR_RED}[ERROR:$(date '+%H:%M:%S')]${COLOR_RESET} $*" | tee -a "${LOGS_DIR}/pipeline.log"
}

log_debug() {
    if [[ "${DEBUG:-false}" == "true" ]]; then
        echo -e "${COLOR_CYAN}[DEBUG:$(date '+%H:%M:%S')]${COLOR_RESET} $*" | tee -a "${LOGS_DIR}/pipeline.log"
    fi
}

# Function to check prerequisites and dependencies
check_prerequisites() {
    log_info "Checking CI/CD prerequisites..."

    local required_tools=("docker" "kubectl" "helm" "git" "jq" "yq" "curl" "aws")
    local missing_tools=()

    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &>/dev/null; then
            missing_tools+=("$tool")
        fi
    done

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        return 1
    fi

    # Check Docker daemon status
    if ! docker info &>/dev/null; then
        log_error "Docker daemon is not running or accessible"
        return 1
    fi

    # Check Kubernetes cluster connectivity
    if ! kubectl cluster-info &>/dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        return 1
    fi

    # Verify AWS credentials for ECR/EKS access
    if ! aws sts get-caller-identity &>/dev/null; then
        log_warn "AWS credentials not configured or invalid"
    fi

    log_info "Prerequisites check completed successfully ✓"
}

# Setup build environment and directories
setup_build_environment() {
    log_info "Setting up build environment..."

    # Create necessary directories
    mkdir -p "${BUILD_DIR}" "${ARTIFACTS_DIR}" "${LOGS_DIR}"

    # Clean previous build artifacts
    rm -rf "${BUILD_DIR:?}"/* "${ARTIFACTS_DIR:?}"/*

    # Set build permissions
    chmod 755 "${BUILD_DIR}" "${ARTIFACTS_DIR}" "${LOGS_DIR}"

    # Export build metadata
    cat > "${BUILD_DIR}/build-info.json" <<EOF
{
    "build_number": "${BUILD_NUMBER}",
    "git_commit": "${GIT_COMMIT_SHA}",
    "build_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "build_user": "$(whoami)",
    "build_host": "$(hostname)",
    "git_branch": "$(git rev-parse --abbrev-ref HEAD)",
    "git_tag": "$(git describe --tags --exact-match 2>/dev/null || echo 'none')"
}
EOF

    log_info "Build environment setup completed ✓"
}

# Code quality and security scanning
run_code_analysis() {
    log_info "Running code analysis and security scans..."

    # SonarQube analysis for code quality
    if command -v sonar-scanner &>/dev/null; then
        log_info "Running SonarQube analysis..."
        sonar-scanner \
            -Dsonar.projectKey="microservices-${BUILD_NUMBER}" \
            -Dsonar.sources=./src \
            -Dsonar.host.url="${SONAR_HOST_URL:-http://sonarqube.company.com}" \
            -Dsonar.login="${SONAR_TOKEN}" \
            -Dsonar.qualitygate.wait=true
    fi

    # Snyk security vulnerability scanning
    if command -v snyk &>/dev/null; then
        log_info "Running Snyk security scan..."
        snyk test --severity-threshold=high --json > "${ARTIFACTS_DIR}/snyk-report.json"
        snyk monitor --project-name="microservices-${BUILD_NUMBER}"
    fi

    # OWASP Dependency Check
    if [[ -f "${PROJECT_ROOT}/dependency-check.sh" ]]; then
        log_info "Running OWASP Dependency Check..."
        "${PROJECT_ROOT}/dependency-check.sh" \
            --project "microservices" \
            --scan "${PROJECT_ROOT}/src" \
            --format JSON \
            --out "${ARTIFACTS_DIR}/dependency-check-report.json"
    fi

    # Trivy container image vulnerability scanning
    if command -v trivy &>/dev/null; then
        log_info "Running Trivy security scan..."
        trivy fs "${PROJECT_ROOT}/src" \
            --format json \
            --output "${ARTIFACTS_DIR}/trivy-fs-report.json"
    fi

    log_info "Code analysis completed ✓"
}

# Build and test application components
build_and_test() {
    log_info "Building and testing application..."

    local services=("user-service" "order-service" "payment-service" "notification-service")

    for service in "${services[@]}"; do
        log_info "Building ${service}..."

        # Build Docker image
        docker build \
            --file "services/${service}/Dockerfile" \
            --tag "${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER}" \
            --tag "${DOCKER_REGISTRY}/${service}:latest" \
            --build-arg BUILD_NUMBER="${BUILD_NUMBER}" \
            --build-arg GIT_COMMIT="${GIT_COMMIT_SHA}" \
            "services/${service}/"

        # Run unit tests inside container
        docker run --rm \
            --volume "${PWD}/services/${service}/test-results:/test-results" \
            "${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER}" \
            npm test -- --coverage --outputFile=/test-results/junit.xml

        # Run integration tests
        docker-compose \
            --file "services/${service}/docker-compose.test.yml" \
            up --abort-on-container-exit --exit-code-from test

        # Security scan of built image
        if command -v trivy &>/dev/null; then
            trivy image \
                --format json \
                --output "${ARTIFACTS_DIR}/${service}-image-scan.json" \
                "${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER}"
        fi

        log_info "${service} build and test completed ✓"
    done

    # Generate test reports summary
    find . -name "junit.xml" -exec cp {} "${ARTIFACTS_DIR}/" \;
    find . -name "coverage.xml" -exec cp {} "${ARTIFACTS_DIR}/" \;
}

# Push Docker images to registry
push_images() {
    log_info "Pushing Docker images to registry..."

    # Login to Docker registry
    echo "${DOCKER_REGISTRY_PASSWORD}" | docker login "${DOCKER_REGISTRY}" \
        --username "${DOCKER_REGISTRY_USERNAME}" \
        --password-stdin

    local services=("user-service" "order-service" "payment-service" "notification-service")

    for service in "${services[@]}"; do
        log_info "Pushing ${service} image..."

        # Push versioned tag
        docker push "${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER}"

        # Push latest tag (only for main branch)
        if [[ "$(git rev-parse --abbrev-ref HEAD)" == "main" ]]; then
            docker push "${DOCKER_REGISTRY}/${service}:latest"
        fi

        # Generate image manifest
        docker manifest inspect "${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER}" \
            > "${ARTIFACTS_DIR}/${service}-manifest.json"
    done

    log_info "Docker images pushed successfully ✓"
}

# Deploy to Kubernetes cluster
deploy_to_kubernetes() {
    local environment="${1:-staging}"
    log_info "Deploying to ${environment} environment..."

    # Update kubeconfig for target cluster
    case "${environment}" in
        "staging")
            aws eks update-kubeconfig --region us-west-2 --name staging-cluster
            ;;
        "production")
            aws eks update-kubeconfig --region us-west-2 --name production-cluster
            ;;
        *)
            log_error "Invalid environment: ${environment}"
            return 1
            ;;
    esac

    # Create namespace if it doesn't exist
    kubectl create namespace "${KUBERNETES_NAMESPACE}" \
        --dry-run=client -o yaml | kubectl apply -f -

    # Apply Kubernetes manifests
    helm upgrade --install microservices-app ./helm/microservices \
        --namespace "${KUBERNETES_NAMESPACE}" \
        --set global.image.tag="${BUILD_NUMBER}" \
        --set global.environment="${environment}" \
        --set global.registry="${DOCKER_REGISTRY}" \
        --values "helm/values-${environment}.yaml" \
        --timeout=600s \
        --wait

    # Verify deployment status
    kubectl rollout status deployment/user-service -n "${KUBERNETES_NAMESPACE}" --timeout=300s
    kubectl rollout status deployment/order-service -n "${KUBERNETES_NAMESPACE}" --timeout=300s
    kubectl rollout status deployment/payment-service -n "${KUBERNETES_NAMESPACE}" --timeout=300s
    kubectl rollout status deployment/notification-service -n "${KUBERNETES_NAMESPACE}" --timeout=300s

    # Run smoke tests
    run_smoke_tests "${environment}"

    log_info "Deployment to ${environment} completed ✓"
}

# Execute smoke tests to verify deployment
run_smoke_tests() {
    local environment="${1:-staging}"
    log_info "Running smoke tests for ${environment}..."

    # Get service endpoints
    local user_service_url="http://$(kubectl get service user-service -n "${KUBERNETES_NAMESPACE}" -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"
    local order_service_url="http://$(kubectl get service order-service -n "${KUBERNETES_NAMESPACE}" -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"

    # Test service health endpoints
    local services=("${user_service_url}" "${order_service_url}")

    for service_url in "${services[@]}"; do
        if ! curl --fail --silent --max-time 30 "${service_url}/health"; then
            log_error "Health check failed for ${service_url}"
            return 1
        fi
    done

    # Run Newman API tests
    if command -v newman &>/dev/null; then
        newman run "tests/postman/smoke-tests-${environment}.json" \
            --environment "tests/postman/environment-${environment}.json" \
            --reporters cli,json \
            --reporter-json-export "${ARTIFACTS_DIR}/smoke-test-results.json"
    fi

    # Run Selenium end-to-end tests
    if [[ -f "tests/e2e/run-tests.sh" ]]; then
        bash "tests/e2e/run-tests.sh" "${environment}"
    fi

    log_info "Smoke tests completed ✓"
}

# Cleanup and maintenance tasks
cleanup_resources() {
    log_info "Cleaning up build resources..."

    # Remove old Docker images (keep last 5 builds)
    docker images "${DOCKER_REGISTRY}/*" --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}" | \
        grep -v latest | sort -k2 -r | tail -n +6 | awk '{print $1}' | \
        xargs -r docker rmi

    # Clean up old Kubernetes resources
    kubectl delete pods --field-selector=status.phase=Succeeded -n "${KUBERNETES_NAMESPACE}"
    kubectl delete pods --field-selector=status.phase=Failed -n "${KUBERNETES_NAMESPACE}"

    # Archive old logs (keep last 30 days)
    find "${LOGS_DIR}" -name "*.log" -mtime +30 -delete

    # Clean up old artifacts
    find "${ARTIFACTS_DIR}" -name "*.json" -mtime +7 -delete

    log_info "Cleanup completed ✓"
}

# Rollback deployment if issues are detected
rollback_deployment() {
    local environment="${1:-staging}"
    local revision="${2:-previous}"

    log_warn "Initiating rollback for ${environment} environment..."

    # Rollback Helm deployment
    helm rollback microservices-app "${revision}" --namespace "${KUBERNETES_NAMESPACE}"

    # Wait for rollback to complete
    kubectl rollout status deployment/user-service -n "${KUBERNETES_NAMESPACE}" --timeout=300s
    kubectl rollout status deployment/order-service -n "${KUBERNETES_NAMESPACE}" --timeout=300s

    # Verify rollback success
    run_smoke_tests "${environment}"

    log_info "Rollback completed ✓"
}

# Send notifications about pipeline status
send_notifications() {
    local status="${1}"
    local message="${2}"

    # Slack notification
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"Pipeline ${status}: ${message}\"}" \
            "${SLACK_WEBHOOK_URL}"
    fi

    # Email notification
    if [[ -n "${NOTIFICATION_EMAIL:-}" ]]; then
        echo "${message}" | mail -s "CI/CD Pipeline ${status}" "${NOTIFICATION_EMAIL}"
    fi

    # PagerDuty alert for failures
    if [[ "${status}" == "FAILED" && -n "${PAGERDUTY_INTEGRATION_KEY:-}" ]]; then
        curl -X POST -H 'Content-Type: application/json' \
            -d "{
                \"routing_key\": \"${PAGERDUTY_INTEGRATION_KEY}\",
                \"event_action\": \"trigger\",
                \"payload\": {
                    \"summary\": \"CI/CD Pipeline Failure\",
                    \"source\": \"$(hostname)\",
                    \"severity\": \"critical\",
                    \"custom_details\": {\"message\": \"${message}\"}
                }
            }" \
            https://events.pagerduty.com/v2/enqueue
    fi
}

# Main pipeline execution function
main() {
    local command="${1:-help}"

    case "${command}" in
        "full-pipeline")
            log_info "Starting full CI/CD pipeline..."
            check_prerequisites
            setup_build_environment
            run_code_analysis
            build_and_test
            push_images
            deploy_to_kubernetes "staging"

            # Deploy to production only from main branch
            if [[ "$(git rev-parse --abbrev-ref HEAD)" == "main" ]]; then
                read -p "Deploy to production? (y/N): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    deploy_to_kubernetes "production"
                fi
            fi

            cleanup_resources
            send_notifications "SUCCESS" "Pipeline completed successfully"
            ;;

        "build-only")
            check_prerequisites
            setup_build_environment
            build_and_test
            ;;

        "deploy")
            local env="${2:-staging}"
            check_prerequisites
            deploy_to_kubernetes "${env}"
            ;;

        "rollback")
            local env="${2:-staging}"
            local revision="${3:-previous}"
            rollback_deployment "${env}" "${revision}"
            ;;

        "smoke-tests")
            local env="${2:-staging}"
            run_smoke_tests "${env}"
            ;;

        "cleanup")
            cleanup_resources
            ;;

        "help"|*)
            cat <<EOF
CI/CD Pipeline Management Script

Usage: $0 <command> [options]

Commands:
  full-pipeline     Run complete CI/CD pipeline
  build-only        Build and test only (no deployment)
  deploy <env>      Deploy to environment (staging|production)
  rollback <env>    Rollback deployment
  smoke-tests <env> Run smoke tests
  cleanup           Clean up resources
  help              Show this help message

Examples:
  $0 full-pipeline
  $0 deploy staging
  $0 rollback production previous
  $0 smoke-tests staging
EOF
            ;;
    esac
}

# Error handling and cleanup
trap 'send_notifications "FAILED" "Pipeline failed at line $LINENO"' ERR
trap 'cleanup_resources' EXIT

# Execute main function with all arguments
main "$@"