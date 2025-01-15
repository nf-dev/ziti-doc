---
sidebar_label: Controller
sidebar_position: 20
---

# Controller Configuration Reference

OpenZiti uses configuration files for controllers that are in the [YAML](https://yaml.org/) format.
All configuration files are also subject to a set of [conventions](conventions.md) such as
environment variable substitution, identity sections, and addressing formats.

## Sections

The controller configuration file has several top level configuration sections that group together
related configuration settings.

- [`ctrl`](#ctrl) - define control channel listener
- [`db`](#db) - specifies database file location
- [`edge`](#edge) - configures edge specific functionality
- [`events`](#events) - allows configuration of event output
- [`healthChecks`](#healthchecks) - enables controller database health checks for transactions
- [`identity`](#identity) - configures the certificates used for outbound client connections, server
  listening, and CA bundles
- [`network`](#network) - set network level cost values
- [`profile`](#profile) - enables profiling of controller memory and CPU statistics
- [`raft`](#raft) - allows configuring the controller in an HA cluster
- [`trace`](#trace) - adds a peek handler to all controller messaging for debug purposes
- [`web`](#web) - configures API presentation exposure
- [`v`](#v) - A special section to note the version of the configuration file, only `v: 3` is
  currently supported

The standard OpenZiti experience minimally requires the following sections:

- `ctrl`
- `db` or `raft`
- `identity`
- `edge`
- `web`
- `v`

Of those values, to start the controller only the `ctrl`, `db` or `raft`, `v`, and `identity`
sections are required. However, not including the `edge` section will start the controller in "
fabric only" mode and will not support any edge functionality or concepts (identities, JWT
enrollment, 3rd Party CAs, policies, etc.). Not including the `web` section will result in none of
the REST APIs (fabric management API, edge client API, edge management API, health check API) being
started. Without the edge and fabric management APIs running administration of the network will be
impossible. Without the edge client API running it will be impossible for Edge clients to connect to
services.

Example Minimum Controller Configuration:

```text
v: 3

db: ctrl.db

identity:
  cert: ctrl-client.cert.pem
  server_cert: ctrl-server.cert.pem
  key: ctrl.key.pem
  ca: ca-chain.cert.pem

ctrl:
  listener: tls:127.0.0.1:6262

edge:
  enrollment:
    signingCert:
      cert: intermediate.cert.pem
      key: intermediate.key.pem


web:
  - name: all-apis-localhost
    bindPoints:
      - interface: 127.0.0.1:1280
        address: 127.0.0.1:1280
    apis:
      - binding: fabric
      - binding: edge-management
      - binding: edge-client
```

### `ctrl`

The `ctrl` section configures how the controller will listen for incoming connections from routers.
This includes the protocol(s) used for router connections and how those connections are managed.

- `listener` - (required) is in the format of `<protocol>:<interface>:<port>` format. The value set
  here must be resolvable by routers and correspond the routers `ctrl.endpoint` configuration value.
  See [addressing](./conventions.md#addressing).
- `options` - a set of option which includes the below options and those defined
  in [channel options](./conventions.md#channel)
  - `advertiseAddress` - (required when raft is enabled) - configures the address at which this
    controller should be reachable by other controllers in the cluster
  - `newListener` - (optional) an `<protocol>:<interface>:<port>` address that is sent to routers
        to indicate a controller address migration. Should only be specified when the new listener
        address is reachable as clients will begin to use the new value on restart
  - `peerHeartbeats` - (optional) set of options for configuring heartbeats to other controllers in
    the cluster. See [heartbeats](./conventions.md#heartbeats).
  - `routerHeartbeats` - (optional) set of options for configuring heartbeats to routers.
    See [heartbeats](./conventions.md#heartbeats).

Example w/o options:

```text
ctrl:
  listener: tls:127.0.0.1:6262
```

Example w/ options:

```text
ctrl:
  listener: tls:127.0.0.1:6262
  options:
    maxQueuedConnects: 1000
    maxOutstandingConnects: 16
    connectTimeoutMs: 1000
    writeTimeout: 15s
```

### `db`

The `db` section is a single scalar value that defines the path to the database file that the
controller should use. OpenZiti uses a file backed in memory database. This path may be on the same
or different drive. This section is required.

Example:

```text
db: /mnt/fast-drive/db/ctrl.db
```

### `edge`

The `edge` section instructs the controller to start the edge components. If the section is not
defined, all edge functionality will be disabled. This includes all features associated with
identities (e.g. identity enrollment), 3rd Party CAs, policies, edge router connections, posture
checks, and more. It is highly unlikely that this section should be omitted.

The `edge` section also has the following subsections:

- `api` - (required) defines API specific configuration
- `enrollment` - (required) defines enrollment specific configuration

Example Minimum Edge:

```text
edge:
  enrollment:
    signingCert:
      cert: intermediate.cert.pem
      key: intermediate.key.pem
```

Example Fully Defined:

```text
edge:
  api:
    activityUpdateInterval: 90s
    activityUpdateBatchSize: 250
    sessionTimeout: 30m
    address: 127.0.0.1:1280
  enrollment:
    signingCert:
      cert: intermediate.cert.pem
      key: intermediate.key.pem
    edgeIdentity:
      duration: 5m
    edgeRouter:
      duration: 5m

```

#### `api`

The `api` section within the `edge` section defines API specific functionality.

- `activityUpdateInterval` - (optional) the interval used to buffer API Session usage notices
- `sessionTimeout` - (optional) The amount of time an edge API Session remains alive after the last
  REST API Request was processed or the last edge router connection for an API Session was closed
- `address` - (required) the `<host>:<port>` combination that should be used to externally resolve
  to the edge client API

For `activityUpdateInterval`, Edge Routers report connected API Sessions periodically and the
controller tracks REST API requests. `activityUpdateInterval` defines the interval those updates are
collated and buffered over. This is done to reduce the number of database writes required to persist
API Session activity data. During the interval period the controller will buffer updates and flush
at the end. Increasing this interval may increase the chance of unsaved updates on controller crash
or kill. Decreasing it will increase the frequency of database writes. The default should be
sufficient.

The `address` setting is unique as it must match the `address` in a `bindPoint` for
the `edge-client` API. This is to ensure that responses and data persisted outside the system can
reach the controller. An example of this is enrollment JWTs that contain the URL that is used to
complete enrollment via the edge client API.

#### `enrollment`

The `enrollment` section under `edge` defines values that pertain specifically to identity and
router enrollment. This includes the certificate and private key used to sign certificates as well
as enrolment JWT lifetimes.

The enrolment section has these subsection:

- `signingCert` - (required)  defines the certificate and key used to sign identity and router
  certificates
- `edgeIdentity` - (optional) controls identity enrollment options
- `edgeRouter` - (optional) controls router enrollment options

#### `signingCert`

An object defining the `cert` and `key` used to issue certificates to identities and routers.

- `cert` - (required) the x509 PEM formatted certificate of the CA that the controller will use to
  issue edge identity certificates
- `key` - (required) the x509 PEM formatted private key for the certificate defined in `cert`

OpenZiti clients rely on the controller to provide a bundle of trusted certificates during
enrollment. The bundle is specified by the `identity.ca` field and points to a file on the server
containing the bundle of trusted certificates. The signing certificate must be included in this
file.

#### `edgeIdentity`

The `edgeIdentity` section controls the lifetime of identity enrollment JWTs. It has only one value:

- `duration` - (optional) the lifetime of identity enrollment JWTs

#### `edgeRouter`

The `edgeRouter` section controls the lifetime of router enrollment JWTs. It has only one value:

- `duration` - (optional) the lifetime of router enrollment JWTs

### `events`

The `events` section allows for the definition of multiple event loggers with their own handler and
event subscriptions. Handlers define the type, format, and destination for events. Subscriptions
handle which events are routed to the handler. This allows different events to be output in
different manners or to different locations.

The `events` section is an array of named objects. The name (`jsonLogger` in the example below) is
used for configuration error output only. Each logger has a `subscriptions` and `handler` section.
The `subscriptions` section is an array of objects with fields associated with the event type.
Specifying an event type will cause it to be output via the defined handler. If an event type is
omitted, it will not be output. The list of valid event types and their options is as follows:

- `edge.apiSessions` - (optional) edge API Session events
    - `include` - (optional) a string or array of strings that specify which API session events to
      include ("created"
      and/or "
      deleted")
- `edge.entityCounts` - (optional) edge entity counts (API Sessions, session entities, routers, etc.)
    - `interval` - (optional) the time interval to generate entity count events on (e.g. "5s", "
      5000ms", "1h")
- `edge.sessions`  - (optional) Session events
    - `include` - (optional) a string or array of strings that specify which Session events to
      include ("created"
      and/or "deleted")
- `fabric.circuits`  - (optional) Fabric circuit events
    - `include` - (optional) a string or array of strings that specify which circuit events to
      include ("created", "
      pathUpdated", "
      deleted", "failed")
- `fabric.links` - - (optional) Fabric link events
- `fabric.routers` - (optional) Fabric router events
- `fabric.usage` - (optional) Fabric usage events
    - `version` - (optional) a string representing the value of the usage event to use ("2' or "3")
- `metrics` - (optional) - System-wide metrics
    - `sourceFilter` - (optional) a regular expression to match the source name value on
    - `metricFilter` - (optional) a regular expression to match the metric name value on
- `services` - (optional) Service events

The properties in the `handler` section depend on handler `type` (one of `file`, `stdout`,
or `amqp`):

- common properties for all handler types
    - `format` - (required) the format of events for the `type` (`json` or `plain`)
- type `file`
    - `path` - (conditional) used the "file" `type`, the path of the output file
- type `amqp`: note that queue and consumer options must match
    - `url` (required) the URL of the AMQP broker to connect to
    - `queue` (required) the name of the queue to publish events to
    - `durable` (optional) whether the queue should be durable between broker runs (default: true)
    - `autoDelete` (optional) whether the queue should be deleted when there are no consumers (
      default: false)
    - `exclusive` (optional) whether the queue should be exclusive to a single consumer (default:
      false)
    - `noWait` (optional) whether the controller should wait for the queue to confirm receipt of
      messages (default: false)

Example JSON File Logger:

```text
events:
  jsonLogger:
    subscriptions:
      - type: fabric.circuits
      - type: fabric.links
      - type: fabric.routers
      - type: fabric.terminators
      - type: metrics
        sourceFilter: .*
        metricFilter: .*
      - type: edge.sessions
      - type: edge.apiSessions
      - type: fabric.usage
      - type: services
      - type: edge.entityCounts
        interval: 5s
    handler:
      type: file
      format: json
      path: /tmp/ziti-events.log
```

Example amqp Logger:

```text
events:
  amqpLogger:
    subscriptions:
      - type: fabric.usage
        interval: 5s
    handler:
      type: amqp
      format: json
      url: amqp://guest:guest@localhost:5672
      queue: ziti-events
      durable: true
      autoDelete: false
      exclusive: false
      noWait: false
```

Example standard output logger for change events on all entity types.

```text
events:
  stdoutLogger:
    subscriptions:
      - type: entityChange
        include:
          - apiSessionCertificates
          - apiSessions
          - authenticators
          - authPolicies
          - cas
          - configs
          - configTypes
          - controllers
          - edgeRouterPolicies
          - enrollments
          - eventualEvents
          - externalJwtSigners
          - identities
          - identityTypes
          - mfas
          - postureChecks
          - postureCheckTypes
          - revocations
          - routers
          - serviceEdgeRouterPolicies
          - servicePolicies
          - services
          - sessions
          - terminators
    handler:
      type: stdout
      format: json
```

### `healthChecks`

The `healthChecks` section configures how often health checking is performed. As of now, health
checks are limited to ensuring the internal database has not deadlocked by attempting to acquire a
locking transaction on some interval. Health check status is reported externally on
the [`health-checks` API](#web).

- `boltCheck` - (optional) bbolt specific configuration
    - `interval` - (optional, 30s) how often to try entering a bolt read transaction
    - `timeout` - (optional, 15s) how long to wait for a transaction before timing out
    - `initialDelay` - (optional, 15s) how long to wait on startup before performing the first check

```text
healthChecks:
  boltCheck:
    interval: 30s
    timeout: 15s
    initialDelay: 15s
```

### `identity`

The identity section includes the default server certificate and private key used for services
hosted by the controller, alternate server certificates and keys to support SNI on hosted services,
client certificate and private key when making connections, and the `ca` bundle that the controller
will use when making connections and when bootstrapping identities and routers. See the conventions
that apply to all [identity](conventions.md#identity) sections for field level detail.

### `network`

The `network` section sets network wide options.

- `createCircuitRetries` - (optional, 2) How many times the controller will attempt to create a
  given circuit before giving up. Since subsequent tries will generally try a different path if one
  exists, retries can succeed where previous attempts failed
- `cycleSeconds` - (optional, 60) How often to run smart routing calculations, clean up failed links
  and (if legacy link management is enabled) to look for new links to establish. Note that the
  controller will also look for new links whenever routers connect or disconnect
- `enableLegacyLinkMgmt` - (optional, true) Determines whether the controller will attempt to manage
  links for older routers which don't manage their own links
- `initialLinkLatency` - (optional, 65s) The latency to use for new links, before the initial link
  latency is reported. It's recommended to use a higher value so that new traffic doesn't
  immediately use the new link, before the quality is know. If the link is the only option, a high
  latency won't prevent its use
- `intervalAgeThreshold` - (optional, 80s) how old a batch of metrics must be before it's eligible
  to be emitted
- `metricsReportInterval` - (optional, 1m) the frequency at which controller metrics events are
  emitted
- `minRouterCost` - (optional, 10) the minimum router cost
- `routerConnectionChurnLimit` -  (optional, 1m) how often a new connection from a router can take
  over for an existing connection
- `routerMessaging` - (optional)
    - `maxWorkers`- (optional, 100) Max workers sending router state messages from the controller to
      routers. If the queue is full, the message will be retried later
    - `queueSize` - (optional, 100) Max queue size for router state messages being sent from the
      controller to the router. If the queue is full, the message will be retried later
- `routeTimeoutSeconds` - (optional, 10s) - how to long to wait before considering a circuit
  creation as timed out
- `smart` - (optional)
    - `minCostDelta` - (optional, 15) minimum change in cost between old circuit path and new
      circuit path before allowing the circuit to be rerouted. Helpful to prevent circuit flapping
      when there are paths with negligable differences in cost
    - `rerouteCap` - (optional, 4) maximum number of circuits to reroute during any given cycle
      (see `cycleSeconds` above)
    - `rerouteFraction` - (optional, 0.02) Maximum fraction of circuits to reroute during any given
      cycle (see `cycleSeconds` above)

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
    - `intervalMs` (optional, 15s) the frequency to output memprof data

```text
profile:
  cpu:
    path: /home/user1/tmp/ctrl.cpu.pprof
  memory:
    path: ctrl.memprof
    intervalMs: 150000
```

### `raft`

The raft section enables running multiple controllers in a cluster.

- `bootstrapMembers` - (optional) Only used when bootstrapping the cluster. List of initial clusters
  members. Should only be set on one of the controllers in the cluster.
- `commandHandler` - (optional)
    - `maxQueueSize` - (optional, 1000) max size of the queue for processing incoming raft log
      entries
- `commitTimeout` - (optional, 50ms) how long the leader should wait without receiving an Apply
  before sending an AppendEntry message to followers to ensure that log entries are committed in a
  reasonable time frame.
- `dataDir` - (required) directory in which to store the bolt DB, the raft journal and snapshots
- `electionTimeout` - (optional, 1s) how long candidates will wait without communications from the
  leader before starting a leader election
- `heartbeatTimeout` - (optional, 1s) How long for followers will wait without communications from
- the leader before starting a leader election.
- `leaderLeaseTimeout` - (optional, 500ms) How long a leader will keep leadership before stepping
  down, when it's unable to reach a quorum of nodes in the cluster
- `logLevel` - (optional, DEBUG) The minimum level of raft log messages to emit
- `logFile` - (optional) If not specified, raft log messages will be emitted along with all other
  ziti log messages. If specified, raft log messages will be emitted to the given log file.
- `minClusterSize` - (optional, 1) Only used when bootstrapping the cluster. The minimum number of
  nodes before attempting to form a raft cluster
- `maxAppendEntries` - (optional, 64) - Maximum number of log append entries to send at any given
  time
- `snapshotInterval` - (optional, 2m) - How often to check to see if a new snapshot needs to be
  made. Checks will happen between `snapshotInterval` and 2 x `snapshotInterval`. This is a cluster
  wide value and should be consistent across nodes in the cluster. Otherwise the value from the most
  recently started controller will win.
- `snapshotThreshold` - (optional, 8192) - Minimum number of new long entries before a new snapshot
  will be created. This is a cluster wide value and should be consistent across nodes in the
  cluster. Otherwise the value from the most recently started controller will win.
- `trailingLogs` - (optional, 10240) - How many logs to leave in place after a snapshot. These can
  be used to bring other nodes up to date that are only slightly behind, without having to send the
  full snapshot. This is a cluster wide value and should be consistent across nodes in the cluster.
  Otherwise the value from the most recently started controller will win.

```text
raft:
  bootstrapMembers:
    - tls:127.0.0.1:6262
    - tls:127.0.0.1:6363
    - tls:127.0.0.1:6464
  commandHandler:
    maxQueueSize: 1000
  commitTimeout: 50ms
  dataDir: ./data
  electionTimeout: 1s
  heartbeatTimeout: 1s
  leaderLeaseTimeout: 500ms
  logLevel: INFO
  logFile: ./raft.log
  minClusterSize: 3
  maxAppendEntries: 64
  snapshotInterval: 2m
  snapshotThreshold: 8192
  trailingLogs: 10240
```

### `trace`

The `trace` section instructs the controller to output incoming and outgoing messaging it receives.
This setting is useful for debugging purposes only and should not be enabled in production
environments without careful consideration.

- `path` - (required) the file to output decoded messages to

```text
trace:
  path: /var/opt/open.ziti.ctrl.trace
```

### `web`

The `web` section follows the [conventions of XWeb](conventions.md#xweb). The controller has the
following APIs defined:

- `health-checks` - provides a health check API that allows remote parties to verify the health of
  the controller
- `fabric` - the fabric management API which allows remote administration of a network
- `edge-management` - the edge management API which allows remote administration of a network's edge
  components (
  identities, policies, authentication, etc.)
- `edge-client` - the edge client API which allows clients to authenticate and request connections
  to services

Each API may have their own options, but currently do not.

### `v`

The `v` section is used to detect if the version file is supported by the OpenZiti binary read it.
The current and only supported value is "3".

```text
v: 3
```
