$(document).ready(function () {
    //add popup
    /**
                * Elements that make up the popup.
                */
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    /**
    * Create an overlay to anchor the popup to the map.
    */
    var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    /**
    * Add a click handler to hide the popup.
    * @return {boolean} Don't follow the href.
    */
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    var format = 'image/png';

    // var bounds = [102.14402486200004, 7.180931477000058, 117.83545743800005, 23.392205570000076];
    var bounds = [105.75872802734375, 21.009902954101562,
        105.82250213623047, 21.049697875976562];

    var vinmart = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/baiThi/wms',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: 'baiThi:vinmart',
            }
        })
    });
    var roads = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/baiThi/wms',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: 'baiThi:roads',
            }
        })
    });
    var railways = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/baiThi/wms',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: 'baiThi:railways',
            }
        })
    });
    var naturnal = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/baiThi/wms',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: 'baiThi:naturnal',
            }
        })
    });

    var landuse = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/baiThi/wms',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: 'baiThi:landuse',
            }
        })
    });

    var hanhChinhHN = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/baiThi/wms',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: 'baiThi:hanhchinhhn',
            }
        })
    });

    var buildings = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/baiThi/wms',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: 'baiThi:buildings',
            }
        })
    });



    var projection = new ol.proj.Projection({
        code: 'EPSG:4326', //EPSG:4326
        // code: 'EPSG:4326',
        units: 'degrees',
        axisOrientation: 'neu',
        global: true
    });
    var map = new ol.Map({
        target: 'map',
        layers: [
            // hanhChinhHN, duongPho, tuNhien, atm
            hanhChinhHN, landuse, buildings, roads, railways, naturnal, vinmart
        ],
        overlays: [overlay],//them khai bao overlays
        view: new ol.View({
            projection: projection
        })
    });

    // hightlight đối tượng
    // Không hight light được đối tượng là đường và các điểm
    var styles = {
        'MultiPolygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            })
        })
    };
    // hightlight đối tượng
    var styleFunction = function (feature) {
        return styles[feature.getGeometry().getType()];
    };
    // hightlight đối tượng
    var vectorLayer = new ol.layer.Vector({
        style: styleFunction
    });
    map.addLayer(vectorLayer);


    //map.getView().fitExtent(bounds, map.getSize());
    map.getView().fit(bounds, map.getSize());

    $("#chkVinmart").change(function () {
        if ($("#chkVinmart").is(":checked")) {
            vinmart.setVisible(true);
        }
        else {
            vinmart.setVisible(false);
        }
    });

    $("#chkRoads").change(function () {
        if ($("#chkRoads").is(":checked")) {
            roads.setVisible(true);
        }
        else {
            roads.setVisible(false);
        }
    });

    $("#chkNaturnal").change(function () {
        if ($("#chkNaturnal").is(":checked")) {
            naturnal.setVisible(true);
        }
        else {
            naturnal.setVisible(false);
        }
    });

    $("#chkLanduse").change(function () {
        if ($("#chkLanduse").is(":checked")) {
            landuse.setVisible(true);
        }
        else {
            landuse.setVisible(false);
        }
    });

    $("#chkRailway").change(function () {
        if ($("#chkRailway").is(":checked")) {
            railways.setVisible(true);
        }
        else {
            railways.setVisible(false);
        }
    });

    $("#chkBuildings").change(function () {
        if ($("#chkBuildings").is(":checked")) {
            buildings.setVisible(true);
        }
        else {
            buildings.setVisible(false);
        }
    });

    $("#chkHanhChinh").change(function () {
        if ($("#chkHanhChinh").is(":checked")) {
            hanhChinhHN.setVisible(true);
        }
        else {
            hanhChinhHN.setVisible(false);
        }
    });

    //hightlight HanhChinhHN
    map.on('singleclick', function (evt) {
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = hanhChinhHN.getSource();
        var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
        console.log('ulr hanhChinhHN: ', url)
        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            })
                .then(data => {
                    if (data.features.length > 0) {
                        const idName = data.features[0].id;
                        const check = idName.includes('hanhchinhhn')
                        if (check) {
                            //hightlight đối tượng
                            var vectorSource = new ol.source.Vector({
                                features: (new ol.format.GeoJSON()).readFeatures(data)
                            });

                            vectorLayer.setSource(vectorSource);
                        } else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                })
                .catch(err => {
                    console.log('API lỗi', err)
                })
        }
    });


    // Tên Đường
    map.on('singleclick', function (evt) {
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = roads.getSource();
        var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
        console.log('ulr đường: ', url)
        $("#info").html('');
        $("#popup-content").html('');
        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
            })
                .then(data => {
                    if (data.features.length > 0) {
                        const idName = data.features[0].id;
                        // console.log('idName: ', idName);
                        const check = data.features[0].id.includes('roads')
                        // console.log('check: ', check);
                        if (check) {
                            const nameRoad = data.features[0].properties.name;
                            // console.log('name đường:', nameRoad);
                            let content = `<p>Tên đường: ${nameRoad}</p>`
                            // $("#info").html(content);
                            $("#popup-content").html(content);
                            overlay.setPosition(evt.coordinate);
                        } else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                })
                .catch(err => {
                    console.log('API lỗi', err)
                })
        }
    });

    // Tên tự nhiên
    map.on('singleclick', function (evt) {
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = naturnal.getSource();
        var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
        console.log('ulr tu nhiên: ', url)
        $("#popup-content").html('');
        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            })
                .then(data => {
                    if (data.features.length > 0) {
                        const idName = data.features[0].id;
                        // console.log('idName: ', idName);
                        const check = data.features[0].id.includes('naturnal')
                        if (check) {
                            const nameTuNhien = data.features[0].properties.name;
                            // console.log('name tự nhiên: ', nameTuNhien);
                            let content = `<p>Tên tự nhiên: ${nameTuNhien}</p>`
                            // $("#info").html(content);
                            $("#popup-content").html(content);
                            overlay.setPosition(evt.coordinate);

                            // hightlight đối tượng
                            var vectorSource = new ol.source.Vector({
                                features: (new ol.format.GeoJSON()).readFeatures(data)
                            });

                            vectorLayer.setSource(vectorSource);
                        } else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                })
                .catch(err => {
                    console.log('API lỗi', err)
                })
        }
    });

    // buildings
    map.on('singleclick', function (evt) {
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = buildings.getSource();
        var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
        console.log('ulr buildings: ', url)
        $("#popup-content").html('');
        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            })
                .then(data => {
                    if (data.features.length > 0) {
                        const idName = data.features[0].id;
                        // console.log('idName: ', idName);
                        const check = data.features[0].id.includes('buildings')
                        if (check) {
                            const nameTuNhien = data.features[0].properties.name;
                            // console.log('name tự nhiên: ', nameTuNhien);
                            let content = `<p>Tên buildings: ${nameTuNhien}</p>`
                            // $("#info").html(content);
                            $("#popup-content").html(content);
                            overlay.setPosition(evt.coordinate);

                            // hightlight đối tượng
                            var vectorSource = new ol.source.Vector({
                                features: (new ol.format.GeoJSON()).readFeatures(data)
                            });

                            vectorLayer.setSource(vectorSource);
                        } else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                })
                .catch(err => {
                    console.log('API lỗi', err)
                })
        }
    });

    // Tên hành chính
    map.on('singleclick', function (evt) {
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = hanhChinhHN.getSource();
        var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
        console.log('ulr hanhChinhHN: ', url)
        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            })
                .then(data => {
                    if (data.features.length > 0) {
                        const idName = data.features[0].id;
                        // console.log('idName: ', idName);
                        const check = data.features[0].id.includes('hanhchinhhn')
                        // console.log('check: ', check);
                        if (check) {
                            const nameHanhChinh = data.features[0].properties.adm2_vi;
                            // console.log('name hành chính:', nameHanhChinh);
                            let content = `<p>Tên hành chính: ${nameHanhChinh} - ${data.features[0].properties.adm1_vi} - ${data.features[0].properties.adm0_vi}</p>`
                            // $("#info").append(content);
                            $("#popup-content").append(content);
                            overlay.setPosition(evt.coordinate);

                            // hightlight đối tượng
                            // var vectorSource = new ol.source.Vector({
                            //     features: (new ol.format.GeoJSON()).readFeatures(data)
                            // });

                            // vectorLayer.setSource(vectorSource);
                        } else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                })
                .catch(err => {
                    console.log('API lỗi', err)
                })
        }
    });

    // Tên Vinmart
    map.on('singleclick', function (evt) {
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = vinmart.getSource();
        var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
        console.log('ulr vinmart: ', url)
        $("#info").html('');
        $("#popup-content").html('');
        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
            })
                .then(data => {
                    // console.log('data', data.features.length)
                    if (data.features.length > 0) {
                        const idName = data.features[0].id;
                        // console.log('idName: ', idName);
                        const check = data.features[0].id.includes('vinmart')
                        // console.log('check: ', check);
                        if (check) {
                            // const nameAtm = data.features[0].properties.name;
                            const { name, address, open, close, id } = data.features[0].properties
                            // console.log('nameATM:', nameAtm);

                            let content = `<p>Tên cửa hàng: ${name} <br> 
                                Địa chỉ: ${address} <br>
                                Giờ mở cửa: ${open} <br>
                                Giờ đóng cửa: ${close}</p>
                                <div class="float-right" >
                                    <a type="button" href="/edit/${id}" class="btn btn-outline-info">Edit</a>
                                    <a href="/delete/${id}" class="btn btn-outline-danger">Delete</a>
                                </div>
                            `
                            {/* <a  class="btn btn-outline-danger" data-toggle="modal" data-target="#delete-modal">Delete</a> */ }

                            // $("#info").html(content);
                            $("#popup-content").html(content);
                            overlay.setPosition(evt.coordinate);
                        } else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                })
                .catch(err => {
                    console.log('API lỗi', err)
                })
        }
    });

});