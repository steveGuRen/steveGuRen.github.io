#  在github创建repository
    
在[github](http://www.github.com)里面创建一个新的仓库，仓库名称与拥有者（你的GitHub账号昵称或者组织名）的名称要一致，例如你的账户昵称叫username,那么仓库名字就叫username.github.io，创建完毕之后，你的仓库克隆地址会像
如下格式

	https://github.com/username/username.github.io
[releases]: https://github.com/showdownjs/showdown/releases

## 第一步

首先从github克隆刚刚创建的仓库下来

	$ git clone https://github.com/username/username.github.io

## 第二步
通过cd命令进入文件夹username.github.io，然后通过echo命令新建一个index.html，并将hello world输入到index.html

	$ cd username.github.io
    $ echo "Hello world" > index.html
    
## 第三步
将刚刚创建的index.html文件push到远程master主分支

	$ git add --all
    $ git commit -m "Initial commit"
    $ git push -u origin master

## 最后
访问http://username.github.io


  ![最后本人实现的博客](http://upload-images.jianshu.io/upload_images/1815061-3212add85e4edc75.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 参考
  gitPage官网：https://pages.github.com/