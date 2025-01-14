---
id: cli-mgmt
title: Managing Routers with the CLI
sidebar_label: CLI Mgmt
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CliLogin from '/docs/_cli-login.md'

## Login

<CliLogin/>

## Create a Router

<Tabs groupId="routerType">

<TabItem value="TunnelerEnabled" label="Router with Tunneler">

The tunneler flag must be administratively set when the router is created or updated or the router will not start.

<br />

```text
ziti edge create edge-router "router2" \
    --jwt-output-file router2.jwt \
    --tunneler-enabled
```

</TabItem>

<TabItem value="NoTraversal" label="Router with No Traversal">

No-traversal routers are administratively excluded from the set of routers that provide smart routing for transiting service traffic. They still provide service termination and origination.

```text
ziti edge create edge-router "router3" \
    --jwt-output-file router3.jwt \
    --no-traversal
```

</TabItem>

</Tabs>

## Update a Router

The update command will replace all administrative properties of the router. This example preserves the properties from the router3 example above, adding the `--tunneler-enabled` flag.

```text
ziti edge update edge-router "router3" \
    --no-traversal \
    --tunneler-enabled
```

## Additional Flags

- App-Data can be used to set key/value pair to be used in addressable terminator service for example.

```text
--app-data stringToString   Custom application data (default [])
--app-data "fqdn"="aksprod-cae02995.eastus2.azmk8s.io"
```

- Router cost can be used to influence the smart routing to not use this router for service traversal unless no other paths are available.

```text
--cost uint16               Specifies the router cost. Default 0.
--cost 300
```

- No-traversal flag means no service traversal through this router at all. Only the service termination or origination can be completed on it.

```text
--no-traversal              Disallow traversal for this edge router. Default to allowed(false).
```

- The role attribute flag allows to set a list of attributes that can be referenced by all policies for dialing and/or hosting services.

```text
-a, --role-attributes strings   Set role attributes of the edge router. Use --role-attributes '' to set an empty list
 --role-attributes 'example,example2,example3'
```

## Role Attributes are Powerful

Consider an autoscaling group scenario where routers are created or deleted with scale-out or scale-in events. Attribute-based access control enables this scenario because the policies grant roles instead of the individual, temporary identities.

If router names or IDs were referenced explicitly in such a scenario then all policies would need to be updated upon the scale-out event with new grants like `@router_name`. To keep the complexity of this deployment to minimum, it just makes sense to use role `#attributes`.
