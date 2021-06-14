
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyByY69IxhaW3zBQ_LvztlwEDHUXAfjbFg8",
    authDomain: "accident-detection-syste-8fd82.firebaseapp.com",
    projectId: "accident-detection-syste-8fd82",
    storageBucket: "accident-detection-syste-8fd82.appspot.com",
    messagingSenderId: "271964530088",
    appId: "1:271964530088:web:3182bfb326428445c1a99d",
    measurementId: "G-P4BXVEFSTR"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();


const fAuth = firebase.auth();
const db = firebase.firestore();
firebase.auth.Auth.Persistence.LOCAL;


var userId;

// data variables
var h_name;
var h_email;
var h_phone;
var h_road;
var h_area;
var h_city;
var h_state;
var h_pincode;
var h_password;
var h_confirmPassword;

function SetUserId(user_id){
  userId = user_id;
}

function GetUserId(){
  return userId;
}

// login
function onLogin(){
     
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_password").value;

    // register
    fAuth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Successfully logged in!!");
      // got to home page after successfull login
      window.location.href = "/index.html";
    })
    .catch((error) => {
     alert(error.message);
    });
    
}

// register
function onRegister() {
    h_name = document.getElementById("h_name").value;
    h_email = document.getElementById("h_email").value;
    h_phone = document.getElementById("h_phone").value;

    h_road = document.getElementById("h_road").value;
    h_area = document.getElementById("h_area").value;
    h_city = document.getElementById("h_city").value;
    h_state = document.getElementById("h_state").value;
    h_pincode = document.getElementById("h_pincode").value;

    h_password = document.getElementById("h_password").value;
    h_confirmPassword = document.getElementById("h_confirmPassword").value;

    console.log(h_name+"\n"+h_email+"\n"+h_phone+"\n"+h_road+"\n"+h_area
    +"\n"+h_city+"\n"+h_state+"\n"+h_pincode+"\n"+h_password+"\n"+h_confirmPassword);

    // register
    const promise = fAuth.createUserWithEmailAndPassword(h_email, h_password)
    .then(function(user){
      // userId = user.uid;
      // console.log( "after register: "+userId);
      // writeHospitalData(h_name, h_email, h_phone, h_road, h_area, h_city, h_state, h_pincode);
    })
    .catch(function(error){
      console.log(error.message);
    })
    alert("User Registerd!!");
}

function writeHospitalData()
{
  // add user details to cloud
 
  db.collection("hospital Details").doc(userId).set({
    "h_name": h_name,
    "h_email": h_email,
    "h_phone": h_phone,
    "h_road": h_road,
    "h_area": h_area,
    "h_city": h_city,
    "h_state": h_state,
    "h_pincode": h_pincode
  })
  .then(() => {
    alert("data saved successfully!!");
    window.location.href = "/login.html"
  })
  .catch((error) => {
    alert(error.message);
  }); 
  
}


//logout
function onLogout() {
  
  var isConfirm = window.confirm("Are you sure you want to log out?");
  
  if(isConfirm){

    firebase.auth().signOut().then(() => {
      alert("logged out successfully..");
      // localStorage.removeItem("userId");
      window.location.href = "/index.html";
    }).catch((error) => {
      console.log("error occurred"+error.message);
    });

  }else{
    // do nothing
  }

}

// var hosiptalData;

// function DisplayHospitalData(){
//   window.location.href="/warriors.html";
//   var userId = localStorage.getItem("userId");
//   console.log("before read : "+userId)
//   db.collection("hospital Details").doc(userId)
//   .onSnapshot((doc) => {
//       hosiptalData = doc.data();
//       // console.log("Current data: ", data["hospital name"]);

//       // var str = data["hospital name"] +" \n "+data["hospital address"] +" \n "+data["hospital number"] +" \n "+data["driver name"] ;
//       console.log(hosiptalData)
      
//       // document.getElementById("area").value = str;

//   });

  
// }
