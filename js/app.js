var SubnetTool = function() {

  function IpKeyUp() { 
      if (checkEntries(document.getElementById("ip").innerHTML, document.getElementById("mask").innerHTML) == true) {
      document.getElementById("submit").removeAttr('disabled');
    }
  }

  document.querySelector("#submit").addEventListener("click", function () {
    var ip = document.getElementById("ip").value;
    var mask = document.getElementById("mask").value;
    var result = checkEntries(ip, mask);

    if (result[0] !== "S") {
      var inMask = calculateMask(result);
      var inIP = calculateIP(ip);
      
      var wildcard = wildcardMask(inMask);
      var cidr = octet2cidr(inMask);
      var subnetId = subnetID(inIP, inMask);
      var broadcastAddr = broadcast(inIP, wildcard);
      var startIP = startingIP(inIP, inMask);
      var endIP = endingIP(inIP, wildcard);
      var hostNb = hostCount(inMask);
      
      var outIP = inIP.join(".") + " / " + cidr;
      var outMask = cidr2octet(cidr).join(".");

      document.getElementById("ip-addr").innerHTML = outIP;
      document.getElementById("mask-dis").innerHTML = outMask;
      document.getElementById("sub-id").innerHTML = subnetId;
      document.getElementById("broad-addr").innerHTML = broadcastAddr;
      // document.getElementById("first-ip").innerHTML = startIP;
      // document.getElementById("last-ip").innerHTML = endIP;
      document.getElementById("wildcard-mask").innerHTML = wildcard;
      document.getElementById("nb-hosts").innerHTML = hostNb;

      document.getElementById("result").className = "display block";
    }
    else{
      alert(result);
      /* Display result in message area within the page instead of an alert */
    }
  })
  
  return {
    IpKeyUp: IpKeyUp
  }

}();
