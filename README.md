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


## 
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
