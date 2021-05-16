// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;
let myEntries = [];

// Make sure you register your service worker here too
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
        myEntries.push(newPost);
      });
    });
});

document.querySelector('header img').onclick = function(){
  if(location.hash != '#settings'){
    //location.hash = '#settings';
    history.pushState({'page':'settings','entry':0}, '', '#settings');
    router.setState('settings',0,null);
  }
};

document.querySelector('header h1').onclick = function(){
  if(location.hash != ''){
    //location.hash = '';
    history.pushState({'page':'home','entry':0}, '', ' ');
    router.setState('home',0,null);
  }
};

document.addEventListener('click', (event) => {
  if(event.target.tagName == 'JOURNAL-ENTRY'){
    
    for(let i = 0; i < myEntries.length; i++){
      if(myEntries[i] == event.target){
        //location.hash = '#entry' + (i + 1);
        history.pushState({'page':'entry','entry':(i + 1)}, '', '#entry' + (i + 1));
        router.setState('entry',i+1,event.target);
      }
    }
  }
});

window.onpopstate = function(event) {
  router.setState(event.state.page,event.state.entry,myEntries[event.state.entry-1]);
}

window.onload = function() {
  history.pushState({'page':'home','entry':0}, '', ' ');
}