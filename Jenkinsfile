pipeline {
    agent any
    environment {
        SONARQUBE_ENV = 'sq_env' // le nom que tu as déjà configuré dans Jenkins
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
                    sh 'mvn sonar:sonar'
                }
            }
        }
    }
}
