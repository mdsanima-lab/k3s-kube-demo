# K3s Hello World

This is a simple Node.js Hello World Web App for testing Lightweight Kubernetes K3s Cluster.

## Building Docker Image

First you must check [this instruction](../../README.md#building-multi-arch-images) for setup
building multi-arch images.

Then you can build multi-arch images for this application, type this command in `WSL` terminal:

```shell
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t mdsanima/k3s-hello-world:0.1.0 \
  --push .
```

This command create multi-arch images for `linux/amd64`, `linux/arm64` and `linux/arm/v7`
architecture then pushing to docker hub repository with tag `0.1.0`. Also you can remove this tag
then images tag is a `latest`. For testing you can also remove the `--push` option to check if
images is proper builded.

Docker image pushed to [hub.docker.com](https://hub.docker.com/r/mdsanima/k3s-hello-world)
repository with this [tags](https://hub.docker.com/r/mdsanima/k3s-hello-world/tags).

Also you can build this images for each architecture separately like this `--platform linux/amd64`
and then upload them all to the repository.

For testing your image also you can build and run your container like this:

```shell
docker build -t mdsanima/k3s-hello-world .
docker run -p 3000:3000 mdsanima/k3s-hello-world
```

Now you can view your images created with `docker images` command.

## Setup Deploy `CLI`

This is a instruction guide for deploy our app with `CLI` command line tools and `kubectl` command.

### Create Deployment

Now image is created and pushed to repo, then you can create the deployment in your K3s Cluster:

```shell
kubectl create deployment hello-world --image=mdsanima/k3s-hello-world
```

Checking the deployment with short and normal command:

```shell
kubectl get deployment
kubectl get deploy
```

Now check the pod with options output wide:

```shell
kubectl get pod -o wide
```

If you see **STATUS** for pod _hello-world-<hash_replica_set>-<hash_pod>_ is `Running` you can go to
the next step creating service on this deployment.

### Create Service Type `ClusterIP`

We are successfully deploy our image, now is time to create service for this deployment.

This steps expose our deployment to port `3000`:

```shell
kubectl expose deployment hello-world --port=3000
```

This command create type `ClusterIP` for this deployment. Now you can check this with short or long
command:

```shell
kubectl get service
kubectl get svc
```

Exposing port with this method not allow you to checking outside the k3s cluster. For checking you
must be inside your cluster:

```shell
curl <CLUSTER_IP:PORT>
curl 10.43.255.9:3000
curl 10.43.255.9:3000; echo
```

The `CLUSTER_IP` is changing and this commands is a only example how to use. The last command move
your to new line and show output from our node express app with pod name like this example:

```shell
Hello from the K3s Cluster POD: hello-world-7d49d9c6c8-k2tdk
```

### Scale Deployment

Let's scale this deployment for more replicas:

```shell
kubectl scale deployment hello-world --replicas=4
kubectl get pod -o wide
```

You can also check what is going on in the pod if it takes a long time:

```shell
kubectl describe pod <POD_NAME>
```

Scaling our deployment with 4 replica creating new pods and each ot those pods is now available via
`ClusterIP` as before, and Kubernetes will decide which pod to choose for each particular request.

Now try to make connection to our `ClusterIP` inside our cluster, as before type this command in the
terminal several time:

```shell
$ curl 10.43.255.9:3000; echo
Hello from the K3s Cluster POD: hello-world-7d49d9c6c8-k2tdk
$ curl 10.43.255.9:3000; echo
Hello from the K3s Cluster POD: hello-world-7d49d9c6c8-ff7b5
$ curl 10.43.255.9:3000; echo
Hello from the K3s Cluster POD: hello-world-7d49d9c6c8-vt5xp
$ curl 10.43.255.9:3000; echo
Hello from the K3s Cluster POD: hello-world-7d49d9c6c8-67cq6
```

Now you can see, the each response is different. The load is balanced across different pods.

### Delete Service

Now let's delete the current service:

```shell
kubectl delete service hello-world
```

Our service was deleted, now move to next step.

### Create Service Type `NodePort`

Here is a instruction for creating service again but this time is a different type `NodePort` thats
allow you to connect outside our cluster.

This steps expose our deployment to port **3000**:

```shell
kubectl expose deployment hello-world --type=NodePort --port=3000
```

This command create `NodePort` type for this deployment, and rendomly asigning node port.

Now you can check:

```shell
$ kubectl get service hello-world
NAME              TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
hello-world       NodePort   10.43.251.89   <none>        3000:31337/TCP   11m
```

Then check the `INTERNAL-IP` for your node:

```shell
kubectl get node -o wide
```

Finally you can open your browser and go to `192.168.1.30:31337` site. You can type any ip address
of your node, and the response is from our pors.

### Create Service Type `LoadBalancer`

Firs delete existing service like before, then create the new one:

```shell
kubectl delete service hello-world
kubectl expose deployment hello-world --type=LoadBalancer --port=3000
```

Now as before you can able to open browser and go to **<NODE_IP:PORT>** with the port is randomly
generated by Kubernetes or simple curl method.

You can also check this:

```shell
kubectl get deploy
kubectl describe deploy hello-world
```

This command show information for your deployment.
