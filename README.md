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

### Example Command

This is a example command, type in `WSL` terminal:

```shell
docker buildx build --platform linux/amd64,linux/arm64 -t mdsanima/app --push .
```

This command create multi-arch images for `linux/amd64` and `linux/arm64` architecture then pushing
to docker hub repository.

Do not execute this command this is a only example, for each application this command is available
inside apps folder on `README.md` files.

## Debug Application

This is a documentation how to troubleshooting your application.

### Get a Shell to a Running Container

Create the simple nginx pod:

```shell
kubectl run nginx-shell-demo --image=nginx
```

Verify that the container is running:

```shell
kubectl get pod nginx-shell-demo
```

Get a shell to the running container:

```shell
kubectl exec --stdin --tty nginx-shell-demo -- /bin/bash
```

Now you are inside the pod.

Delete the demo pod:

```shell
kubectl delete pod nginx-shell-demo
```

### Configure Hosts Name

Edit your `/etc/hosts` file and add this line:

```shell
192.168.1.30 kube.mdsanima.local rpi-1.node.test hello.dev.local
```

Now you can assess at the URL like this [http://kube.mdsanima.local](http://kube.mdsanima.local)
or this [http://rpi-1.node.test:31337](http://rpi-1.node.test:31337) specific node port services.
You can type anything you want.

This config may be different of any your node. Also you can change it in `WSL` and if you want to
access browser on Windows you need to change it in other location. Open the Windows Terminal with
**Administrator** mode on your `WSL` system. I use `Ubuntu 22.04 LTS Jammy`. Type this command
`nano /mnt/c/Windows/System32/drivers/etc/hosts` and add your host name.

## NGINX Ingress Controller

Here is a instruction guide for install the
[NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/) from official
documentation site.

You can deploy the ingress controller with the following command:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/cloud/deploy.yaml
```

Now check the namespace, pods and services with short version commands:

```shell
kubectl get ns
kubectl get pod --namespace=ingress-nginx
kubectl get svc --namespace=ingress-nginx
```
