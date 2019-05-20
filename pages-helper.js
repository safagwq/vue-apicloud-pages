var path = require('path')
var fs = require("fs")

var options={

    mainJsTemp : function (fileName){
        var jsTemp=`
            import Vue from 'vue'
            import App from '@/pages/${fileName}'

            new Vue({
              render: h => h(App)
            }).$mount('#app')
        `
        return jsTemp
    }
}

module.exports=pagesHelper

function pagesHelper(htmlsPath,_options={}){
    for(var i in _options){
        options[i] = _options[i]
    }


    process.chdir(htmlsPath)
    
    var mainPath='./.main'
    var fileTree=readDirSync('./')

    deleteFolderRecursive(mainPath)
    fs.mkdirSync(mainPath)

    var jsFileTree = getJsFileTree(fileTree , mainPath)

    var pages={}

    jsFileTreeToList(jsFileTree).forEach((jsFile)=>{
        pages[jsFile.vueFilePath]={
            entry: path.join(htmlsPath , jsFile.filePath ),
            filename: jsFile.htmlFilePath,
        }
    })

    return pages
    // fs.mkdirSync( path.join(htmlsPath,'.main') )
}


function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath)
            }
            else { // delete file
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
    }
}

function jsFileTreeToList(jsFileTree){
    var list=[]
    jsFileTree.forEach((jsFile)=>{
        if(jsFile.isDir){
            list=list.concat( jsFileTreeToList(jsFile.children) )
        }
        else{
            list.push(jsFile)
        }
    })

    return list
}

function getJsFileTree(fileTree , mainPath){
    return fileTree.map((vueFile)=>{
        if(vueFile.isDir){
            var dirPath = path.join(mainPath , vueFile.filePath)
            fs.mkdirSync( dirPath )

            return {
                filePath : dirPath,
                isDir : true,
                children : vueFile.children ? getJsFileTree(vueFile.children, mainPath) : null
            }
        }
        else{

            var fileName=path.join( mainPath , vueFile.filePath.replace(/\.vue$/,'.js') )

            fs.writeFileSync( fileName , options.mainJsTemp(vueFile.filePath))

            return {
                filePath : fileName,
                vueFilePath : vueFile.filePath,
                htmlFilePath : vueFile.filePath.replace(/\.vue$/,'.html'),
                isDir : false
            }
        }
        
    })
}



function readDirSync(dirPath){

    var fileTree=fs.readdirSync(dirPath).filter( fileName=>fileName.indexOf('.')!=0 )

    return fileTree.map(function(fileName,index){

        var filePath = path.join( dirPath , fileName)
        var fileStat = fs.statSync(filePath)

        if(fileStat.isDirectory()){

            return {
                filePath : filePath,
                isDir : true,
                children : readDirSync(filePath)
            }
        }
        else{
            return {
                filePath : filePath,
                isDir : false,
                children : null,
            }
        }
    })
    .filter( file=>{
        if(file.isDir){
            return true
        }
        else{
            return /\.vue$/.test(file.filePath)
        }
    })
}
