
@interface OTPublisherViewNativeComponentView : UIView
- (void)handleStreamCreated:(NSDictionary *)eventData;
- (void)handleStreamDestroyed:(NSDictionary *)eventData;
- (void)handleError:(NSDictionary *)eventData;
- (void)handleAudioLevel:(NSDictionary *)eventData;
- (void)handleAudioNetworkStats:(NSString *)jsonString;
- (void)handleVideoNetworkStats:(NSString *)jsonString;
@end
