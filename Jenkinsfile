pipeline {
    agent any

    environment {
        AWS_REGION         = 'us-east-1'
        ROLE_ARN           = credentials('math-with-dad-aws-role-arn')  // Jenkins credential ID (text)
        DOCKER_IMAGE       = "ghcr.io/${env.GIT_REPO_OWNER}/${env.JOB_NAME}:latest"
        TERRAFORM_DIR      = 'terraform'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build & Push') {
            steps {
                withAWS(role: "${ROLE_ARN}", roleAccount: '', duration: 3600, region: "${AWS_REGION}") {
                    script {
                        // Login to GHCR using Jenkins GitHub creds or PAT
                        docker.withRegistry('https://ghcr.io', 'github-pat-credential-id') {  // optional: add PAT in Jenkins creds
                            sh 'docker build -t ${DOCKER_IMAGE} .'
                            sh 'docker push ${DOCKER_IMAGE}'
                        }
                    }
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                withAWS(role: "${ROLE_ARN}", region: "${AWS_REGION}") {
                    sh '''
                        # Pull image locally for scanning
                        docker pull ${DOCKER_IMAGE}
                        
                        # Run Trivy (install if needed, or use container)
                        docker run --rm aquasec/trivy:latest image \
                            --severity CRITICAL,HIGH \
                            --exit-code 1 \
                            --no-progress ${DOCKER_IMAGE}
                    '''
                }
            }
        }

        stage('Terraform Deploy') {
            when { branch 'main' }
            steps {
                dir("${TERRAFORM_DIR}") {
                    withAWS(role: "${ROLE_ARN}", region: "${AWS_REGION}") {
                        sh 'terraform init'
                        sh 'terraform plan -auto-approve'
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Math With Dad deployed successfully! 🚀'
        }
        failure {
            echo 'Pipeline failed — check logs.'
        }
    }
}