//input and output arrays
var input = [];
var output = [];
//id to add elements to list and maintaing their ids
var id = 0;

//function to validate input vector form
function formValidation(){
	var min = document.inputForm.min;
	var spacing = document.inputForm.spacing;
	var max = document.inputForm.max;
	var valid = true;
    
    if(min.value.length == 0){
    	alert("Min can not be empty");
        min.focus();
        valid = false;
    }
    if(max.value.length == 0){
    	alert("Max can not be empty");
        max.focus();
        valid = false;
    }
    if(spacing.value.length == 0){
    	alert("Spacing can not be empty");
        spacing.focus();
        valid = false;
    }
    if(valid){
    	generateInputs(min, max, spacing);
    }
    
}
//generate input vector X and initialize output to undefined
function generateInputs (min, max, spacing) {
	input = [];
    var min = parseInt(min.value);
    var max = parseInt(max.value);
    var spacing = parseInt(spacing.value);
    
    for(var i = min; i <= max; i = i + spacing){
    	input.push(i);
    }
    showMessage();
    displayOutput();
}

//Operation Data to store all math operations and their formats which will be used in Operation class
var operationData = {
	add: {
	    name: "Add",
	    calculation: function (a, b) { return a + b; },
	    format: function (a, b) { return "( " + a + " + " + b + " )"; },
	    operands: 2,
	    inputId: "secondAdd"
	},
	multiply: {
	    name: "Multiply",
	    calculation: function (a, b) { return a * b; },
	    format: function (a, b) { return "( " + a + " * " + b + " )"; },
	    operands: 2,
	    inputId: "secondMultiply"
	},
	pow: {
	    name: "Pow",
	    calculation: function (a, b) { return Math.pow(a,b); },
	    format: function (a, b) { return "( pow ( " + a + ", " + b + " ) )"; },
	    operands: 2,
	    inputId: "secondPow"
	},
	sqrt: {
	    name: "Sqrt",
	    calculation: function (a) { return Math.sqrt(a); },
	    format: function (a) { return "( sqrt " + a + " )"; },
	    operands: 1
	},
	divide: {
		name: "Divide",
		calculation: function (a, b) { return a / b; },
	    format: function (a, b) { return "( " + a + " / " + b + " )"; },
	    operands: 2,
	    inputId: "secondDivide"
	},
	subtract: {
		name: "Subtract",
	    calculation: function (a, b) { return a - b; },
	    format: function (a, b) { return "( " + a + " - " + b + " )"; },
	    operands: 2,
	    inputId: "secondSubtract"
	},
	reciprocal: {
		name: "Reciprocal",
	    calculation: function (a) { return 1 / a; },
	    format: function (a) { return "( " + 1 + " / " + a + " )"; },
	    operands: 1
	}
};
//Javascript class to calculate output and show equation and also to add element to the list of seequence
var Operation = function (options) {
    var key;
    
    //calculation method will be called based on options object at run time
    this.calculate = function(operand1, operand2){
      return options.calculation.call(this, operand1, operand2);
    }

    //format method will be called based on options object at run time
    this.show = function(operand1, operand2){
      return options.format.call(this, operand1, operand2);
    }

    //add element to list and also check for valid inputs
    this.addElement = function(){
      var valid = true;
      document.getElementById("errorMessage").innerHTML = "";
      var li = document.createElement("li");  
      if(options.operands == 1){
      	key = options.name.concat(" ");	
      } else {
      	var input = document.getElementById(options.inputId);
      	valid = this.validateInput(input);
      	if(options.name == "Divide" && valid) {
      		valid = this.divideByZero(input);
      	}
      	key = options.name.concat(" ").concat(input.value);
      }

      if(valid){
	      li.innerHTML = key;
	      li.id = options.name.concat(id);
	      id++;
	      li.classList.add("operationsList");
	      document.getElementById("sortable").appendChild(li);
	      sortEventHandler();
	  }
    }
    
    //if the input is empty for scalar constant
    this.validateInput = function(input){
    	if(input.value.length == 0){
    		alert("Please enter scalar value to " + options.name);
			input.focus();
			return false;
    	}
    	return true;
    }
    //function to check if we are dividing by zero
    this.divideByZero = function(operand2){
    	if(operand2.value == 0){
    		document.getElementById("errorMessage").innerHTML = "Can not perform divide by zero operation!";
    		return false;
    	}
    	return true;
    }
};

//calculating output Y based on current equation
function generateOutput(){
	output = [];
	var equation = "";
	var sorted = $("#sortable").sortable("toArray");
	for(var k = 0; k < input.length; k++){
		for(var j = 0; j < sorted.length; j++){
			//spliting the element name and then calculating based on operation
			var res = document.getElementById(sorted[j]).innerHTML.split(" ");
			var operationObject;
			if(res[0] == "Add"){
				operationObject = new Operation(operationData.add);				
			} else if(res[0] == "Multiply"){
				operationObject = new Operation(operationData.multiply);
			} else if(res[0] == "Pow"){
				operationObject = new Operation(operationData.pow);
			} else if(res[0] == "Sqrt"){
				operationObject = new Operation(operationData.sqrt);	
			} else if(res[0] == "Divide"){
				operationObject = new Operation(operationData.divide);
			} else if(res[0] == "Subtract"){
				operationObject = new Operation(operationData.subtract);
			} else if(res[0] == "Reciprocal"){
				operationObject = new Operation(operationData.reciprocal);
			}
		    if(j == 0){                   
				output[k] = operationObject.calculate(input[k], parseFloat(res[1]));
                equation = operationObject.show("X", parseFloat(res[1]));
			} else {
				output[k] = operationObject.calculate(output[k], parseFloat(res[1]));
				equation = operationObject.show(equation, parseFloat(res[1]));
			}
		}
		document.getElementById("equation").innerHTML = "Y = ".concat(equation);
	}
}

//function to generate equation based on user action, calls this function everytime there is change
function sortEventHandler(event, ui){
    //dynamically updates output table or graph with every change in sequence of operations
	if ($("#output").css('display') === 'block') {
		displayOutput();
	} else if($("#graph").css('display') === 'block'){
		generateGraph();
	}
};

//function to display output in table form
function displayOutput(){
	document.getElementById("output").style.display = "block";
	document.getElementById("graph").style.display = "none";
	var validInput = true;
	if(input.length == 0){
		alert("Please first enter values to generate input vector");
		document.inputForm.min.focus();
        validInput = false;
	}
	generateOutput();
	if(validInput){
		//create table dom element table to display output
		document.getElementById("output").innerHTML = "";
		var myTableDiv = document.getElementById("output");
	    var table = document.createElement('TABLE');
	    var tableBody = document.createElement('TBODY');

	    table.border = '1';
	    table.classList.add("table");
	    table.classList.add("table-bordered");
	    table.appendChild(tableBody);

	    //TABLE COLUMNS
	    var tr = document.createElement('TR');
	    tableBody.appendChild(tr);

	    var heading = new Array();
	    heading[0] = "Input";
	    heading[1] = "Output";

	    for (i = 0; i < heading.length; i++) {
	        var th = document.createElement('TH')
	        th.appendChild(document.createTextNode(heading[i]));
	        tr.appendChild(th);
	    }
       //create table rows for input-ouput
	    for (i = 0; i < input.length; i++) {
	        var tr = document.createElement('TR');
	        var td1 = document.createElement('TD');
	        var td2 = document.createElement('TD');
	        td1.appendChild(document.createTextNode(input[i]));
	        td2.appendChild(document.createTextNode(output[i]));
	        tr.appendChild(td1);
	        tr.appendChild(td2);
	        tableBody.appendChild(tr);
	    }

	    myTableDiv.appendChild(table);
	}
}

function showMessage(){
	document.getElementById("showMessage").style.display = "block";
}
//function to display output in graph form, used plotly to draw line chart
function generateGraph(){
	document.getElementById("output").style.display = "none";
	document.getElementById("graph").style.display = "block";
	var validInput = true;
	if(input.length == 0){
		alert("Please first enter values to generate input vector");
		document.inputForm.min.focus();
        validInput = false;
	} 
	generateOutput();
	//plot x vs y using plotly
	if(validInput){
		var trace1 = {
	  		x: input, 
	  		y: output, 
	  		type: 'scatter'
		};
		var y = document.getElementById("equation").innerHTML;
		var layout = {
		  title:'Plotting Y along Input vector X',
		  xaxis: {
		    title: 'Input vector X'
		  },
		  yaxis: {
		    title: y
		  }
		};
		var data = [trace1];
		Plotly.newPlot('graph', data, layout);
	}

}



