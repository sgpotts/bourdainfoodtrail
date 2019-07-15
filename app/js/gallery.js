var loadGalleryImage = function(frame) {
    var img = frame.find("img");
    if (!img.attr("src")) {
        var datasrc = img.attr("data-src");
        img.attr("src", datasrc);
    }
    return img;
};

var advance = function(gallery, direction) {
    gallery.find(".noNext").removeClass("noNext");
    var caption = gallery.find(".caption");
    var current = gallery.find(".active");
    var images = $(".gallery-img", gallery);
    var index = images.index(current);
    var direction;
    if (direction == "right") {
        var next = $(images[index + 1]);
        var afterNext = $(images[index + 2]);

    } else {
        var next = $(images[index - 1]);
        var afterNext = $(images[index - 2]);
    }

    if (images.index(next) < 0) return;

    var image = loadGalleryImage(next);
    if (afterNext) loadGalleryImage(afterNext);

    gallery.find(".count").html(next.attr('data-index')* 1 + 1);


    $(".post-active").removeClass("post-active")
    $(".left").removeClass("left")
    $(".right").removeClass("right")

    function getOpp(d) {
        if(d == "left") {
            return "right"
        } else {
            return "left"
        }
    }

    gallery.find(".beforeClick").removeClass('beforeClick');

    afterNext.addClass("post-active " + direction)

    next.addClass("active");
    current.removeClass("active");
    current.addClass("post-active " + getOpp(direction))
}

$(".newgallery").each(function() {
    var $this = $(this);
    var photoc = $(this).find(".active img").attr("alt");
    var $cont = $(this).find(".caption");

    $this.find(".caption").html($this.find(".active img").attr("alt"));

    if ($(this).find(".gallery-img").length < 2) {
        $(this).find(".arr").remove();
        return;
    }
    $(this).find(".arr").on("click", function() {
        var direction = $(this).attr("class");
        advance($this, direction.includes("next") ? "right" : "left");
        $this.find(".caption").html($this.find(".active img").attr("alt"));
    })
    // var touch = new Hammer();
    // touch.on("swiperight", () => advance($this, "left"));
    // touch.on("swipeleft", () => advance($this, "right"));
})

$(".active").next(".gallery-img").addClass("post-active right")
