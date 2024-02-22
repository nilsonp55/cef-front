# Control de Efectivo - Frontend

Repositorio para la aplicacion Angular de Control de Efectivo.

---

## Prerequisitos

Para desplegar el proyecto en ambiente local de desarrollo se deben contar con las siguientes herramientas y programas

1. **npm** ([sitio oficial](https://nodejs.org/en/download/))
2. **angular-cli** 
3. Cliente de Git 
4. Cuenta ATH habilitada en Artifactory Nexus ([link](https://devops-nexus.ath.net/))
5. Cuenta ATH habilitada en el repositorio Github ([link](https://devops-github.ath.net/))

---

## Configuracion ambiente local de desarrollo

1. Para clonar el repositorio se debe configurar el cliente Git con las opciones **core.autocrlf** y **http.sslVerify**, para esto se de ejecutar los siguientes comandos en una terminal:

```shell
git config --global core.autocrlf true
git config --global http.sslVerify "false"
```

2. Configurar npm para acceder al repositorio de ATH
Se requiere configurar la propiedad **strict-ssl** con el valor **false**, para esto se debe ejecutar el siguiente comando en una terminal:

```shell
npm config set strict-ssl=false
```

3. Realizar el login en el Artifactory Nexus de ATH, para esto se debe ejecutar el siguiente comando:

```shell
npm login --registry https://devops-nexus.ath.net/repository/npm-registry/
```
4. Instalar cliente de angular Angular/cli: 

```shell
npm install -g @angular/cli
```

5. Instalar dependencias del proyecto Angular, para esto se debe ejecutar el siguiente comando en una terminal:

```shell
npm install
```

---

## Configuracion de enviroments de Angular

Para lanzar la aplicacion angular en ambiente local se debe usar la configuracion definida en el *environment* ```dev``` para esto se debe ejecutar el siguiente comando:

```shell 
ng serve --configuration dev
```
Ambientes configurados.
- dev 
- pruebastecnicas
- qualiti
- production

---

## Ejecutar test unitarios

Los test unitarios se pueden ejecutar con el siguiente comando:

```shell
ng test
```

---

## Compilar la aplicacion Angular

Para compilar el proyecto angular para ambiente produccion se debe ejcutar el siguiente comando:

```shell
ng build --configuration production
```
