const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

console.log('electron php')

ipcRenderer.on('stderr',(event,data) => {
    console.log('stderr ' + data);
});
ipcRenderer.on('stdout',(event,data) => {
    console.log('stdout ' + data);
});

var style = document.createElement('style');
style.type ='text/css';

style.innerText=`::-webkit-scrollbar {
    display: none;
}`;
window.addEventListener("load", function(){
    document.getElementsByTagName('head')[0].appendChild(style);
});

