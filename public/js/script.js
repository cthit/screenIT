
function createIcon() {
    let link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/img/icons/tv.svg';
    return link;
}

document.head.appendChild(createIcon());


function flashDiv(div, time){
    div.classList.add("changedPerson");
    setTimeout(function() {
        div.classList.remove("changedPerson");
    }, time); // milliseconds
}


document.addEventListener('DOMContentLoaded', function() {
    let closeButtons = document.getElementsByClassName('closeButton');

    for (const button of closeButtons) {
        button.addEventListener('click', () => {
            button.parentNode.classList.toggle('hidden');
        });
    };
    
    
    function createRandomSuffix(){
        let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return uniqueSuffix;
    }

});


