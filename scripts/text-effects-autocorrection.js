
(function () {
    "use strict"; 
	
	//UIStrings 
	var UIStrings = (function ()
	{
		var UIStrings = {};
		UIStrings.EN =
		{        
			"header": "Text Effects Autocorrection",
			"whyUse": "Text effects autocorrection can correct sub/super scripts, upper/lower case typos using built databases. Corrected typos will be highlighted in pink",
			"instructions":"You can also define your own database. More help can be found ",			
			"notSupported":"NOT supported.This add-in requires Word 2016 or greater.",
			"form":{
				"fieldset":"Please select databases of your interests",
				"checkbox": {
					"standard":"Standard",
					"unit":"Units",
					"chemical":"Chemical",
					"water":"Water and Wastewater",
					"userDefined":"User Defined"	
				},
				"goButton": "GO",
				"notValid":" s1,s1Opt,to are mandatory fields \n Help can be found at http://g.wtsolutions.cn",
				"entryAdded":"One entry added",
				"processing":"Processing",
				"processed":"Process Completed"
			},			
			"footer": "Copyright(C) 2016 He Yang"
		};
		UIStrings.CN =
		{        
			"header": "文字效果自动纠正",
			"whyUse": "根据现有数据库自动修正文本中字母大小写、上下标等文字效果错误，修正的部分将以粉红色突出显示。",
			"instructions":"你可以自定义数据库，如需帮助，可查看",
			"notSupported":"本插件不支持当前版本，只支持Word2016或更高级版本",
			"form":{
				"fieldset":"请选择感兴趣的数据库",
				"checkbox": {
					"standard":"常用库",
					"unit":"单位",
					"chemical":"化学",
					"water":"给排水",
					"userDefined":"用户自定义"
				},
				"goButton": "开始",
				"notValid":"s1,s1Opt,to为必填项 \n 更多帮助请查看 http://g.wtsolutions.cn",
				"processing":"正在处理",
				"processed":"完成"
			},	
			"footer": "Copyright(C) 2016 He Yang"
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
	
	//userDefinedDatabase related	---------------------------------------------------------------------------------
	
	var userDefinedDatabase=[]
	function addEntryFunction(){
		
		var entry={}
		if( $('#s1').val() && $('#s2').val() && $('#to').val() ){
			entry["s1"]=$('#s1').val()
			entry["s1Opt"]=JSON.parse('{'+$('#s1Opt').val()+'}')
			entry["s2"]=$('#s2').val()
			entry["s2Opt"]=JSON.parse('{'+$('#s2Opt').val()+'}')
			entry["to"]=$('#to').val()
			userDefinedDatabase.push(entry)
			
		}
		else if ( $('#s1').val() && $('#to').val() ){
			entry["s1"]=$('#s1').val()
			entry["s1Opt"]=JSON.parse('{'+$('#s1Opt').val()+'}')
			entry["to"]=$('#to').val()
			userDefinedDatabase.push(entry)
			
		}
		else{
			$.notify(
			  UIText.form.notValid, 
			  { position: 'left middle', }
			);
		}
		displayArray()
	}

	function deleteLastEntryFunction(){
		userDefinedDatabase.pop()
		displayArray()
	}

	function displayArray(){
		var html=''
		for (var x in userDefinedDatabase){
			html+='<li>'+JSON.stringify(userDefinedDatabase[x])+'</li>'
		}
		$('#userDefinedDatabase').html('<ol>'+html+'</ol>')
	}
	function textareaChangeFunction(){
		userDefinedDatabase=JSON.parse($('#userDefinedDatabase').val())
		console.log(userDefinedDatabase)
		console.log(typeof userDefinedDatabase)
	}
	
	
    Office.initialize = function (reason)
    {
	
	 
		
		$(document).ready(function () {
		var myLanguage = Office.context.displayLanguage || 'en-US';  
		UIText= UIStrings.getLocaleStrings(myLanguage);  
		$("#header").text(UIText.header);
		$("#whyUse").text(UIText.whyUse);
		$("#instructions").prepend(UIText.instructions);	
		// Use this to check whether the API is supported in the Word client.
			if(Office.context.requirements.isSetSupported('WordApi',1.1)){
					// Set localized text for UI elements.
				
				$("fieldset span").text(UIText.form.fieldset);
				$("#goButton").text(UIText.form.goButton);
				$("#footer").prepend(UIText.footer);
				$('#addEntryButton').click(addEntryFunction)
				$('#deleteLastEntryButton').click(deleteLastEntryFunction)
				
				//
				for (var e in UIText.form.checkbox){
					
					$("#builtInDiv").append('<br><input type="Checkbox" name="databases" value="'+e+'">'+UIText.form.checkbox[e]+'</input>');
					
					
				}
				
				//
				$("input[value='userDefined']").change(function(){
					console.log('in')
					console.log($(this))
					if ($(this).is(':checked')) {
					console.log('true')
						$("#userDefinedDiv").show()
					} else {
					console.log('false')
						$("#userDefinedDiv").hide()
					}
				})
				
				
				$('select').change(function() {
				  var $options = $(this).children()
				  if ($options.filter('.no-match').is(':selected')) {
					$options.filter('.match').prop('selected', false).prop('disabled', true)
				  } else {
					$options.filter('.match').prop('disabled', false)
				  }
				});
				
				
				$("#goButton").click(goFunction);				
			}
			else{
				// Just letting you know that this code will not work with your version of Word.
				
				$('#error').append('<span class="glyphicon glyphicon-alert"></span>'+UIText.notSupported);
			}
            
            
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
				if ($(this).val()=='userDefined'){
					var db=userDefinedDatabase	
				} else {
					var db=databases[$(this).val()]	
				}
							
				checkedDbs.push($(this).val())
				$.merge(dbs,db)
				
			}
		})
		dbs=$.unique(dbs)
		
		
		Word.run(function(ctx){
			var range=ctx.document.body
			
			
				
				
				for (var i=0; i<dbs.length; i++){
					console.log('i'+String(i))
					console.log(dbs[i]["s1"])
					searchResults.push(range.search(dbs[i]["s1"],dbs[i]["s1Opt"]))
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
					
						for (var k=0;k<searchResults2.length;k++){
							if (searchResults2[k].items.length > 0 && searchResults2[k].items[0].font) {
								console.log(objs2[k]["to"])
								if(objs2[k].to=="superscript" || objs2[k].to=="subscript"){
									if(searchResults2[k].items[0].font[objs2[k]["to"]] != true){
										searchResults2[k].items[0].font.highlightColor = 'pink';
										searchResults2[k].items[0].font[objs2[k]["to"]] = true;									
									}								
								} else {					
									if(objs2[k]["to"]!=searchResults2[k].items[0].text){
										searchResults2[k].items[0].font.highlightColor='pink';
										searchResults2[k].items[0].insertText(objs2[k]["to"], 'Replace');
									}
									
								}
							
								
							}
						}
						//almost end
						
						$("#goButton").text(UIText.form.goButton);
						$("#goButton").attr("disabled",false)
						$.notify(
						  UIText.form.processed, 
						  { position: 'left middle', className: 'success'}
						);
						return ctx.sync()
						
					})
				})	
			
			
			
		
		
		
		}).catch(function (error) {
              console.log('Error: ' + JSON.stringify(error));
			  $("#error").append('Error: ' + JSON.stringify(error))
              if (error instanceof OfficeExtension.Error) {
                  console.log('Debug info: ' + JSON.stringify(error.debugInfo));
				  $("#error").append('Debug info: ' + JSON.stringify(error.debugInfo))
              }
          });
		


		
	}
	
	
	
	
})();

