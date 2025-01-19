const winPath= wps.Env.GetAppDataPath() + `/kingsoft/wps/jsaddons/wps-zotero_1.0.0` ;


const linuxPath=wps.Env.GetHomePath() + `/.local/share/Kingsoft/wps/jsaddons/wps-zotero_1.0.0`;

const macPath=wps.Env.GetHomePath() + `/.kingsoft/wps/jsaddons/wps-zotero_1.0.0`;

//系统检测
function detectOS() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Windows") !== -1) {
        runServers("runProxy",winPath,"/proxy.exe",'jsHide');
        if(window.Application.FileSystem.Exists('C:/Program Files/Zotero')){
            runZotero();
        }
       
        return ;
    } else if (userAgent.indexOf("Linux") !== -1) {
        runServers("runPY",linuxPath,"/runPY.sh",'jsHide')
        return ;
    }  
  const wpsVersion = compareVersions(wps.Application.Build.split('.').map(Number))

  if(!wpsVersion){
    alert("您的wps版本低于插件的最低运行要求，请更新wps到最新版本！")
    return;
  }
   
  
    runServers("runPY","open  "+macPath,"/proxy.app",'jsHide');
    //wps.OAAssist.ShellExecute('open '+macPath+'/proxy.app')
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
function compareVersions(version){
    const nowVersion=version;
    const tmpVersion=[6,15]
    if(nowVersion[0]>tmpVersion[0]){
     return true;
    }else if(nowVersion[0]===tmpVersion[0]){
        return nowVersion[1]>=tmpVersion[1]
    }
    return false;
} 