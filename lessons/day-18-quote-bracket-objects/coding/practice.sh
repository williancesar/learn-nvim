#!/bin/bash
# Advanced Shell Scripting with Complex Quoting
# Practice file for Day 18: Quote and Bracket Text Objects (i" a" i' a' i( a( i[ a[ i{ a})
# Focus: Nested quotes, brackets, and complex expressions

set -euo pipefail

# Configuration arrays and associative arrays for bracket practice
declare -A SERVER_CONFIG=(
    ["web_servers"]="['nginx', 'apache', 'caddy']"
    ["databases"]="['postgresql', 'mysql', 'mongodb']"
    ["cache_systems"]="['redis', 'memcached', 'hazelcast']"
    ["monitoring"]="['prometheus', 'grafana', 'alertmanager']"
)

declare -A DEPLOYMENT_ENVIRONMENTS=(
    ["development"]='{"replicas": 1, "resources": {"cpu": "100m", "memory": "128Mi"}}'
    ["staging"]='{"replicas": 2, "resources": {"cpu": "200m", "memory": "256Mi"}}'
    ["production"]='{"replicas": 5, "resources": {"cpu": "500m", "memory": "1Gi"}}'
)

# Function with complex parameter parsing and quoting
function process_complex_configuration() {
    local config_json="$1"
    local output_format="${2:-yaml}"

    echo "Processing configuration with format: '${output_format}'"

    # Parse JSON configuration with nested quotes
    local app_name=$(echo "$config_json" | jq -r '.application.name // "default-app"')
    local app_version=$(echo "$config_json" | jq -r '.application.version // "latest"')
    local app_env=$(echo "$config_json" | jq -r '.environment // "development"')

    # Create complex deployment command with multiple quote levels
    local deployment_command="kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: \"${app_name}\"
  labels:
    app: \"${app_name}\"
    version: \"${app_version}\"
    environment: \"${app_env}\"
spec:
  replicas: $(echo "${DEPLOYMENT_ENVIRONMENTS[$app_env]}" | jq '.replicas')
  selector:
    matchLabels:
      app: \"${app_name}\"
  template:
    metadata:
      labels:
        app: \"${app_name}\"
        version: \"${app_version}\"
    spec:
      containers:
      - name: \"${app_name}\"
        image: \"registry.company.com/${app_name}:${app_version}\"
        env:
        - name: \"APP_NAME\"
          value: \"${app_name}\"
        - name: \"APP_VERSION\"
          value: \"${app_version}\"
        - name: \"ENVIRONMENT\"
          value: \"${app_env}\"
        resources:
$(echo "${DEPLOYMENT_ENVIRONMENTS[$app_env]}" | jq '.resources' | sed 's/^/          /')
EOF"

    echo "Generated deployment command:"
    echo "$deployment_command"
}

# Advanced JSON and YAML processing with complex quoting
function generate_complex_manifests() {
    local service_name="$1"
    local namespace="${2:-default}"

    # Create service manifest with complex annotations
    cat > "/tmp/${service_name}-service.yaml" << EOF
apiVersion: v1
kind: Service
metadata:
  name: "${service_name}"
  namespace: "${namespace}"
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "tcp"
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
spec:
  type: LoadBalancer
  ports:
  - name: "http"
    port: 80
    targetPort: 8080
    protocol: TCP
  - name: "https"
    port: 443
    targetPort: 8443
    protocol: TCP
  selector:
    app: "${service_name}"
EOF

    # Create configmap with complex configuration
    cat > "/tmp/${service_name}-config.yaml" << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: "${service_name}-config"
  namespace: "${namespace}"
data:
  app.properties: |
    # Application configuration
    server.port=8080
    server.ssl.enabled=true
    server.ssl.key-store=/etc/ssl/keystore.p12
    server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}

    # Database configuration
    spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    spring.datasource.username=${DB_USERNAME}
    spring.datasource.password=${DB_PASSWORD}

    # Redis configuration
    spring.redis.host=${REDIS_HOST}
    spring.redis.port=${REDIS_PORT}
    spring.redis.password=${REDIS_PASSWORD}

  nginx.conf: |
    events {
        worker_connections 1024;
    }

    http {
        upstream backend {
            server ${service_name}:8080;
        }

        server {
            listen 80;
            server_name _;

            location / {
                proxy_pass http://backend;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            location /health {
                access_log off;
                return 200 "OK\n";
                add_header Content-Type text/plain;
            }
        }
    }
EOF

    echo "Generated manifests for service: '${service_name}' in namespace: '${namespace}'"
}

# Complex shell function with nested arrays and associative arrays
function deploy_microservices_stack() {
    local stack_name="$1"
    local environment="$2"

    # Define microservices with complex configuration
    local -A microservices=(
        ["user-service"]='{"port": 8080, "replicas": 3, "database": "postgresql", "cache": "redis"}'
        ["order-service"]='{"port": 8081, "replicas": 5, "database": "mongodb", "cache": "redis"}'
        ["payment-service"]='{"port": 8082, "replicas": 2, "database": "postgresql", "cache": "none"}'
        ["notification-service"]='{"port": 8083, "replicas": 1, "database": "none", "cache": "redis"}'
    )

    echo "Deploying microservices stack: '${stack_name}' to environment: '${environment}'"

    # Deploy each microservice with complex configuration
    for service in "${!microservices[@]}"; do
        local service_config="${microservices[$service]}"
        local port=$(echo "$service_config" | jq -r '.port')
        local replicas=$(echo "$service_config" | jq -r '.replicas')
        local database=$(echo "$service_config" | jq -r '.database')
        local cache=$(echo "$service_config" | jq -r '.cache')

        echo "Deploying service: '${service}' with config: ${service_config}"

        # Generate deployment command with complex parameter substitution
        local deploy_cmd="helm upgrade --install ${service} ./charts/microservice \
            --namespace ${environment} \
            --create-namespace \
            --set image.repository=\"registry.company.com/${service}\" \
            --set image.tag=\"\${IMAGE_TAG:-latest}\" \
            --set service.port=${port} \
            --set replicaCount=${replicas} \
            --set environment=\"${environment}\" \
            --set-string annotations.\"prometheus.io/scrape\"=\"true\" \
            --set-string annotations.\"prometheus.io/port\"=\"${port}\" \
            --set-string annotations.\"prometheus.io/path\"=\"/metrics\""

        # Add database configuration if needed
        if [[ "$database" != "none" ]]; then
            deploy_cmd="${deploy_cmd} \
                --set database.enabled=true \
                --set database.type=\"${database}\" \
                --set database.host=\"${database}-${environment}.database.svc.cluster.local\""
        fi

        # Add cache configuration if needed
        if [[ "$cache" != "none" ]]; then
            deploy_cmd="${deploy_cmd} \
                --set cache.enabled=true \
                --set cache.type=\"${cache}\" \
                --set cache.host=\"${cache}-${environment}.cache.svc.cluster.local\""
        fi

        echo "Executing: ${deploy_cmd}"
        eval "$deploy_cmd"
    done

    echo "Microservices stack '${stack_name}' deployed successfully"
}

# Function with complex JSON manipulation and bracket operations
function manage_configuration_profiles() {
    local profile_name="$1"
    local action="${2:-create}"

    # Complex JSON configuration with nested structures
    local config_template='{
        "profile": {
            "name": "'"$profile_name"'",
            "environment": "production",
            "features": {
                "authentication": {
                    "enabled": true,
                    "providers": ["oauth2", "ldap", "saml"],
                    "settings": {
                        "oauth2": {
                            "client_id": "${OAUTH2_CLIENT_ID}",
                            "client_secret": "${OAUTH2_CLIENT_SECRET}",
                            "scopes": ["read", "write", "admin"]
                        },
                        "ldap": {
                            "server": "${LDAP_SERVER}",
                            "base_dn": "${LDAP_BASE_DN}",
                            "bind_dn": "${LDAP_BIND_DN}",
                            "bind_password": "${LDAP_BIND_PASSWORD}"
                        }
                    }
                },
                "monitoring": {
                    "enabled": true,
                    "metrics": {
                        "prometheus": {
                            "enabled": true,
                            "endpoint": "/metrics",
                            "port": 8080
                        },
                        "jaeger": {
                            "enabled": true,
                            "agent_host": "${JAEGER_AGENT_HOST}",
                            "agent_port": 6831
                        }
                    },
                    "logging": {
                        "level": "INFO",
                        "format": "json",
                        "destinations": ["stdout", "elasticsearch"]
                    }
                },
                "security": {
                    "tls": {
                        "enabled": true,
                        "cert_file": "/etc/ssl/certs/tls.crt",
                        "key_file": "/etc/ssl/private/tls.key"
                    },
                    "cors": {
                        "enabled": true,
                        "allowed_origins": ["https://app.company.com", "https://admin.company.com"],
                        "allowed_methods": ["GET", "POST", "PUT", "DELETE"],
                        "allowed_headers": ["Authorization", "Content-Type"]
                    }
                }
            }
        }
    }'

    case "$action" in
        "create")
            echo "Creating configuration profile: '${profile_name}'"
            echo "$config_template" | jq '.' > "/tmp/profile-${profile_name}.json"
            ;;
        "update")
            echo "Updating configuration profile: '${profile_name}'"
            if [[ -f "/tmp/profile-${profile_name}.json" ]]; then
                local existing_config=$(cat "/tmp/profile-${profile_name}.json")
                echo "$existing_config" | jq --arg name "$profile_name" '.profile.name = $name' > "/tmp/profile-${profile_name}-updated.json"
            fi
            ;;
        "delete")
            echo "Deleting configuration profile: '${profile_name}'"
            rm -f "/tmp/profile-${profile_name}.json" "/tmp/profile-${profile_name}-updated.json"
            ;;
        *)
            echo "Unknown action: '${action}'. Supported actions: [create, update, delete]"
            return 1
            ;;
    esac
}

# Complex function with multiple quote types and bracket operations
function setup_monitoring_dashboards() {
    local dashboard_type="$1"
    local services=("${@:2}")

    echo "Setting up monitoring dashboards for type: '${dashboard_type}'"

    # Create Grafana dashboard JSON with complex nested structures
    local dashboard_json='{
        "dashboard": {
            "id": null,
            "title": "'"${dashboard_type^} Services Dashboard"'",
            "tags": ["'"$dashboard_type"'", "microservices", "monitoring"],
            "timezone": "UTC",
            "panels": [],
            "time": {
                "from": "now-1h",
                "to": "now"
            },
            "timepicker": {
                "refresh_intervals": ["5s", "10s", "30s", "1m", "5m", "15m"],
                "time_options": ["5m", "15m", "1h", "6h", "12h", "24h", "2d", "7d", "30d"]
            }
        }
    }'

    # Add panels for each service
    local panel_id=1
    for service in "${services[@]}"; do
        echo "Adding panel for service: '${service}'"

        # Create panel configuration with complex query expressions
        local panel_config='{
            "id": '"$panel_id"',
            "title": "'"${service^} Metrics"'",
            "type": "graph",
            "targets": [
                {
                    "expr": "rate(http_requests_total{service=\"'"$service"'\"}[5m])",
                    "legendFormat": "{{method}} {{status}}"
                },
                {
                    "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service=\"'"$service"'\"}[5m]))",
                    "legendFormat": "95th percentile"
                }
            ],
            "yAxes": [
                {
                    "label": "Requests/sec",
                    "min": 0
                },
                {
                    "label": "Latency (s)",
                    "min": 0
                }
            ],
            "gridPos": {
                "h": 8,
                "w": 12,
                "x": 0,
                "y": '$((($panel_id - 1) * 8))'
            }
        }'

        # Add panel to dashboard
        dashboard_json=$(echo "$dashboard_json" | jq --argjson panel "$panel_config" '.dashboard.panels += [$panel]')

        ((panel_id++))
    done

    # Save dashboard configuration
    echo "$dashboard_json" > "/tmp/dashboard-${dashboard_type}.json"

    # Import dashboard to Grafana
    local grafana_url="${GRAFANA_URL:-http://grafana.monitoring.svc.cluster.local:3000}"
    local grafana_token="${GRAFANA_TOKEN:-admin}"

    curl -X POST \
        -H "Authorization: Bearer ${grafana_token}" \
        -H "Content-Type: application/json" \
        -d @"/tmp/dashboard-${dashboard_type}.json" \
        "${grafana_url}/api/dashboards/db"

    echo "Dashboard '${dashboard_type}' imported to Grafana successfully"
}

# Main function with complex command parsing
function main() {
    local command="${1:-help}"

    echo "Starting advanced DevOps script with complex quoting and bracket operations"

    case "$command" in
        "config")
            shift
            local config='{"application": {"name": "'"${1:-demo-app}"'", "version": "'"${2:-v1.0.0}"'"}, "environment": "'"${3:-development}"'"}'
            process_complex_configuration "$config" "${4:-yaml}"
            ;;
        "manifests")
            shift
            generate_complex_manifests "${1:-demo-service}" "${2:-default}"
            ;;
        "deploy")
            shift
            deploy_microservices_stack "${1:-demo-stack}" "${2:-development}"
            ;;
        "profile")
            shift
            manage_configuration_profiles "${1:-default}" "${2:-create}"
            ;;
        "dashboard")
            shift
            local dashboard_type="$1"
            shift
            local services=("$@")
            if [[ ${#services[@]} -eq 0 ]]; then
                services=("user-service" "order-service" "payment-service")
            fi
            setup_monitoring_dashboards "$dashboard_type" "${services[@]}"
            ;;
        "test-quotes")
            echo "Testing various quote combinations:"
            echo 'Single quotes: '\''text with single quotes'\'''
            echo "Double quotes: \"text with double quotes\""
            echo "Mixed quotes: 'outer single \"inner double\" back to single'"
            echo 'Escaped quotes: '\''single'\'' and "double"'
            ;;
        "test-brackets")
            echo "Testing bracket operations:"
            local array=(item1 item2 item3)
            echo "Array access: [0]=${array[0]}, [1]=${array[1]}, [2]=${array[2]}"
            echo "Array slice: [*]=(${array[*]})"
            echo "Array indices: [!*]=(${!array[*]})"
            ;;
        "help"|*)
            echo "Usage: $0 {config|manifests|deploy|profile|dashboard|test-quotes|test-brackets}"
            echo ""
            echo "Commands:"
            echo "  config <name> <version> <env> [format]    - Process complex configuration"
            echo "  manifests <service> [namespace]           - Generate Kubernetes manifests"
            echo "  deploy <stack> <environment>              - Deploy microservices stack"
            echo "  profile <name> [action]                   - Manage configuration profiles"
            echo "  dashboard <type> [services...]            - Setup monitoring dashboards"
            echo "  test-quotes                               - Test quote combinations"
            echo "  test-brackets                             - Test bracket operations"
            ;;
    esac

    echo "Script execution completed"
}

# Execute main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi