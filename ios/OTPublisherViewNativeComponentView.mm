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

        _impl = [[OTPublisherViewNativeImpl alloc] initWithView:self];
        self.contentView = _impl.publisherView;
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


- (void)handleStreamCreated:(NSDictionary *)eventData
{
    if (_eventEmitter) {
        auto eventEmitter = std::static_pointer_cast<const OTPublisherViewNativeEventEmitter>(_eventEmitter);
        OTPublisherViewNativeEventEmitter::OnStreamCreated payload {
            .streamId = std::string([eventData[@"streamId"] UTF8String])
        };
        eventEmitter->onStreamCreated(std::move(payload));
    }
}

- (void)handleError:(NSDictionary *)eventData
{
    if (_eventEmitter) {
        auto eventEmitter = std::static_pointer_cast<const OTPublisherViewNativeEventEmitter>(_eventEmitter);
        OTPublisherViewNativeEventEmitter::OnError payload {
            .code = std::string([eventData[@"code"] UTF8String]),
            .message = std::string([eventData[@"message"] UTF8String])
        };
        eventEmitter->onError(std::move(payload));
    }
}

- (void)handleStreamDestroyed:(NSDictionary *)eventData
{
    if (_eventEmitter) {
        auto eventEmitter = std::static_pointer_cast<const OTPublisherViewNativeEventEmitter>(_eventEmitter);
        OTPublisherViewNativeEventEmitter::OnStreamDestroyed payload {
            .streamId = std::string([eventData[@"streamId"] UTF8String])
        };
        eventEmitter->onStreamDestroyed(std::move(payload));
    }
}
@end

Class<RCTComponentViewProtocol> OTPublisherViewNativeCls(void)
{
    return OTPublisherViewNativeComponentView.class;
}
