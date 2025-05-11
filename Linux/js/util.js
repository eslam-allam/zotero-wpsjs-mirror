

function GetUrlPath() {
    let e = document.location.toString()
    return -1 != (e = decodeURI(e)).indexOf("/") && (e = e.substring(0, e.lastIndexOf("/"))), e
}
/**
 * 通过wps提供的接口执行一段脚本
 * @param {*} param 需要执行的脚本
 */
function shellExecuteByOAAssist(param) {
    if (wps != null) {
        wps.OAAssist.ShellExecute(param)
    }


}
/**
 * 
 * @param {*} osInfo 系统信息
 * @returns 返回插件所在路径
 */
function getAddonPath(osInfo) {
    const winPath = wps.Env.GetAppDataPath() + `/kingsoft/wps/jsaddons/wps-zotero_1.0.0`;


    const linuxPath = wps.Env.GetHomePath() + `/.local/share/Kingsoft/wps/jsaddons/wps-zotero_1.0.0`;

    const macPath = wps.Env.GetHomePath() + `/.kingsoft/wps/jsaddons/wps-zotero_1.0.0`;
    if (osInfo == "windows") {


        return winPath;

    } else if (osInfo == "linux") {

        return linuxPath;
    }

    return macPath;
}
/**
 * 
 * @param {*} osInfo 系统信息
 * @returns 配置文件json对象
 */
function getSettingsJson(osInfo) {
    try {
        const localString = window.localStorage.getItem("appConfig")
        if (localString) {

            return JSON.parse(localString)
        }
        const jsonPath = getAddonPath(osInfo) + '/settings.json'
        //console.log("json路径“："+jsonPath)
        if (!window.Application.FileSystem.Exists(jsonPath)) {
            alert("配置文件不存在！")
            return null;
        }

        //const tmpJson=window.Application.Env.GetTempPath()+"/settings.json"
        //console.log("开始读取配置文件，home路径为"+tmpJson)



        try {
            const res = window.Application.FileSystem.ReadFile(jsonPath)
            const jsonObject = JSON.parse(res)

            return jsonObject;

        } catch (error) {
            console.error("解析json出错，请检查json数据格！", error);
            return null;
        }



    } catch (error) {
        console.error("读取配置文件失败！", error);
        return null; // 返回 null 表示发生错误
    }
}
/**
 * 
 *
 * @param {*} updatedJsonString 需要更新的数据
 */
function setSettingsJson(updatedJsonString) {
    try {
        const jsonString = JSON.stringify(updatedJsonString);
        window.localStorage.setItem("appConfig", jsonString)

        //alert("更新数据为"+jsonString)
        // 写入文件
        const osInfo = detectOS();
        const addonPath = getAddonPath(osInfo)
        const tmpJson = addonPath + "/settings.json"
        console.log("json路径：" + tmpJson)
        window.Application.FileSystem.WriteFile(tmpJson, jsonString);

    } catch (error) {
        console.error("写入配置文件错误！", error);
    }


}function decodeMixedUnicodeSetText(str) {

    return str
       
        .replace(/\\uc0\\u(\d+)\{\}|\\u(\d+)\{\}/g, (_, g1, g2) => {
            const codePoint = g1 ? parseInt(g1, 10) : parseInt(g2, 10);
            return String.fromCodePoint(codePoint);
        })
        // 移除斜体标记 {\i{}...}
        .replace(/\{\\i{}(.*?)\}/g, '$1');
}

function decodeMixedUnicodeSetCode(str) {
      
      const pattern = /^ITEM CSL_CITATION\s+({.*})$/s; // 正则匹配完整结构
      if (!pattern.test(str)) {
          return str; // 不符合条件则不处理
      }
  
      // 提取 JSON 部分并解码
      const jsonPart = str.match(pattern)[1]; 
  
      // 递归解码函数
      const decodeRecursive = (data) => {
          if (typeof data === 'string') {
              return data
                  .replace(/\\uc0\\u(\d+)\{\}/g, (_, code) => {
                      return String.fromCodePoint(parseInt(code, 10));
                  })
                  .replace(/\{\\i{}(.*?)\}/g, '$1'); // 清理斜体标记
          } else if (typeof data === 'object') {
              for (const key in data) {
                  data[key] = decodeRecursive(data[key]);
              }
          }
          return data;
      };
  
      try {
          // 解析 JSON 并解码
          const parsedData = JSON.parse(jsonPart);
          const decodedData = decodeRecursive(parsedData);
          return `ITEM CSL_CITATION ${JSON.stringify(decodedData, null, 2)}`;
      } catch (e) {
          console.error('JSON 解析失败，返回原字符串');
          return str; // 解析失败时保留原始内容
      }
}

