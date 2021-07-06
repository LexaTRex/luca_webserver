#!groovy

services = [
  'backend',
  'contact-form',
  'health-department',
  'locations',
  'scanner',
  'webapp',
]

BRANCH_NAME = env.BRANCH_NAME
BUILD_NUMBER = env.BUILD_NUMBER
BRANCH_NAME_ESCAPED = BRANCH_NAME.replaceAll('/', '-')
UNIQUE_TAG = "${BRANCH_NAME_ESCAPED}_build-${BUILD_NUMBER}"

node {
  try {
    abortPreviousRunningBuilds()
    updateSourceCode()
    GIT_VERSION = sh(script: 'git describe --long --tags', returnStdout: true).trim()

    stage('Test') {
      def steps = [:]
      for (service in services) {
        steps[service] = executeTestScriptForService('ci/test.sh', service)
      }
      parallel steps
    }

    stage('e2e Tests') {
      e2eTest()
    }

    if (env.BRANCH_NAME == 'dev') {
      triggerDeploy('dev', GIT_VERSION)
    }

    if (env.BRANCH_NAME.startsWith('release/')) {
      triggerDeploy('release', GIT_VERSION)
    }

    if (env.BRANCH_NAME.startsWith('hotfix/')) {
      triggerDeploy('hotfix', GIT_VERSION)
    }

    if (env.BRANCH_NAME == 'master') {
      triggerDeploy('preprod', GIT_VERSION)
    }

    currentBuild.result = 'SUCCESS'
  } catch(org.jenkinsci.plugins.workflow.steps.FlowInterruptedException err) {
    echo 'Script was aborted. ' + err.toString()
    currentBuild.result = 'ABORTED'
  } catch (err) {
    echo 'Script failed because of error: ' + err.toString()
    currentBuild.result = 'FAILURE'
  } finally {
    cleanWs()
  }
}

void updateSourceCode() {
  cleanWs()
  checkout scm
  // replace public registry references with private registries
  withCredentials([
      string(credentialsId: 'luca-docker-repository', variable: 'DOCKER_REPOSITORY'),
      string(credentialsId: 'luca-npm-registry', variable: 'NPM_REGISTRY')
    ]) {
      sh('./scripts/usePrivateRegistries.sh')
    }
}

void abortPreviousRunningBuilds() {
  echo 'Aborting previous builds'
  def jobname = env.JOB_NAME
  def buildnum = env.BUILD_NUMBER.toInteger()

  // get raw job from jenkins
  def job = Jenkins.instance.getItemByFullName(jobname)
  for (build in job.builds) {
    //ignore if it is not building
    if (!build.isBuilding()) {
      continue;
    }
    //check if the same number as currentBuild, if so skip
    if (buildnum == build.getNumber().toInteger()) {
      continue; println 'equals'
    }
    echo "Aborting previous build = ${build}"
    build.doStop()
  }
}

void triggerDeploy(String env, String image_tag) {
  stage('Publish') {
    def steps = [:]
    for (service in services) {
      steps[service] = buildAndPushContainer(service, GIT_VERSION)
    }
    parallel steps
  }

  stage('Deploy') {
    echo("deploying ${image_tag} to ${env}")
    build(
      job: 'luca/luca-web-deploy',
      parameters: [
        text(name: 'ENV', value: env),
        text(name: 'IMAGE_TAG', value: image_tag)
      ]
    )
  }
}

Closure buildAndPushContainer(String service, String tag) {
  return {
    node('docker') {
      try {
        updateSourceCode()
        GIT_VERSION = sh(script: 'git describe --long --tags', returnStdout: true).trim()
        GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()

        withCredentials([
          usernamePassword(credentialsId: 'luca-docker-auth',
                            usernameVariable: 'DOCKER_USERNAME',
                            passwordVariable: 'DOCKER_PASSWORD'),
          string(credentialsId: 'luca-docker-registry', variable: 'DOCKER_REGISTRY'),
          usernamePassword( credentialsId: 'jenkins-docker-public-registry',
                            usernameVariable:'DOCKER_PUBLIC_USERNAME',
                            passwordVariable:'DOCKER_PUBLIC_PASSWORD'),
          string(credentialsId: 'luca-docker-public-registry', variable: 'DOCKER_PUBLIC_REGISTRY'),
          string(credentialsId: 'luca-npm-auth', variable: 'NPM_CONFIG__AUTH'),
        ]) {

          sh('docker login -u=$DOCKER_USERNAME -p=$DOCKER_PASSWORD $DOCKER_REGISTRY')
          sh('docker login -u=$DOCKER_PUBLIC_USERNAME -p=$DOCKER_PUBLIC_PASSWORD $DOCKER_PUBLIC_REGISTRY')
          sh("IMAGE_TAG=${tag} GIT_VERSION=${GIT_VERSION} GIT_COMMIT=${GIT_COMMIT} docker-compose -f docker-compose.yml build ${service}")
          sh("IMAGE_TAG=${tag} docker-compose -f docker-compose.yml push ${service}")
          sh('docker logout')
        }
      } finally {
        cleanWs()
      }
    }
  }
}

Closure executeTestScriptForService(String script, String service) {
  return {
    node('docker') {
      try {
        updateSourceCode()
        withCredentials([
          usernamePassword( credentialsId: 'jenkins-docker-public-registry',
                  usernameVariable:'DOCKER_PUBLIC_USERNAME',
                  passwordVariable:'DOCKER_PUBLIC_PASSWORD'),
          string(credentialsId: 'luca-docker-public-registry', variable: 'DOCKER_PUBLIC_REGISTRY'),
          string(credentialsId: 'luca-npm-auth', variable: 'NPM_CONFIG__AUTH'),
        ]) {
          sh('docker login -u=$DOCKER_PUBLIC_USERNAME -p=$DOCKER_PUBLIC_PASSWORD $DOCKER_PUBLIC_REGISTRY')
          sh("IMAGE_TAG=test_${UNIQUE_TAG} docker-compose -f docker-compose.yml -f docker-compose.test.yml build ${service}")
          sh("IMAGE_TAG=test_${UNIQUE_TAG} docker-compose -f docker-compose.yml -f docker-compose.test.yml run --rm ${service} ${script}")
        }
      } finally {
        sh("IMAGE_TAG=test_${UNIQUE_TAG} docker-compose -f docker-compose.yml -f docker-compose.test.yml down")
        cleanWs()
      }
    }
  }
}

void e2eTest() {
  lock(label: 'docker-host', quantity: 1, variable: 'LOCKED_NODE') {
    node(env.LOCKED_NODE) {
      try {
        updateSourceCode()

        withCredentials([
          string(credentialsId: 'luca-npm-auth', variable: 'NPM_CONFIG__AUTH'),
          string(credentialsId: 'luca-google-maps-api-key', variable: 'REACT_APP_GOOGLE_MAPS_API_KEY'),
          usernamePassword( credentialsId: 'jenkins-docker-public-registry',
                  usernameVariable:'DOCKER_PUBLIC_USERNAME',
                  passwordVariable:'DOCKER_PUBLIC_PASSWORD'),
          string(credentialsId: 'luca-docker-public-registry', variable: 'DOCKER_PUBLIC_REGISTRY'),
        ]) {
          sh('docker login -u=$DOCKER_PUBLIC_USERNAME -p=$DOCKER_PUBLIC_PASSWORD $DOCKER_PUBLIC_REGISTRY')
          sh('IMAGE_TAG=e2e docker-compose -f docker-compose.yml build --parallel')
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml up -d database")
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml run backend yarn migrate")
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml run backend yarn seed")
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} SKIP_SMS_VERIFICATION=true E2E=true docker-compose -f docker-compose.yml up -d")
          sh("docker run --rm --network=host --ipc=host --entrypoint='' -v `pwd`/e2e:/e2e -w /e2e cypress/included:7.3.0 /bin/bash -c 'npx wait-on https://127.0.0.1/api/v3/keys/daily/ -t 30000 && yarn install && yarn cache clean && cypress run' ")
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml down")
        }
      } finally {
        sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml down")
        archiveArtifacts(artifacts: 'e2e/cypress/screenshots/**/*', allowEmptyArchive: true)
        cleanWs()
      }
    }
  }
}
