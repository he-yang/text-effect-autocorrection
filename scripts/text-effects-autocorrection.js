(function () {
    "use strict"; 
	var UIStrings = (function ()
	{
		"use strict";
		var UIStrings = {};
		UIStrings.EN =
		{        
			"header": "Text Effect Autocorrection",
			"whyUse": "Text effct autocorrection can correct sub/super scripts, upper/lower case typos",
			"instructions":"You can also define your own database. More help can be found ",
			"form":{
				"fieldset":"Please select databases of your interests",
				"checkbox": {
					"water":"water and wastewater engineering"
				},
				"goButton": "GO",
				"processing":"Processing",
				"processed":"Process Completed"
			},			
			"footer": "released under MIT lisence|Copyright(C)2015 He Yang|he.yang at WTSolutions.cn"
		};
		UIStrings.CN =
		{        
			"header": "文字效果自动纠正",
			"whyUse": "自动修正文本中字母大小写、上下标等文字效果错误",
			"instructions":"如需自定义数据库或需更多帮助，可查看",
			"form":{
				"fieldset":"请选择感兴趣的数据库",
				"checkbox": {
					"water":"给排水工程"
				},
				"goButton": "开始",
				"processing":"正在处理",
				"processed":"完成"
			},	
			"footer": "MIT版权协议|Copyright(C)2016 He Yang|He.Yang at WTSolutions.cn"
		};
		UIStrings.getLocaleStrings = function (locale)
		{
			var text; 
			switch (locale)
			{
				case 'zh-CN':
					text = UIStrings.CN;
					break;
				default:
					text = UIStrings.EN;
					break;
			}
			return text;
		};
		return UIStrings;
	})();

	var UIText
    Office.initialize = function (reason)
    {
       
        $(document).ready(function () {
            var myLanguage = Office.context.displayLanguage || 'en-US';            
            UIText= UIStrings.getLocaleStrings(myLanguage);            

            // Set localized text for UI elements.
            $("#header").text(UIText.header);
            $("#whyUse").text(UIText.whyUse);
			$("#instructions").prepend(UIText.instructions);
            $("fieldset span").text(UIText.form.fieldset);
			$("#goButton").text(UIText.form.goButton);
			$("#footer").text(UIText.footer);
			
			//
			for (var e in UIText.form.checkbox){
				$("fieldset").append('<br><input type="Checkbox" name="databases" value="'+e+'">'+UIText.form.checkbox[e]+'</input>');
			}
			
			//
			$("#goButton").click(goFunction);
            
        });
    };   
	
	var goFunction=function(){
		$("#goButton").attr("disabled",true)
		$("#goButton").text(UIText.form.processing)
		var checkedDbs=[]
		var searchResults=[]
		var searchResults2=[]
		var dbs=[]
		var objs2=[]
		$("[name='databases']").each(function(){
			if($(this).is(':checked')){
				var db=databases[$(this).val()]
				//console.log($(this).val())
				checkedDbs.push($(this).val())
				$.merge(dbs,db)
				//for (var e in database){
				//	console.log(e)
				//	SearchnReplace(database[e])
				//}
				
			}
		})
		dbs=$.unique(dbs)
		//console.log(checkedDbs)
		//console.log(databases['water'])
		
		Word.run(function(ctx){
			var range=ctx.document.body
			//for (var db in checkedDbs){
			
				
				
				for (var i=0; i<dbs.length; i++){
					console.log('i'+String(i))
					console.log(dbs[i]["s1"])
					//if (!dbs[i]["s2"]){
						
						searchResults.push(range.search(dbs[i]["s1"],dbs[i]["s1Opt"]))
						//ctx.load(searchResults[i],'text,font')
						//console.log('about to sync')
						/*ctx.sync().then(function(){
						
							console.log("ii"+String(i))
							for (var j=0;j<searchResults[i].items.length;j++){
							console.log(j+String(j))
							console.log(searchResults[i].items[j].text!=dbs[i]["to"])
								if(searchResults[i].items[j].text!=dbs[i]["to"]){
									searchResults[i].items[j].font.highlightColor="pink"
									searchResults[i].items[j].insertText(dbs[i]["to"], 'Replace');
								}								
							}
						})*/
					//} else {
						
						//searchResults.push(range.search(dbs[i]["s1"],{ matchWildCards: true }))
						//ctx.load(searchResults[i],'text,font')
						/*ctx.sync().then(function(){
							for (var j=0;j<searchResults[i].items.length;j++){
								searchResults2.push(searchResults[i].item[j].search(dbs[i]["s2"],{ matchWildCards: true }))
								ctx.load(searchResults2[j],'text,font')								
							}
							ctx.sync().then(function(){
								for (var k=0;k<searchResults2.length;k++){
									
									if (searchResults2[k].items.length > 0 && searchResults2[k].items[0].font) {
										if(searchResults2[k].items[0].font[dbs[i]["to"]] != true){
											searchResults2[k].items[0].font[dbs[i]["to"]] = true;
											searchResults2[k].items[0].font.highlightColor = 'yellow';
										}
									}
								}
								ctx.sync()
								
							})
						})*/
					
					
					//}
					ctx.load(searchResults[i],'text,font')
					
				}
				return ctx.sync().then(function(){
					for (var i=0; i<dbs.length; i++){
						for (var j=0;j<searchResults[i].items.length;j++){
							if (!dbs[i]["s2"]){
								if(searchResults[i].items[j].text!=dbs[i]["to"]){
									searchResults[i].items[j].font.highlightColor="pink"
									searchResults[i].items[j].insertText(dbs[i]["to"], 'Replace');
								}	
							}else{
								searchResults2.push(searchResults[i].items[j].search(dbs[i]["s2"],dbs[i]["s2Opt"]))
								objs2.push(dbs[i])
							}
						}
					}
					
					for (var k=0;k<searchResults2.length;k++){
						ctx.load(searchResults2[k],'text,font')
					}
					return ctx.sync().then(function(){
					console.log('last cync')
					
						for (var k=0;k<searchResults2.length;k++){
							if (searchResults2[k].items.length > 0 && searchResults2[k].items[0].font) {
								console.log(objs2[k]["to"])
								if(objs2[k].to=="superscript" || objs2[k].to=="subscript"){
									if(searchResults2[k].items[0].font[objs2[k]["to"]] != true){
										searchResults2[k].items[0].font.highlightColor = 'yellow';
										searchResults2[k].items[0].font[objs2[k]["to"]] = true;									
									}								
								} else {								
									searchResults2[k].items[0].font.highlightColor='green';
									searchResults2[k].items[0].insertText(objs2[k]["to"], 'Replace');
								}
							
								
							}
						}
						//almost end
						
						$("#goButton").text(UIText.form.goButton);
						$("#goButton").attr("disabled",false)
						return ctx.sync()
						
					})
				})	
			//})
			//}
			
			
		//return ctx.sync()
		
		
		}).catch(function (error) {
              console.log('Error: ' + JSON.stringify(error));
              if (error instanceof OfficeExtension.Error) {
                  console.log('Debug info: ' + JSON.stringify(error.debugInfo));
              }
          });
		


		
	}
	
	
	
	
})();

