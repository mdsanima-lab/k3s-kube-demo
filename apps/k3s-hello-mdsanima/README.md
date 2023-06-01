# K3s Hello MDSANIMA

This is a Next.js Hello World MDSANIMA Web App for testing Lightweight Kubernetes K3s Cluster.

## Building Docker Image

First you must check [this instruction](../../README.md#building-multi-arch-images) for setup building **multi-arch**
images.

Then you can build multi-arch images for this application, type this command in the `WSL` terminal:

```shell
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t mdsanima/k3s-hello-mdsanima:0.3.0 \
  --push .
```

This command create multi-arch images for `linux/amd64`, `linux/arm64` and `linux/arm/v7` architecture then pushing to
docker hub repository with tag `0.3.0`. Also you can remove this tag then images tag is a `latest`. For testing you can
also remove the `--push` option to check if images is proper builded.

Docker image pushed to [hub.docker.com](https://hub.docker.com/r/mdsanima/k3s-hello-mdsanima) repository with this
[tags](https://hub.docker.com/r/mdsanima/k3s-hello-mdsanima/tags).

Also you can build this images for each architecture separately like this `--platform linux/amd64` and then upload them
all to the repository.

For testing your image also you can build and run your container like this:

```shell
docker build -t mdsanima/k3s-hello-mdsanima .
docker run -p 3000:3000 mdsanima/k3s-hello-mdsanima
```

Now you can view your images created with `docker images` command.

## Running Locally

First install dependencies and run the development server:

```shell
npm ci
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result. API routes can be accessed
on [http://localhost:3000/api/hello](http://localhost:3000/api/hello).

Now write your code and go to the next step.

## Setup Deploy `CLI`

This is a instruction guide for deploy our app with `CLI` command line tools and `kubectl` command.

### Create Deployment

The code and image was created and pushed to repository now is time to creating the deployment and service in your K3s
Cluster:

```shell
kubectl create deploy hello-mdsanima --image=mdsanima/k3s-hello-mdsanima:latest --replicas=6
kubectl expose deploy hello-mdsanima --type=LoadBalancer --port=3000
kubectl get pod -o wide
kubectl get svc
```

Deployment and service is running with 6 replicas set and with load balancer. Now open the browser and type
`192.168.1.30:31337` to check the result or simple `curl <NODE_IP:PORT>` method. You can type any of your node IP
address here. Remember my ip address and port may differ from yours, you need to check it on your cluster by typing
`kubectl get svc`. Also remember thats with this method of deployment the port is randomly generated in the range
**30000-32767** by Kubernetes.

## Setup Deploy `YAML`

This is a instruction guide for deploy our app with `YAML` files and `kubectl` command.

### Applying Deployment

Now is time to deploy our application from file with one command.

Applying deployment and services from file with the following one command:

```shell
kubectl apply -f deploy.yaml
```

Open the browser and go to [http://mdsanima.dev.local](http://mdsanima.dev.local) site or check the API here
[http://mdsanima.dev.local/api/hello](http://mdsanima.dev.local/api/hello) and get hostname from your pod.

## More Info

That's it! Our application is running in _Lightweight Kubernetes K3s Cluster_ and images is building with multi
architecture. For more command and information check out the first simple Node.js express application named
[k3s-hello-world](../k3s-hello-world/README.md) in this repository.
