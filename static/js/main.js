class LogonName{
	constructor(row,logonName,verified){
		this.row=row;
		this.logonName=logonName;
		this.verified=verified;
	}
}

$(function() {

	'use strict';

	// Form

	var contactForm = function() {

		if ($('#contactForm').length > 0 ) {
			$( "#contactForm" ).validate( {
				rules: {
					name: "required",
					email: {
						required: true,
						email: true
					},
					message: {
						required: true,
						minlength: 5
					}
				},
				messages: {
					name: "Please enter your name",
					email: "Please enter a valid email address",
					message: "Please enter a message"
				},
				/* submit via ajax */
				submitHandler: function(form) {		
					var $submit = $('.submitting'),
						waitText = 'Submitting...';

					$.ajax({   	
				      type: "POST",
				      url: "php/send-email.php",
				      data: $(form).serialize(),

				      beforeSend: function() { 
				      	$submit.css('display', 'block').text(waitText);
				      },
				      success: function(msg) {
		               if (msg == 'OK') {
		               	$('#form-message-warning').hide();
				            setTimeout(function(){
		               		$('#contactForm').fadeOut();
		               	}, 1000);
				            setTimeout(function(){
				               $('#form-message-success').fadeIn();   
		               	}, 1400);
			               
			            } else {
			               $('#form-message-warning').html(msg);
				            $('#form-message-warning').fadeIn();
				            $submit.css('display', 'none');
			            }
				      },
				      error: function() {
				      	$('#form-message-warning').html("Something went wrong. Please try again.");
				         $('#form-message-warning').fadeIn();
				         $submit.css('display', 'none');
				      }
			      });    		
		  		}
				
			} );
		}
	};
	contactForm();

});


var counter=2;
   

   function addrow(){
    
    var usercln1 = document.getElementById("user-1").cloneNode(true);
    var usercln2 = document.getElementById("user-2").cloneNode(true);
    var usercln3 = document.getElementById("user-3").cloneNode(true);
    usercln1.setAttribute("id", "cloneuser1")
    usercln2.setAttribute("id", "cloneuser2")
    usercln3.setAttribute("id", "cloneuser3")
    usercln1.getElementsByTagName("input")[0].name= "name"+counter
    usercln1.getElementsByTagName("input")[1].name= "email"+counter
    usercln2.getElementsByTagName("input")[0].name= "logon-name"+counter
    usercln2.getElementsByTagName("input")[1].name= "password"+counter
    
    document.getElementById("row22").appendChild(usercln1);
    document.getElementById("row22").appendChild(usercln2);
    document.getElementById("row22").appendChild(usercln3);
   }
   function removerow(){
     if(counter>2){
      counter--
     }
     var col1 = document.getElementById("cloneuser1");
     var col2 = document.getElementById("cloneuser2");
     var col3 = document.getElementById("cloneuser3");
     document.getElementById("row22").removeChild(col1)
     document.getElementById("row22").removeChild(col2)
     document.getElementById("row22").removeChild(col3)

     
     
   }
// function generatePassword(){
//     const alphabets=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
//     const num=['1','2','3','4','5','6','7','8','9','0']
//     const special=['&','@','#','%','^','*']
 
//     let pass=''
//     for(let i=0;i<3;i++){
//         pass+=alphabets[Math.floor(Math.random()*25)]
//         pass+=num[Math.floor(Math.random()*9)]
//         pass+=special[Math.floor(Math.random()*5)]
//     }
//     console.log(pass);
//     document.getElementById("password").value=pass;
// }

async function LDAPrequest(){
	const result=await axios.post('/ldap')
	console.log(result.data)
	document.getElementById('ldapTest').value=result.data

}

// let week=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
// let month=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
// const restartPolicy=document.getElementById('restart-policy')
// const restartDay=document.getElementById('restart-day')
// restartPolicy.onchange=()=>{
// 	restartDay.disabled=false
// 	restartDay.innerHTML=''
// 	if(restartPolicy.value=="Daily"){
// 		restartDay.disabled=true
// 	}else if(restartPolicy.value=="Weekly"){
// 		for(let i=0;i<week.length;i++){
// 			let option=document.createElement('option')
// 			option.text=week[i]
// 			restartDay.appendChild(option)
// 		}
// 	}else{
// 		for(let i=0;i<month.length;i++){
// 			let option=document.createElement('option')
// 			option.text=month[i]
// 			restartDay.appendChild(option)
// 		}
// 	}
// }



async function getLogonNames(){
          
	console.log("form submit")
	var userTable = document.getElementById('userTable');
	var rowCount = userTable.rows.length;
	let logonNames=[]
	
	for(let i=1;i<rowCount;i++){
		let logon=new LogonName(i,userTable.rows[i].cells[3].childNodes[0].value,0)
		// console.log(userTable.rows[i].cells[3].childNodes[0].value)
		logonNames.push(logon)
	}
	console.log(logonNames)
	console.log(new Set(logonNames))
	// if(new Set(logonNames).size == logonNames.length){
	// 	alert("Form contains duplicate LogonNames")
	// 	return
	// }

	const verifiedArr=await axios.post('/ldap',logonNames)
	console.log(verifiedArr)

	for(let i=0;i<logonNames.length;i++){
		let logonObj=logonNames[i]
		if(logonObj.verified==1){
			userTable.rows[logonObj.row].cells[6].innerHTML='&#x2705'

		}else if(logonObj.verified==2){
			userTable.rows[logonObj.row].cells[6].innerHTML='&#x2BBD'
		}
	}


}

function addUserRows(){
	//Get Table by ID
	var userTable = document.getElementById('userTable');
	let row=userTable.insertRow(-1)
	
	let firstName=document.createElement('input')
	let cellFirstName=row.insertCell(0)
	cellFirstName.appendChild(firstName)

	let lastName=document.createElement('input')
	let cellLastName=row.insertCell(1)
	cellLastName.appendChild(lastName)

	let email=document.createElement('input')
	let cellEmail=row.insertCell(2)
	cellEmail.appendChild(email)

	let logonName=document.createElement('input')
	let cellLogonName=row.insertCell(3)
	cellLogonName.appendChild(logonName)

	let passDiv=document.createElement('div')
	let passInput=document.createElement('input')
	passInput.setAttribute('size','12')
	let passShow=document.createElement('button')
	passShow.textContent='Show'
	passShow.style.width='70px'
	// let passButton=document.createElement('button')
	// passButton.textContent="genPass"
	passInput.type='password'
	passInput.value=generatePassword()
	// passInput.appendChild(passShow)
	// passButton.onclick=function(e){
	// 	e.preventDefault()
	// }

	passShow.onclick=function(e){
		e.preventDefault()
		if(passInput.type=='password'){
			passInput.type='text'
			passShow.textContent='Hide'
		}else{
			passInput.type='password'
			passShow.textContent='Show'

		}
	}

	passDiv.appendChild(passInput)
	passDiv.appendChild(passShow)

	let cellPassword=row.insertCell(4)
	cellPassword.appendChild(passDiv)
	// cellPassword.appendChild(passShow)
	// cellPassword.appendChild(passButton)
	console.log(userTable.rows[0].cells.length)
	console.log(userTable.rows.length)
	console.log(userTable.rows[2])

	lastName.onkeyup=function(){
		console.log("change")
		if(firstName.value!=''){
			let cid=document.getElementById('client-id').value
			logonName.value=cid+"-"+firstName.value+lastName.value.charAt(0)
		}
	}

	firstName.onkeyup=function(){
		console.log("change")
		if(firstName.value!=''){
			let cid=document.getElementById('client-id').value
			logonName.value=cid+"-"+firstName.value+lastName.value.charAt(0)
		}
	}

	let privilegeOptions=['Yes','No']
	console.log(privilegeOptions)
	let selectprivilege=createSelectElement(privilegeOptions)
	let cellRadio=row.insertCell(5)
	cellRadio.appendChild(selectprivilege)

	let verfiedCell=row.insertCell(6)
}
addUserRows()

function generatePassword(){
	const alphabets=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
	const num=['1','2','3','4','5','6','7','8','9','0']
	const special=['&','@','#','%','^','*']
 
	let pass=''
	for(let i=0;i<3;i++){
		pass+=alphabets[Math.floor(Math.random()*25)]
		pass+=num[Math.floor(Math.random()*9)]
		pass+=special[Math.floor(Math.random()*5)]
	}
	console.log(pass);
	return pass
}

function deleteUserRows(){

	var table = document.getElementById('userTable');

	var rowCount = table.rows.length;

	if(rowCount > '2'){

		var row = table.deleteRow(rowCount-1);

		rowCount--;

	}
	else{
		alert('There should be atleast one row');
	}
}


function addMachineRows(){
	var machineTable = document.getElementById('machineTable');
	let row=machineTable.insertRow(-1)
	
	let machineName=document.createElement('input')
	let cellmachineName=row.insertCell(0)
	cellmachineName.appendChild(machineName)

	const osoptions=['Windows 10','Windows Server 2019','Ubuntu 20.04']
	const osSelection=createSelectElement(osoptions)
	let cellOS=row.insertCell(1)
	cellOS.appendChild(osSelection)

	const dataCenterOptions=['US','Singapore']
	const dataCenterSelection=createSelectElement(dataCenterOptions)
	let cellDataCenter=row.insertCell(2)
	cellDataCenter.appendChild(dataCenterSelection)

	const vCPUOptions=[2,4,6,8,10,12,14,16]
	const vCpuSelect=createSelectElement(vCPUOptions)
	let cellvCpu=row.insertCell(3)
	cellvCpu.appendChild(vCpuSelect)

	const ramOptions=[4,6,8,10,12,16]
	const ramSelect=createSelectElement(ramOptions)
	const cellRam=row.insertCell(4)
	cellRam.appendChild(ramSelect)

	const addtionalStorageOptions=[10,20,30,40,50]
	const addtionalStorageSelect=createSelectElement(addtionalStorageOptions)
	const cellAddtionalStorage=row.insertCell(5)
	cellAddtionalStorage.appendChild(addtionalStorageSelect)
	
}

function createSelectElement(options){
	let select=document.createElement('select')
	for(let i=0;i<options.length;i++){
		let option=document.createElement('option')
		option.text=options[i]
		select.add(option)
	}
	return select
}
addMachineRows()

function deleteMachineRows(){
	let table=document.getElementById('machineTable')
	var rowCount = table.rows.length;

	if(rowCount > '2'){
		var row = table.deleteRow(rowCount-1);
		rowCount--;
	}
	else{
		alert('There should be atleast one row');
	}
}

function addDeliveryGroups(){
	const deliverygroupTable=document.getElementById('deliveryGroupTable')
	let row=deliverygroupTable.insertRow(-1)

	let deliveryGroupName=document.createElement('input')
	let cellDeliveryGroupName=row.insertCell(0)
	cellDeliveryGroupName.appendChild(deliveryGroupName)

	let machineHostName=document.createElement('input')
	let cellMachineHostName=row.insertCell(1)
	cellMachineHostName.appendChild(machineHostName)

	let dataCenterOptions=['US','Singapore']
	let selectDataCenter=createSelectElement(dataCenterOptions)
	let cellDataCenter=row.insertCell(2)
	cellDataCenter.appendChild(selectDataCenter)

	let users=document.createElement('input')
	let cellUsers=row.insertCell(3)
	cellUsers.appendChild(users)

	let restartPolicy=['Daily','Weekly','Monthly']
	let selectRestartPolicy=createSelectElement(restartPolicy)
	let cellRestartPolicy=row.insertCell(4)
	cellRestartPolicy.appendChild(selectRestartPolicy)

	let week=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
	let month=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]

	let cellRestartDay=row.insertCell(5)
	let selectRestartDay=document.createElement('select')
	selectRestartDay.disabled=true
	cellRestartDay.appendChild(selectRestartDay)
	selectRestartPolicy.onchange=function(){
		cellRestartDay.innerHTML=''
		if(selectRestartPolicy.value=='Monthly'){
			let selectRestartDay=createSelectElement(month)
			cellRestartDay.appendChild(selectRestartDay)
		}else if(selectRestartPolicy.value=='Weekly'){
			let selectRestartDay=createSelectElement(week)
			cellRestartDay.appendChild(selectRestartDay)
		}else{
			let selectRestartDay=document.createElement('select')
			selectRestartDay.disabled=true
			cellRestartDay.appendChild(selectRestartDay)
		}
	}

	let restartTime=document.createElement('input')
	restartTime.type='time'
	let cellRestartTime=row.insertCell(6)
	cellRestartTime.appendChild(restartTime)

}

function deleteDeliveryGroupRows(){
	let table=document.getElementById('deliveryGroupTable')
	var rowCount = table.rows.length;

	if(rowCount > '2'){
		var row = table.deleteRow(rowCount-1);
		rowCount--;
	}
	else{
		alert('There should be atleast one row');
	}
}
addDeliveryGroups()
