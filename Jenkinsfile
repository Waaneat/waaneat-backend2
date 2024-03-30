pipeline{
    agent any

    triggers{
        pollSCM '*/5 * * * *'
    }

    stages{
        stage('Build'){
            steps{
                echo 'Building...'
                bat '''
                cd ./
                npm install
                '''
            }
        }

        stage('Test'){
            steps{
                echo 'Testing...'
                bat '''
                npx mocha ./test/userControllerTest
                '''
            }
        }

        stage('Deploy'){
            steps{
                echo 'Deploying...'
                bat '''
                echo "doing deploying stuff..."
                '''
            }
        }
    }
}