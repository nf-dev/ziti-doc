import Details from '@theme/MDXComponents/Details';

# Third-Party CA

OpenZiti supports adding identities where the key and certificate are provided by a third-party CA.

## Prerequisites
* ZDEW 2.5.2+
* a third-party-ca (`ca`) has been configured and verified in the OpenZiti Network
* an identity exists with an `external-id` properly mapped to a claim, 
  see [External Id & x509 Claims](/docs/learn/core-concepts/security/authentication/10-third-party-cas.md#external-id--x509-claims)
* The CA's JWT has been transferred to the computer running the ZDEW

<Details>
<summary><b>Obtaining the Third-Party CA JWT</b></summary>

Adding an identity to a Windows machine that uses a third party CA requires the user or an operator to obtain a JWT
ahead of time. This can be done in two different ways.
<hr/>

### Obtain the Third-Party CA JWT - ZAC

Obtain a third party CA's JWT using the Ziti Admin Console. From the Authentication->Certificate Authorities page, 
click on the icon in the JWT column for the appropriate CA and send the JWT to the user trying to add an
identity.

![ext-jwt-signer-basic](/img/zac-3rd-party-ca-jwt.png)

<hr/>

### Obtain the Third-Party CA JWT - Shell

Alternatively, a request can be made to the OpenZiti controller's API to return the JWT. Make an HTTP GET to the controller's
`/edge/management/v1/cas/${ca_id}/jwt` endpoint and save the JWT into a file. Using bash with `curl` this  might look
something like:
```text
curl -X GET -sk \
    -H "Content-Type: application/json" \
    -H "zt-session: ${zt_session}" \
    -o ${pki_root}/auto.jwt \
    "https://my.openziti.controller.local:443/cas/${ca_id}/jwt"
```
</Details>

## Adding the Identity

With the JWT for the CA on the machine running the ZDEW, click on the "ADD IDENTITY" button in the top right of the
screen. After the context menu pops up choose "With JWT". In the file dialog, select the third-party CA JWT file.

![windows-with-jwt](/img/ext-jwt-signer/windows-with-jwt.png)

After selecting the file, a dialog will appear asking for the key and certificate to use when adding the identity. 
Select the appropriate key and certificate and click "Join Network"

![third party ca](/img/ext-jwt-signer/windows-3rd-party-ca.png)
