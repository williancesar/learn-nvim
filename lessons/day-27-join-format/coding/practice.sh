#!/bin/bash
# Long Line Formatting Practice Script
# Practice file for Day 27: Join and Format Operations (J gq gw)
# Focus: Long lines that need formatting and joining practice

set -euo pipefail

function deploy_with_very_long_command_line() {
    # This is an intentionally long line that should be broken up for better readability and practice with gq command
    kubectl create deployment web-app --image=registry.company.com/web-app:v2.1.0 --replicas=5 --port=8080 --namespace=production --dry-run=client -o yaml | kubectl apply -f - && kubectl expose deployment web-app --type=LoadBalancer --port=80 --target-port=8080 --namespace=production

    # Another long line for formatting practice
    helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace --set prometheus.prometheusSpec.retention=30d --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi --set grafana.persistence.enabled=true --set grafana.persistence.size=10Gi

    # Long conditional statement that needs formatting
    if [[ "$ENVIRONMENT" == "production" && "$DEPLOY_TYPE" == "blue-green" && "$APPROVAL_STATUS" == "approved" && "$HEALTH_CHECK_PASSED" == "true" && "$SECURITY_SCAN_PASSED" == "true" ]]; then echo "All conditions met for production deployment"; fi

    # Long array declaration that could be formatted better
    local services=("user-service" "order-service" "payment-service" "notification-service" "auth-service" "api-gateway" "database" "cache" "monitoring" "logging")

    # Very long function call with many parameters
    configure_monitoring_stack "$PROMETHEUS_NAMESPACE" "$GRAFANA_ADMIN_PASSWORD" "$ALERTMANAGER_WEBHOOK_URL" "$RETENTION_PERIOD" "$STORAGE_CLASS" "$VOLUME_SIZE" "$REPLICAS" "$CPU_REQUESTS" "$MEMORY_REQUESTS" "$CPU_LIMITS" "$MEMORY_LIMITS"
}

function create_kubernetes_manifest_with_long_lines() {
    # Creating a manifest with intentionally long lines for practice
    cat > /tmp/long-lines-manifest.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-application
  namespace: production
  labels:
    app: web-application
    version: v2.1.0
    environment: production
    team: platform
    component: frontend
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: web-application
  template:
    metadata:
      labels:
        app: web-application
        version: v2.1.0
        environment: production
    spec:
      serviceAccountName: web-application-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      containers:
      - name: web-application
        image: registry.company.com/web-application:v2.1.0
        imagePullPolicy: Always
        ports:
        - name: http
          containerPort: 8080
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-credentials
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: cache-credentials
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secrets
              key: jwt-secret
        - name: API_RATE_LIMIT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: rate-limit
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
          readOnly: true
        - name: secrets-volume
          mountPath: /app/secrets
          readOnly: true
      volumes:
      - name: config-volume
        configMap:
          name: web-application-config
      - name: secrets-volume
        secret:
          secretName: web-application-secrets
      imagePullSecrets:
      - name: registry-credentials
EOF

    # This line is extremely long and should be formatted for better readability using gq command in vim
    echo "Kubernetes manifest created with intentionally long lines that demonstrate the need for proper formatting and line breaking to improve code readability and maintainability"
}

function generate_docker_compose_with_long_configurations() {
    # Long docker-compose configuration for formatting practice
    cat > /tmp/docker-compose-long-lines.yml << 'EOF'
version: '3.8'
services:
  web:
    image: nginx:alpine
    container_name: web-server
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./html:/usr/share/nginx/html:ro
      - ./logs:/var/log/nginx
    environment:
      - NGINX_HOST=company.com
      - NGINX_PORT=80
    depends_on:
      - api
      - database
    networks:
      - frontend
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
      args:
        - NODE_ENV=production
        - BUILD_DATE=${BUILD_DATE}
        - VCS_REF=${VCS_REF}
    container_name: api-server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@database:5432/app_production
      - REDIS_URL=redis://cache:6379
      - JWT_SECRET=${JWT_SECRET}
      - API_RATE_LIMIT=1000
      - SESSION_TIMEOUT=3600
      - LOG_LEVEL=info
      - CORS_ORIGINS=https://company.com,https://app.company.com,https://admin.company.com
    depends_on:
      - database
      - cache
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  database:
    image: postgres:13
    container_name: postgres-database
    environment:
      POSTGRES_DB: app_production
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d app_production"]
      interval: 30s
      timeout: 10s
      retries: 5

  cache:
    image: redis:alpine
    container_name: redis-cache
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf:ro
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
EOF

    # Another extremely long line that needs formatting
    echo "Docker Compose configuration has been generated with intentionally long service definitions that would benefit from proper line formatting and indentation for improved readability and maintenance"
}

function create_terraform_configuration_with_long_lines() {
    # Terraform configuration with long lines for formatting practice
    cat > /tmp/terraform-long-lines.tf << 'EOF'
# This Terraform configuration has intentionally long lines for formatting practice

resource "aws_instance" "web_server" {
  ami = "ami-0c02fb55956c7d316"
  instance_type = "t3.medium"
  key_name = "production-key"
  vpc_security_group_ids = [aws_security_group.web_sg.id, aws_security_group.ssh_sg.id, aws_security_group.monitoring_sg.id]
  subnet_id = aws_subnet.public_subnet.id
  associate_public_ip_address = true
  user_data = base64encode(templatefile("${path.module}/user_data.sh", { environment = "production", application = "web-server", database_host = aws_rds_instance.database.endpoint, redis_host = aws_elasticache_cluster.cache.cache_nodes[0].address }))

  root_block_device {
    volume_type = "gp3"
    volume_size = 50
    throughput = 125
    iops = 3000
    encrypted = true
    kms_key_id = aws_kms_key.ebs_key.arn
    delete_on_termination = true
  }

  tags = {
    Name = "web-server-production"
    Environment = "production"
    Application = "web-application"
    Owner = "platform-team"
    CostCenter = "engineering"
    Backup = "daily"
    MonitoringEnabled = "true"
    SecurityCompliance = "required"
  }
}

resource "aws_rds_instance" "database" {
  identifier = "production-database"
  engine = "postgres"
  engine_version = "13.7"
  instance_class = "db.t3.large"
  allocated_storage = 100
  max_allocated_storage = 1000
  storage_type = "gp3"
  storage_throughput = 125
  iops = 3000
  storage_encrypted = true
  kms_key_id = aws_kms_key.rds_key.arn
  db_name = "application_production"
  username = "app_user"
  password = var.database_password
  vpc_security_group_ids = [aws_security_group.database_sg.id]
  db_subnet_group_name = aws_db_subnet_group.database_subnet_group.name
  backup_retention_period = 30
  backup_window = "03:00-04:00"
  maintenance_window = "sun:04:00-sun:05:00"
  auto_minor_version_upgrade = true
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "production-database-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  copy_tags_to_snapshot = true
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring_role.arn
  performance_insights_enabled = true
  performance_insights_retention_period = 7

  tags = {
    Name = "production-database"
    Environment = "production"
    Application = "web-application"
    Engine = "postgresql"
    BackupSchedule = "daily"
    MonitoringEnabled = "true"
  }
}
EOF

    # Long echo statement for practice
    echo "Terraform configuration file has been created with extremely long resource definitions that demonstrate the importance of proper line formatting and code organization for infrastructure as code maintainability"
}

function process_log_files_with_long_commands() {
    # Long command lines for log processing that need formatting

    # This grep command is intentionally long and should be formatted
    grep -r "ERROR\|FATAL\|CRITICAL" /var/log/application/ --include="*.log" --exclude="*.gz" | awk '{print $1, $2, $3, $NF}' | sort | uniq -c | sort -nr | head -20 | while read count timestamp level message; do echo "Count: $count, Time: $timestamp, Level: $level, Message: $message"; done

    # Long find command that needs formatting
    find /var/log -type f -name "*.log" -mtime +30 -exec ls -la {} \; | awk '{print $9, $5}' | sort -k2 -nr | head -50 | while read file size; do echo "Large log file: $file (${size} bytes)"; done

    # Long sed command for log processing
    sed -n '/ERROR/,/^$/p' /var/log/application.log | sed 's/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} [0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}/[TIMESTAMP]/' | sed 's/ERROR/[ERROR]/g' | sed 's/WARN/[WARNING]/g' | sed 's/INFO/[INFO]/g' > /tmp/processed-errors.log

    # Long awk command for log analysis
    awk 'BEGIN{FS=" "} /ERROR/ {errors++; error_messages[$NF]++} /WARN/ {warnings++; warning_messages[$NF]++} /INFO/ {info++} END {print "Errors:", errors, "Warnings:", warnings, "Info:", info; print "Top error messages:"; for (msg in error_messages) print error_messages[msg], msg | "sort -nr | head -10"}' /var/log/application.log

    echo "Log processing commands have been executed with intentionally long command lines that demonstrate the need for proper formatting and line breaking in shell scripts"
}

function main() {
    local command="${1:-help}"

    case "$command" in
        "deploy")
            deploy_with_very_long_command_line
            ;;
        "k8s")
            create_kubernetes_manifest_with_long_lines
            ;;
        "docker")
            generate_docker_compose_with_long_configurations
            ;;
        "terraform")
            create_terraform_configuration_with_long_lines
            ;;
        "logs")
            process_log_files_with_long_commands
            ;;
        "all")
            deploy_with_very_long_command_line
            create_kubernetes_manifest_with_long_lines
            generate_docker_compose_with_long_configurations
            create_terraform_configuration_with_long_lines
            process_log_files_with_long_commands
            ;;
        *)
            echo "Usage: $0 {deploy|k8s|docker|terraform|logs|all}"
            echo ""
            echo "This script contains intentionally long lines for practice with:"
            echo "  J  - Join lines"
            echo "  gq - Format text (requires textwidth setting)"
            echo "  gw - Format text (preserves cursor position)"
            echo ""
            echo "Commands:"
            echo "  deploy    - Run deployment with long command lines"
            echo "  k8s       - Generate Kubernetes manifests with long lines"
            echo "  docker    - Generate Docker Compose with long configurations"
            echo "  terraform - Create Terraform files with long resource definitions"
            echo "  logs      - Process logs with long command lines"
            echo "  all       - Run all operations"
            ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi