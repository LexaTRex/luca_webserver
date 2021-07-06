# Luca Web

[luca](https://luca-app.de) ensures a data protection-compliant, decentralized
encryption of your data, undertakes the obligation to record contact data for
events and gastronomy, relieves the health authorities through digital, lean,
and integrated processes to enable efficient and complete tracing.

This repository contains the source code of luca Web. luca can be used wherever people come together. Furthermore, it enables encrypted and GDPR compliant contact data collection and fast and seamless tracing of infection chains. This repository holds the following services:

1. [luca Backend](services/backend/README.md) - Coordinates the individual systems of the luca system system and ensures comprehensive security for the entire platform.
2. [luca Contact Form](services/contact-form/README.md) - Guests without a smartphone can check in in locations via a digital contact form. Operators can open the contact form in their management tool.
3. [luca Health Department](services/health-department/README.md) - Starts the tracking process at the health department, manages key management and exchanges data with SORMAS and others.
4. [luca Locations](services/locations/README.md) - Management Tool for operators to manage locations and check-in guests securely.
5. [luca Scanner](services/scanner/README.md) - Via the management tool, operators can reach a web scanner to check in their guests. This can be used to scan both app users and key fob owners.
6. [luca Web App](services/webapp/README.md) - Enables the straightforward and secure exchange of data with health authorities and operators. Designed for users who cannot use the luca native apps.

We will release our code here in continuous intervals so please note that the version that you get from the [productive System](https://app.luca-app.de) may not always match with the `master` branch of this repository.

## Changelog

An overview of all releases can be found
[here](https://gitlab.com/lucaapp/web/-/blob/master/CHANGELOG.md).

## Setup

### Requirements

- node and yarn (use nvm to switch between versions)
- docker
- Git LFS (To enable Git LFS, install it via `brew install git-lfs` and enable it once globally with `git lfs install`.)

### Building

Then build containers with `yarn dev build`. You need to do this again when dependencies of a service change.

### Running

Afterwards you can start the dev environment with `yarn dev up`. This will start all containers and mount the local sourcecode into them, allowing for changes to take effect without restarting the containers.
You can run just a specific service with `yarn dev up SERVICE` (note that in most cases, you will need to have most services running because many components depend on each other).

The services will be available on:

1. luca Backend - https://localhost/api/v3/`route`
2. luca Contact Form - https://localhost/contact-form/`:locationScannerId`
3. luca Health Department - https://localhost/health-department
4. luca Locations - https://localhost/
5. luca Scanner
   5.1 Hardware - https://localhost/scanner/`:locationScannerId`
   5.2 Cam - https://localhost/scanner/cam/`:locationScannerId`
6. luca Web App - https://localhost/webapp

We always use https. Disable the browser's unsecure ssl certificate warning by trusting the root.crt in the ca folder.

Make sure to allocate enough Docker memory, the 2GB default might be insufficient to run all containers at once.

### Local setup

All separate services are able to run locally without any further setups. However if you want to locally test the interaction of different services such as sharing data or location checkins the luca system needs to generate a daily key within your local testing environment. To generate the daily key you need to login in the health department `localhost/health-department/login` (`luca@nexenio.com:testing`). Once you logged in and downloaded the local health department keyfile a daily key is created which all other services can use to encrypt data.

### Connecting to the database

The PostgreSQL instance is reachable at `localhost:5432`. Find the credentials in the [config](services/backend/config) folder.

### Static code analyzes

We use [eslint](https://eslint.org/) and [stylelint](https://stylelint.io/) to run static code analyzes in our services. To run the static code analyzes in a service directory run `yarn lint`.

### Testing production

To test production build all containers in production mode with `yarn prod build`.
Then start services with `yarn prod up`. The website will be available at https://localhost/.
You may log in, e.g., to https://localhost/health-department, using `luca@nexenio.com`:`testing` (refer to [this file](services/backend/src/database/seeds/createFakeData.js)).

## Issues & Support

Please [create an issue](https://gitlab.com/lucaapp/web/-/issues) for
suggestions or problems related to this application. For general questions,
please check out our [FAQ](https://www.luca-app.de/faq/) or contact our support
team at [hello@luca-app.de](mailto:hello@luca-app.de).

## License

Luca Web is Free Software (Open Source) and is distributed
with a number of components with compatible licenses.

```
SPDX-License-Identifier: Apache-2.0

SPDX-FileCopyrightText: 2021 culture4life GmbH <https://luca-app.de>
```

For details see
 * [license file](https://gitlab.com/lucaapp/web/-/blob/master/LICENSE)
