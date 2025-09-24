#!/bin/bash

# Infrastructure Setup and Initialization Script
# Part of multi-file project for practicing file operations
# This script handles environment setup, tool installation, and pre-deployment tasks

set -euo pipefail

# Import configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/config.sh"

# Setup and initialization functions
initialize_directories() {
    log_info "Initializing project directories..."

    # Create required directories
    local directories=(
        "$LOG_DIR"
        "$BACKUP_DIR"
        "$TEMP_DIR"
        "$CONFIG_DIR"
        "${SCRIPT_DIR}/k8s"
        "${SCRIPT_DIR}/terraform"
        "${SCRIPT_DIR}/ansible"
        "${SCRIPT_DIR}/scripts"
        "${SCRIPT_DIR}/certificates"
    )

    for dir in "${directories[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_info "Created directory: $dir"
        fi
    done

    # Set proper permissions
    chmod 700 "${SCRIPT_DIR}/certificates"
    chmod 750 "$LOG_DIR"
    chmod 750 "$CONFIG_DIR"

    log_success "Directory initialization completed"
}

# Install required tools
install_tools() {
    log_info "Installing required tools..."

    local os_type
    os_type=$(uname -s)

    case "$os_type" in
        "Linux")
            install_tools_linux
            ;;
        "Darwin")
            install_tools_macos
            ;;
        *)
            log_error "Unsupported operating system: $os_type"
            exit 1
            ;;
    esac
}

# Install tools on Linux
install_tools_linux() {
    log_info "Installing tools for Linux..."

    # Update package manager
    if command -v apt-get &>/dev/null; then
        sudo apt-get update
        install_debian_tools
    elif command -v yum &>/dev/null; then
        sudo yum update -y
        install_rhel_tools
    elif command -v pacman &>/dev/null; then
        sudo pacman -Syu --noconfirm
        install_arch_tools
    else
        log_error "Unsupported Linux distribution"
        exit 1
    fi
}

# Install tools on Debian/Ubuntu
install_debian_tools() {
    log_info "Installing tools for Debian/Ubuntu..."

    # Essential packages
    sudo apt-get install -y \
        curl \
        wget \
        git \
        jq \
        unzip \
        ca-certificates \
        gnupg \
        lsb-release

    # Docker
    if ! command -v docker &>/dev/null; then
        log_info "Installing Docker..."
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io
        sudo usermod -aG docker "$USER"
        log_success "Docker installed successfully"
    fi

    # kubectl
    if ! command -v kubectl &>/dev/null; then
        log_info "Installing kubectl..."
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
        rm kubectl
        log_success "kubectl installed successfully"
    fi

    # Helm
    if ! command -v helm &>/dev/null; then
        log_info "Installing Helm..."
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
        log_success "Helm installed successfully"
    fi

    # Terraform
    if ! command -v terraform &>/dev/null; then
        log_info "Installing Terraform..."
        wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
        sudo apt-get update && sudo apt-get install -y terraform
        log_success "Terraform installed successfully"
    fi

    install_cloud_tools_debian
}

# Install RHEL/CentOS/Fedora tools
install_rhel_tools() {
    log_info "Installing tools for RHEL/CentOS/Fedora..."

    # Essential packages
    sudo yum install -y \
        curl \
        wget \
        git \
        jq \
        unzip \
        ca-certificates

    # Docker
    if ! command -v docker &>/dev/null; then
        log_info "Installing Docker..."
        sudo yum install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo yum install -y docker-ce docker-ce-cli containerd.io
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker "$USER"
        log_success "Docker installed successfully"
    fi

    # kubectl, Helm, and Terraform installation similar to Debian
    install_kubectl_generic
    install_helm_generic
    install_terraform_generic
    install_cloud_tools_rhel
}

# Install Arch Linux tools
install_arch_tools() {
    log_info "Installing tools for Arch Linux..."

    # Essential packages
    sudo pacman -S --noconfirm \
        curl \
        wget \
        git \
        jq \
        unzip \
        ca-certificates

    # Docker
    if ! command -v docker &>/dev/null; then
        log_info "Installing Docker..."
        sudo pacman -S --noconfirm docker
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker "$USER"
        log_success "Docker installed successfully"
    fi

    # kubectl, Helm, and Terraform
    sudo pacman -S --noconfirm kubectl helm terraform

    install_cloud_tools_arch
}

# Install tools on macOS
install_tools_macos() {
    log_info "Installing tools for macOS..."

    # Install Homebrew if not present
    if ! command -v brew &>/dev/null; then
        log_info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        log_success "Homebrew installed successfully"
    fi

    # Update Homebrew
    brew update

    # Install essential tools
    local tools=(
        "git"
        "jq"
        "curl"
        "wget"
        "docker"
        "kubectl"
        "helm"
        "terraform"
    )

    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &>/dev/null; then
            log_info "Installing $tool..."
            brew install "$tool"
            log_success "$tool installed successfully"
        fi
    done

    install_cloud_tools_macos
}

# Generic installations
install_kubectl_generic() {
    if ! command -v kubectl &>/dev/null; then
        log_info "Installing kubectl..."
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
        rm kubectl
        log_success "kubectl installed successfully"
    fi
}

install_helm_generic() {
    if ! command -v helm &>/dev/null; then
        log_info "Installing Helm..."
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
        log_success "Helm installed successfully"
    fi
}

install_terraform_generic() {
    if ! command -v terraform &>/dev/null; then
        log_info "Installing Terraform..."
        local terraform_version="1.6.0"
        wget "https://releases.hashicorp.com/terraform/${terraform_version}/terraform_${terraform_version}_linux_amd64.zip"
        unzip "terraform_${terraform_version}_linux_amd64.zip"
        sudo mv terraform /usr/local/bin/
        rm "terraform_${terraform_version}_linux_amd64.zip"
        log_success "Terraform installed successfully"
    fi
}

# Cloud-specific tool installations
install_cloud_tools_debian() {
    case "$CLOUD_PROVIDER" in
        "aws")
            install_aws_cli_debian
            install_eksctl_debian
            ;;
        "gcp")
            install_gcloud_cli_debian
            ;;
        "azure")
            install_azure_cli_debian
            ;;
    esac
}

install_cloud_tools_rhel() {
    case "$CLOUD_PROVIDER" in
        "aws")
            install_aws_cli_generic
            install_eksctl_generic
            ;;
        "gcp")
            install_gcloud_cli_generic
            ;;
        "azure")
            install_azure_cli_generic
            ;;
    esac
}

install_cloud_tools_arch() {
    case "$CLOUD_PROVIDER" in
        "aws")
            sudo pacman -S --noconfirm aws-cli
            install_eksctl_generic
            ;;
        "gcp")
            install_gcloud_cli_generic
            ;;
        "azure")
            install_azure_cli_generic
            ;;
    esac
}

install_cloud_tools_macos() {
    case "$CLOUD_PROVIDER" in
        "aws")
            brew install awscli eksctl
            ;;
        "gcp")
            brew install google-cloud-sdk
            ;;
        "azure")
            brew install azure-cli
            ;;
    esac
}

# AWS CLI installation
install_aws_cli_debian() {
    if ! command -v aws &>/dev/null; then
        log_info "Installing AWS CLI..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
        log_success "AWS CLI installed successfully"
    fi
}

install_aws_cli_generic() {
    if ! command -v aws &>/dev/null; then
        log_info "Installing AWS CLI..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
        log_success "AWS CLI installed successfully"
    fi
}

# eksctl installation
install_eksctl_debian() {
    if ! command -v eksctl &>/dev/null; then
        log_info "Installing eksctl..."
        curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
        sudo mv /tmp/eksctl /usr/local/bin
        log_success "eksctl installed successfully"
    fi
}

install_eksctl_generic() {
    if ! command -v eksctl &>/dev/null; then
        log_info "Installing eksctl..."
        curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
        sudo mv /tmp/eksctl /usr/local/bin
        log_success "eksctl installed successfully"
    fi
}

# Google Cloud CLI installation
install_gcloud_cli_debian() {
    if ! command -v gcloud &>/dev/null; then
        log_info "Installing Google Cloud CLI..."
        curl https://sdk.cloud.google.com | bash
        exec -l "$SHELL"
        gcloud init
        log_success "Google Cloud CLI installed successfully"
    fi
}

install_gcloud_cli_generic() {
    if ! command -v gcloud &>/dev/null; then
        log_info "Installing Google Cloud CLI..."
        curl https://sdk.cloud.google.com | bash
        exec -l "$SHELL"
        log_success "Google Cloud CLI installed successfully"
    fi
}

# Azure CLI installation
install_azure_cli_debian() {
    if ! command -v az &>/dev/null; then
        log_info "Installing Azure CLI..."
        curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
        log_success "Azure CLI installed successfully"
    fi
}

install_azure_cli_generic() {
    if ! command -v az &>/dev/null; then
        log_info "Installing Azure CLI..."
        curl -L https://aka.ms/InstallAzureCli | bash
        log_success "Azure CLI installed successfully"
    fi
}

# Configure cloud provider credentials
configure_cloud_credentials() {
    log_info "Configuring cloud provider credentials..."

    case "$CLOUD_PROVIDER" in
        "aws")
            configure_aws_credentials
            ;;
        "gcp")
            configure_gcp_credentials
            ;;
        "azure")
            configure_azure_credentials
            ;;
    esac
}

configure_aws_credentials() {
    log_info "Configuring AWS credentials..."

    if [[ ! -f "$HOME/.aws/credentials" ]]; then
        log_info "AWS credentials file not found. Please run 'aws configure' manually."
        log_info "You'll need:"
        log_info "  - AWS Access Key ID"
        log_info "  - AWS Secret Access Key"
        log_info "  - Default region (suggested: $AWS_REGION)"
        log_info "  - Default output format (suggested: json)"
        return 1
    fi

    # Validate credentials
    if aws sts get-caller-identity &>/dev/null; then
        log_success "AWS credentials are valid"
        aws sts get-caller-identity
    else
        log_error "AWS credentials are invalid or expired"
        return 1
    fi
}

configure_gcp_credentials() {
    log_info "Configuring GCP credentials..."

    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 &>/dev/null; then
        log_info "Please run 'gcloud auth login' to authenticate with GCP"
        return 1
    fi

    # Set project
    gcloud config set project "$GCP_PROJECT_ID"

    # Enable required APIs
    local required_apis=(
        "container.googleapis.com"
        "compute.googleapis.com"
        "sqladmin.googleapis.com"
        "cloudresourcemanager.googleapis.com"
        "iam.googleapis.com"
    )

    for api in "${required_apis[@]}"; do
        log_info "Enabling API: $api"
        gcloud services enable "$api"
    done

    log_success "GCP configuration completed"
}

configure_azure_credentials() {
    log_info "Configuring Azure credentials..."

    if ! az account show &>/dev/null; then
        log_info "Please run 'az login' to authenticate with Azure"
        return 1
    fi

    # Set subscription
    az account set --subscription "$AZURE_SUBSCRIPTION_ID"

    # Register required providers
    local required_providers=(
        "Microsoft.ContainerService"
        "Microsoft.Compute"
        "Microsoft.Network"
        "Microsoft.Storage"
        "Microsoft.DBforPostgreSQL"
    )

    for provider in "${required_providers[@]}"; do
        log_info "Registering provider: $provider"
        az provider register --namespace "$provider"
    done

    log_success "Azure configuration completed"
}

# Generate SSH keys
generate_ssh_keys() {
    log_info "Generating SSH keys..."

    local ssh_key_path="${HOME}/.ssh/${PROJECT_NAME}"

    if [[ ! -f "${ssh_key_path}" ]]; then
        ssh-keygen -t rsa -b 4096 -f "${ssh_key_path}" -N "" -C "${PROJECT_NAME}@$(hostname)"
        log_success "SSH key generated: ${ssh_key_path}"

        # Add to ssh-agent
        eval "$(ssh-agent -s)"
        ssh-add "${ssh_key_path}"

        log_info "Public key:"
        cat "${ssh_key_path}.pub"
        log_info "Please add this public key to your cloud provider's SSH key management"
    else
        log_info "SSH key already exists: ${ssh_key_path}"
    fi
}

# Setup monitoring tools
setup_monitoring() {
    log_info "Setting up monitoring tools..."

    # Create monitoring namespace
    kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f - || true

    # Add Prometheus Helm repo
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update

    log_success "Monitoring repositories configured"
}

# Validate environment
validate_environment() {
    log_info "Validating environment setup..."

    local validation_errors=()

    # Check required tools
    for tool in "${REQUIRED_TOOLS[@]}"; do
        if ! command -v "$tool" &>/dev/null; then
            validation_errors+=("Missing tool: $tool")
        fi
    done

    # Check cloud provider specific tools
    case "$CLOUD_PROVIDER" in
        "aws")
            if ! command -v aws &>/dev/null; then
                validation_errors+=("Missing AWS CLI")
            fi
            if ! command -v eksctl &>/dev/null; then
                validation_errors+=("Missing eksctl")
            fi
            ;;
        "gcp")
            if ! command -v gcloud &>/dev/null; then
                validation_errors+=("Missing Google Cloud CLI")
            fi
            ;;
        "azure")
            if ! command -v az &>/dev/null; then
                validation_errors+=("Missing Azure CLI")
            fi
            ;;
    esac

    # Check directories
    local required_dirs=(
        "$LOG_DIR"
        "$BACKUP_DIR"
        "$TEMP_DIR"
        "$CONFIG_DIR"
    )

    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            validation_errors+=("Missing directory: $dir")
        fi
    done

    # Report validation results
    if [[ ${#validation_errors[@]} -eq 0 ]]; then
        log_success "Environment validation passed"
        return 0
    else
        log_error "Environment validation failed:"
        for error in "${validation_errors[@]}"; do
            log_error "  - $error"
        done
        return 1
    fi
}

# Create sample Kubernetes manifests
create_sample_manifests() {
    log_info "Creating sample Kubernetes manifests..."

    local k8s_dir="${SCRIPT_DIR}/k8s"

    # Create a sample deployment
    cat <<EOF > "${k8s_dir}/sample-app.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-app
  labels:
    app: sample-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sample-app
  template:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
      - name: sample-app
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
---
apiVersion: v1
kind: Service
metadata:
  name: sample-app
spec:
  selector:
    app: sample-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
EOF

    log_success "Sample Kubernetes manifests created in ${k8s_dir}/"
}

# Main setup function
main() {
    log_info "Starting infrastructure setup..."

    initialize_directories
    install_tools
    configure_cloud_credentials
    generate_ssh_keys
    setup_monitoring
    create_sample_manifests

    if validate_environment; then
        log_success "Setup completed successfully!"
        log_info "Next steps:"
        log_info "1. Run './deploy.sh' to start the deployment"
        log_info "2. Check logs in: $LOG_DIR"
        log_info "3. Configuration files in: $CONFIG_DIR"
    else
        log_error "Setup completed with errors. Please fix the issues and run again."
        exit 1
    fi
}

# Script execution
case "${1:-main}" in
    "main"|"setup")
        main
        ;;
    "tools")
        install_tools
        ;;
    "credentials")
        configure_cloud_credentials
        ;;
    "validate")
        validate_environment
        ;;
    "ssh")
        generate_ssh_keys
        ;;
    "monitoring")
        setup_monitoring
        ;;
    *)
        echo "Usage: $0 [setup|tools|credentials|validate|ssh|monitoring]"
        exit 1
        ;;
esac