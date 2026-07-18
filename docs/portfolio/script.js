(() => {
  const canvas = document.querySelector(".living-canvas");
  const surface = document.querySelector(".hero");
  if (!canvas || !surface) return;
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = [[118,181,25],[81,70,229],[235,91,79]];
  const pointer = { x: 0, y: 0, active: false };
  const seeds = [];
  let w = 0, h = 0, nodes = [], last = 0, rng = 2405;
  const random = () => ((rng = rng * 16807 % 2147483647) - 1) / 2147483646;

  function build() {
    rng = 2405;
    nodes = Array.from({ length: w < 700 ? 38 : 68 }, (_, i) => {
      const x = w * (.22 + random() * .75), y = h * (.06 + random() * .86);
      return { x, y, ox:x, oy:y, vx:0, vy:0, r:1.2 + random()*2.5, p:random()*Math.PI*2, c:i%3 };
    });
  }
  function resize() {
    const box = surface.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    w = box.width; h = box.height;
    canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0); build();
  }
  function locate(event) {
    const box = surface.getBoundingClientRect();
    pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top; pointer.active = true;
  }
  surface.addEventListener("pointermove", locate);
  surface.addEventListener("pointerleave", () => pointer.active = false);
  surface.addEventListener("pointerdown", event => {
    locate(event); seeds.push({x:pointer.x,y:pointer.y,life:1,c:seeds.length%3});
    if (seeds.length > 7) seeds.shift();
  });

  function draw(time=0) {
    const step = Math.min((time-last)/16.67 || 1, 2); last = time;
    ctx.clearRect(0,0,w,h); ctx.lineCap = "round";
    nodes.forEach((n,i) => {
      if (!reduced) {
        const drift = time*.00016+n.p;
        n.vx += Math.cos(drift*1.7)*.005*step; n.vy += Math.sin(drift*1.3)*.005*step;
        if (pointer.active) {
          const dx=n.x-pointer.x, dy=n.y-pointer.y, d=Math.hypot(dx,dy);
          if (d<165 && d>0) { const f=(1-d/165)*.32; n.vx+=dx/d*f*step; n.vy+=dy/d*f*step; }
        }
        n.vx+=(n.ox-n.x)*.00018*step; n.vy+=(n.oy-n.y)*.00018*step;
        n.vx*=.968; n.vy*=.968; n.x+=n.vx*step; n.y+=n.vy*step;
      }
      for (let j=i+1;j<nodes.length;j++) {
        const o=nodes[j], d=Math.hypot(n.x-o.x,n.y-o.y), limit=w<700?105:128;
        if (d<limit) {
          const color=colors[n.c], a=(1-d/limit)*.12, bend=Math.sin(n.p+time*.0004)*12;
          ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.quadraticCurveTo((n.x+o.x)/2+bend,(n.y+o.y)/2-bend,o.x,o.y);
          ctx.strokeStyle=`rgba(${color[0]},${color[1]},${color[2]},${a})`; ctx.lineWidth=.75+a*5; ctx.stroke();
        }
      }
      const color=colors[n.c]; ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${color[0]},${color[1]},${color[2]},.28)`; ctx.fill();
    });
    seeds.forEach(s => {
      const c=colors[s.c]; ctx.beginPath(); ctx.arc(s.x,s.y,26+(1-s.life)*110,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},${s.life*.32})`; ctx.lineWidth=1; ctx.stroke();
      if (!reduced) s.life-=.009*step;
    });
    for(let i=seeds.length-1;i>=0;i--) if(seeds[i].life<=0) seeds.splice(i,1);
    if(pointer.active){ctx.beginPath();ctx.arc(pointer.x,pointer.y,25,0,Math.PI*2);ctx.strokeStyle="rgba(17,17,17,.72)";ctx.stroke();ctx.beginPath();ctx.arc(pointer.x,pointer.y,2.5,0,Math.PI*2);ctx.fillStyle="#111";ctx.fill()}
    if(!reduced) requestAnimationFrame(draw);
  }
  new ResizeObserver(resize).observe(surface); resize(); draw();
})();

(() => {
  const title = document.querySelector('#hero-title');
  const words = [...document.querySelectorAll('.kinetic-word')];
  const trigger = document.querySelector('#scatter-type');
  if (!title || !words.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  words.forEach(word => {
    const characters = [...word.textContent];
    word.textContent = '';
    characters.forEach(character => {
      const letter = document.createElement('span');
      letter.className = 'kinetic-letter';
      letter.textContent = character;
      word.appendChild(letter);
    });
  });
  const letters = [...document.querySelectorAll('.kinetic-letter')];
  const bodies = letters.map(element => ({ element, x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0, drag: null }));

  function pushFrom(clientX, clientY, force = 1.3) {
    bodies.forEach(body => {
      const rect = body.element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - clientX;
      const dy = cy - clientY;
      const distance = Math.max(28, Math.hypot(dx, dy));
      if (distance > 300 && force < 2) return;
      const strength = force * Math.max(.16, 1 - distance / 480);
      body.vx += dx / distance * strength * 18;
      body.vy += dy / distance * strength * 14 - force * 1.8;
      body.spin += (Math.random() - .5) * strength * 3.2;
    });
  }

  function scatter(force = 3.4) {
    const rect = title.getBoundingClientRect();
    pushFrom(rect.left + rect.width / 2, rect.top + rect.height / 2, force);
  }

  title.addEventListener('pointermove', event => {
    if (!event.target.closest('.kinetic-letter')) pushFrom(event.clientX, event.clientY, .34);
  });
  title.addEventListener('pointerdown', event => {
    if (event.target.closest('.kinetic-letter')) return;
    event.preventDefault();
    pushFrom(event.clientX, event.clientY, 3.8);
  });

  bodies.forEach(body => {
    body.element.addEventListener('pointerdown', event => {
      if (reduced) return;
      event.preventDefault();
      event.stopPropagation();
      body.element.setPointerCapture(event.pointerId);
      body.drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, bx: body.x, by: body.y, lx: event.clientX, ly: event.clientY };
    });
    body.element.addEventListener('pointermove', event => {
      if (!body.drag || body.drag.pointerId !== event.pointerId) return;
      event.stopPropagation();
      body.vx = (event.clientX - body.drag.lx) * .55;
      body.vy = (event.clientY - body.drag.ly) * .55;
      body.x = body.drag.bx + event.clientX - body.drag.x;
      body.y = body.drag.by + event.clientY - body.drag.y;
      body.angle += body.vx * .08;
      body.drag.lx = event.clientX; body.drag.ly = event.clientY;
    });
    const release = event => {
      if (!body.drag || body.drag.pointerId !== event.pointerId) return;
      body.drag = null;
    };
    body.element.addEventListener('pointerup', release);
    body.element.addEventListener('pointercancel', release);
  });

  function animateScatter() {
    bodies.forEach((body, index) => {
      body.x = 0; body.y = 0; body.vx = 0; body.vy = 0; body.angle = 0; body.spin = 0;
      body.element.style.transform = 'translate3d(0,0,0) rotate(0deg)';
      body.element.getAnimations().forEach(animation => animation.cancel());
      const angle = index / bodies.length * Math.PI * 2 + (index % 3 - 1) * .22;
      const distance = 125 + (index % 6) * 24;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance * .72 - 34;
      const rotation = (index % 2 ? 1 : -1) * (9 + index % 8 * 2.4);
      const scale = reduced ? .12 : 1;
      body.element.animate([
        { transform:'translate3d(0,0,0) rotate(0deg) scale(1)', offset:0 },
        { transform:`translate3d(${x*scale}px,${y*scale}px,0) rotate(${rotation*scale}deg) scale(.9)`, offset:.28 },
        { transform:`translate3d(${x*.62*scale}px,${(y+72)*.62*scale}px,0) rotate(${-rotation*.44*scale}deg) scale(1.04)`, offset:.58 },
        { transform:`translate3d(${-x*.12*scale}px,${-y*.12*scale}px,0) rotate(${rotation*.12*scale}deg) scale(.99)`, offset:.86 },
        { transform:'translate3d(0,0,0) rotate(0deg) scale(1)', offset:1 }
      ], {
        duration: 5000,
        easing:'cubic-bezier(.18,.82,.24,1)',
        fill:'none'
      });
    });
    if (trigger) {
      trigger.classList.add('is-active');
      trigger.textContent = 'Type scattered ✓';
      window.setTimeout(() => {
        trigger.classList.remove('is-active');
        trigger.textContent = 'Scatter the type ↗';
      }, 5000);
    }
  }

  window.scatterHeroType = animateScatter;
  trigger?.addEventListener('click', animateScatter);

  function tick() {
    bodies.forEach(body => {
      if (body.drag) {
        body.element.style.transform = `translate3d(${body.x.toFixed(2)}px,${body.y.toFixed(2)}px,0) rotate(${body.angle.toFixed(2)}deg)`;
        return;
      }
      body.vx += -body.x * .014;
      body.vy += -body.y * .014;
      body.spin += -body.angle * .012;
      body.vx *= .94; body.vy *= .94; body.spin *= .93;
      body.x += body.vx; body.y += body.vy; body.angle += body.spin;
      if (Math.abs(body.x) + Math.abs(body.y) + Math.abs(body.vx) + Math.abs(body.vy) <= .08) { body.x = 0; body.y = 0; body.angle = 0; }
      body.element.style.transform = `translate3d(${body.x.toFixed(2)}px,${body.y.toFixed(2)}px,0) rotate(${body.angle.toFixed(2)}deg)`;
    });
    requestAnimationFrame(tick);
  }

  if (!reduced) {
    requestAnimationFrame(tick);
    window.setTimeout(() => scatter(2.1), 650);
  }
})();
