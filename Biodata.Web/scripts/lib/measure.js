_track_ja = 0; _track_wd = 0; _track_he = 0; _track_cd = 0; _track_na = navigator;
_track_ja = (_track_na.javaEnabled() == true) ? "1" : "0";
ie = (_track_na.appName.substring(0, 9) == "Microsoft") ? 1 : 0; s = screen; _track_wd = s.width; _track_he = s.height; (ie == 1) ? _track_cd = s.colorDepth : _track_cd = s.pixelDepth;
_track_jv = 13;


function doCTracker() {
    section = _section;
    sid = _sid;
    ver = 2;
    dc = document;
    jv = _track_jv;
    ja = _track_ja;
    wd = _track_wd;
    he = _track_he;
    cd = _track_cd;
    tck = Math.random();
    if (document.referrer) {
        rf = new String(document.referrer);
    } else {
        rf = "";
    }
    if (window.top.document.title) {
        pt = new String(window.top.document.title);
    } else {
        pt = "";
    }
    tz = (new Date()).getTimezoneOffset();
    if (document.location) {
        _pg = document.location;
    } else {
        _pg = '';
    }
    fl = 0;
    dc.cookie = "aut_id=1;path=/;expires=Sat, 1 Jan 2222 12:00:00 UTC";
    ck = 0; if (dc.cookie.length > 0) if (dc.cookie.indexOf("1") > 0) ck = 1;
    dc.write('<div style="position:absolute; left:-600px; top:-600px;"><iframe src="//www.numerino.cz/tracker.php?sid=', sid, "&se=", escape(section), "&ver=", ver, "&jv=", jv, "&ja=", ja);
    dc.write("&wd=", wd, "&he=", he, "&cd=", cd, "&tz=", tz, "&fl=", fl, "&ck=", ck);
    dc.write("&rf=", escape(rf), "&pg=", escape(_pg), "&pt=", escape(pt), "&tick=", tck, '" width="1" height="1" frameborder="0" scrolling="no"></iframe></div>');
}

doCTracker();