import type { HostComponent, ViewProps } from 'react-native';
import type { BubblingEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type StreamEvent = {
  streamId: string;
};

type ErrorEvent = {
  code: string;
  message: string;
};

export type EmptyEvent = {};

export type PublisherVideoNetworkStats = {
  connectionId?: string;
  subscriberId?: string;
  videoPacketsLost: number;
  videoBytesSent: number;
  videoPacketsSent: number;
  timestamp: number;
};

export type PublisherRTCStatsReport = {
  connectionId: string;
  jsonArrayOfReports: string;
};

export interface NativeProps extends ViewProps {
  sessionId: string;
  publisherId: string;
  publishAudio?: boolean;
  publishVideo?: boolean;
  audioBitrate?: number;
  publisherAudioFallback?: boolean;
  subscriberAudioFallback?: boolean;
  audioTrack?: boolean;
  cameraPosition?: string;
  enableDtx?: boolean;
  frameRate?: number;
  name?: string;
  resolution?: string;
  scalableScreenshare?: boolean;
  videoTrack?: boolean;
  videoSource?: string;
  videoContentHint?: string;
  onError?: BubblingEventHandler<ErrorEvent> | null;
  onStreamCreated?: BubblingEventHandler<StreamEvent> | null;
  onStreamDestroyed?: BubblingEventHandler<StreamEvent> | null;
  onAudioLevel?: BubblingEventHandler<number> | null;
  onAudioNetworkStats?: BubblingEventHandler<number> | null;
  onMuteForced?: BubblingEventHandler<EmptyEvent> | null;
  onRtcStatsReport?: BubblingEventHandler<PublisherRTCStatsReport[]> | null;
  onVideoDisableWarning?: BubblingEventHandler<EmptyEvent> | null;
  onVideoDisableWarningLifted?: BubblingEventHandler<EmptyEvent> | null;
  onVideoEnabled?: BubblingEventHandler<EmptyEvent> | null;
  onVideoNetworkStats?: BubblingEventHandler<
    PublisherVideoNetworkStats[]
  > | null;
}

export default codegenNativeComponent<NativeProps>(
  'OTPublisherViewNative'
) as HostComponent<NativeProps>;
