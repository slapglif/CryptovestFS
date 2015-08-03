function ssc_init() {
    var i;
    if (document.body) {
        var n = document.body,
            r = document.documentElement,
            t = window.innerHeight,
            u = n.scrollHeight;
        ssc_root = document.compatMode.indexOf("CSS") >= 0 ? r : n;
        ssc_activeElement = n;
        ssc_initdone = !0;
        top != self ? ssc_frame = !0 : u > t && (n.offsetHeight <= t || r.offsetHeight <= t) && (ssc_root.style.height = "auto", ssc_root.offsetHeight <= t && (i = document.createElement("div"), i.style.clear = "both", n.appendChild(i)));
        ssc_fixedback || (n.style.backgroundAttachment = "scroll", r.style.backgroundAttachment = "scroll");
        ssc_keyboardsupport && ssc_addEvent("keydown", ssc_keydown)
    }
}

function ssc_scrollArray(n, t, i, r) {
    if (r || (r = 1e3), ssc_directionCheck(t, i), ssc_que.push({
            x: t,
            y: i,
            lastX: t < 0 ? .99 : -.99,
            lastY: i < 0 ? .99 : -.99,
            start: +new Date
        }), !ssc_pending) {
        var u = function() {
            for (var s, h, a, v, w = +new Date, c = 0, l = 0, e = 0; e < ssc_que.length; e++) {
                var f = ssc_que[e],
                    y = w - f.start,
                    p = y >= ssc_animtime,
                    o = p ? 1 : y / ssc_animtime;
                ssc_pulseAlgorithm && (o = ssc_pulse(o));
                s = f.x * o - f.lastX >> 0;
                h = f.y * o - f.lastY >> 0;
                c += s;
                l += h;
                f.lastX += s;
                f.lastY += h;
                p && (ssc_que.splice(e, 1), e--)
            }
            t && (a = n.scrollLeft, n.scrollLeft += c, c && n.scrollLeft === a && (t = 0));
            i && (v = n.scrollTop, n.scrollTop += l, l && n.scrollTop === v && (i = 0));
            t || i || (ssc_que = []);
            ssc_que.length ? setTimeout(u, r / ssc_framerate + 1) : ssc_pending = !1
        };
        setTimeout(u, 0);
        ssc_pending = !0
    }
}

function ssc_wheel(n) {
    var r, u, i, t;
    if (ssc_initdone || ssc_init(), r = n.target, u = ssc_overflowingAncestor(r), !u || n.defaultPrevented || ssc_isNodeName(ssc_activeElement, "embed") || ssc_isNodeName(r, "embed") && /\.pdf/i.test(r.src)) return !0;
    i = n.wheelDeltaX || 0;
    t = n.wheelDeltaY || 0;
    i || t || (t = n.wheelDelta || 0);
    Math.abs(i) > 1.2 && (i *= ssc_stepsize / 120);
    Math.abs(t) > 1.2 && (t *= ssc_stepsize / 120);
    ssc_scrollArray(u, -i, -t);
    n.preventDefault()
}

function ssc_keydown(n) {
    var u = n.target,
        s = n.ctrlKey || n.altKey || n.metaKey,
        f;
    if (/input|textarea|embed/i.test(u.nodeName) || u.isContentEditable || n.defaultPrevented || s || ssc_isNodeName(u, "button") && n.keyCode === ssc_key.spacebar) return !0;
    var o, e = 0,
        t = 0,
        i = ssc_overflowingAncestor(ssc_activeElement),
        r = i.clientHeight;
    i == document.body && (r = window.innerHeight);
    switch (n.keyCode) {
        case ssc_key.up:
            t = -ssc_arrowscroll;
            break;
        case ssc_key.down:
            t = ssc_arrowscroll;
            break;
        case ssc_key.spacebar:
            o = n.shiftKey ? 1 : -1;
            t = -o * r * .9;
            break;
        case ssc_key.pageup:
            t = -r * .9;
            break;
        case ssc_key.pagedown:
            t = r * .9;
            break;
        case ssc_key.home:
            t = -i.scrollTop;
            break;
        case ssc_key.end:
            f = i.scrollHeight - i.scrollTop - r;
            t = f > 0 ? f + 10 : 0;
            break;
        case ssc_key.left:
            e = -ssc_arrowscroll;
            break;
        case ssc_key.right:
            e = ssc_arrowscroll;
            break;
        default:
            return !0
    }
    ssc_scrollArray(i, e, t);
    n.preventDefault()
}

function ssc_mousedown(n) {
    ssc_activeElement = n.target
}

function ssc_setCache(n, t) {
    for (var i = n.length; i--;) ssc_cache[ssc_uniqueID(n[i])] = t;
    return t
}

function ssc_overflowingAncestor(n) {
    var t = [],
        r = ssc_root.scrollHeight,
        i;
    do {
        if (i = ssc_cache[ssc_uniqueID(n)], i) return ssc_setCache(t, i);
        if (t.push(n), r === n.scrollHeight) {
            if (!ssc_frame || ssc_root.clientHeight + 10 < r) return ssc_setCache(t, document.body)
        } else if (n.clientHeight + 10 < n.scrollHeight && (overflow = getComputedStyle(n, "").getPropertyValue("overflow"), overflow === "scroll" || overflow === "auto")) return ssc_setCache(t, n)
    } while (n = n.parentNode)
}

function ssc_addEvent(n, t, i) {
    window.addEventListener(n, t, i || !1)
}

function ssc_removeEvent(n, t, i) {
    window.removeEventListener(n, t, i || !1)
}

function ssc_isNodeName(n, t) {
    return n.nodeName.toLowerCase() === t.toLowerCase()
}

function ssc_directionCheck(n, t) {
    n = n > 0 ? 1 : -1;
    t = t > 0 ? 1 : -1;
    (ssc_direction.x !== n || ssc_direction.y !== t) && (ssc_direction.x = n, ssc_direction.y = t, ssc_que = [])
}

function ssc_pulse_(n) {
    var t, i, r;
    return n = n * ssc_pulseScale, n < 1 ? t = n - (1 - Math.exp(-n)) : (i = Math.exp(-1), n -= 1, r = 1 - Math.exp(-n), t = i + r * (1 - i)), t * ssc_pulseNormalize
}

function ssc_pulse(n) {
    return n >= 1 ? 1 : n <= 0 ? 0 : (ssc_pulseNormalize == 1 && (ssc_pulseNormalize /= ssc_pulse_(1)), ssc_pulse_(n))
}

function onYouTubePlayerAPIReady() {
    ytp.YTAPIReady || (ytp.YTAPIReady = !0, jQuery(document).trigger("YTAPIReady"))
}
var ssc_uniqueID, ischrome, ytp, Swiper;
jQuery.easing.jswing = jQuery.easing.swing;
jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function(n, t, i, r, u) {
            return jQuery.easing[jQuery.easing.def](n, t, i, r, u)
        },
        easeInQuad: function(n, t, i, r, u) {
            return r * (t /= u) * t + i
        },
        easeOutQuad: function(n, t, i, r, u) {
            return -r * (t /= u) * (t - 2) + i
        },
        easeInOutQuad: function(n, t, i, r, u) {
            return (t /= u / 2) < 1 ? r / 2 * t * t + i : -r / 2 * (--t * (t - 2) - 1) + i
        },
        easeInCubic: function(n, t, i, r, u) {
            return r * (t /= u) * t * t + i
        },
        easeOutCubic: function(n, t, i, r, u) {
            return r * ((t = t / u - 1) * t * t + 1) + i
        },
        easeInOutCubic: function(n, t, i, r, u) {
            return (t /= u / 2) < 1 ? r / 2 * t * t * t + i : r / 2 * ((t -= 2) * t * t + 2) + i
        },
        easeInQuart: function(n, t, i, r, u) {
            return r * (t /= u) * t * t * t + i
        },
        easeOutQuart: function(n, t, i, r, u) {
            return -r * ((t = t / u - 1) * t * t * t - 1) + i
        },
        easeInOutQuart: function(n, t, i, r, u) {
            return (t /= u / 2) < 1 ? r / 2 * t * t * t * t + i : -r / 2 * ((t -= 2) * t * t * t - 2) + i
        },
        easeInQuint: function(n, t, i, r, u) {
            return r * (t /= u) * t * t * t * t + i
        },
        easeOutQuint: function(n, t, i, r, u) {
            return r * ((t = t / u - 1) * t * t * t * t + 1) + i
        },
        easeInOutQuint: function(n, t, i, r, u) {
            return (t /= u / 2) < 1 ? r / 2 * t * t * t * t * t + i : r / 2 * ((t -= 2) * t * t * t * t + 2) + i
        },
        easeInSine: function(n, t, i, r, u) {
            return -r * Math.cos(t / u * (Math.PI / 2)) + r + i
        },
        easeOutSine: function(n, t, i, r, u) {
            return r * Math.sin(t / u * (Math.PI / 2)) + i
        },
        easeInOutSine: function(n, t, i, r, u) {
            return -r / 2 * (Math.cos(Math.PI * t / u) - 1) + i
        },
        easeInExpo: function(n, t, i, r, u) {
            return t == 0 ? i : r * Math.pow(2, 10 * (t / u - 1)) + i
        },
        easeOutExpo: function(n, t, i, r, u) {
            return t == u ? i + r : r * (-Math.pow(2, -10 * t / u) + 1) + i
        },
        easeInOutExpo: function(n, t, i, r, u) {
            return t == 0 ? i : t == u ? i + r : (t /= u / 2) < 1 ? r / 2 * Math.pow(2, 10 * (t - 1)) + i : r / 2 * (-Math.pow(2, -10 * --t) + 2) + i
        },
        easeInCirc: function(n, t, i, r, u) {
            return -r * (Math.sqrt(1 - (t /= u) * t) - 1) + i
        },
        easeOutCirc: function(n, t, i, r, u) {
            return r * Math.sqrt(1 - (t = t / u - 1) * t) + i
        },
        easeInOutCirc: function(n, t, i, r, u) {
            return (t /= u / 2) < 1 ? -r / 2 * (Math.sqrt(1 - t * t) - 1) + i : r / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + i
        },
        easeInElastic: function(n, t, i, r, u) {
            var o = 1.70158,
                f = 0,
                e = r;
            return t == 0 ? i : (t /= u) == 1 ? i + r : (f || (f = u * .3), e < Math.abs(r) ? (e = r, o = f / 4) : o = f / (2 * Math.PI) * Math.asin(r / e), -(e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * u - o) * 2 * Math.PI / f)) + i)
        },
        easeOutElastic: function(n, t, i, r, u) {
            var o = 1.70158,
                f = 0,
                e = r;
            return t == 0 ? i : (t /= u) == 1 ? i + r : (f || (f = u * .3), e < Math.abs(r) ? (e = r, o = f / 4) : o = f / (2 * Math.PI) * Math.asin(r / e), e * Math.pow(2, -10 * t) * Math.sin((t * u - o) * 2 * Math.PI / f) + r + i)
        },
        easeInOutElastic: function(n, t, i, r, u) {
            var o = 1.70158,
                f = 0,
                e = r;
            return t == 0 ? i : (t /= u / 2) == 2 ? i + r : (f || (f = u * .3 * 1.5), e < Math.abs(r) ? (e = r, o = f / 4) : o = f / (2 * Math.PI) * Math.asin(r / e), t < 1) ? -.5 * e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * u - o) * 2 * Math.PI / f) + i : e * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * u - o) * 2 * Math.PI / f) * .5 + r + i
        },
        easeInBack: function(n, t, i, r, u, f) {
            return f == undefined && (f = 1.70158), r * (t /= u) * t * ((f + 1) * t - f) + i
        },
        easeOutBack: function(n, t, i, r, u, f) {
            return f == undefined && (f = 1.70158), r * ((t = t / u - 1) * t * ((f + 1) * t + f) + 1) + i
        },
        easeInOutBack: function(n, t, i, r, u, f) {
            return (f == undefined && (f = 1.70158), (t /= u / 2) < 1) ? r / 2 * t * t * (((f *= 1.525) + 1) * t - f) + i : r / 2 * ((t -= 2) * t * (((f *= 1.525) + 1) * t + f) + 2) + i
        },
        easeInBounce: function(n, t, i, r, u) {
            return r - jQuery.easing.easeOutBounce(n, u - t, 0, r, u) + i
        },
        easeOutBounce: function(n, t, i, r, u) {
            return (t /= u) < 1 / 2.75 ? r * 7.5625 * t * t + i : t < 2 / 2.75 ? r * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + i : t < 2.5 / 2.75 ? r * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + i : r * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + i
        },
        easeInOutBounce: function(n, t, i, r, u) {
            return t < u / 2 ? jQuery.easing.easeInBounce(n, t * 2, 0, r, u) * .5 + i : jQuery.easing.easeOutBounce(n, t * 2 - u, 0, r, u) * .5 + r * .5 + i
        }
    }),
    function(n) {
        "use strict";
        n.fn.fitVids = function(t) {
            var i = {
                    customSelector: null
                },
                r = document.createElement("div"),
                u = document.getElementsByTagName("base")[0] || document.getElementsByTagName("script")[0];
            return r.className = "fit-vids-style", r.innerHTML = "&shy;<style> .fluid-width-video-wrapper { width: 100%; position: relative; padding: 0; } .fluid-width-video-wrapper iframe, .fluid-width-video-wrapper object, .fluid-width-video-wrapper embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } <\/style>", u.parentNode.insertBefore(r, u), t && n.extend(i, t), this.each(function() {
                var t = ["iframe[src*='player.vimeo.com']", "iframe[src*='www.youtube.com']", "iframe[src*='www.youtube-nocookie.com']", "iframe[src*='www.kickstarter.com']", "object", "embed"],
                    r;
                i.customSelector && t.push(i.customSelector);
                r = n(this).find(t.join(","));
                r.each(function() {
                    var t = n(this),
                        i;
                    if (!("embed" === this.tagName.toLowerCase() && t.parent("object").length || t.parent(".fluid-width-video-wrapper").length)) {
                        var r = "object" === this.tagName.toLowerCase() || t.attr("height") && !isNaN(parseInt(t.attr("height"), 10)) ? parseInt(t.attr("height"), 10) : t.height(),
                            u = isNaN(parseInt(t.attr("width"), 10)) ? t.width() : parseInt(t.attr("width"), 10),
                            f = r / u;
                        t.attr("id") || (i = "fitvid" + Math.floor(999999 * Math.random()), t.attr("id", i));
                        t.wrap('<div class="fluid-width-video-wrapper"><\/div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * f + "%");
                        t.removeAttr("height").removeAttr("width")
                    }
                })
            })
        }
    }(jQuery),
    function(n) {
        "use strict";
        var t = function() {
            var t = {
                    bcClass: "sf-breadcrumb",
                    menuClass: "sf-js-enabled",
                    anchorClass: "sf-with-ul",
                    menuArrowClass: "sf-arrows"
                },
                f = function() {
                    var t = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                    return t && n(window).load(function() {
                        n("body").children().on("click", n.noop)
                    }), t
                }(),
                l = function() {
                    var n = document.documentElement.style;
                    return "behavior" in n && "fill" in n && /iemobile/i.test(navigator.userAgent)
                }(),
                e = function(n, i) {
                    var r = t.menuClass;
                    i.cssArrows && (r += " " + t.menuArrowClass);
                    n.toggleClass(r)
                },
                a = function(i, r) {
                    return i.find("li." + r.pathClass).slice(0, r.pathLevels).addClass(r.hoverClass + " " + t.bcClass).filter(function() {
                        return n(this).children(r.popUpSelector).hide().show().length
                    }).removeClass(r.pathClass)
                },
                o = function(n) {
                    n.children("a").toggleClass(t.anchorClass)
                },
                s = function(n) {
                    var t = n.css("ms-touch-action");
                    t = "pan-y" === t ? "auto" : "pan-y";
                    n.css("ms-touch-action", t)
                },
                v = function(t, r) {
                    var o = "li:has(" + r.popUpSelector + ")",
                        e;
                    n.fn.hoverIntent && !r.disableHI ? t.hoverIntent(i, u, o) : t.on("mouseenter.superfish", o, i).on("mouseleave.superfish", o, u);
                    e = "MSPointerDown.superfish";
                    f || (e += " touchend.superfish");
                    l && (e += " mousedown.superfish");
                    t.on("focusin.superfish", "li", i).on("focusout.superfish", "li", u).on(e, "a", r, y)
                },
                y = function(t) {
                    var r = n(this),
                        u = r.siblings(t.data.popUpSelector);
                    u.length > 0 && u.is(":hidden") && (r.one("click.superfish", !1), "MSPointerDown" === t.type ? r.trigger("focus") : n.proxy(i, r.parent("li"))())
                },
                i = function() {
                    var t = n(this),
                        i = r(t);
                    clearTimeout(i.sfTimer);
                    t.siblings().superfish("hide").end().superfish("show")
                },
                u = function() {
                    var i = n(this),
                        t = r(i);
                    f ? n.proxy(h, i, t)() : (clearTimeout(t.sfTimer), t.sfTimer = setTimeout(n.proxy(h, i, t), t.delay))
                },
                h = function(t) {
                    t.retainPath = n.inArray(this[0], t.$path) > -1;
                    this.superfish("hide");
                    this.parents("." + t.hoverClass).length || (t.onIdle.call(c(this)), t.$path.length && n.proxy(i, t.$path)())
                },
                c = function(n) {
                    return n.closest("." + t.menuClass)
                },
                r = function(n) {
                    return c(n).data("sf-options")
                };
            return {
                hide: function(t) {
                    var u, i;
                    if (this.length) {
                        if (u = this, i = r(u), !i) return this;
                        var o = i.retainPath === !0 ? i.$path : "",
                            f = u.find("li." + i.hoverClass).add(this).not(o).removeClass(i.hoverClass).children(i.popUpSelector),
                            e = i.speedOut;
                        t && (f.show(), e = 0);
                        i.retainPath = !1;
                        i.onBeforeHide.call(f);
                        f.stop(!0, !0).animate(i.animationOut, e, function() {
                            var t = n(this);
                            i.onHide.call(t)
                        })
                    }
                    return this
                },
                show: function() {
                    var n = r(this),
                        i, t;
                    return n ? (i = this.addClass(n.hoverClass), t = i.children(n.popUpSelector), n.onBeforeShow.call(t), t.stop(!0, !0).animate(n.animation, n.speed, function() {
                        n.onShow.call(t)
                    }), this) : this
                },
                destroy: function() {
                    return this.each(function() {
                        var u, r = n(this),
                            i = r.data("sf-options");
                        return i ? (u = r.find(i.popUpSelector).parent("li"), clearTimeout(i.sfTimer), e(r, i), o(u), s(r), r.off(".superfish").off(".hoverIntent"), u.children(i.popUpSelector).attr("style", function(n, t) {
                            return t.replace(/display[^;]+;?/g, "")
                        }), i.$path.removeClass(i.hoverClass + " " + t.bcClass).addClass(i.pathClass), r.find("." + i.hoverClass).removeClass(i.hoverClass), i.onDestroy.call(r), r.removeData("sf-options"), void 0) : !1
                    })
                },
                init: function(i) {
                    return this.each(function() {
                        var u = n(this),
                            r, f;
                        if (u.data("sf-options")) return !1;
                        r = n.extend({}, n.fn.superfish.defaults, i);
                        f = u.find(r.popUpSelector).parent("li");
                        r.$path = a(u, r);
                        u.data("sf-options", r);
                        e(u, r);
                        o(f);
                        s(u);
                        v(u, r);
                        f.not("." + t.bcClass).superfish("hide", !0);
                        r.onInit.call(this)
                    })
                }
            }
        }();
        n.fn.superfish = function(i) {
            return t[i] ? t[i].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof i && i ? n.error("Method " + i + " does not exist on jQuery.fn.superfish") : t.init.apply(this, arguments)
        };
        n.fn.superfish.defaults = {
            popUpSelector: "ul,.sf-mega",
            hoverClass: "sfHover",
            pathClass: "overrideThisToUse",
            pathLevels: 1,
            delay: 800,
            animation: {
                opacity: "show"
            },
            animationOut: {
                opacity: "hide"
            },
            speed: "normal",
            speedOut: "fast",
            cssArrows: !0,
            disableHI: !1,
            onInit: n.noop,
            onBeforeShow: n.noop,
            onShow: n.noop,
            onBeforeHide: n.noop,
            onHide: n.noop,
            onIdle: n.noop,
            onDestroy: n.noop
        };
        n.fn.extend({
            hideSuperfishUl: t.hide,
            showSuperfishUl: t.show
        })
    }(jQuery),
    function(n) {
        n.fn.hoverIntent = function(t, i, r) {
            var u = {
                interval: 100,
                sensitivity: 7,
                timeout: 0
            };
            u = typeof t == "object" ? n.extend(u, t) : n.isFunction(i) ? n.extend(u, {
                over: t,
                out: i,
                selector: r
            }) : n.extend(u, {
                over: t,
                out: t,
                selector: i
            });
            var f, e, o, s, h = function(n) {
                    f = n.pageX;
                    e = n.pageY
                },
                c = function(t, i) {
                    if (i.hoverIntent_t = clearTimeout(i.hoverIntent_t), Math.abs(o - f) + Math.abs(s - e) < u.sensitivity) return n(i).off("mousemove.hoverIntent", h), i.hoverIntent_s = 1, u.over.apply(i, [t]);
                    o = f;
                    s = e;
                    i.hoverIntent_t = setTimeout(function() {
                        c(t, i)
                    }, u.interval)
                },
                a = function(n, t) {
                    return t.hoverIntent_t = clearTimeout(t.hoverIntent_t), t.hoverIntent_s = 0, u.out.apply(t, [n])
                },
                l = function(t) {
                    var r = jQuery.extend({}, t),
                        i = this;
                    if (i.hoverIntent_t && (i.hoverIntent_t = clearTimeout(i.hoverIntent_t)), t.type == "mouseenter") {
                        o = r.pageX;
                        s = r.pageY;
                        n(i).on("mousemove.hoverIntent", h);
                        i.hoverIntent_s != 1 && (i.hoverIntent_t = setTimeout(function() {
                            c(r, i)
                        }, u.interval))
                    } else n(i).off("mousemove.hoverIntent", h), i.hoverIntent_s == 1 && (i.hoverIntent_t = setTimeout(function() {
                        a(r, i)
                    }, u.timeout))
                };
            return this.on({
                "mouseenter.hoverIntent": l,
                "mouseleave.hoverIntent": l
            }, u.selector)
        }
    }(jQuery);
! function(n, t, i) {
    "object" == typeof module && module && "object" == typeof module.exports ? module.exports = i : (n[t] = i, "function" == typeof define && define.amd && define(t, [], function() {
        return i
    }))
}(this, "jRespond", function(n, t, i) {
    "use strict";
    return function(n) {
        var r = [],
            u = [],
            f = n,
            t = "",
            e = "",
            s = 0,
            y = 100,
            h = 500,
            o = h,
            p = function() {
                return "number" != typeof innerWidth ? 0 !== document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth : window.innerWidth
            },
            w = function(n) {
                if (n.length === i) c(n);
                else
                    for (var t = 0; t < n.length; t++) c(n[t])
            },
            c = function(n) {
                var o = n.breakpoint,
                    f = n.enter || i;
                r.push(n);
                u.push(!1);
                a(o) && (f !== i && f.call(null, {
                    entering: t,
                    exiting: e
                }), u[r.length - 1] = !0)
            },
            l = function() {
                for (var v, f, o, s = [], h = [], n = 0; n < r.length; n++) {
                    var y = r[n].breakpoint,
                        c = r[n].enter || i,
                        l = r[n].exit || i;
                    "*" === y ? (c !== i && s.push(c), l !== i && h.push(l)) : a(y) ? (c === i || u[n] || s.push(c), u[n] = !0) : (l !== i && u[n] && h.push(l), u[n] = !1)
                }
                for (v = {
                        entering: t,
                        exiting: e
                    }, f = 0; f < h.length; f++) h[f].call(null, v);
                for (o = 0; o < s.length; o++) s[o].call(null, v)
            },
            b = function(n) {
                for (var r = !1, i = 0; i < f.length; i++)
                    if (n >= f[i].enter && n <= f[i].exit) {
                        r = !0;
                        break
                    }
                r && t !== f[i].label ? (e = t, t = f[i].label, l()) : r || "" === t || (t = "", l())
            },
            a = function(n) {
                if ("object" == typeof n) {
                    if (n.join().indexOf(t) >= 0) return !0
                } else if ("*" === n || "string" == typeof n && t === n) return !0
            },
            v = function() {
                var n = p();
                n !== s ? (o = y, b(n)) : o = h;
                s = n;
                setTimeout(v, o)
            };
        return v(), {
            addFunc: function(n) {
                w(n)
            },
            getBreakpoint: function() {
                return t
            }
        }
    }
}(this, this.document));
var ssc_framerate = 150,
    ssc_animtime = 500,
    ssc_stepsize = 150,
    ssc_pulseAlgorithm = !0,
    ssc_pulseScale = 6,
    ssc_pulseNormalize = 1,
    ssc_keyboardsupport = !0,
    ssc_arrowscroll = 50,
    ssc_frame = !1,
    ssc_direction = {
        x: 0,
        y: 0
    },
    ssc_initdone = !1,
    ssc_fixedback = !0,
    ssc_root = document.documentElement,
    ssc_activeElement, ssc_key = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36
    },
    ssc_que = [],
    ssc_pending = !1,
    ssc_cache = {};
if (setInterval(function() {
        ssc_cache = {}
    }, 1e4), ssc_uniqueID = function() {
        var n = 0;
        return function(t) {
            return t.ssc_uniqueID || (t.ssc_uniqueID = n++)
        }
    }(), ischrome = /chrome/.test(navigator.userAgent.toLowerCase()), ischrome && (ssc_addEvent("mousedown", ssc_mousedown), ssc_addEvent("mousewheel", ssc_wheel), ssc_addEvent("load", ssc_init)), ! function(n) {
        var t = 0;
        n.fn.scrolled = function(i, r) {
            "function" == typeof i && (r = i, i = 300);
            var u = "scrollTimer" + t++;
            this.scroll(function() {
                var t = n(this),
                    f = t.data(u);
                f && clearTimeout(f);
                f = setTimeout(function() {
                    t.removeData(u);
                    r.call(t[0])
                }, i);
                t.data(u, f)
            })
        }
    }(jQuery), ytp = ytp || {}, ! function(n, t) {
        var i = navigator.userAgent,
            o, r, u, e, s, f;
        n.browser || (n.browser = {}, n.browser.mozilla = !1, n.browser.webkit = !1, n.browser.opera = !1, n.browser.safari = !1, n.browser.chrome = !1, n.browser.msie = !1, n.browser.ua = i, n.browser.name = navigator.appName, n.browser.fullVersion = "" + parseFloat(navigator.appVersion), n.browser.majorVersion = parseInt(navigator.appVersion, 10), -1 != (r = i.indexOf("Opera")) ? (n.browser.opera = !0, n.browser.name = "Opera", n.browser.fullVersion = i.substring(r + 6), -1 != (r = i.indexOf("Version")) && (n.browser.fullVersion = i.substring(r + 8))) : -1 != (r = i.indexOf("MSIE")) ? (n.browser.msie = !0, n.browser.name = "Microsoft Internet Explorer", n.browser.fullVersion = i.substring(r + 5)) : -1 != i.indexOf("Trident") ? (n.browser.msie = !0, n.browser.name = "Microsoft Internet Explorer", e = i.indexOf("rv:") + 3, s = e + 4, n.browser.fullVersion = i.substring(e, s)) : -1 != (r = i.indexOf("Chrome")) ? (n.browser.webkit = !0, n.browser.chrome = !0, n.browser.name = "Chrome", n.browser.fullVersion = i.substring(r + 7)) : -1 != (r = i.indexOf("Safari")) ? (n.browser.webkit = !0, n.browser.safari = !0, n.browser.name = "Safari", n.browser.fullVersion = i.substring(r + 7), -1 != (r = i.indexOf("Version")) && (n.browser.fullVersion = i.substring(r + 8))) : -1 != (r = i.indexOf("AppleWebkit")) ? (n.browser.webkit = !0, n.browser.name = "Safari", n.browser.fullVersion = i.substring(r + 7), -1 != (r = i.indexOf("Version")) && (n.browser.fullVersion = i.substring(r + 8))) : -1 != (r = i.indexOf("Firefox")) ? (n.browser.mozilla = !0, n.browser.name = "Firefox", n.browser.fullVersion = i.substring(r + 8)) : (o = i.lastIndexOf(" ") + 1) < (r = i.lastIndexOf("/")) && (n.browser.name = i.substring(o, r), n.browser.fullVersion = i.substring(r + 1), n.browser.name.toLowerCase() == n.browser.name.toUpperCase() && (n.browser.name = navigator.appName)), -1 != (u = n.browser.fullVersion.indexOf(";")) && (n.browser.fullVersion = n.browser.fullVersion.substring(0, u)), -1 != (u = n.browser.fullVersion.indexOf(" ")) && (n.browser.fullVersion = n.browser.fullVersion.substring(0, u)), n.browser.majorVersion = parseInt("" + n.browser.fullVersion, 10), isNaN(n.browser.majorVersion) && (n.browser.fullVersion = "" + parseFloat(navigator.appVersion), n.browser.majorVersion = parseInt(navigator.appVersion, 10)), n.browser.version = n.browser.majorVersion);
        n.browser.android = /Android/i.test(i);
        n.browser.blackberry = /BlackBerry|BB|PlayBook/i.test(i);
        n.browser.ios = /iPhone|iPad|iPod|webOS/i.test(i);
        n.browser.operaMobile = /Opera Mini/i.test(i);
        n.browser.kindle = /Kindle|Silk/i.test(i);
        n.browser.windowsMobile = /IEMobile|Windows Phone/i.test(i);
        n.browser.mobile = n.browser.android || n.browser.blackberry || n.browser.ios || n.browser.windowsMobile || n.browser.operaMobile || n.browser.kindle;
        t.isDevice = n.browser.mobile;
        n.fn.CSSAnimate = function(t, i, r, u, f) {
            function o(n) {
                return n.replace(/([A-Z])/g, function(n) {
                    return "-" + n.toLowerCase()
                })
            }

            function e(n, t) {
                return "string" != typeof n || n.match(/^[\-0-9\.]+$/) ? "" + n + t : n
            }
            return n.support.CSStransition = function() {
                var n = (document.body || document.documentElement).style;
                return void 0 !== n.transition || void 0 !== n.WebkitTransition || void 0 !== n.MozTransition || void 0 !== n.MsTransition || void 0 !== n.OTransition
            }(), this.each(function() {
                var l = this,
                    a = n(this),
                    v, s, c, y, h;
                if (l.id = l.id || "CSSA_" + (new Date).getTime(), v = v || {
                        type: "noEvent"
                    }, l.CSSAIsRunning && l.eventType == v.type) l.CSSqueue = function() {
                    a.CSSAnimate(t, i, r, u, f)
                };
                else if (l.CSSqueue = null, l.eventType = v.type, 0 !== a.length && t) {
                    if (l.CSSAIsRunning = !0, "function" == typeof i && (f = i, i = n.fx.speeds._default), "function" == typeof r && (f = r, r = 0), "function" == typeof u && (f = u, u = "cubic-bezier(0.65,0.03,0.36,0.72)"), "string" == typeof i)
                        for (s in n.fx.speeds) {
                            if (i == s) {
                                i = n.fx.speeds[s];
                                break
                            }
                            i = n.fx.speeds._default
                        }
                    if (i || (i = n.fx.speeds._default), n.support.CSStransition) {
                        v = {
                            "default": "ease",
                            "in": "ease-in",
                            out: "ease-out",
                            "in-out": "ease-in-out",
                            snap: "cubic-bezier(0,1,.5,1)",
                            easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
                            easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
                            easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
                            easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
                            easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
                            easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
                            easeOutExpo: "cubic-bezier(.19,1,.22,1)",
                            easeInOutExpo: "cubic-bezier(1,0,0,1)",
                            easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
                            easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
                            easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
                            easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
                            easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
                            easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
                            easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
                            easeOutQuint: "cubic-bezier(.23,1,.32,1)",
                            easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
                            easeInSine: "cubic-bezier(.47,0,.745,.715)",
                            easeOutSine: "cubic-bezier(.39,.575,.565,1)",
                            easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
                            easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
                            easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
                            easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
                        };
                        v[u] && (u = v[u]);
                        c = "";
                        y = "transitionEnd";
                        n.browser.webkit ? (c = "-webkit-", y = "webkitTransitionEnd") : n.browser.mozilla ? (c = "-moz-", y = "transitionend") : n.browser.opera ? (c = "-o-", y = "otransitionend") : n.browser.msie && (c = "-ms-", y = "msTransitionEnd");
                        v = [];
                        for (h in t) s = h, "transform" === s && (s = c + "transform", t[s] = t[h], delete t[h]), "filter" === s && (s = c + "filter", t[s] = t[h], delete t[h]), ("transform-origin" === s || "origin" === s) && (s = c + "transform-origin", t[s] = t[h], delete t[h]), "x" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " translateX(" + e(t[h], "px") + ")", delete t[h]), "y" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " translateY(" + e(t[h], "px") + ")", delete t[h]), "z" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " translateZ(" + e(t[h], "px") + ")", delete t[h]), "rotate" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " rotate(" + e(t[h], "deg") + ")", delete t[h]), "rotateX" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " rotateX(" + e(t[h], "deg") + ")", delete t[h]), "rotateY" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " rotateY(" + e(t[h], "deg") + ")", delete t[h]), "rotateZ" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " rotateZ(" + e(t[h], "deg") + ")", delete t[h]), "scale" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " scale(" + e(t[h], "") + ")", delete t[h]), "scaleX" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " scaleX(" + e(t[h], "") + ")", delete t[h]), "scaleY" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " scaleY(" + e(t[h], "") + ")", delete t[h]), "scaleZ" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " scaleZ(" + e(t[h], "") + ")", delete t[h]), "skew" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " skew(" + e(t[h], "deg") + ")", delete t[h]), "skewX" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " skewX(" + e(t[h], "deg") + ")", delete t[h]), "skewY" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " skewY(" + e(t[h], "deg") + ")", delete t[h]), "perspective" === s && (s = c + "transform", t[s] = t[s] || "", t[s] += " perspective(" + e(t[h], "px") + ")", delete t[h]), 0 > v.indexOf(s) && v.push(o(s));
                        var h = v.join(","),
                            w = function() {
                                a.off(y + "." + l.id);
                                clearTimeout(l.timeout);
                                a.css(c + "transition", "");
                                "function" == typeof f && f(a);
                                l.called = !0;
                                l.CSSAIsRunning = !1;
                                "function" == typeof l.CSSqueue && (l.CSSqueue(), l.CSSqueue = null)
                            },
                            p = {};
                        n.extend(p, t);
                        p[c + "transition-property"] = h;
                        p[c + "transition-duration"] = i + "ms";
                        p[c + "transition-delay"] = r + "ms";
                        p[c + "transition-style"] = "preserve-3d";
                        p[c + "transition-timing-function"] = u;
                        setTimeout(function() {
                            a.one(y + "." + l.id, w);
                            a.css(p)
                        }, 1);
                        l.timeout = setTimeout(function() {
                            a.called || !f ? (a.called = !1, l.CSSAIsRunning = !1) : (a.css(c + "transition", ""), f(a), l.CSSAIsRunning = !1, "function" == typeof l.CSSqueue && (l.CSSqueue(), l.CSSqueue = null))
                        }, i + r + 100)
                    } else {
                        for (h in t) "transform" === h && delete t[h], "filter" === h && delete t[h], "transform-origin" === h && delete t[h], "auto" === t[h] && delete t[h];
                        f && "string" != typeof f || (f = "linear");
                        a.animate(t, i, f)
                    }
                }
            })
        };
        f = function(n) {
            return "http://youtu.be/" == n.substr(0, 16) ? n.replace("http://youtu.be/", "") : "https://youtu.be/" == n.substr(0, 17) ? n.replace("https://youtu.be/", "") : n.indexOf("http") > -1 ? n.match(/[\\?&]v=([^&#]*)/)[1] : n
        };
        n.mbYTPlayer = {
            name: "jquery.mb.YTPlayer",
            version: "2.7.2",
            author: "Matteo Bicocchi",
            defaults: {
                containment: "body",
                ratio: "16/9",
                videoURL: null,
                startAt: 0,
                stopAt: 0,
                autoPlay: !0,
                vol: 100,
                addRaster: !1,
                opacity: 1,
                quality: "default",
                mute: !1,
                loop: !0,
                showControls: !0,
                showAnnotations: !1,
                showYTLogo: !0,
                stopMovieOnClick: !1,
                realfullscreen: !0,
                gaTrack: !0,
                onReady: function() {},
                onStateChange: function() {},
                onPlaybackQualityChange: function() {},
                onError: function() {}
            },
            controls: {
                play: "P",
                pause: "p",
                mute: "M",
                unmute: "A",
                onlyYT: "O",
                showSite: "R",
                ytLogo: "Y"
            },
            rasterImg: "images/raster.png",
            rasterImgRetina: "images/raster@2x.png",
            locationProtocol: "https:",
            buildPlayer: function(i) {
                return this.each(function() {
                    var YTPlayer = this,
                        $YTPlayer = n(YTPlayer),
                        property, canGoFullscreen, playerID, videoID, playerBox, overlay, classN, retina, wrapper, tag;
                    YTPlayer.loop = 0;
                    YTPlayer.opt = {};
                    $YTPlayer.addClass("mb_YTVPlayer");
                    property = $YTPlayer.data("property") && "string" == typeof $YTPlayer.data("property") ? eval("(" + $YTPlayer.data("property") + ")") : $YTPlayer.data("property");
                    "undefined" != typeof property && "undefined" != typeof property.vol && (property.vol = 0 == property.vol ? property.vol = 1 : property.vol);
                    n.extend(YTPlayer.opt, n.mbYTPlayer.defaults, i, property);
                    canGoFullscreen = !(n.browser.msie || n.browser.opera || self.location.href != top.location.href);
                    canGoFullscreen || (YTPlayer.opt.realfullscreen = !1);
                    $YTPlayer.attr("id") || $YTPlayer.attr("id", "YTP_" + (new Date).getTime());
                    YTPlayer.opt.id = YTPlayer.id;
                    YTPlayer.isAlone = !1;
                    YTPlayer.hasFocus = !0;
                    playerID = "mbYTP_" + YTPlayer.id;
                    videoID = this.opt.videoURL ? f(this.opt.videoURL) : $YTPlayer.attr("href") ? f($YTPlayer.attr("href")) : !1;
                    YTPlayer.videoID = videoID;
                    YTPlayer.opt.showAnnotations = YTPlayer.opt.showAnnotations ? "0" : "3";
                    var playerVars = {
                            autoplay: 0,
                            modestbranding: 1,
                            controls: 0,
                            showinfo: 0,
                            rel: 0,
                            enablejsapi: 1,
                            version: 3,
                            playerapiid: playerID,
                            origin: "*",
                            allowfullscreen: !0,
                            wmode: "transparent",
                            iv_load_policy: YTPlayer.opt.showAnnotations
                        },
                        canPlayHTML5 = !1,
                        v = document.createElement("video");
                    if (v.canPlayType && (canPlayHTML5 = !0), canPlayHTML5 && n.extend(playerVars, {
                            html5: 1
                        }), n.browser.msie && n.browser.version < 9 && (this.opt.opacity = 1), playerBox = n("<div/>").attr("id", playerID).addClass("playerBox"), overlay = n("<div/>").css({
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%"
                        }).addClass("YTPOverlay"), YTPlayer.isSelf = "self" == YTPlayer.opt.containment, YTPlayer.opt.containment = n("self" == YTPlayer.opt.containment ? this : YTPlayer.opt.containment), YTPlayer.isBackground = "body" == YTPlayer.opt.containment.get(0).tagName.toLowerCase(), !YTPlayer.isBackground || !t.backgroundIsInited) {
                        if (YTPlayer.opt.containment.is(n(this)) ? YTPlayer.isPlayer = !0 : $YTPlayer.hide(), t.isDevice && YTPlayer.isBackground) return void $YTPlayer.remove();
                        YTPlayer.opt.addRaster ? (classN = "dot" == YTPlayer.opt.addRaster ? "raster-dot" : "raster", retina = window.retina || window.devicePixelRatio > 1, overlay.addClass(retina ? classN + " retina" : classN)) : overlay.removeClass(function(t, i) {
                            var u = i.split(" "),
                                r = [];
                            return n.each(u, function(n, t) {
                                /raster-.*/.test(t) && r.push(t)
                            }), r.push("retina"), r.join(" ")
                        });
                        wrapper = n("<div/>").addClass("mbYTP_wrapper").attr("id", "wrapper_" + playerID);
                        (wrapper.css({
                            position: "absolute",
                            zIndex: 0,
                            minWidth: "100%",
                            minHeight: "100%",
                            left: 0,
                            top: 0,
                            overflow: "hidden",
                            opacity: 0
                        }), playerBox.css({
                            position: "absolute",
                            zIndex: 0,
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                            overflow: "hidden",
                            opacity: this.opt.opacity
                        }), wrapper.append(playerBox), YTPlayer.opt.containment.children().not("script, style").each(function() {
                            "static" == n(this).css("position") && n(this).css("position", "relative")
                        }), YTPlayer.isBackground ? (n("body").css({
                            position: "absolute",
                            minWidth: "100%",
                            minHeight: "100%",
                            zIndex: 1,
                            boxSizing: "border-box"
                        }), wrapper.css({
                            position: "fixed",
                            top: 0,
                            left: 0,
                            zIndex: 0,
                            webkitTransform: "translateZ(0)"
                        }), $YTPlayer.hide()) : "static" == YTPlayer.opt.containment.css("position") && YTPlayer.opt.containment.css({
                            position: "relative"
                        }), YTPlayer.opt.containment.prepend(wrapper), YTPlayer.wrapper = wrapper, playerBox.css({
                            opacity: 1
                        }), t.isDevice || (playerBox.after(overlay), YTPlayer.overlay = overlay), YTPlayer.isBackground || overlay.on("mouseenter", function() {
                            $YTPlayer.find(".mb_YTVPBar").addClass("visible")
                        }).on("mouseleave", function() {
                            $YTPlayer.find(".mb_YTVPBar").removeClass("visible")
                        }), t.YTAPIReady) ? setTimeout(function() {
                            n(document).trigger("YTAPIReady")
                        }, 100): (n("#YTAPI").remove(), tag = n("<script><\/script>").attr({
                            src: n.mbYTPlayer.locationProtocol + "//www.youtube.com/player_api?v=" + n.mbYTPlayer.version,
                            id: "YTAPI"
                        }), n("head title").after(tag));
                        n(document).on("YTAPIReady", function() {
                            YTPlayer.isBackground && t.backgroundIsInited || YTPlayer.isInit || (YTPlayer.isBackground && YTPlayer.opt.stopMovieOnClick && n(document).off("mousedown.ytplayer").on("mousedown,.ytplayer", function(t) {
                                var i = n(t.target);
                                (i.is("a") || i.parents().is("a")) && $YTPlayer.pauseYTP()
                            }), YTPlayer.isBackground && (t.backgroundIsInited = !0), YTPlayer.opt.autoPlay = "undefined" == typeof YTPlayer.opt.autoPlay ? YTPlayer.isBackground ? !0 : !1 : YTPlayer.opt.autoPlay, YTPlayer.opt.vol = YTPlayer.opt.vol ? YTPlayer.opt.vol : 100, n.mbYTPlayer.getDataFromFeed(YTPlayer.videoID, YTPlayer), n(YTPlayer).on("YTPChanged", function() {
                                if (!YTPlayer.isInit) return YTPlayer.isInit = !0, t.isDevice && !YTPlayer.isBackground ? void new YT.Player(playerID, {
                                    videoId: YTPlayer.videoID.toString(),
                                    height: "100%",
                                    width: "100%",
                                    videoId: YTPlayer.videoID,
                                    events: {
                                        onReady: function(n) {
                                            YTPlayer.player = n.target;
                                            playerBox.css({
                                                opacity: 1
                                            });
                                            YTPlayer.wrapper.css({
                                                opacity: YTPlayer.opt.opacity
                                            });
                                            $YTPlayer.optimizeDisplay()
                                        },
                                        onStateChange: function() {}
                                    }
                                }) : void new YT.Player(playerID, {
                                    videoId: YTPlayer.videoID.toString(),
                                    playerVars: playerVars,
                                    events: {
                                        onReady: function(t) {
                                            if (YTPlayer.player = t.target, !YTPlayer.isReady) {
                                                YTPlayer.isReady = !0;
                                                YTPlayer.playerEl = YTPlayer.player.getIframe();
                                                $YTPlayer.optimizeDisplay();
                                                YTPlayer.videoID = videoID;
                                                n(window).on("resize.YTP", function() {
                                                    $YTPlayer.optimizeDisplay()
                                                });
                                                YTPlayer.opt.showControls && n(YTPlayer).buildYTPControls();
                                                var i = YTPlayer.opt.startAt ? YTPlayer.opt.startAt : 1;
                                                YTPlayer.player.setVolume(0);
                                                n(YTPlayer).muteYTPVolume();
                                                n.mbYTPlayer.checkForState(YTPlayer);
                                                YTPlayer.checkForStartAt = setInterval(function() {
                                                    var t = YTPlayer.player.getVideoLoadedFraction() > i / YTPlayer.player.getDuration();
                                                    YTPlayer.player.getDuration() > 0 && YTPlayer.player.getCurrentTime() >= i && t ? (clearInterval(YTPlayer.checkForStartAt), YTPlayer.player.setVolume(0), n(YTPlayer).muteYTPVolume(), "function" == typeof YTPlayer.opt.onReady && YTPlayer.opt.onReady($YTPlayer), YTPlayer.opt.mute || n(YTPlayer).unmuteYTPVolume(), n.mbYTPlayer.checkForState(YTPlayer), YTPlayer.player.pauseVideo(), setTimeout(function() {
                                                        YTPlayer.opt.autoPlay ? ($YTPlayer.playYTP(), $YTPlayer.css("background-image", "none")) : YTPlayer.player.pauseVideo();
                                                        YTPlayer.wrapper.CSSAnimate({
                                                            opacity: YTPlayer.isAlone ? 1 : YTPlayer.opt.opacity
                                                        }, 2e3)
                                                    }, 100)) : (YTPlayer.player.playVideo(), YTPlayer.player.seekTo(i, !0))
                                                }, n.browser.chrome ? 1e3 : 1)
                                            }
                                        },
                                        onStateChange: function(event) {
                                            var state, controls, data, startAt;
                                            if ("function" == typeof event.target.getPlayerState) {
                                                if (state = event.target.getPlayerState(), "function" == typeof YTPlayer.opt.onStateChange && YTPlayer.opt.onStateChange($YTPlayer, state), controls = n("#controlBar_" + YTPlayer.id), data = YTPlayer.opt, 0 == state) {
                                                    if (YTPlayer.state == state) return;
                                                    YTPlayer.state = state;
                                                    YTPlayer.player.pauseVideo();
                                                    startAt = YTPlayer.opt.startAt ? YTPlayer.opt.startAt : 1;
                                                    data.loop ? (YTPlayer.wrapper.css({
                                                        opacity: 0
                                                    }), $YTPlayer.playYTP(), YTPlayer.player.seekTo(startAt, !0)) : YTPlayer.isBackground || (YTPlayer.player.seekTo(startAt, !0), $YTPlayer.playYTP(), setTimeout(function() {
                                                        $YTPlayer.pauseYTP()
                                                    }, 10));
                                                    !data.loop && YTPlayer.isBackground ? YTPlayer.wrapper.CSSAnimate({
                                                        opacity: 0
                                                    }, 2e3) : data.loop && (YTPlayer.wrapper.css({
                                                        opacity: 0
                                                    }), YTPlayer.loop++);
                                                    controls.find(".mb_YTVPPlaypause").html(n.mbYTPlayer.controls.play);
                                                    n(YTPlayer).trigger("YTPEnd")
                                                }
                                                if (3 == state) {
                                                    if (YTPlayer.state == state) return;
                                                    YTPlayer.state = state;
                                                    n.browser.chrome || YTPlayer.player.setPlaybackQuality(YTPlayer.opt.quality);
                                                    controls.find(".mb_YTVPPlaypause").html(n.mbYTPlayer.controls.play);
                                                    n(YTPlayer).trigger("YTPBuffering")
                                                }
                                                if (-1 == state) {
                                                    if (YTPlayer.state == state) return;
                                                    YTPlayer.state = state;
                                                    n(YTPlayer).trigger("YTPUnstarted")
                                                }
                                                if (1 == state) {
                                                    if (YTPlayer.state == state) return;
                                                    YTPlayer.state = state;
                                                    n.browser.chrome || YTPlayer.player.setPlaybackQuality(YTPlayer.opt.quality);
                                                    controls.find(".mb_YTVPPlaypause").html(n.mbYTPlayer.controls.pause);
                                                    n(YTPlayer).trigger("YTPStart");
                                                    "undefined" != typeof _gaq && eval(YTPlayer.opt.gaTrack) && _gaq.push(["_trackEvent", "YTPlayer", "Play", YTPlayer.title || YTPlayer.videoID.toString()]);
                                                    "undefined" != typeof ga && eval(YTPlayer.opt.gaTrack) && ga("send", "event", "YTPlayer", "play", YTPlayer.title || YTPlayer.videoID.toString())
                                                }
                                                if (2 == state) {
                                                    if (YTPlayer.state == state) return;
                                                    YTPlayer.state = state;
                                                    controls.find(".mb_YTVPPlaypause").html(n.mbYTPlayer.controls.play);
                                                    n(YTPlayer).trigger("YTPPause")
                                                }
                                            }
                                        },
                                        onPlaybackQualityChange: function() {
                                            "function" == typeof YTPlayer.opt.onPlaybackQualityChange && YTPlayer.opt.onPlaybackQualityChange($YTPlayer)
                                        },
                                        onError: function(t) {
                                            150 == t.data && (console.log("Embedding this video is restricted by Youtube."), YTPlayer.isPlayList && n(YTPlayer).playNext());
                                            2 == t.data && YTPlayer.isPlayList && n(YTPlayer).playNext();
                                            "function" == typeof YTPlayer.opt.onError && YTPlayer.opt.onError($YTPlayer, t)
                                        }
                                    }
                                })
                            }))
                        })
                    }
                })
            },
            getDataFromFeed: function(t, i) {
                i.videoID = t;
                n.browser.msie ? ("auto" == i.opt.ratio ? i.opt.ratio = "16/9" : i.opt.ratio, i.hasData || (i.hasData = !0, setTimeout(function() {
                    n(i).trigger("YTPChanged")
                }, 100))) : (n.getJSON(n.mbYTPlayer.locationProtocol + "//gdata.youtube.com/feeds/api/videos/" + t + "?v=2&alt=jsonc", function(t) {
                    var r, u;
                    i.dataReceived = !0;
                    r = t.data;
                    (i.title = r.title, i.videoData = r, "auto" == i.opt.ratio && (i.opt.ratio = r.aspectRatio && "widescreen" === r.aspectRatio ? "16/9" : "4/3"), !i.hasData && (i.hasData = !0, i.isPlayer)) && (u = i.videoData.thumbnail.hqDefault, i.opt.containment.css({
                        background: "rgba(0,0,0,0.5) url(" + u + ") center center",
                        backgroundSize: "cover"
                    }));
                    n(i).trigger("YTPChanged")
                }), setTimeout(function() {
                    i.dataReceived || i.hasData || (i.hasData = !0, n(i).trigger("YTPChanged"))
                }, 1500))
            },
            getVideoID: function() {
                var n = this.get(0);
                return n.videoID || !1
            },
            setVideoQuality: function(t) {
                var i = this.get(0);
                n.browser.chrome || i.player.setPlaybackQuality(t)
            },
            YTPlaylist: function(t, i, r) {
                var u = this.get(0);
                u.isPlayList = !0;
                i && (t = n.shuffle(t));
                u.videoID || (u.videos = t, u.videoCounter = 0, u.videoLength = t.length, n(u).data("property", t[0]), n(u).mb_YTPlayer());
                "function" == typeof r && n(u).on("YTPChanged", function() {
                    r(u)
                });
                n(u).on("YTPEnd", function() {
                    n(u).playNext()
                })
            },
            playNext: function() {
                var t = this.get(0);
                t.videoCounter++;
                t.videoCounter >= t.videoLength && (t.videoCounter = 0);
                n(t.playerEl).css({
                    opacity: 0
                });
                n(t).changeMovie(t.videos[t.videoCounter])
            },
            playPrev: function() {
                var t = this.get(0);
                t.videoCounter--;
                t.videoCounter < 0 && (t.videoCounter = t.videoLength - 1);
                n(t.playerEl).css({
                    opacity: 0
                });
                n(t).changeMovie(t.videos[t.videoCounter])
            },
            changeMovie: function(t) {
                var i = this.get(0),
                    r, u;
                i.opt.startAt = 0;
                i.opt.stopAt = 0;
                i.opt.mute = !0;
                t && n.extend(i.opt, t);
                i.videoID = f(i.opt.videoURL);
                n(i).pauseYTP();
                r = n.browser.msie ? 1e3 : 0;
                (n(i.playerEl).CSSAnimate({
                    opacity: 0
                }, r), setTimeout(function() {
                    var t = n.browser.chrome ? "default" : i.opt.quality;
                    n(i).getPlayer().cueVideoByUrl(encodeURI(n.mbYTPlayer.locationProtocol + "//www.youtube.com/v/" + i.videoID), 1, t);
                    n(i).playYTP();
                    n(i).one("YTPStart", function() {
                        i.wrapper.CSSAnimate({
                            opacity: i.isAlone ? 1 : i.opt.opacity
                        }, 1e3);
                        n(i.playerEl).CSSAnimate({
                            opacity: 1
                        }, r);
                        i.opt.startAt && i.player.seekTo(i.opt.startAt);
                        n.mbYTPlayer.checkForState(i);
                        i.opt.autoPlay || n(i).pauseYTP()
                    });
                    i.opt.mute ? n(i).muteYTPVolume() : n(i).unmuteYTPVolume()
                }, r), i.opt.addRaster) ? (u = window.retina || window.devicePixelRatio > 1, i.overlay.addClass(u ? "raster retina" : "raster")) : (i.overlay.removeClass("raster"), i.overlay.removeClass("retina"));
                n("#controlBar_" + i.id).remove();
                i.opt.showControls && n(i).buildYTPControls();
                n.mbYTPlayer.getDataFromFeed(i.videoID, i);
                n(i).optimizeDisplay()
            },
            getPlayer: function() {
                return n(this).get(0).player
            },
            playerDestroy: function() {
                var i = this.get(0),
                    r;
                t.YTAPIReady = !1;
                t.backgroundIsInited = !1;
                i.isInit = !1;
                i.videoID = null;
                r = i.wrapper;
                r.remove();
                n("#controlBar_" + i.id).remove()
            },
            fullscreen: function(real) {
                function RunPrefixMethod(n, t) {
                    for (var i, f, r = ["webkit", "moz", "ms", "o", ""], u = 0; u < r.length && !n[i];) {
                        if (i = t, "" == r[u] && (i = i.substr(0, 1).toLowerCase() + i.substr(1)), i = r[u] + i, f = typeof n[i], "undefined" != f) return r = [r[u]], "function" == f ? n[i]() : n[i];
                        u++
                    }
                }

                function launchFullscreen(n) {
                    RunPrefixMethod(n, "RequestFullScreen")
                }

                function cancelFullscreen() {
                    (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) && RunPrefixMethod(document, "CancelFullScreen")
                }
                var YTPlayer = this.get(0),
                    fullscreenchange, playerState;
                "undefined" == typeof real && (real = YTPlayer.opt.realfullscreen);
                real = eval(real);
                var controls = n("#controlBar_" + YTPlayer.id),
                    fullScreenBtn = controls.find(".mb_OnlyYT"),
                    videoWrapper = YTPlayer.isSelf ? YTPlayer.opt.containment : YTPlayer.wrapper;
                if (real) {
                    fullscreenchange = n.browser.mozilla ? "mozfullscreenchange" : n.browser.webkit ? "webkitfullscreenchange" : "fullscreenchange";
                    n(document).off(fullscreenchange).on(fullscreenchange, function() {
                        var t = RunPrefixMethod(document, "IsFullScreen") || RunPrefixMethod(document, "FullScreen");
                        t ? (n(YTPlayer).setVideoQuality("default"), n(YTPlayer).trigger("YTPFullScreenStart")) : (YTPlayer.isAlone = !1, fullScreenBtn.html(n.mbYTPlayer.controls.onlyYT), n(YTPlayer).setVideoQuality(YTPlayer.opt.quality), videoWrapper.removeClass("fullscreen"), videoWrapper.CSSAnimate({
                            opacity: YTPlayer.opt.opacity
                        }, 500), videoWrapper.css({
                            zIndex: 0
                        }), YTPlayer.isBackground ? n("body").after(controls) : YTPlayer.wrapper.before(controls), n(window).resize(), n(YTPlayer).trigger("YTPFullScreenEnd"))
                    })
                }
                YTPlayer.isAlone ? (real ? cancelFullscreen() : (videoWrapper.CSSAnimate({
                    opacity: YTPlayer.opt.opacity
                }, 500), videoWrapper.css({
                    zIndex: 0
                })), fullScreenBtn.html(n.mbYTPlayer.controls.onlyYT), YTPlayer.isAlone = !1) : (real ? (playerState = YTPlayer.player.getPlayerState(), videoWrapper.css({
                    opacity: 0
                }), videoWrapper.addClass("fullscreen"), launchFullscreen(videoWrapper.get(0)), setTimeout(function() {
                    videoWrapper.CSSAnimate({
                        opacity: 1
                    }, 1e3);
                    YTPlayer.wrapper.append(controls);
                    n(YTPlayer).optimizeDisplay();
                    YTPlayer.player.seekTo(YTPlayer.player.getCurrentTime() + .1, !0)
                }, 500)) : videoWrapper.css({
                    zIndex: 1e4
                }).CSSAnimate({
                    opacity: 1
                }, 1e3), fullScreenBtn.html(n.mbYTPlayer.controls.showSite), YTPlayer.isAlone = !0)
            },
            playYTP: function() {
                var t = this.get(0),
                    i, r;
                "undefined" != typeof t.player && (i = n("#controlBar_" + t.id), r = i.find(".mb_YTVPPlaypause"), r.html(n.mbYTPlayer.controls.pause), t.player.playVideo(), t.wrapper.CSSAnimate({
                    opacity: t.isAlone ? 1 : t.opt.opacity
                }, 2e3), n(t).on("YTPStart", function() {
                    n(t).css("background-image", "none")
                }))
            },
            toggleLoops: function() {
                var t = this.get(0),
                    n = t.opt;
                1 == n.loop ? n.loop = 0 : (n.startAt ? t.player.seekTo(n.startAt) : t.player.playVideo(), n.loop = 1)
            },
            stopYTP: function() {
                var t = this.get(0),
                    i = n("#controlBar_" + t.id),
                    r = i.find(".mb_YTVPPlaypause");
                r.html(n.mbYTPlayer.controls.play);
                t.player.stopVideo()
            },
            pauseYTP: function() {
                var t = this.get(0),
                    i = (t.opt, n("#controlBar_" + t.id)),
                    r = i.find(".mb_YTVPPlaypause");
                r.html(n.mbYTPlayer.controls.play);
                t.player.pauseVideo()
            },
            seekToYTP: function(n) {
                var t = this.get(0);
                t.player.seekTo(n, !0)
            },
            setYTPVolume: function(t) {
                var i = this.get(0);
                t || i.opt.vol || 0 != i.player.getVolume() ? !t && i.player.getVolume() > 0 || t && i.player.getVolume() == t ? n(i).muteYTPVolume() : i.opt.vol = t : n(i).unmuteYTPVolume();
                i.player.setVolume(i.opt.vol)
            },
            muteYTPVolume: function() {
                var t = this.get(0),
                    i, r;
                t.player.mute();
                t.player.setVolume(0);
                i = n("#controlBar_" + t.id);
                r = i.find(".mb_YTVPMuteUnmute");
                r.html(n.mbYTPlayer.controls.unmute);
                n(t).addClass("isMuted");
                n(t).trigger("YTPMuted")
            },
            unmuteYTPVolume: function() {
                var t = this.get(0),
                    i, r;
                t.player.unMute();
                t.player.setVolume(t.opt.vol);
                i = n("#controlBar_" + t.id);
                r = i.find(".mb_YTVPMuteUnmute");
                r.html(n.mbYTPlayer.controls.mute);
                n(t).removeClass("isMuted");
                n(t).trigger("YTPUnmuted")
            },
            manageYTPProgress: function() {
                var t = this.get(0),
                    i = n("#controlBar_" + t.id),
                    f = i.find(".mb_YTVPProgress"),
                    e = i.find(".mb_YTVPLoaded"),
                    o = i.find(".mb_YTVTime"),
                    s = f.outerWidth(),
                    r = Math.floor(t.player.getCurrentTime()),
                    u = Math.floor(t.player.getDuration()),
                    h = r * s / u,
                    c = 100 * t.player.getVideoLoadedFraction();
                return e.css({
                    left: 0,
                    width: c + "%"
                }), o.css({
                    left: 0,
                    width: h
                }), {
                    totalTime: u,
                    currentTime: r
                }
            },
            buildYTPControls: function() {
                var YTPlayer = this.get(0),
                    data = YTPlayer.opt;
                if (data.showYTLogo = data.showYTLogo || data.printUrl, !n("#controlBar_" + YTPlayer.id).length) {
                    var controlBar = n("<span/>").attr("id", "controlBar_" + YTPlayer.id).addClass("mb_YTVPBar").css({
                            whiteSpace: "noWrap",
                            position: YTPlayer.isBackground ? "fixed" : "absolute",
                            zIndex: YTPlayer.isBackground ? 1e4 : 1e3
                        }).hide(),
                        buttonBar = n("<div/>").addClass("buttonBar"),
                        playpause = n("<span>" + n.mbYTPlayer.controls.play + "<\/span>").addClass("mb_YTVPPlaypause ytpicon").click(function() {
                            1 == YTPlayer.player.getPlayerState() ? n(YTPlayer).pauseYTP() : n(YTPlayer).playYTP()
                        }),
                        MuteUnmute = n("<span>" + n.mbYTPlayer.controls.mute + "<\/span>").addClass("mb_YTVPMuteUnmute ytpicon").click(function() {
                            0 == YTPlayer.player.getVolume() ? n(YTPlayer).unmuteYTPVolume() : n(YTPlayer).muteYTPVolume()
                        }),
                        idx = n("<span/>").addClass("mb_YTVPTime"),
                        vURL = data.videoURL ? data.videoURL : "";
                    vURL.indexOf("http") < 0 && (vURL = n.mbYTPlayer.locationProtocol + "//www.youtube.com/watch?v=" + data.videoURL);
                    var movieUrl = n("<span/>").html(n.mbYTPlayer.controls.ytLogo).addClass("mb_YTVPUrl ytpicon").attr("title", "view on YouTube").on("click", function() {
                            window.open(vURL, "viewOnYT")
                        }),
                        onlyVideo = n("<span/>").html(n.mbYTPlayer.controls.onlyYT).addClass("mb_OnlyYT ytpicon").on("click", function() {
                            n(YTPlayer).fullscreen(data.realfullscreen)
                        }),
                        progressBar = n("<div/>").addClass("mb_YTVPProgress").css("position", "absolute").click(function(n) {
                            timeBar.css({
                                width: n.clientX - timeBar.offset().left
                            });
                            YTPlayer.timeW = n.clientX - timeBar.offset().left;
                            controlBar.find(".mb_YTVPLoaded").css({
                                width: 0
                            });
                            var t = Math.floor(YTPlayer.player.getDuration());
                            YTPlayer.goto = timeBar.outerWidth() * t / progressBar.outerWidth();
                            YTPlayer.player.seekTo(parseFloat(YTPlayer.goto), !0);
                            controlBar.find(".mb_YTVPLoaded").css({
                                width: 0
                            })
                        }),
                        loadedBar = n("<div/>").addClass("mb_YTVPLoaded").css("position", "absolute"),
                        timeBar = n("<div/>").addClass("mb_YTVTime").css("position", "absolute");
                    progressBar.append(loadedBar).append(timeBar);
                    buttonBar.append(playpause).append(MuteUnmute).append(idx);
                    data.showYTLogo && buttonBar.append(movieUrl);
                    (YTPlayer.isBackground || eval(YTPlayer.opt.realfullscreen) && !YTPlayer.isBackground) && buttonBar.append(onlyVideo);
                    controlBar.append(buttonBar).append(progressBar);
                    YTPlayer.isBackground ? n("body").after(controlBar) : (controlBar.addClass("inlinePlayer"), YTPlayer.wrapper.before(controlBar));
                    controlBar.fadeIn()
                }
            },
            checkForState: function(t) {
                var i = t.opt.showControls ? 10 : 1e3;
                clearInterval(t.getState);
                t.getState = setInterval(function() {
                    var u = n(t).manageYTPProgress(),
                        r = n(t),
                        e = n("#controlBar_" + t.id),
                        o = t.opt,
                        f = t.opt.startAt ? t.opt.startAt : 1,
                        i = t.opt.stopAt > t.opt.startAt ? t.opt.stopAt : 0;
                    if (i = i < t.player.getDuration() ? i : 0, 0 == t.player.getVolume() ? r.addClass("isMuted") : r.removeClass("isMuted"), t.opt.showControls && e.find(".mb_YTVPTime").html(u.totalTime ? n.mbYTPlayer.formatTime(u.currentTime) + " / " + n.mbYTPlayer.formatTime(u.totalTime) : "-- : -- / -- : --"), document.hasFocus() ? document.hasFocus() && !t.hasFocus && (t.hasFocus = !0, r.playYTP()) : (t.hasFocus = !1, r.pauseYTP()), 1 == t.player.getPlayerState() && (parseFloat(t.player.getDuration() - 3) < t.player.getCurrentTime() || i > 0 && parseFloat(t.player.getCurrentTime()) > i)) {
                        if (t.isEnded) return;
                        if (t.isEnded = !0, setTimeout(function() {
                                t.isEnded = !1
                            }, 2e3), t.isPlayList) return clearInterval(t.getState), void n(t).trigger("YTPEnd");
                        o.loop ? t.player.seekTo(f, !0) : (t.player.pauseVideo(), t.wrapper.CSSAnimate({
                            opacity: 0
                        }, 1e3, function() {
                            if (n(t).trigger("YTPEnd"), t.player.seekTo(f, !0), !t.isBackground) {
                                var i = t.videoData.thumbnail.hqDefault;
                                n(t).css({
                                    background: "rgba(0,0,0,0.5) url(" + i + ") center center",
                                    backgroundSize: "cover"
                                })
                            }
                        }))
                    }
                }, i)
            },
            formatTime: function(n) {
                var t = Math.floor(n / 60),
                    i = Math.floor(n - 60 * t);
                return (9 >= t ? "0" + t : t) + " : " + (9 >= i ? "0" + i : i)
            }
        };
        n.fn.toggleVolume = function() {
            var t = this.get(0);
            if (t) return t.player.isMuted() ? (n(t).unmuteYTPVolume(), !0) : (n(t).muteYTPVolume(), !1)
        };
        n.fn.optimizeDisplay = function() {
            var f = this.get(0),
                e = f.opt,
                s = n(f.playerEl),
                i = {},
                o = f.wrapper;
            i.width = o.outerWidth();
            i.height = o.outerHeight();
            var r = 24,
                u = 100,
                t = {};
            t.width = i.width + i.width * r / 100;
            t.height = Math.ceil("16/9" == e.ratio ? 9 * i.width / 16 : 3 * i.width / 4);
            t.marginTop = -((t.height - i.height) / 2);
            t.marginLeft = -(i.width * (r / 2) / 100);
            t.height < i.height && (t.height = i.height + i.height * r / 100, t.width = Math.floor("16/9" == e.ratio ? 16 * i.height / 9 : 4 * i.height / 3), t.marginTop = -(i.height * (r / 2) / 100), t.marginLeft = -((t.width - i.width) / 2));
            t.width += u;
            t.height += u;
            t.marginTop -= u / 2;
            t.marginLeft -= u / 2;
            s.css({
                width: t.width,
                height: t.height,
                marginTop: t.marginTop,
                marginLeft: t.marginLeft
            })
        };
        n.shuffle = function(n) {
            for (var i, u, t = n.slice(), f = t.length, r = f; r--;) i = parseInt(Math.random() * f), u = t[r], t[r] = t[i], t[i] = u;
            return t
        };
        n.fn.mb_YTPlayer = n.mbYTPlayer.buildPlayer;
        n.fn.YTPlaylist = n.mbYTPlayer.YTPlaylist;
        n.fn.playNext = n.mbYTPlayer.playNext;
        n.fn.playPrev = n.mbYTPlayer.playPrev;
        n.fn.changeMovie = n.mbYTPlayer.changeMovie;
        n.fn.getVideoID = n.mbYTPlayer.getVideoID;
        n.fn.getPlayer = n.mbYTPlayer.getPlayer;
        n.fn.playerDestroy = n.mbYTPlayer.playerDestroy;
        n.fn.fullscreen = n.mbYTPlayer.fullscreen;
        n.fn.buildYTPControls = n.mbYTPlayer.buildYTPControls;
        n.fn.playYTP = n.mbYTPlayer.playYTP;
        n.fn.toggleLoops = n.mbYTPlayer.toggleLoops;
        n.fn.stopYTP = n.mbYTPlayer.stopYTP;
        n.fn.pauseYTP = n.mbYTPlayer.pauseYTP;
        n.fn.seekToYTP = n.mbYTPlayer.seekToYTP;
        n.fn.muteYTPVolume = n.mbYTPlayer.muteYTPVolume;
        n.fn.unmuteYTPVolume = n.mbYTPlayer.unmuteYTPVolume;
        n.fn.setYTPVolume = n.mbYTPlayer.setYTPVolume;
        n.fn.setVideoQuality = n.mbYTPlayer.setVideoQuality;
        n.fn.manageYTPProgress = n.mbYTPlayer.manageYTPProgress
    }(jQuery, ytp), function(n) {
        n.fn.appear = function(t, i) {
            var r = n.extend({
                data: undefined,
                one: !0,
                accX: 0,
                accY: 0
            }, i);
            return this.each(function() {
                var i = n(this);
                if (i.appeared = !1, !t) {
                    i.trigger("appear", r.data);
                    return
                }
                var u = n(window),
                    f = function() {
                        if (!i.is(":visible")) {
                            i.appeared = !1;
                            return
                        }
                        var n = u.scrollLeft(),
                            t = u.scrollTop(),
                            f = i.offset(),
                            e = f.left,
                            o = f.top,
                            s = r.accX,
                            h = r.accY,
                            c = i.height(),
                            l = u.height(),
                            a = i.width(),
                            v = u.width();
                        o + c + h >= t && o <= t + l + h && e + a + s >= n && e <= n + v + s ? i.appeared || i.trigger("appear", r.data) : i.appeared = !1
                    },
                    e = function() {
                        if (i.appeared = !0, r.one) {
                            u.unbind("scroll", f);
                            var e = n.inArray(f, n.fn.appear.checks);
                            e >= 0 && n.fn.appear.checks.splice(e, 1)
                        }
                        t.apply(this, arguments)
                    };
                if (r.one) i.one("appear", r.data, e);
                else i.bind("appear", r.data, e);
                u.scroll(f);
                n.fn.appear.checks.push(f);
                f()
            })
        };
        n.extend(n.fn.appear, {
            checks: [],
            timeout: null,
            checkAll: function() {
                var t = n.fn.appear.checks.length;
                if (t > 0)
                    while (t--) n.fn.appear.checks[t]()
            },
            run: function() {
                n.fn.appear.timeout && clearTimeout(n.fn.appear.timeout);
                n.fn.appear.timeout = setTimeout(n.fn.appear.checkAll, 20)
            }
        });
        n.each(["append", "prepend", "after", "before", "attr", "removeAttr", "addClass", "removeClass", "toggleClass", "remove", "css", "show", "hide"], function(t, i) {
            var r = n.fn[i];
            r && (n.fn[i] = function() {
                var t = r.apply(this, arguments);
                return n.fn.appear.run(), t
            })
        })
    }(jQuery), function(n) {
        "use strict";
        var i = "animsition",
            t = {
                init: function(r) {
                    var u, f;
                    return (r = n.extend({
                        inClass: "fade-in",
                        outClass: "fade-out",
                        inDuration: 1500,
                        outDuration: 800,
                        linkElement: ".animsition-link",
                        loading: !0,
                        loadingParentElement: "body",
                        loadingClass: "animsition-loading",
                        unSupportCss: ["animation-duration", "-webkit-animation-duration", "-o-animation-duration"],
                        overlay: !1,
                        overlayClass: "animsition-overlay-slide",
                        overlayParentElement: "body"
                    }, r), u = t.supportCheck.call(this, r), u === !1) ? ("console" in window || (window.console = {}, window.console.log = function(n) {
                        return n
                    }), console.log("Animsition does not support this browser."), t.destroy.call(this)) : (f = t.state.call(this, r), f === !0 && t.addOverlay.call(this, r), r.loading === !0 && t.addLoading.call(this, r), this.each(function() {
                        var u = this,
                            f = n(this),
                            e = n(window),
                            o = f.data(i);
                        if (!o) {
                            r = n.extend({}, r);
                            f.data(i, {
                                options: r
                            });
                            e.on("load." + i + " pageshow." + i, function() {
                                t.pageIn.call(u)
                            });
                            e.on("unload." + i, function() {});
                            n(r.linkElement).on("click." + i, function(i) {
                                i.preventDefault();
                                var r = n(this);
                                t.pageOut.call(u, r)
                            })
                        }
                    }))
                },
                supportCheck: function(t) {
                    var e = n(this),
                        u = t.unSupportCss,
                        f = u.length,
                        r = !1,
                        i;
                    for (f === 0 && (r = !0), i = 0; i < f; i++)
                        if (typeof e.css(u[i]) == "string") {
                            r = !0;
                            break
                        }
                    return r
                },
                state: function(t) {
                    var i = n(this);
                    return t.overlay === !0 || i.data("animsition-overlay") === !0 ? !0 : !1
                },
                addOverlay: function(t) {
                    n(t.overlayParentElement).prepend('<div class="' + t.overlayClass + '"><\/div>')
                },
                addLoading: function(t) {
                    n(t.loadingParentElement).append('<div class="' + t.loadingClass + '"><div class="css3-spinner-bounce1"><\/div><div class="css3-spinner-bounce2"><\/div><div class="css3-spinner-bounce3"><\/div><\/div>')
                },
                removeLoading: function() {
                    var r = n(this),
                        t = r.data(i).options,
                        u = n(t.loadingParentElement).children("." + t.loadingClass);
                    u.fadeOut().remove()
                },
                pageInClass: function() {
                    var t = n(this),
                        u = t.data(i).options,
                        r = t.data("animsition-in");
                    return typeof r == "string" ? r : u.inClass
                },
                pageInDuration: function() {
                    var t = n(this),
                        u = t.data(i).options,
                        r = t.data("animsition-in-duration");
                    return typeof r == "number" ? r : u.inDuration
                },
                pageIn: function() {
                    var r = this,
                        o = n(this),
                        u = o.data(i).options,
                        f = t.pageInClass.call(r),
                        e = t.pageInDuration.call(r),
                        s = t.state.call(r, u);
                    u.loading === !0 && t.removeLoading.call(r);
                    s === !0 ? t.pageInOverlay.call(r, f, e) : t.pageInBasic.call(r, f, e)
                },
                pageInBasic: function(t, i) {
                    var r = n(this);
                    r.css({
                        "animation-duration": i / 1e3 + "s"
                    }).addClass(t).animateCallback(function() {
                        r.removeClass(t).css({
                            opacity: 1
                        })
                    })
                },
                pageInOverlay: function(t, r) {
                    var u = n(this),
                        f = u.data(i).options;
                    u.css({
                        opacity: 1
                    });
                    n(f.overlayParentElement).children("." + f.overlayClass).css({
                        "animation-duration": r / 1e3 + "s"
                    }).addClass(t)
                },
                pageOutClass: function(t) {
                    var r = n(this),
                        e = r.data(i).options,
                        u = t.data("animsition-out"),
                        f = r.data("animsition-out");
                    return typeof u == "string" ? u : typeof f == "string" ? f : e.outClass
                },
                pageOutDuration: function(t) {
                    var r = n(this),
                        e = r.data(i).options,
                        u = t.data("animsition-out-duration"),
                        f = r.data("animsition-out-duration");
                    return typeof u == "number" ? u : typeof f == "number" ? f : e.outDuration
                },
                pageOut: function(r) {
                    var u = this,
                        s = n(this),
                        h = s.data(i).options,
                        f = t.pageOutClass.call(u, r),
                        e = t.pageOutDuration.call(u, r),
                        c = t.state.call(u, h),
                        o = r.attr("href");
                    c === !0 ? t.pageOutOverlay.call(u, f, e, o) : t.pageOutBasic.call(u, f, e, o)
                },
                pageOutBasic: function(t, i, r) {
                    var u = n(this);
                    u.css({
                        "animation-duration": i / 1e3 + "s"
                    }).addClass(t).animateCallback(function() {
                        location.href = r
                    })
                },
                pageOutOverlay: function(r, u, f) {
                    var s = this,
                        e = n(this),
                        o = e.data(i).options,
                        h = t.pageInClass.call(s);
                    n(o.overlayParentElement).children("." + o.overlayClass).css({
                        "animation-duration": u / 1e3 + "s"
                    }).removeClass(h).addClass(r).animateCallback(function() {
                        e.css({
                            opacity: 0
                        });
                        location.href = f
                    })
                },
                destroy: function() {
                    return this.each(function() {
                        var t = n(this);
                        n(window).unbind("." + i);
                        t.css({
                            opacity: 1
                        }).removeData(i)
                    })
                }
            };
        n.fn.animateCallback = function(t) {
            var i = "animationend webkitAnimationEnd mozAnimationEnd oAnimationEnd MSAnimationEnd";
            return this.each(function() {
                n(this).bind(i, function() {
                    return n(this).unbind(i), t.call(this)
                })
            })
        };
        n.fn.animsition = function(r) {
            if (t[r]) return t[r].apply(this, Array.prototype.slice.call(arguments, 1));
            if (typeof r != "object" && r) n.error("Method " + r + " does not exist on jQuery." + i);
            else return t.init.apply(this, arguments)
        }
    }(jQuery), function(n, t, i, r) {
        function f(t, i) {
            this.element = t;
            this.options = n.extend({}, h, i);
            this._defaults = h;
            this._name = u;
            this.init()
        }
        var u = "stellar",
            h = {
                scrollProperty: "scroll",
                positionProperty: "position",
                horizontalScrolling: !0,
                verticalScrolling: !0,
                horizontalOffset: 0,
                verticalOffset: 0,
                responsive: !1,
                parallaxBackgrounds: !0,
                parallaxElements: !0,
                hideDistantElements: !0,
                hideElement: function(n) {
                    n.hide()
                },
                showElement: function(n) {
                    n.show()
                }
            },
            e = {
                scroll: {
                    getLeft: function(n) {
                        return n.scrollLeft()
                    },
                    setLeft: function(n, t) {
                        n.scrollLeft(t)
                    },
                    getTop: function(n) {
                        return n.scrollTop()
                    },
                    setTop: function(n, t) {
                        n.scrollTop(t)
                    }
                },
                position: {
                    getLeft: function(n) {
                        return parseInt(n.css("left"), 10) * -1
                    },
                    getTop: function(n) {
                        return parseInt(n.css("top"), 10) * -1
                    }
                },
                margin: {
                    getLeft: function(n) {
                        return parseInt(n.css("margin-left"), 10) * -1
                    },
                    getTop: function(n) {
                        return parseInt(n.css("margin-top"), 10) * -1
                    }
                },
                transform: {
                    getLeft: function(n) {
                        var t = getComputedStyle(n[0])[o];
                        return t !== "none" ? parseInt(t.match(/(-?[0-9]+)/g)[4], 10) * -1 : 0
                    },
                    getTop: function(n) {
                        var t = getComputedStyle(n[0])[o];
                        return t !== "none" ? parseInt(t.match(/(-?[0-9]+)/g)[5], 10) * -1 : 0
                    }
                }
            },
            c = {
                position: {
                    setLeft: function(n, t) {
                        n.css("left", t)
                    },
                    setTop: function(n, t) {
                        n.css("top", t)
                    }
                },
                transform: {
                    setPosition: function(n, t, i, r, u) {
                        n[0].style[o] = "translate3d(" + (t - i) + "px, " + (r - u) + "px, 0)"
                    }
                }
            },
            v = function() {
                var u = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
                    i = n("script")[0].style,
                    t = "",
                    r;
                for (r in i)
                    if (u.test(r)) {
                        t = r.match(u)[0];
                        break
                    }
                return "WebkitOpacity" in i && (t = "Webkit"), "KhtmlOpacity" in i && (t = "Khtml"),
                    function(n) {
                        return t + (t.length > 0 ? n.charAt(0).toUpperCase() + n.slice(1) : n)
                    }
            }(),
            o = v("transform"),
            l = n("<div />", {
                style: "background:#fff"
            }).css("background-position-x") !== r,
            s = l ? function(n, t, i) {
                n.css({
                    "background-position-x": t,
                    "background-position-y": i
                })
            } : function(n, t, i) {
                n.css("background-position", t + " " + i)
            },
            y = l ? function(n) {
                return [n.css("background-position-x"), n.css("background-position-y")]
            } : function(n) {
                return n.css("background-position").split(" ")
            },
            a = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || t.msRequestAnimationFrame || function(n) {
                setTimeout(n, 1e3 / 60)
            };
        f.prototype = {
            init: function() {
                this.options.name = u + "_" + Math.floor(Math.random() * 1e9);
                this._defineElements();
                this._defineGetters();
                this._defineSetters();
                this._handleWindowLoadAndResize();
                this._detectViewport();
                this.refresh({
                    firstLoad: !0
                });
                this.options.scrollProperty === "scroll" ? this._handleScrollEvent() : this._startAnimationLoop()
            },
            _defineElements: function() {
                this.element === i.body && (this.element = t);
                this.$scrollElement = n(this.element);
                this.$element = this.element === t ? n("body") : this.$scrollElement;
                this.$viewportElement = this.options.viewportElement !== r ? n(this.options.viewportElement) : this.$scrollElement[0] === t || this.options.scrollProperty === "scroll" ? this.$scrollElement : this.$scrollElement.parent()
            },
            _defineGetters: function() {
                var n = this,
                    t = e[n.options.scrollProperty];
                this._getScrollLeft = function() {
                    return t.getLeft(n.$scrollElement)
                };
                this._getScrollTop = function() {
                    return t.getTop(n.$scrollElement)
                }
            },
            _defineSetters: function() {
                var t = this,
                    r = e[t.options.scrollProperty],
                    i = c[t.options.positionProperty],
                    u = r.setLeft,
                    f = r.setTop;
                this._setScrollLeft = typeof u == "function" ? function(n) {
                    u(t.$scrollElement, n)
                } : n.noop;
                this._setScrollTop = typeof f == "function" ? function(n) {
                    f(t.$scrollElement, n)
                } : n.noop;
                this._setPosition = i.setPosition || function(n, r, u, f, e) {
                    t.options.horizontalScrolling && i.setLeft(n, r, u);
                    t.options.verticalScrolling && i.setTop(n, f, e)
                }
            },
            _handleWindowLoadAndResize: function() {
                var i = this,
                    r = n(t);
                i.options.responsive && r.bind("load." + this.name, function() {
                    i.refresh()
                });
                r.bind("resize." + this.name, function() {
                    i._detectViewport();
                    i.options.responsive && i.refresh()
                })
            },
            refresh: function(i) {
                var r = this,
                    u = r._getScrollLeft(),
                    f = r._getScrollTop();
                i && i.firstLoad || this._reset();
                this._setScrollLeft(0);
                this._setScrollTop(0);
                this._setOffsets();
                this._findParticles();
                this._findBackgrounds();
                i && i.firstLoad && /WebKit/.test(navigator.userAgent) && n(t).load(function() {
                    var n = r._getScrollLeft(),
                        t = r._getScrollTop();
                    r._setScrollLeft(n + 1);
                    r._setScrollTop(t + 1);
                    r._setScrollLeft(n);
                    r._setScrollTop(t)
                });
                this._setScrollLeft(u);
                this._setScrollTop(f)
            },
            _detectViewport: function() {
                var n = this.$viewportElement.offset(),
                    t = n !== null && n !== r;
                this.viewportWidth = this.$viewportElement.width();
                this.viewportHeight = this.$viewportElement.height();
                this.viewportOffsetTop = t ? n.top : 0;
                this.viewportOffsetLeft = t ? n.left : 0
            },
            _findParticles: function() {
                var t = this,
                    u = this._getScrollLeft(),
                    f = this._getScrollTop(),
                    i;
                if (this.particles !== r)
                    for (i = this.particles.length - 1; i >= 0; i--) this.particles[i].$element.data("stellar-elementIsActive", r);
                (this.particles = [], this.options.parallaxElements) && this.$element.find("[data-stellar-ratio]").each(function() {
                    var i = n(this),
                        f, e, o, s, h, c, u, l, a, v = 0,
                        y = 0,
                        p = 0,
                        w = 0;
                    if (i.data("stellar-elementIsActive")) {
                        if (i.data("stellar-elementIsActive") !== this) return
                    } else i.data("stellar-elementIsActive", this);
                    t.options.showElement(i);
                    i.data("stellar-startingLeft") ? (i.css("left", i.data("stellar-startingLeft")), i.css("top", i.data("stellar-startingTop"))) : (i.data("stellar-startingLeft", i.css("left")), i.data("stellar-startingTop", i.css("top")));
                    o = i.position().left;
                    s = i.position().top;
                    h = i.css("margin-left") === "auto" ? 0 : parseInt(i.css("margin-left"), 10);
                    c = i.css("margin-top") === "auto" ? 0 : parseInt(i.css("margin-top"), 10);
                    l = i.offset().left - h;
                    a = i.offset().top - c;
                    i.parents().each(function() {
                        var t = n(this);
                        if (t.data("stellar-offset-parent") === !0) return v = p, y = w, u = t, !1;
                        p += t.position().left;
                        w += t.position().top
                    });
                    f = i.data("stellar-horizontal-offset") !== r ? i.data("stellar-horizontal-offset") : u !== r && u.data("stellar-horizontal-offset") !== r ? u.data("stellar-horizontal-offset") : t.horizontalOffset;
                    e = i.data("stellar-vertical-offset") !== r ? i.data("stellar-vertical-offset") : u !== r && u.data("stellar-vertical-offset") !== r ? u.data("stellar-vertical-offset") : t.verticalOffset;
                    t.particles.push({
                        $element: i,
                        $offsetParent: u,
                        isFixed: i.css("position") === "fixed",
                        horizontalOffset: f,
                        verticalOffset: e,
                        startingPositionLeft: o,
                        startingPositionTop: s,
                        startingOffsetLeft: l,
                        startingOffsetTop: a,
                        parentOffsetLeft: v,
                        parentOffsetTop: y,
                        stellarRatio: i.data("stellar-ratio") !== r ? i.data("stellar-ratio") : 1,
                        width: i.outerWidth(!0),
                        height: i.outerHeight(!0),
                        isHidden: !1
                    })
                })
            },
            _findBackgrounds: function() {
                var i = this,
                    u = this._getScrollLeft(),
                    f = this._getScrollTop(),
                    t;
                (this.backgrounds = [], this.options.parallaxBackgrounds) && (t = this.$element.find("[data-stellar-background-ratio]"), this.$element.data("stellar-background-ratio") && (t = t.add(this.$element)), t.each(function() {
                    var t = n(this),
                        e = y(t),
                        h, c, l, a, v, p, o, w = 0,
                        b = 0,
                        k = 0,
                        d = 0;
                    if (t.data("stellar-backgroundIsActive")) {
                        if (t.data("stellar-backgroundIsActive") !== this) return
                    } else t.data("stellar-backgroundIsActive", this);
                    t.data("stellar-backgroundStartingLeft") ? s(t, t.data("stellar-backgroundStartingLeft"), t.data("stellar-backgroundStartingTop")) : (t.data("stellar-backgroundStartingLeft", e[0]), t.data("stellar-backgroundStartingTop", e[1]));
                    l = t.css("margin-left") === "auto" ? 0 : parseInt(t.css("margin-left"), 10);
                    a = t.css("margin-top") === "auto" ? 0 : parseInt(t.css("margin-top"), 10);
                    v = t.offset().left - l - u;
                    p = t.offset().top - a - f;
                    t.parents().each(function() {
                        var t = n(this);
                        if (t.data("stellar-offset-parent") === !0) return w = k, b = d, o = t, !1;
                        k += t.position().left;
                        d += t.position().top
                    });
                    h = t.data("stellar-horizontal-offset") !== r ? t.data("stellar-horizontal-offset") : o !== r && o.data("stellar-horizontal-offset") !== r ? o.data("stellar-horizontal-offset") : i.horizontalOffset;
                    c = t.data("stellar-vertical-offset") !== r ? t.data("stellar-vertical-offset") : o !== r && o.data("stellar-vertical-offset") !== r ? o.data("stellar-vertical-offset") : i.verticalOffset;
                    i.backgrounds.push({
                        $element: t,
                        $offsetParent: o,
                        isFixed: t.css("background-attachment") === "fixed",
                        horizontalOffset: h,
                        verticalOffset: c,
                        startingValueLeft: e[0],
                        startingValueTop: e[1],
                        startingBackgroundPositionLeft: isNaN(parseInt(e[0], 10)) ? 0 : parseInt(e[0], 10),
                        startingBackgroundPositionTop: isNaN(parseInt(e[1], 10)) ? 0 : parseInt(e[1], 10),
                        startingPositionLeft: t.position().left,
                        startingPositionTop: t.position().top,
                        startingOffsetLeft: v,
                        startingOffsetTop: p,
                        parentOffsetLeft: w,
                        parentOffsetTop: b,
                        stellarRatio: t.data("stellar-background-ratio") === r ? 1 : t.data("stellar-background-ratio")
                    })
                }))
            },
            _reset: function() {
                for (var t, r, u, i, n = this.particles.length - 1; n >= 0; n--) t = this.particles[n], r = t.$element.data("stellar-startingLeft"), u = t.$element.data("stellar-startingTop"), this._setPosition(t.$element, r, r, u, u), this.options.showElement(t.$element), t.$element.data("stellar-startingLeft", null).data("stellar-elementIsActive", null).data("stellar-backgroundIsActive", null);
                for (n = this.backgrounds.length - 1; n >= 0; n--) i = this.backgrounds[n], i.$element.data("stellar-backgroundStartingLeft", null).data("stellar-backgroundStartingTop", null), s(i.$element, i.startingValueLeft, i.startingValueTop)
            },
            destroy: function() {
                this._reset();
                this.$scrollElement.unbind("resize." + this.name).unbind("scroll." + this.name);
                this._animationLoop = n.noop;
                n(t).unbind("load." + this.name).unbind("resize." + this.name)
            },
            _setOffsets: function() {
                var i = this,
                    r = n(t);
                r.unbind("resize.horizontal-" + this.name).unbind("resize.vertical-" + this.name);
                typeof this.options.horizontalOffset == "function" ? (this.horizontalOffset = this.options.horizontalOffset(), r.bind("resize.horizontal-" + this.name, function() {
                    i.horizontalOffset = i.options.horizontalOffset()
                })) : this.horizontalOffset = this.options.horizontalOffset;
                typeof this.options.verticalOffset == "function" ? (this.verticalOffset = this.options.verticalOffset(), r.bind("resize.vertical-" + this.name, function() {
                    i.verticalOffset = i.options.verticalOffset()
                })) : this.verticalOffset = this.options.verticalOffset
            },
            _repositionElements: function() {
                var r = this._getScrollLeft(),
                    u = this._getScrollTop(),
                    n, f, t, l, a, v = !0,
                    y = !0,
                    e, o, h, c, i;
                if (this.currentScrollLeft !== r || this.currentScrollTop !== u || this.currentWidth !== this.viewportWidth || this.currentHeight !== this.viewportHeight) {
                    for (this.currentScrollLeft = r, this.currentScrollTop = u, this.currentWidth = this.viewportWidth, this.currentHeight = this.viewportHeight, i = this.particles.length - 1; i >= 0; i--) n = this.particles[i], f = n.isFixed ? 1 : 0, this.options.horizontalScrolling ? (e = (r + n.horizontalOffset + this.viewportOffsetLeft + n.startingPositionLeft - n.startingOffsetLeft + n.parentOffsetLeft) * -(n.stellarRatio + f - 1) + n.startingPositionLeft, h = e - n.startingPositionLeft + n.startingOffsetLeft) : (e = n.startingPositionLeft, h = n.startingOffsetLeft), this.options.verticalScrolling ? (o = (u + n.verticalOffset + this.viewportOffsetTop + n.startingPositionTop - n.startingOffsetTop + n.parentOffsetTop) * -(n.stellarRatio + f - 1) + n.startingPositionTop, c = o - n.startingPositionTop + n.startingOffsetTop) : (o = n.startingPositionTop, c = n.startingOffsetTop), this.options.hideDistantElements && (y = !this.options.horizontalScrolling || h + n.width > (n.isFixed ? 0 : r) && h < (n.isFixed ? 0 : r) + this.viewportWidth + this.viewportOffsetLeft, v = !this.options.verticalScrolling || c + n.height > (n.isFixed ? 0 : u) && c < (n.isFixed ? 0 : u) + this.viewportHeight + this.viewportOffsetTop), y && v ? (n.isHidden && (this.options.showElement(n.$element), n.isHidden = !1), this._setPosition(n.$element, e, n.startingPositionLeft, o, n.startingPositionTop)) : n.isHidden || (this.options.hideElement(n.$element), n.isHidden = !0);
                    for (i = this.backgrounds.length - 1; i >= 0; i--) t = this.backgrounds[i], f = t.isFixed ? 0 : 1, l = this.options.horizontalScrolling ? (r + t.horizontalOffset - this.viewportOffsetLeft - t.startingOffsetLeft + t.parentOffsetLeft - t.startingBackgroundPositionLeft) * (f - t.stellarRatio) + "px" : t.startingValueLeft, a = this.options.verticalScrolling ? (u + t.verticalOffset - this.viewportOffsetTop - t.startingOffsetTop + t.parentOffsetTop - t.startingBackgroundPositionTop) * (f - t.stellarRatio) + "px" : t.startingValueTop, s(t.$element, l, a)
                }
            },
            _handleScrollEvent: function() {
                var i = this,
                    n = !1,
                    r = function() {
                        i._repositionElements();
                        n = !1
                    },
                    t = function() {
                        n || (a(r), n = !0)
                    };
                this.$scrollElement.bind("scroll." + this.name, t);
                t()
            },
            _startAnimationLoop: function() {
                var n = this;
                this._animationLoop = function() {
                    a(n._animationLoop);
                    n._repositionElements()
                };
                this._animationLoop()
            }
        };
        n.fn[u] = function(t) {
            var i = arguments;
            return t === r || typeof t == "object" ? this.each(function() {
                n.data(this, "plugin_" + u) || n.data(this, "plugin_" + u, new f(this, t))
            }) : typeof t == "string" && t[0] !== "_" && t !== "init" ? this.each(function() {
                var r = n.data(this, "plugin_" + u);
                r instanceof f && typeof r[t] == "function" && r[t].apply(r, Array.prototype.slice.call(i, 1));
                t === "destroy" && n.data(this, "plugin_" + u, null)
            }) : void 0
        };
        n[u] = function() {
            var i = n(t);
            return i.stellar.apply(i, Array.prototype.slice.call(arguments, 0))
        };
        n[u].scrollProperty = e;
        n[u].positionProperty = c;
        t.Stellar = f
    }(jQuery, this, document), function(n) {
        function t(n, t) {
            return n.toFixed(t.decimals)
        }
        n.fn.countTo = function(t) {
            return t = t || {}, n(this).each(function() {
                function c() {
                    r += l;
                    h++;
                    o(r);
                    typeof i.onUpdate == "function" && i.onUpdate.call(e, r);
                    h >= s && (f.removeData("countTo"), clearInterval(u.interval), r = i.to, typeof i.onComplete == "function" && i.onComplete.call(e, r))
                }

                function o(n) {
                    var t = i.formatter.call(e, n, i);
                    f.text(t)
                }
                var i = n.extend({}, n.fn.countTo.defaults, {
                        from: n(this).data("from"),
                        to: n(this).data("to"),
                        speed: n(this).data("speed"),
                        refreshInterval: n(this).data("refresh-interval"),
                        decimals: n(this).data("decimals")
                    }, t),
                    s = Math.ceil(i.speed / i.refreshInterval),
                    l = (i.to - i.from) / s,
                    e = this,
                    f = n(this),
                    h = 0,
                    r = i.from,
                    u = f.data("countTo") || {};
                f.data("countTo", u);
                u.interval && clearInterval(u.interval);
                u.interval = setInterval(c, i.refreshInterval);
                o(r)
            })
        };
        n.fn.countTo.defaults = {
            from: 0,
            to: 0,
            speed: 1e3,
            refreshInterval: 100,
            decimals: 0,
            formatter: t,
            onUpdate: null,
            onComplete: null
        }
    }(jQuery), ! function(n, t, i, r) {
        function u(t, i) {
            this.settings = null;
            this.options = n.extend({}, u.Defaults, i);
            this.$element = n(t);
            this.drag = n.extend({}, o);
            this.state = n.extend({}, s);
            this.e = n.extend({}, h);
            this._plugins = {};
            this._supress = {};
            this._current = null;
            this._speed = null;
            this._coordinates = [];
            this._breakpoint = null;
            this._width = null;
            this._items = [];
            this._clones = [];
            this._mergers = [];
            this._invalidated = {};
            this._pipe = [];
            n.each(u.Plugins, n.proxy(function(n, t) {
                this._plugins[n[0].toLowerCase() + n.slice(1)] = new t(this)
            }, this));
            n.each(u.Pipe, n.proxy(function(t, i) {
                this._pipe.push({
                    filter: i.filter,
                    run: n.proxy(i.run, this)
                })
            }, this));
            this.setup();
            this.initialize()
        }

        function f(n) {
            if (n.touches !== r) return {
                x: n.touches[0].pageX,
                y: n.touches[0].pageY
            };
            if (n.touches === r) {
                if (n.pageX !== r) return {
                    x: n.pageX,
                    y: n.pageY
                };
                if (n.pageX === r) return {
                    x: n.clientX,
                    y: n.clientY
                }
            }
        }

        function e(n) {
            var t, r, u = i.createElement("div"),
                f = n;
            for (t in f)
                if (r = f[t], "undefined" != typeof u.style[r]) return u = null, [r, t];
            return [!1]
        }

        function c() {
            return e(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1]
        }

        function l() {
            return e(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0]
        }

        function a() {
            return e(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0]
        }

        function v() {
            return "ontouchstart" in t || !!navigator.msMaxTouchPoints
        }

        function y() {
            return t.navigator.msPointerEnabled
        }
        var o, s, h;
        o = {
            start: 0,
            startX: 0,
            startY: 0,
            current: 0,
            currentX: 0,
            currentY: 0,
            offsetX: 0,
            offsetY: 0,
            distance: null,
            startTime: 0,
            endTime: 0,
            updatedX: 0,
            targetEl: null
        };
        s = {
            isTouch: !1,
            isScrolling: !1,
            isSwiping: !1,
            direction: !1,
            inMotion: !1
        };
        h = {
            _onDragStart: null,
            _onDragMove: null,
            _onDragEnd: null,
            _transitionEnd: null,
            _resizer: null,
            _responsiveCall: null,
            _goToLoop: null,
            _checkVisibile: null
        };
        u.Defaults = {
            items: 3,
            loop: !1,
            center: !1,
            mouseDrag: !0,
            touchDrag: !0,
            pullDrag: !0,
            freeDrag: !1,
            margin: 0,
            stagePadding: 0,
            merge: !1,
            mergeFit: !0,
            autoWidth: !1,
            startPosition: 0,
            rtl: !1,
            smartSpeed: 250,
            fluidSpeed: !1,
            dragEndSpeed: !1,
            responsive: {},
            responsiveRefreshRate: 200,
            responsiveBaseElement: t,
            responsiveClass: !1,
            fallbackEasing: "swing",
            info: !1,
            nestedItemSelector: !1,
            itemElement: "div",
            stageElement: "div",
            themeClass: "owl-theme",
            baseClass: "owl-carousel",
            itemClass: "owl-item",
            centerClass: "center",
            activeClass: "active"
        };
        u.Width = {
            Default: "default",
            Inner: "inner",
            Outer: "outer"
        };
        u.Plugins = {};
        u.Pipe = [{
            filter: ["width", "items", "settings"],
            run: function(n) {
                n.current = this._items && this._items[this.relative(this._current)]
            }
        }, {
            filter: ["items", "settings"],
            run: function() {
                var n = this._clones,
                    t = this.$stage.children(".cloned");
                (t.length !== n.length || !this.settings.loop && n.length > 0) && (this.$stage.children(".cloned").remove(), this._clones = [])
            }
        }, {
            filter: ["items", "settings"],
            run: function() {
                for (var n = this._clones, t = this._items, i = this.settings.loop ? n.length - Math.max(2 * this.settings.items, 4) : 0, r = 0, u = Math.abs(i / 2); u > r; r++) i > 0 ? (this.$stage.children().eq(t.length + n.length - 1).remove(), n.pop(), this.$stage.children().eq(0).remove(), n.pop()) : (n.push(n.length / 2), this.$stage.append(t[n[n.length - 1]].clone().addClass("cloned")), n.push(t.length - 1 - (n.length - 1) / 2), this.$stage.prepend(t[n[n.length - 1]].clone().addClass("cloned")))
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function() {
                var n, t, i, u = this.settings.rtl ? 1 : -1,
                    f = (this.width() / this.settings.items).toFixed(3),
                    r = 0;
                for (this._coordinates = [], t = 0, i = this._clones.length + this._items.length; i > t; t++) n = this._mergers[this.relative(t)], n = this.settings.mergeFit && Math.min(n, this.settings.items) || n, r += (this.settings.autoWidth ? this._items[this.relative(t)].width() + this.settings.margin : f * n) * u, this._coordinates.push(r)
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function() {
                var t, r, u = (this.width() / this.settings.items).toFixed(3),
                    i = {
                        width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding,
                        "padding-left": this.settings.stagePadding || "",
                        "padding-right": this.settings.stagePadding || ""
                    };
                if (this.$stage.css(i), i = {
                        width: this.settings.autoWidth ? "auto" : u - this.settings.margin
                    }, i[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin, !this.settings.autoWidth && n.grep(this._mergers, function(n) {
                        return n > 1
                    }).length > 0)
                    for (t = 0, r = this._coordinates.length; r > t; t++) i.width = Math.abs(this._coordinates[t]) - Math.abs(this._coordinates[t - 1] || 0) - this.settings.margin, this.$stage.children().eq(t).css(i);
                else this.$stage.children().css(i)
            }
        }, {
            filter: ["width", "items", "settings"],
            run: function(n) {
                n.current && this.reset(this.$stage.children().index(n.current))
            }
        }, {
            filter: ["position"],
            run: function() {
                this.animate(this.coordinates(this._current))
            }
        }, {
            filter: ["width", "position", "items", "settings"],
            run: function() {
                for (var t, i, u = this.settings.rtl ? 1 : -1, f = 2 * this.settings.stagePadding, r = this.coordinates(this.current()) + f, e = r + this.width() * u, o = [], n = 0, s = this._coordinates.length; s > n; n++) t = this._coordinates[n - 1] || 0, i = Math.abs(this._coordinates[n]) + f * u, (this.op(t, "<=", r) && this.op(t, ">", e) || this.op(i, "<", r) && this.op(i, ">", e)) && o.push(n);
                this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass);
                this.$stage.children(":eq(" + o.join("), :eq(") + ")").addClass(this.settings.activeClass);
                this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), this.$stage.children().eq(this.current()).addClass(this.settings.centerClass))
            }
        }];
        u.prototype.initialize = function() {
            if (this.trigger("initialize"), this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl), this.browserSupport(), this.settings.autoWidth && this.state.imagesLoaded !== !0) {
                var t, i, u;
                if (t = this.$element.find("img"), i = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : r, u = this.$element.children(i).width(), t.length && 0 >= u) return this.preloadAutoWidthImages(t), !1
            }
            this.$element.addClass("owl-loading");
            this.$stage = n("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">');
            this.$element.append(this.$stage.parent());
            this.replace(this.$element.children().not(this.$stage.parent()));
            this._width = this.$element.width();
            this.refresh();
            this.$element.removeClass("owl-loading").addClass("owl-loaded");
            this.eventsCall();
            this.internalEvents();
            this.addTriggerableEvents();
            this.trigger("initialized")
        };
        u.prototype.setup = function() {
            var u = this.viewport(),
                r = this.options.responsive,
                t = -1,
                i = null;
            r ? (n.each(r, function(n) {
                u >= n && n > t && (t = Number(n))
            }), i = n.extend({}, this.options, r[t]), delete i.responsive, i.responsiveClass && this.$element.attr("class", function(n, t) {
                return t.replace(/\b owl-responsive-\S+/g, "")
            }).addClass("owl-responsive-" + t)) : i = n.extend({}, this.options);
            (null === this.settings || this._breakpoint !== t) && (this.trigger("change", {
                property: {
                    name: "settings",
                    value: i
                }
            }), this._breakpoint = t, this.settings = i, this.invalidate("settings"), this.trigger("changed", {
                property: {
                    name: "settings",
                    value: this.settings
                }
            }))
        };
        u.prototype.optionsLogic = function() {
            this.$element.toggleClass("owl-center", this.settings.center);
            this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1);
            this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
        };
        u.prototype.prepare = function(t) {
            var i = this.trigger("prepare", {
                content: t
            });
            return i.data || (i.data = n("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(t)), this.trigger("prepared", {
                content: i.data
            }), i.data
        };
        u.prototype.update = function() {
            for (var t = 0, i = this._pipe.length, r = n.proxy(function(n) {
                    return this[n]
                }, this._invalidated), u = {}; i > t;)(this._invalidated.all || n.grep(this._pipe[t].filter, r).length > 0) && this._pipe[t].run(u), t++;
            this._invalidated = {}
        };
        u.prototype.width = function(n) {
            switch (n = n || u.Width.Default) {
                case u.Width.Inner:
                case u.Width.Outer:
                    return this._width;
                default:
                    return this._width - 2 * this.settings.stagePadding + this.settings.margin
            }
        };
        u.prototype.refresh = function() {
            if (0 === this._items.length) return !1;
            (new Date).getTime();
            this.trigger("refresh");
            this.setup();
            this.optionsLogic();
            this.$stage.addClass("owl-refresh");
            this.update();
            this.$stage.removeClass("owl-refresh");
            this.state.orientation = t.orientation;
            this.watchVisibility();
            this.trigger("refreshed")
        };
        u.prototype.eventsCall = function() {
            this.e._onDragStart = n.proxy(function(n) {
                this.onDragStart(n)
            }, this);
            this.e._onDragMove = n.proxy(function(n) {
                this.onDragMove(n)
            }, this);
            this.e._onDragEnd = n.proxy(function(n) {
                this.onDragEnd(n)
            }, this);
            this.e._onResize = n.proxy(function(n) {
                this.onResize(n)
            }, this);
            this.e._transitionEnd = n.proxy(function(n) {
                this.transitionEnd(n)
            }, this);
            this.e._preventClick = n.proxy(function(n) {
                this.preventClick(n)
            }, this)
        };
        u.prototype.onThrottledResize = function() {
            t.clearTimeout(this.resizeTimer);
            this.resizeTimer = t.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate)
        };
        u.prototype.onResize = function() {
            return this._items.length ? this._width === this.$element.width() ? !1 : this.trigger("resize").isDefaultPrevented() ? !1 : (this._width = this.$element.width(), this.invalidate("width"), this.refresh(), void this.trigger("resized")) : !1
        };
        u.prototype.eventsRouter = function(n) {
            var t = n.type;
            "mousedown" === t || "touchstart" === t ? this.onDragStart(n) : "mousemove" === t || "touchmove" === t ? this.onDragMove(n) : "mouseup" === t || "touchend" === t ? this.onDragEnd(n) : "touchcancel" === t && this.onDragEnd(n)
        };
        u.prototype.internalEvents = function() {
            var i = (v(), y());
            this.settings.mouseDrag ? (this.$stage.on("mousedown", n.proxy(function(n) {
                this.eventsRouter(n)
            }, this)), this.$stage.on("dragstart", function() {
                return !1
            }), this.$stage.get(0).onselectstart = function() {
                return !1
            }) : this.$element.addClass("owl-text-select-on");
            this.settings.touchDrag && !i && this.$stage.on("touchstart touchcancel", n.proxy(function(n) {
                this.eventsRouter(n)
            }, this));
            this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1);
            this.settings.responsive !== !1 && this.on(t, "resize", n.proxy(this.onThrottledResize, this))
        };
        u.prototype.onDragStart = function(r) {
            var u, e, s, o;
            if (u = r.originalEvent || r || t.event, 3 === u.which || this.state.isTouch) return !1;
            if ("mousedown" === u.type && this.$stage.addClass("owl-grab"), this.trigger("drag"), this.drag.startTime = (new Date).getTime(), this.speed(0), this.state.isTouch = !0, this.state.isScrolling = !1, this.state.isSwiping = !1, this.drag.distance = 0, e = f(u).x, s = f(u).y, this.drag.offsetX = this.$stage.position().left, this.drag.offsetY = this.$stage.position().top, this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin), this.state.inMotion && this.support3d) o = this.getTransformProperty(), this.drag.offsetX = o, this.animate(o), this.state.inMotion = !0;
            else if (this.state.inMotion && !this.support3d) return this.state.inMotion = !1, !1;
            this.drag.startX = e - this.drag.offsetX;
            this.drag.startY = s - this.drag.offsetY;
            this.drag.start = e - this.drag.startX;
            this.drag.targetEl = u.target || u.srcElement;
            this.drag.updatedX = this.drag.start;
            ("IMG" === this.drag.targetEl.tagName || "A" === this.drag.targetEl.tagName) && (this.drag.targetEl.draggable = !1);
            n(i).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", n.proxy(function(n) {
                this.eventsRouter(n)
            }, this))
        };
        u.prototype.onDragMove = function(n) {
            var i, e, o, s, h, u;
            this.state.isTouch && (this.state.isScrolling || (i = n.originalEvent || n || t.event, e = f(i).x, o = f(i).y, this.drag.currentX = e - this.drag.startX, this.drag.currentY = o - this.drag.startY, this.drag.distance = this.drag.currentX - this.drag.offsetX, this.drag.distance < 0 ? this.state.direction = this.settings.rtl ? "right" : "left" : this.drag.distance > 0 && (this.state.direction = this.settings.rtl ? "left" : "right"), this.settings.loop ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction ? this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && "left" === this.state.direction && (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length)) : (s = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum()), h = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum()), u = this.settings.pullDrag ? this.drag.distance / 5 : 0, this.drag.currentX = Math.max(Math.min(this.drag.currentX, s + u), h + u)), (this.drag.distance > 8 || this.drag.distance < -8) && (i.preventDefault !== r ? i.preventDefault() : i.returnValue = !1, this.state.isSwiping = !0), this.drag.updatedX = this.drag.currentX, (this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === !1 && (this.state.isScrolling = !0, this.drag.updatedX = this.drag.start), this.animate(this.drag.updatedX)))
        };
        u.prototype.onDragEnd = function(t) {
            var u, f, r;
            if (this.state.isTouch) {
                if ("mouseup" === t.type && this.$stage.removeClass("owl-grab"), this.trigger("dragged"), this.drag.targetEl.removeAttribute("draggable"), this.state.isTouch = !1, this.state.isScrolling = !1, this.state.isSwiping = !1, 0 === this.drag.distance && this.state.inMotion !== !0) return this.state.inMotion = !1, !1;
                this.drag.endTime = (new Date).getTime();
                u = this.drag.endTime - this.drag.startTime;
                f = Math.abs(this.drag.distance);
                (f > 3 || u > 300) && this.removeClick(this.drag.targetEl);
                r = this.closest(this.drag.updatedX);
                this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
                this.current(r);
                this.invalidate("position");
                this.update();
                this.settings.pullDrag || this.drag.updatedX !== this.coordinates(r) || this.transitionEnd();
                this.drag.distance = 0;
                n(i).off(".owl.dragEvents")
            }
        };
        u.prototype.removeClick = function(i) {
            this.drag.targetEl = i;
            n(i).on("click.preventClick", this.e._preventClick);
            t.setTimeout(function() {
                n(i).off("click.preventClick")
            }, 300)
        };
        u.prototype.preventClick = function(t) {
            t.preventDefault ? t.preventDefault() : t.returnValue = !1;
            t.stopPropagation && t.stopPropagation();
            n(t.target).off("click.preventClick")
        };
        u.prototype.getTransformProperty = function() {
            var n, i;
            return n = t.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform"), n = n.replace(/matrix(3d)?\(|\)/g, "").split(","), i = 16 === n.length, i !== !0 ? n[4] : n[12]
        };
        u.prototype.closest = function(t) {
            var i = -1,
                u = 30,
                f = this.width(),
                r = this.coordinates();
            return this.settings.freeDrag || n.each(r, n.proxy(function(n, e) {
                return t > e - u && e + u > t ? i = n : this.op(t, "<", e) && this.op(t, ">", r[n + 1] || e - f) && (i = "left" === this.state.direction ? n + 1 : n), -1 === i
            }, this)), this.settings.loop || (this.op(t, ">", r[this.minimum()]) ? i = t = this.minimum() : this.op(t, "<", r[this.maximum()]) && (i = t = this.maximum())), i
        };
        u.prototype.animate = function(t) {
            this.trigger("translate");
            this.state.inMotion = this.speed() > 0;
            this.support3d ? this.$stage.css({
                transform: "translate3d(" + t + "px,0px, 0px)",
                transition: this.speed() / 1e3 + "s"
            }) : this.state.isTouch ? this.$stage.css({
                left: t + "px"
            }) : this.$stage.animate({
                left: t
            }, this.speed() / 1e3, this.settings.fallbackEasing, n.proxy(function() {
                this.state.inMotion && this.transitionEnd()
            }, this))
        };
        u.prototype.current = function(n) {
            if (n === r) return this._current;
            if (0 === this._items.length) return r;
            if (n = this.normalize(n), this._current !== n) {
                var t = this.trigger("change", {
                    property: {
                        name: "position",
                        value: n
                    }
                });
                t.data !== r && (n = this.normalize(t.data));
                this._current = n;
                this.invalidate("position");
                this.trigger("changed", {
                    property: {
                        name: "position",
                        value: this._current
                    }
                })
            }
            return this._current
        };
        u.prototype.invalidate = function(n) {
            this._invalidated[n] = !0
        };
        u.prototype.reset = function(n) {
            n = this.normalize(n);
            n !== r && (this._speed = 0, this._current = n, this.suppress(["translate", "translated"]), this.animate(this.coordinates(n)), this.release(["translate", "translated"]))
        };
        u.prototype.normalize = function(t, i) {
            var u = i ? this._items.length : this._items.length + this._clones.length;
            return !n.isNumeric(t) || 1 > u ? r : t = this._clones.length ? (t % u + u) % u : Math.max(this.minimum(i), Math.min(this.maximum(i), t))
        };
        u.prototype.relative = function(n) {
            return n = this.normalize(n), n -= this._clones.length / 2, this.normalize(n, !0)
        };
        u.prototype.maximum = function(n) {
            var i, r, u, f = 0,
                t = this.settings;
            if (n) return this._items.length - 1;
            if (!t.loop && t.center) i = this._items.length - 1;
            else if (t.loop || t.center)
                if (t.loop || t.center) i = this._items.length + t.items;
                else {
                    if (!t.autoWidth && !t.merge) throw "Can not detect maximum absolute position.";
                    for (revert = t.rtl ? 1 : -1, r = this.$stage.width() - this.$element.width();
                        (u = this.coordinates(f)) && !(u * revert >= r);) i = ++f
                } else i = this._items.length - t.items;
            return i
        };
        u.prototype.minimum = function(n) {
            return n ? 0 : this._clones.length / 2
        };
        u.prototype.items = function(n) {
            return n === r ? this._items.slice() : (n = this.normalize(n, !0), this._items[n])
        };
        u.prototype.mergers = function(n) {
            return n === r ? this._mergers.slice() : (n = this.normalize(n, !0), this._mergers[n])
        };
        u.prototype.clones = function(t) {
            var i = this._clones.length / 2,
                f = i + this._items.length,
                u = function(n) {
                    return n % 2 == 0 ? f + n / 2 : i - (n + 1) / 2
                };
            return t === r ? n.map(this._clones, function(n, t) {
                return u(t)
            }) : n.map(this._clones, function(n, i) {
                return n === t ? u(i) : null
            })
        };
        u.prototype.speed = function(n) {
            return n !== r && (this._speed = n), this._speed
        };
        u.prototype.coordinates = function(t) {
            var i = null;
            return t === r ? n.map(this._coordinates, n.proxy(function(n, t) {
                return this.coordinates(t)
            }, this)) : (this.settings.center ? (i = this._coordinates[t], i += (this.width() - i + (this._coordinates[t - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)) : i = this._coordinates[t - 1] || 0, i)
        };
        u.prototype.duration = function(n, t, i) {
            return Math.min(Math.max(Math.abs(t - n), 1), 6) * Math.abs(i || this.settings.smartSpeed)
        };
        u.prototype.to = function(i, r) {
            if (this.settings.loop) {
                var f = i - this.relative(this.current()),
                    u = this.current(),
                    e = this.current(),
                    o = this.current() + f,
                    s = 0 > e - o ? !0 : !1,
                    h = this._clones.length + this._items.length;
                o < this.settings.items && s === !1 ? (u = e + this._items.length, this.reset(u)) : o >= h - this.settings.items && s === !0 && (u = e - this._items.length, this.reset(u));
                t.clearTimeout(this.e._goToLoop);
                this.e._goToLoop = t.setTimeout(n.proxy(function() {
                    this.speed(this.duration(this.current(), u + f, r));
                    this.current(u + f);
                    this.update()
                }, this), 30)
            } else this.speed(this.duration(this.current(), i, r)), this.current(i), this.update()
        };
        u.prototype.next = function(n) {
            n = n || !1;
            this.to(this.relative(this.current()) + 1, n)
        };
        u.prototype.prev = function(n) {
            n = n || !1;
            this.to(this.relative(this.current()) - 1, n)
        };
        u.prototype.transitionEnd = function(n) {
            return n !== r && (n.stopPropagation(), (n.target || n.srcElement || n.originalTarget) !== this.$stage.get(0)) ? !1 : (this.state.inMotion = !1, void this.trigger("translated"))
        };
        u.prototype.viewport = function() {
            var r;
            if (this.options.responsiveBaseElement !== t) r = n(this.options.responsiveBaseElement).width();
            else if (t.innerWidth) r = t.innerWidth;
            else {
                if (!i.documentElement || !i.documentElement.clientWidth) throw "Can not detect viewport width.";
                r = i.documentElement.clientWidth
            }
            return r
        };
        u.prototype.replace = function(t) {
            this.$stage.empty();
            this._items = [];
            t && (t = t instanceof jQuery ? t : n(t));
            this.settings.nestedItemSelector && (t = t.find("." + this.settings.nestedItemSelector));
            t.filter(function() {
                return 1 === this.nodeType
            }).each(n.proxy(function(n, t) {
                t = this.prepare(t);
                this.$stage.append(t);
                this._items.push(t);
                this._mergers.push(1 * t.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)
            }, this));
            this.reset(n.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);
            this.invalidate("items")
        };
        u.prototype.add = function(n, t) {
            t = t === r ? this._items.length : this.normalize(t, !0);
            this.trigger("add", {
                content: n,
                position: t
            });
            0 === this._items.length || t === this._items.length ? (this.$stage.append(n), this._items.push(n), this._mergers.push(1 * n.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)) : (this._items[t].before(n), this._items.splice(t, 0, n), this._mergers.splice(t, 0, 1 * n.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1));
            this.invalidate("items");
            this.trigger("added", {
                content: n,
                position: t
            })
        };
        u.prototype.remove = function(n) {
            n = this.normalize(n, !0);
            n !== r && (this.trigger("remove", {
                content: this._items[n],
                position: n
            }), this._items[n].remove(), this._items.splice(n, 1), this._mergers.splice(n, 1), this.invalidate("items"), this.trigger("removed", {
                content: null,
                position: n
            }))
        };
        u.prototype.addTriggerableEvents = function() {
            var t = n.proxy(function(t, i) {
                return n.proxy(function(n) {
                    n.relatedTarget !== this && (this.suppress([i]), t.apply(this, [].slice.call(arguments, 1)), this.release([i]))
                }, this)
            }, this);
            n.each({
                next: this.next,
                prev: this.prev,
                to: this.to,
                destroy: this.destroy,
                refresh: this.refresh,
                replace: this.replace,
                add: this.add,
                remove: this.remove
            }, n.proxy(function(n, i) {
                this.$element.on(n + ".owl.carousel", t(i, n + ".owl.carousel"))
            }, this))
        };
        u.prototype.watchVisibility = function() {
            function i(n) {
                return n.offsetWidth > 0 && n.offsetHeight > 0
            }

            function r() {
                i(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), t.clearInterval(this.e._checkVisibile))
            }
            i(this.$element.get(0)) || (this.$element.addClass("owl-hidden"), t.clearInterval(this.e._checkVisibile), this.e._checkVisibile = t.setInterval(n.proxy(r, this), 500))
        };
        u.prototype.preloadAutoWidthImages = function(t) {
            var u, f, i, r;
            u = 0;
            f = this;
            t.each(function(e, o) {
                i = n(o);
                r = new Image;
                r.onload = function() {
                    u++;
                    i.attr("src", r.src);
                    i.css("opacity", 1);
                    u >= t.length && (f.state.imagesLoaded = !0, f.initialize())
                };
                r.src = i.attr("src") || i.attr("data-src") || i.attr("data-src-retina")
            })
        };
        u.prototype.destroy = function() {
            this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass);
            this.settings.responsive !== !1 && n(t).off("resize.owl.carousel");
            this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
            for (var r in this._plugins) this._plugins[r].destroy();
            (this.settings.mouseDrag || this.settings.touchDrag) && (this.$stage.off("mousedown touchstart touchcancel"), n(i).off(".owl.dragEvents"), this.$stage.get(0).onselectstart = function() {}, this.$stage.off("dragstart", function() {
                return !1
            }));
            this.$element.off(".owl");
            this.$stage.children(".cloned").remove();
            this.e = null;
            this.$element.removeData("owlCarousel");
            this.$stage.children().contents().unwrap();
            this.$stage.children().unwrap();
            this.$stage.unwrap()
        };
        u.prototype.op = function(n, t, i) {
            var r = this.settings.rtl;
            switch (t) {
                case "<":
                    return r ? n > i : i > n;
                case ">":
                    return r ? i > n : n > i;
                case ">=":
                    return r ? i >= n : n >= i;
                case "<=":
                    return r ? n >= i : i >= n
            }
        };
        u.prototype.on = function(n, t, i, r) {
            n.addEventListener ? n.addEventListener(t, i, r) : n.attachEvent && n.attachEvent("on" + t, i)
        };
        u.prototype.off = function(n, t, i, r) {
            n.removeEventListener ? n.removeEventListener(t, i, r) : n.detachEvent && n.detachEvent("on" + t, i)
        };
        u.prototype.trigger = function(t, i, r) {
            var e = {
                    item: {
                        count: this._items.length,
                        index: this.current()
                    }
                },
                f = n.camelCase(n.grep(["on", t, r], function(n) {
                    return n
                }).join("-").toLowerCase()),
                u = n.Event([t, "owl", r || "carousel"].join(".").toLowerCase(), n.extend({
                    relatedTarget: this
                }, e, i));
            return this._supress[t] || (n.each(this._plugins, function(n, t) {
                t.onTrigger && t.onTrigger(u)
            }), this.$element.trigger(u), this.settings && "function" == typeof this.settings[f] && this.settings[f].apply(this, u)), u
        };
        u.prototype.suppress = function(t) {
            n.each(t, n.proxy(function(n, t) {
                this._supress[t] = !0
            }, this))
        };
        u.prototype.release = function(t) {
            n.each(t, n.proxy(function(n, t) {
                delete this._supress[t]
            }, this))
        };
        u.prototype.browserSupport = function() {
            (this.support3d = a(), this.support3d) && (this.transformVendor = l(), this.transitionEndVendor = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"][c()], this.vendorName = this.transformVendor.replace(/Transform/i, ""), this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : "");
            this.state.orientation = t.orientation
        };
        n.fn.owlCarousel = function(t) {
            return this.each(function() {
                n(this).data("owlCarousel") || n(this).data("owlCarousel", new u(this, t))
            })
        };
        n.fn.owlCarousel.Constructor = u
    }(window.Zepto || window.jQuery, window, document), function(n, t) {
        var i = function(t) {
            this._core = t;
            this._loaded = [];
            this._handlers = {
                "initialized.owl.carousel change.owl.carousel": n.proxy(function(t) {
                    if (t.namespace && this._core.settings && this._core.settings.lazyLoad && (t.property && "position" == t.property.name || "initialized" == t.type))
                        for (var i = this._core.settings, r = i.center && Math.ceil(i.items / 2) || i.items, u = i.center && -1 * r || 0, f = (t.property && t.property.value || this._core.current()) + u, e = this._core.clones().length, o = n.proxy(function(n, t) {
                                this.load(t)
                            }, this); u++ < r;) this.load(e / 2 + this._core.relative(f)), e && n.each(this._core.clones(this._core.relative(f++)), o)
                }, this)
            };
            this._core.options = n.extend({}, i.Defaults, this._core.options);
            this._core.$element.on(this._handlers)
        };
        i.Defaults = {
            lazyLoad: !1
        };
        i.prototype.load = function(i) {
            var r = this._core.$stage.children().eq(i),
                u = r && r.find(".owl-lazy");
            !u || n.inArray(r.get(0), this._loaded) > -1 || (u.each(n.proxy(function(i, r) {
                var e, u = n(r),
                    f = t.devicePixelRatio > 1 && u.attr("data-src-retina") || u.attr("data-src");
                this._core.trigger("load", {
                    element: u,
                    url: f
                }, "lazy");
                u.is("img") ? u.one("load.owl.lazy", n.proxy(function() {
                    u.css("opacity", 1);
                    this._core.trigger("loaded", {
                        element: u,
                        url: f
                    }, "lazy")
                }, this)).attr("src", f) : (e = new Image, e.onload = n.proxy(function() {
                    u.css({
                        "background-image": "url(" + f + ")",
                        opacity: "1"
                    });
                    this._core.trigger("loaded", {
                        element: u,
                        url: f
                    }, "lazy")
                }, this), e.src = f)
            }, this)), this._loaded.push(r.get(0)))
        };
        i.prototype.destroy = function() {
            var n, t;
            for (n in this.handlers) this._core.$element.off(n, this.handlers[n]);
            for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
        };
        n.fn.owlCarousel.Constructor.Plugins.Lazy = i
    }(window.Zepto || window.jQuery, window, document), function(n) {
        var t = function(i) {
            this._core = i;
            this._handlers = {
                "initialized.owl.carousel": n.proxy(function() {
                    this._core.settings.autoHeight && this.update()
                }, this),
                "changed.owl.carousel": n.proxy(function(n) {
                    this._core.settings.autoHeight && "position" == n.property.name && this.update()
                }, this),
                "loaded.owl.lazy": n.proxy(function(n) {
                    this._core.settings.autoHeight && n.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update()
                }, this)
            };
            this._core.options = n.extend({}, t.Defaults, this._core.options);
            this._core.$element.on(this._handlers)
        };
        t.Defaults = {
            autoHeight: !1,
            autoHeightClass: "owl-height"
        };
        t.prototype.update = function() {
            this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass)
        };
        t.prototype.destroy = function() {
            var n, t;
            for (n in this._handlers) this._core.$element.off(n, this._handlers[n]);
            for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
        };
        n.fn.owlCarousel.Constructor.Plugins.AutoHeight = t
    }(window.Zepto || window.jQuery, window, document), function(n, t, i) {
        var r = function(t) {
            this._core = t;
            this._videos = {};
            this._playing = null;
            this._fullscreen = !1;
            this._handlers = {
                "resize.owl.carousel": n.proxy(function(n) {
                    this._core.settings.video && !this.isInFullScreen() && n.preventDefault()
                }, this),
                "refresh.owl.carousel changed.owl.carousel": n.proxy(function() {
                    this._playing && this.stop()
                }, this),
                "prepared.owl.carousel": n.proxy(function(t) {
                    var i = n(t.content).find(".owl-video");
                    i.length && (i.css("display", "none"), this.fetch(i, n(t.content)))
                }, this)
            };
            this._core.options = n.extend({}, r.Defaults, this._core.options);
            this._core.$element.on(this._handlers);
            this._core.$element.on("click.owl.video", ".owl-video-play-icon", n.proxy(function(n) {
                this.play(n)
            }, this))
        };
        r.Defaults = {
            video: !1,
            videoHeight: !1,
            videoWidth: !1
        };
        r.prototype.fetch = function(n, t) {
            var u = n.attr("data-vimeo-id") ? "vimeo" : "youtube",
                i = n.attr("data-vimeo-id") || n.attr("data-youtube-id"),
                f = n.attr("data-width") || this._core.settings.videoWidth,
                e = n.attr("data-height") || this._core.settings.videoHeight,
                r = n.attr("href");
            if (!r) throw new Error("Missing video URL.");
            if (i = r.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), i[3].indexOf("youtu") > -1) u = "youtube";
            else {
                if (!(i[3].indexOf("vimeo") > -1)) throw new Error("Video URL not supported.");
                u = "vimeo"
            }
            i = i[6];
            this._videos[r] = {
                type: u,
                id: i,
                width: f,
                height: e
            };
            t.attr("data-video", r);
            this.thumbnail(n, this._videos[r])
        };
        r.prototype.thumbnail = function(t, i) {
            var o, s, r, c = i.width && i.height ? 'style="width:' + i.width + "px;height:" + i.height + 'px;"' : "",
                u = t.find("img"),
                f = "src",
                h = "",
                l = this._core.settings,
                e = function(n) {
                    s = '<div class="owl-video-play-icon"><\/div>';
                    o = l.lazyLoad ? '<div class="owl-video-tn ' + h + '" ' + f + '="' + n + '"><\/div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + n + ')"><\/div>';
                    t.after(o);
                    t.after(s)
                };
            return t.wrap('<div class="owl-video-wrapper"' + c + "><\/div>"), this._core.settings.lazyLoad && (f = "data-src", h = "owl-lazy"), u.length ? (e(u.attr(f)), u.remove(), !1) : void("youtube" === i.type ? (r = "http://img.youtube.com/vi/" + i.id + "/hqdefault.jpg", e(r)) : "vimeo" === i.type && n.ajax({
                type: "GET",
                url: "http://vimeo.com/api/v2/video/" + i.id + ".json",
                jsonp: "callback",
                dataType: "jsonp",
                success: function(n) {
                    r = n[0].thumbnail_large;
                    e(r)
                }
            }))
        };
        r.prototype.stop = function() {
            this._core.trigger("stop", null, "video");
            this._playing.find(".owl-video-frame").remove();
            this._playing.removeClass("owl-video-playing");
            this._playing = null
        };
        r.prototype.play = function(t) {
            this._core.trigger("play", null, "video");
            this._playing && this.stop();
            var r, o, s = n(t.target || t.srcElement),
                u = s.closest("." + this._core.settings.itemClass),
                i = this._videos[u.attr("data-video")],
                f = i.width || "100%",
                e = i.height || this._core.$stage.height();
            "youtube" === i.type ? r = '<iframe width="' + f + '" height="' + e + '" src="http://www.youtube.com/embed/' + i.id + "?autoplay=1&v=" + i.id + '" frameborder="0" allowfullscreen><\/iframe>' : "vimeo" === i.type && (r = '<iframe src="http://player.vimeo.com/video/' + i.id + '?autoplay=1" width="' + f + '" height="' + e + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen><\/iframe>');
            u.addClass("owl-video-playing");
            this._playing = u;
            o = n('<div style="height:' + e + "px; width:" + f + 'px" class="owl-video-frame">' + r + "<\/div>");
            s.after(o)
        };
        r.prototype.isInFullScreen = function() {
            var r = i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement;
            return r && n(r).parent().hasClass("owl-video-frame") && (this._core.speed(0), this._fullscreen = !0), r && this._fullscreen && this._playing ? !1 : this._fullscreen ? (this._fullscreen = !1, !1) : this._playing && this._core.state.orientation !== t.orientation ? (this._core.state.orientation = t.orientation, !1) : !0
        };
        r.prototype.destroy = function() {
            var n, t;
            this._core.$element.off("click.owl.video");
            for (n in this._handlers) this._core.$element.off(n, this._handlers[n]);
            for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
        };
        n.fn.owlCarousel.Constructor.Plugins.Video = r
    }(window.Zepto || window.jQuery, window, document), function(n, t, i, r) {
        var u = function(t) {
            this.core = t;
            this.core.options = n.extend({}, u.Defaults, this.core.options);
            this.swapping = !0;
            this.previous = r;
            this.next = r;
            this.handlers = {
                "change.owl.carousel": n.proxy(function(n) {
                    "position" == n.property.name && (this.previous = this.core.current(), this.next = n.property.value)
                }, this),
                "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": n.proxy(function(n) {
                    this.swapping = "translated" == n.type
                }, this),
                "translate.owl.carousel": n.proxy(function() {
                    this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
                }, this)
            };
            this.core.$element.on(this.handlers)
        };
        u.Defaults = {
            animateOut: !1,
            animateIn: !1
        };
        u.prototype.swap = function() {
            if (1 === this.core.settings.items && this.core.support3d) {
                this.core.speed(0);
                var t, i = n.proxy(this.clear, this),
                    f = this.core.$stage.children().eq(this.previous),
                    e = this.core.$stage.children().eq(this.next),
                    r = this.core.settings.animateIn,
                    u = this.core.settings.animateOut;
                this.core.current() !== this.previous && (u && (t = this.core.coordinates(this.previous) - this.core.coordinates(this.next), f.css({
                    left: t + "px"
                }).addClass("animated owl-animated-out").addClass(u).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", i)), r && e.addClass("animated owl-animated-in").addClass(r).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", i))
            }
        };
        u.prototype.clear = function(t) {
            n(t.target).css({
                left: ""
            }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut);
            this.core.transitionEnd()
        };
        u.prototype.destroy = function() {
            var n, t;
            for (n in this.handlers) this.core.$element.off(n, this.handlers[n]);
            for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
        };
        n.fn.owlCarousel.Constructor.Plugins.Animate = u
    }(window.Zepto || window.jQuery, window, document), function(n, t, i) {
        var r = function(t) {
            this.core = t;
            this.core.options = n.extend({}, r.Defaults, this.core.options);
            this.handlers = {
                "translated.owl.carousel refreshed.owl.carousel": n.proxy(function() {
                    this.autoplay()
                }, this),
                "play.owl.autoplay": n.proxy(function(n, t, i) {
                    this.play(t, i)
                }, this),
                "stop.owl.autoplay": n.proxy(function() {
                    this.stop()
                }, this),
                "mouseover.owl.autoplay": n.proxy(function() {
                    this.core.settings.autoplayHoverPause && this.pause()
                }, this),
                "mouseleave.owl.autoplay": n.proxy(function() {
                    this.core.settings.autoplayHoverPause && this.autoplay()
                }, this)
            };
            this.core.$element.on(this.handlers)
        };
        r.Defaults = {
            autoplay: !1,
            autoplayTimeout: 5e3,
            autoplayHoverPause: !1,
            autoplaySpeed: !1
        };
        r.prototype.autoplay = function() {
            this.core.settings.autoplay && !this.core.state.videoPlay ? (t.clearInterval(this.interval), this.interval = t.setInterval(n.proxy(function() {
                this.play()
            }, this), this.core.settings.autoplayTimeout)) : t.clearInterval(this.interval)
        };
        r.prototype.play = function() {
            if (i.hidden !== !0 && !this.core.state.isTouch && !this.core.state.isScrolling && !this.core.state.isSwiping && !this.core.state.inMotion) return this.core.settings.autoplay === !1 ? void t.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed)
        };
        r.prototype.stop = function() {
            t.clearInterval(this.interval)
        };
        r.prototype.pause = function() {
            t.clearInterval(this.interval)
        };
        r.prototype.destroy = function() {
            var n, i;
            t.clearInterval(this.interval);
            for (n in this.handlers) this.core.$element.off(n, this.handlers[n]);
            for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
        };
        n.fn.owlCarousel.Constructor.Plugins.autoplay = r
    }(window.Zepto || window.jQuery, window, document), function(n) {
        "use strict";
        var t = function(i) {
            this._core = i;
            this._initialized = !1;
            this._pages = [];
            this._controls = {};
            this._templates = [];
            this.$element = this._core.$element;
            this._overrides = {
                next: this._core.next,
                prev: this._core.prev,
                to: this._core.to
            };
            this._handlers = {
                "prepared.owl.carousel": n.proxy(function(t) {
                    this._core.settings.dotsData && this._templates.push(n(t.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
                }, this),
                "add.owl.carousel": n.proxy(function(t) {
                    this._core.settings.dotsData && this._templates.splice(t.position, 0, n(t.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
                }, this),
                "remove.owl.carousel prepared.owl.carousel": n.proxy(function(n) {
                    this._core.settings.dotsData && this._templates.splice(n.position, 1)
                }, this),
                "change.owl.carousel": n.proxy(function(n) {
                    if ("position" == n.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
                        var r = this._core.current(),
                            t = this._core.maximum(),
                            i = this._core.minimum();
                        n.data = n.property.value > t ? r >= t ? i : t : n.property.value < i ? t : n.property.value
                    }
                }, this),
                "changed.owl.carousel": n.proxy(function(n) {
                    "position" == n.property.name && this.draw()
                }, this),
                "refreshed.owl.carousel": n.proxy(function() {
                    this._initialized || (this.initialize(), this._initialized = !0);
                    this._core.trigger("refresh", null, "navigation");
                    this.update();
                    this.draw();
                    this._core.trigger("refreshed", null, "navigation")
                }, this)
            };
            this._core.options = n.extend({}, t.Defaults, this._core.options);
            this.$element.on(this._handlers)
        };
        t.Defaults = {
            nav: !1,
            navRewind: !0,
            navText: ["prev", "next"],
            navSpeed: !1,
            navElement: "div",
            navContainer: !1,
            navContainerClass: "owl-nav",
            navClass: ["owl-prev", "owl-next"],
            slideBy: 1,
            dotClass: "owl-dot",
            dotsClass: "owl-dots",
            dots: !0,
            dotsEach: !1,
            dotData: !1,
            dotsSpeed: !1,
            dotsContainer: !1,
            controlsClass: "owl-controls"
        };
        t.prototype.initialize = function() {
            var i, r, t = this._core.settings;
            t.dotsData || (this._templates = [n("<div>").addClass(t.dotClass).append(n("<span>")).prop("outerHTML")]);
            t.navContainer && t.dotsContainer || (this._controls.$container = n("<div>").addClass(t.controlsClass).appendTo(this.$element));
            this._controls.$indicators = t.dotsContainer ? n(t.dotsContainer) : n("<div>").hide().addClass(t.dotsClass).appendTo(this._controls.$container);
            this._controls.$indicators.on("click", "div", n.proxy(function(i) {
                var r = n(i.target).parent().is(this._controls.$indicators) ? n(i.target).index() : n(i.target).parent().index();
                i.preventDefault();
                this.to(r, t.dotsSpeed)
            }, this));
            i = t.navContainer ? n(t.navContainer) : n("<div>").addClass(t.navContainerClass).prependTo(this._controls.$container);
            this._controls.$next = n("<" + t.navElement + ">");
            this._controls.$previous = this._controls.$next.clone();
            this._controls.$previous.addClass(t.navClass[0]).html(t.navText[0]).hide().prependTo(i).on("click", n.proxy(function() {
                this.prev(t.navSpeed)
            }, this));
            this._controls.$next.addClass(t.navClass[1]).html(t.navText[1]).hide().appendTo(i).on("click", n.proxy(function() {
                this.next(t.navSpeed)
            }, this));
            for (r in this._overrides) this._core[r] = n.proxy(this[r], this)
        };
        t.prototype.destroy = function() {
            var n, r, t, i;
            for (n in this._handlers) this.$element.off(n, this._handlers[n]);
            for (r in this._controls) this._controls[r].remove();
            for (i in this.overides) this._core[i] = this._overrides[i];
            for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
        };
        t.prototype.update = function() {
            var t, i, u, n = this._core.settings,
                r = this._core.clones().length / 2,
                e = r + this._core.items().length,
                f = n.center || n.autoWidth || n.dotData ? 1 : n.dotsEach || n.items;
            if ("page" !== n.slideBy && (n.slideBy = Math.min(n.slideBy, n.items)), n.dots || "page" == n.slideBy)
                for (this._pages = [], t = r, i = 0, u = 0; e > t; t++)(i >= f || 0 === i) && (this._pages.push({
                    start: t - r,
                    end: t - r + f - 1
                }), i = 0, ++u), i += this._core.mergers(this._core.relative(t))
        };
        t.prototype.draw = function() {
            var i, r, u = "",
                t = this._core.settings,
                f = (this._core.$stage.children(), this._core.relative(this._core.current()));
            if (!t.nav || t.loop || t.navRewind || (this._controls.$previous.toggleClass("disabled", 0 >= f), this._controls.$next.toggleClass("disabled", f >= this._core.maximum())), this._controls.$previous.toggle(t.nav), this._controls.$next.toggle(t.nav), t.dots) {
                if (i = this._pages.length - this._controls.$indicators.children().length, t.dotData && 0 !== i) {
                    for (r = 0; r < this._controls.$indicators.children().length; r++) u += this._templates[this._core.relative(r)];
                    this._controls.$indicators.html(u)
                } else i > 0 ? (u = new Array(i + 1).join(this._templates[0]), this._controls.$indicators.append(u)) : 0 > i && this._controls.$indicators.children().slice(i).remove();
                this._controls.$indicators.find(".active").removeClass("active");
                this._controls.$indicators.children().eq(n.inArray(this.current(), this._pages)).addClass("active")
            }
            this._controls.$indicators.toggle(t.dots)
        };
        t.prototype.onTrigger = function(t) {
            var i = this._core.settings;
            t.page = {
                index: n.inArray(this.current(), this._pages),
                count: this._pages.length,
                size: i && (i.center || i.autoWidth || i.dotData ? 1 : i.dotsEach || i.items)
            }
        };
        t.prototype.current = function() {
            var t = this._core.relative(this._core.current());
            return n.grep(this._pages, function(n) {
                return n.start <= t && n.end >= t
            }).pop()
        };
        t.prototype.getPosition = function(t) {
            var i, r, u = this._core.settings;
            return "page" == u.slideBy ? (i = n.inArray(this.current(), this._pages), r = this._pages.length, t ? ++i : --i, i = this._pages[(i % r + r) % r].start) : (i = this._core.relative(this._core.current()), r = this._core.items().length, t ? i += u.slideBy : i -= u.slideBy), i
        };
        t.prototype.next = function(t) {
            n.proxy(this._overrides.to, this._core)(this.getPosition(!0), t)
        };
        t.prototype.prev = function(t) {
            n.proxy(this._overrides.to, this._core)(this.getPosition(!1), t)
        };
        t.prototype.to = function(t, i, r) {
            var u;
            r ? n.proxy(this._overrides.to, this._core)(t, i) : (u = this._pages.length, n.proxy(this._overrides.to, this._core)(this._pages[(t % u + u) % u].start, i))
        };
        n.fn.owlCarousel.Constructor.Plugins.Navigation = t
    }(window.Zepto || window.jQuery, window, document), function(n, t) {
        "use strict";
        var i = function(r) {
            this._core = r;
            this._hashes = {};
            this.$element = this._core.$element;
            this._handlers = {
                "initialized.owl.carousel": n.proxy(function() {
                    "URLHash" == this._core.settings.startPosition && n(t).trigger("hashchange.owl.navigation")
                }, this),
                "prepared.owl.carousel": n.proxy(function(t) {
                    var i = n(t.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
                    this._hashes[i] = t.content
                }, this)
            };
            this._core.options = n.extend({}, i.Defaults, this._core.options);
            this.$element.on(this._handlers);
            n(t).on("hashchange.owl.navigation", n.proxy(function() {
                var n = t.location.hash.substring(1),
                    i = this._core.$stage.children(),
                    r = this._hashes[n] && i.index(this._hashes[n]) || 0;
                return n ? void this._core.to(r, !1, !0) : !1
            }, this))
        };
        i.Defaults = {
            URLhashListener: !1
        };
        i.prototype.destroy = function() {
            var i, r;
            n(t).off("hashchange.owl.navigation");
            for (i in this._handlers) this._core.$element.off(i, this._handlers[i]);
            for (r in Object.getOwnPropertyNames(this)) "function" != typeof this[r] && (this[r] = null)
        };
        n.fn.owlCarousel.Constructor.Plugins.Hash = i
    }(window.Zepto || window.jQuery, window, document), ! function(n) {
        "use strict";

        function i(t, i) {
            this.element = n(t);
            this.settings = n.extend({}, r, i);
            this._defaults = r;
            this._init()
        }
        var t = "Morphext",
            r = {
                animation: "bounceIn",
                separator: ",",
                speed: 2e3,
                complete: n.noop
            };
        i.prototype = {
            _init: function() {
                var t = this;
                this.phrases = [];
                n.each(this.element.text().split(this.settings.separator), function(n, i) {
                    t.phrases.push(i.trim())
                });
                this.index = -1;
                this.animate();
                this.start()
            },
            animate: function() {
                this.index + 1 === this.phrases.length && (this.index = -1);
                ++this.index;
                this.element[0].innerHTML = '<span class="animated ' + this.settings.animation + '">' + this.phrases[this.index] + "<\/span>";
                n.isFunction(this.settings.complete) && this.settings.complete.call(this)
            },
            start: function() {
                var n = this;
                this._interval = setInterval(function() {
                    n.animate()
                }, this.settings.speed)
            },
            stop: function() {
                this._interval = clearInterval(this._interval)
            }
        };
        n.fn[t] = function(r) {
            return this.each(function() {
                n.data(this, "plugin_" + t) || n.data(this, "plugin_" + t, new i(this, r))
            })
        }
    }(jQuery), function(n) {
        function i() {}

        function t(n) {
            function u(t) {
                t.prototype.option || (t.prototype.option = function(t) {
                    n.isPlainObject(t) && (this.options = n.extend(!0, this.options, t))
                })
            }

            function f(i, u) {
                n.fn[i] = function(f) {
                    var h, o, c, l, e, s;
                    if (typeof f == "string") {
                        for (h = r.call(arguments, 1), o = 0, c = this.length; o < c; o++) {
                            if (l = this[o], e = n.data(l, i), !e) {
                                t("cannot call methods on " + i + " prior to initialization; attempted to call '" + f + "'");
                                continue
                            }
                            if (!n.isFunction(e[f]) || f.charAt(0) === "_") {
                                t("no such method '" + f + "' for " + i + " instance");
                                continue
                            }
                            if (s = e[f].apply(e, h), s !== undefined) return s
                        }
                        return this
                    }
                    return this.each(function() {
                        var t = n.data(this, i);
                        t ? (t.option(f), t._init()) : (t = new u(this, f), n.data(this, i, t))
                    })
                }
            }
            if (n) {
                var t = typeof console == "undefined" ? i : function(n) {
                    console.error(n)
                };
                return n.bridget = function(n, t) {
                    u(t);
                    f(n, t)
                }, n.bridget
            }
        }
        var r = Array.prototype.slice;
        typeof define == "function" && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], t) : typeof exports == "object" ? t(require("jquery")) : t(n.jQuery)
    }(window), function(n) {
        function f(t) {
            var i = n.event;
            return i.target = i.target || i.srcElement || t, i
        }
        var t = document.documentElement,
            u = function() {},
            i, r;
        t.addEventListener ? u = function(n, t, i) {
            n.addEventListener(t, i, !1)
        } : t.attachEvent && (u = function(n, t, i) {
            n[t + i] = i.handleEvent ? function() {
                var t = f(n);
                i.handleEvent.call(i, t)
            } : function() {
                var t = f(n);
                i.call(n, t)
            };
            n.attachEvent("on" + t, n[t + i])
        });
        i = function() {};
        t.removeEventListener ? i = function(n, t, i) {
            n.removeEventListener(t, i, !1)
        } : t.detachEvent && (i = function(n, t, i) {
            n.detachEvent("on" + t, n[t + i]);
            try {
                delete n[t + i]
            } catch (r) {
                n[t + i] = undefined
            }
        });
        r = {
            bind: u,
            unbind: i
        };
        typeof define == "function" && define.amd ? define("eventie/eventie", r) : typeof exports == "object" ? module.exports = r : n.eventie = r
    }(this), function(n) {
        function t(n) {
            typeof n == "function" && (t.isReady ? n() : f.push(n))
        }

        function r(n) {
            var r = n.type === "readystatechange" && i.readyState !== "complete";
            t.isReady || r || e()
        }

        function e() {
            var n, i, r;
            for (t.isReady = !0, n = 0, i = f.length; n < i; n++) r = f[n], r()
        }

        function u(u) {
            return i.readyState === "complete" ? e() : (u.bind(i, "DOMContentLoaded", r), u.bind(i, "readystatechange", r), u.bind(n, "load", r)), t
        }
        var i = n.document,
            f = [];
        t.isReady = !1;
        typeof define == "function" && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], u) : typeof exports == "object" ? module.exports = u(require("eventie")) : n.docReady = u(n.eventie)
    }(window), function() {
        function t() {}

        function u(n, t) {
            for (var i = n.length; i--;)
                if (n[i].listener === t) return i;
            return -1
        }

        function i(n) {
            return function() {
                return this[n].apply(this, arguments)
            }
        }
        var n = t.prototype,
            r = this,
            f = r.EventEmitter;
        n.getListeners = function(n) {
            var t = this._getEvents(),
                r, i;
            if (n instanceof RegExp) {
                r = {};
                for (i in t) t.hasOwnProperty(i) && n.test(i) && (r[i] = t[i])
            } else r = t[n] || (t[n] = []);
            return r
        };
        n.flattenListeners = function(n) {
            for (var i = [], t = 0; t < n.length; t += 1) i.push(n[t].listener);
            return i
        };
        n.getListenersAsObject = function(n) {
            var t = this.getListeners(n),
                i;
            return t instanceof Array && (i = {}, i[n] = t), i || t
        };
        n.addListener = function(n, t) {
            var i = this.getListenersAsObject(n),
                f = typeof t == "object",
                r;
            for (r in i) i.hasOwnProperty(r) && u(i[r], t) === -1 && i[r].push(f ? t : {
                listener: t,
                once: !1
            });
            return this
        };
        n.on = i("addListener");
        n.addOnceListener = function(n, t) {
            return this.addListener(n, {
                listener: t,
                once: !0
            })
        };
        n.once = i("addOnceListener");
        n.defineEvent = function(n) {
            return this.getListeners(n), this
        };
        n.defineEvents = function(n) {
            for (var t = 0; t < n.length; t += 1) this.defineEvent(n[t]);
            return this
        };
        n.removeListener = function(n, t) {
            var i = this.getListenersAsObject(n),
                f, r;
            for (r in i) i.hasOwnProperty(r) && (f = u(i[r], t), f !== -1 && i[r].splice(f, 1));
            return this
        };
        n.off = i("removeListener");
        n.addListeners = function(n, t) {
            return this.manipulateListeners(!1, n, t)
        };
        n.removeListeners = function(n, t) {
            return this.manipulateListeners(!0, n, t)
        };
        n.manipulateListeners = function(n, t, i) {
            var r, u, f = n ? this.removeListener : this.addListener,
                e = n ? this.removeListeners : this.addListeners;
            if (typeof t != "object" || t instanceof RegExp)
                for (r = i.length; r--;) f.call(this, t, i[r]);
            else
                for (r in t) t.hasOwnProperty(r) && (u = t[r]) && (typeof u == "function" ? f.call(this, r, u) : e.call(this, r, u));
            return this
        };
        n.removeEvent = function(n) {
            var r = typeof n,
                t = this._getEvents(),
                i;
            if (r === "string") delete t[n];
            else if (n instanceof RegExp)
                for (i in t) t.hasOwnProperty(i) && n.test(i) && delete t[i];
            else delete this._events;
            return this
        };
        n.removeAllListeners = i("removeEvent");
        n.emitEvent = function(n, t) {
            var r = this.getListenersAsObject(n),
                i, f, u, e;
            for (u in r)
                if (r.hasOwnProperty(u))
                    for (f = r[u].length; f--;) i = r[u][f], i.once === !0 && this.removeListener(n, i.listener), e = i.listener.apply(this, t || []), e === this._getOnceReturnValue() && this.removeListener(n, i.listener);
            return this
        };
        n.trigger = i("emitEvent");
        n.emit = function(n) {
            var t = Array.prototype.slice.call(arguments, 1);
            return this.emitEvent(n, t)
        };
        n.setOnceReturnValue = function(n) {
            return this._onceReturnValue = n, this
        };
        n._getOnceReturnValue = function() {
            return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
        };
        n._getEvents = function() {
            return this._events || (this._events = {})
        };
        t.noConflict = function() {
            return r.EventEmitter = f, t
        };
        typeof define == "function" && define.amd ? define("eventEmitter/EventEmitter", [], function() {
            return t
        }) : typeof module == "object" && module.exports ? module.exports = t : r.EventEmitter = t
    }.call(this), function(n) {
        function t(n) {
            var u, t, f;
            if (n) {
                if (typeof r[n] == "string") return n;
                for (n = n.charAt(0).toUpperCase() + n.slice(1), t = 0, f = i.length; t < f; t++)
                    if (u = i[t] + n, typeof r[u] == "string") return u
            }
        }
        var i = "Webkit Moz ms Ms O".split(" "),
            r = document.documentElement.style;
        typeof define == "function" && define.amd ? define("get-style-property/get-style-property", [], function() {
            return t
        }) : typeof exports == "object" ? module.exports = t : n.getStyleProperty = t
    }(window), function(n) {
        function i(n) {
            var t = parseFloat(n),
                i = n.indexOf("%") === -1 && !isNaN(t);
            return i && t
        }

        function u() {}

        function f() {
            for (var i, r = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, n = 0, u = t.length; n < u; n++) i = t[n], r[i] = 0;
            return r
        }

        function r(r) {
            function c() {
                var f, t, c, l;
                s || (s = !0, f = n.getComputedStyle, o = function() {
                    var n = f ? function(n) {
                        return f(n, null)
                    } : function(n) {
                        return n.currentStyle
                    };
                    return function(t) {
                        var i = n(t);
                        return i || e("Style returned " + i + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), i
                    }
                }(), u = r("boxSizing"), u && (t = document.createElement("div"), t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[u] = "border-box", c = document.body || document.documentElement, c.appendChild(t), l = o(t), h = i(l.width) === 200, c.removeChild(t)))
            }

            function l(n) {
                var e, r, w, s, b, v, l, y, p;
                if (c(), typeof n == "string" && (n = document.querySelector(n)), n && typeof n == "object" && n.nodeType) {
                    if (e = o(n), e.display === "none") return f();
                    for (r = {}, r.width = n.offsetWidth, r.height = n.offsetHeight, w = r.isBorderBox = !!(u && e[u] && e[u] === "border-box"), s = 0, b = t.length; s < b; s++) v = t[s], l = e[v], l = a(n, l), y = parseFloat(l), r[v] = isNaN(y) ? 0 : y;
                    var k = r.paddingLeft + r.paddingRight,
                        d = r.paddingTop + r.paddingBottom,
                        rt = r.marginLeft + r.marginRight,
                        ut = r.marginTop + r.marginBottom,
                        g = r.borderLeftWidth + r.borderRightWidth,
                        nt = r.borderTopWidth + r.borderBottomWidth,
                        tt = w && h,
                        it = i(e.width);
                    return it !== !1 && (r.width = it + (tt ? 0 : k + g)), p = i(e.height), p !== !1 && (r.height = p + (tt ? 0 : d + nt)), r.innerWidth = r.width - (k + g), r.innerHeight = r.height - (d + nt), r.outerWidth = r.width + rt, r.outerHeight = r.height + ut, r
                }
            }

            function a(t, i) {
                if (n.getComputedStyle || i.indexOf("%") === -1) return i;
                var r = t.style,
                    e = r.left,
                    u = t.runtimeStyle,
                    f = u && u.left;
                return f && (u.left = t.currentStyle.left), r.left = i, i = r.pixelLeft, r.left = e, f && (u.left = f), i
            }
            var s = !1,
                o, u, h;
            return l
        }
        var e = typeof console == "undefined" ? u : function(n) {
                console.error(n)
            },
            t = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        typeof define == "function" && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], r) : typeof exports == "object" ? module.exports = r(require("desandro-get-style-property")) : n.getSize = r(n.getStyleProperty)
    }(window), function(n) {
        function r(n, t) {
            for (var i in t) n[i] = t[i];
            return n
        }

        function u(n) {
            for (var t in n) return !1;
            return t = null, !0
        }

        function f(n) {
            return n.replace(/([A-Z])/g, function(n) {
                return "-" + n.toLowerCase()
            })
        }

        function t(n, t, i) {
            function o(n, t) {
                n && (this.element = n, this.layout = t, this.position = {
                    x: 0,
                    y: 0
                }, this._create())
            }
            var s = i("transition"),
                h = i("transform"),
                w = s && h,
                b = !!i("perspective"),
                c = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "otransitionend",
                    transition: "transitionend"
                }[s],
                l = ["transform", "transition", "transitionDuration", "transitionProperty"],
                k = function() {
                    for (var n, t, u = {}, r = 0, f = l.length; r < f; r++) n = l[r], t = i(n), t && t !== n && (u[n] = t);
                    return u
                }(),
                a, v, y, p;
            return r(o.prototype, n.prototype), o.prototype._create = function() {
                this._transn = {
                    ingProperties: {},
                    clean: {},
                    onEnd: {}
                };
                this.css({
                    position: "absolute"
                })
            }, o.prototype.handleEvent = function(n) {
                var t = "on" + n.type;
                this[t] && this[t](n)
            }, o.prototype.getSize = function() {
                this.size = t(this.element)
            }, o.prototype.css = function(n) {
                var r = this.element.style,
                    t, i;
                for (t in n) i = k[t] || t, r[i] = n[t]
            }, o.prototype.getPosition = function() {
                var r = e(this.element),
                    u = this.layout.options,
                    f = u.isOriginLeft,
                    o = u.isOriginTop,
                    n = parseInt(r[f ? "left" : "right"], 10),
                    t = parseInt(r[o ? "top" : "bottom"], 10),
                    i;
                n = isNaN(n) ? 0 : n;
                t = isNaN(t) ? 0 : t;
                i = this.layout.size;
                n -= f ? i.paddingLeft : i.paddingRight;
                t -= o ? i.paddingTop : i.paddingBottom;
                this.position.x = n;
                this.position.y = t
            }, o.prototype.layoutPosition = function() {
                var t = this.layout.size,
                    i = this.layout.options,
                    n = {};
                i.isOriginLeft ? (n.left = this.position.x + t.paddingLeft + "px", n.right = "") : (n.right = this.position.x + t.paddingRight + "px", n.left = "");
                i.isOriginTop ? (n.top = this.position.y + t.paddingTop + "px", n.bottom = "") : (n.bottom = this.position.y + t.paddingBottom + "px", n.top = "");
                this.css(n);
                this.emitEvent("layout", [this])
            }, a = b ? function(n, t) {
                return "translate3d(" + n + "px, " + t + "px, 0)"
            } : function(n, t) {
                return "translate(" + n + "px, " + t + "px)"
            }, o.prototype._transitionTo = function(n, t) {
                this.getPosition();
                var e = this.position.x,
                    o = this.position.y,
                    s = parseInt(n, 10),
                    h = parseInt(t, 10),
                    c = s === this.position.x && h === this.position.y;
                if (this.setPosition(n, t), c && !this.isTransitioning) {
                    this.layoutPosition();
                    return
                }
                var i = n - e,
                    r = t - o,
                    u = {},
                    f = this.layout.options;
                i = f.isOriginLeft ? i : -i;
                r = f.isOriginTop ? r : -r;
                u.transform = a(i, r);
                this.transition({
                    to: u,
                    onTransitionEnd: {
                        transform: this.layoutPosition
                    },
                    isCleaning: !0
                })
            }, o.prototype.goTo = function(n, t) {
                this.setPosition(n, t);
                this.layoutPosition()
            }, o.prototype.moveTo = w ? o.prototype._transitionTo : o.prototype.goTo, o.prototype.setPosition = function(n, t) {
                this.position.x = parseInt(n, 10);
                this.position.y = parseInt(t, 10)
            }, o.prototype._nonTransition = function(n) {
                this.css(n.to);
                n.isCleaning && this._removeStyles(n.to);
                for (var t in n.onTransitionEnd) n.onTransitionEnd[t].call(this)
            }, o.prototype._transition = function(n) {
                var i, t, r;
                if (!parseFloat(this.layout.options.transitionDuration)) {
                    this._nonTransition(n);
                    return
                }
                i = this._transn;
                for (t in n.onTransitionEnd) i.onEnd[t] = n.onTransitionEnd[t];
                for (t in n.to) i.ingProperties[t] = !0, n.isCleaning && (i.clean[t] = !0);
                n.from && (this.css(n.from), r = this.element.offsetHeight, r = null);
                this.enableTransition(n.to);
                this.css(n.to);
                this.isTransitioning = !0
            }, v = h && f(h) + ",opacity", o.prototype.enableTransition = function() {
                this.isTransitioning || (this.css({
                    transitionProperty: v,
                    transitionDuration: this.layout.options.transitionDuration
                }), this.element.addEventListener(c, this, !1))
            }, o.prototype.transition = o.prototype[s ? "_transition" : "_nonTransition"], o.prototype.onwebkitTransitionEnd = function(n) {
                this.ontransitionend(n)
            }, o.prototype.onotransitionend = function(n) {
                this.ontransitionend(n)
            }, y = {
                "-webkit-transform": "transform",
                "-moz-transform": "transform",
                "-o-transform": "transform"
            }, o.prototype.ontransitionend = function(n) {
                var t, i, r;
                n.target === this.element && (t = this._transn, i = y[n.propertyName] || n.propertyName, delete t.ingProperties[i], u(t.ingProperties) && this.disableTransition(), i in t.clean && (this.element.style[n.propertyName] = "", delete t.clean[i]), i in t.onEnd && (r = t.onEnd[i], r.call(this), delete t.onEnd[i]), this.emitEvent("transitionEnd", [this]))
            }, o.prototype.disableTransition = function() {
                this.removeTransitionStyles();
                this.element.removeEventListener(c, this, !1);
                this.isTransitioning = !1
            }, o.prototype._removeStyles = function(n) {
                var t = {},
                    i;
                for (i in n) t[i] = "";
                this.css(t)
            }, p = {
                transitionProperty: "",
                transitionDuration: ""
            }, o.prototype.removeTransitionStyles = function() {
                this.css(p)
            }, o.prototype.removeElem = function() {
                this.element.parentNode.removeChild(this.element);
                this.emitEvent("remove", [this])
            }, o.prototype.remove = function() {
                if (!s || !parseFloat(this.layout.options.transitionDuration)) {
                    this.removeElem();
                    return
                }
                var n = this;
                this.on("transitionEnd", function() {
                    return n.removeElem(), !0
                });
                this.hide()
            }, o.prototype.reveal = function() {
                delete this.isHidden;
                this.css({
                    display: ""
                });
                var n = this.layout.options;
                this.transition({
                    from: n.hiddenStyle,
                    to: n.visibleStyle,
                    isCleaning: !0
                })
            }, o.prototype.hide = function() {
                this.isHidden = !0;
                this.css({
                    display: ""
                });
                var n = this.layout.options;
                this.transition({
                    from: n.visibleStyle,
                    to: n.hiddenStyle,
                    isCleaning: !0,
                    onTransitionEnd: {
                        opacity: function() {
                            this.isHidden && this.css({
                                display: "none"
                            })
                        }
                    }
                })
            }, o.prototype.destroy = function() {
                this.css({
                    position: "",
                    left: "",
                    right: "",
                    top: "",
                    bottom: "",
                    transition: "",
                    transform: ""
                })
            }, o
        }
        var i = n.getComputedStyle,
            e = i ? function(n) {
                return i(n, null)
            } : function(n) {
                return n.currentStyle
            };
        typeof define == "function" && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property"], t) : typeof exports == "object" ? module.exports = t(require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property")) : (n.Outlayer = {}, n.Outlayer.Item = t(n.EventEmitter, n.getSize, n.getStyleProperty))
    }(window), function(n) {
        function t(n, t) {
            for (var i in t) n[i] = t[i];
            return n
        }

        function c(n) {
            return a.call(n) === "[object Array]"
        }

        function u(n) {
            var t = [],
                i, r;
            if (c(n)) t = n;
            else if (n && typeof n.length == "number")
                for (i = 0, r = n.length; i < r; i++) t.push(n[i]);
            else t.push(n);
            return t
        }

        function o(n, t) {
            var i = v(t, n);
            i !== -1 && t.splice(i, 1)
        }

        function l(n) {
            return n.replace(/(.)([A-Z])/g, function(n, t, i) {
                return t + "-" + i
            }).toLowerCase()
        }

        function f(f, c, a, v, y, p) {
            function w(n, i) {
                if (typeof n == "string" && (n = s.querySelector(n)), !n || !e(n)) {
                    r && r.error("Bad " + this.constructor.namespace + " element: " + n);
                    return
                }
                this.element = n;
                this.options = t({}, this.constructor.defaults);
                this.option(i);
                var u = ++k;
                this.element.outlayerGUID = u;
                b[u] = this;
                this._create();
                this.options.isInitLayout && this.layout()
            }
            var k = 0,
                b = {};
            return w.namespace = "outlayer", w.Item = p, w.defaults = {
                containerStyle: {
                    position: "relative"
                },
                isInitLayout: !0,
                isOriginLeft: !0,
                isOriginTop: !0,
                isResizeBound: !0,
                isResizingContainer: !0,
                transitionDuration: "0.4s",
                hiddenStyle: {
                    opacity: 0,
                    transform: "scale(0.001)"
                },
                visibleStyle: {
                    opacity: 1,
                    transform: "scale(1)"
                }
            }, t(w.prototype, a.prototype), w.prototype.option = function(n) {
                t(this.options, n)
            }, w.prototype._create = function() {
                this.reloadItems();
                this.stamps = [];
                this.stamp(this.options.stamp);
                t(this.element.style, this.options.containerStyle);
                this.options.isResizeBound && this.bindResize()
            }, w.prototype.reloadItems = function() {
                this.items = this._itemize(this.element.children)
            }, w.prototype._itemize = function(n) {
                for (var i, r, u = this._filterFindItemElements(n), e = this.constructor.Item, f = [], t = 0, o = u.length; t < o; t++) i = u[t], r = new e(i, this), f.push(r);
                return f
            }, w.prototype._filterFindItemElements = function(n) {
                var r, i, f, h, t, s, o, c;
                for (n = u(n), r = this.options.itemSelector, i = [], f = 0, h = n.length; f < h; f++)
                    if (t = n[f], e(t))
                        if (r)
                            for (y(t, r) && i.push(t), s = t.querySelectorAll(r), o = 0, c = s.length; o < c; o++) i.push(s[o]);
                        else i.push(t);
                return i
            }, w.prototype.getItemElements = function() {
                for (var t = [], n = 0, i = this.items.length; n < i; n++) t.push(this.items[n].element);
                return t
            }, w.prototype.layout = function() {
                this._resetLayout();
                this._manageStamps();
                var n = this.options.isLayoutInstant !== undefined ? this.options.isLayoutInstant : !this._isLayoutInited;
                this.layoutItems(this.items, n);
                this._isLayoutInited = !0
            }, w.prototype._init = w.prototype.layout, w.prototype._resetLayout = function() {
                this.getSize()
            }, w.prototype.getSize = function() {
                this.size = v(this.element)
            }, w.prototype._getMeasurement = function(n, t) {
                var i = this.options[n],
                    r;
                i ? (typeof i == "string" ? r = this.element.querySelector(i) : e(i) && (r = i), this[n] = r ? v(r)[t] : i) : this[n] = 0
            }, w.prototype.layoutItems = function(n, t) {
                n = this._getItemsForLayout(n);
                this._layoutItems(n, t);
                this._postLayout()
            }, w.prototype._getItemsForLayout = function(n) {
                for (var t, r = [], i = 0, u = n.length; i < u; i++) t = n[i], t.isIgnored || r.push(t);
                return r
            }, w.prototype._layoutItems = function(n, t) {
                function e() {
                    o.emitEvent("layoutComplete", [o, n])
                }
                var o = this,
                    f, i, s, r, u;
                if (!n || !n.length) {
                    e();
                    return
                }
                for (this._itemsOn(n, "layout", e), f = [], i = 0, s = n.length; i < s; i++) r = n[i], u = this._getItemLayoutPosition(r), u.item = r, u.isInstant = t || r.isLayoutInstant, f.push(u);
                this._processLayoutQueue(f)
            }, w.prototype._getItemLayoutPosition = function() {
                return {
                    x: 0,
                    y: 0
                }
            }, w.prototype._processLayoutQueue = function(n) {
                for (var t, i = 0, r = n.length; i < r; i++) t = n[i], this._positionItem(t.item, t.x, t.y, t.isInstant)
            }, w.prototype._positionItem = function(n, t, i, r) {
                r ? n.goTo(t, i) : n.moveTo(t, i)
            }, w.prototype._postLayout = function() {
                this.resizeContainer()
            }, w.prototype.resizeContainer = function() {
                if (this.options.isResizingContainer) {
                    var n = this._getContainerSize();
                    n && (this._setContainerMeasure(n.width, !0), this._setContainerMeasure(n.height, !1))
                }
            }, w.prototype._getContainerSize = h, w.prototype._setContainerMeasure = function(n, t) {
                if (n !== undefined) {
                    var i = this.size;
                    i.isBorderBox && (n += t ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth);
                    n = Math.max(n, 0);
                    this.element.style[t ? "width" : "height"] = n + "px"
                }
            }, w.prototype._itemsOn = function(n, t, i) {
                function e() {
                    return f++, f === o && i.call(s), !0
                }
                for (var u, f = 0, o = n.length, s = this, r = 0, h = n.length; r < h; r++) {
                    u = n[r];
                    u.on(t, e)
                }
            }, w.prototype.ignore = function(n) {
                var t = this.getItem(n);
                t && (t.isIgnored = !0)
            }, w.prototype.unignore = function(n) {
                var t = this.getItem(n);
                t && delete t.isIgnored
            }, w.prototype.stamp = function(n) {
                var t, i, r;
                if (n = this._find(n), n)
                    for (this.stamps = this.stamps.concat(n), t = 0, i = n.length; t < i; t++) r = n[t], this.ignore(r)
            }, w.prototype.unstamp = function(n) {
                var t, r, i;
                if (n = this._find(n), n)
                    for (t = 0, r = n.length; t < r; t++) i = n[t], o(i, this.stamps), this.unignore(i)
            }, w.prototype._find = function(n) {
                if (n) return typeof n == "string" && (n = this.element.querySelectorAll(n)), u(n)
            }, w.prototype._manageStamps = function() {
                var n, t, i;
                if (this.stamps && this.stamps.length)
                    for (this._getBoundingRect(), n = 0, t = this.stamps.length; n < t; n++) i = this.stamps[n], this._manageStamp(i)
            }, w.prototype._getBoundingRect = function() {
                var t = this.element.getBoundingClientRect(),
                    n = this.size;
                this._boundingRect = {
                    left: t.left + n.paddingLeft + n.borderLeftWidth,
                    top: t.top + n.paddingTop + n.borderTopWidth,
                    right: t.right - (n.paddingRight + n.borderRightWidth),
                    bottom: t.bottom - (n.paddingBottom + n.borderBottomWidth)
                }
            }, w.prototype._manageStamp = h, w.prototype._getElementOffset = function(n) {
                var t = n.getBoundingClientRect(),
                    i = this._boundingRect,
                    r = v(n);
                return {
                    left: t.left - i.left - r.marginLeft,
                    top: t.top - i.top - r.marginTop,
                    right: i.right - t.right - r.marginRight,
                    bottom: i.bottom - t.bottom - r.marginBottom
                }
            }, w.prototype.handleEvent = function(n) {
                var t = "on" + n.type;
                this[t] && this[t](n)
            }, w.prototype.bindResize = function() {
                this.isResizeBound || (f.bind(n, "resize", this), this.isResizeBound = !0)
            }, w.prototype.unbindResize = function() {
                this.isResizeBound && f.unbind(n, "resize", this);
                this.isResizeBound = !1
            }, w.prototype.onresize = function() {
                function t() {
                    n.resize();
                    delete n.resizeTimeout
                }
                this.resizeTimeout && clearTimeout(this.resizeTimeout);
                var n = this;
                this.resizeTimeout = setTimeout(t, 100)
            }, w.prototype.resize = function() {
                this.isResizeBound && this.needsResizeLayout() && this.layout()
            }, w.prototype.needsResizeLayout = function() {
                var n = v(this.element),
                    t = this.size && n;
                return t && n.innerWidth !== this.size.innerWidth
            }, w.prototype.addItems = function(n) {
                var t = this._itemize(n);
                return t.length && (this.items = this.items.concat(t)), t
            }, w.prototype.appended = function(n) {
                var t = this.addItems(n);
                t.length && (this.layoutItems(t, !0), this.reveal(t))
            }, w.prototype.prepended = function(n) {
                var t = this._itemize(n),
                    i;
                t.length && (i = this.items.slice(0), this.items = t.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(t, !0), this.reveal(t), this.layoutItems(i))
            }, w.prototype.reveal = function(n) {
                var i = n && n.length,
                    t, r;
                if (i)
                    for (t = 0; t < i; t++) r = n[t], r.reveal()
            }, w.prototype.hide = function(n) {
                var i = n && n.length,
                    t, r;
                if (i)
                    for (t = 0; t < i; t++) r = n[t], r.hide()
            }, w.prototype.getItem = function(n) {
                for (var t, i = 0, r = this.items.length; i < r; i++)
                    if (t = this.items[i], t.element === n) return t
            }, w.prototype.getItems = function(n) {
                var i, t, u, f, r;
                if (n && n.length) {
                    for (i = [], t = 0, u = n.length; t < u; t++) f = n[t], r = this.getItem(f), r && i.push(r);
                    return i
                }
            }, w.prototype.remove = function(n) {
                var t, i, f, r;
                if (n = u(n), t = this.getItems(n), t && t.length)
                    for (this._itemsOn(t, "remove", function() {
                            this.emitEvent("removeComplete", [this, t])
                        }), i = 0, f = t.length; i < f; i++) r = t[i], r.remove(), o(r, this.items)
            }, w.prototype.destroy = function() {
                var t = this.element.style,
                    n, r, u, f;
                for (t.height = "", t.position = "", t.width = "", n = 0, r = this.items.length; n < r; n++) u = this.items[n], u.destroy();
                this.unbindResize();
                f = this.element.outlayerGUID;
                delete b[f];
                delete this.element.outlayerGUID;
                i && i.removeData(this.element, this.constructor.namespace)
            }, w.data = function(n) {
                var t = n && n.outlayerGUID;
                return t && b[t]
            }, w.create = function(n, u) {
                function f() {
                    w.apply(this, arguments)
                }
                return Object.create ? f.prototype = Object.create(w.prototype) : t(f.prototype, w.prototype), f.prototype.constructor = f, f.defaults = t({}, w.defaults), t(f.defaults, u), f.prototype.settings = {}, f.namespace = n, f.data = w.data, f.Item = function() {
                    p.apply(this, arguments)
                }, f.Item.prototype = new p, c(function() {
                    for (var t, u, o, h, c = l(n), a = s.querySelectorAll(".js-" + c), v = "data-" + c + "-options", e = 0, y = a.length; e < y; e++) {
                        t = a[e];
                        u = t.getAttribute(v);
                        try {
                            o = u && JSON.parse(u)
                        } catch (p) {
                            r && r.error("Error parsing " + v + " on " + t.nodeName.toLowerCase() + (t.id ? "#" + t.id : "") + ": " + p);
                            continue
                        }
                        h = new f(t, o);
                        i && i.data(t, n, h)
                    }
                }), i && i.bridget && i.bridget(n, f), f
            }, w.Item = p, w
        }
        var s = n.document,
            r = n.console,
            i = n.jQuery,
            h = function() {},
            a = Object.prototype.toString,
            e = typeof HTMLElement == "function" || typeof HTMLElement == "object" ? function(n) {
                return n instanceof HTMLElement
            } : function(n) {
                return n && typeof n == "object" && n.nodeType === 1 && typeof n.nodeName == "string"
            },
            v = Array.prototype.indexOf ? function(n, t) {
                return n.indexOf(t)
            } : function(n, t) {
                for (var i = 0, r = n.length; i < r; i++)
                    if (n[i] === t) return i;
                return -1
            };
        typeof define == "function" && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item"], f) : typeof exports == "object" ? module.exports = f(require("eventie"), require("doc-ready"), require("wolfy87-eventemitter"), require("get-size"), require("desandro-matches-selector"), require("./item")) : n.Outlayer = f(n.eventie, n.docReady, n.EventEmitter, n.getSize, n.matchesSelector, n.Outlayer.Item)
    }(window), function(n) {
        function t(n) {
            function t() {
                n.Item.apply(this, arguments)
            }
            t.prototype = new n.Item;
            t.prototype._create = function() {
                this.id = this.layout.itemGUID++;
                n.Item.prototype._create.call(this);
                this.sortData = {}
            };
            t.prototype.updateSortData = function() {
                var t, i, n, r;
                if (!this.isIgnored) {
                    this.sortData.id = this.id;
                    this.sortData["original-order"] = this.id;
                    this.sortData.random = Math.random();
                    t = this.layout.options.getSortData;
                    i = this.layout._sorters;
                    for (n in t) r = i[n], this.sortData[n] = r(this.element, this)
                }
            };
            var i = t.prototype.destroy;
            return t.prototype.destroy = function() {
                i.apply(this, arguments);
                this.css({
                    display: ""
                })
            }, t
        }
        typeof define == "function" && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], t) : typeof exports == "object" ? module.exports = t(require("outlayer")) : (n.Isotope = n.Isotope || {}, n.Isotope.Item = t(n.Outlayer))
    }(window), function(n) {
        function t(n, t) {
            function i(n) {
                this.isotope = n;
                n && (this.options = n.options[this.namespace], this.element = n.element, this.items = n.filteredItems, this.size = n.size)
            }
            return function() {
                function f(n) {
                    return function() {
                        return t.prototype[n].apply(this.isotope, arguments)
                    }
                }
                for (var n, u = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], r = 0, e = u.length; r < e; r++) n = u[r], i.prototype[n] = f(n)
            }(), i.prototype.needsVerticalResizeLayout = function() {
                var t = n(this.isotope.element),
                    i = this.isotope.size && t;
                return i && t.innerHeight !== this.isotope.size.innerHeight
            }, i.prototype._getMeasurement = function() {
                this.isotope._getMeasurement.apply(this, arguments)
            }, i.prototype.getColumnWidth = function() {
                this.getSegmentSize("column", "Width")
            }, i.prototype.getRowHeight = function() {
                this.getSegmentSize("row", "Height")
            }, i.prototype.getSegmentSize = function(n, t) {
                var i = n + t,
                    u = "outer" + t,
                    r;
                (this._getMeasurement(i, u), this[i]) || (r = this.getFirstItemSize(), this[i] = r && r[u] || this.isotope.size["inner" + t])
            }, i.prototype.getFirstItemSize = function() {
                var t = this.isotope.filteredItems[0];
                return t && t.element && n(t.element)
            }, i.prototype.layout = function() {
                this.isotope.layout.apply(this.isotope, arguments)
            }, i.prototype.getSize = function() {
                this.isotope.getSize();
                this.size = this.isotope.size
            }, i.modes = {}, i.create = function(n, t) {
                function r() {
                    i.apply(this, arguments)
                }
                return r.prototype = new i, t && (r.options = t), r.prototype.namespace = n, i.modes[n] = r, r
            }, i
        }
        typeof define == "function" && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], t) : typeof exports == "object" ? module.exports = t(require("get-size"), require("outlayer")) : (n.Isotope = n.Isotope || {}, n.Isotope.LayoutMode = t(n.getSize, n.Outlayer))
    }(window), function(n) {
        function t(n, t) {
            var r = n.create("masonry");
            return r.prototype._resetLayout = function() {
                this.getSize();
                this._getMeasurement("columnWidth", "outerWidth");
                this._getMeasurement("gutter", "outerWidth");
                this.measureColumns();
                var n = this.cols;
                for (this.colYs = []; n--;) this.colYs.push(0);
                this.maxY = 0
            }, r.prototype.measureColumns = function() {
                if (this.getContainerWidth(), !this.columnWidth) {
                    var n = this.items[0],
                        i = n && n.element;
                    this.columnWidth = i && t(i).outerWidth || this.containerWidth
                }
                this.columnWidth += this.gutter;
                this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth);
                this.cols = Math.max(this.cols, 1)
            }, r.prototype.getContainerWidth = function() {
                var i = this.options.isFitWidth ? this.element.parentNode : this.element,
                    n = t(i);
                this.containerWidth = n && n.innerWidth
            }, r.prototype._getItemLayoutPosition = function(n) {
                var t;
                n.getSize();
                var e = n.size.outerWidth % this.columnWidth,
                    s = e && e < 1 ? "round" : "ceil",
                    r = Math[s](n.size.outerWidth / this.columnWidth);
                r = Math.min(r, this.cols);
                var u = this._getColGroup(r),
                    f = Math.min.apply(Math, u),
                    o = i(u, f),
                    h = {
                        x: this.columnWidth * o,
                        y: f
                    },
                    c = f + n.size.outerHeight,
                    l = this.cols + 1 - u.length;
                for (t = 0; t < l; t++) this.colYs[o + t] = c;
                return h
            }, r.prototype._getColGroup = function(n) {
                var i, r, t, u;
                if (n < 2) return this.colYs;
                for (i = [], r = this.cols + 1 - n, t = 0; t < r; t++) u = this.colYs.slice(t, t + n), i[t] = Math.max.apply(Math, u);
                return i
            }, r.prototype._manageStamp = function(n) {
                var e = t(n),
                    u = this._getElementOffset(n),
                    o = this.options.isOriginLeft ? u.left : u.right,
                    s = o + e.outerWidth,
                    f = Math.floor(o / this.columnWidth),
                    i, h, r;
                for (f = Math.max(0, f), i = Math.floor(s / this.columnWidth), i -= s % this.columnWidth ? 0 : 1, i = Math.min(this.cols - 1, i), h = (this.options.isOriginTop ? u.top : u.bottom) + e.outerHeight, r = f; r <= i; r++) this.colYs[r] = Math.max(h, this.colYs[r])
            }, r.prototype._getContainerSize = function() {
                this.maxY = Math.max.apply(Math, this.colYs);
                var n = {
                    height: this.maxY
                };
                return this.options.isFitWidth && (n.width = this._getContainerFitWidth()), n
            }, r.prototype._getContainerFitWidth = function() {
                for (var n = 0, t = this.cols; --t;) {
                    if (this.colYs[t] !== 0) break;
                    n++
                }
                return (this.cols - n) * this.columnWidth - this.gutter
            }, r.prototype.needsResizeLayout = function() {
                var n = this.containerWidth;
                return this.getContainerWidth(), n !== this.containerWidth
            }, r
        }
        var i = Array.prototype.indexOf ? function(n, t) {
            return n.indexOf(t)
        } : function(n, t) {
            for (var r, i = 0, u = n.length; i < u; i++)
                if (r = n[i], r === t) return i;
            return -1
        };
        typeof define == "function" && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], t) : typeof exports == "object" ? module.exports = t(require("outlayer"), require("get-size")) : n.Masonry = t(n.Outlayer, n.getSize)
    }(window), function(n) {
        function i(n, t) {
            for (var i in t) n[i] = t[i];
            return n
        }

        function t(n, t) {
            var r = n.create("masonry"),
                e = r.prototype._getElementOffset,
                o = r.prototype.layout,
                s = r.prototype._getMeasurement,
                u, f;
            return i(r.prototype, t.prototype), r.prototype._getElementOffset = e, r.prototype.layout = o, r.prototype._getMeasurement = s, u = r.prototype.measureColumns, r.prototype.measureColumns = function() {
                this.items = this.isotope.filteredItems;
                u.call(this)
            }, f = r.prototype._manageStamp, r.prototype._manageStamp = function() {
                this.options.isOriginLeft = this.isotope.options.isOriginLeft;
                this.options.isOriginTop = this.isotope.options.isOriginTop;
                f.apply(this, arguments)
            }, r
        }
        typeof define == "function" && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], t) : typeof exports == "object" ? module.exports = t(require("../layout-mode"), require("masonry-layout")) : t(n.Isotope.LayoutMode, n.Masonry)
    }(window), function(n) {
        function t(n) {
            var t = n.create("fitRows");
            return t.prototype._resetLayout = function() {
                this.x = 0;
                this.y = 0;
                this.maxY = 0;
                this._getMeasurement("gutter", "outerWidth")
            }, t.prototype._getItemLayoutPosition = function(n) {
                var t, i, r;
                return n.getSize(), t = n.size.outerWidth + this.gutter, i = this.isotope.size.innerWidth + this.gutter, this.x !== 0 && t + this.x > i && (this.x = 0, this.y = this.maxY), r = {
                    x: this.x,
                    y: this.y
                }, this.maxY = Math.max(this.maxY, this.y + n.size.outerHeight), this.x += t, r
            }, t.prototype._getContainerSize = function() {
                return {
                    height: this.maxY
                }
            }, t
        }
        typeof define == "function" && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], t) : typeof exports == "object" ? module.exports = t(require("../layout-mode")) : t(n.Isotope.LayoutMode)
    }(window), function(n) {
        function t(n) {
            var t = n.create("vertical", {
                horizontalAlignment: 0
            });
            return t.prototype._resetLayout = function() {
                this.y = 0
            }, t.prototype._getItemLayoutPosition = function(n) {
                n.getSize();
                var t = (this.isotope.size.innerWidth - n.size.outerWidth) * this.options.horizontalAlignment,
                    i = this.y;
                return this.y += n.size.outerHeight, {
                    x: t,
                    y: i
                }
            }, t.prototype._getContainerSize = function() {
                return {
                    height: this.y
                }
            }, t
        }
        typeof define == "function" && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], t) : typeof exports == "object" ? module.exports = t(require("../layout-mode")) : t(n.Isotope.LayoutMode)
    }(window), function(n) {
        function u(n, t) {
            for (var i in t) n[i] = t[i];
            return n
        }

        function f(n) {
            return c.call(n) === "[object Array]"
        }

        function i(n) {
            var t = [],
                i, r;
            if (f(n)) t = n;
            else if (n && typeof n.length == "number")
                for (i = 0, r = n.length; i < r; i++) t.push(n[i]);
            else t.push(n);
            return t
        }

        function e(n, t) {
            var i = l(t, n);
            i !== -1 && t.splice(i, 1)
        }

        function t(n, t, f, s, c) {
            function y(n, t) {
                return function(i, r) {
                    for (var s, h, u = 0, c = n.length; u < c; u++) {
                        var f = n[u],
                            e = i.sortData[f],
                            o = r.sortData[f];
                        if (e > o || e < o) return s = t[f] !== undefined ? t[f] : t, h = s ? 1 : -1, (e > o ? 1 : -1) * h
                    }
                    return 0
                }
            }
            var l = n.create("isotope", {
                    layoutMode: "masonry",
                    isJQueryFiltering: !0,
                    sortAscending: !0
                }),
                a, v;
            return l.Item = s, l.LayoutMode = c, l.prototype._create = function() {
                this.itemGUID = 0;
                this._sorters = {};
                this._getSorters();
                n.prototype._create.call(this);
                this.modes = {};
                this.filteredItems = this.items;
                this.sortHistory = ["original-order"];
                for (var t in c.modes) this._initLayoutMode(t)
            }, l.prototype.reloadItems = function() {
                this.itemGUID = 0;
                n.prototype.reloadItems.call(this)
            }, l.prototype._itemize = function() {
                for (var r, t = n.prototype._itemize.apply(this, arguments), i = 0, u = t.length; i < u; i++) r = t[i], r.id = this.itemGUID++;
                return this._updateItemsSortData(t), t
            }, l.prototype._initLayoutMode = function(n) {
                var t = c.modes[n],
                    i = this.options[n] || {};
                this.options[n] = t.options ? u(t.options, i) : i;
                this.modes[n] = new t(this)
            }, l.prototype.layout = function() {
                if (!this._isLayoutInited && this.options.isInitLayout) {
                    this.arrange();
                    return
                }
                this._layout()
            }, l.prototype._layout = function() {
                var n = this._getIsInstant();
                this._resetLayout();
                this._manageStamps();
                this.layoutItems(this.filteredItems, n);
                this._isLayoutInited = !0
            }, l.prototype.arrange = function(n) {
                this.option(n);
                this._getIsInstant();
                this.filteredItems = this._filter(this.items);
                this._sort();
                this._layout()
            }, l.prototype._init = l.prototype.arrange, l.prototype._getIsInstant = function() {
                var n = this.options.isLayoutInstant !== undefined ? this.options.isLayoutInstant : !this._isLayoutInited;
                return this._isInstant = n, n
            }, l.prototype._filter = function(n) {
                function e() {
                    f.reveal(h);
                    f.hide(c)
                }
                var u = this.options.filter,
                    i, o, t, r, f;
                u = u || "*";
                var s = [],
                    h = [],
                    c = [],
                    l = this._getFilterTest(u);
                for (i = 0, o = n.length; i < o; i++)(t = n[i], t.isIgnored) || (r = l(t), r && s.push(t), r && t.isHidden ? h.push(t) : r || t.isHidden || c.push(t));
                return f = this, this._isInstant ? this._noTransition(e) : e(), s
            }, l.prototype._getFilterTest = function(n) {
                return r && this.options.isJQueryFiltering ? function(t) {
                    return r(t.element).is(n)
                } : typeof n == "function" ? function(t) {
                    return n(t.element)
                } : function(t) {
                    return f(t.element, n)
                }
            }, l.prototype.updateSortData = function(n) {
                var t;
                n ? (n = i(n), t = this.getItems(n)) : t = this.items;
                this._getSorters();
                this._updateItemsSortData(t)
            }, l.prototype._getSorters = function() {
                var t = this.options.getSortData,
                    n, i;
                for (n in t) i = t[n], this._sorters[n] = a(i)
            }, l.prototype._updateItemsSortData = function(n) {
                for (var i, r = n && n.length, t = 0; r && t < r; t++) i = n[t], i.updateSortData()
            }, a = function() {
                function n(n) {
                    if (typeof n != "string") return n;
                    var i = o(n).split(" "),
                        r = i[0],
                        u = r.match(/^\[(.+)\]$/),
                        s = u && u[1],
                        f = t(s, r),
                        e = l.sortDataParsers[i[1]];
                    return e ? function(n) {
                        return n && e(f(n))
                    } : function(n) {
                        return n && f(n)
                    }
                }

                function t(n, t) {
                    return n ? function(t) {
                        return t.getAttribute(n)
                    } : function(n) {
                        var i = n.querySelector(t);
                        return i && h(i)
                    }
                }
                return n
            }(), l.sortDataParsers = {
                parseInt: function(n) {
                    return parseInt(n, 10)
                },
                parseFloat: function(n) {
                    return parseFloat(n)
                }
            }, l.prototype._sort = function() {
                var n = this.options.sortBy,
                    t, i;
                n && (t = [].concat.apply(n, this.sortHistory), i = y(t, this.options.sortAscending), this.filteredItems.sort(i), n !== this.sortHistory[0] && this.sortHistory.unshift(n))
            }, l.prototype._mode = function() {
                var n = this.options.layoutMode,
                    t = this.modes[n];
                if (!t) throw new Error("No layout mode: " + n);
                return t.options = this.options[n], t
            }, l.prototype._resetLayout = function() {
                n.prototype._resetLayout.call(this);
                this._mode()._resetLayout()
            }, l.prototype._getItemLayoutPosition = function(n) {
                return this._mode()._getItemLayoutPosition(n)
            }, l.prototype._manageStamp = function(n) {
                this._mode()._manageStamp(n)
            }, l.prototype._getContainerSize = function() {
                return this._mode()._getContainerSize()
            }, l.prototype.needsResizeLayout = function() {
                return this._mode().needsResizeLayout()
            }, l.prototype.appended = function(n) {
                var t = this.addItems(n),
                    i;
                t.length && (i = this._filterRevealAdded(t), this.filteredItems = this.filteredItems.concat(i))
            }, l.prototype.prepended = function(n) {
                var t = this._itemize(n),
                    i, r;
                t.length && (i = this.items.slice(0), this.items = t.concat(i), this._resetLayout(), this._manageStamps(), r = this._filterRevealAdded(t), this.layoutItems(i), this.filteredItems = r.concat(this.filteredItems))
            }, l.prototype._filterRevealAdded = function(n) {
                var t = this._noTransition(function() {
                    return this._filter(n)
                });
                return this.layoutItems(t, !0), this.reveal(t), n
            }, l.prototype.insert = function(n) {
                var i = this.addItems(n),
                    t, f, r, u;
                if (i.length) {
                    for (r = i.length, t = 0; t < r; t++) f = i[t], this.element.appendChild(f.element);
                    for (u = this._filter(i), this._noTransition(function() {
                            this.hide(u)
                        }), t = 0; t < r; t++) i[t].isLayoutInstant = !0;
                    for (this.arrange(), t = 0; t < r; t++) delete i[t].isLayoutInstant;
                    this.reveal(u)
                }
            }, v = l.prototype.remove, l.prototype.remove = function(n) {
                var t, r, u, f;
                if (n = i(n), t = this.getItems(n), v.call(this, n), t && t.length)
                    for (r = 0, u = t.length; r < u; r++) f = t[r], e(f, this.filteredItems)
            }, l.prototype.shuffle = function() {
                for (var t, n = 0, i = this.items.length; n < i; n++) t = this.items[n], t.sortData.random = Math.random();
                this.options.sortBy = "random";
                this._sort();
                this._layout()
            }, l.prototype._noTransition = function(n) {
                var i = this.options.transitionDuration,
                    t;
                return this.options.transitionDuration = 0, t = n.call(this), this.options.transitionDuration = i, t
            }, l.prototype.getFilteredItemElements = function() {
                for (var t = [], n = 0, i = this.filteredItems.length; n < i; n++) t.push(this.filteredItems[n].element);
                return t
            }, l
        }
        var r = n.jQuery,
            o = String.prototype.trim ? function(n) {
                return n.trim()
            } : function(n) {
                return n.replace(/^\s+|\s+$/g, "")
            },
            s = document.documentElement,
            h = s.textContent ? function(n) {
                return n.textContent
            } : function(n) {
                return n.innerText
            },
            c = Object.prototype.toString,
            l = Array.prototype.indexOf ? function(n, t) {
                return n.indexOf(t)
            } : function(n, t) {
                for (var i = 0, r = n.length; i < r; i++)
                    if (n[i] === t) return i;
                return -1
            };
        typeof define == "function" && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "matches-selector/matches-selector", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], t) : typeof exports == "object" ? module.exports = t(require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("./item"), require("./layout-mode"), require("./layout-modes/masonry"), require("./layout-modes/fit-rows"), require("./layout-modes/vertical")) : n.Isotope = t(n.Outlayer, n.getSize, n.matchesSelector, n.Isotope.Item, n.Isotope.LayoutMode)
    }(window), Swiper = function(n, t) {
        "use strict";

        function h(n, t) {
            return document.querySelectorAll ? (t || document).querySelectorAll(n) : jQuery(n, t)
        }

        function oi(n) {
            return "[object Array]" === Object.prototype.toString.apply(n) ? !0 : !1
        }

        function f() {
            var n = w - u;
            return t.freeMode && (n = w - u), t.slidesPerView > i.slides.length && !t.centeredSlides && (n = 0), 0 > n && (n = 0), n
        }

        function si() {
            function f(n) {
                var r = new Image;
                r.onload = function() {
                    "undefined" != typeof i && null !== i && (void 0 !== i.imagesLoaded && i.imagesLoaded++, i.imagesLoaded === i.imagesToLoad.length && (i.reInit(), t.onImagesReady && i.fireCallback(t.onImagesReady, i)))
                };
                r.src = n
            }
            var n = i.h.addEventListener,
                r = "wrapper" === t.eventTarget ? i.wrapper : i.container,
                u;
            if (i.browser.ie10 || i.browser.ie11 ? (n(r, i.touchEvents.touchStart, v), n(document, i.touchEvents.touchMove, y), n(document, i.touchEvents.touchEnd, p)) : (i.support.touch && (n(r, "touchstart", v), n(r, "touchmove", y), n(r, "touchend", p)), t.simulateTouch && (n(r, "mousedown", v), n(document, "mousemove", y), n(document, "mouseup", p))), t.autoResize && n(window, "resize", i.resizeFix), kt(), i._wheelEvent = !1, t.mousewheelControl) {
                if (void 0 !== document.onmousewheel && (i._wheelEvent = "mousewheel"), !i._wheelEvent) try {
                    new WheelEvent("wheel");
                    i._wheelEvent = "wheel"
                } catch (e) {}
                i._wheelEvent || (i._wheelEvent = "DOMMouseScroll");
                i._wheelEvent && n(i.container, i._wheelEvent, ft)
            }
            if (t.keyboardControl && n(document, "keydown", ut), t.updateOnImagesReady)
                for (i.imagesToLoad = h("img", i.container), u = 0; u < i.imagesToLoad.length; u++) f(i.imagesToLoad[u].getAttribute("src"))
        }

        function kt() {
            var n, r = i.h.addEventListener,
                u, f;
            if (t.preventLinks)
                for (u = h("a", i.container), n = 0; n < u.length; n++) r(u[n], "click", ii);
            if (t.releaseFormElements)
                for (f = h("input, textarea, select", i.container), n = 0; n < f.length; n++) r(f[n], i.touchEvents.touchStart, ri, !0);
            if (t.onSlideClick)
                for (n = 0; n < i.slides.length; n++) r(i.slides[n], "click", gt);
            if (t.onSlideTouch)
                for (n = 0; n < i.slides.length; n++) r(i.slides[n], i.touchEvents.touchStart, ni)
        }

        function dt() {
            var n, r = i.h.removeEventListener,
                u, f;
            if (t.onSlideClick)
                for (n = 0; n < i.slides.length; n++) r(i.slides[n], "click", gt);
            if (t.onSlideTouch)
                for (n = 0; n < i.slides.length; n++) r(i.slides[n], i.touchEvents.touchStart, ni);
            if (t.releaseFormElements)
                for (u = h("input, textarea, select", i.container), n = 0; n < u.length; n++) r(u[n], i.touchEvents.touchStart, ri, !0);
            if (t.preventLinks)
                for (f = h("a", i.container), n = 0; n < f.length; n++) r(f[n], "click", ii)
        }

        function ut(n) {
            var t = n.keyCode || n.charCode,
                f;
            if (!(n.shiftKey || n.altKey || n.ctrlKey || n.metaKey)) {
                if (37 === t || 39 === t || 38 === t || 40 === t) {
                    for (var o = !1, u = i.h.getOffset(i.container), s = i.h.windowScroll().left, h = i.h.windowScroll().top, l = i.h.windowWidth(), a = i.h.windowHeight(), c = [
                            [u.left, u.top],
                            [u.left + i.width, u.top],
                            [u.left, u.top + i.height],
                            [u.left + i.width, u.top + i.height]
                        ], e = 0; e < c.length; e++) f = c[e], f[0] >= s && f[0] <= s + l && f[1] >= h && f[1] <= h + a && (o = !0);
                    if (!o) return
                }
                r ? ((37 === t || 39 === t) && (n.preventDefault ? n.preventDefault() : n.returnValue = !1), 39 === t && i.swipeNext(), 37 === t && i.swipePrev()) : ((38 === t || 40 === t) && (n.preventDefault ? n.preventDefault() : n.returnValue = !1), 40 === t && i.swipeNext(), 38 === t && i.swipePrev())
            }
        }

        function ft(n) {
            var o = i._wheelEvent,
                u = 0,
                e;
            if (n.detail) u = -n.detail;
            else if ("mousewheel" === o)
                if (t.mousewheelControlForceToAxis)
                    if (r) {
                        if (!(Math.abs(n.wheelDeltaX) > Math.abs(n.wheelDeltaY))) return;
                        u = n.wheelDeltaX
                    } else {
                        if (!(Math.abs(n.wheelDeltaY) > Math.abs(n.wheelDeltaX))) return;
                        u = n.wheelDeltaY
                    } else u = n.wheelDelta;
            else if ("DOMMouseScroll" === o) u = -n.detail;
            else if ("wheel" === o)
                if (t.mousewheelControlForceToAxis)
                    if (r) {
                        if (!(Math.abs(n.deltaX) > Math.abs(n.deltaY))) return;
                        u = -n.deltaX
                    } else {
                        if (!(Math.abs(n.deltaY) > Math.abs(n.deltaX))) return;
                        u = -n.deltaY
                    } else u = Math.abs(n.deltaX) > Math.abs(n.deltaY) ? -n.deltaX : -n.deltaY;
            if (t.freeMode) {
                if (e = i.getWrapperTranslate() + u, e > 0 && (e = 0), e < -f() && (e = -f()), i.setWrapperTransition(0), i.setWrapperTranslate(e), i.updateActiveSlide(e), 0 === e || e === -f()) return
            } else(new Date).getTime() - bt > 60 && (0 > u ? i.swipeNext() : i.swipePrev()), bt = (new Date).getTime();
            return t.autoplay && i.stopAutoplay(!0), n.preventDefault ? n.preventDefault() : n.returnValue = !1, !1
        }

        function gt(n) {
            i.allowSlideClick && (ti(n), i.fireCallback(t.onSlideClick, i, n))
        }

        function ni(n) {
            ti(n);
            i.fireCallback(t.onSlideTouch, i, n)
        }

        function ti(n) {
            if (n.currentTarget) i.clickedSlide = n.currentTarget;
            else {
                var r = n.srcElement;
                do {
                    if (r.className.indexOf(t.slideClass) > -1) break;
                    r = r.parentNode
                } while (r);
                i.clickedSlide = r
            }
            i.clickedSlideIndex = i.slides.indexOf(i.clickedSlide);
            i.clickedSlideLoopIndex = i.clickedSlideIndex - (i.loopedSlides || 0)
        }

        function ii(n) {
            if (!i.allowLinks) return n.preventDefault ? n.preventDefault() : n.returnValue = !1, t.preventLinksPropagation && "stopPropagation" in n && n.stopPropagation(), !1
        }

        function ri(n) {
            return n.stopPropagation ? n.stopPropagation() : n.returnValue = !1, !1
        }

        function v(n) {
            var u, o, f, e;
            if ((t.preventLinks && (i.allowLinks = !0), i.isTouched || t.onlyExternal) || (u = n.target || n.srcElement, document.activeElement && document.activeElement !== u && document.activeElement.blur(), o = "input select textarea".split(" "), t.noSwiping && u && hi(u)) || (rt = !1, i.isTouched = !0, s = "touchstart" === n.type, !s && "which" in n && 3 === n.which)) return !1;
            s && 1 !== n.targetTouches.length || (i.callPlugins("onTouchStartBegin"), !s && !i.isAndroid && o.indexOf(u.tagName.toLowerCase()) < 0 && (n.preventDefault ? n.preventDefault() : n.returnValue = !1), f = s ? n.targetTouches[0].pageX : n.pageX || n.clientX, e = s ? n.targetTouches[0].pageY : n.pageY || n.clientY, i.touches.startX = i.touches.currentX = f, i.touches.startY = i.touches.currentY = e, i.touches.start = i.touches.current = r ? f : e, i.setWrapperTransition(0), i.positions.start = i.positions.current = i.getWrapperTranslate(), i.setWrapperTranslate(i.positions.start), i.times.start = (new Date).getTime(), a = void 0, t.moveStartThreshold > 0 && (lt = !1), t.onTouchStart && i.fireCallback(t.onTouchStart, i, n), i.callPlugins("onTouchStartEnd"))
        }

        function y(n) {
            var e, o, h, c, l, v;
            if (i.isTouched && !t.onlyExternal && (!s || "mousemove" !== n.type)) {
                if (e = s ? n.targetTouches[0].pageX : n.pageX || n.clientX, o = s ? n.targetTouches[0].pageY : n.pageY || n.clientY, "undefined" == typeof a && r && (a = !!(a || Math.abs(o - i.touches.startY) > Math.abs(e - i.touches.startX))), "undefined" != typeof a || r || (a = !!(a || Math.abs(o - i.touches.startY) < Math.abs(e - i.touches.startX))), a) return void(i.isTouched = !1);
                if (r) {
                    if (!t.swipeToNext && e < i.touches.startX || !t.swipeToPrev && e > i.touches.startX) return
                } else if (!t.swipeToNext && o < i.touches.startY || !t.swipeToPrev && o > i.touches.startY) return;
                if (n.assignedToSwiper) return void(i.isTouched = !1);
                if (n.assignedToSwiper = !0, t.preventLinks && (i.allowLinks = !1), t.onSlideClick && (i.allowSlideClick = !1), t.autoplay && i.stopAutoplay(!0), !s || 1 === n.touches.length) {
                    if ((i.isMoved || (i.callPlugins("onTouchMoveStart"), t.loop && (i.fixLoop(), i.positions.start = i.getWrapperTranslate()), t.onTouchMoveStart && i.fireCallback(t.onTouchMoveStart, i)), i.isMoved = !0, n.preventDefault ? n.preventDefault() : n.returnValue = !1, i.touches.current = r ? e : o, i.positions.current = (i.touches.current - i.touches.start) * t.touchRatio + i.positions.start, i.positions.current > 0 && t.onResistanceBefore && i.fireCallback(t.onResistanceBefore, i, i.positions.current), i.positions.current < -f() && t.onResistanceAfter && i.fireCallback(t.onResistanceAfter, i, Math.abs(i.positions.current + f())), t.resistance && "100%" !== t.resistance) && (i.positions.current > 0 && (h = 1 - i.positions.current / u / 2, i.positions.current = .5 > h ? u / 2 : i.positions.current * h), i.positions.current < -f()) && (c = (i.touches.current - i.touches.start) * t.touchRatio + (f() + i.positions.start), h = (u + c) / u, l = i.positions.current - c * (1 - h) / 2, v = -f() - u / 2, i.positions.current = v > l || 0 >= h ? v : l), t.resistance && "100%" === t.resistance && (i.positions.current > 0 && (!t.freeMode || t.freeModeFluid) && (i.positions.current = 0), i.positions.current < -f() && (!t.freeMode || t.freeModeFluid) && (i.positions.current = -f())), !t.followFinger) return;
                    if (t.moveStartThreshold)
                        if (Math.abs(i.touches.current - i.touches.start) > t.moveStartThreshold || lt) {
                            if (!lt) return lt = !0, void(i.touches.start = i.touches.current);
                            i.setWrapperTranslate(i.positions.current)
                        } else i.positions.current = i.positions.start;
                    else i.setWrapperTranslate(i.positions.current);
                    return (t.freeMode || t.watchActiveIndex) && i.updateActiveSlide(i.positions.current), t.grabCursor && (i.container.style.cursor = "move", i.container.style.cursor = "grabbing", i.container.style.cursor = "-moz-grabbin", i.container.style.cursor = "-webkit-grabbing"), it || (it = i.touches.current), at || (at = (new Date).getTime()), i.velocity = (i.touches.current - it) / ((new Date).getTime() - at) / 2, Math.abs(i.touches.current - it) < 2 && (i.velocity = 0), it = i.touches.current, at = (new Date).getTime(), i.callPlugins("onTouchMoveEnd"), t.onTouchMove && i.fireCallback(t.onTouchMove, i, n), !1
                }
            }
        }

        function p(n) {
            var s, h;
            if (a && i.swipeReset(), !t.onlyExternal && i.isTouched) {
                i.isTouched = !1;
                t.grabCursor && (i.container.style.cursor = "move", i.container.style.cursor = "grab", i.container.style.cursor = "-moz-grab", i.container.style.cursor = "-webkit-grab");
                i.positions.current || 0 === i.positions.current || (i.positions.current = i.positions.start);
                t.followFinger && i.setWrapperTranslate(i.positions.current);
                i.times.end = (new Date).getTime();
                i.touches.diff = i.touches.current - i.touches.start;
                i.touches.abs = Math.abs(i.touches.diff);
                i.positions.diff = i.positions.current - i.positions.start;
                i.positions.abs = Math.abs(i.positions.diff);
                var nt = i.positions.diff,
                    c = i.positions.abs,
                    l = i.times.end - i.times.start;
                if (5 > c && 300 > l && i.allowLinks === !1 && (t.freeMode || 0 === c || i.swipeReset(), t.preventLinks && (i.allowLinks = !0), t.onSlideClick && (i.allowSlideClick = !0)), setTimeout(function() {
                        "undefined" != typeof i && null !== i && (t.preventLinks && (i.allowLinks = !0), t.onSlideClick && (i.allowSlideClick = !0))
                    }, 100), s = f(), !i.isMoved && t.freeMode) return i.isMoved = !1, t.onTouchEnd && i.fireCallback(t.onTouchEnd, i, n), void i.callPlugins("onTouchEnd");
                if (!i.isMoved || i.positions.current > 0 || i.positions.current < -s) return i.swipeReset(), t.onTouchEnd && i.fireCallback(t.onTouchEnd, i, n), void i.callPlugins("onTouchEnd");
                if (i.isMoved = !1, t.freeMode) {
                    if (t.freeModeFluid) {
                        var p, w = 1e3 * t.momentumRatio,
                            tt = i.velocity * w,
                            o = i.positions.current + tt,
                            b = !1,
                            v = 20 * Math.abs(i.velocity) * t.momentumBounceRatio; - s > o && (t.momentumBounce && i.support.transitions ? (-v > o + s && (o = -s - v), p = -s, b = !0, rt = !0) : o = -s);
                        o > 0 && (t.momentumBounce && i.support.transitions ? (o > v && (o = v), p = 0, b = !0, rt = !0) : o = 0);
                        0 !== i.velocity && (w = Math.abs((o - i.positions.current) / i.velocity));
                        i.setWrapperTranslate(o);
                        i.setWrapperTransition(w);
                        t.momentumBounce && b && i.wrapperTransitionEnd(function() {
                            rt && (t.onMomentumBounce && i.fireCallback(t.onMomentumBounce, i), i.callPlugins("onMomentumBounce"), i.setWrapperTranslate(p), i.setWrapperTransition(300))
                        });
                        i.updateActiveSlide(o)
                    }
                    return (!t.freeModeFluid || l >= 300) && i.updateActiveSlide(i.positions.current), t.onTouchEnd && i.fireCallback(t.onTouchEnd, i, n), void i.callPlugins("onTouchEnd")
                }
                if (d = 0 > nt ? "toNext" : "toPrev", "toNext" === d && 300 >= l && (30 > c || !t.shortSwipes ? i.swipeReset() : i.swipeNext(!0)), "toPrev" === d && 300 >= l && (30 > c || !t.shortSwipes ? i.swipeReset() : i.swipePrev(!0)), h = 0, "auto" === t.slidesPerView) {
                    for (var k, it = Math.abs(i.getWrapperTranslate()), g = 0, y = 0; y < i.slides.length; y++)
                        if (k = r ? i.slides[y].getWidth(!0, t.roundLengths) : i.slides[y].getHeight(!0, t.roundLengths), g += k, g > it) {
                            h = k;
                            break
                        }
                    h > u && (h = u)
                } else h = e * t.slidesPerView;
                "toNext" === d && l > 300 && (c >= h * t.longSwipesRatio ? i.swipeNext(!0) : i.swipeReset());
                "toPrev" === d && l > 300 && (c >= h * t.longSwipesRatio ? i.swipePrev(!0) : i.swipeReset());
                t.onTouchEnd && i.fireCallback(t.onTouchEnd, i, n);
                i.callPlugins("onTouchEnd")
            }
        }

        function hi(n) {
            var i = !1;
            do n.className.indexOf(t.noSwipingClass) > -1 && (i = !0), n = n.parentElement; while (!i && n.parentElement && -1 === n.className.indexOf(t.wrapperClass));
            return !i && n.className.indexOf(t.wrapperClass) > -1 && n.className.indexOf(t.noSwipingClass) > -1 && (i = !0), i
        }

        function ui(n, t) {
            var i, r = document.createElement("div");
            return r.innerHTML = t, i = r.firstChild, i.className += " " + n, i.outerHTML
        }

        function et(n, r, u) {
            function o() {
                var s = +new Date,
                    a = s - c;
                f += l * a / (1e3 / 60);
                h = "toNext" === e ? f > n : n > f;
                h ? (i.setWrapperTranslate(Math.ceil(f)), i._DOMAnimating = !0, window.setTimeout(function() {
                    o()
                }, 1e3 / 60)) : (t.onSlideChangeEnd && ("to" === r ? u.runCallbacks === !0 && i.fireCallback(t.onSlideChangeEnd, i, e) : i.fireCallback(t.onSlideChangeEnd, i, e)), i.setWrapperTranslate(n), i._DOMAnimating = !1)
            }
            var s = "to" === r && u.speed >= 0 ? u.speed : t.speed,
                c = +new Date;
            if (i.support.transitions || !t.DOMAnimation) i.setWrapperTranslate(n), i.setWrapperTransition(s);
            else {
                var f = i.getWrapperTranslate(),
                    l = Math.ceil((n - f) / s * (1e3 / 60)),
                    e = f > n ? "toNext" : "toPrev",
                    h = "toNext" === e ? f > n : n > f;
                if (i._DOMAnimating) return;
                o()
            }
            i.updateActiveSlide(n);
            t.onSlideNext && "next" === r && i.fireCallback(t.onSlideNext, i, n);
            t.onSlidePrev && "prev" === r && i.fireCallback(t.onSlidePrev, i, n);
            t.onSlideReset && "reset" === r && i.fireCallback(t.onSlideReset, i, n);
            ("next" === r || "prev" === r || "to" === r && u.runCallbacks === !0) && ci(r)
        }

        function ci(n) {
            if (i.callPlugins("onSlideChangeStart"), t.onSlideChangeStart)
                if (t.queueStartCallbacks && i.support.transitions) {
                    if (i._queueStartCallbacks) return;
                    i._queueStartCallbacks = !0;
                    i.fireCallback(t.onSlideChangeStart, i, n);
                    i.wrapperTransitionEnd(function() {
                        i._queueStartCallbacks = !1
                    })
                } else i.fireCallback(t.onSlideChangeStart, i, n);
            if (t.onSlideChangeEnd)
                if (i.support.transitions)
                    if (t.queueEndCallbacks) {
                        if (i._queueEndCallbacks) return;
                        i._queueEndCallbacks = !0;
                        i.wrapperTransitionEnd(function(r) {
                            i.fireCallback(t.onSlideChangeEnd, r, n)
                        })
                    } else i.wrapperTransitionEnd(function(r) {
                        i.fireCallback(t.onSlideChangeEnd, r, n)
                    });
            else t.DOMAnimation || setTimeout(function() {
                i.fireCallback(t.onSlideChangeEnd, i, n)
            }, 10)
        }

        function fi() {
            var t = i.paginationButtons,
                n;
            if (t)
                for (n = 0; n < t.length; n++) i.h.removeEventListener(t[n], "click", ei)
        }

        function li() {
            var t = i.paginationButtons,
                n;
            if (t)
                for (n = 0; n < t.length; n++) i.h.addEventListener(t[n], "click", ei)
        }

        function ei(n) {
            for (var u, e = n.target || n.srcElement, f = i.paginationButtons, r = 0; r < f.length; r++) e === f[r] && (u = r);
            t.autoplay && i.stopAutoplay(!0);
            i.swipeTo(u)
        }

        function vt() {
            o = setTimeout(function() {
                t.loop ? (i.fixLoop(), i.swipeNext(!0)) : i.swipeNext(!0) || (t.autoplayStopOnLast ? (clearTimeout(o), o = void 0) : i.swipeTo(0));
                i.wrapperTransitionEnd(function() {
                    "undefined" != typeof o && vt()
                })
            }, t.autoplay)
        }

        function ai() {
            i.calcSlides();
            t.loader.slides.length > 0 && 0 === i.slides.length && i.loadSlides();
            t.loop && i.createLoop();
            i.init();
            si();
            t.pagination && i.createPagination(!0);
            t.loop || t.initialSlide > 0 ? i.swipeTo(t.initialSlide, 0, !1) : i.updateActiveSlide(0);
            t.autoplay && i.startAutoplay();
            i.centerIndex = i.activeIndex;
            t.onSwiperCreated && i.fireCallback(t.onSwiperCreated, i);
            i.callPlugins("onSwiperCreated")
        }
        var yt, i, ot, e, w, d, a, u, g, c, st, r, b, k, pt, ht, nt, ct, wt, bt, tt, lt, it, at, s, rt, o, l;
        if (!document.body.outerHTML && document.body.__defineGetter__ && HTMLElement && (yt = HTMLElement.prototype, yt.__defineGetter__ && yt.__defineGetter__("outerHTML", function() {
                return (new XMLSerializer).serializeToString(this)
            })), window.getComputedStyle || (window.getComputedStyle = function(n) {
                return this.el = n, this.getPropertyValue = function(t) {
                    var i = /(\-([a-z]){1})/g;
                    return "float" === t && (t = "styleFloat"), i.test(t) && (t = t.replace(i, function() {
                        return arguments[2].toUpperCase()
                    })), n.currentStyle[t] ? n.currentStyle[t] : null
                }, this
            }), Array.prototype.indexOf || (Array.prototype.indexOf = function(n, t) {
                for (var i = t || 0, r = this.length; r > i; i++)
                    if (this[i] === n) return i;
                return -1
            }), (document.querySelectorAll || window.jQuery) && "undefined" != typeof n && (n.nodeType || 0 !== h(n).length)) {
            i = this;
            i.touches = {
                start: 0,
                startX: 0,
                startY: 0,
                current: 0,
                currentX: 0,
                currentY: 0,
                diff: 0,
                abs: 0
            };
            i.positions = {
                start: 0,
                abs: 0,
                diff: 0,
                current: 0
            };
            i.times = {
                start: 0,
                end: 0
            };
            i.id = (new Date).getTime();
            i.container = n.nodeType ? n : h(n)[0];
            i.isTouched = !1;
            i.isMoved = !1;
            i.activeIndex = 0;
            i.centerIndex = 0;
            i.activeLoaderIndex = 0;
            i.activeLoopIndex = 0;
            i.previousIndex = null;
            i.velocity = 0;
            i.snapGrid = [];
            i.slidesGrid = [];
            i.imagesToLoad = [];
            i.imagesLoaded = 0;
            i.wrapperLeft = 0;
            i.wrapperRight = 0;
            i.wrapperTop = 0;
            i.wrapperBottom = 0;
            i.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") >= 0;
            g = {
                eventTarget: "wrapper",
                mode: "horizontal",
                touchRatio: 1,
                speed: 300,
                freeMode: !1,
                freeModeFluid: !1,
                momentumRatio: 1,
                momentumBounce: !0,
                momentumBounceRatio: 1,
                slidesPerView: 1,
                slidesPerGroup: 1,
                slidesPerViewFit: !0,
                simulateTouch: !0,
                followFinger: !0,
                shortSwipes: !0,
                longSwipesRatio: .5,
                moveStartThreshold: !1,
                onlyExternal: !1,
                createPagination: !0,
                pagination: !1,
                paginationElement: "span",
                paginationClickable: !1,
                paginationAsRange: !0,
                resistance: !0,
                scrollContainer: !1,
                preventLinks: !0,
                preventLinksPropagation: !1,
                noSwiping: !1,
                noSwipingClass: "swiper-no-swiping",
                initialSlide: 0,
                keyboardControl: !1,
                mousewheelControl: !1,
                mousewheelControlForceToAxis: !1,
                useCSS3Transforms: !0,
                autoplay: !1,
                autoplayDisableOnInteraction: !0,
                autoplayStopOnLast: !1,
                loop: !1,
                loopAdditionalSlides: 0,
                roundLengths: !1,
                calculateHeight: !1,
                cssWidthAndHeight: !1,
                updateOnImagesReady: !0,
                releaseFormElements: !0,
                watchActiveIndex: !1,
                visibilityFullFit: !1,
                offsetPxBefore: 0,
                offsetPxAfter: 0,
                offsetSlidesBefore: 0,
                offsetSlidesAfter: 0,
                centeredSlides: !1,
                queueStartCallbacks: !1,
                queueEndCallbacks: !1,
                autoResize: !0,
                resizeReInit: !1,
                DOMAnimation: !0,
                loader: {
                    slides: [],
                    slidesHTMLType: "inner",
                    surroundGroups: 1,
                    logic: "reload",
                    loadAllSlides: !1
                },
                swipeToPrev: !0,
                swipeToNext: !0,
                slideElement: "div",
                slideClass: "swiper-slide",
                slideActiveClass: "swiper-slide-active",
                slideVisibleClass: "swiper-slide-visible",
                slideDuplicateClass: "swiper-slide-duplicate",
                wrapperClass: "swiper-wrapper",
                paginationElementClass: "swiper-pagination-switch",
                paginationActiveClass: "swiper-active-switch",
                paginationVisibleClass: "swiper-visible-switch"
            };
            t = t || {};
            for (c in g)
                if (c in t && "object" == typeof t[c])
                    for (st in g[c]) st in t[c] || (t[c][st] = g[c][st]);
                else c in t || (t[c] = g[c]);
            for (i.params = t, t.scrollContainer && (t.freeMode = !0, t.freeModeFluid = !0), t.loop && (t.resistance = "100%"), r = "horizontal" === t.mode, b = ["mousedown", "mousemove", "mouseup"], i.browser.ie10 && (b = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]), i.browser.ie11 && (b = ["pointerdown", "pointermove", "pointerup"]), i.touchEvents = {
                    touchStart: i.support.touch || !t.simulateTouch ? "touchstart" : b[0],
                    touchMove: i.support.touch || !t.simulateTouch ? "touchmove" : b[1],
                    touchEnd: i.support.touch || !t.simulateTouch ? "touchend" : b[2]
                }, k = i.container.childNodes.length - 1; k >= 0; k--)
                if (i.container.childNodes[k].className)
                    for (pt = i.container.childNodes[k].className.split(/\s+/), ht = 0; ht < pt.length; ht++) pt[ht] === t.wrapperClass && (ot = i.container.childNodes[k]);
            i.wrapper = ot;
            i._extendSwiperSlide = function(n) {
                return n.append = function() {
                    return t.loop ? n.insertAfter(i.slides.length - i.loopedSlides) : (i.wrapper.appendChild(n), i.reInit()), n
                }, n.prepend = function() {
                    return t.loop ? (i.wrapper.insertBefore(n, i.slides[i.loopedSlides]), i.removeLoopedSlides(), i.calcSlides(), i.createLoop()) : i.wrapper.insertBefore(n, i.wrapper.firstChild), i.reInit(), n
                }, n.insertAfter = function(r) {
                    if ("undefined" == typeof r) return !1;
                    var u;
                    return t.loop ? (u = i.slides[r + 1 + i.loopedSlides], u ? i.wrapper.insertBefore(n, u) : i.wrapper.appendChild(n), i.removeLoopedSlides(), i.calcSlides(), i.createLoop()) : (u = i.slides[r + 1], i.wrapper.insertBefore(n, u)), i.reInit(), n
                }, n.clone = function() {
                    return i._extendSwiperSlide(n.cloneNode(!0))
                }, n.remove = function() {
                    i.wrapper.removeChild(n);
                    i.reInit()
                }, n.html = function(t) {
                    return "undefined" == typeof t ? n.innerHTML : (n.innerHTML = t, n)
                }, n.index = function() {
                    for (var r, t = i.slides.length - 1; t >= 0; t--) n === i.slides[t] && (r = t);
                    return r
                }, n.isActive = function() {
                    return n.index() === i.activeIndex ? !0 : !1
                }, n.swiperSlideDataStorage || (n.swiperSlideDataStorage = {}), n.getData = function(t) {
                    return n.swiperSlideDataStorage[t]
                }, n.setData = function(t, i) {
                    return n.swiperSlideDataStorage[t] = i, n
                }, n.data = function(t, i) {
                    return "undefined" == typeof i ? n.getAttribute("data-" + t) : (n.setAttribute("data-" + t, i), n)
                }, n.getWidth = function(t, r) {
                    return i.h.getWidth(n, t, r)
                }, n.getHeight = function(t, r) {
                    return i.h.getHeight(n, t, r)
                }, n.getOffset = function() {
                    return i.h.getOffset(n)
                }, n
            };
            i.calcSlides = function(n) {
                var f = i.slides ? i.slides.length : !1,
                    r;
                for (i.slides = [], i.displaySlides = [], r = 0; r < i.wrapper.childNodes.length; r++)
                    if (i.wrapper.childNodes[r].className)
                        for (var o = i.wrapper.childNodes[r].className, e = o.split(/\s+/), u = 0; u < e.length; u++) e[u] === t.slideClass && i.slides.push(i.wrapper.childNodes[r]);
                for (r = i.slides.length - 1; r >= 0; r--) i._extendSwiperSlide(i.slides[r]);
                f !== !1 && (f !== i.slides.length || n) && (dt(), kt(), i.updateActiveSlide(), i.params.pagination && i.createPagination(), i.callPlugins("numberOfSlidesChanged"))
            };
            i.createSlide = function(n, r, u) {
                r = r || i.params.slideClass;
                u = u || t.slideElement;
                var f = document.createElement(u);
                return f.innerHTML = n || "", f.className = r, i._extendSwiperSlide(f)
            };
            i.appendSlide = function(n, t, r) {
                if (n) return n.nodeType ? i._extendSwiperSlide(n).append() : i.createSlide(n, t, r).append()
            };
            i.prependSlide = function(n, t, r) {
                if (n) return n.nodeType ? i._extendSwiperSlide(n).prepend() : i.createSlide(n, t, r).prepend()
            };
            i.insertSlideAfter = function(n, t, r, u) {
                return "undefined" == typeof n ? !1 : t.nodeType ? i._extendSwiperSlide(t).insertAfter(n) : i.createSlide(t, r, u).insertAfter(n)
            };
            i.removeSlide = function(n) {
                if (i.slides[n]) {
                    if (t.loop) {
                        if (!i.slides[n + i.loopedSlides]) return !1;
                        i.slides[n + i.loopedSlides].remove();
                        i.removeLoopedSlides();
                        i.calcSlides();
                        i.createLoop()
                    } else i.slides[n].remove();
                    return !0
                }
                return !1
            };
            i.removeLastSlide = function() {
                return i.slides.length > 0 ? (t.loop ? (i.slides[i.slides.length - 1 - i.loopedSlides].remove(), i.removeLoopedSlides(), i.calcSlides(), i.createLoop()) : i.slides[i.slides.length - 1].remove(), !0) : !1
            };
            i.removeAllSlides = function() {
                for (var n = i.slides.length - 1; n >= 0; n--) i.slides[n].remove()
            };
            i.getSlide = function(n) {
                return i.slides[n]
            };
            i.getLastSlide = function() {
                return i.slides[i.slides.length - 1]
            };
            i.getFirstSlide = function() {
                return i.slides[0]
            };
            i.activeSlide = function() {
                return i.slides[i.activeIndex]
            };
            i.fireCallback = function() {
                var n = arguments[0],
                    r;
                if ("[object Array]" === Object.prototype.toString.call(n))
                    for (r = 0; r < n.length; r++) "function" == typeof n[r] && n[r](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                else "[object String]" === Object.prototype.toString.call(n) ? t["on" + n] && i.fireCallback(t["on" + n], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]) : n(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            };
            i.addCallback = function(n, t) {
                var i, r = this;
                return r.params["on" + n] ? oi(this.params["on" + n]) ? this.params["on" + n].push(t) : "function" == typeof this.params["on" + n] ? (i = this.params["on" + n], this.params["on" + n] = [], this.params["on" + n].push(i), this.params["on" + n].push(t)) : void 0 : (this.params["on" + n] = [], this.params["on" + n].push(t))
            };
            i.removeCallbacks = function(n) {
                i.params["on" + n] && (i.params["on" + n] = null)
            };
            nt = [];
            for (ct in i.plugins) t[ct] && (wt = i.plugins[ct](i, t[ct]), wt && nt.push(wt));
            i.callPlugins = function(n, t) {
                t || (t = {});
                for (var i = 0; i < nt.length; i++) n in nt[i] && nt[i][n](t)
            };
            (i.browser.ie10 || i.browser.ie11) && !t.onlyExternal && i.wrapper.classList.add("swiper-wp8-" + (r ? "horizontal" : "vertical"));
            t.freeMode && (i.container.className += " swiper-free-mode");
            i.initialized = !1;
            i.init = function(n, f) {
                var tt = i.h.getWidth(i.container, !1, t.roundLengths),
                    it = i.h.getHeight(i.container, !1, t.roundLengths),
                    a, c, y, p, l, h, s, o, k, d, g, v, b, nt;
                if (tt !== i.width || it !== i.height || n) {
                    if (i.width = tt, i.height = it, u = r ? tt : it, o = i.wrapper, n && i.calcSlides(f), "auto" === t.slidesPerView) {
                        for (k = 0, d = 0, t.slidesOffset > 0 && (o.style.paddingLeft = "", o.style.paddingRight = "", o.style.paddingTop = "", o.style.paddingBottom = ""), o.style.width = "", o.style.height = "", t.offsetPxBefore > 0 && (r ? i.wrapperLeft = t.offsetPxBefore : i.wrapperTop = t.offsetPxBefore), t.offsetPxAfter > 0 && (r ? i.wrapperRight = t.offsetPxAfter : i.wrapperBottom = t.offsetPxAfter), t.centeredSlides && (r ? (i.wrapperLeft = (u - this.slides[0].getWidth(!0, t.roundLengths)) / 2, i.wrapperRight = (u - i.slides[i.slides.length - 1].getWidth(!0, t.roundLengths)) / 2) : (i.wrapperTop = (u - i.slides[0].getHeight(!0, t.roundLengths)) / 2, i.wrapperBottom = (u - i.slides[i.slides.length - 1].getHeight(!0, t.roundLengths)) / 2)), r ? (i.wrapperLeft >= 0 && (o.style.paddingLeft = i.wrapperLeft + "px"), i.wrapperRight >= 0 && (o.style.paddingRight = i.wrapperRight + "px")) : (i.wrapperTop >= 0 && (o.style.paddingTop = i.wrapperTop + "px"), i.wrapperBottom >= 0 && (o.style.paddingBottom = i.wrapperBottom + "px")), h = 0, g = 0, i.snapGrid = [], i.slidesGrid = [], y = 0, s = 0; s < i.slides.length; s++) {
                            if (a = i.slides[s].getWidth(!0, t.roundLengths), c = i.slides[s].getHeight(!0, t.roundLengths), t.calculateHeight && (y = Math.max(y, c)), v = r ? a : c, t.centeredSlides) {
                                var rt = s === i.slides.length - 1 ? 0 : i.slides[s + 1].getWidth(!0, t.roundLengths),
                                    ut = s === i.slides.length - 1 ? 0 : i.slides[s + 1].getHeight(!0, t.roundLengths),
                                    ft = r ? rt : ut;
                                if (v > u) {
                                    if (t.slidesPerViewFit) i.snapGrid.push(h + i.wrapperLeft), i.snapGrid.push(h + v - u + i.wrapperLeft);
                                    else
                                        for (b = 0; b <= Math.floor(v / (u + i.wrapperLeft)); b++) i.snapGrid.push(0 === b ? h + i.wrapperLeft : h + i.wrapperLeft + u * b);
                                    i.slidesGrid.push(h + i.wrapperLeft)
                                } else i.snapGrid.push(g), i.slidesGrid.push(g);
                                g += v / 2 + ft / 2
                            } else {
                                if (v > u)
                                    if (t.slidesPerViewFit) i.snapGrid.push(h), i.snapGrid.push(h + v - u);
                                    else if (0 !== u)
                                    for (nt = 0; nt <= Math.floor(v / u); nt++) i.snapGrid.push(h + u * nt);
                                else i.snapGrid.push(h);
                                else i.snapGrid.push(h);
                                i.slidesGrid.push(h)
                            }
                            h += v;
                            k += a;
                            d += c
                        }
                        t.calculateHeight && (i.height = y);
                        r ? (w = k + i.wrapperRight + i.wrapperLeft, o.style.width = k + "px", o.style.height = i.height + "px") : (w = d + i.wrapperTop + i.wrapperBottom, o.style.width = i.width + "px", o.style.height = d + "px")
                    } else if (t.scrollContainer) o.style.width = "", o.style.height = "", p = i.slides[0].getWidth(!0, t.roundLengths), l = i.slides[0].getHeight(!0, t.roundLengths), w = r ? p : l, o.style.width = p + "px", o.style.height = l + "px", e = r ? p : l;
                    else {
                        if (t.calculateHeight) {
                            for (y = 0, l = 0, r || (i.container.style.height = ""), o.style.height = "", s = 0; s < i.slides.length; s++) i.slides[s].style.height = "", y = Math.max(i.slides[s].getHeight(!0), y), r || (l += i.slides[s].getHeight(!0));
                            c = y;
                            i.height = c;
                            r ? l = c : (u = c, i.container.style.height = u + "px")
                        } else c = r ? i.height : i.height / t.slidesPerView, t.roundLengths && (c = Math.ceil(c)), l = r ? i.height : i.slides.length * c;
                        for (a = r ? i.width / t.slidesPerView : i.width, t.roundLengths && (a = Math.ceil(a)), p = r ? i.slides.length * a : i.width, e = r ? a : c, t.offsetSlidesBefore > 0 && (r ? i.wrapperLeft = e * t.offsetSlidesBefore : i.wrapperTop = e * t.offsetSlidesBefore), t.offsetSlidesAfter > 0 && (r ? i.wrapperRight = e * t.offsetSlidesAfter : i.wrapperBottom = e * t.offsetSlidesAfter), t.offsetPxBefore > 0 && (r ? i.wrapperLeft = t.offsetPxBefore : i.wrapperTop = t.offsetPxBefore), t.offsetPxAfter > 0 && (r ? i.wrapperRight = t.offsetPxAfter : i.wrapperBottom = t.offsetPxAfter), t.centeredSlides && (r ? (i.wrapperLeft = (u - e) / 2, i.wrapperRight = (u - e) / 2) : (i.wrapperTop = (u - e) / 2, i.wrapperBottom = (u - e) / 2)), r ? (i.wrapperLeft > 0 && (o.style.paddingLeft = i.wrapperLeft + "px"), i.wrapperRight > 0 && (o.style.paddingRight = i.wrapperRight + "px")) : (i.wrapperTop > 0 && (o.style.paddingTop = i.wrapperTop + "px"), i.wrapperBottom > 0 && (o.style.paddingBottom = i.wrapperBottom + "px")), w = r ? p + i.wrapperRight + i.wrapperLeft : l + i.wrapperTop + i.wrapperBottom, parseFloat(p) > 0 && (!t.cssWidthAndHeight || "height" === t.cssWidthAndHeight) && (o.style.width = p + "px"), parseFloat(l) > 0 && (!t.cssWidthAndHeight || "width" === t.cssWidthAndHeight) && (o.style.height = l + "px"), h = 0, i.snapGrid = [], i.slidesGrid = [], s = 0; s < i.slides.length; s++) i.snapGrid.push(h), i.slidesGrid.push(h), h += e, parseFloat(a) > 0 && (!t.cssWidthAndHeight || "height" === t.cssWidthAndHeight) && (i.slides[s].style.width = a + "px"), parseFloat(c) > 0 && (!t.cssWidthAndHeight || "width" === t.cssWidthAndHeight) && (i.slides[s].style.height = c + "px")
                    }
                    i.initialized ? (i.callPlugins("onInit"), t.onInit && i.fireCallback(t.onInit, i)) : (i.callPlugins("onFirstInit"), t.onFirstInit && i.fireCallback(t.onFirstInit, i));
                    i.initialized = !0
                }
            };
            i.reInit = function(n) {
                i.init(!0, n)
            };
            i.resizeFix = function(n) {
                i.callPlugins("beforeResizeFix");
                i.init(t.resizeReInit || n);
                t.freeMode ? i.getWrapperTranslate() < -f() && (i.setWrapperTransition(0), i.setWrapperTranslate(-f())) : (i.swipeTo(t.loop ? i.activeLoopIndex : i.activeIndex, 0, !1), t.autoplay && (i.support.transitions && "undefined" != typeof o ? "undefined" != typeof o && (clearTimeout(o), o = void 0, i.startAutoplay()) : "undefined" != typeof l && (clearInterval(l), l = void 0, i.startAutoplay())));
                i.callPlugins("afterResizeFix")
            };
            i.destroy = function() {
                var n = i.h.removeEventListener,
                    r = "wrapper" === t.eventTarget ? i.wrapper : i.container;
                i.browser.ie10 || i.browser.ie11 ? (n(r, i.touchEvents.touchStart, v), n(document, i.touchEvents.touchMove, y), n(document, i.touchEvents.touchEnd, p)) : (i.support.touch && (n(r, "touchstart", v), n(r, "touchmove", y), n(r, "touchend", p)), t.simulateTouch && (n(r, "mousedown", v), n(document, "mousemove", y), n(document, "mouseup", p)));
                t.autoResize && n(window, "resize", i.resizeFix);
                dt();
                t.paginationClickable && fi();
                t.mousewheelControl && i._wheelEvent && n(i.container, i._wheelEvent, ft);
                t.keyboardControl && n(document, "keydown", ut);
                t.autoplay && i.stopAutoplay();
                i.callPlugins("onDestroy");
                i = null
            };
            i.disableKeyboardControl = function() {
                t.keyboardControl = !1;
                i.h.removeEventListener(document, "keydown", ut)
            };
            i.enableKeyboardControl = function() {
                t.keyboardControl = !0;
                i.h.addEventListener(document, "keydown", ut)
            };
            bt = (new Date).getTime();
            (i.disableMousewheelControl = function() {
                return i._wheelEvent ? (t.mousewheelControl = !1, i.h.removeEventListener(i.container, i._wheelEvent, ft), !0) : !1
            }, i.enableMousewheelControl = function() {
                return i._wheelEvent ? (t.mousewheelControl = !0, i.h.addEventListener(i.container, i._wheelEvent, ft), !0) : !1
            }, t.grabCursor) && (tt = i.container.style, tt.cursor = "move", tt.cursor = "grab", tt.cursor = "-moz-grab", tt.cursor = "-webkit-grab");
            i.allowSlideClick = !0;
            i.allowLinks = !0;
            s = !1;
            rt = !0;
            i.swipeNext = function(n) {
                var u, r, o, s;
                if (!n && t.loop && i.fixLoop(), !n && t.autoplay && i.stopAutoplay(!0), i.callPlugins("onSwipeNext"), u = i.getWrapperTranslate(), r = u, "auto" === t.slidesPerView) {
                    for (o = 0; o < i.snapGrid.length; o++)
                        if (-u >= i.snapGrid[o] && -u < i.snapGrid[o + 1]) {
                            r = -i.snapGrid[o + 1];
                            break
                        }
                } else s = e * t.slidesPerGroup, r = -(Math.floor(Math.abs(u) / Math.floor(s)) * s + s);
                return r < -f() && (r = -f()), r === u ? !1 : (et(r, "next"), !0)
            };
            i.swipePrev = function(n) {
                var r, f, u, o;
                if (!n && t.loop && i.fixLoop(), !n && t.autoplay && i.stopAutoplay(!0), i.callPlugins("onSwipePrev"), f = Math.ceil(i.getWrapperTranslate()), "auto" === t.slidesPerView)
                    for (r = 0, u = 1; u < i.snapGrid.length; u++) {
                        if (-f === i.snapGrid[u]) {
                            r = -i.snapGrid[u - 1];
                            break
                        }
                        if (-f > i.snapGrid[u] && -f < i.snapGrid[u + 1]) {
                            r = -i.snapGrid[u];
                            break
                        }
                    } else o = e * t.slidesPerGroup, r = -(Math.ceil(-f / o) - 1) * o;
                return r > 0 && (r = 0), r === f ? !1 : (et(r, "prev"), !0)
            };
            i.swipeReset = function() {
                var n, r, s, o;
                if (i.callPlugins("onSwipeReset"), r = i.getWrapperTranslate(), s = e * t.slidesPerGroup, -f(), "auto" === t.slidesPerView) {
                    for (n = 0, o = 0; o < i.snapGrid.length; o++) {
                        if (-r === i.snapGrid[o]) return;
                        if (-r >= i.snapGrid[o] && -r < i.snapGrid[o + 1]) {
                            n = i.positions.diff > 0 ? -i.snapGrid[o + 1] : -i.snapGrid[o];
                            break
                        }
                    } - r >= i.snapGrid[i.snapGrid.length - 1] && (n = -i.snapGrid[i.snapGrid.length - 1]);
                    r <= -f() && (n = -f())
                } else n = 0 > r ? Math.round(r / s) * s : 0, r <= -f() && (n = -f());
                return t.scrollContainer && (n = 0 > r ? r : 0), n < -f() && (n = -f()), t.scrollContainer && u > e && (n = 0), n === r ? !1 : (et(n, "reset"), !0)
            };
            i.swipeTo = function(n, r, u) {
                var s, o;
                return n = parseInt(n, 10), i.callPlugins("onSwipeTo", {
                    index: n,
                    speed: r
                }), t.loop && (n += i.loopedSlides), s = i.getWrapperTranslate(), n > i.slides.length - 1 || 0 > n ? void 0 : (o = "auto" === t.slidesPerView ? -i.slidesGrid[n] : -n * e, o < -f() && (o = -f()), o === s ? !1 : (u = u === !1 ? !1 : !0, et(o, "to", {
                    index: n,
                    speed: r,
                    runCallbacks: u
                }), !0))
            };
            i._queueStartCallbacks = !1;
            i._queueEndCallbacks = !1;
            i.updateActiveSlide = function(n) {
                var r, o, s, u, h, c, f;
                if (i.initialized && 0 !== i.slides.length) {
                    if (i.previousIndex = i.activeIndex, "undefined" == typeof n && (n = i.getWrapperTranslate()), n > 0 && (n = 0), "auto" === t.slidesPerView) {
                        if (i.activeIndex = i.slidesGrid.indexOf(-n), i.activeIndex < 0) {
                            for (r = 0; r < i.slidesGrid.length - 1 && !(-n > i.slidesGrid[r] && -n < i.slidesGrid[r + 1]); r++);
                            o = Math.abs(i.slidesGrid[r] + n);
                            s = Math.abs(i.slidesGrid[r + 1] + n);
                            i.activeIndex = s >= o ? r : r + 1
                        }
                    } else i.activeIndex = Math[t.visibilityFullFit ? "ceil" : "round"](-n / e);
                    if (i.activeIndex === i.slides.length && (i.activeIndex = i.slides.length - 1), i.activeIndex < 0 && (i.activeIndex = 0), i.slides[i.activeIndex]) {
                        if (i.calcVisibleSlides(n), i.support.classList) {
                            for (r = 0; r < i.slides.length; r++) u = i.slides[r], u.classList.remove(t.slideActiveClass), i.visibleSlides.indexOf(u) >= 0 ? u.classList.add(t.slideVisibleClass) : u.classList.remove(t.slideVisibleClass);
                            i.slides[i.activeIndex].classList.add(t.slideActiveClass)
                        } else {
                            for (h = new RegExp("\\s*" + t.slideActiveClass), c = new RegExp("\\s*" + t.slideVisibleClass), r = 0; r < i.slides.length; r++) i.slides[r].className = i.slides[r].className.replace(h, "").replace(c, ""), i.visibleSlides.indexOf(i.slides[r]) >= 0 && (i.slides[r].className += " " + t.slideVisibleClass);
                            i.slides[i.activeIndex].className += " " + t.slideActiveClass
                        }
                        t.loop ? (f = i.loopedSlides, i.activeLoopIndex = i.activeIndex - f, i.activeLoopIndex >= i.slides.length - 2 * f && (i.activeLoopIndex = i.slides.length - 2 * f - i.activeLoopIndex), i.activeLoopIndex < 0 && (i.activeLoopIndex = i.slides.length - 2 * f + i.activeLoopIndex), i.activeLoopIndex < 0 && (i.activeLoopIndex = 0)) : i.activeLoopIndex = i.activeIndex;
                        t.pagination && i.updatePagination(n)
                    }
                }
            };
            i.createPagination = function(n) {
                var r;
                if (t.paginationClickable && i.paginationButtons && fi(), i.paginationContainer = t.pagination.nodeType ? t.pagination : h(t.pagination)[0], t.createPagination) {
                    var u = "",
                        e = i.slides.length,
                        f = e;
                    for (t.loop && (f -= 2 * i.loopedSlides), r = 0; f > r; r++) u += "<" + t.paginationElement + ' class="' + t.paginationElementClass + '"><\/' + t.paginationElement + ">";
                    i.paginationContainer.innerHTML = u
                }
                i.paginationButtons = h("." + t.paginationElementClass, i.paginationContainer);
                n || i.updatePagination();
                i.callPlugins("onCreatePagination");
                t.paginationClickable && li()
            };
            i.updatePagination = function(n) {
                var s, r, o, c, f, e, u;
                if (t.pagination && !(i.slides.length < 1) && (s = h("." + t.paginationActiveClass, i.paginationContainer), s && (r = i.paginationButtons, 0 !== r.length))) {
                    for (o = 0; o < r.length; o++) r[o].className = t.paginationElementClass;
                    if (c = t.loop ? i.loopedSlides : 0, t.paginationAsRange) {
                        for (i.visibleSlides || i.calcVisibleSlides(n), e = [], f = 0; f < i.visibleSlides.length; f++) u = i.slides.indexOf(i.visibleSlides[f]) - c, t.loop && 0 > u && (u = i.slides.length - 2 * i.loopedSlides + u), t.loop && u >= i.slides.length - 2 * i.loopedSlides && (u = i.slides.length - 2 * i.loopedSlides - u, u = Math.abs(u)), e.push(u);
                        for (f = 0; f < e.length; f++) r[e[f]] && (r[e[f]].className += " " + t.paginationVisibleClass);
                        t.loop ? void 0 !== r[i.activeLoopIndex] && (r[i.activeLoopIndex].className += " " + t.paginationActiveClass) : r[i.activeIndex].className += " " + t.paginationActiveClass
                    } else t.loop ? r[i.activeLoopIndex] && (r[i.activeLoopIndex].className += " " + t.paginationActiveClass + " " + t.paginationVisibleClass) : r[i.activeIndex].className += " " + t.paginationActiveClass + " " + t.paginationVisibleClass
                }
            };
            i.calcVisibleSlides = function(n) {
                var c = [],
                    f = 0,
                    l = 0,
                    s = 0,
                    h, o;
                for (r && i.wrapperLeft > 0 && (n += i.wrapperLeft), !r && i.wrapperTop > 0 && (n += i.wrapperTop), h = 0; h < i.slides.length; h++) f += l, l = "auto" === t.slidesPerView ? r ? i.h.getWidth(i.slides[h], !0, t.roundLengths) : i.h.getHeight(i.slides[h], !0, t.roundLengths) : e, s = f + l, o = !1, t.visibilityFullFit ? (f >= -n && -n + u >= s && (o = !0), -n >= f && s >= -n + u && (o = !0)) : (s > -n && -n + u >= s && (o = !0), f >= -n && -n + u > f && (o = !0), -n > f && s > -n + u && (o = !0)), o && c.push(i.slides[h]);
                0 === c.length && (c = [i.slides[i.activeIndex]]);
                i.visibleSlides = c
            };
            i.startAutoplay = function() {
                if (i.support.transitions) {
                    if ("undefined" != typeof o) return !1;
                    if (!t.autoplay) return;
                    i.callPlugins("onAutoplayStart");
                    t.onAutoplayStart && i.fireCallback(t.onAutoplayStart, i);
                    vt()
                } else {
                    if ("undefined" != typeof l) return !1;
                    if (!t.autoplay) return;
                    i.callPlugins("onAutoplayStart");
                    t.onAutoplayStart && i.fireCallback(t.onAutoplayStart, i);
                    l = setInterval(function() {
                        t.loop ? (i.fixLoop(), i.swipeNext(!0)) : i.swipeNext(!0) || (t.autoplayStopOnLast ? (clearInterval(l), l = void 0) : i.swipeTo(0))
                    }, t.autoplay)
                }
            };
            i.stopAutoplay = function(n) {
                if (i.support.transitions) {
                    if (!o) return;
                    o && clearTimeout(o);
                    o = void 0;
                    n && !t.autoplayDisableOnInteraction && i.wrapperTransitionEnd(function() {
                        vt()
                    });
                    i.callPlugins("onAutoplayStop");
                    t.onAutoplayStop && i.fireCallback(t.onAutoplayStop, i)
                } else l && clearInterval(l), l = void 0, i.callPlugins("onAutoplayStop"), t.onAutoplayStop && i.fireCallback(t.onAutoplayStop, i)
            };
            i.loopCreated = !1;
            i.removeLoopedSlides = function() {
                if (i.loopCreated)
                    for (var n = 0; n < i.slides.length; n++) i.slides[n].getData("looped") === !0 && i.wrapper.removeChild(i.slides[n])
            };
            i.createLoop = function() {
                var u, e, o;
                if (0 !== i.slides.length) {
                    i.loopedSlides = "auto" === t.slidesPerView ? t.loopedSlides || 1 : t.slidesPerView + t.loopAdditionalSlides;
                    i.loopedSlides > i.slides.length && (i.loopedSlides = i.slides.length);
                    for (var s = "", h = "", f = "", r = i.slides.length, l = Math.floor(i.loopedSlides / r), c = i.loopedSlides % r, n = 0; l * r > n; n++) u = n, n >= r && (e = Math.floor(n / r), u = n - r * e), f += i.slides[u].outerHTML;
                    for (n = 0; c > n; n++) h += ui(t.slideDuplicateClass, i.slides[n].outerHTML);
                    for (n = r - c; r > n; n++) s += ui(t.slideDuplicateClass, i.slides[n].outerHTML);
                    for (o = s + f + ot.innerHTML + f + h, ot.innerHTML = o, i.loopCreated = !0, i.calcSlides(), n = 0; n < i.slides.length; n++)(n < i.loopedSlides || n >= i.slides.length - i.loopedSlides) && i.slides[n].setData("looped", !0);
                    i.callPlugins("onCreateLoop")
                }
            };
            i.fixLoop = function() {
                var n;
                i.activeIndex < i.loopedSlides ? (n = i.slides.length - 3 * i.loopedSlides + i.activeIndex, i.swipeTo(n, 0, !1)) : ("auto" === t.slidesPerView && i.activeIndex >= 2 * i.loopedSlides || i.activeIndex > i.slides.length - 2 * t.slidesPerView) && (n = -i.slides.length + i.activeIndex + i.loopedSlides, i.swipeTo(n, 0, !1))
            };
            i.loadSlides = function() {
                var u = "";
                i.activeLoaderIndex = 0;
                for (var r = t.loader.slides, f = t.loader.loadAllSlides ? r.length : t.slidesPerView * (1 + t.loader.surroundGroups), n = 0; f > n; n++) u += "outer" === t.loader.slidesHTMLType ? r[n] : "<" + t.slideElement + ' class="' + t.slideClass + '" data-swiperindex="' + n + '">' + r[n] + "<\/" + t.slideElement + ">";
                i.wrapper.innerHTML = u;
                i.calcSlides(!0);
                t.loader.loadAllSlides || i.wrapperTransitionEnd(i.reloadSlides, !0)
            };
            i.reloadSlides = function() {
                var f = t.loader.slides,
                    u = parseInt(i.activeSlide().data("swiperindex"), 10),
                    o, h, v, n, a, c, l, s, r;
                if (!(0 > u || u > f.length - 1)) {
                    if (i.activeLoaderIndex = u, o = Math.max(0, u - t.slidesPerView * t.loader.surroundGroups), h = Math.min(u + t.slidesPerView * (1 + t.loader.surroundGroups) - 1, f.length - 1), u > 0 && (v = -e * (u - o), i.setWrapperTranslate(v), i.setWrapperTransition(0)), "reload" === t.loader.logic) {
                        for (i.wrapper.innerHTML = "", a = "", n = o; h >= n; n++) a += "outer" === t.loader.slidesHTMLType ? f[n] : "<" + t.slideElement + ' class="' + t.slideClass + '" data-swiperindex="' + n + '">' + f[n] + "<\/" + t.slideElement + ">";
                        i.wrapper.innerHTML = a
                    } else {
                        for (c = 1e3, l = 0, n = 0; n < i.slides.length; n++) s = i.slides[n].data("swiperindex"), o > s || s > h ? i.wrapper.removeChild(i.slides[n]) : (c = Math.min(s, c), l = Math.max(s, l));
                        for (n = o; h >= n; n++) c > n && (r = document.createElement(t.slideElement), r.className = t.slideClass, r.setAttribute("data-swiperindex", n), r.innerHTML = f[n], i.wrapper.insertBefore(r, i.wrapper.firstChild)), n > l && (r = document.createElement(t.slideElement), r.className = t.slideClass, r.setAttribute("data-swiperindex", n), r.innerHTML = f[n], i.wrapper.appendChild(r))
                    }
                    i.reInit(!0)
                }
            };
            ai()
        }
    }, Swiper.prototype = {
        plugins: {},
        wrapperTransitionEnd: function(n, t) {
            "use strict";

            function e(o) {
                if (o.target === f && (n(r), r.params.queueEndCallbacks && (r._queueEndCallbacks = !1), !t))
                    for (i = 0; i < u.length; i++) r.h.removeEventListener(f, u[i], e)
            }
            var i, r = this,
                f = r.wrapper,
                u = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"];
            if (n)
                for (i = 0; i < u.length; i++) r.h.addEventListener(f, u[i], e)
        },
        getWrapperTranslate: function(n) {
            "use strict";
            var i, r, t, u, f = this.wrapper;
            return "undefined" == typeof n && (n = "horizontal" === this.params.mode ? "x" : "y"), this.support.transforms && this.params.useCSS3Transforms ? (t = window.getComputedStyle(f, null), window.WebKitCSSMatrix ? u = new WebKitCSSMatrix("none" === t.webkitTransform ? "" : t.webkitTransform) : (u = t.MozTransform || t.OTransform || t.MsTransform || t.msTransform || t.transform || t.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), i = u.toString().split(",")), "x" === n && (r = window.WebKitCSSMatrix ? u.m41 : parseFloat(16 === i.length ? i[12] : i[4])), "y" === n && (r = window.WebKitCSSMatrix ? u.m42 : parseFloat(16 === i.length ? i[13] : i[5]))) : ("x" === n && (r = parseFloat(f.style.left, 10) || 0), "y" === n && (r = parseFloat(f.style.top, 10) || 0)), r || 0
        },
        setWrapperTranslate: function(n, t, i) {
            "use strict";
            var f, u = this.wrapper.style,
                r = {
                    x: 0,
                    y: 0,
                    z: 0
                };
            3 === arguments.length ? (r.x = n, r.y = t, r.z = i) : ("undefined" == typeof t && (t = "horizontal" === this.params.mode ? "x" : "y"), r[t] = n);
            this.support.transforms && this.params.useCSS3Transforms ? (f = this.support.transforms3d ? "translate3d(" + r.x + "px, " + r.y + "px, " + r.z + "px)" : "translate(" + r.x + "px, " + r.y + "px)", u.webkitTransform = u.MsTransform = u.msTransform = u.MozTransform = u.OTransform = u.transform = f) : (u.left = r.x + "px", u.top = r.y + "px");
            this.callPlugins("onSetWrapperTransform", r);
            this.params.onSetWrapperTransform && this.fireCallback(this.params.onSetWrapperTransform, this, r)
        },
        setWrapperTransition: function(n) {
            "use strict";
            var t = this.wrapper.style;
            t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = n / 1e3 + "s";
            this.callPlugins("onSetWrapperTransition", {
                duration: n
            });
            this.params.onSetWrapperTransition && this.fireCallback(this.params.onSetWrapperTransition, this, n)
        },
        h: {
            getWidth: function(n, t, i) {
                "use strict";
                var u = window.getComputedStyle(n, null).getPropertyValue("width"),
                    r = parseFloat(u);
                return (isNaN(r) || u.indexOf("%") > 0 || 0 > r) && (r = n.offsetWidth - parseFloat(window.getComputedStyle(n, null).getPropertyValue("padding-left")) - parseFloat(window.getComputedStyle(n, null).getPropertyValue("padding-right"))), t && (r += parseFloat(window.getComputedStyle(n, null).getPropertyValue("padding-left")) + parseFloat(window.getComputedStyle(n, null).getPropertyValue("padding-right"))), i ? Math.ceil(r) : r
            },
            getHeight: function(n, t, i) {
                "use strict";
                if (t) return n.offsetHeight;
                var u = window.getComputedStyle(n, null).getPropertyValue("height"),
                    r = parseFloat(u);
                return (isNaN(r) || u.indexOf("%") > 0 || 0 > r) && (r = n.offsetHeight - parseFloat(window.getComputedStyle(n, null).getPropertyValue("padding-top")) - parseFloat(window.getComputedStyle(n, null).getPropertyValue("padding-bottom"))), t && (r += parseFloat(window.getComputedStyle(n, null).getPropertyValue("padding-top")) + parseFloat(window.getComputedStyle(n, null).getPropertyValue("padding-bottom"))), i ? Math.ceil(r) : r
            },
            getOffset: function(n) {
                "use strict";
                var t = n.getBoundingClientRect(),
                    i = document.body,
                    f = n.clientTop || i.clientTop || 0,
                    e = n.clientLeft || i.clientLeft || 0,
                    r = window.pageYOffset || n.scrollTop,
                    u = window.pageXOffset || n.scrollLeft;
                return document.documentElement && !window.pageYOffset && (r = document.documentElement.scrollTop, u = document.documentElement.scrollLeft), {
                    top: t.top + r - f,
                    left: t.left + u - e
                }
            },
            windowWidth: function() {
                "use strict";
                return window.innerWidth ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : void 0
            },
            windowHeight: function() {
                "use strict";
                return window.innerHeight ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : void 0
            },
            windowScroll: function() {
                "use strict";
                return "undefined" != typeof pageYOffset ? {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                } : document.documentElement ? {
                    left: document.documentElement.scrollLeft,
                    top: document.documentElement.scrollTop
                } : void 0
            },
            addEventListener: function(n, t, i, r) {
                "use strict";
                "undefined" == typeof r && (r = !1);
                n.addEventListener ? n.addEventListener(t, i, r) : n.attachEvent && n.attachEvent("on" + t, i)
            },
            removeEventListener: function(n, t, i, r) {
                "use strict";
                "undefined" == typeof r && (r = !1);
                n.removeEventListener ? n.removeEventListener(t, i, r) : n.detachEvent && n.detachEvent("on" + t, i)
            }
        },
        setTransform: function(n, t) {
            "use strict";
            var i = n.style;
            i.webkitTransform = i.MsTransform = i.msTransform = i.MozTransform = i.OTransform = i.transform = t
        },
        setTranslate: function(n, t) {
            "use strict";
            var i = n.style,
                r = {
                    x: t.x || 0,
                    y: t.y || 0,
                    z: t.z || 0
                },
                u = this.support.transforms3d ? "translate3d(" + r.x + "px," + r.y + "px," + r.z + "px)" : "translate(" + r.x + "px," + r.y + "px)";
            i.webkitTransform = i.MsTransform = i.msTransform = i.MozTransform = i.OTransform = i.transform = u;
            this.support.transforms || (i.left = r.x + "px", i.top = r.y + "px")
        },
        setTransition: function(n, t) {
            "use strict";
            var i = n.style;
            i.webkitTransitionDuration = i.MsTransitionDuration = i.msTransitionDuration = i.MozTransitionDuration = i.OTransitionDuration = i.transitionDuration = t + "ms"
        },
        support: {
            touch: window.Modernizr && Modernizr.touch === !0 || function() {
                "use strict";
                return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
            }(),
            transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function() {
                "use strict";
                var n = document.createElement("div").style;
                return "webkitPerspective" in n || "MozPerspective" in n || "OPerspective" in n || "MsPerspective" in n || "perspective" in n
            }(),
            transforms: window.Modernizr && Modernizr.csstransforms === !0 || function() {
                "use strict";
                var n = document.createElement("div").style;
                return "transform" in n || "WebkitTransform" in n || "MozTransform" in n || "msTransform" in n || "MsTransform" in n || "OTransform" in n
            }(),
            transitions: window.Modernizr && Modernizr.csstransitions === !0 || function() {
                "use strict";
                var n = document.createElement("div").style;
                return "transition" in n || "WebkitTransition" in n || "MozTransition" in n || "msTransition" in n || "MsTransition" in n || "OTransition" in n
            }(),
            classList: function() {
                "use strict";
                var n = document.createElement("div");
                return "classList" in n
            }()
        },
        browser: {
            ie8: function() {
                "use strict";
                var n = -1,
                    t, i;
                return "Microsoft Internet Explorer" === navigator.appName && (t = navigator.userAgent, i = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/), null !== i.exec(t) && (n = parseFloat(RegExp.$1))), -1 !== n && 9 > n
            }(),
            ie10: window.navigator.msPointerEnabled,
            ie11: window.navigator.pointerEnabled
        }
    }, (window.jQuery || window.Zepto) && ! function(n) {
        "use strict";
        n.fn.swiper = function(t) {
            var i;
            return this.each(function(r) {
                var u = n(this),
                    f;
                u.data("swiper") || (f = new Swiper(u[0], t), r || (i = f), u.data("swiper", f))
            }), i
        }
    }(window.jQuery || window.Zepto), "undefined" != typeof module && (module.exports = Swiper), "function" == typeof define && define.amd && define([], function() {
        "use strict";
        return Swiper
    }), function(n) {
        function s(n) {
            return typeof n == "string"
        }

        function f(n) {
            var t = nt.call(arguments, 1);
            return function() {
                return n.apply(this, t.concat(nt.call(arguments)))
            }
        }

        function ct(n) {
            return n.replace(l, "$2")
        }

        function lt(n) {
            return n.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, "$1")
        }

        function k(r, f, e, h, v) {
            var w, y, p, k, d;
            return h !== t ? (p = e.match(r ? l : /^([^#?]*)\??([^#]*)(#?.*)/), d = p[3] || "", v === 2 && s(h) ? y = h.replace(r ? c : ot, "") : (k = i(p[2]), h = s(h) ? i[r ? u : o](h) : h, y = v === 2 ? h : v === 1 ? n.extend({}, h, k) : n.extend({}, k, h), y = tt(y), r && (y = y.replace(st, a))), w = p[1] + (r ? b : y || !p[1] ? "?" : "") + y + d) : w = f(e !== t ? e : location.href), w
        }

        function d(n, r, f) {
            return r === t || typeof r == "boolean" ? (f = r, r = e[n ? u : o]()) : r = s(r) ? r.replace(n ? c : ot, "") : r, i(r, f)
        }

        function g(i, r, u, f) {
            return s(u) || typeof u == "object" || (f = u, u = r, r = t), this.each(function() {
                var o = n(this),
                    t = r || ut()[(this.nodeName || "").toLowerCase()] || "",
                    s = t && o.attr(t) || "";
                o.attr(t, e[i](s, u, f))
            })
        }
        var t, nt = Array.prototype.slice,
            a = decodeURIComponent,
            e = n.param,
            tt, r, i, v, y = n.bbq = n.bbq || {},
            it, rt, ut, ft = n.event.special,
            et = "hashchange",
            o = "querystring",
            u = "fragment",
            p = "elemUrlAttr",
            w = "href",
            h = "src",
            ot = /^.*\?|#.*$/g,
            c, l, st, ht, b, at = {};
        e[o] = f(k, 0, lt);
        e[u] = r = f(k, 1, ct);
        e.sorted = tt = function(t, i) {
            var u = [],
                r = {};
            return n.each(e(t, i).split("&"), function(n, t) {
                var i = t.replace(/(?:%5B|=).*$/, ""),
                    f = r[i];
                f || (f = r[i] = [], u.push(i));
                f.push(t)
            }), n.map(u.sort(), function(n) {
                return r[n]
            }).join("&")
        };
        r.noEscape = function(t) {
            t = t || "";
            var i = n.map(t.split(""), encodeURIComponent);
            st = new RegExp(i.join("|"), "g")
        };
        r.noEscape(",/");
        r.ajaxCrawlable = function(n) {
            return n !== t && (n ? (c = /^.*(?:#!|#)/, l = /^([^#]*)(?:#!|#)?(.*)$/, b = "#!") : (c = /^.*#/, l = /^([^#]*)#?(.*)$/, b = "#"), ht = !!n), ht
        };
        r.ajaxCrawlable(0);
        n.deparam = i = function(i, r) {
            var u = {},
                f = {
                    "true": !0,
                    "false": !1,
                    "null": null
                };
            return n.each(i.replace(/\+/g, " ").split("&"), function(i, e) {
                var y = e.split("="),
                    h = a(y[0]),
                    o, v = u,
                    l = 0,
                    s = h.split("]["),
                    c = s.length - 1;
                if (/\[/.test(s[0]) && /\]$/.test(s[c]) ? (s[c] = s[c].replace(/\]$/, ""), s = s.shift().split("[").concat(s), c = s.length - 1) : c = 0, y.length === 2)
                    if (o = a(y[1]), r && (o = o && !isNaN(o) ? +o : o === "undefined" ? t : f[o] !== t ? f[o] : o), c)
                        for (; l <= c; l++) h = s[l] === "" ? v.length : s[l], v = v[h] = l < c ? v[h] || (s[l + 1] && isNaN(s[l + 1]) ? {} : []) : o;
                    else n.isArray(u[h]) ? u[h].push(o) : u[h] = u[h] !== t ? [u[h], o] : o;
                else h && (u[h] = r ? t : "")
            }), u
        };
        i[o] = f(d, 0);
        i[u] = v = f(d, 1);
        n[p] || (n[p] = function(t) {
            return n.extend(at, t)
        })({
            a: w,
            base: w,
            iframe: h,
            img: h,
            input: h,
            form: "action",
            link: w,
            script: h
        });
        ut = n[p];
        n.fn[o] = f(g, o);
        n.fn[u] = f(g, u);
        y.pushState = it = function(n, i) {
            s(n) && /^#/.test(n) && i === t && (i = 2);
            var u = n !== t,
                f = r(location.href, u ? n : {}, u ? i : 2);
            location.href = f
        };
        y.getState = rt = function(n, i) {
            return n === t || typeof n == "boolean" ? v(n) : v(i)[n]
        };
        y.removeState = function(i) {
            var r = {};
            i !== t && (r = rt(), n.each(n.isArray(i) ? i : arguments, function(n, t) {
                delete r[t]
            }));
            it(r, 2)
        };
        ft[et] = n.extend(ft[et], {
            add: function(f) {
                function o(n) {
                    var f = n[u] = r();
                    n.getState = function(n, r) {
                        return n === t || typeof n == "boolean" ? i(f, n) : i(f, r)[n]
                    };
                    e.apply(this, arguments)
                }
                var e;
                if (n.isFunction(f)) return e = f, o;
                e = f.handler;
                f.handler = o
            }
        })
    }(jQuery, this), function(n, t, i) {
        function u(n) {
            return n = n || location.href, "#" + n.replace(/^[^#]*#?(.*)$/, "$1")
        }
        var r = "hashchange",
            f = document,
            e, s = n.event.special,
            h = f.documentMode,
            o = "on" + r in t && (h === i || h > 7);
        n.fn[r] = function(n) {
            return n ? this.bind(r, n) : this.trigger(r)
        };
        n.fn[r].delay = 50;
        s[r] = n.extend(s[r], {
            setup: function() {
                if (o) return !1;
                n(e.start)
            },
            teardown: function() {
                if (o) return !1;
                n(e.stop)
            }
        });
        e = function() {
            function c() {
                var f = u(),
                    i = v(h);
                f !== h ? (a(h = f, i), n(t).trigger(r)) : i !== h && (location.href = location.href.replace(/#.*/, "") + i);
                s = setTimeout(c, n.fn[r].delay)
            }
            var e = {},
                s, h = u(),
                l = function(n) {
                    return n
                },
                a = l,
                v = l;
            return e.start = function() {
                s || c()
            }, e.stop = function() {
                s && clearTimeout(s);
                s = i
            }, navigator.appName !== "Microsoft Internet Explorer" || o || function() {
                var t, i;
                e.start = function() {
                    t || (i = n.fn[r].src, i = i && i + u(), t = n('<iframe tabindex="-1" title="empty"/>').hide().one("load", function() {
                        i || a(u());
                        c()
                    }).attr("src", i || "javascript:0").insertAfter("body")[0].contentWindow, f.onpropertychange = function() {
                        try {
                            event.propertyName === "title" && (t.document.title = f.title)
                        } catch (n) {}
                    })
                };
                e.stop = l;
                v = function() {
                    return u(t.location.href)
                };
                a = function(i, u) {
                    var e = t.document,
                        o = n.fn[r].domain;
                    i !== u && (e.title = f.title, e.open(), o && e.write('<script>document.domain="' + o + '"<\/script>'), e.close(), t.location.hash = i)
                }
            }(), e
        }()
    }(jQuery, this), ! function(n) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], n) : n("undefined" != typeof jQuery ? jQuery : window.Zepto)
    }(function(n) {
        "use strict";

        function r(t) {
            var i = t.data;
            t.isDefaultPrevented() || (t.preventDefault(), n(t.target).ajaxSubmit(i))
        }

        function u(t) {
            var r = t.target,
                u = n(r),
                f, i, e;
            if (!u.is("[type=submit],[type=image]")) {
                if (f = u.closest("[type=submit]"), 0 === f.length) return;
                r = f[0]
            }
            i = this;
            (i.clk = r, "image" == r.type) && (void 0 !== t.offsetX ? (i.clk_x = t.offsetX, i.clk_y = t.offsetY) : "function" == typeof n.fn.offset ? (e = u.offset(), i.clk_x = t.pageX - e.left, i.clk_y = t.pageY - e.top) : (i.clk_x = t.pageX - r.offsetLeft, i.clk_y = t.pageY - r.offsetTop));
            setTimeout(function() {
                i.clk = i.clk_x = i.clk_y = null
            }, 100)
        }

        function t() {
            if (n.fn.ajaxSubmit.debug) {
                var t = "[jquery.form] " + Array.prototype.join.call(arguments, "");
                window.console && window.console.log ? window.console.log(t) : window.opera && window.opera.postError && window.opera.postError(t)
            }
        }
        var i = {},
            f;
        i.fileapi = void 0 !== n("<input type='file'/>").get(0).files;
        i.formdata = void 0 !== window.FormData;
        f = !!n.fn.prop;
        n.fn.attr2 = function() {
            if (!f) return this.attr.apply(this, arguments);
            var n = this.prop.apply(this, arguments);
            return n && n.jquery || "string" == typeof n ? n : this.attr.apply(this, arguments)
        };
        n.fn.ajaxSubmit = function(r) {
            function et(t) {
                for (var f, u = n.param(t, r.traditional).split("&"), o = u.length, e = [], i = 0; o > i; i++) u[i] = u[i].replace(/\+/g, " "), f = u[i].split("="), e.push([decodeURIComponent(f[0]), decodeURIComponent(f[1])]);
                return e
            }

            function ot(t) {
                for (var f, u, o, s = new FormData, i = 0; i < t.length; i++) s.append(t[i].name, t[i].value);
                if (r.extraData)
                    for (f = et(r.extraData), i = 0; i < f.length; i++) f[i] && s.append(f[i][0], f[i][1]);
                return r.data = null, u = n.extend(!0, {}, n.ajaxSettings, r, {
                    contentType: !1,
                    processData: !1,
                    cache: !1,
                    type: e || "POST"
                }), r.uploadProgress && (u.xhr = function() {
                    var t = n.ajaxSettings.xhr();
                    return t.upload && t.upload.addEventListener("progress", function(n) {
                        var t = 0,
                            i = n.loaded || n.position,
                            u = n.total;
                        n.lengthComputable && (t = Math.ceil(i / u * 100));
                        r.uploadProgress(n, i, u, t)
                    }, !1), t
                }), u.data = null, o = u.beforeSend, u.beforeSend = function(n, t) {
                    t.data = r.formData ? r.formData : s;
                    o && o.call(this, n, t)
                }, n.ajax(u)
            }

            function d(i) {
                function ut(n) {
                    var i = null;
                    try {
                        n.contentWindow && (i = n.contentWindow.document)
                    } catch (r) {
                        t("cannot get iframe.contentWindow document: " + r)
                    }
                    if (i) return i;
                    try {
                        i = n.contentDocument ? n.contentDocument : n.document
                    } catch (r) {
                        t("cannot get iframe.contentDocument: " + r);
                        i = n.document
                    }
                    return i
                }

                function ft() {
                    function f() {
                        try {
                            var n = ut(a).readyState;
                            t("state = " + n);
                            n && "uninitialized" == n.toLowerCase() && setTimeout(f, 50)
                        } catch (i) {
                            t("Server abort: ", i, " (", i.name, ")");
                            b(rt);
                            g && clearTimeout(g);
                            g = void 0
                        }
                    }
                    var s = u.attr2("target"),
                        h = u.attr2("action"),
                        y = u.attr("enctype") || u.attr("encoding") || "multipart/form-data",
                        r, i, c;
                    l.setAttribute("target", d);
                    (!e || /post/i.test(e)) && l.setAttribute("method", "POST");
                    h != o.url && l.setAttribute("action", o.url);
                    o.skipEncodingOverride || e && !/post/i.test(e) || u.attr({
                        encoding: "multipart/form-data",
                        enctype: "multipart/form-data"
                    });
                    o.timeout && (g = setTimeout(function() {
                        it = !0;
                        b(et)
                    }, o.timeout));
                    r = [];
                    try {
                        if (o.extraData)
                            for (i in o.extraData) o.extraData.hasOwnProperty(i) && (n.isPlainObject(o.extraData[i]) && o.extraData[i].hasOwnProperty("name") && o.extraData[i].hasOwnProperty("value") ? r.push(n('<input type="hidden" name="' + o.extraData[i].name + '">').val(o.extraData[i].value).appendTo(l)[0]) : r.push(n('<input type="hidden" name="' + i + '">').val(o.extraData[i]).appendTo(l)[0]));
                        o.iframeTarget || v.appendTo("body");
                        a.attachEvent ? a.attachEvent("onload", b) : a.addEventListener("load", b, !1);
                        setTimeout(f, 15);
                        try {
                            l.submit()
                        } catch (p) {
                            c = document.createElement("form").submit;
                            c.apply(l)
                        }
                    } finally {
                        l.setAttribute("action", h);
                        l.setAttribute("enctype", y);
                        s ? l.setAttribute("target", s) : u.removeAttr("target");
                        n(r).remove()
                    }
                }

                function b(i) {
                    var u, r, w, f, k, d, e, c, l;
                    if (!s.aborted && !ct) {
                        if (h = ut(a), h || (t("cannot access response document"), i = rt), i === et && s) return s.abort("timeout"), y.reject(s, "timeout"), void 0;
                        if (i == rt && s) return s.abort("server abort"), y.reject(s, "error", "server abort"), void 0;
                        if (h && h.location.href != o.iframeSrc || it) {
                            a.detachEvent ? a.detachEvent("onload", b) : a.removeEventListener("load", b, !1);
                            r = "success";
                            try {
                                if (it) throw "timeout";
                                if (w = "xml" == o.dataType || h.XMLDocument || n.isXMLDoc(h), t("isXml=" + w), !w && window.opera && (null === h.body || !h.body.innerHTML) && --lt) return t("requeing onLoad callback, DOM not available"), setTimeout(b, 250), void 0;
                                f = h.body ? h.body : h.documentElement;
                                s.responseText = f ? f.innerHTML : null;
                                s.responseXML = h.XMLDocument ? h.XMLDocument : h;
                                w && (o.dataType = "xml");
                                s.getResponseHeader = function(n) {
                                    var t = {
                                        "content-type": o.dataType
                                    };
                                    return t[n.toLowerCase()]
                                };
                                f && (s.status = Number(f.getAttribute("status")) || s.status, s.statusText = f.getAttribute("statusText") || s.statusText);
                                k = (o.dataType || "").toLowerCase();
                                d = /(json|script|text)/.test(k);
                                d || o.textarea ? (e = h.getElementsByTagName("textarea")[0], e ? (s.responseText = e.value, s.status = Number(e.getAttribute("status")) || s.status, s.statusText = e.getAttribute("statusText") || s.statusText) : d && (c = h.getElementsByTagName("pre")[0], l = h.getElementsByTagName("body")[0], c ? s.responseText = c.textContent ? c.textContent : c.innerText : l && (s.responseText = l.textContent ? l.textContent : l.innerText))) : "xml" == k && !s.responseXML && s.responseText && (s.responseXML = at(s.responseText));
                                try {
                                    ht = yt(s, k, o)
                                } catch (nt) {
                                    r = "parsererror";
                                    s.error = u = nt || r
                                }
                            } catch (nt) {
                                t("error caught: ", nt);
                                r = "error";
                                s.error = u = nt || r
                            }
                            s.aborted && (t("upload aborted"), r = null);
                            s.status && (r = s.status >= 200 && s.status < 300 || 304 === s.status ? "success" : "error");
                            "success" === r ? (o.success && o.success.call(o.context, ht, "success", s), y.resolve(s.responseText, "success", s), p && n.event.trigger("ajaxSuccess", [s, o])) : r && (void 0 === u && (u = s.statusText), o.error && o.error.call(o.context, s, r, u), y.reject(s, "error", u), p && n.event.trigger("ajaxError", [s, o, u]));
                            p && n.event.trigger("ajaxComplete", [s, o]);
                            p && !--n.active && n.event.trigger("ajaxStop");
                            o.complete && o.complete.call(o.context, s, r);
                            ct = !0;
                            o.timeout && clearTimeout(g);
                            setTimeout(function() {
                                o.iframeTarget ? v.attr("src", o.iframeSrc) : v.remove();
                                s.responseXML = null
                            }, 100)
                        }
                    }
                }
                var tt, nt, o, p, d, v, a, s, k, w, it, g, l = u[0],
                    y = n.Deferred();
                if (y.abort = function(n) {
                        s.abort(n)
                    }, i)
                    for (nt = 0; nt < c.length; nt++) tt = n(c[nt]), f ? tt.prop("disabled", !1) : tt.removeAttr("disabled");
                if (o = n.extend(!0, {}, n.ajaxSettings, r), o.context = o.context || o, d = "jqFormIO" + (new Date).getTime(), o.iframeTarget ? (v = n(o.iframeTarget), w = v.attr2("name"), w ? d = w : v.attr2("name", d)) : (v = n('<iframe name="' + d + '" src="' + o.iframeSrc + '" />'), v.css({
                        position: "absolute",
                        top: "-1000px",
                        left: "-1000px"
                    })), a = v[0], s = {
                        aborted: 0,
                        responseText: null,
                        responseXML: null,
                        status: 0,
                        statusText: "n/a",
                        getAllResponseHeaders: function() {},
                        getResponseHeader: function() {},
                        setRequestHeader: function() {},
                        abort: function(i) {
                            var r = "timeout" === i ? "timeout" : "aborted";
                            t("aborting upload... " + r);
                            this.aborted = 1;
                            try {
                                a.contentWindow.document.execCommand && a.contentWindow.document.execCommand("Stop")
                            } catch (u) {}
                            v.attr("src", o.iframeSrc);
                            s.error = r;
                            o.error && o.error.call(o.context, s, r, i);
                            p && n.event.trigger("ajaxError", [s, o, r]);
                            o.complete && o.complete.call(o.context, s, r)
                        }
                    }, p = o.global, p && 0 == n.active++ && n.event.trigger("ajaxStart"), p && n.event.trigger("ajaxSend", [s, o]), o.beforeSend && o.beforeSend.call(o.context, s, o) === !1) return o.global && n.active--, y.reject(), y;
                if (s.aborted) return y.reject(), y;
                k = l.clk;
                k && (w = k.name, w && !k.disabled && (o.extraData = o.extraData || {}, o.extraData[w] = k.value, "image" == k.type && (o.extraData[w + ".x"] = l.clk_x, o.extraData[w + ".y"] = l.clk_y)));
                var et = 1,
                    rt = 2,
                    ot = n("meta[name=csrf-token]").attr("content"),
                    st = n("meta[name=csrf-param]").attr("content");
                st && ot && (o.extraData = o.extraData || {}, o.extraData[st] = ot);
                o.forceSync ? ft() : setTimeout(ft, 10);
                var ht, h, ct, lt = 50,
                    at = n.parseXML || function(n, t) {
                        return window.ActiveXObject ? (t = new ActiveXObject("Microsoft.XMLDOM"), t.async = "false", t.loadXML(n)) : t = (new DOMParser).parseFromString(n, "text/xml"), t && t.documentElement && "parsererror" != t.documentElement.nodeName ? t : null
                    },
                    vt = n.parseJSON || function(a) {
                        return window.eval("(" + a + ")")
                    },
                    yt = function(t, i, r) {
                        var f = t.getResponseHeader("content-type") || "",
                            e = "xml" === i || !i && f.indexOf("xml") >= 0,
                            u = e ? t.responseXML : t.responseText;
                        return e && "parsererror" === u.documentElement.nodeName && n.error && n.error("parsererror"), r && r.dataFilter && (u = r.dataFilter(u, i)), "string" == typeof u && ("json" === i || !i && f.indexOf("json") >= 0 ? u = vt(u) : ("script" === i || !i && f.indexOf("javascript") >= 0) && n.globalEval(u)), u
                    };
                return y
            }
            var e, b, o, u, a, v, y, c, s, l, h, g, nt, tt, p, it, w;
            if (!this.length) return t("ajaxSubmit: skipping submit process - no element selected"), this;
            if (u = this, "function" == typeof r ? r = {
                    success: r
                } : void 0 === r && (r = {}), e = r.type || this.attr2("method"), b = r.url || this.attr2("action"), o = "string" == typeof b ? n.trim(b) : "", o = o || window.location.href || "", o && (o = (o.match(/^([^#]+)/) || [])[1]), r = n.extend(!0, {
                    url: o,
                    success: n.ajaxSettings.success,
                    type: e || n.ajaxSettings.type,
                    iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
                }, r), a = {}, this.trigger("form-pre-serialize", [this, r, a]), a.veto) return t("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
            if (r.beforeSerialize && r.beforeSerialize(this, r) === !1) return t("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
            if (v = r.traditional, void 0 === v && (v = n.ajaxSettings.traditional), c = [], s = this.formToArray(r.semantic, c), r.data && (r.extraData = r.data, y = n.param(r.data, v)), r.beforeSubmit && r.beforeSubmit(s, this, r) === !1) return t("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
            if (this.trigger("form-submit-validate", [s, this, r, a]), a.veto) return t("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
            l = n.param(s, v);
            y && (l = l ? l + "&" + y : y);
            "GET" == r.type.toUpperCase() ? (r.url += (r.url.indexOf("?") >= 0 ? "&" : "?") + l, r.data = null) : r.data = l;
            h = [];
            (r.resetForm && h.push(function() {
                u.resetForm()
            }), r.clearForm && h.push(function() {
                u.clearForm(r.includeHidden)
            }), !r.dataType && r.target) ? (g = r.success || function() {}, h.push(function(t) {
                var i = r.replaceTarget ? "replaceWith" : "html";
                n(r.target)[i](t).each(g, arguments)
            })) : r.success && h.push(r.success);
            (r.success = function(n, t, i) {
                for (var e = r.context || this, f = 0, o = h.length; o > f; f++) h[f].apply(e, [n, t, i || u, u])
            }, r.error) && (nt = r.error, r.error = function(n, t, i) {
                var f = r.context || this;
                nt.apply(f, [n, t, i, u])
            });
            r.complete && (tt = r.complete, r.complete = function(n, t) {
                var i = r.context || this;
                tt.apply(i, [n, t, u])
            });
            var st = n("input[type=file]:enabled", this).filter(function() {
                    return "" !== n(this).val()
                }),
                rt = st.length > 0,
                ut = "multipart/form-data",
                ft = u.attr("enctype") == ut || u.attr("encoding") == ut,
                k = i.fileapi && i.formdata;
            for (t("fileAPI :" + k), it = (rt || ft) && !k, r.iframe !== !1 && (r.iframe || it) ? r.closeKeepAlive ? n.get(r.closeKeepAlive, function() {
                    p = d(s)
                }) : p = d(s) : p = (rt || ft) && k ? ot(s) : n.ajax(r), u.removeData("jqxhr").data("jqxhr", p), w = 0; w < c.length; w++) c[w] = null;
            return this.trigger("form-submit-notify", [this, r]), this
        };
        n.fn.ajaxForm = function(i) {
            if (i = i || {}, i.delegation = i.delegation && n.isFunction(n.fn.on), !i.delegation && 0 === this.length) {
                var f = {
                    s: this.selector,
                    c: this.context
                };
                return !n.isReady && f.s ? (t("DOM not ready, queuing ajaxForm"), n(function() {
                    n(f.s, f.c).ajaxForm(i)
                }), this) : (t("terminating; zero elements found by selector" + (n.isReady ? "" : " (DOM not ready)")), this)
            }
            return i.delegation ? (n(document).off("submit.form-plugin", this.selector, r).off("click.form-plugin", this.selector, u).on("submit.form-plugin", this.selector, i, r).on("click.form-plugin", this.selector, i, u), this) : this.ajaxFormUnbind().bind("submit.form-plugin", i, r).bind("click.form-plugin", i, u)
        };
        n.fn.ajaxFormUnbind = function() {
            return this.unbind("submit.form-plugin click.form-plugin")
        };
        n.fn.formToArray = function(t, r) {
            var e = [],
                l, h, f, c, u, w, b, a, y, v;
            if (0 === this.length) return e;
            var p, o = this[0],
                k = this.attr("id"),
                s = t ? o.getElementsByTagName("*") : o.elements;
            if (s && (s = n(s).get()), k && (p = n(":input[form=" + k + "]").get(), p.length && (s = (s || []).concat(p))), !s || !s.length) return e;
            for (l = 0, w = s.length; w > l; l++)
                if (u = s[l], f = u.name, f && !u.disabled)
                    if (t && o.clk && "image" == u.type) o.clk == u && (e.push({
                        name: f,
                        value: n(u).val(),
                        type: u.type
                    }), e.push({
                        name: f + ".x",
                        value: o.clk_x
                    }, {
                        name: f + ".y",
                        value: o.clk_y
                    }));
                    else if (c = n.fieldValue(u, !0), c && c.constructor == Array)
                for (r && r.push(u), h = 0, b = c.length; b > h; h++) e.push({
                    name: f,
                    value: c[h]
                });
            else if (i.fileapi && "file" == u.type)
                if (r && r.push(u), a = u.files, a.length)
                    for (h = 0; h < a.length; h++) e.push({
                        name: f,
                        value: a[h],
                        type: u.type
                    });
                else e.push({
                    name: f,
                    value: "",
                    type: u.type
                });
            else null !== c && "undefined" != typeof c && (r && r.push(u), e.push({
                name: f,
                value: c,
                type: u.type,
                required: u.required
            }));
            return !t && o.clk && (y = n(o.clk), v = y[0], f = v.name, f && !v.disabled && "image" == v.type && (e.push({
                name: f,
                value: y.val()
            }), e.push({
                name: f + ".x",
                value: o.clk_x
            }, {
                name: f + ".y",
                value: o.clk_y
            }))), e
        };
        n.fn.formSerialize = function(t) {
            return n.param(this.formToArray(t))
        };
        n.fn.fieldSerialize = function(t) {
            var i = [];
            return this.each(function() {
                var f = this.name,
                    r, u, e;
                if (f)
                    if (r = n.fieldValue(this, t), r && r.constructor == Array)
                        for (u = 0, e = r.length; e > u; u++) i.push({
                            name: f,
                            value: r[u]
                        });
                    else null !== r && "undefined" != typeof r && i.push({
                        name: this.name,
                        value: r
                    })
            }), n.param(i)
        };
        n.fn.fieldValue = function(t) {
            for (var f, i, r = [], u = 0, e = this.length; e > u; u++) f = this[u], i = n.fieldValue(f, t), null !== i && "undefined" != typeof i && (i.constructor != Array || i.length) && (i.constructor == Array ? n.merge(r, i) : r.push(i));
            return r
        };
        n.fieldValue = function(t, i) {
            var a = t.name,
                u = t.type,
                h = t.tagName.toLowerCase(),
                e, r, f;
            if (void 0 === i && (i = !0), i && (!a || t.disabled || "reset" == u || "button" == u || ("checkbox" == u || "radio" == u) && !t.checked || ("submit" == u || "image" == u) && t.form && t.form.clk != t || "select" == h && -1 == t.selectedIndex)) return null;
            if ("select" == h) {
                if (e = t.selectedIndex, 0 > e) return null;
                for (var c = [], l = t.options, o = "select-one" == u, v = o ? e + 1 : l.length, s = o ? e : 0; v > s; s++)
                    if (r = l[s], r.selected) {
                        if (f = r.value, f || (f = r.attributes && r.attributes.value && !r.attributes.value.specified ? r.text : r.value), o) return f;
                        c.push(f)
                    }
                return c
            }
            return n(t).val()
        };
        n.fn.clearForm = function(t) {
            return this.each(function() {
                n("input,select,textarea", this).clearFields(t)
            })
        };
        n.fn.clearFields = n.fn.clearInputs = function(t) {
            var i = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
            return this.each(function() {
                var r = this.type,
                    u = this.tagName.toLowerCase();
                i.test(r) || "textarea" == u ? this.value = "" : "checkbox" == r || "radio" == r ? this.checked = !1 : "select" == u ? this.selectedIndex = -1 : "file" == r ? /MSIE/.test(navigator.userAgent) ? n(this).replaceWith(n(this).clone(!0)) : n(this).val("") : t && (t === !0 && /hidden/.test(r) || "string" == typeof t && n(this).is(t)) && (this.value = "")
            })
        };
        n.fn.resetForm = function() {
            return this.each(function() {
                "function" != typeof this.reset && ("object" != typeof this.reset || this.reset.nodeType) || this.reset()
            })
        };
        n.fn.enable = function(n) {
            return void 0 === n && (n = !0), this.each(function() {
                this.disabled = !n
            })
        };
        n.fn.selected = function(t) {
            return void 0 === t && (t = !0), this.each(function() {
                var r = this.type,
                    i;
                "checkbox" == r || "radio" == r ? this.checked = t : "option" == this.tagName.toLowerCase() && (i = n(this).parent("select"), t && i[0] && "select-one" == i[0].type && i.find("option").selected(!1), this.selected = t)
            })
        };
        n.fn.ajaxSubmit.debug = !1
    }), function(n) {
        var h = "Close",
            wt = "BeforeClose",
            ii = "AfterClose",
            ri = "BeforeAppend",
            ut = "MarkupParse",
            ft = "Open",
            bt = "Change",
            et = "mfp",
            u = "." + et,
            w = "mfp-ready",
            kt = "mfp-removing",
            ot = "mfp-prevent-close",
            t, b = function() {},
            st = !!window.jQuery,
            ht, f = n(window),
            v, o, k, c, dt, r = function(n, i) {
                t.ev.on(et + n + u, i)
            },
            e = function(t, i, r, u) {
                var f = document.createElement("div");
                return f.className = "mfp-" + t, r && (f.innerHTML = r), u ? i && i.appendChild(f) : (f = n(f), i && f.appendTo(i)), f
            },
            i = function(i, r) {
                t.ev.triggerHandler(et + i, r);
                t.st.callbacks && (i = i.charAt(0).toLowerCase() + i.slice(1), t.st.callbacks[i] && t.st.callbacks[i].apply(t, n.isArray(r) ? r : [r]))
            },
            ct = function() {
                (t.st.focus ? t.content.find(t.st.focus).eq(0) : t.wrap).focus()
            },
            lt = function(i) {
                return i === dt && t.currTemplate.closeBtn || (t.currTemplate.closeBtn = n(t.st.closeMarkup.replace("%title%", t.st.tClose)), dt = i), t.currTemplate.closeBtn
            },
            gt = function() {
                n.magnificPopup.instance || (t = new b, t.init(), n.magnificPopup.instance = t)
            },
            ui = function(i) {
                if (!n(i).hasClass(ot)) {
                    var r = t.st.closeOnContentClick,
                        u = t.st.closeOnBgClick;
                    if (r && u || !t.content || n(i).hasClass("mfp-close") || t.preloader && i === t.preloader[0]) return !0;
                    if (i === t.content[0] || n.contains(t.content[0], i)) {
                        if (r) return !0
                    } else if (u && n.contains(document, i)) return !0;
                    return !1
                }
            },
            fi = function() {
                var n = document.createElement("p").style,
                    t = ["ms", "O", "Moz", "Webkit"];
                if (n.transition !== undefined) return !0;
                while (t.length)
                    if (t.pop() + "Transition" in n) return !0;
                return !1
            },
            d, a, g, nt, at, y, p, tt, s, ni, vt, ti, it, yt, rt;
        b.prototype = {
            constructor: b,
            init: function() {
                var i = navigator.appVersion;
                t.isIE7 = i.indexOf("MSIE 7.") !== -1;
                t.isIE8 = i.indexOf("MSIE 8.") !== -1;
                t.isLowIE = t.isIE7 || t.isIE8;
                t.isAndroid = /android/gi.test(i);
                t.isIOS = /iphone|ipad|ipod/gi.test(i);
                t.supportsTransition = fi();
                t.probablyMobile = t.isAndroid || t.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent);
                v = n(document.body);
                o = n(document);
                t.popupsCache = {}
            },
            open: function(s) {
                var h, y, l, p, a, b, v;
                if (s.isObj === !1) {
                    for (t.items = s.items.toArray(), t.index = 0, y = s.items, h = 0; h < y.length; h++)
                        if (l = y[h], l.parsed && (l = l.el[0]), l === s.el[0]) {
                            t.index = h;
                            break
                        }
                } else t.items = n.isArray(s.items) ? s.items : [s.items], t.index = s.index || 0;
                if (t.isOpen) {
                    t.updateItemHTML();
                    return
                }
                for (t.types = [], c = "", t.ev = s.mainEl && s.mainEl.length ? s.mainEl.eq(0) : o, s.key ? (t.popupsCache[s.key] || (t.popupsCache[s.key] = {}), t.currTemplate = t.popupsCache[s.key]) : t.currTemplate = {}, t.st = n.extend(!0, {}, n.magnificPopup.defaults, s), t.fixedContentPos = t.st.fixedContentPos === "auto" ? !t.probablyMobile : t.st.fixedContentPos, t.st.modal && (t.st.closeOnContentClick = !1, t.st.closeOnBgClick = !1, t.st.showCloseBtn = !1, t.st.enableEscapeKey = !1), t.bgOverlay || (t.bgOverlay = e("bg").on("click" + u, function() {
                        t.close()
                    }), t.wrap = e("wrap").attr("tabindex", -1).on("click" + u, function(n) {
                        ui(n.target) && t.close()
                    }), t.container = e("container", t.wrap)), t.contentContainer = e("content"), t.st.preloader && (t.preloader = e("preloader", t.container, t.st.tLoading)), p = n.magnificPopup.modules, h = 0; h < p.length; h++) a = p[h], a = a.charAt(0).toUpperCase() + a.slice(1), t["init" + a].call(t);
                if (i("BeforeOpen"), t.st.showCloseBtn && (t.st.closeBtnInside ? (r(ut, function(n, t, i, r) {
                        i.close_replaceWith = lt(r.type)
                    }), c += " mfp-close-btn-in") : t.wrap.append(lt())), t.st.alignTop && (c += " mfp-align-top"), t.fixedContentPos ? t.wrap.css({
                        overflow: t.st.overflowY,
                        overflowX: "hidden",
                        overflowY: t.st.overflowY
                    }) : t.wrap.css({
                        top: f.scrollTop(),
                        position: "absolute"
                    }), t.st.fixedBgPos !== !1 && (t.st.fixedBgPos !== "auto" || t.fixedContentPos) || t.bgOverlay.css({
                        height: o.height(),
                        position: "absolute"
                    }), t.st.enableEscapeKey) o.on("keyup" + u, function(n) {
                    n.keyCode === 27 && t.close()
                });
                f.on("resize" + u, function() {
                    t.updateSize()
                });
                t.st.closeOnContentClick || (c += " mfp-auto-cursor");
                c && t.wrap.addClass(c);
                b = t.wH = f.height();
                v = t.st.mainClass;
                t.isIE7 && (v += " mfp-ie7");
                v && t._addClassToMFP(v);
                t.updateItemHTML();
                i("BuildControls");
                n("html").css({});
                t.bgOverlay.add(t.wrap).prependTo(document.body);
                t._lastFocusedEl = document.activeElement;
                setTimeout(function() {
                    t.content ? (t._addClassToMFP(w), ct()) : t.bgOverlay.addClass(w);
                    o.on("focusin" + u, function(i) {
                        if (i.target !== t.wrap[0] && !n.contains(t.wrap[0], i.target)) return ct(), !1
                    })
                }, 16);
                t.isOpen = !0;
                t.updateSize(b);
                i(ft)
            },
            close: function() {
                t.isOpen && (i(wt), t.isOpen = !1, t.st.removalDelay && !t.isLowIE && t.supportsTransition ? (t._addClassToMFP(kt), setTimeout(function() {
                    t._close()
                }, t.st.removalDelay)) : t._close())
            },
            _close: function() {
                i(h);
                var r = kt + " " + w + " ";
                t.bgOverlay.detach();
                t.wrap.detach();
                t.container.empty();
                t.st.mainClass && (r += t.st.mainClass + " ");
                t._removeClassFromMFP(r);
                o.off("keyup" + u + " focusin" + u);
                t.ev.off(u);
                t.wrap.attr("class", "mfp-wrap").removeAttr("style");
                t.bgOverlay.attr("class", "mfp-bg");
                t.container.attr("class", "mfp-container");
                t.st.showCloseBtn && (!t.st.closeBtnInside || t.currTemplate[t.currItem.type] === !0) && t.currTemplate.closeBtn && t.currTemplate.closeBtn.detach();
                t._lastFocusedEl && n(t._lastFocusedEl).focus();
                t.currItem = null;
                t.content = null;
                t.currTemplate = null;
                t.prevHeight = 0;
                i(ii)
            },
            updateSize: function(n) {
                if (t.isIOS) {
                    var u = document.documentElement.clientWidth / window.innerWidth,
                        r = window.innerHeight * u;
                    t.wrap.css("height", r);
                    t.wH = r
                } else t.wH = n || f.height();
                t.fixedContentPos || t.wrap.css("height", t.wH);
                i("Resize")
            },
            updateItemHTML: function() {
                var u = t.items[t.index],
                    r, f, e;
                t.contentContainer.detach();
                t.content && t.content.detach();
                u.parsed || (u = t.parseEl(t.index));
                r = u.type;
                i("BeforeChange", [t.currItem ? t.currItem.type : "", r]);
                t.currItem = u;
                t.currTemplate[r] || (f = t.st[r] ? t.st[r].markup : !1, i("FirstMarkupParse", f), t.currTemplate[r] = f ? n(f) : !0);
                k && k !== u.type && t.container.removeClass("mfp-" + k + "-holder");
                e = t["get" + r.charAt(0).toUpperCase() + r.slice(1)](u, t.currTemplate[r]);
                t.appendContent(e, r);
                u.preloaded = !0;
                i(bt, u);
                k = u.type;
                t.container.prepend(t.contentContainer);
                i("AfterChange")
            },
            appendContent: function(n, r) {
                t.content = n;
                n ? t.st.showCloseBtn && t.st.closeBtnInside && t.currTemplate[r] === !0 ? t.content.find(".mfp-close").length || t.content.append(lt()) : t.content = n : t.content = "";
                i(ri);
                t.container.addClass("mfp-" + r + "-holder");
                t.contentContainer.append(t.content)
            },
            parseEl: function(r) {
                var u = t.items[r],
                    o = u.type,
                    e, f;
                if (u = u.tagName ? {
                        el: n(u)
                    } : {
                        data: u,
                        src: u.src
                    }, u.el) {
                    for (e = t.types, f = 0; f < e.length; f++)
                        if (u.el.hasClass("mfp-" + e[f])) {
                            o = e[f];
                            break
                        }
                    u.src = u.el.attr("data-mfp-src");
                    u.src || (u.src = u.el.attr("href"))
                }
                return u.type = o || t.st.type || "inline", u.index = r, u.parsed = !0, t.items[r] = u, i("ElementParse", u), t.items[r]
            },
            addGroup: function(n, i) {
                var u = function(r) {
                        r.mfpEl = this;
                        t._openClick(r, n, i)
                    },
                    r;
                if (i || (i = {}), r = "click.magnificPopup", i.mainEl = n, i.items) {
                    i.isObj = !0;
                    n.off(r).on(r, u)
                } else if (i.isObj = !1, i.delegate) n.off(r).on(r, i.delegate, u);
                else {
                    i.items = n;
                    n.off(r).on(r, u)
                }
            },
            _openClick: function(i, r, u) {
                var o = u.midClick !== undefined ? u.midClick : n.magnificPopup.defaults.midClick,
                    e;
                if (o || !(i.which === 2 || i.ctrlKey || i.metaKey)) {
                    if (e = u.disableOn !== undefined ? u.disableOn : n.magnificPopup.defaults.disableOn, e)
                        if (n.isFunction(e)) {
                            if (!e.call(t)) return !0
                        } else if (f.width() < e) return !0;
                    i.type && (i.preventDefault(), t.isOpen && i.stopPropagation());
                    u.el = n(i.mfpEl);
                    u.delegate && (u.items = r.find(u.delegate));
                    t.open(u)
                }
            },
            updateStatus: function(n, r) {
                if (t.preloader) {
                    ht !== n && t.container.removeClass("mfp-s-" + ht);
                    r || n !== "loading" || (r = t.st.tLoading);
                    var u = {
                        status: n,
                        text: r
                    };
                    i("UpdateStatus", u);
                    n = u.status;
                    r = u.text;
                    t.preloader.html(r);
                    t.preloader.find("a").on("click", function(n) {
                        n.stopImmediatePropagation()
                    });
                    t.container.addClass("mfp-s-" + n);
                    ht = n
                }
            },
            _addClassToMFP: function(n) {
                t.bgOverlay.addClass(n);
                t.wrap.addClass(n)
            },
            _removeClassFromMFP: function(n) {
                this.bgOverlay.removeClass(n);
                t.wrap.removeClass(n)
            },
            _hasScrollBar: function(n) {
                return (t.isIE7 ? o.height() : document.body.scrollHeight) > (n || f.height())
            },
            _parseMarkup: function(t, r, f) {
                var e;
                f.data && (r = n.extend(f.data, r));
                i(ut, [t, r, f]);
                n.each(r, function(n, i) {
                    var r, f;
                    if (i === undefined || i === !1) return !0;
                    e = n.split("_");
                    e.length > 1 ? (r = t.find(u + "-" + e[0]), r.length > 0 && (f = e[1], f === "replaceWith" ? r[0] !== i[0] && r.replaceWith(i) : f === "img" ? r.is("img") ? r.attr("src", i) : r.replaceWith('<img src="' + i + '" class="' + r.attr("class") + '" />') : r.attr(e[1], i))) : t.find(u + "-" + n).html(i)
                })
            },
            _getScrollbarSize: function() {
                if (t.scrollbarSize === undefined) {
                    var n = document.createElement("div");
                    n.id = "mfp-sbm";
                    n.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;";
                    document.body.appendChild(n);
                    t.scrollbarSize = n.offsetWidth - n.clientWidth;
                    document.body.removeChild(n)
                }
                return t.scrollbarSize
            }
        };
        n.magnificPopup = {
            instance: null,
            proto: b.prototype,
            modules: [],
            open: function(n, t) {
                return gt(), n || (n = {}), n.isObj = !0, n.index = t || 0, this.instance.open(n)
            },
            close: function() {
                return n.magnificPopup.instance.close()
            },
            registerModule: function(t, i) {
                i.options && (n.magnificPopup.defaults[t] = i.options);
                n.extend(this.proto, i.proto);
                this.modules.push(t)
            },
            defaults: {
                disableOn: 0,
                key: null,
                midClick: !1,
                mainClass: "",
                preloader: !0,
                focus: "",
                closeOnContentClick: !1,
                closeOnBgClick: !0,
                closeBtnInside: !0,
                showCloseBtn: !0,
                enableEscapeKey: !0,
                modal: !1,
                alignTop: !1,
                removalDelay: 0,
                fixedContentPos: "auto",
                fixedBgPos: "auto",
                overflowY: "auto",
                closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;<\/button>',
                tClose: "Close (Esc)",
                tLoading: "Loading..."
            }
        };
        n.fn.magnificPopup = function(i) {
            var r, u, f, e;
            return gt(), r = n(this), typeof i == "string" ? i === "open" ? (f = st ? r.data("magnificPopup") : r[0].magnificPopup, e = parseInt(arguments[1], 10) || 0, f.items ? u = f.items[e] : (u = r, f.delegate && (u = u.find(f.delegate)), u = u.eq(e)), t._openClick({
                mfpEl: u
            }, r, f)) : t.isOpen && t[i].apply(t, Array.prototype.slice.call(arguments, 1)) : (st ? r.data("magnificPopup", i) : r[0].magnificPopup = i, t.addGroup(r, i)), r
        };
        d = "inline";
        at = function() {
            nt && (g.after(nt.addClass(a)).detach(), nt = null)
        };
        n.magnificPopup.registerModule(d, {
            options: {
                hiddenClass: "hide",
                markup: "",
                tNotFound: "Content not found"
            },
            proto: {
                initInline: function() {
                    t.types.push(d);
                    r(h + "." + d, function() {
                        at()
                    })
                },
                getInline: function(i, r) {
                    var f, u, o;
                    return (at(), i.src) ? (f = t.st.inline, u = n(i.src), u.length ? (o = u[0].parentNode, o && o.tagName && (g || (a = f.hiddenClass, g = e(a), a = "mfp-" + a), nt = u.after(g).detach().removeClass(a)), t.updateStatus("ready")) : (t.updateStatus("error", f.tNotFound), u = n("<div>")), i.inlineElement = u, u) : (t.updateStatus("ready"), t._parseMarkup(r, {}, i), r)
                }
            }
        });
        y = "ajax";
        tt = function() {
            p && v.removeClass(p)
        };
        n.magnificPopup.registerModule(y, {
            options: {
                settings: null,
                cursor: "mfp-ajax-cur",
                tError: '<a href="%url%">The content<\/a> could not be loaded.'
            },
            proto: {
                initAjax: function() {
                    t.types.push(y);
                    p = t.st.ajax.cursor;
                    r(h + "." + y, function() {
                        tt();
                        t.req && t.req.abort()
                    })
                },
                getAjax: function(r) {
                    p && v.addClass(p);
                    t.updateStatus("loading");
                    var u = n.extend({
                        url: r.src,
                        success: function(u, f, e) {
                            var o = {
                                data: u,
                                xhr: e
                            };
                            i("ParseAjax", o);
                            t.appendContent(n(o.data), y);
                            r.finished = !0;
                            tt();
                            ct();
                            setTimeout(function() {
                                t.wrap.addClass(w)
                            }, 16);
                            t.updateStatus("ready");
                            i("AjaxContentAdded")
                        },
                        error: function() {
                            tt();
                            r.finished = r.loadError = !0;
                            t.updateStatus("error", t.st.ajax.tError.replace("%url%", r.src))
                        }
                    }, t.st.ajax.settings);
                    return t.req = n.ajax(u), ""
                }
            }
        });
        ni = function(i) {
            if (i.data && i.data.title !== undefined) return i.data.title;
            var r = t.st.image.titleSrc;
            if (r) {
                if (n.isFunction(r)) return r.call(t, i);
                if (i.el) return i.el.attr(r) || ""
            }
            return ""
        };
        n.magnificPopup.registerModule("image", {
            options: {
                markup: '<div class="mfp-figure"><div class="mfp-close"><\/div><div class="mfp-img"><\/div><div class="mfp-bottom-bar"><div class="mfp-title"><\/div><div class="mfp-counter"><\/div><\/div><\/div>',
                cursor: "mfp-zoom-out-cur",
                titleSrc: "title",
                verticalFit: !0,
                tError: '<a href="%url%">The image<\/a> could not be loaded.'
            },
            proto: {
                initImage: function() {
                    var n = t.st.image,
                        i = ".image";
                    t.types.push("image");
                    r(ft + i, function() {
                        t.currItem.type === "image" && n.cursor && v.addClass(n.cursor)
                    });
                    r(h + i, function() {
                        n.cursor && v.removeClass(n.cursor);
                        f.off("resize" + u)
                    });
                    r("Resize" + i, t.resizeImage);
                    t.isLowIE && r("AfterChange", t.resizeImage)
                },
                resizeImage: function() {
                    var n = t.currItem,
                        i;
                    n && n.img && t.st.image.verticalFit && (i = 0, t.isLowIE && (i = parseInt(n.img.css("padding-top"), 10) + parseInt(n.img.css("padding-bottom"), 10)), n.img.css("max-height", t.wH - i))
                },
                _onImageHasSize: function(n) {
                    n.img && (n.hasSize = !0, s && clearInterval(s), n.isCheckingImgSize = !1, i("ImageHasSize", n), n.imgHidden && (t.content && t.content.removeClass("mfp-loading"), n.imgHidden = !1))
                },
                findImageSize: function(n) {
                    var i = 0,
                        u = n.img[0],
                        r = function(f) {
                            s && clearInterval(s);
                            s = setInterval(function() {
                                if (u.naturalWidth > 0) {
                                    t._onImageHasSize(n);
                                    return
                                }
                                i > 200 && clearInterval(s);
                                i++;
                                i === 3 ? r(10) : i === 40 ? r(50) : i === 100 && r(500)
                            }, f)
                        };
                    r(1)
                },
                getImage: function(r, u) {
                    var e = 0,
                        o = function() {
                            r && (r.img[0].complete ? (r.img.off(".mfploader"), r === t.currItem && (t._onImageHasSize(r), t.updateStatus("ready")), r.hasSize = !0, r.loaded = !0, i("ImageLoadComplete")) : (e++, e < 200 ? setTimeout(o, 100) : h()))
                        },
                        h = function() {
                            r && (r.img.off(".mfploader"), r === t.currItem && (t._onImageHasSize(r), t.updateStatus("error", c.tError.replace("%url%", r.src))), r.hasSize = !0, r.loaded = !0, r.loadError = !0)
                        },
                        c = t.st.image,
                        l = u.find(".mfp-img"),
                        f;
                    return (l.length && (f = document.createElement("img"), f.className = "mfp-img", r.img = n(f).on("load.mfploader", o).on("error.mfploader", h), f.src = r.src, l.is("img") && (r.img = r.img.clone()), r.img[0].naturalWidth > 0 && (r.hasSize = !0)), t._parseMarkup(u, {
                        title: ni(r),
                        img_replaceWith: r.img
                    }, r), t.resizeImage(), r.hasSize) ? (s && clearInterval(s), r.loadError ? (u.addClass("mfp-loading"), t.updateStatus("error", c.tError.replace("%url%", r.src))) : (u.removeClass("mfp-loading"), t.updateStatus("ready")), u) : (t.updateStatus("loading"), r.loading = !0, r.hasSize || (r.imgHidden = !0, u.addClass("mfp-loading"), t.findImageSize(r)), u)
                }
            }
        });
        ti = function() {
            return vt === undefined && (vt = document.createElement("p").style.MozTransform !== undefined), vt
        };
        n.magnificPopup.registerModule("zoom", {
            options: {
                enabled: !1,
                easing: "ease-in-out",
                duration: 300,
                opener: function(n) {
                    return n.is("img") ? n : n.find("img")
                }
            },
            proto: {
                initZoom: function() {
                    var u = t.st.zoom,
                        e = ".zoom";
                    if (u.enabled && t.supportsTransition) {
                        var s = u.duration,
                            c = function(n) {
                                var r = n.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                    f = "all " + u.duration / 1e3 + "s " + u.easing,
                                    t = {
                                        position: "fixed",
                                        zIndex: 9999,
                                        left: 0,
                                        top: 0,
                                        "-webkit-backface-visibility": "hidden"
                                    },
                                    i = "transition";
                                return t["-webkit-" + i] = t["-moz-" + i] = t["-o-" + i] = t[i] = f, r.css(t), r
                            },
                            o = function() {
                                t.content.css("visibility", "visible")
                            },
                            f, n;
                        r("BuildControls" + e, function() {
                            if (t._allowZoom()) {
                                if (clearTimeout(f), t.content.css("visibility", "hidden"), image = t._getItemToZoom(), !image) {
                                    o();
                                    return
                                }
                                n = c(image);
                                n.css(t._getOffset());
                                t.wrap.append(n);
                                f = setTimeout(function() {
                                    n.css(t._getOffset(!0));
                                    f = setTimeout(function() {
                                        o();
                                        setTimeout(function() {
                                            n.remove();
                                            image = n = null;
                                            i("ZoomAnimationEnded")
                                        }, 16)
                                    }, s)
                                }, 16)
                            }
                        });
                        r(wt + e, function() {
                            if (t._allowZoom()) {
                                if (clearTimeout(f), t.st.removalDelay = s, !image) {
                                    if (image = t._getItemToZoom(), !image) return;
                                    n = c(image)
                                }
                                n.css(t._getOffset(!0));
                                t.wrap.append(n);
                                t.content.css("visibility", "hidden");
                                setTimeout(function() {
                                    n.css(t._getOffset())
                                }, 16)
                            }
                        });
                        r(h + e, function() {
                            t._allowZoom() && (o(), n && n.remove())
                        })
                    }
                },
                _allowZoom: function() {
                    return t.currItem.type === "image"
                },
                _getItemToZoom: function() {
                    return t.currItem.hasSize ? t.currItem.img : !1
                },
                _getOffset: function(i) {
                    var r, u;
                    r = i ? t.currItem.img : t.st.zoom.opener(t.currItem.el || t.currItem);
                    var f = r.offset(),
                        e = parseInt(r.css("padding-top"), 10),
                        o = parseInt(r.css("padding-bottom"), 10);
                    return f.top -= n(window).scrollTop() - e, u = {
                        width: r.width(),
                        height: (st ? r.innerHeight() : r[0].offsetHeight) - o - e
                    }, ti() ? u["-moz-transform"] = u.transform = "translate(" + f.left + "px," + f.top + "px)" : (u.left = f.left, u.top = f.top), u
                }
            }
        });
        var l = "iframe",
            ei = "//about:blank",
            pt = function(n) {
                if (t.currTemplate[l]) {
                    var i = t.currTemplate[l].find("iframe");
                    i.length && (n || (i[0].src = ei), t.isIE8 && i.css("display", n ? "block" : "none"))
                }
            };
        n.magnificPopup.registerModule(l, {
            options: {
                markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"><\/div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen><\/iframe><\/div>',
                srcAction: "iframe_src",
                patterns: {
                    youtube: {
                        index: "youtube.com",
                        id: "v=",
                        src: "//www.youtube.com/embed/%id%?autoplay=1"
                    },
                    vimeo: {
                        index: "vimeo.com/",
                        id: "/",
                        src: "//player.vimeo.com/video/%id%?autoplay=1"
                    },
                    gmaps: {
                        index: "//maps.google.",
                        src: "%id%&output=embed"
                    }
                }
            },
            proto: {
                initIframe: function() {
                    t.types.push(l);
                    r("BeforeChange", function(n, t, i) {
                        t !== i && (t === l ? pt() : i === l && pt(!0))
                    });
                    r(h + "." + l, function() {
                        pt()
                    })
                },
                getIframe: function(i, r) {
                    var u = i.src,
                        f = t.st.iframe,
                        e;
                    return n.each(f.patterns, function() {
                        if (u.indexOf(this.index) > -1) return this.id && (u = typeof this.id == "string" ? u.substr(u.lastIndexOf(this.id) + this.id.length, u.length) : this.id.call(this, u)), u = this.src.replace("%id%", u), !1
                    }), e = {}, f.srcAction && (e[f.srcAction] = u), t._parseMarkup(r, e, i), t.updateStatus("ready"), r
                }
            }
        });
        it = function(n) {
            var i = t.items.length;
            return n > i - 1 ? n - i : n < 0 ? i + n : n
        };
        yt = function(n, t, i) {
            return n.replace("%curr%", t + 1).replace("%total%", i)
        };
        n.magnificPopup.registerModule("gallery", {
            options: {
                enabled: !1,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><\/button>',
                preload: [0, 2],
                navigateByImgClick: !0,
                arrows: !0,
                tPrev: "Previous (Left arrow key)",
                tNext: "Next (Right arrow key)",
                tCounter: "%curr% of %total%"
            },
            proto: {
                initGallery: function() {
                    var u = t.st.gallery,
                        i = ".mfp-gallery",
                        f = Boolean(n.fn.mfpFastClick);
                    if (t.direction = !0, !u || !u.enabled) return !1;
                    c += " mfp-gallery";
                    r(ft + i, function() {
                        if (u.navigateByImgClick) t.wrap.on("click" + i, ".mfp-img", function() {
                            if (t.items.length > 1) return t.next(), !1
                        });
                        o.on("keydown" + i, function(n) {
                            n.keyCode === 37 ? t.prev() : n.keyCode === 39 && t.next()
                        })
                    });
                    r("UpdateStatus" + i, function(n, i) {
                        i.text && (i.text = yt(i.text, t.currItem.index, t.items.length))
                    });
                    r(ut + i, function(n, i, r, f) {
                        var e = t.items.length;
                        r.counter = e > 1 ? yt(u.tCounter, f.index, e) : ""
                    });
                    r("BuildControls" + i, function() {
                        if (t.items.length > 1 && u.arrows && !t.arrowLeft) {
                            var o = u.arrowMarkup,
                                i = t.arrowLeft = n(o.replace("%title%", u.tPrev).replace("%dir%", "left")).addClass(ot),
                                r = t.arrowRight = n(o.replace("%title%", u.tNext).replace("%dir%", "right")).addClass(ot),
                                s = f ? "mfpFastClick" : "click";
                            i[s](function() {
                                t.prev()
                            });
                            r[s](function() {
                                t.next()
                            });
                            t.isIE7 && (e("b", i[0], !1, !0), e("a", i[0], !1, !0), e("b", r[0], !1, !0), e("a", r[0], !1, !0));
                            t.container.append(i.add(r))
                        }
                    });
                    r(bt + i, function() {
                        t._preloadTimeout && clearTimeout(t._preloadTimeout);
                        t._preloadTimeout = setTimeout(function() {
                            t.preloadNearbyImages();
                            t._preloadTimeout = null
                        }, 16)
                    });
                    r(h + i, function() {
                        o.off(i);
                        t.wrap.off("click" + i);
                        t.arrowLeft && f && t.arrowLeft.add(t.arrowRight).destroyMfpFastClick();
                        t.arrowRight = t.arrowLeft = null
                    })
                },
                next: function() {
                    t.direction = !0;
                    t.index = it(t.index + 1);
                    t.updateItemHTML()
                },
                prev: function() {
                    t.direction = !1;
                    t.index = it(t.index - 1);
                    t.updateItemHTML()
                },
                goTo: function(n) {
                    t.direction = n >= t.index;
                    t.index = n;
                    t.updateItemHTML()
                },
                preloadNearbyImages: function() {
                    for (var i = t.st.gallery.preload, r = Math.min(i[0], t.items.length), u = Math.min(i[1], t.items.length), n = 1; n <= (t.direction ? u : r); n++) t._preloadItem(t.index + n);
                    for (n = 1; n <= (t.direction ? r : u); n++) t._preloadItem(t.index - n)
                },
                _preloadItem: function(r) {
                    if (r = it(r), !t.items[r].preloaded) {
                        var u = t.items[r];
                        u.parsed || (u = t.parseEl(r));
                        i("LazyLoad", u);
                        u.type === "image" && (u.img = n('<img class="mfp-img" />').on("load.mfploader", function() {
                            u.hasSize = !0
                        }).on("error.mfploader", function() {
                            u.hasSize = !0;
                            u.loadError = !0;
                            i("LazyLoadError", u)
                        }).attr("src", u.src));
                        u.preloaded = !0
                    }
                }
            }
        });
        rt = "retina";
        n.magnificPopup.registerModule(rt, {
                options: {
                    replaceSrc: function(n) {
                        return n.src.replace(/\.\w+$/, function(n) {
                            return "@2x" + n
                        })
                    },
                    ratio: 1
                },
                proto: {
                    initRetina: function() {
                        if (window.devicePixelRatio > 1) {
                            var i = t.st.retina,
                                n = i.ratio;
                            n = isNaN(n) ? n() : n;
                            n > 1 && (r("ImageHasSize." + rt, function(t, i) {
                                i.img.css({
                                    "max-width": i.img[0].naturalWidth / n,
                                    width: "100%"
                                })
                            }), r("ElementParse." + rt, function(t, r) {
                                r.src = i.replaceSrc(r, n)
                            }))
                        }
                    }
                }
            }),
            function() {
                var u = 1e3,
                    i = "ontouchstart" in window,
                    r = function() {
                        f.off("touchmove" + t + " touchend" + t)
                    },
                    t = ".mfpFastClick";
                n.fn.mfpFastClick = function(e) {
                    return n(this).each(function() {
                        var l = n(this),
                            s, a, v, y, h, o, c;
                        if (i) l.on("touchstart" + t, function(n) {
                            h = !1;
                            c = 1;
                            o = n.originalEvent ? n.originalEvent.touches[0] : n.touches[0];
                            v = o.clientX;
                            y = o.clientY;
                            f.on("touchmove" + t, function(n) {
                                o = n.originalEvent ? n.originalEvent.touches : n.touches;
                                c = o.length;
                                o = o[0];
                                (Math.abs(o.clientX - v) > 10 || Math.abs(o.clientY - y) > 10) && (h = !0, r())
                            }).on("touchend" + t, function(n) {
                                (r(), h || c > 1) || (s = !0, n.preventDefault(), clearTimeout(a), a = setTimeout(function() {
                                    s = !1
                                }, u), e())
                            })
                        });
                        l.on("click" + t, function() {
                            s || e()
                        })
                    })
                };
                n.fn.destroyMfpFastClick = function() {
                    n(this).off("touchstart" + t + " click" + t);
                    i && f.off("touchmove" + t + " touchend" + t)
                }
            }()
    }(window.jQuery || window.Zepto), ! function(n) {
        n.flexslider = function(t, i) {
            var r = n(t);
            r.vars = n.extend({}, n.flexslider.defaults, i);
            var p, f = r.vars.namespace,
                v = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
                y = ("ontouchstart" in window || v || window.DocumentTouch && document instanceof DocumentTouch) && r.vars.touch,
                a = "click touchend MSPointerUp keyup",
                s = "",
                h = "vertical" === r.vars.direction,
                o = r.vars.reverse,
                e = r.vars.itemWidth > 0,
                c = "fade" === r.vars.animation,
                l = "" !== r.vars.asNavFor,
                u = {},
                w = !0;
            n.data(t, "flexslider", r);
            u = {
                init: function() {
                    r.animating = !1;
                    r.currentSlide = parseInt(r.vars.startAt ? r.vars.startAt : 0, 10);
                    isNaN(r.currentSlide) && (r.currentSlide = 0);
                    r.animatingTo = r.currentSlide;
                    r.atEnd = 0 === r.currentSlide || r.currentSlide === r.last;
                    r.containerSelector = r.vars.selector.substr(0, r.vars.selector.search(" "));
                    r.slides = n(r.vars.selector, r);
                    r.container = n(r.containerSelector, r);
                    r.count = r.slides.length;
                    r.syncExists = n(r.vars.sync).length > 0;
                    "slide" === r.vars.animation && (r.vars.animation = "swing");
                    r.prop = h ? "top" : "marginLeft";
                    r.args = {};
                    r.manualPause = !1;
                    r.stopped = !1;
                    r.started = !1;
                    r.startTimeout = null;
                    r.transitions = !r.vars.video && !c && r.vars.useCSS && function() {
                        var i = document.createElement("div"),
                            n = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"],
                            t;
                        for (t in n)
                            if (void 0 !== i.style[n[t]]) return r.pfx = n[t].replace("Perspective", "").toLowerCase(), r.prop = "-" + r.pfx + "-transform", !0;
                        return !1
                    }();
                    r.ensureAnimationEnd = "";
                    "" !== r.vars.controlsContainer && (r.controlsContainer = n(r.vars.controlsContainer).length > 0 && n(r.vars.controlsContainer));
                    "" !== r.vars.manualControls && (r.manualControls = n(r.vars.manualControls).length > 0 && n(r.vars.manualControls));
                    r.vars.randomize && (r.slides.sort(function() {
                        return Math.round(Math.random()) - .5
                    }), r.container.empty().append(r.slides));
                    r.doMath();
                    r.setup("init");
                    r.vars.controlNav && u.controlNav.setup();
                    r.vars.directionNav && u.directionNav.setup();
                    r.vars.keyboard && (1 === n(r.containerSelector).length || r.vars.multipleKeyboard) && n(document).bind("keyup", function(n) {
                        var t = n.keyCode,
                            i;
                        r.animating || 39 !== t && 37 !== t || (i = 39 === t ? r.getTarget("next") : 37 === t ? r.getTarget("prev") : !1, r.flexAnimate(i, r.vars.pauseOnAction))
                    });
                    r.vars.mousewheel && r.bind("mousewheel", function(n, t) {
                        n.preventDefault();
                        var i = r.getTarget(0 > t ? "next" : "prev");
                        r.flexAnimate(i, r.vars.pauseOnAction)
                    });
                    r.vars.pausePlay && u.pausePlay.setup();
                    r.vars.slideshow && r.vars.pauseInvisible && u.pauseInvisible.init();
                    r.vars.slideshow && (r.vars.pauseOnHover && r.hover(function() {
                        r.manualPlay || r.manualPause || r.pause()
                    }, function() {
                        r.manualPause || r.manualPlay || r.stopped || r.play()
                    }), r.vars.pauseInvisible && u.pauseInvisible.isHidden() || (r.vars.initDelay > 0 ? r.startTimeout = setTimeout(r.play, r.vars.initDelay) : r.play()));
                    l && u.asNav.setup();
                    y && r.vars.touch && u.touch();
                    (!c || c && r.vars.smoothHeight) && n(window).bind("resize orientationchange focus", u.resize);
                    r.find("img").attr("draggable", "false");
                    setTimeout(function() {
                        r.vars.start(r)
                    }, 200)
                },
                asNav: {
                    setup: function() {
                        r.asNav = !0;
                        r.animatingTo = Math.floor(r.currentSlide / r.move);
                        r.currentItem = r.currentSlide;
                        r.slides.removeClass(f + "active-slide").eq(r.currentItem).addClass(f + "active-slide");
                        v ? (t._slider = r, r.slides.each(function() {
                            var t = this;
                            t._gesture = new MSGesture;
                            t._gesture.target = t;
                            t.addEventListener("MSPointerDown", function(n) {
                                n.preventDefault();
                                n.currentTarget._gesture && n.currentTarget._gesture.addPointer(n.pointerId)
                            }, !1);
                            t.addEventListener("MSGestureTap", function(t) {
                                t.preventDefault();
                                var i = n(this),
                                    u = i.index();
                                n(r.vars.asNavFor).data("flexslider").animating || i.hasClass("active") || (r.direction = r.currentItem < u ? "next" : "prev", r.flexAnimate(u, r.vars.pauseOnAction, !1, !0, !0))
                            })
                        })) : r.slides.on(a, function(t) {
                            t.preventDefault();
                            var i = n(this),
                                u = i.index(),
                                e = i.offset().left - n(r).scrollLeft();
                            0 >= e && i.hasClass(f + "active-slide") ? r.flexAnimate(r.getTarget("prev"), !0) : n(r.vars.asNavFor).data("flexslider").animating || i.hasClass(f + "active-slide") || (r.direction = r.currentItem < u ? "next" : "prev", r.flexAnimate(u, r.vars.pauseOnAction, !1, !0, !0))
                        })
                    }
                },
                controlNav: {
                    setup: function() {
                        r.manualControls ? u.controlNav.setupManual() : u.controlNav.setupPaging()
                    },
                    setupPaging: function() {
                        var e, o, c = "thumbnails" === r.vars.controlNav ? "control-thumbs" : "control-paging",
                            h = 1,
                            t, i;
                        if (r.controlNavScaffold = n('<ol class="' + f + "control-nav " + f + c + '"><\/ol>'), r.pagingCount > 1)
                            for (t = 0; t < r.pagingCount; t++)(o = r.slides.eq(t), e = "thumbnails" === r.vars.controlNav ? '<img src="' + o.attr("data-thumb") + '"/>' : "<a>" + h + "<\/a>", "thumbnails" === r.vars.controlNav && !0 === r.vars.thumbCaptions) && (i = o.attr("data-thumbcaption"), "" != i && void 0 != i && (e += '<span class="' + f + 'caption">' + i + "<\/span>")), r.controlNavScaffold.append('<li data-animate="zoomIn" data-delay="' + 200 * t + '">' + e + "<\/li>"), h++;
                        r.controlsContainer ? n(r.controlsContainer).append(r.controlNavScaffold) : r.append(r.controlNavScaffold);
                        u.controlNav.set();
                        u.controlNav.active();
                        r.controlNavScaffold.delegate("a, img", a, function(t) {
                            if (t.preventDefault(), "" === s || s === t.type) {
                                var i = n(this),
                                    e = r.controlNav.index(i);
                                i.hasClass(f + "active") || (r.direction = e > r.currentSlide ? "next" : "prev", r.flexAnimate(e, r.vars.pauseOnAction))
                            }
                            "" === s && (s = t.type);
                            u.setToClearWatchedEvent()
                        })
                    },
                    setupManual: function() {
                        r.controlNav = r.manualControls;
                        u.controlNav.active();
                        r.controlNav.bind(a, function(t) {
                            if (t.preventDefault(), "" === s || s === t.type) {
                                var i = n(this),
                                    e = r.controlNav.index(i);
                                i.hasClass(f + "active") || (r.direction = e > r.currentSlide ? "next" : "prev", r.flexAnimate(e, r.vars.pauseOnAction))
                            }
                            "" === s && (s = t.type);
                            u.setToClearWatchedEvent()
                        })
                    },
                    set: function() {
                        var t = "thumbnails" === r.vars.controlNav ? "img" : "a";
                        r.controlNav = n("." + f + "control-nav li " + t, r.controlsContainer ? r.controlsContainer : r)
                    },
                    active: function() {
                        r.controlNav.removeClass(f + "active").eq(r.animatingTo).addClass(f + "active")
                    },
                    update: function(t, i) {
                        r.pagingCount > 1 && "add" === t ? r.controlNavScaffold.append(n("<li><a>" + r.count + "<\/a><\/li>")) : 1 === r.pagingCount ? r.controlNavScaffold.find("li").remove() : r.controlNav.eq(i).closest("li").remove();
                        u.controlNav.set();
                        r.pagingCount > 1 && r.pagingCount !== r.controlNav.length ? r.update(i, t) : u.controlNav.active()
                    }
                },
                directionNav: {
                    setup: function() {
                        var t = n('<ul class="' + f + 'direction-nav"><li><a class="' + f + 'prev" href="#">' + r.vars.prevText + '<\/a><\/li><li><a class="' + f + 'next" href="#">' + r.vars.nextText + "<\/a><\/li><\/ul>");
                        r.controlsContainer ? (n(r.controlsContainer).append(t), r.directionNav = n("." + f + "direction-nav li a", r.controlsContainer)) : (r.append(t), r.directionNav = n("." + f + "direction-nav li a", r));
                        u.directionNav.update();
                        r.directionNav.bind(a, function(t) {
                            t.preventDefault();
                            var i;
                            ("" === s || s === t.type) && (i = r.getTarget(n(this).hasClass(f + "next") ? "next" : "prev"), r.flexAnimate(i, r.vars.pauseOnAction));
                            "" === s && (s = t.type);
                            u.setToClearWatchedEvent()
                        })
                    },
                    update: function() {
                        var n = f + "disabled";
                        1 === r.pagingCount ? r.directionNav.addClass(n).attr("tabindex", "-1") : r.vars.animationLoop ? r.directionNav.removeClass(n).removeAttr("tabindex") : 0 === r.animatingTo ? r.directionNav.removeClass(n).filter("." + f + "prev").addClass(n).attr("tabindex", "-1") : r.animatingTo === r.last ? r.directionNav.removeClass(n).filter("." + f + "next").addClass(n).attr("tabindex", "-1") : r.directionNav.removeClass(n).removeAttr("tabindex")
                    }
                },
                pausePlay: {
                    setup: function() {
                        var t = n('<div class="' + f + 'pauseplay"><a><\/a><\/div>');
                        r.controlsContainer ? (r.controlsContainer.append(t), r.pausePlay = n("." + f + "pauseplay a", r.controlsContainer)) : (r.append(t), r.pausePlay = n("." + f + "pauseplay a", r));
                        u.pausePlay.update(r.vars.slideshow ? f + "pause" : f + "play");
                        r.pausePlay.bind(a, function(t) {
                            t.preventDefault();
                            ("" === s || s === t.type) && (n(this).hasClass(f + "pause") ? (r.manualPause = !0, r.manualPlay = !1, r.pause()) : (r.manualPause = !1, r.manualPlay = !0, r.play()));
                            "" === s && (s = t.type);
                            u.setToClearWatchedEvent()
                        })
                    },
                    update: function(n) {
                        "play" === n ? r.pausePlay.removeClass(f + "pause").addClass(f + "play").html(r.vars.playText) : r.pausePlay.removeClass(f + "play").addClass(f + "pause").html(r.vars.pauseText)
                    }
                },
                touch: function() {
                    function d(n) {
                        r.animating ? n.preventDefault() : (window.navigator.msPointerEnabled || 1 === n.touches.length) && (r.pause(), i = h ? r.h : r.w, s = Number(new Date), a = n.touches[0].pageX, y = n.touches[0].pageY, f = e && o && r.animatingTo === r.last ? 0 : e && o ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : e && r.currentSlide === r.last ? r.limit : e ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : o ? (r.last - r.currentSlide + r.cloneOffset) * i : (r.currentSlide + r.cloneOffset) * i, p = h ? y : a, w = h ? a : y, t.addEventListener("touchmove", b, !1), t.addEventListener("touchend", k, !1))
                    }

                    function b(t) {
                        a = t.touches[0].pageX;
                        y = t.touches[0].pageY;
                        n = h ? p - y : p - a;
                        l = h ? Math.abs(n) < Math.abs(a - w) : Math.abs(n) < Math.abs(y - w);
                        (!l || Number(new Date) - s > 500) && (t.preventDefault(), !c && r.transitions && (r.vars.animationLoop || (n /= 0 === r.currentSlide && 0 > n || r.currentSlide === r.last && n > 0 ? Math.abs(n) / i + 2 : 1), r.setProps(f + n, "setTouch")))
                    }

                    function k() {
                        if (t.removeEventListener("touchmove", b, !1), r.animatingTo === r.currentSlide && !l && null !== n) {
                            var u = o ? -n : n,
                                e = r.getTarget(u > 0 ? "next" : "prev");
                            r.canAdvance(e) && (Number(new Date) - s < 550 && Math.abs(u) > 50 || Math.abs(u) > i / 2) ? r.flexAnimate(e, r.vars.pauseOnAction) : c || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0)
                        }
                        t.removeEventListener("touchend", k, !1);
                        p = null;
                        w = null;
                        n = null;
                        f = null
                    }

                    function g(n) {
                        n.stopPropagation();
                        r.animating ? n.preventDefault() : (r.pause(), t._gesture.addPointer(n.pointerId), u = 0, i = h ? r.h : r.w, s = Number(new Date), f = e && o && r.animatingTo === r.last ? 0 : e && o ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : e && r.currentSlide === r.last ? r.limit : e ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : o ? (r.last - r.currentSlide + r.cloneOffset) * i : (r.currentSlide + r.cloneOffset) * i)
                    }

                    function nt(r) {
                        var e, o, a;
                        return r.stopPropagation(), e = r.target._slider, e ? (o = -r.translationX, a = -r.translationY, u += h ? a : o, n = u, l = h ? Math.abs(u) < Math.abs(-o) : Math.abs(u) < Math.abs(-a), r.detail === r.MSGESTURE_FLAG_INERTIA ? void setImmediate(function() {
                            t._gesture.stop()
                        }) : void((!l || Number(new Date) - s > 500) && (r.preventDefault(), !c && e.transitions && (e.vars.animationLoop || (n = u / (0 === e.currentSlide && 0 > u || e.currentSlide === e.last && u > 0 ? Math.abs(u) / i + 2 : 1)), e.setProps(f + n, "setTouch"))))) : void 0
                    }

                    function tt(t) {
                        var r, e, h;
                        t.stopPropagation();
                        r = t.target._slider;
                        r && (r.animatingTo !== r.currentSlide || l || null === n || (e = o ? -n : n, h = r.getTarget(e > 0 ? "next" : "prev"), r.canAdvance(h) && (Number(new Date) - s < 550 && Math.abs(e) > 50 || Math.abs(e) > i / 2) ? r.flexAnimate(h, r.vars.pauseOnAction) : c || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0)), p = null, w = null, n = null, f = null, u = 0)
                    }
                    var p, w, f, i, n, s, l = !1,
                        a = 0,
                        y = 0,
                        u = 0;
                    v ? (t.style.msTouchAction = "none", t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", g, !1), t._slider = r, t.addEventListener("MSGestureChange", nt, !1), t.addEventListener("MSGestureEnd", tt, !1)) : t.addEventListener("touchstart", d, !1)
                },
                resize: function() {
                    !r.animating && r.is(":visible") && (e || r.doMath(), c ? u.smoothHeight() : e ? (r.slides.width(r.computedW), r.update(r.pagingCount), r.setProps()) : h ? (r.viewport.height(r.h), r.setProps(r.h, "setTotal")) : (r.vars.smoothHeight && u.smoothHeight(), r.newSlides.width(r.computedW), r.setProps(r.computedW, "setTotal")))
                },
                smoothHeight: function(n) {
                    if (!h || c) {
                        var t = c ? r : r.viewport;
                        n ? t.animate({
                            height: r.slides.eq(r.animatingTo).height()
                        }, n) : t.height(r.slides.eq(r.animatingTo).height())
                    }
                },
                sync: function(t) {
                    var i = n(r.vars.sync).data("flexslider"),
                        u = r.animatingTo;
                    switch (t) {
                        case "animate":
                            i.flexAnimate(u, r.vars.pauseOnAction, !1, !0);
                            break;
                        case "play":
                            i.playing || i.asNav || i.play();
                            break;
                        case "pause":
                            i.pause()
                    }
                },
                uniqueID: function(t) {
                    return t.filter("[id]").add(t.find("[id]")).each(function() {
                        var t = n(this);
                        t.attr("id", t.attr("id") + "_clone")
                    }), t
                },
                pauseInvisible: {
                    visProp: null,
                    init: function() {
                        var t = ["webkit", "moz", "ms", "o"],
                            n, i;
                        if ("hidden" in document) return "hidden";
                        for (n = 0; n < t.length; n++) t[n] + "Hidden" in document && (u.pauseInvisible.visProp = t[n] + "Hidden");
                        u.pauseInvisible.visProp && (i = u.pauseInvisible.visProp.replace(/[H|h]idden/, "") + "visibilitychange", document.addEventListener(i, function() {
                            u.pauseInvisible.isHidden() ? r.startTimeout ? clearTimeout(r.startTimeout) : r.pause() : r.started ? r.play() : r.vars.initDelay > 0 ? setTimeout(r.play, r.vars.initDelay) : r.play()
                        }))
                    },
                    isHidden: function() {
                        return document[u.pauseInvisible.visProp] || !1
                    }
                },
                setToClearWatchedEvent: function() {
                    clearTimeout(p);
                    p = setTimeout(function() {
                        s = ""
                    }, 3e3)
                }
            };
            r.flexAnimate = function(t, i, s, a, v) {
                var w, d, b, k, p;
                if (r.vars.animationLoop || t === r.currentSlide || (r.direction = t > r.currentSlide ? "next" : "prev"), l && 1 === r.pagingCount && (r.direction = r.currentItem < t ? "next" : "prev"), !r.animating && (r.canAdvance(t, v) || s) && r.is(":visible")) {
                    if (l && a) {
                        if (w = n(r.vars.asNavFor).data("flexslider"), r.atEnd = 0 === t || t === r.count - 1, w.flexAnimate(t, !0, !1, !0, v), r.direction = r.currentItem < t ? "next" : "prev", w.direction = r.direction, Math.ceil((t + 1) / r.visible) - 1 === r.currentSlide || 0 === t) return r.currentItem = t, r.slides.removeClass(f + "active-slide").eq(t).addClass(f + "active-slide"), !1;
                        r.currentItem = t;
                        r.slides.removeClass(f + "active-slide").eq(t).addClass(f + "active-slide");
                        t = Math.floor(t / r.visible)
                    }(r.animating = !0, r.animatingTo = t, i && r.pause(), r.vars.before(r), r.syncExists && !v && u.sync("animate"), r.vars.controlNav && u.controlNav.active(), e || r.slides.removeClass(f + "active-slide").eq(t).addClass(f + "active-slide"), r.atEnd = 0 === t || t === r.last, r.vars.directionNav && u.directionNav.update(), t === r.last && (r.vars.end(r), r.vars.animationLoop || r.pause()), c) ? y ? (r.slides.eq(r.currentSlide).css({
                        opacity: 0,
                        zIndex: 1
                    }), r.slides.eq(t).css({
                        opacity: 1,
                        zIndex: 2
                    }), r.wrapup(p)) : (r.slides.eq(r.currentSlide).css({
                        zIndex: 1
                    }).animate({
                        opacity: 0
                    }, r.vars.animationSpeed, r.vars.easing), r.slides.eq(t).css({
                        zIndex: 2
                    }).animate({
                        opacity: 1
                    }, r.vars.animationSpeed, r.vars.easing, r.wrapup)): (p = h ? r.slides.filter(":first").height() : r.computedW, e ? (d = r.vars.itemMargin, k = (r.itemW + d) * r.move * r.animatingTo, b = k > r.limit && 1 !== r.visible ? r.limit : k) : b = 0 === r.currentSlide && t === r.count - 1 && r.vars.animationLoop && "next" !== r.direction ? o ? (r.count + r.cloneOffset) * p : 0 : r.currentSlide === r.last && 0 === t && r.vars.animationLoop && "prev" !== r.direction ? o ? 0 : (r.count + 1) * p : o ? (r.count - 1 - t + r.cloneOffset) * p : (t + r.cloneOffset) * p, r.setProps(b, "", r.vars.animationSpeed), r.transitions ? (r.vars.animationLoop && r.atEnd || (r.animating = !1, r.currentSlide = r.animatingTo), r.container.unbind("webkitTransitionEnd transitionend"), r.container.bind("webkitTransitionEnd transitionend", function() {
                        clearTimeout(r.ensureAnimationEnd);
                        r.wrapup(p)
                    }), clearTimeout(r.ensureAnimationEnd), r.ensureAnimationEnd = setTimeout(function() {
                        r.wrapup(p)
                    }, r.vars.animationSpeed + 100)) : r.container.animate(r.args, r.vars.animationSpeed, r.vars.easing, function() {
                        r.wrapup(p)
                    }));
                    r.vars.smoothHeight && u.smoothHeight(r.vars.animationSpeed)
                }
            };
            r.wrapup = function(n) {
                c || e || (0 === r.currentSlide && r.animatingTo === r.last && r.vars.animationLoop ? r.setProps(n, "jumpEnd") : r.currentSlide === r.last && 0 === r.animatingTo && r.vars.animationLoop && r.setProps(n, "jumpStart"));
                r.animating = !1;
                r.currentSlide = r.animatingTo;
                r.vars.after(r)
            };
            r.animateSlides = function() {
                !r.animating && w && r.flexAnimate(r.getTarget("next"))
            };
            r.pause = function() {
                clearInterval(r.animatedSlides);
                r.animatedSlides = null;
                r.playing = !1;
                r.vars.pausePlay && u.pausePlay.update("play");
                r.syncExists && u.sync("pause")
            };
            r.play = function() {
                r.playing && clearInterval(r.animatedSlides);
                r.animatedSlides = r.animatedSlides || setInterval(r.animateSlides, r.vars.slideshowSpeed);
                r.started = r.playing = !0;
                r.vars.pausePlay && u.pausePlay.update("pause");
                r.syncExists && u.sync("play")
            };
            r.stop = function() {
                r.pause();
                r.stopped = !0
            };
            r.canAdvance = function(n, t) {
                var i = l ? r.pagingCount - 1 : r.last;
                return t ? !0 : l && r.currentItem === r.count - 1 && 0 === n && "prev" === r.direction ? !0 : l && 0 === r.currentItem && n === r.pagingCount - 1 && "next" !== r.direction ? !1 : n !== r.currentSlide || l ? r.vars.animationLoop ? !0 : r.atEnd && 0 === r.currentSlide && n === i && "next" !== r.direction ? !1 : r.atEnd && r.currentSlide === i && 0 === n && "next" === r.direction ? !1 : !0 : !1
            };
            r.getTarget = function(n) {
                return r.direction = n, "next" === n ? r.currentSlide === r.last ? 0 : r.currentSlide + 1 : 0 === r.currentSlide ? r.last : r.currentSlide - 1
            };
            r.setProps = function(n, t, i) {
                var u = function() {
                    var i = n ? n : (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo,
                        u = function() {
                            if (e) return "setTouch" === t ? n : o && r.animatingTo === r.last ? 0 : o ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : r.animatingTo === r.last ? r.limit : i;
                            switch (t) {
                                case "setTotal":
                                    return o ? (r.count - 1 - r.currentSlide + r.cloneOffset) * n : (r.currentSlide + r.cloneOffset) * n;
                                case "setTouch":
                                    return o ? n : n;
                                case "jumpEnd":
                                    return o ? n : r.count * n;
                                case "jumpStart":
                                    return o ? r.count * n : n;
                                default:
                                    return n
                            }
                        }();
                    return -1 * u + "px"
                }();
                r.transitions && (u = h ? "translate3d(0," + u + ",0)" : "translate3d(" + u + ",0,0)", i = void 0 !== i ? i / 1e3 + "s" : "0s", r.container.css("-" + r.pfx + "-transition-duration", i), r.container.css("transition-duration", i));
                r.args[r.prop] = u;
                (r.transitions || void 0 === i) && r.container.css(r.args);
                r.container.css("transform", u)
            };
            r.setup = function(t) {
                if (c) r.slides.css({
                    width: "100%",
                    float: "left",
                    marginRight: "-100%",
                    position: "relative"
                }), "init" === t && (y ? r.slides.css({
                    opacity: 0,
                    display: "block",
                    webkitTransition: "opacity " + r.vars.animationSpeed / 1e3 + "s ease",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    opacity: 1,
                    zIndex: 2
                }) : 0 == r.vars.fadeFirstSlide ? r.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    zIndex: 2
                }).css({
                    opacity: 1
                }) : r.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, r.vars.animationSpeed, r.vars.easing)), r.vars.smoothHeight && u.smoothHeight();
                else {
                    var i, s;
                    "init" === t && (r.viewport = n('<div class="' + f + 'viewport"><\/div>').css({
                        overflow: "hidden",
                        position: "relative"
                    }).appendTo(r).append(r.container), r.cloneCount = 0, r.cloneOffset = 0, o && (s = n.makeArray(r.slides).reverse(), r.slides = n(s), r.container.empty().append(r.slides)));
                    r.vars.animationLoop && !e && (r.cloneCount = 2, r.cloneOffset = 1, "init" !== t && r.container.find(".clone").remove(), r.container.append(u.uniqueID(r.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(u.uniqueID(r.slides.last().clone().addClass("clone")).attr("aria-hidden", "true")));
                    r.newSlides = n(r.vars.selector, r);
                    i = o ? r.count - 1 - r.currentSlide + r.cloneOffset : r.currentSlide + r.cloneOffset;
                    h && !e ? (r.container.height(200 * (r.count + r.cloneCount) + "%").css("position", "absolute").width("100%"), setTimeout(function() {
                        r.newSlides.css({
                            display: "block"
                        });
                        r.doMath();
                        r.viewport.height(r.h);
                        r.setProps(i * r.h, "init")
                    }, "init" === t ? 100 : 0)) : (r.container.width(200 * (r.count + r.cloneCount) + "%"), r.setProps(i * r.computedW, "init"), setTimeout(function() {
                        r.doMath();
                        r.newSlides.css({
                            width: r.computedW,
                            float: "left",
                            display: "block"
                        });
                        r.vars.smoothHeight && u.smoothHeight()
                    }, "init" === t ? 100 : 0))
                }
                e || r.slides.removeClass(f + "active-slide").eq(r.currentSlide).addClass(f + "active-slide");
                r.vars.init(r)
            };
            r.doMath = function() {
                var u = r.slides.first(),
                    n = r.vars.itemMargin,
                    t = r.vars.minItems,
                    i = r.vars.maxItems;
                r.w = void 0 === r.viewport ? r.width() : r.viewport.width();
                r.h = u.height();
                r.boxPadding = u.outerWidth() - u.width();
                e ? (r.itemT = r.vars.itemWidth + n, r.minW = t ? t * r.itemT : r.w, r.maxW = i ? i * r.itemT - n : r.w, r.itemW = r.minW > r.w ? (r.w - n * (t - 1)) / t : r.maxW < r.w ? (r.w - n * (i - 1)) / i : r.vars.itemWidth > r.w ? r.w : r.vars.itemWidth, r.visible = Math.floor(r.w / r.itemW), r.move = r.vars.move > 0 && r.vars.move < r.visible ? r.vars.move : r.visible, r.pagingCount = Math.ceil((r.count - r.visible) / r.move + 1), r.last = r.pagingCount - 1, r.limit = 1 === r.pagingCount ? 0 : r.vars.itemWidth > r.w ? r.itemW * (r.count - 1) + n * (r.count - 1) : (r.itemW + n) * r.count - r.w - n) : (r.itemW = r.w, r.pagingCount = r.count, r.last = r.count - 1);
                r.computedW = r.itemW - r.boxPadding
            };
            r.update = function(n, t) {
                r.doMath();
                e || (n < r.currentSlide ? r.currentSlide += 1 : n <= r.currentSlide && 0 !== n && (r.currentSlide -= 1), r.animatingTo = r.currentSlide);
                r.vars.controlNav && !r.manualControls && ("add" === t && !e || r.pagingCount > r.controlNav.length ? u.controlNav.update("add") : ("remove" === t && !e || r.pagingCount < r.controlNav.length) && (e && r.currentSlide > r.last && (r.currentSlide -= 1, r.animatingTo -= 1), u.controlNav.update("remove", r.last)));
                r.vars.directionNav && u.directionNav.update()
            };
            r.addSlide = function(t, i) {
                var u = n(t);
                r.count += 1;
                r.last = r.count - 1;
                h && o ? void 0 !== i ? r.slides.eq(r.count - i).after(u) : r.container.prepend(u) : void 0 !== i ? r.slides.eq(i).before(u) : r.container.append(u);
                r.update(i, "add");
                r.slides = n(r.vars.selector + ":not(.clone)", r);
                r.setup();
                r.vars.added(r)
            };
            r.removeSlide = function(t) {
                var i = isNaN(t) ? r.slides.index(n(t)) : t;
                r.count -= 1;
                r.last = r.count - 1;
                isNaN(t) ? n(t, r.slides).remove() : h && o ? r.slides.eq(r.last).remove() : r.slides.eq(t).remove();
                r.doMath();
                r.update(i, "remove");
                r.slides = n(r.vars.selector + ":not(.clone)", r);
                r.setup();
                r.vars.removed(r)
            };
            u.init()
        };
        n(window).blur(function() {
            focused = !1
        }).focus(function() {
            focused = !0
        });
        n.flexslider.defaults = {
            namespace: "flex-",
            selector: ".slides > li",
            animation: "fade",
            easing: "swing",
            direction: "horizontal",
            reverse: !1,
            animationLoop: !0,
            smoothHeight: !1,
            startAt: 0,
            slideshow: !0,
            slideshowSpeed: 7e3,
            animationSpeed: 600,
            initDelay: 0,
            randomize: !1,
            fadeFirstSlide: !0,
            thumbCaptions: !1,
            pauseOnAction: !0,
            pauseOnHover: !1,
            pauseInvisible: !0,
            useCSS: !0,
            touch: !0,
            video: !1,
            controlNav: !0,
            directionNav: !0,
            prevText: "Previous",
            nextText: "Next",
            keyboard: !0,
            multipleKeyboard: !1,
            mousewheel: !1,
            pausePlay: !1,
            pauseText: "Pause",
            playText: "Play",
            controlsContainer: "",
            manualControls: "",
            sync: "",
            asNavFor: "",
            itemWidth: 0,
            itemMargin: 0,
            minItems: 1,
            maxItems: 0,
            move: 0,
            allowOneSlide: !0,
            start: function() {},
            before: function() {},
            after: function() {},
            end: function() {},
            added: function() {},
            removed: function() {},
            init: function() {}
        };
        n.fn.flexslider = function(t) {
            if (void 0 === t && (t = {}), "object" == typeof t) return this.each(function() {
                var i = n(this),
                    u = t.selector ? t.selector : ".slides > li",
                    r = i.find(u);
                1 === r.length && t.allowOneSlide === !0 || 0 === r.length ? (r.fadeIn(400), t.start && t.start(i)) : void 0 === i.data("flexslider") && new n.flexslider(this, t)
            });
            var i = n(this).data("flexslider");
            switch (t) {
                case "play":
                    i.play();
                    break;
                case "pause":
                    i.pause();
                    break;
                case "stop":
                    i.stop();
                    break;
                case "next":
                    i.flexAnimate(i.getTarget("next"), !0);
                    break;
                case "prev":
                case "previous":
                    i.flexAnimate(i.getTarget("prev"), !0);
                    break;
                default:
                    "number" == typeof t && i.flexAnimate(t, !0)
            }
        }
    }(jQuery), function(n) {
        n.fn.pajinate = function(t) {
            function k(i) {
                new_page = parseInt(u.data(o)) - 1;
                n(i).siblings(".active").prev(".page_link").length == !0 ? (p(i, new_page), f(new_page)) : t.wrap_around && f(h - 1)
            }

            function d(i) {
                new_page = parseInt(u.data(o)) + 1;
                n(i).siblings(".active").next(".page_link").length == !0 ? (y(i, new_page), f(new_page)) : t.wrap_around && f(0)
            }

            function f(n) {
                var i, f;
                n = parseInt(n, 10);
                i = parseInt(u.data(l));
                start_from = n * i;
                end_on = start_from + i;
                f = e.hide().slice(start_from, end_on);
                f.fadeIn(700);
                r.find(t.nav_panel_id).children(".page_link[longdesc=" + n + "]").addClass("active " + v).siblings(".active").removeClass("active " + v);
                u.data(o, n);
                var s = parseInt(u.data(o) + 1),
                    h = a.children().size(),
                    c = Math.ceil(h / t.items_per_page);
                r.find(t.nav_info_id).html(t.nav_label_info.replace("{0}", start_from + 1).replace("{1}", start_from + f.length).replace("{2}", e.length).replace("{3}", s).replace("{4}", c));
                w();
                b();
                typeof t.onPageDisplayed != "undefined" && t.onPageDisplayed.call(this, n + 1)
            }

            function y(r, u) {
                var f = u,
                    e = n(r).siblings(".active");
                e.siblings(".page_link[longdesc=" + f + "]").css("display") == "none" && i.each(function() {
                    n(this).children(".page_link").hide().slice(parseInt(f - t.num_page_links_to_display + 1), f + 1).show()
                })
            }

            function p(r, u) {
                var f = u,
                    e = n(r).siblings(".active");
                e.siblings(".page_link[longdesc=" + f + "]").css("display") == "none" && i.each(function() {
                    n(this).children(".page_link").hide().slice(f, f + parseInt(t.num_page_links_to_display)).show()
                })
            }

            function w() {}

            function b() {
                i.children(".last").hasClass("active") ? i.children(".next_link").add(".last_link").addClass("no_more " + c) : i.children(".next_link").add(".last_link").removeClass("no_more " + c);
                i.children(".first").hasClass("active") ? i.children(".previous_link").add(".first_link").addClass("no_more " + c) : i.children(".previous_link").add(".first_link").removeClass("no_more " + c)
            }
            var o = "current_page",
                l = "items_per_page",
                u, t = n.extend({
                    item_container_id: ".content",
                    items_per_page: 10,
                    nav_panel_id: ".page_navigation",
                    nav_info_id: ".info_text",
                    num_page_links_to_display: 20,
                    start_page: 0,
                    wrap_around: !1,
                    nav_label_first: "First",
                    nav_label_prev: "Prev",
                    nav_label_next: "Next",
                    nav_label_last: "Last",
                    nav_order: ["first", "prev", "num", "next", "last"],
                    nav_label_info: "Showing {0}-{1} of {2} results",
                    show_first_last: !0,
                    abort_on_small_lists: !1,
                    jquery_ui: !1,
                    jquery_ui_active: "ui-state-highlight",
                    jquery_ui_default: "ui-state-default",
                    jquery_ui_disabled: "ui-state-disabled"
                }, t),
                a, r, e, i, h, s = t.jquery_ui ? t.jquery_ui_default : "",
                v = t.jquery_ui ? t.jquery_ui_active : "",
                c = t.jquery_ui ? t.jquery_ui_disabled : "";
            return this.each(function() {
                var nt, g;
                if (r = n(this), a = n(this).find(t.item_container_id), e = r.find(t.item_container_id).children(), t.abort_on_small_lists && t.items_per_page >= e.size()) return r;
                u = r;
                u.data(o, 0);
                u.data(l, t.items_per_page);
                var tt = a.children().size(),
                    it = Math.ceil(tt / t.items_per_page),
                    rt = t.show_first_last ? '<li class="first_link ' + s + '"><a href="#">' + t.nav_label_first + "<\/a><\/li>" : "",
                    ut = t.show_first_last ? '<li class="last_link ' + s + '"><a href="#">' + t.nav_label_last + "<\/a><\/li>" : "",
                    c = "";
                for (nt = 0; nt < t.nav_order.length; nt++) switch (t.nav_order[nt]) {
                    case "first":
                        c += rt;
                        break;
                    case "last":
                        c += ut;
                        break;
                    case "next":
                        c += '<li class="next_link ' + s + '"><a href="#">' + t.nav_label_next + "<\/a><\/li>";
                        break;
                    case "prev":
                        c += '<li class="previous_link ' + s + '"><a href="#">' + t.nav_label_prev + "<\/a><\/li>";
                        break;
                    case "num":
                        for (c += '<li class="disabled ellipse less"><span>...<\/span><\/li>', g = 0; it > g;) c += '<li class="page_link ' + s + '" longdesc="' + g + '"><a href="#">' + (g + 1) + "<\/a><\/li>", g++;
                        c += '<li class="disabled ellipse more"><span>...<\/span><\/li>'
                }
                i = r.find(t.nav_panel_id);
                i.html(c).each(function() {
                    n(this).find(".page_link:first").addClass("first");
                    n(this).find(".page_link:last").addClass("last")
                });
                i.children(".ellipse").hide();
                i.find(".previous_link").next().next().addClass("active " + v);
                e.hide();
                e.slice(0, u.data(l)).show();
                h = r.find(t.nav_panel_id + ":first").children(".page_link").size();
                t.num_page_links_to_display = Math.min(t.num_page_links_to_display, h);
                i.children(".page_link").hide();
                i.each(function() {
                    n(this).children(".page_link").slice(0, t.num_page_links_to_display).show()
                });
                r.find(".first_link").click(function(t) {
                    t.preventDefault();
                    p(n(this), 0);
                    f(0)
                });
                r.find(".last_link").click(function(t) {
                    t.preventDefault();
                    var i = h - 1;
                    y(n(this), i);
                    f(i)
                });
                r.find(".previous_link").click(function(t) {
                    t.preventDefault();
                    k(n(this))
                });
                r.find(".next_link").click(function(t) {
                    t.preventDefault();
                    d(n(this))
                });
                r.find(".page_link").click(function(t) {
                    t.preventDefault();
                    f(n(this).attr("longdesc"))
                });
                f(parseInt(t.start_page));
                w();
                t.wrap_around || b()
            })
        }
    }(jQuery), function(n, t, i) {
        "use strict";
        t.infinitescroll = function(n, i, r) {
            this.element = t(r);
            this._create(n, i) || (this.failed = !0)
        };
        t.infinitescroll.defaults = {
            loading: {
                finished: i,
                finishedMsg: "<em>Congratulations, you've reached the end of the internet.<\/em>",
                img: "",
                msg: null,
                msgText: "<em>Loading the next set of posts...<\/em>",
                selector: null,
                speed: "fast",
                start: i
            },
            state: {
                isDuringAjax: !1,
                isInvalidPage: !1,
                isDestroyed: !1,
                isDone: !1,
                isPaused: !1,
                isBeyondMaxPage: !1,
                currPage: 1
            },
            debug: !1,
            behavior: i,
            binder: t(n),
            nextSelector: "div.navigation a:first",
            navSelector: "div.navigation",
            contentSelector: null,
            extraScrollPx: 150,
            itemSelector: "div.post",
            animate: !1,
            pathParse: i,
            dataType: "html",
            appendCallback: !0,
            bufferPx: 40,
            errorCallback: function() {},
            infid: 0,
            pixelsFromNavToBottom: i,
            path: i,
            prefill: !1,
            maxPage: i
        };
        t.infinitescroll.prototype = {
            _binding: function(n) {
                var t = this,
                    r = t.options;
                if (r.v = "2.0b2.120520", !!r.behavior && this["_binding_" + r.behavior] !== i) {
                    this["_binding_" + r.behavior].call(this);
                    return
                }
                if (n !== "bind" && n !== "unbind") return this._debug("Binding value  " + n + " not valid"), !1;
                n === "unbind" ? this.options.binder.unbind("smartscroll.infscr." + t.options.infid) : this.options.binder[n]("smartscroll.infscr." + t.options.infid, function() {
                    t.scroll()
                });
                this._debug("Binding", n)
            },
            _create: function(r, u) {
                var f = t.extend(!0, {}, t.infinitescroll.defaults, r),
                    o, s, e, h;
                return (this.options = f, o = t(n), s = this, !s._validate(r)) ? !1 : (e = t(f.nextSelector).attr("href"), !e) ? (this._debug("Navigation selector not found"), !1) : (f.path = f.path || this._determinepath(e), f.contentSelector = f.contentSelector || this.element, f.loading.selector = f.loading.selector || f.contentSelector, f.loading.msg = f.loading.msg || t('<div id="infscr-loading"><img alt="Loading..." src="' + f.loading.img + '" /><div>' + f.loading.msgText + "<\/div><\/div>"), (new Image).src = f.loading.img, f.pixelsFromNavToBottom === i && (f.pixelsFromNavToBottom = t(document).height() - t(f.navSelector).offset().top, this._debug("pixelsFromNavToBottom: " + f.pixelsFromNavToBottom)), h = this, f.loading.start = f.loading.start || function() {
                    t(f.navSelector).hide();
                    f.loading.msg.appendTo(f.loading.selector).show(f.loading.speed, t.proxy(function() {
                        this.beginAjax(f)
                    }, h))
                }, f.loading.finished = f.loading.finished || function() {
                    f.state.isBeyondMaxPage || f.loading.msg.fadeOut(f.loading.speed)
                }, f.callback = function(n, r, e) {
                    f.behavior && n["_callback_" + f.behavior] !== i && n["_callback_" + f.behavior].call(t(f.contentSelector)[0], r, e);
                    u && u.call(t(f.contentSelector)[0], r, f, e);
                    f.prefill && o.bind("resize.infinite-scroll", n._prefill)
                }, r.debug && Function.prototype.bind && (typeof console == "object" || typeof console == "function") && typeof console.log == "object" && ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"].forEach(function(n) {
                    console[n] = this.call(console[n], console)
                }, Function.prototype.bind), this._setup(), f.prefill && this._prefill(), !0)
            },
            _prefill: function() {
                function u() {
                    return i.options.contentSelector.height() <= r.height()
                }
                var i = this,
                    r = t(n);
                this._prefill = function() {
                    u() && i.scroll();
                    r.bind("resize.infinite-scroll", function() {
                        u() && (r.unbind("resize.infinite-scroll"), i.scroll())
                    })
                };
                this._prefill()
            },
            _debug: function() {
                !0 === this.options.debug && (typeof console != "undefined" && typeof console.log == "function" ? Array.prototype.slice.call(arguments).length === 1 && typeof Array.prototype.slice.call(arguments)[0] == "string" ? console.log(Array.prototype.slice.call(arguments).toString()) : console.log(Array.prototype.slice.call(arguments)) : Function.prototype.bind || typeof console == "undefined" || typeof console.log != "object" || Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments)))
            },
            _determinepath: function(n) {
                var t = this.options;
                if (!!t.behavior && this["_determinepath_" + t.behavior] !== i) return this["_determinepath_" + t.behavior].call(this, n);
                if (t.pathParse) return this._debug("pathParse manual"), t.pathParse(n, this.options.state.currPage + 1);
                if (n.match(/^(.*?)\b2\b(.*?$)/)) n = n.match(/^(.*?)\b2\b(.*?$)/).slice(1);
                else if (n.match(/^(.*?)2(.*?$)/)) {
                    if (n.match(/^(.*?page=)2(\/.*|$)/)) return n.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    n = n.match(/^(.*?)2(.*?$)/).slice(1)
                } else {
                    if (n.match(/^(.*?page=)1(\/.*|$)/)) return n.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    this._debug("Sorry, we couldn't parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.");
                    t.state.isInvalidPage = !0
                }
                return this._debug("determinePath", n), n
            },
            _error: function(n) {
                var t = this.options;
                if (!!t.behavior && this["_error_" + t.behavior] !== i) {
                    this["_error_" + t.behavior].call(this, n);
                    return
                }
                n !== "destroy" && n !== "end" && (n = "unknown");
                this._debug("Error", n);
                (n === "end" || t.state.isBeyondMaxPage) && this._showdonemsg();
                t.state.isDone = !0;
                t.state.currPage = 1;
                t.state.isPaused = !1;
                t.state.isBeyondMaxPage = !1;
                this._binding("unbind")
            },
            _loadcallback: function(r, u, f) {
                var e = this.options,
                    c = this.options.callback,
                    l = e.state.isDone ? "done" : e.appendCallback ? "append" : "no-append",
                    o, s, h;
                if (!!e.behavior && this["_loadcallback_" + e.behavior] !== i) {
                    this["_loadcallback_" + e.behavior].call(this, r, u);
                    return
                }
                switch (l) {
                    case "done":
                        return this._showdonemsg(), !1;
                    case "no-append":
                        e.dataType === "html" && (u = "<div>" + u + "<\/div>", u = t(u).find(e.itemSelector));
                        break;
                    case "append":
                        if (s = r.children(), s.length === 0) return this._error("end");
                        for (o = document.createDocumentFragment(); r[0].firstChild;) o.appendChild(r[0].firstChild);
                        this._debug("contentSelector", t(e.contentSelector)[0]);
                        t(e.contentSelector)[0].appendChild(o);
                        u = s.get()
                }
                e.loading.finished.call(t(e.contentSelector)[0], e);
                e.animate && (h = t(n).scrollTop() + t(e.loading.msg).height() + e.extraScrollPx + "px", t("html,body").animate({
                    scrollTop: h
                }, 800, function() {
                    e.state.isDuringAjax = !1
                }));
                e.animate || (e.state.isDuringAjax = !1);
                c(this, u, f);
                e.prefill && this._prefill()
            },
            _nearbottom: function() {
                var r = this.options,
                    u = 0 + t(document).height() - r.binder.scrollTop() - t(n).height();
                return !!r.behavior && this["_nearbottom_" + r.behavior] !== i ? this["_nearbottom_" + r.behavior].call(this) : (this._debug("math:", u, r.pixelsFromNavToBottom), u - r.bufferPx < r.pixelsFromNavToBottom)
            },
            _pausing: function(n) {
                var t = this.options;
                if (!!t.behavior && this["_pausing_" + t.behavior] !== i) {
                    this["_pausing_" + t.behavior].call(this, n);
                    return
                }
                n !== "pause" && n !== "resume" && n !== null && this._debug("Invalid argument. Toggling pause value instead");
                n = n && (n === "pause" || n === "resume") ? n : "toggle";
                switch (n) {
                    case "pause":
                        t.state.isPaused = !0;
                        break;
                    case "resume":
                        t.state.isPaused = !1;
                        break;
                    case "toggle":
                        t.state.isPaused = !t.state.isPaused
                }
                return this._debug("Paused", t.state.isPaused), !1
            },
            _setup: function() {
                var n = this.options;
                if (!!n.behavior && this["_setup_" + n.behavior] !== i) {
                    this["_setup_" + n.behavior].call(this);
                    return
                }
                return this._binding("bind"), !1
            },
            _showdonemsg: function() {
                var n = this.options;
                if (!!n.behavior && this["_showdonemsg_" + n.behavior] !== i) {
                    this["_showdonemsg_" + n.behavior].call(this);
                    return
                }
                n.loading.msg.find("img").hide().parent().find("div").html(n.loading.finishedMsg).animate({
                    opacity: 1
                }, 2e3, function() {
                    t(this).parent().fadeOut(n.loading.speed)
                });
                n.errorCallback.call(t(n.contentSelector)[0], "done")
            },
            _validate: function(n) {
                for (var i in n)
                    if (i.indexOf && i.indexOf("Selector") > -1 && t(n[i]).length === 0) return this._debug("Your " + i + " found no elements."), !1;
                return !0
            },
            bind: function() {
                this._binding("bind")
            },
            destroy: function() {
                return this.options.state.isDestroyed = !0, this.options.loading.finished(), this._error("destroy")
            },
            pause: function() {
                this._pausing("pause")
            },
            resume: function() {
                this._pausing("resume")
            },
            beginAjax: function(n) {
                var r = this,
                    s = n.path,
                    f, u, e, o;
                if (n.state.currPage++, n.maxPage != i && n.state.currPage > n.maxPage) {
                    n.state.isBeyondMaxPage = !0;
                    this.destroy();
                    return
                }
                f = t(n.contentSelector).is("table, tbody") ? t("<tbody/>") : t("<div/>");
                u = typeof s == "function" ? s(n.state.currPage) : s.join(n.state.currPage);
                r._debug("heading into ajax", u);
                e = n.dataType === "html" || n.dataType === "json" ? n.dataType : "html+callback";
                n.appendCallback && n.dataType === "html" && (e += "+callback");
                switch (e) {
                    case "html+callback":
                        r._debug("Using HTML via .load() method");
                        f.load(u + " " + n.itemSelector, i, function(n) {
                            r._loadcallback(f, n, u)
                        });
                        break;
                    case "html":
                        r._debug("Using " + e.toUpperCase() + " via $.ajax() method");
                        t.ajax({
                            url: u,
                            dataType: n.dataType,
                            complete: function(n, t) {
                                o = typeof n.isResolved != "undefined" ? n.isResolved() : t === "success" || t === "notmodified";
                                o ? r._loadcallback(f, n.responseText, u) : r._error("end")
                            }
                        });
                        break;
                    case "json":
                        r._debug("Using " + e.toUpperCase() + " via $.ajax() method");
                        t.ajax({
                            dataType: "json",
                            type: "GET",
                            url: u,
                            success: function(t, e, s) {
                                if (o = typeof s.isResolved != "undefined" ? s.isResolved() : e === "success" || e === "notmodified", n.appendCallback)
                                    if (n.template !== i) {
                                        var h = n.template(t);
                                        f.append(h);
                                        o ? r._loadcallback(f, h) : r._error("end")
                                    } else r._debug("template must be defined."), r._error("end");
                                else o ? r._loadcallback(f, t, u) : r._error("end")
                            },
                            error: function() {
                                r._debug("JSON ajax request failed.");
                                r._error("end")
                            }
                        })
                }
            },
            retrieve: function(n) {
                n = n || null;
                var u = this,
                    r = u.options;
                if (!!r.behavior && this["retrieve_" + r.behavior] !== i) {
                    this["retrieve_" + r.behavior].call(this, n);
                    return
                }
                if (r.state.isDestroyed) return this._debug("Instance is destroyed"), !1;
                r.state.isDuringAjax = !0;
                r.loading.start.call(t(r.contentSelector)[0], r)
            },
            scroll: function() {
                var t = this.options,
                    n = t.state;
                if (!!t.behavior && this["scroll_" + t.behavior] !== i) {
                    this["scroll_" + t.behavior].call(this);
                    return
                }
                n.isDuringAjax || n.isInvalidPage || n.isDone || n.isDestroyed || n.isPaused || this._nearbottom() && this.retrieve()
            },
            toggle: function() {
                this._pausing()
            },
            unbind: function() {
                this._binding("unbind")
            },
            update: function(n) {
                t.isPlainObject(n) && (this.options = t.extend(!0, this.options, n))
            }
        };
        t.fn.infinitescroll = function(n, i) {
            var u = typeof n,
                r;
            switch (u) {
                case "string":
                    r = Array.prototype.slice.call(arguments, 1);
                    this.each(function() {
                        var i = t.data(this, "infinitescroll");
                        if (!i || !t.isFunction(i[n]) || n.charAt(0) === "_") return !1;
                        i[n].apply(i, r)
                    });
                    break;
                case "object":
                    this.each(function() {
                        var r = t.data(this, "infinitescroll");
                        r ? r.update(n) : (r = new t.infinitescroll(n, i, this), r.failed || t.data(this, "infinitescroll", r))
                    })
            }
            return this
        };
        var r = t.event,
            u;
        r.special.smartscroll = {
            setup: function() {
                t(this).bind("scroll", r.special.smartscroll.handler)
            },
            teardown: function() {
                t(this).unbind("scroll", r.special.smartscroll.handler)
            },
            handler: function(n, i) {
                var r = this,
                    f = arguments;
                n.type = "smartscroll";
                u && clearTimeout(u);
                u = setTimeout(function() {
                    t(r).trigger("smartscroll", f)
                }, i === "execAsap" ? 0 : 100)
            }
        };
        t.fn.smartscroll = function(n) {
            return n ? this.bind("smartscroll", n) : this.trigger("smartscroll", ["execAsap"])
        }
    }(window, jQuery), function(n, t) {
        function i(t, i) {
            var u, f, e, o = t.nodeName.toLowerCase();
            return "area" === o ? (u = t.parentNode, f = u.name, t.href && f && "map" === u.nodeName.toLowerCase() ? (e = n("img[usemap=#" + f + "]")[0], !!e && r(e)) : !1) : (/input|select|textarea|button|object/.test(o) ? !t.disabled : "a" === o ? t.href || i : i) && r(t)
        }

        function r(t) {
            return n.expr.filters.visible(t) && !n(t).parents().addBack().filter(function() {
                return "hidden" === n.css(this, "visibility")
            }).length
        }
        var u = 0,
            f = /^ui-id-\d+$/;
        n.ui = n.ui || {};
        n.extend(n.ui, {
            version: "1.10.3",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        });
        n.fn.extend({
            focus: function(t) {
                return function(i, r) {
                    return "number" == typeof i ? this.each(function() {
                        var t = this;
                        setTimeout(function() {
                            n(t).focus();
                            r && r.call(t)
                        }, i)
                    }) : t.apply(this, arguments)
                }
            }(n.fn.focus),
            scrollParent: function() {
                var t;
                return t = n.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                    return /(relative|absolute|fixed)/.test(n.css(this, "position")) && /(auto|scroll)/.test(n.css(this, "overflow") + n.css(this, "overflow-y") + n.css(this, "overflow-x"))
                }).eq(0) : this.parents().filter(function() {
                    return /(auto|scroll)/.test(n.css(this, "overflow") + n.css(this, "overflow-y") + n.css(this, "overflow-x"))
                }).eq(0), /fixed/.test(this.css("position")) || !t.length ? n(document) : t
            },
            zIndex: function(i) {
                if (i !== t) return this.css("zIndex", i);
                if (this.length)
                    for (var u, f, r = n(this[0]); r.length && r[0] !== document;) {
                        if (u = r.css("position"), ("absolute" === u || "relative" === u || "fixed" === u) && (f = parseInt(r.css("zIndex"), 10), !isNaN(f) && 0 !== f)) return f;
                        r = r.parent()
                    }
                return 0
            },
            uniqueId: function() {
                return this.each(function() {
                    this.id || (this.id = "ui-id-" + ++u)
                })
            },
            removeUniqueId: function() {
                return this.each(function() {
                    f.test(this.id) && n(this).removeAttr("id")
                })
            }
        });
        n.extend(n.expr[":"], {
            data: n.expr.createPseudo ? n.expr.createPseudo(function(t) {
                return function(i) {
                    return !!n.data(i, t)
                }
            }) : function(t, i, r) {
                return !!n.data(t, r[3])
            },
            focusable: function(t) {
                return i(t, !isNaN(n.attr(t, "tabindex")))
            },
            tabbable: function(t) {
                var r = n.attr(t, "tabindex"),
                    u = isNaN(r);
                return (u || r >= 0) && i(t, !u)
            }
        });
        n("<a>").outerWidth(1).jquery || n.each(["Width", "Height"], function(i, r) {
            function u(t, i, r, u) {
                return n.each(o, function() {
                    i -= parseFloat(n.css(t, "padding" + this)) || 0;
                    r && (i -= parseFloat(n.css(t, "border" + this + "Width")) || 0);
                    u && (i -= parseFloat(n.css(t, "margin" + this)) || 0)
                }), i
            }
            var o = "Width" === r ? ["Left", "Right"] : ["Top", "Bottom"],
                f = r.toLowerCase(),
                e = {
                    innerWidth: n.fn.innerWidth,
                    innerHeight: n.fn.innerHeight,
                    outerWidth: n.fn.outerWidth,
                    outerHeight: n.fn.outerHeight
                };
            n.fn["inner" + r] = function(i) {
                return i === t ? e["inner" + r].call(this) : this.each(function() {
                    n(this).css(f, u(this, i) + "px")
                })
            };
            n.fn["outer" + r] = function(t, i) {
                return "number" != typeof t ? e["outer" + r].call(this, t) : this.each(function() {
                    n(this).css(f, u(this, t, !0, i) + "px")
                })
            }
        });
        n.fn.addBack || (n.fn.addBack = function(n) {
            return this.add(null == n ? this.prevObject : this.prevObject.filter(n))
        });
        n("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (n.fn.removeData = function(t) {
            return function(i) {
                return arguments.length ? t.call(this, n.camelCase(i)) : t.call(this)
            }
        }(n.fn.removeData));
        n.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
        n.support.selectstart = "onselectstart" in document.createElement("div");
        n.fn.extend({
            disableSelection: function() {
                return this.bind((n.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(n) {
                    n.preventDefault()
                })
            },
            enableSelection: function() {
                return this.unbind(".ui-disableSelection")
            }
        });
        n.extend(n.ui, {
            plugin: {
                add: function(t, i, r) {
                    var u, f = n.ui[t].prototype;
                    for (u in r) f.plugins[u] = f.plugins[u] || [], f.plugins[u].push([i, r[u]])
                },
                call: function(n, t, i) {
                    var r, u = n.plugins[t];
                    if (u && n.element[0].parentNode && 11 !== n.element[0].parentNode.nodeType)
                        for (r = 0; u.length > r; r++) n.options[u[r][0]] && u[r][1].apply(n.element, i)
                }
            },
            hasScroll: function(t, i) {
                if ("hidden" === n(t).css("overflow")) return !1;
                var r = i && "left" === i ? "scrollLeft" : "scrollTop",
                    u = !1;
                return t[r] > 0 ? !0 : (t[r] = 1, u = t[r] > 0, t[r] = 0, u)
            }
        })
    }(jQuery), function(n, t) {
        var r = 0,
            i = Array.prototype.slice,
            u = n.cleanData;
        n.cleanData = function(t) {
            for (var i, r = 0; null != (i = t[r]); r++) try {
                n(i).triggerHandler("remove")
            } catch (f) {}
            u(t)
        };
        n.widget = function(i, r, u) {
            var h, e, f, s, c = {},
                o = i.split(".")[0];
            i = i.split(".")[1];
            h = o + "-" + i;
            u || (u = r, r = n.Widget);
            n.expr[":"][h.toLowerCase()] = function(t) {
                return !!n.data(t, h)
            };
            n[o] = n[o] || {};
            e = n[o][i];
            f = n[o][i] = function(n, i) {
                return this._createWidget ? (arguments.length && this._createWidget(n, i), t) : new f(n, i)
            };
            n.extend(f, e, {
                version: u.version,
                _proto: n.extend({}, u),
                _childConstructors: []
            });
            s = new r;
            s.options = n.widget.extend({}, s.options);
            n.each(u, function(i, u) {
                return n.isFunction(u) ? (c[i] = function() {
                    var n = function() {
                            return r.prototype[i].apply(this, arguments)
                        },
                        t = function(n) {
                            return r.prototype[i].apply(this, n)
                        };
                    return function() {
                        var i, r = this._super,
                            f = this._superApply;
                        return this._super = n, this._superApply = t, i = u.apply(this, arguments), this._super = r, this._superApply = f, i
                    }
                }(), t) : (c[i] = u, t)
            });
            f.prototype = n.widget.extend(s, {
                widgetEventPrefix: e ? s.widgetEventPrefix : i
            }, c, {
                constructor: f,
                namespace: o,
                widgetName: i,
                widgetFullName: h
            });
            e ? (n.each(e._childConstructors, function(t, i) {
                var r = i.prototype;
                n.widget(r.namespace + "." + r.widgetName, f, i._proto)
            }), delete e._childConstructors) : r._childConstructors.push(f);
            n.widget.bridge(i, f)
        };
        n.widget.extend = function(r) {
            for (var u, f, o = i.call(arguments, 1), e = 0, s = o.length; s > e; e++)
                for (u in o[e]) f = o[e][u], o[e].hasOwnProperty(u) && f !== t && (r[u] = n.isPlainObject(f) ? n.isPlainObject(r[u]) ? n.widget.extend({}, r[u], f) : n.widget.extend({}, f) : f);
            return r
        };
        n.widget.bridge = function(r, u) {
            var f = u.prototype.widgetFullName || r;
            n.fn[r] = function(e) {
                var h = "string" == typeof e,
                    o = i.call(arguments, 1),
                    s = this;
                return e = !h && o.length ? n.widget.extend.apply(null, [e].concat(o)) : e, h ? this.each(function() {
                    var i, u = n.data(this, f);
                    return u ? n.isFunction(u[e]) && "_" !== e.charAt(0) ? (i = u[e].apply(u, o), i !== u && i !== t ? (s = i && i.jquery ? s.pushStack(i.get()) : i, !1) : t) : n.error("no such method '" + e + "' for " + r + " widget instance") : n.error("cannot call methods on " + r + " prior to initialization; attempted to call method '" + e + "'")
                }) : this.each(function() {
                    var t = n.data(this, f);
                    t ? t.option(e || {})._init() : n.data(this, f, new u(e, this))
                }), s
            }
        };
        n.Widget = function() {};
        n.Widget._childConstructors = [];
        n.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: !1,
                create: null
            },
            _createWidget: function(t, i) {
                i = n(i || this.defaultElement || this)[0];
                this.element = n(i);
                this.uuid = r++;
                this.eventNamespace = "." + this.widgetName + this.uuid;
                this.options = n.widget.extend({}, this.options, this._getCreateOptions(), t);
                this.bindings = n();
                this.hoverable = n();
                this.focusable = n();
                i !== this && (n.data(i, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function(n) {
                        n.target === i && this.destroy()
                    }
                }), this.document = n(i.style ? i.ownerDocument : i.document || i), this.window = n(this.document[0].defaultView || this.document[0].parentWindow));
                this._create();
                this._trigger("create", null, this._getCreateEventData());
                this._init()
            },
            _getCreateOptions: n.noop,
            _getCreateEventData: n.noop,
            _create: n.noop,
            _init: n.noop,
            destroy: function() {
                this._destroy();
                this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(n.camelCase(this.widgetFullName));
                this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled");
                this.bindings.unbind(this.eventNamespace);
                this.hoverable.removeClass("ui-state-hover");
                this.focusable.removeClass("ui-state-focus")
            },
            _destroy: n.noop,
            widget: function() {
                return this.element
            },
            option: function(i, r) {
                var u, f, e, o = i;
                if (0 === arguments.length) return n.widget.extend({}, this.options);
                if ("string" == typeof i)
                    if (o = {}, u = i.split("."), i = u.shift(), u.length) {
                        for (f = o[i] = n.widget.extend({}, this.options[i]), e = 0; u.length - 1 > e; e++) f[u[e]] = f[u[e]] || {}, f = f[u[e]];
                        if (i = u.pop(), r === t) return f[i] === t ? null : f[i];
                        f[i] = r
                    } else {
                        if (r === t) return this.options[i] === t ? null : this.options[i];
                        o[i] = r
                    }
                return this._setOptions(o), this
            },
            _setOptions: function(n) {
                for (var t in n) this._setOption(t, n[t]);
                return this
            },
            _setOption: function(n, t) {
                return this.options[n] = t, "disabled" === n && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
            },
            enable: function() {
                return this._setOption("disabled", !1)
            },
            disable: function() {
                return this._setOption("disabled", !0)
            },
            _on: function(i, r, u) {
                var e, f = this;
                "boolean" != typeof i && (u = r, r = i, i = !1);
                u ? (r = e = n(r), this.bindings = this.bindings.add(r)) : (u = r, r = this.element, e = this.widget());
                n.each(u, function(u, o) {
                    function s() {
                        return i || f.options.disabled !== !0 && !n(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? f[o] : o).apply(f, arguments) : t
                    }
                    "string" != typeof o && (s.guid = o.guid = o.guid || s.guid || n.guid++);
                    var h = u.match(/^(\w+)\s*(.*)$/),
                        c = h[1] + f.eventNamespace,
                        l = h[2];
                    l ? e.delegate(l, c, s) : r.bind(c, s)
                })
            },
            _off: function(n, t) {
                t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
                n.unbind(t).undelegate(t)
            },
            _delay: function(n, t) {
                function r() {
                    return ("string" == typeof n ? i[n] : n).apply(i, arguments)
                }
                var i = this;
                return setTimeout(r, t || 0)
            },
            _hoverable: function(t) {
                this.hoverable = this.hoverable.add(t);
                this._on(t, {
                    mouseenter: function(t) {
                        n(t.currentTarget).addClass("ui-state-hover")
                    },
                    mouseleave: function(t) {
                        n(t.currentTarget).removeClass("ui-state-hover")
                    }
                })
            },
            _focusable: function(t) {
                this.focusable = this.focusable.add(t);
                this._on(t, {
                    focusin: function(t) {
                        n(t.currentTarget).addClass("ui-state-focus")
                    },
                    focusout: function(t) {
                        n(t.currentTarget).removeClass("ui-state-focus")
                    }
                })
            },
            _trigger: function(t, i, r) {
                var u, f, e = this.options[t];
                if (r = r || {}, i = n.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], f = i.originalEvent)
                    for (u in f) u in i || (i[u] = f[u]);
                return this.element.trigger(i, r), !(n.isFunction(e) && e.apply(this.element[0], [i].concat(r)) === !1 || i.isDefaultPrevented())
            }
        };
        n.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function(t, i) {
            n.Widget.prototype["_" + t] = function(r, u, f) {
                "string" == typeof u && (u = {
                    effect: u
                });
                var o, e = u ? u === !0 || "number" == typeof u ? i : u.effect || i : t;
                u = u || {};
                "number" == typeof u && (u = {
                    duration: u
                });
                o = !n.isEmptyObject(u);
                u.complete = f;
                u.delay && r.delay(u.delay);
                o && n.effects && n.effects.effect[e] ? r[t](u) : e !== t && r[e] ? r[e](u.duration, u.easing, f) : r.queue(function(i) {
                    n(this)[t]();
                    f && f.call(r[0]);
                    i()
                })
            }
        })
    }(jQuery), function(n) {
        var t = !1;
        n(document).mouseup(function() {
            t = !1
        });
        n.widget("ui.mouse", {
            version: "1.10.3",
            options: {
                cancel: "input,textarea,button,select,option",
                distance: 1,
                delay: 0
            },
            _mouseInit: function() {
                var t = this;
                this.element.bind("mousedown." + this.widgetName, function(n) {
                    return t._mouseDown(n)
                }).bind("click." + this.widgetName, function(i) {
                    return !0 === n.data(i.target, t.widgetName + ".preventClickEvent") ? (n.removeData(i.target, t.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : undefined
                });
                this.started = !1
            },
            _mouseDestroy: function() {
                this.element.unbind("." + this.widgetName);
                this._mouseMoveDelegate && n(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
            },
            _mouseDown: function(i) {
                if (!t) {
                    this._mouseStarted && this._mouseUp(i);
                    this._mouseDownEvent = i;
                    var r = this,
                        u = 1 === i.which,
                        f = "string" == typeof this.options.cancel && i.target.nodeName ? n(i.target).closest(this.options.cancel).length : !1;
                    return u && !f && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                        r.mouseDelayMet = !0
                    }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === n.data(i.target, this.widgetName + ".preventClickEvent") && n.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(n) {
                        return r._mouseMove(n)
                    }, this._mouseUpDelegate = function(n) {
                        return r._mouseUp(n)
                    }, n(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), t = !0, !0)) : !0
                }
            },
            _mouseMove: function(t) {
                return n.ui.ie && (!document.documentMode || 9 > document.documentMode) && !t.button ? this._mouseUp(t) : this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted)
            },
            _mouseUp: function(t) {
                return n(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && n.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), !1
            },
            _mouseDistanceMet: function(n) {
                return Math.max(Math.abs(this._mouseDownEvent.pageX - n.pageX), Math.abs(this._mouseDownEvent.pageY - n.pageY)) >= this.options.distance
            },
            _mouseDelayMet: function() {
                return this.mouseDelayMet
            },
            _mouseStart: function() {},
            _mouseDrag: function() {},
            _mouseStop: function() {},
            _mouseCapture: function() {
                return !0
            }
        })
    }(jQuery), function(n, t) {
        function e(n, t, i) {
            return [parseFloat(n[0]) * (a.test(n[0]) ? t / 100 : 1), parseFloat(n[1]) * (a.test(n[1]) ? i / 100 : 1)]
        }

        function r(t, i) {
            return parseInt(n.css(t, i), 10) || 0
        }

        function v(t) {
            var i = t[0];
            return 9 === i.nodeType ? {
                width: t.width(),
                height: t.height(),
                offset: {
                    top: 0,
                    left: 0
                }
            } : n.isWindow(i) ? {
                width: t.width(),
                height: t.height(),
                offset: {
                    top: t.scrollTop(),
                    left: t.scrollLeft()
                }
            } : i.preventDefault ? {
                width: 0,
                height: 0,
                offset: {
                    top: i.pageY,
                    left: i.pageX
                }
            } : {
                width: t.outerWidth(),
                height: t.outerHeight(),
                offset: t.offset()
            }
        }
        n.ui = n.ui || {};
        var f, u = Math.max,
            i = Math.abs,
            o = Math.round,
            s = /left|center|right/,
            h = /top|center|bottom/,
            c = /[\+\-]\d+(\.[\d]+)?%?/,
            l = /^\w+/,
            a = /%$/,
            y = n.fn.position;
        n.position = {
            scrollbarWidth: function() {
                if (f !== t) return f;
                var u, r, i = n("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'><\/div><\/div>"),
                    e = i.children()[0];
                return n("body").append(i), u = e.offsetWidth, i.css("overflow", "scroll"), r = e.offsetWidth, u === r && (r = i[0].clientWidth), i.remove(), f = u - r
            },
            getScrollInfo: function(t) {
                var i = t.isWindow ? "" : t.element.css("overflow-x"),
                    r = t.isWindow ? "" : t.element.css("overflow-y"),
                    u = "scroll" === i || "auto" === i && t.width < t.element[0].scrollWidth,
                    f = "scroll" === r || "auto" === r && t.height < t.element[0].scrollHeight;
                return {
                    width: f ? n.position.scrollbarWidth() : 0,
                    height: u ? n.position.scrollbarWidth() : 0
                }
            },
            getWithinInfo: function(t) {
                var i = n(t || window),
                    r = n.isWindow(i[0]);
                return {
                    element: i,
                    isWindow: r,
                    offset: i.offset() || {
                        left: 0,
                        top: 0
                    },
                    scrollLeft: i.scrollLeft(),
                    scrollTop: i.scrollTop(),
                    width: r ? i.width() : i.outerWidth(),
                    height: r ? i.height() : i.outerHeight()
                }
            }
        };
        n.fn.position = function(t) {
            if (!t || !t.of) return y.apply(this, arguments);
            t = n.extend({}, t);
            var b, f, a, w, p, d, g = n(t.of),
                tt = n.position.getWithinInfo(t.within),
                it = n.position.getScrollInfo(tt),
                k = (t.collision || "flip").split(" "),
                nt = {};
            return d = v(g), g[0].preventDefault && (t.at = "left top"), f = d.width, a = d.height, w = d.offset, p = n.extend({}, w), n.each(["my", "at"], function() {
                var i, r, n = (t[this] || "").split(" ");
                1 === n.length && (n = s.test(n[0]) ? n.concat(["center"]) : h.test(n[0]) ? ["center"].concat(n) : ["center", "center"]);
                n[0] = s.test(n[0]) ? n[0] : "center";
                n[1] = h.test(n[1]) ? n[1] : "center";
                i = c.exec(n[0]);
                r = c.exec(n[1]);
                nt[this] = [i ? i[0] : 0, r ? r[0] : 0];
                t[this] = [l.exec(n[0])[0], l.exec(n[1])[0]]
            }), 1 === k.length && (k[1] = k[0]), "right" === t.at[0] ? p.left += f : "center" === t.at[0] && (p.left += f / 2), "bottom" === t.at[1] ? p.top += a : "center" === t.at[1] && (p.top += a / 2), b = e(nt.at, f, a), p.left += b[0], p.top += b[1], this.each(function() {
                var y, d, h = n(this),
                    c = h.outerWidth(),
                    l = h.outerHeight(),
                    rt = r(this, "marginLeft"),
                    ut = r(this, "marginTop"),
                    ft = c + rt + r(this, "marginRight") + it.width,
                    et = l + ut + r(this, "marginBottom") + it.height,
                    s = n.extend({}, p),
                    v = e(nt.my, h.outerWidth(), h.outerHeight());
                "right" === t.my[0] ? s.left -= c : "center" === t.my[0] && (s.left -= c / 2);
                "bottom" === t.my[1] ? s.top -= l : "center" === t.my[1] && (s.top -= l / 2);
                s.left += v[0];
                s.top += v[1];
                n.support.offsetFractions || (s.left = o(s.left), s.top = o(s.top));
                y = {
                    marginLeft: rt,
                    marginTop: ut
                };
                n.each(["left", "top"], function(i, r) {
                    n.ui.position[k[i]] && n.ui.position[k[i]][r](s, {
                        targetWidth: f,
                        targetHeight: a,
                        elemWidth: c,
                        elemHeight: l,
                        collisionPosition: y,
                        collisionWidth: ft,
                        collisionHeight: et,
                        offset: [b[0] + v[0], b[1] + v[1]],
                        my: t.my,
                        at: t.at,
                        within: tt,
                        elem: h
                    })
                });
                t.using && (d = function(n) {
                    var r = w.left - s.left,
                        v = r + f - c,
                        e = w.top - s.top,
                        y = e + a - l,
                        o = {
                            target: {
                                element: g,
                                left: w.left,
                                top: w.top,
                                width: f,
                                height: a
                            },
                            element: {
                                element: h,
                                left: s.left,
                                top: s.top,
                                width: c,
                                height: l
                            },
                            horizontal: 0 > v ? "left" : r > 0 ? "right" : "center",
                            vertical: 0 > y ? "top" : e > 0 ? "bottom" : "middle"
                        };
                    c > f && f > i(r + v) && (o.horizontal = "center");
                    l > a && a > i(e + y) && (o.vertical = "middle");
                    o.important = u(i(r), i(v)) > u(i(e), i(y)) ? "horizontal" : "vertical";
                    t.using.call(this, n, o)
                });
                h.offset(n.extend(s, {
                    using: d
                }))
            })
        };
        n.ui.position = {
                fit: {
                    left: function(n, t) {
                        var h, e = t.within,
                            r = e.isWindow ? e.scrollLeft : e.offset.left,
                            o = e.width,
                            s = n.left - t.collisionPosition.marginLeft,
                            i = r - s,
                            f = s + t.collisionWidth - o - r;
                        t.collisionWidth > o ? i > 0 && 0 >= f ? (h = n.left + i + t.collisionWidth - o - r, n.left += i - h) : n.left = f > 0 && 0 >= i ? r : i > f ? r + o - t.collisionWidth : r : i > 0 ? n.left += i : f > 0 ? n.left -= f : n.left = u(n.left - s, n.left)
                    },
                    top: function(n, t) {
                        var h, o = t.within,
                            r = o.isWindow ? o.scrollTop : o.offset.top,
                            e = t.within.height,
                            s = n.top - t.collisionPosition.marginTop,
                            i = r - s,
                            f = s + t.collisionHeight - e - r;
                        t.collisionHeight > e ? i > 0 && 0 >= f ? (h = n.top + i + t.collisionHeight - e - r, n.top += i - h) : n.top = f > 0 && 0 >= i ? r : i > f ? r + e - t.collisionHeight : r : i > 0 ? n.top += i : f > 0 ? n.top -= f : n.top = u(n.top - s, n.top)
                    }
                },
                flip: {
                    left: function(n, t) {
                        var o, s, r = t.within,
                            y = r.offset.left + r.scrollLeft,
                            c = r.width,
                            h = r.isWindow ? r.scrollLeft : r.offset.left,
                            l = n.left - t.collisionPosition.marginLeft,
                            a = l - h,
                            v = l + t.collisionWidth - c - h,
                            u = "left" === t.my[0] ? -t.elemWidth : "right" === t.my[0] ? t.elemWidth : 0,
                            f = "left" === t.at[0] ? t.targetWidth : "right" === t.at[0] ? -t.targetWidth : 0,
                            e = -2 * t.offset[0];
                        0 > a ? (o = n.left + u + f + e + t.collisionWidth - c - y, (0 > o || i(a) > o) && (n.left += u + f + e)) : v > 0 && (s = n.left - t.collisionPosition.marginLeft + u + f + e - h, (s > 0 || v > i(s)) && (n.left += u + f + e))
                    },
                    top: function(n, t) {
                        var o, s, r = t.within,
                            y = r.offset.top + r.scrollTop,
                            a = r.height,
                            h = r.isWindow ? r.scrollTop : r.offset.top,
                            v = n.top - t.collisionPosition.marginTop,
                            c = v - h,
                            l = v + t.collisionHeight - a - h,
                            p = "top" === t.my[1],
                            u = p ? -t.elemHeight : "bottom" === t.my[1] ? t.elemHeight : 0,
                            f = "top" === t.at[1] ? t.targetHeight : "bottom" === t.at[1] ? -t.targetHeight : 0,
                            e = -2 * t.offset[1];
                        0 > c ? (s = n.top + u + f + e + t.collisionHeight - a - y, n.top + u + f + e > c && (0 > s || i(c) > s) && (n.top += u + f + e)) : l > 0 && (o = n.top - t.collisionPosition.marginTop + u + f + e - h, n.top + u + f + e > l && (o > 0 || l > i(o)) && (n.top += u + f + e))
                    }
                },
                flipfit: {
                    left: function() {
                        n.ui.position.flip.left.apply(this, arguments);
                        n.ui.position.fit.left.apply(this, arguments)
                    },
                    top: function() {
                        n.ui.position.flip.top.apply(this, arguments);
                        n.ui.position.fit.top.apply(this, arguments)
                    }
                }
            },
            function() {
                var t, i, r, u, f, e = document.getElementsByTagName("body")[0],
                    o = document.createElement("div");
                t = document.createElement(e ? "div" : "body");
                r = {
                    visibility: "hidden",
                    width: 0,
                    height: 0,
                    border: 0,
                    margin: 0,
                    background: "none"
                };
                e && n.extend(r, {
                    position: "absolute",
                    left: "-1000px",
                    top: "-1000px"
                });
                for (f in r) t.style[f] = r[f];
                t.appendChild(o);
                i = e || document.documentElement;
                i.insertBefore(t, i.firstChild);
                o.style.cssText = "position: absolute; left: 10.7432222px;";
                u = n(o).offset().left;
                n.support.offsetFractions = u > 10 && 11 > u;
                t.innerHTML = "";
                i.removeChild(t)
            }()
    }(jQuery), function(n, t) {
        function u() {
            return ++f
        }

        function i(n) {
            return n.hash.length > 1 && decodeURIComponent(n.href.replace(r, "")) === decodeURIComponent(location.href.replace(r, ""))
        }
        var f = 0,
            r = /#.*$/;
        n.widget("ui.tabs", {
            version: "1.10.3",
            delay: 300,
            options: {
                active: null,
                collapsible: !1,
                event: "click",
                heightStyle: "content",
                hide: null,
                show: null,
                activate: null,
                beforeActivate: null,
                beforeLoad: null,
                load: null
            },
            _create: function() {
                var i = this,
                    t = this.options;
                this.running = !1;
                this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", t.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(t) {
                    n(this).is(".ui-state-disabled") && t.preventDefault()
                }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
                    n(this).closest("li").is(".ui-state-disabled") && this.blur()
                });
                this._processTabs();
                t.active = this._initialActive();
                n.isArray(t.disabled) && (t.disabled = n.unique(t.disabled.concat(n.map(this.tabs.filter(".ui-state-disabled"), function(n) {
                    return i.tabs.index(n)
                }))).sort());
                this.active = this.options.active !== !1 && this.anchors.length ? this._findActive(t.active) : n();
                this._refresh();
                this.active.length && this.load(t.active)
            },
            _initialActive: function() {
                var i = this.options.active,
                    r = this.options.collapsible,
                    u = location.hash.substring(1);
                return null === i && (u && this.tabs.each(function(r, f) {
                    return n(f).attr("aria-controls") === u ? (i = r, !1) : t
                }), null === i && (i = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), (null === i || -1 === i) && (i = this.tabs.length ? 0 : !1)), i !== !1 && (i = this.tabs.index(this.tabs.eq(i)), -1 === i && (i = r ? !1 : 0)), !r && i === !1 && this.anchors.length && (i = 0), i
            },
            _getCreateEventData: function() {
                return {
                    tab: this.active,
                    panel: this.active.length ? this._getPanelForTab(this.active) : n()
                }
            },
            _tabKeydown: function(i) {
                var u = n(this.document[0].activeElement).closest("li"),
                    r = this.tabs.index(u),
                    f = !0;
                if (!this._handlePageNav(i)) {
                    switch (i.keyCode) {
                        case n.ui.keyCode.RIGHT:
                        case n.ui.keyCode.DOWN:
                            r++;
                            break;
                        case n.ui.keyCode.UP:
                        case n.ui.keyCode.LEFT:
                            f = !1;
                            r--;
                            break;
                        case n.ui.keyCode.END:
                            r = this.anchors.length - 1;
                            break;
                        case n.ui.keyCode.HOME:
                            r = 0;
                            break;
                        case n.ui.keyCode.SPACE:
                            return i.preventDefault(), clearTimeout(this.activating), this._activate(r), t;
                        case n.ui.keyCode.ENTER:
                            return i.preventDefault(), clearTimeout(this.activating), this._activate(r === this.options.active ? !1 : r), t;
                        default:
                            return
                    }
                    i.preventDefault();
                    clearTimeout(this.activating);
                    r = this._focusNextTab(r, f);
                    i.ctrlKey || (u.attr("aria-selected", "false"), this.tabs.eq(r).attr("aria-selected", "true"), this.activating = this._delay(function() {
                        this.option("active", r)
                    }, this.delay))
                }
            },
            _panelKeydown: function(t) {
                this._handlePageNav(t) || t.ctrlKey && t.keyCode === n.ui.keyCode.UP && (t.preventDefault(), this.active.focus())
            },
            _handlePageNav: function(i) {
                return i.altKey && i.keyCode === n.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0) : i.altKey && i.keyCode === n.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0) : t
            },
            _findNextTab: function(t, i) {
                function u() {
                    return t > r && (t = 0), 0 > t && (t = r), t
                }
                for (var r = this.tabs.length - 1; - 1 !== n.inArray(u(), this.options.disabled);) t = i ? t + 1 : t - 1;
                return t
            },
            _focusNextTab: function(n, t) {
                return n = this._findNextTab(n, t), this.tabs.eq(n).focus(), n
            },
            _setOption: function(n, i) {
                return "active" === n ? (this._activate(i), t) : "disabled" === n ? (this._setupDisabled(i), t) : (this._super(n, i), "collapsible" === n && (this.element.toggleClass("ui-tabs-collapsible", i), i || this.options.active !== !1 || this._activate(0)), "event" === n && this._setupEvents(i), "heightStyle" === n && this._setupHeightStyle(i), t)
            },
            _tabId: function(n) {
                return n.attr("aria-controls") || "ui-tabs-" + u()
            },
            _sanitizeSelector: function(n) {
                return n ? n.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : ""
            },
            refresh: function() {
                var t = this.options,
                    i = this.tablist.children(":has(a[href])");
                t.disabled = n.map(i.filter(".ui-state-disabled"), function(n) {
                    return i.index(n)
                });
                this._processTabs();
                t.active !== !1 && this.anchors.length ? this.active.length && !n.contains(this.tablist[0], this.active[0]) ? this.tabs.length === t.disabled.length ? (t.active = !1, this.active = n()) : this._activate(this._findNextTab(Math.max(0, t.active - 1), !1)) : t.active = this.tabs.index(this.active) : (t.active = !1, this.active = n());
                this._refresh()
            },
            _refresh: function() {
                this._setupDisabled(this.options.disabled);
                this._setupEvents(this.options.event);
                this._setupHeightStyle(this.options.heightStyle);
                this.tabs.not(this.active).attr({
                    "aria-selected": "false",
                    tabIndex: -1
                });
                this.panels.not(this._getPanelForTab(this.active)).hide().attr({
                    "aria-expanded": "false",
                    "aria-hidden": "true"
                });
                this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                    "aria-selected": "true",
                    tabIndex: 0
                }), this._getPanelForTab(this.active).show().attr({
                    "aria-expanded": "true",
                    "aria-hidden": "false"
                })) : this.tabs.eq(0).attr("tabIndex", 0)
            },
            _processTabs: function() {
                var t = this;
                this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist");
                this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
                    role: "tab",
                    tabIndex: -1
                });
                this.anchors = this.tabs.map(function() {
                    return n("a", this)[0]
                }).addClass("ui-tabs-anchor").attr({
                    role: "presentation",
                    tabIndex: -1
                });
                this.panels = n();
                this.anchors.each(function(r, u) {
                    var e, f, s, h = n(u).uniqueId().attr("id"),
                        o = n(u).closest("li"),
                        c = o.attr("aria-controls");
                    i(u) ? (e = u.hash, f = t.element.find(t._sanitizeSelector(e))) : (s = t._tabId(o), e = "#" + s, f = t.element.find(e), f.length || (f = t._createPanel(s), f.insertAfter(t.panels[r - 1] || t.tablist)), f.attr("aria-live", "polite"));
                    f.length && (t.panels = t.panels.add(f));
                    c && o.data("ui-tabs-aria-controls", c);
                    o.attr({
                        "aria-controls": e.substring(1),
                        "aria-labelledby": h
                    });
                    f.attr("aria-labelledby", h)
                });
                this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel")
            },
            _getList: function() {
                return this.element.find("ol,ul").eq(0)
            },
            _createPanel: function(t) {
                return n("<div>").attr("id", t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
            },
            _setupDisabled: function(t) {
                n.isArray(t) && (t.length ? t.length === this.anchors.length && (t = !0) : t = !1);
                for (var i, r = 0; i = this.tabs[r]; r++) t === !0 || -1 !== n.inArray(r, t) ? n(i).addClass("ui-state-disabled").attr("aria-disabled", "true") : n(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");
                this.options.disabled = t
            },
            _setupEvents: function(t) {
                var i = {
                    click: function(n) {
                        n.preventDefault()
                    }
                };
                t && n.each(t.split(" "), function(n, t) {
                    i[t] = "_eventHandler"
                });
                this._off(this.anchors.add(this.tabs).add(this.panels));
                this._on(this.anchors, i);
                this._on(this.tabs, {
                    keydown: "_tabKeydown"
                });
                this._on(this.panels, {
                    keydown: "_panelKeydown"
                });
                this._focusable(this.tabs);
                this._hoverable(this.tabs)
            },
            _setupHeightStyle: function(t) {
                var i, r = this.element.parent();
                "fill" === t ? (i = r.height(), i -= this.element.outerHeight() - this.element.height(), this.element.siblings(":visible").each(function() {
                    var t = n(this),
                        r = t.css("position");
                    "absolute" !== r && "fixed" !== r && (i -= t.outerHeight(!0))
                }), this.element.children().not(this.panels).each(function() {
                    i -= n(this).outerHeight(!0)
                }), this.panels.each(function() {
                    n(this).height(Math.max(0, i - n(this).innerHeight() + n(this).height()))
                }).css("overflow", "auto")) : "auto" === t && (i = 0, this.panels.each(function() {
                    i = Math.max(i, n(this).height("").height())
                }).height(i))
            },
            _eventHandler: function(t) {
                var u = this.options,
                    r = this.active,
                    c = n(t.currentTarget),
                    i = c.closest("li"),
                    f = i[0] === r[0],
                    e = f && u.collapsible,
                    o = e ? n() : this._getPanelForTab(i),
                    s = r.length ? this._getPanelForTab(r) : n(),
                    h = {
                        oldTab: r,
                        oldPanel: s,
                        newTab: e ? n() : i,
                        newPanel: o
                    };
                t.preventDefault();
                i.hasClass("ui-state-disabled") || i.hasClass("ui-tabs-loading") || this.running || f && !u.collapsible || this._trigger("beforeActivate", t, h) === !1 || (u.active = e ? !1 : this.tabs.index(i), this.active = f ? n() : i, this.xhr && this.xhr.abort(), s.length || o.length || n.error("jQuery UI Tabs: Mismatching fragment identifier."), o.length && this.load(this.tabs.index(i), t), this._toggle(t, h))
            },
            _toggle: function(t, i) {
                function e() {
                    u.running = !1;
                    u._trigger("activate", t, i)
                }

                function o() {
                    i.newTab.closest("li").addClass("ui-tabs-active ui-state-active");
                    r.length && u.options.show ? u._show(r, u.options.show, e) : (r.show(), e())
                }
                var u = this,
                    r = i.newPanel,
                    f = i.oldPanel;
                this.running = !0;
                f.length && this.options.hide ? this._hide(f, this.options.hide, function() {
                    i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
                    o()
                }) : (i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), f.hide(), o());
                f.attr({
                    "aria-expanded": "false",
                    "aria-hidden": "true"
                });
                i.oldTab.attr("aria-selected", "false");
                r.length && f.length ? i.oldTab.attr("tabIndex", -1) : r.length && this.tabs.filter(function() {
                    return 0 === n(this).attr("tabIndex")
                }).attr("tabIndex", -1);
                r.attr({
                    "aria-expanded": "true",
                    "aria-hidden": "false"
                });
                i.newTab.attr({
                    "aria-selected": "true",
                    tabIndex: 0
                })
            },
            _activate: function(t) {
                var r, i = this._findActive(t);
                i[0] !== this.active[0] && (i.length || (i = this.active), r = i.find(".ui-tabs-anchor")[0], this._eventHandler({
                    target: r,
                    currentTarget: r,
                    preventDefault: n.noop
                }))
            },
            _findActive: function(t) {
                return t === !1 ? n() : this.tabs.eq(t)
            },
            _getIndex: function(n) {
                return "string" == typeof n && (n = this.anchors.index(this.anchors.filter("[href$='" + n + "']"))), n
            },
            _destroy: function() {
                this.xhr && this.xhr.abort();
                this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");
                this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");
                this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();
                this.tabs.add(this.panels).each(function() {
                    n.data(this, "ui-tabs-destroy") ? n(this).remove() : n(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")
                });
                this.tabs.each(function() {
                    var t = n(this),
                        i = t.data("ui-tabs-aria-controls");
                    i ? t.attr("aria-controls", i).removeData("ui-tabs-aria-controls") : t.removeAttr("aria-controls")
                });
                this.panels.show();
                "content" !== this.options.heightStyle && this.panels.css("height", "")
            },
            enable: function(i) {
                var r = this.options.disabled;
                r !== !1 && (i === t ? r = !1 : (i = this._getIndex(i), r = n.isArray(r) ? n.map(r, function(n) {
                    return n !== i ? n : null
                }) : n.map(this.tabs, function(n, t) {
                    return t !== i ? t : null
                })), this._setupDisabled(r))
            },
            disable: function(i) {
                var r = this.options.disabled;
                if (r !== !0) {
                    if (i === t) r = !0;
                    else {
                        if (i = this._getIndex(i), -1 !== n.inArray(i, r)) return;
                        r = n.isArray(r) ? n.merge([i], r).sort() : [i]
                    }
                    this._setupDisabled(r)
                }
            },
            load: function(t, r) {
                t = this._getIndex(t);
                var f = this,
                    u = this.tabs.eq(t),
                    o = u.find(".ui-tabs-anchor"),
                    e = this._getPanelForTab(u),
                    s = {
                        tab: u,
                        panel: e
                    };
                i(o[0]) || (this.xhr = n.ajax(this._ajaxSettings(o, r, s)), this.xhr && "canceled" !== this.xhr.statusText && (u.addClass("ui-tabs-loading"), e.attr("aria-busy", "true"), this.xhr.success(function(n) {
                    setTimeout(function() {
                        e.html(n);
                        f._trigger("load", r, s)
                    }, 1)
                }).complete(function(n, t) {
                    setTimeout(function() {
                        "abort" === t && f.panels.stop(!1, !0);
                        u.removeClass("ui-tabs-loading");
                        e.removeAttr("aria-busy");
                        n === f.xhr && delete f.xhr
                    }, 1)
                })))
            },
            _ajaxSettings: function(t, i, r) {
                var u = this;
                return {
                    url: t.attr("href"),
                    beforeSend: function(t, f) {
                        return u._trigger("beforeLoad", i, n.extend({
                            jqXHR: t,
                            ajaxSettings: f
                        }, r))
                    }
                }
            },
            _getPanelForTab: function(t) {
                var i = n(t).attr("aria-controls");
                return this.element.find(this._sanitizeSelector("#" + i))
            }
        })
    }(jQuery), function(n, t) {
        var i = "ui-effects-";
        n.effects = {
                effect: {}
            },
            function(n, t) {
                function f(n, t, i) {
                    var r = h[t.type] || {};
                    return null == n ? i || !t.def ? null : t.def : (n = r.floor ? ~~n : parseFloat(n), isNaN(n) ? t.def : r.mod ? (n + r.mod) % r.mod : 0 > n ? 0 : n > r.max ? r.max : n)
                }

                function s(f) {
                    var o = i(),
                        s = o._rgba = [];
                    return f = f.toLowerCase(), r(v, function(n, i) {
                        var r, h = i.re.exec(f),
                            c = h && i.parse(h),
                            e = i.space || "rgba";
                        return c ? (r = o[e](c), o[u[e].cache] = r[u[e].cache], s = o._rgba = r._rgba, !1) : t
                    }), s.length ? ("0,0,0,0" === s.join() && n.extend(s, e.transparent), o) : e[f]
                }

                function o(n, t, i) {
                    return i = (i + 1) % 1, 1 > 6 * i ? n + 6 * (t - n) * i : 1 > 2 * i ? t : 2 > 3 * i ? n + 6 * (t - n) * (2 / 3 - i) : n
                }
                var e, a = /^([\-+])=\s*(\d+\.?\d*)/,
                    v = [{
                        re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                        parse: function(n) {
                            return [n[1], n[2], n[3], n[4]]
                        }
                    }, {
                        re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                        parse: function(n) {
                            return [2.55 * n[1], 2.55 * n[2], 2.55 * n[3], n[4]]
                        }
                    }, {
                        re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                        parse: function(n) {
                            return [parseInt(n[1], 16), parseInt(n[2], 16), parseInt(n[3], 16)]
                        }
                    }, {
                        re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                        parse: function(n) {
                            return [parseInt(n[1] + n[1], 16), parseInt(n[2] + n[2], 16), parseInt(n[3] + n[3], 16)]
                        }
                    }, {
                        re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                        space: "hsla",
                        parse: function(n) {
                            return [n[1], n[2] / 100, n[3] / 100, n[4]]
                        }
                    }],
                    i = n.Color = function(t, i, r, u) {
                        return new n.Color.fn.parse(t, i, r, u)
                    },
                    u = {
                        rgba: {
                            props: {
                                red: {
                                    idx: 0,
                                    type: "byte"
                                },
                                green: {
                                    idx: 1,
                                    type: "byte"
                                },
                                blue: {
                                    idx: 2,
                                    type: "byte"
                                }
                            }
                        },
                        hsla: {
                            props: {
                                hue: {
                                    idx: 0,
                                    type: "degrees"
                                },
                                saturation: {
                                    idx: 1,
                                    type: "percent"
                                },
                                lightness: {
                                    idx: 2,
                                    type: "percent"
                                }
                            }
                        }
                    },
                    h = {
                        byte: {
                            floor: !0,
                            max: 255
                        },
                        percent: {
                            max: 1
                        },
                        degrees: {
                            mod: 360,
                            floor: !0
                        }
                    },
                    c = i.support = {},
                    l = n("<p>")[0],
                    r = n.each;
                l.style.cssText = "background-color:rgba(1,1,1,.5)";
                c.rgba = l.style.backgroundColor.indexOf("rgba") > -1;
                r(u, function(n, t) {
                    t.cache = "_" + n;
                    t.props.alpha = {
                        idx: 3,
                        type: "percent",
                        def: 1
                    }
                });
                i.fn = n.extend(i.prototype, {
                    parse: function(o, h, c, l) {
                        if (o === t) return this._rgba = [null, null, null, null], this;
                        (o.jquery || o.nodeType) && (o = n(o).css(h), h = t);
                        var a = this,
                            v = n.type(o),
                            y = this._rgba = [];
                        return h !== t && (o = [o, h, c, l], v = "array"), "string" === v ? this.parse(s(o) || e._default) : "array" === v ? (r(u.rgba.props, function(n, t) {
                            y[t.idx] = f(o[t.idx], t)
                        }), this) : "object" === v ? (o instanceof i ? r(u, function(n, t) {
                            o[t.cache] && (a[t.cache] = o[t.cache].slice())
                        }) : r(u, function(t, i) {
                            var u = i.cache;
                            r(i.props, function(n, t) {
                                if (!a[u] && i.to) {
                                    if ("alpha" === n || null == o[n]) return;
                                    a[u] = i.to(a._rgba)
                                }
                                a[u][t.idx] = f(o[n], t, !0)
                            });
                            a[u] && 0 > n.inArray(null, a[u].slice(0, 3)) && (a[u][3] = 1, i.from && (a._rgba = i.from(a[u])))
                        }), this) : t
                    },
                    is: function(n) {
                        var o = i(n),
                            f = !0,
                            e = this;
                        return r(u, function(n, i) {
                            var s, u = o[i.cache];
                            return u && (s = e[i.cache] || i.to && i.to(e._rgba) || [], r(i.props, function(n, i) {
                                return null != u[i.idx] ? f = u[i.idx] === s[i.idx] : t
                            })), f
                        }), f
                    },
                    _space: function() {
                        var n = [],
                            t = this;
                        return r(u, function(i, r) {
                            t[r.cache] && n.push(i)
                        }), n.pop()
                    },
                    transition: function(n, t) {
                        var e = i(n),
                            c = e._space(),
                            o = u[c],
                            l = 0 === this.alpha() ? i("transparent") : this,
                            a = l[o.cache] || o.to(l._rgba),
                            s = a.slice();
                        return e = e[o.cache], r(o.props, function(n, i) {
                            var c = i.idx,
                                r = a[c],
                                u = e[c],
                                o = h[i.type] || {};
                            null !== u && (null === r ? s[c] = u : (o.mod && (u - r > o.mod / 2 ? r += o.mod : r - u > o.mod / 2 && (r -= o.mod)), s[c] = f((u - r) * t + r, i)))
                        }), this[c](s)
                    },
                    blend: function(t) {
                        if (1 === this._rgba[3]) return this;
                        var r = this._rgba.slice(),
                            u = r.pop(),
                            f = i(t)._rgba;
                        return i(n.map(r, function(n, t) {
                            return (1 - u) * f[t] + u * n
                        }))
                    },
                    toRgbaString: function() {
                        var i = "rgba(",
                            t = n.map(this._rgba, function(n, t) {
                                return null == n ? t > 2 ? 1 : 0 : n
                            });
                        return 1 === t[3] && (t.pop(), i = "rgb("), i + t.join() + ")"
                    },
                    toHslaString: function() {
                        var i = "hsla(",
                            t = n.map(this.hsla(), function(n, t) {
                                return null == n && (n = t > 2 ? 1 : 0), t && 3 > t && (n = Math.round(100 * n) + "%"), n
                            });
                        return 1 === t[3] && (t.pop(), i = "hsl("), i + t.join() + ")"
                    },
                    toHexString: function(t) {
                        var i = this._rgba.slice(),
                            r = i.pop();
                        return t && i.push(~~(255 * r)), "#" + n.map(i, function(n) {
                            return n = (n || 0).toString(16), 1 === n.length ? "0" + n : n
                        }).join("")
                    },
                    toString: function() {
                        return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
                    }
                });
                i.fn.parse.prototype = i.fn;
                u.hsla.to = function(n) {
                    if (null == n[0] || null == n[1] || null == n[2]) return [null, null, null, n[3]];
                    var s, h, i = n[0] / 255,
                        r = n[1] / 255,
                        f = n[2] / 255,
                        c = n[3],
                        u = Math.max(i, r, f),
                        e = Math.min(i, r, f),
                        t = u - e,
                        o = u + e,
                        l = .5 * o;
                    return s = e === u ? 0 : i === u ? 60 * (r - f) / t + 360 : r === u ? 60 * (f - i) / t + 120 : 60 * (i - r) / t + 240, h = 0 === t ? 0 : .5 >= l ? t / o : t / (2 - o), [Math.round(s) % 360, h, l, null == c ? 1 : c]
                };
                u.hsla.from = function(n) {
                    if (null == n[0] || null == n[1] || null == n[2]) return [null, null, null, n[3]];
                    var r = n[0] / 360,
                        u = n[1],
                        t = n[2],
                        e = n[3],
                        i = .5 >= t ? t * (1 + u) : t + u - t * u,
                        f = 2 * t - i;
                    return [Math.round(255 * o(f, i, r + 1 / 3)), Math.round(255 * o(f, i, r)), Math.round(255 * o(f, i, r - 1 / 3)), e]
                };
                r(u, function(u, e) {
                    var s = e.props,
                        o = e.cache,
                        h = e.to,
                        c = e.from;
                    i.fn[u] = function(u) {
                        if (h && !this[o] && (this[o] = h(this._rgba)), u === t) return this[o].slice();
                        var l, a = n.type(u),
                            v = "array" === a || "object" === a ? u : arguments,
                            e = this[o].slice();
                        return r(s, function(n, t) {
                            var i = v["object" === a ? n : t.idx];
                            null == i && (i = e[t.idx]);
                            e[t.idx] = f(i, t)
                        }), c ? (l = i(c(e)), l[o] = e, l) : i(e)
                    };
                    r(s, function(t, r) {
                        i.fn[t] || (i.fn[t] = function(i) {
                            var f, e = n.type(i),
                                h = "alpha" === t ? this._hsla ? "hsla" : "rgba" : u,
                                o = this[h](),
                                s = o[r.idx];
                            return "undefined" === e ? s : ("function" === e && (i = i.call(this, s), e = n.type(i)), null == i && r.empty ? this : ("string" === e && (f = a.exec(i), f && (i = s + parseFloat(f[2]) * ("+" === f[1] ? 1 : -1))), o[r.idx] = i, this[h](o)))
                        })
                    })
                });
                i.hook = function(t) {
                    var u = t.split(" ");
                    r(u, function(t, r) {
                        n.cssHooks[r] = {
                            set: function(t, u) {
                                var o, f, e = "";
                                if ("transparent" !== u && ("string" !== n.type(u) || (o = s(u)))) {
                                    if (u = i(o || u), !c.rgba && 1 !== u._rgba[3]) {
                                        for (f = "backgroundColor" === r ? t.parentNode : t;
                                            ("" === e || "transparent" === e) && f && f.style;) try {
                                            e = n.css(f, "backgroundColor");
                                            f = f.parentNode
                                        } catch (h) {}
                                        u = u.blend(e && "transparent" !== e ? e : "_default")
                                    }
                                    u = u.toRgbaString()
                                }
                                try {
                                    t.style[r] = u
                                } catch (h) {}
                            }
                        };
                        n.fx.step[r] = function(t) {
                            t.colorInit || (t.start = i(t.elem, r), t.end = i(t.end), t.colorInit = !0);
                            n.cssHooks[r].set(t.elem, t.start.transition(t.end, t.pos))
                        }
                    })
                };
                i.hook("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor");
                n.cssHooks.borderColor = {
                    expand: function(n) {
                        var t = {};
                        return r(["Top", "Right", "Bottom", "Left"], function(i, r) {
                            t["border" + r + "Color"] = n
                        }), t
                    }
                };
                e = n.Color.names = {
                    aqua: "#00ffff",
                    black: "#000000",
                    blue: "#0000ff",
                    fuchsia: "#ff00ff",
                    gray: "#808080",
                    green: "#008000",
                    lime: "#00ff00",
                    maroon: "#800000",
                    navy: "#000080",
                    olive: "#808000",
                    purple: "#800080",
                    red: "#ff0000",
                    silver: "#c0c0c0",
                    teal: "#008080",
                    white: "#ffffff",
                    yellow: "#ffff00",
                    transparent: [null, null, null, 0],
                    _default: "#ffffff"
                }
            }(jQuery),
            function() {
                function i(t) {
                    var r, u, i = t.ownerDocument.defaultView ? t.ownerDocument.defaultView.getComputedStyle(t, null) : t.currentStyle,
                        f = {};
                    if (i && i.length && i[0] && i[i[0]])
                        for (u = i.length; u--;) r = i[u], "string" == typeof i[r] && (f[n.camelCase(r)] = i[r]);
                    else
                        for (r in i) "string" == typeof i[r] && (f[r] = i[r]);
                    return f
                }

                function r(t, i) {
                    var r, u, e = {};
                    for (r in i) u = i[r], t[r] !== u && (f[r] || (n.fx.step[r] || !isNaN(parseFloat(u))) && (e[r] = u));
                    return e
                }
                var u = ["add", "remove", "toggle"],
                    f = {
                        border: 1,
                        borderBottom: 1,
                        borderColor: 1,
                        borderLeft: 1,
                        borderRight: 1,
                        borderTop: 1,
                        borderWidth: 1,
                        margin: 1,
                        padding: 1
                    };
                n.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(t, i) {
                    n.fx.step[i] = function(n) {
                        ("none" === n.end || n.setAttr) && (1 !== n.pos || n.setAttr) || (jQuery.style(n.elem, i, n.end), n.setAttr = !0)
                    }
                });
                n.fn.addBack || (n.fn.addBack = function(n) {
                    return this.add(null == n ? this.prevObject : this.prevObject.filter(n))
                });
                n.effects.animateClass = function(t, f, e, o) {
                    var s = n.speed(f, e, o);
                    return this.queue(function() {
                        var o, e = n(this),
                            h = e.attr("class") || "",
                            f = s.children ? e.find("*").addBack() : e;
                        f = f.map(function() {
                            var t = n(this);
                            return {
                                el: t,
                                start: i(this)
                            }
                        });
                        o = function() {
                            n.each(u, function(n, i) {
                                t[i] && e[i + "Class"](t[i])
                            })
                        };
                        o();
                        f = f.map(function() {
                            return this.end = i(this.el[0]), this.diff = r(this.start, this.end), this
                        });
                        e.attr("class", h);
                        f = f.map(function() {
                            var i = this,
                                t = n.Deferred(),
                                r = n.extend({}, s, {
                                    queue: !1,
                                    complete: function() {
                                        t.resolve(i)
                                    }
                                });
                            return this.el.animate(this.diff, r), t.promise()
                        });
                        n.when.apply(n, f.get()).done(function() {
                            o();
                            n.each(arguments, function() {
                                var t = this.el;
                                n.each(this.diff, function(n) {
                                    t.css(n, "")
                                })
                            });
                            s.complete.call(e[0])
                        })
                    })
                };
                n.fn.extend({
                    addClass: function(t) {
                        return function(i, r, u, f) {
                            return r ? n.effects.animateClass.call(this, {
                                add: i
                            }, r, u, f) : t.apply(this, arguments)
                        }
                    }(n.fn.addClass),
                    removeClass: function(t) {
                        return function(i, r, u, f) {
                            return arguments.length > 1 ? n.effects.animateClass.call(this, {
                                remove: i
                            }, r, u, f) : t.apply(this, arguments)
                        }
                    }(n.fn.removeClass),
                    toggleClass: function(i) {
                        return function(r, u, f, e, o) {
                            return "boolean" == typeof u || u === t ? f ? n.effects.animateClass.call(this, u ? {
                                add: r
                            } : {
                                remove: r
                            }, f, e, o) : i.apply(this, arguments) : n.effects.animateClass.call(this, {
                                toggle: r
                            }, u, f, e)
                        }
                    }(n.fn.toggleClass),
                    switchClass: function(t, i, r, u, f) {
                        return n.effects.animateClass.call(this, {
                            add: i,
                            remove: t
                        }, r, u, f)
                    }
                })
            }(),
            function() {
                function r(t, i, r, u) {
                    return n.isPlainObject(t) && (i = t, t = t.effect), t = {
                        effect: t
                    }, null == i && (i = {}), n.isFunction(i) && (u = i, r = null, i = {}), ("number" == typeof i || n.fx.speeds[i]) && (u = r, r = i, i = {}), n.isFunction(r) && (u = r, r = null), i && n.extend(t, i), r = r || i.duration, t.duration = n.fx.off ? 0 : "number" == typeof r ? r : r in n.fx.speeds ? n.fx.speeds[r] : n.fx.speeds._default, t.complete = u || i.complete, t
                }

                function u(t) {
                    return !t || "number" == typeof t || n.fx.speeds[t] ? !0 : "string" != typeof t || n.effects.effect[t] ? n.isFunction(t) ? !0 : "object" != typeof t || t.effect ? !1 : !0 : !0
                }
                n.extend(n.effects, {
                    version: "1.10.3",
                    save: function(n, t) {
                        for (var r = 0; t.length > r; r++) null !== t[r] && n.data(i + t[r], n[0].style[t[r]])
                    },
                    restore: function(n, r) {
                        for (var f, u = 0; r.length > u; u++) null !== r[u] && (f = n.data(i + r[u]), f === t && (f = ""), n.css(r[u], f))
                    },
                    setMode: function(n, t) {
                        return "toggle" === t && (t = n.is(":hidden") ? "show" : "hide"), t
                    },
                    getBaseline: function(n, t) {
                        var i, r;
                        switch (n[0]) {
                            case "top":
                                i = 0;
                                break;
                            case "middle":
                                i = .5;
                                break;
                            case "bottom":
                                i = 1;
                                break;
                            default:
                                i = n[0] / t.height
                        }
                        switch (n[1]) {
                            case "left":
                                r = 0;
                                break;
                            case "center":
                                r = .5;
                                break;
                            case "right":
                                r = 1;
                                break;
                            default:
                                r = n[1] / t.width
                        }
                        return {
                            x: r,
                            y: i
                        }
                    },
                    createWrapper: function(t) {
                        if (t.parent().is(".ui-effects-wrapper")) return t.parent();
                        var i = {
                                width: t.outerWidth(!0),
                                height: t.outerHeight(!0),
                                float: t.css("float")
                            },
                            u = n("<div><\/div>").addClass("ui-effects-wrapper").css({
                                fontSize: "100%",
                                background: "transparent",
                                border: "none",
                                margin: 0,
                                padding: 0
                            }),
                            f = {
                                width: t.width(),
                                height: t.height()
                            },
                            r = document.activeElement;
                        try {
                            r.id
                        } catch (e) {
                            r = document.body
                        }
                        return t.wrap(u), (t[0] === r || n.contains(t[0], r)) && n(r).focus(), u = t.parent(), "static" === t.css("position") ? (u.css({
                            position: "relative"
                        }), t.css({
                            position: "relative"
                        })) : (n.extend(i, {
                            position: t.css("position"),
                            zIndex: t.css("z-index")
                        }), n.each(["top", "left", "bottom", "right"], function(n, r) {
                            i[r] = t.css(r);
                            isNaN(parseInt(i[r], 10)) && (i[r] = "auto")
                        }), t.css({
                            position: "relative",
                            top: 0,
                            left: 0,
                            right: "auto",
                            bottom: "auto"
                        })), t.css(f), u.css(i).show()
                    },
                    removeWrapper: function(t) {
                        var i = document.activeElement;
                        return t.parent().is(".ui-effects-wrapper") && (t.parent().replaceWith(t), (t[0] === i || n.contains(t[0], i)) && n(i).focus()), t
                    },
                    setTransition: function(t, i, r, u) {
                        return u = u || {}, n.each(i, function(n, i) {
                            var f = t.cssUnit(i);
                            f[0] > 0 && (u[i] = f[0] * r + f[1])
                        }), u
                    }
                });
                n.fn.extend({
                    effect: function() {
                        function i(i) {
                            function f() {
                                n.isFunction(o) && o.call(r[0]);
                                n.isFunction(i) && i()
                            }
                            var r = n(this),
                                o = t.complete,
                                u = t.mode;
                            (r.is(":hidden") ? "hide" === u : "show" === u) ? (r[u](), f()) : e.call(r[0], t, f)
                        }
                        var t = r.apply(this, arguments),
                            u = t.mode,
                            f = t.queue,
                            e = n.effects.effect[t.effect];
                        return n.fx.off || !e ? u ? this[u](t.duration, t.complete) : this.each(function() {
                            t.complete && t.complete.call(this)
                        }) : f === !1 ? this.each(i) : this.queue(f || "fx", i)
                    },
                    show: function(n) {
                        return function(t) {
                            if (u(t)) return n.apply(this, arguments);
                            var i = r.apply(this, arguments);
                            return i.mode = "show", this.effect.call(this, i)
                        }
                    }(n.fn.show),
                    hide: function(n) {
                        return function(t) {
                            if (u(t)) return n.apply(this, arguments);
                            var i = r.apply(this, arguments);
                            return i.mode = "hide", this.effect.call(this, i)
                        }
                    }(n.fn.hide),
                    toggle: function(n) {
                        return function(t) {
                            if (u(t) || "boolean" == typeof t) return n.apply(this, arguments);
                            var i = r.apply(this, arguments);
                            return i.mode = "toggle", this.effect.call(this, i)
                        }
                    }(n.fn.toggle),
                    cssUnit: function(t) {
                        var i = this.css(t),
                            r = [];
                        return n.each(["em", "px", "%", "pt"], function(n, t) {
                            i.indexOf(t) > 0 && (r = [parseFloat(i), t])
                        }), r
                    }
                })
            }(),
            function() {
                var t = {};
                n.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(n, i) {
                    t[i] = function(t) {
                        return Math.pow(t, n + 2)
                    }
                });
                n.extend(t, {
                    Sine: function(n) {
                        return 1 - Math.cos(n * Math.PI / 2)
                    },
                    Circ: function(n) {
                        return 1 - Math.sqrt(1 - n * n)
                    },
                    Elastic: function(n) {
                        return 0 === n || 1 === n ? n : -Math.pow(2, 8 * (n - 1)) * Math.sin((80 * (n - 1) - 7.5) * Math.PI / 15)
                    },
                    Back: function(n) {
                        return n * n * (3 * n - 2)
                    },
                    Bounce: function(n) {
                        for (var t, i = 4;
                            ((t = Math.pow(2, --i)) - 1) / 11 > n;);
                        return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * t - 2) / 22 - n, 2)
                    }
                });
                n.each(t, function(t, i) {
                    n.easing["easeIn" + t] = i;
                    n.easing["easeOut" + t] = function(n) {
                        return 1 - i(1 - n)
                    };
                    n.easing["easeInOut" + t] = function(n) {
                        return .5 > n ? i(2 * n) / 2 : 1 - i(-2 * n + 2) / 2
                    }
                })
            }()
    }(jQuery), function(n) {
        n.effects.effect.fade = function(t, i) {
            var r = n(this),
                u = n.effects.setMode(r, t.mode || "toggle");
            r.animate({
                opacity: u
            }, {
                queue: !1,
                duration: t.duration,
                easing: t.easing,
                complete: i
            })
        }
    }(jQuery), "undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); + function(n) {
    var t = n.fn.jquery.split(" ")[0].split(".");
    if (t[0] < 2 && t[1] < 9 || 1 == t[0] && 9 == t[1] && t[2] < 1) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher");
}(jQuery); + function(n) {
    "use strict";

    function t() {
        var i = document.createElement("bootstrap"),
            t = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            },
            n;
        for (n in t)
            if (void 0 !== i.style[n]) return {
                end: t[n]
            };
        return !1
    }
    n.fn.emulateTransitionEnd = function(t) {
        var i = !1,
            u = this,
            r;
        n(this).one("bsTransitionEnd", function() {
            i = !0
        });
        return r = function() {
            i || n(u).trigger(n.support.transition.end)
        }, setTimeout(r, t), this
    };
    n(function() {
        n.support.transition = t();
        n.support.transition && (n.event.special.bsTransitionEnd = {
            bindType: n.support.transition.end,
            delegateType: n.support.transition.end,
            handle: function(t) {
                if (n(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
            }
        })
    })
}(jQuery); + function(n) {
    "use strict";

    function u(i) {
        return this.each(function() {
            var r = n(this),
                u = r.data("bs.alert");
            u || r.data("bs.alert", u = new t(this));
            "string" == typeof i && u[i].call(r)
        })
    }
    var i = '[data-dismiss="alert"]',
        t = function(t) {
            n(t).on("click", i, this.close)
        },
        r;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 150;
    t.prototype.close = function(i) {
        function e() {
            r.detach().trigger("closed.bs.alert").remove()
        }
        var f = n(this),
            u = f.attr("data-target"),
            r;
        u || (u = f.attr("href"), u = u && u.replace(/.*(?=#[^\s]*$)/, ""));
        r = n(u);
        i && i.preventDefault();
        r.length || (r = f.closest(".alert"));
        r.trigger(i = n.Event("close.bs.alert"));
        i.isDefaultPrevented() || (r.removeClass("in"), n.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", e).emulateTransitionEnd(t.TRANSITION_DURATION) : e())
    };
    r = n.fn.alert;
    n.fn.alert = u;
    n.fn.alert.Constructor = t;
    n.fn.alert.noConflict = function() {
        return n.fn.alert = r, this
    };
    n(document).on("click.bs.alert.data-api", i, t.prototype.close)
}(jQuery); + function(n) {
    "use strict";

    function i(i) {
        return this.each(function() {
            var u = n(this),
                r = u.data("bs.button"),
                f = "object" == typeof i && i;
            r || u.data("bs.button", r = new t(this, f));
            "toggle" == i ? r.toggle() : i && r.setState(i)
        })
    }
    var t = function(i, r) {
            this.$element = n(i);
            this.options = n.extend({}, t.DEFAULTS, r);
            this.isLoading = !1
        },
        r;
    t.VERSION = "3.3.1";
    t.DEFAULTS = {
        loadingText: "loading..."
    };
    t.prototype.setState = function(t) {
        var r = "disabled",
            i = this.$element,
            f = i.is("input") ? "val" : "html",
            u = i.data();
        t += "Text";
        null == u.resetText && i.data("resetText", i[f]());
        setTimeout(n.proxy(function() {
            i[f](null == u[t] ? this.options[t] : u[t]);
            "loadingText" == t ? (this.isLoading = !0, i.addClass(r).attr(r, r)) : this.isLoading && (this.isLoading = !1, i.removeClass(r).removeAttr(r))
        }, this), 0)
    };
    t.prototype.toggle = function() {
        var t = !0,
            i = this.$element.closest('[data-toggle="buttons"]'),
            n;
        i.length ? (n = this.$element.find("input"), "radio" == n.prop("type") && (n.prop("checked") && this.$element.hasClass("active") ? t = !1 : i.find(".active").removeClass("active")), t && n.prop("checked", !this.$element.hasClass("active")).trigger("change")) : this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
        t && this.$element.toggleClass("active")
    };
    r = n.fn.button;
    n.fn.button = i;
    n.fn.button.Constructor = t;
    n.fn.button.noConflict = function() {
        return n.fn.button = r, this
    };
    n(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(t) {
        var r = n(t.target);
        r.hasClass("btn") || (r = r.closest(".btn"));
        i.call(r, "toggle");
        t.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(t) {
        n(t.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(t.type))
    })
}(jQuery); + function(n) {
    "use strict";

    function i(i) {
        return this.each(function() {
            var u = n(this),
                r = u.data("bs.carousel"),
                f = n.extend({}, t.DEFAULTS, u.data(), "object" == typeof i && i),
                e = "string" == typeof i ? i : f.slide;
            r || u.data("bs.carousel", r = new t(this, f));
            "number" == typeof i ? r.to(i) : e ? r[e]() : f.interval && r.pause().cycle()
        })
    }
    var t = function(t, i) {
            this.$element = n(t);
            this.$indicators = this.$element.find(".carousel-indicators");
            this.options = i;
            this.paused = this.sliding = this.interval = this.$active = this.$items = null;
            this.options.keyboard && this.$element.on("keydown.bs.carousel", n.proxy(this.keydown, this));
            "hover" != this.options.pause || "ontouchstart" in document.documentElement || this.$element.on("mouseenter.bs.carousel", n.proxy(this.pause, this)).on("mouseleave.bs.carousel", n.proxy(this.cycle, this))
        },
        u, r;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 600;
    t.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    };
    t.prototype.keydown = function(n) {
        if (!/input|textarea/i.test(n.target.tagName)) {
            switch (n.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            n.preventDefault()
        }
    };
    t.prototype.cycle = function(t) {
        return t || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(n.proxy(this.next, this), this.options.interval)), this
    };
    t.prototype.getItemIndex = function(n) {
        return this.$items = n.parent().children(".item"), this.$items.index(n || this.$active)
    };
    t.prototype.getItemForDirection = function(n, t) {
        var i = "prev" == n ? -1 : 1,
            r = this.getItemIndex(t),
            u = (r + i) % this.$items.length;
        return this.$items.eq(u)
    };
    t.prototype.to = function(n) {
        var i = this,
            t = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (!(n > this.$items.length - 1) && !(0 > n)) return this.sliding ? this.$element.one("slid.bs.carousel", function() {
            i.to(n)
        }) : t == n ? this.pause().cycle() : this.slide(n > t ? "next" : "prev", this.$items.eq(n))
    };
    t.prototype.pause = function(t) {
        return t || (this.paused = !0), this.$element.find(".next, .prev").length && n.support.transition && (this.$element.trigger(n.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    };
    t.prototype.next = function() {
        if (!this.sliding) return this.slide("next")
    };
    t.prototype.prev = function() {
        if (!this.sliding) return this.slide("prev")
    };
    t.prototype.slide = function(i, r) {
        var e = this.$element.find(".item.active"),
            u = r || this.getItemForDirection(i, e),
            l = this.interval,
            f = "next" == i ? "left" : "right",
            v = "next" == i ? "first" : "last",
            a = this,
            o, s, h, c;
        if (!u.length) {
            if (!this.options.wrap) return;
            u = this.$element.find(".item")[v]()
        }
        return u.hasClass("active") ? this.sliding = !1 : (o = u[0], s = n.Event("slide.bs.carousel", {
            relatedTarget: o,
            direction: f
        }), (this.$element.trigger(s), !s.isDefaultPrevented()) ? ((this.sliding = !0, l && this.pause(), this.$indicators.length) && (this.$indicators.find(".active").removeClass("active"), h = n(this.$indicators.children()[this.getItemIndex(u)]), h && h.addClass("active")), c = n.Event("slid.bs.carousel", {
            relatedTarget: o,
            direction: f
        }), n.support.transition && this.$element.hasClass("slide") ? (u.addClass(i), u[0].offsetWidth, e.addClass(f), u.addClass(f), e.one("bsTransitionEnd", function() {
            u.removeClass([i, f].join(" ")).addClass("active");
            e.removeClass(["active", f].join(" "));
            a.sliding = !1;
            setTimeout(function() {
                a.$element.trigger(c)
            }, 0)
        }).emulateTransitionEnd(t.TRANSITION_DURATION)) : (e.removeClass("active"), u.addClass("active"), this.sliding = !1, this.$element.trigger(c)), l && this.cycle(), this) : void 0)
    };
    u = n.fn.carousel;
    n.fn.carousel = i;
    n.fn.carousel.Constructor = t;
    n.fn.carousel.noConflict = function() {
        return n.fn.carousel = u, this
    };
    r = function(t) {
        var o, r = n(this),
            u = n(r.attr("data-target") || (o = r.attr("href")) && o.replace(/.*(?=#[^\s]+$)/, "")),
            e, f;
        u.hasClass("carousel") && (e = n.extend({}, u.data(), r.data()), f = r.attr("data-slide-to"), f && (e.interval = !1), i.call(u, e), f && u.data("bs.carousel").to(f), t.preventDefault())
    };
    n(document).on("click.bs.carousel.data-api", "[data-slide]", r).on("click.bs.carousel.data-api", "[data-slide-to]", r);
    n(window).on("load", function() {
        n('[data-ride="carousel"]').each(function() {
            var t = n(this);
            i.call(t, t.data())
        })
    })
}(jQuery); + function(n) {
    "use strict";

    function r(t) {
        var i, r = t.attr("data-target") || (i = t.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "");
        return n(r)
    }

    function i(i) {
        return this.each(function() {
            var u = n(this),
                r = u.data("bs.collapse"),
                f = n.extend({}, t.DEFAULTS, u.data(), "object" == typeof i && i);
            !r && f.toggle && "show" == i && (f.toggle = !1);
            r || u.data("bs.collapse", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    }
    var t = function(i, r) {
            this.$element = n(i);
            this.options = n.extend({}, t.DEFAULTS, r);
            this.$trigger = n(this.options.trigger).filter('[href="#' + i.id + '"], [data-target="#' + i.id + '"]');
            this.transitioning = null;
            this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger);
            this.options.toggle && this.toggle()
        },
        u;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 350;
    t.DEFAULTS = {
        toggle: !0,
        trigger: '[data-toggle="collapse"]'
    };
    t.prototype.dimension = function() {
        var n = this.$element.hasClass("width");
        return n ? "width" : "height"
    };
    t.prototype.show = function() {
        var f, r, e, u, o, s;
        if (!this.transitioning && !this.$element.hasClass("in") && (r = this.$parent && this.$parent.find("> .panel").children(".in, .collapsing"), !(r && r.length && (f = r.data("bs.collapse"), f && f.transitioning)) && (e = n.Event("show.bs.collapse"), this.$element.trigger(e), !e.isDefaultPrevented()))) {
            if (r && r.length && (i.call(r, "hide"), f || r.data("bs.collapse", null)), u = this.dimension(), this.$element.removeClass("collapse").addClass("collapsing")[u](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1, o = function() {
                    this.$element.removeClass("collapsing").addClass("collapse in")[u]("");
                    this.transitioning = 0;
                    this.$element.trigger("shown.bs.collapse")
                }, !n.support.transition) return o.call(this);
            s = n.camelCase(["scroll", u].join("-"));
            this.$element.one("bsTransitionEnd", n.proxy(o, this)).emulateTransitionEnd(t.TRANSITION_DURATION)[u](this.$element[0][s])
        }
    };
    t.prototype.hide = function() {
        var r, i, u;
        if (!this.transitioning && this.$element.hasClass("in") && (r = n.Event("hide.bs.collapse"), this.$element.trigger(r), !r.isDefaultPrevented())) return i = this.dimension(), this.$element[i](this.$element[i]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1, u = function() {
            this.transitioning = 0;
            this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
        }, n.support.transition ? void this.$element[i](0).one("bsTransitionEnd", n.proxy(u, this)).emulateTransitionEnd(t.TRANSITION_DURATION) : u.call(this)
    };
    t.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    };
    t.prototype.getParent = function() {
        return n(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(n.proxy(function(t, i) {
            var u = n(i);
            this.addAriaAndCollapsedClass(r(u), u)
        }, this)).end()
    };
    t.prototype.addAriaAndCollapsedClass = function(n, t) {
        var i = n.hasClass("in");
        n.attr("aria-expanded", i);
        t.toggleClass("collapsed", !i).attr("aria-expanded", i)
    };
    u = n.fn.collapse;
    n.fn.collapse = i;
    n.fn.collapse.Constructor = t;
    n.fn.collapse.noConflict = function() {
        return n.fn.collapse = u, this
    };
    n(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(t) {
        var u = n(this);
        u.attr("data-target") || t.preventDefault();
        var f = r(u),
            e = f.data("bs.collapse"),
            o = e ? "toggle" : n.extend({}, u.data(), {
                trigger: this
            });
        i.call(f, o)
    })
}(jQuery); + function(n) {
    "use strict";

    function r(t) {
        t && 3 === t.which || (n(o).remove(), n(i).each(function() {
            var r = n(this),
                i = u(r),
                f = {
                    relatedTarget: this
                };
            i.hasClass("open") && (i.trigger(t = n.Event("hide.bs.dropdown", f)), t.isDefaultPrevented() || (r.attr("aria-expanded", "false"), i.removeClass("open").trigger("hidden.bs.dropdown", f)))
        }))
    }

    function u(t) {
        var i = t.attr("data-target"),
            r;
        return i || (i = t.attr("href"), i = i && /#[A-Za-z]/.test(i) && i.replace(/.*(?=#[^\s]*$)/, "")), r = i && n(i), r && r.length ? r : t.parent()
    }

    function e(i) {
        return this.each(function() {
            var r = n(this),
                u = r.data("bs.dropdown");
            u || r.data("bs.dropdown", u = new t(this));
            "string" == typeof i && u[i].call(r)
        })
    }
    var o = ".dropdown-backdrop",
        i = '[data-toggle="dropdown"]',
        t = function(t) {
            n(t).on("click.bs.dropdown", this.toggle)
        },
        f;
    t.VERSION = "3.3.1";
    t.prototype.toggle = function(t) {
        var f = n(this),
            i, o, e;
        if (!f.is(".disabled, :disabled")) {
            if (i = u(f), o = i.hasClass("open"), r(), !o) {
                if ("ontouchstart" in document.documentElement && !i.closest(".navbar-nav").length && n('<div class="dropdown-backdrop"/>').insertAfter(n(this)).on("click", r), e = {
                        relatedTarget: this
                    }, i.trigger(t = n.Event("show.bs.dropdown", e)), t.isDefaultPrevented()) return;
                f.trigger("focus").attr("aria-expanded", "true");
                i.toggleClass("open").trigger("shown.bs.dropdown", e)
            }
            return !1
        }
    };
    t.prototype.keydown = function(t) {
        var e, o, s, h, f, r;
        if (/(38|40|27|32)/.test(t.which) && !/input|textarea/i.test(t.target.tagName) && (e = n(this), t.preventDefault(), t.stopPropagation(), !e.is(".disabled, :disabled"))) {
            if (o = u(e), s = o.hasClass("open"), !s && 27 != t.which || s && 27 == t.which) return 27 == t.which && o.find(i).trigger("focus"), e.trigger("click");
            h = " li:not(.divider):visible a";
            f = o.find('[role="menu"]' + h + ', [role="listbox"]' + h);
            f.length && (r = f.index(t.target), 38 == t.which && r > 0 && r--, 40 == t.which && r < f.length - 1 && r++, ~r || (r = 0), f.eq(r).trigger("focus"))
        }
    };
    f = n.fn.dropdown;
    n.fn.dropdown = e;
    n.fn.dropdown.Constructor = t;
    n.fn.dropdown.noConflict = function() {
        return n.fn.dropdown = f, this
    };
    n(document).on("click.bs.dropdown.data-api", r).on("click.bs.dropdown.data-api", ".dropdown form", function(n) {
        n.stopPropagation()
    }).on("click.bs.dropdown.data-api", i, t.prototype.toggle).on("keydown.bs.dropdown.data-api", i, t.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="menu"]', t.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="listbox"]', t.prototype.keydown)
}(jQuery); + function(n) {
    "use strict";

    function i(i, r) {
        return this.each(function() {
            var f = n(this),
                u = f.data("bs.modal"),
                e = n.extend({}, t.DEFAULTS, f.data(), "object" == typeof i && i);
            u || f.data("bs.modal", u = new t(this, e));
            "string" == typeof i ? u[i](r) : e.show && u.show(r)
        })
    }
    var t = function(t, i) {
            this.options = i;
            this.$body = n(document.body);
            this.$element = n(t);
            this.$backdrop = this.isShown = null;
            this.scrollbarWidth = 0;
            this.options.remote && this.$element.find(".modal-content").load(this.options.remote, n.proxy(function() {
                this.$element.trigger("loaded.bs.modal")
            }, this))
        },
        r;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 300;
    t.BACKDROP_TRANSITION_DURATION = 150;
    t.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    };
    t.prototype.toggle = function(n) {
        return this.isShown ? this.hide() : this.show(n)
    };
    t.prototype.show = function(i) {
        var r = this,
            u = n.Event("show.bs.modal", {
                relatedTarget: i
            });
        this.$element.trigger(u);
        this.isShown || u.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', n.proxy(this.hide, this)), this.backdrop(function() {
            var f = n.support.transition && r.$element.hasClass("fade"),
                u;
            r.$element.parent().length || r.$element.appendTo(r.$body);
            r.$element.show().scrollTop(0);
            r.options.backdrop && r.adjustBackdrop();
            r.adjustDialog();
            f && r.$element[0].offsetWidth;
            r.$element.addClass("in").attr("aria-hidden", !1);
            r.enforceFocus();
            u = n.Event("shown.bs.modal", {
                relatedTarget: i
            });
            f ? r.$element.find(".modal-dialog").one("bsTransitionEnd", function() {
                r.$element.trigger("focus").trigger(u)
            }).emulateTransitionEnd(t.TRANSITION_DURATION) : r.$element.trigger("focus").trigger(u)
        }))
    };
    t.prototype.hide = function(i) {
        i && i.preventDefault();
        i = n.Event("hide.bs.modal");
        this.$element.trigger(i);
        this.isShown && !i.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), n(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), n.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", n.proxy(this.hideModal, this)).emulateTransitionEnd(t.TRANSITION_DURATION) : this.hideModal())
    };
    t.prototype.enforceFocus = function() {
        n(document).off("focusin.bs.modal").on("focusin.bs.modal", n.proxy(function(n) {
            this.$element[0] === n.target || this.$element.has(n.target).length || this.$element.trigger("focus")
        }, this))
    };
    t.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", n.proxy(function(n) {
            27 == n.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    };
    t.prototype.resize = function() {
        this.isShown ? n(window).on("resize.bs.modal", n.proxy(this.handleUpdate, this)) : n(window).off("resize.bs.modal")
    };
    t.prototype.hideModal = function() {
        var n = this;
        this.$element.hide();
        this.backdrop(function() {
            n.$body.removeClass("modal-open");
            n.resetAdjustments();
            n.resetScrollbar();
            n.$element.trigger("hidden.bs.modal")
        })
    };
    t.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null
    };
    t.prototype.backdrop = function(i) {
        var e = this,
            f = this.$element.hasClass("fade") ? "fade" : "",
            r, u;
        if (this.isShown && this.options.backdrop) {
            if (r = n.support.transition && f, this.$backdrop = n('<div class="modal-backdrop ' + f + '" />').prependTo(this.$element).on("click.dismiss.bs.modal", n.proxy(function(n) {
                    n.target === n.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
                }, this)), r && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !i) return;
            r ? this.$backdrop.one("bsTransitionEnd", i).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION) : i()
        } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), u = function() {
            e.removeBackdrop();
            i && i()
        }, n.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", u).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION) : u()) : i && i()
    };
    t.prototype.handleUpdate = function() {
        this.options.backdrop && this.adjustBackdrop();
        this.adjustDialog()
    };
    t.prototype.adjustBackdrop = function() {
        this.$backdrop.css("height", 0).css("height", this.$element[0].scrollHeight)
    };
    t.prototype.adjustDialog = function() {
        var n = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && n ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !n ? this.scrollbarWidth : ""
        })
    };
    t.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        })
    };
    t.prototype.checkScrollbar = function() {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight;
        this.scrollbarWidth = this.measureScrollbar()
    };
    t.prototype.setScrollbar = function() {
        var n = parseInt(this.$body.css("padding-right") || 0, 10);
        this.bodyIsOverflowing && this.$body.css("padding-right", n + this.scrollbarWidth)
    };
    t.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", "")
    };
    t.prototype.measureScrollbar = function() {
        var n = document.createElement("div"),
            t;
        return n.className = "modal-scrollbar-measure", this.$body.append(n), t = n.offsetWidth - n.clientWidth, this.$body[0].removeChild(n), t
    };
    r = n.fn.modal;
    n.fn.modal = i;
    n.fn.modal.Constructor = t;
    n.fn.modal.noConflict = function() {
        return n.fn.modal = r, this
    };
    n(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(t) {
        var r = n(this),
            f = r.attr("href"),
            u = n(r.attr("data-target") || f && f.replace(/.*(?=#[^\s]+$)/, "")),
            e = u.data("bs.modal") ? "toggle" : n.extend({
                remote: !/#/.test(f) && f
            }, u.data(), r.data());
        r.is("a") && t.preventDefault();
        u.one("show.bs.modal", function(n) {
            n.isDefaultPrevented() || u.one("hidden.bs.modal", function() {
                r.is(":visible") && r.trigger("focus")
            })
        });
        i.call(u, e, this)
    })
}(jQuery); + function(n) {
    "use strict";

    function r(i) {
        return this.each(function() {
            var f = n(this),
                r = f.data("bs.tooltip"),
                u = "object" == typeof i && i,
                e = u && u.selector;
            (r || "destroy" != i) && (e ? (r || f.data("bs.tooltip", r = {}), r[e] || (r[e] = new t(this, u))) : r || f.data("bs.tooltip", r = new t(this, u)), "string" == typeof i && r[i]())
        })
    }
    var t = function(n, t) {
            this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
            this.init("tooltip", n, t)
        },
        i;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 150;
    t.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"><\/div><div class="tooltip-inner"><\/div><\/div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        }
    };
    t.prototype.init = function(t, i, r) {
        var f, e, u, o, s;
        for (this.enabled = !0, this.type = t, this.$element = n(i), this.options = this.getOptions(r), this.$viewport = this.options.viewport && n(this.options.viewport.selector || this.options.viewport), f = this.options.trigger.split(" "), e = f.length; e--;)
            if (u = f[e], "click" == u) this.$element.on("click." + this.type, this.options.selector, n.proxy(this.toggle, this));
            else "manual" != u && (o = "hover" == u ? "mouseenter" : "focusin", s = "hover" == u ? "mouseleave" : "focusout", this.$element.on(o + "." + this.type, this.options.selector, n.proxy(this.enter, this)), this.$element.on(s + "." + this.type, this.options.selector, n.proxy(this.leave, this)));
        this.options.selector ? this._options = n.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    };
    t.prototype.getDefaults = function() {
        return t.DEFAULTS
    };
    t.prototype.getOptions = function(t) {
        return t = n.extend({}, this.getDefaults(), this.$element.data(), t), t.delay && "number" == typeof t.delay && (t.delay = {
            show: t.delay,
            hide: t.delay
        }), t
    };
    t.prototype.getDelegateOptions = function() {
        var t = {},
            i = this.getDefaults();
        return this._options && n.each(this._options, function(n, r) {
            i[n] != r && (t[n] = r)
        }), t
    };
    t.prototype.enter = function(t) {
        var i = t instanceof this.constructor ? t : n(t.currentTarget).data("bs." + this.type);
        return i && i.$tip && i.$tip.is(":visible") ? void(i.hoverState = "in") : (i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), n(t.currentTarget).data("bs." + this.type, i)), clearTimeout(i.timeout), i.hoverState = "in", i.options.delay && i.options.delay.show ? void(i.timeout = setTimeout(function() {
            "in" == i.hoverState && i.show()
        }, i.options.delay.show)) : i.show())
    };
    t.prototype.leave = function(t) {
        var i = t instanceof this.constructor ? t : n(t.currentTarget).data("bs." + this.type);
        return i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), n(t.currentTarget).data("bs." + this.type, i)), clearTimeout(i.timeout), i.hoverState = "out", i.options.delay && i.options.delay.hide ? void(i.timeout = setTimeout(function() {
            "out" == i.hoverState && i.hide()
        }, i.options.delay.hide)) : i.hide()
    };
    t.prototype.show = function() {
        var c = n.Event("show.bs." + this.type),
            l, a, o;
        if (this.hasContent() && this.enabled) {
            if (this.$element.trigger(c), l = n.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]), c.isDefaultPrevented() || !l) return;
            var u = this,
                r = this.tip(),
                v = this.getUID(this.type);
            this.setContent();
            r.attr("id", v);
            this.$element.attr("aria-describedby", v);
            this.options.animation && r.addClass("fade");
            var i = "function" == typeof this.options.placement ? this.options.placement.call(this, r[0], this.$element[0]) : this.options.placement,
                y = /\s?auto?\s?/i,
                p = y.test(i);
            p && (i = i.replace(y, "") || "top");
            r.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(i).data("bs." + this.type, this);
            this.options.container ? r.appendTo(this.options.container) : r.insertAfter(this.$element);
            var f = this.getPosition(),
                s = r[0].offsetWidth,
                h = r[0].offsetHeight;
            if (p) {
                var w = i,
                    b = this.options.container ? n(this.options.container) : this.$element.parent(),
                    e = this.getPosition(b);
                i = "bottom" == i && f.bottom + h > e.bottom ? "top" : "top" == i && f.top - h < e.top ? "bottom" : "right" == i && f.right + s > e.width ? "left" : "left" == i && f.left - s < e.left ? "right" : i;
                r.removeClass(w).addClass(i)
            }
            a = this.getCalculatedOffset(i, f, s, h);
            this.applyPlacement(a, i);
            o = function() {
                var n = u.hoverState;
                u.$element.trigger("shown.bs." + u.type);
                u.hoverState = null;
                "out" == n && u.leave(u)
            };
            n.support.transition && this.$tip.hasClass("fade") ? r.one("bsTransitionEnd", o).emulateTransitionEnd(t.TRANSITION_DURATION) : o()
        }
    };
    t.prototype.applyPlacement = function(t, i) {
        var r = this.tip(),
            l = r[0].offsetWidth,
            e = r[0].offsetHeight,
            o = parseInt(r.css("margin-top"), 10),
            s = parseInt(r.css("margin-left"), 10),
            h, f, u;
        isNaN(o) && (o = 0);
        isNaN(s) && (s = 0);
        t.top = t.top + o;
        t.left = t.left + s;
        n.offset.setOffset(r[0], n.extend({
            using: function(n) {
                r.css({
                    top: Math.round(n.top),
                    left: Math.round(n.left)
                })
            }
        }, t), 0);
        r.addClass("in");
        h = r[0].offsetWidth;
        f = r[0].offsetHeight;
        "top" == i && f != e && (t.top = t.top + e - f);
        u = this.getViewportAdjustedDelta(i, t, h, f);
        u.left ? t.left += u.left : t.top += u.top;
        var c = /top|bottom/.test(i),
            a = c ? 2 * u.left - l + h : 2 * u.top - e + f,
            v = c ? "offsetWidth" : "offsetHeight";
        r.offset(t);
        this.replaceArrow(a, r[0][v], c)
    };
    t.prototype.replaceArrow = function(n, t, i) {
        this.arrow().css(i ? "left" : "top", 50 * (1 - n / t) + "%").css(i ? "top" : "left", "")
    };
    t.prototype.setContent = function() {
        var n = this.tip(),
            t = this.getTitle();
        n.find(".tooltip-inner")[this.options.html ? "html" : "text"](t);
        n.removeClass("fade in top bottom left right")
    };
    t.prototype.hide = function(i) {
        function f() {
            "in" != r.hoverState && u.detach();
            r.$element.removeAttr("aria-describedby").trigger("hidden.bs." + r.type);
            i && i()
        }
        var r = this,
            u = this.tip(),
            e = n.Event("hide.bs." + this.type);
        return this.$element.trigger(e), e.isDefaultPrevented() ? void 0 : (u.removeClass("in"), n.support.transition && this.$tip.hasClass("fade") ? u.one("bsTransitionEnd", f).emulateTransitionEnd(t.TRANSITION_DURATION) : f(), this.hoverState = null, this)
    };
    t.prototype.fixTitle = function() {
        var n = this.$element;
        (n.attr("title") || "string" != typeof n.attr("data-original-title")) && n.attr("data-original-title", n.attr("title") || "").attr("title", "")
    };
    t.prototype.hasContent = function() {
        return this.getTitle()
    };
    t.prototype.getPosition = function(t) {
        t = t || this.$element;
        var u = t[0],
            r = "BODY" == u.tagName,
            i = u.getBoundingClientRect();
        null == i.width && (i = n.extend({}, i, {
            width: i.right - i.left,
            height: i.bottom - i.top
        }));
        var f = r ? {
                top: 0,
                left: 0
            } : t.offset(),
            e = {
                scroll: r ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop()
            },
            o = r ? {
                width: n(window).width(),
                height: n(window).height()
            } : null;
        return n.extend({}, i, e, o, f)
    };
    t.prototype.getCalculatedOffset = function(n, t, i, r) {
        return "bottom" == n ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - i / 2
        } : "top" == n ? {
            top: t.top - r,
            left: t.left + t.width / 2 - i / 2
        } : "left" == n ? {
            top: t.top + t.height / 2 - r / 2,
            left: t.left - i
        } : {
            top: t.top + t.height / 2 - r / 2,
            left: t.left + t.width
        }
    };
    t.prototype.getViewportAdjustedDelta = function(n, t, i, r) {
        var f = {
                top: 0,
                left: 0
            },
            e, u, o, s, h, c;
        return this.$viewport ? (e = this.options.viewport && this.options.viewport.padding || 0, u = this.getPosition(this.$viewport), /right|left/.test(n) ? (o = t.top - e - u.scroll, s = t.top + e - u.scroll + r, o < u.top ? f.top = u.top - o : s > u.top + u.height && (f.top = u.top + u.height - s)) : (h = t.left - e, c = t.left + e + i, h < u.left ? f.left = u.left - h : c > u.width && (f.left = u.left + u.width - c)), f) : f
    };
    t.prototype.getTitle = function() {
        var t = this.$element,
            n = this.options;
        return t.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(t[0]) : n.title)
    };
    t.prototype.getUID = function(n) {
        do n += ~~(1e6 * Math.random()); while (document.getElementById(n));
        return n
    };
    t.prototype.tip = function() {
        return this.$tip = this.$tip || n(this.options.template)
    };
    t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    };
    t.prototype.enable = function() {
        this.enabled = !0
    };
    t.prototype.disable = function() {
        this.enabled = !1
    };
    t.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    };
    t.prototype.toggle = function(t) {
        var i = this;
        t && (i = n(t.currentTarget).data("bs." + this.type), i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), n(t.currentTarget).data("bs." + this.type, i)));
        i.tip().hasClass("in") ? i.leave(i) : i.enter(i)
    };
    t.prototype.destroy = function() {
        var n = this;
        clearTimeout(this.timeout);
        this.hide(function() {
            n.$element.off("." + n.type).removeData("bs." + n.type)
        })
    };
    i = n.fn.tooltip;
    n.fn.tooltip = r;
    n.fn.tooltip.Constructor = t;
    n.fn.tooltip.noConflict = function() {
        return n.fn.tooltip = i, this
    }
}(jQuery); + function(n) {
    "use strict";

    function r(i) {
        return this.each(function() {
            var f = n(this),
                r = f.data("bs.popover"),
                u = "object" == typeof i && i,
                e = u && u.selector;
            (r || "destroy" != i) && (e ? (r || f.data("bs.popover", r = {}), r[e] || (r[e] = new t(this, u))) : r || f.data("bs.popover", r = new t(this, u)), "string" == typeof i && r[i]())
        })
    }
    var t = function(n, t) {
            this.init("popover", n, t)
        },
        i;
    if (!n.fn.tooltip) throw new Error("Popover requires tooltip.js");
    t.VERSION = "3.3.1";
    t.DEFAULTS = n.extend({}, n.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"><\/div><h3 class="popover-title"><\/h3><div class="popover-content"><\/div><\/div>'
    });
    t.prototype = n.extend({}, n.fn.tooltip.Constructor.prototype);
    t.prototype.constructor = t;
    t.prototype.getDefaults = function() {
        return t.DEFAULTS
    };
    t.prototype.setContent = function() {
        var n = this.tip(),
            i = this.getTitle(),
            t = this.getContent();
        n.find(".popover-title")[this.options.html ? "html" : "text"](i);
        n.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof t ? "html" : "append" : "text"](t);
        n.removeClass("fade top bottom left right in");
        n.find(".popover-title").html() || n.find(".popover-title").hide()
    };
    t.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    };
    t.prototype.getContent = function() {
        var t = this.$element,
            n = this.options;
        return t.attr("data-content") || ("function" == typeof n.content ? n.content.call(t[0]) : n.content)
    };
    t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    t.prototype.tip = function() {
        return this.$tip || (this.$tip = n(this.options.template)), this.$tip
    };
    i = n.fn.popover;
    n.fn.popover = r;
    n.fn.popover.Constructor = t;
    n.fn.popover.noConflict = function() {
        return n.fn.popover = i, this
    }
}(jQuery); + function(n) {
    "use strict";

    function t(i, r) {
        var u = n.proxy(this.process, this);
        this.$body = n("body");
        this.$scrollElement = n(n(i).is("body") ? window : i);
        this.options = n.extend({}, t.DEFAULTS, r);
        this.selector = (this.options.target || "") + " .nav li > a";
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on("scroll.bs.scrollspy", u);
        this.refresh();
        this.process()
    }

    function i(i) {
        return this.each(function() {
            var u = n(this),
                r = u.data("bs.scrollspy"),
                f = "object" == typeof i && i;
            r || u.data("bs.scrollspy", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    }
    t.VERSION = "3.3.1";
    t.DEFAULTS = {
        offset: 10
    };
    t.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    };
    t.prototype.refresh = function() {
        var i = "offset",
            r = 0,
            t;
        n.isWindow(this.$scrollElement[0]) || (i = "position", r = this.$scrollElement.scrollTop());
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        t = this;
        this.$body.find(this.selector).map(function() {
            var f = n(this),
                u = f.data("target") || f.attr("href"),
                t = /^#./.test(u) && n(u);
            return t && t.length && t.is(":visible") && [
                [t[i]().top + r, u]
            ] || null
        }).sort(function(n, t) {
            return n[0] - t[0]
        }).each(function() {
            t.offsets.push(this[0]);
            t.targets.push(this[1])
        })
    };
    t.prototype.process = function() {
        var n, i = this.$scrollElement.scrollTop() + this.options.offset,
            f = this.getScrollHeight(),
            e = this.options.offset + f - this.$scrollElement.height(),
            t = this.offsets,
            r = this.targets,
            u = this.activeTarget;
        if (this.scrollHeight != f && this.refresh(), i >= e) return u != (n = r[r.length - 1]) && this.activate(n);
        if (u && i < t[0]) return this.activeTarget = null, this.clear();
        for (n = t.length; n--;) u != r[n] && i >= t[n] && (!t[n + 1] || i <= t[n + 1]) && this.activate(r[n])
    };
    t.prototype.activate = function(t) {
        this.activeTarget = t;
        this.clear();
        var r = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
            i = n(r).parents("li").addClass("active");
        i.parent(".dropdown-menu").length && (i = i.closest("li.dropdown").addClass("active"));
        i.trigger("activate.bs.scrollspy")
    };
    t.prototype.clear = function() {
        n(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var r = n.fn.scrollspy;
    n.fn.scrollspy = i;
    n.fn.scrollspy.Constructor = t;
    n.fn.scrollspy.noConflict = function() {
        return n.fn.scrollspy = r, this
    };
    n(window).on("load.bs.scrollspy.data-api", function() {
        n('[data-spy="scroll"]').each(function() {
            var t = n(this);
            i.call(t, t.data())
        })
    })
}(jQuery); + function(n) {
    "use strict";

    function r(i) {
        return this.each(function() {
            var u = n(this),
                r = u.data("bs.tab");
            r || u.data("bs.tab", r = new t(this));
            "string" == typeof i && r[i]()
        })
    }
    var t = function(t) {
            this.element = n(t)
        },
        u, i;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 150;
    t.prototype.show = function() {
        var t = this.element,
            f = t.closest("ul:not(.dropdown-menu)"),
            i = t.data("target"),
            u;
        if (i || (i = t.attr("href"), i = i && i.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li").hasClass("active")) {
            var r = f.find(".active:last a"),
                e = n.Event("hide.bs.tab", {
                    relatedTarget: t[0]
                }),
                o = n.Event("show.bs.tab", {
                    relatedTarget: r[0]
                });
            (r.trigger(e), t.trigger(o), o.isDefaultPrevented() || e.isDefaultPrevented()) || (u = n(i), this.activate(t.closest("li"), f), this.activate(u, u.parent(), function() {
                r.trigger({
                    type: "hidden.bs.tab",
                    relatedTarget: t[0]
                });
                t.trigger({
                    type: "shown.bs.tab",
                    relatedTarget: r[0]
                })
            }))
        }
    };
    t.prototype.activate = function(i, r, u) {
        function e() {
            f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1);
            i.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0);
            o ? (i[0].offsetWidth, i.addClass("in")) : i.removeClass("fade");
            i.parent(".dropdown-menu") && i.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0);
            u && u()
        }
        var f = r.find("> .active"),
            o = u && n.support.transition && (f.length && f.hasClass("fade") || !!r.find("> .fade").length);
        f.length && o ? f.one("bsTransitionEnd", e).emulateTransitionEnd(t.TRANSITION_DURATION) : e();
        f.removeClass("in")
    };
    u = n.fn.tab;
    n.fn.tab = r;
    n.fn.tab.Constructor = t;
    n.fn.tab.noConflict = function() {
        return n.fn.tab = u, this
    };
    i = function(t) {
        t.preventDefault();
        r.call(n(this), "show")
    };
    n(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', i).on("click.bs.tab.data-api", '[data-toggle="pill"]', i)
}(jQuery); + function(n) {
    "use strict";

    function i(i) {
        return this.each(function() {
            var u = n(this),
                r = u.data("bs.affix"),
                f = "object" == typeof i && i;
            r || u.data("bs.affix", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    }
    var t = function(i, r) {
            this.options = n.extend({}, t.DEFAULTS, r);
            this.$target = n(this.options.target).on("scroll.bs.affix.data-api", n.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", n.proxy(this.checkPositionWithEventLoop, this));
            this.$element = n(i);
            this.affixed = this.unpin = this.pinnedOffset = null;
            this.checkPosition()
        },
        r;
    t.VERSION = "3.3.1";
    t.RESET = "affix affix-top affix-bottom";
    t.DEFAULTS = {
        offset: 0,
        target: window
    };
    t.prototype.getState = function(n, t, i, r) {
        var u = this.$target.scrollTop(),
            f = this.$element.offset(),
            e = this.$target.height();
        if (null != i && "top" == this.affixed) return i > u ? "top" : !1;
        if ("bottom" == this.affixed) return null != i ? u + this.unpin <= f.top ? !1 : "bottom" : n - r >= u + e ? !1 : "bottom";
        var o = null == this.affixed,
            s = o ? u : f.top,
            h = o ? e : t;
        return null != i && i >= s ? "top" : null != r && s + h >= n - r ? "bottom" : !1
    };
    t.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(t.RESET).addClass("affix");
        var n = this.$target.scrollTop(),
            i = this.$element.offset();
        return this.pinnedOffset = i.top - n
    };
    t.prototype.checkPositionWithEventLoop = function() {
        setTimeout(n.proxy(this.checkPosition, this), 1)
    };
    t.prototype.checkPosition = function() {
        var i, f, o;
        if (this.$element.is(":visible")) {
            var s = this.$element.height(),
                r = this.options.offset,
                e = r.top,
                u = r.bottom,
                h = n("body").height();
            if ("object" != typeof r && (u = e = r), "function" == typeof e && (e = r.top(this.$element)), "function" == typeof u && (u = r.bottom(this.$element)), i = this.getState(h, s, e, u), this.affixed != i) {
                if (null != this.unpin && this.$element.css("top", ""), f = "affix" + (i ? "-" + i : ""), o = n.Event(f + ".bs.affix"), this.$element.trigger(o), o.isDefaultPrevented()) return;
                this.affixed = i;
                this.unpin = "bottom" == i ? this.getPinnedOffset() : null;
                this.$element.removeClass(t.RESET).addClass(f).trigger(f.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == i && this.$element.offset({
                top: h - s - u
            })
        }
    };
    r = n.fn.affix;
    n.fn.affix = i;
    n.fn.affix.Constructor = t;
    n.fn.affix.noConflict = function() {
        return n.fn.affix = r, this
    };
    n(window).on("load", function() {
        n('[data-spy="affix"]').each(function() {
            var r = n(this),
                t = r.data();
            t.offset = t.offset || {};
            null != t.offsetBottom && (t.offset.bottom = t.offsetBottom);
            null != t.offsetTop && (t.offset.top = t.offsetTop);
            i.call(r, t)
        })
    })
}(jQuery),
function(n) {
    function i() {}

    function t(n) {
        function u(t) {
            t.prototype.option || (t.prototype.option = function(t) {
                n.isPlainObject(t) && (this.options = n.extend(!0, this.options, t))
            })
        }

        function f(i, u) {
            n.fn[i] = function(f) {
                var h, e, s;
                if ("string" == typeof f) {
                    for (var c = r.call(arguments, 1), o = 0, l = this.length; l > o; o++)
                        if (h = this[o], e = n.data(h, i), e)
                            if (n.isFunction(e[f]) && "_" !== f.charAt(0)) {
                                if (s = e[f].apply(e, c), void 0 !== s) return s
                            } else t("no such method '" + f + "' for " + i + " instance");
                    else t("cannot call methods on " + i + " prior to initialization; attempted to call '" + f + "'");
                    return this
                }
                return this.each(function() {
                    var t = n.data(this, i);
                    t ? (t.option(f), t._init()) : (t = new u(this, f), n.data(this, i, t))
                })
            }
        }
        if (n) {
            var t = "undefined" == typeof console ? i : function(n) {
                console.error(n)
            };
            return n.bridget = function(n, t) {
                u(t);
                f(n, t)
            }, n.bridget
        }
    }
    var r = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], t) : "object" == typeof exports ? t(require("jquery")) : t(n.jQuery)
}(window),
function(n) {
    function f(t) {
        var i = n.event;
        return i.target = i.target || i.srcElement || t, i
    }
    var t = document.documentElement,
        u = function() {},
        i, r;
    t.addEventListener ? u = function(n, t, i) {
        n.addEventListener(t, i, !1)
    } : t.attachEvent && (u = function(n, t, i) {
        n[t + i] = i.handleEvent ? function() {
            var t = f(n);
            i.handleEvent.call(i, t)
        } : function() {
            var t = f(n);
            i.call(n, t)
        };
        n.attachEvent("on" + t, n[t + i])
    });
    i = function() {};
    t.removeEventListener ? i = function(n, t, i) {
        n.removeEventListener(t, i, !1)
    } : t.detachEvent && (i = function(n, t, i) {
        n.detachEvent("on" + t, n[t + i]);
        try {
            delete n[t + i]
        } catch (r) {
            n[t + i] = void 0
        }
    });
    r = {
        bind: u,
        unbind: i
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", r) : "object" == typeof exports ? module.exports = r : n.eventie = r
}(this),
function(n) {
    function t(n) {
        "function" == typeof n && (t.isReady ? n() : f.push(n))
    }

    function r(n) {
        var r = "readystatechange" === n.type && "complete" !== i.readyState;
        t.isReady || r || e()
    }

    function e() {
        var n, i, r;
        for (t.isReady = !0, n = 0, i = f.length; i > n; n++) r = f[n], r()
    }

    function u(u) {
        return "complete" === i.readyState ? e() : (u.bind(i, "DOMContentLoaded", r), u.bind(i, "readystatechange", r), u.bind(n, "load", r)), t
    }
    var i = n.document,
        f = [];
    t.isReady = !1;
    "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], u) : "object" == typeof exports ? module.exports = u(require("eventie")) : n.docReady = u(n.eventie)
}(window),
function() {
    function t() {}

    function u(n, t) {
        for (var i = n.length; i--;)
            if (n[i].listener === t) return i;
        return -1
    }

    function i(n) {
        return function() {
            return this[n].apply(this, arguments)
        }
    }
    var n = t.prototype,
        r = this,
        f = r.EventEmitter;
    n.getListeners = function(n) {
        var r, t, i = this._getEvents();
        if (n instanceof RegExp) {
            r = {};
            for (t in i) i.hasOwnProperty(t) && n.test(t) && (r[t] = i[t])
        } else r = i[n] || (i[n] = []);
        return r
    };
    n.flattenListeners = function(n) {
        for (var i = [], t = 0; n.length > t; t += 1) i.push(n[t].listener);
        return i
    };
    n.getListenersAsObject = function(n) {
        var t, i = this.getListeners(n);
        return i instanceof Array && (t = {}, t[n] = i), t || i
    };
    n.addListener = function(n, t) {
        var i, r = this.getListenersAsObject(n),
            f = "object" == typeof t;
        for (i in r) r.hasOwnProperty(i) && -1 === u(r[i], t) && r[i].push(f ? t : {
            listener: t,
            once: !1
        });
        return this
    };
    n.on = i("addListener");
    n.addOnceListener = function(n, t) {
        return this.addListener(n, {
            listener: t,
            once: !0
        })
    };
    n.once = i("addOnceListener");
    n.defineEvent = function(n) {
        return this.getListeners(n), this
    };
    n.defineEvents = function(n) {
        for (var t = 0; n.length > t; t += 1) this.defineEvent(n[t]);
        return this
    };
    n.removeListener = function(n, t) {
        var f, i, r = this.getListenersAsObject(n);
        for (i in r) r.hasOwnProperty(i) && (f = u(r[i], t), -1 !== f && r[i].splice(f, 1));
        return this
    };
    n.off = i("removeListener");
    n.addListeners = function(n, t) {
        return this.manipulateListeners(!1, n, t)
    };
    n.removeListeners = function(n, t) {
        return this.manipulateListeners(!0, n, t)
    };
    n.manipulateListeners = function(n, t, i) {
        var r, u, f = n ? this.removeListener : this.addListener,
            e = n ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (r = i.length; r--;) f.call(this, t, i[r]);
        else
            for (r in t) t.hasOwnProperty(r) && (u = t[r]) && ("function" == typeof u ? f.call(this, r, u) : e.call(this, r, u));
        return this
    };
    n.removeEvent = function(n) {
        var t, r = typeof n,
            i = this._getEvents();
        if ("string" === r) delete i[n];
        else if (n instanceof RegExp)
            for (t in i) i.hasOwnProperty(t) && n.test(t) && delete i[t];
        else delete this._events;
        return this
    };
    n.removeAllListeners = i("removeEvent");
    n.emitEvent = function(n, t) {
        var i, f, r, e, u = this.getListenersAsObject(n);
        for (r in u)
            if (u.hasOwnProperty(r))
                for (f = u[r].length; f--;) i = u[r][f], i.once === !0 && this.removeListener(n, i.listener), e = i.listener.apply(this, t || []), e === this._getOnceReturnValue() && this.removeListener(n, i.listener);
        return this
    };
    n.trigger = i("emitEvent");
    n.emit = function(n) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(n, t)
    };
    n.setOnceReturnValue = function(n) {
        return this._onceReturnValue = n, this
    };
    n._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    };
    n._getEvents = function() {
        return this._events || (this._events = {})
    };
    t.noConflict = function() {
        return r.EventEmitter = f, t
    };
    "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return t
    }) : "object" == typeof module && module.exports ? module.exports = t : r.EventEmitter = t
}.call(this),
    function(n) {
        function t(n) {
            if (n) {
                if ("string" == typeof r[n]) return n;
                n = n.charAt(0).toUpperCase() + n.slice(1);
                for (var t, u = 0, f = i.length; f > u; u++)
                    if (t = i[u] + n, "string" == typeof r[t]) return t
            }
        }
        var i = "Webkit Moz ms Ms O".split(" "),
            r = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return t
        }) : "object" == typeof exports ? module.exports = t : n.getStyleProperty = t
    }(window),
    function(n) {
        function i(n) {
            var t = parseFloat(n),
                i = -1 === n.indexOf("%") && !isNaN(t);
            return i && t
        }

        function u() {}

        function f() {
            for (var r, i = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, n = 0, u = t.length; u > n; n++) r = t[n], i[r] = 0;
            return i
        }

        function r(r) {
            function c() {
                var f, t, c, l;
                h || (h = !0, f = n.getComputedStyle, (o = function() {
                    var n = f ? function(n) {
                        return f(n, null)
                    } : function(n) {
                        return n.currentStyle
                    };
                    return function(t) {
                        var i = n(t);
                        return i || e("Style returned " + i + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), i
                    }
                }(), u = r("boxSizing")) && (t = document.createElement("div"), t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[u] = "border-box", c = document.body || document.documentElement, c.appendChild(t), l = o(t), s = 200 === i(l.width), c.removeChild(t)))
            }

            function l(n) {
                var e, r, v, h, y, p;
                if (c(), "string" == typeof n && (n = document.querySelector(n)), n && "object" == typeof n && n.nodeType) {
                    if (e = o(n), "none" === e.display) return f();
                    r = {};
                    r.width = n.offsetWidth;
                    r.height = n.offsetHeight;
                    for (var tt = r.isBorderBox = !(!u || !e[u] || "border-box" !== e[u]), l = 0, it = t.length; it > l; l++) v = t[l], h = e[v], h = a(n, h), y = parseFloat(h), r[v] = isNaN(y) ? 0 : y;
                    var w = r.paddingLeft + r.paddingRight,
                        b = r.paddingTop + r.paddingBottom,
                        rt = r.marginLeft + r.marginRight,
                        ut = r.marginTop + r.marginBottom,
                        k = r.borderLeftWidth + r.borderRightWidth,
                        d = r.borderTopWidth + r.borderBottomWidth,
                        g = tt && s,
                        nt = i(e.width);
                    return nt !== !1 && (r.width = nt + (g ? 0 : w + k)), p = i(e.height), p !== !1 && (r.height = p + (g ? 0 : b + d)), r.innerWidth = r.width - (w + k), r.innerHeight = r.height - (b + d), r.outerWidth = r.width + rt, r.outerHeight = r.height + ut, r
                }
            }

            function a(t, i) {
                if (n.getComputedStyle || -1 === i.indexOf("%")) return i;
                var r = t.style,
                    e = r.left,
                    u = t.runtimeStyle,
                    f = u && u.left;
                return f && (u.left = t.currentStyle.left), r.left = i, i = r.pixelLeft, r.left = e, f && (u.left = f), i
            }
            var o, u, s, h = !1;
            return l
        }
        var e = "undefined" == typeof console ? u : function(n) {
                console.error(n)
            },
            t = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], r) : "object" == typeof exports ? module.exports = r(require("desandro-get-style-property")) : n.getSize = r(n.getStyleProperty)
    }(window),
    function(n) {
        function i(n, t) {
            return n[u](t)
        }

        function r(n) {
            if (!n.parentNode) {
                var t = document.createDocumentFragment();
                t.appendChild(n)
            }
        }

        function o(n, t) {
            r(n);
            for (var u = n.parentNode.querySelectorAll(t), i = 0, f = u.length; f > i; i++)
                if (u[i] === n) return !0;
            return !1
        }

        function s(n, t) {
            return r(n), i(n, t)
        }
        var t, u = function() {
                var u, i;
                if (n.matchesSelector) return "matchesSelector";
                for (var r = ["webkit", "moz", "ms", "o"], t = 0, f = r.length; f > t; t++)
                    if (u = r[t], i = u + "MatchesSelector", n[i]) return i
            }(),
            f, e;
        u ? (f = document.createElement("div"), e = i(f, "div"), t = e ? i : s) : t = o;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return t
        }) : "object" == typeof exports ? module.exports = t : window.matchesSelector = t
    }(Element.prototype),
    function(n) {
        function r(n, t) {
            for (var i in t) n[i] = t[i];
            return n
        }

        function u(n) {
            for (var t in n) return !1;
            return t = null, !0
        }

        function f(n) {
            return n.replace(/([A-Z])/g, function(n) {
                return "-" + n.toLowerCase()
            })
        }

        function t(n, t, i) {
            function o(n, t) {
                n && (this.element = n, this.layout = t, this.position = {
                    x: 0,
                    y: 0
                }, this._create())
            }
            var s = i("transition"),
                h = i("transform"),
                w = s && h,
                b = !!i("perspective"),
                c = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "otransitionend",
                    transition: "transitionend"
                }[s],
                l = ["transform", "transition", "transitionDuration", "transitionProperty"],
                k = function() {
                    for (var n, t, u = {}, r = 0, f = l.length; f > r; r++) n = l[r], t = i(n), t && t !== n && (u[n] = t);
                    return u
                }(),
                a, v, y, p;
            return r(o.prototype, n.prototype), o.prototype._create = function() {
                this._transn = {
                    ingProperties: {},
                    clean: {},
                    onEnd: {}
                };
                this.css({
                    position: "absolute"
                })
            }, o.prototype.handleEvent = function(n) {
                var t = "on" + n.type;
                this[t] && this[t](n)
            }, o.prototype.getSize = function() {
                this.size = t(this.element)
            }, o.prototype.css = function(n) {
                var r = this.element.style,
                    t, i;
                for (t in n) i = k[t] || t, r[i] = n[t]
            }, o.prototype.getPosition = function() {
                var r = e(this.element),
                    u = this.layout.options,
                    f = u.isOriginLeft,
                    o = u.isOriginTop,
                    n = parseInt(r[f ? "left" : "right"], 10),
                    t = parseInt(r[o ? "top" : "bottom"], 10),
                    i;
                n = isNaN(n) ? 0 : n;
                t = isNaN(t) ? 0 : t;
                i = this.layout.size;
                n -= f ? i.paddingLeft : i.paddingRight;
                t -= o ? i.paddingTop : i.paddingBottom;
                this.position.x = n;
                this.position.y = t
            }, o.prototype.layoutPosition = function() {
                var t = this.layout.size,
                    i = this.layout.options,
                    n = {};
                i.isOriginLeft ? (n.left = this.position.x + t.paddingLeft + "px", n.right = "") : (n.right = this.position.x + t.paddingRight + "px", n.left = "");
                i.isOriginTop ? (n.top = this.position.y + t.paddingTop + "px", n.bottom = "") : (n.bottom = this.position.y + t.paddingBottom + "px", n.top = "");
                this.css(n);
                this.emitEvent("layout", [this])
            }, a = b ? function(n, t) {
                return "translate3d(" + n + "px, " + t + "px, 0)"
            } : function(n, t) {
                return "translate(" + n + "px, " + t + "px)"
            }, o.prototype._transitionTo = function(n, t) {
                this.getPosition();
                var e = this.position.x,
                    o = this.position.y,
                    s = parseInt(n, 10),
                    h = parseInt(t, 10),
                    c = s === this.position.x && h === this.position.y;
                if (this.setPosition(n, t), c && !this.isTransitioning) return this.layoutPosition(), void 0;
                var i = n - e,
                    r = t - o,
                    u = {},
                    f = this.layout.options;
                i = f.isOriginLeft ? i : -i;
                r = f.isOriginTop ? r : -r;
                u.transform = a(i, r);
                this.transition({
                    to: u,
                    onTransitionEnd: {
                        transform: this.layoutPosition
                    },
                    isCleaning: !0
                })
            }, o.prototype.goTo = function(n, t) {
                this.setPosition(n, t);
                this.layoutPosition()
            }, o.prototype.moveTo = w ? o.prototype._transitionTo : o.prototype.goTo, o.prototype.setPosition = function(n, t) {
                this.position.x = parseInt(n, 10);
                this.position.y = parseInt(t, 10)
            }, o.prototype._nonTransition = function(n) {
                this.css(n.to);
                n.isCleaning && this._removeStyles(n.to);
                for (var t in n.onTransitionEnd) n.onTransitionEnd[t].call(this)
            }, o.prototype._transition = function(n) {
                var i, t, r;
                if (!parseFloat(this.layout.options.transitionDuration)) return this._nonTransition(n), void 0;
                i = this._transn;
                for (t in n.onTransitionEnd) i.onEnd[t] = n.onTransitionEnd[t];
                for (t in n.to) i.ingProperties[t] = !0, n.isCleaning && (i.clean[t] = !0);
                n.from && (this.css(n.from), r = this.element.offsetHeight, r = null);
                this.enableTransition(n.to);
                this.css(n.to);
                this.isTransitioning = !0
            }, v = h && f(h) + ",opacity", o.prototype.enableTransition = function() {
                this.isTransitioning || (this.css({
                    transitionProperty: v,
                    transitionDuration: this.layout.options.transitionDuration
                }), this.element.addEventListener(c, this, !1))
            }, o.prototype.transition = o.prototype[s ? "_transition" : "_nonTransition"], o.prototype.onwebkitTransitionEnd = function(n) {
                this.ontransitionend(n)
            }, o.prototype.onotransitionend = function(n) {
                this.ontransitionend(n)
            }, y = {
                "-webkit-transform": "transform",
                "-moz-transform": "transform",
                "-o-transform": "transform"
            }, o.prototype.ontransitionend = function(n) {
                var t, i, r;
                n.target === this.element && (t = this._transn, i = y[n.propertyName] || n.propertyName, (delete t.ingProperties[i], u(t.ingProperties) && this.disableTransition(), i in t.clean && (this.element.style[n.propertyName] = "", delete t.clean[i]), i in t.onEnd) && (r = t.onEnd[i], r.call(this), delete t.onEnd[i]), this.emitEvent("transitionEnd", [this]))
            }, o.prototype.disableTransition = function() {
                this.removeTransitionStyles();
                this.element.removeEventListener(c, this, !1);
                this.isTransitioning = !1
            }, o.prototype._removeStyles = function(n) {
                var t = {},
                    i;
                for (i in n) t[i] = "";
                this.css(t)
            }, p = {
                transitionProperty: "",
                transitionDuration: ""
            }, o.prototype.removeTransitionStyles = function() {
                this.css(p)
            }, o.prototype.removeElem = function() {
                this.element.parentNode.removeChild(this.element);
                this.emitEvent("remove", [this])
            }, o.prototype.remove = function() {
                if (!s || !parseFloat(this.layout.options.transitionDuration)) return this.removeElem(), void 0;
                var n = this;
                this.on("transitionEnd", function() {
                    return n.removeElem(), !0
                });
                this.hide()
            }, o.prototype.reveal = function() {
                delete this.isHidden;
                this.css({
                    display: ""
                });
                var n = this.layout.options;
                this.transition({
                    from: n.hiddenStyle,
                    to: n.visibleStyle,
                    isCleaning: !0
                })
            }, o.prototype.hide = function() {
                this.isHidden = !0;
                this.css({
                    display: ""
                });
                var n = this.layout.options;
                this.transition({
                    from: n.visibleStyle,
                    to: n.hiddenStyle,
                    isCleaning: !0,
                    onTransitionEnd: {
                        opacity: function() {
                            this.isHidden && this.css({
                                display: "none"
                            })
                        }
                    }
                })
            }, o.prototype.destroy = function() {
                this.css({
                    position: "",
                    left: "",
                    right: "",
                    top: "",
                    bottom: "",
                    transition: "",
                    transform: ""
                })
            }, o
        }
        var i = n.getComputedStyle,
            e = i ? function(n) {
                return i(n, null)
            } : function(n) {
                return n.currentStyle
            };
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property"], t) : "object" == typeof exports ? module.exports = t(require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property")) : (n.Outlayer = {}, n.Outlayer.Item = t(n.EventEmitter, n.getSize, n.getStyleProperty))
    }(window),
    function(n) {
        function t(n, t) {
            for (var i in t) n[i] = t[i];
            return n
        }

        function c(n) {
            return "[object Array]" === a.call(n)
        }

        function u(n) {
            var t = [],
                i, r;
            if (c(n)) t = n;
            else if (n && "number" == typeof n.length)
                for (i = 0, r = n.length; r > i; i++) t.push(n[i]);
            else t.push(n);
            return t
        }

        function o(n, t) {
            var i = v(t, n); - 1 !== i && t.splice(i, 1)
        }

        function l(n) {
            return n.replace(/(.)([A-Z])/g, function(n, t, i) {
                return t + "-" + i
            }).toLowerCase()
        }

        function f(f, c, a, v, y, p) {
            function w(n, i) {
                if ("string" == typeof n && (n = s.querySelector(n)), !n || !e(n)) return r && r.error("Bad " + this.constructor.namespace + " element: " + n), void 0;
                this.element = n;
                this.options = t({}, this.constructor.defaults);
                this.option(i);
                var u = ++k;
                this.element.outlayerGUID = u;
                b[u] = this;
                this._create();
                this.options.isInitLayout && this.layout()
            }
            var k = 0,
                b = {};
            return w.namespace = "outlayer", w.Item = p, w.defaults = {
                containerStyle: {
                    position: "relative"
                },
                isInitLayout: !0,
                isOriginLeft: !0,
                isOriginTop: !0,
                isResizeBound: !0,
                isResizingContainer: !0,
                transitionDuration: "0.4s",
                hiddenStyle: {
                    opacity: 0,
                    transform: "scale(0.001)"
                },
                visibleStyle: {
                    opacity: 1,
                    transform: "scale(1)"
                }
            }, t(w.prototype, a.prototype), w.prototype.option = function(n) {
                t(this.options, n)
            }, w.prototype._create = function() {
                this.reloadItems();
                this.stamps = [];
                this.stamp(this.options.stamp);
                t(this.element.style, this.options.containerStyle);
                this.options.isResizeBound && this.bindResize()
            }, w.prototype.reloadItems = function() {
                this.items = this._itemize(this.element.children)
            }, w.prototype._itemize = function(n) {
                for (var u, f, i = this._filterFindItemElements(n), e = this.constructor.Item, r = [], t = 0, o = i.length; o > t; t++) u = i[t], f = new e(u, this), r.push(f);
                return r
            }, w.prototype._filterFindItemElements = function(n) {
                var t;
                n = u(n);
                for (var r = this.options.itemSelector, i = [], f = 0, h = n.length; h > f; f++)
                    if (t = n[f], e(t))
                        if (r) {
                            y(t, r) && i.push(t);
                            for (var s = t.querySelectorAll(r), o = 0, c = s.length; c > o; o++) i.push(s[o])
                        } else i.push(t);
                return i
            }, w.prototype.getItemElements = function() {
                for (var t = [], n = 0, i = this.items.length; i > n; n++) t.push(this.items[n].element);
                return t
            }, w.prototype.layout = function() {
                this._resetLayout();
                this._manageStamps();
                var n = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                this.layoutItems(this.items, n);
                this._isLayoutInited = !0
            }, w.prototype._init = w.prototype.layout, w.prototype._resetLayout = function() {
                this.getSize()
            }, w.prototype.getSize = function() {
                this.size = v(this.element)
            }, w.prototype._getMeasurement = function(n, t) {
                var r, i = this.options[n];
                i ? ("string" == typeof i ? r = this.element.querySelector(i) : e(i) && (r = i), this[n] = r ? v(r)[t] : i) : this[n] = 0
            }, w.prototype.layoutItems = function(n, t) {
                n = this._getItemsForLayout(n);
                this._layoutItems(n, t);
                this._postLayout()
            }, w.prototype._getItemsForLayout = function(n) {
                for (var i, r = [], t = 0, u = n.length; u > t; t++) i = n[t], i.isIgnored || r.push(i);
                return r
            }, w.prototype._layoutItems = function(n, t) {
                function f() {
                    e.emitEvent("layoutComplete", [e, n])
                }
                var e = this,
                    i, r;
                if (!n || !n.length) return f(), void 0;
                this._itemsOn(n, "layout", f);
                for (var o = [], u = 0, s = n.length; s > u; u++) i = n[u], r = this._getItemLayoutPosition(i), r.item = i, r.isInstant = t || i.isLayoutInstant, o.push(r);
                this._processLayoutQueue(o)
            }, w.prototype._getItemLayoutPosition = function() {
                return {
                    x: 0,
                    y: 0
                }
            }, w.prototype._processLayoutQueue = function(n) {
                for (var t, i = 0, r = n.length; r > i; i++) t = n[i], this._positionItem(t.item, t.x, t.y, t.isInstant)
            }, w.prototype._positionItem = function(n, t, i, r) {
                r ? n.goTo(t, i) : n.moveTo(t, i)
            }, w.prototype._postLayout = function() {
                this.resizeContainer()
            }, w.prototype.resizeContainer = function() {
                if (this.options.isResizingContainer) {
                    var n = this._getContainerSize();
                    n && (this._setContainerMeasure(n.width, !0), this._setContainerMeasure(n.height, !1))
                }
            }, w.prototype._getContainerSize = h, w.prototype._setContainerMeasure = function(n, t) {
                if (void 0 !== n) {
                    var i = this.size;
                    i.isBorderBox && (n += t ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth);
                    n = Math.max(n, 0);
                    this.element.style[t ? "width" : "height"] = n + "px"
                }
            }, w.prototype._itemsOn = function(n, t, i) {
                function e() {
                    return u++, u === o && i.call(s), !0
                }
                for (var f, u = 0, o = n.length, s = this, r = 0, h = n.length; h > r; r++) {
                    f = n[r];
                    f.on(t, e)
                }
            }, w.prototype.ignore = function(n) {
                var t = this.getItem(n);
                t && (t.isIgnored = !0)
            }, w.prototype.unignore = function(n) {
                var t = this.getItem(n);
                t && delete t.isIgnored
            }, w.prototype.stamp = function(n) {
                var t, i, r;
                if (n = this._find(n))
                    for (this.stamps = this.stamps.concat(n), t = 0, i = n.length; i > t; t++) r = n[t], this.ignore(r)
            }, w.prototype.unstamp = function(n) {
                var t, r, i;
                if (n = this._find(n))
                    for (t = 0, r = n.length; r > t; t++) i = n[t], o(i, this.stamps), this.unignore(i)
            }, w.prototype._find = function(n) {
                if (n) return ("string" == typeof n && (n = this.element.querySelectorAll(n)), n = u(n))
            }, w.prototype._manageStamps = function() {
                var n, t, i;
                if (this.stamps && this.stamps.length)
                    for (this._getBoundingRect(), n = 0, t = this.stamps.length; t > n; n++) i = this.stamps[n], this._manageStamp(i)
            }, w.prototype._getBoundingRect = function() {
                var t = this.element.getBoundingClientRect(),
                    n = this.size;
                this._boundingRect = {
                    left: t.left + n.paddingLeft + n.borderLeftWidth,
                    top: t.top + n.paddingTop + n.borderTopWidth,
                    right: t.right - (n.paddingRight + n.borderRightWidth),
                    bottom: t.bottom - (n.paddingBottom + n.borderBottomWidth)
                }
            }, w.prototype._manageStamp = h, w.prototype._getElementOffset = function(n) {
                var t = n.getBoundingClientRect(),
                    i = this._boundingRect,
                    r = v(n);
                return {
                    left: t.left - i.left - r.marginLeft,
                    top: t.top - i.top - r.marginTop,
                    right: i.right - t.right - r.marginRight,
                    bottom: i.bottom - t.bottom - r.marginBottom
                }
            }, w.prototype.handleEvent = function(n) {
                var t = "on" + n.type;
                this[t] && this[t](n)
            }, w.prototype.bindResize = function() {
                this.isResizeBound || (f.bind(n, "resize", this), this.isResizeBound = !0)
            }, w.prototype.unbindResize = function() {
                this.isResizeBound && f.unbind(n, "resize", this);
                this.isResizeBound = !1
            }, w.prototype.onresize = function() {
                function t() {
                    n.resize();
                    delete n.resizeTimeout
                }
                this.resizeTimeout && clearTimeout(this.resizeTimeout);
                var n = this;
                this.resizeTimeout = setTimeout(t, 100)
            }, w.prototype.resize = function() {
                this.isResizeBound && this.needsResizeLayout() && this.layout()
            }, w.prototype.needsResizeLayout = function() {
                var n = v(this.element),
                    t = this.size && n;
                return t && n.innerWidth !== this.size.innerWidth
            }, w.prototype.addItems = function(n) {
                var t = this._itemize(n);
                return t.length && (this.items = this.items.concat(t)), t
            }, w.prototype.appended = function(n) {
                var t = this.addItems(n);
                t.length && (this.layoutItems(t, !0), this.reveal(t))
            }, w.prototype.prepended = function(n) {
                var t = this._itemize(n),
                    i;
                t.length && (i = this.items.slice(0), this.items = t.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(t, !0), this.reveal(t), this.layoutItems(i))
            }, w.prototype.reveal = function(n) {
                var i = n && n.length,
                    t, r;
                if (i)
                    for (t = 0; i > t; t++) r = n[t], r.reveal()
            }, w.prototype.hide = function(n) {
                var i = n && n.length,
                    t, r;
                if (i)
                    for (t = 0; i > t; t++) r = n[t], r.hide()
            }, w.prototype.getItem = function(n) {
                for (var i, t = 0, r = this.items.length; r > t; t++)
                    if (i = this.items[t], i.element === n) return i
            }, w.prototype.getItems = function(n) {
                var u, i;
                if (n && n.length) {
                    for (var r = [], t = 0, f = n.length; f > t; t++) u = n[t], i = this.getItem(u), i && r.push(i);
                    return r
                }
            }, w.prototype.remove = function(n) {
                var t, i, f, r;
                if (n = u(n), t = this.getItems(n), t && t.length)
                    for (this._itemsOn(t, "remove", function() {
                            this.emitEvent("removeComplete", [this, t])
                        }), i = 0, f = t.length; f > i; i++) r = t[i], r.remove(), o(r, this.items)
            }, w.prototype.destroy = function() {
                var t = this.element.style,
                    n, r, u, f;
                for (t.height = "", t.position = "", t.width = "", n = 0, r = this.items.length; r > n; n++) u = this.items[n], u.destroy();
                this.unbindResize();
                f = this.element.outlayerGUID;
                delete b[f];
                delete this.element.outlayerGUID;
                i && i.removeData(this.element, this.constructor.namespace)
            }, w.data = function(n) {
                var t = n && n.outlayerGUID;
                return t && b[t]
            }, w.create = function(n, u) {
                function f() {
                    w.apply(this, arguments)
                }
                return Object.create ? f.prototype = Object.create(w.prototype) : t(f.prototype, w.prototype), f.prototype.constructor = f, f.defaults = t({}, w.defaults), t(f.defaults, u), f.prototype.settings = {}, f.namespace = n, f.data = w.data, f.Item = function() {
                    p.apply(this, arguments)
                }, f.Item.prototype = new p, c(function() {
                    for (var a, t, e, v, o = l(n), h = s.querySelectorAll(".js-" + o), c = "data-" + o + "-options", u = 0, y = h.length; y > u; u++) {
                        t = h[u];
                        e = t.getAttribute(c);
                        try {
                            a = e && JSON.parse(e)
                        } catch (p) {
                            r && r.error("Error parsing " + c + " on " + t.nodeName.toLowerCase() + (t.id ? "#" + t.id : "") + ": " + p);
                            continue
                        }
                        v = new f(t, a);
                        i && i.data(t, n, v)
                    }
                }), i && i.bridget && i.bridget(n, f), f
            }, w.Item = p, w
        }
        var s = n.document,
            r = n.console,
            i = n.jQuery,
            h = function() {},
            a = Object.prototype.toString,
            e = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(n) {
                return n instanceof HTMLElement
            } : function(n) {
                return n && "object" == typeof n && 1 === n.nodeType && "string" == typeof n.nodeName
            },
            v = Array.prototype.indexOf ? function(n, t) {
                return n.indexOf(t)
            } : function(n, t) {
                for (var i = 0, r = n.length; r > i; i++)
                    if (n[i] === t) return i;
                return -1
            };
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item"], f) : "object" == typeof exports ? module.exports = f(require("eventie"), require("doc-ready"), require("wolfy87-eventemitter"), require("get-size"), require("desandro-matches-selector"), require("./item")) : n.Outlayer = f(n.eventie, n.docReady, n.EventEmitter, n.getSize, n.matchesSelector, n.Outlayer.Item)
    }(window),
    function(n) {
        function t(n) {
            function t() {
                n.Item.apply(this, arguments)
            }
            t.prototype = new n.Item;
            t.prototype._create = function() {
                this.id = this.layout.itemGUID++;
                n.Item.prototype._create.call(this);
                this.sortData = {}
            };
            t.prototype.updateSortData = function() {
                var t, i, n, r;
                if (!this.isIgnored) {
                    this.sortData.id = this.id;
                    this.sortData["original-order"] = this.id;
                    this.sortData.random = Math.random();
                    t = this.layout.options.getSortData;
                    i = this.layout._sorters;
                    for (n in t) r = i[n], this.sortData[n] = r(this.element, this)
                }
            };
            var i = t.prototype.destroy;
            return t.prototype.destroy = function() {
                i.apply(this, arguments);
                this.css({
                    display: ""
                })
            }, t
        }
        "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], t) : "object" == typeof exports ? module.exports = t(require("outlayer")) : (n.Isotope = n.Isotope || {}, n.Isotope.Item = t(n.Outlayer))
    }(window),
    function(n) {
        function t(n, t) {
            function i(n) {
                this.isotope = n;
                n && (this.options = n.options[this.namespace], this.element = n.element, this.items = n.filteredItems, this.size = n.size)
            }
            return function() {
                function f(n) {
                    return function() {
                        return t.prototype[n].apply(this.isotope, arguments)
                    }
                }
                for (var r, u = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], n = 0, e = u.length; e > n; n++) r = u[n], i.prototype[r] = f(r)
            }(), i.prototype.needsVerticalResizeLayout = function() {
                var t = n(this.isotope.element),
                    i = this.isotope.size && t;
                return i && t.innerHeight !== this.isotope.size.innerHeight
            }, i.prototype._getMeasurement = function() {
                this.isotope._getMeasurement.apply(this, arguments)
            }, i.prototype.getColumnWidth = function() {
                this.getSegmentSize("column", "Width")
            }, i.prototype.getRowHeight = function() {
                this.getSegmentSize("row", "Height")
            }, i.prototype.getSegmentSize = function(n, t) {
                var i = n + t,
                    u = "outer" + t,
                    r;
                (this._getMeasurement(i, u), this[i]) || (r = this.getFirstItemSize(), this[i] = r && r[u] || this.isotope.size["inner" + t])
            }, i.prototype.getFirstItemSize = function() {
                var t = this.isotope.filteredItems[0];
                return t && t.element && n(t.element)
            }, i.prototype.layout = function() {
                this.isotope.layout.apply(this.isotope, arguments)
            }, i.prototype.getSize = function() {
                this.isotope.getSize();
                this.size = this.isotope.size
            }, i.modes = {}, i.create = function(n, t) {
                function r() {
                    i.apply(this, arguments)
                }
                return r.prototype = new i, t && (r.options = t), r.prototype.namespace = n, i.modes[n] = r, r
            }, i
        }
        "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], t) : "object" == typeof exports ? module.exports = t(require("get-size"), require("outlayer")) : (n.Isotope = n.Isotope || {}, n.Isotope.LayoutMode = t(n.getSize, n.Outlayer))
    }(window),
    function(n) {
        function t(n, t) {
            var r = n.create("masonry");
            return r.prototype._resetLayout = function() {
                this.getSize();
                this._getMeasurement("columnWidth", "outerWidth");
                this._getMeasurement("gutter", "outerWidth");
                this.measureColumns();
                var n = this.cols;
                for (this.colYs = []; n--;) this.colYs.push(0);
                this.maxY = 0
            }, r.prototype.measureColumns = function() {
                if (this.getContainerWidth(), !this.columnWidth) {
                    var n = this.items[0],
                        i = n && n.element;
                    this.columnWidth = i && t(i).outerWidth || this.containerWidth
                }
                this.columnWidth += this.gutter;
                this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth);
                this.cols = Math.max(this.cols, 1)
            }, r.prototype.getContainerWidth = function() {
                var i = this.options.isFitWidth ? this.element.parentNode : this.element,
                    n = t(i);
                this.containerWidth = n && n.innerWidth
            }, r.prototype._getItemLayoutPosition = function(n) {
                n.getSize();
                var e = n.size.outerWidth % this.columnWidth,
                    s = e && 1 > e ? "round" : "ceil",
                    t = Math[s](n.size.outerWidth / this.columnWidth);
                t = Math.min(t, this.cols);
                for (var r = this._getColGroup(t), u = Math.min.apply(Math, r), o = i(r, u), h = {
                        x: this.columnWidth * o,
                        y: u
                    }, c = u + n.size.outerHeight, l = this.cols + 1 - r.length, f = 0; l > f; f++) this.colYs[o + f] = c;
                return h
            }, r.prototype._getColGroup = function(n) {
                var r;
                if (2 > n) return this.colYs;
                for (var i = [], u = this.cols + 1 - n, t = 0; u > t; t++) r = this.colYs.slice(t, t + n), i[t] = Math.max.apply(Math, r);
                return i
            }, r.prototype._manageStamp = function(n) {
                var e = t(n),
                    u = this._getElementOffset(n),
                    o = this.options.isOriginLeft ? u.left : u.right,
                    s = o + e.outerWidth,
                    f = Math.floor(o / this.columnWidth),
                    i, h, r;
                for (f = Math.max(0, f), i = Math.floor(s / this.columnWidth), i -= s % this.columnWidth ? 0 : 1, i = Math.min(this.cols - 1, i), h = (this.options.isOriginTop ? u.top : u.bottom) + e.outerHeight, r = f; i >= r; r++) this.colYs[r] = Math.max(h, this.colYs[r])
            }, r.prototype._getContainerSize = function() {
                this.maxY = Math.max.apply(Math, this.colYs);
                var n = {
                    height: this.maxY
                };
                return this.options.isFitWidth && (n.width = this._getContainerFitWidth()), n
            }, r.prototype._getContainerFitWidth = function() {
                for (var n = 0, t = this.cols; --t && 0 === this.colYs[t];) n++;
                return (this.cols - n) * this.columnWidth - this.gutter
            }, r.prototype.needsResizeLayout = function() {
                var n = this.containerWidth;
                return this.getContainerWidth(), n !== this.containerWidth
            }, r
        }
        var i = Array.prototype.indexOf ? function(n, t) {
            return n.indexOf(t)
        } : function(n, t) {
            for (var u, i = 0, r = n.length; r > i; i++)
                if (u = n[i], u === t) return i;
            return -1
        };
        "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], t) : "object" == typeof exports ? module.exports = t(require("outlayer"), require("get-size")) : n.Masonry = t(n.Outlayer, n.getSize)
    }(window),
    function(n) {
        function i(n, t) {
            for (var i in t) n[i] = t[i];
            return n
        }

        function t(n, t) {
            var r = n.create("masonry"),
                e = r.prototype._getElementOffset,
                o = r.prototype.layout,
                s = r.prototype._getMeasurement,
                u, f;
            return i(r.prototype, t.prototype), r.prototype._getElementOffset = e, r.prototype.layout = o, r.prototype._getMeasurement = s, u = r.prototype.measureColumns, r.prototype.measureColumns = function() {
                this.items = this.isotope.filteredItems;
                u.call(this)
            }, f = r.prototype._manageStamp, r.prototype._manageStamp = function() {
                this.options.isOriginLeft = this.isotope.options.isOriginLeft;
                this.options.isOriginTop = this.isotope.options.isOriginTop;
                f.apply(this, arguments)
            }, r
        }
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], t) : "object" == typeof exports ? module.exports = t(require("../layout-mode"), require("masonry-layout")) : t(n.Isotope.LayoutMode, n.Masonry)
    }(window),
    function(n) {
        function t(n) {
            var t = n.create("fitRows");
            return t.prototype._resetLayout = function() {
                this.x = 0;
                this.y = 0;
                this.maxY = 0;
                this._getMeasurement("gutter", "outerWidth")
            }, t.prototype._getItemLayoutPosition = function(n) {
                var t, i, r;
                return n.getSize(), t = n.size.outerWidth + this.gutter, i = this.isotope.size.innerWidth + this.gutter, 0 !== this.x && t + this.x > i && (this.x = 0, this.y = this.maxY), r = {
                    x: this.x,
                    y: this.y
                }, this.maxY = Math.max(this.maxY, this.y + n.size.outerHeight), this.x += t, r
            }, t.prototype._getContainerSize = function() {
                return {
                    height: this.maxY
                }
            }, t
        }
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], t) : "object" == typeof exports ? module.exports = t(require("../layout-mode")) : t(n.Isotope.LayoutMode)
    }(window),
    function(n) {
        function t(n) {
            var t = n.create("vertical", {
                horizontalAlignment: 0
            });
            return t.prototype._resetLayout = function() {
                this.y = 0
            }, t.prototype._getItemLayoutPosition = function(n) {
                n.getSize();
                var t = (this.isotope.size.innerWidth - n.size.outerWidth) * this.options.horizontalAlignment,
                    i = this.y;
                return this.y += n.size.outerHeight, {
                    x: t,
                    y: i
                }
            }, t.prototype._getContainerSize = function() {
                return {
                    height: this.y
                }
            }, t
        }
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], t) : "object" == typeof exports ? module.exports = t(require("../layout-mode")) : t(n.Isotope.LayoutMode)
    }(window),
    function(n) {
        function u(n, t) {
            for (var i in t) n[i] = t[i];
            return n
        }

        function f(n) {
            return "[object Array]" === c.call(n)
        }

        function i(n) {
            var t = [],
                i, r;
            if (f(n)) t = n;
            else if (n && "number" == typeof n.length)
                for (i = 0, r = n.length; r > i; i++) t.push(n[i]);
            else t.push(n);
            return t
        }

        function e(n, t) {
            var i = l(t, n); - 1 !== i && t.splice(i, 1)
        }

        function t(n, t, f, s, c) {
            function y(n, t) {
                return function(i, r) {
                    for (var h, c, u = 0, s = n.length; s > u; u++) {
                        var f = n[u],
                            e = i.sortData[f],
                            o = r.sortData[f];
                        if (e > o || o > e) return h = void 0 !== t[f] ? t[f] : t, c = h ? 1 : -1, (e > o ? 1 : -1) * c
                    }
                    return 0
                }
            }
            var l = n.create("isotope", {
                    layoutMode: "masonry",
                    isJQueryFiltering: !0,
                    sortAscending: !0
                }),
                a, v;
            return l.Item = s, l.LayoutMode = c, l.prototype._create = function() {
                this.itemGUID = 0;
                this._sorters = {};
                this._getSorters();
                n.prototype._create.call(this);
                this.modes = {};
                this.filteredItems = this.items;
                this.sortHistory = ["original-order"];
                for (var t in c.modes) this._initLayoutMode(t)
            }, l.prototype.reloadItems = function() {
                this.itemGUID = 0;
                n.prototype.reloadItems.call(this)
            }, l.prototype._itemize = function() {
                for (var r, t = n.prototype._itemize.apply(this, arguments), i = 0, u = t.length; u > i; i++) r = t[i], r.id = this.itemGUID++;
                return this._updateItemsSortData(t), t
            }, l.prototype._initLayoutMode = function(n) {
                var t = c.modes[n],
                    i = this.options[n] || {};
                this.options[n] = t.options ? u(t.options, i) : i;
                this.modes[n] = new t(this)
            }, l.prototype.layout = function() {
                return !this._isLayoutInited && this.options.isInitLayout ? (this.arrange(), void 0) : (this._layout(), void 0)
            }, l.prototype._layout = function() {
                var n = this._getIsInstant();
                this._resetLayout();
                this._manageStamps();
                this.layoutItems(this.filteredItems, n);
                this._isLayoutInited = !0
            }, l.prototype.arrange = function(n) {
                this.option(n);
                this._getIsInstant();
                this.filteredItems = this._filter(this.items);
                this._sort();
                this._layout()
            }, l.prototype._init = l.prototype.arrange, l.prototype._getIsInstant = function() {
                var n = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                return this._isInstant = n, n
            }, l.prototype._filter = function(n) {
                function e() {
                    f.reveal(s);
                    f.hide(h)
                }
                var r = this.options.filter,
                    t, i, f;
                r = r || "*";
                for (var o = [], s = [], h = [], c = this._getFilterTest(r), u = 0, l = n.length; l > u; u++) t = n[u], t.isIgnored || (i = c(t), i && o.push(t), i && t.isHidden ? s.push(t) : i || t.isHidden || h.push(t));
                return f = this, this._isInstant ? this._noTransition(e) : e(), o
            }, l.prototype._getFilterTest = function(n) {
                return r && this.options.isJQueryFiltering ? function(t) {
                    return r(t.element).is(n)
                } : "function" == typeof n ? function(t) {
                    return n(t.element)
                } : function(t) {
                    return f(t.element, n)
                }
            }, l.prototype.updateSortData = function(n) {
                var t;
                n ? (n = i(n), t = this.getItems(n)) : t = this.items;
                this._getSorters();
                this._updateItemsSortData(t)
            }, l.prototype._getSorters = function() {
                var t = this.options.getSortData,
                    n, i;
                for (n in t) i = t[n], this._sorters[n] = a(i)
            }, l.prototype._updateItemsSortData = function(n) {
                for (var r, i = n && n.length, t = 0; i && i > t; t++) r = n[t], r.updateSortData()
            }, a = function() {
                function n(n) {
                    if ("string" != typeof n) return n;
                    var i = o(n).split(" "),
                        r = i[0],
                        u = r.match(/^\[(.+)\]$/),
                        s = u && u[1],
                        f = t(s, r),
                        e = l.sortDataParsers[i[1]];
                    return e ? function(n) {
                        return n && e(f(n))
                    } : function(n) {
                        return n && f(n)
                    }
                }

                function t(n, t) {
                    return n ? function(t) {
                        return t.getAttribute(n)
                    } : function(n) {
                        var i = n.querySelector(t);
                        return i && h(i)
                    }
                }
                return n
            }(), l.sortDataParsers = {
                parseInt: function(n) {
                    return parseInt(n, 10)
                },
                parseFloat: function(n) {
                    return parseFloat(n)
                }
            }, l.prototype._sort = function() {
                var n = this.options.sortBy,
                    t, i;
                n && (t = [].concat.apply(n, this.sortHistory), i = y(t, this.options.sortAscending), this.filteredItems.sort(i), n !== this.sortHistory[0] && this.sortHistory.unshift(n))
            }, l.prototype._mode = function() {
                var n = this.options.layoutMode,
                    t = this.modes[n];
                if (!t) throw Error("No layout mode: " + n);
                return t.options = this.options[n], t
            }, l.prototype._resetLayout = function() {
                n.prototype._resetLayout.call(this);
                this._mode()._resetLayout()
            }, l.prototype._getItemLayoutPosition = function(n) {
                return this._mode()._getItemLayoutPosition(n)
            }, l.prototype._manageStamp = function(n) {
                this._mode()._manageStamp(n)
            }, l.prototype._getContainerSize = function() {
                return this._mode()._getContainerSize()
            }, l.prototype.needsResizeLayout = function() {
                return this._mode().needsResizeLayout()
            }, l.prototype.appended = function(n) {
                var t = this.addItems(n),
                    i;
                t.length && (i = this._filterRevealAdded(t), this.filteredItems = this.filteredItems.concat(i))
            }, l.prototype.prepended = function(n) {
                var t = this._itemize(n),
                    i, r;
                t.length && (i = this.items.slice(0), this.items = t.concat(i), this._resetLayout(), this._manageStamps(), r = this._filterRevealAdded(t), this.layoutItems(i), this.filteredItems = r.concat(this.filteredItems))
            }, l.prototype._filterRevealAdded = function(n) {
                var t = this._noTransition(function() {
                    return this._filter(n)
                });
                return this.layoutItems(t, !0), this.reveal(t), n
            }, l.prototype.insert = function(n) {
                var i = this.addItems(n),
                    t, f, r, u;
                if (i.length) {
                    for (r = i.length, t = 0; r > t; t++) f = i[t], this.element.appendChild(f.element);
                    for (u = this._filter(i), this._noTransition(function() {
                            this.hide(u)
                        }), t = 0; r > t; t++) i[t].isLayoutInstant = !0;
                    for (this.arrange(), t = 0; r > t; t++) delete i[t].isLayoutInstant;
                    this.reveal(u)
                }
            }, v = l.prototype.remove, l.prototype.remove = function(n) {
                var t, r, u, f;
                if (n = i(n), t = this.getItems(n), v.call(this, n), t && t.length)
                    for (r = 0, u = t.length; u > r; r++) f = t[r], e(f, this.filteredItems)
            }, l.prototype.shuffle = function() {
                for (var i, n = 0, t = this.items.length; t > n; n++) i = this.items[n], i.sortData.random = Math.random();
                this.options.sortBy = "random";
                this._sort();
                this._layout()
            }, l.prototype._noTransition = function(n) {
                var i = this.options.transitionDuration,
                    t;
                return this.options.transitionDuration = 0, t = n.call(this), this.options.transitionDuration = i, t
            }, l.prototype.getFilteredItemElements = function() {
                for (var t = [], n = 0, i = this.filteredItems.length; i > n; n++) t.push(this.filteredItems[n].element);
                return t
            }, l
        }
        var r = n.jQuery,
            o = String.prototype.trim ? function(n) {
                return n.trim()
            } : function(n) {
                return n.replace(/^\s+|\s+$/g, "")
            },
            s = document.documentElement,
            h = s.textContent ? function(n) {
                return n.textContent
            } : function(n) {
                return n.innerText
            },
            c = Object.prototype.toString,
            l = Array.prototype.indexOf ? function(n, t) {
                return n.indexOf(t)
            } : function(n, t) {
                for (var i = 0, r = n.length; r > i; i++)
                    if (n[i] === t) return i;
                return -1
            };
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "matches-selector/matches-selector", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], t) : "object" == typeof exports ? module.exports = t(require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("./item"), require("./layout-mode"), require("./layout-modes/masonry"), require("./layout-modes/fit-rows"), require("./layout-modes/vertical")) : n.Isotope = t(n.Outlayer, n.getSize, n.matchesSelector, n.Isotope.Item, n.Isotope.LayoutMode)
    }(window)