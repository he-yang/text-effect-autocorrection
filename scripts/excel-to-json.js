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
		txt=" Error: " + msg +'\n'
		//txt+=" URL: " + url +'\n'
		//txt+=" Line: " + l +'<br>'
		$('#error').html(txt)
		//resume go button
		$("#goButton").text('Go');
		$("#goButton").attr("disabled",false)
		// alert error
		$.notify( txt,  { position: 'left middle'});
		//scroll to error
		var scroll_offset = $("#error").offset();		
		$("body,html").animate({scrollTop:scroll_offset.top },0);		
		return false
	}
	//
	
	
	//-----------------------------------------------
	//start office
    Office.initialize = function (reason)
    {
		
		$(document).ready(function () {
		

			//if(Office.context.requirements.isSetSupported('ExcelApi',1.2)){
				

				console.log('in office')			
				$("#goButton").click(goFunction);
						
			//}
			//else{
				
				
			//	$('#error').append('<span class="glyphicon glyphicon-alert"></span>'+ 'This version of Excel is not supported. Please try Excel 2016 or Excel Online.');
			//}
            
            
        });
	
	};  //end office 
	//-----------------------------
	
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
			$('#json-renderer').hide()
			
			//fill user object
				//conversion options
			
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
			user.json={}
			user.json.content=[]
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
						user.values=asyncResult.value
						user.json.output=user.conversion[user.options.type](user.values,user.options)
						$('#json-renderer').jsonViewer(user.json.output);
						$('#json-renderer').show()
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
					user.json.content[i-1][user.json.header[j]]=values[i][j]
				}
			}
			return user.json.content		
		}
		
		
		
	
})();

