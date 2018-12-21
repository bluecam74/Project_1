src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";

window.onload = function () { 
    L.mapquest.key = 'jqnjIbmIDCL7UaGiP6SPvbfGTlGTs9z0'; 
    var map = L.mapquest.map('map', 
    { center: [33.685908, -117.824719], 
    layers: L.mapquest.tileLayer('map'), 
    zoom: 15 }); 
};






var street;
var city;
var state;
var zip;
var convVal = '';

$("#submit").on("click", function (e) {
    e.preventDefault();
    // Address inputs
    street = $("#street").val().trim();
    // street = street.replace(/ /g, '');
    city = $("#city").val().trim();
    //city = city.replace(/ /g, '');
    state = $("#state").val().trim();
    //state = state.replace(/ /g, '');
    zip = $("#zip").val().trim();

    console.log(street + ", " + city + ", " + state + " " + zip);
    // $('#map').empty();
    mappingApi();


});


function mappingApi() {
    var apiKey = "jqnjIbmIDCL7UaGiP6SPvbfGTlGTs9z0";
    var queryURL = "http://www.mapquestapi.com/geocoding/v1/address?key=" + apiKey + "&adminArea3=" + state + "&adminArea1=US&adminArea5=" + city + "&street=" + street;
    console.log("street", street);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.results);
        $("#displayDiv").text("Latitude: " + response.results[0].locations[0].latLng.lat + " Longitude: " + response.results[0].locations[0].latLng.lng);
        //console.log(response);
        var postalCode = response.results[0].locations[0].postalCode;
        var longitude = response.results[0].locations[0].latLng.lng;
        var latitude = response.results[0].locations[0].latLng.lat;
        $("#displayDiv").append(" Zip Code: " + postalCode)

        getIndex();
        getMap();
        getSong();


        function getMap() {
            console.log("getmap executed");
            L.mapquest.key = "jqnjIbmIDCL7UaGiP6SPvbfGTlGTs9z0";
            // 'map' refers to a <div> element with the ID map
            var map = L.mapquest.map('map', {
                center: [latitude, longitude],
                layers: L.mapquest.tileLayer('map'),
                zoom: 15
            });
            console.log("getmap2 executed");

            L.marker([latitude, longitude], {
                icon: L.mapquest.icons.marker(),
                draggable: false
            }).addTo(map);


        }


        function getIndex() {

            var addressID = (Math.abs(longitude % latitude)) * 10000000;
            console.log("address ID: ", addressID);

            var test = addressID;
            var addressIDArray = test.toString().split('');
            var stripVal = [
                addressIDArray[6],
                addressIDArray[7],
                addressIDArray[8],
            ];
            convVal = stripVal.join('');
            var indexVal = parseInt(convVal);
            console.log(convVal);

        };


        function getSong() {
            console.log("getsong executed");
            var config = {
                apiKey: "AIzaSyCSgNJHvbAHX2hITADtnnUWBLraMFI7_lA",
                authDomain: "propsong-c1980.firebaseapp.com",
                databaseURL: "https://propsong-c1980.firebaseio.com",
                projectId: "propsong-c1980",
                storageBucket: "propsong-c1980.appspot.com",
                messagingSenderId: "657030694604"
            };

            firebase.initializeApp(config);

            var database = firebase.database();

            database.ref().on("value", function (snapshot) {

                var assignedTitle = snapshot.val().songs[convVal].name;
                var assignedArtist = snapshot.val().songs[convVal].artist;
                console.log(snapshot.val())
                console.log(snapshot.val().songs[convVal]);
                $('#title').empty();
                $('#artist').empty();
                $('#title').text(assignedTitle);
                $('#artist').text(assignedArtist);

            }, function (errorObject) {

                // In case of error this will print the error
                console.log("The read failed: " + errorObject.code);
            });

        }


    });
}