import type { BackgroundSettings } from '../types';

interface BackgroundProps {
  settings: BackgroundSettings;
}

export function Background({ settings }: BackgroundProps) {
  const { type, url, opacity } = settings;

  if (type === 'video') {
    return (
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: `brightness(${1 - opacity})` }}
        >
          <source src={url} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: opacity * 0.5 }}
        />
      </div>
    );
  }

  // Default: image
  return (
    <div className="fixed inset-0 -z-10">
      <img
        src={url}
        alt="Background"
        className="w-full h-full object-cover"
        style={{ filter: `brightness(${1 - opacity})` }}
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: opacity * 0.3 }}
      />
    </div>
  );
}
