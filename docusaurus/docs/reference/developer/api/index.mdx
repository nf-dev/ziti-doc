---
title: Edge APIs
---

import ApiQuickInfoMd from './_api-quickinfo.md';

<ApiQuickInfoMd/>

## Specifications & Documentation

Both the edge management and client APIs have OpenAPI 2.0, formerly Swagger, specifications. The most up-to-date versions  are
available within the [Ziti Edge API GitHub repository](https://github.com/openziti/edge-api#user-content-versioning). There is also
an API reference web site built in to the running Ziti controller:

- `https://<host>:<port>/edge/client/v1/docs`
- `https://<host>:<port>/edge/management/v1/docs`

Where `<host>:<port>` should be replaced with the values configured for the APIs in the [`web` section](#web-configuration-section)

### Find the Controller Version

It is essential to build your application with respect to the specification of your controller version, and [the spec is versioned separately from the controller](https://github.com/openziti/edge-api#user-content-versioning).

`GET /`

```text
{
    "data": {
        "apiVersions": {
            "edge": {
                "v1": {
                    "path": "/edge/v1"
                }
            }
        },
        "buildDate": "2021-04-23 18:09:47",
        "revision": "fe826ed2ec0c",
        "runtimeVersion": "go1.16.3",
        "version": "v0.19.12"
    },
    "meta": {}
}
```

## Edge Management API

The edge management API is used by clients that wish to configure a network and does not facilitate to interacting
with service for dialing (connecting) nor binding (hosting). The edge management API provides the ability to create
new identities, identities, policies, and other entities used to manage a network.

[Explore the latest edge management API Reference](./02-edge-management-reference.mdx)

## Edge Client API

The edge client API is used by clients that wish to dial (connect) or bind (host) services. The services that the
clients are allowed to interact with is defined by [policies](/docs/learn/core-concepts/security/authorization/policies/overview). In order
for clients to use the client API they must first [authenticate](/docs/learn/core-concepts/security/authentication/auth) and
obtain either a [partial or fully authenticated](/learn/core-concepts/security/sessions.md#full-vs-partial-authentication)
[API Session](/docs/learn/core-concepts/security/sessions).

[Explore the latest edge client API Reference](./01-edge-client-reference.mdx)

## Edge Client & Management Shared Capabilities

The Client and Management APIs both follow the [shared API capabilities](./shared-api-capabilities) common on
all Ziti APIs. Additionally, between the two the following endpoint paths are exposed on both.

- `current-identity` - facilitates the 
  - /edge/management/v1/current-identity/*
  - /edge/client/v1/current-api-session/*
- `current-api-session`
  - /edge/client/v1/current-api-session/*
  - /edge/management/v1/current-api-session/*

## Configuring the Controller Edge APIs

In order for the edge client and management API to be available a controller must be configured to enable them. This 
requires two configuration sections `edge` and `web`. The `edge` section configures values that will affect  both the
Edge client API and the edge management API. The `web` section is used to configure and compose any of Ziti's
APIs, edge client and Management included, to listen on any combination of network interface and ports.

### Controller Configuration Reference

[The controller configuration reference](/reference/30-configuration/controller.md)

#### Example Controller Edge Configuration Section {#edge-configuration-section}

```text
edge:
  api:
    #(optional, default 90s) Alters how frequently heartbeat and last activity values are persisted
    # activityUpdateInterval: 90s
    #(optional, default 250) The number of API Sessions updated for last activity per transaction
    # activityUpdateBatchSize: 250
    # sessionTimeout - optional, default 10m
    # The number of minutes before an Edge API session will timeout. Timeouts are reset by
    # API requests and connections that are maintained to Edge Routers
    sessionTimeout: 30m
    # address - required
    # The default address (host:port) to use for enrollment for the client API. This value must match one of the addresses
    # defined in a bind point's address field for the `edge-client` API in the web section.
    address: 127.0.0.1:1280
  # enrollment - required
  # A section containing settings pertaining to enrollment.
  enrollment:
    # signingCert - required
    # A identity configuration section that specifically makes use of the cert and key fields to define
    # a signing certificate from the PKI that the Ziti environment is using to sign certificates. The signingCert.cert
    # will be added to the /.well-known CA store that is used to bootstrap trust with the controller.
    signingCert:
      cert: ./ziti/etc/ca/intermediate/certs/intermediate.cert.pem
      key: ./ziti/etc/ca/intermediate/private/intermediate.key.pem
    # edgeIdentity - optional
    # A section for identity enrollment specific settings
    edgeIdentity:
      # duration - optional, default 5m
      # The length of time that a Ziti Edge Identity enrollment should remain valid. After
      # this duration, the enrollment will expire and not longer be usable.
      duration: 5m
    # edgeRouter - Optional
    # A section for edge router enrollment specific settings.
    edgeRouter:
      # duration - optional, default 5m
      # The length of time that a edge router enrollment should remain valid. After
      # this duration, the enrollment will expire and not longer be usable.
      duration: 5m
```

#### Example Controller Web Configuration Section {#web-configuration-section}

The `web` section of the controller is based off of the [xweb](https://github.com/openziti/xweb) library. xweb allows
a single configuration section to be used to compose multiple APIs across any number of network interfaces. Understanding
the xweb configuration format is essential for success with configuring the `web` section in the controller.

```text
# web - optional
# Defines webListeners that will be hosted by the controller. Each webListener can host many APIs and be bound to many
# bind points.
web:
# name - required
# Provides a name for this listener, used for logging output. Not required to be unique, but is highly suggested.
- name: all-apis-localhost
  # bindPoints - required
  # One or more bind points are required. A bind point specifies an interface (interface:port string) that defines
  # where on the host machine the webListener will listen and the address (host:port) that should be used to
  # publicly address the webListener(i.e. mydomain.com, localhost, 127.0.0.1). This public address may be used for
  # incoming address resolution as well as used in responses in the API.
  bindPoints:
  #interface - required
  # A host:port string on which network interface to listen on. 0.0.0.0 will listen on all interfaces
    - interface: 127.0.0.1:1280

      # address - required
      # The public address that external incoming requests will be able to resolve. Used in request processing and
      # response content that requires full host:port/path addresses.
      address: 127.0.0.1:1280

      # newAddress - optional
      # A host:port string which will be sent out as an HTTP header "ziti-new-address" if specified. If the header
      # is present, clients should update location configuration to immediately use the new address for future
      # connections. The value of newAddress must be resolvable both via DNS and validate via certificates
      newAddress: localhost:1280
  # identity - optional
  # Allows the webListener to have a specific identity instead of defaulting to the root `identity` section.
  #    identity:
  #      cert:                 ${ZITI_SOURCE}/ziti/etc/ca/intermediate/certs/ctrl-client.cert.pem
  #      server_cert:          ${ZITI_SOURCE}/ziti/etc/ca/intermediate/certs/ctrl-server.cert.pem
  #      key:                  ${ZITI_SOURCE}/ziti/etc/ca/intermediate/private/ctrl.key.pem
  #      ca:                   ${ZITI_SOURCE}/ziti/etc/ca/intermediate/certs/ca-chain.cert.pem
  # options - optional
  # Allows the specification of webListener level options - mainly dealing with HTTP/TLS settings. These options are
  # used for all http servers started by the current webListener.
  options:
  # idleTimeout - optional, default 5000ms
  # The maximum amount of idle time in milliseconds allowed for pipelined HTTP requests. Setting this too high
  # can cause resources on the host to be consumed as clients remain connected and idle. Lowering this value
  # will cause clients to reconnect on subsequent HTTPs requests.
  idleTimeout: 5000ms  #http timeouts, new

  # readTimeout - optional, default 5000ms
  # The maximum amount of time in milliseconds http servers will wait to read the first incoming requests. A higher
  # value risks consuming resources on the host with clients that are acting bad faith or suffering from high latency
  # or packet loss. A lower value can risk losing connections to high latency/packet loss clients.

  readTimeout: 5000ms
  # writeTimeout - optional, default 10000ms
  # The total maximum time in milliseconds that the http server will wait for a single requests to be received and
  # responded too. A higher value can allow long running requests to consume resources on the host. A lower value
  # can risk ending requests before the server has a chance to respond.

  writeTimeout: 100000ms
  # minTLSVersion - optional, default TSL1.2
  # The minimum version of TSL to support

  minTLSVersion: TLS1.2
  # maxTLSVersion - optional, default TSL1.3
  # The maximum version of TSL to support

  maxTLSVersion: TLS1.3
  # apis - required
  # Allows one or more APIs to be bound to this webListener
  apis:
  # binding - required
  # Specifies an API to bind to this webListener. Built-in APIs are
  #   - health-checks
  #   - edge-management
  #   - edge-client
  #   - fabric-management
    - binding: health-checks
      options: { }
    - binding: fabric
    - binding: edge-management
      # options - variable optional/required
      # This section is used to define values that are specified by the API they are associated with.
      # These settings are per API. The example below is for the `edge-api` and contains both optional values and
      # required values.
      options: { }
    - binding: edge-client
      options: { }
```
