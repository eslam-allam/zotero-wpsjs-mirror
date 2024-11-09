
//运行脚本服务
function runServers(FunctionName,osPath,shellName,windowStyle){
    var result = "function "+FunctionName+"(){ Shell('" + osPath + shellName+"',"  +windowStyle+") ;}"          
    window.Application.JSIDE.SelectedJSComponent.CodeModule.InsertLines(1,result) 
    window.Application.Run(''+FunctionName)
    window.Application.JSIDE.SelectedJSComponent.CodeModule.DeleteLines(0, 1)
}