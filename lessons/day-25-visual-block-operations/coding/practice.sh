#!/bin/bash
# Visual Block Operations Practice - Tabular Data Management
# Practice file for Day 25: Visual Block Operations (Ctrl+V I A r)
# Focus: Tabular data and aligned configurations for visual block editing

set -euo pipefail

# Tabular server configuration data
declare -a SERVERS=(
    "web-01     192.168.1.10    8080    running    nginx       2GB     4cores"
    "web-02     192.168.1.11    8080    running    nginx       2GB     4cores"
    "web-03     192.168.1.12    8080    stopped    nginx       2GB     4cores"
    "api-01     192.168.1.20    3000    running    node        4GB     8cores"
    "api-02     192.168.1.21    3000    running    node        4GB     8cores"
    "api-03     192.168.1.22    3000    stopped    node        4GB     8cores"
    "db-01      192.168.1.30    5432    running    postgres    8GB     16cores"
    "db-02      192.168.1.31    5432    running    postgres    8GB     16cores"
    "cache-01   192.168.1.40    6379    running    redis       1GB     2cores"
    "cache-02   192.168.1.41    6379    running    redis       1GB     2cores"
)

# Database connection configuration table
declare -a DATABASE_CONFIGS=(
    "prod_users      postgresql    prod-db-01.company.com    5432    users_db       app_user    encrypted"
    "prod_orders     postgresql    prod-db-01.company.com    5432    orders_db      app_user    encrypted"
    "prod_payments   postgresql    prod-db-02.company.com    5432    payments_db    app_user    encrypted"
    "stage_users     postgresql    stage-db-01.company.com   5432    users_db       app_user    plaintext"
    "stage_orders    postgresql    stage-db-01.company.com   5432    orders_db      app_user    plaintext"
    "dev_users       postgresql    dev-db-01.company.com     5432    users_db       app_user    plaintext"
    "dev_orders      postgresql    dev-db-01.company.com     5432    orders_db      app_user    plaintext"
    "cache_prod      redis         prod-cache.company.com    6379    cache_db       app_user    encrypted"
    "cache_stage     redis         stage-cache.company.com   6379    cache_db       app_user    plaintext"
    "cache_dev       redis         dev-cache.company.com     6379    cache_db       app_user    plaintext"
)

# Service endpoint configuration matrix
declare -a SERVICE_ENDPOINTS=(
    "user-service      /api/v1/users           GET,POST,PUT,DELETE    auth-required    rate-limited"
    "user-service      /api/v1/users/{id}      GET,PUT,DELETE         auth-required    rate-limited"
    "order-service     /api/v1/orders          GET,POST               auth-required    rate-limited"
    "order-service     /api/v1/orders/{id}     GET,PUT,DELETE         auth-required    rate-limited"
    "payment-service   /api/v1/payments        POST                   auth-required    no-limit"
    "payment-service   /api/v1/payments/{id}   GET                    auth-required    no-limit"
    "auth-service      /api/v1/auth/login      POST                   public           rate-limited"
    "auth-service      /api/v1/auth/logout     POST                   auth-required    no-limit"
    "auth-service      /api/v1/auth/refresh    POST                   auth-required    rate-limited"
    "notification-svc  /api/v1/notifications   GET,POST               auth-required    rate-limited"
)

# Kubernetes resource allocation table
declare -a K8S_RESOURCES=(
    "user-service      3     100m    200Mi   500m    1Gi     web-tier      ClusterIP    80"
    "order-service     5     200m    256Mi   1000m   2Gi     web-tier      ClusterIP    80"
    "payment-service   2     500m    512Mi   2000m   4Gi     secure-tier   ClusterIP    80"
    "auth-service      3     100m    128Mi   500m    512Mi   web-tier      ClusterIP    80"
    "notification-svc  1     50m     64Mi    200m    256Mi   web-tier      ClusterIP    80"
    "database          1     1000m   2Gi     4000m   8Gi     data-tier     ClusterIP    5432"
    "redis-cache       2     100m    256Mi   500m    1Gi     cache-tier    ClusterIP    6379"
    "nginx-ingress     2     200m    128Mi   1000m   512Mi   ingress-tier  LoadBalancer 80,443"
    "prometheus        1     500m    1Gi     2000m   4Gi     monitor-tier  ClusterIP    9090"
    "grafana           1     100m    256Mi   500m    1Gi     monitor-tier  ClusterIP    3000"
)

# Environment variable configuration matrix
declare -a ENV_CONFIGS=(
    "NODE_ENV                production    staging      development"
    "DATABASE_URL            prod-db-url   stage-db-url dev-db-url"
    "REDIS_URL               prod-redis    stage-redis  dev-redis"
    "JWT_SECRET              prod-secret   stage-secret dev-secret"
    "API_RATE_LIMIT          1000          500          100"
    "SESSION_TIMEOUT         3600          1800         900"
    "LOG_LEVEL               warn          info         debug"
    "METRICS_ENABLED         true          true         false"
    "DEBUG_MODE              false         false        true"
    "CORS_ORIGINS            prod-domains  stage-domain localhost"
)

# Docker image tags and versions matrix
declare -a DOCKER_IMAGES=(
    "user-service      v2.1.0    v2.0.5    v1.9.2    registry.company.com/user-service"
    "order-service     v1.8.1    v1.8.0    v1.7.3    registry.company.com/order-service"
    "payment-service   v3.2.0    v3.1.8    v3.0.1    registry.company.com/payment-service"
    "auth-service      v1.5.2    v1.5.1    v1.4.9    registry.company.com/auth-service"
    "notification-svc  v1.2.0    v1.1.8    v1.0.5    registry.company.com/notification-service"
    "nginx             1.21      1.20      1.19      nginx"
    "postgres          13.7      13.6      12.11     postgres"
    "redis             6.2       6.0       5.0       redis"
    "prometheus        2.36      2.35      2.34      prom/prometheus"
    "grafana           9.0       8.5       8.0       grafana/grafana"
)

# Network security rules table
declare -a SECURITY_RULES=(
    "allow-web-http       tcp     80      0.0.0.0/0         web-tier         ingress"
    "allow-web-https      tcp     443     0.0.0.0/0         web-tier         ingress"
    "allow-api-internal   tcp     8080    10.0.0.0/16       web-tier         ingress"
    "allow-db-access      tcp     5432    10.0.1.0/24       data-tier        ingress"
    "allow-redis-access   tcp     6379    10.0.1.0/24       cache-tier       ingress"
    "allow-monitoring     tcp     9090    10.0.2.0/24       monitor-tier     ingress"
    "allow-ssh-mgmt       tcp     22      10.0.100.0/24     all-tiers        ingress"
    "deny-all-external    all     all     0.0.0.0/0         all-tiers        egress"
    "allow-dns            udp     53      8.8.8.8/32        all-tiers        egress"
    "allow-ntp            udp     123     pool.ntp.org      all-tiers        egress"
)

# Alert configuration matrix
declare -a ALERT_CONFIGS=(
    "HighCPUUsage          >80%      5min    warning    email,slack       infrastructure-team"
    "HighMemoryUsage       >85%      5min    critical   email,slack,pager infrastructure-team"
    "DiskSpaceLow          <10%      1min    critical   email,slack,pager infrastructure-team"
    "ServiceDown           >1min     1min    critical   email,slack,pager oncall-team"
    "HighResponseTime      >500ms    5min    warning    email,slack       development-team"
    "ErrorRateHigh         >5%       2min    warning    email,slack       development-team"
    "DatabaseConnError     >0        1min    critical   email,slack,pager database-team"
    "SSLCertExpiring       <30days   1day    warning    email             security-team"
    "BackupFailed          >0        1min    critical   email,slack,pager infrastructure-team"
    "SecurityBreach        >0        immediate critical email,slack,pager security-team"
)

function display_server_status() {
    echo "=== Server Status Report ==="
    printf "%-10s %-15s %-8s %-10s %-12s %-8s %-8s\n" \
           "NAME" "IP_ADDRESS" "PORT" "STATUS" "SERVICE" "MEMORY" "CPU"
    printf "%s\n" "$(printf '%.0s-' {1..80})"

    for server in "${SERVERS[@]}"; do
        printf "%-10s %-15s %-8s %-10s %-12s %-8s %-8s\n" $server
    done
}

function display_database_configs() {
    echo "=== Database Configuration Matrix ==="
    printf "%-15s %-12s %-30s %-8s %-15s %-12s %-12s\n" \
           "CONFIG_NAME" "DB_TYPE" "HOSTNAME" "PORT" "DATABASE" "USERNAME" "ENCRYPTION"
    printf "%s\n" "$(printf '%.0s-' {1..100})"

    for config in "${DATABASE_CONFIGS[@]}"; do
        printf "%-15s %-12s %-30s %-8s %-15s %-12s %-12s\n" $config
    done
}

function display_service_endpoints() {
    echo "=== Service Endpoint Configuration ==="
    printf "%-18s %-25s %-25s %-15s %-15s\n" \
           "SERVICE" "ENDPOINT" "METHODS" "AUTH" "RATE_LIMIT"
    printf "%s\n" "$(printf '%.0s-' {1..95})"

    for endpoint in "${SERVICE_ENDPOINTS[@]}"; do
        printf "%-18s %-25s %-25s %-15s %-15s\n" $endpoint
    done
}

function display_k8s_resources() {
    echo "=== Kubernetes Resource Allocation ==="
    printf "%-18s %-5s %-8s %-8s %-8s %-8s %-15s %-12s %-8s\n" \
           "SERVICE" "PODS" "CPU_REQ" "MEM_REQ" "CPU_LIM" "MEM_LIM" "TIER" "SVC_TYPE" "PORT"
    printf "%s\n" "$(printf '%.0s-' {1..110})"

    for resource in "${K8S_RESOURCES[@]}"; do
        printf "%-18s %-5s %-8s %-8s %-8s %-8s %-15s %-12s %-8s\n" $resource
    done
}

function display_env_configs() {
    echo "=== Environment Variable Configuration ==="
    printf "%-25s %-15s %-15s %-15s\n" \
           "VARIABLE" "PRODUCTION" "STAGING" "DEVELOPMENT"
    printf "%s\n" "$(printf '%.0s-' {1..75})"

    for env_var in "${ENV_CONFIGS[@]}"; do
        printf "%-25s %-15s %-15s %-15s\n" $env_var
    done
}

function display_docker_images() {
    echo "=== Docker Image Version Matrix ==="
    printf "%-18s %-10s %-10s %-10s %-45s\n" \
           "SERVICE" "LATEST" "STABLE" "PREVIOUS" "REGISTRY"
    printf "%s\n" "$(printf '%.0s-' {1..95})"

    for image in "${DOCKER_IMAGES[@]}"; do
        printf "%-18s %-10s %-10s %-10s %-45s\n" $image
    done
}

function display_security_rules() {
    echo "=== Network Security Rules ==="
    printf "%-20s %-8s %-8s %-18s %-15s %-10s\n" \
           "RULE_NAME" "PROTOCOL" "PORT" "SOURCE" "TARGET" "DIRECTION"
    printf "%s\n" "$(printf '%.0s-' {1..85})"

    for rule in "${SECURITY_RULES[@]}"; do
        printf "%-20s %-8s %-8s %-18s %-15s %-10s\n" $rule
    done
}

function display_alert_configs() {
    echo "=== Alert Configuration Matrix ==="
    printf "%-20s %-10s %-8s %-10s %-20s %-20s\n" \
           "ALERT_NAME" "THRESHOLD" "DURATION" "SEVERITY" "CHANNELS" "TEAM"
    printf "%s\n" "$(printf '%.0s-' {1..95})"

    for alert in "${ALERT_CONFIGS[@]}"; do
        printf "%-20s %-10s %-8s %-10s %-20s %-20s\n" $alert
    done
}

function export_configurations() {
    local output_format="${1:-table}"

    case "$output_format" in
        "csv")
            echo "Exporting configurations to CSV format..."
            # Export logic for CSV would go here
            ;;
        "json")
            echo "Exporting configurations to JSON format..."
            # Export logic for JSON would go here
            ;;
        "yaml")
            echo "Exporting configurations to YAML format..."
            # Export logic for YAML would go here
            ;;
        *)
            echo "Displaying all configurations in table format..."
            display_server_status
            echo
            display_database_configs
            echo
            display_service_endpoints
            echo
            display_k8s_resources
            echo
            display_env_configs
            echo
            display_docker_images
            echo
            display_security_rules
            echo
            display_alert_configs
            ;;
    esac
}

function main() {
    local command="${1:-all}"

    case "$command" in
        "servers")
            display_server_status
            ;;
        "databases")
            display_database_configs
            ;;
        "endpoints")
            display_service_endpoints
            ;;
        "k8s")
            display_k8s_resources
            ;;
        "env")
            display_env_configs
            ;;
        "images")
            display_docker_images
            ;;
        "security")
            display_security_rules
            ;;
        "alerts")
            display_alert_configs
            ;;
        "export")
            export_configurations "${2:-table}"
            ;;
        "all"|*)
            export_configurations "table"
            ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi