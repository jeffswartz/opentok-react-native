  
@interface OTPublisherViewNativeComponentView : UIView
- (void)handleStreamCreated:(NSDictionary *)eventData;
- (void)handleStreamDestroyed:(NSDictionary *)eventData;
- (void)handleError:(NSDictionary *)eventData;
@end







