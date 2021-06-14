// create random token
var rand = () => {
  return Math.random().toString(36).substr(2); // remove 0

};

var token = function(){
  return rand() + rand();
};

function DisplayHospitalData(){
    var userId = localStorage.getItem("userId");
    console.log("before read : "+userId);

    db.collection("hospital Details").doc(userId)
    .onSnapshot((doc) => {
      var data = doc.data();

      console.log(data);
      
      var h_name = data["h_name"];
      var h_email = data["h_email"];
      var h_address = data["h_road"]+" "+data["h_area"]+", "+data["h_city"]+", "+data["h_state"]+", "+data["h_pincode"];
      var h_phone = data["h_phone"];

      // set data to element
      document.getElementById("h_name_id").innerHTML = h_name;
      document.getElementById("h_email_id").innerHTML = h_email;
      document.getElementById("h_address_id").innerHTML = h_address;
      document.getElementById("h_phome_id").innerHTML = h_phone;

      // set data in update modal also
      document.getElementById("edit-hName").value = h_name;
      document.getElementById("edit-hEmail").value = h_email;
      document.getElementById("eh_road").value = data["h_road"];
      document.getElementById("eh_area").value = data["h_area"];
      document.getElementById("eh_city").value = data["h_city"];
      document.getElementById("eh_state").value = data["h_state"];
      document.getElementById("eh_pincode").value = data["h_pincode"];
      document.getElementById("edit-Phone").value = h_phone;

  });

   DisplayDriverData();
}

// update hospital data
function UpdateHospitalData() {
  var userId = localStorage.getItem("userId");
  // validate 
  var name = document.getElementById("edit-hName").value
  var email = document.getElementById("edit-hEmail").value
  var road = document.getElementById("eh_road").value
  var area = document.getElementById("eh_area").value
  var city = document.getElementById("eh_city").value
  var state = document.getElementById("eh_state").value 
  var pincode = document.getElementById("eh_pincode").value 
  var phone = document.getElementById("edit-Phone").value 

  // console.log("working...")
  var editedData = db.collection("hospital Details").doc(userId);

  return editedData.update({
    "h_name": name,
    "h_email": email,
    "h_phone":phone,
    "h_road": road,
    "h_area": area,
    "h_city": city,
    "h_state": state,
    "h_pincode": pincode
  })
  .then(() => {
    alert("Saved successfully");
  })
  .catch((e) => {
    alert("Error while saving changes : ", e);
  });

}

// add drivers data
function AddDriverData() {

    var d_name = document.getElementById("d_name").value;
    var d_phone = document.getElementById("d_phone").value;
    var ambulance_number = document.getElementById("d_ambulance_number").value;

    var userId = localStorage.getItem("userId");

    db.collection("Drivers Details").doc(userId).collection("Drivers").doc(token())
    .set({
        "d_name": d_name,
        "d_phone": d_phone,
        "ambulance_number": ambulance_number
      })
      .then(() => {
        console.log("Drivers data added")
        alert("Drivers data added successfully!!");
        location.reload();
      })
      .catch((error) => {
        alert(error.message);
      }); 
}

var driversCopy = {};

function DisplayDriverData(){
  var userId = localStorage.getItem("userId");
    console.log("before read Driver : "+userId);

    // drivers dictionary
    var drivers = {};
    
    db.collection("Drivers Details").doc(userId).collection("Drivers").get()
    .then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        drivers[doc.id] = doc.data();
        // console.log(doc.id, " => ", doc.data())
      })

      // console.log(drivers)

      // diplay data drivers data 
      var table = document.getElementById("driverTable")
      var i = 0;
      for(var driver in drivers) {
        // console.log(drivers[driver].d_name)
        var row = `<tr>
                      <td>${++i}</td>
                      <td>${drivers[driver].d_name}</td> 
                      <td>${drivers[driver].d_phone}</td> 
                      <td>${drivers[driver].ambulance_number}</td>   
                      <td>
                        <input type="checkbox" id="driverCheckbox" value="${drivers[driver].d_name}">
                      </td>
                  </tr>`

        table.innerHTML += row;
      }

    })

    driversCopy = drivers;

  
}

function DeleteDriver(){

  var answer = window.confirm("Are you sure to Delete?");
  if (answer) {
    var userId = localStorage.getItem("userId");
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');


    for(var checkbox of checkboxes){
      // console.log("Selected Driver Name : ", checkbox.value);
      var selectedName = checkbox.value;
      for(var data in driversCopy){
        var dName = driversCopy[data]["d_name"];
        if(dName == selectedName){
          var dId = data;
          
          // delete
          db.collection("Drivers Details").doc(userId).collection("Drivers").doc(dId)
          .delete()
          .then(() => {
            alert("deleted successfully..")
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });

        }
      }
    }
  }
  else {
    //some code
  }

}

// update driver data
var dId;
function UpdateDriverData(){
  var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  if(checkboxes.length > 1){
    alert("Select only one row to update");
    return;
  }

  if(checkboxes.length < 1){
    alert("Select the row, which you want to update");
    return;
  }

  var selectedName;
  for(var checkbox of checkboxes){
    // console.log("Selected Driver Name : ", checkbox.value);
    selectedName = checkbox.value;
  }

  // get driver id of selected driver
  // console.log(driversCopy);
  var dPhone;
  var dVehicleNo;
  for(var data in driversCopy){
    var dName = driversCopy[data]["d_name"];
    if(dName == selectedName){
      dId = data;
      dPhone = driversCopy[data]["d_phone"];
      dVehicleNo = driversCopy[data]["ambulance_number"];
      break;
    }
  }

  // set previous data
  document.getElementById("ud_name").value = selectedName;
  document.getElementById("ud_phone").value = dPhone;
  document.getElementById("ud_ambulance_number").value = dVehicleNo;

   /** show the modal using javascript, rather than using href in element **/
  $("#updateEmployeeModal").modal('show');

  // read updated data
}

function UpdateDriverDataFinal(){
  
  var userId = localStorage.getItem("userId");

  var d_name = document.getElementById("ud_name").value;
  var d_phone = document.getElementById("ud_phone").value;
  var ambulance_number = document.getElementById("ud_ambulance_number").value;

  // update 
  var updateDriver = db.collection("Drivers Details").doc(userId).collection("Drivers").doc(dId);
  return updateDriver.update({
    "d_name": d_name,
    "d_phone": d_phone,
    "ambulance_number": ambulance_number
  })
  .then(() => {
    alert("Updated successfully!!");
    location.reload();
  })
  .catch((error) => {
    console.log(error)
    alert(error.message);
  }); 

}

// read dashbord data
function DisplayDashBoardData(){
  var userId = localStorage.getItem("userId");
  console.log("before read : "+userId);

  db.collection("accident detected").doc(userId)
  .onSnapshot((doc) => {
    var data = doc.data();

    console.log(data);
    
    var dash_name = data["p_name"];
    var dash_phone = data["p_number"];
    var dash_bg = data["p_blood_group"];
    var dash_relative = data["help_contact"];
    var dash_location = data["gps_location"];
    var dash_date = data["AccidentDate"];
    var dash_dName = data["driver_name"];

    // set data to element
    document.getElementById("dash_name").innerHTML = dash_name;
    document.getElementById("dash_phone").innerHTML = dash_phone;
    document.getElementById("dash_bg").innerHTML = dash_bg;
    document.getElementById("dash_relative").innerHTML = dash_relative;
    document.getElementById("dash_location").href = dash_location;
    document.getElementById("dash_date").innerHTML = dash_date;
    document.getElementById("dash_dName").innerHTML = dash_dName;

});

}



