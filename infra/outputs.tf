# infra/outputs.tf

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.react_app.id
}

output "cognito_region" {
  value = var.aws_region
}

output "ecr_repo_url" {
  value = aws_ecr_repository.app.repository_url
}
