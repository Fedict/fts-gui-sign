window.configData = {
    eIDLinkMinimumVersion: "2.6",
    eIDLinkExtensionUrls: {
        chrome: "https://chrome.google.com/webstore/detail/beidconnect/pencgnkbgaekikmiahiaakjdgaibiipp",
        edge:   "https://chrome.google.com/webstore/detail/beidconnect/pencgnkbgaekikmiahiaakjdgaibiipp",
        firefox: "https://eid.static.bosa.fgov.be/beidconnect-fx-0.0.11.xpi",
        safari: "https://eid.static.bosa.fgov.be/BeIDConnect_Extension_2.6.dmg",
        IE: "https://eid.static.bosa.fgov.be/beidconnect_2.6.msi"
    },

    eIDLinkUrls: {
        windows: {
            en : "https://eid.static.bosa.fgov.be/beidconnect_2.6.msi",
            de : "https://eid.static.bosa.fgov.be/beidconnect_2.6_de.msi",
            nl : "https://eid.static.bosa.fgov.be/beidconnect_2.6_nl.msi",
            fr : "https://eid.static.bosa.fgov.be/beidconnect_2.6_fr.msi",
        },
        windowsX64: {
            en : "https://eid.static.bosa.fgov.be/beidconnect_x64_2.6.msi",
            de : "https://eid.static.bosa.fgov.be/beidconnect_x64_2.6_de.msi",
            nl : "https://eid.static.bosa.fgov.be/beidconnect_x64_2.6_nl.msi",
            fr : "https://eid.static.bosa.fgov.be/beidconnect_x64_2.6_fr.msi",
        },
        macOs: "https://eid.static.bosa.fgov.be/beidconnect_2.6.dmg",
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

    defaultSigningProfileId: "CADES_LTA", /* CADES_1*/
    signingProfileIds: {
        "application/pdf":"PADES_LTA" , /*"PADES_1", */
        "application/xml": "XADES_LTA",  /*"XADES_1",*/
        "text/xml": "XADES_LTA" /*XADES_1*/
    },

    BEurl: "https://validate.ta.fts.bosa.belgium.be/signandvalidation",
    //BEurl: "http://localhost:8751",
    //BEurl: "http://localhost:8080",
    skipCertificateChainValidate : true
    
};
