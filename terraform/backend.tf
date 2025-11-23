terraform {
  backend "s3" {
    bucket = "math-with-dad-terraform-state"
    key    = "global/s3/terraform.tfstate"
    region = "us-east-2"

    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}