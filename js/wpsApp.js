const winPath= wps.Env.GetAppDataPath() + `/kingsoft/wps/jsaddons/wps-zotero_${VERSION}` ;


const linuxPath=wps.Env.GetHomePath() + `/.local/share/Kingsoft/wps/jsaddons/wps-zotero_${VERSION}`;


//系统检测
function detectOS() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Windows") !== -1) {
        runServers("runProxy",winPath,"/proxy.exe",'jsHide');
        runZotero();
        return ;
    } else if (userAgent.indexOf("Linux") !== -1) {
        runServers("runPY",linuxPath,"/runPY.sh",'jsHide')
        return ;
    }  
};
//运行zotero
function runZotero(){
    runServers("runZotero",'C:/Program Files/Zotero','/zotero.exe','jsMaximizedFocus');
    window.Application.PluginStorage.setItem("runZotero", true);
}
//给予zotero焦点
function checkAndRunZotero() {
    if (window.Application.PluginStorage.getItem("runZotero")) {
        runZotero();
    }
}