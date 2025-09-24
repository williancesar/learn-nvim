#!/bin/bash
# Poorly Indented DevOps Script - Indent Practice
# Practice file for Day 26: Indent Operations (>> << > < =)
# Focus: Intentionally poor indentation for fixing practice

set -euo pipefail

# Deliberately poor indentation for practice
function deploy_application() {
local app_name="$1"
local environment="$2"

echo "Deploying $app_name to $environment"

if [[ "$environment" == "production" ]]; then
echo "Production deployment requires approval"
read -p "Confirm production deployment (y/N): " confirmation
if [[ "$confirmation" != "y" ]]; then
echo "Deployment cancelled"
return 1
fi
fi

kubectl create namespace "$environment" --dry-run=client -o yaml | kubectl apply -f -

cat > "/tmp/$app_name-deployment.yaml" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
name: $app_name
namespace: $environment
labels:
app: $app_name
environment: $environment
spec:
replicas: 3
selector:
matchLabels:
app: $app_name
template:
metadata:
labels:
app: $app_name
environment: $environment
spec:
containers:
- name: $app_name
image: registry.company.com/$app_name:latest
ports:
- containerPort: 8080
env:
- name: ENVIRONMENT
value: $environment
- name: LOG_LEVEL
value: info
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
port: 8080
initialDelaySeconds: 30
periodSeconds: 10
readinessProbe:
httpGet:
path: /ready
port: 8080
initialDelaySeconds: 5
periodSeconds: 5
EOF

kubectl apply -f "/tmp/$app_name-deployment.yaml"
}

function create_database_config() {
local db_type="$1"
local environment="$2"

case "$db_type" in
"postgresql")
cat > "/tmp/postgres-config.yaml" << EOF
apiVersion: v1
kind: ConfigMap
metadata:
name: postgres-config
namespace: $environment
data:
postgresql.conf: |
# PostgreSQL configuration
shared_preload_libraries = 'pg_stat_statements'
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
EOF
;;
"mysql")
cat > "/tmp/mysql-config.yaml" << EOF
apiVersion: v1
kind: ConfigMap
metadata:
name: mysql-config
namespace: $environment
data:
my.cnf: |
[mysqld]
# MySQL configuration
default-storage-engine = innodb
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_file_per_table = 1
innodb_flush_method = O_DIRECT
max_connections = 200
query_cache_type = 1
query_cache_size = 64M
slow_query_log = 1
long_query_time = 2
EOF
;;
"mongodb")
cat > "/tmp/mongodb-config.yaml" << EOF
apiVersion: v1
kind: ConfigMap
metadata:
name: mongodb-config
namespace: $environment
data:
mongod.conf: |
# MongoDB configuration
storage:
dbPath: /data/db
journal:
enabled: true
systemLog:
destination: file
logAppend: true
path: /var/log/mongodb/mongod.log
net:
port: 27017
bindIp: 0.0.0.0
processManagement:
fork: true
pidFilePath: /var/run/mongodb/mongod.pid
setParameter:
enableLocalhostAuthBypass: false
EOF
;;
esac

kubectl apply -f "/tmp/$db_type-config.yaml"
}

function setup_monitoring_alerts() {
local namespace="$1"

cat > "/tmp/monitoring-alerts.yaml" << EOF
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
name: application-alerts
namespace: $namespace
spec:
groups:
- name: application.rules
interval: 30s
rules:
- alert: HighCPUUsage
expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
for: 5m
labels:
severity: warning
team: infrastructure
annotations:
summary: "High CPU usage on {{ \$labels.instance }}"
description: "CPU usage is {{ \$value }}% for more than 5 minutes"
runbook_url: "https://runbooks.company.com/high-cpu"

- alert: HighMemoryUsage
expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
for: 5m
labels:
severity: critical
team: infrastructure
annotations:
summary: "High memory usage on {{ \$labels.instance }}"
description: "Memory usage is {{ \$value }}% for more than 5 minutes"
runbook_url: "https://runbooks.company.com/high-memory"

- alert: PodCrashLooping
expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
for: 5m
labels:
severity: warning
team: platform
annotations:
summary: "Pod {{ \$labels.namespace }}/{{ \$labels.pod }} is crash looping"
description: "Pod has restarted {{ \$value }} times in the last 15 minutes"

- alert: ServiceDown
expr: up == 0
for: 1m
labels:
severity: critical
team: oncall
annotations:
summary: "Service {{ \$labels.instance }} is down"
description: "Service has been down for more than 1 minute"

- alert: HighResponseTime
expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
for: 10m
labels:
severity: warning
team: development
annotations:
summary: "High response time detected"
description: "95th percentile response time is {{ \$value }}s"

- alert: HighErrorRate
expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
for: 5m
labels:
severity: warning
team: development
annotations:
summary: "High error rate detected"
description: "Error rate is {{ \$value | humanizePercentage }}"
EOF

kubectl apply -f "/tmp/monitoring-alerts.yaml"
}

function configure_network_policies() {
local namespace="$1"

cat > "/tmp/network-policies.yaml" << EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
name: deny-all-ingress
namespace: $namespace
spec:
podSelector: {}
policyTypes:
- Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
name: allow-same-namespace
namespace: $namespace
spec:
podSelector: {}
policyTypes:
- Ingress
ingress:
- from:
- namespaceSelector:
matchLabels:
name: $namespace
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
name: allow-ingress-controller
namespace: $namespace
spec:
podSelector:
matchLabels:
app: web-app
policyTypes:
- Ingress
ingress:
- from:
- namespaceSelector:
matchLabels:
name: ingress-nginx
ports:
- protocol: TCP
port: 8080
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
name: allow-monitoring
namespace: $namespace
spec:
podSelector: {}
policyTypes:
- Ingress
ingress:
- from:
- namespaceSelector:
matchLabels:
name: monitoring
ports:
- protocol: TCP
port: 8080
- protocol: TCP
port: 9090
EOF

kubectl apply -f "/tmp/network-policies.yaml"
}

function setup_rbac_permissions() {
local namespace="$1"

cat > "/tmp/rbac-config.yaml" << EOF
apiVersion: v1
kind: ServiceAccount
metadata:
name: application-deployer
namespace: $namespace
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
namespace: $namespace
name: deployment-manager
rules:
- apiGroups: [""]
resources: ["pods", "services", "configmaps", "secrets"]
verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["apps"]
resources: ["deployments", "replicasets"]
verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["networking.k8s.io"]
resources: ["ingresses", "networkpolicies"]
verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
name: deployment-manager-binding
namespace: $namespace
subjects:
- kind: ServiceAccount
name: application-deployer
namespace: $namespace
roleRef:
kind: Role
name: deployment-manager
apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
name: cluster-reader
rules:
- apiGroups: [""]
resources: ["nodes", "namespaces"]
verbs: ["get", "list", "watch"]
- apiGroups: ["metrics.k8s.io"]
resources: ["nodes", "pods"]
verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
name: cluster-reader-binding
subjects:
- kind: ServiceAccount
name: application-deployer
namespace: $namespace
roleRef:
kind: ClusterRole
name: cluster-reader
apiGroup: rbac.authorization.k8s.io
EOF

kubectl apply -f "/tmp/rbac-config.yaml"
}

function main() {
local command="${1:-help}"

case "$command" in
"deploy")
deploy_application "${2:-demo-app}" "${3:-development}"
;;
"database")
create_database_config "${2:-postgresql}" "${3:-development}"
;;
"monitoring")
setup_monitoring_alerts "${2:-development}"
;;
"network")
configure_network_policies "${2:-development}"
;;
"rbac")
setup_rbac_permissions "${2:-development}"
;;
"all")
deploy_application "demo-app" "development"
create_database_config "postgresql" "development"
setup_monitoring_alerts "development"
configure_network_policies "development"
setup_rbac_permissions "development"
;;
*)
echo "Usage: $0 {deploy|database|monitoring|network|rbac|all}"
echo "Note: This script has poor indentation for practice with >> << > < = commands"
;;
esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
main "$@"
fi