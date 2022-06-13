window.configData = {
    eIDLinkMinimumVersion: "2.3",
    eIDLinkExtensionUrls: {
        chrome: "https://chrome.google.com/webstore/detail/beidconnect/pencgnkbgaekikmiahiaakjdgaibiipp",
        edge:   "https://chrome.google.com/webstore/detail/beidconnect/pencgnkbgaekikmiahiaakjdgaibiipp",
        firefox: "https://eid.static.bosa.fgov.be/beidconnect-fx.xpi",
        safari: "https://eid.static.bosa.fgov.be/BeIDConnect%20Extension.dmg",
        IE: "https://eid.static.bosa.fgov.be/beidconnect.msi"
    },

    eIDLinkUrls: {
        windows: {
            en : "https://eid.static.bosa.fgov.be/beidconnect.msi",
            de : "https://eid.static.bosa.fgov.be/beidconnect.msi",
            nl : "https://eid.static.bosa.fgov.be/beidconnect_nl.msi",
            fr : "https://eid.static.bosa.fgov.be/beidconnect_fr.msi",
        },
        macOs: "https://eid.static.bosa.fgov.be/beidconnect.dmg",
        linux: {
            debian: {
                url: "https://eid.static.bosa.fgov.be/beidconnect-archive.deb",
                distributions: [
                    'Debian 9 "Stretch"',
                    'Debian 10 "Buster"',
                    'Ubuntu 18.04 LTS "Bionic Beaver"',
                    'Ubuntu 20.04 LTS',
                ]
            },
            fedora: {
                url: "https://eid.static.bosa.fgov.be/beidconnect-archive-fedora.rpm",
                distributions: [
                    'Fedora 31',
                    'Fedora 32'
                ]
            },
            redHat: {
                url: "https://eid.static.bosa.fgov.be/beidconnect-archive-el.rpm",
                distributions:  [
                    'Red Hat Enterprise Linux 7 "Maipo"',
                    'Red Hat Enterprise Linux 8 "Ootpa"',
                    'Similar distributions, such as CentOS'
                ]
            }
            ,
            openSUSE: {
                url: "https://eid.static.bosa.fgov.be/beidconnect-archive-suse.rpm",
                distributions: [
                    'OpenSUSE Leap 15.0',
                    'OpenSUSE Leap 15.1'
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

    //BEurl: "https://validate.ta.fts.bosa.belgium.be/signandvalidation",
    //BEurl: "http://localhost:8751",
    BEurl: "http://localhost:8080",
    skipCertificateChainValidate : true
    
};
