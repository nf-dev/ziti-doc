# External Authentication

OpenZiti can be configured to delegate authentication to external providers using 
[external jwt signers](../../learn/core-concepts/security/authentication/50-external-jwt-signers.md). Configuring 
OpenZiti to use external providers can be simple, however if you're new to the concepts (specifically the
[Proof Key for Code Exchange flow](https://www.rfc-editor.org/rfc/rfc7636)) it may be tricky to setup. There are 
numerous excellent resources on the internet to search out if you'd like to learn more about OIDC, OAuth, and the PKCE
flow if you need or want to learn more. These guides are meant to get you up and running quickly and correctly and 
guide you through configuring the OpenZiti controller to allow clients such as OpenZiti tunnelers to delegate 
authentication to a centralized provider.

## Authentication Policies

If you are new to OpenZiti, it's recommended you leave the default 
[authentication policy](../../learn/core-concepts/security/authentication/30-authentication-policies.md) in place. 
This default policy allows all primary authentication methods, including ext-jwt-signers which will be important. If 
you are familiar with OpenZiti concepts, additional auth-policies can be created and the default policy modified.

> [!TIP]
> It's often useful to use certificate-based authentication (the "normal", one-time-token enrollment) along with
> an external provider providing a strong two-factor authentication scheme. This would ensure the device in use is 
> trusted and would ensure a trusted human is using the device: human + device.

## Configuring an External JWT Signer

Correctly configuring an external JWT signer for use with OIDC requires a few key fields to be supplied. Most of 
these fields are discoverable using the openid discovery endpoint. Generally, this will be a URl accessable by 
adding `./.well-known/openid-discovery` to your identity provider issuer URL.

>[!EXAMPLE]
> 



