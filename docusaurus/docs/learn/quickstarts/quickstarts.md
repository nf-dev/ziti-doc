---
sidebar_position: 3
id: quickstartOverview
---
# Start Cooking With Ziti

Learn how to start integrating Zero Trust directly into your application! Explore our quickstarts and learn how to
get your own open source zero trust network overlay setup.

OpenZiti is bringing Zero Trust to networks all over the world! To really get the most out of Ziti, you'll want to embed
it **directly** into your applications. Ziti provides numerous SDKs for this very purpose. If you're not ready to embed
Zero Trust right into your application you can still get started by using one or more of the
[tunneling apps](/learn/core-concepts/clients/choose.mdx).

:::info
Quickstarts are short-lived networks that are great for learning how to Ziti all the thigs! For long-lived production deployments, see the [deployment guides](/docs/category/deployments).
:::

:::tip 
If you get stuck on anything at all, remember that the link to the discourse sites is on the top right of all the doc
pages. Don't be afraid to ask the community for help!
:::

## Getting Started - Network

When you're just getting started, the first thing you will need is access to a
[network](/learn/introduction/index.mdx). For someone just starting out, there are four basic options:

### Run all the binaries locally

Here you'll start and stop components on your own. This is great for learning but since it's all local, keeping any
services you define actually separate from your local machine is a bit hard.

### Run locally using [Docker](https://www.docker.com)

This allows you to do some more complex things like actually isolate services from even yourself.

### Run on your own server

If you have a server available on the internet already, you can deploy an overlay network on it. Then, you can share the
overlay with other people you want to have access to your [network](/learn/introduction/index.mdx) and aren't on the local network.

## Which network option sounds right for you?

* [Run Everything Locally - no Docker](./network/local-no-docker)
* [Run Everything Locally - using Docker](./network/local-with-docker)
* [Run Everything Locally - Docker Compose](./network/local-docker-compose)
* [Run Everything Hosted](./network/hosted)
