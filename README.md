# GUI-sign

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
