document.addEventListener('touchstart', function addtouchclass(e) { // first time user touches the screen
    document.documentElement.classList.add('can-touch') // add "can-touch" class to document root using classList API
    document.removeEventListener('touchstart', addtouchclass, false) // de-register touchstart event
}, false)

window.addEventListener('load', function() {
    document.getElementById('main_div').style.display = 'block';
})

const format2dec = d3.format(".2f");
const formatPercent = d3.format(".0%");

// créer un nouveau format pour les colonnes
Tabulator.prototype.extendModule("format", "formatters", {
    numberfmt: function(cell, formatterParams) {
        var cellFormatted;
        if ((/\,/g).test(cell.getValue())) {
            cellFormatted = cell.getValue().split(",").map(val =>
                isNaN(parseFloat(val)) ? "" : formatPercent(
                    parseFloat(val))).join(", ");
        } else {
            cellFormatted = isNaN(parseFloat(cell.getValue())) ?
                cell.getValue() : formatPercent(parseFloat(cell.getValue()))
        }
        return cellFormatted;
    },
    checkfiles: function(cell, formatterParams) {
        var cellValue = cell.getValue();
        return cellValue;
    }
});

// options for table
function tableOptions(data, columns) {
    var footerContent = '<div class="footerInfo"> ';
    footerContent +=
        '<a type="button" href="https://github.com/olifolkerd/tabulator" target="_blank" style="margin-right: 3em; padding: 2px 5px; font-weight: 900">Tabulator</a>'
    footerContent += 'lignes: <span id="rowsTotal" style="font-weight: 900">' +
        data.length + '</span>';
    footerContent +=
        '<span style="margin-left: 1em">colonnes: </span><span id="columnsTotal" style="font-weight: 900">' +
        columns.length + '</span>';
    footerContent += '<div style="margin-left: 4em;" class="inline">';
    footerContent +=
        '<span>lignes: </span><span id="rowsCount" style="font-weight: 900"></span> (filtrée.s)';
    footerContent +=
        '<span style="margin-left: 2em">sélection: </span><span id="rowSelected" style="font-weight: 900"></span> (ligne.s)';
    footerContent +=
        '<span style="margin-left: 2em">total absence.s: </span><span id="absences" style="font-weight: 900; color:red"></span>';
    footerContent += '</div><div style="margin-left: 4em;" class="inline">';
    footerContent +=
        '<span style="margin-left: 2em">groupe.s: </span><span id="groupsNumber" style="font-weight: 900"></span>'
    footerContent += '</div></div>';

    return {
        selectable: true,
        height: Math.round(window.innerHeight) - 50,
        data: data,
        reactiveData: true,
        tooltipsHeader: true,
        columns: columns,
        pagination: "local",
        paginationSize: 100,
        movableColumns: true,
        footerElement: footerContent,
        history: true,
        tooltips: true,
        placeholder: "Aucune donnée disponible",
        groupToggleElement: "header",
        initialSort: [{
            column: "Student ID",
            dir: "asc"
        }, ],
        rowClick: function(e, row) {},
        rowSelectionChanged: function(data, rows) {
            document.getElementById('rowSelected').innerHTML = data.length;
        },
        dataFiltered: function(filters, rows) {
            document.getElementById('rowsCount').innerHTML = rows.length;
        },
        groupStartOpen: function(value, count, data, group) {
            return false;
        },
        groupHeader: function(value, count, data, group) {
            var groupByHeader = document.getElementById('groupBy-input').value;
            var groupTitle;
            var subGroups = group.getSubGroups();
            if (subGroups.length === 0) {
                groupTitle =
                    "<span style='color:#0000FFFF; margin-right: 5px;' title='clic droit pour export'>" +
                    groupByHeader + "</span> : " + value +
                    "<span style='color:#d00; margin-left:10px;'>(" + count +
                    " item)</span>";
            } else {
                groupTitle =
                    "<span style='color:#0000FFFF; margin-right: 5px;'>" +
                    groupByHeader + "</span> : " + value +
                    "<span style='color:#d00; margin-left:10px;'>(" + count +
                    " item)</span>";
            }
            return groupTitle;
        },
        groupContext: function(e, group) {
            e.preventDefault();
            var inputGroup = document.getElementById('groupBy-input').value;
            var fields = inputGroup.split('>').map(el => el.trim());
            var subGroups = group.getSubGroups();
            var groupElement = group.getElement();
            var columnsVisible = [];
            group.getTable().getColumns().forEach(column => {
                if (column.getVisibility())
                    columnsVisible.push(column.getField());
            });
            var rowsData = [];
            if (subGroups.length === 0) {
                var rows = group.getRows().forEach(row => {
                    rowsData.push(rowsDataVisible(columnsVisible,
                        row.getData()));
                });
                var parentGroup = fields;
                var key = group.getKey();
                rowsData = d3.csvParseRows(Papa.unparse(rowsData));
                exportCSVDefault(rowsData, fields.join('_') + "_" + key);
            } else {
                groupElement.classList.add("shaker");
                setTimeout(() => {
                    groupElement.classList.remove("shaker");
                }, 400);
            }
        }
    }
}

function rowsDataVisible(columnsVisible, rowData) {
    var obj = {};
    for (var key in rowData) {
        if (columnsVisible.indexOf(key) !== -1) {
            obj[key] = rowData[key];
        }
    }
    return obj;
}

function setDataColumns(headersColumns) {
    var columns = [],
        name;
    headersColumns.forEach((column, i) => {
        name = columnName(column);
        if (column === headersColumns[0]) {
            columns.push({
                id: i,
                title: name,
                field: column,
                frozen: true,
                headerFilter: "input",
                headerFilterPlaceholder: "...",
                cellContext: function(e, cell) {
                    var rowData = Object.entries(cell.getRow()
                        .getData());
                    createTable(["entête", "valeur"],
                        rowData, "pvtTable");
                    e.preventDefault();
                },
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (column === headersColumns[1]) {
            columns.push({
                id: i,
                title: name,
                field: column,
                frozen: true,
                width: 150,
                headerFilter: "input",
                headerFilterPlaceholder: "...",
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (column === headersColumns[2]) {
            columns.push({
                id: i,
                title: name,
                field: column,
                visible: false,
                headerFilter: "input",
                headerFilterPlaceholder: "...",
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (column === headersColumns[3] || column ===
            headersColumns[4]) {
            columns.push({
                id: i,
                title: name,
                field: column,
                width: 150,
                headerFilter: "input",
                headerFilterPlaceholder: "...",
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i === 9) {
            columns.push({
                id: i,
                title: name,
                field: column,
                formatter: "numberfmt",
                headerFilter: "input",
                headerFilterPlaceholder: "...",
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i > 12 && i < 18) {
            columns.push({
                id: i,
                title: name,
                field: column,
                visible: false,
                formatter: "numberfmt",
                headerFilter: "number",
                headerFilterPlaceholder: ">=",
                headerFilterFunc: ">=",
                headerFilterParams: {
                    min: 0,
                    max: 1,
                    step: 0.01
                },
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i === 12) { // nb SPE validées
            columns.push({
                id: i,
                title: name,
                field: column,
                headerFilter: "input",
                headerFilterPlaceholder: "< <= = >= >",
                headerFilterFunc: customHeaderFilter,
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i === 8 || i === 18) { // nb SPE validées
            columns.push({
                id: i,
                title: name,
                field: column,
                formatter: "numberfmt",
                headerFilter: "input",
                headerFilterPlaceholder: "< <= = >= >",
                headerFilterFunc: customHeaderFilter,
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i > 18 && i <= 38) {
            columns.push({
                id: i,
                title: name,
                field: column,
                formatter: "numberfmt",
                visible: false,
                headerFilter: "number",
                headerFilterPlaceholder: ">=",
                headerFilterFunc: ">=",
                headerFilterParams: {
                    min: 0,
                    max: 1,
                    step: 0.01
                },
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i > 38 && i < 45) {
            columns.push({
                id: i,
                title: name,
                field: column,
                visible: false,
                headerFilter: "input",
                headerFilterPlaceholder: "...",
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i === headersColumns.length - 1) {
            columns.push({
                id: i,
                title: name,
                field: column,
                headerFilter: "input",
                headerFilterPlaceholder: "...",
                formatter: "checkfiles",
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else {
            columns.push({
                id: i,
                title: name,
                field: column,
                headerFilter: "input",
                headerFilterPlaceholder: "...",
                headerContext: function(e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        }
    })
    return columns;
}

function customHeaderFilter(headerValue, rowValue, rowData, filterParams) {
    var accept = (value, motif) => value.replace(motif, "").trim();
    if (/(\>\=)/.test(headerValue)) {
        return +rowValue >= +accept(headerValue, ">=");
    } else if (/(\<\=)/.test(headerValue)) {
        return +rowValue <= +accept(headerValue, "<=");
    } else if (/(\!\=)/.test(headerValue)) {
        return +rowValue != +accept(headerValue, "!=");
    } else if (/\>(?!=)/.test(headerValue)) {
        return +rowValue > +accept(headerValue, ">");
    } else if (/\<(?!=)/.test(headerValue)) {
        return +rowValue < +accept(headerValue, "<");
    } else if (/(?<!\<|>)\=(?!\>)/.test(headerValue)) {
        return +rowValue === +accept(headerValue, "=");
    } else {
        return false
    }
    return true;
}

function groupByField(field) {
    var fieldValues = (document.getElementById('groupBy-input').value) ? (
            document.getElementById('groupBy-input').value + ' > ' + field) :
        field;
    document.getElementById('groupBy-input').value = fieldValues.replace(
        /^[\s\>]/, "");
}

function replaceDataAfterLoaded(table, data, diff, timer) {
    if (diff > 1000) {
        setTimeout(() => {
            table.replaceData(data)
                .then(function() {
                    document.getElementById('rowsTotal').innerHTML =
                        data.length;
                    console.log('replaceData done!');
                    document.getElementById('spinnerLoad-span').classList
                        .replace("inline", "hidden");
                    document.getElementById('filesNumber').classList
                        .add('hidden');
                    document.getElementById('guide-btn').classList.remove(
                        'hidden');
                })
                .catch(function(error) {
                    console.log(error);
                });
        }, timer);
    } else {
        document.getElementById('spinnerLoad-span').classList.replace("inline",
            "hidden");
        document.getElementById('filesNumber').classList.add('hidden');
        document.getElementById('guide-btn').classList.remove('hidden');
        console.log('table done!');
    }
}

/* HELPERS */
function columnName(name) {
    regexEvalHebdo
    if (regexHeadersSPE.test(name)) {
        return name.match(regexHeadersSPE)[0].replace(/\s\-/, "");
    } else if (regexEvalHebdo.test(name)) {
        return name.match(regexEvalHebdo)[0].replace(/\:/, "");
    } else if (regexLivrable.test(name)) {
        return name.match(regexLivrable)[0].replace(/\:/, "");
    } else {
        return name;
    }
}

function fillOptionsSelect(columns) {
    columns.forEach(option => {
        $('#filter-field').append('<option value="' + option +
            '" style="max-width:100px;">' + columnName(option) +
            '</option>');
    });

    ["like", "=", "<", "<=", ">", ">=", "!="].forEach(option => {
        $('#filter-type').append('<option value="' + option +
            '" style="max-width:100px;">' + option + '</option>');
    });
}

function replaceNotAttempted(data) {
    var pattern = /Not Attempted|Not Available/g;
    data.forEach(obj => {
        for (var key in obj) {
            if (pattern.test(obj[key]))
                obj[key] = obj[key].replace(pattern, '');
        }
    })
}

function commaToPoint(row) {
    var regexTags = /(<([^>]+)>)/ig;
    var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var newRow = [];
    for (var j = 0, lgj = row.length; j < lgj; j++) {
        if (isNaN(Number(row[j])) && patternComma.test(row[j]) && !patternPoint
            .test(row[j])) {
            row[j] = parseFloat(row[j].replace(/\,/, ".")).toLocaleString(
                'en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
        } else if (row[j] === "0" || row[j] === " ") {
            row[j] = "";
        } else if (row[j] === "Not Attempted" || row[j] === "Not Available") {
            row[j] = "";
        } else {
            row[j] = row[j].replace(regexTags, "");
        }
        newRow.push(row[j]);
    }
    return newRow;
}

function pointToComma_FR(d) {
    return (isNaN(parseFloat(d))) ? d : parseFloat(d).toLocaleString("fr-FR");
}

// Remove null, 0, blank, false, undefined and NaN values from an array
function filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];
    while (++index < arr_length) {
        var value = test_array[index];

        if (value) {
            result[++resIndex] = value;
        }
    }
    return result;
}

// export du fichier csv avec fileSaver.js
function exportCSVDefault(data, filename) {
    var dataPointToCSV = Papa.unparse(data);
    var BOM = "\uFEFF";
    var csvDataPoint = BOM + dataPointToCSV;
    var blob = new Blob([csvDataPoint], {
        type: "text/csv;charset=utf-8"
    });
    saveAs(blob, filename + ".csv");
}

/* SWEET ALERT and CREATE TABLE */
function prettyDefault(title, text, html, icon, className) {
    swal({
        title: title,
        text: text,
        content: html,
        icon: icon,
        className: className
    }).then(value => {});
}

function prettyDefaultReload(title, text, icon) {
    swal({
        title: title,
        text: text,
        icon: icon
    }).then(value => {
        setTimeout(() => window.location.href = window.location.href,
            10);
    });
}

function prettyDefaultControl(title, text, html, icon) {
    swal({
        title: title,
        text: text,
        content: html,
        icon: icon,
        className: "sweetalert-lg"
    }).then(value => {
        setTimeout(() => window.location.href = window.location.href,
            10);
    });
}

// création simple de table html pour sweetALert pvtTable
function createTable(headers, data, className) {
    var html = document.createElement("div"),
        p = document.createElement("p"),
        title = "Info participant",
        text = "";
    var table = '<table class="' + className +
        ' tableForSweet" style="margin:5px auto">';
    table += '<thead><tr>';
    headers.forEach(header => {
        table += '<th>' + header + '</th>';
    });
    table += '</tr></thead>';
    table += '<tbody>';
    data.forEach(row => {
        table += '<tr>';
        table += '<td>' + row[0] + '</td>';
        table += '<td>' + row[1] + '</td>';
        table += '</tr>';
    });
    table += '</tbody></table>';

    html.appendChild($.parseHTML(table)[0]);
    swal({
            title: title,
            text: text,
            content: html,
            className: "sweetalert-auto",
            buttons: {
                export: "export CSV",
                annuler: true,
            },
        })
        .then((value) => {
            switch (value) {
                case "export":
                    data.unshift(headers)
                    exportCSVDefault(data, "participant_info")
                    break;

                default:
                    break;
            }
        });

    return true;
}

// création simple de table html pour sweetALert pvtTable
function createTableExtra(data, headers, className, text, extraTitle) {
    var html = document.createElement("div"),
        p = document.createElement("p"),
        title = extraTitle,
        dataExport;

    var table = '<table class="' + className +
        ' tableForSweet" style="margin:5px auto">';
    table += '<thead><tr>';
    headers.forEach(header => {
        table += '<th>' + header + '</th>';
    });
    table += '</tr></thead>';
    table += '<tbody>';
    data.forEach(row => {
        table += '<tr>';
        row.forEach(cell => {
            table += '<td>' + cell + '</td>';
        })
        table += '</tr>';
    });
    table += '</tbody></table>';
    html.appendChild($.parseHTML(table)[0]);

    swal({
            title: title,
            text: text ? text : "",
            content: html,
            className: "sweetalert-auto",
            buttons: {
                export: "export CSV",
                annuler: true,
            },
        })
        .then((value) => {
            switch (value) {
                case "export":
                    dataExport = data.map(row => row.map(d =>
                        pointToComma_FR(d)));
                    dataExport.unshift(headers)
                    exportCSVDefault(dataExport, title)
                    break;

                default:
                    break;
            }
        });
    return true;
}
