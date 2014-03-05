function iTimePoint(iTimeSlideId, dateId, timeLineId, titleTop, titleId, defaultShow){
    /* variables details:
     * iTimeSlideId: ��ΧID��. ������DOM��#itimeslide;
     * dateId: the date ID;
     * timeLineId: ʱ���ֲ�ID��. ������DOM��#timeline;
     * titleTop: ���������Ϸ�С����ID��. ������DOM��#titletop;
     * titleId: ��������ID��. ������DOM��#title;
     * defaultShow: �趨��ʼ��ʾ��ʱ���, Ĭ��Ϊ0, �ɲ���ֵ
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
    var iTimeSildeW = iTimeSilde.offsetWidth;//�õ���ʵ�ʿ��
    var timePoint = document.createElement('ul');//�����洢ʱ����ul
    var timePointLeft = null;//ʱ�������ڸ�Ԫ����߾���
    var timePointLeftCur = null;//ÿ����ʱ�����
    var pointIndex = 0;//ʱ����ڶ����е�����ֵ
	  var defaultShow = defaultShow || 0;//Ĭ����ʾ��ʱ��
	  var clearFun=null;//���û�����ʶ�Ļ���ʱ��ִֹ��
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
		//�����Ӧʱ�����߾�
        timePointLeft = (i + 1) * timePointLeftCur;
		//ʱ��㶯����ʽ��ʼ��
        iBase.PointSlide(timePoints[i], timePointLeft);
		//��ʼ��ʾʱ���
        setTimeout(function(){
            timePoints[defaultShow].onmouseover();
        }, 1200);
		//��ȡʱ���Ĭ��classֵ, Ϊ����¼���׼��
        timePoints[i].oldClassName = timePoints[i].className;
        timePoints[i].onmouseover = function(){
			that = this;//ȷ��clearFun�е�this�ǵ�ǰ��this
			//�����û�����, ���û�����ʶ�ػ���ʱ��ִ�к���
			clearFun=setTimeout(function(){
		        pointIndex = iBase.Index(that, timePoints);
				//�������ǰʱ�������ֵ, Ϊ��껮����׼��
				//Ϊ��ǰʱ�����ظ�����ʽ
	            iBase.AddClass(that, 'hover');
				//�л����ڼ�����ֵ
	            date.innerHTML = '<span>' + (months[pointIndex].month || '') + '</span><em></em>';
	            title.innerHTML = '<span>' + (months[pointIndex].year + "." + months[pointIndex].month || '') + '</span>';
	            //�ı����ڼ������λ��, �˴���ȥ������, �ɸ���ʵ����ʽ����
	            date.style.left = ((pointIndex + 1) * timePointLeftCur - 25) + 'px';
	            titletop.style.left = ((pointIndex + 1) * timePointLeftCur + 6) + 'px';
	            //���������߾���������֮�ʹ�����Χ���ʱ, ���ұ�Ϊ���Ե�
	            if ((title.offsetWidth + (pointIndex + 1) * timePointLeftCur) < iTimeSildeW) {
	                title.style.left = ((pointIndex + 1) * timePointLeftCur - timePointLeftCur) + 'px';
	            }else {
	                title.style.left = (iTimeSildeW - title.offsetWidth) + 'px';
	            }
	            //��ʾ����/ʱ���/����
	            date.style.display = 'block';
	            titletop.style.display = 'block';
	            title.style.display = 'block';
			},200);//200Ϊ�϶�����ʶ������ʱ��, �����е���
        }
        timePoints[i].onmouseout = function(){
			//��ͣ��ʱ�����200ms, �϶�Ϊ����ʶ����, ��ֹ����
			clearTimeout(clearFun);
			//��껮��ʱ, �������һ����껮���ĸ�����ʽ
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