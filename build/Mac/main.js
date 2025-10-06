// included by index.html
if (!window.Application.FileSystem.Exists(wps.Env.GetHomePath() + `/.kingsoft/wps/jsaddons/Zotero-Jsa_1.0.0/Zotero-Jsa.dotm`)) {
        alert("Zotero-wps核心文件丢失，请卸载插件，重新安装！！")
        
    }
path = wps.Env.GetHomePath() + `/.kingsoft/wps/jsaddons/Zotero-Jsa_1.0.0/Zotero-Jsa.dotm`
Application.AddIns.Add(path, true)
Application.AddIns.Item("Zotero-Jsa.dotm").Installed = true
document.write("<script language='javascript' src='js/ribbon.js'></script>");
document.write("<script language='javascript' src='js/util.js'></script>");
document.write("<script language='javascript' src='version.js'></script>");
document.write("<script language='javascript' src='js/wpsApp.js'></script>");
document.write("<script language='javascript' src='js/JSA.js'></script>");
document.write("<script language='javascript' src='js/zoteroHelper.js'></script>");
document.write("<script language='javascript' src='js/zoteroSet.js'></script>");
