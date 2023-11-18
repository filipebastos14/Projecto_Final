const sidebarMenu = document.querySelector('#sidebarMenu');
const divSidebarMenu = document.querySelector('#divSidebarMenu');
sidebarMenu.addEventListener("click", function(){
    if(divSidebarMenu.style.display == "none"){
        divSidebarMenu.style.display = "flex"
    } else{
        divSidebarMenu.style.display = "none"
    }
});

const sidebarMenuRight = document.querySelector('#sidebarMenuRight');
const divSidebarMenuRight = document.querySelector('#divSidebarMenuRight');

sidebarMenuRight.addEventListener("click", function(){
    if(divSidebarMenuRight.style.display == "none"){
        divSidebarMenuRight.style.display = "flex"
    } else{
        divSidebarMenuRight.style.display = "none"
    }
});
