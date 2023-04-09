---
id: components
title: Components
---

## Deployed Components

### OpenZiti Controller

The OpenZiti Controller is the central function of the
OpenZiti Network. The OpenZiti Controller provides the
configuration plane. It is responsible for configuring OpenZiti services
as well as being the central point for managing the identities
used by users, devices and the nodes making up the OpenZiti Network.
Lastly but critically, the OpenZiti Controller is responsible for
authentication and authorization for every connection in the OpenZiti
Network.

The OpenZiti Controller must be configured with public key infrastructure
(PKI). The configured PKI is used to create secure, mutually-
authenticated TLS (mTLS) network connections between any two
pieces of the OpenZiti Network. The OpenZiti Controller does not provide its
own PKI but for the OpenZiti Controller to sign a certificate signing request (CSR)
the OpenZiti Controller will need to be configured with a key and
certificate used for signing. The OpenZiti CLI can generate a PKI.

The OpenZiti Controller also supports using a third-party PKI should the
operator of the OpenZiti Network have an existing PKI they wish to
reuse. Utilizing a third-party CA pushes the burden of obtaining
and distributing properly signed certificates to the operator of
the OpenZiti Network but for sophisticated customers this might make
overall management of the network easier.
The OpenZiti Controller uses a local database based on [bbolt](https://github.com/etcd-io/bbolt) to
store the information needed to manage the network.

[Controller Deployment Guide](../../reference/deployments/01-controller.md)

### OpenZiti Router

OpenZiti Routers are the fundamental building blocks of the OpenZiti
Network. These routers are responsible for securely and reliably
delivering traffic from one OpenZiti Network node to the destination.

Ziti Routers are linked together to form a mesh network. This mesh is
constantly being monitored for latency and the fastest paths are
used when routing traffic to the destination. The monitoring also
allows for active failover to ensure a reliable network connection
even in the case of a node failure.

The OpenZiti Router is the entry point to the OpenZiti Network for client connections.
The OpenZiti Router in combination with the Ziti Controller is responsible
for authenticating and authorizing OpenZiti Edge Clients.

[Router Deployment Guide](../../reference/deployments/02-router/01-deployment.md)

### OpenZiti BrowZer Gateway

OpenZiti BrowZer Gateway is an optional component in the OpenZiti
Network. It enables automatic embedding of zero trust networking into a web application, thus
transforming a web browser (e.g. Chrome, Brave, or Edge) into a full-fledged OpenZiti client.

The BrowZer Gateway facilitates simple and secure access for remote users that you authorize. 
It does so without requiring your users to install any [OpenZiti Edge Client](/docs/learn/introduction/components#openziti-edge-clients) 
software on their laptop, tablet, or mobile phone. 

The only software users need is the ubiquitous browser they already use every day.

Also noteworthy is that BrowZer places no burden upon web application developers to first 
instrument or otherwise make any modifications to the web application itself in order to 
enable secure remote access.

This is a great enabler when you are operating a web app licensed from a 
3rd party that you want to protect with Ziti, but you can't make alterations to it. 
The same goes for a web app you can alter, but elect not to. The BrowZer Gateway does 
the necessary Zitification instrumentation of your web application 
automatically, on the fly, as it is being loaded from the web server to the user's browser. 




[BrowZer Gateway Deployment Guide](../../reference/deployments/03-browzer-gateway/01-deployment.md)

### OpenZiti Edge Clients

Connecting to the OpenZiti Network requires an OpenZiti Edge Client. Edge
Clients are designed to work with both brownfield and greenfield
applications.

If the solution being developed includes developing new
software OpenZiti offers SDKs targeting various languages
and runtimes to provide fast, reliable and secure connectivity.
These SDKs provide the capabilities needed to securely connect
to the OpenZiti Network and are designed to be easily incorporated
into the target application.

When adding secure connectivity to an already existing solution
OpenZiti offers specialized Edge Clients called tunnelers
which provide seamless, secure connectivity and do not require
changes to the target application.

Read more about [clients](../core-concepts/clients/choose.mdx)

## Logical Components

Once the OpenZiti Network is established and deployed the next step
is to configure the software-powered network. The three main
concepts necessary to configure an OpenZiti Network are: Identities,
Services, and Policies.

### Services

A service encapsulates the definition of any resource that could
be accessed by a client on a traditional network. An OpenZiti Service is
defined by a strong, extensible identity, rather than by an
expression of an underlay concept. This means that services
defined on an OpenZiti Network have an almost limitless "namespace"
available for identifying services. An OpenZiti Service is defined by a
name and/or a certificate, rather than by a DNS name or an IP
address (underlay concepts). Services also declare a node where
traffic that exits the OpenZiti Network needs to be sent to before
exiting. The node where traffic enters the OpenZiti Network may be the same
node where traffic exits. Alternatively, traffic may need to traverse the
OpenZiti Network Routers to reach the exit node. Simply specifying the
node is all the end-user need do, the OpenZiti Network handles the
rest.

Read more about [services](../core-concepts/services/overview.mdx)

### Identities

Identities represent individual endpoints in the OpenZiti Network
which can establish connectivity. All connections made within the
OpenZiti Network are mutually authenticated using X509 Certificates.
Every Identity is mapped to a given certificate’s signature. OpenZiti
Edge Clients present this certificate when initiating connections
to the OpenZiti Network. The presented certificate is used by the OpenZiti
Network to authorize the client and enumerate the services the
Identity is authorized to use.

Read more about [identities](../core-concepts/identities/overview.mdx) and [authentication](../core-concepts/security/authentication/auth.md).

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
edge routers. Edge Router Policies are a group of edge routers
and a group of identities. Adding an edge router to an Edge
Router Policy will grant the identities in that Edge Router
Policy access to the given edge router. Similarly, adding an identity
to an Edge Router Policy will grant that identity access to the
edge routers mapped in that Edge Router Policy.

#### Service Edge Router Policies

Service Edge Router Policies manage the mapping between services and
edge routers. Service Edge Router Policies are a group of edge routers
and a group of services. Adding an edge router to a Service Edge
Router Policy will grant the services in that Service Edge Router
Policy access to the given edge router. Similarly, adding a service
to a Service Edge Router Policy will grant that service access to the
edge routers mapped in that Service Edge Router Policy.

[Read more about authorization](../core-concepts/security/authorization/policies/overview.mdx)
