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
    const osInfo = detectOS();
    //console.log("系统信息：" + osInfo)
    let settingsJson = getSettingsJson(osInfo);

    const addonpath = getAddonPath(osInfo)

    //console.log("配置文件" + settingsJson)
    const dotmPath = addonpath + `/Zotero-Jsa.dotm`
    if (!window.Application.FileSystem.Exists(dotmPath)) {
        alert("Zotero-wps核心文件丢失，请卸载插件，重新安装！！")

    }

    Application.AddIns.Add(dotmPath, true)
    Application.AddIns.Item("Zotero-Jsa.dotm").Installed = true
    if (settingsJson.zoteroSwitch) {
        const zoteroPathValue = settingsJson.zoteroPath[osInfo];
        runZotero(osInfo, zoteroPathValue);
    }
    if (settingsJson.citationPreview) {
        wps.ApiEvent.AddApiEventListener("WindowSelectionChange", () => {
            let unlinking = window.Application.PluginStorage.getItem("unlink")
            let footnotes = window.Application.PluginStorage.getItem("footnotes")
            if (unlinking || footnotes) {
                return
            }
            if (window.Application.Selection.Fields.Count == 0 && window.Application.ActiveDocument.Footnotes.Count == 0) {
                let cpId = window.Application.PluginStorage.getItem(window.Application.ActiveDocument.DocID + "");
                if (cpId) {
                    const res = Number(cpId)
                    window.Application.ActiveDocument.Fields.Item(res).Result.HighlightColorIndex = 0;
                }
                return
            }

            if (window.Application.Selection.Fields.Count >= 1) {

                const tl = window.Application.ActiveDocument.ActiveWindow.GetPoint(window.Application.Selection.Range)

                let myRange = window.Application.Selection.Fields.Item(1).Code.Text
                const hasCitation = myRange.includes('ADDIN ZOTERO_ITEM CSL_CITATION');
                if (hasCitation) {
                    if (!settingsJson.mouseFollow) {
                        citationPreviewUi(GetUrlPath() + "/ui/CitationPreview.html", "citationPreview", "引注预览")

                        return
                    }
                    const topFlag = window.Application.PluginStorage.getItem("topTo")
                    if (topFlag) {
                        return
                    }
                    window.Application.ShowDialogEx(GetUrlPath() + "/ui/CitationPreviewMouse.html", "引注预览", 400 * window.devicePixelRatio, 380 * window.devicePixelRatio, false, false, false, true, true, false, true, (tl.ScreenPixelsLeft - 10) * window.devicePixelRatio, (tl.ScreenPixelsTop - 30) * window.devicePixelRatio)

                }

            }

        });



    }

    //文档关闭检测
    wps.ApiEvent.AddApiEventListener("DocumentBeforeClose", () => {

        if (window.Application.PluginStorage.getItem("btnClick")) {
            alert("当前文档无法关闭:zotero正在操作，请点击zotero完成相关操作！！")
            window.Application.ApiEvent.Cancel = true
        }


    });

    return true;
}
/**
 * Callback for button clicking events.
 */
function OnAction(control) {
    const actionMap = {
        "btnAddEditCitation": () => executeWithLock(() => {
            checkAndRunZotero();
            Application.Run("btnEditCitation");
        }),
        "btnAddEditBib": () => executeWithLock(() => Application.Run("btnEditBibliography")),
        "btnRefresh": () => executeWithLock(() => Application.Run("btnRefresh")),
        "btnPref": () => executeWithLock(() => Application.Run("btnSetDocPrefs")),
        "btnCitationHyperlinks": () => executeWithLock(() => bindCitationsToBookmarks()),
        "btnUnlink": () => executeWithLock(() => Application.Run("btnUnlink")),
        "btnAddNote": () => executeWithLock(() => Application.Run("btnInsertNote")),
        "btnDonate": () => {
            window.Application.ShowDialog(
                GetUrlPath() + "/ui/Donate.html",
                "捐赠",
                700 * window.devicePixelRatio,
                640 * window.devicePixelRatio,
                true,
                true
            );
        }
    };

    const action = actionMap[control.Id];
    if (action) {
        action();
        return true;
    }

    return false;
}

/**
 * 使用锁机制执行操作，防止重复点击
 */
function executeWithLock(operation) {
    if (window.Application.PluginStorage.getItem("btnClick")) {
        alert("正在操作zotero，请点击zotero完成操作！！");
        return;
    }

    try {
        window.Application.PluginStorage.setItem("btnClick", true);
        operation();
    } finally {
        window.Application.PluginStorage.setItem("btnClick", false);
    }
}

function GetImage(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnAddEditCitation":
            return "images/addEditCitation.png";
        case "btnAddEditBib":
            return "images/addEditBib.png";
        case "btnRefresh":
            return "images/refresh.svg";
        case "btnPref":
            return "images/pref.png";
        case "btnAddNote":
            return "images/addNote.png";
        case "btnUnlink":
            return "images/unlink.svg";
        case "btnCitationHyperlinks":
            return "images/Hyperlinks.png";
        case "btnDonate":
            return "images/Donate.png";
        case "btnAbout":
            return "images/about.png";
        case "btnZoteroSet":
            return "images/zoteroSet.png";
        case "menu1":
            return "images/DeepSeek.png";
        case "yuanbaoItem":
            return "images/yuanbao.png";
        case "baiduaiItem":
            return "images/baiduai.png";
        case "deepseekItem":
            return "images/DeepSeek.png";
        case "chatGPTItem":
            return "images/chatgpt.png";
        case "zhipuItem":
            return "images/zhipu.png";
        case "tongyiItem":
            return "images/tongyi.png";
        case "doubaoItem":
            return "images/doubao.png";
        case "kimiItem":
            return "images/kimi.png";
        case "menu2":
            return "images/Settings.png";
        default:
            break;
    }
    return "images/default.svg";
}



function dropDownOnAction(selectedId) {
    const eleId = selectedId.Id
    switch (eleId) {
        case "yuanbaoItem":
            handAi("https://yuanbao.tencent.com/", "yuanbao")
            break;
        case "baiduaiItem":
            handAi("https://chat.baidu.com/", "baiduai")
            break;
        case "deepseekItem":
            handAi("https://chat.deepseek.com/", "DeepSeek")
            break;
        case "chatGPTItem":
            handAi("https://chatgpt.com/", "ChatGPT")
            break;
        case "zhipuItem":
            handAi("https://chatglm.cn/", "zhipuqingyan")
            break;
        case "tongyiItem":
            handAi("https://tongyi.aliyun.com/qianwen/", "tongyi")
            break;
        case "doubaoItem":
            handAi("https://www.doubao.com/chat/", "doubao")
            break;
        case "kimiItem":
            handAi("https://kimi.moonshot.cn//", "Kimi")


        default:
    }
    return true;
}
function SettingsOnAction(selectedId) {
    const eleId = selectedId.Id
    switch (eleId) {
        case "btnAbout":
            window.Application.ShowDialog(GetUrlPath() + "/ui/About.html", "关于", 600 * window.devicePixelRatio, 480 * window.devicePixelRatio, false, true)
            break;
        case "btnZoteroSet":
            window.Application.ShowDialog(GetUrlPath() + "/ui/ZoteroSet.html", "Zotero设置", 500 * window.devicePixelRatio, 450 * window.devicePixelRatio, false, true)
            break;


        default:
    }
    return true;
}