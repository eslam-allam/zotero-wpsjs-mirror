async function onbuttonclick(idStr) {
    const osInfo = detectOS();
    switch (idStr) {

        case "updateZotero": {

            window.Application.ShowDialog(GetUrlPath() + "/Update.html", "更新", 520 * window.devicePixelRatio, 650 * window.devicePixelRatio, false, true)

            break;
        }
        case "backZotero": {
            const conValue = window.Application.confirm("即将退回上一个版本，回退后不可撤销！！是否继续？")
            if (!conValue) {
                return; // 用户取消时直接退出
            }
            const osInfo = detectOS();
            const tutorial = getAddonPath(osInfo)
            const jsaddonsPath = getJsaddonsPath(osInfo)
            const backFile = jsaddonsPath + "/zoteroBack.tar.gz"
            if (osInfo == "windows") {
                if (window.Application.FileSystem.Exists(backFile)) {
                    const funBackStr = `Shell('cmd.exe /c " tar -xf ${backFile} -C ${jsaddonsPath}/wps-zotero_1.0.0 "', jsHide)`
                    runFun('backFile', funBackStr)
                    alert("版本回退成功！")
                    return
                }
            }else if(osInfo == "macos"){

            }

            alert("回退失败，备份文件丢失！！")
            break
        }
        case "uninstallZotero": {
            const conValue = window.Application.confirm("您即将卸载此插件！是否继续？")

            if (!conValue) {
                return; // 用户取消时直接退出
            }
            if (conValue) {

                if (osInfo == "windows") {
                    window.Application.ActiveDocument.Save()


   Application.AddIns.Item("Zotero-Jsa.dotm").Installed = false


                    runServers("uninstallZoteroAddin", wps.Env.GetAppDataPath() + '/kingsoft/wps/jsaddons/winUninstallJsa.exe', 'jsMaximizedFocus');
                    const tmpJson = window.Application.Env.GetTempPath() + "/settings.json"
                    if (window.Application.FileSystem.Exists(tmpJson)) {
                        window.Application.FileSystem.Remove(tmpJson)
                    }
                    window.Application.Quit(-1)

                    alert("卸载成功！")
                    return;
                } else if (osInfo == "macos") {
                    window.Application.ActiveDocument.Save()


                    runServers("uninstallZoteroAdd", 'open ' + wps.Env.GetHomePath() + '/.kingsoft/wps/jsaddons/macUninstall.app', 'jsMaximizedFocus');
                    const tmpJson = window.Application.Env.GetTempPath() + "/settings.json"
                    if (window.Application.FileSystem.Exists(tmpJson)) {
                        window.Application.FileSystem.Remove(tmpJson)
                    }
                    window.Application.Quit(-1)

                    alert("卸载成功！")
                    return;
                }

            }

        }
        default:

    }
    return true;
}