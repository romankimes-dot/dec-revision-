import sys, re, xml.etree.ElementTree as ET
D='/tmp/claude-0/-home-user-dec-revision-/849c430f-c4c8-5348-b254-943d0289cfb2/scratchpad/dl/'
T=["34","35","38","39","39 C","50-0","92","93","102 ter","145","150-0 A","150-0 B ter","150-0 D","150-0 D ter","150 U","150 V","150 VB","150 VC","150 VD","150 VE","150 VF","150 VG","150 VH","151 septies","151 septies A","151 septies B","155","158","199 terdecies-0 A","200","200 A","206","209","210 A","216","219","223 A","231 quater","238 bis","238 quindecies","239","239 quater A","260","293 B","719","726","787 B","1717","39 duodecies","39 quindecies"]
def load(f):
    r=ET.parse(D+f).getroot(); out={}
    for a in r.iter('article'):
        out.setdefault(a.get('num'),[]).append(a)
    return out
if __name__=='__main__':
    c=load('cgi.xml')
    tot=0
    for n in T:
        for a in c.get(n,[]):
            L=len(''.join(a.itertext())); tot+=L if a.get('etat')=='VIGUEUR' else 0
            print(f"{n:22} {a.get('etat'):8} {a.get('date')} {L:7} {a.get('id')} {a.get('modTitle')[:70]!r}")
        if n not in c: print(n,'ABSENT')
    print('total chars',tot)
