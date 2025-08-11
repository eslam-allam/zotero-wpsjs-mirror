// included by index.html
path = wps.Env.GetHomePath() + `/.kingsoft/wps/jsaddons/zotero-jsa_1.0.0/Zotero-Jsa.dotm`
Application.AddIns.Add(path, true)
Application.AddIns.Item("Zotero-Jsa.dotm").Installed = true