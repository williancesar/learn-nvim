#!/bin/bash
# Operator + Motion Practice Script
# Practice file for Day 20: Combining Operators and Motions (d w, c $, y }, etc.)
# Focus: Various commands and configurations for operator+motion practice

set -euo pipefail

function create_docker_compose_config() {
    cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - api
      - database
    environment:
      - NODE_ENV=production
      - API_URL=http://api:3000

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@database:5432/app
      - REDIS_URL=redis://cache:6379
    depends_on:
      - database
      - cache

  database:
    image: postgres:13
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db_data:/var/lib/postgresql/data

  cache:
    image: redis:alpine
    command: redis-server --appendonly yes
    volumes:
      - cache_data:/data

volumes:
  db_data:
  cache_data:
EOF
}

function setup_kubernetes_cluster() {
    echo "Initializing Kubernetes cluster configuration"
    kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -
    kubectl create namespace staging --dry-run=client -o yaml | kubectl apply -f -
    kubectl create namespace development --dry-run=client -o yaml | kubectl apply -f -

    kubectl label namespace production env=production
    kubectl label namespace staging env=staging
    kubectl label namespace development env=development

    echo "Namespaces created and labeled successfully"
}

function deploy_monitoring_stack() {
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update

    helm install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set prometheus.prometheusSpec.retention=30d \
        --set grafana.adminPassword=secure123

    kubectl wait --for=condition=available deployment/prometheus-grafana -n monitoring --timeout=300s
    kubectl wait --for=condition=available deployment/prometheus-kube-prometheus-operator -n monitoring --timeout=300s

    echo "Monitoring stack deployed successfully"
}

function configure_ingress_rules() {
    cat > ingress-config.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
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
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
EOF

    kubectl apply -f ingress-config.yaml
}

function manage_secrets_configmaps() {
    kubectl create secret generic database-credentials \
        --from-literal=username=dbuser \
        --from-literal=password=securepassword \
        --namespace production

    kubectl create configmap app-config \
        --from-literal=environment=production \
        --from-literal=log_level=info \
        --from-literal=feature_flags=authentication,monitoring,caching \
        --namespace production

    kubectl create configmap nginx-config \
        --from-file=nginx.conf=./configs/nginx.conf \
        --namespace production

    echo "Secrets and ConfigMaps created successfully"
}

function setup_persistent_storage() {
    cat > storage-class.yaml << 'EOF'
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF

    kubectl apply -f storage-class.yaml

    cat > persistent-volume-claim.yaml << 'EOF'
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: database-storage
  namespace: production
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 100Gi
EOF

    kubectl apply -f persistent-volume-claim.yaml
}

function configure_network_policies() {
    cat > network-policy.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
EOF

    kubectl apply -f network-policy.yaml
}

function setup_horizontal_pod_autoscaler() {
    cat > hpa-config.yaml << 'EOF'
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 2
  maxReplicas: 10
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

    kubectl apply -f hpa-config.yaml
}

function manage_rbac_permissions() {
    cat > rbac-config.yaml << 'EOF'
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: deployment-manager
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
  name: deployment-manager-binding
subjects:
- kind: User
  name: deploy-user
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: deployment-sa
  namespace: production
roleRef:
  kind: ClusterRole
  name: deployment-manager
  apiGroup: rbac.authorization.k8s.io
EOF

    kubectl apply -f rbac-config.yaml
}

function backup_restore_procedures() {
    helm install velero vmware-tanzu/velero \
        --namespace velero \
        --create-namespace \
        --set configuration.provider=aws \
        --set configuration.backupStorageLocation.bucket=cluster-backups \
        --set configuration.backupStorageLocation.config.region=us-west-2

    cat > backup-schedule.yaml << 'EOF'
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
    - staging
    excludedResources:
    - events
    ttl: 720h0m0s
EOF

    kubectl apply -f backup-schedule.yaml
}

function main() {
    local operation="${1:-help}"

    case "$operation" in
        "docker")
            create_docker_compose_config
            ;;
        "cluster")
            setup_kubernetes_cluster
            ;;
        "monitoring")
            deploy_monitoring_stack
            ;;
        "ingress")
            configure_ingress_rules
            ;;
        "secrets")
            manage_secrets_configmaps
            ;;
        "storage")
            setup_persistent_storage
            ;;
        "network")
            configure_network_policies
            ;;
        "autoscaling")
            setup_horizontal_pod_autoscaler
            ;;
        "rbac")
            manage_rbac_permissions
            ;;
        "backup")
            backup_restore_procedures
            ;;
        "all")
            setup_kubernetes_cluster
            deploy_monitoring_stack
            configure_ingress_rules
            manage_secrets_configmaps
            setup_persistent_storage
            configure_network_policies
            setup_horizontal_pod_autoscaler
            manage_rbac_permissions
            backup_restore_procedures
            ;;
        *)
            echo "Usage: $0 {docker|cluster|monitoring|ingress|secrets|storage|network|autoscaling|rbac|backup|all}"
            ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi