function globalReport(jsonData, dataMappage) {
    var dataFromCSV = d3.csvParseRows(Papa.unparse(jsonData));

    var data = dataFromCSV.map(row => commaToPoint(row));

    // *** COHORTES
    var select = $('#selectCohortes-btn');
    // suppression des options existantes
    select.find('option').remove();
    // implémentation liste options complète
    for (var i = 0, lgi = cohortesOptions.length; i < lgi; i++) {
        select.append('<option value="' + cohortesOptions[i] + '">' +
            cohortesOptions[i] + '</option>')
    }
    var cohortes = [...new Set(data.map(el => el[5]))];
    var cohortTitle = cohortes[0];

    cohortes = cohortes.slice(1, cohortes.length);

    var buttonCohortes = document.getElementById('cohortes-btn');
    buttonCohortes.innerHTML = cohortes.length +
        ' cohortes <i class="fas fa-download"></i>';

    var headersSpe = [data[0].slice(17, 32)];
    var rangeSpe = data.slice(1, data.length).map((row) => row.slice(17, 32).map(
        (el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));

    data[0].splice(6, 0, 'Attestation PC');
    data[0].splice(7, 0, 'Attestation PA');
    data[0].splice(8, 0, 'Grade TC');
    data[0].splice(10, 0, '1ère SPE');
    data[0].splice(11, 0, '2ème SPE');
    data[0].splice(12, 0, 'SPE validées');

    var pass70 = 0.695,
        absences = 0,
        checkFiles = [],
        row, countSpe;

    for (var i = 0, lgi = data.slice(1, data.length).length; i < lgi; i++) {
        row = data.slice(1, data.length)[i];

        var cohortName = row[5];
        var livrableAvg = row[16];

        var grades = row[32] != undefined ? row[32].split(',') : "";

        var enrollmentTrack = row[33] != undefined ? row[33].split(',') : "";
        var fusionnes = row[39] != undefined ? row[39].split(',') : "";
        var gradeTC = row[40];

        var verifieldTuples = {};
        enrollmentTrack.forEach((track, i) => {
            verifieldTuples[fusionnes[i]] = track;
        });

        if (row[3] === "Absent sur profile_info")
            absences++;

        if (row[39] && row[39].split(',').indexOf('TC') !== -1 && row[39].split(
                ',')[0] !== 'TC') {
            checkFiles.push([row[0], row[39]]);
        } else if (row[39] && row[39].split(',').indexOf('PA') !== -1 && row[39]
            .split(',')[row[39].split(',').length - 1] !== 'PA') {
            checkFiles.push([row[0], row[39]]);
        }

        countSpe = rangeSpe[i].filter(el => el >= pass70).length;

        // 2 meilleures spécialisations
        var max1 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader1 = (max1 >= pass70 && rangeSpe[i].indexOf(max1) !== -1) ?
            headersSpe[0][
                rangeSpe[i].indexOf(max1)
            ] : "";
        if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1) rangeSpe[
            i].splice(
            rangeSpe[i].indexOf(max1), 1, 0);

        var max2 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader2 = (max2 >= pass70 && rangeSpe[i].indexOf(max2) !== -1) ?
            headersSpe[0][
                rangeSpe[i].indexOf(max2)
            ] : "";
        if (cellHeader2 === cellHeader1)
            cellHeader2 = "";

        cellHeader1 = regexHeadersSPE.test(cellHeader1) ? cellHeader1.match(
            regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader1;
        cellHeader2 = regexHeadersSPE.test(cellHeader2) ? cellHeader2.match(
            regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader2;

        var enrollment_SPE_verified = Object.entries(verifieldTuples).filter(el =>
            el[0] !== "TC" && el[0] !== "PA" && el[1] === "verified").map(
            el => el[0]);
        var enrollment_SPE_oui = (enrollment_SPE_verified.length >= 2);
        var enrollment_SPE_non = (enrollment_SPE_verified.length < 2);

        var attestationTC,
            attestationPA;

        var TC_oui = (gradeTC != "" && +gradeTC >= pass70 && countSpe >= 2);
        var PA_oui = (gradeTC != "" && +gradeTC >= pass70 && countSpe >= 2 &&
            livrableAvg >= pass70);

        var enrollment_TC_oui = (verifieldTuples["TC"] && verifieldTuples["TC"] ===
            "verified");
        var enrollment_TC_non = (verifieldTuples["TC"] && verifieldTuples["TC"] !==
            "verified");

        var enrollment_PA_oui = (verifieldTuples["PA"] && verifieldTuples["PA"] ===
            "verified");
        var enrollment_PA_non = (verifieldTuples["PA"] && verifieldTuples["PA"] !==
            "verified");

        // validation attestation TC
        (cohortName !== "" && TC_oui) ? attestationTC = "OUI":
            (TC_oui && enrollment_TC_oui && enrollment_SPE_oui) ? attestationTC =
            "OUI" :
            (TC_oui && enrollment_TC_oui && enrollment_SPE_non) ? attestationTC =
            "en attente" :
            (TC_oui && enrollment_TC_non && enrollment_SPE_oui) ? attestationTC =
            "en attente" :
            attestationTC = "NON";

        // validation attestation TC
        (cohortName !== "" && PA_oui) ? attestationPA = "OUI":
            (PA_oui && enrollment_PA_oui && attestationTC === "OUI") ?
            attestationPA = "OUI" :
            (PA_oui && enrollment_PA_oui && attestationTC === "en attente") ?
            attestationPA = "en attente" :
            (PA_oui && enrollment_PA_non && attestationTC === "OUI" ||
                attestationTC === "en attente") ? attestationPA = "en attente" :
            attestationPA = "NON";

        // Attestation TC
        row.splice(6, 0, attestationTC);

        // Attestation PA
        row.splice(7, 0, attestationPA);

        row.splice(8, 0, gradeTC);

        row.splice(10, 0, cellHeader1);
        row.splice(11, 0, cellHeader2);
        row.splice(12, 0, countSpe);

        row.splice(46, 1);
    }
    data[0].splice(46, 1);

    if (checkFiles.length > 0) {
        document.getElementById('checkFiles-btn').classList.replace('hidden',
            'inline')
        document.getElementById('checkFiles-btn').classList.add('blink');
    }

    document.getElementById('checkFiles-btn').onclick = function() {
        checkFiles.unshift([data[0][0], data[0][40]]);
        exportCSVDefault(checkFiles, "erreur-fusion-fichiers");
    }

    document.getElementById('finalStandard-btn').onclick = function(e) {
        document.getElementById('tableApp-div').classList.add('hidden');
        document.getElementById('tableFinal-div').classList.remove('hidden');
        if (this.dataset.switch !== "done") {
            document.getElementById('spinnerLoadFinal-span').classList.replace(
                'hidden', 'inline');
            setTimeout(() => {
                launchFinalTable(dataFromCSV.filter(row => row[5] !==
                    ""), dataMappage);
            }, 1000);
        }
    }

    // *** EXTRA COHORTES
    buttonCohortes.onclick = function(e) {
        var selected = document.getElementById('selectCohortes-btn').value;
        var cohortesHtml = getDetailsCohortes(d3.csvParse(Papa.unparse(data)),
            selected, cohortTitle);
        setTimeout(() => {
            getExtraData("cohortes (détails)", cohortesHtml, this,
                selected);
        }, 100);
    }

    launchTab(d3.csvParse(Papa.unparse(data)), absences); // dataToTable(data, cohortes, cohortTitle);

    return true;
}

function launchTab(jsonFromCSV, absences) {
    var data = jsonFromCSV.length > 1000 ? jsonFromCSV.slice(0, 1000) :
        jsonFromCSV.slice(0, jsonFromCSV.length);
    var diff = jsonFromCSV.slice(0, jsonFromCSV.length).length - data.length;
    var headers = jsonFromCSV.columns;

    // fill select element after load
    fillOptionsSelect(headers);

    // set columns with formatters and others options
    var columns = setDataColumns(headers);



    //create Tabulator on DOM element with id "table-app"
    var table = new Tabulator("#table-app", tableOptions(data, columns));

    var headersHiddenOnStart = table.getColumns().filter(column => !column.getVisibility())
        .map(column => column.getField());
    var headersShownOnStart = table.getColumns().filter(column => column.getVisibility())
        .map(column => column.getField());
    // console.log(headersShown);

    // for large data
    replaceDataAfterLoaded(table, jsonFromCSV, diff, 1000);

    //Trigger setFilter function with correct parameters
    function updateFilter() {
        var filter = $("#filter-field").val();
        if ($("#filter-field").val() === "function") {
            $("#filter-type").prop("disabled", true);
            $("#filter-value").prop("disabled", true);
        } else {
            $("#filter-type").prop("disabled", false);
            $("#filter-value").prop("disabled", false);
        }
        table.setFilter(filter, $("#filter-type").val(), $("#filter-value").val());
    }
    //Update filters on value change
    $("#filter-field, #filter-type").change(updateFilter);
    $("#filter-value").keyup(updateFilter);
    //Clear filters on "Clear Filters" button click
    $("#filter-clear").click(function() {
        $("#filter-field").val("Student ID");
        $("#filter-type").val("like");
        $("#filter-value").val("");

        table.clearFilter();
    });

    document.getElementById('filtersHeader-clear').onclick = function(e) {
        table.clearHeaderFilter();
    }

    document.getElementById('groupBy-btn').onclick = function(e) {
        var groupValues = document.getElementById('groupBy-input').value;
        var fields = [],
            groupsNumber = [];
        if (groupValues) {
            var fields = _.compact(groupValues.split(/[\;\,\>]+/));
            fields = fields.map(header => _.trim(header)).filter(
                header => headers.indexOf(header) != -1);
            if (fields.length > 0) {
                table.setGroupBy(fields);
                this.innerHTML = '<i class="fas fa-lock"></i>'
            }
        }
    }

    document.getElementById('groupBy-btn').onmouseover = function(e) {
        var title = document.getElementById('groupBy-input').value ?
            "grouper par: " + document.getElementById('groupBy-input').value :
            "grouper par entête"
        e.target.title = title;
    };

    document.getElementById('degroupBy-btn').onclick = function(e) {
        document.getElementById('groupBy-input').value = "";
        table.setGroupBy("");
        document.getElementById('groupsNumber').innerHTML = "";
        document.getElementById('groupBy-btn').innerHTML =
            '<i class="fas fa-lock-open"></i>'
        document.getElementById('groupBy-btn').title = "grouper par entête"
    }

    document.getElementById('hide-col').onclick = function() {
        var columnNames = [];
        table.getColumns().forEach(column => {
            if (column.getVisibility())
                columnNames.push(column.getField());
        });
        createTableColumns(["", "colonnes"], columnNames, "pvtTable", table,
            "hide");
        columnNames = null;
    }

    document.getElementById('show-col').onclick = function() {
        var columnNames = [];
        table.getColumns().forEach(column => {
            if (!column.getVisibility())
                columnNames.push(column.getField());
        });
        createTableColumns(["", "colonnes"], columnNames, "pvtTable", table,
            "show");
        columnNames = null;
    }

    document.getElementById('showConcat-col').onclick = function() {
        document.getElementById('spinnerLoad-span').classList.replace(
            "hidden", "inline");
        if (this.dataset.state === "without") {
            var headersColumnsConcat = headersShownOnStart.concat(["Grade",
                "Enrollment Track", "Verification Status",
                "Enrollment Status"
            ]);
            setTimeout(() => {
                headers.forEach(header => {
                    if (headersColumnsConcat.indexOf(header) !==
                        -1) {
                        table.showColumn(header);
                    } else {
                        table.hideColumn(header);
                    }
                });
                document.getElementById('spinnerLoad-span').classList
                    .replace("inline", "hidden");
                this.firstChild.classList.replace(
                    "fa-grip-lines-vertical", "fa-grip-lines");
                this.dataset.state = "with";
                table.redraw();
            }, 10)
        } else {
            setTimeout(() => {
                headers.forEach(header => {
                    if (headersShownOnStart.indexOf(header) !==
                        -1) {
                        table.showColumn(header);
                    } else {
                        table.hideColumn(header);
                    }
                });
                document.getElementById('spinnerLoad-span').classList
                    .replace("inline", "hidden");
                this.firstChild.classList.replace("fa-grip-lines",
                    "fa-grip-lines-vertical");
                this.dataset.state = "without";
                table.redraw();
            }, 10)

        }
    }

    $("#deselectAll-rows").click(function() {
        table.deselectRow();
    });

    document.getElementById('exportCSV-btn').onclick = function(e) {
        table.download("csv", "export-grades.csv", {
            delimiter: ","
        });
    }

    document.getElementById('exportCSVComma-btn').onclick = function(e) {
        document.getElementById('spinnerLoad-span').classList.replace(
            "hidden", "inline");
        setTimeout(() => {
            var dataExport = getDataFiltered();
            dataExport.slice(1, dataExport.length).forEach(row => {
                for (var i = 0, lgi = row.length; i < lgi; i++) {
                    if (row[i].indexOf('.') !== -1 && !
                        isNaN(parseFloat(row[i])))
                        row[i] = parseFloat(row[i]).toLocaleString(
                            "fr-FR");
                }
            });
            exportCSVDefault(dataExport, "global_reportTC");
            document.getElementById('spinnerLoad-span').classList.replace(
                "inline", "hidden");
        }, 100);
    }

    var getDataFiltered = function() {
        var filteredData = table.getData(true);
        var selectedData = table.getSelectedData();
        var filterSelectedData = filteredData.filter(value => -1 !==
            selectedData.indexOf(value))

        var columnsVisible = columns.filter((column, i) => i < 38).map(
            column => column.field);

        var dataFiltered = filteredData.map(item => {
            return Object.keys(item)
                .filter(key => columnsVisible.includes(key))
                .reduce((obj, key) => {
                    obj[key] = item[key];
                    return obj;
                }, {})
        });
        var dataExport = d3.csvParseRows(Papa.unparse(dataFiltered));
        return dataExport;
    };

    setTimeout(() => {
        if (absences > 0)
            document.getElementById('absences').innerHTML = absences;
    }, 10);

    return true;
} // FIN DE LAUNCHtAB

// création simple de table html pour sweetALert pvtTable
var createTableColumns = function(headers, data, className, table, type) {
    var input0 =
        '<input type="checkbox" style="width:15px; opacity: 1; height: 1.5em; margin-top: -0.7em" id="checkAll"/>';
    var html = document.createElement("div"),
        p = document.createElement("p"),
        title = "",
        text = "",
        buttons = (type === "hide") ? {
            hide: "masquer",
            annuler: true
        } : {
            show: "afficher",
            annuler: true
        };

    var tab = '<table class="' + className +
        ' tableForSweet" style="margin:5px auto">';
    tab += '<thead><tr>';
    headers.forEach((header, i) => {
        if (i === 0) {
            tab += '<th id="th_' + i + '">' + input0 + '</th>';
        } else {
            tab += '<th id="th_' + i + '">' + header + '</th>';
        }
    });
    tab += '</tr></thead>';
    tab += '<tbody>';
    data.forEach(name => {
        tab += '<tr>';
        tab +=
            '<td><input type="checkbox" style="width:15px; opacity: 1; height: 1.5em" class="checkboxColumn" value="' +
            name + '"/></td>';
        tab += '<td>' + name + '</td>';
        tab += '</tr>';
    });
    tab += '</tbody></table>';

    html.appendChild($.parseHTML(tab)[0]);

    setTimeout(() => {
        document.getElementById('checkAll').addEventListener(
            'click',
            function(e) {
                $(':checkbox').prop('checked', this.checked);
            }, false);
    }, 10);

    swal({
            title: title,
            text: text,
            content: html,
            className: "sweetalert-auto",
            buttons: buttons,
        })
        .then((value) => {
            switch (value) {
                case "hide":
                    var inputElements = document.getElementsByClassName(
                        'checkboxColumn');
                    for (var i = 0, lgi = inputElements.length; i < lgi; ++
                        i) {
                        // console.log(inputElements[i].value);
                        if (inputElements[i].checked) {
                            table.hideColumn(inputElements[i].value);
                        }
                    }
                    swal("Terminé !", "", "success");
                    break;

                case "show":
                    var inputElements = document.getElementsByClassName(
                        'checkboxColumn');
                    for (var i = 0, lgi = inputElements.length; i < lgi; ++
                        i) {
                        if (inputElements[i].checked) {
                            table.showColumn(inputElements[i].value);
                        }
                    }
                    swal("Terminé !", "", "success");
                    break;

                default:
                    break;
            }
        });

    return true;
}

function getDetailsCohortes(data, selected, cohortTitle) {
    var nestedCohortes = d3.nest()
        .key(d => d[cohortTitle])
        .rollup(v => {
            var values = filter_array(v.map(d => (isNaN(parseFloat(d[
                selected]))) ? 0 : Math.round(parseFloat(d[
                selected]) * 100) / 100).sort());
            var participants = v.length;
            var actifs = v.filter(d => d["Grade TC"] !== "").length;

            var median = values.length >= 1 ? parseFloat(d3.median(values)) :
                0,
                min = values.length >= 1 ? parseFloat(d3.min(values)) : 0,
                max = values.length >= 1 ? parseFloat(d3.max(values)) : 0,
                avg = values.length >= 1 ? parseFloat(d3.mean(values)) : 0,
                quartileFirst = values.length > 1 ? parseFloat(d3.quantile(
                    values, 0.25)) : 0,
                quartileThird = values.length > 1 ? parseFloat(d3.quantile(
                    values, 0.75)) : 0,
                decileFirst = values.length > 1 ? parseFloat(d3.quantile(
                    values, 0.1)) : 0,
                decileLast = values.length > 1 ? parseFloat(d3.quantile(
                    values, 0.9)) : 0,
                rapportD9D1 = (decileFirst !== 0 && decileLast !== 0) ? (
                    decileLast / decileFirst) : 0,
                variance = values.length > 1 ? parseFloat(d3.variance(
                    values)) : 0,
                deviation = values.length > 1 ? parseFloat(d3.deviation(
                    values)) : 0;
            return {
                participants: participants,
                actifs: actifs,
                min: min !== 0 ? min.toFixed(2) : "",
                max: max !== 0 ? max.toFixed(2) : "",
                avg: avg !== 0 ? avg.toFixed(2) : "",
                median: median !== 0 ? median.toFixed(2) : "",
                quartileFirst: quartileFirst !== 0 ? quartileFirst.toFixed(
                    2) : "",
                quartileThird: quartileThird !== 0 ? quartileThird.toFixed(
                    2) : "",
                decileFirst: decileFirst !== 0 ? decileFirst.toFixed(2) : "",
                decileLast: decileLast !== 0 ? decileLast.toFixed(2) : "",
                rapportD9D1: rapportD9D1 !== 0 ? rapportD9D1.toFixed(2) : "",
                variance: variance !== 0 ? variance.toFixed(2) : "",
                deviation: deviation !== 0 ? deviation.toFixed(2) : ""
            };
        })
        .entries(data);

    console.log(nestedCohortes);

    var cohortesHtml = [
        ["cohorte", "participants", "actifs", "min", "max", "moyenne",
            "médiane", "1er quartile", "3ème quartile", "1er décile",
            "9ème décile", "rapport (d9/d1)", "variance", "écart-type"
        ]
    ];

    nestedCohortes.forEach(obj => {
        var k = obj.key ? obj.key : "hors cohortes";
        var v = obj.value;
        cohortesHtml.push([k, v.participants, v.actifs, v.min, v.max, v
            .avg, v.median, v.quartileFirst, v.quartileThird,
            v.decileFirst, v.decileLast, v.rapportD9D1, v.variance,
            v.deviation
        ]);
    })

    return cohortesHtml;
}

// for extra data
var getExtraData = function(extraTitle, extraDataHtml, button, selected) {
    var text;
    if (extraDataHtml.length > 1 && extraDataHtml[0].length === 2) { // p.innerHTML = extraDataHtml.map(arr => arr.join(" | ")).join(", ");
        text = (extraDataHtml.length - 1) + ' ' + extraTitle;
        var extraTable = createTableExtra(extraDataHtml.slice(1,
                extraDataHtml.length), extraDataHtml[0], "pvtTable",
            text, extraTitle);
    } else if (extraDataHtml.length > 1 && extraDataHtml[0].length >= 9) {
        // p.innerHTML = extraDataHtml.map(arr => arr.join(" | ")).join(", ");
        text = (extraDataHtml.length - 1) + ' ' + extraTitle + ' => ' +
            selected;
        var extraTable = createTableExtra(extraDataHtml.slice(1,
                extraDataHtml.length), extraDataHtml[0], "pvtTable",
            text, extraTitle);
    } else {
        p.innerHTML = "";
        html.appendChild(p);
        text = 0 + ' ' + extraTitle +
            ' trouvé (recherche par "Student ID")';
        prettyDefault(title, text, html, "success", text, extraTitle);
    }
}
