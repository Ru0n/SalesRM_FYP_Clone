# Deployment Guide (Outline)

## 1. Introduction

This document provides a high-level overview and considerations for deploying the SFA Platform application (Django backend + React frontend) to a production or staging environment. Specific steps will vary greatly depending on the chosen hosting provider (e.g., AWS, Google Cloud, Heroku, DigitalOcean, PythonAnywhere) and infrastructure setup (e.g., VMs, Containers/Docker, PaaS).

**Note:** While local development uses `conda` for environment management, production deployments typically utilize standard Python `virtualenv`, Docker containers, or platform-specific environment management. This guide primarily assumes a traditional Linux server setup using `virtualenv`. Adapt steps as needed for other deployment targets.

## 2. Prerequisites for Deployment Server (Example: Linux VM)

*   Linux Server (Ubuntu LTS recommended).
*   Python 3.x (System install or managed via tools like `pyenv`).
*   `pip` package manager.
*   `virtualenv` tool (`pip install virtualenv`).
*   **PostgreSQL Server** (Can be on the same server or, preferably, a managed database service like AWS RDS, Google Cloud SQL, Heroku Postgres). PostgreSQL client tools (`postgresql-client` or similar package).
*   Web Server (Nginx highly recommended for performance and serving static files).
*   Application Server (Gunicorn highly recommended for Django).
*   Process Manager (Systemd is standard on most modern Linux distros; Supervisor is an alternative).
*   Node.js & npm/yarn (Needed only for the frontend build process, can be done on a separate build machine/CI or installed temporarily on the server).
*   Git (For pulling code).
*   (Optional) Redis or RabbitMQ Server (If using Celery for background tasks).
*   (Optional but Recommended) SSL/TLS Certificate (Use Let's Encrypt via Certbot for free certificates).

## 3. Deployment Steps Overview (Traditional VM Setup)

### 3.1. Prepare the Server

1.  **Provision Server:** Create a virtual machine instance on your chosen cloud provider.
2.  **Initial Setup:**
    *   SSH into the server.
    *   Update system packages (`sudo apt update && sudo apt upgrade -y`).
    *   Create a dedicated deployment user (e.g., `deploy`) and grant sudo privileges if needed. Avoid deploying as root.
    *   Configure the firewall (e.g., `ufw`) to allow SSH (port 22), HTTP (port 80), and HTTPS (port 443).
3.  **Install Dependencies:**
    *   Install essential tools: `sudo apt install -y python3-pip python3-dev python3-venv libpq-dev postgresql-client postgresql-client-common nginx curl git`
    *   (Optional) Install Node.js/npm if building frontend on the server: Follow official NodeSource instructions or use `nvm`.
    *   (Optional) Install Redis/RabbitMQ server if using Celery.
4.  **Database Setup:**
    *   Install PostgreSQL server (`sudo apt install -y postgresql postgresql-contrib`) OR ensure connection details for a managed database are available.
    *   If local, secure PostgreSQL and create a database and dedicated user for the application with appropriate permissions. Record the credentials securely.

### 3.2. Deploy Backend Code (Django)

1.  **Clone Repository:** As the deploy user, clone the project repository into the user's home directory or a standard location like `/srv/`.
    ```bash
    git clone <repository-url> /srv/sfa-platform
    cd /srv/sfa-platform/backend
    ```
2.  **Create Virtual Environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  **Install Dependencies:** Install production dependencies (which should include `gunicorn`, `psycopg2`, etc.). `psycopg2` (non-binary) might be needed for production instead of `psycopg2-binary`.
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure Environment Variables:** Create a `.env` file in the backend directory. **Do not commit this file.** Populate it with production-specific settings:
    *   `DEBUG = False`
    *   `SECRET_KEY = '<generate_a_strong_random_key>'`
    *   `DATABASE_URL='postgresql://USER:PASSWORD@HOST:PORT/NAME'` (Or individual DB vars)
    *   `ALLOWED_HOSTS = 'yourdomain.com,www.yourdomain.com,server_ip_address'`
    *   Email backend configuration (e.g., using SendGrid, Mailgun via `django-anymail`).
    *   `DJANGO_SETTINGS_MODULE=core.settings.production` (If using separate prod settings file).
    *   Celery Broker URL (if using Celery).
    *   Any other necessary API keys or secrets.
    *   Ensure file permissions restrict access (`chmod 600 .env`).
5.  **Apply Database Migrations:**
    ```bash
    python manage.py migrate
    ```
6.  **Collect Static Files:** Configure `STATIC_ROOT` in `settings.py` (e.g., `BASE_DIR / 'staticfiles'`). Then run:
    ```bash
    python manage.py collectstatic --noinput
    ```
7.  **Configure Gunicorn:**
    *   Test Gunicorn manually: `gunicorn --bind 0.0.0.0:8000 core.wsgi:application` (adjust `core.wsgi` if needed).
    *   Create a **Systemd service file** (e.g., `/etc/systemd/system/gunicorn-sfa.service`) to manage the Gunicorn process. This file should specify the user, working directory, virtual environment path, command to run Gunicorn (binding to a Unix socket is often preferred over a port for Nginx proxying, e.g., `bind unix:/run/gunicorn-sfa.sock`), number of workers, and environment variables (or point to the `.env` file).
    *   Example `gunicorn-sfa.service` snippet:
        ```ini
        [Unit]
        Description=gunicorn daemon for SFA Platform
        After=network.target

        [Service]
        User=deploy
        Group=www-data # Or deploy group
        WorkingDirectory=/srv/sfa-platform/backend
        ExecStart=/srv/sfa-platform/backend/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/run/gunicorn-sfa.sock core.wsgi:application
        EnvironmentFile=/srv/sfa-platform/backend/.env # Load .env if using django-environ or similar

        [Install]
        WantedBy=multi-user.target
        ```
    *   Enable and start the service: `sudo systemctl enable gunicorn-sfa && sudo systemctl start gunicorn-sfa`. Check status: `sudo systemctl status gunicorn-sfa`. Check socket creation in `/run/`.
8.  **Configure Nginx:**
    *   Create an Nginx server block configuration file (e.g., `/etc/nginx/sites-available/sfa-platform`).
    *   Configure it to:
        *   Listen on port 80 (and later 443 for HTTPS).
        *   Set `server_name` to your domain(s).
        *   Define `location /static/ { alias /srv/sfa-platform/backend/staticfiles/; }` to serve collected static files directly.
        *   Define `location /media/ { alias /srv/sfa-platform/backend/media/; }` (if using `MEDIA_ROOT`).
        *   Define `location / { ... }` to proxy requests to the Gunicorn socket:
            ```nginx
            location / {
                proxy_set_header Host $http_host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_pass http://unix:/run/gunicorn-sfa.sock;
            }
            ```
    *   Enable the site: `sudo ln -s /etc/nginx/sites-available/sfa-platform /etc/nginx/sites-enabled/`.
    *   Test Nginx config: `sudo nginx -t`.
    *   Restart Nginx: `sudo systemctl restart nginx`.
9.  **Configure HTTPS (Let's Encrypt):**
    *   Install Certbot: `sudo apt install certbot python3-certbot-nginx`.
    *   Run Certbot to obtain and install certificates: `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`. Follow the prompts. Certbot will modify your Nginx config to handle HTTPS and renewals.

### 3.3. Deploy Frontend Code (React)

1.  **Build Frontend:** On a local machine or CI/CD server:
    ```bash
    cd frontend
    npm install # or yarn install
    npm run build # or yarn build
    ```
2.  **Transfer Build Assets:** Copy the contents of the generated `frontend/dist` (or `build`) directory to the server.
3.  **Configure Nginx to Serve Frontend:**
    *   In the Nginx server block (`/etc/nginx/sites-available/sfa-platform`), modify the `location / { ... }` block (or add new locations) to serve the frontend's static files. Ensure client-side routing works by falling back to `index.html`.
    *   Example relevant Nginx sections:
        ```nginx
        server {
            # ... (listen, server_name, ssl config from Certbot)

            root /srv/sfa-platform/frontend/dist; # Path to your frontend build files
            index index.html index.htm;

            location /static/ { # Django static files
                alias /srv/sfa-platform/backend/staticfiles/;
                expires 1y;
                access_log off;
                add_header Cache-Control "public";
            }

            location /media/ { # Django media files
                alias /srv/sfa-platform/backend/media/;
            }

            location /api/ { # Proxy API calls to Django/Gunicorn
                proxy_set_header Host $http_host;
                # ... other proxy headers
                proxy_pass http://unix:/run/gunicorn-sfa.sock;
            }

            location /admin/ { # Proxy Django admin calls
                 proxy_set_header Host $http_host;
                 # ... other proxy headers
                 proxy_pass http://unix:/run/gunicorn-sfa.sock;
            }

            location / { # Serve React App and handle client-side routing
                try_files $uri $uri/ /index.html;
            }

            # ... (other configs like error pages, logs)
        }
        ```
    *   Test Nginx config (`sudo nginx -t`) and restart (`sudo systemctl restart nginx`).

### 3.4. Configure DNS

*   Point your domain's A record to the server's IP address.

### 3.5. Post-Deployment Checks

*   Access `https://yourdomain.com`. Verify frontend loads and API calls work.
*   Access `https://yourdomain.com/admin/`. Verify Django Admin works.
*   Test core workflows (login, TP submission, DCR creation, etc.).
*   Monitor logs (`/var/log/nginx/`, Gunicorn logs via `journalctl -u gunicorn-sfa`, Django logs if configured).
*   Check Celery worker status if applicable (`sudo systemctl status celery-worker`).

## 4. Automation (CI/CD)

Using tools like GitHub Actions, GitLab CI, Jenkins, or platform-specific deployment tools (Heroku CLI, AWS CodeDeploy) is highly recommended to automate the build, test, and deployment process, reducing manual errors and ensuring consistency.

## 5. Environment Variables & Security

*   **NEVER commit `.env` files or sensitive credentials** to Git. Use environment variables managed securely on the server or via secrets management tools.
*   Keep server software updated.
*   Configure firewall rules strictly.
*   Regularly review logs.
*   Use strong passwords and keys.
*   Ensure `DEBUG = False` in production settings.