import type {HostComponent, ViewProps} from 'react-native';
import type {BubblingEventHandler} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type Connection = {
  creationTime: string;
  data: string;
  connectionId: string;
}

type StreamEvent = {
  streamId: string;
  hasAudio: boolean;
  hasCaptions: boolean;
  hasVideo: boolean;
  sessionId: string;
  connectionId: string;
  width: number;
  height: number;
  videoType: string;
  connection: Connection;
  creationTime: string;
};

type PublisherRtcStatsReport = {
  connectionId: string;
  jsonArrayOfReports: string;
}

type PublisherRTCStatsReportEvent = PublisherRtcStatsReport[];

type ErrorEvent = {
  code: string;
  message: string;
}

export interface NativeProps extends ViewProps {
    sessionId: string;
    streamId: string;
    publishAudio?: boolean;
    publishVideo?: boolean;
    onStreamCreated?: BubblingEventHandler<StreamEvent> | null;
    onStreamDestroyed?: BubblingEventHandler<StreamEvent> | null;
    onError?: BubblingEventHandler<ErrorEvent> | null;
    onRtcStatsReport?: BubblingEventHandler<PublisherRTCStatsReportEvent> | null;
}

export default codegenNativeComponent<NativeProps>(
  'OTPublisherViewNative',
) as HostComponent<NativeProps>;
