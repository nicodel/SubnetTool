/******************************************************************************
* Feel free to use this code. Leave my comments in place please.
* JavaScript Subnet Calculator written by John Thaemltiz
******************************************************************************/

/******************************************************************************
* You can see the use of all the available functions in displayInfo()
*
* All the values are calculated based on only 2 array variables.
* nAddr = This is your network address. It's a 4 element array of
* integers. Each integer is an octet of the IP Address.
* nMask = This is your network mask. Same kind of 4 element array
* to hold your mask.
*
* That's all you need to calculate the rest of the values you see.
* Note I kick off all the calculations by calling calculateClass('A') onload.
******************************************************************************/

/******************************************************************************
* Declare our network address and mask.
******************************************************************************/
var nAddr = new Array(10, 0, 0, 0);
var nMask = new Array(255, 0, 0, 0);

function calculateIP(ip) {
  var a = ip.split('.');
  nAddr[0] = parseInt(a[0]);
  nAddr[1] = parseInt(a[1]);
  nAddr[2] = parseInt(a[2]);
  nAddr[3] = parseInt(a[3]);
  return nAddr;
}

function calculateMask(mask) {
  var a = mask.split('.');
  for (var i = 0; i < 4; i++) {
    nMask[i] = parseInt(a[i]);
  }
  return nMask;
}


/******************************************************************************
* These are the real functions that do all the work. These functions are
* called from displayInfo which then displays the calculated info.
******************************************************************************/
// Returns the wildcard mask from the subnet mask. The wild card mask is
// the subnet mask with the bits flipped. Hence you just need to pass
// in the subnet mask.
function wildcardMask(aMask) {
  var a = new Array(0, 0, 0, 0);
  for (var i = 0; i < 4; i++) {
    a[i] = 255 - aMask[i];
  }
  return a.join(".");
}
// Calculate the last available ip address in the network and return it as
// an int array. This is basically one less than the broadcast address.
// We need the network address and the wildcard mask for this.

function endingIP(aNet, aWild) {
  // work around int32
  var a = new broadcast(aNet, aWild);
  var d = octet2dec(a);
  d = d - 1;
  return dec2octet(d);
}
// Calculate the broadcast address (the last ip address in the network) and
// return it as an int array.
// We need the network address and the wildcard mask for this.

function broadcast(aNet, aWild) {
  // work around int32
  var a = new Array(0, 0, 0, 0);
  for (var i = 0; i < 3; i++) {
    a[i] = aNet[i] | aWild[i];
    // a[i] = aNet[i];
  }
  aWild = aWild.split(".", 4);
  a[3] = aWild[3];
  return a.join(".");
}
// Calculate the subnet id available address in the network and return it as an
// int array. This is basically one more than the network address (subnet ID).
// We need the network address and the subnet mask for this.

function startingIP(aNet, aMask) {
  var a = subnetID(aNet, aMask);
  var d = octet2dec(a);
  d = d + 1;
  return dec2octet(d);
}
// Calculate the subnet id (the first address in the network) and return it as an
// int array.
// We need the network address and the subnet mask for this.

function subnetID(aNet, aMask) {
  var a = new Array(0, 0, 0, 0);
  for (var i = 0; i < 4; i++) {
    a[i] = aNet[i] & aMask[i];
  }
  return a.join(".");
}
// Count the number of hosts based on a subnet mask

function hostCount(aMask) {
  if (octet2cidr(aMask) == -1) {
    return 1;
  } else if (octet2cidr(aMask) == 31) {
    /* here we manage the RFC3021 */
    return 3;
  } else {
    var bits = 32 - octet2cidr(aMask);
    // get # of addresses in network and subtract 2
    return Math.pow(2, bits) - 2;
  }
}
// Convert a subnet mask array into CIDR (# of bits) (255.255.255.0 = 24 etc.)

function octet2cidr(aMask) {
  var mask = octet2dec(aMask);
  // get binary string
  mask = mask.toString(2);
  // return mask length
  return mask.indexOf(0);
}
// calculate all available bits in and return it as a string.
// Convert CIDR to array of 4 ints (Classless Inter Domain Routing)

function cidr2octet(bits) {
  var bits = parseInt(bits);
  // make up our mask
  var ones = "11111111111111111111111111111111";
  var mask = parseInt(ones.substring(0, bits), 2);
  var shift = 32 - bits;
  // poor mans bit shift because javascript uses 32 bit integers
  mask = mask * Math.pow(2, shift);
  return dec2octet(mask);
}
// Convert our array of 4 ints into a decimal (watch out for 16 bit JS integers here)

function octet2dec(a) {
  // poor mans bit shifting (Int32 issue)
  var d = 0;
  d = d + parseInt(a[0]) * 16777216; //Math.pow(2,24);
  d = d + a[1] * 65536; //Math.pow(2,16);
  d = d + a[2] * 256; //Math.pow(2,8);
  d = d + a[3];
  return d;
}
// Convert decimal to our array of 4 ints.

function dec2octet(d) {
  var zeros = "00000000000000000000000000000000";
  var b = d.toString(2);
  var b = zeros.substring(0, 32 - b.length) + b;
  var a = new Array(
    parseInt(b.substring(0, 8), 2) // 32 bit integer issue (d & 4278190080)/16777216
  //Math.pow(2,32) Math.pow(2,24);
  , (d & 16711680) / 65536 //Math.pow(2,24) - Math.pow(2,16);
  , (d & 65280) / 256 //Math.pow(2,16) - Math.pow(2,8);
  , (d & 255)); //Math.pow(2,8);
  return a;
}
// convert decimal to binary string representation

function dec2bin(d) {
  var b = d.toString(2);
  return b;
}
// convert binary string to decimal

function bin2dec(b) {
  return parseInt(b, 2);
}

function calculateClass(c) {
  switch (c) {
    case "B":
      nAddr = new Array(172, 168, 0, 1);
      nMask = new Array(255, 255, 0, 0);
      break;
    case "C":
      nAddr = new Array(192, 168, 0, 1);
      nMask = new Array(255, 255, 255, 0);
      break;
    default:
      // default to class A
      nAddr = new Array(10, 0, 0, 1);
      nMask = new Array(255, 0, 0, 0);
      break;
  }
}

/******************************************************************************
* The functions below just set the values in our HTML form elements. These
* elements can be submitted to a server side script for database storage.
* These functions are linked to onload, onchange, etc. in our HTML.
******************************************************************************/
function calculateIPCIDR(ip) {
  var ipa = ip.split('/');
  if (ipa.length = 2) {
    var a = ipa[0].split('.');
    nAddr[0] = parseInt(a[0]);
    nAddr[1] = parseInt(a[1]);
    nAddr[2] = parseInt(a[2]);
    nAddr[3] = parseInt(a[3]);
    nMask = cidr2octet(ipa[1]);
  } else {
    nAddr = ip.split('.');
  }
}

function calculateSubnet(mask) {
  var a = mask.split('.');
  nMask[0] = parseInt(a[0]);
  nMask[1] = parseInt(a[1]);
  nMask[2] = parseInt(a[2]);
  nMask[3] = parseInt(a[3]);
}

function calculateHosts(cidr) {
  nMask = cidr2octet(cidr);
}


function checkEntries(ip, mask) {
  console.log("ip", ip);
  /* we check if one or both fields are empty,
* and return the right message.
*/
  if (ip == "" && mask == "") {
    return "Specify valid IP address and subnet mask (ex: 192.168.10.1)."
  } else if (ip == "" && mask != "") {
    return "Specify a valid IP address (ex: 192.168.10.1).";
  } else if (ip != "" && mask == "") {
    return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
  }
  /* we check if fields only contains numbers and dots,
* and return an explicit error if it is the case.
*/
  else if (ip.match(/[^1234567890\.]/i) != null && mask.match(/[^1234567890\.]/i) != null) {
    return "Specify valid IP address and subnet mask (ex: 192.168.10.1, 255.255.255.0 or 24).";
  } else if (ip.match(/[^1234567890\.]/i) != null && mask.match(/[^1234567890\.]/i) == null) {
    return "Specify a valid IP address (ex: 192.168.10.1).";
  } else if (ip.match(/[^1234567890\.]/i) == null && mask.match(/[^1234567890\.]/i) != null) {
    return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
  }
  /* we check that both fields are composed of 4 digits separated by dots,
* and return an explicit error if it is the case.
*/
  var i = ip.split(".");
  var m = mask.split(".");
  if (i.length != 4) {
    return "Specify a valid IP address (ex: 192.168.10.1).";
  }
  if (m.length != 4 && isNaN(mask) == false) {
    var mask = parseInt(mask)
    if (mask <= 0 | mask >= 33) {
      return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
    } else {
      mask = cidr2octet(m);
      return mask.join(".")
    }
  }
  /* we check if the value specified in both fields are from 0 to 255.*/
  for (var x = 0; x < 4; x++) {
    var a = parseInt(i[x])
    var b = m[x]
    if (a <= 0 | a >= 255) {
      return "Specify a valid IP address (ex: 255.255.255.0 or 24).";
    } else if (b.match(/^0$|^128$|^192$|^224$|^240$|^248$|^252$|^254$|^255$/i) == null) {
      return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
    }
  }
  /* if nothing is wrong,
* return subnet mask
*/
  return mask;
}

function check4digits(digits) {
  var dig = digits.split(".");
  if (dig.length == 4) {
    for (i = 0; i < 4; i++) {
      if (isNaN(dig[i])) {
        return "Il ne faut saisir que des chiffres.";
      } else if (dig[i] < 0 || dig[i] > 255) {
        return "Les valeurs doivent être comprises entre 0 et 255.";
      }
    }
  } else {
    return "Il faut 4 chiffres compris entre 0 et 255.";
  }
  return true;
}