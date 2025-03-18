



@interface OTPublisherViewNativeComponentView : NSObject
- (void)handleStreamCreated:(NSString *)streamId;
- (void)handleError:(NSString *)code message:(NSString *)message;
@end



