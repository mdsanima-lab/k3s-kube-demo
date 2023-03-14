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
