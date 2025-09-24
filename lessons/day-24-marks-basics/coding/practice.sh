#!/bin/bash
# Marks Practice Script - DevOps Infrastructure
# Practice file for Day 24: Marks Basics (ma mb 'a 'b `a `b)
# Focus: Bookmark-worthy sections for mark practice

set -euo pipefail

# MARK A: Critical Infrastructure Configuration
# This section contains the most important configuration settings
readonly ENVIRONMENT="${ENVIRONMENT:-production}"
readonly AWS_REGION="${AWS_REGION:-us-west-2}"
readonly CLUSTER_NAME="prod-k8s-cluster"
readonly DOCKER_REGISTRY="registry.company.com"

function setup_critical_infrastructure() {
    echo "=== MARK A: Setting up critical infrastructure ==="

    # Create core namespaces
    kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -
    kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
    kubectl create namespace ingress-nginx --dry-run=client -o yaml | kubectl apply -f -

    # Label namespaces for network policies
    kubectl label namespace production env=production --overwrite
    kubectl label namespace monitoring env=monitoring --overwrite

    echo "Critical infrastructure setup completed"
}

# MARK B: Database Management Section
# Essential database operations and configurations
function manage_database_infrastructure() {
    echo "=== MARK B: Managing database infrastructure ==="

    # Deploy PostgreSQL primary database
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install postgres-primary bitnami/postgresql \
        --namespace databases \
        --create-namespace \
        --set auth.postgresPassword=supersecret \
        --set primary.persistence.size=100Gi \
        --set metrics.enabled=true

    # Deploy Redis for caching
    helm install redis bitnami/redis \
        --namespace databases \
        --set auth.password=redissecret \
        --set master.persistence.size=50Gi \
        --set replica.replicaCount=2

    echo "Database infrastructure setup completed"
}

# MARK C: Security and RBAC Configuration
# Security policies and role-based access control
function configure_security_policies() {
    echo "=== MARK C: Configuring security policies ==="

    # Create service accounts
    kubectl create serviceaccount app-deployer -n production
    kubectl create serviceaccount monitoring-reader -n monitoring
    kubectl create serviceaccount backup-operator -n databases

    # Create cluster roles
    cat > /tmp/rbac-roles.yaml << 'EOF'
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: app-deployer-role
rules:
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: app-deployer-binding
subjects:
- kind: ServiceAccount
  name: app-deployer
  namespace: production
roleRef:
  kind: ClusterRole
  name: app-deployer-role
  apiGroup: rbac.authorization.k8s.io
EOF

    kubectl apply -f /tmp/rbac-roles.yaml
    echo "Security policies configured successfully"
}

# MARK D: Monitoring and Observability Stack
# Comprehensive monitoring setup with Prometheus, Grafana, and alerting
function deploy_monitoring_stack() {
    echo "=== MARK D: Deploying monitoring stack ==="

    # Install kube-prometheus-stack
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --set prometheus.prometheusSpec.retention=30d \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi \
        --set grafana.persistence.enabled=true \
        --set grafana.persistence.size=10Gi \
        --set alertmanager.alertmanagerSpec.storage.volumeClaimTemplate.spec.resources.requests.storage=10Gi

    # Configure custom alerts
    cat > /tmp/custom-alerts.yaml << 'EOF'
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: custom-alerts
  namespace: monitoring
spec:
  groups:
  - name: infrastructure.rules
    rules:
    - alert: HighCPUUsage
      expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High CPU usage on {{ $labels.instance }}"
EOF

    kubectl apply -f /tmp/custom-alerts.yaml
    echo "Monitoring stack deployed successfully"
}

# MARK E: Application Deployment Pipeline
# Core application deployment with all necessary components
function deploy_application_stack() {
    echo "=== MARK E: Deploying application stack ==="

    # Deploy web application
    cat > /tmp/web-app-deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: nginx:alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
  namespace: production
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
EOF

    kubectl apply -f /tmp/web-app-deployment.yaml
    echo "Application stack deployed successfully"
}

# MARK F: Networking and Ingress Configuration
# Network policies, ingress controllers, and traffic management
function configure_networking() {
    echo "=== MARK F: Configuring networking ==="

    # Install ingress-nginx controller
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --set controller.metrics.enabled=true \
        --set controller.podAnnotations."prometheus\.io/scrape"="true"

    # Create ingress resource
    cat > /tmp/app-ingress.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - app.company.com
    secretName: app-tls
  rules:
  - host: app.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-app-service
            port:
              number: 80
EOF

    kubectl apply -f /tmp/app-ingress.yaml
    echo "Networking configuration completed"
}

# MARK G: Backup and Disaster Recovery
# Automated backup procedures and disaster recovery protocols
function setup_backup_procedures() {
    echo "=== MARK G: Setting up backup procedures ==="

    # Install Velero for cluster backups
    helm repo add vmware-tanzu https://vmware-tanzu.github.io/helm-charts
    helm install velero vmware-tanzu/velero \
        --namespace velero \
        --create-namespace \
        --set configuration.provider=aws \
        --set configuration.backupStorageLocation.bucket=cluster-backups \
        --set configuration.backupStorageLocation.config.region=$AWS_REGION

    # Create backup schedule
    cat > /tmp/backup-schedule.yaml << 'EOF'
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: daily-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"
  template:
    includedNamespaces:
    - production
    - databases
    excludedResources:
    - events
    ttl: 720h0m0s
EOF

    kubectl apply -f /tmp/backup-schedule.yaml
    echo "Backup procedures configured successfully"
}

# MARK H: Scaling and Performance Configuration
# Auto-scaling, resource management, and performance optimization
function configure_scaling_performance() {
    echo "=== MARK H: Configuring scaling and performance ==="

    # Create HPA for web application
    cat > /tmp/web-app-hpa.yaml << 'EOF'
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
EOF

    kubectl apply -f /tmp/web-app-hpa.yaml

    # Configure cluster autoscaler
    kubectl annotate deployment.apps/cluster-autoscaler -n kube-system \
        cluster-autoscaler/safe-to-evict="false"

    echo "Scaling and performance configuration completed"
}

# Main orchestration function
function main() {
    local command="${1:-help}"

    case "$command" in
        "infrastructure")
            setup_critical_infrastructure      # Go to MARK A
            ;;
        "database")
            manage_database_infrastructure     # Go to MARK B
            ;;
        "security")
            configure_security_policies       # Go to MARK C
            ;;
        "monitoring")
            deploy_monitoring_stack           # Go to MARK D
            ;;
        "application")
            deploy_application_stack          # Go to MARK E
            ;;
        "networking")
            configure_networking              # Go to MARK F
            ;;
        "backup")
            setup_backup_procedures           # Go to MARK G
            ;;
        "scaling")
            configure_scaling_performance     # Go to MARK H
            ;;
        "full-deploy")
            echo "Executing complete deployment pipeline..."
            setup_critical_infrastructure      # MARK A
            manage_database_infrastructure     # MARK B
            configure_security_policies       # MARK C
            deploy_monitoring_stack           # MARK D
            deploy_application_stack          # MARK E
            configure_networking              # MARK F
            setup_backup_procedures           # MARK G
            configure_scaling_performance     # MARK H
            echo "Full deployment completed successfully"
            ;;
        "help"|*)
            echo "DevOps Infrastructure Management Script"
            echo "Usage: $0 {infrastructure|database|security|monitoring|application|networking|backup|scaling|full-deploy}"
            echo ""
            echo "Mark Locations for Quick Navigation:"
            echo "  MARK A: Critical Infrastructure (line ~20)"
            echo "  MARK B: Database Management (line ~40)"
            echo "  MARK C: Security Configuration (line ~65)"
            echo "  MARK D: Monitoring Stack (line ~100)"
            echo "  MARK E: Application Deployment (line ~140)"
            echo "  MARK F: Networking Configuration (line ~185)"
            echo "  MARK G: Backup Procedures (line ~220)"
            echo "  MARK H: Scaling and Performance (line ~255)"
            ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi