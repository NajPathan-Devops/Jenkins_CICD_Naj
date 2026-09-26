
````markdown
# Jenkins CI/CD Pipeline – Flask + Express

## Assignment

Tutedude DevOps Assignment 9 – Jenkins CI/CD Pipeline

## Student

Naj Pathan

## GitHub Repository

https://github.com/NajPathan-Devops/Jenkins_CICD_Naj

---

# 1. Project Overview

This project demonstrates a Jenkins-based CI/CD pipeline for deploying a Flask backend and an Express.js frontend on an AWS EC2 Ubuntu server.

The project contains two independent Jenkins pipelines:

1. Flask-CICD – deploys the Flask backend on port 5000.
2. Express-CICD – deploys the Express frontend on port 3000.

GitHub Webhooks are configured so that a push to the repository can automatically trigger the Jenkins pipelines.

---

# 2. Technology Stack

- AWS EC2
- Ubuntu 24.04 LTS
- Jenkins 2.568.3
- Git and GitHub
- Python 3
- Flask 3.1.3
- Node.js 20
- npm
- Express.js 5.2.1
- systemd
- Terraform
- Bash

---

# 3. Project Structure

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
│
└── README.md
````

Generated Terraform provider files and Terraform state files are excluded using `.gitignore`.

---

# 4. Architecture

```text
                         GitHub Repository
                    Jenkins_CICD_Naj
                              |
                              | GitHub Webhook
                              v
                    +---------------------+
                    |       Jenkins       |
                    |   AWS EC2 :8080     |
                    +----------+----------+
                               |
                  +------------+------------+
                  |                         |
                  v                         v
          Flask-CICD Pipeline       Express-CICD Pipeline
                  |                         |
                  v                         v
       /opt/jenkins-apps/flask   /opt/jenkins-apps/express
                  |                         |
                  v                         v
          Flask Backend              Express Frontend
             Port 5000                  Port 3000
                  |                         |
                  +-----------+-------------+
                              |
                              v
                     Application Testing
```

---

# 5. AWS EC2 Configuration

Region:

```text
ap-south-1
```

Operating System:

```text
Ubuntu 24.04 LTS
```

Instance type:

```text
t3.micro
```

The EC2 instance was created using Terraform.

Required ports:

| Port | Purpose          |
| ---- | ---------------- |
| 22   | SSH              |
| 3000 | Express frontend |
| 5000 | Flask backend    |
| 8080 | Jenkins          |

---

# 6. Terraform

Terraform was used to create the AWS infrastructure.

Main Terraform files:

```text
terraform/main.tf
terraform/variables.tf
terraform/outputs.tf
```

The Terraform configuration creates:

* AWS Security Group
* Ubuntu EC2 instance

Commands used:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Terraform successfully created the required AWS resources.

Terraform state files and the `.terraform` directory are not included in GitHub because they are generated files and may contain infrastructure state information.

---

# 7. Flask Backend

The Flask backend runs on:

```text
Port: 5000
```

Health endpoint:

```text
http://<EC2-PUBLIC-IP>:5000/
```

Expected response:

```text
Flask Backend is Running!
```

The backend also provides:

```text
POST /submit
```

for receiving registration form data.

Python dependencies are installed using:

```bash
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt
```

---

# 8. Express Frontend

The Express frontend runs on:

```text
Port: 3000
```

URL:

```text
http://<EC2-PUBLIC-IP>:3000/
```

The frontend provides a student registration form.

The Express application communicates with the Flask backend using:

```text
BACKEND_URL=http://127.0.0.1:5000
```

Dependencies are installed using:

```bash
npm ci
```

---

# 9. Process Management

systemd is used to keep both applications running as services.

Flask service:

```text
flask-backend.service
```

Express service:

```text
express-frontend.service
```

Check Flask:

```bash
sudo systemctl status flask-backend
```

Restart Flask:

```bash
sudo systemctl restart flask-backend
```

Check Express:

```bash
sudo systemctl status express-frontend
```

Restart Express:

```bash
sudo systemctl restart express-frontend
```

---

# 10. Jenkins Configuration

Jenkins is installed on the same AWS EC2 instance.

Jenkins URL:

```text
http://<EC2-PUBLIC-IP>:8080/
```

Two separate Jenkins pipelines were created:

```text
Flask-CICD
Express-CICD
```

---

# 11. Flask Jenkins Pipeline

The Flask pipeline performs these stages:

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

1. Pulls the `main` branch from GitHub.
2. Copies the `Flask` application to the deployment directory.
3. Creates a Python virtual environment.
4. Installs Python dependencies.
5. Restarts the Flask systemd service.
6. Checks the Flask health endpoint.

Deployment directory:

```text
/opt/jenkins-apps/flask
```

---

# 12. Express Jenkins Pipeline

The Express pipeline performs these stages:

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

1. Pulls the `main` branch from GitHub.
2. Copies the `Express` application to the deployment directory.
3. Installs npm dependencies using `npm ci`.
4. Restarts the Express systemd service.
5. Checks the Express application.

Deployment directory:

```text
/opt/jenkins-apps/express
```

---

# 13. GitHub Webhook

A GitHub webhook was configured for automatic Jenkins triggering.

Webhook URL:

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

The GitHub webhook delivery was successfully tested.

Jenkins pipelines also contain:

```groovy
triggers {
    githubPush()
}
```

This allows GitHub push events to trigger Jenkins builds.

---

# 14. CI/CD Workflow

The complete workflow is:

```text
Developer pushes code
        |
        v
GitHub Repository
        |
        | Webhook
        v
Jenkins
        |
        +-------------------+
        |                   |
        v                   v
 Flask-CICD          Express-CICD
        |                   |
        v                   v
 Flask Deployment     Express Deployment
        |                   |
        v                   v
 Port 5000             Port 3000
```

---

# 15. Successful Jenkins Builds

The following Jenkins builds were successfully completed:

```text
Flask-CICD #6
Express-CICD #3
```

Both pipelines successfully:

* Checked out the new GitHub repository.
* Deployed application files.
* Installed dependencies.
* Restarted systemd services.
* Passed health checks.

---

# 16. Application Verification

Flask verification:

```bash
curl -f http://127.0.0.1:5000/
```

Expected:

```text
Flask Backend is Running!
```

Express verification:

```bash
curl -f http://127.0.0.1:3000/
```

Expected response contains the Student Registration Form.

The registration form was also tested through the browser and successfully communicated with the Flask backend.

---

# 17. Screenshots

Important screenshots included with this assignment:

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

The screenshots document Terraform deployment, Jenkins pipelines, application testing, and GitHub webhook configuration.

---

# 18. Security and Cleanup

The project uses a dedicated AWS Security Group for the assignment.

After all screenshots and final documentation are completed, temporary AWS resources used for the assignment should be stopped or terminated to minimize unnecessary AWS charges.

The Terraform state files and generated provider directory are excluded from the GitHub repository.

---

# 19. Final Result

The assignment demonstrates a complete CI/CD workflow:

```text
GitHub
   ↓
GitHub Webhook
   ↓
Jenkins
   ↓
Flask-CICD / Express-CICD
   ↓
Dependency Installation
   ↓
systemd Deployment
   ↓
Health Check
   ↓
Running Applications
```

Both Flask and Express Jenkins pipelines successfully deployed the applications on AWS EC2.

---

# 20. GitHub Repository

GitHub:

[https://github.com/NajPathan-Devops/Jenkins_CICD_Naj](https://github.com/NajPathan-Devops/Jenkins_CICD_Naj)
```


