
/**
 * 
 * @param {*} FunctionName jsa函数名称
 * @param {*} osPath 脚本运行路径
 * @param {*} windowStyle 脚本运行模式
 */
function runServers(FunctionName,osPath,windowStyle){
    var result = "function " + FunctionName + "(){ try {Shell(\"" + osPath +  "\", " + windowStyle + ") }catch (error){console.log('程序路径错误，请重新选择程序路径！！')};}";
    window.Application.JSIDE.SelectedJSComponent.CodeModule.InsertLines(1,result) 
    window.Application.Run(''+FunctionName)
    window.Application.JSIDE.SelectedJSComponent.CodeModule.DeleteLines(0, 1)
    window.Application.ActiveDocument.Saved= true
}
/**
 * 
 * @param {*} functionName jsa函数名称
 * @param {*} funString 函数{}内的内容
 */
function runFun(functionName,funString){
    var result = "function " + functionName + "(){ try {"+funString+" }catch (error){console.log('jsa运行错误！')}}";
    window.Application.JSIDE.SelectedJSComponent.CodeModule.InsertLines(1,result) 
    window.Application.Run(''+functionName)
    //window.Application.JSIDE.SelectedJSComponent.CodeModule.DeleteLines(0, 1)
    window.Application.ActiveDocument.Saved= true
}