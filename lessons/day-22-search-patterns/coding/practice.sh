#!/bin/bash
# Search Pattern Practice Script
# Practice file for Day 22: Search Patterns (/ ? n N * #)
# Focus: Files with searchable patterns and repeated terms

set -euo pipefail

# Configuration with searchable patterns
DOCKER_REGISTRY="registry.company.com"
KUBERNETES_NAMESPACE="production"
MONITORING_NAMESPACE="monitoring"
DATABASE_NAMESPACE="databases"
SECURITY_NAMESPACE="security"

# Function with repeated error handling patterns
function handle_error() {
    local error_message="$1"
    local error_code="${2:-1}"
    echo "ERROR: $error_message" >&2
    echo "ERROR: Exiting with code $error_code" >&2
    exit "$error_code"
}

# Deployment functions with searchable service names
function deploy_user_service() {
    echo "Deploying user_service to $KUBERNETES_NAMESPACE"
    kubectl apply -f manifests/user_service.yaml -n "$KUBERNETES_NAMESPACE"
    kubectl wait --for=condition=available deployment/user_service -n "$KUBERNETES_NAMESPACE" --timeout=300s
    echo "user_service deployment completed successfully"
}

function deploy_order_service() {
    echo "Deploying order_service to $KUBERNETES_NAMESPACE"
    kubectl apply -f manifests/order_service.yaml -n "$KUBERNETES_NAMESPACE"
    kubectl wait --for=condition=available deployment/order_service -n "$KUBERNETES_NAMESPACE" --timeout=300s
    echo "order_service deployment completed successfully"
}

function deploy_payment_service() {
    echo "Deploying payment_service to $KUBERNETES_NAMESPACE"
    kubectl apply -f manifests/payment_service.yaml -n "$KUBERNETES_NAMESPACE"
    kubectl wait --for=condition=available deployment/payment_service -n "$KUBERNETES_NAMESPACE" --timeout=300s
    echo "payment_service deployment completed successfully"
}

function deploy_notification_service() {
    echo "Deploying notification_service to $KUBERNETES_NAMESPACE"
    kubectl apply -f manifests/notification_service.yaml -n "$KUBERNETES_NAMESPACE"
    kubectl wait --for=condition=available deployment/notification_service -n "$KUBERNETES_NAMESPACE" --timeout=300s
    echo "notification_service deployment completed successfully"
}

# Database functions with repeated patterns
function setup_postgres_database() {
    echo "Setting up postgres database in $DATABASE_NAMESPACE"
    helm install postgres bitnami/postgresql --namespace "$DATABASE_NAMESPACE" --create-namespace
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=postgresql -n "$DATABASE_NAMESPACE" --timeout=600s
    echo "postgres database setup completed"
}

function setup_mysql_database() {
    echo "Setting up mysql database in $DATABASE_NAMESPACE"
    helm install mysql bitnami/mysql --namespace "$DATABASE_NAMESPACE" --create-namespace
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=mysql -n "$DATABASE_NAMESPACE" --timeout=600s
    echo "mysql database setup completed"
}

function setup_mongodb_database() {
    echo "Setting up mongodb database in $DATABASE_NAMESPACE"
    helm install mongodb bitnami/mongodb --namespace "$DATABASE_NAMESPACE" --create-namespace
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=mongodb -n "$DATABASE_NAMESPACE" --timeout=600s
    echo "mongodb database setup completed"
}

function setup_redis_cache() {
    echo "Setting up redis cache in $DATABASE_NAMESPACE"
    helm install redis bitnami/redis --namespace "$DATABASE_NAMESPACE" --create-namespace
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=redis -n "$DATABASE_NAMESPACE" --timeout=600s
    echo "redis cache setup completed"
}

# Monitoring functions with searchable patterns
function install_prometheus_monitoring() {
    echo "Installing prometheus monitoring in $MONITORING_NAMESPACE"
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm install prometheus prometheus-community/kube-prometheus-stack --namespace "$MONITORING_NAMESPACE" --create-namespace
    kubectl wait --for=condition=available deployment/prometheus-grafana -n "$MONITORING_NAMESPACE" --timeout=600s
    echo "prometheus monitoring installation completed"
}

function install_grafana_dashboard() {
    echo "Installing grafana dashboard in $MONITORING_NAMESPACE"
    kubectl apply -f monitoring/grafana-dashboard.yaml -n "$MONITORING_NAMESPACE"
    echo "grafana dashboard installation completed"
}

function install_alertmanager_config() {
    echo "Installing alertmanager config in $MONITORING_NAMESPACE"
    kubectl apply -f monitoring/alertmanager-config.yaml -n "$MONITORING_NAMESPACE"
    echo "alertmanager config installation completed"
}

# Security functions with repeated patterns
function configure_network_security() {
    echo "Configuring network security in $SECURITY_NAMESPACE"
    kubectl apply -f security/network-policies.yaml -n "$SECURITY_NAMESPACE"
    kubectl apply -f security/pod-security-policies.yaml -n "$SECURITY_NAMESPACE"
    echo "network security configuration completed"
}

function configure_rbac_security() {
    echo "Configuring rbac security in $SECURITY_NAMESPACE"
    kubectl apply -f security/rbac-roles.yaml -n "$SECURITY_NAMESPACE"
    kubectl apply -f security/rbac-bindings.yaml -n "$SECURITY_NAMESPACE"
    echo "rbac security configuration completed"
}

function configure_ssl_certificates() {
    echo "Configuring ssl certificates in $SECURITY_NAMESPACE"
    kubectl apply -f security/ssl-certificates.yaml -n "$SECURITY_NAMESPACE"
    kubectl apply -f security/cert-manager.yaml -n "$SECURITY_NAMESPACE"
    echo "ssl certificates configuration completed"
}

# Log management with searchable patterns
function setup_elasticsearch_logging() {
    echo "Setting up elasticsearch logging"
    helm repo add elastic https://helm.elastic.co
    helm install elasticsearch elastic/elasticsearch --namespace logging --create-namespace
    kubectl wait --for=condition=ready pod -l app=elasticsearch-master -n logging --timeout=900s
    echo "elasticsearch logging setup completed"
}

function setup_kibana_dashboard() {
    echo "Setting up kibana dashboard"
    helm install kibana elastic/kibana --namespace logging
    kubectl wait --for=condition=available deployment/kibana-kibana -n logging --timeout=600s
    echo "kibana dashboard setup completed"
}

function setup_logstash_pipeline() {
    echo "Setting up logstash pipeline"
    helm install logstash elastic/logstash --namespace logging
    kubectl wait --for=condition=ready pod -l app=logstash-logstash -n logging --timeout=600s
    echo "logstash pipeline setup completed"
}

function setup_filebeat_collector() {
    echo "Setting up filebeat collector"
    helm install filebeat elastic/filebeat --namespace logging
    kubectl wait --for=condition=ready pod -l app=filebeat-filebeat -n logging --timeout=300s
    echo "filebeat collector setup completed"
}

# Load balancer configuration with patterns
function configure_nginx_loadbalancer() {
    echo "Configuring nginx loadbalancer"
    kubectl apply -f loadbalancer/nginx-config.yaml
    kubectl apply -f loadbalancer/nginx-deployment.yaml
    kubectl apply -f loadbalancer/nginx-service.yaml
    echo "nginx loadbalancer configuration completed"
}

function configure_haproxy_loadbalancer() {
    echo "Configuring haproxy loadbalancer"
    kubectl apply -f loadbalancer/haproxy-config.yaml
    kubectl apply -f loadbalancer/haproxy-deployment.yaml
    kubectl apply -f loadbalancer/haproxy-service.yaml
    echo "haproxy loadbalancer configuration completed"
}

# Backup and restore with patterns
function backup_user_data() {
    echo "Starting backup_user_data process"
    kubectl exec -n "$DATABASE_NAMESPACE" postgres-0 -- pg_dump -U postgres users > /tmp/user_data_backup.sql
    aws s3 cp /tmp/user_data_backup.sql s3://company-backups/user_data/
    echo "backup_user_data process completed"
}

function backup_order_data() {
    echo "Starting backup_order_data process"
    kubectl exec -n "$DATABASE_NAMESPACE" postgres-0 -- pg_dump -U postgres orders > /tmp/order_data_backup.sql
    aws s3 cp /tmp/order_data_backup.sql s3://company-backups/order_data/
    echo "backup_order_data process completed"
}

function backup_payment_data() {
    echo "Starting backup_payment_data process"
    kubectl exec -n "$DATABASE_NAMESPACE" postgres-0 -- pg_dump -U postgres payments > /tmp/payment_data_backup.sql
    aws s3 cp /tmp/payment_data_backup.sql s3://company-backups/payment_data/
    echo "backup_payment_data process completed"
}

# Main function with searchable operations
function main() {
    local operation="${1:-help}"
    
    case "$operation" in
        "deploy_services")
            deploy_user_service
            deploy_order_service
            deploy_payment_service
            deploy_notification_service
            ;;
        "setup_databases")
            setup_postgres_database
            setup_mysql_database
            setup_mongodb_database
            setup_redis_cache
            ;;
        "install_monitoring")
            install_prometheus_monitoring
            install_grafana_dashboard
            install_alertmanager_config
            ;;
        "configure_security")
            configure_network_security
            configure_rbac_security
            configure_ssl_certificates
            ;;
        "setup_logging")
            setup_elasticsearch_logging
            setup_kibana_dashboard
            setup_logstash_pipeline
            setup_filebeat_collector
            ;;
        "configure_loadbalancer")
            configure_nginx_loadbalancer
            configure_haproxy_loadbalancer
            ;;
        "backup_data")
            backup_user_data
            backup_order_data
            backup_payment_data
            ;;
        "full_setup")
            deploy_user_service
            deploy_order_service
            deploy_payment_service
            deploy_notification_service
            setup_postgres_database
            setup_redis_cache
            install_prometheus_monitoring
            configure_network_security
            setup_elasticsearch_logging
            configure_nginx_loadbalancer
            ;;
        *)
            echo "Usage: $0 {deploy_services|setup_databases|install_monitoring|configure_security|setup_logging|configure_loadbalancer|backup_data|full_setup}"
            echo "Available operations:"
            echo "  deploy_services      - Deploy all microservices"
            echo "  setup_databases      - Setup all database systems"
            echo "  install_monitoring   - Install monitoring stack"
            echo "  configure_security   - Configure security policies"
            echo "  setup_logging        - Setup logging infrastructure"
            echo "  configure_loadbalancer - Configure load balancers"
            echo "  backup_data          - Backup all data"
            echo "  full_setup           - Complete infrastructure setup"
            ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi