
import React from "react";
import { isImageKitUrl, withTransform } from "../../lib/imagekit";

const VIDEO_TRANSFORM = "q-80, w-640";
const POSTER_TRANSFORM = "q-80, w-640";

function buildPosterUrl(url) {
  if (!url || !isImageKitUrl(url)) return undefined;

  const [path] = url.split("?");
  return withTransform(`${path}/ik-thumbnail.jpg`, POSTER_TRANSFORM);
}

export function MessageVideo({ src }) {
  if (!src) return null;

  const optimizedSrc = withTransform(src, VIDEO_TRANSFORM);
  const posterSrc = buildPosterUrl(src);

  return (
    <video
      src={optimizedSrc}
      poster={posterSrc}
      controls
      preload="metadata"
      playsInline
      className="w-full max-w-full max-h-[350px] rounded-xl bg-black object-contain"
    >
      Your browser does not support HTML video.
    </video>
  );
}

export default MessageVideo;
