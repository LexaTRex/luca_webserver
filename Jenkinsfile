#!groovy

services = [
  "backend",
  "contact-form",
  "health-department",
  "locations",
  "scanner",
  "webapp",
]

BRANCH_NAME = env.BRANCH_NAME
BUILD_NUMBER = env.BUILD_NUMBER
BRANCH_NAME_ESCAPED = BRANCH_NAME.replaceAll("/", "-")
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

    if (env.BRANCH_NAME == "dev") {
      stage('Publish') {
        def steps = [:]
        for (service in services) {
          steps[service] = buildAndPushContainer(service, GIT_VERSION)
        }
        parallel steps
      }

      stage('Deploy') {
        echo GIT_VERSION
        build(
          job: "luca/luca-web-deploy",
          parameters: [
            text(name: "environment", value: "development"),
            text(name: "IMAGE_TAG", value: GIT_VERSION)
          ]
        )
      }
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
      sh("./scripts/usePrivateRegistries.sh")
    }
}

void abortPreviousRunningBuilds() {
  echo "Aborting previous builds"
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
      continue; println "equals"
    }
    echo "Aborting previous build = ${build}"
    build.doStop()
  }
}

Closure buildAndPushContainer(String service, String tag) {
  return {
    node("docker") {
      try {
        updateSourceCode()
        withCredentials([
          usernamePassword(credentialsId: 'luca-docker-auth', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD'),
          string(credentialsId: 'luca-docker-registry', variable: 'DOCKER_REGISTRY'),
          string(credentialsId: 'luca-npm-auth', variable: 'NPM_CONFIG__AUTH')
        ]) {
          sh('docker login -u=$DOCKER_USERNAME -p=$DOCKER_PASSWORD $DOCKER_REGISTRY')
          sh("IMAGE_TAG=${tag} docker-compose -f docker-compose.yml build ${service}")
          sh("IMAGE_TAG=${tag} docker-compose -f docker-compose.yml push ${service}")
          sh("docker logout")
        }
      } finally {
        cleanWs()
      }
    }
  }
}

Closure executeTestScriptForService(String script, String service) {
  return {
    node("docker") {
      try {
        updateSourceCode()
        withCredentials([
          string(credentialsId: 'luca-npm-auth', variable: 'NPM_CONFIG__AUTH')
        ]) {
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
  node("docker") {
    try {
      updateSourceCode()

      withCredentials([
        string(credentialsId: 'luca-npm-auth', variable: 'NPM_CONFIG__AUTH'),
        string(credentialsId: 'luca-google-maps-api-key', variable: 'REACT_APP_GOOGLE_MAPS_API_KEY')
      ]) {
        sh("IMAGE_TAG=e2e docker-compose -f docker-compose.yml build --parallel")
        lock('docker-host') {
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml up -d database")
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml run backend yarn migrate")
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml run backend yarn seed")
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} SKIP_SMS_VERIFICATION=true docker-compose -f docker-compose.yml up -d")
          sh("docker run --rm --network=host --ipc=host --entrypoint='' -v `pwd`/e2e:/e2e -w /e2e cypress/included:6.2.0 /bin/bash -c 'npx wait-on https://127.0.0.1/api/v3/health -t 30000 && cypress run' ")
          sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml down")
        }
      }
    } finally {
      sh("IMAGE_TAG=e2e_${UNIQUE_TAG} docker-compose -f docker-compose.yml down")
      cleanWs()
    }
  }
}
