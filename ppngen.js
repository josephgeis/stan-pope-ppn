/* jshint -W033 */
var U1,U2,U3
var sdd=1, spgnum=0;
var sWin;
function sl(m)
{
if (sdd)
  {
    sWin=window.open(U3,"Scoresheet"+spgnum);
    sdd=0; ++spgnum;
  }
  sWin.document.writeln(m);
}

function sc(){ if (sdd==0) {sWin.document.close(); sdd=1;}}


var dd=1, dpgnum=0;
var diag, dWin;
function d(m)
{
 if (diag)
 {
  if (dd)
  {
    dWin=window.open(U2,"Diagnostic"+dpgnum);
    dl("<HTML><HEAD><TITLE>PPNGEN DIAGNOSTIC OUTPUTS</TITLE></HEAD><BODY><H1>PPNGEN DIAGNOSTIC OUTPUTS</H1>");
    dd=0; ++dpgnum;
  }
  dl("<BR>"+m);
 }
}

function dl(m) { if (diag) dWin.document.writeln(m); }

function dc()
{
 if (diag)
  if (dd==0) { d("</BODY></HTML>"); dWin.document.close(); dd=1;}
}

function w(m){mWin.document.write(m);}

function wl(m){mWin.document.writeln(m);}

function vdt(obj, lowval, hival){if ((obj.value<lowval) ||(obj.value>hival)) alert("Invalid Value!");}

// global vars

var numberOfCars, numberOfLanes, numberOfRounds, OS, W1, W2, W3, tl, nH, pn, pn2, sums, tng, tepg, scoreg, ident
var src="Source: http://members.aol.com/standcmr/ppngen.html"
var CA="Copyright 1998, 1999, 2000 &copy; by Stan Pope and Cory Young.  All rights reserved."
var pgnum=0, dS
var today

function focusLanes(){document.form1.Lanes.focus();document.form1.Lanes.select();}

function selectLanes(){document.form1.Lanes.select();}
function selectCars(){document.form1.Cars.select();}
function selectRounds(){document.form1.Rounds.select();}

function check3(i,j)
{
 // Goal: AVOID HAVING CARS IN CONSECUTIVE RACES IN THE SAME LANES
 var lM=0
 for (l=0; l<numberOfLanes; ++l) if (pn[((j*numberOfLanes)+l)]==pn2[(((i-1)*numberOfLanes)+l)]) ++lM;
 return lM
}

function check2(i,j)
{
 // Goal: AVOID HAVING CARS IN CONSECUTIVE RACES
 var cM=0
 for (l=0; l<numberOfLanes; ++l) for (m=0; m<numberOfLanes; ++m) if (pn[((j*numberOfLanes)+l)]==pn2[(((i-1)*numberOfLanes)+m)]) ++cM;
 return cM
}

function check1(i,j)
{
 // Goal: KEEP THE RACE COUNTS EVEN
 var rC=new make(numberOfCars)
 var car

 for (l=0; l<numberOfCars; ++l) rC[l]=sums[l];

 for (m=(numberOfLanes*j); m<(numberOfLanes*(j+1)); ++m) {car=pn[m]; (rC[car-1])++}

 var dev=0;
 var tgt=((i+1)*numberOfLanes) / numberOfCars;
 for (l=0; l<numberOfCars; ++l) {dev+=(rC[l]-tgt)*(rC[l]-tgt);}
 dev=dev/((i+1)*numberOfLanes);
 return (dev)
}

function rateRace(i, j)
{
 var retVal=0
 if (W1) retVal += W1*check1(i,j)
 if (i)  // these checks don't make sense for the 1st race (race 0)
 {
  if (W2) retVal += W2*check2(i,j)
  if (W3) retVal += W3*check3(i,j)
 }
 d("raterace: i="+i+"; j="+j+"; retVal="+retVal);
 return retVal
}

function orderRaces()
{
 if ((W1+W2+W3)==0) {for (z=0; z<(nH*numberOfLanes); ++z) pn2[z]=pn[z];  return;}

 var i,j,k,l,m
 var bR, bRt
 var nU=new make(nH)
 var car

 for (m=0; m<numberOfCars; m++) sums[m]=0;

 for (m=0; m<nH; m++) nU[m]=1;

 var tm0,now
 now=new Date()
 tm0=now.getTime();

 for (i=0; i<nH; i++)
 {
  if (i == 1)
  {
   now=new Date()
   tm0=Math.round((now.getTime()-tm0)*nH/1000)
   if (tm0>30) alert("Estimated time to optimize chart is "+tm0+" seconds.")
  }
  bR=nH-1
  bRt=10000

  k=0
  for (j=0; j<nH; j++)
  {
   if (nU[j])
   {
    k=rateRace(i, j)
    if (k<bRt-.000001)
    {
     bRt=k;
     bR=j;
     d("was better");
    }
   }
  }
  d("orderRaces: for i="+i+"; j="+bR+" was selected");
  ln=i
  for (l=0; l<numberOfLanes; ++l)
  {
   car=pn[(numberOfLanes*bR)+l];
   pn2[(numberOfLanes*i)+l]=car;
   (sums[car-1])++
   ln+=", "+car
  }
  d("Heat "+ln)
  nU[bR]=0
 }
 return
}

function make (num)
{
 var i
 for (i=0; i<num+1; i++) this[i]=0
 return this
}
// mc builds array of cell column names
function mc (t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12)
{
 i=0
 this[i++]=t1
 this[i++]=t2
 this[i++]=t3
 this[i++]=t4
 this[i++]=t5
 this[i++]=t6
 this[i++]=t7
 this[i++]=t8
 this[i++]=t9
 this[i++]=t10
 this[i++]=t11
 this[i++]=t12
 return this
}
// ma builds an array from the condition parameters
// Parameters:
//  1-elements per generator
//  2-number of generators available
//  3-12-Type of chart if this many generators are used
//    -1 No chart
//    0 "PPNB" Misc,
//    1 "PPN"
//    2 "PN"
//    3 "CPN"
//  9-n-generator elements

function ma (ng, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12,
  p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14)
{
 var hdr=12
 var outputThis = []
 i=0
 outputThis[i++]=hdr  // T[0]
 outputThis[i++]=t1
 outputThis[i++]=t2
 outputThis[i++]=t3
 outputThis[i++]=t4
 outputThis[i++]=t5
 outputThis[i++]=t6
 outputThis[i++]=t7
 outputThis[i++]=t8
 outputThis[i++]=t9
 outputThis[i++]=t10
 outputThis[i++]=t11
 outputThis[i++]=t12

 tng=ng
 tepg=numberOfLanes-1

 outputThis[i++]=p0  // T[13]
 outputThis[i++]=p1
 outputThis[i++]=p2
 outputThis[i++]=p3
 outputThis[i++]=p4
 outputThis[i++]=p5
 outputThis[i++]=p6
 outputThis[i++]=p7
 outputThis[i++]=p8
 outputThis[i++]=p9
 outputThis[i++]=p10
 outputThis[i++]=p11
 outputThis[i++]=p12
 outputThis[i++]=p13
 outputThis[i++]=p14

 if (ng<12)
 {
  for (j=27; j>=13; j--) outputThis[j]=outputThis[j-12+ng];
  for (j=ng+1; j<=12; j++) outputThis[i++]=-1;
 }
 realOut = Object.assign({},outputThis,this)
 return realOut
}

function cval(tg)
{
 var i,r,l,tc,k;
 var count=new make (numberOfCars+1)

 for (i=1; i<=numberOfCars; i++) count[i]=0;

 for (r=0; r<numberOfRounds; r++)
 {
  for (l=1; l<=numberOfLanes; l++)
  {
   if (l>1)
   {
    tc=1
    for (k=l-1; k>=1; k--)
     {
      tc -= tg[k+r*(numberOfLanes-1)]
      if (tc<1) tc += numberOfCars
      count[tc]++
     }
   }
   if (l< numberOfLanes)
    {
     tc=1
     for (k=l; k< numberOfLanes; k++)
     {
      tc += tg[k+r*(numberOfLanes-1)]
      if (tc>numberOfCars) tc -= numberOfCars
      count[tc]++
     }
    }
   }
  }
  var rlo=9999
  var rhi=0
  for (i=2; i<=numberOfCars; i++)
  {
   if (count[i]>rhi) rhi=count[i]
   if (count[i]<rlo) rlo=count[i]
  }
  if (rhi==rlo)
  {
   for (i=1;i<numberOfLanes;i++)
   {
    tc=0
    for (r=0;r<numberOfRounds;r++) tc+=tg[i+r*(numberOfLanes-1)]
    if (tc%numberOfCars!=0) return 2
   }
   return 3
  }
  else
   if (rhi==rlo+1)
    return 1
   else
    return 0
}

function wOpn ()
{
 var tg=new make(15);
 var T
 today = new Date();
 dS=today.toLocaleString();
 diag=0
 if (document.form1.diags.checked) diag=1

 U1="dummy.htm"; U2="dummy2.htm"; U3="dummy3.htm";
 if (document.form1.IE.checked) ;
 else
  if (document.form1.netscape.checked || (navigator.appCodeName=="Mozilla" && navigator.appName=="Netscape"))
  {U1=""; U2=""; U3="";}

 tl=document.form1.ttl.value
 if (tl=="") tl="Pinewood Derby Race"
 d("tl: "+tl)
 numberOfCars=1*document.form1.Cars.value
 d("numberOfCars: "+numberOfCars)
 numberOfLanes=1*document.form1.Lanes.value
 d("numberOfLanes: "+numberOfLanes)
 numberOfRounds=1*document.form1.Rounds.value
 d("numberOfRounds: "+numberOfRounds)
 OS=1*document.form1.OutputSel.options[document.form1.OutputSel.selectedIndex].value
 d("OS: "+OS)
 W1=1*document.form1.Weight1.options[document.form1.Weight1.selectedIndex].value
 d("W1: "+W1)
 W2=1*document.form1.Weight2.options[document.form1.Weight2.selectedIndex].value
 d("W2: "+W2)
 W3=1*document.form1.Weight3.options[document.form1.Weight3.selectedIndex].value
 d("W3: "+W3)
 d("TOD: "+dS);
 d("Platform:");
 d("appCodeName: "+navigator.appCodeName);
 d("appMinorVersion: "+navigator.appMinorVersion);
 d("appName: "+navigator.appName);
 d("appVersion: "+navigator.appVersion);
 d("browserLanguage: "+navigator.browserLanguage);
 d("cookieEnabled: "+navigator.cookieEnabled);
 d("cpuClass: "+navigator.cpuClass);
 d("onLine: "+navigator.onLine);
 d("platform: "+navigator.platform);
 d("systemLanguage: "+navigator.systemLanguage);
 d("userAgent: "+navigator.userAgent);
 d("userLanguage: "+navigator.userLanguage);

 if (numberOfCars<numberOfLanes) numberOfLanes=numberOfCars

 if (numberOfLanes==2)
  {
   if (numberOfCars==2) T=ma(2, 3,3, 1, 1)
   if (numberOfCars==3) T=ma(2, 2,3, 2, 1)
   if (numberOfCars==4) T=ma(2, 1,1, 3, 2)
   if (numberOfCars==5) T=ma(4, 1,2,1,3, 3,4,2,1)
   if (numberOfCars==6) T=ma(2, 1,1, 2,5)
   if (numberOfCars==7) T=ma(6, 1,1,2,1,1,3, 3,2,1,4,5,6)
   if (numberOfCars==8) T=ma(3, 1,1,1, 3,2,1)
   if (numberOfCars==9) T=ma(8, 1,1,1,2,1,1,1,3, 4,3,2,1,5,6,7,8)
   if (numberOfCars==10) T=ma(4, 1,1,1,1, 4,3,2,1)
   if (numberOfCars==11) T=ma(10, 1,1,1,1,2,1,1,1,1,3, 5,4,3,2,1,6,7,8,9,10)
   if (numberOfCars==12) T=ma(5, 1,1,1,1,1, 5,4,3,2,1)
   if (numberOfCars==13) T=ma(12, 1,1,1,1,1,2,1,1,1,1,1,3, 6,5,4,3,2,1,7,8,9,10,11,12)
   if (numberOfCars==14) T=ma(6, 1,1,1,1,1,1, 6,5,4,3,2,1)
   if (numberOfCars==15) T=ma(12, 1,1,1,1,1,1,2,1,1,1,1,1, 7,6,5,4,3,2,1,8,9,10,11,12)
   if (numberOfCars==16) T=ma(7, 1,1,1,1,1,1,1, 7,6,5,4,3,2,1)
   if (numberOfCars==17) T=ma(12, 1,1,1,1,1,1,1,2,1,1,1,1, 8,7,6,5,4,3,2,1,9,10,11,12)
   if (numberOfCars==18) T=ma(8, 1,1,1,1,1,1,1,1, 8,7,6,5,4,3,2,1)
   if (numberOfCars==19) T=ma(12, 1,1,1,1,1,1,1,1,2,1,1,1, 9,8,7,6,5,4,3,2,1,10,11,12)
   if (numberOfCars==20) T=ma(9, 1,1,1,1,1,1,1,1,1, 9,8,7,6,5,4,3,2,1)
   if (numberOfCars==21) T=ma(12, 1,1,1,1,1,1,1,1,1,2,1,1, 10,9,8,7,6,5,4,3,2,1,11,12)
   if (numberOfCars==22) T=ma(10, 1,1,1,1,1,1,1,1,1,1, 10,9,8,7,6,5,4,3,2,1)
   if (numberOfCars==23) T=ma(12, 1,1,1,1,1,1,1,1,1,1,2,1, 11,10,9,8,7,6,5,4,3,2,1,12)
   if (numberOfCars==24) T=ma(11, 1,1,1,1,1,1,1,1,1,1,1, 11,10,9,8,7,6,5,4,3,2,1)
   if (numberOfCars==25) T=ma(12, 1,1,1,1,1,1,1,1,1,1,1,2, 12,11,10,9,8,7,6,5,4,3,2,1)
   if (numberOfCars >= 26 && numberOfCars <= 200)
	   T=ma(12, 1,1,1,1,1,1,1,1,1,1,1,1, 12,11,10,9,8,7,6,5,4,3,2,1)
  }
 if (numberOfLanes==3)
  {
   if (numberOfCars==3) T=ma(2, 2,3, 2,2, 1,1)
   if (numberOfCars==4) T=ma(2, 2,3, 3,3, 1,1)
   if (numberOfCars==5) T=ma(4, 1,2,1,3, 2,2, 1,1, 3,3, 4,4)
   if (numberOfCars==6) T=ma(2, 1,1, 2,3, 5,2)
   if (numberOfCars==7) T=ma(2, 2,3, 2,4, 5,3)
   if (numberOfCars==8) T=ma(2, 1,1, 2,5, 3,4)
   if (numberOfCars==9) T=ma(2, 1,1, 2,3, 3,5)
   if (numberOfCars==10) T=ma(2, 1,1, 2,7, 4,5)
   if (numberOfCars==11) T=ma(2, 1,1, 2,3, 3,7)
   if (numberOfCars==12) T=ma(1, 1, 2,3)
   if (numberOfCars==13) T=ma(4, 1,2,1,3, 3,9, 7,11, 10,4, 6,2)
   if (numberOfCars==14) T=ma(1, 1, 2,3)
   if (numberOfCars==15) T=ma(2, 1,1, 2,3, 6,8)
   if (numberOfCars==16) T=ma(2, 1,1, 2,3, 6,9)
   if (numberOfCars >= 17 && numberOfCars <= 18)
	   T=ma(2, 1,1, 2,3, 4,6)
   if (numberOfCars==19) T=ma(6, 1,1,2,1,1,3, 2,3, 4,6, 1,7, 17,16, 15,13, 18,12)
   if (numberOfCars==20) T=ma(2, 1,1, 2,3, 4,7)
   if (numberOfCars >= 21 && numberOfCars <= 200)
	   T=ma(2, 1,1, 2,3, 4,6)
  }
 if (numberOfLanes==4)
  {
   if (numberOfCars==4) T=ma(2, 2,3, 3,3,3, 1,1,1)
   if (numberOfCars==5) T=ma(2, 2,3, 2,2,2, 3,3,3)
   if (numberOfCars==6) T=ma(2, 1,1, 2,2,3, 3,5,5)
   if (numberOfCars==7) T=ma(2, 2,3, 2,2,4, 5,5,3)
   if (numberOfCars==8) T=ma(2, 1,1, 2,2,3, 3,4,2)
   if (numberOfCars==9) T=ma(2, 1,2, 2,2,4, 3,5,3)
   if (numberOfCars==10) T=ma(2, 1,1, 2,2,5, 3,3,6)
   if (numberOfCars==11) T=ma(2, 1,1, 2,2,6, 3,3,4)
   if (numberOfCars==12) T=ma(2, 1,1, 2,4,5, 3,2,8)
   if (numberOfCars==13) T=ma(2, 2,3, 2,4,12, 11,9,1)
   if (numberOfCars==14) T=ma(2, 1,1, 2,4,13, 3,5,2)
   if (numberOfCars==15) T=ma(2, 1,1, 2,3,4, 3,2,9)
   if (numberOfCars==16) T=ma(2, 1,1, 2,3,7, 3,5,9)
   if (numberOfCars==17) T=ma(2, 1,1, 2,3,4, 3,2,11)
   if (numberOfCars==18) T=ma(2, 1,1, 2,3,7, 3,5,9)
   if (numberOfCars==19) T=ma(2, 1,1, 2,3,4, 3,5,13)
   if (numberOfCars==20) T=ma(2, 1,1, 2,14,11, 12,18,3)
   if (numberOfCars==21) T=ma(2, 1,1, 4,5,10, 5,13,7)
   if (numberOfCars==22) T=ma(2, 1,1, 4,5,7, 8,12,21)
   if (numberOfCars==23) T=ma(2, 1,1, 4,7,10, 3,5,14)
   if (numberOfCars >= 24 && numberOfCars <= 26)
	   T=ma(1, 1, 2,3,4)
   if (numberOfCars==27) T=ma(2, 1,1, 4,5,6, 7,19,25)
   if (numberOfCars==28) T=ma(2, 1,1, 4,5,6, 7,20,26)
   if (numberOfCars==29) T=ma(2, 1,1, 2,3,4, 6,11,28)
   if (numberOfCars==30) T=ma(2, 1,1, 2,3,4, 6,11,29)
   if (numberOfCars==31) T=ma(2, 1,1, 2,3,4, 6,11,30)
   if (numberOfCars==32) T=ma(2, 1,1, 2,3,4, 6,12,31)
   if (numberOfCars==33) T=ma(2, 1,1, 2,3,4, 6,12,32)
   if (numberOfCars==34) T=ma(2, 1,1, 2,3,4, 6,13,33)
   if (numberOfCars==35) T=ma(2, 1,1, 2,3,4, 6,8,10)
   if (numberOfCars==36) T=ma(2, 1,1, 2,3,4, 6,8,12)
   if (numberOfCars==37) T=ma(2, 1,1, 2,3,4, 6,8,10)
   if (numberOfCars==38) T=ma(2, 1,1, 2,3,4, 6,8,13)
   if (numberOfCars >= 39 && numberOfCars <= 41)
	   T=ma(2, 1,1, 2,3,4, 6,8,10)
   if (numberOfCars==42) T=ma(2, 1,1, 2,3,4, 6,8,11)
   if (numberOfCars >= 43 && numberOfCars <= 47)
	   T=ma(2, 1,1, 2,3,4, 6,8,10)
   if (numberOfCars==48) T=ma(2, 1,1, 2,3,4, 6,8,11)
   if (numberOfCars >= 49 && numberOfCars <= 200)
	   T=ma(2, 1,1, 2,3,4, 6,8,10)
  }
 if (numberOfLanes==5)
  {
   if (numberOfCars==5) T=ma(4, 2,3,2,3, 2,2,2,2, 3,3,3,3, 1,1,1,1, 4,4,4,4)
   if (numberOfCars==6) T=ma(2, 2,3, 5,5,5,5, 1,1,1,1)
   if (numberOfCars==7) T=ma(2, 1,1, 2,2,2,2, 3,3,3,3)
   if (numberOfCars==8) T=ma(2, 1,1, 2,2,3,2, 3,3,4,5)
   if (numberOfCars==9) T=ma(2, 1,2, 2,2,2,4, 3,3,5,8)
   if (numberOfCars==10) T=ma(2, 1,1, 2,2,3,4, 3,3,6,9)
   if (numberOfCars==11) T=ma(2, 2,3, 2,2,3,5, 9,9,8,6)
   if (numberOfCars==12) T=ma(2, 1,1, 2,2,3,6, 3,3,2,8)
   if (numberOfCars==13) T=ma(2, 1,1, 2,2,3,7, 3,3,2,4)
   if (numberOfCars==14) T=ma(1, 1, 2,2,3,6)
   if (numberOfCars==15) T=ma(2, 1,1, 2,2,3,9, 3,4,2,5)
   if (numberOfCars==16) T=ma(2, 1,1, 2,2,4,7, 3,3,6,5)
   if (numberOfCars==17) T=ma(2, 1,1, 2,2,4,16, 3,3,2,8)
   if (numberOfCars==18) T=ma(2, 1,1, 2,3,4,8, 3,2,2,10)
   if (numberOfCars==19) T=ma(2, 1,1, 2,2,7,13, 3,3,2,10)
   if (numberOfCars==20) T=ma(2, 0,0, 2,2,3,7, 3,3,2,4)
   if (numberOfCars==21) T=ma(2, 2,3, 2,5,4,18, 19,16,17,3)
   if (numberOfCars==22) T=ma(2, 0,0, 2,2,3,7, 3,3,2,4)
   if (numberOfCars==23) T=ma(2, 1,1, 2,3,8,16, 3,2,7,10)
   if (numberOfCars==24) T=ma(2, 1,1, 2,5,4,21, 3,2,6,4)
   if (numberOfCars==25) T=ma(2, 1,1, 2,3,4,10, 3,2,7,12)
   if (numberOfCars==26) T=ma(2, 1,1, 2,3,7,25, 3,2,4,4)
   if (numberOfCars==27) T=ma(2, 1,1, 2,3,4,6, 3,2,6,20)
   if (numberOfCars==28) T=ma(2, 1,1, 2,3,4,8, 3,2,8,14)
   if (numberOfCars==29) T=ma(2, 1,1, 2,3,4,6, 3,2,7,28)
   if (numberOfCars==30) T=ma(2, 1,1, 2,3,4,10, 3,4,8,16)
   if (numberOfCars==31) T=ma(2, 1,1, 2,3,4,6, 3,2,18,30)
   if (numberOfCars==32) T=ma(2, 1,1, 1,2,4,5, 2,6,7,3)
   if (numberOfCars==33) T=ma(2, 1,1, 2,3,4,6, 3,5,12,32)
   if (numberOfCars==34) T=ma(2, 1,1, 2,3,4,6, 3,5,12,33)
   if (numberOfCars==35) T=ma(2, 1,1, 1,2,4,5, 2,6,10,4)
   if (numberOfCars >= 36 && numberOfCars <= 49)
	   T=ma(1, 1, 2,3,4,6)
   if (numberOfCars==50) T=ma(2, 1,1, 2,3,4,6, 8,11,17,34)
   if (numberOfCars==51) T=ma(2, 1,1, 2,3,4,6, 8,11,18,34)
   if (numberOfCars==52) T=ma(1, 1, 2,3,4,6)
   if (numberOfCars==53) T=ma(2, 1,1, 2,3,4,6, 8,11,18,36)
   if (numberOfCars==54) T=ma(2, 1,1, 2,3,4,6, 8,11,17,38)
   if (numberOfCars==55) T=ma(2, 1,1, 2,3,4,6, 8,12,17,54)
   if (numberOfCars==56) T=ma(2, 1,1, 2,3,4,6, 8,11,21,55)
   if (numberOfCars==57) T=ma(2, 1,1, 2,3,4,6, 8,11,17,41)
   if (numberOfCars==58) T=ma(2, 1,1, 2,3,4,6, 8,11,17,42)
   if (numberOfCars==59) T=ma(2, 1,1, 2,3,4,6, 8,11,17,43)
   if (numberOfCars==60) T=ma(2, 1,1, 2,3,4,6, 8,11,17,44)
   if (numberOfCars>=61 && numberOfCars<=160) T=ma(1, 1, 2,3,4,6)
   if (numberOfCars>=161 && numberOfCars<=200) T=ma(2, 1,1, 2,3,4,6, 8,11,17,44)
  }
 if (numberOfLanes==6)
  {
   if (numberOfCars==6) T=ma(2, 2,3, 5,5,5,5,5, 1,1,1,1,1)
   if (numberOfCars==7) T=ma(2, 2,3, 2,2,2,2,2, 5,5,5,5,5)
   if (numberOfCars==8) T=ma(1, 1, 2,2,2,3,2)
   if (numberOfCars==9) T=ma(1, 1, 2,2,2,2,4)
   if (numberOfCars==10) T=ma(1, 1, 2,2,2,3,2)
   if (numberOfCars==11) T=ma(1, 2, 2,2,3,5,4)
   if (numberOfCars==12) T=ma(1, 1, 2,2,2,3,4)
   if (numberOfCars==13) T=ma(1, 1, 2,2,2,3,5)
   if (numberOfCars==14) T=ma(1, 1, 2,2,2,3,6)
   if (numberOfCars==15) T=ma(1, 1, 2,2,2,3,7)
   if (numberOfCars >= 16 && numberOfCars <= 17)
	   T=ma(1, 0, 1,2,2,3,6)
   if (numberOfCars==18) T=ma(1, 1, 2,2,3,5,9)
   if (numberOfCars==19) T=ma(1, 1, 2,2,3,4,9)
   if (numberOfCars==20) T=ma(1, 1, 2,2,3,4,19)
   if (numberOfCars==21) T=ma(1, 1, 2,2,3,4,20)
   if (numberOfCars==22) T=ma(1, 1, 2,2,3,4,21)
   if (numberOfCars==23) T=ma(1, 1, 2,2,3,4,22)
   if (numberOfCars==24) T=ma(1, 1, 2,2,3,6,23)
   if (numberOfCars==25) T=ma(1, 1, 2,2,3,6,24)
   if (numberOfCars==26) T=ma(1, 1, 2,2,3,6,25)
   if (numberOfCars==27) T=ma(1, 1, 2,2,3,6,26)
   if (numberOfCars==28) T=ma(1, 1, 2,5,11,4,27)
   if (numberOfCars >= 29 && numberOfCars <= 30)
	   T=ma(1, 0, 2,3,7,15,17)
   if (numberOfCars==31) T=ma(1, 2, 2,3,7,15,17)
   if (numberOfCars >= 32 && numberOfCars <= 34)
	   T=ma(1, 0, 4,1,2,8,16)
   if (numberOfCars==35) T=ma(1, 1, 2,3,7,19,17)
   if (numberOfCars==36) T=ma(1, 1, 2,3,7,20,17)
   if (numberOfCars==37) T=ma(1, 1, 2,3,4,10,12)
   if (numberOfCars==38) T=ma(1, 1, 2,3,4,8,10)
   if (numberOfCars==39) T=ma(1, 1, 2,3,4,19,38)
   if (numberOfCars==40 || numberOfCars==43 || numberOfCars==45 || numberOfCars >= 47 && numberOfCars <= 200)
	   T=ma(1, 1, 2,3,4,6,8)
   if (numberOfCars==41) T=ma(1, 1, 2,3,4,6,12)
   if (numberOfCars==42) T=ma(1, 1, 2,3,4,8,14)
   if (numberOfCars==44 || numberOfCars==46)
	   T=ma(1, 1, 2,3,4,6,11)
  }

 j=T[0]
 for (i=0; i<=14; i++)
  { j++
   tg[i]=T[j]
  }
 var  fill, posbb, posb

 scoreg=0
 if (OS==2)
  if ( (numberOfCars+2*numberOfLanes)>21 )
   OS=3
  else
   scoreg=1

 if (numberOfRounds>tng)
 {
  if (tng>0)
  {
   alert ("Can only make up to "+tng+" rounds.")
   numberOfRounds=tng
  }
  else
  {
   alert ("No generators available for this choice.  Try adding a car and running a 'bye'.")
   dc();
   return false
  }
 }
 var cL, gL, dL, tI, aI
 var h2h, hP, hC, yI
 var gS=numberOfLanes-1

 // open the target window. Note: many browsers require existance of "dummy.htm"
 mWin=window.open(U1,"Perfect_N"+pgnum)
 pgnum+=1
 var gens=new make(gS*numberOfRounds)
 nH=numberOfRounds*numberOfCars
 pn=new make(nH*numberOfLanes)
 pn2=new make(nH*numberOfLanes)
 hP=(nH*numberOfLanes) / numberOfCars
 h2h=( hP*(numberOfLanes-1) )/( numberOfCars-1)
 sums=new make(numberOfCars)

 aI=0;
 yI=0

 for (gL=0; gL<numberOfRounds; ++gL)
 {
  tI=aI
  for (dL=0; dL<gS; ++dL) { yI++; gens [yI]=tg[tI++]; }
  aI=tI
 }

 aI=1;
 var pI=0;
 for (gL=0; gL<numberOfRounds; ++gL)
 {
  for (cL=1; cL<(numberOfCars+1); ++cL)
  {
   pn[pI++]=cL
   tC=cL
   tI=aI
   for (dL=0; dL<gS; ++dL) { tC += gens[tI++]; if (tC>numberOfCars) tC=tC-numberOfCars; pn[pI++]=tC; }
  }
  aI=tI
 }

 orderRaces()

 vtyp=cval(gens)
 /*
 if (vtyp!=T["numberOfRounds"])
 {
  alert ("Apparent generator error detected. Expected type="+T["numberOfRounds"]+" but computed type="+vtyp+".  Please Email author telling problem and values used in form.")
  d("Type error")
 }
 */
 if (T["numberOfRounds"]==0)
  mS="Miscellaneous "+numberOfCars+"-"+numberOfLanes+" ("+numberOfRounds+" Round) Chart"
//  mS="Partial Perfect "+numberOfCars+"-"+numberOfLanes+" ("+numberOfRounds+" Round) Chart with Byes"
 else if (T["numberOfRounds"]==1)
  mS="Partial Perfect "+numberOfCars+"-"+numberOfLanes+" ("+numberOfRounds+" Round) Chart"
 else if (T["numberOfRounds"]==2)
  mS="Perfect "+numberOfCars+"-"+numberOfLanes+" ("+h2h+") Chart"
 else if (T["numberOfRounds"]==3)
  mS="Complementary-Perfect "+numberOfCars+"-"+numberOfLanes+" ("+h2h+") Chart"
 else
  mS="OOPS"
 d("mS: "+mS)

if (OS>=1 && OS<=3) make_type_1_3()
else if (OS==4) make_type_4()
else if (OS==5) make_type_5()
else if (OS==6) make_type_6()

 mWin.document.close()
 dc();
 return false
}

function make_type_1_3()
{
 w("<HEAD><TITLE>"+tl+" </TITLE></HEAD>")
 w("<body><H1 ALIGN='CENTER'>" +tl+ " </H1>")
 wl("<H1 ALIGN='CENTER'>" +mS+ "</H1>")

 w('<table border=3 width='+(60+numberOfLanes*50+scoreg*numberOfCars*30)+'>')

 wl("<tr><th>")

 for (var m=1; m<(numberOfLanes+1); ++m) wl("<th colspan=2>Lane<BR>"+m)
 if (OS==2)
   wl("<th>&nbsp;<th colspan="+numberOfCars+"><font size='+1'>Car's Scores</font>")

 wl("<tr><th>Heat")
 for (m=1; m<(numberOfLanes+1); ++m)
 wl("<th>Car<th>Pl.")
 if (OS==2)
  {
   wl("<th>&nbsp;")
   for (m=1; m<(numberOfCars+1); ++m)
    if ( m<10 ) wl("<th>&nbsp;"+m+"&nbsp;")
    else wl("<th>"+m)
  }

 hC=1     // keep track of which heat we're processing
 var pI=0;  // point to start of pn array

 for (gL=0; gL<nH; ++gL)
 {
  wl("<tr align='center'><th>"+(hC++))
  posb=pI
  for (cL=0; cL<numberOfLanes; ++cL)
   { w("<th>"); w(pn2[pI++]); wl("<td>&nbsp;&nbsp;") }
   if (OS==2)
   {
    wl("<td>&nbsp;")
    for (m=1; m<(numberOfCars+1); ++m)
    {
     fill=" = "
     posbb=posb
     for (k=0; k<numberOfLanes; ++k)
      if ( pn2[posbb++]==m ) fill="&nbsp;"
     wl("<th>"+fill)
    }
   }
 }

  if (OS==2)
  {
   wl("<tr><th colspan="+(2+numberOfLanes*2)+" align='right'>Car's Scores: ")
   for (m=1; m<(numberOfCars+1); ++m) wl("<td>&nbsp;")
   wl("<tr><th colspan="+(2+numberOfLanes*2)+" align='right'>Finish Place: ")
   for (m=1; m<(numberOfCars+1); ++m) wl("<td>&nbsp;")
  }

  wl("</table><BR><BR><font size='-1'>")

  w("Recommended Scoring: First place-"+numberOfLanes)
  w(" points, Second place-"+(numberOfLanes-1))
  wl(" points, etc.<BR><BR>")

  w("Chart optimization weights applied: <BR>")
  wl("Balance heat counts: "+W1+"; Avoid consecutive heats: "+W2+"; Avoid consecutive lanes: "+W3+"<BR><BR>")

  wl(CA+"<BR>")

  w("Permission is granted to any Cub Scout pack to ")
  w("reproduce this form in whole for use in their ")
  wl("Pinewood Derby.<BR>")

  w("It is especially recommended that it be ")
  w("reproduced on overhead projection transparencies ")
  wl("for scorekeeping.<BR>")
  wl("<BR>"+dS+"<BR>")
  wl("<BR>"+src)
  fill="<BR><BR><BR><BR><BR><BR>&nbsp;<BR>"
  wl(fill)

 if (OS==3)
 {
  sl("<HTML><head><TITLE>"+tl+" - Scoresheet</TITLE></HEAD><BODY><H1 align=center>"+tl+"<BR>Scoresheet</H1>")
  sl("<BR><TABLE border=3 width="+(80+numberOfRounds*numberOfLanes*40)+"><TR><TH COLSPAN=")
  sl((numberOfRounds*numberOfLanes+2)+" ALIGN=CENTER>SCORESHEET<TR><TH>Car<TH COLSPAN=")
  sl((numberOfRounds*numberOfLanes)+" ALIGN=CENTER>Scores<TH>Total")
  for (m=1; m<(numberOfCars+1); ++m)
  {
   sl("<TR VALIGN=TOP><TH><BR>"+m)
   posbb=0
   for (i=0; i<nH; ++i)
    for (k=0; k<numberOfLanes; ++k)
     if ( pn2[posbb++]==m )
      if (i<9) sl("<TD>"+(i+1)+"&nbsp;")
      else     sl("<TD>"+(i+1))
   sl("<TD>&nbsp;")
  }
  sl("</TABLE><BR><BR><BR>"+CA)
  sl("<BR>"+dS+"<BR>"+src+"</font></body></HTML>")
  sc()
 }

 w("</font></body>")
 wl(" ")
}

function make_type_4()
{
 var sp=" ";
 w("<HEAD><TITLE>"+tl+"</TITLE></HEAD>")

 w("<body><H1 ALIGN='CENTER'>" +tl+ " </H1>")
 w("<H2 ALIGN='CENTER'>" +mS+ "</H2>")
 w("<P>Data formatted for direct copy into DerbySim or DerbyChk</P><pre>");
 wl(numberOfCars+sp+nH+sp+numberOfLanes);
 var pI=0;
 for (gL=0; gL<nH; ++gL)
 {
  for (cL=0; cL<numberOfLanes; ++cL)
  {
    if (cL==numberOfLanes-1) w(pn2[pI++]);
    else w(pn2[pI++]+sp);
  }
  wl(" ");
 }
 w("<BR><BR>Chart optimization weights applied: <BR>")
 w("Balance heat counts: "+W1+"; Avoid consecutive heats: "+W2+"; Avoid consecutive lanes: "+W3+"<BR><BR>")

 w(CA+"<BR><BR>"+src)

 fill="<BR><BR><BR><BR><BR><BR>&nbsp;<BR>"
 w(fill)
 w(fill+fill+fill+fill)
 w("</font></body>")
 w(" ")
}

function make_type_5()
{
 var sp="\t";
 w("<HEAD><TITLE>"+tl+"</TITLE></HEAD>")

 w("<body><H1 ALIGN='CENTER'>" +tl+ " </H1>")
 w("<H2 ALIGN='CENTER'>" +mS+ "</H2>")
 w("<P>Tab-delimited text</P><pre>");
 wl(numberOfCars+sp+nH+sp+numberOfLanes);
 var pI=0;
 wl(" ");
 wl(" ");
 wl(" ");
 for (gL=0; gL<nH; ++gL)
 {
  w(gL+1); w(sp);
  for (cL=0; cL<numberOfLanes; ++cL)
  {
    if (cL==numberOfLanes-1) w(pn2[pI++]);
    else w(pn2[pI++]+sp);
  }
  wl(" ")
 }
 wl(" ")
 wl(" ")
 w("<BR><BR>Chart optimization weights applied: <BR>")
 w("Balance heat counts: "+W1+"; Avoid consecutive heats: "+W2+"; Avoid consecutive lanes: "+W3+"<BR><BR>")

 w(CA+"<BR><BR>"+src)

 fill="<BR><BR><BR><BR><BR><BR>&nbsp;<BR>"
 w(fill)
 w(fill+fill+fill+fill)
 w("</font></body>")
 w(" ")
}

function make_type_6() {
var tdy=new Date();
var ident ="A"+Date.parse(tdy);

  w('<TITLE>'+tl+' </TITLE><script type="text/javascript">')
  w('<')
  w('!')
  wl('--')

  wl('var cid="' +ident+ '"; var title="' +tl+ ' "; var subtitle="' +mS+ '"; var lanes=' +numberOfLanes+ '; var cars=' +numberOfCars+ '; var rounds='+numberOfRounds+ '; var crl=lanes*cars*rounds; ')

 wl('var cht=new make(); var tot=new make(); var plc=new make(); var plci=new make(); var fin=0; src="' +src+ '"')

 j=0
 for (i=1; i<=numberOfCars*numberOfLanes*numberOfRounds; i++) wl('cht[' +(j+1)+ ']='+pn2[j++]+'; ')

 wl('var wo=0; var mem; var E1=0; var rw=new make(); for (i=1; i <= lanes; i++) rw[i]=0; var res=new make(); for (i=1; i <= crl; i++) res[i]=0; ')

 wl('var chk=new make(); var mWin; var today=new Date(); var expy=new Date(today.getTime()+28*24*60*60*1000);')

// array create
 wl('function make() {this[0]=0; return this}')

// partial line write
 wl('function w(m)   {mWin.document.write(m)}')

// end of line write
 wl('function wl(m) {mWin.document.writeln(m)}')

// page load initialization
 wl('function load() {  mem=getCookie(cid);  if (mem=="") { mem=""; for (i=1; i<=crl; i++) mem += "0"; makeCookie(cid,mem);  ')

 wl('document.f2.cki.value="No recovery data is available.";  document.f2.L1_1.focus(); document.f2.L1_1.select();}')

 wl('else {for (i=1; i<=crl; i++)  res[i]=mem.charAt(i-1); document.f2.cki.value="Recovery data is available.";  document.f2.cki.focus(); document.f2.cki.select()}}')

// element "onFocus" handler
 wl('function s(obj,i) {obj.select(); rw[i]=obj.value;}')

// element validation "onChange" handler
 wl('function v(obj,col){E1=0; if ((obj.value<1 ) || (obj.value>lanes )) {alert("Invalid Value!"); obj.value =""; obj.focus(); s(obj);} else rw[col]=obj.value;}')

// heat checker (no ties) handler
 wl('function ch(obj) {E1=0; for (i=1; i <= lanes; i++) chk[i]=0; for (i=1; i <= lanes; i++) chk[rw[i]]++; for (i=1; i <= lanes; i++) { if (chk[i] !=1) { alert("Scoring error"); s(obj); return;} obj.value="Ready"; }}')

// heat score recording handler
 wl('function OO(obj,x) { E1=0; obj.value="Stored"; ln=""; for (i=1; i<=lanes; i++) {res[(x-1)*lanes+i]=rw[i];  ln +=  rw[i];} if (x==1) mem=ln+mem.substring(lanes,crl); else if (x==cars*rounds) ')

 wl('mem=mem.substring(0,crl-lanes)+ln; else mem=mem.substring(0,(x-1)*lanes)+ln+mem.substring(x*lanes,crl); makeCookie(cid,mem); if (x==cars*rounds) fx(1); else fx(0);}')

// refresh results array from (cookie) memory

 wl('function refr() { E1=0; mem=getCookie(cid); for (i=1; i<=crl; i++) res[i]=mem.charAt(i-1); j=4; for (i=1; i<=cars*rounds; i++) {for (k=1; k<=lanes; k++) {z=res[(i-1)*lanes+k]; if (z==0) ')

 wl('document.f2.elements[j].value=""; else document.f2.elements[j].value=res[(i-1)*lanes+k]; j++;}   document.f2.elements[j++].value="Ready"; document.f2.elements[j++].value="Stored"; }}')

// clear results array and (cookie) memory.
 wl('function cler() { E1=1;}')

 wl('function cler2() { if (E1==1) { E1=0; deleteCookie(cid); mem=""; for (i=1; i<=crl; i++) { res[i] =0; mem += "0";} document.f2.cki.value=""; document.f2.fi.value=""; fin=0; j=4; for (i=1; i<=cars*rounds; i++) ')

 wl('{for (k=1; k<=lanes; k++) document.f2.elements[j++].value=""; document.f2.elements[j++].value=""; document.f2.elements[j++].value=""; }}}')

// cookie management routines
 wl('function deleteCookie(name) { document.cookie=name+escape(" ")+"; expires=Thu, 01-Jan-70 00:00:01 GMT";}')

 wl('function getCookie(name) {memo=document.cookie; var ix=memo.indexOf(name+"="); if (ix==-1) return ""; ix=memo.indexOf("=",ix)+1; var ends=memo.indexOf(";",ix); ')

 wl('if (ends==-1) ends=memo.length; return unescape(memo.substring(ix,ends));}')

 wl('function makeCookie(name,v) {if (v != null && v != "") {  document.cookie=name+"="+escape(v)+"; expires="+expy.toGMTString(); memo=document.cookie} document.f2.cki.value="Recovery data is available.";}')

// toggle the "final" switch
 wl('function fx(x){ if (x<0) {if (fin==1) { fin=0; document.f2.fi.value="";} else { fin=1; document.f2.fi.value="Final!";}} else {fin=x; if (fin==1) document.f2.fi.value="Final!"; else document.f2.fi.value="";}}')

// Toggle window indicator
 wl('function tog() {wo=1-wo}')

// produce score sheet!
 wl('function score() {E1=0; if (wo==1) {cls(); alert("Pausing while window closes!");} for (i=1; i<=cars; i++) {tot[i]=0; for (j=1; j<=crl; j++) if (i==cht[j]) if (res[j]>0) tot[i]+= (lanes+1-res[j]);} if (fin==1) cpl(); ')

 wl('mWin=window.open("'+U2+'","Score"); wo=1; wl("<HTML><HEAD><TITLE>" +title+ "</TITLE></HEAD>");wl("<BODY><H1 ALIGN=CENTER>"); wl(title); wl("</H1><H2 ALIGN=CENTER>"); ')

 wl('w(subtitle); wl("</H2>"); if (fin==1) wl("<H2 ALIGN=CENTER>FINAL</H3>"); wl("<H2 ALIGN=CENTER>"+today+"</H3>"); ')

 wl('wl("<H3>Close window using button on main screen only!</H3>"); w("<TABLE BORDER=3><TR><TH COLSPAN="); if (fin==1) wl(3+lanes*rounds); else wl(2+lanes*rounds); ')

 wl('wl(" ALIGN=CENTER>SCORESHEET"); w("<TR><TH>Car<TH COLSPAN="); w(lanes*rounds); wl(" ALIGN=CENTER>Scores<TH>Total"); ')

 wl('if (fin==1) wl("<TH>Place"); for (i=1; i<=cars; i++) {w("<TR VALIGN=center align=center><TH><big>"); w(i); wl("</big>"); for (j=1; j<=crl; j++) if (i==cht[j]) {w("<TD><big>"); ')

 wl('if (res[j]==0) w("&nbsp;"); else w(lanes+1-res[j]); wl("</big>");} w("<TH><big>"); w(tot[i]); wl("</big>"); if (fin==1) wl("<td>"+plci[plc[i]]);} ')

 wl('wl("</TABLE><BR><BR><BR>'+CA+'"); w("<BR>"+src); wl("</BODY></HTML>"); mWin.document.close();}')

// close score sheet!
 wl('function cls() {if (wo==1) {mWin.window.close(); wo=0;}}')

// compute places
 wl('function cpl(){ ip=1; plci[ip]="&nbsp;"; pl=1; lpl=0; for (i=1; i <= cars; i++) plc[i]=1; for (k=lanes*rounds*lanes; ')

 wl('k>=0&&lpl<(cars+1)/2; k--) {fnd=0; for (i=1; i<=cars; i++) {if (tot[i]==k) { if (fnd==0) {fnd=1; ip++;} lpl++; plc[i]=ip;} if (fnd==1) { if (lpl==pl) plci[ip]=pl; else plci[ip]="tie "+pl+"-"+lpl;}} pl=lpl+1}}')

 w('//')
 w('-')
 w('-')
 wl('>')

 w('</script></HEAD><body onLoad="load();"><H1 ALIGN=CENTER>' +tl)

 w(' </H1><H2 ALIGN=CENTER>')

 wl(mS)

 wl('</H2><H3 ALIGN=CENTER>(This page must be saved to a file for successful recovery/restart.)</H3><form name="f2" action=";"><table>')

 wl('<tr><td><INPUT type="text" Name="cki" value="" maxlength=35 size=35><td><INPUT TYPE="button" VALUE="Refresh from Memory" NAME="cB" onClick="refr();"></table>')

 wl('<table><tr><td><INPUT TYPE="button" VALUE="Erase Memory!" NAME="cB" onClick="cler();">')

 wl('<td><input TYPE="button" VALUE="Yes! I am Sure!" Name="Pass" onClick="cler2();"></table><BR><BR><HR><BR><BR>')

 wl('<table border=3><tr><th>&nbsp;')

for (i=1; i<=numberOfLanes; i++) wl('<th colspan=2>Lane<BR>'+i)
wl('<th rowspan=2>Edit the<br>values.<th rowspan=2>Store the<br>values.')

 wl('<tr><th>Heat')

 for (i=1; i<=numberOfLanes; i++) wl('<th><B>Car<th>Pl.</B>')

j=0;
for (i=1; i<=numberOfCars*numberOfRounds; i++)
{
wl('<tr align="center"><td><B>' +i+ '</B>')
for (k=1; k<=numberOfLanes; k++) wl('<td><B>'+ pn2[j++]+ '<td><input type="text" onFocus="s(this,' +k+ ');" Name="L' +i+ '_' +k+ '" maxlength=1 size=1 onChange="v(this,' +k+ ');">')

wl('<td><INPUT TYPE="text" NAME="cB" maxlength=6 size=6 onFocus="ch(this);"><td><INPUT TYPE="text" NAME="cB" maxlength=6 size=6 onFocus="OO(this,' +i+ ');">')
}
 wl('</table><BR><HR><BR><table><tr><td><INPUT TYPE="button" VALUE="Final?" NAME="cB" onClick="fx(-1);"><td><INPUT TYPE="text" NAME="fi" maxlength=6 size=6>')

 wl('<td><INPUT TYPE="button" VALUE="Show the Scoresheet" NAME="cB" onClick="score();"><td><INPUT TYPE="button" VALUE="Close the Scoresheet" NAME="cB" onClick="cls();">')

 wl('<td><INPUT TYPE="button" VALUE="(Toggle Window)" NAME="cB" onClick="tog();">')

 wl('</table></form>')

 wl('<BR><BR>Scoring Used: First place - ' +numberOfLanes+' points, Second place - ' +(numberOfLanes-1)+ ' points, ...<BR><BR>Chart optimization weights applied: <UL><LI>Balance heat counts: ' +W1+ '<LI>Avoid consecutive heats: ' +W2+';')

 wl('<LI>Avoid consecutive lanes: ' +W3+ '</UL><BR><BR>'+CA)

 wl('<BR>Permission is granted to any Cub Scout pack to reproduce this form on paper or computer memory in whole for use in their Pinewood Derby.')

 w('<BR>'+src)

 wl('<BR><BR><BR><BR><BR><BR><BR><BR>')
 }
