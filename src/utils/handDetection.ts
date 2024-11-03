import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let handLandmarker: HandLandmarker | null = null;

const initializeHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    numHands: 1
  });
};

const isHandClosed = (landmarks: any) => {
  return (
    landmarks[8].y > landmarks[6].y &&
    landmarks[12].y > landmarks[10].y &&
    landmarks[16].y > landmarks[14].y &&
    landmarks[20].y > landmarks[18].y
  );
};

export const detectHand = async (video: HTMLVideoElement): Promise<boolean> => {
  if (!handLandmarker) {
    await initializeHandLandmarker();
  }

  if (!handLandmarker) return false;

  const results = handLandmarker.detectForVideo(video, performance.now());

  if (results.landmarks && results.landmarks.length > 0) {
    return isHandClosed(results.landmarks[0]);
  }

  return false;
};