#!/bin/bash

echo "Welcome to Curuba App installation.";
echo "The installation is divided in next steps:";
echo "1. Download and install Node and NPM from the website";
echo "2. Start App.js (Curuba Server) using Node.";
#echo "3. Configure the Curuba Server in startup script";

question

function install()
{
echo "Installing Curuba....";
echo "1. Downloading Node and NPM....";

   #Install Node
MACHINE_TYPE='uname -m'
if [ ${MACHINE_TYPE} == 'x86_64']; then 
   curl http://nodejs.org/dist/v0.10.23/node-v0.10.23-linux-x64.tar.gz | tar xz
   cd node-v0.10.23-linux-x64
else
   curl http://nodejs.org/dist/v0.10.23/node-v0.10.23-linux-x86.tar.gz | tar xz
   cd node-v0.10.23-linux-x86
fi

   ./configure
   make
   make install

   #Install npm
   curl http://npmjs.org/install.sh | sudo sh
   npm install


echo "2. Start App.js in 'server' folder ....";
node ./server/app.js
#echo "3. Copying "
}

function exitinstall()
{
echo "Waiting for your return...";
exit -1
}

function question()
{
read -p "Would you like to continue? y/n" choice
case "$choice" in
   y|Y ) install;;
   n|N ) exitinstall;;
   *) echo "invalid";;
esac
}

question

