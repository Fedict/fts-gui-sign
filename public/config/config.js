window.configData = {
    eIDLinkMinimumVersion: "2.6",
    eIDLinkExtensionUrls: {
        chrome: "https://chrome.google.com/webstore/detail/beidconnect/pencgnkbgaekikmiahiaakjdgaibiipp",
        edge:   "https://microsoftedge.microsoft.com/addons/detail/beidconnect/cjhdnjahbjhicmbmejmcifaaiigbgjjd",
        firefox: "https://eid.static.bosa.fgov.be/beidconnect-fx-0.0.11.xpi",
        safari: "https://eid.static.bosa.fgov.be/BeIDConnect_Extension_2.7.dmg",
        IE: "https://eid.static.bosa.fgov.be/beidconnect_2.7.msi"
    },

    eIDLinkUrls: {
        windows: {
            en : "https://eid.static.bosa.fgov.be/beidconnect_2.7.msi",
            de : "https://eid.static.bosa.fgov.be/beidconnect_2.7_de.msi",
            nl : "https://eid.static.bosa.fgov.be/beidconnect_2.7_nl.msi",
            fr : "https://eid.static.bosa.fgov.be/beidconnect_2.7_fr.msi",
        },
        windowsX64: {
            en : "https://eid.static.bosa.fgov.be/beidconnect_x64_2.7.msi",
            de : "https://eid.static.bosa.fgov.be/beidconnect_x64_2.7_de.msi",
            nl : "https://eid.static.bosa.fgov.be/beidconnect_x64_2.7_nl.msi",
            fr : "https://eid.static.bosa.fgov.be/beidconnect_x64_2.7_fr.msi",
        },
        windowsAdmin: {
            en : "https://eid.static.bosa.fgov.be/beidconnect_admin_2.7.msi",
        },
        macOs: "https://eid.static.bosa.fgov.be/beidconnect_2.7.dmg",
        linux: {
            debian: {
                url: "https://eid.static.bosa.fgov.be/beidconnect-archive.deb",
                distributions: [
                    'Debian 9 "Stretch"',
                    'Debian 10 "Buster"',
                    'Debian 11 "Bullseye"',
                    'Ubuntu 18.04 LTS "Bionic Beaver"',
                    'Ubuntu 20.04 LTS "Focal Fossa"',
                    'Ubuntu 22.04 LTS "Jammy Jellyfish"',
                ]
            },
            fedora: {
                url: "https://eid.static.bosa.fgov.be/beidconnect-archive-fedora.rpm",
                distributions: [
                    'Fedora 35',
                    'Fedora 36'
                ]
            },
            centos: {
                url: "https://eid.static.bosa.fgov.be/beidconnect-archive-el.rpm",
                distributions: [
                    'CentOS 7',
                    'CentOS Stream 9'
                ]
            },
        }
    },

    defaultSigningProfileId: "XADES_LTA",
    signingProfileIds: {
        "application/pdf":"PADES_LTA" ,
        "application/xml": "XADES_LTA",
        "text/xml": "XADES_LTA"
    },

    mxaxUploadSize: 10*1024*1024,

    //BEurl: "https://validate.ta.fts.bosa.belgium.be/signandvalidation",
    BEurl: "http://localhost:8751",
    
    // Local settings
    CSP: "default-src 'self'; connect-src blob: 'self' http://localhost:8751  http://localhost:8081 http://localhost:3000; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline' http://localhost:3000; object-src 'self' blob: data: http://localhost:8751; frame-src 'self' blob: data: http://localhost:8751;",

    // "TA" settings
    //CSP: "default-src 'self'; connect-src 'self' https://*.ta.fts.bosa.belgium.be; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline' https://*.ta.fts.bosa.belgium.be; object-src 'self' blob: data: https://*.ta.fts.bosa.belgium.be; frame-src 'self' blob: data: https://*.ta.fts.bosa.belgium.be;",

    skipCertificateChainValidate : false,
    
    // Where landing on "/" will be redirected
    redirectSigning: null,
    
    minBrowserVersions: {
        "FIREFOX" : 128,
        "EDGE": 0,
        "CHROMIUMEDGE": 0,
        "CHROME": 0,
        "SAFARI": 0,
        "OPERA": 0
    }
};
