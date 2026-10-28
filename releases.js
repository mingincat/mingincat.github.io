(function(){
  var grid=document.querySelector('.rel-grid'); if(!grid) return;
  var box=document.getElementById('relPlayer'),frame=document.getElementById('relFrame'),
      now=document.getElementById('relNow'),open=document.getElementById('relOpen'),close=document.getElementById('relClose');
  function play(card){
    var id=card.getAttribute('data-album'),title=card.getAttribute('data-title');
    var cards=grid.querySelectorAll('.rel-card');
    for(var i=0;i<cards.length;i++) cards[i].classList.toggle('on',cards[i]===card);
    frame.innerHTML='<iframe title="'+title+' - Mark DB" src="https://open.spotify.com/embed/album/'+id+'?utm_source=generator&theme=0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    now.textContent='Now playing: '+title;
    open.href='https://open.spotify.com/album/'+id;
    box.hidden=false;
    box.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  grid.addEventListener('click',function(e){var c=e.target.closest('.rel-card'); if(c&&!c.classList.contains('rel-ext')) play(c);});
  close.addEventListener('click',function(){
    box.hidden=true; frame.innerHTML='';
    var on=grid.querySelector('.rel-card.on'); if(on) on.classList.remove('on');
  });
})();
