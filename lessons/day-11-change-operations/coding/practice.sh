#!/bin/bash

# Legacy Infrastructure Management Script
# This script contains outdated practices that need modernization using change operations
# Practice: cw, ciw, c$, cc, C, ct, cf, ci", ci', ci(, etc.

# Old-style variable declarations (modernize with proper naming)
host_name="legacy-server-01"
port_number="8080"
app_name="legacy-app"
log_file="/var/log/old-app.log"
config_dir="/etc/old-config"
backup_dir="/backup/old"

# Legacy error handling (needs modernization)
function check_error {
    if [ $? -ne 0 ]; then
        echo "Error occurred"
        exit 1
    fi
}

# Old-style function definition (modernize syntax)
function print_log {
    echo "`date`: $1" >> $log_file
}

# Legacy array declaration (modernize)
services="apache nginx mysql redis"

# Old conditional structure (modernize)
if [ "$EUID" = "0" ]
then
    echo "Running as root"
else
    echo "Not running as root"
    exit 1
fi

# Legacy backup function with poor practices
function backup_files {
    cp -r $config_dir $backup_dir/config-`date +%Y%m%d`
    check_error
    tar -czf $backup_dir/app-backup-`date +%Y%m%d`.tar.gz /opt/$app_name
    check_error
    rm -rf /tmp/old-logs/*
}

# Old-style service management
function start_services {
    for service in $services
    do
        service $service start
        check_error
        print_log "Started service: $service"
    done
}

# Legacy configuration file generation
function generate_config {
    echo "# Old configuration file" > $config_dir/app.conf
    echo "hostname=$host_name" >> $config_dir/app.conf
    echo "port=$port_number" >> $config_dir/app.conf
    echo "logfile=$log_file" >> $config_dir/app.conf
    echo "debug=true" >> $config_dir/app.conf
}

# Poor network configuration
function setup_network {
    iptables -A INPUT -p tcp --dport $port_number -j ACCEPT
    iptables -A INPUT -p tcp --dport 22 -j ACCEPT
    iptables -A INPUT -p tcp --dport 443 -j ACCEPT
    iptables -A INPUT -p tcp --dport 80 -j ACCEPT
    iptables -P INPUT DROP
}

# Legacy database setup
function setup_database {
    mysql -u root -p"password123" -e "CREATE DATABASE $app_name;"
    mysql -u root -p"password123" -e "CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'password123';"
    mysql -u root -p"password123" -e "GRANT ALL PRIVILEGES ON $app_name.* TO 'appuser'@'localhost';"
    mysql -u root -p"password123" -e "FLUSH PRIVILEGES;"
}

# Old monitoring setup
function setup_monitoring {
    echo "*/5 * * * * /usr/bin/curl -s http://$host_name:$port_number/health > /dev/null" >> /etc/crontab
    echo "0 2 * * * /usr/bin/find /var/log -name '*.log' -mtime +7 -delete" >> /etc/crontab
    echo "0 3 * * 0 /usr/bin/mysqldump -u root -p'password123' $app_name > $backup_dir/db-backup-`date +%Y%m%d`.sql" >> /etc/crontab
}

# Legacy log rotation
function setup_log_rotation {
    echo "$log_file {" > /etc/logrotate.d/$app_name
    echo "    daily" >> /etc/logrotate.d/$app_name
    echo "    rotate 30" >> /etc/logrotate.d/$app_name
    echo "    compress" >> /etc/logrotate.d/$app_name
    echo "    delaycompress" >> /etc/logrotate.d/$app_name
    echo "    missingok" >> /etc/logrotate.d/$app_name
    echo "    notifempty" >> /etc/logrotate.d/$app_name
    echo "    copytruncate" >> /etc/logrotate.d/$app_name
    echo "}" >> /etc/logrotate.d/$app_name
}

# Poor security configuration
function setup_security {
    chmod 777 $config_dir
    chmod 666 $config_dir/*
    chown root:root $config_dir
    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config
    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config
}

# Legacy package management
function install_packages {
    apt-get update
    apt-get install -y apache2
    apt-get install -y nginx
    apt-get install -y mysql-server
    apt-get install -y redis-server
    apt-get install -y php7.4
    apt-get install -y php7.4-mysql
}

# Old-style system configuration
function configure_system {
    echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    echo "fs.file-max=65536" >> /etc/sysctl.conf
    sysctl -p
}

# Legacy SSL certificate setup
function setup_ssl {
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/$app_name.key -out /etc/ssl/certs/$app_name.crt -subj "/C=US/ST=State/L=City/O=Company/CN=$host_name"
    chmod 600 /etc/ssl/private/$app_name.key
    chmod 644 /etc/ssl/certs/$app_name.crt
}

# Poor firewall configuration
function configure_firewall {
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw allow $port_number
    ufw --force enable
}

# Legacy application deployment
function deploy_application {
    cd /tmp
    wget http://releases.example.com/$app_name-latest.tar.gz
    tar -xzf $app_name-latest.tar.gz
    cp -r $app_name/* /opt/$app_name/
    chown -R www-data:www-data /opt/$app_name
    chmod -R 755 /opt/$app_name
}

# Old-style health check
function health_check {
    response=`curl -s -o /dev/null -w "%{http_code}" http://$host_name:$port_number/health`
    if [ $response -eq 200 ]; then
        print_log "Health check passed"
        return 0
    else
        print_log "Health check failed"
        return 1
    fi
}

# Legacy cleanup function
function cleanup_old_files {
    find /tmp -name "*.tmp" -mtime +1 -delete
    find /var/log -name "*.log" -size +100M -delete
    find $backup_dir -name "*.tar.gz" -mtime +30 -delete
    rm -rf /tmp/$app_name*
}

# Poor service status check
function check_services {
    for service in $services
    do
        status=`service $service status | grep -c "running"`
        if [ $status -eq 1 ]; then
            echo "$service is running"
        else
            echo "$service is not running"
            service $service start
        fi
    done
}

# Legacy environment setup
function setup_environment {
    export PATH=$PATH:/opt/$app_name/bin
    export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
    export CATALINA_HOME=/opt/tomcat
    echo "export PATH=$PATH:/opt/$app_name/bin" >> /etc/environment
    echo "export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64" >> /etc/environment
}

# Old maintenance mode
function enable_maintenance {
    echo "<html><body><h1>Site under maintenance</h1></body></html>" > /var/www/html/maintenance.html
    mv /var/www/html/index.html /var/www/html/index.html.bak
    ln -s /var/www/html/maintenance.html /var/www/html/index.html
}

function disable_maintenance {
    rm /var/www/html/index.html
    mv /var/www/html/index.html.bak /var/www/html/index.html
}

# Legacy update mechanism
function update_application {
    enable_maintenance
    backup_files
    stop_services
    deploy_application
    start_services
    health_check
    if [ $? -eq 0 ]; then
        disable_maintenance
        print_log "Update completed successfully"
    else
        print_log "Update failed, manual intervention required"
    fi
}

# Poor password generation
function generate_passwords {
    db_password="password123"
    admin_password="admin123"
    app_password="app123"
    echo "Database password: $db_password" > /root/passwords.txt
    echo "Admin password: $admin_password" >> /root/passwords.txt
    echo "Application password: $app_password" >> /root/passwords.txt
    chmod 644 /root/passwords.txt
}

# Legacy Docker setup (needs modernization)
function setup_docker {
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker ubuntu
    systemctl enable docker
    systemctl start docker
    docker run hello-world
}

# Old-style configuration validation
function validate_config {
    if [ -f $config_dir/app.conf ]; then
        echo "Config file exists"
    else
        echo "Config file missing"
        exit 1
    fi

    if [ `grep -c "hostname" $config_dir/app.conf` -eq 1 ]; then
        echo "Hostname configured"
    else
        echo "Hostname not configured"
        exit 1
    fi
}

# Legacy main function
function main {
    print_log "Starting legacy infrastructure setup"

    install_packages
    configure_system
    setup_security
    generate_config
    validate_config
    setup_database
    setup_ssl
    configure_firewall
    deploy_application
    start_services
    setup_monitoring
    setup_log_rotation
    generate_passwords

    print_log "Legacy infrastructure setup completed"

    # Final health check
    health_check
    if [ $? -eq 0 ]; then
        print_log "All systems operational"
    else
        print_log "System health check failed"
        exit 1
    fi
}

# Script execution
case "$1" in
    "install")
        install_packages
        ;;
    "config")
        generate_config
        validate_config
        ;;
    "deploy")
        deploy_application
        ;;
    "update")
        update_application
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup_old_files
        ;;
    "maintenance")
        enable_maintenance
        ;;
    "production")
        disable_maintenance
        ;;
    *)
        main
        ;;
esac