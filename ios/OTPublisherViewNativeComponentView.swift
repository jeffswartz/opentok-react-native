import Foundation
import OpenTok

@objc public class OTPublisherViewNativeImpl: NSObject {
    private var publisher: OTPublisher?
    fileprivate weak var strictUIViewContainer: OTPublisherViewNativeComponentView?
    fileprivate var publisherDelegateHandler: PublisherDelegateHandler?
    fileprivate var publisherUIView: UIView?

   @objc public var publisherView: UIView {
       if let publisherUIView = publisherUIView {
           return publisherUIView
       }
        return UIView()
    }
    @objc public init(view: OTPublisherViewNativeComponentView) {
        self.strictUIViewContainer = view
        super.init()
        
        // Initialize publisher right away
        publisherDelegateHandler = PublisherDelegateHandler(impl: self)
        publisher = OTPublisher(delegate: publisherDelegateHandler)

        // Set publisher view as content view
        if let pubView = publisher?.view {
            pubView.frame = view.bounds
            publisherUIView = pubView
        }
    }
    
    @objc public func setSessionId(_ sessionId: String) {
        // TODO : do we allow to unpublish or will this ever change
    }
    
    @objc public func setPublisherId(_ publisherId: String) {
        // TODO : do we allow to unpublish or will this ever change
    }
    
    @objc public func setPublishAudio(_ publishAudio: Bool) {
        publisher?.publishAudio = publishAudio
    }
    
    @objc public func setPublishVideo(_ publishVideo: Bool) {
        publisher?.publishVideo = publishVideo
    }
    
    deinit {
        if let pub = publisher {
            pub.delegate = nil
            publisherDelegateHandler = nil
            publisher = nil
        }
       
    }
}

private class PublisherDelegateHandler: NSObject, OTPublisherDelegate {
    weak var impl: OTPublisherViewNativeImpl?
    
    init(impl: OTPublisherViewNativeImpl) {
        self.impl = impl
        super.init()
    }
    
    public func publisher(_ publisher: OTPublisherKit, streamCreated stream: OTStream) {
        impl?.strictUIViewContainer?.handleStreamCreated(["streamId": stream.streamId])
    }
    
    public func publisher(_ publisher: OTPublisherKit, didFailWithError error: OTError) {
        impl?.strictUIViewContainer?.handleError([
            "code": String(error.code),
            "message": error.localizedDescription
        ])
    }
    
    public func publisher(_ publisher: OTPublisherKit, streamDestroyed stream: OTStream) {
        impl?.strictUIViewContainer?.handleStreamDestroyed(["streamId": stream.streamId])
    }
}

