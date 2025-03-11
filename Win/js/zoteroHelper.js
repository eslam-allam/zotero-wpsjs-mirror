

/**
 * 
 * @param {*} osInfo 系统标识
 * @returns 无
 */
function runProxy(osInfo){
    if (osInfo== "windows") {
        // console.log(`proxy.exe路径：${winPath}/proxy.exe`);
        runServers("runZotero", winPath+'/proxy.exe', 'jsMaximizedFocus');
       
        return;
        
    } else if (osInfo== "linux") {
        runServers("runZotero", linuxPath+'/runPY.sh', 'jsMaximizedFocus');
       
        return;
       
    }  

    runServers("runZotero", 'open '+macPath+'/proxy.app', 'jsMaximizedFocus');
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
    alert("zotero不可以为空！")
    return;
    }   
    if (osInfo == "macos") {
        runServers("runZotero", 'open '+zoteroPathValue,'jsMaximizedFocus');
        return;
    } 
    if (osInfo == "windows") {
        runServers("runZotero", zoteroPathValue.replace(/\\/g, '/')+'', 'jsMaximizedFocus');
        return;
    } else {
        runServers("runZotero", zoteroPathValue+'', 'jsMaximizedFocus');
    }
     
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
    const zoteroPath=settingsJson.zoteroPath[os];
   
        runZotero(os,zoteroPath);
    
}