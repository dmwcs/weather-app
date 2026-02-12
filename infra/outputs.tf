# infra/outputs.tf

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.react_app.id
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "s3_bucket" {
  value = aws_s3_bucket.frontend.id
}

output "ec2_public_ip" {
  value = aws_eip.backend.public_ip
}
