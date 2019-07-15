const restaurants = require("../data.json");
const photos = require("../photos.json");

$(document).ready(function() {

    if ($(window).width() > 480) {
        $(".leftSide").css("height", $(window).height() - $(".header").height())
    }

    require('./gallery')


    var map = L.map('map').setView([
        39.9078, -75.3879
    ], 13);
    var tileLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}' + (
        L.Browser.retina ?
        '@2x' :
        '') + '.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        // worldCopyJump: true,
        // retina: '@2x',
        // detectRetina: true
    }).addTo(map);



    var layerGroup = L.featureGroup().addTo(map);
    $(".expandButton").click(function() {
        $(".map-container").toggleClass("containerExpanded");
        var expandtext = $(".expandwrap").html();
        if (expandtext.includes("Expand")) {
            var minimizetext = expandtext.replace("Expand", "Minimize");
            $(".expandwrap").html(minimizetext);
        }
        if (expandtext.includes("Minimize")) {
            var minimizetext = expandtext.replace("Minimize", "Expand");
            $(".expandwrap").html(minimizetext);
        }
        map.removeLayer(tileLayer);
        map.removeLayer(layerGroup);

        setTimeout(function() {
            (tileLayer).addTo(map);
            (layerGroup).addTo(map);

            map.invalidateSize();
            map.fitBounds(layerGroup.getBounds());
        }, 300);
    })

    var icon = L.divIcon({
        className: 'icon',
        iconSize: 20,
        iconAnchor: [
            10, 31
        ],
        popupAnchor: [0, -25],
        html: '<i class="fa fa-map-pin"></i>'
    });




    function setMarkers() {
        restaurants.forEach(function(m, i) {
            if (m.lat) {
                var marker = L.marker([
                    m.lat, m.long
                ], {
                    // icon: L.divIcon({
                    //     className: "locationMarker",
                    //     iconSize: [
                    //         20, 20
                    //     ],
                    //     html: ''
                    // })
                    icon: icon
                });
                marker.data = m;
                m.marker = marker;
                marker.addTo(map);



                marker.bindPopup(`
                        <div class="popupText">
                        <div class="name">${m.name}</div>
                        <div class="address">${m.address}</div>
                        <div class="website">
                        <div class="markerScroll" data-scroll=""><a class="gotoRest">Scroll to restaurant</a></div>
                        </div>`);
                layerGroup.addLayer(marker);


                marker.on("click", function(e) {
                    var getname = e.target.data.name;
                    var jumpname = getname.replace(/\s+/g, '-').replace(/\.+/g, '').replace('&', 'and').replace(/\’+/g, '');

                    $(".gotoRest").click(function() {

                        var headerPosition = Number($('.header').height()) + Number($('.header').css('top').replace('px', ''));

                        $('html,body').animate({
                                scrollTop: $("#" + jumpname).offset().top - headerPosition
                            },
                            'slow');
                    })
                })
            }
        });
    }
    setMarkers();



    map.fitBounds(layerGroup.getBounds());

    map.scrollWheelZoom.disable();
    var tileURL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '.png';

    restaurants.forEach(function(r, i) {
        var mapName = 'lilMap' + (i + 1);

        if ($(`#${mapName}`).length > 0) {
            L.map(mapName, {
                zoomControl: false,
                scrollWheelZoom: false
            }).setView([r.lat, r.long], 14).addLayer(L.tileLayer(tileURL)).addLayer(L.marker([r.lat, r.long], {
                icon: icon
            }));
        }
    })


    $(".jItems a").each(function() {
        var $this = $(this);
        $this.on("click", function(e) {
            var getname = $(this).html();
            var jumpname = getname.replace(/\s+/g, '-').replace(/\.+/g, '').replace('&amp;', 'and').replace(/\’+/g, '');

            var headerPosition = Number($('.header').height()) + Number($('.header').css('top').replace('px', ''));
            $('html,body').animate({
                    scrollTop: $("#" + jumpname).offset().top - headerPosition
                },
                'slow');

        })
    })

    $(".returnTop").click(function(){
        var headerPosition = Number($('.header').height()) + Number($('.header').css('top').replace('px', ''));

        $('html,body').animate({
                scrollTop: $(".map-container").offset().top - $('.header').height()
            },
            '500');
    })
});

// $(window).scroll(function() {
//
//     if ($(window).width() > 480) {
//         var headerheight = $("#header").height();
//         var headerMargin = Number($("#header").css("top").replace("px",""));
//         $(".restaurant .stickyTitle").css("top", headerheight + headerMargin - 5);
//         $(".restaurant").each(function(r){
//             var $this = $(this);
//
//             if($(window).scrollTop() + (headerheight + headerMargin) >= $this.offset().top && $(window).scrollTop() + (headerheight + headerMargin) < $this.offset().top + $this.height()) {
//                 $this.find(".name").addClass("stickyHeading")
//                 $this.find(".location").addClass("stickyHeading")
//
//
//             } else if($(window).scrollTop() + (headerheight + headerMargin) < $this.offset().top){
//                 $this.find(".name").removeClass("stickyHeading")
//                 $this.find(".location").removeClass("stickyHeading")
//             }
//         })
//     }
//
//
//
//     //
//     // $('.restaurant').each(function(r){
//     //     var $this = $(this);
//     //     var nameTop = $this.find(".name").offset().top;
//     //     var rBottom = $this.position().top + $this.height();
//     //     console.log($this.find(".name").html().trim(),$(window).scrollTop(), rBottom)
//     //     if($(window).scrollTop() + (headerheight + headerMargin) >= nameTop && $(window).scrollTop() < rBottom) {
//     //         // console.log($this.find(".name").html().trim())
//     //         console.log($this.find(".name").html().trim(),$(window).scrollTop(), rBottom)
//     //
//     //     }
//     // })
//
//
// })
