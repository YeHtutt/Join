async function onloadLegal() {
   await init('legalNotice');
}

window.addEventListener('scroll', myFunction);

function myFunction() {
   if (scrollY == 0) {
     document.getElementById('kanban').classList.remove('display-unset');
   } else{
     document.getElementById('kanban').classList.add('display-unset');
   }
 }