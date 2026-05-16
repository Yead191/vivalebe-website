type VideoState = {
  isMuted: boolean;
  volume: number;
};

let globalState: VideoState = {
  isMuted: true,
  volume: 1,
};

const listeners = new Set<(state: VideoState) => void>();

export const videoState = {
  get: () => globalState,
  set: (next: Partial<VideoState>) => {
    globalState = { ...globalState, ...next };
    listeners.forEach((l) => l(globalState));
  },
  subscribe: (listener: (state: VideoState) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
