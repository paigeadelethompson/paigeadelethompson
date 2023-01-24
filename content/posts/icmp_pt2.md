+++
Title = "Should I enable ICMP? (Pt. 2)"
Date = "2023-01-22T23:20:20-0800"
Author = "Paige"
Description = "Setting up NFTables"
cover = "img/og.png"
+++

# Intro 
This page is still under construction, check back later for the complete release of this part 2. 

# Preparation
This demo uses Debian on Parallels, updated from `bullseye` to `bookworm`:
```
sed -i 's/http:\/\//https:\/\//g' /etc/apt/sources.list
sed -i 's/bullseye/bookworm/g' apt/sources.list
apt update && apt -y dist-upgrade
apt -y install nftables chrony && reboot
```

# Creating the default table
{{< highlight bash >}}
nft flush ruleset
nft add table inet filter
{{< / highlight >}}

## Chains
{{< highlight bash >}}
nft add chain inet filter input '{ type filter hook input priority filter; policy accept; }'
nft add chain inet filter forward '{ type filter hook forward priority filter; policy accept; }'
nft add chain inet filter output '{ type filter hook output priority filter; policy accept; }'
nft add chain inet filter ether_in
nft add chain inet filter ether_out
nft add chain inet filter ether_forward
nft add chain inet filter icmp_in
nft add chain inet filter icmp_out
nft add chain inet filter icmp_echo_reply_rate_limit
nft add chain inet filter reject_with_icmp_port_unreachable_metered
nft add chain inet filter reject_with_icmp_port_unreachable
nft add chain inet filter tcp_in
nft add chain inet filter tcp_out
nft add chain inet filter udp_in
nft add chain inet filter udp_out
{{< / highlight >}}

## Meter sets
{{< highlight bash >}}
nft add set inet filter icmp_egress_meter4 '{ type ipv4_addr; size 8; flags timeout, dynamic; }'
nft add set inet filter icmp_egress_meter6 '{ type ipv6_addr; size 8; flags timeout, dynamic; }'
{{< / highlight >}}

## Verdict maps
### IPv4 bogons
{{< highlight bash >}}
nft add map inet filter drop_bogons4 '{ type ipv4_addr : verdict; flags interval; }'
nft add element inet filter drop_bogons4 '{ 224.0.0.0/4     : continue }'
nft add element inet filter drop_bogons4 '{ 192.168.0.0/16  : continue }'
nft add element inet filter drop_bogons4 '{ 10.0.0.0/8      : continue }'
nft add element inet filter drop_bogons4 '{ 172.16.0.0/12   : continue }' 
nft add element inet filter drop_bogons4 '{ 169.254.0.0/16  : continue }'
nft add element inet filter drop_bogons4 '{ 100.64.0.0/10   : drop     }' 
nft add element inet filter drop_bogons4 '{ 0.0.0.0/8       : drop     }'
nft add element inet filter drop_bogons4 '{ 127.0.0.0/8     : drop     }'
nft add element inet filter drop_bogons4 '{ 192.0.0.0/24    : drop     }'
nft add element inet filter drop_bogons4 '{ 192.0.2.0/24    : drop     }'
nft add element inet filter drop_bogons4 '{ 198.18.0.0/15   : drop     }'
nft add element inet filter drop_bogons4 '{ 198.51.100.0/24 : drop     }' 
nft add element inet filter drop_bogons4 '{ 203.0.113.0/24  : drop     }'
nft add element inet filter drop_bogons4 '{ 240.0.0.0/4     : drop     }'
{{< / highlight >}}

### IPv6 bogons
{{< highlight bash >}}
nft add map inet filter drop_bogons6 '{ type ipv6_addr : verdict; flags interval; }'
nft add element inet filter drop_bogons6 '{ fe80::/10             : continue }'
nft add element inet filter drop_bogons6 '{ fc00::/7              : continue }'
nft add element inet filter drop_bogons6 '{ ff00::/8              : continue }'
nft add element inet filter drop_bogons6 '{ ::ffff:0:0/96         : drop }'
nft add element inet filter drop_bogons6 '{ ::/96                 : drop }'
nft add element inet filter drop_bogons6 '{ 100::/64              : drop }'
nft add element inet filter drop_bogons6 '{ 2001:10::/28          : drop }'
nft add element inet filter drop_bogons6 '{ 2001:db8::/32         : drop }'
nft add element inet filter drop_bogons6 '{ fec0::/10             : drop }'
nft add element inet filter drop_bogons6 '{ 2002::/24             : drop }'
nft add element inet filter drop_bogons6 '{ 2002:a00::/24         : drop }'
nft add element inet filter drop_bogons6 '{ 2002:7f00::/24        : drop }'
nft add element inet filter drop_bogons6 '{ 2002:a9fe::/32        : drop }'
nft add element inet filter drop_bogons6 '{ 2002:ac10::/28        : drop }'
nft add element inet filter drop_bogons6 '{ 2002:c000::/40        : drop }'
nft add element inet filter drop_bogons6 '{ 2002:c000:200::/40    : drop }'
nft add element inet filter drop_bogons6 '{ 2002:c0a8::/32        : drop }'
nft add element inet filter drop_bogons6 '{ 2002:c612::/31        : drop }'
nft add element inet filter drop_bogons6 '{ 2002:c633:6400::/40   : drop }'
nft add element inet filter drop_bogons6 '{ 2002:cb00:7100::/40   : drop }'
nft add element inet filter drop_bogons6 '{ 2002:e000::/20        : drop }'
nft add element inet filter drop_bogons6 '{ 2002:f000::/20        : drop }'
nft add element inet filter drop_bogons6 '{ 2001::/40             : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:a00::/40       : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:7f00::/40      : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:a9fe::/48      : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:ac10::/44      : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:c000::/56      : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:c000:200::/56  : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:c0a8::/48      : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:c612::/47      : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:c633:6400::/56 : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:cb00:7100::/56 : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:e000::/36      : drop }'
nft add element inet filter drop_bogons6 '{ 2001:0:f000::/36      : drop }'
{{< / highlight >}}

### IPv4 reject or drop
{{< highlight bash >}}
nft add map inet filter reject_or_drop_port4 '{ typeof ip saddr . ip daddr : verdict; flags interval; }'
nft add element inet filter reject_or_drop_port4 '{ 10.0.0.0/8     . 10.0.0.0/8     : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port4 '{ 172.16.0.0/12  . 172.16.0.0/12  : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port4 '{ 192.168.0.0/16 . 192.168.0.0/16 : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port4 '{ 169.254.0.0/16 . 169.254.0.0/16 : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port4 '{ 0.0.0.0/0      . 0.0.0.0/0      : jump reject_with_icmp_port_unreachable_metered }'
{{< / highlight >}}

### IPv6 reject or drop
{{< highlight bash >}}
nft add map inet filter reject_or_drop_port6 '{ typeof ip6 saddr . ip6 daddr : verdict; flags interval; }'
nft add element inet filter reject_or_drop_port6 '{ fe80::/10 . fe80::/10 : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port6 '{ fc00::/7  . fc00::/7  : jump reject_with_icmp_port_unreachable         }'
nft add element inet filter reject_or_drop_port6 '{ ::/0      . ::/0      : jump reject_with_icmp_port_unreachable_metered }'
{{< / highlight >}}

### IPv4 ingress ICMP types
{{< highlight bash >}}
nft add map inet filter icmp_types_in4 '{ typeof ip saddr . ip daddr . icmp type : verdict; flags interval; }'
nft add element inet filter icmp_types_in4 '{ 0.0.0.0/0 . 0.0.0.0/0 . echo-request            : accept }'
nft add element inet filter icmp_types_in4 '{ 0.0.0.0/0 . 0.0.0.0/0 . echo-reply              : accept }'
nft add element inet filter icmp_types_in4 '{ 0.0.0.0/0 . 0.0.0.0/0 . destination-unreachable : accept }'
{{< / highlight >}}

### IPv6 ingress ICMP types
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

### IPv4 ingress TCP ports
{{< highlight bash >}}
nft add map inet filter tcp_ports_in4 '{ typeof ip saddr . ip daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_in4 '{ 0.0.0.0/0 . 0.0.0.0/0 . 22 : accept }'
{{< / highlight >}}

### IPv6 ingress TCP ports
{{< highlight bash >}}
nft add map inet filter tcp_ports_in6 '{ typeof ip6 saddr . ip6 daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_in6 '{ ::/0 . ::/0 . 22 : accept }'
{{< / highlight >}}

### IPv4 ingress UDP ports
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

### IPv6 ingress UDP ports
{{< highlight bash >}}
nft add map inet filter udp_ports_in6 '{ typeof ip6 saddr . ip6 daddr . udp dport : verdict; flags interval; }'
nft add element inet filter udp_ports_in6 '{ fe80::/10 . ff00::/8 . 546   : accept }'
nft add element inet filter udp_ports_in6 '{ fe80::/10 . ff00::/8 . 5353  : accept }'
nft add element inet filter udp_ports_in6 '{ fc00::/7  . ff00::/8 . 5353  : accept }'
{{< / highlight >}}

### IPv4 default forward networks
{{< highlight bash >}}
nft add map inet filter default_forward4 '{ typeof ip saddr . ip daddr . ct state : verdict; flags interval; }'
nft add element inet filter default_forward4 '{ 169.254.0.0/16 . 0.0.0.0/0      . new         : drop }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 169.254.0.0/16 . new         : drop }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 172.16.0.0/12  . new         : drop }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 192.168.0.0/16 . new         : drop }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 10.0.0.0/8     . new         : drop }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 192.168.0.0/16 . new         : drop }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 10.0.0.0/8     . new         : drop }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 172.16.0.0/12  . new         : drop }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . new         : accept }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 10.0.0.0/8     . established : accept }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . new         : accept }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 172.16.0.0/12  . established : accept }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . new         : accept }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 192.168.0.0/16 . established : accept }'
nft add element inet filter default_forward4 '{ 10.0.0.0/8     . 0.0.0.0/0      . new         : accept }'
nft add element inet filter default_forward4 '{ 172.16.0.0/12  . 0.0.0.0/0      . new         : accept }'
nft add element inet filter default_forward4 '{ 192.168.0.0/16 . 0.0.0.0/0      . new         : accept }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 10.0.0.0/8     . established : accept }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 172.16.0.0/12  . established : accept }'
nft add element inet filter default_forward4 '{ 0.0.0.0/0      . 192.168.0.0/16 . established : accept }'
{{< / highlight >}}

### IPv6 default forward networks
{{< highlight bash >}}
nft add map inet filter default_forward6 '{ typeof ip6 saddr . ip6 daddr . ct state : verdict; flags interval; }'
nft add element inet filter default_forward6 '{ fe80::/10 . ::/0      . new : drop }'
nft add element inet filter default_forward6 '{ ::/0      . fe80::/10 . new : drop }'
nft add element inet filter default_forward6 '{ fc00::/7  . fc00::/7  . new : accept }'
nft add element inet filter default_forward6 '{ fc00::/7  . fc00::/7  . new : accept }'
{{< / highlight >}}

### IPv4 egress ICMP types
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
nft add element inet filter icmp_types_out4 '{ 10.0.0.0/8     . 0.0.0.0/0      . echo-reply              : jump icmp_echo_reply_rate_limit }'
{{< / highlight >}}

### IPv6 egress ICMP types 
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

### IPv4 egress TCP ports 
{{< highlight bash >}}
nft add map inet filter tcp_ports_out4 '{ typeof ip saddr . ip daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 21   : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 21   : accept }'
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 21   : accept }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 23   : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 23   : accept }'
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 23   : accept }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 25   : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 25   : accept }'
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 25   : accept }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 53   : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 53   : accept }'
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 53   : accept }'
nft add element inet filter tcp_ports_out4 '{ 10.0.0.0/8     . 10.0.0.0/8     . 80   : accept }'
nft add element inet filter tcp_ports_out4 '{ 172.16.0.0/12  . 172.16.0.0/12  . 80   : accept }'
nft add element inet filter tcp_ports_out4 '{ 192.168.0.0/16 . 192.168.0.0/16 . 80   : accept }'
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

### IPv6 egress TCP ports
{{< highlight bash >}}
nft add map inet filter tcp_ports_out6 '{ typeof ip6 saddr . ip6 daddr . tcp dport : verdict; flags interval; }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 21     : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 23     : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 25     : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 53     : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 443    : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 853    : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 4460   : accept }'
nft add element inet filter tcp_ports_out6 '{ fc00::/7 . fc00::/7 . 5349   : accept }'
nft add element inet filter tcp_ports_out6 '{ 2000::/3 . 2000::/3 . 443    : accept }'
nft add element inet filter tcp_ports_out6 '{ 2000::/3 . 2000::/3 . 853    : accept }'
nft add element inet filter tcp_ports_out6 '{ 2000::/3 . 2000::/3 . 4460   : accept }'
nft add element inet filter tcp_ports_out6 '{ 2000::/3 . 2000::/3 . 5349   : accept }'
{{< / highlight >}}

### IPv4 egress UDP ports 
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

### IPv6 egress UDP ports
{{< highlight bash >}}
nft add map inet filter udp_ports_out6 '{ typeof ip6 saddr . ip6 daddr . udp dport : verdict; flags interval; }'
nft add element inet filter udp_ports_out6 '{ fe80::/10 . ff00::/8 . 547 : accept }'
nft add element inet filter udp_ports_out6 '{ 2000::/3 . ::/0 . 443 : accept }'
nft add element inet filter udp_ports_out6 '{ fc00::/7  . ff00::/8 . 5353  : accept }'
{{< / highlight >}}

## Rules

### Metered ICMP unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_port_unreachable_metered add @icmp_egress_meter4 '{ ip daddr timeout 4s limit rate 3/second }' counter reject with icmpx type port-unreachable
nft add rule inet filter reject_with_icmp_port_unreachable_metered add @icmp_egress_meter6 '{ ip6 daddr timeout 4s limit rate 3/second }' counter reject with icmpx type port-unreachable
{{< / highlight >}}

### Un-metered ICMP unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_port_unreachable reject with icmpx type port-unreachable
{{< / highlight >}}

### icmp_in
{{< highlight bash >}}
nft add rule inet filter icmp_in ip saddr . ip daddr . icmp type vmap @icmp_types_in4 counter
nft add rule inet filter icmp_in ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_in6 counter
{{< / highlight >}}

### tcp_in
{{< highlight bash >}}
nft add rule inet filter tcp_in ct state established counter accept
nft add rule inet filter tcp_in ip saddr . ip daddr . tcp dport vmap @tcp_ports_in4 counter
nft add rule inet filter tcp_in ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_in6 counter
nft add rule inet filter tcp_in log prefix "tcp_in" group 1
nft add rule inet filter tcp_in ip saddr . ip daddr vmap @reject_or_drop_port4
nft add rule inet filter tcp_in ip6 saddr . ip6 daddr vmap @reject_or_drop_port6
{{< / highlight >}}

### udp_in
{{< highlight bash >}}
nft add rule inet filter udp_in ct state established counter accept
nft add rule inet filter udp_in ip saddr . ip daddr . udp dport vmap @udp_ports_in4 counter
nft add rule inet filter udp_in ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_in6 counter
nft add rule inet filter udp_in log prefix "udp_in" group 1
nft add rule inet filter udp_in ip saddr . ip daddr vmap @reject_or_drop_port4
nft add rule inet filter udp_in ip6 saddr . ip6 daddr vmap @reject_or_drop_port6
{{< / highlight >}}

### ether_in
{{< highlight bash >}}
nft add rule inet filter ether_in ip protocol vmap '{ tcp : jump tcp_in, udp : jump udp_in , icmp : jump icmp_in }' counter
nft add rule inet filter ether_in ip6 nexthdr vmap '{ tcp : jump tcp_in, udp : jump udp_in , icmpv6 : jump icmp_in, ipv6-icmp: jump icmp_in }' counter
{{< / highlight >}}

### input
{{< highlight bash >}}
nft add rule inet filter input meta iiftype vmap '{ loopback: accept }'
nft add rule inet filter input ip saddr vmap @drop_bogons4 counter
nft add rule inet filter input ip6 saddr vmap @drop_bogons6 counter
nft add rule inet filter input meta iiftype vmap '{ ether: jump ether_in }'
{{< / highlight >}}

### ether_forward
{{< highlight bash >}}
nft add rule inet filter ether_forward ip saddr . ip daddr . ct state vmap @default_forward4
nft add rule inet filter ether_forward ip6 saddr . ip6 daddr . ct state vmap @default_forward6
{{< / highlight >}}

### forward
{{< highlight bash >}}
nft add rule inet filter forward ip saddr vmap @drop_bogons4 counter
nft add rule inet filter forward ip6 saddr vmap @drop_bogons6 counter
nft add rule inet filter forward meta oiftype vmap '{ ether: jump ether_forward }'
{{< / highlight >}}

### ICMP echo-reply rate limit
{{< highlight bash >}}
nft add rule inet filter icmp_echo_reply_rate_limit add @icmp_egress_meter4 '{ ip saddr timeout 4s limit rate 3/second }' counter accept
nft add rule inet filter icmp_echo_reply_rate_limit add @icmp_egress_meter6 '{ ip6 saddr timeout 4s limit rate 3/second }' counter accept
{{< / highlight >}}

### icmp_out
{{< highlight bash >}}
nft add rule inet filter icmp_out ip saddr . ip daddr . icmp type vmap @icmp_types_out4 counter
nft add rule inet filter icmp_out ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_out6 counter
{{< / highlight >}}

### tcp_out
{{< highlight bash >}}
nft add rule inet filter tcp_out ct state established counter accept
nft add rule inet filter tcp_out ip saddr . ip daddr . tcp dport vmap @tcp_ports_out4 counter
nft add rule inet filter tcp_out ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_out6 counter
{{< / highlight >}}

### udp_out
{{< highlight bash >}}
nft add rule inet filter udp_out ct state established counter accept
nft add rule inet filter udp_out ip saddr . ip daddr . udp dport vmap @udp_ports_out4 counter
nft add rule inet filter udp_out ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_out6 counter
{{< / highlight >}}

### ether_out
{{< highlight bash >}}
nft add rule inet filter ether_out ip protocol vmap { tcp : jump tcp_out, udp : jump udp_out, icmp : jump icmp_out }
nft add rule inet filter ether_out ip6 nexthdr vmap { tcp : jump tcp_out, udp : jump udp_out, icmpv6 : jump icmp_out, ipv6-icmp: jump icmp_out }
{{< / highlight >}}

### output
{{< highlight bash >}}
nft add rule inet filter output meta oiftype vmap '{ loopback: accept }'
nft add rule inet filter output ip daddr vmap @drop_bogons4 counter
nft add rule inet filter output ip6 daddr vmap @drop_bogons6 counter
nft add rule inet filter output meta oiftype vmap '{ ether: jump ether_out }'
{{< / highlight >}}

## Default chain policies 
{{< highlight bash >}}
nft add chain inet filter input '{ policy drop; }'
nft add chain inet filter forward '{ policy drop; }'
nft add chain inet filter output '{ policy drop; }'
{{< / highlight >}}

## Logging
{{< highlight bash >}}
nft add rule inet filter input log prefix "input" group 1
nft add rule inet filter input counter

nft add rule inet filter forward log prefix "forward" group 1
nft add rule inet filter forward counter

nft add rule inet filter output log prefix "output" group 1
nft add rule inet filter output counter
{{< / highlight >}}

### Viewing logged packets
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

### Per-chain logging
#### Metered ICMP unreachable
{{< highlight bash >}}
nft add rule inet filter reject_with_icmp_port_unreachable_metered log prefix "reject_with_icmp_port_unreachable_metered" group 1
nft add rule inet filter reject_with_icmp_port_unreachable_metered counter drop
{{< / highlight >}}

#### Ingress ICMP
{{< highlight bash >}}
nft add rule inet filter icmp_in log prefix "icmp_in" group 1
nft add rule inet filter icmp_in counter drop
{{< / highlight >}}

#### Ingress TCP
{{< highlight bash >}}
nft add rule inet filter tcp_in log prefix "tcp_in" group 1
nft add rule inet filter tcp_in counter drop
{{< / highlight >}}

#### Ingress UDP
{{< highlight bash >}}
nft add rule inet filter udp_in log prefix "udp_in" group 1
nft add rule inet filter udp_in counter drop
{{< / highlight >}}

#### Ingress Ether
{{< highlight bash >}}
nft add rule inet filter ether_in log prefix "ether_in" group 1
nft add rule inet filter ether_in counter drop
{{< / highlight >}}

#### Forward Ether
{{< highlight bash >}}
nft add rule inet filter ether_forward log prefix "ether_forward" group 1
nft add rule inet filter ether_forward counter drop
{{< / highlight >}}

#### Egress ICMP echo replies
{{< highlight bash >}}
nft add rule inet filter icmp_echo_reply_rate_limit log prefix "icmp_echo_reply_rate_limit" group 1
nft add rule inet filter icmp_echo_reply_rate_limit counter drop
{{< / highlight >}}

#### Egress ICMP
{{< highlight bash >}}
nft add rule inet filter icmp_out log prefix "icmp_out" group 1
nft add rule inet filter icmp_out counter drop
{{< / highlight >}}

#### Egress TCP
{{< highlight bash >}}
nft add rule inet filter tcp_out log prefix "tcp_out" group 1
nft add rule inet filter tcp_out counter drop
{{< / highlight >}}

#### Egress UDP
{{< highlight bash >}}
nft add rule inet filter udp_out log prefix "udp_out" group 1
nft add rule inet filter udp_out counter drop
{{< / highlight >}}

#### Egress Ether
{{< highlight bash >}}
nft add rule inet filter ether_out log prefix "ether_out" group 1
nft add rule inet filter ether_out counter drop
{{< / highlight >}}

# Filter state
`nft -a -s list ruleset | tee /etc/nftables.conf`

{{< highlight bash >}}
table inet filter { # handle 129
	set icmp_egress_meter4 { # handle 16
		type ipv4_addr
		size 8
		flags dynamic,timeout
	}

	set icmp_egress_meter6 { # handle 17
		type ipv6_addr
		size 8
		flags dynamic,timeout
	}

	map drop_bogons4 { # handle 18
		type ipv4_addr : verdict
		flags interval
		elements = { 0.0.0.0/8 : drop, 10.0.0.0/8 : continue,
			     100.64.0.0/10 : continue, 127.0.0.0/8 : drop,
			     169.254.0.0/16 : continue, 172.16.0.0/12 : continue,
			     192.0.0.0/24 : drop, 192.0.2.0/24 : drop,
			     192.168.0.0/16 : continue, 198.18.0.0/15 : drop,
			     198.51.100.0/24 : drop, 203.0.113.0/24 : drop,
			     224.0.0.0/4 : continue, 240.0.0.0/4 : drop }
	}

	map drop_bogons6 { # handle 19
		type ipv6_addr : verdict
		flags interval
		elements = { ::/96 : drop,
			     ::ffff:0.0.0.0/96 : drop,
			     100::/64 : drop,
			     2001::/40 : drop,
			     2001:0:a00::/40 : drop,
			     2001:0:7f00::/40 : drop,
			     2001:0:a9fe::/48 : drop,
			     2001:0:ac10::/44 : drop,
			     2001:0:c000::/56 : drop,
			     2001:0:c000:200::/56 : drop,
			     2001:0:c0a8::/48 : drop,
			     2001:0:c612::/47 : drop,
			     2001:0:c633:6400::/56 : drop,
			     2001:0:cb00:7100::/56 : drop,
			     2001:0:e000::/36 : drop,
			     2001:0:f000::/36 : drop,
			     2001:10::/28 : drop,
			     2001:db8::/32 : drop,
			     2002::/24 : drop,
			     2002:a00::/24 : drop,
			     2002:7f00::/24 : drop,
			     2002:a9fe::/32 : drop,
			     2002:ac10::/28 : drop,
			     2002:c000::/40 : drop,
			     2002:c000:200::/40 : drop,
			     2002:c0a8::/32 : drop,
			     2002:c612::/31 : drop,
			     2002:c633:6400::/40 : drop,
			     2002:cb00:7100::/40 : drop,
			     2002:e000::/20 : drop,
			     2002:f000::/20 : drop,
			     fc00::/7 : continue,
			     fe80::/10 : continue,
			     fec0::/10 : drop,
			     ff00::/8 : continue }
	}

	map reject_or_drop_port4 { # handle 20
		typeof ip saddr . ip daddr : verdict
		flags interval
		elements = { 10.0.0.0/8 . 10.0.0.0/8 : jump reject_with_icmp_port_unreachable,
			     172.16.0.0/12 . 172.16.0.0/12 : jump reject_with_icmp_port_unreachable,
			     192.168.0.0/16 . 192.168.0.0/16 : jump reject_with_icmp_port_unreachable,
			     169.254.0.0/16 . 169.254.0.0/16 : jump reject_with_icmp_port_unreachable,
			     0.0.0.0/0 . 0.0.0.0/0 : jump reject_with_icmp_port_unreachable_metered }
	}

	map reject_or_drop_port6 { # handle 21
		typeof ip6 saddr . ip6 daddr : verdict
		flags interval
		elements = { fe80::/10 . fe80::/10 : jump reject_with_icmp_port_unreachable,
			     fc00::/7 . fc00::/7 : jump reject_with_icmp_port_unreachable,
			     ::/0 . ::/0 : jump reject_with_icmp_port_unreachable_metered }
	}

	map icmp_types_in4 { # handle 22
		typeof ip saddr . ip daddr . icmp type : verdict
		flags interval
		elements = { 0.0.0.0/0 . 0.0.0.0/0 . echo-request : accept,
			     0.0.0.0/0 . 0.0.0.0/0 . echo-reply : accept,
			     0.0.0.0/0 . 0.0.0.0/0 . destination-unreachable : accept }
	}

	map icmp_types_in6 { # handle 23
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

	map tcp_ports_in4 { # handle 24
		typeof ip saddr . ip daddr . tcp dport : verdict
		flags interval
		elements = { 0.0.0.0/0 . 0.0.0.0/0 . 22 : accept }
	}

	map tcp_ports_in6 { # handle 25
		typeof ip6 saddr . ip6 daddr . tcp dport : verdict
		flags interval
		elements = { ::/0 . ::/0 . 22 : accept }
	}

	map udp_ports_in4 { # handle 26
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

	map udp_ports_in6 { # handle 27
		typeof ip6 saddr . ip6 daddr . udp dport : verdict
		flags interval
		elements = { fe80::/10 . ff00::/8 . 546 : accept,
			     fe80::/10 . ff00::/8 . 5353 : accept,
			     fc00::/7 . ff00::/8 . 5353 : accept }
	}

	map icmp_types_out4 { # handle 28
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
			     10.0.0.0/8 . 0.0.0.0/0 . echo-reply : jump icmp_echo_reply_rate_limit }
	}

	map icmp_types_out6 { # handle 29
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

	map tcp_ports_out4 { # handle 30
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

	map tcp_ports_out6 { # handle 31
		typeof ip6 saddr . ip6 daddr . tcp dport : verdict
		flags interval
	}

	map udp_ports_out4 { # handle 32
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

	map udp_ports_out6 { # handle 33
		typeof ip6 saddr . ip6 daddr . udp dport : verdict
		flags interval
		elements = { fe80::/10 . ff00::/8 . 547 : accept,
			     2000::/3 . ::/0 . 443 : accept,
			     fc00::/7 . ff00::/8 . 5353 : accept }
	}

	map default_forward4 { # handle 85
		typeof ip saddr . ip daddr . ct state : verdict
		flags interval
		elements = { 169.254.0.0/16 . 0.0.0.0/0 . new : drop,
			     0.0.0.0/0 . 169.254.0.0/16 . new : drop,
			     10.0.0.0/8 . 172.16.0.0/12 . new : drop,
			     10.0.0.0/8 . 192.168.0.0/16 . new : drop,
			     172.16.0.0/12 . 10.0.0.0/8 . new : drop,
			     172.16.0.0/12 . 192.168.0.0/16 . new : drop,
			     192.168.0.0/16 . 10.0.0.0/8 . new : drop,
			     192.168.0.0/16 . 172.16.0.0/12 . new : drop,
			     10.0.0.0/8 . 10.0.0.0/8 . new : accept,
			     10.0.0.0/8 . 10.0.0.0/8 . established : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . new : accept,
			     172.16.0.0/12 . 172.16.0.0/12 . established : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . new : accept,
			     192.168.0.0/16 . 192.168.0.0/16 . established : accept,
			     10.0.0.0/8 . 0.0.0.0/0 . new : accept,
			     172.16.0.0/12 . 0.0.0.0/0 . new : accept,
			     192.168.0.0/16 . 0.0.0.0/0 . new : accept,
			     0.0.0.0/0 . 10.0.0.0/8 . established : accept,
			     0.0.0.0/0 . 172.16.0.0/12 . established : accept,
			     0.0.0.0/0 . 192.168.0.0/16 . established : accept }
	}

	map default_forward6 { # handle 86
		typeof ip6 saddr . ip6 daddr . ct state : verdict
		flags interval
		elements = { fe80::/10 . ::/0 . new : drop,
			     ::/0 . fe80::/10 . new : drop,
			     fc00::/7 . fc00::/7 . new : accept }
	}

	chain input { # handle 1
		type filter hook input priority filter; policy drop;
		meta iiftype vmap { loopback : accept } # handle 42
		ip saddr vmap @drop_bogons4 counter # handle 43
		ip6 saddr vmap @drop_bogons6 counter # handle 44
		meta iiftype vmap { ether : jump ether_in } # handle 45
		log prefix "input" group 1 # handle 46
		counter # handle 47
	}

	chain forward { # handle 2
		ip saddr vmap @drop_bogons4 counter # handle 89
		ip6 saddr vmap @drop_bogons6 counter # handle 90
		meta oiftype vmap { ether : jump ether_forward } # handle 92
		log prefix "forward" group 1 # handle 93
		counter # handle 94
	}

	chain output { # handle 3
		type filter hook output priority filter; policy drop;
		meta oiftype vmap { loopback : accept } # handle 48
		ip daddr vmap @drop_bogons4 counter # handle 49
		ip6 daddr vmap @drop_bogons6 counter # handle 50
		meta oiftype vmap { ether : jump ether_out } # handle 51
		log prefix "output" group 1 # handle 52
		counter # handle 53
	}

	chain ether_in { # handle 4
		ip protocol vmap { icmp : jump icmp_in, tcp : jump tcp_in, udp : jump udp_in } counter # handle 54
		ip6 nexthdr vmap { tcp : jump tcp_in, udp : jump udp_in, ipv6-icmp : jump icmp_in } counter # handle 55
	}

	chain ether_out { # handle 5
		ip protocol vmap { icmp : jump icmp_out, tcp : jump tcp_out, udp : jump udp_out } # handle 56
		ip6 nexthdr vmap { tcp : jump tcp_out, udp : jump udp_out, ipv6-icmp : jump icmp_out } # handle 57
		log prefix "ether_forward" group 1 # handle 95
		counter drop # handle 96
	}

	chain ether_forward { # handle 6
		ip saddr . ip daddr . ct state vmap @default_forward4 # handle 87
		ip6 saddr . ip6 daddr . ct state vmap @default_forward6 # handle 88
	}

	chain icmp_in { # handle 7
		ip saddr . ip daddr . icmp type vmap @icmp_types_in4 counter # handle 58
		ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_in6 counter # handle 59
	}

	chain icmp_out { # handle 8
		ip saddr . ip daddr . icmp type vmap @icmp_types_out4 counter # handle 60
		ip6 saddr . ip6 daddr . icmpv6 type vmap @icmp_types_out6 counter # handle 61
	}

	chain icmp_echo_reply_rate_limit { # handle 9
		add @icmp_egress_meter4 { ip saddr timeout 4s limit rate 3/second } counter accept # handle 62
		add @icmp_egress_meter6 { ip6 saddr timeout 4s limit rate 3/second } counter accept # handle 63
	}

	chain reject_with_icmp_port_unreachable_metered { # handle 10
		add @icmp_egress_meter4 { ip daddr timeout 4s limit rate 3/second } counter reject with icmp port-unreachable # handle 64
		add @icmp_egress_meter6 { ip6 daddr timeout 4s limit rate 3/second } counter reject with icmpv6 port-unreachable # handle 65
	}

	chain reject_with_icmp_port_unreachable { # handle 11
		reject # handle 66
	}

	chain tcp_in { # handle 12
		ct state established counter accept # handle 67
		ip saddr . ip daddr . tcp dport vmap @tcp_ports_in4 counter # handle 68
		ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_in6 counter # handle 69
		log prefix "tcp_in" group 1 # handle 70
		ip saddr . ip daddr vmap @reject_or_drop_port4 # handle 71
		ip6 saddr . ip6 daddr vmap @reject_or_drop_port6 # handle 72
	}

	chain tcp_out { # handle 13
		ct state established counter accept # handle 73
		ip saddr . ip daddr . tcp dport vmap @tcp_ports_out4 counter # handle 74
		ip6 saddr . ip6 daddr . tcp dport vmap @tcp_ports_out6 counter # handle 75
	}

	chain udp_in { # handle 14
		ct state established counter accept # handle 76
		ip saddr . ip daddr . udp dport vmap @udp_ports_in4 counter # handle 77
		ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_in6 counter # handle 78
		log prefix "udp_in" group 1 # handle 79
		ip saddr . ip daddr vmap @reject_or_drop_port4 # handle 80
		ip6 saddr . ip6 daddr vmap @reject_or_drop_port6 # handle 81
	}

	chain udp_out { # handle 15
		ct state established counter accept # handle 82
		ip saddr . ip daddr . udp dport vmap @udp_ports_out4 counter # handle 83
		ip6 saddr . ip6 daddr . udp dport vmap @udp_ports_out6 counter # handle 84
	}
}
{{< / highlight >}}
## flush ruleset 
Something that helps me is adding `flush ruleset` to the beginning of the new `/etc/nftables.conf` file so that the existing state is flushed before loading the file. 

# Custom Docker support
## Preparation
```
apt -y install docker.io 
systemctl stop docker
rm -rf /var/lib/docker/*
rm /etc/docker/key.json
echo DOCKER_OPTS="-H unix:///var/run/docker.sock --iptables=false --ip-masq=false --userns-remap=default --bip=100.64.80.1/20 --default-address-pool='base=100.64.96.0/20,size=28'" > /etc/default/docker
```

## Custom prefix
This example will use the `100.64.0.0/17` prefix for docker. Earlier that prefix was marked to be discarded as a bogon, that 
can be changed easily: 

```
nft delete element inet filter drop_bogons4 '{ 100.64.0.0/10 : drop }'
nft add element inet filter drop_bogons4 '{ 100.64.0.0/17 : continue }'
nft add element inet filter drop_bogons4 '{ 100.64.128.0/17 : drop }'
nft add element inet filter drop_bogons4 '{ 100.65.0.0/16 : drop }'
nft add element inet filter drop_bogons4 '{ 100.66.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.68.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.70.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.72.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.74.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.76.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.78.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.80.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.82.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.84.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.86.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.88.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.90.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.92.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.94.0.0/15 : drop }'
nft add element inet filter drop_bogons4 '{ 100.96.0.0/11 : drop }'

```
Verify this with the `nft list map inet filter drop_bogons4` command:

```
table inet filter {
	map drop_bogons4 {
		type ipv4_addr : verdict
		flags interval
		elements = { 0.0.0.0/8 : drop, 10.0.0.0/8 : continue,
			     100.64.0.0/10 : continue, 127.0.0.0/8 : drop,
			     169.254.0.0/16 : continue, 172.16.0.0/12 : continue,
			     192.0.0.0/24 : drop, 192.0.2.0/24 : drop,
			     192.168.0.0/16 : continue, 198.18.0.0/15 : drop,
			     198.51.100.0/24 : drop, 203.0.113.0/24 : drop,
			     224.0.0.0/4 : continue, 240.0.0.0/4 : drop }
	}
}
```

## Forward verdict map
{{< highlight bash >}}
nft add map inet filter docker_forward_map4 '{ typeof ip saddr . ip daddr . ct state : verdict; flags interval; }'
nft add element inet filter docker_forward_map4 '{ 100.64.0.0/20  . 0.0.0.0/0      . new         : drop   }'
nft add element inet filter docker_forward_map4 '{ 100.64.16.0/20 . 100.64.32.0/20 . new         : accept }'
nft add element inet filter docker_forward_map4 '{ 100.64.32.0/20 . 100.64.16.0/20 . established : accept }'
nft add element inet filter docker_forward_map4 '{ 100.64.48.0/20 . 100.64.0.0/17  . new         : drop   }'
nft add element inet filter docker_forward_map4 '{ 100.64.80.0/20 . 100.64.0.0/17  . new         : drop   }'
nft add element inet filter docker_forward_map4 '{ 100.64.48.0/20 . 0.0.0.0/0      . new         : accept }'
nft add element inet filter docker_forward_map4 '{ 100.64.80.0/20 . 0.0.0.0/0      . new         : accept }'
nft add element inet filter docker_forward_map4 '{ 0.0.0.0/0      . 100.64.48.0/20 . established : accept }'
nft add element inet filter docker_forward_map4 '{ 0.0.0.0/0      . 100.64.80.0/20 . established : accept }'
nft add element inet filter docker_forward_map4 '{ 100.64.64.0/20 . 100.64.64.0/20 . new         : accept }'
nft add element inet filter docker_forward_map4 '{ 100.64.96.0/20 . 100.64.96.0/20 . new         : accept }'
nft add element inet filter docker_forward_map4 '{ 100.64.64.0/20 . 100.64.64.0/20 . established : accept }'
nft add element inet filter docker_forward_map4 '{ 100.64.96.0/20 . 100.64.96.0/20 . established : accept }'
nft add element inet filter docker_forward_map4 '{ 169.254.0.0/16 . 100.64.0.0/17  . new         : drop   }'
nft add element inet filter docker_forward_map4 '{ 10.0.0.0/8     . 100.64.0.0/17  . new         : drop   }'
nft add element inet filter docker_forward_map4 '{ 172.16.0.0/12  . 100.64.0.0/17  . new         : drop   }'
nft add element inet filter docker_forward_map4 '{ 192.168.0.0/16 . 100.64.0.0/17  . new         : drop   }'
{{< / highlight >}}

## Forward chain 
Rules can be inserted at a specific offset, `nft -a list chain inet filter ether_forward`:
```
table inet filter {
	chain ether_forward { # handle 6
		ip saddr . ip daddr . ct state vmap @default_forward4 # handle 87
		ip6 saddr . ip6 daddr . ct state vmap @default_forward6 # handle 88
		log prefix "ether_forward" group 1 # handle 97
		counter packets 0 bytes 0 drop # handle 98
	}
}
```

To insert a rule before `Handle 97`:
```
nft insert rule inet filter ether_forward handle 97 ip saddr . ip daddr . ct state vmap @docker_forward_map4
```
Then just verify that it was added correctly `nft -a list chain inet filter ether_forward`:
```
table inet filter {
	chain ether_forward { # handle 6
		ip saddr . ip daddr . ct state vmap @default_forward4 # handle 87
		ip6 saddr . ip6 daddr . ct state vmap @default_forward6 # handle 88
		ip saddr . ip daddr . ct state vmap @docker_forward_map4 # handle 100
		log prefix "ether_forward" group 1 # handle 97
		counter packets 0 bytes 0 drop # handle 98
	}
}
```