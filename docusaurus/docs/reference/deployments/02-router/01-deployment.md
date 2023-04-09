---
id: deployment
title: Router Deployment
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import styles from './styles.module.css';
import CliLogin from '../../../_cli-login.md'
import CliLogFormats from '../../../_cli-log-levels-and-formats.md'

The Ziti Router is the entry point for Ziti-based clients. It is responsible for authenticating incoming connections by
verifying the connecting client has a valid network session.  It also routes traffic to whatever the
destination is for the given service. In simple deployments can have a single router as is the case
with the [Ziti Network Quickstart](/docs/learn/quickstarts/network/).

## Deployment

This article describes the process of deploying a router. It covers what attributes can be updated, removed, and added after the deployment is completed.

:::info Notes
The life cycle of a router does not allow for the advertised, external DNS name or IP address to change. A new router must be created.
:::

## Process of Deployment

It is advisable to generate private keys on the same host where they'll be used. This minimizes the risk of losing custody of the private key material.

:::info Note
Ensure you are logged in for managing routers with the CLI

<CliLogin/>

:::

### Download Binaries

You will need the `ziti-router` executable from [OpenZiti Releases](https://github.com/openziti/ziti/releases/latest).

### Create Config File {#router-config-file}

The router loads its configuration from a YAML file. You may use the `ziti create config router` command to generate a config file, influencing the contents with options and variables. Here are [some practical examples representing common deployment scenarios](./02-configuration.md).

The `identity.key` field in the config behaves differently for routers. If a file exists in the path indicated by `key` then the key will be used during router enrollment. If it does not exist then a unique key will be generated.

```yaml
identity:
    cert:                 "~/.ziti/config/certs/router01.zitinetwork.example.org.cert"
    server_cert:          "~/.ziti/config/certs/router01.zitinetwork.example.org.server.chain.cert"
    key:                  "~/.ziti/config/certs/router01.zitinetwork.example.org.key"
    ca:                   "~/.ziti/config/certs/router01.zitinetwork.example.org.cas"
```

### Create Router {#router-create}

The life cycle of a router begins by calling the controller's management API to create a router. You can do this with [the REST API](../../developer/api/index.md) or [the `ziti` CLI](./04-cli-mgmt.md#create-router).

### Enroll Router {#enrollment}

Creating a router yields a one-time enrollment token that you may store as a JWT file. Enrollment consumes the token and facilitates issuing a client certificate for the router, establishing cryptographic trust with the controller.

```bash
ziti-router enroll config.yaml --jwt token.jwt
```

### Run Router {#router-run}

```bash
ziti-router run config.yaml
```

```ini
# /etc/systemd/system/ziti-router.service
[Unit]
Description=Ziti Router
After=network.target

[Service]
User=root
WorkingDirectory=/etc/openziti/router
ExecStart=/usr/local/sbin/ziti-router run /etc/openziti/router/config.yml --log-formatter pfxlog
Restart=always
RestartSec=2
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

### Manage Router {#router-update}

You can manage a router's role attributes, tags, etc. with [the REST API](../../developer/api/index.md) or [the `ziti` CLI](./04-cli-mgmt.md#managing-routers-with-the-cli) for more details

### Configure Logging

<CliLogFormats/>
