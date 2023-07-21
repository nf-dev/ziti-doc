---
title: Example Enabling BrowZer 
---

This page will demonstrate adding BrowZer to an existing OpenZiti overlay network that was started using the
["host it anywhere" quickstart](../../../../learn/quickstarts/network/hosted.md). It will use Ubuntu linux as well, if
your linux distribution is different, change the commands accordingly.

### Get the Wildcard Certificate

First, I used Docker to run Certbot. Following the instructions [on the certbot site](https://eff-certbot.readthedocs.io/en/stable/install.html),
I obtained a wildcard certificate key/pair from LetsEncrypt for my domain using the
[DNS challenge method](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge).

#### Run Certbot via Docker
```
wildcard_url="hostitanywhere.demo.openziti.org"
your_email="clint@openziti.org"
sudo docker run -it --rm --name certbot \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  certbot/certbot certonly -d "*.${wildcard_url}" \
                  --manual \
                  --preferred-challenges dns \
                  --email "${your_email}" \
                  --agree-tos
```

### Enable Certificate Access by Specific Users

Since certbot will make the files available to root only (a good practice) we want to give specific users the
ability to read the files.  To do that we'll make a new group and a new user with UID 2171 and GID 2171. As shown below,
we are making a group named `zitiweb`, adding our user to that group so that "we" can see the files for debugging or
other purposes and then making a `ziggy` user that can also read these files should we want/need that later. Please
plan accordingly here. This is just a reasonable example to follow to get you going, change it to suit your needs.

```bash
sudo groupadd -g 2171 zitiweb
sudo useradd -u 2171 -s /bin/bash ziggy
sudo usermod -aG zitiweb ziggy
sudo usermod -aG zitiweb $USER
sudo chown -R root:zitiweb /etc/letsencrypt/
sudo chmod -R g+rx /etc/letsencrypt/
```

Log out of the shell and log back in again to gain access to the certs (notice we need to reset the wildcard_url):
```bash
wildcard_url="hostitanywhere.demo.openziti.org"
ls -l /etc/letsencrypt/live/${wildcard_url}/*
```

### Follow the OpenZiti "host it anywhere" Quickstart

We plan to follow the steps outlined in the ["host it anywhere" quickstart](../../../../learn/quickstarts/network/hosted.md)
with __one important exception__. Since we have just obtained some LetsEncrypt certificates, we'll enable OpenZiti with
[Alternative Server Certs](../../../../guides/alt-server-certs.md) __immediately__! To do that we'll set two new variables
introduced with v0.29.0. Notice that the `${wildcard_url}` variable set above, is reused here:

```bash
export ZITI_PKI_ALT_SERVER_CERT="/etc/letsencrypt/live/${wildcard_url}/fullchain.pem"
export ZITI_PKI_ALT_SERVER_KEY="/etc/letsencrypt/live/${wildcard_url}/privkey.pem"
```

Now we can follow the ["host it anywhere" quickstart](../../../../learn/quickstarts/network/hosted.md) instructions.

After the quickstart completes, you should be able to access the controller at both the alternate server cert url. 
Notice there's no need for 'insecure' (-sk) curl mode!:
```bash
curl https://ctrl.${wildcard_url}:${ZITI_CTRL_EDGE_ADVERTISED_PORT}
```
and we should be able to curl to the non-alternative server url. Note for this we need to use `-sk` since this will
be the self-signed PKI endpoint:
```bash
curl -sk https://${ZITI_CTRL_EDGE_ADVERTISED_ADDRESS}:${ZITI_CTRL_EDGE_ADVERTISED_PORT}
```


### Install the Ziti Admin Console (ZAC)

We are going to expose ZAC via BrowZer! To do that, we need to install ZAC first. Follow 
[the ZAC install guide](../../../../learn/quickstarts/zac/index.md). After installing ZAC, continue.

### Update Edge Router for WSS

vi $ZITI_HOME/${ZITI_NETWORK}-edge-router.yaml

```bash
  - binding: edge
    address: wss:0.0.0.0:8447
    options:
      advertise: ws.hostitanywhere.demo.openziti.org:8447
      connectTimeoutMs: 5000
      getSessionTimeout: 60
```

# restart the edge router
sudo systemctl restart ziti-router

## Create a BrowZer env File

```bash

# start http agent
export NODE_ENV=production
export ZITI_AGENT_LOGLEVEL=debug
export ZITI_AGENT_HOST=browzer.${wildcard_url}
export ZITI_BROWZER_RUNTIME_LOGLEVEL=debug
export ZITI_BROWZER_RUNTIME_HOTKEY=alt+F12
export ZITI_CONTROLLER_HOST=ctrl.${wildcard_url}
export ZITI_CONTROLLER_PORT=${ZITI_CTRL_EDGE_ADVERTISED_PORT}
export ZITI_AGENT_SCHEME=https
export ZITI_AGENT_CERTIFICATE_PATH=/etc/letsencrypt/live/${wildcard_url}/fullchain.pem
export ZITI_AGENT_KEY_PATH=/etc/letsencrypt/live/${wildcard_url}/privkey.pem
export ZITI_AGENT_LISTEN_PORT=8446
export ZITI_BROWZER_SERVICE=brozac
export ZITI_BROWZER_VHOST=${ZITI_BROWZER_SERVICE}.${wildcard_url}
export ZITI_BROWZER_OIDC_URL=https://dev-b2q0t23rxctngxka.us.auth0.com
export ZITI_BROWZER_CLIENT_ID=e1elIVoWGxxkBuMjpfG5GW5QD61oUuBG

export ZITI_AGENT_TARGETS="$(cat <<HERE
  {
    "targetArray": [
      {
        "vhost": "${ZITI_BROWZER_VHOST}",
        "service": "${ZITI_BROWZER_SERVICE}",
        "path": "/",
        "scheme": "http",
        "idp_issuer_base_url": "${ZITI_BROWZER_OIDC_URL}",
        "idp_client_id": "${ZITI_BROWZER_CLIENT_ID}"
      }
    ]
  }
HERE
)"

cat > $ZITI_HOME/browzer.env << HERE
ZITI_AGENT_HOST="${ZITI_AGENT_HOST}"
ZITI_AGENT_LOGLEVEL="${ZITI_AGENT_LOGLEVEL}"
ZITI_BROWZER_RUNTIME_LOGLEVEL="${ZITI_BROWZER_RUNTIME_LOGLEVEL}"
ZITI_BROWZER_RUNTIME_HOTKEY="${ZITI_BROWZER_RUNTIME_HOTKEY}"
ZITI_CONTROLLER_HOST="${ZITI_CONTROLLER_HOST}"
ZITI_CONTROLLER_PORT="${ZITI_CONTROLLER_PORT}"
ZITI_AGENT_SCHEME="${ZITI_AGENT_SCHEME}"
ZITI_AGENT_CERTIFICATE_PATH="${ZITI_AGENT_CERTIFICATE_PATH}"
ZITI_AGENT_KEY_PATH="${ZITI_AGENT_KEY_PATH}"
ZITI_AGENT_LISTEN_PORT="${ZITI_AGENT_LISTEN_PORT}"
ZITI_AGENT_TARGETS='${ZITI_AGENT_TARGETS}'
NODE_EXTRA_CA_CERTS=node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem
HERE
echo browzer env file written to: $ZITI_HOME/browzer.env
```

## Pepare the OpenZiti Network

### Configure the External JWT Signer and Auth Policy
```bash
ziti edge login -u $ZITI_USER -p $ZITI_PWD -y ${ZITI_CTRL_EDGE_ADVERTISED_ADDRESS}:${ZITI_CTRL_EDGE_ADVERTISED_PORT}

echo "configuring OpenZiti for BrowZer..."
ziti_object_prefix=browzer-auth0
issuer=$(curl -s ${ZITI_BROWZER_OIDC_URL}/.well-known/openid-configuration | jq -r .issuer)
jwks=$(curl -s ${ZITI_BROWZER_OIDC_URL}/.well-known/openid-configuration | jq -r .jwks_uri)

echo "OIDC issuer   : $issuer"
echo "OIDC jwks url : $jwks"

ext_jwt_signer=$(ziti edge create ext-jwt-signer "${ziti_object_prefix}-ext-jwt-signer" "${issuer}" --jwks-endpoint "${jwks}" --audience "${ZITI_BROWZER_CLIENT_ID}" --claims-property email)
echo "ext jwt signer id: $ext_jwt_signer"

auth_policy=$(ziti edge create auth-policy ${ziti_object_prefix}-auth-policy --primary-ext-jwt-allowed --primary-ext-jwt-allowed-signers ${ext_jwt_signer})
echo "auth policy id: $auth_policy"
```

### Add a Service to Access an HTTP Web App
```bash
intercept_address="${ZITI_BROWZER_SERVICE}.ziti"
intercept_port=80
offload_address=127.0.0.1
offload_port=1408

function createService {
ziti edge create config ${ZITI_BROWZER_SERVICE}.host.config host.v1 '{"protocol":"tcp", "address":"'"${offload_address}"'", "port":'${offload_port}'}'
ziti edge create config ${ZITI_BROWZER_SERVICE}.int.config  intercept.v1 '{"protocols":["tcp"],"addresses":["'"${intercept_address}"'"], "portRanges":[{"low":'${intercept_port}', "high":'${intercept_port}'}]}'
ziti edge create service "${ZITI_BROWZER_SERVICE}" --configs "${ZITI_BROWZER_SERVICE}.host.config","${ZITI_BROWZER_SERVICE}.int.config"
ziti edge create service-policy "${ZITI_BROWZER_SERVICE}.bind" Bind --service-roles "@${ZITI_BROWZER_SERVICE}" --identity-roles "#${ZITI_BROWZER_SERVICE}.binders"
ziti edge create service-policy "${ZITI_BROWZER_SERVICE}.dial" Dial --service-roles "@${ZITI_BROWZER_SERVICE}" --identity-roles "#${ZITI_BROWZER_SERVICE}.dialers"
}

function deleteService {
ziti edge delete config  where 'name contains "'"${ZITI_BROWZER_SERVICE}"'."'
ziti edge delete service where 'name = "'"${ZITI_BROWZER_SERVICE}"'"'
ziti edge delete sp      where 'name contains "'"${ZITI_BROWZER_SERVICE}"'."'
}

createService

```

### Associate/Update Identities with the Auth Policy

```bash
ZITI_BROWZER_IDENTITIES="clint.dovholuk@netfoundry.io curt.tudor@netfoundry.io"
echo "creating users specified by ZITI_BROWZER_IDENTITIES: ${ZITI_BROWZER_IDENTITIES}"
for id in ${ZITI_BROWZER_IDENTITIES}; do
ziti edge create identity user "${id}" --auth-policy ${auth_policy} --external-id "${id}" -a "${ZITI_BROWZER_SERVICE}.dialers"
done

#ziti edge update identity "${id}" -a $(ziti edge list identities 'name="'${id}'"' -j | jq -r '.data[].roleAttributes | map(. // "") | @csv'),"${ZITI_BROWZER_SERVICE}.dialers"
ziti edge update identity "${ZITI_ROUTER_NAME}" -a "${ZITI_BROWZER_SERVICE}.binders"

```

### Setup the BrowZer Bootstrapper

```bash

# clone repo:
git clone https://github.com/openziti/ziti-http-agent.git $ZITI_HOME/ziti-http-agent

# cd to repo path

cd $ZITI_HOME/ziti-http-agent

# install yarn if needed
sudo npm install --global yarn

# issue yarn install
yarn install


sudo cp "${ZITI_HOME}/browzer-bootstrapper.service" /etc/systemd/system/browzer-bootstrapper.service
sudo systemctl daemon-reload
sudo systemctl enable --now browzer-bootstrapper

journalctl -fu browzer-bootstrapper

```

### Try It Out

```bash

echo " "
echo " "
echo " "
echo "now go to: https://${ZITI_BROWZER_VHOST}:${ZITI_AGENT_LISTEN_PORT} and see your ${ZITI_BROWZER_SERVICE}!"
echo " "
echo " "
echo " "
```


### If Needed, BrowZer Bootstrapper Logs

```bash
journalctl -fu browzer-bootstrapper
```


## Cleaning up and Trying Again

To clean everything up and try it all over (if you need to) run these commands:
```bash
sudo systemctl stop browzer-bootstrapper
sudo systemctl stop ziti-controller 
sudo systemctl stop ziti-router
sudo rm -rf $HOME/.ziti/quickstart
unsetZitiEnv
cd 
```
