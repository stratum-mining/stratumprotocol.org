# stratumprotocol.org

## Build the project Locally

In order to build the website locally, you'll need [Node.js](https://nodejs.org/) >= 14.16 (or basically the latest LTS version).

The setup is straight forward:

```bash
# Install dependencies
yarn install

# Serve locally (by default on port 8080)
yarn dev
```

## Embedding YouTube videos

To add a YouTube video with a preview, you can so so by linking to it like this:

```md
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/mqdefault.jpg)](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)
```

Note that the link item need to be a preview image (either from YouTube or a custom one) to result in an embedded video.
