# serverless-tutorial
## Installation
Install serverless module via NPM if you don't installed it yet
```
npm install -g serverless
```

Run the command to install node modules
```
npm install
```

## Developing locally
Create new file `config.local.json` by copying the `config.example.json`, then input configuration values, then run the command to develop on the local environment
```
npm run start:dev
// or
sls offline start --reloadHandler --stage=local
```
 
## Deploying
Run the command to deploy serverless application to cloud provider (AWS)
```
sls deploy --stage=<stage>

# for example (noted config.<stage>.json must be created before run the command)
sls deploy --stage=dev
```