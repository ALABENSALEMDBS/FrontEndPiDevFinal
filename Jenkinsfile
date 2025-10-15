pipeline {
    agent any
    environment {
        SONARQUBE_ENV = 'sq_env'
    }

    stages {
        stage('GIT') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ALABENSALEMDBS/FrontEndPiDevFinal.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sq_env') {
                    sh 'sonar-scanner -Dsonar.projectKey=FrontEndPiDevFinal -Dsonar.sources=src'
                }
            }
        }

        stage('Build Angular') {
            steps {
                sh 'ng build --prod'
            }
        }
    }
}
