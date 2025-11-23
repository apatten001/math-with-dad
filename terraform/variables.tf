variable "ecr_repository_url" {
  description = "ECR repository URL with tag for the Docker image"
  type        = string
  default     = null   # allows it to be passed via -var
}