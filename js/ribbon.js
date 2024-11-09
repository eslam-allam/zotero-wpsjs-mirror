// Shouldn't be needing this if using the latest version of WPS
const WPS_Enum = {
    msoCTPDockPositionLeft: 0,
    msoCTPDockPositionRight: 2,
    msoPropertyTypeString: 4,
    wdAlignParagraphJustify: 3,
    wdAlignTabLeft: 0,
    wdCharacter: 1,
    wdCollapseEnd: 0,
    wdCollapseStart: 1,
    wdFieldAddin: 81,
    wdLineBreak: 6,
    wdParagraph: 4
};

function zc_alert(msg) {
    alert(`WPS-Zotero: ${msg}`);
};

/**
 * Callback for plugin loading.
**/
function OnAddinLoad(ribbonUI) {
    if (typeof (wps.Enum) !== "object") {
        wps.Enum = WPS_Enum;
        zc_alert('You are using an old version of WPS, this plugin might not work properly!');
    }
    if (typeof (wps.ribbonUI) !== "object") {
        wps.ribbonUI = ribbonUI;
    }

    if (window.Application.JSIDE == null) {

        alert("Zotero加载项需要您授权\n请依次打开菜单栏的  工具--->宏安全性--->可靠发行商--->勾选 '信任对于wpsjs项目的访问',重启wps即可!")
          
    } 
     //系统检测
    detectOS()
   
    // Exit the proxy server when the application quits.
    Application.ApiEvent.AddApiEventListener("ApplicationQuit", () => {
     
        postRequestXHR('http://127.0.0.1:21931/stopproxy', null);


    });


    return true;
}

/**
 * Callback for button clicking events.
**/
function OnAction(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnAddEditCitation":

        checkAndRunZotero()//给予zotero焦点
   
        zc_bind().command('addEditCitation');
                    // IMPORTANT: Release references on the document objects!!!
        zc_clearRegistry();

               
            break;
        case "btnAddEditBib":
            checkAndRunZotero()//给予zotero焦点
            zc_bind().command('addEditBibliography');
            zc_clearRegistry();
            break;
        case "btnRefresh":
            checkAndRunZotero()//给予zotero焦点
            zc_bind().import();
            // Must open a new client, since import will not register fields to zc_bind().
            zc_bind().command('refresh');
            zc_clearRegistry();
            break;
        case "btnPref":
            checkAndRunZotero()//给予zotero焦点
            zc_bind().command('setDocPrefs');
            zc_clearRegistry();
            break;
        case "btnExport":
            checkAndRunZotero()//给予zotero焦点
            if (confirm('Convert this document to a format for other word processors to import from? You may want to make a backup first.')) {
                zc_bind().export();
            }
            break;
        case "btnUnlink":
            checkAndRunZotero()//给予zotero焦点
            zc_bind().command('removeCodes');
            zc_clearRegistry();
            break;
        case "btnAddNote":
            checkAndRunZotero()//给予zotero焦点
            zc_bind().command('addNote');
            zc_clearRegistry();
            break;
            case "btnAbout":
                alert(`WPS-Zotero 当前分支版本(${VERSION})由 初心不忘 提供支持\n\n原作：This add-on is licensed under GPL-3.0: <http://www.gnu.org/licenses/>, it comes with no warranty.\n\nAuthor: Tang, Kewei\nhttps://github.com/tankwyn/WPS-Zotero`);
            default:
    }
    return true;
}

function GetImage(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnAddEditCitation":
            return "images/addEditCitation.svg";
        case "btnAddEditBib":
            return "images/addEditBib.svg";
        case "btnRefresh":
            return "images/refresh.svg";
        case "btnPref":
            return "images/pref.svg";
        case "btnAddNote":
            return "images/addNote.svg";
        case "btnUnlink":
            return "images/unlink.svg";
        case "btnExport":
            return "images/export.svg";
        default:
            break;
    }
    return "images/default.svg";
}

