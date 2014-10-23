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
sudo npm install -g bower nodemon gulp 
echo 'Done installing bower, nodemon, and gulp'

# Install mongodb
# Following the directions from the offical site found
# here
# http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
echo 'Installing and starting mongodb'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
echo 'Done installing and starting mongodb'

# Install Heroku Toolbelt
echo 'Installing heroku'
wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh 
echo 'Done installing heroku'

echo 'DONEEEEEEE!'
