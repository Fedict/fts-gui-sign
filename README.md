# GUI-sign

## Building the application itself

There are two separate commands for building the application. One builds the dev version and the other the production version. In the dockerfile the production version is used. So in order to build the application for a production environment:

```BASH
npm run build
```

## Unit Tests

It is possible to activate the unit tests using the following command

```BASH
npm run test
```

## Docker

In order to run the application inside a docker container the following commands are required. Take note that the dockerfile will install the module serve on a global level. This might need to be adapted based on the security settings of the environment. The docker run command will list the IP's addresses on which the application is accessible.

### build

```BASH
docker build -t node-web .
```

### run

```BASH
docker run -it -p 3000:3001 node-web:latest
```
