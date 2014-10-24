# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  
  # We will be using ubuntu 14.04 64-bit
  config.vm.box = "ubuntu/trusty64"

  # Port 8080 on guest machine will forward to port 8080
  # on your host machine
  config.vm.network "forwarded_port", guest: 8080, host: 8080
 
  # Virtualbox specific settings
  config.vm.provider "virtualbox" do |vb|
    # Allocate 2048 or 2GB of memory for virtual machine  
    vb.customize ["modifyvm", :id, "--memory", "2048"]
  end

  # Run our install script
  config.vm.provision "shell", path: "etc/install/run.sh"
end
