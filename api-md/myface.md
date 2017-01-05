---
title: 人脸识别-中心损失函数
date: 2016-10-20 18:12:23
tags:
---

本论文对人脸识别和验证任务提出一种新的损失函数，即中心损失。中心损失和softmax损失联合监督学习的CNN，其对深层学习特征的人脸识别能力大大提高。对几个大型人脸基准的实验已经令人信服地证明了该方法的有效性。

## 相关论文

题目：A Discriminative Feature Learning Approachfor Deep Face Recognition

作者：Yandong Wen, Kaipeng Zhang, Zhifeng Li*, YuQiao

## 论文摘要

卷积神经网络（CNN）已经广泛应用于计算机视觉领域，显著提高了现有计算机视觉水平。在大多数可用的CNN中，softmax损失函数被用作训练深度模型的监视信号。为了增强深度学习特征的识别能力，本论文为人脸识别任务提出一种新的监视信号，称作中心损失函数（center loss）。具体地说，中心损失函数学习每类数据的深层特征的中心，同时惩罚深层特征和它们对应的类中心间的距离。更重要的是，我们证明了这种**中心损失函数是可训练的，而且在CNN中非常容易优化。**通过Softmax损失函数和中心损失函数的联合监视，我们可以训练足够强大的CNN，得到两个关键学习目标的深层特征以及尽可能高的类间分散性和类内紧密性，这对人脸识别来说非常重要。令人鼓舞的是，我们这种联合监视的CNN在几个重要人脸识别基准上取得了最高的准确率，包括Labeled Faces inthe Wild (LFW)，YouTube Faces (YTF)，和MegaFace Challenge。尤其是，我们的新方法在小型训练集（少于500000幅图像、少于20000个人）协议下的MegaFace（最大的公共领域基准）上得到了最好结果，相比以前的结果有显著的提高，这为人脸识别和人脸验证任务带来新的发展。

## CNN架构
![cnn structure](http://img.mp.itc.cn/upload/20161016/55c32667b2ef4c6baa228d0e799f4119_th.png)
图：人脸识别任务中使用的CNN架构（来自论文，下同）

## 用LFW和YTF数据集实验

LFW和YTF中的部分人脸图像，绿色框是同个人，红色反之，白色框的人脸用于测试：
![exp](http://img.mp.itc.cn/upload/20161016/6ea8cd49048b483da41d089d3d77bf7f_th.jpeg)

## 实验结果

![result](http://img.mp.itc.cn/upload/20161016/132a3f24a02143bcae01f33cf640a1f8.jpeg)
实验中，model A是单一使用softmax损失函数监视的模型，model B是softmax损失和对比损失联合监视的模型，model C是softmax损失和中心损失联合监视的模型。实验结果显示，model C的性能比model A和model B性能更好，在LFW和YTF中都能得到更高的准确率。

用MegaFaceChallenge数据集实验

MegaFace中的人脸图像样本：
![mega](http://img.mp.itc.cn/upload/20161016/3f15c624cb5040e4a5ea80b04fb1aca7_th.jpeg)
我们对使用不同方法的模型进行了人脸识别和人脸验证实验，结果如下：
![res1](http://img.mp.itc.cn/upload/20161016/bd86faad91244e5182447c4398be3865_th.jpeg)
人脸识别任务中不同模型的正确率
![res2](http://img.mp.itc.cn/upload/20161016/2cf0f8f155e04d689bd196976395d088_th.jpeg)
人脸验证任务中不同模型的正确率

结果显示，使用 softmax 损失函数和中心损失函数联合监视的 model C 能得到更高的正确率。

## 总结

本论文中我们对人脸识别和验证任务提出一种新的损失函数，即中心损失。中心损失和softmax损失联合监督学习的CNN，其对深层学习特征的人脸识别能力大大提高。>对几个大型人脸基准的实验已经令人信服地证明了该方法的有效性。

## 开源

这篇论文发表于2016欧洲计算机视觉大会（ECCV 2016），论文作者于10月12日和13日开源了训练模型和提取深层特征demo。

开源地址：[https://github.com/ydwen/caffe-face](https://github.com/ydwen/caffe-face)

**训练模型**

* 1.安装Caffe，请按照[安装指南](http://caffe.berkeleyvision.org/installation.html)进行，确保在使用我们的代码前已经正确安装caffe。

* 2.下载人脸数据集，e.g. CAISA-WebFace,VGG-Face, MS-Celeb-1M, MegaFace.

* 3.预处理训练人脸图像，包括检测、对齐等。这里我们强烈推荐MTCNN，它是用于人脸识别和对齐非常高效的开源工具。

* 4.创建训练集和验证集的列表，放到face_example/ data/

* 5.指定train和val的数据源

```prototxt
layer {
  name: "data"
  type: "ImageData"
  top: "data"
  top: "label"
  image_data_param {
    source: "face_example/data/caisa_train.txt"
  }
 }
```

* 6.指定FC6层的目标数量

```prototxt
layer {
  name: "fc6"
  type: "InnerProduct"
  bottom: "fc5"
  top: "fc6"
  inner_product_param {
    num_output: 10572  
}
```
* 7.指定中心损失层目标数量和损失权重

```prototxt
layer {
  name: "center_loss"
  type: "CenterLoss"
  bottom: "fc5"
  bottom: "label"
  top: "center_loss"
  center_loss_param {
    num_output: 10572
  }
  loss_weight: 0.008
}
```

* 8.训练模型

**提取深层特征**

* 1.编译及配置matcaffe

* 2.在face_example/extractDeepFeature.m中指定相应的路径

```matlab
addpath('path_to_matCaffe/matlab')
model = 'path_to_deploy/face_deploy.prototxt';
weights = 'path_to_model/face_model.caffemodel';
image = imread('path_to_image/Jennifer_Aniston_0003.jpg')
```

* 3.在Matlab运行extractDeepFeature.m-
