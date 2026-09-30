
# Jenkins CI/CD Pipeline — Flask + Express on AWS

A complete Jenkins CI/CD project demonstrating automated deployment of a **Flask backend** and **Express.js frontend** to an **AWS EC2 Ubuntu server** using **Terraform, Jenkins, GitHub Webhooks, systemd, and automated health checks**.

## Project Overview

This project implements two independent CI/CD pipelines:

* **Flask-CICD** — deploys the Flask backend on port `5000`
* **Express-CICD** — deploys the Express frontend on port `3000`

A GitHub webhook is configured to trigger Jenkins when code is pushed to the repository.

The AWS EC2 infrastructure is provisioned using Terraform.

---

## Architecture

```text
                    ┌─────────────────────┐
                    │   GitHub Repository │
                    └──────────┬──────────┘
                               │
                         Push / Webhook
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Jenkins       │
                    │      EC2 :8080      │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
          ┌───────────────┐        ┌───────────────┐
          │ Flask-CICD    │        │ Express-CICD  │
          └───────┬───────┘        └───────┬───────┘
                  │                         │
                  ▼                         ▼
          Flask Backend             Express Frontend
             :5000                      :3000
                  │                         │
                  └──────────┬──────────────┘
                             ▼
                       Health Checks
```

---

## Technology Stack

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| AWS EC2          | Application and Jenkins server |
| Terraform        | Infrastructure provisioning    |
| Jenkins          | CI/CD automation               |
| GitHub           | Source code management         |
| GitHub Webhooks  | Automatic pipeline triggering  |
| Ubuntu 24.04 LTS | Server operating system        |
| Python 3         | Flask backend                  |
| Flask            | Backend application            |
| Node.js 20       | JavaScript runtime             |
| Express.js       | Frontend application           |
| systemd          | Application process management |
| Bash             | Automation and deployment      |

---

## AWS Infrastructure

**Region**

```text
ap-south-1
```

**Operating System**

```text
Ubuntu 24.04 LTS
```

**Instance Type**

```text
t3.micro
```

The EC2 instance was provisioned using Terraform.

### Required Ports

| Port | Purpose          |
| ---: | ---------------- |
|   22 | SSH              |
| 3000 | Express frontend |
| 5000 | Flask backend    |
| 8080 | Jenkins          |

---

## Repository Structure

```text
Jenkins_CICD_Naj/
│
├── Flask/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── Express/
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
│
├── Jenkinsfile-Flask
├── Jenkinsfile-Express
│
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── .terraform.lock.hcl
│
├── screenshots/
├── .gitignore
└── README.md
```

Generated Terraform state and provider directories are excluded from version control.

---

# Infrastructure with Terraform

Terraform provisions the AWS EC2 infrastructure required for the CI/CD environment.

### Terraform Configuration

```text
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
└── .terraform.lock.hcl
```

### Resources

The Terraform configuration creates:

* AWS Security Group
* Ubuntu EC2 instance

### Terraform Workflow

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

After validation and testing, temporary AWS resources can be destroyed to avoid unnecessary costs:

```bash
terraform destroy
```

Terraform state files and generated provider directories are excluded from GitHub.

---

# Flask Backend

The Flask application runs on:

```text
Port: 5000
```

### Health Check

```bash
curl -f http://127.0.0.1:5000/
```

Expected response:

```text
Flask Backend is Running!
```

### Application Features

The backend provides a registration endpoint:

```text
POST /submit
```

Python dependencies are installed using:

```bash
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt
```

---

# Express Frontend

The Express application runs on:

```text
Port: 3000
```

The application provides a student registration form and communicates with the Flask backend.

Backend configuration:

```text
BACKEND_URL=http://127.0.0.1:5000
```

Node.js dependencies are installed using:

```bash
npm ci
```

---

# Process Management with systemd

Both applications run as systemd services.

### Flask

```text
flask-backend.service
```

Check status:

```bash
sudo systemctl status flask-backend
```

Restart:

```bash
sudo systemctl restart flask-backend
```

### Express

```text
express-frontend.service
```

Check status:

```bash
sudo systemctl status express-frontend
```

Restart:

```bash
sudo systemctl restart express-frontend
```

Using systemd allows the applications to run as managed Linux services and restart without manually launching the applications.

---

# Jenkins CI/CD

Two independent Jenkins pipelines are configured:

```text
Flask-CICD
Express-CICD
```

Jenkins runs on the AWS EC2 instance:

```text
http://<EC2-PUBLIC-IP>:8080/
```

---

## Flask CI/CD Pipeline

Pipeline flow:

```text
Checkout
   ↓
Deploy Files
   ↓
Install Dependencies
   ↓
Deploy Flask
   ↓
Health Check
```

The pipeline:

1. Checks out the `main` branch from GitHub.
2. Copies the Flask application to the deployment directory.
3. Creates a Python virtual environment.
4. Installs Python dependencies.
5. Restarts the Flask systemd service.
6. Performs a health check.

Deployment directory:

```text
/opt/jenkins-apps/flask
```

Jenkinsfile:

```text
Jenkinsfile-Flask
```

---

## Express CI/CD Pipeline

Pipeline flow:

```text
Checkout
   ↓
Deploy Files
   ↓
Install Dependencies
   ↓
Deploy Express
   ↓
Health Check
```

The pipeline:

1. Checks out the `main` branch from GitHub.
2. Copies the Express application to the deployment directory.
3. Installs dependencies using `npm ci`.
4. Restarts the Express systemd service.
5. Performs an application health check.

Deployment directory:

```text
/opt/jenkins-apps/express
```

Jenkinsfile:

```text
Jenkinsfile-Express
```

---

# GitHub Webhook Automation

A GitHub webhook connects the repository to Jenkins.

Webhook endpoint:

```text
http://<EC2-PUBLIC-IP>:8080/github-webhook/
```

Event:

```text
Push
```

Content type:

```text
application/json
```

The webhook was tested successfully.

The Jenkins pipelines use:

```groovy
triggers {
    githubPush()
}
```

This enables Jenkins builds to be triggered by GitHub push events.

---

# CI/CD Workflow

The complete deployment workflow is:

```text
Developer
    │
    │ git push
    ▼
GitHub
    │
    │ Webhook
    ▼
Jenkins
    │
    ├───────────────┐
    ▼               ▼
Flask-CICD    Express-CICD
    │               │
    ▼               ▼
Install          Install
Dependencies     Dependencies
    │               │
    ▼               ▼
Deploy Flask     Deploy Express
    │               │
    ▼               ▼
systemd          systemd
    │               │
    └───────┬───────┘
            ▼
       Health Checks
```

---

# Successful Pipeline Builds

The following builds were successfully completed during testing:

```text
Flask-CICD #6
Express-CICD #3
```

The pipelines successfully performed:

* GitHub checkout
* Application deployment
* Dependency installation
* systemd service restart
* Application verification
* Health checks

---

# Application Verification

### Flask

```bash
curl -f http://127.0.0.1:5000/
```

Expected:

```text
Flask Backend is Running!
```

### Express

```bash
curl -f http://127.0.0.1:3000/
```

The Express application returns the student registration form.

The registration form was also tested through a browser and successfully communicated with the Flask backend.

---

# Screenshots

The repository contains screenshots documenting the implementation and testing process.

Important evidence includes:

```text
01-terraform-plan.png
02-terraform-apply.png
12-flask-service-running.png
13-flask-browser.png
14-express-registration-form.png
15-form-submission-success.png
18-flask-jenkins-console-success.png
19-express-jenkins-console-success.png
20-jenkins-both-pipelines-success-new-repo.png
21-github-webhook-success.png
```

These demonstrate:

* Terraform infrastructure provisioning
* Flask deployment
* Express deployment
* systemd services
* Jenkins pipeline execution
* GitHub webhook triggering
* application testing

---

# Security and Cleanup

The project uses an AWS Security Group to control network access.

Sensitive and generated files are excluded from GitHub using `.gitignore`, including:

```text
*.tfstate
*.tfstate.*
.terraform/
*.pem
*.key
```

Temporary AWS resources should be terminated after testing to minimize unnecessary cloud costs.

---

# Key DevOps Concepts Demonstrated

This project demonstrates practical experience with:

* Infrastructure as Code
* AWS EC2
* Terraform
* Jenkins CI/CD
* GitHub Webhooks
* Automated deployment
* Linux system administration
* systemd service management
* Python/Flask deployment
* Node.js/Express deployment
* Dependency management
* Application health checks
* CI/CD troubleshooting
* Cloud resource cleanup

---

# Project Outcome

This project demonstrates an end-to-end CI/CD workflow in which a GitHub code change can trigger Jenkins through a webhook and automatically deploy the Flask and Express applications to an AWS EC2 environment.

```text
GitHub
   ↓
Webhook
   ↓
Jenkins
   ↓
CI/CD Pipeline
   ↓
AWS EC2
   ↓
Application Deployment
   ↓
Health Check
```

---

# GitHub Repository

[Jenkins_CICD_Naj](https://github.com/NajPathan-Devops/Jenkins_CICD_Naj?utm_source=chatgpt.com)

---

## Author

**Naj Pathan**

Cloud & DevOps Learner

GitHub: `NajPathan-Devops`
