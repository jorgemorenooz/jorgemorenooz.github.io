let listElements = document.querySelectorAll('.list-button--click');


listElements.forEach(listElement => {
    listElement.addEventListener('click',()=>{
        listElement.classList.toggle('arrow');

        let height = 0;
        let menu = listElement.nextElementSibling;
        if(menu.clientHeight == "0"){
            height = menu.scrollHeight;
        }

        menu.style.height = `${height}px`
    })
})

function displayMenu(){
    let submenu = document.getElementById('subMenu');
    submenu.classList.toggle('open-menu');

    let listMenu = document.querySelector('#subMenu .list');
    listMenu.classList.toggle('open-list');
}