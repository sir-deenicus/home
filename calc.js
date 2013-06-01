var G = 6.67e-11;//<m^3 *kg^-1 * s^-2>
var c_light = 299792458.;//<m/s>
var c_sq = c_light * c_light;
var schwarzrad = 2. * G / c_sq

function round(x, places) {
    var s = Math.pow(10, places);
    return Math.round(x * s) / s;
}

function log10(x) {return Math.log(x) / Math.LN10;}
function otherround(x) {
    var expn = Math.floor(log10(x))
    return Math.round(x / Math.pow(10, expn)) * Math.pow(10, expn)
}

function ansqrt(x) { if (x < 0) return Number.POSITIVE_INFINITY; else return Math.sqrt(x) }

function handleTime(x) {
    if (x > 31536000) {
        return round(x / 31536000, 1) + " earth years";
    }
    else if (x > 2592000) {
        return round(x / 2592000, 1) + " earth months";
    }
    if (x > 86400) {
        return round(x / 86400, 1) + " earth days";
    }
    else return x + " seconds"
}

function sTimedil(margin, mass, properTime){  
    var sradius = mass * schwarzrad;
    var dist = sradius + margin;
    var scale = Math.sqrt(1. - sradius/dist) ;
    var radjust = Math.sqrt(dist - sradius);
    var mgeom = G * mass / c_sq;
    var a = c_sq * mgeom / (1. * (Math.pow(dist, 2.)) * ansqrt(1. - 2. * mgeom / dist));
    return "<b>Time passed elsewhere</b>: " + handleTime(properTime / scale) + ".<br/><b>Acceleration Required</b>: " + round(a,1)
            + " m/s^2<br/><b>Schwarzchild radius</b> " + sradius + " meters<br/><b>Your Distance from horizon</b>: " + round(dist, 4)
            + " meters<br/><b>percent light speed</b>: " + round((a / c_light) * 100,1)
            + "%<br/><b>Photon sphere at</b> " + 1.5 * sradius + " meters";
}

function getitem(id) { return document.getElementById(id); }

function getData(e, u) {
    var margin = $("#slidermargin").slider("value");
    var mass = $("#slidermass").slider("value");
    var ptime = $("#sliderpropertime").slider("value");
    var lemass = otherround(Math.pow(20, mass));
    getitem("val1").innerHTML = "| " + Math.pow(10, margin) + " meters";
    getitem("val2").innerHTML = "| " + lemass + " kg";
    getitem("val3").innerHTML = "| " + handleTime(Math.pow(10, ptime));
    getitem("result").innerHTML = sTimedil(Math.pow(10, margin), lemass, Math.pow(10, ptime))
}