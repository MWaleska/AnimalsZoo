function initMap() {
    const localizacao = { lat: -7.11532, lng: -34.861 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: localizacao,
        mapId: 'DEMO_MAP_ID'
    });

    const marker = new google.maps.Marker({
        position: localizacao,
        map: map,
        title: "PetsBemEstar",
    });
}
