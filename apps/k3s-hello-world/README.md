# K3s Hello World

Simple demo Node.js app for testing Lightweight Kubernetes K3s cluster.

## Building Docker Image

First you must check
[this instruction](../../README.md#building-multi-arch-images) for setup
building **multi-arch** images.

Then you can build multi-arch images for this application, type this command in
the `WSL` terminal:

```shell
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t mdsanima/k3s-hello-world:0.1.2 \
  --push .
```

This command create multi-arch images for `linux/amd64`, `linux/arm64` and
`linux/arm/v7` architecture then pushing to docker hub repository with tag
`0.1.2`. Also you can remove this tag then images tag is a `latest`. For testing
you can also remove the `--push` option to check if images is proper builded.

Docker image pushed to
[hub.docker.com](https://hub.docker.com/r/mdsanima/k3s-hello-world) repository
with this [tags](https://hub.docker.com/r/mdsanima/k3s-hello-world/tags).

Also you can build this images for each architecture separately like this
`--platform linux/amd64` and then upload them all to the repository.

For testing your image also you can build and run your container like this:

```shell
docker build -t mdsanima/k3s-hello-world .
docker run -p 3000:3000 mdsanima/k3s-hello-world
```

Now you can view your images created with `docker images` command.

## Setup Deploy `CLI`

This is a instruction guide for deploy our app with `CLI` command line tools and
`kubectl` command.

### Create Deployment

Now image is created and pushed to repo, then you can create the deployment in
your K3s Cluster:

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

If you see **STATUS** for pod _hello-world-<hash_replica_set>-<hash_pod>_ is
`Running` you can go to the next step creating service on this deployment.

### Create Service Type `ClusterIP`

We are successfully deploy our image, now is time to create service for this
deployment.

This steps expose our deployment to port `3000`:

```shell
kubectl expose deployment hello-world --port=3000
```

This command create type `ClusterIP` for this deployment. Now you can check this
with short or long command:

```shell
kubectl get service
kubectl get svc
```

Exposing port with this method not allow you to checking outside the k3s
cluster. For checking you must be inside your cluster:

```shell
curl <CLUSTER_IP:PORT>
curl 10.43.255.9:3000
curl 10.43.255.9:3000; echo
```

The `CLUSTER_IP` is changing and this commands is a only example how to use. The
last command move your to new line and show output from our node express app
with pod name like this example:

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

Scaling our deployment with 4 replica creating new pods and each ot those pods
is now available via `ClusterIP` as before, and Kubernetes will decide which pod
to choose for each particular request.

Now try to make connection to our `ClusterIP` inside our cluster, as before type
this command in the terminal several time:

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

Now you can see, the each response is different. The load is balanced across
different pods.

### Delete Service

Now let's delete the current service:

```shell
kubectl delete service hello-world
```

Our service was deleted, now move to next step.

### Create Service Type `NodePort`

Here is a instruction for creating service again but this time is a different
type `NodePort` thats allow you to connect outside our cluster.

This steps expose our deployment to port **3000**:

```shell
kubectl expose deployment hello-world --type=NodePort --port=3000
```

This command create `NodePort` type for this deployment, and rendomly asigning
node port.

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

Finally you can open your browser and go to `192.168.1.30:31337` site. You can
type any ip address of your node, and the response is from our pors.

### Create Service Type `LoadBalancer`

Firs delete existing service like before, then create the new one:

```shell
kubectl delete service hello-world
kubectl expose deployment hello-world --type=LoadBalancer --port=3000
```

Now as before you can able to open browser and go to **<NODE_IP:PORT>** with the
port is randomly generated by Kubernetes or simple curl method.

You can also check this:

```shell
kubectl get deploy
kubectl describe deploy hello-world
```

This command show information for your deployment.

### Rolling Update Deployment

Now you can build new docker image with different version and rolling update of
the new deployment.

Firs change your code in `index.mjs` file then build the new image, push to
docker hub, and type in the terminal:

```shell
kubectl set image deployment hello-world k3s-hello-world=mdsanima/k3s-hello-world:0.1.2
kubectl rollout status daploy hello-world
```

Now wait for deployment rollout was finish, and check the app.

### Delete Deployment

Here is a instruction for deleting our deployment and service:

```shell
kubectl delete deployment hello-world
kubectl delete service hello-world
```

Also you can type `kubectl delete all --all` thats delete all pod, service and
deployment. Important, that command is not recommended.

Our deployment and service was deleted, now move to next step.

## Setup Deploy `YAML`

This is a instruction guide for deploy our app with `YAML` files and `kubectl`
command.

### Applying Deployment

Now is time to deploy our application from file with one command.

All `.yaml` files for our app is located outside this folder two levels up
inside `/kubernetes/k3s-hello-world` folder, and you must be in this folder for
type commands.

Our configuration `.yaml` files:

- [deployment](../../kubernetes/k3s-hello-world/deployment.yaml)
- [service](../../kubernetes/k3s-hello-world/service.yaml)
- [ingress](../../kubernetes/k3s-hello-world/ingress.yaml)

Applying deployment and services from file with the following one command:

```shell
kubectl apply -f deployment.yaml -f service.yaml -f ingress.yaml
```

Or you can change directory to `/kubernetes` location and type:

```shell
kubectl apply -f k3s-hello-world
```

All the files inside this folder are applying. See how easy it is.

The configuration is almost the same as before, but here you can configure node
ports. In this case I set the port for **80** and node port for **30000**.

Type `NodePort` default is a **30000-32767** from official kubernetes service
[documentation](https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport).

Now our application is running, you can check `192.168.1.30:30000` on the
browser or simple curl method. You can type any of your node ip address here.

Check the [NGINX Ingress Controller](../../README.md#nginx-ingress-controller)
instruction for install and [host name](../../README.md#configure-hosts-name)
configuration guide for access in your local computer for this address
[http://hello.dev.local/](http://hello.dev.local/) instead typing IP address on
the browser like before. Also you can pass the port in URL because our config
allow this.

On this configuration our service is type `LoadBalancer` and node port is
exposed. Also you can configure the service of type `ClusterIP` and remove node
port on `service.yaml` file and our ingress controller give you access to host
name outside the cluster with out typing port.

Now you can check our deployment and services:

```shell
kubectl get deployment
kubectl get service
kubectl get ingress
```

This command also you can type in short version like this:

```shell
alias k=kubectl
k get deploy
k get svc
k get ing
```

If you want to configure our deployment for pulling image always from docker hub
when rolling deploy is activated simple add this line
`imagePullPolicy: "Always"` to
[deployment.yaml](../../kubernetes/k3s-hello-world/deployment.yaml#L17) file on
container spec below this `image: mdsanima/k3s-hello-world:latest` line.

### Applying Manifest

Also you can create deployment and service in one `.yaml` file. Only change is a
separate deployment and service with exactly this `---` character inside
[deploy.yaml](deploy.yaml) file. Inside this file I change service type to
`ClusterIP`, remove node port and configure `imagePullPolicy`.

Now you can simple type this:

```shell
kubectl apply -f deploy.yaml
```

Even not cloning this repository:

```shell
kubectl apply -f https://raw.githubusercontent.com/mdsanima-lab/k3s-kube-demo/main/apps/k3s-hello-world/deploy.yaml
```

You can deploy this one file or the previous ones, the choice is yours. Here I
just wanted to show the differences between these files and the actual
deployment.

### Deleting Deployment and Services

For deleting this deployment and services simple type in `/kubernetes` folder:

```shell
kubectl delete -f k3s-hello-world
```

On this method all pods, deployment and service inside this folder in `yaml`
files are deleted from our K3s Cluster.
