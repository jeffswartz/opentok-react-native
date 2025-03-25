import type { HostComponent, ViewProps } from 'react-native';
import type { BubblingEventHandler, Int32, Double, Float } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type StreamEvent = {
  streamId: string;
};

export type ErrorEvent = {
  code: string;
  message: string;
};

export type EmptyEvent = {};

export type AudioLevelEvent = {
  audioLevel: Float;
};


export type PublisherRTCStatsReport = {
  connectionId: string;
  jsonArrayOfReports: string;
};

export type AudioNetworkStatsEvent = {
  jsonStats: string;  // JSON string containing all audio stats
};

export type VideoNetworkStatsEvent = {
  jsonStats: string;  // JSON string containing all video stats
};

export interface NativeProps extends ViewProps {
  sessionId: string;
  publisherId: string;
  publishAudio?: boolean;
  publishVideo?: boolean;
  publishCaptions?: boolean;
  audioBitrate?: Int32;
  publisherAudioFallback?: boolean;
  subscriberAudioFallback?: boolean;
  audioTrack?: boolean;
  cameraPosition?: string;
  enableDtx?: boolean;
  frameRate?: Int32;
  name?: string;
  resolution?: string;
  scalableScreenshare?: boolean;
  audioFallbackEnabled?: boolean;
  videoTrack?: boolean;
  videoSource?: string;
  videoContentHint?: string;
  
  onError?: BubblingEventHandler<ErrorEvent> | null;
  onStreamCreated?: BubblingEventHandler<StreamEvent> | null;
  onStreamDestroyed?: BubblingEventHandler<StreamEvent> | null;
  onAudioLevel?: BubblingEventHandler<AudioLevelEvent> | null;
  onAudioNetworkStats?: BubblingEventHandler<AudioNetworkStatsEvent> | null;
  onMuteForced?: BubblingEventHandler<EmptyEvent> | null;
  onRtcStatsReport?: BubblingEventHandler<PublisherRTCStatsReport> | null;
  onVideoDisableWarning?: BubblingEventHandler<EmptyEvent> | null;
  onVideoDisableWarningLifted?: BubblingEventHandler<EmptyEvent> | null;
  onVideoEnabled?: BubblingEventHandler<EmptyEvent> | null;
  onVideoNetworkStats?: BubblingEventHandler<VideoNetworkStatsEvent> | null;
}

export default codegenNativeComponent<NativeProps>(
  'OTPublisherViewNative'
) as HostComponent<NativeProps>;
