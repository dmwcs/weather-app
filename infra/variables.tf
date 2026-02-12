# infra/variables.tf

variable "project_name" {
  default = "nura-weather"
}

variable "aws_region" {
  default = "ap-southeast-2"
}

variable "app_port" {
  default = 3001
}

variable "ec2_instance_type" {
  default = "t3.micro"
}

variable "my_ip" {
  description = "SSH access IP (CIDR, e.g. 1.2.3.4/32)"
  default     = "0.0.0.0/0"
}
