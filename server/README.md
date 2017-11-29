```bash
docker build -t brunokrebs/secured-wildcard .

docker run --name secured-wildcard-mongo \
  --network digituz \
  -p 27017:27017 \
  -d mongo

docker run --name secured-wildcard \
  --network digituz \
  -e "MONGODB_URL=secured-wildcard-mongo:27017/contacts" \
  -e "AUTH0_DOMAIN=bk-samples.auth0.com" \
  -e "AUTH0_AUDIENCE=https://contacts.digituz.com.br" \
  -p 3001:3001 -d brunokrebs/secured-wildcard

docker stop secured-wildcard
docker rm secured-wildcard
```
