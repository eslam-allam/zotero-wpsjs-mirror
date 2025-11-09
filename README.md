# Zotero-WPSJS

## 1.介绍

Zotero-WPSJS文字加载项，一款**学术论文管理软件Zotero** 和**WPS文字**交互插件。

支持平台:Windows & Linux & Mac


## 2.软件架构

[WPS-JS](https://open.wps.cn/previous/docs/client/js-api/introduce) 加载项和**Python**。
	
## 3.使用说明

本插件需要用户的授权才能正常使用。

**Win**端请注意：请关闭安全软件，再下载和安装本插件，或者将 proxy.exe 添加到安全软件的信任里。

**Mac**端用户注意：

   ① WPS版本 >= 6.15

   ② Zotero 版本7  

   ③ Zotero-wpsjs当前存在卡红条bug未能解决，请安装jsa版本，具体参照视频教程[B站视频](https://b23.tv/tvqvX9g)

请前往zotero软件 设置 ----> 高级----> 勾选“允许此计算机上的其他程序与zotero通信”

Zotero相关使用教程https://zotero-chinese.com/user-guide/
#### 安装教程

[在线安装](www.chuxintool.xyz:3000/win/publish.html)

离线安装[B站视频](https://b23.tv/tvqvX9g)



### 3.1 Windows平台

  WPS相关设置---

   1.工具--->宏安全性--->可靠发行商--->勾选 '信任对于wpsjs项目的访问'

   2.全局设置--->设置--->关闭 '沙箱保护'

   安装---

   3.右键win项目文件夹内的 win安装.exe，以管理员运行

   卸载---

   方法1.关闭wps后，执行Win项目内 winUninstall.exe

   方法2.点击插件 About ---> 卸载插件

   方法3. %appdata%/kingsoft/wps/jsaddons/  前往此路径，删除所有文件和文件夹(此操作会删除所有加载项，请谨慎操作)

### 3.2 Linux平台

WPS相关设置: 工具--->宏安全性--->可靠发行商--->勾选 '信任对于wpsjs项目的访问'

安装
```bash
python3 install.py
```
卸载---

方法1.关闭wps后，执行Linux项目内 uninstall.py

方法2.点击插件 About ---> 卸载插件

方法3. ~/.local/share/Kingsoft/wps/jsaddons   前往此路径，删除所有文件和文件夹(此操作会删除所有加载项，请谨慎操作)

### 3.3 Mac平台

WPS相关设置: 工具--->宏安全性--->可靠发行商--->勾选 '信任对于wpsjs项目的访问'

安装
   
由于缺乏证书签名，您需要按下方的步骤操作，视频教程[https://b23.tv/tvqvX9g](https://b23.tv/tvqvX9g)
   
打开mac项目文件夹内的 Mac安装 点击 打开。
然后前往 系统设置-->隐私与安全性-->点击 安全性 中的 mac安装 仍要打开。
部分mac系统需要运行一次proxy.app，操作过程如上。

卸载---

方法1.关闭wps后，执行Mac项目内 macUninstall.app 

方法2.点击插件 About ---> 卸载插件

方法3. ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons 前往此路径，删除所有文件和文件夹(此操作会删除所有加载项，请谨慎操作)

## 🙏 致谢

✨ 特别鸣谢：

+ 👨💻 项目奠基人：[tankwyn](https://github.com/tankwyn)
+ 🏢 WPS 官方技术团队
+ 🎬 @akihi 制作的视频教程
+ 💡 QQ 交流群友的测试支持
  


## 📬与我联系

你有任何建议或意见 可以通过以下方式联系我

qq:897081475

qq 1群:1029775161 （已满）
   2群:739198158（已满）
   3群:735449402

