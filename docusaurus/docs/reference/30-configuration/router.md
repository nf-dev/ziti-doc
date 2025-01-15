---
sidebar_label: Router
sidebar_position: 30
---

# Router Configuration Reference

OpenZiti uses configuration files for controllers that are in the [YAML](https://yaml.org/) format.
All configuration files are also subject to a set of [conventions](conventions.md) such as
environment variable substitution, identity sections, and addressing formats.

## Sections

The router configuration file has several top level configuration sections that group together
related configuration settings.

- [`ctrl`](#ctrl) - configuration for controller addressing/connections
- [`dialers`](#dialers) - configures dialers used when router termination is used to contact target
  services for overlay egress
- [`edge`](#edge) - edge specific configuration, required to enable edge functionality (e.g. edge
  SDK connectivity)
- [`forwarder`](#forwarder) - configures various forwarder settings (e.g. link latency probing, idle
  sessions, dial queues, etc.)
- [`healthChecks`](#healthChecks) - enables router health checks for controller connectivity
- [`identity`](#identity) - configures the certificates used for outbound client connections, server
  listening, and CA bundles
- [`link`](#link) - the type of link listeners available for incoming router link and outgoing
  router link connections
- [`listeners`](#listeners) - the interfaces, ports, and addresses exposed for connection by outside
  clients (e.g. edge SDK clients, non-edge connections)
- [`metrics`](#metrics) - configures metrics reporting
- [`trace`](#trace) - adds a peek handler to all router messaging for debug purposes
- [`transport`](#transport) - enables transport level configuration that affects all instances of
  specific transports
- [`profile`](#profile) - enables profiling of router memory and CPU statistics
- [`web`](#web) - configures API presentation exposure
- [`v`](#v) - A special section to note the version of the configuration file, only `v: 3` is
  currently supported

The standard OpenZiti experience minimally requires the following sections:

- `ctrl`
- `dialers`
- `edge`
- `identity`
- `link`
- `listeners`
- `v`

Of those values, to start the controller only the `ctrl`, `v` and `identity` sections are required.
Not including
the `dialer` section will not allow the router to connect to terminate services. Not including
the `edge` section will start the controller in
"fabric only" mode and will not support any edge functionality or concepts (edge SDK connectivity).
Not including the
`link` section will not allow the router to connect/dial or accept/host other routers for mesh
establishment. Not including the `listeners` configuration will not allow external connections to
on-ramp connections over the mesh.

Example Minimum Router Configuration:

```text
v: 3

identity:
  cert: router.cert.pem
  server_cert: router.server.cert.pem
  key: router.key.pem
  ca: ca-chain.cert.pem

ctrl:
  endpoint: tls:127.0.0.1:6262

dialers:
  - binding: udp
  - binding: transport

edge:
  csr:
    country: US
    province: NC
    locality: Charlotte
    organization: OpenZiti
    organizationalUnit: Ziti
    sans:
      dns:
        - "localhost"
      ip:
        - "127.0.0.1"


link:
  listeners:
    - binding: transport
      bind: tls:127.0.0.1:6002
      advertise: tls:127.0.0.1:6002
  dialers:
    - binding: transport

listeners:
  - binding: edge
    address: tls:0.0.0.0:3022
  - binding: transport
    address: tls:0.0.0.0:7099
```

### `ctrl`

The `ctrl` section configures how the router will connect to the controller.

- `bind` - (optional) the address of a local interface used to dial the controller address specified
  in `endpoint` or `endpoints`
- `defaultRequestTimeout` - (optional, 5s) the amount of time use for controller connection
  timeouts (
  see [time units](conventions.md#time-units))
- `endpoint` - (optional) the address of the controller. Either `endpoint` or `endpoints` is
  required. If both are provided, `endpoints` will be ignored. Once the router is connected to a
  controller the set of endpoints will be kept up to date with current set of cluster members.
- `endpoints` - (optional) a list of controller addresses. Either `endpoint` or `endpoints` is
  required. If both are provided, `endpoints` will be ignored
- `heartbeats` - (optional) set of options for configuring heartbeats to the controller(s).
  See [heartbeats](./conventions.md#heartbeats).
- `options` - a set of option which includes the below options and those defined
  in [channel options](conventions.md#channel)

Example:

```text
ctrl:
  endpoint: tls:127.0.0.1:6262
```

### `dialers`

The `dialers` sections defines the configuration for dialers that are used to dial (connect) to
services from routers. Various dialers are supported and referenced by `binding` name. This section
is an array of objects that configures individual dialers specified by the property `binding`.

Example:

```text
dialers:
  - binding: binding1
    options:
      mtu: 1000
      #...options
  - binding: binding2
    options:
    #...options
  #...
```

The following dialer bindings that are supported in the `binding` field are:

- `proxy` - tbd
- `proxy_udp` - tbd
- `transport` - tbd
- `transport_udp` - tbd

Each dialer currently supports a number of [shared options](conventions.md#xgress-options)

### `edge`

The `edge` section contains configuration that pertain to edge functionality. This section must be
present to enable edge functionality (e.g. listening for edge SDK connections, tunnel binding modes).

Example:

```text
edge:
  csr:
    country: US
    province: NC
    locality: Charlotte
    organization: OpenZiti
    organizationalUnit: Ziti
    sans:
      dns:
        - "localhost"
        - "test-network"
        - "test-network.localhost"
        - "ziti-dev-ingress01"
      email:
        - "admin@example.com"
      ip:
        - "127.0.0.1"
      uri:
        - "ziti://ziti-dev-router01/made/up/example"
```

Not specifying the
`edge.csr` section will not allow the router to enroll or renew existing enrollments. 

#### `edge.csr`

The `edge.csr` section is used during router enrollment and enrollment extension. It specifies values
that will be used in the certificates that are the result of enrollment.

Many of the values in this section are optional, however to accept connections from SDKs or other
routers at least one valid SAN must be provided.

- `country` - (optional) the subject information country field
- `province` - (optional) the subject information province field
- `locality` - (optional)  the subject information locality field
- `organization` - (optional)  the subject information organization field
- `organizationalUnit` - (optional)  the subject information organization unit field
- `sans` - (optional) - a subsection used to define Subject Alternate Names
    - `dns` - (optional) - an array of DNS SAN entries
    - `ip` - (optional) - an array of IP SAN entries
    - `uri` - (optional) - an array of URI SAN entries
    - `email`  - (optional) - an array of email SAN entries


### `forwarder`

The `forwarder` section controls options that affect how a router forwards payloads across links to
other routers within the mesh or egresses data to targeted services if the service is terminated by
a router.

- `faultTxInterval` - (optional, 15,000) an integer representing the milliseconds to wait between
  checking for circuits that have faulted, 0=disabled
- `idleCircuitTimeout` - (optional, 60,000) an integer representing the milliseconds to wait before
  marking a circuit as idle and requesting a circuit confirmation
- `idleTxInterval` -  (optional, 60,000) an integer representing the milliseconds to wait between
  checks for confirming idle circuits are in use, 0=disabled
- `linkDialQueueLength` -  (optional, 1000) an integer between 1 and 10,000 that represents the
  maximum number of queued outgoing router link dials
- `linkDialWorkerCount` - (optional, 32) an integer between 1 and 10,000 that represents the maximum
  number of workers emptying the link dial queue
- `rateLimitedQueueLength` -  (optional, 5000) an integer between 1 and 50,000 that represents the
  maximum number of rate limited operations to the controller. This currently includes terminator
  creates
- `rateLimitedWorkerCount` - (optional, 5) an integer between 1 and 10,000 that represents the
  maximum number of workers emptying the rate limited operations queue
- `xgressCloseCheckInterval` - (optional, 5,000) an integer representing the milliseconds to wait
  before un-routing a circuit for due to idleness
- `xgressDialDwellTime` - (optional, 0) an integer representing the milliseconds to wait before
  dialing a service for egress
- `xgressDialQueueLength` - (optional, 1000) an integer between 1 and 10,000 that represents the
  maximum number of queued outgoing service dials
- `xgressDialWorkerCount` - (optional, 128) an integer between 1 and 10,000 that represents the
  maximum number of workers emptying the xgress dial queue

Example:

```text
forwarder:
  latencyProbeInterval: 1000
```

### `healthChecks` {#healthChecks}

The `healthChecks` sections allows configuration of router health checks performed. Health check
status is available by exposing the `health-checks` API in the `web` section.

- `ctrlPingCheck` - (optional) - configures controller health check pings
    - `interval` - (optional, 30s) - the frequency to ping the controller with connection checks
    - `timeout` - (optional, 15s) - the length of time to wait before giving up on a controller
      health ping
    - `initialDelay` - (optional, 15s) - the length of time to wait before starting controller
      health check pings
- `linkCheck` - (optional) - configures link checks. A router maybe expected to have a certain
  number of links. It may be desirable to alert if the number of links falls below the expected
  number
    - `interval` - (optional, 5s) - how often to run the check
    - `initialDelay` - (optional, 1s) - how long to wait before running the check for the first time
    - `minLinks` - (optional, 0) - minimum number of links before failing the check. By default, no
      links are required and the check will just return information about the links that do exist

Example:

```text
healthChecks:
  ctrlPingCheck:
    interval: 30s
    timeout: 15s
    initialDelay: 15s
```

### `identity`

The identity section includes the default server certificate and private key used for services
hosted by the router, alternate server certificates and keys to support SNI on hosted services,
client certificate and private key when making connections, and the `ca` bundle that the controller
will use when making connections to controllers and routers. See the conventions that apply to
all [identity](conventions.md#identity) sections for field level detail.

### `link`

The `link` section configures which protocols and ports are used to listen for incoming router mesh
links via the `listeners` subsection and which protocols are used to dial other routers via the
`dialers` subsection. Dialers and listeners use `binding` names which can be further configured in
the [`transport` section](#transport). For both

- `listeners` (optional) - configures if and how this router should listen for connections from
  other routers to form the data plane mesh
    - `binding` - (required) - specifies which subsystem should instantiate this listener. Currently
      only `transport` is supported
    - `bind` - (required) the [address](./conventions.md#addressing) that the listener should listen
      on
    - `advertise` - (required) the `<host>:<port>` combination that external resources should use to
      reach this listener The `listeners` subsection supports the same settings and option as in
      the [`listeners` section](#listeners).
    - `groups` - (optional, [`default`]) - Both dialers and listeners can now specify a set of
      groups. If no groups are specified, the dialer or listener will be placed in the `default`
      group. Dialers will only attempt to dial listeners who have at least one group in common with
      them.
    - `options` - (optional) options specified by the component specifically in addition to
      the [shared options](./conventions.md#xgress-options)
- `dialers` (optional) - configures if and how this router should try to make connections to other
  routers to form the data plane mesh
    - `split` - (optional, true) - indicates if a single connection should be made for all data, or
      if separate connections should be made, one for payloads and the other for acknowledgments
    - `binding` - (required) - specifies which subsystem should instantiate this listener. Currently
      only `transport` is supported
    - `bind` - (optional) the network interface, or local IP address to use for routing outbound
      data
    - `groups` - (optional, [`default`]) - Both dialers and listeners can now specify a set of
      groups. If no groups are specified, the dialer or listener will be placed in the `default`
      group. Dialers will only attempt to dial listeners who have at least one group in common with
      them.
    - `options` - (optional) options specified by the component specifically in addition to
      the [shared options](./conventions.md#xgress-options)
    - `healthyDialBackoff` - (optional) - configures how the dialer will retry dialing link
      connections when a dial fails. This backoff policy is used when the router being dialed is
      connected to the controller, and is thus expected to be available
        - `minRetryInterval` - (optional, default 5s, min 10ms, max 24h) - duration specifying the
          minimum time between dial attempts
        - `maxRetryInterval` - (optional, default 5m, min 10ms, max 24h) - duration specifying the
          maximum time between dial attempts
        - `retryBackoffFactor` - (optional, default 1.5, min 1, max 100) - factor by which to
          increase the retry interval between failed dial attempts
    - `unhealthyDialBackoff` - (optional) - configures how the dialer will retry dialing link
      connections when a dial fails. This backoff policy is used when the router being dialed is
      **not** connected to the controller, and is thus expected to be available. Note that when a
      router connects to a controller, other routers are notified and will both immediately try to
      connect to the router, if they are not already, and will switch to the
      `healthyDialBackoff` policy
        - `minRetryInterval` - (optional, default 1m, min 10ms, max 24h) - duration specifying the
          minimum time between dial attempts
        - `maxRetryInterval` - (optional, default 1h, min 10ms, max 24h) - duration specifying the
          maximum time between dial attempts
        - `retryBackoffFactor` - (optional, default 10, min 1, max 100) - factor by which to
          increase the retry interval between failed dial attempts

Example:

```text
link:
  dialers:
    - binding: transport
  listeners:
    - binding: transport
      bind: tls:127.0.0.1:6004
      advertise: tls:127.0.0.1:6004
```

### `listeners`

Listeners configure different types of server logic and protocols to be "listened" for on the
router. This includes opening ports on one or more interfaces specified in the `address` option.
The `address` field is formatted according to
the [address conventions](./conventions.md#addressing). The advertise field specifies the address a
client will use to connect to the listener.

- `binding` - (required) the name of a [xgress component](./conventions.md#xgress-components) that
  will provide the server side logic for the listener
- `bind` - (required) the [address](./conventions.md#addressing) that the listener should listen on
- `advertise` (required) the `<host>:<port>` combination that external resources should use to reach
  this listener
- `options` - (optional) options specified by the component specifically in addition to
  the [shared options](./conventions.md#xgress-options)

```text
listeners:
  - binding: edge
    address: tls:0.0.0.0:3022
    options:
      advertise: 127.0.0.1:3022
```

#### tunnel `listeners`

A tunnel is a special kind of listener binding.

When generating a router configuration with `ziti create config router edge` the tunnel binding is
enabled with default mode `host`. This mode continually configures the router's tunnel to reverse
proxy the list of services that are authorized by Bind Service Policy.

```text
listeners:
  - binding: tunnel
    options:
      mode: host
```

If tunnel is enabled at the time the router is created then its configuration may be changed and
will take effect when the router is restarted. For example, this configures the router's tunnel to
transparently proxy all services authorized by Dial Service Policy and provide a nameserver. This
mode also enables the reverse proxy features of `host` mode.

```text
listeners:
  - binding: tunnel
    options:
      mode: tproxy
      resolver: udp://127.0.0.1:53
      dnsSvcIpRange: 100.80.0.0/12  # optionally customize the dynamic IP range used by Ziti DNS
```

In this example the router's tunnel is configured to provide a forward proxy listener for a list of
service, TCP port pairs. This mode also enables the reverse proxy features of `host` mode.

```text
listeners:
  - binding: tunnel
    options:
      mode: proxy
      services:
        - zedsDemoHttpHttpbin:8080
```

### `metrics`

The `metrics` section controls how metrics are communicated to the connection controller.

- `reportInterval` - (optional, 1m) the interval of time to wait between crafting a new metrics
  message to be sent to the controller
- `messageQueueSize` - (optional, 10) the maximum number of buffered metrics messages allowed to be
  queued to send to the controller
- `intervalAgeThreshold` - (optional, 80s) how old a batch of metrics must be before it's eligible
  to be sent to the controller

```text
metrics:
  reportInterval: 1m
  messageQueueSize: 10
```

### `trace`

The `trace` section instructs the router to output incoming and outgoing messaging it receives. This
setting is useful for debugging purposes only and should not be enabled in production environments
without careful consideration.

- `path` - (required) the file to output decoded messages to

```text
trace:
  path: /var/opt/open.ziti.router.trace
```

### `transport`

The `transport` section is for advanced configuration of underlay protocols. It currently only
applies to an internally tuned TCP protocol named Transwarp and is tuned using `westworld3`
configuration options. This section should largely be unnecessary outside of development.

```text
transport:
  westworld3:
    profile_version: 1
    tx_portal_min_sz: 16384
    tx_portal_max_sz: 1073741824
    instrument:
      name: metrics
      path: /tmp/westworld3
      snapshot_ms: 250
      enabled: true
```

### `profile`

The profile section allows for [CPU (pprof) and memory (memprof)](https://go.dev/blog/pprof) dumps
to be created. CPU profiling is buffered by the application's runtime and output to the designated
file. Memory profiling allows the interval memory profiling occurs at and is output. These settings
are useful for debugging purposes only and should not be enabled in production environments without
careful consideration.

- `cpu` - (optional)
    - `path` - (required) the path to output the pprof data
- `memory` - (optional)
    - `path` - (required) the path to output the memprof data
    - `intervalMs` (optional) the frequency to output memprof data (default 15s)

```text
profile:
  cpu:
    path: /home/user1/tmp/ctrl.cpu.pprof
  memory:
    path: ctrl.memprof
    intervalMs: 150000
```

### `web`

The `web` section follows the [conventions of XWeb](conventions.md#xweb). The controller has the
following APIs defined:

- `health-checks` - provides a health check API that allows remote parties to verify the health of
  the controller

Each API may have their own options, but currently do not.

### `v`

The `v` section is used to detect if the version file is supported by the OpenZiti binary read it.
The current and only supported value is "3".

```text
v: 3
```
