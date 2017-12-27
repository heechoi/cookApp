	//요리과정을 추가할때
	function detailContent(){
	
		$("#detailAdd").click(function(){
			var img = "<div class='detailImg'></div>";
			var removebtn ="<div class='removebtn'><input type='button' data-icon='minus' data-iconpos='notext' class='remove'></div>";
			var text = "<textarea rows='2' cols='10'></textarea>";
			
			$list = $("<div>").addClass("addlist").append(img).append(text).append(removebtn);
			
 			
 			$("#detaillist").append($list);
			$list.find("input").button().button("refresh");
			$list.find("textarea").textinput().textinput("refresh");
			$list.find("a").button().button("refresh");
			
		})
		
	
	}
	//요리 상세 과정내용을 삭제하고 싶을때
	function removebtn(){
		$(document).on("click",".remove",function(){
			$(this).parent("div").parent("div").parent("div").remove();
		})
	}
	
	var myFS=null;
	var filename =null;
	//카메라
	function takePicture(){
		$("#camera").click(function(){
			navigator.camera.getPicture(onPhotoData,onFail,{quality:50,destinationType:Camera.DestinationType.FILE_URL,allowEdit: true});
		});
	}

	function onFail(message){
		alert("Failed : "+message);
	}
	function onDeviceReady(){
		resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(fs){
			myFS =  fs;
		},onFail);
	}
	function onDownloadSuccess(fe){
		var filename = fe.toURL();
	}
	function onPhotoData(imageData){ //성공했을때 호출함수
		var url=imageData;
		filename = url.split("/")[url.split("/").length-1];
		
		myFS.getFile(filename,{create:true,exclusive:false},
				function(fe){
			var fileTransfer = new FileTransfer();//파일을 다운받게 해줌
			fileTransfer.download(url,"/mnt/sdcard/recipeTitleImg/"+filename,onDownloadSuccess,onFail);
		},onFail);
		
		$img = $("<img>").attr("src",imageData);
	
		
		$("#popupmenu").css({"display":"none"});
		$("#titleImgAdd").css({"display":"none"});
		$("#titleImg").append($img);
	}
	//앨범
	function getAlbumImage(){
		$("#album").click(function(){
			navigator.camera.getPicture(onGalleryImage,onFail,{quality:50,destinationType:Camera.DestinationType.FILE_URI,sourceType:Camera.PictureSourceType.PHOTOLIBRARY,allowEdit: true});
		});
		
	}
	function onGalleryImage(imageURI){
		alert(imageURI);
		$img = $("<img>").attr("src",imageURI);
		$("#popupmenu").css({"display":"none"});
		$("#titleImgAdd").css({"display":"none"});
		$("#titleImg").append($img);
	}

	//DataBase
	var db=null;
	function openDB(){
		db = window.openDatabase("recipe","1.0","레시피","1024*1024");
	}
	
	function createDB(){
		db.transaction(function(tr){
			var createSql1 = "create table if not exists recipeTitle(id integer primary key autoincrement,photo text ,title text, level integer,time text, day text, mark integer default 0)";
			var createSql2 = "create table if not exists recipeContent(title text, detail text,content text)";
			tr.executeSql(createSql1);
			tr.executeSql(createSql2);
		})
	}
	function dropTable(){
		db.transaction(function(tr){
			var droptable = "drop table recipeTitle";
			tr.executeSql(droptable);
		})
	}
	//recipe title database insert
	function insertDB(){
		var nowDate = new Date();
		var title= $("#cookname").val();
		var level = $("#level").val();
		var time =$("#timevalue").val();
		var day = nowDate.toLocaleDateString();
		var photo = filename;
		
		db.transaction(function(tr){
			var insertSql ="insert into recipeTitle(photo,title,level,time,day) values(?,?,?,?,?)";
			//공백처리
			if(title==""||time==""){
				alert("공백이 존재합니다.");
				return;
			}
			//insert문 실행
			tr.executeSql(insertSql,[photo,title,level,time,day],function(tr,ts){
				alert("insert success");
			},function(tr,err){
				alert("insert fail");
			})
		})
	}