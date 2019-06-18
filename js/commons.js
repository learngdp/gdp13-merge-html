/* IMPORTANT: la position des titres dans le tableau (headers) est à respecter car repris dans les sorties analytics et standard */
/* par contre... aucune incidence sur l'emplacement des colonnes des fichiers csv import en entrée (en principe;) */
// MERGE
const ref_ID = "Student ID";
const headersProfile = ["id", "username", "name", "email"];

const headersTemplate = [
    ref_ID, //0
    "Email",
    "year_of_birth",
    "Name",
    "Username",
    "Cohort Name",
    "Pre MOOC", // 32 à la place de Grade 6
    "Évaluation Hebdo 1: Évaluation (notée)", // 7
    "Évaluation Hebdo 2: Évaluation (notée)",
    "Évaluation Hebdo 3: Évaluation (notée)",
    "Évaluation Hebdo 4: Évaluation (notée)", // 10
    "Évaluation Hebdo (Avg)", // 11
    "Examen Final", // 12
    "Livrables 1: Carte Conceptuelle - (Semaine 1)", // 13
    "Livrables 2: Compte-rendu - (Semaine 2)", // 14
    "Livrables 3: Planification - (Semaine 3)", // 15
    "Livrables (Avg)", // 16
    "DFS - Diagnostic de Fonctionnement d'un Système", // 17 - SPE 1
    "MCB - Management de la Créativité et Brainstorming", // 18 - SPE 2
    "MEP - Management d'Équipe Projet", // 19 - SPE 3
    "IEF - Les outils informatiques & Évaluer financièrement les projets", // 20 - SPE 4
    "PMI - Certifications professionnelles PMI®", // 21 - SPE 5
    "AF - Analyse Fonctionnelle", // 22 - SPE 6
    "AS - Analyse Stratégique dans les Projets", // 23 - SPE 7
    "EIP - Évaluation d'Impact des Projets", // 24 - SPE 8
    "PAV - Planification Avancée", // 25 - SPE 9
    "MVP - Management Visuel de Projet", // 26 - SPE 10
    "GPAS - Gestion de projet agile avec Scrum", // 27 - SPE 11
    "MRP - Outils et Méthodologie de Résolution de Problème", // 28 - SPE 12
    "TRIZ - Introduction aux principaux outils de TRIZ", // 29 -SPE 13
    "G2C - Gestion de crise", // 30 - SPE 14
    "PAE - Du Projet à l'Action Entrepreneuriale", // 31 - SPE 15
    "Grade", // 6 à la place de Preemooc 32
    "Enrollment Track", // 33
    "Verification Status",
    "Certificate Eligible",
    "Certificate Delivered",
    "Certificate Type",
    "Enrollment Status",
    "fichiers fusionnés", // 39
    "Grade_TC" // 40
];

const cohortesOptions = [
    "Grade TC",
    "Évaluation Hebdo 1: Évaluation (notée)", // 5
    "Évaluation Hebdo 2: Évaluation (notée)",
    "Évaluation Hebdo 3: Évaluation (notée)",
    "Évaluation Hebdo 4: Évaluation (notée)", // 8
    "Évaluation Hebdo (Avg)", // 9
    "Examen Final", // 10
    "Livrables 1: Carte Conceptuelle - (Semaine 1)", // 11
    "Livrables 2: Compte-rendu - (Semaine 2)", // 12
    "Livrables 3: Planification - (Semaine 3)", // 13
    "Livrables (Avg)", // 14
    "DFS - Diagnostic de Fonctionnement d'un Système", // SPE 1
    "MCB - Management de la Créativité et Brainstorming", // SPE 2
    "MEP - Management d'Équipe Projet", // SPE 3
    "IEF - Les outils informatiques & Évaluer financièrement les projets", // SPE 4
    "PMI - Certifications professionnelles PMI®", // SPE 5
    "AF - Analyse Fonctionnelle", // SPE 6
    "AS - Analyse Stratégique dans les Projets", // SPE 7
    "EIP - Évaluation d'Impact des Projets", // SPE 8
    "PAV - Planification Avancée", // SPE 9
    "MVP - Management Visuel de Projet", // SPE 10
    "GPAS - Gestion de projet agile avec Scrum", // SPE 11
    "MRP - Outils et Méthodologie de Résolution de Problème", // old "MRP - Méthode de Résolution de Problèmes", // SPE 12
    "TRIZ - Introduction aux principaux outils de TRIZ", // SPE 13
    "G2C - Gestion de crise", // SPE 14
    "PAE - Du Projet à l'Action Entrepreneuriale", // SPE 15
    "Pre MOOC", // 30
];

const objTemplate = {};
headersTemplate.forEach((el) => {
    objTemplate[el] = "";
});

const headersByCategories = {
    required: [
        ref_ID,
        "Email",
        "Username",
        "Grade",
        "Cohort Name",
        "Enrollment Track",
        "Verification Status",
        "year_of_birth",
        "gender",
        "level_of_education",
        "Certificate Eligible",
        "Certificate Delivered",
        "Certificate Type",
        "Enrollment Status"
    ],
    tc: [
        "Pre MOOC",
        "Évaluation Hebdo 1: Évaluation (notée)",
        "Évaluation Hebdo 2: Évaluation (notée)",
        "Évaluation Hebdo 3: Évaluation (notée)",
        "Évaluation Hebdo 4: Évaluation (notée)",
        "Évaluation Hebdo (Avg)",
        "Examen Final"
    ],
    livrables: [
        "Livrables 1: Carte Conceptuelle - (Semaine 1)",
        "Livrables 2: Compte-rendu - (Semaine 2)",
        "Livrables 3: Planification - (Semaine 3)",
        "Livrables (Avg)"
    ],
    spe: [
        "DFS - Diagnostic de Fonctionnement d'un Système", // 1
        "MCB - Management de la Créativité et Brainstorming", // 2
        "MEP - Management d'Équipe Projet", // 3
        "IEF - Les outils informatiques & Évaluer financièrement les projets", // 4
        "PMI - Certifications professionnelles PMI®", // 5
        "AF - Analyse Fonctionnelle", // 6
        "AS - Analyse Stratégique dans les Projets", // 7
        "EIP - Évaluation d'Impact des Projets", // 8
        "PAV - Planification Avancée", // 9
        "MVP - Management Visuel de Projet", // 10
        "GPAS - Gestion de projet agile avec Scrum", // 11
        "MRP - Outils et Méthodologie de Résolution de Problème", // 12
        "TRIZ - Introduction aux principaux outils de TRIZ", // 13
        "G2C - Gestion de crise", // 15
        "PAE - Du Projet à l'Action Entrepreneuriale" // 15
    ]
};

const fileNamesTemplate = {
    "-TC_": 1,
    "_SPE-DFS_": 2,
    "_SPE-MCB_": 3,
    "_SPE-MEP_": 4,
    "_SPE-IEF_": 5,
    "_SPE-PMI_": 6,
    "_SPE-AF_": 7,
    "_SPE-AS_": 8,
    "_SPE-EIP_": 9,
    "_SPE-PAV_": 10,
    "_SPE-MVP_": 11,
    "_SPE-GPAS_": 12,
    "_SPE-MRP_": 13,
    "_SPE-TRIZ_": 14,
    "_SPE-G2C_": 15,
    "_SPE-PAE_": 16,
    "-PA_": 17,
};

const patternMail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const regexTC = /TC_\d{2}_/;
const regexPA = /PA_\d{2}_/
const regexSPE = /SPE-\w{2,4}_/;

const regexAllSPE = /(SPE-\w{2,4}|PA_\d{2}|TC_\d{2})_/;

const regexFileNamesTemplate = /(_SPE-\w{2,4}|\-PA|\-TC)_/;

// pattern for short name column
const regexHeadersSPE = /\b[A-Z0-9]{2,4}\b\s\-/;
const regexEvalHebdo = /^Évaluation Hebdo [1|2|3|4]\:/;
const regexLivrable = /^Livrables [1|2|3]\:/;