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

type PublisherRTCStatsReport = {
  connectionId: string;
  jsonArrayOfReports: string;
};

/* TO-DO -- arrays are not supported in CodeGen event property types
type PublisherRTCStatsReportEvent = {
  reports: PublisherRTCStatsReport[];
};
*/

export interface NativeProps extends ViewProps {
  sessionId: string;
  publisherId: string;
  publishAudio?: boolean;
  publishVideo?: boolean;
  onError?: BubblingEventHandler<ErrorEvent> | null;
  onStreamCreated?: BubblingEventHandler<StreamEvent> | null;
  onRtcStatsReport?: BubblingEventHandler<PublisherRTCStatsReport> | null;
}

export default codegenNativeComponent<NativeProps>(
  'OTPublisherViewNative'
) as HostComponent<NativeProps>;
