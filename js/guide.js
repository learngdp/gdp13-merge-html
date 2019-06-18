$(() => {
    document.getElementById('guide-btn').onclick = function(e) {

        var content_filterField = 'Liste déroulante';
        content_filterField +=
            '<ul><li>Applique un filtre sur l\'ensemble du tableau en fonction de la colonne sélectionnée dans la liste</li></ul>';

        var content_groupByInput =
            'Case de saisie à 2 fonctions (regrouper les lignes du tableau par entête.s de colonnes):';
        content_groupByInput +=
            '<ol><li>Saisie automatique "indirecte" par un CLIC DROIT successivement sur un ou plusieurs entêtes de colonne</li>';
        content_groupByInput +=
            '<li>Saisie manuelle d\'un entête de colonne à la condition que le texte saisi soit identique y compris la casse</li></ol>';

        var content_filterHeader =
            'Filtre dynamique à 3 possibiltés:';
        content_filterHeader +=
            '<ol><li> ... filtrage à partir de caractères alphanumériques. Prévoir une légère latence qui permet la prise en compte en cours de saisie</li>';
        content_filterHeader +=
            '<li> >= chiffre seulement par saisie directe ou en utilisant les flèches (à droite) pour incrémenter ou décrémenter</li>';
        content_filterHeader +=
            '<li> > ou < ou =  saisir un des 3 signes pour "strictement" suivi d\'une valeur en fonction du contenu de la colonne</li></ol>';

        var intro = introJs();
        intro.setOptions({
            tooltipPosition: 'top',
            nextLabel: 'suivant',
            prevLabel: 'retour',
            skipLabel: 'sortir',
            doneLabel: 'ok',
            showProgress: true,
            showStepNumbers: false,
            steps: [{
                    intro: '<p>Bienvenue dans la visite guidée</p><p>Vous pouvez interrompre la visite à tout moment et y revenir quand vous voulez en cliquant sur "Guide"</p>'
                },
                {
                    element: '#deselectAll-rows',
                    intro: 'Désélectionne toutes les lignes sélectionnées (surlignées en bleu dans le tableau)',
                    position: 'top'
                },
                {
                    element: '#showConcat-col',
                    intro: 'Affiche ou masque les colonnes concaténées "Grade", "Enrollment Track", "Verification Status", "Enrollment Status"',
                    position: 'top'
                },
                {
                    element: '#show-col',
                    intro: 'Affiche un popup pour cocher les colonnes à afficher',
                    position: 'top'
                },
                {
                    element: '#hide-col',
                    intro: 'Affiche un popup pour cocher les colonnes à masquer',
                    position: 'top'
                },
                {
                    element: '#filter-field',
                    intro: content_filterField,
                    position: 'top'
                },
                {
                    element: '#filter-type',
                    intro: 'Choisir "like" pour filtrer du texte ou un opérateur pour filtrer des nombres',
                    position: 'top'
                },
                {
                    element: '#filter-value',
                    intro: 'Saisir du texte ou des nombres selon le type de filtre sélectionné',
                    position: 'top'
                },
                {
                    element: '#filter-clear',
                    intro: 'Efface le filtre et réinitialise la liste déroulante et le type de filtre sur les éléments ci-contre (à gauche)',
                    position: 'top'
                },
                {
                    element: '#filtersHeader-clear',
                    intro: 'Efface tous les filtres en entête de colonne',
                    position: 'top'
                },
                {
                    element: '#groupBy-input',
                    intro: content_groupByInput,
                    position: 'top'
                },
                {
                    element: '#groupBy-btn',
                    intro: 'Groupe les lignes du tableau en fonction des entêtes saisis dans la case ci-contre (à gauche)',
                    position: 'top'
                },
                {
                    element: '#degroupBy-btn',
                    intro: 'Dégroupe toutes les lignes groupées du tableau et efface la sélection dans la case ci-contre (à gauche)',
                    position: 'top'
                },
                {
                    element: '#selectCohortes-btn',
                    intro: 'Sélectionne un entête de colonne pour avoir des indicateurs statistiques calculés sur les valeurs contenues dans la colonne',
                    position: 'top'
                },
                {
                    element: '#cohortes-btn',
                    intro: 'Permet de visualiser des indicateurs statistiques par cohorte calculés sur la colonne sélectionnée ci-contre (à gauche) et de les exporter en csv',
                    position: 'top'
                },
                {
                    element: '#finalStandard-btn',
                    intro: 'Export csv des données traitées au format "Final-standard" (Florence). Les données ne sont visualisables qu\'après export',
                    position: 'top'
                },
                {
                    element: '#exportCSVComma-btn',
                    intro: 'Export CSV des données (décimales en virgule).<br>Toutes les colonnes et lignes (visibles ou pas) sont pris en compte à l\'exception des colonnes "concaténées".',
                    position: 'top'
                },
                {
                    element: '#exportCSV-btn',
                    intro: 'Export CSV des données filtrées (décimales en point).<br>Seules les lignes et les colonnes visibles dans le tableau sont pris en compte dans le fichier de sortie',
                    position: 'top'
                },
                {
                    element: '.tabulator-header-filter',
                    intro: content_filterHeader,
                    position: 'top'
                },
                {
                    element: '.tabulator-cell',
                    intro: 'Clic droit sur la cellule pour visualiser la fiche participant et l\'exporter en CSV le cas échéant',
                    position: 'top'
                },
                {
                    element: '.tabulator-footer',
                    intro: 'Divers indicateurs actualisés en temps réel (aucune action requise)',
                    position: 'top'
                }
            ],
            hints: [{
                element: '#checkFiles-btn',
                hint: 'Si erreur dans l\'ordre des fichiers, un bouton clignotant apparaît qui permet de télécharger la liste des lignes concernées',
                position: 'top'
            }]
        });
        intro.oncomplete(function() {
            // intro.addHints();
        });
        intro.onexit(function() {;
        });
        intro.onchange(function(targetElement) {;
        });
        intro.onafterchange(function(targetElement) {;
        });
        intro.onbeforechange(function(targetElement) {;
        });

        intro.start();
    }
});
