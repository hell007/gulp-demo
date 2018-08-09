

## 此构建工具说明


#####  目录结构

1. _env 

文件是构建工具应用产生，主要是 fis-conf.js 配置生成

2. html 

一些自定义html文件

3. snippets

文件主要是对 html 页面里面公共部分的抽取，并且针对不同的终端，浏览器版本进行配置，引入依赖的css,js,html属性等，添加到html页面里面

utils/ 文件下面定义了一些 mixin 混入方法

base/ 文件下面定义一些自定义文件 

注意：*.pug 文件需要  fis3-parser-pug 插件的支持

4. static

静态资源文件

utils/  sass的使用

5. html页面文件

6. fis3配置文件以及前端依赖


	cnpm install -g  fis-optimizer-clean-css-2x



#####  sass定义样式说明

说明

	@function函数
	@mixin可以传递参数，而%不行；
	@mixin的调用方式是@include，而%的调用方式是@extend；
	@include产生的样式是以复制拷贝的方式存在的，而@extend产生的样式是以组合申明的方式存在的

utils/  function  mixin



