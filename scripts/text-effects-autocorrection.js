 /*
 * text-effect-autocorrection
 * Help https://help.wtsolutions.cn
 * Souce code https://github.com/he-yang/text-effect-autocorrection
 *
 * Copyright (c) 2016 He Yang <he.yang @ wtsolutions.cn>
 * Licensed under the MIT license
 */
(function () {
    "use strict"; 
	//----------------------------
	//define my own error alert system
	onerror=handleErr
	var txt=""	 
	function handleErr(msg,url,l)
	{
		//write error
		txt+=" Error: " + msg 
		txt+=" URL: " + url 
		txt+=" Line: " + l +'<br>'
		$('#error').html(txt)
		//resume go button
		$("#goButton").text(UIText.form.goButton);
		$("#goButton").attr("disabled",false)
		// alert error
		$.notify( "Error",  { position: 'left middle'});
		//scroll to error
		var scroll_offset = $("#error").offset();		
		$("body,html").animate({scrollTop:scroll_offset.top },0);		
		return false
	}
	//
	//----------------------------
	// get query string
	function GetQueryString(name) {  
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
		var r = window.location.search.substr(1).match(reg);  
		var context = "";  
		if (r != null)  
			 context = r[2];  
		reg = null;  
		r = null;  
		return context == null || context == "" || context == "undefined" ? "" : context;  
	}
	//----------------------------
	// get _host_Info
	//
	var host_info=GetQueryString('_host_Info').split('|')
	//
	//-----------------------------	
	//define json database schema
	var dbSchema={
		type:"object",
		required:["userProvided"],
		additionalProperties:false,
		properties:{
			userProvided:{
				type:"array",
				minItems:1,
				uniqueItems:true,
				additionalItems:false,
				items:{
					type:"object",
					required:["s1","s1Opt","to"],
					properties:{
						s1:{type:"string"},
						s1Opt:{
							type:"object",
							properties:{
								ignorePunct:{type:"boolean"},
								ignoreSpace:{type:"boolean"},
								matchCase:{type:"boolean"},
								matchPrefix:{type:"boolean"},
								matchSoundsLike:{type:"boolean"},
								matchSuffix:{type:"boolean"},
								matchWholeWord:{type:"boolean"},
								matchWildCards:{type:"boolean"}
							},
							additionalProperties:false
						},
						s2:{type:"string"},
						s2Opt:{
							type:"object",
							properties:{
								ignorePunct:{type:"boolean"},
								ignoreSpace:{type:"boolean"},
								matchCase:{type:"boolean"},
								matchPrefix:{type:"boolean"},
								matchSoundsLike:{type:"boolean"},
								matchSuffix:{type:"boolean"},
								matchWholeWord:{type:"boolean"},
								matchWildCards:{type:"boolean"}
							},
							additionalProperties:false
						},
						to:{type:"string"}
					},
					additionalProperties:false
				}
			}
		}
			
	}
	//end defining json validation schema
	//----------------------------------------------------------
	//UIStrings definitions
	var UIStrings = (function ()
	{
		var UIStrings = {};
		UIStrings.EN =
		{        
			"header": "Text Effects Autocorrection",
			"whyUse": "Text effects autocorrection can correct sub/super scripts, upper/lower case typos using built-in/user-defined databases. Corrected typos will be highlighted in pink. Visit https://help.wtsolutions.cn for more.",
			"instructions":"You can also define/provide your own database. More help can be found ",			
			"notSupported":"Word 2013 or Word Online NOT supported.This add-in requires Word 2016 or greater.",
			"form":{
				"fieldset":"Please select databases of your interests",
				"checkbox": {
					"standard":"Standard",
					"unit":"Units",
					"chemical":"Chemical",
					"water":"Water and Wastewater",
					"userDefined":"User Defined",
					"userProvided":"User Provided"
				},
				"goButton": "GO",
				"notValid":" s1,s1Opt,to are mandatory fields \n Help can be found at https://help.wtsolutions.cn",
				"entryAdded":"One entry added",
				"processing":"Processing",
				"processed":"Process Completed",
				"invalidJSON":"Invalid User Provided Database",
				"nothingProvided":"No database provided"
			},			
			"footer": "Copyright(C) 2016 He Yang"
		};
		UIStrings.CN =
		{        
			"header": "文字效果自动纠正",
			"whyUse": "根据现有数据库自动修正文本中字母大小写、上下标等文字效果错误，修正的部分将以粉红色突出显示。更多帮助请查看https://help.wtsolutions.cn",
			"instructions":"你可以自定义/提供数据库，如需帮助，可查看",
			"notSupported":"本插件不支持Word2013和Word Online，只支持Word2016或更高级版本",
			"form":{
				"fieldset":"请选择感兴趣的数据库",
				"checkbox": {
					"standard":"常用库",
					"unit":"单位",
					"chemical":"化学",
					"water":"给排水",
					"userDefined":"用户自定义",
					"userProvided":"用户提供"
				},
				"goButton": "开始",
				"notValid":"s1,s1Opt,to为必填项 \n 更多帮助请查看 https://help.wtsolutions.cn",
				"processing":"正在处理",
				"processed":"完成",
				"invalidJSON":"用户提供数据库无效",
				"nothingProvided":"用户未提供数据库文件"
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
				case 'ZH-CN':
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
	// end UI String definitions
	//--------------------------
	//
	var UIText
	
	//userDefinedDatabase
	//---------------------------
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
	
	function exportEntriesFunction(){
		var userDefinedDatabaseJSON={}
		
		userDefinedDatabaseJSON["userDefined"]=userDefinedDatabase
		$("#exportEntriesDiv").text(JSON.stringify(userDefinedDatabaseJSON))
		
		var scroll_offset = $("#exportEntriesDiv").offset();		
		$("body,html").animate({scrollTop:scroll_offset.top },0);
	}
	
	function cancelExportEntriesFunction(){
		$("#exportEntriesDiv").text("")
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
	}
	
	// end userDefinedDatabase
	//---------------------
    Office.initialize = function (reason)
    {
		
		$(document).ready(function () {
		//Language 
		var myLanguage = Office.context.displayLanguage ||'en-US';  		
		//Language
		UIText= UIStrings.getLocaleStrings(myLanguage);  
		$("#header").text(UIText.header);
		$("#whyUse").text(UIText.whyUse);
		$("#instructions").prepend(UIText.instructions);	
		// Use this to check whether the API is supported in the Word client.
			if(Office.context.requirements.isSetSupported('WordApi',1.1) && host_info[1]!='Web' ){
					// Set localized text for UI elements.
				
				$("fieldset span").text(UIText.form.fieldset);
				$("#goButton").text(UIText.form.goButton);
				$("#footer").prepend(UIText.footer);
				$('#addEntryButton').click(addEntryFunction)
				$('#deleteLastEntryButton').click(deleteLastEntryFunction)
				$('#exportEntriesButton').click(exportEntriesFunction)
				$('#cancelExportEntriesButton').click(cancelExportEntriesFunction)
				
				//
				for (var e in UIText.form.checkbox){
				
					if (e=="userDefined"){
						$("#userDefinedDiv").before('<input type="Checkbox" name="databases" value="'+e+'">'+UIText.form.checkbox[e]+'</input>');
					} else if (e=="userProvided"){
						$("#userProvidedDiv").before('<br><input type="Checkbox" name="databases" value="'+e+'">'+UIText.form.checkbox[e]+'</input>');
					} else {
						$("#builtInDiv").append('<br><input type="Checkbox" name="databases" value="'+e+'">'+UIText.form.checkbox[e]+'</input>');
					}
					
					
					
				}
				
				//UserDefined checkbox checked
				$("input[value='userDefined']").change(function(){
					
					
					if ($(this).is(':checked')) {
					
						$("#userDefinedDiv").show()
					} else {
					
						$("#userDefinedDiv").hide()
					}
				})
				//UserProvided checkbox checked
				$("input[value='userProvided']").change(function(){
					if($(this).is(':checked')) {
						$('#userProvidedDiv').show()
					} else {
						$('#userProvidedDiv').hide()
					}
					
				})
				//userDefined select disable enable
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
		
	};  //end office .initialize 
	//-----------------------------
	
	
       
        

	
		var goFunction=function(){
			$("#goButton").attr("disabled",true)
			$("#goButton").text(UIText.form.processing)
			$("#error").text("")
			var checkedDbs=[]
			var searchResults=[]
			var searchResults2=[]
			var dbs=[]
			var objs2=[]
			
			$("[name='databases']").each(function(){
				if($(this).is(':checked')){
					//handle userDefined
					if ($(this).val()=='userDefined'){
						var db=userDefinedDatabase	
					
					//handle userprovided
					} else if($(this).val()=='userProvided'){
						
						try{
							if($("#userProvidedTextarea").val().length>0){
								var userProvided= JSON.parse($("#userProvidedTextarea").val())
							}
							else {
								$.notify( UIText.form.nothingProvided,  { position: 'left middle', className: 'success'});
								throw ('nothing provided')//////////////////////////////
							}
							
						}
						catch (err){	
							throw ('Invalid user provided database')	/////////////////////////////////////////////////////////
						}
						var dbValidate = jsen(dbSchema);						
						if (dbValidate(userProvided)==false){ throw (JSON.stringify(dbValidate.errors)) }
						var db=userProvided.userProvided
					
					
					} else {
						var db=databases[$(this).val()]	
					}
								
					checkedDbs.push($(this).val())
					$.merge(dbs,db)
					
				}
			})
			//remove duplicate entries
			dbs=$.unique(dbs)
			
			//----------------------------------------
			//Word Run
			//
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
							$.notify( UIText.form.processed,  { position: 'left middle', className: 'success'});
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

