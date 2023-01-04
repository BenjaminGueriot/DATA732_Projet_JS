/**
 * On crée la variable qui contiendra le nom du groupe de graphique du dashboard
 */
const groupName = "dataset";

/**
 * Fonction pour reset les filtres et redessiner les graphiques
 */
function reset() {
    dc.filterAll(groupName);
    dc.renderAll(groupName);
    createChart6('Anxiety')
}

/**
 * Permet de montrer les % des tranches du pie chart
 * @param chart Le pie chart sur quoi faire la modification
 */
const montrerPourcentagesPieChart = (chart) => {
    chart.selectAll('text.pie-slice').text(function (d) {
        if (((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) !== 0) {
            return dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)) + '%';
        }
    })
}

/**
 * La fonction pour créer la visualisation
 */
async function createDataViz() {

    // On récupère le dataset et on le met dans la variable dataset
    let dataset = await d3.csv("/data/survey.csv");

    // On formate un peu la donnée pour nous éviter des soucis
    dataset.forEach((d) => {

        d["While working"] = d["While working"] === "Yes";
        d["Instrumentalist"] = d["Instrumentalist"] === "Yes";
        d["Composer"] = d["Composer"] === "Yes";
        d["Exploratory"] = d["Exploratory"] === "Yes";
        d["Foreign languages"] = d["Foreign languages"] === "Yes";

        d["Age"] = +d["Age"];
        d["Hours per day"] = +d["Hours per day"];
        d["BPM"] = +(d["BPM"] < 300 ? d["BPM"] : null)
        d["Anxiety"] = +d["Anxiety"];
        d["Depression"] = +d["Depression"];
        d["Insomnia"] = +d["Insomnia"];
        d["OCD"] = +d["OCD"];

        d["Timestamp"] = new Date(d["Timestamp"]);
    });
    // On crée le crossfilter que l'on va nommer ndx (une pseudo norme)
    const ndx = crossfilter(dataset);


//--------------------------------[CHART 1]-------------------------------------

    const AgeDimension = ndx.dimension(function (d) {
        return d["Age"];
    });

    // On crée le groupe, on veut le temps d'écoute selon l'age
    var HourGroup = AgeDimension.group().reduce(reduceAdd, reduceRemove, reduceInitial);

    function reduceAdd(p, v) {
    ++p.count;
    p.total += parseInt(v["Hours per day"]);
    return p;
    }

    function reduceRemove(p, v) {
    --p.count;
    p.total -= parseInt(v["Hours per day"]);
    return p;
    }

    function reduceInitial() {
    return {count: 0, total: 0};
    }
    
    // On crée le graphique avec le groupName
    const TimeParAgeChart = dc.barChart("#chart1", groupName);
    
    TimeParAgeChart
        .dimension(AgeDimension) // On ajoute la dimension
        .group(HourGroup) // On ajoute le groupe
        .valueAccessor(function(p) { return p.value.count > 0 ? p.value.total / p.value.count : 0; })
        .yAxisLabel("Nombre d'heure d'écoute") // On met le label de l'axe y
        .xAxisLabel("Age") // On met le label de l'axe x
        .elasticY(true)// On veut que l'axe des Y puisse redimensionner tout seul
        .elasticX(true)// On veut que l'axe des X puisse redimensionner tout seul
        .x(d3.scaleLinear().domain([0, 100]))
        .y(d3.scaleLinear().domain([0, 24]))


//--------------------------------[CHART 2]-------------------------------------

    class MyBarChart extends dc.BarChart {
        legendables () {
            const items = super.legendables();
            return items.reverse();
        }
    }
    
    const ServiceGroup = AgeDimension.group().reduce((p, v) => {
        p[v["Primary streaming service"]] = (p[v["Primary streaming service"]] || 0) + 1;
        return p;
    }, (p, v) => {
        p[v["Primary streaming service"]] = (p[v["Primary streaming service"]] || 0) - 1; 
        return p;
    }, () => ({}));

    function get_value (i) {
        return d => d.value[i];
    }

    const platforms = ['Spotify','YouTube Music','Apple Music','Pandora','I do not use a streaming service.','Other streaming service']
    const chart2 = new MyBarChart('#chart2',groupName);
    
    chart2
        .dimension(AgeDimension)
        .group(ServiceGroup, 'Spotify',get_value('Spotify'))
        .xAxisLabel("Age") // On met le label de l'axe x
        .elasticY(true)// On veut que l'axe des Y puisse redimensionner tout seul
        .elasticX(true)// On veut que l'axe des X puisse redimensionner tout seul
        .x(d3.scaleLinear().domain([0, 80]))
        .brushOn(false)
        .clipPadding(10)
        .renderLabel(false)
        .legend(dc.legend())
        .margins({left: 150, top: 30, right: 10, bottom: 40})
        .stack(ServiceGroup, 'YouTube Music',get_value('YouTube Music'))
        .stack(ServiceGroup, 'Apple Music',get_value('Apple Music'))
        .stack(ServiceGroup, 'Pandora',get_value('Pandora'))
        .stack(ServiceGroup, 'I do not use a streaming service.',get_value('I do not use a streaming service.'))
        .stack(ServiceGroup, 'Other streaming service',get_value('Other streaming service'))
        
//--------------------------------[CHART 3]-------------------------------------

    var genres = ["Rock","Pop","Metal","R&B","Hip hop","EDM","Video game music","Folk","Country","Rap","Classical","K pop","Jazz","Lofi","Gospel","Latin"]
    var colorScale = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
    var dict = {};

    var index= 0 
    genres.forEach(genre => {
        
        dict[genre] = colorScale[index]
        index ++

    });

    const InstrumentalistGroup = AgeDimension.group().reduce((p, v) => {
        if(p.total==undefined){
            p.total=0;
        }
        if(p.nbTrueInstrumentaliste==undefined){
            p.nbTrueInstrumentaliste=0;
        }

        p[v["Instrumentalist"]] = (p[v["Instrumentalist"]] || 0) + 1;
        p.total +=1;
        return p;

    }, (p, v) => {
        p[v["Instrumentalist"]] = (p[v["Instrumentalist"]] || 0) - 1; 
        return p;
    }, () => ({}));
    
    
    const InstrumentalistAgeChart = dc.barChart('#chart3',groupName);
    
    InstrumentalistAgeChart
        .dimension(AgeDimension)
        .group(InstrumentalistGroup, true,get_value(true))
        .yAxisLabel("% de musicien selon l'âge") // On met le label de l'axe y
        .xAxisLabel("Age") // On met le label de l'axe x
        .elasticY(true)// On veut que l'axe des Y puisse redimensionner tout seul
        .elasticX(true)// On veut que l'axe des X puisse redimensionner tout seul
        .valueAccessor(function(p) { return (p.value.true / p.value.total)*100; })
        .x(d3.scaleLinear().domain([0, 80]))

//--------------------------------[CHART 4]-------------------------------------

const hourDimension = ndx.dimension(function (d) {
    return parseInt(d["Hours per day"]);
});

// On crée le groupe
const favMusicHoursGroup = hourDimension.group().reduce((p, v) => {
    p[v["Fav genre"]] = (p[v["Fav genre"]] || 0) + 1;
    return p;
}, (p, v) => {
    p[v["Fav genre"]] = (p[v["Fav genre"]] || 0) - 1; 
    return p;
}, () => ({}));

// On crée le graphique avec le groupName
const favMusicHoursChart = dc.barChart('#chart4',groupName);

favMusicHoursChart
    .dimension(hourDimension) // On ajoute la dimension
    .group(favMusicHoursGroup, 'Rock',get_value('Rock')) // On ajoute le groupe
    .xAxisLabel("Heures par jours") // On met le label de l'axe x
    .elasticY(true)// On veut que l'axe des Y puisse redimensionner tout seul
    .elasticX(true)// On veut que l'axe des X puisse redimensionner tout seul
    .x(d3.scaleLinear().domain([0, 16]))
    .renderLabel(false)
    .legend(dc.legend())
    .brushOn(false)
    .clipPadding(2)
    .margins({left: 130, top: 0, right: 10, bottom: 40})
    .stack(favMusicHoursGroup, 'Pop',get_value('Pop'))
    .stack(favMusicHoursGroup, 'Metal',get_value('Metal'))
    .stack(favMusicHoursGroup, 'Classical',get_value('Classical'))
    .stack(favMusicHoursGroup, 'Video game music',get_value('Video game musi'))
    .stack(favMusicHoursGroup, 'EDM',get_value('EDM'))
    .stack(favMusicHoursGroup, 'R&B',get_value('R&B'))
    .stack(favMusicHoursGroup, 'Hip hop',get_value('Hip hop'))
    .stack(favMusicHoursGroup, 'Folk',get_value('Folk'))
    .stack(favMusicHoursGroup, 'Country',get_value('Country'))
    .stack(favMusicHoursGroup, 'Rap',get_value('Rap'))
    .stack(favMusicHoursGroup, 'K-pop',get_value('K-pop'))
    .stack(favMusicHoursGroup, 'Jazz',get_value('Jazz'))
    .stack(favMusicHoursGroup, 'Lofi',get_value('Lofi'))
    .stack(favMusicHoursGroup, 'Gospel',get_value('Gospel'))
    .on('pretransition',function(chart){
        chart.selectAll('g rect').style("fill", function (d){
            return dict[d.layer];
        })
    });

//--------------------------------[CHART 5]-------------------------------------

// On crée le groupe
const favPlateformeHoursGroup = hourDimension.group().reduce((p, v) => {
    p[v["Primary streaming service"]] = (p[v["Primary streaming service"]] || 0) + 1;
    console.log(p);
    return p;
}, (p, v) => {
    p[v["Primary streaming service"]] = (p[v["Primary streaming service"]] || 0) - 1; 
    return p;
}, () => ({}));

// On crée le graphique avec le groupName
const favPlateformeHoursChart = new MyBarChart('#chart5',groupName);

favPlateformeHoursChart
    .dimension(hourDimension) // On ajoute la dimension
    .group(favPlateformeHoursGroup, 'Spotify',get_value('Spotify')) // On ajoute le groupe
    .xAxisLabel("Heures par jours") // On met le label de l'axe x
    .elasticY(true)// On veut que l'axe des Y puisse redimensionner tout seul
    .elasticX(true)// On veut que l'axe des X puisse redimensionner tout seul
    .x(d3.scaleLinear().domain([0, 24]))
    .brushOn(false)
    .clipPadding(10)
    .renderLabel(false)
    .legend(dc.legend())
    .margins({left: 150, top: 30, right: 10, bottom: 40})
    .stack(favPlateformeHoursGroup, 'YouTube Music',get_value('YouTube Music'))
    .stack(favPlateformeHoursGroup, 'Apple Music',get_value('Apple Music'))
    .stack(favPlateformeHoursGroup, 'Pandora',get_value('Pandora'))
    .stack(favPlateformeHoursGroup, 'I do not use a streaming service.',get_value('I do not use a streaming service.'))
    .stack(favPlateformeHoursGroup, 'Other streaming service',get_value('Other streaming service'));

//-------------------------------[CHART 7]----------------------------------------


const favoriteMusicNonIntrumentalistChart = dc.pieChart("#chart7", groupName);
  
const favoriteMusicNonIntrumentalistDimension = ndx.dimension(function (d) {
    return d["Fav genre"]
});


const favoriteMusicNonIntrumentalistGroup = favoriteMusicNonIntrumentalistDimension.group().reduce(
    function (p, v) {
        
        if (!(v["Instrumentalist"])) {
            p++;
        }

        return p;
},
function (p, v) {

    if (!(v["Instrumentalist"])) {
        p--;
    }

    return p;
},
function () {
    return 0 
}
);


favoriteMusicNonIntrumentalistChart
    .height(220)
    .radius(100)
    .innerRadius(30)
    .colorCalculator(function (d){return dict[d.key];})
    .dimension(favoriteMusicNonIntrumentalistDimension)
    .group(favoriteMusicNonIntrumentalistGroup)
    .on('renderlet', function(chart) {
        chart.selectAll('rect').on('click', function(d) {
            console.log('click!', d);
        })
    });
    
//-------------------------------[CHART 8]----------------------------------------

const favoriteMusicChart = dc.pieChart("#chart8", groupName);

const favoriteMusicDimension = ndx.dimension(function (d) {
    return d["Fav genre"];
});

var favoriteMusicGroup = favoriteMusicDimension.group().reduceCount();

favoriteMusicChart
    .height(220)
    .radius(100)
    .innerRadius(30)
    .colorCalculator(function (d){return dict[d.key];})
    .dimension(favoriteMusicDimension)
    .group(favoriteMusicGroup)
    .on('renderlet', function(chart) {
        chart.selectAll('rect').on('click', function(d) {
            console.log('click!', d);
        });
    });

//-------------------------------[CHART 9]----------------------------------------

const favoriteMusicInstrumentalistChart = dc.pieChart("#chart9", groupName);
  
const favoriteMusicInstrumentalistDimension = ndx.dimension(function (d) {
    return d["Fav genre"]
});

const favoriteMusicInstrumentalistGroup = favoriteMusicInstrumentalistDimension.group().reduce(
    function (p, v) {
        
        if (v["Instrumentalist"]) {
            p++;
        }

        return p;
},
function (p, v) {

    if (v["Instrumentalist"]) {
        p--;
    }

    return p;
},
function () {
    return 0 
}
);

favoriteMusicInstrumentalistChart
    .height(220)
    .radius(100)
    .innerRadius(30)
    .colorCalculator(function (d){return dict[d.key];})
    .dimension(favoriteMusicInstrumentalistDimension)
    .group(favoriteMusicInstrumentalistGroup)
    .on('renderlet', function(chart) {
        chart.selectAll('rect').on('click', function(d) {
            console.log('click!', d);
        })
    });


    // On veut rendre tous les graphiques qui proviennent du chart group "dataset"
    dc.renderAll(groupName);
}



async function createChart6(option) {

    // On récupère le dataset et on le met dans la variable dataset
    let dataset = await d3.csv("/data/survey.csv");

    // On formate un peu la donnée pour nous éviter des soucis
    dataset.forEach((d) => {

        d["While working"] = d["While working"] === "Yes";
        d["Instrumentalist"] = d["Instrumentalist"] === "Yes";
        d["Composer"] = d["Composer"] === "Yes";
        d["Exploratory"] = d["Exploratory"] === "Yes";
        d["Foreign languages"] = d["Foreign languages"] === "Yes";
        d["While working"] = d["While working"] === "Yes";

        d["Age"] = +d["Age"];
        d["Hours per day"] = +d["Hours per day"];
        d["BPM"] = +(d["BPM"] < 300 ? d["BPM"] : null)
        d["Anxiety"] = +d["Anxiety"];
        d["Depression"] = +d["Depression"];
        d["Insomnia"] = +d["Insomnia"];
        d["OCD"] = +d["OCD"];

        d["Timestamp"] = new Date(d["Timestamp"]);
    });
    // On crée le crossfilter que l'on va nommer ndx (une pseudo norme)
    const ndx = crossfilter(dataset);

    //--------------------------------[CHART 6]-------------------------------------
    const StatusLineChart = new dc.LineChart("#chart6","graph6");

    const BPMDimension = ndx.dimension(function(d) {
        return d["BPM"] != null ? d["BPM"] : null; 
    });
    
    switch (option) {
        case "Anxiety":
            //--------------------------------Anxiety-------------------------------------
            const AnxietyGroup = BPMDimension.group().reduce(AnxietyreduceAdd, AnxietyreduceRemove, AnxietyreduceInitial);
            function AnxietyreduceAdd(p, v) {
                if(v["Anxiety"] != null){
                    ++p.count;
                    p.total += parseInt(v["Anxiety"]);
                };
                return p;
            }

            function AnxietyreduceRemove(p, v) {
                if(v["Anxiety"] != null){
                    --p.count;
                    p.total -= parseInt(v["Anxiety"]);
                };
                return p;
            }

            function AnxietyreduceInitial() {
                return {count: 0, total: 0};
            }
            drawgraph(option,AnxietyGroup,StatusLineChart);
            break;
        
        case "Depression":
            //--------------------------------Depression-------------------------------------
            const DepressionGroup = BPMDimension.group().reduce(DepressionreduceAdd, DepressionreduceRemove, DepressionreduceInitial);
            function DepressionreduceAdd(p, v) {
                if(v["Depression"] != null){
                    ++p.count;
                    p.total += parseInt(v["Depression"]);
                };
                return p;
            }

            function DepressionreduceRemove(p, v) {
                if(v["Depression"] != null){
                    --p.count;
                    p.total -= parseInt(v["Depression"]);
                };
                return p;
            }

            function DepressionreduceInitial() {
                return {count: 0, total: 0};
            }
            drawgraph(option,DepressionGroup,StatusLineChart);
            break;
        
        case "Insomnia":
            //--------------------------------Anxiety-------------------------------------
            const InsomniaGroup = BPMDimension.group().reduce(InsomniareduceAdd, InsomniareduceRemove, InsomniareduceInitial);
            function InsomniareduceAdd(p, v) {
                if(v["Insomnia"] != null){
                    ++p.count;
                    p.total += parseInt(v["Insomnia"]);
                };
                return p;
            }

            function InsomniareduceRemove(p, v) {
                if(v["Insomnia"] != null){
                    --p.count;
                    p.total -= parseInt(v["Insomnia"]);
                };
                return p;
            }

            function InsomniareduceInitial() {
                return {count: 0, total: 0};
            }
            drawgraph(option,InsomniaGroup,StatusLineChart);
            break;
        
        case "OCD":
            //--------------------------------OCD-------------------------------------
            const OCDGroup = BPMDimension.group().reduce(OCDreduceAdd, OCDreduceRemove, OCDreduceInitial);
            function OCDreduceAdd(p, v) {
                if(v["OCD"] != null){
                    ++p.count;
                    p.total += parseInt(v["OCD"]);
                };
                return p;
            }

            function OCDreduceRemove(p, v) {
                if(v["OCD"] != null){
                    --p.count;
                    p.total -= parseInt(v["OCD"]);
                };
                return p;
            }

            function OCDreduceInitial() {
                return {count: 0, total: 0};
            }
            drawgraph(option,OCDGroup,StatusLineChart);
            break;
    
        default:
            break;
    }

    function drawgraph(option,group,graph) {

        graph
            .dimension(BPMDimension)
            .group(group)
            .valueAccessor(function(p) { return p.value.count > 0 ? p.value.total / p.value.count : 0; })
            .elasticX(true)// On veut que l'axe des X puisse redimensionner tout seul
            .yAxisLabel(option + " Level")
            .xAxisLabel("BPM")
            .x(d3.scaleLinear().domain([0, 300]))
            .y(d3.scaleLinear().domain([0, 10]))
            .brushOn(false)
            .renderDataPoints(true);
        
        dc.redrawAll();
    };
    dc.renderAll("graph6");
}