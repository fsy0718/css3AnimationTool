require(['event', 'js/canvas/layout', 'js/canvas/popup'],function(event,layout, popup){
  event.on('addElement.popup', popup.addElement);
  event.on('updateElement.popup', popup.updateElement);
  event.on('showMenu.popup', popup.showMenu);
  event.on('hideMenu.popup', popup.hideMenu);
  event.on('showStyle.popup', popup.showStyle);


  event.on('addElement.canvas', layout.addElement);
  event.on('updateElement.canvas',layout.updateElement);
  event.on('setCurrentArgs', layout.setCurrentArgs);
  layout.init();


})


