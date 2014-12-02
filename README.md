UCRcareer
==============
This project mimics job hunting websites such as indeed.com. Users can search for jobs based on keywords. 

They can also rate and review jobs. After user's first use, he should get updated and personalized job information in the future.

# Team 

| Name                 | Email            | Github Username |
|:---------------------|:-----------------|:----------------|
|David Castillo        |dcast030@ucr.edu  |dcastil1983      |
|Odalys Garau          |ogara001@ucr.edu  |ogara001         |
|Alex Gonzales         |agonz056@ucr.edu  |CrazyWearsPJs    |
|Noel Llanura          |nllan001@ucr.edu  |nllan001         |
|Manuel Sanchez Munoz  |msanc031@ucr.edu  |omoman           |

# Setting up your development machine
We will be using vagrant to set up a virtual machine we can use for development.

## Required Dependancies
Install the latest versions of [virtualbox](https://www.virtualbox.org/wiki/Downloads) and [vagrant](https://www.vagrantup.com/downloads), and [git](http://git-scm.com/book/en/Getting-Started-Installing-Git) in that order.

## Getting the source
Simply run
```bash
git clone https://github.com/CrazyWearsPJs/UCRcareer.git
```

## Starting the environment
From the root of the project, simply run
```bash
vagrant up
```
This command will fetch a copy of Ubuntu 14.04, provision it with the software we need (More below..), and automagically enable port forwarding.

## Interaction with the VM
Below are a list of commands you'll be using often with vagrant
```bash
# Remote into your VM
vagrant ssh 

# View current state of VM
vagrant status

# Put your VM to sleep
vagrant suspend

# Start a sleeping VM 
vagrant resume

# Shutdown the VM
vagrant halt

# Wipe your VM out completely
vagrant destroy
```
REMEMBER, anything you do with vagrant, can also be done with virtualbox, so if you want to modify your VM using a GUI or if vagrant enters a 'bad state', you can delete the VM through the virtualbox GUI.

## Installed software
The VM comes installed with the following
```bash
git 
node
npm
bower
gulp
nodemon
mongodb
heroku
```
Along with everything else that comes in a base install of ubuntu. Vagrant also sets up port forwarding on the VM, meaning certain ports which will be listed below, will be accessible from your host machine.

Forwarded ports:

| Host                 | Guest            | Use                 |
|:---------------------|:-----------------|:--------------------|
|8080                  |8080              |HTTP Server          |
|8081                  |8081              |MongoDB Listening    |
|9081                  |9081              |MongoDB Web Interface|

EXAMPLE USE:

You have a node app on the VM listening on port 8080. You'll be able to send it requests from your host web browser by going to localhost:8080.


Also, the VM exposes a shared folder under '/vagrant'. In that folder you will find all our development files that we cloned from github. Any changes you make to those files will be available on your host and vice versa, meaning you can edit your development files on your host using sublime (or whatever) and have your VM get those changes as well instantaneously. 

# Starting the application

```bash
vagrant ssh
cd /vagrant
npm install // or npm install --no-bin-links on windows
cd site
bower install
cd ..
npm install
mongod --config /vagrant/etc/install/mongod-yaml.conf
node server.js
```

# Viewing the application on a mobile device
You can view the website on a mobile device too!
Sorry Manny, but so far I only know how to do this on windows :(
First, make sure you started the application with
```bash
node server.js
```
Then, find out the ip address of your router.
To do this, bring up the cmd and call ipconfig.
For example, mine is 10.0.0.15.
It could also start with 192.168.x.x.
Then comes the windows specific part.
Go to control panel/system and security/windows firewall/advanced settings.
Click on inbound rules and click on "new rule" in the right pane.
Choose "port" and then hit next.
Enter in 8080 into ports and make sure it is TCP.
Then just keep going with the defaults until you can name the rule.
Name it whatever you want and finish.
Now, go to some mobile device or just another device on the same network.
Let's say your ip address = 10.0.0.15 and port = 8080.
On your other computer, go to a web browser and enter as the url,
```bash
http://10.0.0.15:8080
```
And there you go. You should now be able to view the website on a remote device!
*Note: Make sure you gulped the files so that it is on your latest build.

# MongoDB Reference

## Connecting to DB
You can connect using the 'mongo' driver program which comes installed on the VM. To connect, simply run 
```bash
mongo --port 8081 --host 10.0.2.15
```
From the VM. If you want to connect to the DB from your host machine, make sure you have 'mongo' installed and run 
```bash
mongo --port 8081
```
Remember that when you need to start up your VM again because of a shut down, the db daemon will also be killed off so you need to start the db again. To do so, just run 
```bash
mongod --config /vagrant/etc/install/mongod-yaml.conf
```
in the root directory.

## Web interface
The VM has also been set up with a web interface for the DB which can be viewed by following [this](http://localhost:9081) link. NOTE: The web interface will only show you information about YOUR DB ON YOUR VM. If you can't view it, make sure your VM is running using 'vagrant status'

Curious what [this](http://localhost:9081) is? Click it and see! The reason we can do that is because of the port forwarding vagrant set up!

# Quick Git Review

## Getting started
* Clone the remote repository
* Change directory to the newly cloned repo
* Checkout your branch (DO NOT WORK FROM MASTER)

## Workflow
* Do work on files
* Pull any changes from your remote branch you might have
* Add files to staging area
* Commit files
* Pull from your remote branch again (just in case!)
* Push changes to remote
* Repeat

If a feature is ready to be merged to master, make a pull request. See [this](https://help.github.com/articles/creating-a-pull-request/) for a quick how-to. Otherwise, if we are together you can just let Manny or Alex know, and they will merge the features into master then and there.

Once you have a feature merged into master, you can delete your branch (WARNING MAKE SURE YOUR STUFF REALLY IS MERGED INTO MASTER), and make a new one based off the master branch. 

While you are waiting for a feature to be merged, you can still continue to work on your branch, just dont delete anything. If you are unsure, just ask Manny or Alex. 

## Commands

```bash
# Make a clone of this repository locally
git clone https://github.com/CrazyWearsPJs/UCRcareer.git

# Checkout your branch
git checkout <YOUR_NAME>-dev

# Create and checkout a new branch based off of master
git checkout master <-- Make sure you are on the master branch
git checkout -b <YOUR_NAME>-dev <-- Create and switch to new branch which is a copy of master

# Check what branch you are on
git branch

# Stage your changes for being committed
git add <FILES> <-- DONT USE '.' or '*' unless you know what you're doing

# Check what files are staged or ready to be staged
git status

# Remove files from staging area
git reset

# Commit files which are staged 
git commit -m "YOUR COMMIT MESSAGE"

# See git commit log
git log -<NUM_OF_MESSAGES_TO_SEE>
EX. git log -4

# Push your changes to your remote branch
git push origin <YOUR_NAME>-dev

# Pull any changes from your remote branch
git pull origin <YOUR_NAME>-dev

# Revert all your locally modified files to the last commit you made (YOUR CHANGES WHICH ARE NOT COMMITTED WILL BE LOST)
git checkout .

# Check to see what changes you made to a file since the last commit
git diff <FILE_NAME>

# Remove a local branch
git branch -d <BRANCH_NAME>

# Remove a remote branch
git push origin :<BRANCH_NAME>
EX. git push origin :bad-branch-dev
```

# Running the application

Start the VM and do the following
```bash
cd /vagrant
mongod --config etc/install/mongod-yaml.conf
npm install
cd site
bower install
cd ..
```
These steps will
* Move you to our development directory
* Start the mongo daemon
* Locally install our node dependancies
* Move you to our frontend directory
* Locally install our web client dependancies
* Move you back to our development directory

Next, to start the webserver run
```bash
node server.js
```
You should be able to go to http://localhost:8080 and see the application. 

## Tests

### Server

You can run our server test cases by running
```bash
mocha
```

### Database
If you want to check the database directly for a document, then first 
run mongo's interactive shell with the command
```bash
mongo --port 8081 --host 10.0.2.15
```
and then
```bash
show dbs
```
to list the databases currently on your machine. Then
```bash
use TestUCRcareers
```
to switch to the database where the collections you want are stored at. 
Then you can replace TestUCRcareers with whatever other database you need. Then
```bash
db.getCollectionNames();
```
to list the different collections you may have. Right now it should only be
applicants, employers, and job postings.
To list all the documents in a collection you can use the .find(). For example, to find all the documents in the
applicants collection
```bash
db.applicants.find();
  or
db.applicants.find().pretty();
```
The latter is to enable pretty print on the json blob, which is only necessary for readability.
To perform a query for a document, let's say an applicant with
a first name of Prime and a last name of Minister
```bash
db.applicants.find({'personal.fName':'Prime','personal.lName':'Minister'}).pretty();
```
