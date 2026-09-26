output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.jenkins_cicd.id
}

output "public_ip" {
  description = "Public IP address of the Jenkins CI/CD EC2 instance"
  value       = aws_instance.jenkins_cicd.public_ip
}

output "public_dns" {
  description = "Public DNS name of the Jenkins CI/CD EC2 instance"
  value       = aws_instance.jenkins_cicd.public_dns
}

output "ssh_command" {
  description = "SSH command for connecting to the Ubuntu EC2 instance"
  value       = "ssh -i <path-to-your-pem-file> ubuntu@${aws_instance.jenkins_cicd.public_ip}"
}
