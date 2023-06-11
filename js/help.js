async function onloadHelp() {
    await init('help');
    await loadTasksFromBackend();
     await loadUserAccountsFromBackend();
 }

 
 window.addEventListener('scroll', myFunction);

function myFunction() {
   if (scrollY == 0) {
     document.getElementById('kanban').classList.remove('display-unset');
   } else{
     document.getElementById('kanban').classList.add('display-unset');
   }
 }