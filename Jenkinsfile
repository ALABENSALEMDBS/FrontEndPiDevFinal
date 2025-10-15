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

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sq_env') {
                    // analyse uniquement les fichiers source dans src
                    sh 'sonar-scanner -Dsonar.projectKey=FrontEndPiDevFinal -Dsonar.sources=src'
                }
            }
        }
    }
}
