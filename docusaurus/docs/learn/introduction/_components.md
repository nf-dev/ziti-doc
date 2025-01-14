## Deployed Components

### Controller

The controller is the central function of the
network. The controller provides the
configuration plane. It is responsible for configuring services
as well as being the central point for managing the identities
used by users, devices and the nodes making up the network.
Lastly but critically, the controller is responsible for
authentication and authorization for every connection in the
network.

The controller must be configured with [public key infrastructure](https://en.wikipedia.org/wiki/Public_key_infrastructure)
(PKI). The configured PKI is used to create secure, mutually-
authenticated TLS (mTLS) network connections between any two
pieces of the network. The controller does not provide its
own PKI but for the controller to sign a certificate signing request (CSR)
the controller will need to be configured with a key and
certificate used for signing. The `ziti pki` command can generate a PKI.

The controller also supports using a third-party PKI should the
operator of the network have an existing PKI they wish to
reuse. Utilizing a third-party CA pushes the burden of obtaining
and distributing properly signed certificates to the operator of
the network but for sophisticated customers this might make
overall management of the network easier.

The controller uses a local database based on [bbolt](https://github.com/etcd-io/bbolt) to
store the information needed to manage the network.

The controller's TLS server employs SNI to select the correct certificate for presentation when there are multiple certificates. Ziti clients use ALPN to negotiate a connection to the control plane (`ziti-ctrl`) or the REST APIs (`h2`, `http/1.1`).

[Controller Deployment Guide](/guides/deployments/10-linux/10-controller/10-deploy.mdx)

### Router

Routers are the fundamental building blocks of the
network. These routers are responsible for securely and reliably
delivering traffic from one network node to the destination.

Ziti Routers are linked together to form a mesh network. This mesh is
constantly being monitored for latency and the fastest paths are
used when routing traffic to the destination. The monitoring also
allows for active failover to ensure a reliable network connection
even in the case of a node failure.

The router is the entry point to the network for client connections.
The router in combination with the controller is responsible
for authenticating and authorizing clients.

[Router Deployment Guide](/guides/deployments/10-linux/20-router/10-deploy.mdx)

### Edge Clients

Connecting to the network requires an edge client. Edge
Clients are designed to work with both brownfield and greenfield
applications.

If the solution being developed includes developing new
software, Ziti SDKs target various languages
and runtimes to provide fast, reliable and secure connectivity.
These SDKs provide the capabilities needed to securely connect
to the network and are designed to be easily incorporated
into the target application.

When adding secure connectivity to an already existing solution,
OpenZiti offers specialized Edge Clients called tunnelers
which provide seamless, secure connectivity and do not require
changes to the target application.

Read more about [clients](/learn/core-concepts/clients/choose.mdx)

### BrowZer

BrowZer is a set of optional components which facilitate the bootstrapping of trust
in a web browser **without** the need for client-side installations. This means there is no
need to install an extension in web browsers, nor is there a need to install one of the
mobile or desktop clients (tunnelers)!

It enables automatic embedding of zero trust networking into a web application, thus
transforming a web browser (e.g. Chrome, Brave, or Edge) into a full-fledged client.
The only software users need is the ubiquitous browser they already use every day.

Also noteworthy, is that BrowZer places no burden upon web application developers to first
instrument or otherwise make any modifications to the web application itself in order to
enable secure remote access.

BrowZer enables operating a web app licensed from a 3rd party and protecting it without the
need for making alterations to it. Similarly, if the web app can be modified, but it is not
desirable to do so, BrowZer allows OpenZiti to protect those apps as well. The BrowZer Bootstrapper
does the necessary instrumentation of the web application automatically, on the fly, as it
is being loaded from the web server to the user's browser.

To enable BrowZer in a given network, it must be configured. For information
on how to add BrowZer to a network, follow [the BrowZer quickstart guide](/learn/quickstarts/browzer/index)

## Logical Components

Once the network is established and deployed the next step
is to configure the software-powered network. The three main
concepts necessary to configure a network are: Identities,
Services, and Policies.

### Services

A service encapsulates the definition of any resource that could
be accessed by a client on a traditional network. An service is
defined by a strong, extensible identity, rather than by an
expression of an underlay concept. This means that services
defined on a network have an almost limitless "namespace"
available for identifying services. An service is defined by a
name and/or a certificate, rather than by a DNS name or an IP
address (underlay concepts). Services also declare a node where
traffic that exits the network needs to be sent to before
exiting. The node where traffic enters the network may be the same
node where traffic exits. Alternatively, traffic may need to traverse the
network Routers to reach the exit node. Simply specifying the
node is all the end-user need do, the network handles the
rest.

Read more about [services](/learn/core-concepts/services/overview.mdx)

### Identities

Identities represent individual endpoints in the network
which can establish connectivity. All connections made within the
network are mutually authenticated using X509 Certificates.
Every Identity is mapped to a given certificate’s signature.
edge clients present this certificate when initiating connections
to the network. The presented certificate is used by the
network to authorize the client and enumerate the services the
Identity is authorized to use.

Read more about [identities](/learn/core-concepts/identities/overview.mdx) and [authentication](/learn/core-concepts/security/authentication/auth.md).

### Policies

Policies control how Identities, Services and Edge Routers are allowed
to interact. In order to use a service the identity must be granted
access to the service. Also, since all access to a service goes through
one more edge routers, both the service and the identity must be
granted to access to the same edge router or edge routers.

#### Role Attributes

Entities such as identities, services and edge routers can be added to
policies explicitly, either by id or name. Entities can  also be tagged
with role attributes. Role attributes are simple strings like `sales`,
`Boston`, `us-employees` or `support`. Their meaning is decided by the
administrator. Policies can include entities by specifying a set of role
attributes to match.

#### Service Policies

Service Policies encapsulate the mapping between identities and
services in a software-powered network. In the simplest terms,
Service Policies are a group of services and a group of identities.
The act of adding a service to a Service Policy will grant the
identities in that Service Policy access to the given service.
Similarly, adding an identity to a Service Policy will grant that
identity access to the services mapped in that Service Policy.

Service policies controls both which identities may dial a service (use the service)
and which identities may bind a service (provide or host the service).
Each Service Policy may either grant dial or bind access, but not both.

#### Edge Router Policies

Edge Router Policies manage the mapping between identities and
edge routers. edge router policies are a group of edge routers
and a group of identities. Adding a router to an Edge
Router Policy will grant the identities in that Edge Router
Policy access to the given edge router. Similarly, adding an identity
to an edge router policy will grant that identity access to the
edge routers mapped in that edge router policy.

#### Service Edge Router Policies

Service edge router policies manage the mapping between services and
edge routers. Service edge router policies are a group of edge routers
and a group of services. Adding an edge router to a Service Edge
Router Policy will grant the services in that Service Edge Router
Policy access to the given edge router. Similarly, adding a service
to a Service edge router policy will grant that service access to the
edge routers mapped in that Service edge router policy.

[Read more about authorization](/learn/core-concepts/security/authorization/policies/overview.mdx)
