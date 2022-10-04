//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后再来实现的事件函数
window.onload = function () {

  //声明一个记录点击的缩略图下标
  var bigImgIndex = 0;

  //路径导航的数据渲染
  navPathDataBind();

  function navPathDataBind() {
    /*
     * 思路：
     * 1.先获取路径导航的页面元素（navPath）
     * 2.再获取所需要的数据（data.js --> goodData.path）
     * 3.由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的
     */

    //获取页面导航的元素对象
    var navPath = document.getElementById("navPath");
    //获取数据
    var path = goodData.path;
    //遍历数据
    for (var i = 0; i < path.length; i++) {
      if (i == path.length - 1) {
        //只需要创建a，且没有href属性
        var aNode = document.createElement("a");
        aNode.innerText = path[i].title;
        navPath.appendChild(aNode);
      } else {
        //创建a标签
        var aNode = document.createElement("a");
        aNode.href = path[i].url;
        aNode.innerText = path[i].title;
        //创建i标签
        var iNode = document.createElement("i");
        iNode.innerText = "/";
        //给navPath添加子节点a和i
        navPath.appendChild(aNode);
        navPath.appendChild(iNode);
      }
    }
  }

  //放大镜的移入、移出效果
  bigClassBind();

  function bigClassBind() {
    /*
     * 思路：
     * 1.获取小图框元素对象，并且设置移入的事件(onmouseenter)
     * 2.动态的创建蒙版元素和大图框以及大图片元素
     * 3.移出(onmouseleave)需要移除蒙版元素和大图框以及大图片元素
     */

    //获取小图框元素
    var smallPic = document.getElementById("smallPic");
    //获取leftTop元素
    var leftTop = document.getElementById("leftTop");
    //获取数据
    var imagessrc = goodData.imagessrc;
    //设置移入的事件
    smallPic.onmouseenter = function () {
      //创建蒙版元素
      var maskDiv = document.createElement("div");
      maskDiv.className = "mask";
      //创建大图框元素
      var bigPic = document.createElement("div");
      bigPic.id = "bigPic";
      //创建大图片
      var bigImg = document.createElement("img");
      bigImg.src = imagessrc[bigImgIndex].b;
      //给bigPic添加子节点bigImg
      bigPic.appendChild(bigImg);
      //给smallPic添加子节点maskDiv
      smallPic.appendChild(maskDiv);
      //给leftTop添加子节点bigPic
      leftTop.appendChild(bigPic);

      //设置滚动事件
      smallPic.onmousemove = function () {
        //event.clientX：鼠标点距离浏览器左侧X轴的值
        //getBoundingClientRect().left：小图框元素距离浏览器左侧的可视left的距离
        //offsetWidth：元素的占位宽度
        var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
        var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;
        //判断
        if (left < 0) {
          left = 0;
        } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
          left = smallPic.clientWidth - maskDiv.offsetWidth;
        }
        if (top < 0) {
          top = 0
        } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
          top = smallPic.clientHeight - maskDiv.offsetHeight;
        }
        //设置left和top属性
        maskDiv.style.left = left + "px";
        maskDiv.style.top = top + "px";
        //移动比例关系：蒙版元素移动距离/大图片元素移动距离=1/2
        //蒙版元素移动距离=小图框宽度-蒙版元素宽度
        //大图片元素移动距离=大图片宽度-大图框元素宽度
        var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth);
        bigImg.style.left = -left / scale + "px";
        bigImg.style.top = -top / scale + "px";
      }

      //设置移出事件
      smallPic.onmouseleave = function () {
        //让smallPic移除maskDiv元素
        smallPic.removeChild(maskDiv);
        //让leftTop移除bigPic
        leftTop.removeChild(bigPic);
      }
    }
  }

  //动态渲染放大镜缩略图的数据
  thumbnailData();

  function thumbnailData() {
    /*
     * 思路：
     * 1.先获取picList元素下的ul
     * 2.再获取data.js文件下的goodData-->imagessrc
     * 3.遍历数组，根据数组的长度来创建li元素
     * 4.给ul遍历追加li元素
     */

    //获取picList下的ul
    var ul = document.querySelector("#picList ul");
    //获取imagessrc数据
    var imagessrc = goodData.imagessrc;
    //遍历数组
    for (var i = 0; i < imagessrc.length; i++) {
      //创建li元素
      var newLi = document.createElement("li");
      //创建img元素
      var newImg = document.createElement("img");
      newImg.src = imagessrc[i].s;
      //给newLi添加newImg节点
      newLi.appendChild(newImg);
      //给newLi添加newImg节点
      ul.appendChild(newLi);
    }
  }

  //点击缩略图的效果
  thumbnailClick();

  function thumbnailClick() {
    /*
     * 思路：
     * 1.获取的所有的li元素，并且循环绑定点击事件
     * 2.点击缩略图需要确定其下标位置来找到对应的大图路径和小图路径来替换现有src的属性
     */

    //获取所有的li元素
    var liNodes = document.querySelectorAll("#picList ul li");
    var smallPic_img = document.querySelector("#smallPic img");
    var imagessrc = goodData.imagessrc;
    //小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
    smallPic_img.src = imagessrc[0].s;
    //循环点击li元素
    for (var i = 0; i < liNodes.length; i++) {
      //在点击事件之前，给每一个元素都添加上一个自定义下标
      /* 还可以通过setAttribute("index", i);的方式添加 */
      liNodes[i].index = i;
      liNodes[i].onclick = function () {
        /* 事件函数中的this永远指向的是实际发生事件的目标源对象 */
        var idx = this.index;
        bigImgIndex = idx;
        //变换小图路径
        smallPic_img.src = imagessrc[bigImgIndex].s;
      }
    }
  }

  thumbnailLeftRightClick();

  function thumbnailLeftRightClick() {
    /*
     * 思路：
     * 1.先获取左右两端的箭头元素
     * 2.再获取可视的div以及ul元素和所有的li元素
     * 3.计算（发生起点、步长、总体运动的距离值）
     * 4.然后再绑定点击事件
     */

    //获取箭头元素
    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    //获取可视的div以及ul元素和所有的li元素
    var ul = document.querySelector("#picList ul");
    var liNodes = document.querySelectorAll("#picList ul li");
    //计算：
    //发生起点
    var start = 0;
    //步长
    var step = (liNodes[0].offsetWidth + 20) * 2;
    //总体运动的距离值=ul的宽度-div框的宽度=(图片的总数-div中显示的数量)*(li的宽度+20)
    var endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20)
    //绑定点击事件
    prev.onclick = function () {
      start -= step;
      if (start < 0) {
        start = 0;
      }
      ul.style.left = -start + "px";
    }
    next.onclick = function () {
      start += step;
      if (start > endPosition) {
        start = endPosition;
      }
      ul.style.left = -start + "px";
    }
  }

  //商品详情数据的动态渲染
  rightTopData();

  function rightTopData() {
    /*
     * 思路：
     * 1.查找rightTop元素
     * 2.查找data.js文件中的goodData.goodsDetail
     * 3.建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染rightTop元素
     */

    //查找元素
    var rightTop = document.getElementById("rightTop");
    //查找数据
    var goodsDetail = goodData.goodsDetail;
    //创建一个字符串(双引号、单引号、模板字符串)变量
    //模板字符串替换数据：${变量}
    var s = `<h3>${goodsDetail.title}</h3>
							<p>${goodsDetail.recommend}</p>
							<div class="priceWrap">
								<div class="priceTop">
									<span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
									<div class="price">
										<span>￥</span>
										<p>${goodsDetail.price}</p>
										<i>降价通知</i>
									</div>
									<p>
										<span>累计评价</span>
										<span>670000</span>
									</p>
								</div>
								<div class="priceBottom">
									<span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
									<p>
										<span>${goodsDetail.promoteSales.type}</span>
										<span>${goodsDetail.promoteSales.content}</span>
									</p>	
								</div>
							</div>
							<div class="support">
								<span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
								<p>${goodsDetail.support}</p>
							</div>
							<div class="address">
								<span>配&nbsp;送&nbsp;至</span>
								<p>${goodsDetail.address}</p>
							</div>`;
    //重新渲染rightTop元素
    rightTop.innerHTML = s;
  }

  //商品参数数据的动态渲染
  rightBottomData();

  function rightBottomData() {
    /*
     * 思路：
     * 1.查找chooseWrap的元素对象
     * 2.查找data.js文件中的goodsData.goodsDetail.crumbData
     * 3.由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象（dt、dd）
     */

    //查找元素对象
    var chooseWrap = document.getElementById("chooseWrap");
    //查找数据
    var crumbData = goodData.goodsDetail.crumbData;
    //遍历数组
    for (var i = 0; i < crumbData.length; i++) {
      //创建dl元素对象
      var dlNode = document.createElement("dl");
      //创建dt元素对象
      var dtNode = document.createElement("dt");
      dtNode.innerText = crumbData[i].title;
      //给dlNode添加dtNode节点
      dlNode.appendChild(dtNode);
      //遍历数组
      for (var j = 0; j < crumbData[i].data.length; j++) {
        //创建dd元素对象
        var ddNode = document.createElement("dd");
        ddNode.innerText = crumbData[i].data[j].type;
				ddNode.setAttribute("price", crumbData[i].data[j].changePrice);
        //给dlNode添加ddNode节点
        dlNode.appendChild(ddNode);
      }
      //给chooseWrap添加dlNode节点
      chooseWrap.appendChild(dlNode);
    }
  }

  //点击商品参数
  clickddBind();

  function clickddBind() {
    /*
     * 每一行dd文字颜色排他的思路：
     * 1.获取所有的dl元素
     * 2.循环所有的dd元素并且添加点击事件
     * 3.确定实际发生事件的目标源对象设置其颜色为红色，然后给其他所有的元素颜色都重置为基础颜色(#666)
		 *
		 * ================================================= *
		 *
		 * 点击dd之后产生的mark标记的思路：
		 * 1.首先来创建一个可以容纳点击的dd元素值的容器（数组），确定数组的起始长度，再添加一些默认值
		 * 2.然后再将点击的dd元素的值按照对应下标写入到数组元素的身上
		 * 3.
     */

    //获取所有的dl元素
    var dlNodes = document.querySelectorAll("#chooseWrap dl");
		//创建一个可以容纳点击的dd元素值的容器
		var arr = new Array(dlNodes.length);
		//数组填充值为0
		arr.fill(0);
    for (var i = 0; i < dlNodes.length; i++) {
			//闭包函数
      (function (i) {
        var ddNodes = dlNodes[i].querySelectorAll("dd");
        //遍历当前所有的dd元素
        for (var j = 0; j < ddNodes.length; j++) {
          ddNodes[j].onclick = function () {
						//获取choose元素
						var choose = document.getElementById("choose");
						//清空choose元素
						choose.innerHTML = "";
            for (var k = 0; k < ddNodes.length; k++) {
              ddNodes[k].style.color = "#666";
            }
            this.style.color = "red";
						arr[i] = this;
						changePriceBind(arr);
						//遍历arr数组，将非0元素的值写入到mark标记中
						arr.forEach(function(value, index){
							//只要是为真的条件，就动态创建mark标签
							if(value){
								//创建div元素
								var markDiv = document.createElement("div");
								//并且设置class属性
								markDiv.className = "mark";
								//并且设置值
								markDiv.innerText = value.innerText;
								//创建一个a元素
								var aNode = document.createElement("a");
								//并且设置值
								aNode.innerText = "X";
								//并且设置下标
								aNode.setAttribute("index", index);
								//给markDiv添加aNode节点
								markDiv.appendChild(aNode);
								//给choose添加markDiv节点
								choose.appendChild(markDiv);
							}
						})
						//获取所有的a标签元素，，并且循环绑定点击事件
						var aNodes = document.querySelectorAll(".mark a");
						for(var n = 0; n < aNodes.length; n++){
							aNodes[n].onclick = function(){
								//获取点击的a标签身上的index属性值
								var idx_a = this.getAttribute("index");
								//恢复数组中对应下标元素的值
								arr[idx_a] = 0;
								//查找对应下标dl行中的所有的dd元素
								var ddList = dlNodes[idx_a].querySelectorAll("dd");
								//遍历所有的dd元素
								for(var m = 0; m < ddList.length; m++){
									//默认的第一个dd颜色恢复成红色，而其余的多有的dd颜色未灰色
									ddList[m].style.color = "#666";
								}
								ddList[0].style.color = "red";
								//删除对应下标位置的mark标记
								choose.removeChild(this.parentNode);
								//调用价格函数
								changePriceBind(arr);
							}
						}
          }
        }
      })(i)
    }
  }

	//价格变动的函数
	//这个函数需要在点击dd的时候以及删除mark标记的时候才需要调用
	function changePriceBind(arr){
		/*
		 * 思路：
		 * 1.获取价格的标签元素
		 * 2.给每一个dd标签身上默认都设置一个自定义属性，用来记录变化的价格
		 * 3.遍历arr数组，将dd元素身上新变化的价格和已有的价格（5299）相加
		 * 4.最后将计算后的结果重新渲染到p标签中
		 */
		
		//原价格标签
		var oldPrice = document.querySelector(".price p");
		//取出默认的价格
		var price = goodData.goodsDetail.price;
		//遍历arr数组
		for(var i = 0; i < arr.length; i++){
			if(arr[i]){
				//数据类型的强制转换
				var changePrice = Number(arr[i].getAttribute("price"));
				//最终价格
				price += changePrice;
			}
		}
		oldPrice.innerText = price;
		//将变化后的价格写入到左侧标签中
		var leftPrice = document.querySelector(".listWrap .left p");
		leftPrice.innerText = "￥" + price;
		//遍历选择搭配中所有的复选框元素，看是否有选中的
		var ipts = document.querySelectorAll(".middle li div input");
		var newPrice = document.querySelector(".right i");
		for(var j = 0; j < ipts.length; j++){
			if(ipts[j].checked){
				price += Number(ipts[j].value);
			}
		}
		//右侧的套餐价重新渲染
		newPrice.innerText = "￥" + price;
	}
	
	//选择搭配中间区域复选框选中套餐价变动效果
	choosePrice();
	function choosePrice(){
		/*
		 * 思路：
		 * 1.先获取中间区域所有的复选框元素
		 * 2.遍历这些元素，取出他们的价格，和左侧的基础价格进行累加，累加之后重新写回套餐价标签里面
		 */
		
		//获取复选框元素
		var ipts = document.querySelectorAll(".middle li div input");
		var leftPrice = document.querySelector(".listWrap .left p");
		var newPrice = document.querySelector(".right i");
		//遍历复选框
		for(var i = 0; i < ipts.length; i++){
			ipts[i].onclick = function(){
				var  oldPrice = Number(leftPrice.innerText.slice(1));
				for(var j = 0; j < ipts.length; j++){
					if(ipts[j].checked){
						//左侧价格加上选中的复选框的附加价格
						oldPrice += Number(ipts[j].value);
					}
				}
				//重新写回到套餐价标签里面
				newPrice.innerText = "￥" + oldPrice;
			}
		}
	}
	
	//封装一个公共的选项卡函数
	/*
	 * 1.被点击的元素
	 * 2.被切换显示的元素
	 */
	function tab(tabBtns, tabConts){
		for(var i = 0; i < tabBtns.length; i++){
			tabBtns[i].index = i;
			tabBtns[i].onclick = function(){
				for(var j = 0; j < tabBtns.length; j++){
					tabBtns[j].className = "";
					tabConts[j].className = "";
				}
				this.className = "active";
				tabConts[this.index].className = "active";
			}
		}
	}
	
	//点击左侧选项卡
	leftTab();
	function leftTab(){
		//被点击的元素
		var h4s = document.querySelectorAll(".asideTop h4");
		//被切换显示的元素
		var divs = document.querySelectorAll(".asideBottom >div");
		//调用函数
		tab(h4s, divs);
	}
	
	//点击右侧选项卡
	rightTab();
	function rightTab(){
		//被点击的元素
		var lis = document.querySelectorAll(".tabBtns li");
		//被切换显示的元素
		var divs = document.querySelectorAll(".tabContents div");
		//调用函数
		tab(lis, divs);
	}
	
	//右边侧边栏的点击效果
	rightAsideBind();
	function rightAsideBind(){
		/*
		 * 思路：
		 * 1.先找到按钮元素绑定点击事件
		 * 2.记录一个初始的状态，在点击事件的内部进行判断
		 * 3.设置按钮盒侧边栏的class效果
		 */
		
		//找按钮元素
		var btns = document.getElementById("btns");
		//记录初始状态
		var flag = true;
		//查找侧边栏元素
		var rightAside = document.getElementById("rightAside");
		//绑定点击事件
		btns.onclick = function(){
			//判断
			if(flag){
				//展开：flag = false;
				btns.className = "btnsOpen";
				rightAside.className = "asideOpen";
			}else{
				//关闭：flag = true;
				btns.className = "btnsClose";
				rightAside.className = "asideClose";
			}
			//flag状态取反
			flag = !flag;
		}
	}
	
}
