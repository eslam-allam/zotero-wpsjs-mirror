function onbuttonclick(idStr)
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
                        window.Application.ActiveDocument.Save()
                  
                       
                        window.Application.ActiveDocument.Saved= true
                   
                        window.Application.Quit(-1)
                        runServers("uninstallZoteroAddin",wps.Env.GetAppDataPath() + '/kingsoft/wps/jsaddons/winUninstall.exe','jsMaximizedFocus');
                        alert("卸载成功！")
                        return;
                    }else if(osInfo=="macos"){
                        window.Application.ActiveDocument.Save()
                        window.Application.ActiveDocument.Saved= true
                      
                        window.Application.Quit(-1)
                        runServers("uninstallZoteroAdd",'open '+ wps.Env.GetHomePath() + '/.kingsoft/wps/jsaddons/macUninstall.app','jsMaximizedFocus');
                        alert("卸载成功！")
                        return;
                    }

                }
           
                }
                default:
   
    }
    return true;
}