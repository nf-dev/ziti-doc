# External Authentication

OpenZiti external jwt signers are intended to be used with various external providers. Arguably, the most common type of
provider are external authorization servers, often referred to as IdPs. This guide will focus on this kind of external
provider and will focus on one authorization flow in particular:  Authorization Code Flow with PKCE.

OpenZiti can be configured to delegate authentication to external providers using
[external jwt signers](../../learn/core-concepts/security/authentication/50-external-jwt-signers.md). Configuring
OpenZiti to use external providers can be simple, however if you're new to the concepts (specifically the
[Proof Key for Code Exchange flow](https://www.rfc-editor.org/rfc/rfc7636)) it may be tricky to setup. There are
numerous excellent resources on the internet to learn more about OIDC, OAuth, and the PKCE flow if you need or want to
learn more.

The guides provided here are meant to get you up and running quickly and guide you through configuring the OpenZiti
Controller to allow clients such as OpenZiti tunnelers to delegate authentication to a centralized provider.

## Authentication Policies

The OpenZiti Controller will come with a default authorization policy that allows for all primary authentication
methods: username/password, certificate-based, exteral-jwt-signer. If you are familiar with OpenZiti concepts,
additional auth-policies can be created and the default policy modified. If you are new to OpenZiti, it's recommended
you leave the default [authentication policy](../..
/learn/core-concepts/security/authentication/30-authentication-policies.md) intact.

> [!TIP]
> It's often useful to use certificate-based authentication (the "normal", one-time-token enrollment) along with
> an external provider providing a strong two-factor authentication scheme. This would ensure the device in use is
> trusted and would ensure a trusted human is using the device: human + device.

## Configuring the Controller With an External JWT Signer for OIDC

Correctly configuring an external JWT signer for use with OIDC requires a few key fields to be supplied. Most of
these fields are discoverable using the openid discovery endpoint. Generally, this will be a URl accessible by
adding `./.well-known/openid-discovery` to your identity provider issuer URL. For example, if you were using
Keycloak as your authorization provider of choice, you might have a Keycloak realm at
https://my.keycloak.openzitiio/realms/example. If that were the case, the openid discovery endpoint would be located at
https://my.keycloak.openzitiio/realms/example/.well-known/openid-configuration.

Using the `.well-known/openid-configuration` will get much of the information required to successfully configure the
controller with an ext-jwt-signer for OIDC authentication. From this url, gather the following pieces of information:
* issuer
*

```yaml-table
- CVE: cve-1-here
  Advisory: 30
  Notice: New York
- CVE: Bob
  Advisory: 25  
  Notice: San Francisco
```

```yaml
- CVE: cve-1-here
  Advisory: 30
  Notice: New York
- CVE: Bob
  Advisory: 25  
  Notice: San Francisco
```

```code
description: desc
---
command: ls -l
---
results:
here are the results
they could be super long

```


```code
description: This command lists all files in the current directory.
command: ls -la
results: total 12
drwxr-xr-x  5 user staff 160 Jan 28 12:34 .
drwxr-xr-x 20 user staff 640 Jan 28 12:34 ..
-rw-r--r--  1 user staff   0 Jan 28 12:34 file.txt
```


a