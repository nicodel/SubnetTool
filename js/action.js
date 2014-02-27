/**
 * actions.js
 * Manage interaction on html files
 */

$(function () {
    //  console.log("jQuery ok");

    $("#ip").keyup(function () {
        //    console.log($("#ip").val());
        //    console.log(checkEntries($("#ip").val(), $("#mask").val()));
        if (checkEntries($("#ip").val(), $("#mask").val()) == true) {
//            console.log("in ok");
            $("#submit").removeAttr('disabled');
        }
    });

//    $("#mask").keyup(function () {
//        //    console.log($("#mask").val());
//        if (checkEntries($("#ip").val(), $("#mask").val()) == true) {
//            $("#submit").removeAttr('disabled');
//        }
//    });

    $("#submit").click(function () {
        var result = checkEntries($("#ip").val(), $("#mask").val());
        if (result[0] !== "S") {
            var inMask = calculateMask(result);
            var inIP = calculateIP($("#ip").val());
            
            var wildcard = wildcardMask(inMask);
            var cidr = octet2cidr(inMask);
            var subnetId = subnetID(inIP, inMask);
            var broadcastAddr = broadcast(inIP, wildcard);
            var startIP = startingIP(inIP, inMask);
            var endIP = endingIP(inIP, wildcard);
            var hostNb = hostCount(inMask);
            
            var outIP = inIP.join(".") + " / " + cidr;
            var outMask = cidr2octet(cidr).join(".");

            $("#ip-addr").html(outIP);
            $("#mask-dis").html(outMask);
            $("#sub-id").html(subnetId);
            $("#broad-addr").html(broadcastAddr);
            $("#first-ip").html(startIP);
            $("#last-ip").html(endIP);
            $("#wildcard-mask").html(wildcard);
            $("#nb-hosts").html(hostNb);

            $("#result").css("display", "block");
        }
        else{
            alert(result);
            /* Display result in message area within the page instead of an alert */
        }
    });
});