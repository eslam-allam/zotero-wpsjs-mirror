

/**
 * 
 * @param {*} osInfo 系统标识
 * @returns 无
 */
function runProxy(osInfo){
    const addonPath=getAddonPath(osInfo)
    if (osInfo== "windows") {
        
        runServers("runProxy", addonPath+'/proxy.exe', 'jsHide');
       
        return;
        
    } else if (osInfo== "linux") {
        runServers("runProxy", addonPath+'/runPY.sh', 'jsHide');
       
        return;
       
    }  

    runServers("runProxy", 'open '+addonPath+'/proxy.app', 'jsHide');
        return;
}
/**
 * 
 * @param {*} osInfo 系统标识
 * @param {*} zoteroPath zotero路径
 * @returns 无
 */
function runZotero(osInfo,zoteroPath) {
   //console.log(JSON.stringify(settingsJson)) 

   const zoteroPathValue=zoteroPath
  
   //console.log("zoteroPath.osInfo的值"+settingsJson.zoteroPath[osInfo])
   // 检查路径是否为空
   if (!zoteroPathValue || zoteroPathValue.trim() === "") {
    alert("启动zotero失败，zotero路径不可以为空！")
    return;
    }   
    if (osInfo == "macos") {
        runServers("runZotero", 'open '+zoteroPathValue,'jsMaximizedFocus');
        return;
    } 
        runServers("runZotero", zoteroPathValue+'', 'jsMaximizedFocus');
     
   return; 

}
/**
 * 首次获取样式管理器焦点
 */
function checkAndRunZotero() {
    const os=window.localStorage.getItem("osPlatform")
    if (os!=="windows") {
        return;
    }
    let settingsJson=getSettingsJson(os);
    const zoteroSwitchValue=settingsJson.zoteroPath[os];
   
        runZotero(os,zoteroSwitchValue);
    
}