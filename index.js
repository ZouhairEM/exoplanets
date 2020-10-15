 $(document).ready(function() {
     /********************************** GLOBAL DECLARATIONS **********************************/
     var scenes = [],
         currentScene, camera, renderer, container, renderers, controls;
     var spotLight, background, sun, earth, mars, venus, mercury, jupiter, saturn, uranus, neptune;
     var sunsize = 109,
         mercurysize = 1.9,
         venussize = 4.75,
         earthsize = 5,
         marssize = 2.65,
         jupitersize = 55.95,
         saturnsize = 47,
         uranussize = 20.2,
         neptunesize = 19.4;
     var SCREEN_WIDTH = window.innerWidth,
         SCREEN_HEIGHT = window.innerHeight;
     var VIEW_ANGLE = 45,
         ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
         NEAR = 0.1,
         FAR = 100000;
     var mouse = new THREE.Vector2();
     var varSwitcher = 0,
         jumpSwitcher = 1,
         sceneNumber = 1;
     var mapCamera, mapWidth = (240 * 2),
         mapHeight = (160 * 2);
     var mercuryrotation, venusrotation, earthrotation, marsrotation, jupiterrotation, saturnrotation, uranusrotation;
     var mercuryonce = 0,
         venusonce = 0,
         earthonce = 0,
         marsonce = 0,
         jupiteronce = 0,
         saturnonce = 0,
         uranusonce = 0,
         neptuneonce = 0;
     var exogeometry, exomaterial, exoplanet, exoplanetname;
     var camVar = 100000; //dit was 100000
     camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
     camera.position.x = 300, camera.position.z = camVar;
     camera.rotation.x = 0 * Math.PI / 180, camera.rotation.y = 300 * Math.PI / 180, camera.rotation.z = 0 * Math.PI / 180;
     $("#overlaytextplanet, #distancegauge, #nearestplanetholder").hide();

     function onMouseMove(event) {
         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
     }
     /********************************** MENU FUNCTIONS **********************************/
     function show() {
         $("#container").fadeIn();
     };
     setTimeout(show, 100);

     jQuery(function() {
         $("#btn1").click(function() {
             $("#menu").fadeOut(1000);
             $("#intro").fadeOut(1000, function() {
                 dat.GUI.toggleHide();
             });
         });
     });
     $("#btn2").click(function() {
         $("#video").fadeIn();
         $("#menu").fadeOut();
         $("#intro").fadeOut();
         return false;
     });
     $("#video").click(function() {
         $("#menu").fadeIn();
         $("#intro").fadeIn();
         $(this).fadeOut(function() { $("#promo").first().attr('src', 'https://drive.google.com/uc?export=download&id=0B28uSltIxqmxRWYzRG9paUlzYVk') });
     });
     $('#promo').click(function(event) {
         event.stopPropagation();
         this.paused ? this.play() : this.pause();
     });
     $('#btn3').click(function() {
         location.href = "mailto:z.elmariami@student.fontys.nl?Subject=Feedback%20project";
     });
     /********************************** GLOWING OBJECTS **********************************/
     function glow(target, color, size) {
         var customMaterial = new THREE.ShaderMaterial({
             uniforms: {
                 diffuse: {
                     type: "c",
                     value: new THREE.Color(color)
                 }
             },
             vertexShader: document.getElementById('vertexShader').textContent,
             fragmentShader: document.getElementById('fragmentShader').textContent,
             side: THREE.BackSide,
             blending: THREE.AdditiveBlending,
             transparent: true
         });

         var glowGeometry = new THREE.SphereGeometry(size * 1.4, 32, 16);
         var glow = new THREE.Mesh(glowGeometry, customMaterial);
         target.add(glow);
     }
     /********************************** INITIALIZATION **********************************/
     function init() {

         for (i = 0; i < Math.ceil((dataset.length / 5)); i++) {
             scenes.push(new THREE.Scene());
             var spinning = new THREE.Object3D();
             scenes[i].add(spinning);
             scenes[i].userData.spinning = spinning;
         }
         currentScene = scenes[0];
         for (var j = 0; j < 10; j++) {
             scenes[j].visible = false;
         }
         renderer = new THREE.WebGLRenderer({
             antialias: true
         });
         renderer.setClearColor(0x000000, 1.0);
         renderer.shadowMap.enabled = true;
         renderer.shadowMapSoft = true;

         var from = {
             x: camera.position.x,
             y: camera.position.y,
             z: camera.position.z
         };

         var to = {
             x: camera.position.x = -50,
             y: camera.position.y = 400,
             z: camera.position.z = 2000
         };

         var tween = new TWEEN.Tween(from)
             .to(to, 12000) //dit was 12000
             .easing(TWEEN.Easing.Linear.None)
             .onUpdate(function() {
                 camera.position.set(this.x, this.y, this.z);
                 camera.lookAt(new THREE.Vector3(0, 0, 0));
             })
             .onComplete(function() {
                 camera.lookAt(new THREE.Vector3(0, 0, 0));
             })
             .start();
         /********************************** ORTHOGRAPHIC CAMERA **********************************/
         mapCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, NEAR, FAR);
         mapCamera.position.set(600, 3000, 0);
         mapCamera.up = new THREE.Vector3(0, 0, 1);
         mapCamera.lookAt(new THREE.Vector3(300, 0, 0));
         mapCamera.position.set(1200, 3000, 0);
         mapCamera.rotation.z = 500;
         scenes[0].add(mapCamera);

         renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
         container = document.getElementById('container');
         container.appendChild(renderer.domElement);
         renderer.autoClear = false;
         /********************************** MATERIALS **********************************/
         var loader = new THREE.TextureLoader();
         var Background_material = new THREE.MeshPhongMaterial({
             color: 0xffffff,
             map: loader.load('images/galaxymap.png'),
             specular: new THREE.Color(0xffffff),
             shininess: 0,
             fog: false,
             side: THREE.BackSide,
             shading: THREE.SmoothShading,
         });

         var Sun_material = new THREE.MeshPhongMaterial({
             color: 0xFFFFE0,
             map: loader.load('images/sunmap.jpg'),
             bumpMap: loader.load('images/sunsbump.jpg'),
             bumpScale: 0.1,
             specular: new THREE.Color(0xFFFFE0),
             shininess: 1300,
             fog: false,
             shading: THREE.SmoothShading,
         });

         var Earth_material = new THREE.MeshPhongMaterial({
             color: 0xa0a0a0,
             map: loader.load('images/earthmap1k.jpg'),
             bumpMap: loader.load('images/earthbump1k.jpg'),
             bumpScale: 2,
             specularMap: loader.load('images/earthspec1k.jpg'),
             specular: new THREE.Color('grey'),
             shininess: 10,
             shading: THREE.SmoothShading,
         });

         var Mercury_material = new THREE.MeshPhongMaterial({
             color: 0x036FB8,
             map: loader.load('images/mercurybump.jpg'),
             bumpMap: loader.load('images/mercurybump.jpg'),
             bumpScale: 0.25,
             shininess: 3,
             shading: THREE.SmoothShading,
         });

         var Venus_material = new THREE.MeshPhongMaterial({
             color: 0xf5cb6a,
             map: loader.load('images/venusmap.jpg'),
             specular: new THREE.Color(0xf5cb6a),
             bumpMap: loader.load('images/sunbump.jpg'),
             bumpScale: 0.2,
             shininess: 3,
             shading: THREE.SmoothShading,
         });

         var Mars_material = new THREE.MeshPhongMaterial({
             color: 0xf1591d,
             map: loader.load('images/marsmap1k.jpg'),
             specular: new THREE.Color(0x3989f8),
             shininess: 3,
             shading: THREE.SmoothShading,
         });

         var Jupiter_material = new THREE.MeshPhongMaterial({
             color: 0xedc89a,
             map: loader.load('images/jupitermap.jpg'),
             specular: new THREE.Color(0xedc89a),
             bumpMap: loader.load('images/jupiterbump.jpg'),
             bumpScale: 0.5,
             lightMapIntensity: 5,
             reflectivity: 2,
             emissiveIntensity: 5,
             refractionRatio: 3,
             shininess: 10,
             shading: THREE.SmoothShading,
         });

         var Saturn_material = new THREE.MeshPhongMaterial({
             color: 0x9a806e,
             map: loader.load('images/saturnmap.jpg'),
             specular: new THREE.Color(0x9a806e),
             bumpMap: loader.load('images/sunbump.jpg'),
             bumpScale: 0,
             lightMapIntensity: 5,
             reflectivity: 1,
             emissiveIntensity: 3,
             refractionRatio: 2,
             shininess: 7,
             shading: THREE.SmoothShading,
         });

         var Uranus_material = new THREE.MeshPhongMaterial({
             color: 0x9ab4c0,
             map: loader.load('images/uranus.jpg'),
             specular: new THREE.Color(0x9ab4c0),
             shininess: 3,
             shading: THREE.SmoothShading,
         });

         var Neptune_material = new THREE.MeshPhongMaterial({
             color: 0x9a806e,
             map: loader.load('images/neptunemap.jpg'),
             specular: new THREE.Color(0x5d78ce),
             shininess: 3,
             shading: THREE.SmoothShading,
         });

         var Meteor_material = new THREE.MeshPhongMaterial({
             color: 0xdddddd,
             map: loader.load('images/comettexture.jpg'),
             specular: new THREE.Color(0xedc89a),
             bumpMap: loader.load('images/moonbump1k.jpg'),
             bumpScale: 10,
             shininess: 0,
             shading: THREE.SmoothShading,
         });
         /********************************** GEOMETRIES **********************************/
         function Shaper(target, xPos, zPos) {
             target.position.set(xPos, 0, zPos);
             target.castShadow = true;
             target.receiveShadow = true;
         }

         var Sun_geometry = new THREE.SphereGeometry(sunsize, 50, 50);
         sun = new THREE.Mesh(Sun_geometry, Sun_material);
         Shaper(sun, 0, 0);

         var Background_geometry = new THREE.SphereGeometry(40000, 50, 50);
         background = new THREE.Mesh(Background_geometry, Background_material);
         Shaper(background, 0, 0);

         var Mercury_geometry = new THREE.SphereGeometry(mercurysize, 50, 50);
         mercury = new THREE.Mesh(Mercury_geometry, Mercury_material);
         Shaper(mercury, 100, 100);

         var Venus_geometry = new THREE.SphereGeometry(venussize, 50, 50);
         venus = new THREE.Mesh(Venus_geometry, Venus_material);
         Shaper(venus, 640, 100);

         var Earth_geometry = new THREE.SphereGeometry(earthsize, 50, 50);
         earth = new THREE.Mesh(Earth_geometry, Earth_material);
         Shaper(earth, -650, 110);

         var Mars_geometry = new THREE.SphereGeometry(marssize, 50, 50);
         mars = new THREE.Mesh(Mars_geometry, Mars_material);
         Shaper(mars, -750, -130);

         var Jupiter_geometry = new THREE.SphereGeometry(jupitersize, 50, 50);
         jupiter = new THREE.Mesh(Jupiter_geometry, Jupiter_material);
         Shaper(jupiter, 640, 250);

         var Saturn_geometry = new THREE.SphereGeometry(saturnsize, 50, 50);
         saturn = new THREE.Mesh(Saturn_geometry, Saturn_material);
         Shaper(saturn, 570, -360);

         var Uranus_geometry = new THREE.SphereGeometry(uranussize, 50, 50);
         uranus = new THREE.Mesh(Uranus_geometry, Uranus_material);
         uranus.rotation.set(0, 0, 190);
         Shaper(uranus, 850, -380);

         var Neptune_geometry = new THREE.SphereGeometry(neptunesize, 50, 50);
         neptune = new THREE.Mesh(Neptune_geometry, Neptune_material);
         Shaper(neptune, -850, 460);

         var ranNumb = Math.floor(Math.random() * 2) + 1;
         var Meteor_geometry = new THREE.DodecahedronGeometry(ranNumb, ranNumb);

         for (i = 0; i < 25; i++) {
             meteor = new THREE.Mesh(Meteor_geometry, Meteor_material);
             meteor.position.set((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000);
             meteor.rotation.set(Math.random(), Math.random(), Math.random());
             meteor.castShadow = true;
             meteor.receiveShadow = true;
             scenes[0].add(meteor);
         }

         var radius = 50,
             segments = 50,
             rings = createRings(radius, segments);

         function createRings(radius, segments) {
             return new THREE.Mesh(new THREE.XRingGeometry(1.2 * radius, 2 * radius, 2 * segments, 5, 0, Math.PI * 4), new THREE.MeshBasicMaterial({
                 map: loader.load('images/saturn-rings.png'),
                 side: THREE.DoubleSide,
                 transparent: true,
                 opacity: 0.6
             }));
         }
         scenes[0].add(rings);
         /********************************** LIGHT **********************************/
         var hemilight = new THREE.HemisphereLight(0xffffbb, 0xffffbb, 0.85);
         hemilight.visible = true;
         scenes[0].add(hemilight);

         var pointlight = new THREE.PointLight(0xffffff, 1, 1000);
         pointlight.position.set(0, 0, 0);
         scenes[0].add(pointlight);
         pointlight.power = 20;

         sunandlightgroup = new THREE.Object3D();
         sunandlightgroup.add(pointlight);
         sunandlightgroup.add(sun);
         sunandlightgroup.position.set(0, 0, 0);

         scenes[0].add(background, sunandlightgroup, earth, mars, venus, mercury, jupiter, saturn, uranus, neptune);
         saturn.add(rings);
         /********************************** EXOPLANETS **********************************/
         var randomloader = new THREE.TextureLoader();
         for (i = 0; i < dataset.length; i++) {
             var ri = THREE.Math.randInt(5, 60);
             exogeometry = new THREE.SphereGeometry(ri, 20, 20);
             exomaterial = new THREE.MeshPhongMaterial({
                 color: 0xFFFFFF,
                 bumpScale: 100,
                 specular: new THREE.Color(0xFFFFE0),
                 shininess: 5,
                 map: randomloader.load('images/faketextures/image' + THREE.Math.randInt(1, 15) + '.jpg')
             });

             exoplanet = new THREE.Mesh(exogeometry, exomaterial);
             var name = dataset[i]["Hostname"];
             exoplanet.name = name;
             exoplanet.position.x = THREE.Math.randInt(-4000, 4000);
             exoplanet.position.z = THREE.Math.randInt(-4000, 4000);

             // Assign meshes per scene/rig
             var sceneIndex = Math.floor(i / 10);
             scenes[sceneIndex + 1].userData.spinning.add(exoplanet);
             //  glow(exoplanet, 0xffffff, ri * 1.1);
         }
         /********************************** UNIVERSAL OBJECTS **********************************/
         var sceneIndex = Math.floor(i / Math.ceil(dataset.length));
         mercuryrotation = new THREE.Object3D(), venusrotation = new THREE.Object3D(), earthrotation = new THREE.Object3D(), marsrotation = new THREE.Object3D(),
             jupiterrotation = new THREE.Object3D(), saturnrotation = new THREE.Object3D(), uranusrotation = new THREE.Object3D(), neptunerotation = new THREE.Object3D();

         for (i = 0; i < Math.ceil(dataset.length); i++) {
             scenes.push(new THREE.Scene());
             var spinningRig = new THREE.Object3D();
             scenes[i].add(spinningRig);
             scenes[i].userData.spinningRig = spinningRig;
         }

         for (i = 1; i < Math.ceil((dataset.length / 5)); i++) {
             j = 2;
             var hemilightconcat = hemilight + j;
             hemilightconcat = hemilight.clone();
             var backgroundconcat = background + j;
             backgroundconcat = background.clone();
             var sunandlightgroupconcat = sunandlightgroup + j;
             sunandlightgroupconcat = sunandlightgroup.clone();
             glow(sunandlightgroupconcat, 0xcaca70, sunsize * 1.15);
             scenes[i].add(hemilightconcat, backgroundconcat, sunandlightgroupconcat);
             scenes[i].add = new THREE.FogExp2(0x000000, 0.00004);

             j++;
         }
         glow(sun, 0xcaca70, sunsize * 1.15);
         mercuryrotation.add(mercury), venusrotation.add(venus), earthrotation.add(earth), marsrotation.add(mars), jupiterrotation.add(jupiter), saturnrotation.add(saturn), uranusrotation.add(uranus), neptunerotation.add(neptune);
         scenes[0].add(mercuryrotation, venusrotation, earthrotation, marsrotation, jupiterrotation, saturnrotation, uranusrotation, neptunerotation);
         $("container").append(renderer.domElement);
     }
     /********************************** GROUPING LISTS **********************************/
     for (var i = 0; i < 10; i++) {
         dataset.push({
             "Hostname": "onzinplaneet" + i
         });
     }

     var index = 0;
     var array2 = [];
     var leftOver = dataset.length % 10;
     var groupsOfTen = (dataset.length - leftOver) / 10;
     for (var i = 0; i < groupsOfTen; i++) {
         array2.push([]);
         system[index + 1] = index++;
         for (var j = i * 10; j < i * 10 + 10; j++)
             array2[i].push(dataset[j]["Hostname"]);
     }

     if (leftOver > 0) {
         array2.push([]);
         for (var i = groupsOfTen * 10; i < dataset.length; i++)
             array2[array2.length - 1].push(dataset[i]["Hostname"]);
         system[index + 1] = index++;
     }
     /********************************** DAT.GUI INTERFACE **********************************/
     var gui = new dat.GUI({
         autoplace: false,
         width: 365
     });
     dat.GUI.toggleHide();

     var guiData = function() {
         this.system = 0;
         this.Sets = 0;
         this.guiControls;
     };

     var datdata = new guiData();
     solPlanets = {
         Mercury: 0,
         Venus: 1,
         Earth: 2,
         Mars: 3,
         Jupiter: 4,
         Saturn: 5,
         Uranus: 6,
         Neptune: 7
     };
     sets = [solPlanets, ...array2];

     var buttonSun = {
         'Free roam': function() {
             varSwitcher = 9;
         }
     };
     gui.add(buttonSun, 'Free roam');

     var guiControls = new function() {
             this.rotationX = 10;
         }
         //rotation speed
     gui.add(guiControls, 'rotationX').min(1).max(50).name("Set rotation speed");


     gui.add(datdata, 'system', system).name('Starsystem').onChange(function(value) {
         varSwitcher = 9;
         $('#starsystemtitle').css('visibility', 'hidden');
         $('#overlaytextplanet').hide();
         /********************************** TWEEN MOVEMENT **********************************/
         var from = {
             x: camera.position.x = 100,
             y: camera.position.y = 500,
             z: camera.position.z = 2000
         };

         var thereto = {
             x: camera.position.x = FAR,
             y: camera.position.y = FAR,
             z: camera.position.z = FAR
         };

         var tween = new TWEEN.Tween(from)
             .to(thereto, 3000)
             .easing(TWEEN.Easing.Linear.None)
             .onUpdate(function() {
                 camera.position.set(this.x, this.y, this.z);
                 camera.lookAt(new THREE.Vector3(0, 0, 0));
                 $('#comparison').hide();
                 $('#ftlcanvas').css('visibility', 'visible').fadeTo(1000, 0.7, function() {});
                 setTimeout(function() {
                     var sceneNumber = (+value + 1);
                     currentScene = scenes[sceneNumber - 1];
                 }, 1500);
             })

         .yoyo(true, 10000)
             .repeat(1)
             .onComplete(function() {
                 var sceneNumber = (+value + 1);
                 currentScene = scenes[sceneNumber - 1];

                 $('#ftlcanvas').css('visibility', 'hidden');
                 $('#ftlcanvas').css('opacity', '0');

                 if (sceneNumber == 1) {
                     starsystemtitle = "Solar system";
                 } else {
                     starsystemtitle = "Starsystem #" + sceneNumber;
                 }

                 $("#starsystemtitle").show().html(starsystemtitle).css({
                     'visibility': 'visible',
                     '-webkit-filter': 'blur(0.3px)',
                     '-moz-filter': 'blur(0.3px)',
                     '-o-filter': 'blur(0.3px)',
                     '-ms-filter': 'blur(0.3px)',
                     'filter': 'blur(0.3px)',
                     'cursor': 'default',
                     'padding': '0px 2px 2px 3px',
                     'border-width': '2px',
                     'border-bottom-width': '2px',
                     'border-bottom-color': 'White',
                     'border-bottom-style': 'solid',
                     'opacity': '0.8',
                     'font-size': '700%',
                     'padding': '1%',
                     'position': 'absolute',
                     'left': '50%',
                     'top': '50%',
                     'margin-left': function() {
                         return -$(this).outerWidth() / 2;
                     },
                     'margin-top': function() {
                         return -$(this).outerHeight() / 2;
                     }
                 });
                 $('#starsystemtitle').fadeTo(5000, 0.0, function() {
                     $('#starsystemtitle').css('visibility', 'hidden');
                 });
                 camera.lookAt(new THREE.Vector3(0, 0, 0));
             })
             .start();
         updatePlanets(value);
     });
     gui.add(datdata, 'Sets', sets[0]).name('Planet in this system').onChange(systemChange);

     function updatePlanets(id) {
         var controller = gui.__controllers[3];
         controller.remove();
         gui.add(datdata, 'Sets', sets[id]).name('Planet in this system').onChange(systemChange);
         $("#exoplanetinfo").hide();
         datdata.Sets = 0;
         gui.__controllers[2].updateDisplay();
     }

     function systemChange(value) {
         varSwitcher = (+value + 1);

         function addCommas(nStr) {
             nStr += '';
             x = nStr.split('.');
             x1 = x[0];
             x2 = x.length > 1 ? '.' + x[1] : '';
             var rgx = /(\d+)(\d{3})/;
             while (rgx.test(x1)) {
                 x1 = x1.replace(rgx, '$1' + '.' + '$2');
             }
             return x1 + x2;
         }

         switch (varSwitcher) {
             case 0:
                 break;
             case 1:
                 if (mercuryonce === 0) {
                     glow(mercury, 0x0a222a, mercurysize * 1.2);
                     mercuryonce++;
                 }
                 break;
             case 2:
                 if (venusonce === 0) {
                     glow(venus, 0xb07413, venussize * 1.15);
                     venusonce++;
                 }
                 break;
             case 3:
                 if (earthonce === 0) {
                     glow(earth, 0x1a393a, earthsize * 1.35);
                     earthonce++;
                 }
                 break;
             case 4:
                 if (marsonce === 0) {
                     glow(mars, 0xa12611, marssize * 1.2);
                     marsonce++;
                 }
                 break;
             case 5:
                 if (jupiteronce === 0) {
                     glow(jupiter, 0xa2884d, jupitersize);
                     jupiteronce++;
                 }
                 break;
             case 6:
                 if (saturnonce === 0) {
                     glow(saturn, 0x654625, saturnsize);
                     saturnonce++;
                 }
                 break;
             case 7:
                 if (uranusonce === 0) {
                     glow(uranus, 0x69c5ee, uranussize * 1.0);
                     uranusonce++;
                 }
                 break;
             case 8:
                 if (neptuneonce === 0) {
                     glow(neptune, 0x2e363c, neptunesize * 1.1);
                     neptuneonce++;
                 }
                 break;
         }
         /********************************** EXOPLANET BIO **********************************/
         function getInfo(info, hostname) {
             function search(am, im) {
                 if (am.Hostname === hostname) {
                     index = im;
                     return true;
                 }
             }

             var index;
             if (dataset.some(search)) {
                 return dataset[index][info];
             }
         }

         var name = value,
             resullt = dataset.indexOf(name),
             dist = getInfo('Distance [pc]', name),
             temp = getInfo('Effective Temperature [K]', name),
             mass = getInfo('Planet Mass or M*sin(i)[Jupiter mass]', name),
             radi = getInfo('Planet Radius [Jupiter radii]', name),
             dens = getInfo('Planet Density [g/cm**3]', name),
             rawdate = getInfo('Date of Last Update', name),
             correspNumb = getInfo('rowid', name),
             firstdate = moment(rawdate, 'DD/MM/YYYY'),
             nowdate = moment(new Date().toJSON().slice(0, 10)),
             date = nowdate.diff(firstdate, 'days'),
             pos = dataset.findIndex(function(entry) {
                 return entry.Hostname == value;
             }) + 1;
         var radirounded = (Math.round((Math.round(((radi * 11.2) * 12756)) / 12756) * 100) / 100);
         if (radirounded > 1) {
             radiword = "bigger";
         } else {
             radiword = "smaller";
         }
         if (radirounded > 10 || temp > 5500 || dens > 10) {
             lidw = "n ";
             typornot = "atypical";
         } else {
             lidw = " ";
             typornot = "typical";
         }
         if (radi !== null) {
             $('#comparison').hide();
             renderradi = "Its radius is <b>" + addCommas(Math.round(((radi * 11.2) * 12756))) + "</b> km in size. That's <b>" + radirounded + "</b>x " + radiword + " than Earth's. <br>";
         } else {
             renderradi = "Its radius is currently not yet confirmed.<br>";
         }
         if (temp !== null) {
             rendertemp = "Its Effective Temperature is <b>" + Math.round((temp / 1.375799)) + "</b> °C.<br>";
         } else {
             rendertemp = "Its Effective Temperature is currently not yet confirmed.<br>";
         }
         if (dist !== null) {
             renderdist = "It's <b>" + Math.round((dist * 3.26163344)) + "</b> light-years away from our solar system.<br>" +
                 "That'd take us <b>" + addCommas((Math.round((dist * 3.26163344)) * 21500)) + "</b> years to get there with current technology.<br>";
         } else {
             renderdist = "Its distance is currently not yet confirmed.<br>";
         }
         if (dens !== null) {
             renderdens = "</u>'s density is <b>" + dens + "</b> dense in g/cm<sup>3</sup>.<br>" + "<b>";
         } else {
             renderdens = "</u>'s density is currently not yet confirmed.<br>";
         }

         $("#exoplanetinfo").show(), $("#nearestplanetholder, #nearestPlanet, #overlaytextplanet, #distancegauge").hide();

         if (currentScene !== scenes[0]) {
             var match = dataset[pos]["Hostname"];
             var matchedobject = currentScene.getObjectByName(match, true);
             matchedobject.remove(camera);
             matchedobject.add(camera);
             camera.position.x = 0, camera.position.y = 0, camera.position.z = 22, camera.rotation.x = 0 * Math.PI / 180, camera.rotation.y = 0 * Math.PI / 180,
                 camera.rotation.z = 0 * Math.PI / 180;
             camera.position.x = matchedobject.position.x, camera.position.y = matchedobject.position.y, camera.position.z = matchedobject.position.z + 100;
         }

         var from = {
             x: camera.position.x,
             y: camera.position.y + 1500,
             z: camera.position.z
         };
         var to = {
             x: camera.position.x = 0,
             y: camera.position.y = 0,
             z: camera.position.z = 130
         };

         var tween = new TWEEN.Tween(from)
             .to(to, 800)
             .easing(TWEEN.Easing.Linear.None)
             .onUpdate(function() {
                 camera.position.set(this.x, this.y, this.z);
                 camera.lookAt(new THREE.Vector3(0, 0, 0));
             })
             .onComplete(function() {
                 camera.lookAt(new THREE.Vector3(0, 0, 0));
             })
             .start();

         $("#exoplanetinfo").hide();
         var hr, wr, h = 15,
             w = 15;
         $('#whitesphere2').children().animate({ height: h, width: h });
         setTimeout(callExoBio, 500);

         function callExoBio() {
             $("#starsystemtitle").hide();
             if (radi !== undefined) {
                 $("#exoplanetinfo").show().css('visibility', 'visible').html("<div id=\"exoname\"><h1><u>" + name + "<i></u>, </i></h1></div> is what this planet is called. <br>" + renderradi + renderdist + rendertemp + " Compared to Earth, its mass is <b>" + mass + "</b>x bigger. <br><u>" + name.toUpperCase() + "</u>" + //renderdens + 
                     "</b>'s confirmation entry was " + date + " days ago. It's a" + lidw + "<u>" + typornot + "</u>" + " planet.");
                 $('#comparison').show();
             } else {
                 $("#exoplanetinfo").show().css('visibility', 'visible').html("<div id=\"exoname\"><h1><u>" + name + "<i></u>, </i></h1></div> is what this planet is called. <br> Unfortunately, little else is known about this planet yet.");
                 $('#comparison').hide();
             }
             if (radi !== null) {
                 hr = h * radirounded, wr = w * radirounded;
                 $('#whitesphere1').animate({ height: h, width: w });
                 setTimeout(function() {
                     $('#whitesphere2').children().animate({ height: hr, width: wr });
                 }, 500);
             }
         }
     }
     /********************************** RETRIEVE DISTANCE **********************************/
     function getDistanceNumber(Planet) {
         return biodata.filter(function(biodata) {
             return biodata.Planet == Planet;
         });
     }
     var conversionLUT = {
         'million': 1,
         'billion': 1e3
     };

     function convertDistance(distStr) {
         let dist = distStr.split(" ");
         return dist[0] * conversionLUT[dist[1]] || 0;
     }

     function distanceFrom(planetObj) {
         return function(elem) {
             return Math.abs(convertDistance(elem.Distance) - convertDistance(planetObj.Distance));
         };
     }

     function getPlanetObject(planetName, dat = biodata) {
         return dat.find(d => d.Planet === planetName);
     }

     function findClosestPlanet(name, dat = biodata) {
         let distances = dat.map(distanceFrom(getPlanetObject(name)));
         let distToClosest = Math.min(...distances.filter(d => d > 0));
         let indOfClosest = distances.findIndex(d => d === distToClosest);
         return biodata[indOfClosest].Planet;
     }
     /********************************** RENDER LOOP **********************************/
     function render() {}

     function animate() {
         var w = window.innerWidth,
             h = window.innerHeight;
         sun.rotation.y += 0.001, mercury.rotation.y += 0.0009, venus.rotation.y += 0.0005, earth.rotation.y += 0.0005, mars.rotation.y += 0.0005, jupiter.rotation.y += 0.0005, saturn.rotation.y += 0.0005, uranus.rotation.y += 0.0007, neptune.rotation.y += 0.0005;
         renderer.setViewport(0, 0, w, h);
         currentScene.userData.spinningRig.rotation.y += 0.0005, currentScene.userData.spinning.rotation.y += 0.0005, mercuryrotation.rotation.y += 0.0005, venusrotation.rotation.y += 0.00025, earthrotation.rotation.y += 0.0004;
         marsrotation.rotation.y += 0.00005, jupiterrotation.rotation.y += 0.00015, saturnrotation.rotation.y += 0.00025, uranusrotation.rotation.y += 0.0001, neptunerotation.rotation.y += 0.0001, mercuryrotation.rotation.y += guiControls.rotationX / 2000;
         venusrotation.rotation.y += guiControls.rotationX / 2000, earthrotation.rotation.y += guiControls.rotationX / 2000, marsrotation.rotation.y += guiControls.rotationX / 2000, jupiterrotation.rotation.y += guiControls.rotationX / 2000;
         saturnrotation.rotation.y += guiControls.rotationX / 2000, uranusrotation.rotation.y += guiControls.rotationX / 2000, neptunerotation.rotation.y += guiControls.rotationX / 2000, currentScene.userData.spinning.rotation.y += guiControls.rotationX / 5000;
         sun.rotation.y += guiControls.rotationX / 5000, mercury.rotation.y += guiControls.rotationX / 5000, venus.rotation.y += -guiControls.rotationX / 5000, earth.rotation.y += guiControls.rotationX / 5000, mars.rotation.y += guiControls.rotationX / 5000;
         jupiter.rotation.y += guiControls.rotationX / 5000, saturn.rotation.y += guiControls.rotationX / 5000, uranus.rotation.x += -guiControls.rotationX / 5000, neptune.rotation.y += guiControls.rotationX / 5000, background.rotation.y += 0.0002;

         currentScene.visible = true;
         renderer.render(currentScene, camera);
         requestAnimationFrame(animate);
         TWEEN.update();
         /********************************** PLANETS SWITCHER **********************************/
         var Planet = "Mercury";

         function overLap(planetRotation, planetName, yPos, zPos) {
             controls.enabled = false;
             planetRotation.add(camera);
             $('#comparison').hide();
             camera.position.set(0, 0, 22), camera.rotation.set(0 * Math.PI / 180, 0 * Math.PI / 180, 0 * Math.PI / 180);
             camera.position.set(planetName.position.x, planetName.position.y + yPos, planetName.position.z + zPos);
             $("#exoplanetinfo").hide(), $("#nearestplanetholder, #nearestPlanet, #overlaytextplanet, #distancegauge").show();
             renderer.setViewport(w - mapWidth + 50, 0, mapWidth, mapHeight);
             renderer.render(scenes[0], mapCamera);
             return planetRotation;
         }

         switch (varSwitcher) {
             case 1:
                 overLap(mercuryrotation, mercury, 0, 15);
                 break;
             case 2:
                 overLap(venusrotation, venus, 0, 18);
                 Planet = "Venus";
                 break;
             case 3:
                 overLap(earthrotation, earth, 0, 16);
                 Planet = "Earth";
                 break;
             case 4:
                 overLap(marsrotation, mars, 0, 10);
                 Planet = "Mars";
                 break;
             case 5:
                 overLap(jupiterrotation, jupiter, 0, 180);
                 Planet = "Jupiter";
                 break;
             case 6:
                 overLap(saturnrotation, saturn, 5, 200);
                 Planet = "Saturn";
                 break;
             case 7:
                 overLap(uranusrotation, uranus, 0, 100);
                 Planet = "Uranus";
                 break;
             case 8:
                 overLap(neptunerotation, neptune, 0, 100);
                 Planet = "Neptune";
                 break;
             case 9:
                 sun.remove(glow);
                 controls.enabled = true;
                 $("#exoplanetinfo, #comparison").hide();
                 mercuryrotation.remove(camera), venusrotation.remove(camera), earthrotation.remove(camera), marsrotation.remove(camera), jupiterrotation.remove(camera), saturnrotation.remove(camera), uranusrotation.remove(camera), neptunerotation.remove(camera);
                 $("#distancegauge, #overlaytextplanet, #nearestplanetholder, #nearestPlanet").hide();
                 camera.position.set(camera.position.x, camera.position.y + 0, camera.position.z + 0);
                 break;
         }
         /********************************** INNERHTML **********************************/
         var rawFound = getDistanceNumber(Planet),
             found = rawFound[0].Distance;
         found = (found.length && found[0] == '-') ? found.slice(1) : found;
         var biofound = rawFound[0].Bio;
         biofound = (biofound.length && biofound[0] == '-') ? biofound.slice(1) : biofound;
         $("#distanceNumber").html(found), $("#overlaytextplanet").html(biofound), $("#nearestPlanet").html(findClosestPlanet(Planet));
         render();
         setInterval(render, 1000 / 60);
     }

     window.addEventListener('mousemove', onMouseMove, false);
     init(), animate();
     /********************************** CONTROLS **********************************/
     controls = new THREE.OrbitControls(camera, renderer.domElement);
     controls.addEventListener('change', render);

     $(window).resize(function() {
         SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
         camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT, camera.updateProjectionMatrix(), renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
     });
 });
