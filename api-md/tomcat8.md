# TOMCAT-8-use-APR-
Configuration of Apache Portable Runtime (APR) based Native library for Tomcat
# config
## 1.install jdk 8
install jdk use rpm 
## 2.install APR
read it more in http://apr.apache.org
## 3.make in native libarary
./configure --with-apr =/usr/local/apr && make && make install
after installation, tomcat can use apr mode automaticly after restart.

