//
//  main.js
//
//  A project template for using arbor.js
//

(function($){

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem

    var that = {
      init:function(system){
        //
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system
        //
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

    particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords
          

          // determine the box size and round off the coords if we'll be 
          // drawing a text label (awful alignment jitter otherwise...)
          var w = ctx.measureText(node.data.label||"").width + 6
          var label = node.data.label
          if (!(label||"").match(/^[ \t]*$/)){
            pt.x = Math.floor(pt.x)
            pt.y = Math.floor(pt.y)
          }else{
            label = null
          }
          
          // clear any edges below the text label
          // ctx.fillStyle = 'rgba(255,255,255,.6)'
          // ctx.fillRect(pt.x-w/2, pt.y-7, w,14) 

          ctx.clearRect(pt.x-w/2, pt.y-7, w,14) 

          // draw the text
          if (label){
            ctx.font = "bold 14px Arial"
            ctx.textAlign = "center"
            
            // if (node.data.region) ctx.fillStyle = palette[node.data.region]
            // else ctx.fillStyle = "#888888"
            ctx.fillStyle = "#222222"

            // ctx.fillText(label||"", pt.x, pt.y+4)
            ctx.fillText(label||"", pt.x, pt.y+4)
          }
        })     			
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }    

  $(document).ready(function(){
    var g = arbor.ParticleSystem(8000, 800, 0.3) // create the system with sensible repulsion/stiffness/friction
    g.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
    g.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...
     
    // add some nodes to the graph and watch it go...
  g.addNode("one",{label:"one"})
g.addNode("two",{label:"two"})
g.addNode("one",{label:"one"})
g.addNode("out",{label:"out"})
g.addNode("example",{label:"example"})
g.addNode("set",{label:"set"})
g.addNode("more",{label:"more"})
g.addNode("one",{label:"one"})
g.addNode("example",{label:"example"})
g.addNode("system",{label:"system"})
g.addNode("code",{label:"code"})
g.addNode("list",{label:"list"})
g.addNode("group",{label:"group"})
g.addNode("more",{label:"more"})
g.addNode("genes",{label:"genes"})
g.addNode("population",{label:"population"})
g.addNode("it’s",{label:"it’s"})
g.addNode("out",{label:"out"})
g.addNode("back",{label:"back"})
g.addNode("time",{label:"time"})
g.addNode("code",{label:"code"})
g.addNode("function",{label:"function"})
g.addNode("polynomial",{label:"polynomial"})
g.addNode("sph",{label:"sph"})
g.addNode("function",{label:"function"})
g.addNode("gaussian",{label:"gaussian"})
g.addNode("one",{label:"one"})
g.addNode("time",{label:"time"})
g.addNode("set",{label:"set"})
g.addNode("space",{label:"space"})
g.addNode("asymptotic",{label:"asymptotic"})
g.addNode("form",{label:"form"})
g.addNode("information",{label:"information"})
g.addNode("one",{label:"one"})
g.addNode("one",{label:"one"})
g.addNode("system",{label:"system"})
g.addNode("coq",{label:"coq"})
g.addNode("set",{label:"set"})
g.addNode("edge",{label:"edge"})
g.addNode("time",{label:"time"})
g.addNode("function",{label:"function"})
g.addNode("program",{label:"program"})
g.addNode("function",{label:"function"})
g.addNode("prior",{label:"prior"})
g.addNode("one",{label:"one"})
g.addNode("such",{label:"such"})
g.addNode("cash",{label:"cash"})
g.addNode("earnings",{label:"earnings"})
g.addNode("one",{label:"one"})
g.addNode("types",{label:"types"})
g.addNode("one",{label:"one"})
g.addNode("universe",{label:"universe"})
g.addNode("memory",{label:"memory"})
g.addNode("more",{label:"more"})
g.addNode("financial",{label:"financial"})
g.addNode("income",{label:"income"})
g.addNode("key",{label:"key"})
g.addNode("string",{label:"string"})
g.addNode("nat",{label:"nat"})
g.addNode("one",{label:"one"})
g.addNode("it’s",{label:"it’s"})
g.addNode("know",{label:"know"})
g.addNode("function",{label:"function"})
g.addNode("number",{label:"number"})
g.addNode("pro",{label:"pro"})
g.addNode("set",{label:"set"})
g.addNode("analysis",{label:"analysis"})
g.addNode("one",{label:"one"})
g.addNode("key",{label:"key"})
g.addNode("program",{label:"program"})
g.addNode("category",{label:"category"})
g.addNode("map",{label:"map"})
g.addNode("change",{label:"change"})
g.addNode("systems",{label:"systems"})
g.addNode("learning",{label:"learning"})
g.addNode("systems",{label:"systems"})
g.addNode("measurement",{label:"measurement"})
g.addNode("more",{label:"more"})
g.addNode("different",{label:"different"})
g.addNode("mean",{label:"mean"})
g.addNode("more",{label:"more"})
g.addNode("people",{label:"people"})
g.addNode("energy",{label:"energy"})
g.addNode("systems",{label:"systems"})
g.addNode("proof",{label:"proof"})
g.addNode("type",{label:"type"})
g.addNode("recognition",{label:"recognition"})
g.addNode("signal",{label:"signal"})
g.addNode("data",{label:"data"})
g.addNode("training",{label:"training"})
g.addNode("data",{label:"data"})
g.addNode("test",{label:"test"})
g.addNode("proof",{label:"proof"})
g.addNode("term",{label:"term"})
g.addNode("change",{label:"change"})
g.addNode("per",{label:"per"})
g.addNode("mean",{label:"mean"})
g.addNode("more",{label:"more"})
g.addNode("more",{label:"more"})
g.addNode("press",{label:"press"})
g.addNode("such",{label:"such"})
g.addNode("theorem",{label:"theorem"})
g.addNode("query",{label:"query"})
g.addNode("text",{label:"text"})
g.addNode("data",{label:"data"})
g.addNode("wealth",{label:"wealth"})
g.addNode("data",{label:"data"})
g.addNode("economic",{label:"economic"})
g.addNode("case",{label:"case"})
g.addNode("set",{label:"set"})
g.addNode("posterior",{label:"posterior"})
g.addNode("prior",{label:"prior"})
g.addNode("global",{label:"global"})
g.addNode("wealth",{label:"wealth"})
g.addNode("such",{label:"such"})
g.addNode("theory",{label:"theory"})
g.addNode("boosting",{label:"boosting"})
g.addNode("decision",{label:"decision"})
g.addNode("cost",{label:"cost"})
g.addNode("countries",{label:"countries"})
g.addNode("prove",{label:"prove"})
g.addNode("show",{label:"show"})
g.addNode("data",{label:"data"})
g.addNode("learning",{label:"learning"})
g.addNode("program",{label:"program"})
g.addNode("set",{label:"set"})
g.addNode("more",{label:"more"})
g.addNode("now",{label:"now"})
g.addNode("each",{label:"each"})
g.addNode("figure",{label:"figure"})
g.addNode("chapter",{label:"chapter"})
g.addNode("use",{label:"use"})
g.addNode("con",{label:"con"})
g.addNode("pro",{label:"pro"})
g.addNode("company",{label:"company"})
g.addNode("section",{label:"section"})
g.addNode("error",{label:"error"})
g.addNode("tree",{label:"tree"})
g.addNode("more",{label:"more"})
g.addNode("women",{label:"women"})
g.addNode("chapter",{label:"chapter"})
g.addNode("data",{label:"data"})
g.addNode("maps",{label:"maps"})
g.addNode("show",{label:"show"})
g.addNode("bits",{label:"bits"})
g.addNode("probability",{label:"probability"})
g.addNode("com",{label:"com"})
g.addNode("message",{label:"message"})
g.addNode("chapter",{label:"chapter"})
g.addNode("message",{label:"message"})
g.addNode("proof",{label:"proof"})
g.addNode("prove",{label:"prove"})
g.addNode("programs",{label:"programs"})
g.addNode("rules",{label:"rules"})
g.addNode("example",{label:"example"})
g.addNode("trees",{label:"trees"})
g.addNode("more",{label:"more"})
g.addNode("natural",{label:"natural"})
g.addNode("proof",{label:"proof"})
g.addNode("theorem",{label:"theorem"})
g.addNode("android",{label:"android"})
g.addNode("int",{label:"int"})
g.addNode("code",{label:"code"})
g.addNode("using",{label:"using"})
g.addNode("code",{label:"code"})
g.addNode("www",{label:"www"})
g.addNode("category",{label:"category"})
g.addNode("set",{label:"set"})
g.addNode("application",{label:"application"})
g.addNode("system",{label:"system"})
g.addNode("example",{label:"example"})
g.addNode("new",{label:"new"})
g.addNode("code",{label:"code"})
g.addNode("use",{label:"use"})
g.addNode("function",{label:"function"})
g.addNode("functions",{label:"functions"})
g.addNode("homology",{label:"homology"})
g.addNode("show",{label:"show"})
g.addNode("com",{label:"com"})
g.addNode("line",{label:"line"})
g.addNode("protein",{label:"protein"})
g.addNode("selection",{label:"selection"})
g.addNode("space",{label:"space"})
g.addNode("vector",{label:"vector"})
g.addNode("now",{label:"now"})
g.addNode("through",{label:"through"})
g.addNode("human",{label:"human"})
g.addNode("population",{label:"population"})
g.addNode("gene",{label:"gene"})
g.addNode("genes",{label:"genes"})
g.addNode("polynomial",{label:"polynomial"})
g.addNode("variety",{label:"variety"})
g.addNode("case",{label:"case"})
g.addNode("form",{label:"form"})
g.addNode("asymptotic",{label:"asymptotic"})
g.addNode("singularity",{label:"singularity"})
g.addNode("combinatorial",{label:"combinatorial"})
g.addNode("permutations",{label:"permutations"})
g.addNode("inference",{label:"inference"})
g.addNode("one",{label:"one"})
g.addNode("analysis",{label:"analysis"})
g.addNode("log",{label:"log"})
g.addNode("accounting",{label:"accounting"})
g.addNode("cash",{label:"cash"})
g.addNode("business",{label:"business"})
g.addNode("income",{label:"income"})
g.addNode("brain",{label:"brain"})
g.addNode("die",{label:"die"})
g.addNode("people",{label:"people"})
g.addNode("task",{label:"task"})
g.addNode("isomorphism",{label:"isomorphism"})
g.addNode("maps",{label:"maps"})
g.addNode("category",{label:"category"})
g.addNode("functor",{label:"functor"})
g.addNode("see",{label:"see"})
g.addNode("two",{label:"two"})
g.addNode("classi",{label:"classi"})
g.addNode("systems",{label:"systems"})
g.addNode("quantum",{label:"quantum"})
g.addNode("state",{label:"state"})
g.addNode("signal",{label:"signal"})
g.addNode("speech",{label:"speech"})
g.addNode("terms",{label:"terms"})
g.addNode("used",{label:"used"})
g.addNode("search",{label:"search"})
g.addNode("text",{label:"text"})
g.addNode("documents",{label:"documents"})
g.addNode("query",{label:"query"})
g.addNode("document",{label:"document"})
g.addNode("information",{label:"information"})
g.addNode("decision",{label:"decision"})
g.addNode("trees",{label:"trees"})
g.addNode("each",{label:"each"})
g.addNode("graph",{label:"graph"})
g.addNode("each",{label:"each"})
g.addNode("map",{label:"map"})
g.addNode("cost",{label:"cost"})
g.addNode("global",{label:"global"})
g.addNode("see",{label:"see"})
g.addNode("tree",{label:"tree"})
g.addNode("con",{label:"con"})
g.addNode("programs",{label:"programs"})
g.addNode("model",{label:"model"})
g.addNode("training",{label:"training"})
g.addNode("codes",{label:"codes"})
g.addNode("probability",{label:"probability"})
g.addNode("probability",{label:"probability"})
g.addNode("random",{label:"random"})
g.addNode("chapter",{label:"chapter"})
g.addNode("return",{label:"return"})
g.addNode("algorithm",{label:"algorithm"})
g.addNode("learning",{label:"learning"})
g.addNode("android",{label:"android"})
g.addNode("application",{label:"application"})
g.addNode("programming",{label:"programming"})
g.addNode("types",{label:"types"})
g.addNode("down",{label:"down"})
g.addNode("through",{label:"through"})
g.addNode("http",{label:"http"})
g.addNode("www",{label:"www"})
g.addNode("each",{label:"each"})
g.addNode("used",{label:"used"})
g.addNode("between",{label:"between"})
g.addNode("human",{label:"human"})
g.addNode("gene",{label:"gene"})
g.addNode("genetic",{label:"genetic"})
g.addNode("ideal",{label:"ideal"})
g.addNode("ote",{label:"ote"})
g.addNode("permutations",{label:"permutations"})
g.addNode("singularity",{label:"singularity"})
g.addNode("analytic",{label:"analytic"})
g.addNode("log",{label:"log"})
g.addNode("accounting",{label:"accounting"})
g.addNode("business",{label:"business"})
g.addNode("brain",{label:"brain"})
g.addNode("der",{label:"der"})
g.addNode("people",{label:"people"})
g.addNode("value",{label:"value"})
g.addNode("functor",{label:"functor"})
g.addNode("homotopy",{label:"homotopy"})
g.addNode("two",{label:"two"})
g.addNode("values",{label:"values"})
g.addNode("speaker",{label:"speaker"})
g.addNode("speech",{label:"speech"})
g.addNode("clustering",{label:"clustering"})
g.addNode("search",{label:"search"})
g.addNode("document",{label:"document"})
g.addNode("documents",{label:"documents"})
g.addNode("generating",{label:"generating"})
g.addNode("tree",{label:"tree"})
g.addNode("probability",{label:"probability"})
g.addNode("theory",{label:"theory"})
g.addNode("algorithm",{label:"algorithm"})
g.addNode("problem",{label:"problem"})
g.addNode("cambridge",{label:"cambridge"})
g.addNode("http",{label:"http"})
g.addNode("between",{label:"between"})
g.addNode("dna",{label:"dna"})
g.addNode("ideal",{label:"ideal"})
g.addNode("sph",{label:"sph"})
g.addNode("der",{label:"der"})
g.addNode("und",{label:"und"})
g.addNode("groups",{label:"groups"})
g.addNode("homotopy",{label:"homotopy"})
g.addNode("clustering",{label:"clustering"})
g.addNode("words",{label:"words"})
g.addNode("distribution",{label:"distribution"})
g.addNode("gaussian",{label:"gaussian"})
g.addNode("model",{label:"model"})
g.addNode("models",{label:"models"})
g.addNode("matrix",{label:"matrix"})
g.addNode("vector",{label:"vector"})
g.addNode("cambridge",{label:"cambridge"})
g.addNode("permitted",{label:"permitted"})
g.addNode("dna",{label:"dna"})
g.addNode("selection",{label:"selection"})
g.addNode("similarity",{label:"similarity"})
g.addNode("words",{label:"words"})
g.addNode("capital",{label:"capital"})
g.addNode("countries",{label:"countries"})
  g.addEdge("one", "two");
g.addEdge("one", "out");
g.addEdge("example", "set");
g.addEdge("more", "one");
g.addEdge("example", "system");
g.addEdge("code", "list");
g.addEdge("group", "more");
g.addEdge("genes", "population");
g.addEdge("it’s", "out");
g.addEdge("back", "time");
g.addEdge("code", "function");
g.addEdge("polynomial", "sph");
g.addEdge("function", "gaussian");
g.addEdge("one", "time");
g.addEdge("set", "space");
g.addEdge("asymptotic", "form");
g.addEdge("information", "one");
g.addEdge("one", "system");
g.addEdge("coq", "set");
g.addEdge("edge", "time");
g.addEdge("function", "program");
g.addEdge("function", "prior");
g.addEdge("one", "such");
g.addEdge("cash", "earnings");
g.addEdge("one", "types");
g.addEdge("one", "universe");
g.addEdge("memory", "more");
g.addEdge("financial", "income");
g.addEdge("key", "string");
g.addEdge("nat", "one");
g.addEdge("it’s", "know");
g.addEdge("function", "number");
g.addEdge("pro", "set");
g.addEdge("analysis", "one");
g.addEdge("key", "program");
g.addEdge("category", "map");
g.addEdge("change", "systems");
g.addEdge("learning", "systems");
g.addEdge("measurement", "more");
g.addEdge("different", "mean");
g.addEdge("more", "people");
g.addEdge("energy", "systems");
g.addEdge("proof", "type");
g.addEdge("recognition", "signal");
g.addEdge("data", "training");
g.addEdge("data", "test");
g.addEdge("proof", "term");
g.addEdge("change", "per");
g.addEdge("mean", "more");
g.addEdge("more", "press");
g.addEdge("such", "theorem");
g.addEdge("query", "text");
g.addEdge("data", "wealth");
g.addEdge("data", "economic");
g.addEdge("case", "set");
g.addEdge("posterior", "prior");
g.addEdge("global", "wealth");
g.addEdge("such", "theory");
g.addEdge("boosting", "decision");
g.addEdge("cost", "countries");
g.addEdge("prove", "show");
g.addEdge("data", "learning");
g.addEdge("program", "set");
g.addEdge("more", "now");
g.addEdge("each", "figure");
g.addEdge("chapter", "use");
g.addEdge("con", "pro");
g.addEdge("company", "section");
g.addEdge("error", "tree");
g.addEdge("more", "women");
g.addEdge("chapter", "data");
g.addEdge("maps", "show");
g.addEdge("bits", "probability");
g.addEdge("com", "message");
g.addEdge("chapter", "message");
g.addEdge("proof", "prove");
g.addEdge("programs", "rules");
g.addEdge("example", "trees");
g.addEdge("more", "natural");
g.addEdge("proof", "theorem");
g.addEdge("android", "int");
g.addEdge("code", "using");
g.addEdge("code", "www");
g.addEdge("category", "set");
g.addEdge("application", "system");
g.addEdge("example", "new");
g.addEdge("code", "use");
g.addEdge("function", "functions");
g.addEdge("homology", "show");
g.addEdge("com", "line");
g.addEdge("protein", "selection");
g.addEdge("space", "vector");
g.addEdge("now", "through");
g.addEdge("human", "population");
g.addEdge("gene", "genes");
g.addEdge("polynomial", "variety");
g.addEdge("case", "form");
g.addEdge("asymptotic", "singularity");
g.addEdge("combinatorial", "permutations");
g.addEdge("inference", "one");
g.addEdge("analysis", "log");
g.addEdge("accounting", "cash");
g.addEdge("business", "income");
g.addEdge("brain", "die");
g.addEdge("people", "task");
g.addEdge("isomorphism", "maps");
g.addEdge("category", "functor");
g.addEdge("see", "two");
g.addEdge("classi", "systems");
g.addEdge("quantum", "state");
g.addEdge("signal", "speech");
g.addEdge("terms", "used");
g.addEdge("search", "text");
g.addEdge("documents", "query");
g.addEdge("document", "information");
g.addEdge("decision", "trees");
g.addEdge("each", "graph");
g.addEdge("each", "map");
g.addEdge("cost", "global");
g.addEdge("see", "tree");
g.addEdge("con", "programs");
g.addEdge("model", "training");
g.addEdge("codes", "probability");
g.addEdge("probability", "random");
g.addEdge("chapter", "return");
g.addEdge("algorithm", "learning");
g.addEdge("android", "application");
g.addEdge("programming", "types");
g.addEdge("down", "through");
g.addEdge("http", "www");
g.addEdge("each", "used");
g.addEdge("between", "human");
g.addEdge("gene", "genetic");
g.addEdge("ideal", "ote");
g.addEdge("permutations", "singularity");
g.addEdge("analytic", "log");
g.addEdge("accounting", "business");
g.addEdge("brain", "der");
g.addEdge("people", "value");
g.addEdge("functor", "homotopy");
g.addEdge("two", "values");
g.addEdge("speaker", "speech");
g.addEdge("clustering", "search");
g.addEdge("document", "documents");
g.addEdge("generating", "tree");
g.addEdge("probability", "theory");
g.addEdge("algorithm", "problem");
g.addEdge("cambridge", "http");
g.addEdge("between", "dna");
g.addEdge("ideal", "sph");
g.addEdge("der", "und");
g.addEdge("groups", "homotopy");
g.addEdge("clustering", "words");
g.addEdge("distribution", "gaussian");
g.addEdge("model", "models");
g.addEdge("matrix", "vector");
g.addEdge("cambridge", "permitted");
g.addEdge("dna", "selection");
g.addEdge("similarity", "words");
g.addEdge("capital", "countries");
    // or, equivalently:
    //
    // sys.graft({
    //   nodes:{
    //     f:{alone:true, mass:.25}
    //   }, 
    //   edges:{
    //     a:{ b:{},
    //         c:{},
    //         d:{},
    //         e:{}
    //     }
    //   }
    // })
    
  })

})(this.jQuery)