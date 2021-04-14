# [Luca Backend](https://app.luca-app.de/api/v3/:route)

[luca](https://luca-app.de) ensures a data protection-compliant, decentralized
encryption of your data, undertakes the obligation to record contact data for
events and gastronomy, relieves the health authorities through digital, lean,
and integrated processes to enable efficient and complete tracing.

This service contains the source code of the luca Backend. The luca Backend
coordinates the individual systems of the luca system and ensures comprehensive
security for the entire platform. We will release our code here in continuous
intervals so please note that the version that you get from the
[productive System](https://app.luca-app.de) may not always match with the
`master` branch of this repository.

## Changelog

An overview of all releases can be found
[here](https://gitlab.com/lucaapp/web/-/blob/master/CHANGELOG.md).

### API documentation

A Swagger UI will be available at
[/api/v3/swagger/#](https://localhost/api/v3/swagger/#)
([online link](https://app.luca-app.de/api/v3/swagger/#)).

The OpenAPI documentation JSON will be available at
[/api/v3/swagger/swagger.json](https://localhost/api/v3/swagger/swagger.json).

## Development

You can setup this service using node and yarn (use nvm to switch between
versions).

1. Clone the repository
2. Navigate to service within your terminal
3. Run `yarn` to install the dependencies
4. Run `yarn start` to start the service
5. Open `https://localhost/api/v3/:route`

In order for the backend to run the backend also needs the redis and database to
be up and running.

Note we recommend to start the whole luca web system (backend included) as
stated in [general setup](../../README.md).

## Issues & Support

Please [create an issue](https://gitlab.com/lucaapp/web/-/issues) for
suggestions or problems related to this application. For general questions,
please check out our [FAQ](https://www.luca-app.de/faq/) or contact our support
team at [hello@luca-app.de](mailto:hello@luca-app.de).

## License

The Luca backend service is Free Software (Open Source) and is distributed with
a number of components with compatible licenses.

```
SPDX-License-Identifier: Apache-2.0

SPDX-FileCopyrightText: 2021 culture4life GmbH <https://luca-app.de>
```

For details see

- [license file](https://gitlab.com/lucaapp/web/-/blob/master/LICENSE)
