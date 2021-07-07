# `docker-java`: The Missing Guide

At the time of creating this (very hit-or-miss) guide, the official
[docker-java][docker-java-repository] repository [only had a couple of
pages][docs-readme-state] behind a huge 'Read the documentation here'
hyperlink. None of them were actually helpful for anyone not familiar with
low-level Docker API, or even with the Docker CLI.

It took a lot of trial and error, searching the entire GitHub for code samples,
and some debugging/reverse engineering effort to find out some of the things in
this guide.

## `DockerClient#buildImageCmd()`

### `withDockerfile()`

The `withDockerfile()` builder method depends on `baseDirectory`. Therefore, if
the Dockerfile is in a nonstandard place, remember to specify both
`baseDirectory` and `dockerfile`.

What's interesting is the error message that `DockerClient` shows when there's
an issue with resolving the base directory/Dockerfile setup:

> Dockerfile is excluded by pattern '\*' in .dockerignore file

If you ever see this error, call `withBaseDirectory()` before
`withDockerfile()`.

```java
final var imageId = dockerClient.buildImageCmd()
        .withTags(Set.of(imageName))
        .withBaseDirectory(baseDirectory) // <- This...
        .withDockerfile(dockerfileMain)   // <- ...before this.
        .exec(new BuildImageResultCallback())
        .awaitImageId();
```

[docker-java-repository]: https://github.com/docker-java/docker-java
[docs-readme-state]:
  https://github.com/docker-java/docker-java/commit/8864acd71e1665f2ab031ec1b4bb5ed04c12a270
