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
function runZotero(){
    var runzotero = "function runZotero(){ Shell('C:/Program Files/Zotero/zotero.exe',  jsMaximizedFocus) ;}"
    window.Application.JSIDE.SelectedJSComponent.CodeModule.InsertLines(1,runzotero) 
    window.Application.Run('runZotero')
   window.Application.JSIDE.SelectedJSComponent.CodeModule.DeleteLines(0, 1)
   window.Application.PluginStorage.setItem("runZotero", true)
};
function runPY(){
    var result = "function runPY(){ Shell('" + GLOBAL_MAP.instDir + "/proxy.exe',  jsHide) ;}"          
    window.Application.JSIDE.SelectedJSComponent.CodeModule.InsertLines(1,result) 
    window.Application.Run('runPY')
    window.Application.JSIDE.SelectedJSComponent.CodeModule.DeleteLines(0, 1)
  
};
function linux_runPY(){
    var result = "function linux_runPY(){ Shell('" + GLOBAL_MAP.instDir + "/runPY.sh',  jsHide) ;}"          
    window.Application.JSIDE.SelectedJSComponent.CodeModule.InsertLines(1,result) 
    window.Application.Run('linux_runPY')
    window.Application.JSIDE.SelectedJSComponent.CodeModule.DeleteLines(0, 1)
  
};

// Storing global variables
const GLOBAL_MAP = {};

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

    GLOBAL_MAP.isWin = Boolean(wps.Env.GetProgramDataPath());
    GLOBAL_MAP.osSep = GLOBAL_MAP.isWin ? '\\' : '/';
    GLOBAL_MAP.instDir = GLOBAL_MAP.isWin ?
        wps.Env.GetAppDataPath() + `/kingsoft/wps/jsaddons/wps-zotero_${VERSION}` :
        wps.Env.GetHomePath() + `/.local/share/Kingsoft/wps/jsaddons/wps-zotero_${VERSION}`;
    GLOBAL_MAP.proxyPath = GLOBAL_MAP.instDir + GLOBAL_MAP.osSep + 'runPY.sh';

    // Start http proxy server
    if (GLOBAL_MAP.isWin) {
        if (window.Application.JSIDE == null) {
            
            alert("Zotero加载项需要您授权\n请依次打开菜单栏的  工具--->宏安全性--->可靠发行商--->勾选 '信任对于wpsjs项目的访问',重启wps即可!")
          
        } 
            runPY()
        if (window.Application.FileSystem.Exists('C:/Program Files/Zotero/zotero.exe')) {

            runZotero()
              
        }
    }else{
        if (window.Application.JSIDE == null) {
         
            alert("Zotero加载项需要您授权\n请依次打开菜单栏的  工具--->宏安全性--->可靠发行商--->勾选 '信任对于wpsjs项目的访问',重启wps即可!")
          
        } 

        linux_runPY()

    }
   
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
          
        if( window.Application.PluginStorage.getItem("runZotero")){
            runZotero()

        }
   
        zc_bind().command('addEditCitation');
                    // IMPORTANT: Release references on the document objects!!!
        zc_clearRegistry();

               
            break;
        case "btnAddEditBib":
            if( window.Application.PluginStorage.getItem("runZotero")){
                runZotero()
    
            }
            zc_bind().command('addEditBibliography');
            zc_clearRegistry();
            break;
        case "btnRefresh":
            if( window.Application.PluginStorage.getItem("runZotero")){
                runZotero()
    
            }
            zc_bind().import();
            // Must open a new client, since import will not register fields to zc_bind().
            zc_bind().command('refresh');
            zc_clearRegistry();
            break;
        case "btnPref":
            if( window.Application.PluginStorage.getItem("runZotero")){
                runZotero()
    
            }
            zc_bind().command('setDocPrefs');
            zc_clearRegistry();
            break;
        case "btnExport":
            if( window.Application.PluginStorage.getItem("runZotero")){
                runZotero()
    
            }
            if (confirm('Convert this document to a format for other word processors to import from? You may want to make a backup first.')) {
                zc_bind().export();
            }
            break;
        case "btnUnlink":
            if( window.Application.PluginStorage.getItem("runZotero")){
                runZotero()
    
            }
            zc_bind().command('removeCodes');
            zc_clearRegistry();
            break;
        case "btnAddNote":
            if( window.Application.PluginStorage.getItem("runZotero")){
                runZotero()
    
            }
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

