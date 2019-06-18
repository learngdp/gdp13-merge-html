function prepareFinalStandard(data, dataMappage) {
    // IMPORTANT : BIEN CONSERVER L'ORDRE DANS "headersStandard" qui est ensuite repris dans l
    var headersStandard = [
        "Student ID",
        "Email",
        "Étudiant",
        "Mail d'inscription",
        "Cohorte",
        "Classique",
        "Avancé",
        "S1 (%)", "S1 (/20)",
        "S2 (%)", "S2 (/20)",
        "S3 (%)", "S3 (/20)",
        "S4 (%)", "S4 (/20)",
        "Examen Final (%)", " Examen Final (/20)",
        "Devoir 1 (%)", "Devoir 1 (/20)",
        "Devoir 2 (%)", "Devoir 2 (/20)",
        "Devoir 3 (%)", "Devoir 3 (/20)",
        "Diagnostic de Fonctionnement Système\n01 - DFS (%)",
        "Diagnostic de Fonctionnement Système\n01 - DFS (/20)",
        "Management Créativité & Brainstorming\n02 - MCB (%)",
        "Management Créativité & Brainstorming\n02 - MCB (/20)",
        "Management d'Équipe-Projet\n03 - MEP (%)",
        "Management d'Équipe-Projet\n03 - MEP (/20)",
        "Outils Informatiques & Évaluation Financière\n04 - IEF (%)",
        "Outils Informatiques & Évaluation Financière\n04 - IEF (/20)",
        "Certification professionnelle PMI®\n05 - PMI (%)",
        "Certification professionnelle PMI®\n05 - PMI (/20)",
        "Analyse Fonctionnelle\n06 - AF (%)",
        "Analyse Fonctionnelle\n06 - AF (/20)",
        "Analyse Stratégique\n07 - AS (%)",
        "Analyse Stratégique\n07 - AS (/20)",
        "Évaluation d'Impact des Projets\n08 - EIP (%)",
        "Évaluation d'Impact des Projets\n08 - EIP (/20)",
        "Planification Avancée\n09 - PAV (%)",
        "Planification Avancée\n09 - PAV (/20)",
        "Management Visuel de Projet\n10 - MVP (%)",
        "Management Visuel de Projet\n10 - MVP (/20)",
        "Gestion de Projet Agile avec Scrum\n11 - GPAS (%)",
        "Gestion de Projet Agile avec Scrum\n11 - GPAS (/20)",
        "Méthode de Résolution de Problèmes\n12 - MRP (%)",
        "Méthode de Résolution de Problèmes\n12 - MRP (/20)",
        "Résolution Créative de Problèmes : TRIZ\n13 - TRIZ (%)",
        "Résolution Créative de Problèmes : TRIZ\n13 - TRIZ (/20)",
        "Gestion De Crise\n14 - G2C (%)",
        "Gestion De Crise\n14 - G2C (/20)",
        "Action Entrepreneuriale\n15 - PAE (%)",
        "Action Entrepreneuriale\n15 - PAE (/20)",
        "Nombre\nmodules réussis",
        "Meilleur\nmodule réussi 1",
        "Meilleur\nmodule réussi 2",
        "Causes Échec\n(PC & PA) Modules",
        "Causes Échec\n(PC ) Moyenne Quiz",
        "Causes Échec\n(PC & PA) Examen final",
        "Causes Échec\n(PA) Moyenne Quiz & Devoirs",
        "Causes Échec\n(PA) Devoirs"
    ];

    var headersSpe = [data[0].slice(17, 32)];

    var dataSpec = data.slice(1, data.length).sort(function(a, b) {
        return a[0] - b[0];
    });

    // Test pour vérifier le format décimal dans le jeu de données... à optimiser
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var patternComma = /^[0-9]+([,][0-9]+)?%?$/;

    var number_test = n => (n - Math.floor(n) !== 0) ? true : false;

    var testComma = [].concat.apply([], dataSpec.map(function(el) {
        return el.filter(function(el) {
            return patternPoint.test(el) && number_test(el.valueOf()) &&
                Number.isInteger(parseInt(el));
        });
    }));

    var rangeSpe = dataSpec.map((row) => row.slice(17, 32).map((el) => (isNaN(
        parseFloat(el))) ? 0 : parseFloat(el)));
    var rangeClassic = dataSpec.map((row) => row.slice(7, 11).map((el) => (
        isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var examenFinal = dataSpec.map((row) => row.slice(12, 13).map((el) => (
        isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var rangeDevoirs = dataSpec.map((row) => row.slice(13, 16).map((el) => (
        isNaN(parseFloat(el))) ? 0 : parseFloat(el)));

    var name, cohorte, countSpe, classic2Modules, classic3devoirs;
    var pass70 = 0.70;

    // // if (testComma.length > 0) {
    for (var i = 0, lgi = dataSpec.length; i < lgi; i++) {

        // valeurs avant splice
        name = dataSpec[i][3];
        cohorte = dataSpec[i][5];

        // console.log(dataSpec[i]);

        // nombre spr réussies
        countSpe = rangeSpe[i].filter(el => el >= pass70).length;

        // 2 meilleures spécialisations
        var max1 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader1 = (max1 >= pass70 && rangeSpe[i].indexOf(max1) !== -1) ?
            headersSpe[0][rangeSpe[i].indexOf(max1)] : "";
        if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1)
            rangeSpe[i].splice(rangeSpe[i].indexOf(max1), 1, 0);

        var max2 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader2 = (max2 >= pass70 && rangeSpe[i].indexOf(max2) !== -1) ?
            headersSpe[0][rangeSpe[i].indexOf(max2)] : "";
        if (cellHeader2 === cellHeader1)
            cellHeader2 = "";

        cellHeader1 = regexHeadersSPE.test(cellHeader1) ? cellHeader1.match(
            regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader1;
        cellHeader2 = regexHeadersSPE.test(cellHeader2) ? cellHeader2.match(
            regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader2;

        // Ajout colonne vide pour mappage nom
        var checkEmail = dataMappage.find(item => {
            return item.id === dataSpec[i][0];
        });
        // console.log(checkEmail);
        (checkEmail && checkEmail !== undefined) ? checkEmail = checkEmail.email:
            checkEmail = "";

        // ajout colonnes email pour mappage mail inscription
        dataSpec[i].splice(2, 1, name);
        dataSpec[i].splice(3, 1, checkEmail);
        dataSpec[i].splice(4, 1, cohorte);

        // réussite classique et avancée
        classic2Modules = ((d3.sum(rangeClassic[i]) / 4) >= pass70 &&
                examenFinal[i][0] >= pass70 && countSpe >= 2) ?
            dataSpec[i].splice(5, 1, "OUI") : dataSpec[i].splice(5, 1, "NON");
        classic3devoirs = ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) /
                7 >= pass70 && examenFinal[i][0] >= pass70 && countSpe >= 2) ?
            dataSpec[i].splice(6, 1, "OUI") : dataSpec[i].splice(6, 1, "NON");

        // Quiz 1 à 4 : note sur 100 (%) et note sur (/20)
        (isNaN(parseFloat(dataSpec[i][7]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][7] * 100).toFixed(2)) +
                '%'); // 100 (%)
        (isNaN(parseFloat(dataSpec[i][7]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][7] * 100) / 5).toFixed(
                2))); // (/20)

        (isNaN(parseFloat(dataSpec[i][8]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][8] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][8]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][8] * 100) / 5).toFixed(
                2)));

        (isNaN(parseFloat(dataSpec[i][9]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][9] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][9]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][9] * 100) / 5).toFixed(
                2)));

        (isNaN(parseFloat(dataSpec[i][10]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][10] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][10]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][10] * 100) / 5).toFixed(
                2)));

        // examen final
        (isNaN(parseFloat(dataSpec[i][12]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][12] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][12]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][12] * 100) / 5).toFixed(
                2)));

        // devoirs de 1 à 3
        (isNaN(parseFloat(dataSpec[i][13]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][13] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][13]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][13] * 100) / 5).toFixed(
                2)));

        (isNaN(parseFloat(dataSpec[i][14]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][14] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][14]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][14] * 100) / 5).toFixed(
                2)));

        (isNaN(parseFloat(dataSpec[i][15]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][15] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][15]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][15] * 100) / 5).toFixed(
                2)));

        // specialisations
        (isNaN(parseFloat(dataSpec[i][17]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][17] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][17]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][17] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][18]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][18] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][18]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][18] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][19]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][19] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][19]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][19] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][20]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][20] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][20]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][20] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][21]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][21] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][21]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][21] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][22]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][22] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][22]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][22] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][23]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][23] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][23]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][23] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][24]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][24] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][24]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][24] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][25]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][25] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][25]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][25] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][26]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][26] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][26]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][26] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][27]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][27] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][27]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][27] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][28]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][28] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][28]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][28] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][29]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][29] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][29]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][29] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][30]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][30] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][30]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][30] * 100) / 5).toFixed(
                2)));
        (isNaN(parseFloat(dataSpec[i][31]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat(dataSpec[i][31] * 100).toFixed(2)) +
                '%');
        (isNaN(parseFloat(dataSpec[i][31]))) ? dataSpec[i].push(""): dataSpec[i]
            .push(pointToComma_FR(parseFloat((dataSpec[i][31] * 100) / 5).toFixed(
                2)));

        // // suppression des colonnes
        dataSpec[i].splice(7, 34);

        // nombre spe réussi
        (countSpe) ? dataSpec[i].push(countSpe.toFixed(0)): dataSpec[i].push("");

        // 2 meilleures spécialisations
        dataSpec[i].push(cellHeader1);
        dataSpec[i].push(cellHeader2);

        // cause échec
        (countSpe && countSpe >= 2) ? dataSpec[i].push(""): dataSpec[i].push(
            "< 2");
        ((d3.sum(rangeClassic[i]) / 4) >= pass70) ? dataSpec[i].push(""):
            dataSpec[i].push("< 70%");
        (examenFinal[i][0] >= pass70) ? dataSpec[i].push(""): dataSpec[i].push(
            "< 70%");
        ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) / 7 >= pass70) ?
        dataSpec[i].push(""): dataSpec[i].push("< 70%");
        (rangeDevoirs[i].filter(el => el !== 0).length === 3) ? dataSpec[i].push(
            ""): dataSpec[i].push("< 3");
    }
    const dataComplete = data.slice(0);
    var dataFinalTable = dataComplete;
    dataFinalTable.splice(0, 1);
    dataFinalTable.map(row => commaToPoint(row));
    dataFinalTable.unshift(headersStandard);

    return d3.csvParse(Papa.unparse(dataFinalTable));
}

function launchFinalTable(data, dataMappage) {
    var regexPercentage = /^\d{1,3}\%/g;
    var finalPointToComma_FR = (d) => {
        if (regexPercentage.test(d)) {
            return d;
        } else if (!isNaN(parseFloat(d)) && !regexPercentage.test(d)) {
            return parseFloat(d).toLocaleString("fr-FR");
        } else {
            return d;
        }
    };

    var jsonData = prepareFinalStandard(data, dataMappage);

    var absences = 0;
    jsonData.forEach(row => {
        if (row["Étudiant"] === "Absent sur profile_info")
            absences++;
    });

    var classByColumn = function(arr, col) {
        var column = [],
            value;
        for (var i = 1, lgi = arr.length; i < lgi; i++) {
            value = $.isNumeric(arr[i][col]) ? arr[i][col] : 0;
            column.push(value);
        }
        return filter_array(column);
    }

    var headers = jsonData.columns;


    var headersIds = headers.filter((header, i) => i >= 0 && i <= 4);
    var headersAttestation = headers.filter((header, i) => i >= 5 && i < 7);
    var headersPC = headers.filter((header, i) => i >= 7 && i < 15);
    var headersExFinal = headers.filter((header, i) => i >= 15 && i < 17);
    var headersPA = headers.filter((header, i) => i >= 17 && i < 23);
    var headersSpe = headers.filter((header, i) => i >= 23 && i < 53);
    var headersSpeReussi = headers.filter((header, i) => i >= 53 && i < 56);
    var headersEchecs = headers.filter((header, i) => i >= 56 && i <= 60);

    var headersGroups = [{
            title: "Informations participants",
            columns: headersIds
        }, // 2
        {
            title: "Attestation",
            columns: headersAttestation
        }, // 3
        {
            title: "Parcours Classique (PC)",
            columns: headersPC
        }, // 4
        {
            title: "Examen Final",
            columns: headersExFinal
        }, // 5
        {
            title: "Parcours Avancé (PA)",
            columns: headersPA
        }, // 6
        {
            title: "Modules de Spécialisation",
            columns: headersSpe
        }, // 7
        {
            title: "Modules réussis",
            columns: headersSpeReussi
        }, // 8
        {
            title: "Causes Échec",
            columns: headersEchecs
        } // 9
    ];

    var groupsTitle = [
        "Informations participants",
        "Attestation",
        "Parcours Classique (PC)",
        "Examen Final",
        "Parcours Avancé (PA)",
        "Modules de Spécialisation",
        "Modules réussis",
        "Causes Échec"
    ];

    var selectGroups = $('#groupsColumns-btn');
    selectGroups.find('option').remove();

    for (var i = 0, lgi = groupsTitle.length; i < lgi; i++) {
        selectGroups.append('<option value="' + groupsTitle[i] + '">' +
            groupsTitle[i] + '</option>')
    }

    var groupsToFilters = {
        "Informations participants": headersIds,
        "Attestation": headersAttestation,
        "Parcours Classique (PC)": headersPC,
        "Examen Final": headersExFinal,
        "Parcours Avancé (PA)": headersPA,
        "Modules de Spécialisation": headersSpe,
        "Modules réussis": headersSpeReussi,
        "Causes Échec": headersEchecs
    }

    var setDataColumns = function(headersGroups) {
        var groupsColumns = [];

        headersGroups.forEach((group, i) => {
            var columnByGroup = [],
                columnType,
                type;

            if (i === 0) {
                group.columns.forEach((header, j) => {
                    groupsColumns.push({
                        id: i,
                        title: header,
                        field: header,
                        frozen: true,
                        visible: header ===
                            "Étudiant" || header ===
                            "Cohorte" ? true : false,
                        headerFilter: "input",
                        headerFilterPlaceholder: "...",
                        cellContext: j === 0 ?
                            function(e, cell) {
                                var rowData =
                                    Object.entries(
                                        cell.getRow()
                                        .getData());
                                // console.log(["entête", "valeur"], rowData, "pvtTable");
                                createTable([
                                        "entête",
                                        "valeur"
                                    ], rowData,
                                    "pvtTable");
                                e.preventDefault();
                            } : false
                    });
                });
            } else if (i === 1) {
                groupsColumns.push({
                    title: group.title,
                    columns: [{
                        title: "<span style='color:red'>TC + 2 modules</span>",
                        columns: [{
                            id: 0,
                            title: group.columns[
                                0],
                            field: group.columns[
                                0],
                            headerFilter: "input",
                            headerFilterPlaceholder: "...",
                        }]
                    }, {
                        title: "<span style='color:red'>Classique + 3 devoirs</span>",
                        columns: [{
                            id: 1,
                            title: group.columns[
                                1],
                            field: group.columns[
                                1],
                            headerFilter: "input",
                            headerFilterPlaceholder: "...",
                        }]
                    }]
                });
            } else if (i === 2) {
                group.columns.forEach(header => {
                    columnByGroup.push({
                        id: i,
                        title: header,
                        field: header,
                        visible: false,
                        headerFilter: "input",
                        headerFilterPlaceholder: (
                                type === "number") ?
                            "< <= = >= >" : "...",
                        headerFilterFunc: (type ===
                                "number") ?
                            customHeaderFilter : false,
                    });

                });
                groupsColumns.push({
                    title: group.title,
                    columns: [{
                        title: "<span style='color:red'>70 % minimum</span>",
                        columns: columnByGroup
                    }]

                });
            } else if (i === 3) {
                group.columns.forEach(header => {
                    columnByGroup.push({
                        id: i,
                        title: header,
                        field: header,
                        headerFilter: "input",
                        headerFilterPlaceholder: (
                                type === "number") ?
                            "< <= = >= >" : "...",
                        headerFilterFunc: (type ===
                                "number") ?
                            customHeaderFilter : false,
                    });

                });
                groupsColumns.push({
                    title: group.title,
                    columns: [{
                        title: "<span style='color:red'>70 % minimum</span>",
                        columns: columnByGroup
                    }]

                });
            } else if (i === 4) {
                group.columns.forEach(header => {
                    columnByGroup.push({
                        id: i,
                        title: header,
                        field: header,
                        visible: false,
                        headerFilter: "input",
                        headerFilterPlaceholder: (
                                type === "number") ?
                            "< <= = >= >" : "...",
                        headerFilterFunc: (type ===
                                "number") ?
                            customHeaderFilter : false,
                    });

                });
                groupsColumns.push({
                    title: group.title,
                    columns: [{
                        title: "<span style='color:red'>70 % minimum</span>",
                        columns: columnByGroup
                    }]

                });
            } else if (i === 5) {
                group.columns.forEach(header => {
                    columnByGroup.push({
                        id: i,
                        title: header,
                        field: header,
                        visible: false,
                        headerFilter: "input",
                        headerFilterPlaceholder: (
                                type === "number") ?
                            "< <= = >= >" : "...",
                        headerFilterFunc: (type ===
                                "number") ?
                            customHeaderFilter : false,
                    });

                });
                groupsColumns.push({
                    title: group.title,
                    columns: [{
                        title: "<span style='color:red'>70 % min par module avec 2 modules minimum réussis</span>",
                        columns: columnByGroup
                    }]

                });
            } else if (i === 6) {
                group.columns.forEach(header => {
                    columnByGroup.push({
                        id: i,
                        title: header,
                        field: header,
                        headerFilter: "input",
                        headerFilterPlaceholder: (
                                type === "number") ?
                            "< <= = >= >" : "...",
                        headerFilterFunc: (type ===
                                "number") ?
                            customHeaderFilter : false,
                    });

                });
                groupsColumns.push({
                    title: group.title,
                    columns: [{
                        title: "<span style='color:red'>2 modules minimum</span>",
                        columns: columnByGroup
                    }]

                });
            } else if (i === 7) {

                group.columns.forEach((header, j) => {
                    if (j > 0 && j < 4)
                        columnByGroup.push({
                            id: i,
                            title: header,
                            field: header,
                            headerFilter: "input",
                            headerFilterPlaceholder: "...",
                        });

                });
                groupsColumns.push({
                    title: group.title,
                    columns: [{
                            title: "<span style='color:red'>Nombre < 2</span>",
                            columns: [{
                                id: 0,
                                title: group.columns[
                                    0],
                                field: group.columns[
                                    0],
                                headerFilter: "input",
                                headerFilterPlaceholder: "...",
                            }]
                        }, {
                            title: "<span style='color:red'>Score < à 70 %</span>",
                            columns: columnByGroup
                        }, {
                            title: "<span style='color:red'>Nombre < 3</span>",
                            columns: [{
                                id: 4,
                                title: group.columns[
                                    4],
                                field: group.columns[
                                    4],
                                headerFilter: "input",
                                headerFilterPlaceholder: "...",
                            }]
                        }

                    ]
                });
            } else {
                group.columns.forEach(header => {
                    columnType = classByColumn(jsonData,
                        header);
                    type = columnType.length > 0 ? "number" :
                        "string"; //[...new Set(columnType)];

                    columnByGroup.push({
                        id: i,
                        title: header,
                        field: header,
                        headerFilter: "input",
                        headerFilterPlaceholder: (
                                type === "number") ?
                            "< <= = >= >" : "...",
                        headerFilterFunc: (type ===
                                "number") ?
                            customHeaderFilter : false,
                    });

                });
                groupsColumns.push({
                    title: group.title,
                    columns: columnByGroup
                });
            }
        });
        return groupsColumns;
    }

    var columns = setDataColumns(headersGroups);

    var footerContent = '<div class="footerInfo"> ';
    footerContent +=
        '<a type="button" href="https://github.com/olifolkerd/tabulator" target="_blank" style="margin-right: 3em; padding: 2px 5px; font-weight: 900">Tabulator</a>'
    footerContent +=
        'lignes: <span id="rowsTotal-final" style="font-weight: 900">' +
        jsonData.length + '</span>';
    footerContent +=
        '<span style="margin-left: 1em">colonnes: </span><span id="columnsTotal" style="font-weight: 900">' +
        headers.length + '</span>';
    footerContent += '<div style="margin-left: 4em;" class="inline">';
    footerContent +=
        '<span>lignes: </span><span id="rowsCount-final" style="font-weight: 900"></span> (filtrée.s)';
    footerContent +=
        '<span style="margin-left: 2em">sélection: </span><span id="rowSelected-final" style="font-weight: 900"></span> (ligne.s)';
    footerContent +=
        '<span style="margin-left: 2em">total absence.s: </span><span style="font-weight: 900; color:red">' +
        absences + '</span>';
    footerContent += '</div></div>';

    var finalTable = new Tabulator("#table-final", {
        clipboard: true,
        selectable: true,
        height: Math.round(window.innerHeight) - 55,
        virtualDomBuffer: 100000,
        data: jsonData,
        reactiveData: true,
        tooltipsHeader: true,
        columns: columns,
        pagination: "local",
        paginationSize: 100,
        movableColumns: true,
        history: true,
        tooltips: true,
        placeholder: "Aucune donnée disponible",
        footerElement: footerContent,
        groupToggleElement: "header",

        rowFormatter: function(row) {
            if (row.getData()["Email"] !== row.getData()[
                    "Mail d'inscription"]) {
                row.getCells()[1].getElement().style.backgroundColor =
                    "#FFABAD";
                row.getCells()[2].getElement().style.backgroundColor =
                    "#FFABAD";
                row.getCells()[3].getElement().style.backgroundColor =
                    "#FFABAD";
            }
        },
        rowSelectionChanged: function(data, rows) {
            document.getElementById('rowSelected-final').innerHTML =
                data.length;
        },
        dataFiltered: function(filters, rows) {
            document.getElementById('rowsCount-final').innerHTML =
                rows.length;
        },
        groupStartOpen: function(value, count, data, group) {

            return false;
        },
        groupHeader: function(value, count, data, group) {

            return value +
                "<span style='color:#d00; margin-left:10px;' title='Clic droit pour export CSV'>(" +
                count + " item)</span>";
        },
        groupContext: function(e, group) {
            e.preventDefault();
            var subGroups = group.getSubGroups();
            var groupElement = group.getElement();
            var rowsData = [];
            if (subGroups.length === 0) {
                var rows = group.getRows().forEach(row => {
                    rowsData.push(row.getData());
                });
                // console.log(rowsData);
                // var parentGroup = fields;
                var key = group.getKey();
                rowsData = d3.csvParseRows(Papa.unparse(rowsData));
                var rowsDataHeaders = rowsData[0];
                rowsData = rowsData.slice(1, rowsData.length).map(
                    row => row.map(d => finalPointToComma_FR(d))
                );
                rowsData.unshift(rowsDataHeaders);
                exportCSVDefault(rowsData, "Cohorte_" + key);
            } else {
                groupElement.classList.add("shaker");
                setTimeout(() => {
                    groupElement.classList.remove("shaker");
                }, 400);
            }
        }
    });

    finalTable.setGroupBy("Cohorte");

    document.getElementById('groupExpandCollapse-btn').onclick = function() {
        document.getElementById('spinnerLoadFinal-span').classList.remove(
            'hidden');
        setTimeout(() => {
            if (this.dataset.state === "collapse") {
                finalTable.getGroups().forEach(group => {
                    group.show();
                });
                this.dataset.state = "expand";
                this.innerHTML = '<i class="fas fa-minus"></i>';
                document.getElementById('spinnerLoadFinal-span').classList
                    .add('hidden');
            } else {
                finalTable.getGroups().forEach(group => {
                    group.hide();
                });
                this.dataset.state = "collapse";
                this.innerHTML = '<i class="fas fa-plus"></i>';
                document.getElementById('spinnerLoadFinal-span').classList
                    .add('hidden');
            }
        }, 100);
    }

    document.getElementById('tableReport-btn').onclick = function() {
        document.getElementById('tableFinal-div').classList.add('hidden');
        document.getElementById('tableApp-div').classList.remove('hidden');
    }

    document.getElementById("deselectAllRows-final").onclick = function(e) {
        finalTable.deselectRow();
    };

    document.getElementById('filtersHeaderClear-final').onclick = function(e) {
        finalTable.clearHeaderFilter();
    };

    document.getElementById('tableReport-btn').onclick = function(e) {
        document.getElementById('tableFinal-div').classList.add('hidden');
        document.getElementById('tableApp-div').classList.remove('hidden');
    }

    document.getElementById('hideGroup-btn').onclick = function() {
        document.getElementById('spinnerLoadFinal-span').classList.remove(
            'hidden');
        var selectGroupsColumns = document.getElementById(
            'groupsColumns-btn');
        var selectedGroup = selectGroupsColumns.options[selectGroupsColumns
            .selectedIndex].value;
        var columnsSelected = groupsToFilters[selectedGroup];
        setTimeout(() => {
            for (var i = 0, lgi = columnsSelected.length; i < lgi; ++
                i) {
                finalTable.hideColumn(columnsSelected[i]);
            }
            document.getElementById('spinnerLoadFinal-span').classList
                .add('hidden');
        });
    }

    document.getElementById('showGroup-btn').onclick = function() {
        document.getElementById('spinnerLoadFinal-span').classList.remove(
            'hidden');
        var selectGroupsColumns = document.getElementById(
            'groupsColumns-btn');
        var selectedGroup = selectGroupsColumns.options[selectGroupsColumns
            .selectedIndex].value;
        var columnsSelected = groupsToFilters[selectedGroup];
        setTimeout(() => {
            for (var i = 0, lgi = columnsSelected.length; i < lgi; ++
                i) {
                finalTable.showColumn(columnsSelected[i]);
            }
            document.getElementById('spinnerLoadFinal-span').classList
                .add('hidden');
        });
    }

    document.getElementById('hideCol-final').onclick = function() {
        var columnNames = [];
        finalTable.getColumns().forEach(column => {
            if (column.getVisibility())
                columnNames.push(column.getField());
        });
        createTableColumns(["", "colonnes"], columnNames, "pvtTable",
            finalTable, "hide");
        columnNames = null;
    }

    document.getElementById('showCol-final').onclick = function() {
        var columnNames = [];
        finalTable.getColumns().forEach(column => {
            if (!column.getVisibility())
                columnNames.push(column.getField());
        });
        createTableColumns(["", "colonnes"], columnNames, "pvtTable",
            finalTable, "show");
        columnNames = null;
    }

    var getDataFiltered = function() {
        var filteredData = finalTable.getData(true);
        var selectedData = finalTable.getSelectedData();
        var filterSelectedData = filteredData.filter(value => -1 !==
            selectedData.indexOf(value))

        var columnsVisible = [];
        finalTable.getColumns().forEach(column => {
            if (column.getVisibility())
                columnsVisible.push(column.getField());
        });

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

    document.getElementById('exportFinalComma-btn').onclick = function(e) {
        document.getElementById('spinnerLoadFinal-span').classList.replace(
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
            exportCSVDefault(dataExport, "final-standard");
            document.getElementById('spinnerLoadFinal-span').classList
                .replace("inline", "hidden");
        }, 100);
    }

    document.getElementById('finalStandard-btn').dataset.switch = "done";
    document.getElementById('spinnerLoadFinal-span').classList.add('hidden');
    console.log("finalTable done !");
}
