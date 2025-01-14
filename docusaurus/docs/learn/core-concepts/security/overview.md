---
title: Ziti Security
---

A network's security setup is defined by several entities defined in the [edge management API](/docs/reference/developer/api#edge-management-api). The following
are related to identity authentication and service access:

- [Identities](#identity) - describe a human, device, or service within the edge
- [Authenticators](./authentication/auth.md#authenticators) - describes the credentials of an authentication method associated with an Identity
- [Enrollments](./enrollment.md) - describes a set of criteria necessary to create a new Identity and associated Authenticator
- [Authentication Policy](./authentication/30-authentication-policies.md) - describes the methods available for Identity authentication
- [3rd Party CAs](./authentication/10-third-party-cas.md) - allows external x509 PKIs to be used for authentication
- [External JWT Signers](./authentication/50-external-jwt-signers.md) - allows external JWT signers to be used for authentication
- [API Session](./sessions.md) - a security context represented by a security token (JWT, secret, etc) that represents
  Identity authentication
- [Session](./sessions.md) - a security context represented by a security token (JWT, secret, etc) that represents access
  to a Service
- [Service Policy](./authorization/policies/overview.mdx) - describes which Identities have access to which Services and the Posture Checks that are required to
  pass for access
- [Edge Router Policies](./authorization/policies/overview.mdx)  - describes which Identities have access to which edge routers
- [Posture Checks](./authorization/posture-checks.md) - describes additional environmental state that an Identity must have in order to obtain and maintain
  service access
- [Posture Queries](./authorization/posture-checks.md#posture-data) - describes a request for environmental information from a client
- [Posture Responses](./authorization/posture-checks.md#posture-data) - a response to a Posture Query provided by a client
- [Posture Data](./authorization/posture-checks.md#posture-data) - the current environmental state provided via Posture Responses and known information
- [Authentication Queries](./sessions.md#authentication-queries) - additional, secondary, authentication factors required after initial, primary, authentication

There is an additional policy type for edge routers:

- [Service edge router policies](./authorization/policies/overview.mdx) - determines which services can be accessed over which routers

Additionally, connection security document is provided on the [Connection Security](connection-security.md) page. 

## Authentication & Authorization High Level Flow

The following is a high level overview of how these entities interact. Each interaction is further detailed in their
own separate section.

1. a client enrolls
   1. A client may enroll via a pre-shared secret defined as an Enrollment or other verifiable documents (JWTs, x509
        Certs/CAs)
   2. an Identity is created with associated Authenticators and Authentication Policies
2. authentication: a client Identity attempts to authenticate
    1. the authentication credentials are verified against the Authenticators, 3rd Party CAs, External JWT Signers,
       and/or Authentication Policy associated with the principal
    2. secondary factors defined by the Authentication Policy are reported to the client (MFA TOTP, JWT) as Authentication Queries
    3. the client provides secondary factors
    4. the client receives an API Session security token without unanswered Authentication Queries
3. authorization: a client may list Services which will be either grant `dial` (client connect) or `bind` (host) access
    1. the Service Policies provide a filtered list of all services for the specific client issuing the request
    2. the Service Policies are also used to evaluate the Posture Checks associated with a Service Policy
    3. the Posture Checks are converted to Posture Queries with type, pass/fail state, and criteria information
    4. The Services and Posture Queries are returned to the client 
    5. (Continuous) the client submits any Posture Responses to Posture Queries as necessary
4. authorization: the client requests a Session for a specific Service
    1. (Continuous) the Service Policies are consulted for access additionally re-evaluating Posture Checks against the
       current know Posture Data
    2. the list of Service edge router policies and edge router policies are consulted to provide a valid list edge
       routers the Session security token may be used on
    3. a Session security token and edge router list is provided to the client
5. the client attempts to connect to a target edge router with an API Session security token
6. the target edge router evaluates the credential
7. the client requests a Service connection with their Session security token
    1. the connection request is verified through Service edge router policies
8. the edge router coordinates the service connection

## High Level Concepts

Below are the major areas of the edge security model with a minimal description of what each area covers. The link(s)
in each section will lead to a more detailed explanation of the relevant topics.

### Identity

The edge defines a top level entity called an identity. An identity is a security principal that can bind (host) or 
dial (connect) to services over a network. Read more in the [Identity](/learn/core-concepts/identities/overview.mdx) section.

### Enrollment

Enrollment is a client initiated process where the result is the creation of an Identity that has some manner
of authenticating. Enrollments may be automated through [3rd Party Cas](./authentication/10-third-party-cas.md) and 
[External JWT Signers](./authentication/50-external-jwt-signers.md)  or may be completed through pre-provisioning. Read more in the 
[Enrollment](./enrollment.md) section.

### Authentication

[Authentication](./authentication/auth.md) is the process of a client proving their identity through the submission of one primary credential
and zero or more secondary credentials that are prompted by Authentication Queries. Authentication methods can be
configured through [3rd Party Cas](./authentication/10-third-party-cas.md), [External JWT Signers](./authentication/50-external-jwt-signers.md),
and [Authentication Policies](./authentication/30-authentication-policies.md). Read more in the
 [Authentication](./authentication/auth.md) section.

### Authorization

[Authorization](./authorization/auth.md) in Ziti is configured for identities and edge routers. Edge router authorization only covers which
services can be used over an edge router via service edge router policies. Identity authorization is covered by service
policies and edge router policies.

All policies in Ziti are represented by a robust [attribute based access control system (ABAC)](https://en.wikipedia.org/wiki/Attribute-based_access_control) based on `roleAttributes`
properties on entities within the [edge management API](/docs/reference/developer/api/index#edge-management-api). `roleAttributes` properties are an array of user defined strings.
Policies support attribute selector properties to determine which entities a policy interacts on. Policies themselves
are documented in [Policies](./authorization/policies/overview.mdx) section.

Additionally, Service Policies can require additional environmental states to be satisfied by Posture Checks.
Posture Checks analyze Posture Data. Posture Data is a collection of server side information and data harvested from
Posture Responses sent by client endpoints in response to Posture Queries. More can be found in
the [Posture Check](./authorization/posture-checks.md) 
section.

Read more in the [Authorization](./authorization/auth.md) section.
