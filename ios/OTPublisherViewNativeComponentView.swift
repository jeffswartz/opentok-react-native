import Foundation
import OpenTok

@objc public class OTPublisherViewNativeImpl: NSObject  {
    private var publisher: OTPublisher?
    private var view: UIView
    private weak var componentView: OTPublisherViewNativeComponentView?
    
    @objc public init(view: UIView, componentView: OTPublisherViewNativeComponentView) {
        self.view = view
        self.componentView = componentView
        super.init()
    }
    
    @objc public func setSessionId(_ sessionId: String) {
        guard let session = OTRN.sharedState.sessions[sessionId] else {
            handleError(code: "OTPublisher Error", message: "Session not found")
            return
        }
        
        // Clean up existing publisher if needed
        cleanupPublisher()
        
        // Setup will happen when publisherId is set
    }
    
    @objc public func setPublisherId(_ publisherId: String) {
        guard let session = OTRN.sharedState.sessions[publisherId] else { return }
        
        do {
            publisher = OTPublisher(delegate: nil)
            try session.publish(publisher!)
            
            if let pubView = publisher?.view {
                pubView.frame = view.bounds
                view.addSubview(pubView)
            }
            
            OTRN.sharedState.publishers[publisherId] = publisher
            
        } catch {
            handleError(code: "OTPublisher Error", message: error.localizedDescription)
        }
    }
    
    @objc public func setPublishAudio(_ publishAudio: Bool) {
        publisher?.publishAudio = publishAudio
    }
    
    @objc public func setPublishVideo(_ publishVideo: Bool) {
        publisher?.publishVideo = publishVideo
    }
    
    private func cleanupPublisher() {
        if let pub = publisher {
            pub.view?.removeFromSuperview()
            pub.delegate = nil
            publisher = nil
        }
    }
    
    private func handleError(code: String, message: String) {
        componentView?.handleError(code, message: message)
    }
    public func publisher(_ publisher: OTPublisherKit, streamCreated stream: OTStream) {
        componentView?.handleStreamCreated(stream.streamId)
    }
    
    public func publisher(_ publisher: OTPublisherKit, didFailWithError error: OTError) {
        handleError(code: String(error.code), message: error.localizedDescription)
    }
}

