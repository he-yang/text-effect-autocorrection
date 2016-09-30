 /*
 * Excel-to-JSON
 * docs https://docs.wtsolutions.cn
 * Souce code https://github.com/he-yang/excel-to-json
 *
 * Copyright (c) 2016 He Yang <he.yang @ wtsolutions.cn>
 * Licensed under the MIT license
 */
(function () {
    "use strict"; 
	//----------------------------
	//custom error handerler
	onerror=handleErr
	var txt=""	 
	function handleErr(msg,url,l)
	{
		//prepare error
		txt=msg +'\n'
		//txt+=" URL: " + url +'\n'
		//txt+=" Line: " + l +'<br>'
		//$('#error').html(txt)
		//resume go button
		$("#goButton").text('Go');
		$("#goButton").attr("disabled",false)
		
		//scroll to error
		//var scroll_offset = $("#error").offset();		
		//$("body,html").animate({scrollTop:scroll_offset.top },0);	
		// sweetalert error
		sweetAlert("Oops...", txt, "error");
		/*
		if(window.location.host=="tools.wtsolutions.cn" || window.location.hostname=="127.0.0.1"){
			sweetAlert("Oops...", txt, "error");
		} else {
			cl(txt)
		}*/
				
		return false
	}
	//--------------------------------
	// concat json
	var concat = function(a,b){
		console.log(typeof a)
		console.log(typeof b)
		if($.isArray(a) && $.isArray(b)){
			return $.merge(a,b)
		} else if($.isPlainObject(a) && $.isPlainObject(b)) {
			return $.extend(a,b);
		} else {
			throw Error('Row JSON can only concat with Row JSON, Nested JSON can only concat with Nested JSON')
		}
		
	};
	//------------------------------
	//cl
	var cl=function(a){
		$('#error').append(a+'<br>')
	}
	//-----------------------------------------------
	//start office
    Office.initialize = function (reason)
    {
		
		$(document).ready(function () {
		

			//if(Office.context.requirements.isSetSupported('ExcelApi',1.2)){
				

				console.log('in office')
				//cl(window.location.host)			
				$("#goButton").click(goFunction);				
				// load schema automaticlly
				if(FileReader){
					$("body").on("change","#fileToLoad",importSchemaFunction)
				} else {
					$("#fileToLoad").remove()
				}
							
				
				
				if(! /iPhone|iPad|Mac/i.test(navigator.userAgent)){ //clipboardjs does not support safari && (window.location.host=="tools.wtsolutions.cn" || window.location.hostname=="127.0.0.1")
					$('#jsonOutputBtnDiv').show()
					var clipboard = new Clipboard('#jsonOutputBtn', {
						text: function(trigger) {
							return JSON.stringify(user.json.output);
						}
					});

					clipboard.on('success', function(e) {
						console.info('Action:', e.action);
						console.info('Text:', e.text);
						console.info('Trigger:', e.trigger);
						
						swal({
							title: "Copied", 
							timer: 2000,
							type: "success",
						})

						e.clearSelection();
					});

					clipboard.on('error', function(e) {
						console.error('Action:', e.action);
						console.error('Trigger:', e.trigger);
						throw error('Error when copying JSON to clipboard')
					});
				}
				//filesaver.js 
				try {
					var isFileSaverSupported = !!new Blob;
					$('#jsonSaveasBtn').click(function(){
						saveTextAs(JSON.stringify(user.json.output), "export.json");
					})
				} catch (e) {
					$('#jsonSaveasBtn').remove()
				}
				// rate or donate
				if(localStorage){
					
					if(localStorage.getItem('count')%10==5){
						
						swal({   title: "You like this add-in?",   text: "<a href='https://store.office.com/en-us/app.aspx?assetid=WA104380263' target='_blank'>Rate it</a> or <a href='https://excel-to-json.wtsolutions.cn/en/latest/donate/' target='_blank'>Donate</a>", html: true,  type: "warning",   showCancelButton: true, confirmButtonText: "I've Rated it!"});

						localStorage.setItem('count',Number(localStorage.getItem('count'))+1)
					} else {
						var count=localStorage.getItem('count') || 0
						localStorage.setItem('count',Number(count)+1)
					}
				}


				
				
				

				
						
			//}
			//else{
				
				
			//	$('#error').append('<span class="glyphicon glyphicon-alert"></span>'+ 'This version of Excel is not supported. Please try Excel 2016 or Excel Online.');
			//}
            
            
        });
	
	};  //end office 
	//-----------------------------
	
	//importSchema
	var importSchemaFunction=function(){
		var fileToLoad = document.getElementById("fileToLoad").files[0]; 
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) 
		{
			var textFromFileLoaded = fileLoadedEvent.target.result;
			document.getElementById("scheme").value = textFromFileLoaded;
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
		fileReader.onloadend=function(){
			swal('Schema Loaded')
		}
		fileReader.onerror=function(){
			throw Error('Loading schema error')
		}
		
	}





	//core code
       var user={}
	   user.conversion={}
	   user.options={} 
	 // go function  
		var goFunction=function(){
			
			console.log('in gofunction')
			//prep for start
			$("#goButton").attr("disabled",true)
			$("#goButton").text('Processing')
			$("#error").text("")	
			$('#jsonOutputDiv').hide()
			
			//fill user object
				//conversion options
			user.options.concat= $("#concat").is(":checked")?true:false;
			console.log(user.options.concat)
			user.options.type=$('input[name="conversiontype"]:checked').val()
			if (user.options.type=='nested'){
				if($('#scheme').val().length>0){
					try {
						user.options.scheme=JSON.parse($('#scheme').val().split(/\n|\r/).join(" "))
					} catch(err) {
						console.log(err)
						throw new Error('Schema you provided is not a valid JSON')
					}
					
				} else{
					throw new Error('You must type in or paste json schema for nested json conversion.')
				}
			}
			
				//prep for json			
			user.json=user.json || {};
			user.json.existing= user.options.concat?user.json.output:{};
			user.json.content = []
			console.log('ready to run excel')
			//run excel  
			//Excel.run(function(ctx){
			//	var sheet= ctx.workbook.worksheets.getActiveWorksheet();
			//	var rangeUR=sheet.getUsedRange();
			
			// Use Office for selected data collection instead of Excel.run
			Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix, function (asyncResult) {
				if (asyncResult.status == Office.AsyncResultStatus.Failed) {
					throw new Error('Reading selected data failed. Error: ' + asyncResult.error.message);
				}
				else {
					//rangeUR.load('values')
					//return ctx.sync().then(function(){
						
						console.log(asyncResult.value)
						if (asyncResult.value.length<2){throw new Error('You must select at least two rows as the first row will be considered as header.')}
						user.values=asyncResult.value
						user.json.output=user.conversion[user.options.type](user.values,user.options)
						user.options.concat && (user.json.output = concat(user.json.existing,user.json.output))
						$('#json-renderer').jsonViewer(user.json.output);
						$('#jsonOutputDiv').show()
						
						//resume go button
						$("#goButton").text('Go');
						$("#goButton").attr("disabled",false)
						
					//})
				}
					
			})
			/*
			.catch(function (error) {
				  console.log('Error: ' + JSON.stringify(error));
				  $("#error").append('Error: ' + JSON.stringify(error))
				  if (error instanceof OfficeExtension.Error) {
					  console.log('Debug info: ' + JSON.stringify(error.debugInfo));
					  $("#error").append('Debug info: ' + JSON.stringify(error.debugInfo))
				  }
			  });
			  */
		}//end gofunction
		//---------------------------
		
				
		
		
		user.conversion.nested=function(values,options){
			var json= user.conversion.row(values)
			console.log('before shape')
			try{
				user.json.content=shape.parse(json, user.options.scheme)
			}
			catch(err){
				throw new Error('Check schema you provided')
			}
			console.log('after shape')
			return user.json.content
			
		}
		
		
		user.conversion.row=function(values,options){			
			user.json.header=values[0]
			for (var i=1;i<values.length;i++){
				user.json.content[i-1]={}
				for (var j=0;j<values[i].length;j++){
					if (typeof values[i][j] =='string'){
						user.json.content[i-1][user.json.header[j]]=values[i][j].replace(/\n/g,'<br>')
					} else {
						user.json.content[i-1][user.json.header[j]]=values[i][j]
					}
					
				}
			}
			return user.json.content		
		}
		
		
		
	
})();

