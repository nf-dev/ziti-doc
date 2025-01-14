import MDXComponents from '@theme-original/MDXComponents';
import Details from '@theme/MDXComponents/Details';

### A Practical Example

Locate the provider's OpenID discovery endpoint. For example, for Keycloak, the OpenID discovery endpoint is generally
located at:
```text
https://${keycloak.domain.name}:${keycloak.port}/realms/${realm-name}/.well-known/openid-configuration
```

The OpenID discovery endpoint returns three important fields necessary for the `ext-jwt-signer`. The discovery endpoint
contains the `issuer`, `external-auth-url` (within the json, this will be the `authorization_endpoint` value), and the 
`jwks-endpoint` (`jwks_uri` from the discovery endpoint). Copy and paste these values **exactly** as they are 
shown into either the `ziti` CLI command, or into the Ziti Admin Console.

After capturing the necessary fields from the discovery endpoint, determine:
* the audience the JWT will present. This can be whatever the IdP is configured for, but it would make sense to have the
  audience set to something like `openziti`
* the client id assigned by the IdP
* the claims property that should be mapped from the JWT to an OpenZiti identity
* any scopes that the OpenZiti client should request


<Details>
<summary>Example Configuring OpenZiti for External Auth</summary>

### Using the `ziti` CLI:

With the values collected, create an `ext-jwt-signer` with the CLI. Replace the placeholder variables with the appropriate
content and execute:
```text
ziti edge create ext-jwt-signer example-ext-jwt-signer $issuer \
    --external-auth-url $ext_jwt_auth_url \
    --jwks-endpoint $jwks_uri \
    --audience $ext_jwt_audience \
    --client-id $ext_jwt_client_id \
    --claims-property $ext_jwt_claims_prop \
    --scopes $ext_jwt_scopes
```

The `ziti` CLI will indicate success/failure of the opeation.

</Details>

---

### Using the Ziti Admin Console

#### Add External JWT Signer

Navigate to the Authentication page, choose JWT Signers and click the plus in the upper right<br/>

![Add External JWT Signer](/img/ext-jwt-signer/zac-ext-jwt-signer-basic.png)

---

#### Initial Fields

Fill out the Name, Issuer, Audience, Claims Property and toggle "Use External Id" to on. Then, add the JWKS endpoint
on the right side of the screen.<br/>

![Initial Fields](/img/ext-jwt-signer/zac-create-initial-fields.png)

---

#### More Option Fields

Toggle the "Show More Options" and fill out the Client ID, External Auth URL and add scopes. When done click "Save" in
the top right corner.<br/>

![More Option Fields](/img/ext-jwt-signer/zac-create-ext-jwt-signer-3.png)