import type { HostComponent, ViewProps } from 'react-native';
import type { BubblingEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type VideoSource = 'screen' | 'camera';

interface Stream {
  name: string;
  streamId: string;
  hasAudio: boolean;
  hasCaptions: boolean;
  hasVideo: boolean;
  sessionId: string;
  connectionId: string;
  width: number;
  height: number;
  videoType: VideoSource;
  connection: Connection;
  creationTime: string;
}

interface Connection {
  creationTime: string;
  data: string;
  connectionId: string;
}

interface StreamCreatedEvent extends Stream {}

interface StreamDestroyedEvent extends Stream {}

interface ErrorEvent {
  code: string;
  message: string;
}

type PublisherRtcStatsReportEvent = Array<{
  connectionId: string;
  jsonArrayOfReports: string;
}>;

export interface NativeProps extends ViewProps {
  sessionId: string;
  publishAudio?: boolean;
  publishVideo?: boolean;
  onStreamCreated?: BubblingEventHandler<StreamCreatedEvent> | null;
  onStreamDestroyed?: BubblingEventHandler<StreamDestroyedEvent> | null;
  onError?: BubblingEventHandler<ErrorEvent> | null;
  onRtcStatsReport?: BubblingEventHandler<PublisherRtcStatsReportEvent> | null;
}

export default codegenNativeComponent<NativeProps>(
  'OTPublisherViewNative'
) as HostComponent<NativeProps>;
