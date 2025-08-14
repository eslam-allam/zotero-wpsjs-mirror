Attribute Module_Name = "main"

function btnEditCitation(){
	zc_bind().command('addEditCitation');
    zc_clearRegistry();
}
function btnEditBibliography(){
	zc_bind().command('addEditBibliography');
    zc_clearRegistry();
}
function btnRefresh(){
	 zc_bind().import();
           
            zc_bind().command('refresh');
            zc_clearRegistry();
}
function btnSetDocPrefs(){
	 zc_bind().command('setDocPrefs');
            zc_clearRegistry();
}
function btnUnlink(){
	zc_bind().command('removeCodes');
            zc_clearRegistry();
}
function btnInsertNote(){
	 alert("功能开发中...")
}
function btnAbout(){
	alert("Zotero-jsa加载宏\n\nThis add-on is licensed under GPL-3.0 http://www.gnu.org/licenses/\n\nCopyright © 2025 初心不忘 ")
}
function rxIRibbonUI_onLoad(rib)
{

}