#import <UIKit/UIKit.h>
#import <OpentokReactNative/ComponentDescriptors.h>
#import <OpentokReactNative/EventEmitters.h>
#import <OpentokReactNative/Props.h>
#import <OpentokReactNative/RCTComponentViewHelpers.h>

#import <Foundation/Foundation.h>
#import <OpentokReactNative/RNOpentokReactNativeSpec.h>
#import <OpentokReactNative-Swift.h> 

//#import <OpentokReactNative/ShadowNodes.h>

#import <React/RCTConversions.h>
#import <React/RCTViewComponentView.h>




using namespace facebook::react;

@interface OTPublisherViewNativeComponentView : RCTViewComponentView <RCTOTPublisherViewNativeViewProtocol>
@end

@implementation OTPublisherViewNativeComponentView {
    OTPublisherViewNativeImpl *_impl;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<OTPublisherViewNativeComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const OTPublisherViewNativeProps>();
        _props = defaultProps;
        
        _view = [[UIView alloc] init];
        self.contentView = _view;
        
        // Initialize the Swift implementation
        _impl = [[OTPublisherViewNativeImpl alloc] initWithView:_view componentView:self];
    }
    return self;
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<const OTPublisherViewNativeProps>(_props);
    const auto &newViewProps = *std::static_pointer_cast<const OTPublisherViewNativeProps>(props);

    if (oldViewProps.sessionId != newViewProps.sessionId) {
        [_impl setSessionId:RCTNSStringFromString(newViewProps.sessionId)];
    }
    
    if (oldViewProps.publisherId != newViewProps.publisherId) {
        [_impl setPublisherId:RCTNSStringFromString(newViewProps.publisherId)];
    }
    
    if (oldViewProps.publishAudio != newViewProps.publishAudio) {
        [_impl setPublishAudio:newViewProps.publishAudio];
    }
    
    if (oldViewProps.publishVideo != newViewProps.publishVideo) {
        [_impl setPublishVideo:newViewProps.publishVideo];
    }

    [super updateProps:props oldProps:oldProps];
}

- (void)handleStreamCreated:(NSString *)streamId
{
   // Get the event emitter
   auto const &eventEmitter = *std::static_pointer_cast<const OTPublisherViewNativeEventEmitter>(_eventEmitter);
   
   // Create and emit the event
   OTPublisherViewNativeEventEmitter::OnStreamCreated event = {
       .streamId = RCTStringFromNSString(streamId)
   };
   eventEmitter.onStreamCreated(event);
}

- (void)handleError:(NSString *)code message:(NSString *)message
{
   // Get the event emitter
   auto const &eventEmitter = *std::static_pointer_cast<const OTPublisherViewNativeEventEmitter>(_eventEmitter);
   
   // Create and emit the event
   OTPublisherViewNativeEventEmitter::OnError event = {
       .code = RCTStringFromNSString(code),
       .message = RCTStringFromNSString(message)
   };
   eventEmitter.onError(event);
}

@end

Class<RCTComponentViewProtocol> OTPublisherViewNativeCls(void)
{
    return OTPublisherViewNativeComponentView.class;
}
