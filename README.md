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
Use an existing AWS Profile
To easily switch between projects without the need to do aws configure every time you can use environment variables. For example you define different profiles in ~/.aws/credentials
```
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

Create new file `config.local.json` by copying the `config.example.json`, then input configuration values, then run the command to develop on the local environment
```
npm run start:dev
// or
sls offline start --reloadHandler --stage=local --profile=default
```

## Using Mongodb on the local environment
- Run docker-compose
```
docker-compose up -d
```
- Configure MongoDB local
```
// config.local.json
{
  "AWS_ACCOUNT_ID": "627365243885",
  "ACCOUNT_MONGODB_URL": "mongodb://root:example@localhost:27017/account",
  "AUTH_MONGODB_URL":"mongodb://root:example@localhost:27017/auth",
  "INVENTORY_MONGODB_URL":"mongodb://root:example@localhost:27017/inventory"
}
```

## Deploying
Run the command to deploy serverless application to cloud provider (AWS)
```
sls deploy --stage=<stage>

# for example (noted config.<stage>.json must be created before run the command)
sls deploy --stage=dev
```
