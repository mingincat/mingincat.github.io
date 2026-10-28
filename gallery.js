(function(){var items=[].slice.call(document.querySelectorAll('.g-item'));if(!items.length)return;
var lb=document.createElement('div');lb.id='lightbox';lb.innerHTML='<button class="lb-x" aria-label="Close">&times;</button><button class="lb-p" aria-label="Previous">&#8249;</button><img alt=""><button class="lb-n" aria-label="Next">&#8250;</button>';document.body.appendChild(lb);
var img=lb.querySelector('img'),i=0;function show(n){i=(n+items.length)%items.length;img.src=items[i].getAttribute('href');lb.classList.add('on')}
function close(){lb.classList.remove('on')}
items.forEach(function(a,n){a.addEventListener('click',function(e){e.preventDefault();show(n)})});
lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-x'))close()});
lb.querySelector('.lb-p').onclick=function(e){e.stopPropagation();show(i-1)};lb.querySelector('.lb-n').onclick=function(e){e.stopPropagation();show(i+1)};
img.onclick=function(e){e.stopPropagation()};
document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)})})();
