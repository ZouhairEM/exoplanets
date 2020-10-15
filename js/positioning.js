 $(function() {
     $('#distancegauge, #nearestplanetholder').css({
         'position': 'absolute',
         'margin-left': function() {
             return -$(this).outerWidth() / 2
         }
     });
 });

 $(function() {
     $('#overlaytextplanet').css({
         'position': 'absolute',
         'top': '20%',
         'margin-left': function() {
             return -$(this).outerWidth() / 2
         }
     });
 });
