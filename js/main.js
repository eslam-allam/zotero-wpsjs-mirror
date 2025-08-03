Attribute Module_Name = "main"

function ZoteroRibbon(control){
	  const eleId = control.Invoke_Get("ID")
    switch (eleId) {
        case "InsertZoteroCitationButton":
        
            zc_bind().command('addEditCitation');
            // IMPORTANT: Release references on the document objects!!!
            zc_clearRegistry();

            break;
        case "InsertZoteroBibliographyButton":

            zc_bind().command('addEditBibliography');
            zc_clearRegistry();

            break;
        case "RefreshZotero":

            zc_bind().import();
           
            zc_bind().command('refresh');
            zc_clearRegistry();

            break;
        case "ZoteroSetDocPrefs":

         zc_bind().command('setDocPrefs');
            zc_clearRegistry();

            break;
        case "InsertZoteroNoteButton":

           alert("点击了InsertZoteroNoteButton按钮")

            break;
        case "ZoteroRemoveCodes":

           alert("点击了ZoteroRemoveCodes按钮")

            break;
 		case "AboutButton":

           alert("Zotero-jsa加载宏\n\nThis add-on is licensed under GPL-3.0 http://www.gnu.org/licenses/\n\nCopyright © 2025 初心不忘 ")
	 



            break;
            
        	default:
    }
     
    return true;
}

function rxIRibbonUI_onLoad(rib)
{

}