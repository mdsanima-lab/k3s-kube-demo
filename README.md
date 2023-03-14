# K3s Kube Demo

Deploying Demo Apps in Lightweight Kubernetes [K3s](https://k3s.io/) Cluster.
Checkt the [official documentation](https://docs.k3s.io/) how to install and configure K3s Cluster.

The Linux docker images in this repository is builded for `AMD 64-bit`, `ARM 32-bit`, and
`ARM 64-bit` architectures. Thats allow you to run this app inside _K3s Cluster_ on
**Raspberry Pi 3** and **4** nodes, **nVidia Jetson Nano** nodes, **Ampere ARM** and **AMD 64-bit**
server nodes.

## Kube Demo Apps

There is a two different application on this monorepo:

- [k3s-hello-world](/apps/k3s-hello-world/README.md)
- [k3s-hello-mdsanima](apps/k3s-hello-mdsanima/README.md)

## Building Multi-Arch Images

This is a monorepo contains two different application. Each app is building for multi-arch images
and pushing in [hub.docker.com](https://hub.docker.com/u/mdsanima) site.

First start Docker Desktop on Windows and check our builders, type in `WSL` terminal:

```shell
docker buildx ls
```

We are currently using the default builder. Now create a new builder, which gives us access to new
multi-arch features, type in `WSL` terminal:

```shell
docker buildx create --name mybuilder
docker buildx use mybuilder
docker buildx inspect --bootstrap
```

Here is a new builder instance with the name **mybilder**, switched to it, and inspected it. Now you
can build multi-arch images for each application.
