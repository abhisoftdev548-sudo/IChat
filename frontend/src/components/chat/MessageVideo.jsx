
import { useState } from "react";
import { Play } from "lucide-react";
import { isImageKitUrl, withTransform } from "../../lib/imagekit";

const VIDEO_TRANSFORM = "f-mp4";
const POSTER_TRANSFORM = "q-80, w-640";

function buildPosterUrl(url) {
  if (!url || !isImageKitUrl(url)) return undefined;

  const [path] = url.split("?");
  return withTransform(`${path}/ik-thumbnail.jpg`, POSTER_TRANSFORM);
}

export function MessageVideo({
  src,
  preview = false,
  onClick,
  className,
  previewClassName,
}) {
  const [fallbackState, setFallbackState] = useState({
    src: null,
    useOriginal: false,
    hasError: false,
  });

  if (!src) return null;

  const optimizedSrc = withTransform(src, VIDEO_TRANSFORM);
  const isFallbackForCurrentSrc = fallbackState.src === src;
  const useOriginalSrc = isFallbackForCurrentSrc && fallbackState.useOriginal;
  const playbackError = isFallbackForCurrentSrc && fallbackState.hasError;
  const videoSrc = useOriginalSrc ? src : optimizedSrc;
  const posterSrc = buildPosterUrl(src);
  const handleError = () => {
    if (!useOriginalSrc && optimizedSrc !== src) {
      setFallbackState({ src, useOriginal: true, hasError: false });
    } else {
      setFallbackState({ src, useOriginal: true, hasError: true });
    }
  };

  if (preview) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Open video"
        className={previewClassName || "relative block aspect-video w-full overflow-hidden rounded-xl bg-black"}
      >
        <video
          src={videoSrc}
          poster={posterSrc}
          muted
          preload="metadata"
          playsInline
          onError={handleError}
          className="absolute inset-0 size-full object-contain"
        />
        <span className="absolute inset-0 grid place-items-center bg-black/20 text-white">
          <span className="grid size-14 place-items-center rounded-full bg-black/55">
            {playbackError ? "!" : <Play size={26} fill="currentColor" />}
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <video
        src={videoSrc}
        poster={posterSrc}
        controls
        preload="auto"
        playsInline
        onError={handleError}
        className={className || "h-[75dvh] w-full max-w-full rounded-xl bg-black object-contain"}
      >
        Your browser does not support HTML video.
      </video>
      {playbackError && (
        <p className="text-sm text-red-500">
          This video format could not be played.
        </p>
      )}
    </div>
  );
}

export default MessageVideo;
