MONGO_LOG='/var/log/mongodb'
MONGO_DB='/opt/UCRcareer_db'

# Prerequisite tools 
echo 'Installing prerequisite tools...'
sudo apt-get install -y build-essential git
echo 'Finished installing prerequisites'

# Build and install node and npm from source
echo 'Building and installing node and npm from source...'
pushd ~ 
git clone https://github.com/joyent/node.git
cd node
git checkout v0.10.32
./configure && make && sudo make install
cd ..
rm -rf node
popd 
echo 'Done building and installing node and npm'

# Install global node modules
echo 'Installing bower, nodemon, and gulp'
sudo npm install -g bower nodemon gulp http-server
echo 'Done installing bower, nodemon, and gulp'

# Install mongodb
# Following the directions from the offical site found
# here
# http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
echo 'Installing mongodb'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
echo 'Done installing mongodb'

# Setup DB paths, set permissions, and start DB
echo 'Creating DB paths, setting permissions, and starting mongo'
# Make sure mongo daemon has not already started
# if so, stop daemon
sudo service mongod stop
sudo mkdir -p $MONGO_LOG
sudo chown -R 'vagrant' $MONGO_LOG
sudo mkdir -p $MONGO_DB
sudo chown -R 'vagrant' $MONGO_DB
sudo -u vagrant mongod --config /vagrant/etc/install/mongod-yaml.conf
echo 'Done setting up and running mongodb'

# Install Heroku Toolbelt
echo 'Installing heroku'
wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh 
echo 'Done installing heroku'

echo 'DONEEEEEEE!'
