#!/bin/bash

# =============================================================================
# Day 01: Escape & Modes Practice Script
# =============================================================================
#
# PRACTICE INSTRUCTIONS:
# 1. Open this file in Neovim: nvim practice.sh
# 2. Practice switching between modes:
#    - Start in Normal mode (default)
#    - Press 'i' to enter Insert mode at cursor
#    - Press 'a' to enter Insert mode after cursor
#    - Press 'o' to enter Insert mode on new line below
#    - Press 'O' to enter Insert mode on new line above
#    - Press <Esc> to return to Normal mode
# 3. Practice with the TODO markers below
# 4. Use 'v' for Visual mode, 'V' for Visual Line mode
# 5. Use ':' to enter Command mode
#
# GOAL: Build muscle memory for mode switching without thinking about it
# =============================================================================

set -euo pipefail

# Global configuration variables
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="${SCRIPT_DIR}/deployment.log"
readonly CONFIG_FILE="${SCRIPT_DIR}/app.conf"

# TODO: Add your name here (Practice entering Insert mode)
DEPLOYMENT_AUTHOR=""

# TODO: Set the application version (Practice 'a' to append)
APP_VERSION=""

# TODO: Define the deployment environment (Practice 'o' to open new line)

# TODO: Add deployment timestamp variable (Practice 'O' to open line above)

# System monitoring function
function check_system_health() {
    echo "=== System Health Check ==="

    # TODO: Add disk space check command here

    # TODO: Add memory usage check here

    # TODO: Add CPU load check here

    echo "Health check completed at $(date)"
}

# Docker container management
function manage_containers() {
    local action="${1:-status}"

    case "${action}" in
        "start")
            # TODO: Add docker start command
            ;;
        "stop")
            # TODO: Add docker stop command
            ;;
        "restart")
            # TODO: Add docker restart command
            ;;
        "status")
            echo "=== Container Status ==="
            # TODO: Add docker ps command
            ;;
        *)
            echo "Usage: manage_containers {start|stop|restart|status}"
            return 1
            ;;
    esac
}

# Database backup function
function backup_database() {
    local db_name="${1:-app_db}"
    local backup_dir="${2:-/backup}"

    # TODO: Add database connection check

    # TODO: Add mysqldump or pg_dump command

    # TODO: Add backup verification

    echo "Database backup completed for: ${db_name}"
}

# Log rotation function
function rotate_logs() {
    local log_dir="${1:-/var/log/app}"
    local retention_days="${2:-30}"

    echo "=== Log Rotation Started ==="

    # TODO: Add find command to locate old logs

    # TODO: Add compression command for old logs

    # TODO: Add cleanup command for very old logs

    echo "Log rotation completed"
}

# SSL certificate check
function check_ssl_certificates() {
    local domain="${1:-example.com}"

    echo "=== SSL Certificate Check for ${domain} ==="

    # TODO: Add openssl command to check certificate

    # TODO: Add expiration date extraction

    # TODO: Add warning for certificates expiring soon
}

# Network connectivity test
function test_network_connectivity() {
    local targets=("google.com" "github.com" "stackoverflow.com")

    echo "=== Network Connectivity Test ==="

    for target in "${targets[@]}"; do
        # TODO: Add ping command for each target

        # TODO: Add curl command to test HTTP connectivity

        echo "Tested connectivity to: ${target}"
    done
}

# Service status checker
function check_service_status() {
    local services=("nginx" "mysql" "redis" "docker")

    echo "=== Service Status Check ==="

    for service in "${services[@]}"; do
        # TODO: Add systemctl status command

        # TODO: Add service restart if not running

        echo "Checked service: ${service}"
    done
}

# Main execution function
function main() {
    echo "=== DevOps Deployment Script ==="
    echo "Started at: $(date)"

    # TODO: Call check_system_health function

    # TODO: Call manage_containers with "status" parameter

    # TODO: Call backup_database function

    # TODO: Call rotate_logs function

    # TODO: Call check_ssl_certificates function

    # TODO: Call test_network_connectivity function

    # TODO: Call check_service_status function

    echo "=== Deployment Complete ==="
    echo "Finished at: $(date)"
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

# TODO: Add cleanup trap function (Practice Command mode with :)

# TODO: Add error handling with custom exit codes

# TODO: Add logging function that writes to LOG_FILE