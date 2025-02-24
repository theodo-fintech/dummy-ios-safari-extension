//
//  SafariWebExtensionHandler.swift
//  dummy-extension
//
//  Created by Mahdi Lazraq on 13/02/2025.
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let profile: UUID?
        if #available(iOS 17.0, macOS 14.0, *) {
            profile = request?.userInfo?[SFExtensionProfileKey] as? UUID
        } else {
            profile = request?.userInfo?["profile"] as? UUID
        }

        let messageAny: Any?
        if #available(iOS 15.0, macOS 11.0, *) {
            messageAny = request?.userInfo?[SFExtensionMessageKey]
        } else {
            messageAny = request?.userInfo?["message"]
        }

        os_log(.default, "Received message: %@ (profile: %@)",
               String(describing: messageAny),
               profile?.uuidString ?? "none")

        var responseMessage = SafariMessage(type: .unknown)
        if let dict = messageAny as? [String: Any] {
            let incoming = SafariMessage(from: dict)
            switch incoming.type {
            case .getUserInfo:
                responseMessage = SafariMessage(
                    type: .userInfoResponse,
                    data: [
                        "firstName": "John",
                        "lastName": "Doe"
                    ]
                )
            default:
                break
            }
        }

        let responseDict = responseMessage.toDictionary()

        let response = NSExtensionItem()
        if #available(iOS 15.0, macOS 11.0, *) {
            response.userInfo = [ SFExtensionMessageKey: responseDict ]
        } else {
            response.userInfo = [ "message": responseDict ]
        }
        
        context.completeRequest(returningItems: [response], completionHandler: nil)
    }
}
