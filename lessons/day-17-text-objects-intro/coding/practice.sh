#!/bin/bash
# Kubernetes Configuration Management Script
# Practice file for Day 17: Text Objects Introduction (iw aw ip ap)
# Focus: Words, sentences, and paragraphs for text object practice

set -euo pipefail

# Configuration variables for text object practice
CLUSTER_NAME="production-cluster"
REGION="us-west-2"
NAMESPACE="default"
CONFIG_DIR="/etc/kubernetes"
MANIFESTS_DIR="./manifests"

# Initialize cluster configuration
function initialize_cluster_config() {
    echo "Initializing cluster configuration for ${CLUSTER_NAME}"

    # Create necessary directories for configuration files
    mkdir -p "${CONFIG_DIR}/manifests"
    mkdir -p "${CONFIG_DIR}/certs"
    mkdir -p "${CONFIG_DIR}/policies"

    # Generate cluster configuration with proper settings
    cat > "${CONFIG_DIR}/cluster.yaml" << 'EOF'
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTi...
    server: https://kubernetes.example.com
  name: production-cluster
contexts:
- context:
    cluster: production-cluster
    user: admin
  name: production-context
current-context: production-context
users:
- name: admin
  user:
    client-certificate-data: LS0tLS1CRUdJTi...
    client-key-data: LS0tLS1CRUdJTi...
EOF

    echo "Cluster configuration initialized successfully"
}

# Deploy application workloads
function deploy_application_workloads() {
    local app_name="$1"
    local image_tag="$2"
    local replicas="${3:-3}"

    echo "Deploying application workloads for ${app_name}"

    # Create deployment manifest with proper resource specifications
    kubectl create deployment "${app_name}" \
        --image="nginx:${image_tag}" \
        --replicas="${replicas}" \
        --namespace="${NAMESPACE}" \
        --dry-run=client -o yaml > "${MANIFESTS_DIR}/${app_name}-deployment.yaml"

    # Add resource limits and requests for better resource management
    kubectl patch deployment "${app_name}" \
        --namespace="${NAMESPACE}" \
        --type='merge' \
        --patch='{
            "spec": {
                "template": {
                    "spec": {
                        "containers": [{
                            "name": "nginx",
                            "resources": {
                                "requests": {
                                    "cpu": "100m",
                                    "memory": "128Mi"
                                },
                                "limits": {
                                    "cpu": "500m",
                                    "memory": "512Mi"
                                }
                            }
                        }]
                    }
                }
            }
        }' --dry-run=client -o yaml >> "${MANIFESTS_DIR}/${app_name}-deployment.yaml"

    echo "Application workload deployment completed for ${app_name}"
}

# Configure network policies
function configure_network_policies() {
    echo "Configuring network policies for secure cluster communication"

    # Create deny-all default policy to secure cluster traffic
    cat > "${MANIFESTS_DIR}/deny-all-policy.yaml" << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-traffic
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
EOF

    # Allow specific application communication between microservices
    cat > "${MANIFESTS_DIR}/allow-app-traffic.yaml" << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-communication
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: web-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-gateway
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
EOF

    echo "Network policies configured successfully for secure communication"
}

# Setup monitoring and observability
function setup_monitoring_stack() {
    echo "Setting up comprehensive monitoring and observability stack"

    # Install Prometheus operator for metrics collection
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update

    helm install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set prometheus.prometheusSpec.retention=30d \
        --set grafana.adminPassword=secure-admin-password \
        --set alertmanager.config.global.smtp_smarthost='smtp.company.com:587'

    # Configure custom metrics and alerts for application monitoring
    cat > "${MANIFESTS_DIR}/custom-alerts.yaml" << 'EOF'
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: application-alerts
  namespace: monitoring
spec:
  groups:
  - name: application.rules
    rules:
    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High error rate detected"
        description: "Error rate is {{ $value }} requests per second"

    - alert: HighLatency
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
      for: 10m
      labels:
        severity: critical
      annotations:
        summary: "High latency detected"
        description: "95th percentile latency is {{ $value }} seconds"
EOF

    echo "Monitoring stack setup completed with custom alerting rules"
}

# Manage persistent storage
function manage_persistent_storage() {
    local storage_class="$1"
    local volume_size="$2"

    echo "Managing persistent storage with class ${storage_class}"

    # Create storage class for dynamic provisioning
    cat > "${MANIFESTS_DIR}/storage-class.yaml" << EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ${storage_class}
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF

    # Create persistent volume claim for application data
    cat > "${MANIFESTS_DIR}/app-pvc.yaml" << EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data-pvc
  namespace: ${NAMESPACE}
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ${storage_class}
  resources:
    requests:
      storage: ${volume_size}
EOF

    echo "Persistent storage configuration completed for ${storage_class}"
}

# Configure ingress controllers
function configure_ingress_controllers() {
    echo "Configuring ingress controllers for external traffic management"

    # Install NGINX ingress controller with proper configuration
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update

    helm install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.metrics.enabled=true \
        --set controller.podAnnotations."prometheus\.io/scrape"="true" \
        --set controller.podAnnotations."prometheus\.io/port"="10254"

    # Create ingress resource for application routing
    cat > "${MANIFESTS_DIR}/app-ingress.yaml" << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: default
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - app.example.com
    secretName: app-tls-secret
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
EOF

    echo "Ingress controllers configured for proper traffic routing"
}

# Setup backup and disaster recovery
function setup_backup_disaster_recovery() {
    echo "Setting up backup and disaster recovery procedures"

    # Install Velero for cluster backup and restore
    helm repo add vmware-tanzu https://vmware-tanzu.github.io/helm-charts
    helm repo update

    helm install velero vmware-tanzu/velero \
        --namespace velero \
        --create-namespace \
        --set configuration.provider=aws \
        --set configuration.backupStorageLocation.bucket=cluster-backups \
        --set configuration.backupStorageLocation.config.region=${REGION} \
        --set configuration.volumeSnapshotLocation.config.region=${REGION}

    # Create backup schedule for critical namespaces
    cat > "${MANIFESTS_DIR}/backup-schedule.yaml" << 'EOF'
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: daily-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"
  template:
    includedNamespaces:
    - default
    - production
    - monitoring
    excludedResources:
    - events
    - events.events.k8s.io
    ttl: 720h0m0s
    storageLocation: default
    volumeSnapshotLocations:
    - default
EOF

    echo "Backup and disaster recovery setup completed successfully"
}

# Implement security policies
function implement_security_policies() {
    echo "Implementing comprehensive security policies and controls"

    # Create pod security policy for secure container execution
    cat > "${MANIFESTS_DIR}/pod-security-policy.yaml" << 'EOF'
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
EOF

    # Create RBAC configuration for proper access control
    cat > "${MANIFESTS_DIR}/rbac-config.yaml" << 'EOF'
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: app-manager
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: app-manager-binding
subjects:
- kind: User
  name: app-deployer
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: app-manager
  apiGroup: rbac.authorization.k8s.io
EOF

    echo "Security policies implemented for robust cluster protection"
}

# Run health checks and validation
function run_health_checks() {
    echo "Running comprehensive health checks and cluster validation"

    # Check cluster node status and resource utilization
    kubectl get nodes -o wide
    kubectl top nodes

    # Validate critical system pods are running properly
    kubectl get pods -n kube-system
    kubectl get pods -n monitoring
    kubectl get pods -n ingress-nginx

    # Check resource quotas and limits
    kubectl describe quota -A
    kubectl describe limitrange -A

    # Verify network connectivity between services
    kubectl run test-pod --image=busybox --rm -it -- /bin/sh -c "
        nslookup kubernetes.default.svc.cluster.local &&
        wget -qO- http://app-service.default.svc.cluster.local/health
    "

    echo "Health checks completed - cluster is operational"
}

# Main execution function
function main() {
    local operation="${1:-help}"

    echo "Starting Kubernetes management operations"

    case "$operation" in
        "init")
            initialize_cluster_config
            ;;
        "deploy")
            shift
            deploy_application_workloads "$@"
            ;;
        "network")
            configure_network_policies
            ;;
        "monitor")
            setup_monitoring_stack
            ;;
        "storage")
            shift
            manage_persistent_storage "$@"
            ;;
        "ingress")
            configure_ingress_controllers
            ;;
        "backup")
            setup_backup_disaster_recovery
            ;;
        "security")
            implement_security_policies
            ;;
        "health")
            run_health_checks
            ;;
        "full-setup")
            initialize_cluster_config
            configure_network_policies
            setup_monitoring_stack
            manage_persistent_storage "fast-ssd" "100Gi"
            configure_ingress_controllers
            setup_backup_disaster_recovery
            implement_security_policies
            run_health_checks
            ;;
        "help"|*)
            echo "Usage: $0 {init|deploy|network|monitor|storage|ingress|backup|security|health|full-setup}"
            echo ""
            echo "Operations:"
            echo "  init        - Initialize cluster configuration"
            echo "  deploy      - Deploy application workloads"
            echo "  network     - Configure network policies"
            echo "  monitor     - Setup monitoring stack"
            echo "  storage     - Manage persistent storage"
            echo "  ingress     - Configure ingress controllers"
            echo "  backup      - Setup backup and disaster recovery"
            echo "  security    - Implement security policies"
            echo "  health      - Run health checks"
            echo "  full-setup  - Run complete cluster setup"
            ;;
    esac

    echo "Kubernetes management operations completed successfully"
}

# Execute main function when script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi