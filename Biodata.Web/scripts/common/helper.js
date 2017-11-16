String.format = function () {
    var str = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i + 1]);
    }
    return str;
}

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(currentDate)
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
function GetDays() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days;
}

function GetMonths() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];
    return monthNames;
}

function ToBase64(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    if (input != undefined) {
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
		keyStr.charAt(enc3) + keyStr.charAt(enc4);
        } while (i < input.length);
    }
    return output;
}

function biopos(e, obj, age, range, f, t, kb) {
    if (e == false) {
        s = age;
        pos_xrelative = 0;
    } else {
        pos_x = e.layerX ? e.layerX : e.offsetX ? e.offsetX : 0;
        //a = (pos_x/600*range[1]) + parseInt(range[0]);
        dd = 610 / range[1]; //sirka grafu/pocet dni na grafu = dilekDen
        a = (pos_x / dd) + parseInt(range[0]);
        //a =  (pos_x/dd);
        s = a + age;

        //alert(s);
        pos_xrelative = a;
        if (Math.abs(pos_xrelative) > range[1]) {
            s = age;
            //alert(pos_xrelative);
            pos_xrelative = 0;

        }
    }

    var target = new Date(t[2], t[1], t[0], 12, 0);
    var now = new Date(target.getTime() + (pos_xrelative * 1000 * 24 * 60 * 60));
    var nowt = checkTime(now.getDate()) + '.' + checkTime(now.getMonth()) + '.' + now.getFullYear();
    for (var i in f) {
        eval('v =' + f[i]);
        if (document.getElementById(obj.id + '_w' + i) != null)
            document.getElementById(obj.id + '_w' + i).style.backgroundPosition = "0px -" + ((zobrazBioIco(v * 100) - 1) * 32) + "px"; //smajlik
        v = Math.round(v * 100);



        if (document.getElementById(obj.id + '_o' + i) != null)
            document.getElementById(obj.id + '_o' + i).innerHTML = v + "%";
        //document.getElementById('dbg').innerHTML = pos_x+"|"+a+"|"+s+"|"+parseInt(range[0])+"|"+age;
    }
    if (document.getElementById(obj.id + '_s') != null)
        document.getElementById(obj.id + '_s').innerHTML = nowt;

}

function GetDataforDate(e, obj, age, range, f, t, kb) {
    if (e == false) {
        s = age;
        pos_xrelative = 0;
    } else {
        pos_x = e.layerX ? e.layerX : e.offsetX ? e.offsetX : 0;
        //a = (pos_x/600*range[1]) + parseInt(range[0]);
        dd = 800 / range[1]; //sirka grafu/pocet dni na grafu = dilekDen
        a = (pos_x / dd) + parseInt(range[0]);
        //a =  (pos_x/dd);
        s = a + age;

        //alert(s);
        pos_xrelative = a;
        if (Math.abs(pos_xrelative) > range[1]) {
            s = age;
            //alert(pos_xrelative);
            pos_xrelative = 0;

        }
    }

    var target = new Date(t[2], t[1], t[0], 12, 0);
    var now = new Date(target.getTime() + (pos_xrelative * 1000 * 24 * 60 * 60));
    var nowt = checkTime(now.getDate()) + '.' + checkTime(now.getMonth()) + '.' + now.getFullYear();
    var objReturn = {};
    for (var i in f) {
        eval('v =' + f[i]);
        if (document.getElementById(obj.id + '_w' + i) != null)
            document.getElementById(obj.id + '_w' + i).style.backgroundPosition = "0px -" + ((zobrazBioIco(v * 100) - 1) * 32) + "px"; //smajlik
        v = Math.round(v * 100);
        switch (i) {
            case "0":
                objReturn.Physical = v;
                objReturn.PhysicalWidth = 0;
                objReturn.PhysicalStyle = 0;
                objReturn.PhysicalClass = '';
                break;
            case "1":
                objReturn.Emotional = v;
                objReturn.EmotionalWidth = 0;
                objReturn.EmotionalStyle = 0;
                objReturn.EmotionalClass = '';
                break;
            case "2":
                objReturn.Intellectual = v;
                objReturn.IntellectualWidth = 0;
                objReturn.IntellectualStyle = 0;
                objReturn.IntellectualClass = '';
                break;
            case "3":
                objReturn.Average = v;
                objReturn.AverageWidth = 0;
                objReturn.AverageStyle = 0;
                objReturn.AverageClass = '';
                break;
        }


        if (document.getElementById(obj.id + '_o' + i) != null)
            document.getElementById(obj.id + '_o' + i).innerHTML = v + "%";
        //document.getElementById('dbg').innerHTML = pos_x+"|"+a+"|"+s+"|"+parseInt(range[0])+"|"+age;
    }
    if (document.getElementById(obj.id + '_s') != null)
        document.getElementById(obj.id + '_s').innerHTML = nowt;

    return objReturn;
}


function GetDataforSecondaryDate(e, obj, age, range, f, t, kb) {
    if (e == false) {
        s = age;
        pos_xrelative = 0;
    } else {
        pos_x = e.layerX ? e.layerX : e.offsetX ? e.offsetX : 0;
        //a = (pos_x/600*range[1]) + parseInt(range[0]);
        dd = 610 / range[1]; //sirka grafu/pocet dni na grafu = dilekDen
        a = (pos_x / dd) + parseInt(range[0]);
        //a =  (pos_x/dd);
        s = a + age;

        //alert(s);
        pos_xrelative = a;
        if (Math.abs(pos_xrelative) > range[1]) {
            s = age;
            //alert(pos_xrelative);
            pos_xrelative = 0;

        }
    }

    var target = new Date(t[2], t[1], t[0], 12, 0);
    var now = new Date(target.getTime() + (pos_xrelative * 1000 * 24 * 60 * 60));
    var nowt = checkTime(now.getDate()) + '.' + checkTime(now.getMonth()) + '.' + now.getFullYear();
    var objReturn = {};
    for (var i in f) {
        eval('v =' + f[i]);
        if (document.getElementById(obj.id + '_w' + i) != null)
            document.getElementById(obj.id + '_w' + i).style.backgroundPosition = "0px -" + ((zobrazBioIco(v * 100) - 1) * 32) + "px"; //smajlik
        v = Math.round(v * 100);
        switch (i) {
            case "0":
                objReturn.Spiritual = v;
                objReturn.SpiritualWidth = 0;
                objReturn.SpiritualStyle = 0;
                objReturn.SpiritualClass = '';
                break;
            case "1":
                objReturn.Aesthetic = v;
                objReturn.AestheticWidth = 0;
                objReturn.AestheticStyle = 0;
                objReturn.AestheticClass = '';
                break;
            case "2":
                objReturn.Intuitive = v;
                objReturn.IntuitiveWidth = 0;
                objReturn.IntuitiveStyle = 0;
                objReturn.IntuitiveClass = '';
                break;
            case "3":
                objReturn.Primier = v;
                objReturn.PrimierWidth = 0;
                objReturn.PrimierStyle = 0;
                objReturn.PrimierClass = '';
                break;
            case "4":
                objReturn.Average = v;
                objReturn.AverageWidth = 0;
                objReturn.AverageStyle = 0;
                objReturn.AverageClass = '';
                break;
        }


        if (document.getElementById(obj.id + '_o' + i) != null)
            document.getElementById(obj.id + '_o' + i).innerHTML = v + "%";
        //document.getElementById('dbg').innerHTML = pos_x+"|"+a+"|"+s+"|"+parseInt(range[0])+"|"+age;
    }
    if (document.getElementById(obj.id + '_s') != null)
        document.getElementById(obj.id + '_s').innerHTML = nowt;

    return objReturn;
}

function zobrazBioIco(v) {
    e = 6;
    if (v >= -65) e = 5;
    if (v >= -11) e = 4;
    if (v >= 11) e = 3;
    if (v >= 40) e = 3;
    if (v >= 70) e = 2;
    if (v >= 95) e = 1;
    return e;
}

function checkTime(i) {
    if (i < 10 && i>0) {
        i = "0" + i;
    } else if(i==0){
        i = "12";
    }
    return i;
}

function jsbioinfo(e, obj) {
    pos_x = e.layerX ? e.layerX : e.offsetX ? e.offsetX : 0;
}

function getAbsPos(object) {
    var position = new Object;
    position.x = 0;
    position.y = 0;
    if (object) {
        position.x = object.offsetLeft;
        position.y = object.offsetTop;
        if (object.offsetParent) {
            var parentpos = getAbsPos(object.offsetParent);
            position.x += parentpos.x;
            position.y += parentpos.y;
        }
    }
    return position;
}