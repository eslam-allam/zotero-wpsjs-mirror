async function onbuttonclick(idStr)
{
    const osInfo = detectOS();
    switch(idStr)
    {
        
        case "updateZotero":{

            wps.TabPages.OpenWebUrl("https://gitee.com/wangrui5015/Zotero-WPSJS");
            
                break;
            }
            case "uninstallZotero":{
                const conValue=window.Application.confirm("您即将卸载此插件！是否继续？")
            
                if (!conValue) {
                    return; // 用户取消时直接退出
                }
                if(conValue){

                    if(osInfo=="windows"){
                       
                        
                        runServers("uninstallZoteroAddin",wps.Env.GetAppDataPath() + '/kingsoft/wps/jsaddons/Uninstall.py','jsMaximizedFocus');
                         const tmpJson=window.Application.Env.GetTempPath()+"/settings.json"
                         if(window.Application.FileSystem.Exists(tmpJson)){
                            window.Application.FileSystem.Remove(tmpJson)
                         }
                        window.Application.Quit(-1)
                       
                        alert("卸载成功！")
                        return;
                    }else if(osInfo=="macos"){
                        window.Application.ActiveDocument.Save()
                        runServers("uninstallZoteroAdd",'open '+ wps.Env.GetHomePath() + '/.kingsoft/wps/jsaddons/macUninstall.app','jsMaximizedFocus');
                        const tmpJson=window.Application.Env.GetTempPath()+"/settings.json"
                        if(window.Application.FileSystem.Exists(tmpJson)){
                           window.Application.FileSystem.Remove(tmpJson)
                        }
                        window.Application.Quit(0)
                     
                        alert("卸载成功！")
                        return;
                    }

                }
           
                }
                default:
   
    }
    return true;
}