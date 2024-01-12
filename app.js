let map;
let userMarker;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        createMap(userLocation);
        createAndMoveUserMarker(userLocation);
        fetchPM25Data(userLocation);
      },
      (error) => {
        handleGeolocationError(error);
      }
    );
  } else {
    handleGeolocationNotSupported();
  }
}

function createMap(center) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 30,
  });
}

function createAndMoveUserMarker(location) {
  userMarker = new google.maps.Marker({
    position: location,
    map: map,
    title: "Your Location",
  });
}

function handleGeolocationError(error) {
  console.error("Error getting user location:", error);
  displayError("Error getting user location.");
}

function handleGeolocationNotSupported() {
  console.error("Geolocation is not supported by this browser.");
  displayError("Geolocation is not supported by this browser.");
}

function fetchPM25Data(location) {
  const apiKey = "9bb87ff8-7d3a-4951-be73-3586a4d5c32e";
  const apiUrl = `https://api.airvisual.com/v2/nearest_city?lat=${location.lat}&lon=${location.lng}&key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayPM25Data(data.data.current.pollution);
      displayGeneralInfo(data.data);
    })
    .catch((error) => {
      handlePM25DataFetchError(error);
    });
}
function handlePM25DataFetchError(error) {
  console.error("Error fetching PM 2.5 data:", error);
  displayError("Error fetching PM 2.5 data.");
}

function displayGeneralInfo(data) {
  const generalInfoElement = document.getElementById("general-info");
  const generalInfoElement2 = document.getElementById("general-info2");
  const city = data.city;
  const state = data.state;
  const aqi = data.current.pollution.aqius;
  generalInfoElement.innerHTML = `<p>Air Quality Index: ${aqi}</p>`;
  generalInfoElement2.innerHTML = `<p>Location: ${city}, ${state}</p>`;
  // เพิ่มข้อมูลทั่วไปเพิ่มเติมตามต้องการ
}

function mapAQIToQuality(aqi) {
  if (aqi <= 50) {
    return "Low";
  } else if (aqi <= 100) {
    return "Medium";
  } else {
    return "High";
  }
}

function displayPM25Data(pollutionData) {
  const pm25DataElement = document.getElementById("pm25-data");
  const aqi = pollutionData.aqius;

  // แปลง AQI เป็นข้อความที่แสดงระดับคุณภาพ
  const quality = mapAQIToQuality(aqi);

  // เปลี่ยนสีของ #report ตามระดับคุณภาพ
  const reportElement = document.getElementById("report");
  switch (quality) {
    case "Low":
      reportElement.style.backgroundColor = "#00ff00"; // สีเขียว
      break;
    case "Medium":
      reportElement.style.backgroundColor = "#ffff00"; // สีเหลือง
      break;
    case "High":
      reportElement.style.backgroundColor = "#ff9900"; // สีส้ม
      break;
    default:
      reportElement.style.backgroundColor = "#f0f0f0"; // สีเทา (default)
  }

  // แสดงข้อมูล PM 2.5 และระดับคุณภาพ
  pm25DataElement.innerHTML = `<p>PM 2.5 Level: (${quality} risk)</p>`;
  // เพิ่มข้อมูล PM 2.5 เพิ่มเติมตามต้องการ
}

function displayError(errorMessage) {
  const errorElement = document.getElementById("error-message");
  errorElement.innerHTML = `<p>${errorMessage}</p>`;
}
