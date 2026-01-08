jQuery(document).ready(function($) {
    function onScrollInit(items, trigger) {
        items.each(function() {
            var osElement = $(this),
                osAnimationClass = osElement.attr('data-dwd-animation'),
                osAnimationDelay = osElement.attr('data-dwd-animation-delay');

            osElement.css({
                '-webkit-animation-delay': osAnimationDelay,
                '-moz-animation-delay': osAnimationDelay,
                'animation-delay': osAnimationDelay
            });
            var osTrigger = (trigger) ? trigger : osElement;

            osTrigger.waypoint({
                offset: '75%',
                handler: function() {
                    osElement.addClass('animated').addClass(osAnimationClass);
                }
            });
            osTrigger.waypoint({
                offset: 'bottom-in-view',
                handler: function() {
                    osElement.addClass('animated').addClass(osAnimationClass);
                }
            });

        });
    }
    onScrollInit($('.dwd-animation'));
    var btn = $(".dwd-aio .et_pb_button_wrapper .dwd-btn-hover");
    $(btn).hover(function() {
        if ($(this).hasClass('animated')) {
            $(this).removeClass('animated')
        }
        if ($(this).hasClass('dwd-animation')) {
            $(this).removeClass('dwd-animation')
        }
    });
    var dwd_whole_video_link = $('.dwd-whole-video-link-wrap .dwd-aio');
    $(dwd_whole_video_link).each(function(index, value) {
        var videourl = $(this, value).data('dwd-whole-video-link');
        $(this).wrap("<a href='" + videourl + "' class='dwd-whole-link-window dwd-popup-video'></a>");

    });

    var dwd_whole_link = $('.dwd-whole-link-wrap .dwd-aio');
    $(dwd_whole_link).each(function(index, value) {
        var normalurl = $(this, value).data('dwd-whole-link-url');
        if ($(this).hasClass('dwd-new-window')) {
            $(this).wrap("<a href='" + normalurl + "' class='dwd-whole-link-window' target='_blank'></a>");
        } else {
            $(this).wrap("<a href='" + normalurl + "' class='dwd-whole-link-window'></a>");
        }
    });

    var waypoints = $(".dwd-revealer-in").waypoint({
        handler: function(direction) {
            $(this.element).closest('.et_pb_aio_extended').addClass("fadeIn animated");
            $(this.element).addClass("visible fadeIn animated");
            $(this.element).next(".dwd-revealer").addClass("visible");
        },
        offset: '80%'
    });

    var ScrollingFade = $(".dwd-scrolling-fade").waypoint({
        handler: function(direction) {
            var ScrollTimelineIn = anime.timeline({
                duration: 600
            });
            var ScrollTimelineOut = anime.timeline({
                duration: 600
            });
            var main = this.element,
                title = this.element.querySelector('.et_pb_module_header'),
                divider = this.element.querySelector('.dwd-divider'),
                subhead = this.element.querySelector('.et_pb_fullwidth_header_subhead'),
                bgtext = this.element.querySelector('.dwd-background-text'),
                icon = this.element.querySelector('.et_pb_main_blurb_image'),
                description = this.element.querySelector('.dwd-perky-content-description'),
                btn = this.element.querySelector('.et_pb_button_wrapper');
            if (direction === 'down') {
                ScrollTimelineIn
                    .add({
                        targets: main,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        translateY: [30, 0],
                        easing: 'easeInOutQuart'
                    })
                    .add({
                        targets: title,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        translateY: [30, 0],
                        easing: 'easeInOutQuart',
                        offset: 20
                    })
                    .add({
                        targets: bgtext,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        translateY: [30, 0],
                        easing: 'easeInOutQuart',
                        offset: 50
                    })
                    .add({
                        targets: icon,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        translateY: [30, 0],
                        easing: 'easeInOutQuart',
                        offset: 100
                    })
                    .add({
                        targets: divider,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        translateY: [30, 0],
                        easing: 'easeInOutQuart',
                        offset: 150
                    })
                    .add({
                        targets: subhead,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        translateY: [30, 0],
                        easing: 'easeInOutQuart',
                        offset: 155
                    })
                    .add({
                        targets: description,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        translateY: [30, 0],
                        easing: 'easeInOutQuart',
                        offset: 200
                    })
                    .add({
                        targets: btn,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        translateY: [30, 0],
                        easing: 'easeInOutQuart',
                        offset: 300
                    });
            } else {
                ScrollTimelineOut
                    .add({
                        targets: btn,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        translateY: [0, 30],
                        easing: 'easeInOutQuart'
                    })
                    .add({
                        targets: description,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        translateY: [0, 30],
                        easing: 'easeInOutQuart',
                        offset: 50
                    })
                    .add({
                        targets: subhead,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        translateY: [0, 30],
                        easing: 'easeInOutQuart',
                        offset: 100
                    })
                    .add({
                        targets: divider,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        translateY: [0, 30],
                        easing: 'easeInOutQuart',
                        offset: 150
                    })
                    .add({
                        targets: icon,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        translateY: [0, 30],
                        easing: 'easeInOutQuart',
                        offset: 155
                    })
                    .add({
                        targets: bgtext,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        translateY: [0, 30],
                        easing: 'easeInOutQuart',
                        offset: 200
                    })
                    .add({
                        targets: title,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        translateY: [0, 30],
                        easing: 'easeInOutQuart',
                        offset: 300
                    })
                    .add({
                        targets: main,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        translateY: [0, 30],
                        easing: 'easeInOutQuart',
                        offset: 320
                    });
            }
        },
        offset: '80%'
    });


});