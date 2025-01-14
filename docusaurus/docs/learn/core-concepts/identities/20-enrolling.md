---
title: Enrolling
---
## Enrolling an Identity

All connections made to the Ziti network leverage [mutual TLS](https://en.wikipedia.org/wiki/Mutual_authentication)
which means every client needs a valid X509 certificate which it will present to the Ziti network during the connection
process. The process of obtaining a key/certificate pair and presenting it securely to the controller is called
"Enrollment".

### Overview

All identities need to be enrolled with the controller so the controller can authenticate the incoming connection.
This process is slightly different for each type of identity and is complex. The easiest way to enroll an identity is to 
use either the Ziti Desktop Edge/Ziti Mobile Edge for your operating system. Alternatively, you may perform the enrollment separate 
with the `ziti` CLI which can be downloaded from the [GitHub releases page](https://github.com/openziti/ziti/releases/latest) 

### One Time Token Enrollment - Internal PKI

Perhaps the easiest path to an enrolled identity is by using the one-time token enrollment flow. This flow leverages the
PKI configured in the controller.  Using the one-time token flow - the `ziti` CLI will generate a private key
and a certificate signing request for the controller's built-in certificate authority to fulfill.

Follow these steps to enroll an identity with a one-time token:

* [create the Identity](./creating)
* download or copy the JWT - this file contains the single use token
* run the `ziti` CLI:

**Example Usage:**

```text
ziti edge enroll \
    --jwt ${jwt_file} \
    --out ${identity_config_file}
```

:::caution
The output from the `ziti` CLI is a permanent identity configuration file which
must be stored securely. This file contains within it the private key that backs
the certificate issued by the controller.  This file should not be
transferred or shared and should not be moved from the machine unless you are
confident you understand the risks involved in doing so.
:::

**Example Usage for `ziti-edge-tunnel` CLI**

```text
# enroll from a token file
./ziti-edge-tunnel enroll --jwt ./myTunneler.jwt --identity ./myTunneler.json
```

```text
# enroll from stdin
./ziti-edge-tunnel enroll --jwt - --identity ./myTunneler.json < ./myTunneler.jwt
```

### 3rd Party CA - One Time Token

This flow allows you to pre-create identities for a 3rd party CA with distinct role attributes. This flow is similar to the One Time Token flow from above except that it expects that a private key and certificate have
already been created on or distributed to the machine that is about to enroll and that the certificate presented is
issued by a validated, [third party CA](/learn/core-concepts/pki#third-party-ca-optional).

Follow these steps to enroll a 3rd Party CA - one-time token identity:

* [create the Identity](./creating)
* download or copy the JWT - this file contains the one-time token
* run the `ziti` CLI. Notice you can provide the filename of the identity config JSON file to output:

**Example Usage:**

```text
ziti edge enroll \
    --cert ${user_certificate} \
    --key ${user_private_key} \
    --jwt ${one_time_jwt_file} \
    --out ${identity_config_file}
```

### 3rd Party CA - Auto

When using a third party CA identity creation process in the controller is
automatic. Enrolling the identity will create it with the default role attributes that were specified when the 3rd party CA was created.

Like "3rd Party CA - One Time Token" - this flow expects that a private key and certificate have
already been created on or distributed to the machine that is about to enroll.
The certificate presented to the controller must be issued by a [third
party CA](/learn/core-concepts/pki#third-party-ca-optional) that was already
imported and verified in the controller with the
`isAutoCaEnrollmentEnabled` property set to true.

Using the `ziti` CLI will also require the re-use of a permanent JWT that is unique to the external CA. The JWT
can be downloaded from the controller from:  `${controller_uri}/cas/${id}/jwt` where `${controller_uri}` represents
the fully qualified address of the controller api and `${id}` represents the identifier for the given third party CA.

**Example Usage:**

```text
ziti edge enroll \
    --cert ${user_certificate} \
    --key ${user_private_key} \
    --jwt ${reusable_ca_jwt_file} \
    --out ${identity_config_file}
```

If supplied, the argument to option `--idname` will be used as the name for the identity created. The default name of auto-created identities is generated from a template that uses values from the user certificate i.e. `[caName]-[commonName]`.
