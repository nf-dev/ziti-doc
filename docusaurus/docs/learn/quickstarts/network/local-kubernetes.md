---
sidebar_position: 60
sidebar_label: Kubernetes
---

# Kubernetes Quickstart

`minikube` quickly sets up a local Kubernetes cluster on macOS, Linux, or Windows. This quickstart is a great way to explore running your own OpenZiti Controller and Router(s). I'll assume you have a terminal with BASH or ZSH terminal for pasting commands.

## Before You Begin

`minikube` can be deployed as a VM, a container, or bare-metal. We'll use the preferred Docker driver for this quickstart.

1. [Install Docker](https://docs.docker.com/engine/install/)
1. [Install `kubectl`](https://kubernetes.io/docs/tasks/tools/)
1. [Install Helm](https://helm.sh/docs/intro/install/)
1. [Install `minikube`](https://minikube.sigs.k8s.io/docs/start/)
1. [Install `ziti` CLI](https://github.com/openziti/ziti/releases/latest)
1. [Install an OpenZiti Tunneler app](https://docs.openziti.io/docs/downloads)
1. Optional: Install `curl` and `jq` for testing an OpenZiti Service in the terminal. 

Make sure these command-line tools are available in your executable search `PATH`.

## Create the `miniziti` Cluster

First, let's create a brand new `minikube` profile named "miniziti".

```bash
minikube --profile miniziti start
```

`minikube` will try to configure the default context of your KUBECONFIG. Let's test the connection to the new cluster. 

:::info
You can always restore the KUBECONFIG context from this Minikube quickstart like this:

```bash
minikube --profile miniziti update-context
```

:::

Let's do a quick test of the current KUBECONFIG context.

```bash
kubectl cluster-info
```

A good result looks like this (no errors).

```bash
$ kubectl cluster-info
Kubernetes control plane is running at https://192.168.49.2:8443
CoreDNS is running at https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

## Install `minikube` Addons

We'll use the `ingress-nginx` and associated DNS addon in this quickstart. This allows us to run DNS locally instead of deploying cloud infrastructure for this exercise. The pods will the addon DNS server even if you decide to forego configuring your computer's DNS resolver to use the `minikube` DNS server.

```bash
minikube --profile miniziti addons enable ingress
minikube --profile miniziti addons enable ingress-dns
```

OpenZiti will need SSL passthrough, so let's patch the `ingress-nginx` deployment to enable that feature.

```bash
kubectl patch deployment -n ingress-nginx ingress-nginx-controller \
   --type='json' \
   --patch='[{"op": "add", 
         "path": "/spec/template/spec/containers/0/args/-",
         "value":"--enable-ssl-passthrough"
      }]'
```

Now your miniziti cluster is ready for some OpenZiti!

## Install the OpenZiti Controller

### Allow Kubernetes to Manage Certificates

You need to install the required [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRD) for the OpenZiti Controller.

```bash
kubectl apply \
   -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.crds.yaml
kubectl apply \
   -f https://raw.githubusercontent.com/cert-manager/trust-manager/v0.4.0/deploy/crds/trust.cert-manager.io_bundles.yaml
```

### Add the OpenZiti Helm Repository

Let's create a Helm release named "miniziti" for the OpenZiti Controller. This will also install sub-charts `cert-manager` and `trust-manager` in the same Kubernetes namespace "ziti-controller."

Add the OpenZiti Helm Repo

```bash
helm repo add openziti https://docs.openziti.io/helm-charts/
```

### Install the Controller

1. Install the Controller chart

   ```bash
   helm install \
      --create-namespace --namespace ziti-controller \
      "miniziti" \
      openziti/ziti-controller \
         --set clientApi.advertisedHost="minicontroller.ziti" \
         --values https://docs.openziti.io/helm-charts/charts/ziti-controller/values-ingress-nginx.yaml
   ```

1. This may take a few minutes. Wait the controller's pod status progress to "Running." You can get started on the DNS set up in the next section, but you need the controller up and running to install the router.

   ```bash
   kubectl --namespace ziti-controller get pods --watch
   ```

## Configure DNS

There are two DNS resolvers to set up: your computer running `minikube` and the cluster DNS. Both need to resolve these three domain names to the `minikube` IP address. 

### Host DNS

The simplest way to set up your host's resolver is to modify the system's hosts file, e.g. `/etc/hosts`. The alternative is to configure your host's resolver to use the DNS addon we enabled earlier. Whichever method you choose, you'll still need to configure CoreDNS so that pods can resolve these DNS names too.

* minicontroller.ziti
* miniconsole.ziti
* minirouter.ziti

#### Host DNS Easy Option: `/etc/hosts` 

Add this line to your system's hosts file. Replace `{MINIKUBEIP}` with the IP address from `minikube --profile miniziti ip`.

```bash
# /etc/hosts
sudo tee -a /etc/hosts <<< "$(minikube --profile miniziti ip) minicontroller.ziti  minirouter.ziti  miniconsole.ziti" 
```

#### Host DNS Harder Option: `ingress-dns`

This option configures your host to use use the DNS addon we enabled earlier for DNS names like "*.ziti". The DNS addon provides a nameserver that can answer queries about the cluster's ingresses, e.g. "minicontroller.ziti" which you just created when you installed the OpenZiti Controller chart.

   1. Make sure the DNS addon is working. Send a DNS query to the  address where the ingress nameserver is running.

      ```bash
      nslookup minicontroller.ziti $(minikube --profile miniziti ip)
      ```

      You know it's working if you see the same IP address in the response as when you run `minikube --profile miniziti ip`.

   1. Configure your computer to send certain DNS queries to the `minikube --profile miniziti ip` DNS server automatically. Follow the steps in [the `minikube` web site](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/#installation) to configure macOS, Windows, or Linux's DNS resolver.

      Now that your computer is set up to use the `minikube` DNS server for DNS names that end in "*.ziti", you can test it again without specifying where to send the DNS query.

      ```bash
      # test your DNS configuration
      nslookup minicontroller.ziti
      ```

      You know it's working if you see the same IP address in the response as when you run `minikube --profile miniziti ip`.

### Cluster DNS

Configure CoreDNS in the miniziti cluster. This is necessary no matter which host DNS resolver method you used above. 

1. Add the miniziti forwarder to the end of the value of `Corefile` in CoreDNS's configmap. Don't forget to substitute the real IP from `minikube --profile miniziti ip` for `{MINIKUBE_IP}`, and be mindful to keep the indentation the same as the default `.:53` handler.

   ```bash
   # 1. Edit the configmap. 
   # 2. Save the file. 
   # 3. Exit the editor.
   kubectl --namespace kube-system edit configmap "coredns"
   ```

   ```json
      ziti:53 {
         errors
         cache 30
         forward . {MINIKUBE_IP}
      }
   ```

   It should look like this.

   ```yaml
   apiVersion: v1
   data:
   Corefile: |
      .:53 {
         log
         errors
         health {
            lameduck 5s
         }
         ready
         kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
         }
         prometheus :9153
         hosts {
            192.168.49.1 host.minikube.internal
            fallthrough
         }
         forward . /etc/resolv.conf {
            max_concurrent 1000
         }
         cache 30
         loop
         reload
         loadbalance
      }
      miniziti:53 {
               errors
               cache 30
               forward . 192.168.49.2
      }
   kind: ConfigMap
   metadata:
   creationTimestamp: "2023-02-25T16:17:24Z"
   name: coredns
   namespace: kube-system
   resourceVersion: "19660"
   uid: deae90e7-5b3d-49ea-b996-4f525da5597a
   ```

1. Delete the running CoreDNS pod so a new one will pick up the Corefile change you just made. 
   
   ```bash
   kubectl --namespace kube-system delete pods \
      $(kubectl --namespace kube-system get pods | /bin/grep coredns | cut -d " " -f1)
   ```

1. Test DNS from inside your cluster. You know it's working if you see the same IP address in the response as when you run `minikube --profile miniziti ip`.

   ```bash
   kubectl run --rm --tty --stdin dnstest --image=busybox --restart=Never -- \
         nslookup minicontroller.ziti
   ```

## Install the Router

1. Log in to OpenZiti.

   ```bash
   ziti edge login minicontroller.ziti:443 \
      --yes --username admin \
      --password $(
         kubectl --namespace ziti-controller \
            get secrets miniziti-controller-admin-secret \
            -o go-template='{{index .data "admin-password" | base64decode }}'
      )
   ```

1. Create a Router with role "public-routers" and save the enrollment one-time-token as a temporary file.

   ```bash
   ziti edge create edge-router "minirouter" \
      --role-attributes "public-routers" \
      --tunneler-enabled \
      --jwt-output-file /tmp/minirouter.jwt
   ```

1. List your minirouter.

   ```bash
   ziti edge list edge-routers
   ```

   ```bash
   # example output
   $ ziti edge list edge-routers
   ╭────────────┬────────────┬────────┬───────────────┬──────┬────────────╮
   │ ID         │ NAME       │ ONLINE │ ALLOW TRANSIT │ COST │ ATTRIBUTES │
   ├────────────┼────────────┼────────┼───────────────┼──────┼────────────┤
   │ oYl6Zi2oKS │ minirouter │ false  │ true          │    0 │ public-routers    │
   ╰────────────┴────────────┴────────┴───────────────┴──────┴────────────╯
   results: 1-1 of 1
   ```

1. Install the Router Chart.

   ```bash
   helm install \
      --create-namespace --namespace ziti-router \
      "minirouter" \
      openziti/ziti-router \
         --set-file enrollmentJwt=/tmp/minirouter.jwt \
         --set edge.advertisedHost=minirouter.ziti \
         --set ctrl.endpoint=miniziti-controller-ctrl.ziti-controller.svc:6262 \
         --values https://docs.openziti.io/helm-charts/charts/ziti-router/values-ingress-nginx.yaml
   ```

   These Helm chart values configure the router to use the controller's cluster-internal service that provides the router control plane, i.e., the "ctrl" endpoint.

## Install the Console

1. Install the chart

   ```bash
   helm install \
      --create-namespace --namespace ziti-console \
      "miniconsole" \
      openziti/ziti-console \
         --set ingress.advertisedHost=miniconsole.ziti \
         --set settings.edgeControllers[0].url=https://minicontroller.ziti \
         --values https://docs.openziti.io/helm-charts/charts/ziti-console/values-ingress-nginx.yaml
   ```

1. Get the admin password on your clipboard.

   ```bash
   # print the admin password and a newline to
   # make it easier to copy to your clipboard
   echo $(kubectl --namespace ziti-controller \
      get secrets miniziti-controller-admin-secret \
         -o go-template='{{index .data "admin-password" | base64decode }}')
   ```

1. Open [http://miniconsole.ziti](http://miniconsole.ziti) in your web browser and login with username "admin" and the password from your clipboard.

## Create OpenZiti Identities and Services

Here's a BASH script that runs several `ziti` CLI commands to illustrate a minimal set of identities, services, and policies.

```bash
ziti edge create identity device edge-client1 \
    --jwt-output-file /tmp/edge-client1.jwt --role-attributes webhook-clients

ziti edge create identity device webhook-server1 \
    --jwt-output-file /tmp/webhook-server1.jwt --role-attributes webhook-servers

ziti edge create config webhook-intercept-config intercept.v1 \
    '{"protocols":["tcp"],"addresses":["webhook.ziti"], "portRanges":[{"low":80, "high":80}]}'

ziti edge create config webhook-host-config host.v1 \
    '{"protocol":"tcp", "address":"httpbin","port":8080}'

ziti edge create service webhook-service1 --configs webhook-intercept-config,webhook-host-config

ziti edge create service-policy webhook-bind-policy Bind \
    --service-roles '@webhook-service1' --identity-roles '#webhook-servers'

ziti edge create service-policy webhook-dial-policy Dial \
    --service-roles '@webhook-service1' --identity-roles '#webhook-clients'

ziti edge create edge-router-policy "public-routers" \
    --edge-router-roles '#public-routers' --identity-roles '#all'

ziti edge create service-edge-router-policy "public-routers" \
    --edge-router-roles '#public-routers' --service-roles '#all'

ziti edge enroll /tmp/webhook-server1.jwt
```

## Install the `httpbin` Demo Webhook Server Chart

This Helm chart installs an OpenZiti fork of `go-httpbin`, so it doesn't need to be accompanied by an OpenZiti Tunneler. We'll use it as a demo webhook server to test the OpenZiti Service you just created named "webhook-service1".

```bash
helm install webhook-server1 openziti/httpbin \
   --set-file zitiIdentity=/tmp/webhook-server1.json \
   --set zitiServiceName=webhook-service1
```

## Load the Client Identity in your OpenZiti Tunneler

Follow [the instructions for your tunneler OS version](https://docs.openziti.io/docs/reference/tunnelers/) to add the OpenZiti Identity that was saved as filename `/tmp/edge-client1.jwt`.

As soon as identity enrollment completes you should have a new DNS name available to you. Let's test that with a DNS query.

```bash
# this DNS answer is coming from the OpenZiti Tunneler
nslookup webhook.ziti
```

## Test the Webhook Service

```bash
curl -sSf -XPOST -d ziti=awesome http://webhook.ziti/post | jq .data
```

You can also visit [http://webhook.ziti/get](http://webhook.ziti/get) in your web browser to see a JSON test response from the demo server.

## Explore the OpenZiti Console

Now that you've successfully tested the OpenZiti Service, check out the various entities in your that were created by the script in [http://miniconsole.ziti/](http://miniconsole.ziti/).

## Hello Web Server Demo

1. Create an OpenZiti Service, configs, and policies for the Hello Demo Server

   ```bash
   ziti edge create identity device hello-server1 \
      --jwt-output-file /tmp/hello-server1.jwt --role-attributes hello-servers

   ziti edge create config hello-intercept-config intercept.v1 \
      '{"protocols":["tcp"],"addresses":["hello.ziti"], "portRanges":[{"low":80, "high":80}]}'

   ziti edge create config hello-host-config host.v1 \
      '{"protocol":"tcp", "address":"hello-server1.default.svc","port":80}'

   ziti edge create service hello-service1 --configs hello-intercept-config,hello-host-config

   ziti edge create service-policy hello-bind-policy Bind \
      --service-roles '@hello-service1' --identity-roles '#hello-servers'

   ziti edge create service-policy hello-dial-policy Dial \
      --service-roles '@hello-service1' --identity-roles '#hello-clients'

   ziti edge update identity edge-client1 \
      --role-attributes webhook-senders,hello-clients

   ziti edge enroll /tmp/hello-server1.jwt
   ```

1. Install the Hello Toy chart.

   This chart is a regular, non-OpenZiti demo server deployment. Next we'll connect it to our OpenZiti Network with an OpenZiti Tunneler deployment.

   ```bash
   helm install hello-ziti-1 openziti/hello-toy \
      --set serviceDomainName=hello-server1
   ```

1. Deploy an OpenZiti Hosting Tunneler

   This chart installs an OpenZiti Tunneler in hosting mode to connect regular cluster services to the OpenZiti Network.

   ```bash
   helm install ziti-host1 openziti/ziti-host \
      --set-file zitiIdentity=/tmp/hello-server1.json
   ```

1. Visit the Hello Demo page in your browser: [http://hello.ziti/](http://hello.ziti/)

   Now you have two OpenZiti Services available to your OpenZiti Tunneler.

## Next Steps

1. In the OpenZiti Console, fiddle the policies and roles to revoke then restore your permission to acess the demo services.
1. Add a service, configs, and policies to expose the Kubernetes apiserver as an OpenZiti Service. 
   1. Hint, the address is "kubernetes.default.svc:443" inside the cluster. 
   1. Connect to the K8s apiserver from another computer with [`kubeztl`, the OpenZiti fork of `kubectl`](https://github.com/openziti-test-kitchen/kubeztl/). `kubeztl` works by itself without an OpenZiti Tunneler.
1. Share the demo server with someone.
   1. Create another identity named " edge-client2" with role "hello-clients" and send it to someone. 
   1. Ask them to [install a tunneler and load the identity](https://docs.openziti.io/docs/reference/tunnelers/) so they too can access [http://hello.ziti/](http://hello.ziti/).

## Cleanup

1. Remove the "miniziti" names from `/etc/hosts` if you added them.

   ```bash
   sudo sed -iE '/mini.*\.ziti/d' /etc/hosts
   ```

1. Delete the cluster.

   ```bash
   minikube --profile miniziti delete
   ```

1. In your OpenZiti Tunneler, "Forget" your Identity.