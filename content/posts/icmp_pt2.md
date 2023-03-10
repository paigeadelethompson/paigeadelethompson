+++
Title = "Should I enable ICMP? (Pt. 2)"
Date = "2023-01-22T23:20:20-0800"
Author = "Paige"
Description = "Setting up NFTables"
cover = "img/og.png"
tags = ["Security", "NFTables"]
+++

## Intro 

This is part two of another post I wrote: [Should I enable ICMP?](/posts/icmp/)

The goals of this firewall ruleset are as follows: 
- Enforce sane limits over the number of automated ICMP responses that can be elicited by sources on the internet; mitigating ICMP amplification while still allowing some symbolance of networking mechanisms that rely on ICMP to function. 
- Establish the basis for a "zero trust" model by ensuring the use of end-to-end encrypted protocols for necessary egress traffic (primarily NTPSEC and DoTLS.) This is necessary in an environment where protocols like `NDP-RA` are in use because of the possibility that other users on a network can advertise routes themselves which can potentially be used to hijack another user's traffic. Unauthorized route advertisements can certainly be mitigated with multicast filtering/snooping however it is not necessarily consistent from one network to the next. 
- Providing an abstract ruleset such that it can be the basis for application virtually anywhere while minimizing the amount of overhead that can be potentially introduced by abstraction as much as possible (YMMV)

The simplest way to go about this is to start at the [filter state / configuration format](#filter-state--configuration-format) section.

## Preparation
This demo uses Debian on Parallels, updated from `bullseye` to `bookworm`:
```
sed -i 's/http:\/\//https:\/\//g' /etc/apt/sources.list
sed -i 's/bullseye/bookworm/g' apt/sources.list
apt update && apt -y dist-upgrade
apt -y install nftables chrony systemd-resolved && reboot
```
### Chrony (NTPSEC)
Unencrypted NTP (UDP 123) destinations will only be permitted in the NFTables ruleset if they are local networks, if you need internet time setup `chrony`
Disable `systemd-timesyncd` if it is enabled:

```
sudo systemctl stop systemd-timesyncd.service
sudo systemctl disable systemd-timesyncd.service
```

replace `/etc/chrony.conf` with: 
```
confdir       /etc/chrony/conf.d
server        time.cloudflare.com nts iburst
sourcedir     /run/chrony-dhcp
sourcedir     /etc/chrony/sources.d
keyfile       /etc/chrony/chrony.keys
driftfile     /var/lib/chrony/chrony.drift
ntsdumpdir    /var/lib/chrony
logdir        /var/log/chrony
maxupdateskew 100.0
rtcsync
makestep      1 3
leapsectz     right/UTC
```
Enable the `Chrony` service: 
```
systemctl enable chrony
systemctl start chrony 
```
(a list of [other NTS-enabled NTP servers](https://gist.github.com/jauderho/2ad0d441760fc5ed69d8d4e2d6b35f8d) is available.)

### DNSoTLS
Unencrypted DNS (UDP 53) destinations will only be permitted in the NFTables ruleset if they are local networks, if you need internet DNS setup `systemd-resolved` with `DoTLS` then
replace the contents of `/etc/systemd/resolved.conf` with:
```
[Resolve]
DNS=1.1.1.1,1.0.0.1,2606:4700:4700::1111,2606:4700:4700::1001
DNSSEC=yes
DNSOverTLS=yes
```

start `systemd-resolved`:
```
systemctl enable systemd-resolved
systemctl start systemd-resolved
```

## Creating the default table
{{< highlight bash >}}
nft flush ruleset
nft add table inet filter
{{< / highlight >}}

### Chains
{{< highlight bash >}}
nft add chain inet filter input '{ type filter hook input priority filter; policy accept; }'
nft add chain inet filter forward '{ type filter hook forward priority filter; policy accept; }'
nft add chain inet filter output '{ type filter hook output priority filter; policy accept; }'
nft add chain inet filter prerouting '{ type nat hook prerouting priority 100; policy accept; }'
nft add chain inet filter postrouting '{ type nat hook postrouting priority 100; policy accept; }'
nft add chain inet filter masq
nft add chain inet filter ether_in
nft add chain inet filter ether_out
nft add chain inet filter ether_forward
nft add chain inet filter icmp_in
nft add chain inet filter icmp_out
nft add chain inet filter icmp_forward
nft add chain inet filter icmp_echo_reply_rate_limit
nft add chain inet filter reject_with_icmp_port_unreachable_metered
nft add chain inet filter reject_with_icmp_port_unreachable
nft add chain inet filter reject_with_icmp_host_unreachable_metered
nft add chain inet filter reject_with_icmp_host_unreachable
nft add chain inet filter reject_with_icmp_no_route_metered
nft add chain inet filter reject_with_icmp_no_route
nft add chain inet filter reject_with_icmp_admin_prohibited_metered
nft add chain inet filter reject_with_icmp_admin_prohibited
nft add chain inet filter tcp_in
nft add chain inet filter tcp_out
nft add chain inet filter tcp_forward
nft add chain inet filter udp_in
nft add chain inet filter udp_out
nft add chain inet filter udp_forward
nft add chain inet filter bogon
nft add rule inet filter bogon log prefix "bogon" group 1
nft add rule inet filter bogon counter drop
nft add chain inet filter wont_forward
nft add rule inet filter wont_forward log prefix "wont_forward" group 1
nft add rule inet filter wont_forward counter drop
{{< / highlight >}}

### Meter sets
{{< highlight bash >}}
nft add set inet filter icmp_egress_meter4 '{ type ipv4_addr; size 8; flags timeout, dynamic; }'
nft add set inet filter icmp_egress_meter6 '{ type ipv6_addr; size 8; flags timeout, dynamic; }'
{{< / highlight >}}

### Verdict maps and sets
#### IPv4 bogons
{{< highlight bash >}}
nft add map inet filter drop_bogons4 '{ type ipv4_addr : verdict; flags interval; }'
nft add element inet filter drop_bogons4 '{ 224.0.0.0/4     : continue   }'
nft add element inet filter drop_bogons4 '{ 192.168.0.0/16  : continue   }'
nft add element inet filter drop_bogons4 '{ 10.0.0.0/8      : continue   }'
nft add element inet filter drop_bogons4 '{ 172.16.0.0/12   : continue   }' 
nft add element inet filter drop_bogons4 '{ 169.254.0.0/16  : continue   }'
nft add element inet filter drop_bogons4 '{ 100.64.0.0/10   : jump bogon }' 
nft add element inet filter drop_bogons4 '{ 0.0.0.0/8       : jump bogon }'
nft add element inet filter drop_bogons4 '{ 127.0.0.0/8     : jump bogon }'
nft add element inet filter drop_bogons4 '{ 192.0.0.0/24    : jump bogon }'
nft add element inet filter drop_bogons4 '{ 192.0.2.0/24    : jump bogon }'
nft add element inet filter drop_bogons4 '{ 198.18.0.0/15   : jump bogon }'
nft add element inet filter drop_bogons4 '{ 198.51.100.0/24 : jump bogon }' 
nft add element inet filter drop_bogons4 '{ 203.0.113.0/24  : jump bogon }'
nft add element inet filter drop_bogons4 '{ 240.0.0.0/4     : jump bogon }'
{{< / highlight >}}

#### Local networks
{{< highlight bash >}}
nft add set inet filter local_networks '{ type ipv4_addr; flags interval; }'
nft add element inet filter local_networks '{ 169.254.0.0/16, 10.0.0.0/8, 172.17.0.0/12, 192.168.0.0/16 }'
{{< / highlight >}}
##### TODO 
- Class E / limited broadcast (240.0.0.0/4)

#### IPv6 bogons
{{< highlight bash >}}
nft add map inet filter drop_bogons6 '{ type ipv6_addr : verdict; flags interval; }'
nft add element inet filter drop_bogons6 '{ fe80::/10             : continue   }'
nft add element inet filter drop_bogons6 '{ fc00::/7              : continue   }'
nft add element inet filter drop_bogons6 '{ ff00::/8              : continue   }'
nft add element inet filter drop_bogons6 '{ ::ffff:0:0/96         : jump bogon }'
nft add element inet filter drop_bogons6 '{ ::/96                 : jump bogon }'
nft add element inet filter drop_bogons6 '{ 100::/64              : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:10::/28          : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:db8::/32         : jump bogon }'
nft add element inet filter drop_bogons6 '{ fec0::/10             : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002::/24             : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:a00::/24         : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:7f00::/24        : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:a9fe::/32        : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:ac10::/28        : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:c000::/40        : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:c000:200::/40    : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:c0a8::/32        : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:c612::/31        : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:c633:6400::/40   : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:cb00:7100::/40   : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:e000::/20        : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2002:f000::/20        : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001::/40             : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:a00::/40       : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:7f00::/40      : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:a9fe::/48      : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:ac10::/44      : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:c000::/56      : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:c000:200::/56  : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:c0a8::/48      : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:c612::/47      : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:c633:6400::/56 : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:cb00:7100::/56 : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:e000::/36      : jump bogon }'
nft add element inet filter drop_bogons6 '{ 2001:0:f000::/36      : jump bogon }'
{{< / highlight >}}
##### TODO 
- Multicast scopes; node-local `ff01::` vs. link-local `ff02::` vs. site-local `ff05::`
- variable scope
- more info: https://www.iana.org/assignments/ipv6-multicast-addresses/ipv6-multicast-addresses.xhtml

#### IPv4 reject or drop
{{< highlight bash >}}
nft add map inet filter reject_or_drop_port4 '{ typeof ip saddr . ip daddr : verdict; flags interval; }'
nft add element inet filter reject_or_drop_port4 '{ 10.0.0.0/8     . 10.0.0.0/8     : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port4 '{ 172.16.0.0/12  . 172.16.0.0/12  : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port4 '{ 192.168.0.0/16 . 192.168.0.0/16 : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port4 '{ 169.254.0.0/16 . 169.254.0.0/16 : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port4 '{ 0.0.0.0/0      . 0.0.0.0/0      : jump reject_with_icmp_port_unreachable_metered }'
{{< / highlight >}}

#### IPv6 reject or drop
{{< highlight bash >}}
nft add map inet filter reject_or_drop_port6 '{ typeof ip6 saddr . ip6 daddr : verdict; flags interval; }'
nft add element inet filter reject_or_drop_port6 '{ fe80::/10 . fe80::/10 : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port6 '{ fc00::/7  . fc00::/7  : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port6 '{ ::/0      . ::/0      : jump reject_with_icmp_port_unreachable_metered }'
{{< / highlight >}}

#### IPv4 ingress ICMP types
{{< highlight bash >}}
nft add map inet filter icmp_types_in4 '{ typeof ip saddr . ip daddr . icmp type : verdict; flags interval; }'
nft add element inet filter icmp_types_in4 '{ 0.0.0.0/0 . 0.0.0.0/0 . echo-request            : accept }'
nft add element inet filter icmp_types_in4 '{ 0.0.0.0/0 . 0.0.0.0/0 . echo-reply              : accept }'
nft add element inet filter icmp_types_in4 '{ 0.0.0.0/0 . 0.0.0.0/0 . destination-unreachable : accept }'
{{< / highlight >}}

#### IPv6 ingress ICMP types
{{< highlight bash >}}
nft add map inet filter icmp_types_in6 '{ typeof ip6 saddr . ip6 daddr . icmpv6 type : verdict; flags interval; }'
nft add element inet filter icmp_types_in6 '{ fe80::/10 . fe80::/10 . echo-request        : accept }'
nft add element inet filter icmp_types_in6 '{ fe80::/10 . ff00::/8  . echo-request        : accept }'
nft add element inet filter icmp_types_in6 '{ fc00::/7  . fc00::/7  . echo-request        : accept }'
nft add element inet filter icmp_types_in6 '{ fe80::/10 . fe80::/10 . echo-reply          : accept }'
nft add element inet filter icmp_types_in6 '{ fe80::/10 . ff00::/8  . echo-reply          : accept }'
nft add element inet filter icmp_types_in6 '{ fc00::/7  . fc00::/7  . echo-reply          : accept }'
nft add element inet filter icmp_types_in6 '{ fe80::/10 . fe80::/10 . nd-neighbor-solicit : accept }'
nft add element inet filter icmp_types_in6 '{ fc00::/7  . ff00::/8  . nd-neighbor-solicit : accept }'
nft add element inet filter icmp_types_in6 '{ fc00::/7  . fc00::/7  . nd-neighbor-solicit : accept }'
nft add element inet filter icmp_types_in6 '{ fc00::/7  . fc00::/7  . nd-neighbor-advert  : accept }'
nft add element inet filter icmp_types_in6 '{ fe80::/10 . fe80::/10 . nd-neighbor-advert  : accept }'
nft add element inet filter icmp_types_in6 '{ fe80::/10 . ff00::/8  . nd-router-advert    : accept }'
nft add element inet filter icmp_types_in6 '{ fe80::/10 . fe80::/10 . nd-router-advert    : accept }'
{{< / highlight >}}

##### TODO 
- NDP for GUA

#### IPv4 ingress TCP ports
{{< highlight bash >}}
nft add map inet filter tcp_ports_in4 '{ typeof ip saddr . ip daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_in4 '{ 0.0.0.0/0 . 0.0.0.0/0 . 22 : accept }'
{{< / highlight >}}

#### IPv6 ingress TCP ports
{{< highlight bash >}}
nft add map inet filter tcp_ports_in6 '{ typeof ip6 saddr . ip6 daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_in6 '{ ::/0 . ::/0 . 22 : accept }'
{{< / highlight >}}

#### IPv4 ingress UDP ports
{{< highlight bash >}}
nft add map inet filter udp_ports_in4 '{ typeof ip saddr . ip daddr . udp dport : verdict; flags interval; }'
nft add element inet filter udp_ports_in4 '{ 169.254.0.0/16 . 169.254.0.0/16 . 68   : accept }'
nft add element inet filter udp_ports_in4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 68   : accept }'
nft add element inet filter udp_ports_in4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 68   : accept }'
nft add element inet filter udp_ports_in4 '{ 192.168.0.0/12 . 192.168.0.0/16 . 68   : accept }'
nft add element inet filter udp_ports_in4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 137  : accept }'
nft add element inet filter udp_ports_in4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 137  : accept }'
nft add element inet filter udp_ports_in4 '{ 192.168.0.0/12 . 192.168.0.0/16 . 137  : accept }'
nft add element inet filter udp_ports_in4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 5353 : accept }'
nft add element inet filter udp_ports_in4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 5353 : accept }'
nft add element inet filter udp_ports_in4 '{ 192.168.0.0/12 . 192.168.0.0/16 . 5353 : accept }'
nft add element inet filter udp_ports_in4 '{ 10.0.0.0/8     . 224.0.0.0/4    . 5353 : accept }'
nft add element inet filter udp_ports_in4 '{ 172.16.0.0/12  . 224.0.0.0/4    . 5353 : accept }'
nft add element inet filter udp_ports_in4 '{ 192.168.0.0/12 . 224.0.0.0/4    . 5353 : accept }'
{{< / highlight >}}

#### IPv6 ingress UDP ports
{{< highlight bash >}}
nft add map inet filter udp_ports_in6 '{ typeof ip6 saddr . ip6 daddr . udp dport : verdict; flags interval; }'
nft add element inet filter udp_ports_in6 '{ fe80::/10 . ff00::/8 . 546   : accept }'
nft add element inet filter udp_ports_in6 '{ fe80::/10 . ff00::/8 . 5353  : accept }'
nft add element inet filter udp_ports_in6 '{ fc00::/7  . ff00::/8 . 5353  : accept }'
{{< / highlight >}}

#### IPv4 default forward networks
{{< highlight bash >}}
nft add map inet filter default_forward4 '{ typeof ip saddr . ip daddr . ct state : verdict; flags interval; }'
nft add element inet filter default_forward4 '{ 169.254.0.0/16 . 0.0.0.0/0      . new         : jump wont_forward }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 169.254.0.0/16 . new         : jump wont_forward }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 172.16.0.0/12  . new         : jump reject_with_icmp_no_route }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 192.168.0.0/16 . new         : jump reject_with_icmp_no_route }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 10.0.0.0/8     . new         : jump reject_with_icmp_no_route }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 192.168.0.0/16 . new         : jump reject_with_icmp_no_route }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 10.0.0.0/8     . new         : jump reject_with_icmp_no_route }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 172.16.0.0/12  . new         : jump reject_with_icmp_no_route }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . new         : continue }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . established : accept }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . new         : continue }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . established : accept }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . new         : continue }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . established : accept }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . new         : continue }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . new         : continue }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . new         : continue }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 10.0.0.0/8     . established : accept }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 172.16.0.0/12  . established : accept }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 192.168.0.0/16 . established : accept }'
{{< / highlight >}}

#### IPv6 default forward networks
{{< highlight bash >}}
nft add map inet filter default_forward6 '{ typeof ip6 saddr . ip6 daddr . ct state : verdict; flags interval; }'
nft add element inet filter default_forward6 '{ fe80::/10 . ::/0      . new : jump wont_forward }'
nft add element inet filter default_forward6 '{ ::/0      . fe80::/10 . new : jump wont_forward }'
nft add element inet filter default_forward6 '{ fc00::/7  . fc00::/7  . new : continue }'
nft add element inet filter default_forward6 '{ fc00::/7  . fc00::/7  . established : accept }'
{{< / highlight >}}

#### IPv4 egress ICMP types
{{< highlight bash >}}
nft add map inet filter icmp_types_out4 '{ typeof ip saddr . ip daddr . icmp type : verdict; flags interval; }'
nft add element inet filter icmp_types_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . echo-request            : accept }'
nft add element inet filter icmp_types_out4 '{ 172.16.0.0/12  . 0.0.0.0/0      . echo-request            : accept }'
nft add element inet filter icmp_types_out4 '{ 192.168.0.0/16 . 0.0.0.0/0      . echo-request            : accept }'
nft add element inet filter icmp_types_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . echo-reply              : accept }'
nft add element inet filter icmp_types_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . echo-reply              : accept }'
nft add element inet filter icmp_types_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . echo-reply              : accept }'
nft add element inet filter icmp_types_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . destination-unreachable : accept }'
nft add element inet filter icmp_types_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . destination-unreachable : accept }'
nft add element inet filter icmp_types_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . destination-unreachable : accept }'
nft add element inet filter icmp_types_out4 '{ 0.0.0.0/0      . 0.0.0.0/0      . echo-reply              : jump icmp_echo_reply_rate_limit }'
{{< / highlight >}}

#### IPv6 egress ICMP types 
{{< highlight bash >}}
nft add map inet filter icmp_types_out6 '{ typeof ip6 saddr . ip6 daddr . icmpv6 type : verdict; flags interval; }'
nft add element inet filter icmp_types_out6 '{ fe80::/10 . ff00::/8  . echo-request        : accept }'
nft add element inet filter icmp_types_out6 '{ fc00::/7  . fc00::/7  . echo-reply          : accept }'
nft add element inet filter icmp_types_out6 '{ 2000::/3  . ::/0      . echo-reply          : jump icmp_echo_reply_rate_limit }'
nft add element inet filter icmp_types_out6 '{ fc00::/7  . fc00::/7  . nd-neighbor-advert  : accept }'
nft add element inet filter icmp_types_out6 '{ fe80::/10 . fe80::/10 . nd-neighbor-advert  : accept }'
nft add element inet filter icmp_types_out6 '{ fc00::/7  . ff00::/8  . nd-neighbor-solicit : accept }'
nft add element inet filter icmp_types_out6 '{ fe80::/10 . fc00::/7  . nd-neighbor-solicit : accept }'
nft add element inet filter icmp_types_out6 '{ fe80::/10 . fe80::/10 . nd-neighbor-solicit : accept }'
nft add element inet filter icmp_types_out6 '{ fe80::/10 . ff00::/8  . nd-router-solicit   : accept }'
{{< / highlight >}}

##### GUA prefixes
The same rules apply, but it's less than ideal to use an over-reaching prefix like `2000::/3` because `2000::/3` should be metered. 
That is, anything except local GUA prefixes should be metered.

#### IPv4 egress TCP ports 
Ports `21`, `23`, `25`, `53`, and `80` can be omitted if the point is to ensure that no egress traffic will ever be destined for unencrypted protocols. With this particular ruleset they are limited to the following destinations: 
- `169.254.0.0/16`
- `10.0.0.0/8` 
- `172.16.0.0/12`
- `192.168.0.0/16`

This is covered later in the [hardening](#hardening) section.

{{< highlight bash >}}
nft add map inet filter tcp_ports_out4 '{ typeof ip saddr . ip daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 22   : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 22   : accept }' 
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 22   : accept }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 443  : accept }' 
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 853  : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 853  : accept }' 
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 853  : accept }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 4460 : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 4460 : accept }' 
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 4460 : accept }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 5349 : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 5349 : accept }' 
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 5349 : accept }'
{{< / highlight >}}

#### IPv6 egress TCP ports
Ports `21`, `23`, `25`, `53`, and `80` can be omitted if the point is to ensure that no egress traffic will ever be destined for unencrypted protocols. With this particular ruleset they are limited to the following destinations: 
- `fc00::/7` (ULA)

This is covered later in the [hardening](#hardening) section.

{{< highlight bash >}}
nft add map inet filter tcp_ports_out6 '{ typeof ip6 saddr . ip6 daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 443  : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 853  : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 4460 : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 5349 : accept }'
nft add element inet filter tcp_ports_out6 '{ 2000::/3 . 2000::/3 . 443  : accept }'
nft add element inet filter tcp_ports_out6 '{ 2000::/3 . 2000::/3 . 853  : accept }'
nft add element inet filter tcp_ports_out6 '{ 2000::/3 . 2000::/3 . 4460 : accept }'
nft add element inet filter tcp_ports_out6 '{ 2000::/3 . 2000::/3 . 5349 : accept }'
{{< / highlight >}}

#### IPv4 egress UDP ports 
Ports `53`, `67`, `137` can be omitted if the point is to ensure that no egress traffic will ever be destined for unencrypted protocols. With this particular ruleset they are limited to the following destinations: 
- `169.254.0.0/16`
- `10.0.0.0/8` 
- `172.16.0.0/12`
- `192.168.0.0/16`

Port `5353` is used for `mDNS`. It can be safely omitted, but it is useful for enumeration of hostnames on local networks (zeroconf). Currently mDNS doesn't use any encryption as of 1-26-2023, and I would say it should be omitted in environments that use `NDP-RA`. For more information on mDNS, refer to: [https://datatracker.ietf.org/doc/html/draft-rafiee-dnssd-mdns-threatmodel-01](https://datatracker.ietf.org/doc/html/draft-rafiee-dnssd-mdns-threatmodel-01)

This is covered later in the [hardening](#hardening) section.

{{< highlight bash >}}
nft add map inet filter udp_ports_out4 '{ typeof ip saddr . ip daddr . udp dport : verdict; flags interval; }'
nft add element inet filter udp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 67   : accept }'
nft add element inet filter udp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 67   : accept }'
nft add element inet filter udp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 67   : accept }'
nft add element inet filter udp_ports_out4 '{ 169.254.0.0/16 . 169.254.0.0/16 . 67   : accept }'
nft add element inet filter udp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 53   : accept }'
nft add element inet filter udp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 53   : accept }'
nft add element inet filter udp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 53   : accept }'
nft add element inet filter udp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 137  : accept }'
nft add element inet filter udp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 137  : accept }'
nft add element inet filter udp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 137  : accept }'
nft add element inet filter udp_ports_out4 '{ 10.0.0.0/8     . 224.0.0.0/4    . 5353 : accept }'
nft add element inet filter udp_ports_out4 '{ 172.16.0.0/12  . 224.0.0.0/4    . 5353 : accept }'
nft add element inet filter udp_ports_out4 '{ 192.168.0.0/16 . 224.0.0.0/4    . 5353 : accept }'
nft add element inet filter udp_ports_out4 '{ 169.254.0.0/16 . 224.0.0.0/4    . 5353 : accept }'
nft add element inet filter udp_ports_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter udp_ports_out4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter udp_ports_out4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter udp_ports_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 1194 : accept }'
nft add element inet filter udp_ports_out4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 1194 : accept }'
nft add element inet filter udp_ports_out4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 1194 : accept }'
{{< / highlight >}}

#### IPv6 egress UDP ports
{{< highlight bash >}}
nft add map inet filter udp_ports_out6 '{ typeof ip6 saddr . ip6 daddr . udp dport : verdict; flags interval; }'
nft add element inet filter udp_ports_out6 '{ fe80::/10 . ff00::/8 . 547  : accept }'
nft add element inet filter udp_ports_out6 '{ 2000::/3  . ::/0     . 443  : accept }'
nft add element inet filter udp_ports_out6 '{ fc00::/7  . ff00::/8 . 5353 : accept }'
{{< / highlight >}}

#### IPv4 forward ICMP types
{{< highlight bash >}}
nft add map inet filter icmp_types_forward4 '{ typeof ip saddr . ip daddr . icmp type : verdict; flags interval; }'
nft add element inet filter icmp_types_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . echo-request            : accept }'
nft add element inet filter icmp_types_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . echo-request            : accept }'
nft add element inet filter icmp_types_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . echo-request            : accept }'
nft add element inet filter icmp_types_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . echo-reply              : accept }'
nft add element inet filter icmp_types_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . echo-reply              : accept }'
nft add element inet filter icmp_types_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . echo-reply              : accept }'
nft add element inet filter icmp_types_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . destination-unreachable : accept }'
nft add element inet filter icmp_types_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . destination-unreachable : accept }'
nft add element inet filter icmp_types_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . destination-unreachable : accept }'
nft add element inet filter icmp_types_forward4 '{ 0.0.0.0/0      . 0.0.0.0/0      . echo-reply              : jump icmp_echo_reply_rate_limit }'
{{< / highlight >}}

#### IPv6 forward ICMP types 
{{< highlight bash >}}
nft add map inet filter icmp_types_forward6 '{ typeof ip6 saddr . ip6 daddr . icmpv6 type : verdict; flags interval; }'
nft add element inet filter icmp_types_forward6 '{ fe80::/10 . ff00::/8  . echo-request        : accept }'
nft add element inet filter icmp_types_forward6 '{ fc00::/7  . fc00::/7  . echo-reply          : accept }'
nft add element inet filter icmp_types_forward6 '{ 2000::/3  . ::/0      . echo-reply          : jump icmp_echo_reply_rate_limit }'
{{< / highlight >}}

#### IPv4 forward TCP ports 
{{< highlight bash >}}
nft add map inet filter tcp_ports_forward4 '{ typeof ip saddr . ip daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 21   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 21   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 21   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 23   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 23   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 23   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 25   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 25   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 25   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 53   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 53   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 53   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 80   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 80   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 80   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 22   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 22   : accept }' 
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 22   : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 443  : accept }' 
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 853  : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 853  : accept }' 
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 853  : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 4460 : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 4460 : accept }' 
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 4460 : accept }'
nft add element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 5349 : accept }'
nft add element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 5349 : accept }' 
nft add element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 5349 : accept }'
{{< / highlight >}}

#### IPv6 forward TCP ports
{{< highlight bash >}}
nft add map inet filter tcp_ports_forward6 '{ typeof ip6 saddr . ip6 daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 21   : accept }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 23   : accept }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 25   : accept }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 53   : accept }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 80   : accept }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 443  : accept }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 853  : accept }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 4460 : accept }'
nft add element inet filter tcp_ports_forward6 '{ fc00::/7 . fc00::/7 . 5349 : accept }'
nft add element inet filter tcp_ports_forward6 '{ 2000::/3 . 2000::/3 . 443  : accept }'
nft add element inet filter tcp_ports_forward6 '{ 2000::/3 . 2000::/3 . 853  : accept }'
nft add element inet filter tcp_ports_forward6 '{ 2000::/3 . 2000::/3 . 4460 : accept }'
nft add element inet filter tcp_ports_forward6 '{ 2000::/3 . 2000::/3 . 5349 : accept }'
{{< / highlight >}}

#### IPv4 forward UDP ports 
{{< highlight bash >}}
nft add map inet filter udp_ports_forward4 '{ typeof ip saddr . ip daddr . udp dport : verdict; flags interval; }'
nft add element inet filter udp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 53   : accept }'
nft add element inet filter udp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 53   : accept }'
nft add element inet filter udp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 53   : accept }'
nft add element inet filter udp_ports_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter udp_ports_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . 443  : accept }'
nft add element inet filter udp_ports_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . 443  : accept }'
{{< / highlight >}}

#### IPv6 forward UDP ports
{{< highlight bash >}}
nft add map inet filter udp_ports_forward6 '{ typeof ip6 saddr . ip6 daddr . udp dport : verdict; flags interval; }'
nft add element inet filter udp_ports_forward6 '{ 2000::/3  . ::/0     . 443  : accept }'
{{< / highlight >}}

#### NAT Forwarding ports for IPv4
{{< highlight bash >}}
nft add map inet filter tcp_ports_nat_forward4 '{ type inet_service : ipv4_addr; }'
nft add map inet filter udp_ports_nat_forward4 '{ type inet_service : ipv4_addr; }'
{{< / highlight >}}

#### Masquerading
{{< highlight bash >}}
nft add map inet filter masquerade_networks4 '{ typeof oif . ip saddr : verdict; flags interval; }'
{{< / highlight >}}

### Rules

#### Metered ICMP port unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_port_unreachable_metered add @icmp_egress_meter4 '{ ip daddr timeout 4s limit rate 3/second }' counter reject with icmpx type port-unreachable
nft add rule inet filter reject_with_icmp_port_unreachable_metered add @icmp_egress_meter6 '{ ip6 daddr timeout 4s limit rate 3/second }' counter reject with icmpx type port-unreachable
{{< / highlight >}}
#### Un-metered ICMP port unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_port_unreachable counter reject with icmpx type port-unreachable
{{< / highlight >}}

#### Metered ICMP host unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_host_unreachable_metered add @icmp_egress_meter4 '{ ip daddr timeout 4s limit rate 3/second }' counter reject with icmpx type host-unreachable
nft add rule inet filter reject_with_icmp_host_unreachable_metered add @icmp_egress_meter6 '{ ip6 daddr timeout 4s limit rate 3/second }' counter reject with icmpx type host-unreachable
{{< / highlight >}}
#### Un-Metered ICMP host unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_host_unreachable counter reject with icmpx type host-unreachable
{{< / highlight >}}
#### Metered ICMP no route
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_no_route_metered add @icmp_egress_meter4 '{ ip daddr timeout 4s limit rate 3/second }' counter reject with icmpx type no-route
nft add rule inet filter reject_with_icmp_no_route_metered add @icmp_egress_meter6 '{ ip6 daddr timeout 4s limit rate 3/second }' counter reject with icmpx type no-route
{{< / highlight >}}
#### Un-Metered ICMP no route
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_no_route counter reject with icmpx type no-route
{{< / highlight >}}
#### Metered ICMP admin prohibited
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_admin_prohibited add @icmp_egress_meter4 '{ ip daddr timeout 4s limit rate 3/second }' counter reject with icmpx type admin-prohibited
nft add rule inet filter reject_with_icmp_admin_prohibited_metered add @icmp_egress_meter6 '{ ip6 daddr timeout 4s limit rate 3/second }' counter reject with icmpx type admin-prohibited
{{< / highlight >}}
#### Un-Metered ICMP admin-prohibited
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_admin_prohibited counter reject with icmpx type admin-prohibited
{{< / highlight >}}
#### icmp_in
{{< highlight bash >}}
nft add rule inet filter icmp_in ip saddr . ip daddr . icmp type vmap @icmp_types_in4
nft add rule inet filter icmp_in ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_in6
{{< / highlight >}}

#### tcp_in
{{< highlight bash >}}
nft add rule inet filter tcp_in ct state established accept
nft add rule inet filter tcp_in ip saddr . ip daddr . tcp dport vmap @tcp_ports_in4
nft add rule inet filter tcp_in ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_in6
{{< / highlight >}}

#### udp_in
{{< highlight bash >}}
nft add rule inet filter udp_in ct state established accept
nft add rule inet filter udp_in ip saddr . ip daddr . udp dport vmap @udp_ports_in4
nft add rule inet filter udp_in ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_in6
{{< / highlight >}}

#### ether_in
{{< highlight bash >}}
nft add rule inet filter ether_in ip protocol vmap '{ tcp : jump tcp_in, udp : jump udp_in , icmp : jump icmp_in }'
nft add rule inet filter ether_in ip6 nexthdr vmap '{ tcp : jump tcp_in, udp : jump udp_in , icmpv6 : jump icmp_in, ipv6-icmp: jump icmp_in }'
{{< / highlight >}}

#### input
{{< highlight bash >}}
nft add rule inet filter input meta iiftype vmap '{ loopback: accept }'
nft add rule inet filter input ip saddr vmap @drop_bogons4
nft add rule inet filter input ip6 saddr vmap @drop_bogons6
nft add rule inet filter input meta iiftype vmap '{ ether: jump ether_in }'
{{< / highlight >}}

#### icmp_forward
{{< highlight bash >}}
nft add rule inet filter icmp_forward ip saddr . ip daddr . icmp type vmap @icmp_types_forward4
nft add rule inet filter icmp_forward ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_forward6
{{< / highlight >}}

#### tcp_forward
{{< highlight bash >}}
nft add rule inet filter tcp_forward ct state established accept
nft add rule inet filter tcp_forward ip saddr . ip daddr . tcp dport vmap @tcp_ports_forward4
nft add rule inet filter tcp_forward ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_forward6
{{< / highlight >}}

#### udp_forward
{{< highlight bash >}}
nft add rule inet filter udp_forward ct state established accept
nft add rule inet filter udp_forward ip saddr . ip daddr . udp dport vmap @udp_ports_forward4
nft add rule inet filter udp_forward ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_forward6
{{< / highlight >}}

#### ether_forward
{{< highlight bash >}}
nft add rule inet filter ether_forward ip saddr . ip daddr . ct state vmap @default_forward4
nft add rule inet filter ether_forward ip6 saddr . ip6 daddr . ct state vmap @default_forward6
nft add rule inet filter ether_forward ip protocol vmap '{ tcp : jump tcp_forward, udp : jump udp_forward , icmp : jump icmp_forward }' 
{{< / highlight >}}

#### forward
{{< highlight bash >}}
nft add rule inet filter forward ip saddr vmap @drop_bogons4
nft add rule inet filter forward ip6 saddr vmap @drop_bogons6
nft add rule inet filter forward meta oiftype vmap '{ ether: jump ether_forward }'
{{< / highlight >}}

#### ICMP echo-reply rate limit
{{< highlight bash >}}
nft add rule inet filter icmp_echo_reply_rate_limit add @icmp_egress_meter4 '{ ip saddr timeout 4s limit rate 3/second }' accept
nft add rule inet filter icmp_echo_reply_rate_limit add @icmp_egress_meter6 '{ ip6 saddr timeout 4s limit rate 3/second }' accept
{{< / highlight >}}

#### icmp_out
{{< highlight bash >}}
nft add rule inet filter icmp_out ip saddr . ip daddr . icmp type vmap @icmp_types_out4
nft add rule inet filter icmp_out ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_out6
{{< / highlight >}}

#### tcp_out
{{< highlight bash >}}
nft add rule inet filter tcp_out ct state established accept
nft add rule inet filter tcp_out ip saddr . ip daddr . tcp dport vmap @tcp_ports_out4
nft add rule inet filter tcp_out ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_out6
{{< / highlight >}}

#### udp_out
{{< highlight bash >}}
nft add rule inet filter udp_out ct state established accept
nft add rule inet filter udp_out ip saddr . ip daddr . udp dport vmap @udp_ports_out4
nft add rule inet filter udp_out ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_out6
{{< / highlight >}}

#### ether_out
{{< highlight bash >}}
nft add rule inet filter ether_out ip protocol vmap '{ tcp : jump tcp_out, udp : jump udp_out, icmp : jump icmp_out }'
nft add rule inet filter ether_out ip6 nexthdr vmap '{ tcp : jump tcp_out, udp : jump udp_out, icmpv6 : jump icmp_out, ipv6-icmp: jump icmp_out }'
{{< / highlight >}}

#### masq
{{< highlight bash >}}
nft add rule inet filter masq ip daddr vmap @drop_bogons4
nft add rule inet filter masq ip daddr @local_networks return
nft add rule inet filter masq masquerade
{{< / highlight >}}

#### output
{{< highlight bash >}}
nft add rule inet filter output meta oiftype vmap '{ loopback: accept }'
nft add rule inet filter output ip daddr vmap @drop_bogons4
nft add rule inet filter output ip6 daddr vmap @drop_bogons6
nft add rule inet filter output meta oiftype vmap '{ ether: jump ether_out }'
{{< / highlight >}}

#### prerouting
{{< highlight bash >}}
nft add rule inet filter prerouting ip protocol tcp dnat to tcp dport map @tcp_ports_nat_forward4
nft add rule inet filter prerouting ip protocol udp dnat to udp dport map @udp_ports_nat_forward4
{{< / highlight >}}

#### postrouting
{{< highlight bash >}}
nft add rule inet filter postrouting oif . ip saddr vmap @masquerade_networks4
{{< / highlight >}}

### Default chain policies 
{{< highlight bash >}}
nft add chain inet filter input '{ policy drop; }'
nft add chain inet filter forward '{ policy drop; }'
nft add chain inet filter output '{ policy drop; }'
{{< / highlight >}}

### Logging
{{< highlight bash >}}
nft add rule inet filter input log prefix "input" group 1
nft add rule inet filter input counter

nft add rule inet filter forward log prefix "forward" group 1
nft add rule inet filter forward counter

nft add rule inet filter output log prefix "output" group 1
nft add rule inet filter output counter
{{< / highlight >}}

#### Viewing logged packets
Dropped packets are logged in pcap format: `tcpdump -vvv -n -e -ttt -i nflog:1 -XX`
```
 00:00:00.000207 version 0, resource ID 1, family IPv4 (2), length 128: (tos 0x10, ttl 64, id 39694, offset 0, flags [DF], proto UDP (17), length 76)
    10.211.55.11.50429 > 108.59.2.24.123: [bad udp cksum 0xb07a -> 0x5c51!] NTPv4, Client, length 48
	Leap indicator:  (0), Stratum 0 (unspecified), poll 0 (1s), precision 0
	Root Delay: 0.000000, Root dispersion: 0.000000, Reference-ID: (unspec)
	  Reference Timestamp:  0.000000000
	  Originator Timestamp: 0.000000000
	  Receive Timestamp:    0.000000000
	  Transmit Timestamp:   3883429715.031809542 (2023-01-23T02:28:35Z)
	    Originator - Receive Timestamp:  0.000000000
	    Originator - Transmit Timestamp: 3883429715.031809542 (2023-01-23T02:28:35Z)
	0x0000:  0200 0001 0800 0100 0800 0300 0b00 0a00  ................
	0x0010:  6f75 7470 7574 0000 0800 0500 0000 0002  output..........
	0x0020:  0800 0b00 0000 0069 0800 0e00 0000 006f  .......i.......o
	0x0030:  5000 0900 4510 004c 9b0e 4000 4011 ef51  P...E..L..@.@..Q
	0x0040:  0ad3 370b 6c3b 0218 c4fd 007b 0038 b07a  ..7.l;.....{.8.z
	0x0050:  2300 0000 0000 0000 0000 0000 0000 0000  #...............
	0x0060:  0000 0000 0000 0000 0000 0000 0000 0000  ................
	0x0070:  0000 0000 0000 0000 e778 6f53 0824 ab92  .........xoS.$..
```

#### Per-chain logging
##### Metered ICMP port unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_port_unreachable_metered log prefix "reject_with_icmp_port_unreachable_metered" group 1
nft add rule inet filter reject_with_icmp_port_unreachable_metered counter drop
{{< / highlight >}}

##### Metered ICMP host unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_host_unreachable_metered log prefix "reject_with_icmp_host_unreachable_metered" group 1
nft add rule inet filter reject_with_icmp_host_unreachable_metered counter drop
{{< / highlight >}}

##### Metered ICMP no route
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_no_route_metered log prefix "reject_with_icmp_no_route_metered" group 1
nft add rule inet filter reject_with_icmp_no_route_metered counter drop
{{< / highlight >}}

##### Metered ICMP admin prohibited
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_admin_prohibited_metered log prefix "reject_with_icmp_admin_prohibited_metered" group 1
nft add rule inet filter reject_with_icmp_admin_prohibited_metered counter drop
{{< / highlight >}}

##### Ingress ICMP
{{< highlight bash >}}
nft add rule inet filter icmp_in log prefix "icmp_in" group 1
nft add rule inet filter icmp_in counter drop
{{< / highlight >}}

##### Ingress TCP
{{< highlight bash >}}
nft add rule inet filter tcp_in log prefix "tcp_in" group 1
nft add rule inet filter tcp_in counter drop
{{< / highlight >}}

##### Ingress UDP
{{< highlight bash >}}
nft add rule inet filter udp_in log prefix "udp_in" group 1
nft add rule inet filter udp_in counter drop
{{< / highlight >}}

##### Ingress Ether
{{< highlight bash >}}
nft add rule inet filter ether_in log prefix "ether_in" group 1
nft add rule inet filter ether_in counter drop
{{< / highlight >}}

##### Forward ICMP
{{< highlight bash >}}
nft add rule inet filter icmp_forward log prefix "icmp_forward" group 1
nft add rule inet filter icmp_forward counter drop
{{< / highlight >}}

##### Forward TCP
{{< highlight bash >}}
nft add rule inet filter tcp_forward log prefix "tcp_forward" group 1
nft add rule inet filter tcp_forward counter drop
{{< / highlight >}}

##### Forward UDP
{{< highlight bash >}}
nft add rule inet filter udp_forward log prefix "udp_forward" group 1
nft add rule inet filter udp_forward counter drop
{{< / highlight >}}

##### Forward Ether
{{< highlight bash >}}
nft add rule inet filter ether_forward log prefix "ether_forward" group 1
nft add rule inet filter ether_forward counter drop
{{< / highlight >}}

##### Egress ICMP echo replies
{{< highlight bash >}}
nft add rule inet filter icmp_echo_reply_rate_limit log prefix "icmp_echo_reply_rate_limit" group 1
nft add rule inet filter icmp_echo_reply_rate_limit counter drop
{{< / highlight >}}

##### Egress ICMP
{{< highlight bash >}}
nft add rule inet filter icmp_out log prefix "icmp_out" group 1
nft add rule inet filter icmp_out counter drop
{{< / highlight >}}

##### Egress TCP
{{< highlight bash >}}
nft add rule inet filter tcp_out log prefix "tcp_out" group 1
nft add rule inet filter tcp_out counter drop
{{< / highlight >}}

##### Egress UDP
{{< highlight bash >}}
nft add rule inet filter udp_out log prefix "udp_out" group 1
nft add rule inet filter udp_out counter drop
{{< / highlight >}}

##### Egress Ether
{{< highlight bash >}}
nft add rule inet filter ether_out log prefix "ether_out" group 1
nft add rule inet filter ether_out counter drop
{{< / highlight >}}

## Filter state persistence
### Configuration format
If you are starting from here you can copy / paste this section to `/etc/nftables.conf`. Otherwise the current filter state can be made to persist with:
- `nft -a -s list ruleset | tee /etc/nftables.conf`

{{< highlight bash >}}
table inet filter { # handle 60
	set icmp_egress_meter4 { # handle 34
		type ipv4_addr
		size 8
		flags dynamic,timeout
	}

	set icmp_egress_meter6 { # handle 35
		type ipv6_addr
		size 8
		flags dynamic,timeout
	}

	map drop_bogons4 { # handle 36
		type ipv4_addr : verdict
		flags interval
		elements = { 0.0.0.0/8 : jump bogon, 10.0.0.0/8 : continue,
			     100.64.0.0/10 : jump bogon, 127.0.0.0/8 : jump bogon,
			     169.254.0.0/16 : continue, 172.16.0.0/12 : continue,
			     192.0.0.0/24 : jump bogon, 192.0.2.0/24 : jump bogon,
			     192.168.0.0/16 : continue, 198.18.0.0/15 : jump bogon,
			     198.51.100.0/24 : jump bogon, 203.0.113.0/24 : jump bogon,
			     224.0.0.0/4 : continue, 240.0.0.0/4 : jump bogon }
	}

	set local_networks { # handle 37
		type ipv4_addr
		flags interval
		elements = { 10.0.0.0/8, 169.254.0.0/16,
			     172.16.0.0/12, 192.168.0.0/16 }
	}

	map drop_bogons6 { # handle 38
		type ipv6_addr : verdict
		flags interval
		elements = { ::/96 : jump bogon,
			     ::ffff:0.0.0.0/96 : jump bogon,
			     100::/64 : jump bogon,
			     2001::/40 : jump bogon,
			     2001:0:a00::/40 : jump bogon,
			     2001:0:7f00::/40 : jump bogon,
			     2001:0:a9fe::/48 : jump bogon,
			     2001:0:ac10::/44 : jump bogon,
			     2001:0:c000::/56 : jump bogon,
			     2001:0:c000:200::/56 : jump bogon,
			     2001:0:c0a8::/48 : jump bogon,
			     2001:0:c612::/47 : jump bogon,
			     2001:0:c633:6400::/56 : jump bogon,
			     2001:0:cb00:7100::/56 : jump bogon,
			     2001:0:e000::/36 : jump bogon,
			     2001:0:f000::/36 : jump bogon,
			     2001:10::/28 : jump bogon,
			     2001:db8::/32 : jump bogon,
			     2002::/24 : jump bogon,
			     2002:a00::/24 : jump bogon,
			     2002:7f00::/24 : jump bogon,
			     2002:a9fe::/32 : jump bogon,
			     2002:ac10::/28 : jump bogon,
			     2002:c000::/40 : jump bogon,
			     2002:c000:200::/40 : jump bogon,
			     2002:c0a8::/32 : jump bogon,
			     2002:c612::/31 : jump bogon,
			     2002:c633:6400::/40 : jump bogon,
			     2002:cb00:7100::/40 : jump bogon,
			     2002:e000::/20 : jump bogon,
			     2002:f000::/20 : jump bogon,
			     fc00::/7 : continue,
			     fe80::/10 : continue,
			     fec0::/10 : jump bogon,
			     ff00::/8 : continue }
	}

	map reject_or_drop_port4 { # handle 39
		typeof ip saddr . ip daddr : verdict
		flags interval
		elements = { 10.0.0.0/8 . 10.0.0.0/8 : jump reject_with_icmp_port_unreachable,
			     172.16.0.0/12 . 172.16.0.0/12 : jump reject_with_icmp_port_unreachable,
			     192.168.0.0/16 . 192.168.0.0/16 : jump reject_with_icmp_port_unreachable,
			     169.254.0.0/16 . 169.254.0.0/16 : jump reject_with_icmp_port_unreachable,
			     0.0.0.0/0 . 0.0.0.0/0 : jump reject_with_icmp_port_unreachable_metered }
	}

	map reject_or_drop_port6 { # handle 40
		typeof ip6 saddr . ip6 daddr : verdict
		flags interval
		elements = { fe80::/10 . fe80::/10 : jump reject_with_icmp_port_unreachable,
			     fc00::/7 . fc00::/7 : jump reject_with_icmp_port_unreachable,
			     ::/0 . ::/0 : jump reject_with_icmp_port_unreachable_metered }
	}

	map icmp_types_in4 { # handle 41
		typeof ip saddr . ip daddr . icmp type : verdict
		flags interval
		elements = { 0.0.0.0/0 . 0.0.0.0/0 . echo-request : accept,
			     0.0.0.0/0 . 0.0.0.0/0 . echo-reply : accept,
			     0.0.0.0/0 . 0.0.0.0/0 . destination-unreachable : accept }
	}

	map icmp_types_in6 { # handle 42
		typeof ip6 saddr . ip6 daddr . icmpv6 type : verdict
		flags interval
		elements = { fe80::/10 . fe80::/10 . echo-request : accept,
			     fe80::/10 . ff00::/8 . echo-request : accept,
			     fc00::/7 . fc00::/7 . echo-request : accept,
			     fe80::/10 . fe80::/10 . echo-reply : accept,
			     fe80::/10 . ff00::/8 . echo-reply : accept,
			     fc00::/7 . fc00::/7 . echo-reply : accept,
			     fe80::/10 . fe80::/10 . nd-neighbor-solicit : accept,
			     fc00::/7 . ff00::/8 . nd-neighbor-solicit : accept,
			     fc00::/7 . fc00::/7 . nd-neighbor-solicit : accept,
			     fc00::/7 . fc00::/7 . nd-neighbor-advert : accept,
			     fe80::/10 . fe80::/10 . nd-neighbor-advert : accept,
			     fe80::/10 . ff00::/8 . nd-router-advert : accept,
			     fe80::/10 . fe80::/10 . nd-router-advert : accept }
	}

	map tcp_ports_in4 { # handle 43
		typeof ip saddr . ip daddr . tcp dport : verdict
		flags interval
		elements = { 0.0.0.0/0 . 0.0.0.0/0 . 22 : accept }
	}

	map tcp_ports_in6 { # handle 44
		typeof ip6 saddr . ip6 daddr . tcp dport : verdict
		flags interval
		elements = { ::/0 . ::/0 . 22 : accept }
	}

	map udp_ports_in4 { # handle 45
		typeof ip saddr . ip daddr . udp dport : verdict
		flags interval
		elements = { 169.254.0.0/16 . 169.254.0.0/16 . 68 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 68 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 68 : accept,
			     192.160.0.0/12 . 192.168.0.0/16 . 68 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 137 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 137 : accept,
			     192.160.0.0/12 . 192.168.0.0/16 . 137 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 5353 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 5353 : accept,
			     192.160.0.0/12 . 192.168.0.0/16 . 5353 : accept,
			     10.0.0.0/8 . 224.0.0.0/4 . 5353 : accept,
			     172.16.0.0/12 . 224.0.0.0/4 . 5353 : accept,
			     192.160.0.0/12 . 224.0.0.0/4 . 5353 : accept }
	}

	map udp_ports_in6 { # handle 46
		typeof ip6 saddr . ip6 daddr . udp dport : verdict
		flags interval
		elements = { fe80::/10 . ff00::/8 . 546 : accept,
			     fe80::/10 . ff00::/8 . 5353 : accept,
			     fc00::/7 . ff00::/8 . 5353 : accept }
	}

	map default_forward4 { # handle 47
		typeof ip saddr . ip daddr . ct state : verdict
		flags interval
		elements = { 169.254.0.0/16 . 0.0.0.0/0 . new : jump wont_forward,
			     0.0.0.0/0 . 169.254.0.0/16 . new : jump wont_forward,
			     10.0.0.0/8 . 172.16.0.0/12 . new : jump reject_with_icmp_no_route,
			     10.0.0.0/8 . 192.168.0.0/16 . new : jump reject_with_icmp_no_route,
			     172.16.0.0/12 . 10.0.0.0/8 . new : jump reject_with_icmp_no_route,
			     172.16.0.0/12 . 192.168.0.0/16 . new : jump reject_with_icmp_no_route,
			     192.168.0.0/16 . 10.0.0.0/8 . new : jump reject_with_icmp_no_route,
			     192.168.0.0/16 . 172.16.0.0/12 . new : jump reject_with_icmp_no_route,
			     10.0.0.0/8 . 10.0.0.0/8 . new : continue,
			     10.0.0.0/8 . 10.0.0.0/8 . established : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . new : continue,
			     172.16.0.0/12 . 172.16.0.0/12 . established : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . new : continue,
			     192.168.0.0/16 . 192.168.0.0/16 . established : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . new : continue,
			     172.16.0.0/12 . 0.0.0.0/0 . new : continue,
			     192.168.0.0/16 . 0.0.0.0/0 . new : continue,
			     0.0.0.0/0 . 10.0.0.0/8 . established : accept,
			     0.0.0.0/0 . 172.16.0.0/12 . established : accept,
			     0.0.0.0/0 . 192.168.0.0/16 . established : accept }
	}

	map default_forward6 { # handle 48
		typeof ip6 saddr . ip6 daddr . ct state : verdict
		flags interval
		elements = { fe80::/10 . ::/0 . new : jump wont_forward,
			     ::/0 . fe80::/10 . new : jump wont_forward,
			     fc00::/7 . fc00::/7 . new : continue,
			     fc00::/7 . fc00::/7 . established : accept }
	}

	map icmp_types_out4 { # handle 49
		typeof ip saddr . ip daddr . icmp type : verdict
		flags interval
		elements = { 10.0.0.0/8 . 0.0.0.0/0 . echo-request : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . echo-request : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . echo-request : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . echo-reply : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . echo-reply : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . echo-reply : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . destination-unreachable : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . destination-unreachable : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . destination-unreachable : accept,
			     0.0.0.0/0 . 0.0.0.0/0 . echo-reply : jump icmp_echo_reply_rate_limit }
	}

	map icmp_types_out6 { # handle 50
		typeof ip6 saddr . ip6 daddr . icmpv6 type : verdict
		flags interval
		elements = { fe80::/10 . ff00::/8 . echo-request : accept,
			     fc00::/7 . fc00::/7 . echo-reply : accept,
			     2000::/3 . ::/0 . echo-reply : jump icmp_echo_reply_rate_limit,
			     fc00::/7 . fc00::/7 . nd-neighbor-advert : accept,
			     fe80::/10 . fe80::/10 . nd-neighbor-advert : accept,
			     fc00::/7 . ff00::/8 . nd-neighbor-solicit : accept,
			     fe80::/10 . fc00::/7 . nd-neighbor-solicit : accept,
			     fe80::/10 . fe80::/10 . nd-neighbor-solicit : accept,
			     fe80::/10 . ff00::/8 . nd-router-solicit : accept }
	}

	map tcp_ports_out4 { # handle 51
		typeof ip saddr . ip daddr . tcp dport : verdict
		flags interval
		elements = { 10.0.0.0/8 . 0.0.0.0/0 . 22 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 22 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 22 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 443 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 443 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 443 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 853 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 853 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 853 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 4460 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 4460 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 4460 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 5349 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 5349 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 5349 : accept }
	}

	map tcp_ports_out6 { # handle 52
		typeof ip6 saddr . ip6 daddr . tcp dport : verdict
		flags interval
		elements = { fc00::/7 . fc00::/7 . 443 : accept,
			     fc00::/7 . fc00::/7 . 853 : accept,
			     fc00::/7 . fc00::/7 . 4460 : accept,
			     fc00::/7 . fc00::/7 . 5349 : accept,
			     2000::/3 . 2000::/3 . 443 : accept,
			     2000::/3 . 2000::/3 . 853 : accept,
			     2000::/3 . 2000::/3 . 4460 : accept,
			     2000::/3 . 2000::/3 . 5349 : accept }
	}

	map udp_ports_out4 { # handle 53
		typeof ip saddr . ip daddr . udp dport : verdict
		flags interval
		elements = { 10.0.0.0/8 . 10.0.0.0/8 . 67 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 67 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 67 : accept,
			     169.254.0.0/16 . 169.254.0.0/16 . 67 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 53 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 53 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 53 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 137 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 137 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 137 : accept,
			     10.0.0.0/8 . 224.0.0.0/4 . 5353 : accept,
			     172.16.0.0/12 . 224.0.0.0/4 . 5353 : accept,
			     192.168.0.0/16 . 224.0.0.0/4 . 5353 : accept,
			     169.254.0.0/16 . 224.0.0.0/4 . 5353 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 443 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 443 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 443 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 1194 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 1194 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 1194 : accept }
	}

	map udp_ports_out6 { # handle 54
		typeof ip6 saddr . ip6 daddr . udp dport : verdict
		flags interval
		elements = { fe80::/10 . ff00::/8 . 547 : accept,
			     2000::/3 . ::/0 . 443 : accept,
			     fc00::/7 . ff00::/8 . 5353 : accept }
	}

	map icmp_types_forward4 { # handle 55
		typeof ip saddr . ip daddr . icmp type : verdict
		flags interval
		elements = { 10.0.0.0/8 . 0.0.0.0/0 . echo-request : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . echo-request : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . echo-request : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . echo-reply : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . echo-reply : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . echo-reply : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . destination-unreachable : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . destination-unreachable : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . destination-unreachable : accept,
			     0.0.0.0/0 . 0.0.0.0/0 . echo-reply : jump icmp_echo_reply_rate_limit }
	}

	map icmp_types_forward6 { # handle 56
		typeof ip6 saddr . ip6 daddr . icmpv6 type : verdict
		flags interval
		elements = { fe80::/10 . ff00::/8 . echo-request : accept,
			     fc00::/7 . fc00::/7 . echo-reply : accept,
			     2000::/3 . ::/0 . echo-reply : jump icmp_echo_reply_rate_limit }
	}

	map tcp_ports_forward4 { # handle 57
		typeof ip saddr . ip daddr . tcp dport : verdict
		flags interval
		elements = { 10.0.0.0/8 . 10.0.0.0/8 . 21 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 21 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 21 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 23 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 23 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 23 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 25 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 25 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 25 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 53 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 53 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 53 : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . 80 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 80 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 80 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 22 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 22 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 22 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 443 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 443 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 443 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 853 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 853 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 853 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 4460 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 4460 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 4460 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 5349 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 5349 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 5349 : accept }
	}

	map tcp_ports_forward6 { # handle 58
		typeof ip6 saddr . ip6 daddr . tcp dport : verdict
		flags interval
		elements = { fc00::/7 . fc00::/7 . 21 : accept,
			     fc00::/7 . fc00::/7 . 23 : accept,
			     fc00::/7 . fc00::/7 . 25 : accept,
			     fc00::/7 . fc00::/7 . 53 : accept,
			     fc00::/7 . fc00::/7 . 80 : accept,
			     fc00::/7 . fc00::/7 . 443 : accept,
			     fc00::/7 . fc00::/7 . 853 : accept,
			     fc00::/7 . fc00::/7 . 4460 : accept,
			     fc00::/7 . fc00::/7 . 5349 : accept,
			     2000::/3 . 2000::/3 . 443 : accept,
			     2000::/3 . 2000::/3 . 853 : accept,
			     2000::/3 . 2000::/3 . 4460 : accept,
			     2000::/3 . 2000::/3 . 5349 : accept }
	}

	map udp_ports_forward4 { # handle 59
		typeof ip saddr . ip daddr . udp dport : verdict
		flags interval
		elements = { 10.0.0.0/8 . 10.0.0.0/8 . 53 : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . 53 : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . 53 : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . 443 : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . 443 : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . 443 : accept }
	}

	map udp_ports_forward6 { # handle 60
		typeof ip6 saddr . ip6 daddr . udp dport : verdict
		flags interval
		elements = { 2000::/3 . ::/0 . 443 : accept }
	}

	map tcp_ports_nat_forward4 { # handle 61
		type inet_service : ipv4_addr
	}

	map udp_ports_nat_forward4 { # handle 62
		type inet_service : ipv4_addr
	}

	map masquerade_networks4 { # handle 63
		typeof oif . ip saddr : verdict
		flags interval
	}

	chain input { # handle 1
		type filter hook input priority filter; policy drop;
		meta iiftype vmap { loopback : accept } # handle 89
		ip saddr vmap @drop_bogons4 # handle 90
		ip6 saddr vmap @drop_bogons6 # handle 91
		meta iiftype vmap { ether : jump ether_in } # handle 93
		log prefix "input" group 1 # handle 136
		counter # handle 137
	}

	chain forward { # handle 2
		type filter hook forward priority filter; policy drop;
		ip saddr vmap @drop_bogons4 # handle 106
		ip6 saddr vmap @drop_bogons6 # handle 107
		meta oiftype vmap { ether : jump ether_forward } # handle 109
		log prefix "forward" group 1 # handle 138
		counter # handle 139
	}

	chain output { # handle 3
		type filter hook output priority filter; policy drop;
		meta oiftype vmap { loopback : accept } # handle 128
		ip daddr vmap @drop_bogons4 # handle 129
		ip6 daddr vmap @drop_bogons6 # handle 130
		meta oiftype vmap { ether : jump ether_out } # handle 132
		log prefix "output" group 1 # handle 140
		counter # handle 141
	}

	chain prerouting { # handle 4
		type nat hook prerouting priority 100; policy accept;
		ip protocol tcp dnat ip to tcp dport map @tcp_ports_nat_forward4 # handle 133
		ip protocol udp dnat ip to udp dport map @udp_ports_nat_forward4 # handle 134
	}

	chain postrouting { # handle 5
		type nat hook postrouting priority srcnat; policy accept;
		oif . ip saddr vmap @masquerade_networks4 # handle 135
	}

	chain masq { # handle 6
		ip daddr vmap @drop_bogons4 # handle 124
		ip daddr @local_networks return # handle 125
		masquerade # handle 126
	}

	chain ether_in { # handle 7
		ip protocol vmap { icmp : jump icmp_in, tcp : jump tcp_in, udp : jump udp_in } # handle 85
		ip6 nexthdr vmap { tcp : jump tcp_in, udp : jump udp_in, ipv6-icmp : jump icmp_in } # handle 87
		log prefix "ether_in" group 1 # handle 156
		counter drop # handle 157
	}

	chain ether_out { # handle 8
		ip protocol vmap { icmp : jump icmp_out, tcp : jump tcp_out, udp : jump udp_out } # handle 121
		ip6 nexthdr vmap { tcp : jump tcp_out, udp : jump udp_out, ipv6-icmp : jump icmp_out } # handle 123
		log prefix "ether_out" group 1 # handle 174
		counter drop # handle 175
	}

	chain ether_forward { # handle 9
		ip saddr . ip daddr . ct state vmap @default_forward4 # handle 102
		ip6 saddr . ip6 daddr . ct state vmap @default_forward6 # handle 103
		ip protocol vmap { icmp : jump icmp_forward, tcp : jump tcp_forward, udp : jump udp_forward } # handle 105
		log prefix "ether_forward" group 1 # handle 164
		counter drop # handle 165
	}

	chain icmp_in { # handle 10
		ip saddr . ip daddr . icmp type vmap @icmp_types_in4 # handle 76
		ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_in6 # handle 77
		log prefix "icmp_in" group 1 # handle 150
		counter drop # handle 151
	}

	chain icmp_out { # handle 11
		ip saddr . ip daddr . icmp type vmap @icmp_types_out4 # handle 112
		ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_out6 # handle 113
		log prefix "icmp_out" group 1 # handle 168
		counter drop # handle 169
	}

	chain icmp_forward { # handle 12
		ip saddr . ip daddr . icmp type vmap @icmp_types_forward4 # handle 94
		ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_forward6 # handle 95
		log prefix "icmp_forward" group 1 # handle 158
		counter drop # handle 159
	}

	chain icmp_echo_reply_rate_limit { # handle 13
		add @icmp_egress_meter4 { ip saddr timeout 4s limit rate 3/second } accept # handle 110
		add @icmp_egress_meter6 { ip6 saddr timeout 4s limit rate 3/second } accept # handle 111
		log prefix "icmp_echo_reply_rate_limit" group 1 # handle 166
		counter drop # handle 167
	}

	chain reject_with_icmp_port_unreachable_metered { # handle 14
		add @icmp_egress_meter4 { ip daddr timeout 4s limit rate 3/second } counter reject # handle 64
		add @icmp_egress_meter6 { ip6 daddr timeout 4s limit rate 3/second } counter reject # handle 65
		log prefix "reject_with_icmp_port_unreachable_metered" group 1 # handle 142
		counter drop # handle 143
	}

	chain reject_with_icmp_port_unreachable { # handle 15
		counter reject # handle 66
	}

	chain reject_with_icmp_host_unreachable_metered { # handle 16
		add @icmp_egress_meter4 { ip daddr timeout 4s limit rate 3/second } counter reject with icmpx host-unreachable # handle 67
		add @icmp_egress_meter6 { ip6 daddr timeout 4s limit rate 3/second } counter reject with icmpx host-unreachable # handle 68
		log prefix "reject_with_icmp_host_unreachable_metered" group 1 # handle 144
		counter drop # handle 145
	}

	chain reject_with_icmp_host_unreachable { # handle 17
		counter reject with icmpx host-unreachable # handle 69
	}

	chain reject_with_icmp_no_route_metered { # handle 18
		add @icmp_egress_meter4 { ip daddr timeout 4s limit rate 3/second } counter reject with icmpx no-route # handle 70
		add @icmp_egress_meter6 { ip6 daddr timeout 4s limit rate 3/second } counter reject with icmpx no-route # handle 71
		log prefix "reject_with_icmp_no_route_metered" group 1 # handle 146
		counter drop # handle 147
	}

	chain reject_with_icmp_no_route { # handle 19
		counter reject with icmpx no-route # handle 72
	}

	chain reject_with_icmp_admin_prohibited_metered { # handle 20
		add @icmp_egress_meter6 { ip6 daddr timeout 4s limit rate 3/second } counter reject with icmpx admin-prohibited # handle 74
		log prefix "reject_with_icmp_admin_prohibited_metered" group 1 # handle 148
		counter drop # handle 149
	}

	chain reject_with_icmp_admin_prohibited { # handle 21
		add @icmp_egress_meter4 { ip daddr timeout 4s limit rate 3/second } counter reject with icmpx admin-prohibited # handle 73
		counter reject with icmpx admin-prohibited # handle 75
	}

	chain tcp_in { # handle 22
		ct state established accept # handle 78
		ip saddr . ip daddr . tcp dport vmap @tcp_ports_in4 # handle 79
		ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_in6 # handle 80
		log prefix "tcp_in" group 1 # handle 152
		counter drop # handle 153
	}

	chain tcp_out { # handle 23
		ct state established accept # handle 114
		ip saddr . ip daddr . tcp dport vmap @tcp_ports_out4 # handle 115
		ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_out6 # handle 116
		log prefix "tcp_out" group 1 # handle 170
		counter drop # handle 171
	}

	chain tcp_forward { # handle 24
		ct state established accept # handle 96
		ip saddr . ip daddr . tcp dport vmap @tcp_ports_forward4 # handle 97
		ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_forward6 # handle 98
		log prefix "tcp_forward" group 1 # handle 160
		counter drop # handle 161
	}

	chain udp_in { # handle 25
		ct state established accept # handle 81
		ip saddr . ip daddr . udp dport vmap @udp_ports_in4 # handle 82
		ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_in6 # handle 83
		log prefix "udp_in" group 1 # handle 154
		counter drop # handle 155
	}

	chain udp_out { # handle 26
		ct state established accept # handle 117
		ip saddr . ip daddr . udp dport vmap @udp_ports_out4 # handle 118
		ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_out6 # handle 119
		log prefix "udp_out" group 1 # handle 172
		counter drop # handle 173
	}

	chain udp_forward { # handle 27
		ct state established accept # handle 99
		ip saddr . ip daddr . udp dport vmap @udp_ports_forward4 # handle 100
		ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_forward6 # handle 101
		log prefix "udp_forward" group 1 # handle 162
		counter drop # handle 163
	}

	chain bogon { # handle 28
		log prefix "bogon" group 1 # handle 29
		counter drop # handle 30
	}

	chain wont_forward { # handle 31
		log prefix "wont_forward" group 1 # handle 32
		counter drop # handle 33
	}
}
{{< / highlight >}}

### Flushing the ruleset 
Something that helps me is adding `flush ruleset` to the beginning of the new `/etc/nftables.conf` file so that the existing state is flushed before loading the file. 

## Hardening
```
nft delete element inet filter udp_ports_in4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 137  : accept }'
nft delete element inet filter udp_ports_in4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 137  : accept }'
nft delete element inet filter udp_ports_in4 '{ 192.168.0.0/12 . 192.168.0.0/16 . 137  : accept }'
nft delete element inet filter udp_ports_in4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 5353 : accept }'
nft delete element inet filter udp_ports_in4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 5353 : accept }'
nft delete element inet filter udp_ports_in4 '{ 192.168.0.0/12 . 192.168.0.0/16 . 5353 : accept }'
nft delete element inet filter udp_ports_in4 '{ 10.0.0.0/8     . 224.0.0.0/4    . 5353 : accept }'
nft delete element inet filter udp_ports_in4 '{ 172.16.0.0/12  . 224.0.0.0/4    . 5353 : accept }'
nft delete element inet filter udp_ports_in4 '{ 192.168.0.0/12 . 224.0.0.0/4    . 5353 : accept }'
nft delete element inet filter udp_ports_in6 '{ fe80::/10 . ff00::/8 . 5353  : accept }'
nft delete element inet filter udp_ports_in6 '{ fc00::/7  . ff00::/8 . 5353  : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 21   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 21   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 21   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 23   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 23   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 23   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 25   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 25   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 25   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 53   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 53   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 53   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 80   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 80   : accept }'
nft delete element inet filter tcp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 80   : accept }'
nft delete element inet filter tcp_ports_forward6 '{ fc00::/7  . fc00::/7 . 21 : accept }'
nft delete element inet filter tcp_ports_forward6 '{ fc00::/7  . fc00::/7 . 23 : accept }'
nft delete element inet filter tcp_ports_forward6 '{ fc00::/7  . fc00::/7 . 25 : accept }'
nft delete element inet filter tcp_ports_forward6 '{ fc00::/7  . fc00::/7 . 53 : accept }'
nft delete element inet filter tcp_ports_forward6 '{ fc00::/7  . fc00::/7 . 80 : accept }'
nft delete element inet filter udp_ports_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 53   : accept }'
nft delete element inet filter udp_ports_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 53   : accept }'
nft delete element inet filter udp_ports_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 53   : accept }'
nft delete element inet filter udp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 137  : accept }'
nft delete element inet filter udp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 137  : accept }'
nft delete element inet filter udp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 137  : accept }'
nft delete element inet filter udp_ports_out4 '{ 10.0.0.0/8     . 224.0.0.0/4    . 5353 : accept }'
nft delete element inet filter udp_ports_out4 '{ 172.16.0.0/12  . 224.0.0.0/4    . 5353 : accept }'
nft delete element inet filter udp_ports_out4 '{ 192.168.0.0/16 . 224.0.0.0/4    . 5353 : accept }'
nft delete element inet filter udp_ports_out4 '{ 169.254.0.0/16 . 224.0.0.0/4    . 5353 : accept }'
nft delete element inet filter udp_ports_out6 '{ fc00::/7  . ff00::/8 . 5353 : accept }'
```

## Testing 
Testing can be performed from another client using scapy: 
{{< highlight bash >}}
from scapy.all import *; from ipaddress import IPv4Network as N4; [send(IP(src=str(x), dst='10.211.55.11')/ICMP(id=1, seq=1), loop=0) for x, y in zip(N4('65.146.55.0/24').hosts(), range(254))]
{{< / highlight >}}

On the firewall: 
```
tcpdump -vvv -n -e -ttt -i nflog:1 -XX
...
 00:00:00.000036 version 0, resource ID 1, family IPv4 (2), length 84: (tos 0x0, ttl 64, id 41167, offset 0, flags [none], proto ICMP (1), length 28)
    10.211.55.11 > 65.146.55.254: ICMP echo reply, id 1, seq 1, length 8
	0x0000:  0200 0001 0800 0100 0800 0300 1f00 0a00  ................
	0x0010:  6963 6d70 5f65 6368 6f5f 7265 706c 795f  icmp_echo_reply_
	0x0020:  7261 7465 5f6c 696d 6974 0000 0800 0500  rate_limit......
	0x0030:  0000 0002 2000 0900 4500 001c a0cf 0000  ........E.......
	0x0040:  4001 1ea4 0ad3 370b 4192 37fe 0000 fffd  @.....7.A.7.....
	0x0050:  0001 0001                                ....
```

## Custom Docker support
### Preparation
```
apt -y install docker.io 
systemctl stop docker
rm -rf /var/lib/docker/*
rm /etc/docker/key.json
echo DOCKER_OPTS="-H unix:///var/run/docker.sock --iptables=false --ip-masq=false --userns-remap=default --bip=100.64.80.1/20 --default-address-pool='base=100.64.96.0/20,size=28'" > /etc/default/docker
```

### Custom prefix
This example will use the `100.64.0.0/17` prefix for docker. Earlier that prefix was marked to be discarded as a bogon, that 
can be changed easily: 

```
nft delete element inet filter drop_bogons4 '{ 100.64.0.0/10 : jump bogon }'
nft add element inet filter drop_bogons4 '{ 100.64.0.0/17 : continue      }'
nft add element inet filter drop_bogons4 '{ 100.64.128.0/17 : jump bogon  }'
nft add element inet filter drop_bogons4 '{ 100.65.0.0/16 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.66.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.68.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.70.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.72.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.74.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.76.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.78.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.80.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.82.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.84.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.86.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.88.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.90.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.92.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.94.0.0/15 : jump bogon    }'
nft add element inet filter drop_bogons4 '{ 100.96.0.0/11 : jump bogon    }'
nft add element inet filter local_networks '{ 100.64.0.0/17 }'
```
Verify this with the `nft list map inet filter drop_bogons4` command:

```
table inet filter {
	map drop_bogons4 {
		type ipv4_addr : verdict
		flags interval
		elements = { 0.0.0.0/8 : jump bogon, 10.0.0.0/8 : continue,
			     100.64.0.0/17 : continue, 100.64.128.0/17 : jump bogon,
			     100.65.0.0/16 : jump bogon, 100.66.0.0/15 : jump bogon,
			     100.68.0.0/15 : jump bogon, 100.70.0.0/15 : jump bogon,
			     100.72.0.0/15 : jump bogon, 100.74.0.0/15 : jump bogon,
			     100.76.0.0/15 : jump bogon, 100.78.0.0/15 : jump bogon,
			     100.80.0.0/15 : jump bogon, 100.82.0.0/15 : jump bogon,
			     100.84.0.0/15 : jump bogon, 100.86.0.0/15 : jump bogon,
			     100.88.0.0/15 : jump bogon, 100.90.0.0/15 : jump bogon,
			     100.92.0.0/15 : jump bogon, 100.94.0.0/15 : jump bogon,
			     100.96.0.0/11 : jump bogon, 127.0.0.0/8 : jump bogon,
			     169.254.0.0/16 : continue, 172.16.0.0/12 : continue,
			     192.0.0.0/24 : jump bogon, 192.0.2.0/24 : jump bogon,
			     192.168.0.0/16 : continue, 198.18.0.0/15 : jump bogon,
			     198.51.100.0/24 : jump bogon, 203.0.113.0/24 : jump bogon,
			     224.0.0.0/4 : continue, 240.0.0.0/4 : jump bogon }
	}
}
```

### Forward verdict map
{{< highlight bash >}}
nft add element inet filter default_forward4 '{ 100.64.0.0/20  . 0.0.0.0/0      . new         : jump reject_with_icmp_no_route }'
nft add element inet filter default_forward4 '{ 100.64.16.0/20 . 100.64.32.0/20 . new         : continue                       }'
nft add element inet filter default_forward4 '{ 100.64.32.0/20 . 100.64.16.0/20 . established : accept                         }'
nft add element inet filter default_forward4 '{ 100.64.48.0/20 . 100.64.0.0/17  . new         : continue                       }'
nft add element inet filter default_forward4 '{ 100.64.80.0/20 . 100.64.0.0/17  . new         : continue                       }'
nft add element inet filter default_forward4 '{ 100.64.48.0/20 . 0.0.0.0/0      . new         : continue                       }'
nft add element inet filter default_forward4 '{ 100.64.80.0/20 . 0.0.0.0/0      . new         : continue                       }'
nft add element inet filter default_forward4 '{ 100.64.48.0/20 . 0.0.0.0/0      . established : accept                         }'
nft add element inet filter default_forward4 '{ 100.64.80.0/20 . 0.0.0.0/0      . established : accept                         }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 100.64.48.0/20 . established : accept                         }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 100.64.80.0/20 . established : accept                         }'
nft add element inet filter default_forward4 '{ 100.64.64.0/20 . 100.64.64.0/20 . new         : continue                       }'
nft add element inet filter default_forward4 '{ 100.64.96.0/20 . 100.64.96.0/20 . new         : continue                       }'
nft add element inet filter default_forward4 '{ 100.64.64.0/20 . 100.64.64.0/20 . established : accept                         }'
nft add element inet filter default_forward4 '{ 100.64.96.0/20 . 100.64.96.0/20 . established : accept                         }'
{{< / highlight >}}

### NAT
{{< highlight bash >}}
nft add element inet filter masquerade_networks4 '{ enp0s5 . 100.64.80.0/20 : jump masq }'
nft add element inet filter masquerade_networks4 '{ enp0s5 . 100.64.48.0/20 : jump masq }'
{{< / highlight >}}

### Allow ICMP out to containers
{{< highlight bash >}}
nft add element inet filter icmp_types_out4 '{ 100.64.0.0/17 . 100.64.0.0/17 . destination-unreachable : accept }'
{{< / highlight >}}

### Allow forwarded ICMP by src/dst/type
{{< highlight bash >}}
nft add element inet filter icmp_types_forward4 '{ 100.64.80.0/20 . 100.64.0.0/17 . echo-request : jump reject_with_icmp_admin_prohibited }'
nft add element inet filter icmp_types_forward4 '{ 100.64.80.0/20 . 0.0.0.0/0     . echo-request : accept }'
nft add element inet filter icmp_types_forward4 '{ 100.64.48.0/20 . 100.64.0.0/17 . echo-request : jump reject_with_icmp_admin_prohibited }'
nft add element inet filter icmp_types_forward4 '{ 100.64.48.0/20 . 0.0.0.0/0     . echo-request : accept }'
{{< / highlight >}}

### Allow forwarded TCP by src/dst/dport
{{< highlight bash >}}
nft add element inet filter tcp_ports_forward4 '{ 100.64.80.0/20 . 100.64.0.0/17 . 80  : jump reject_with_icmp_admin_prohibited }'
nft add element inet filter tcp_ports_forward4 '{ 100.64.80.0/20 . 0.0.0.0/0     . 80  : accept }'
nft add element inet filter tcp_ports_forward4 '{ 100.64.80.0/20 . 100.64.0.0/17 . 443 : jump reject_with_icmp_admin_prohibited }'
nft add element inet filter tcp_ports_forward4 '{ 100.64.80.0/20 . 0.0.0.0/0     . 443 : accept }'
nft add element inet filter tcp_ports_forward4 '{ 100.64.48.0/20 . 100.64.0.0/17 . 443 : jump reject_with_icmp_admin_prohibited }'
nft add element inet filter tcp_ports_forward4 '{ 100.64.48.0/20 . 0.0.0.0/0     . 443 : accept }'
{{< / highlight >}}

### Allow forwarded UDP by src/dst/dport
{{< highlight bash >}}
nft add element inet filter udp_ports_forward4 '{ 100.64.80.0/20 . 100.64.0.0/17 . 53 : jump reject_with_icmp_admin_prohibited }'
nft add element inet filter udp_ports_forward4 '{ 100.64.80.0/20 . 0.0.0.0/0     . 53 : accept }'
{{< / highlight >}}

### TODO
This networking scheme is nice for Docker, but it sucks having to specify every address in `docker-compose`. I have an IPAM driver for Docker that will allow tags to specified for networks as options to the IPAM driver in compose, but it is a work in progress. 
#### IPAM Driver
- [https://github.com/paigeadelethompson/docker-ipam-driver](https://github.com/paigeadelethompson/docker-ipam-driver)
#### Network Driver 
- EVPN/VXLAN transports 
- NFTables Flowtables; interface names must be known to the firewall state for offloading