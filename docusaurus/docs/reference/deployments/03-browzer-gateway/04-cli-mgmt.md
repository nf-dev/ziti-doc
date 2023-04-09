---
id: browzer-gateway-cli-mgmt
title: BrowZer Gateway CLI Mgmt
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import styles from './styles.module.css';
import CliLogin from '../../../_cli-login.md'

:::info Notes
IGNORE THIS PAGE FOR THE MOMENT.
:::

## Managing Ziti BrowZer Gateway with the CLI

In this article we are highlighting the most relevant commands and options for managing routers with the `ziti` CLI.

:::info Important Note
Routers or their identities can be referenced by `@router_name` or `#attribute` in various policies like service policy, edge router policy, etc. Using group `#attribute` is recommended.
:::

### Login

<CliLogin/>

### Create Router

The router creation command is described with the minimum required options to create the type shown. For the more detail options list, please refer to the [Flags Section](#flags). 

<Tabs groupId="routerType">
<TabItem value="Private" label="Private Router with Edge">

```bash
ziti edge create edge-router $ROUTER_NAME \
                            --jwt-output-file $ROUTER_NAME.jwt
```

</TabItem>
<TabItem value="Gateway" label="Private Router with Edge and Tunneler">

:::info Notes
`--no-travesal` flag is not required, but keep in mind that private routers are stub routers and setting it to true disables transitive routing through it.
In other words, only connections destined for this router will be routed to it by the smart routing algorithm. `--tunneler-enabled or just -t` flag indicates the tunnel mode.
:::

```bash
ziti edge create edge-router $ROUTER_NAME \
                            --jwt-output-file $ROUTER_NAME.jwt \
                            --tunneler-enabled --no-traversal 
```

</TabItem>
<TabItem value="Public-Edge" label="Public Router with Edge">

```bash
ziti edge create edge-router $ROUTER_NAME \
                            --jwt-output-file $ROUTER_NAME.jwt
```

</TabItem>
</Tabs>

### List Routers

```bash
ziti edge list edge-routers
```

### Delete Router

```bash
ziti edge delete edge-routers $ROUTER_NAME
ziti edge delete edge-routers $ROUTER_ID
```

### Update Router

For the more detail options list, please refer to the [Flags Section](#flags).

```bash
ziti edge update edge-router $ROUTER_NAME [flags]
ziti edge update edge-router $ROUTER_ID [flags]
```

### Flags

- App-Data can be used to set key/value pair to be used in addressable terminator service for example.

```bash
--app-data stringToString   Custom application data (default [])
--app-data "fqdn"="aksprod-cae02995.eastus2.azmk8s.io"
```

- Router cost can be used to influence the smart routing to not use this router for service traversal unless no other paths are available.

```bash
--cost uint16               Specifies the router cost. Default 0.
--cost 300
```

- No-traversal flag means no service traversal through this router at all. Only the service termination or origination can be completed on it.

```bash
--no-traversal              Disallow traversal for this edge router. Default to allowed(false).
```

- The role attribute flag allows to set a list of attributes that can be referenced by all policies for dialing and/or hosting services.

```bash
-a, --role-attributes strings   Set role attributes of the edge router. Use --role-attributes '' to set an empty list
 --role-attributes 'example,example2,example3'
```

### Attributes

Let's consider an Autoscaling Group scenario, where routers would be created or deleted as the scale-out or scale-in events occur respectively. If router names were referenced in such deployment, then all policies would need to be updated upon the scale-out event with `@router_name`. To keep the complexity of this deployment to minimum, it just makes sense to use #attribute, where no other updates would be needed.
