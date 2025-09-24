#!/bin/bash
# Line Number Practice Script for DevOps
# Practice file for Day 23: Line Jumps (G gg 42G :42)
# Focus: Numbered configurations and line-specific operations

set -euo pipefail

# Line 10: Global configuration variables
readonly SCRIPT_VERSION="1.0.0"
readonly CLUSTER_NAME="production-k8s"
readonly AWS_REGION="us-west-2"

# Line 15: Docker registry configuration
readonly DOCKER_REGISTRY="registry.company.com"
readonly IMAGE_TAG="v2.1.0"

# Line 20: Kubernetes namespaces
readonly PROD_NAMESPACE="production"
readonly STAGE_NAMESPACE="staging"
readonly DEV_NAMESPACE="development"

# Line 25: Database configuration
readonly DB_HOST="prod-postgres.rds.amazonaws.com"
readonly DB_PORT="5432"
readonly DB_NAME="application_db"

# Line 30: Redis configuration
readonly REDIS_HOST="elasticache.redis.amazonaws.com"
readonly REDIS_PORT="6379"

# Line 35: Monitoring endpoints
readonly PROMETHEUS_URL="http://prometheus.monitoring.svc:9090"
readonly GRAFANA_URL="http://grafana.monitoring.svc:3000"
readonly ALERTMANAGER_URL="http://alertmanager.monitoring.svc:9093"

# Line 42: Main deployment function
function deploy_application() {
    local app_name="$1"
    local environment="$2"
    local replicas="${3:-3}"

    echo "Deploying $app_name to $environment with $replicas replicas"

    # Line 50: Create deployment manifest
    cat > "/tmp/$app_name-deployment.yaml" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $app_name
  namespace: $environment
spec:
  replicas: $replicas
  selector:
    matchLabels:
      app: $app_name
  template:
    metadata:
      labels:
        app: $app_name
    spec:
      containers:
      - name: $app_name
        image: $DOCKER_REGISTRY/$app_name:$IMAGE_TAG
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          value: "postgresql://user:pass@$DB_HOST:$DB_PORT/$DB_NAME"
        - name: REDIS_URL
          value: "redis://$REDIS_HOST:$REDIS_PORT"
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
EOF

    # Line 80: Apply deployment
    kubectl apply -f "/tmp/$app_name-deployment.yaml"
}

# Line 85: Service creation function
function create_service() {
    local app_name="$1"
    local environment="$2"
    local service_type="${3:-ClusterIP}"

    # Line 90: Generate service manifest
    cat > "/tmp/$app_name-service.yaml" << EOF
apiVersion: v1
kind: Service
metadata:
  name: $app_name-service
  namespace: $environment
spec:
  type: $service_type
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: $app_name
EOF

    # Line 105: Apply service
    kubectl apply -f "/tmp/$app_name-service.yaml"
}

# Line 110: Ingress configuration
function setup_ingress() {
    local app_name="$1"
    local hostname="$2"
    local environment="$3"

    # Line 115: Create ingress manifest
    cat > "/tmp/$app_name-ingress.yaml" << EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: $app_name-ingress
  namespace: $environment
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - $hostname
    secretName: $app_name-tls
  rules:
  - host: $hostname
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: $app_name-service
            port:
              number: 80
EOF

    # Line 140: Apply ingress
    kubectl apply -f "/tmp/$app_name-ingress.yaml"
}

# Line 145: ConfigMap creation
function create_configmap() {
    local app_name="$1"
    local environment="$2"

    # Line 150: Generate configmap
    kubectl create configmap "$app_name-config" \
        --from-literal=environment="$environment" \
        --from-literal=log_level="info" \
        --from-literal=debug="false" \
        --from-literal=metrics_enabled="true" \
        --namespace="$environment"
}

# Line 160: Secret management
function create_secrets() {
    local app_name="$1"
    local environment="$2"

    # Line 165: Create secret for database credentials
    kubectl create secret generic "$app_name-db-secret" \
        --from-literal=username="appuser" \
        --from-literal=password="$(openssl rand -base64 32)" \
        --namespace="$environment"

    # Line 172: Create secret for API keys
    kubectl create secret generic "$app_name-api-secret" \
        --from-literal=api_key="$(openssl rand -hex 32)" \
        --from-literal=jwt_secret="$(openssl rand -base64 64)" \
        --namespace="$environment"
}

# Line 180: HPA configuration
function setup_autoscaling() {
    local app_name="$1"
    local environment="$2"
    local min_replicas="${3:-2}"
    local max_replicas="${4:-10}"

    # Line 186: Create HPA manifest
    cat > "/tmp/$app_name-hpa.yaml" << EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: $app_name-hpa
  namespace: $environment
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: $app_name
  minReplicas: $min_replicas
  maxReplicas: $max_replicas
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

    # Line 210: Apply HPA
    kubectl apply -f "/tmp/$app_name-hpa.yaml"
}

# Line 215: Network policy setup
function configure_network_policy() {
    local app_name="$1"
    local environment="$2"

    # Line 220: Create network policy
    cat > "/tmp/$app_name-netpol.yaml" << EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: $app_name-netpol
  namespace: $environment
spec:
  podSelector:
    matchLabels:
      app: $app_name
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: databases
    ports:
    - protocol: TCP
      port: 5432
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
EOF

    # Line 250: Apply network policy
    kubectl apply -f "/tmp/$app_name-netpol.yaml"
}

# Line 255: Monitoring setup
function setup_monitoring() {
    local app_name="$1"
    local environment="$2"

    # Line 260: Create ServiceMonitor
    cat > "/tmp/$app_name-servicemonitor.yaml" << EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: $app_name-monitor
  namespace: $environment
spec:
  selector:
    matchLabels:
      app: $app_name
  endpoints:
  - port: metrics
    path: /metrics
    interval: 30s
EOF

    # Line 275: Apply ServiceMonitor
    kubectl apply -f "/tmp/$app_name-servicemonitor.yaml"
}

# Line 280: Database migration
function run_database_migration() {
    local app_name="$1"
    local environment="$2"

    # Line 285: Create migration job
    cat > "/tmp/$app_name-migration.yaml" << EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: $app_name-migration-$(date +%s)
  namespace: $environment
spec:
  template:
    spec:
      containers:
      - name: migration
        image: $DOCKER_REGISTRY/$app_name-migrations:$IMAGE_TAG
        env:
        - name: DATABASE_URL
          value: "postgresql://user:pass@$DB_HOST:$DB_PORT/$DB_NAME"
        command: ["npm", "run", "migrate"]
      restartPolicy: Never
  backoffLimit: 3
EOF

    # Line 305: Apply migration job
    kubectl apply -f "/tmp/$app_name-migration.yaml"
}

# Line 310: Backup procedure
function backup_application_data() {
    local app_name="$1"
    local environment="$2"

    # Line 315: Create backup job
    cat > "/tmp/$app_name-backup.yaml" << EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: $app_name-backup
  namespace: $environment
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:13
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: $app_name-db-secret
                  key: password
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h $DB_HOST -U appuser $DB_NAME > /tmp/backup-$(date +%Y%m%d).sql
              aws s3 cp /tmp/backup-$(date +%Y%m%d).sql s3://company-backups/$app_name/
          restartPolicy: OnFailure
EOF

    # Line 340: Apply backup job
    kubectl apply -f "/tmp/$app_name-backup.yaml"
}

# Line 345: Complete application setup
function deploy_complete_application() {
    local app_name="$1"
    local environment="$2"
    local hostname="$3"

    echo "Starting complete deployment of $app_name to $environment"

    # Line 352: Execute all deployment steps
    deploy_application "$app_name" "$environment" 3
    create_service "$app_name" "$environment" "ClusterIP"
    setup_ingress "$app_name" "$hostname" "$environment"
    create_configmap "$app_name" "$environment"
    create_secrets "$app_name" "$environment"
    setup_autoscaling "$app_name" "$environment" 2 10
    configure_network_policy "$app_name" "$environment"
    setup_monitoring "$app_name" "$environment"
    run_database_migration "$app_name" "$environment"
    backup_application_data "$app_name" "$environment"

    # Line 365: Verify deployment
    kubectl get all -n "$environment" -l app="$app_name"

    echo "Complete deployment of $app_name finished successfully"
}

# Line 370: Main function
function main() {
    local command="${1:-help}"

    case "$command" in
        "deploy")
            deploy_complete_application "${2:-demo-app}" "${3:-production}" "${4:-app.company.com}"
            ;;
        "app-only")
            deploy_application "${2:-demo-app}" "${3:-production}" "${4:-3}"
            ;;
        "service")
            create_service "${2:-demo-app}" "${3:-production}" "${4:-ClusterIP}"
            ;;
        "ingress")
            setup_ingress "${2:-demo-app}" "${3:-app.company.com}" "${4:-production}"
            ;;
        "config")
            create_configmap "${2:-demo-app}" "${3:-production}"
            ;;
        "secrets")
            create_secrets "${2:-demo-app}" "${3:-production}"
            ;;
        "hpa")
            setup_autoscaling "${2:-demo-app}" "${3:-production}" "${4:-2}" "${5:-10}"
            ;;
        "netpol")
            configure_network_policy "${2:-demo-app}" "${3:-production}"
            ;;
        "monitor")
            setup_monitoring "${2:-demo-app}" "${3:-production}"
            ;;
        "migrate")
            run_database_migration "${2:-demo-app}" "${3:-production}"
            ;;
        "backup")
            backup_application_data "${2:-demo-app}" "${3:-production}"
            ;;
        *)
            echo "Usage: $0 {deploy|app-only|service|ingress|config|secrets|hpa|netpol|monitor|migrate|backup}"
            echo "Line numbers for quick navigation:"
            echo "  10: Global config"
            echo "  42: Deploy function"
            echo "  85: Service function"
            echo "  110: Ingress function"
            echo "  145: ConfigMap function"
            echo "  160: Secrets function"
            echo "  180: HPA function"
            echo "  215: Network policy function"
            echo "  255: Monitoring function"
            echo "  280: Migration function"
            echo "  310: Backup function"
            echo "  345: Complete deployment function"
            ;;
    esac
}

# Line 415: Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi