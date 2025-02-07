# OpenZiti vs. Tailscale

Virtual Private Networks (VPNs) and Zero Trust Overlay Networks are both technologies aimed at securing network access,
but they differ fundamentally in their approach, architecture, and security philosophies. Tailscale doesn't proclaim
to be a a zero trust overlay network, instead it bills itself as a [WireGuard®-based](https://www.wireguard.com/) VPN
and it does a great job of making it easy to maintain that VPN. There are key differences between Tailscale and
OpenZiti.

## Differences in Approach and Philosophy

### VPNs

VPNs operate on the principle of perimeter-based security. They create a secure, encrypted tunnel between a user's
device and the internal network, typically based on the assumption that users inside the network are trustworthy.
VPNs also often grant broad access once authenticated and Tailscale is no different. By default, joining a tailnet
will get you access to all other devices on that tailnet. That means **Tailscale starts off open, trusting all devices
on
the tailnet**.

Tailscale also strives to be a mesh VPN, meaning every node is capable of contacting the other nodes in
the mesh directly. This is not always possible in certain restricted networks, as such they also provide
[intermediary nodes referred to as DERP servers](https://tailscale.com/kb/1232/derp-servers?q=derp) to assist users
in these situations.

Tailscale is fundamentally a VPN. It's not intended to be easily embedded into applications, and it's not
intended to be programmable and though parts of Tailscale are open source, it's not fully open source and not
self-hostable.

### Zero Trust Overlay Network

The Zero Trust model, on the other hand, operates on the principle of "never trust, always verify" and also operates
on the fundamental principle of least privilege. This approach assumes that threats could be both external and internal,
and therefore, no identity or device should be trusted by default. Access is specifically granted based on strict
identity verification and continuous assessment of user behavior and device health, regardless of network location.
OpenZiti takes the opposite approach of tailscale. OpenZiti is **closed by default**. Joining an OpenZiti overlay network 
gets you access to nothing by default. All identities must be authorized to connect to a service before it's allowed to.

OpenZiti is a zero trust overlay mesh network. It is closed by default with an elegant paradigm and interface for
microsegementing a network down to the individual application services, not just the individual machine. With OpenZiti,
you are also able to leave IP addresses in the past and address services by identity or by leveraging OpenZiti's
built-in, private DNS capabilities, creating bespoke domain names for every service. If necessary or desirable,
OpenZiti fully supports IP addressing as well. It's more than a VPN.

OpenZiti was also designed from the ground up to be embedded into applications via SDKs. It integrates and extends not
only at the IP level but also into numerous programming languages magically transporting traffic from one application
to another, all over a self-healing mesh network.

## The Zero Trust Difference

## Comparison Table

| Feature                                             | Tailscale                     | OpenZiti                                        |
|-----------------------------------------------------|-------------------------------|-------------------------------------------------|
| Mesh Network                                        | Yes                           | Yes                                             |
| Programmable Overlay                                | No                            | Yes                                             |
| Initial Network Segmentation                        | Open                          | Closed                                          |
| Embeddable into **your** applications               | No                            | Yes                                             |                                                     |                               |                                                 |
| Support for granular access controls (down to port) | Yes (complex)                 | Yes (core component, designed in)               |
| Private DNS                                         | Yes (limited to tailnet)      | Yes - unlimited, customizable domain names      |
| Servers without listening ports                     | No                            | Yes                                             |
| TCP Support                                         | Yes                           | Yes                                             |
| UDP Support                                         | Yes                           | Yes                                             |
| ICMP Support                                        | Yes                           | No                                              |
| Fully Open Source                                   | No                            | Yes                                             |
| Managed Service Option                              | Yes                           | Yes (through NetFoundry)                        |
| Free Tier                                           | Yes                           | Yes (through zrok or self-hosting)              |
| Self-hostable                                       | No                            | Yes                                             |
| CGNAT Friendly                                      | Yes                           | Yes                                             |
| End-to-end encryption                               | Yes                           | Yes                                             |
| Encrypt data at rest                                | No                            | No                                              |
| Transport Connection Protocol                       | UDP                           | TCP                                             |
| Easily Identified Traffic                           | Yes                           | No                                              |
| Direct Communication                                | Yes                           | No                                              |
| Predictable Traffic Egress                          | Per device - one offload node | Every service can have a different offload node |
| Strong Identity                                     | No*                           | Yes (x509 certificates/JWT)                     |
| Dynamic, name-based routing                         | No (relies on DNS)            | Yes                                             |
| Service-based segmentation                          | No*                           | Yes                                             |
| Replaces VPNs                                       | Yes                           | Yes                                             |
| Customizable IP                                     | Yes, one in 100.64.0.0/10     | Any IP, unlimited                               |
| Traffic encapsulation/obfuscation                   | Yes                           | Yes                                             |
| Integrated continual authorization                  | No                            | Yes                                             |
| Integrates with third-party continual auth          | Yes                           | No                                              |
| MFA Support                                         | Yes* (via IdP)                | Yes, native TOTP and IdP integration            |
| PKCS 11/HSM support                                 | No                            | Yes                                             |
| IdP-based enrollment                                | Yes (only method)             | No                                              |
| Integrates with external managed PKI for auth       | No                            | Yes                                             |
| Join network automatically                          | Yes                           | Yes                                             |
| Support for multiple networks                       |                               | Yes - core component                            |
| Stable IP assignemnt                                | Yes                           | Yes                                             |

## Differences Explained




