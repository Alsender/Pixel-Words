const irregs = {
    sein : {
        present : {
            firstSg : "bin",    firstPl : "sind",
            secondSg: "bist",   secondPl: "seid",
            thirdSg: "ist",    thirdPl : "sind",
        },
        preterit : {
            firstSg : "war",    firstPl : "waren",
            secondSg: "warst",  secondPl: "wart",
            thirdSg: "war",     thirdPl : "waren"
        }
    },
    haben : {
        present : {
            firstSg : "habe",   firstPl : "haben",
            secondSg: "hast",   secondPl: "habt",
            thirdSg: "hat",     thirdPl : "haben",
        },
        preterit : {
            firstSg : "hatte",      firstPl : "hatten",
            secondSg: "hattest",    secondPl: "hattet",
            thirdSg: "hatte",       thirdPl : "hatten",
        }
    },
    werden : {
        present : {
            firstSg : "werde",  firstPl : "werden",
            secondSg: "wirst",  secondPl: "werdet",
            thirdSg: "wird",    thirdPl : "werden",
        },
        preterit : {
            firstSg : "wurde",      firstPl : "wurden",
            secondSg: "wurdest",    secondPl: "wurdet",
            thirdSg: "wurde",       thirdPl : "wurden",
        }
    },
    verlassen : {preterit : {secondSg: "verließest,verließt"}},
    halten : {
        present : {thirdSg : "hält"},
        preterit : {secondSg: "hieltest,hieltst"}},
    müssen : {present : {secondSg: "müsst"}},
    tun : {preterit : {secondSg: "tatest,tatst" }},
    entscheiden : {preterit : {secondSg: "entschiedest,entschiedst"}},
    verstanden : {preterit : {secondSg: "verstandest,verstandst"}},
    finden : {preterit : {secondSg: "fandest,fandst"}},
    sitzen : {preterit : {secondSg: "saßest,saßt"}},
    heißen : {preterit: {secondSg: "hießest,hießt"}},
    fragen : {
        present : {
            secondSg: "fragst,frägst",
            thirdSg: "fragt,frägt"},
        preterit: {
            firstSg : "fragte,frug",   firstPl : "fragten,frugen",
            secondSg: "fragtest,frugst", secondPl: "fragtet,frugt",
            thirdSg : "fragte,frug",   thirdPl : "fragten,frugen"}},
    reden : {present : {secondPl: "redet"}},
    kosten : {present : {secondPl: "kostet"}},
    verbessern : {present : {firstSg: "verbessre,verbessere,verbesser"}},
    lächeln : {present : {firstSg : "lächle,lächele,lächel"}}, //need to look into present -en endings
    arbeiten : {present : {secondPl : "arbeitet"}},
    schalten : {present : {secondPl : "schaltet"}}
}

const german = {}

const verbs = {
    //: {infinitive : "", strength : "", thirdSgPres : "", pastStem : "", pastPart : "", pastSubj : "", aux : ""},
    sein : {verb : "sein", english : "be", prep : "", presentStem : ["",""], strength : "strong", preteriteStem : "war", pastPart : "gewesen", aux : "sein"},
    haben : {verb : "haben", english : "have", prep : "", presentStem : ["",""], strength : "weak", preteriteStem : "hat", pastPart : "gehabt", aux : "haben"},
    werden : {verb : "werden", english : "become", prep : "", presentStem : ["",""], strength : "strong", preteriteStem : "wurd", pastPart : "geworden", aux : "sein"},
    kommen : {verb : "kommen", english : "come", prep: "", presentStem : ["komm","komm"], strength : "strong", preteriteStem : "kam", pastPart : "gekommen", aux : "sein"},
    ankommen : {verb : "ankommen", english : "arrive", prep : "an", presentStem : ["komm","komm"], strength : "strong", preteriteStem : "kam", pastPart : "angekommen", aux: "sein"},
    verlassen: {verb : "verlassen", english : "leave", prep : "", presentStem : ["verlass","verläss"], strength : "strong", preteriteStem : "verließ", pastPart : "verlassen", aux: "haben"},
    fahren : {verb : "fahren", english : "drive, ride", prep: "", presentStem : ["fahr","fähr"], strength : "strong", preteriteStem : "fuhr", pastPart : "gefahren", aux : "sein,haben"},
    halten : {verb : "halten", english : "hold, keep", prep : "", presentStem : ["halt","hält"], strength : "strong", preteriteStem : "hielt", pastPart : "gehalten", aux : "haben"},
    schlafen : {verb : "schlafen", english : "sleep", prep : "", presentStem : ["schlaf","schläf"], strength : "strong", preteriteStem : "schlief", pastPart : "geschlafen", aux : "haben"},
    erhalten : {verb : "erhalten", english : "revieve, get", prep : "", presentStem : ["erhalt","erhält"], strength : "strong", preteriteStem : "hielt", pastPart : "erhalten", aux : "haben"},
    fangen : {verb : "fangen", english : "catch", prep : "", presentStem : ["fang","fäng"], strength : "strong", preteriteStem : "fing", pastPart : "gefangen", aux : "haben"},
    anfangen : {verb : "anfangen", english : "begin", prep : "an", presentStem : ["fang","fäng"], strength : "strong", preteriteStem : "fing", pastPart : "angefangen", aux : "haben"},
    fallen : {verb : "fallen", english : "fall", prep : "", presentStem : ["fall","fäll"], strength : "strong", preteriteStem : "fiel", pastPart : "gefallen", aux : "sein"},
    vergessen : {verb : "vergessen", english : "forget", prep : "", presentStem : ["vergess","vergiss"], strength : "strong", preteriteStem : "vergaß", pastPart : "vergessen", aux : "haben"},
    essen : {verb : "essen", english : "eat", prep : "", presentStem : ["ess","iss"], strength : "strong", preteriteStem : "aß", pastPart : "gegessen", aux : "haben"},
    sterben : {verb : "sterben", english : "die", prep : "", presentStem : ["sterb","stirb"], strength : "strong", preteriteStem : "starb", pastPart : "gestorben", aux : "sein"},
    nehmen : {verb : "nehmen", english : "take", prep : "", presentStem : ["nehm","nimm"], strength : "strong", preteriteStem : "nahm", pastPart : "genommen", aux : "haben"},
    geschehen : {verb : "geschehen", english : "happen", prep : "", presentStem : ["gescheh","geschieh"], strength : "strong", preteriteStem : "geschah", pastPart : "geschehen", aux : "sein"},
    helfen : {verb : "helfen", english : "help", prep : "", presentStem : ["helf","hilf"], strength : "strong", preteriteStem : "half", pastPart : "geholfen", aux : "haben"},
    lesen : {verb : "lesen", english : "read", prep : "", presentStem : ["les","lies"], strength : "strong", preteriteStem : "las", pastPart : "gelesen", aux : "haben"},
    sprechen : {verb : "sprechen", english : "speak", prep : "", presentStem : ["sprech","sprich"], strength : "strong", preteriteStem : "sprach", pastPart : "gesprochen", aux : "haben"},
    geben : {verb : "geben", english : "give", prep : "", presentStem : ["geb","gib"], strength : "strong", preteriteStem : "gab", pastPart : "gegeben", aux : "haben"},
    treffen : {verb : "treffen", english : "meet", prep : "", presentStem : ["treff","triff"], strength : "strong", preteriteStem : "traf", pastPart : "getroffen", aux : "haben"},
    sehen : {verb : "sehen", english : "see", prep : "", presentStem : ["seh","sieh"], strength : "string", preteriteStem : "sah", pastPart : "gesehen", aux : "haben"},
    können : {verb : "können", english : "can", prep : "", presentStem : ["könn","kann"], strength : "prt-prs", preteriteStem : "konn", pastPart : "gekonnt", aux : "haben"},
    müssen : {verb : "müssen", english : "must", prep : "", presentStem : ["müss","muss"], strength : "prt-prs", preteriteStem : "muss", pastPart : "müssen", aux : "haben"},
    wollen : {verb : "wollen", english : "want", prep : "", presentStem : ["woll","will"], strength : "prt-prs", preteriteStem : "woll", pastPart : "", aux : "haben"},
    wissen : {verb : "wissen", english : "know", prep : "", presentStem : ["wiss","wieß"], strength : "prt-prs", preteriteStem : "wuss", pastPart : "gewussten", aux : "haben"},
    tun : {verb : "tun", english : "do", prep : "", presentStem : ["tu","tu"], strength : "weak", preteriteStem : "ta", pastPart : "getan", aux : "haben"},
    gehen : {verb : "gehen", english : "go, walk, leave", prep : "", presentStem : ["geh","geh"], strength : "strong", preteriteStem : "ging", pastPart : "gegangen", aux : "sein"},
    schreiben : {verb : "schreiben", english : "write", prep : "", presentStem : ["schreib","schreib"], strength : "strong", preteriteStem : "schrieb", pastPart : "geschrieben", aux : "haben"},
    erkennen : {verb : "erkennen", english : "recognise", prep : "", presentStem : ["erkenn","erkenn"], strength : "weak", preteriteStem : "erkann", pastPart : "erkannt", aux : "haben"},
    beschreiben : {verb : "beschreiben", english : "describe", prep : "", presentStem : ["beschreib","beschreib"], strength : "strong", preteriteStem : "beschrieb", pastPart : "beschrieben", aux : "haben"},
    schreien : {verb : "scheien", english : "scream", prep : "", presentStem : ["schei","schrei"], strength : "strong", preteriteStem : "schrie", pastPart : "geschrien", aux : "haben"},
    trinken : {verb : "trinken", english : "drink", prep : "", presentStem : ["trink","trink"], strength : "strong", preteriteStem : "trank", pastPart : "getrunken", aux : "haben"},
    denken : {verb : "denken", english : "think", prep : "", presentStem : ["denk","denk"], strength : "weak", preteriteStem : "dach", pastPart : "gedacht", aux : "haben"},
    entscheiden : {verb : "entscheiden", english : "decide", prep : "", presentStem : ["entscheid","entscheid"], strength : "strong", preteriteStem : "entschied", pastPart : "enschieden", aux : "haben"},
    verstehen : {verb : "verstehen", english : "understand", prep : "", presentStem : ["versteh","versteh"], strength : "strong", preteriteStem : "verstand", pastPart : "verstanden", aux : "haben"},
    finden : {verb : "finden", english : "find", prep : "", presentStem : ["find","find"], strength : "strong", preteriteStem : "fand", pastPart : "gefunden", aux : "haben"},
    singen : {verb : "singen", english : "sing", prep : "", presentStem : ["sing","sing"], strength : "strong", preteriteStem : "sang", pastPart : "gesungen", aux : "haben"},
    sitzen : {verb : "sitzen", english : "sit", prep : "", presentStem : ["sitz","sitz"], strength : "strong", preteriteStem : "saß", pastPart : "gesessen", aux : "sein,haben"},
    lügen : {verb : "lügen", english : "lie", prep : "", presentStem : ["lüg","lüg"], strength : "strong", preteriteStem : "log", pastPart : "gelogen", aux : "haben"},
    anbieten : {verb : "anbieten", english : "offer", prep : "an", presentStem : ["biet","biete"], strength : "strong", preteriteStem : "bot", pastPart : "angeboten", aux : "haben"},
    bringen : {verb : "bringen", english : "bring", prep : "", presentStem : ["bring","bring"], strength : "weak", preteriteStem : "brach", pastPart : "gebracht", aux : "haben"},
    brennen : {verb : "brennen", english : "burn", prep : "", presentStem : ["brenn","brenn"], strength : "weak", preteriteStem : "brann", pastPart : "gebrannt", aux : "haben"},
    schneiden : {verb : "schneiden", english : "cut", prep : "", presentStem : ["schneid","schneid"], strength : "strong", preteriteStem : "schnitt", pastPart : "geschnitten", aux : "haben"},
    beginnen : {verb : "beginnen", english : "start, begin", prep : "", presentStem : ["beginn","beginn"], strength : "strong", preteriteStem : "begann", pastPart : "begonnen", aux : "haben"},
    gewinnen : {verb : "gewinnen", english : "win", prep : "", presentStem : ["gewinn","gewinn"], strength : "strong", preteriteStem : "gewann", pastPart : "gewonnen", aux : "haben"},
    bleiben : {verb : "bleiben", english : "stay, last", prep : "", presentStem : ["bleib","bleib"], strength : "strong", preteriteStem : "blieb", pastPart : "geblieben", aux : "sein"},
    rennen : {verb : "rennen", english : "run", prep : "", presentStem : ["renn","renn"], strength : "strong", preteriteStem : "rann", pastPart : "gerannt", aux : "sein,haben"},
    verlieren : {verb : "verlieren", english : "lose", prep : "", presentStem : ["verlier","verlier"], strength : "strong", preteriteStem : "verlor", pastPart : "verloren", aux : "haben"},
    rufen : {verb : "rufen", english : "call", prep : "", presentStem : ["ruf","ruf"], strength : "strong", preteriteStem : "rief", pastPart : "gerufen", aux : "haben"},
    heißen : {verb : "heißen", english : "mean", prep : "", presentStem : ["heiß","heiß"], strength : "strong", preteriteStem : "hieß", pastPart : "geheißen", aux : "haben"},
    lernen : {verb : "lernen", english : "learn", prep : "", presentStem : ["lern","lern"], strength : "weak", preteriteStem : "lern", pastPart : "gelernt", aux : "haben"},
    machen : {verb : "machen", english : "do, make", prep : "", presentStem : ["mach","mach"], strength : "weak", preteriteStem : "mach", pastPart : "gemacht", aux : "haben"},
    besuchen : {verb : "besuchen", english : "visit", prep : "", presentStem : ["besuch","besuch"], strength : "weak", preteriteStem : "besuch", pastPart : "besucht", aux : "haben"},
    reisen : {verb : "reisen", english : "travel", prep : "", presentStem : ["reis","reis"], strength : "weak", preteriteStem : "reis", pastPart : "gereist", aux : "sein"},
    brauchen : {verb : "brauchen", english : "need", prep : "", presentStem : ["brauch","brauch"], strength : "weak", preteriteStem : "brauch", pastPart : "gebraucht", aux : "haben"},
    legen : {verb : "legen", english : "lay, put", prep : "", presentStem : ["leg","leg"], strength : "weak", preteriteStem : "leg", pastPart : "gelegt", aux : "haben"},
    zeigen : {verb : "zeigen", english : "show", prep : "", presentStem : ["zeig","zeig"], strength : "weak", preteriteStem : "zeig", pastPart : "gezeigt", aux : "haben"},
    hören : {verb : "hören", english : "hear", prep : "", presentStem : ["hör","hör"], strength : "weak", preteriteStem : "hör", pastPart : "gehört", aux : "haben"},
    schauen : {verb : "schauen", english : "look", prep : "", presentStem : ["schau","schau"], strength : "weak", preteriteStem : "schau", pastPart : "geschaut", aux : "haben"},
    sagen : {verb : "sagen", english : "say", prep : "", presentStem : ["sag","sag"], strength : "weak", preteriteStem : "sag", pastPart : "gesagt", aux : "haben"},
    erklären : {verb : "erklären", english : "explain", prep : "", presentStem : ["erklär","erklär"], strength : "weak", preteriteStem : "erklär", pastPart : "erklärt", aux : "haben"},
    erzählen : {verb : "erzählen", english : "tell", prep : "", presentStem : ["erzähl","erzähl"], strength : "weak", preteriteStem : "erzähl", pastPart : "erzählt", aux : "haben"},
    fragen : {verb : "fragen", english : "ask", prep : "", presentStem : ["frag","frag"], strength : "weak", preteriteStem : "frag", pastPart : "gefragt", aux : "haben"},
    reden : {verb : "reden", english : "talk", prep : "", presentStem : ["red","rede"], strength : "weak", preteriteStem : "rede", pastPart : "geredet", aux : "haben"},
    wiederholen : {verb : "wiederholen", english : "repeat", prep : "", presentStem : ["wiederhol","wiederhol"], strength : "weak", preteriteStem : "wiederhol", pastPart : "gewiederholt", aux : "haben"},
    lehren : {verb : "lehren", english : "teach", prep : "", presentStem : ["lehr","lehr"], strength : "weak", preteriteStem : "lehr", pastPart : "gelehrt", aux : "haben"},
    studieren : {verb : "studieren", english : "study", prep : "", presentStem : ["studier","studier"], strength : "studier", preteriteStem : "studier", pastPart : "studiert", aux : "haben"},
    ausruhen : {verb : "ausruhen", english : "rest", prep : "aus", presentStem : ["ruh","ruh"], strength : "weak", preteriteStem : "ruh", pastPart : "ausgeruht", aux : "haben"},
    erlauben : {verb : "erlauben", english : "allow", prep : "", presentStem : ["erlaub","erlaub"], strength : "weak", preteriteStem : "erlaub", pastPart : "erlaubt", aux : "haben"},
    glauben : {verb : "glauben", english : "believe", prep : "", presentStem : ["glaub","glaub"], strength : "weak", preteriteStem : "glaub", pastPart : "geglaubt", aux : "haben"},
    hoffen : {verb : "hoffen", english : "hope", prep : "", presentStem : ["hoff","hoff"], strength : "weak", preteriteStem : "hoff", pastPart : "hoff", aux : "haben"},
    tanzen : {verb : "tanzen", english : "dance", prep : "", presentStem : ["tanz","tanz"], strength : "weak", preteriteStem : "tanz", pastPart : "getanzt", aux : "haben,sein"},
    bewegen : {verb : "bewegen", english : "move", prep : "", presentStem : ["beweg","beweg"], strength : "strong", preteriteStem : "bewog", pastPart : "bewogen", aux : "haben"},
    kämpfen : {verb : "kämpfen", english : "fight", prep : "", presentStem : ["kämpf","kämpf"], strength : "weak", preteriteStem : "kämpf", pastPart : "gekämpft", aux : "haben"},
    auswählen : {verb : "auswählen", english : "choose", prep : "aus", presentStem : ["wähl","wähl"], strength : "weak", preteriteStem : "wähl", pastPart : "ausgewählt", aux : "haben"},
    hassen : {verb : "hassen", english : "hate", prep : "", presentStem : ["hass","hass"], strength : "weak", preteriteStem : "hass", pastPart : "gehasst", aux : "haben"},
    lieben : {verb : "lieben", english : "love", prep : "", presentStem : ["lieb","lieb"], strength : "weak", preteriteStem : "lieb", pastPart : "geliebt", aux : "haben"},
    bevorzugen : {verb : "bevorzugen", english : "prefer", prep : "", presentStem : ["bevorzug","bevorzug"], strength : "weak", preteriteStem : "bevorzug", pastPart : "bevorzugt", aux : "haben"},
    lachen : {verb : "lachen", english : "laugh", prep : "", presentStem : ["lach","lach"], strength : "weak", preteriteStem : "lach", pastPart : "gelacht", aux : "haben"},
    weinen : {verb : "weinen", english : "cry", prep : "", presentStem : ["wein","wein"], strength : "weak", preteriteStem : "wein", pastPart : "geweint", aux : "haben"},
    versuchen : {verb : "versuchen", english : "try", prep : "", presentStem : ["versuch","versuch"], strength : "weak", preteriteStem : "versuch", pastPart : "versucht", aux : "haben"},
    üben : {verb : "üben", english : "practice", prep : "", presentStem : ["üb","üb"], strength : "weak", preteriteStem : "üb", pastPart : "geübt", aux : "haben"},
    berühen : {verb : "berühen", english : "touch", prep : "", presentStem : ["berüh","berüh"], strength : "weak", preteriteStem : "berüh", pastPart : "berüht", aux : "haben"},
    drücken : {verb : "drücken", english : "press", prep : "", presentStem : ["drück","drück"], strength : "weak", preteriteStem : "drück", pastPart : "gedrückt", aux : "haben"},
    leben : {verb : "leben", english : "live", prep : "", presentStem : ["leb","leb"], strength : "weak", preteriteStem : "leb", pastPart : "gelebt", aux : "haben"},
    fühlen : {verb : "fühlen", english : "feel", prep : "", presentStem : ["fühl","fühl"], strength : "weak", preteriteStem : "fühl", pastPart : "gefühlt", aux : "haben"},
    spielen : {verb : "spielen", english : "", prep : "", presentStem : ["spiel","spiel"], strength : "weak", preteriteStem : "weak", pastPart : "spiel", aux : "haben"},
    kaufen : {verb : "kaufen", english : "buy, purchase", prep : "", presentStem : ["kauf","kauf"], strength : "weak", preteriteStem : "kauf", pastPart : "gekauft", aux : "haben"},
    verkaufen : {verb : "verkaufen", english : "sell", prep : "", presentStem : ["verkauf","verkauf"], strength : "weak", preteriteStem : "verkauf", pastPart : "verkauft", aux : "haben"},
    kosten : {verb : "kosten", english : "cost, taste", prep : "", presentStem : ["kost","koste"], strength : "weak", preteriteStem : "koste", pastPart : "gekostet", aux : "haben"},
    benutzen : {verb : "benutzen", english : "use", prep : "", presentStem : ["benutz","benutz"], strength : "weak", preteriteStem : "benutz", pastPart : "benutzt", aux : "haben"},
    handeln : {verb : "handeln", english : "act, trade", prep : "", presentStem : ["handel","handel"], strength : "weak", preteriteStem : "handel", pastPart : "gehandelt", aux : "haben"},
    verbessern : {verb : "verbessern", english : "improve", prep : "", presentStem : ["verbesser","verbesser"], strength : "weak", preteriteStem : "verbesser", pastPart : "verbessert", aux : "haben"},
    lächeln : {verb : "lächeln", english : "smile", prep : "", presentStem : ["lächel","lächel"], strength : "weak", preteriteStem : "lächel", pastPart : "gelächelt", aux : "haben"},
    arbeiten : {verb : "arbeiten", english : "work", prep : "", presentStem : ["arbeit","arbeite"], strength : "weak", preteriteStem : "arbeite", pastPart : "gearbeitet", aux : "haben"},
    antworten : {verb : "antworten", english : "answer", prep : "", presentStem : ["antwort","antworte"], strength : "weak", preteriteStem : "antworte", pastPart : "geantwortet", aux : "haben"},
    schalten : {verb : "schalten", english : "switch", prep : "", presentStem : ["schalt","schalte"], strength : "weak", preteriteStem : "schalte", pastPart : "geschaltet,geschalten", aux : "haben"},
}

const dissalloweds = [
    'sein perfect',
    'sein pluperfect',
    'haben perfect',
    'haben pluperfect',
    'können perfect',
    'können pluperfect',
    'müssen perfect',
    'müssen pluperfect',
    'wollen perfect',
    'wollen pluperfect',
    'vergessen preterit'
]

const persons = {
    firstSg : "ich",
    secondSg : "du",
    thirdSg : {masc: "er", fem : "sie", neut: "es"},
    firstPl : "wir",
    secondPl : "ihr",
    thirdPl : {fm: "Sie", infm: "sie"}
  }
  
const tenses = {
    present : "[prs] … jetzt",
    preterit : "(geschrieben) [prs] … gestern",
    perfect : "(gesprochen) [prs] … gestern …",
    pluperfect : "[prs] … gerstern zuerst … dann",
    future : "morgen … [prs] vielleicht …",
    futurePerfect : "morgen … [prs] wohl … …"
 }

 function conjugate(vrb, english, prep, presentStem, strength, preteriteStem, pastPart, aux, pers, ten) {
    let conjugated = ""
    switch (ten) {
        case 'present' : conjugated = conjugateWhichPRS(prep, strength, presentStem, pers); break
        case 'preterit' : conjugated = conjugatePRT(prep, strength, preteriteStem, pers); break
        case 'perfect' : conjugated = conjugatePRF(pastPart, aux, pers); break
        case 'pluperfect' : conjugated = conjugatePPRF(pastPart, aux, pers); break
        case 'future' : conjugated = conjugateFUTI(vrb, pers); break
        case 'futurePerfect' :  conjugated = conjugateFUTII(pastPart, aux, pers); break
    }
    try {
        if (irregs[vrb][ten][pers] === undefined) {
            return conjugated
        } else
        conjugated = irregs[vrb][ten][pers]
        return conjugated
    } catch (e) {
        switch (conjugated) {
            case "erhältt" : return "erhält"
            case "vergissst" : return "vergisst"
            case "vergaßst" : return "vergaßt"
            case "issst" : return "isst"
            case "aßst" : return "aßt"
            case "liesst" : return "liest"
            case "lasst" : return "last"
            case "mussst" : return "musst"
            case "wießst" : return "wießt"
            case "heißst" : return "heißt"
            default : return conjugated
        }
    }
}

function conjugateWhichPRS(prep, strength, presentStem, pers) {
    switch (strength) {
        case 'prt-prs' : return conjugateStrPRT(prep, presentStem[0], pers)
        default : return conjugatePRS(prep, presentStem, pers)
    }
}

function conjugatePRS(prep, presentStem, pers) {
    switch (pers) {
        case 'firstSg' : return (presentStem[0] + "e" + " " + prep).trim()
        case 'secondSg': return (presentStem[1] + "st" + " " + prep).trim()
        case 'thirdSg' : return (presentStem[1] + "t" + " " + prep).trim()
        case 'firstPl' : return (presentStem[0] + "en" + " " + prep).trim()
        case 'secondPl': return (presentStem[0] + "t" + " " + prep).trim()
        case 'thirdPl' : return (presentStem[0] + "en" + " " + prep).trim()
    }
}

function conjugatePRT(prep, strength, preteriteStem, pers) {
    switch (strength) {
        case "weak" : return conjugateWeakPRT(prep, preteriteStem, pers)
        case "strong" : return conjugateStrPRT(prep, preteriteStem, pers)
        case "prt-prs" : return conjugateWeakPRT(prep, preteriteStem, pers)
    }
}

function conjugateWeakPRT(prep, preteriteStem, pers) {
    switch (pers) {
        case 'firstSg' : return (preteriteStem + "te" + " " + prep).trim()
        case 'secondSg': return (preteriteStem + "test" + " " + prep).trim()
        case 'thirdSg' : return (preteriteStem + "te" + " " + prep).trim()
        case 'firstPl' : return (preteriteStem + "ten" + " " + prep).trim()
        case 'secondPl': return (preteriteStem + "tet" + " " + prep).trim()
        case 'thirdPl' : return (preteriteStem + "ten" + " " + prep).trim()
    }
}

function conjugateStrPRT(prep, preteriteStem, pers) {
    switch (pers) {
        case 'firstSg' : return (preteriteStem + " " + prep).trim()
        case 'secondSg': return (preteriteStem + "st" + " " + prep).trim()
        case 'thirdSg' : return (preteriteStem + " " + prep).trim()
        case 'firstPl' : return (preteriteStem + "en" + " " + prep).trim()
        case 'secondPl': return (preteriteStem + "t" + " " + prep).trim()
        case 'thirdPl' : return (preteriteStem + "en" + " " + prep).trim()
    }
}

const perfHelper = ["", ","]

function conjugatePRF (pastPart, aux, pers) {
    let it = 0
    let conjugatedPerfect = ""
    let pastParts = pastPart.split(",")
    let auxes = aux.split(",")
    for (indexPastParts = 0; indexPastParts <= pastParts.length - 1; indexPastParts++) {
        for (indexAuxes = 0; indexAuxes <= auxes.length - 1; indexAuxes++) {
            conjugatedPerfect = conjugatedPerfect + perfHelper[it++] + irregs[auxes[indexAuxes]].present[pers] + " " + pastParts[indexPastParts]
        }
    }
    return conjugatedPerfect
}

function conjugatePPRF (pastPart, aux, pers) {
    let it = 0
    let conjugatedPluPerfect = ""
    let pastParts = pastPart.split(",")
    let auxes = aux.split(",")
    for (indexPastParts = 0; indexPastParts <= pastParts.length - 1; indexPastParts++) {
        for (indexAuxes = 0; indexAuxes <= auxes.length - 1; indexAuxes++) {
            conjugatedPluPerfect = conjugatedPluPerfect + perfHelper[it++] + irregs[auxes[indexAuxes]].preterit[pers] + " " + pastParts[indexPastParts]
        }
    }
    return conjugatedPluPerfect
}

function conjugateFUTI (vrb, pers) {
    return irregs.werden.present[pers] + " " + vrb
}

function conjugateFUTII(pastPart, aux, pers) {
    let it =  0
    let conjugatedFutPerfect = ""
    let pastParts = pastPart.split(",")
    let auxes = aux.split(",")
    for (indexPastParts = 0; indexPastParts <= pastParts.length - 1; indexPastParts++) {
        for (indexAuxes = 0; indexAuxes <= auxes.length - 1; indexAuxes++) {
            conjugatedFutPerfect = conjugatedFutPerfect + perfHelper[it++] + irregs.werden.present[pers] + " " + pastParts[indexPastParts] + " " + auxes[indexAuxes]
        }
    }
    return conjugatedFutPerfect
}

function randomize(vrb){
    if (vrb === undefined) w = Object.keys(verbs)[Math.floor(Math.random() * Object.keys(verbs).length)]
    t = randomTense()
    p = Object.keys(persons)[Math.floor(Math.random() * Object.keys(persons).length)]
    switch (p) {
        case 'thirdSg': prn = Object.values(persons.thirdSg)[Math.floor(Math.random() * 2)]; break;
        case 'thirdPl' : prn = Object.values(persons.thirdPl)[Math.floor(Math.random() * 1)]; break;
        default : prn = persons[p]
    }
    if (dissalloweds.some(v => (w + " " + t).includes(v))) {
        randomize(w)
    } else {
        verb = w
        person = p
        tense = t
        verbBox.innerHTML = verbs[w].verb
        textBox.placeholder = tenses[t].replace('[prs]',prn)
    }
}

function randomTense() {
    rand = Math.random() * 100
    if (rand < 27 ) {
        return 'present'
    } else if (26 < rand && rand < 43) {
        return 'preterit'
    } else if (42 < rand && rand < 65) {
        return 'perfect'
    } else if (64 < rand && rand < 75) {
        return 'pluperfect'
    } else if (74 < rand && rand < 91) {
        return 'future'
    } else {
        return 'futurePerfect'
    }
}