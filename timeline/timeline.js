function iTimePoint(iTimeSlideId, dateId, timeLineId, titleTop, titleId, defaultShow){
    /* variables details:
     * iTimeSlideId: 外围ID名. 本样例DOM中#itimeslide;
     * dateId: the date ID;
     * timeLineId: 时间点分布ID名. 本样例DOM中#timeline;
     * titleTop: 标题容器上方小三角ID名. 本样例DOM中#titletop;
     * titleId: 标题容器ID名. 本样例DOM中#title;
     * defaultShow: 设定初始显示的时间点, 默认为0, 可不传值
     */

	//commen methods
    var iBase = {
        //document.getElementById
        Id: function(name){
            return document.getElementById(name);
        },
        //point slide animation
        PointSlide: function(elem, val){
            //slide rate
            for (var i = 0; i <= 100; i += 5) {
                (function(){
                    //this is important
                    var pos = i;
                    //smooth move
                    setTimeout(function(){
                        elem.style.left = pos * val / 100 + 'px';
                    }, (pos + 1) * 10);
                })();
            }
        },
        //add style to variable
        AddClass: function(elem, val){
            //if the element don't have class then give one to it
            if (!elem.className) {
                elem.className = val;
            }else {
                //otherwise add one more
                var oVal = elem.className;
                oVal += ' ';
                oVal += val;
                elem.className = val;
            }
        },
        //get the index from elements
        Index: function(cur, obj){
            for (var i = 0; i < obj.length; i++) {
                if (obj[i] == cur) {
                    return i;
                }
            }
        }
    }
    var monthsMap=["Jan","Feb","Mar","Apr","May","Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    var count=36;	//there are 37 month in total
			
			//add 2010-12 
			var tempObject = {
				index: 0,
				month: "Dec",
				year: "2010"
			};
			
			months.push(tempObject);			
			for (var i=1; i < count + 1; i++) {
        var o={};
        o.index=i;
        o.month=monthsMap[i % 12];
        o.year=baseYear + Math.floor(i/12);
        months.push(o);
        
    	}
    	
    var dataLen = months.length;
    var iTimeSilde = iBase.Id(iTimeSlideId);
    var date = iBase.Id(dateId);
    var timeLine = iBase.Id(timeLineId);
    var titletop = iBase.Id(titleTop);
    var title = iBase.Id(titleId);
    var iTimeSildeW = iTimeSilde.offsetWidth;//幻灯区实际宽度
    var timePoint = document.createElement('ul');//用来存储时间点的ul
    var timePointLeft = null;//时间点相对于父元素左边距离
    var timePointLeftCur = null;//每两个时间点间距
    var pointIndex = 0;//时间点在队列中的索引值
	  var defaultShow = defaultShow || 0;//默认显示的时间
	  var clearFun=null;//当用户无意识的划过时中止执行
	  var that=null;

    	    
    //according to data number to display timeline html
    for (var i = 0; i < dataLen; i++) {
        timePoint.innerHTML += '<li></li>';
    }
    //add timeline to DIV
    timeLine.appendChild(timePoint)
    var timePoints = timeLine.getElementsByTagName('li');
    //display time point
    for (var i = 0; i < timePoints.length; i++) {
		//per two timepoints distance
        timePointLeftCur = parseInt(iTimeSildeW / (dataLen + 1));
		//计算对应时间点左边距
        timePointLeft = (i + 1) * timePointLeftCur;
		//时间点动画形式初始化
        iBase.PointSlide(timePoints[i], timePointLeft);
		//初始显示时间点
        setTimeout(function(){
            timePoints[defaultShow].onmouseover();
        }, 1200);
		//获取时间点默认class值, 为鼠标事件做准备
        timePoints[i].oldClassName = timePoints[i].className;
        timePoints[i].onmouseover = function(){
			that = this;//确保clearFun中的this是当前的this
			//提升用户体验, 当用户无意识地划过时不执行函数
			clearFun=setTimeout(function(){
		        pointIndex = iBase.Index(that, timePoints);
				//计算出当前时间点索引值, 为鼠标划出做准备
				//为当前时间点加载高亮样式
	            iBase.AddClass(that, 'hover');
				//切换日期及标题值
	            date.innerHTML = '<span>' + (months[pointIndex].month || '') + '</span><em></em>';
	            title.innerHTML = '<span>' + (months[pointIndex].year + "." + months[pointIndex].month || '') + '</span>';
	            //改变日期及标题的位置, 此处减去的数字, 可根据实际样式调整
	            date.style.left = ((pointIndex + 1) * timePointLeftCur - 25) + 'px';
	            titletop.style.left = ((pointIndex + 1) * timePointLeftCur + 6) + 'px';
	            //当标题框左边距与标题框宽度之和大于外围宽度时, 以右边为绝对点
	            if ((title.offsetWidth + (pointIndex + 1) * timePointLeftCur) < iTimeSildeW) {
	                title.style.left = ((pointIndex + 1) * timePointLeftCur - timePointLeftCur) + 'px';
	            }else {
	                title.style.left = (iTimeSildeW - title.offsetWidth) + 'px';
	            }
	            //显示日期/时间点/标题
	            date.style.display = 'block';
	            titletop.style.display = 'block';
	            title.style.display = 'block';
			},200);//200为认定无意识划过的时间, 可自行调节
        }
        timePoints[i].onmouseout = function(){
			//若停留时间低于200ms, 认定为无意识划过, 中止函数
			clearTimeout(clearFun);
			//鼠标划出时, 保留最后一个鼠标划过的高亮样式
            for (var m = 0; m < timePoints.length; m++) {
                if (m != pointIndex) {
                    timePoints[m].className = timePoints[m].oldClassName
                }
            }
        }
    }
}
//load this function
window.onload = function(){
    iTimePoint('itimeslide', 'date', 'timeline', 'titletop','title');
}