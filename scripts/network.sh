#!/bin/bash

if [ "$1" == "true" ]
then
echo '[Match]' > /etc/systemd/network/eth0.network
echo 'Name=eth0' >> /etc/systemd/network/eth0.network
echo '[Network]' >> /etc/systemd/network/eth0.network
echo 'DHCP=yes' >> /etc/systemd/network/eth0.network
echo 'DNSSEC=no' >> /etc/systemd/network/eth0.network
else
echo '[Match]' > /etc/systemd/network/eth0.network
echo 'Name=eth0' >> /etc/systemd/network/eth0.network
echo '[Network]' >> /etc/systemd/network/eth0.network
echo 'Address='$2 >> /etc/systemd/network/eth0.network
echo 'Gateway='$3 >> /etc/systemd/network/eth0.network
echo 'DNS=8.8.8.8' >> /etc/systemd/network/eth0.network
echo 'DNS=8.8.4.4' >> /etc/systemd/network/eth0.network
fi