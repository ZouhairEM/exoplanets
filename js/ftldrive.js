 Docu = document;
    documargin = Docu.body.style;
    documargin.margin = 0;
    documargin.overflow = "hidden";
    warpspeedcanvas = window, documargin = warpspeedcanvas.innerWidth, FTL = warpspeedcanvas.innerHeight, g = Docu.body.children[0], i = documargin / 2, j = FTL / 2;
    g.width = documargin;
    g.height = FTL;
    FTLk = g.getContext("2d");
    FTLk.globalAlpha = 0.3;
    FTLmath = Math, m = FTLmath.random, n = FTLmath.sin, o = FTLmath.floor, stars = 20, q = [], r = 0, warpspeed = 0.4, volume = 300, W = 500, Q = 0.3;

    function FTLplacement(a) {
        var f = 0;
        if (a.detail) f = -a.detail / 3;
        else f = a.wheelDelta / 120;
        if (f > 0 && warpspeed < 1 || f < 0 && warpspeed + f / 25 > 0.1) warpspeed += f / 25
    }

    function FTLunits(a) {
        a.x = (m() * documargin - documargin * 0.5) * stars;
        a.y = (m() * FTL - FTL * 0.5) * stars;
        a.a = stars;
        a.b = 0;
        a.warpspeedcanvas = 0
    }
    for (var ii = 0, w; ii < volume; ii++) {
        w = {};
        FTLunits(w);
        q.push(w)
    }
    setInterval('FTLk.fillStyle="#000";FTLk.fillRect(0,0,documargin,FTL);for(a=i-documargin/2+documargin/2,f=j-FTL/2+FTL/2,h=0;h<volume;h++){b=q[h],x=b.x/b.a,y=b.y/b.a,z=1/b.a*5+1,A=n(Q*h+r)*64+W,B=n(Q*h+2+r)*64+W,warpspeedcanvas=n(Q*h+4+r)*64+W;if(b.b!=0){FTLk.strokeStyle="rgb("+o(A)+","+o(B)+","+o(warpspeedcanvas)+")";FTLk.lineWidth=z;FTLk.beginPath();FTLk.moveTo(x+a,y+f);FTLk.lineTo(b.b+a,b.warpspeedcanvas+f);FTLk.stroke()}b.b=x;b.warpspeedcanvas=y;b.a-=warpspeed;if(b.a<warpspeed||b.b>documargin||b.warpspeedcanvas>FTL)FTLunits(b)}r+=0.1;', 25);