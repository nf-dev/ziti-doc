---
id: router-configuration
title: Router Configuration
sidebar_label: Configuration
hide_table_of_contents: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This article expands on the [Linux router deployment](/guides/deployments/10-linux/20-router/10-deploy.mdx) article with configuration concepts and examples.

## Config Management

Edit the generated configuration YAML file or run `ziti create config router` to generate one from scratch. Run `ziti create config environment` for descriptions of the environment variables that influence the generated output.

## Identity

The `identity` configuration section defines the paths to the router's identity files: certs, keys, and a bundle of trusted root CA certificates. All of the files will be created in the specified paths at the time of router enrollment. The router will automatically renew its certificates if the path remains writable.

```text
identity:
    cert:                 /var/lib/ziti-router/client.cert
    server_cert:          /var/lib/ziti-router/server.chain.cert
    key:                  /var/lib/ziti-router/private.key
    ca:                   /var/lib/ziti-router/trusted-root.cas
```

### Private Key

The [`identity`](/reference/30-configuration/conventions.md#identity) configuration section is common to routers and controllers, but the `key` sub-property behaves differently for routers. If a private key exists in the path, then it will be used to sign router enrollment certificate requests. If it does not exist, then a private key will be locally generated and stored in that path.

If present, the `server_key` signs the router's server certificate request. Otherwise, the `key` sub-property is used for both client and server certificate.

The private keys' values are assumed to be `file://` URLs if unspecified. Alternatives include `pkcs11://` and `parsec://` URLs for [hardware keys](/guides/hsm/index.md).

## Optional Capabilities

You may enable or disable capabilities of the router by including or omitting their sections in the configuration file. These are a few of the most relevant configuration sections. Refer to [the router configuration reference](/reference/30-configuration/router.md) for more complete information.

- [`edge`](/reference/30-configuration/router.md#edge) - Most routers include this section which configures the router to listen for connections from endpoint identities. This is what makes a router an "edge router." Without this section, the router is a "fabric router" and communicates only with other routers and the control plane.
- [`link.listeners`](/reference/30-configuration/router.md#link) - The `link` section configures the router to dial and listen for other routers that are dialing in to create mesh links. Omitting the `listeners` sub-section makes a router "private." "Public" routers are presumed reachable and listening for other routers.
- [`listeners[?binding == 'tunnel']`](/reference/30-configuration/router.md#listeners) - the `listeners` section may contain a special type of binding that configures the router's built-in tunneling capabilities: `binding: tunnel`. The tunnel's `mode` property may be set to `tproxy`, `proxy`, or `host`. Requires `edge`.
  - `tproxy` mode requires the `CAP_NET_ADMIN` capability and that the host's DNS resolver is set to use the nameserver provided by the router. The `tproxy` mode is useful for transparently proxying services and providing Ziti DNS to non-Ziti applications.

## Examples

<br />

<Tabs groupId="routerType">

<TabItem value="Public-Edge" label="Public Router">

This is an example of generating a public router configuration with the `ziti` CLI.

<br />

```text
#!/usr/bin/env bash

# working directory for the router
export ZITI_HOME=/var/lib/ziti-router

# address and port of control plane endpoint
export  ZITI_CTRL_ADVERTISED_ADDRESS=ctrl.ziti.example.org \
        ZITI_CTRL_ADVERTISED_PORT=1280

# address and port of this router
export  ZITI_ROUTER_ADVERTISED_ADDRESS=router1.ziti.example.org \
        ZITI_ROUTER_PORT=3022 \
        ZITI_ROUTER_LISTENER_BIND_PORT=3022

ziti create config router edge \
    --routerName router1 \
    --tunnelerMode none
```

### Public Router config.yml

```text
v: 3

identity:
  cert:             "/var/lib/ziti-router/router1.cert"
  server_cert:      "/var/lib/ziti-router/router1.server.chain.cert"
  key:              "/var/lib/ziti-router/router1.key"
  ca:               "/var/lib/ziti-router/router1.cas"

ctrl:
  endpoint:             tls:ctrl.ziti.example.org:1280

link:
  dialers:
    - binding: transport
  listeners:
    - binding:          transport
      bind:             tls:0.0.0.0:3022
      advertise:        tls:router1.ziti.example.org:3022
      options:
        outQueueSize:   4

listeners:
  - binding: edge
    address: tls:0.0.0.0:3022
    options:
      advertise: router1.ziti.example.org:3022
      connectTimeoutMs: 5000
      getSessionTimeout: 60

edge:
  csr:
    country: US
    province: NC
    locality: Charlotte
    organization: NetFoundry
    organizationalUnit: Ziti
    sans:
      dns:
        - localhost
        - router1.ziti.example.org
      ip:
        - "127.0.0.1"

forwarder:
  latencyProbeInterval: 0
  xgressDialQueueLength: 1000
  xgressDialWorkerCount: 128
  linkDialQueueLength: 1000
  linkDialWorkerCount: 32
```

</TabItem>

<TabItem value="Gateway" label="Private Router with Tunneler">

This is an example of generating a private router configuration with the `ziti` CLI. 

<br />

```text
#!/usr/bin/env bash

# working directory for the router
export ZITI_HOME=/var/lib/ziti-router

# address and port of control plane endpoint
export  ZITI_CTRL_ADVERTISED_ADDRESS=ctrl.ziti.example.org \
        ZITI_CTRL_ADVERTISED_PORT=1280

# address and port of this router
export  ZITI_ROUTER_ADVERTISED_ADDRESS=router2.ziti.example.org \
        ZITI_ROUTER_PORT=3022 \
        ZITI_ROUTER_LISTENER_BIND_PORT=3022

ziti create config router edge \
    --routerName router2 \
    --tunnelerMode tproxy \
    --private
```

<br />

Public routers dial and listen for other routers dialing mesh links. Private routers dial for mesh links but do not listen. The `edge` capability is independent of the `link` capability, and so both private and public routers may listen for and advertise edge connections from endpoints.

<br />

### Private Router with Tunneler config.yml

```text
v: 3

identity:
  cert:             "/var/lib/ziti-router/router2.cert"
  server_cert:      "/var/lib/ziti-router/router2.server.chain.cert"
  key:              "/var/lib/ziti-router/router2.key"
  ca:               "/var/lib/ziti-router/router2.cas"

ctrl:
  endpoint:             tls:ctrl.ziti.example.org:1280

link:
  dialers:
    - binding: transport

listeners:
  - binding: edge
    address: tls:0.0.0.0:3022
    options:
      advertise: router2.ziti.example.org:3022
      connectTimeoutMs: 5000
      getSessionTimeout: 60
  - binding: tunnel
    options:
      mode: tproxy
      resolver: udp://127.0.0.1:53
      lanIf: 

edge:
  csr:
    country: US
    province: NC
    locality: Charlotte
    organization: NetFoundry
    organizationalUnit: Ziti
    sans:
      dns:
        - localhost
        - router2.ziti.example.org
      ip:
        - "127.0.0.1"


forwarder:
  latencyProbeInterval: 0
  xgressDialQueueLength: 1000
  xgressDialWorkerCount: 128
  linkDialQueueLength: 1000
  linkDialWorkerCount: 32

```

</TabItem>

</Tabs>
