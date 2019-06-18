var allHeaders = [];
var filesNb = 0;

fileInput.onchange = function (e) {
    document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
    this.disabled = true;

    var files = [...fileInput.files];
    // files = files.sort((a, b) => b.size - a.size);
    files = files.sort(function (x, y) {
        x = regexFileNamesTemplate.test(x.name) ? x.name.match(regexFileNamesTemplate)[0] : x.name;
        y = regexFileNamesTemplate.test(y.name) ? y.name.match(regexFileNamesTemplate)[0] : y.name;
        return fileNamesTemplate[x] - fileNamesTemplate[y];
    });

    var totalSize = files.map(file => file.size).reduce((a, b) => a += b);

    let promises = [];
    let fileNames = [];
    for (var i = 0, lgi = files.length; i < lgi; i++) {
        if (regexFileNamesTemplate.test(files[i].name)) {
            promises.push(getDataFiles(files[i], fileNames));
        } else {
            return prettyDefaultReload("Information erreur", "Oups! Apparmment, il y a une erreur dans le type de titre attendu...", "warning");
        }
    }

    Promise.all(promises)
        .then(function (data) {
            if (fileNames.length <= 17) {
                document.getElementById('filesNumber').classList.remove('hidden');
                document.getElementById('filesNumber').innerHTML = fileNames.length;
                let uniqueHeaders = [...new Set([].concat(...data.map(obj => obj["headers"])))];
                tableForFiles(data, uniqueHeaders);
            } else {
                prettyDefaultReload("Information nombre fichiers", "Apparemment, il y a plus de 17 fichiers importés...", "warning");
            }
        })
        .catch(function (error) {
            console.log(error);
            prettyDefaultReload("Information erreur", "Oups! " + error, "warning");
        });
}

function getDataFiles(file, fileNames) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = (event) => {
            var textFromFileLoaded = event.target.result;
            var charset = jschardet.detect(textFromFileLoaded);

            let dataByFile = {},
                flag;
            Papa.parse(textFromFileLoaded, {
                header: true,
                dynamicTyping: true,
                // delimiter: delimiter ? delimiter[0] : "",
                skipEmptyLines: true,
                chunk: function (results, parser) {
                    flag = checkHeaders(results.meta.fields, file);
                    if (flag) {
                        dataByFile[file.name] = results.data;
                        dataByFile["headers"] = results.meta.fields;
                        resolve(dataByFile);
                    } else {
                        reject("erreur entêtes de colonnes");
                    }
                },
                complete: function (results) {
                    if (fileNames.indexOf(file.name) !== -1)
                        prettyDefaultReload("Information doublons", "Oups! Apparement au moins 1 doublons dans la sélection... " + file.name, "warning");
                    fileNames.push(file.name);
                }
            });
        };
        reader.onprogress = (event) => {
            ;
        };
        reader.readAsText(file, "UTF-8");
        filesNb++;
    });
}

function flatData(dataFiles, uniqueHeaders) {
    return new Promise(function (resolve) {
        var dataSelected = [],
            flat = [];

        if (dataFiles.length > 1) {
            dataFiles.forEach(file => {
                dataSelected.push(file[Object.keys(file)[0]].map(obj => {
                    if (regexAllSPE.test(Object.keys(file)[0]))
                        obj["filename imported"] = Object.keys(file)[0].match(regexAllSPE)[0].replace(/SPE\-/, "").replace(/[\_\d]{2}/g, '').replace(/\_/g, '');
                    return obj;
                }));
            });
        } else {
            dataSelected.push(dataFiles[0][Object.keys(dataFiles[0])[0]].map(obj => {
                if (regexAllSPE.test(Object.keys(dataFiles[0])[0]))
                    obj["filename imported"] = Object.keys(dataFiles[0])[0].match(regexAllSPE)[0].replace(/SPE\-/, "").replace(/[\_\d]{2}/g, '').replace(/\_/g, '');
                return obj;
            }));
        }

        var arrConcatened = [].concat(...dataSelected);

        var headersTemplate = {};
        uniqueHeaders.forEach((el, i) => {
            headersTemplate[el] = "";
        });
        for (var i = 0, lgi = arrConcatened.length; i < lgi; i++) {
            flat.push(Object.assign({}, headersTemplate, arrConcatened[i]));
        }

        var dataMerged = mergedDataTest(uniqueHeaders, flat).sort((a, b) => a[0] - b[0]);

        // *** traque et filtre les id vide, undefined, retour à la ligne
        var checkWrongID = function (array) {
            var headers = array[0].map(header => header.trim());
            var testCsv = [];
            array.forEach((el, i) => {
                if (i !== 0 && el[0] !== undefined && el[0] !== "" && !el[0].match(/^(\r\n|\r|\n)$/)) {
                    el[0] = el[0].trim();
                    testCsv.push(el);
                }
            })
            testCsv.unshift(headers);
            return testCsv;
        }

        dataMerged = checkWrongID(dataMerged);

        var getDataMappage = function (result) {
            var delimiter = Papa.parse(result).meta.delimiter;
            var dataResult = d3.dsvFormat(delimiter).parseRows(result, function (d) {
                if (d && d !== undefined && d[0].length !== 0) return d;
            }).sort((a, b) => a[0] - b[0]);
            var dataMappage = d3.csvParse(Papa.unparse(dataResult));

            if (dataResult !== undefined && checkProfile(dataResult)) {
                resolve({
                    flat: dataMerged,
                    dataMappage: dataMappage
                });
            }
        }

        document.getElementById('fileInputMappage').onchange = function (e) {
            this.disabled = true;
            document.getElementById('profil_info-div').classList.replace("inline", "hidden");
            document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
            var file = this.files[0];
            var reader = new FileReader();
            reader.onprogress = function (event) {};
            reader.onloadend = function (event) {};
            reader.onload = function (event) {
                getDataMappage(reader.result);
            }
            reader.readAsText(file);
        }
    })
}

function tableForFiles(dataFiles, uniqueHeaders) {
    document.getElementById('grade_report-div').classList.replace("inline", "hidden");
    document.getElementById('profil_info-div').classList.replace("hidden", "inline");
    document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
    flatData(dataFiles, uniqueHeaders)
        .then(function (data) {
            var flat = d3.csvParse(Papa.unparse(data.flat));
            var dataMappage = data.dataMappage;

            var jsonData = flat.map(function (obj, i) {
                var username;
                if (obj["Username"] && obj["Username"] !== undefined) {
                    username = (isNaN(obj["Username"])) ? obj["Username"] : (obj["Username"]).toString();
                }
                var resultName = dataMappage.find(item => item.username === username);
                var resultMail = dataMappage.find(item => item.email === obj["Email"]);
                (resultName === undefined || resultMail === undefined) ? obj["Name"] = "": obj["Name"] = resultName.name;
                var resultId = dataMappage.find(item => item.id === obj["Student ID"]);
                if (resultId === undefined) {
                    obj["Name"] = "Absent sur profile_info";
                } else {
                    obj["Name"] = resultId.name;
                    obj["year_of_birth"] = (resultId.year_of_birth) ? resultId.year_of_birth : "";
                }
                return sortObjectKeys(obj, headersTemplate);
            });
            globalReport(jsonData, dataMappage);

        }).catch(function (error) {
            console.log(error);
            swal({
                title: "Information error",
                text: error.toString(),
                icon: "warning"
            });
        });
}

/* HELPERS imported files */
function mergedDataTest(headers, data) {
    var selected = document.getElementById('filter-field').value;

    headers.push("fichiers fusionnés");
    headers.push("Grade_TC");

    var jsonData = d3.csvParse(Papa.unparse(data));

    var headersTemplate = {};
    headers.forEach((el, i) => {
        headersTemplate[el] = "";
    });

    var merged = [];
    var nestedData = d3.nest()
        .key(d => d["Student ID"])
        .rollup(v => {
            var arr = v.map(obj => [].concat.call([], Object.values(obj)));
            arr.unshift(headers);
            return {
                arr: arr
            };
        })
        .entries(jsonData);

    for (var i = 0, lgi = nestedData.length; i < lgi; i++) {
        var item = nestedData[i],
            values = item.value.arr;
        var obj = {},
            uniqueValues;
        headers.forEach((key, i) => {
            if (key === "Grade" || key === "Enrollment Track" || key === "Enrollment Status" || key === "fichiers fusionnés" || key === "Grade_TC") {
                obj[key] = dataByColumn(values.slice(1, values.length), i);
                (obj["fichiers fusionnés"] !== undefined && obj["fichiers fusionnés"].length > 0 && obj["fichiers fusionnés"][0] === "TC") ?
                obj["Grade_TC"] = obj["Grade"][0]: obj["Grade_TC"] = "";
            } else {
                obj[key] = [...new Set(dataByColumn(values.slice(1, values.length), i))];
            }
        });
        merged.push(Object.assign({}, headersTemplate, obj));
    }

    var dataMerged = d3.csvParseRows(Papa.unparse(merged));

    return dataMerged;
}

function dataByColumn(arr, col) {
    var column = [],
        value;
    for (var i = 0, lgi = arr.length; i < lgi; i++) {
        value = arr[i][col];
        column.push(value);
    }
    return filter_array(column);
}

// classe en fonction dans modèles ici headersTemplate
function sortObjectKeys(obj, keys) {
    return keys.reduce((acc, key) => {
        var index = keys.indexOf(key);
        acc[key] = obj[key];
        return acc;
    }, {});
}

function checkHeaders(headers, file) {
    var flag;
    headers.forEach(function (title, i) {
        var headersElement = headersTemplate[headersTemplate.indexOf(title.trim())];
        if (headersTemplate.indexOf(title.trim()) === -1) {
            var html = document.createElement("div");
            var p = document.createElement("p");
            title = (title && title !== (' ')) ?
                title :
                "au moins une colonne ou un entête vide";
            p.innerHTML = '<h4 Fichier concerné:<br><b>' + file.name + '</b><br><br>Entête concerné:<br><b>' + title + '</b></h4><hr>';
            p.innerHTML += '<h4 style="color:red"> <i class="fa fa-warning"></i><br>entêtes en cours au ' + new Date().toLocaleDateString() + '</h4><br><br>';
            p.innerHTML += JSON.stringify(headersTemplate.map(header => "[" + header + "]").join(", "));
            html.appendChild(p);
            prettyDefaultControl("Contrôle entête de colonnes", "Oups! Apparemment, un entête de colonne n'est pas conforme au modèle attendu... ",
                html, "warning");
            flag = false;
        } else {
            flag = true;
        }
    });
    return flag;
}

function checkProfile(data) {
    var flag = true;
    data[0].slice(0, 4).forEach(el => {
        if (headersProfile.indexOf(el) === -1) flag = false;
    });
    if (!flag)
        swal({
            title: "Fichier profile_info",
            text: "Un des champs en entête des 4 premières colonnes ne correspond pas au champs attendus dans l'ordre suivant:\n[id] [username] [name] [email]",
            icon: "warning"
        }).then(value => {
            document.getElementById('profil_info-div').firstElementChild.classList.replace('normal', 'labelProfile');
            $('.fa-arrow-alt-circle-right').addClass('blink');
            document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
            document.getElementById('fileInputMappage').disabled = false;
        });
    return flag;
}