//
//  SafariMessage.swift
//  dummy-app
//
//  Created by Mahdi Lazraq on 24/02/2025.
//

import Foundation

enum SafariMessageType: String {
    case getUserInfo = "GET_USER_INFO"
    case userInfoResponse = "USER_INFO_RESPONSE"
    case unknown = "UNKNOWN"
}

protocol SafariMessageProtocol {
    var type: SafariMessageType { get }
    var data: [String: Any] { get }
}

struct SafariMessage: SafariMessageProtocol {
    let type: SafariMessageType
    let data: [String: Any]

    init(type: SafariMessageType, data: [String: Any] = [:]) {
        self.type = type
        self.data = data
    }

    init(from dict: [String: Any]) {
        let rawType = dict["type"] as? String ?? ""
        self.type = SafariMessageType(rawValue: rawType) ?? .unknown
        self.data = dict["data"] as? [String: Any] ?? [:]
    }

    func toDictionary() -> [String: Any] {
        ["type": type.rawValue, "data": data]
    }
}
