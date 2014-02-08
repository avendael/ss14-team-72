# SS14-TEAM-72

GLHF guys!

Let's all fork the main repo as upstream, and submit pull requests as we go along the way.

## Deployment

It's either

```
$ divshot push
```

Or

```
$ grunt divshot:push:development # to push to development (default)
$ grunt divshot:push:staging # to push to staging
$ grunt divshot:push:production # for judging
```

Please refer to the divshot setup [guide](http://docs.divshot.io/guides/getting-started) for more info

For testing in localhost, you can use

```
$ grunt server
```

A watcher is already configured and your browser tab will auto refresh upon saving changes in your editor.
