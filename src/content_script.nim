import std/dom
import std/jsffi
import std/strutils
import std/tables
import std/strformat
import std/math

let loadingStyles = cstring""".lds-ellipsis { margin: 0 auto; top-margin: 40px; position: relative; width: 80px; height: 100px; z-index: 1; } .lds-ellipsis div { position: absolute; top: 33px; width: 13px; height: 13px; border-radius: 50%; background-color: #1565c0; animation-timing-function: cubic-bezier(0, 1, 1, 0); } .lds-ellipsis div:nth-child(1) { left: 8px; animation: lds-ellipsis1 0.6s infinite; } .lds-ellipsis div:nth-child(2) { left: 8px; animation: lds-ellipsis2 0.6s infinite; } .lds-ellipsis div:nth-child(3) { left: 32px; animation: lds-ellipsis2 0.6s infinite; } .lds-ellipsis div:nth-child(4) { left: 56px; animation: lds-ellipsis3 0.6s infinite; } @keyframes lds-ellipsis1 { 0% { transform: scale(0); } 100% { transform: scale(1); } } @keyframes lds-ellipsis3 { 0% { transform: scale(1); } 100% { transform: scale(0); } } @keyframes lds-ellipsis2 { 0% { transform: translate(0, 0); } 100% { transform: translate(24px, 0); } }"""
let loading = cstring"""<div id="loading" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>"""

proc rows*(n: Node): seq[Node] {.importcpp: "#.rows", nodecl.}
proc cells*(n: Node): seq[Node] {.importcpp: "#.cells", nodecl.}
proc innerText*(n: cstring): cstring {.importcpp: "#.innerText", nodecl.}


proc animate*(n: Node, keyframes: seq[JsObject],options: JsObject): Node {.importcpp: "#.animate(#,#)", nodecl.}
proc `onfinish=`*(n: Node; x: proc) {.importcpp: "#.onfinish = #", nodecl.}

proc replace*(n: cstring, regex:JsObject, opt:cstring): cstring {.importcpp: "#.replace(#,#)", nodecl.}
proc regex*(reg:cstring, opt:cstring):JsObject  {.importcpp: "new RegExp(#,#)", constructor.}


var grades:seq[string] = @[]
var courses = newSeq[string]()
var credits = newSeq[float64]() 
var gpas:seq[float64] = @[]
var unweightedgpas = newSeq[float64]()
var total_credits:float64 = 0
var qualityPoints:float64 = 0
# var toggle = true
var calculating = false

const gradeLetters = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
const gpaRegular = {"A+": 4.3, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
"C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0
}.toTable
const gpaHonors = {"A+": 4.8, "A": 4.5, "A-": 4.2, "B+": 3.8, "B": 3.5, "B-": 3.2,
"C+": 2.8, "C": 2.5, "C-": 2.2, "D+": 1.8, "D": 1.5, "D-": 1.2, "F": 0.0
}.toTable
const gpaAp = {"A+": 5.3, "A": 5.0, "A-": 4.7, "B+": 4.3, "B": 4.0, "B-": 3.7,
"C+": 3.3, "C": 3.0, "C-": 2.7, "D+": 2.3, "D": 2.0, "D-": 1.7, "F": 0.0
}.toTable

const halfYear = ["Business Law", "Computer Applications", "Entrepreneurship", "Fashion Marketing", "Financial Literacy",
    "International Business", "Sports & Entertainment Management", "Computer Science", "Java Honors", "Advanced Java Honors",
    "Web Design", "Creative Writing I", "Creative Writing II Honors", "Film Study", "Forensics I", "Forensics II",
    "Parcc English", "Ceramics I", "Ceramics II", "Ceramics III", "Crafts I", "Crafts II", "Photography", "Advanced Photography",
    "Culinary Arts I", "Foods Around the World", "Culinary Arts II", "Child Development I", "Child Development II",
    "Child Development III", "Interior Design I", "Interior Design II", "Introduction to Technology", "Technology II",
    "Strategic Design", "Video and Broadcast Production I", "Video and Broadcast Production II", "Broadway Workshop",
    "Math Lab", "Parcc Mathematics", "Economics", "Economics Honors", "Psychology", "Advanced Psychology", "Sociology"];

const labs = ["Biology", "Biology Enriched", "Biology Honors", "Ap Biology", "Principles in Anatomy", "Anatomy & Physiology",
    "Research in Molecular Biology", "Chemistry", "Chemistry Enriched", "Chemistry Honors", "AP Chemistry", "Physics Enriched",
    "Physics Honors", "AP Physics C: Mechanics", "AP Physics C: Electricity & Magnetism", "AP Environmental Science",
    "Science Research Program I", "Science Research Program II", "Science Research Program III"];

const semester = ["Forensic Science", "Robotics Engineering"];

proc ifValid(name:string, grade:string):bool = 
    return not name.contains("Physical Ed") and 
            not name.contains("Health") and 
            gradeLetters.contains(grade)

# proc raiseLetterGrade(letterGrade:string):string = 
#     for i in 0..gradeLetters.len-1:
#         if gradeLetters[i]==letterGrade:
#             if i <= 0:
#                 return "A+"
#             return gradeLetters[i-1]
#     return "A+"

# proc lowerLetterGrade(letterGrade:string):string = 
#     for i in 0..gradeLetters.len-1:
#         if gradeLetters[i]==letterGrade:
#             if i >= gradeLetters.len-1:
#                 return "F"
#             return gradeLetters[i+1]
#     return "F"

proc calculateGpaNum(ccourses, cgrades:seq[string]):(float64,float64)=
    for course in courses:
      if (halfYear.contains(course)):
        credits.add(2.5)
        total_credits += 2.5
      elif (labs.contains(course)):
        credits.add(6);
        total_credits += 6;
      elif(semester.contains(course)):
        credits.add(3);
        total_credits += 3;
      else:
        credits.add(5);
        total_credits += 5;
    
    for i in 0..courses.len-1:
        if courses[i].contains("AP"):
            gpas.add(gpaAp[grades[i]])
        elif courses[i].contains("Honors"):
            gpas.add(gpaHonors[grades[i]])
        else:
            gpas.add(gpaRegular[grades[i]])
    for i in 0..courses.len-1:
        qualityPoints += gpas[i] * credits[i]
    var gpa = qualityPoints / total_credits
    for i in 0..grades.len-1:
        unweightedgpas.add(gpaRegular[grades[i]])
    var unweightedgpa = 0.0
    var unweightedQualityPoints = 0.0
    for i in 0..grades.len-1:
        unweightedQualityPoints += unweightedgpas[i] * credits[i]

    unweightedgpa = unweightedQualityPoints / total_credits
    return (gpa, unweightedgpa)

proc displayGpa(gpa,unweightedgpa:float64) = 
    proc doAnimate()= 
        let html = fmt"""<div id="gpa" style="height: 100px; opacity: 1; width: 200px; display: flex; justify-content: center; align-items: center; margin: auto;">
            <p class="gpa" style="color:#ffffff;background-color:#1565c0;text-align:center; width:150px;border-radius:25px 0px 0px 25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px; border-color: rgb(187, 187, 187);border-right-style: solid;"> Weighted <br />{round(gpa,2)}</p>
            <p class="gpa" style="color:#ffffff;background-color:#1565c0;text-align:center; width:150px;border-radius:0px 25px 25px 0px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px; border-color: rgb(187, 187, 187);border-left-style: solid;"> Unweighted <br />{round(unweightedgpa,2)}</p>
        <div>"""
        let prsr = newDomParser()
        let gpaDOM = prsr.parseFromString(html.cstring, "text/html".cstring).documentElement
        document.querySelector("#loading").remove()
        document.querySelector("p[class='sectionTitle']").appendChild(gpaDOM)
        
        var gpaDiv = document.querySelector("#gpa")
        gpaDiv.style.opacity = cstring"0.6"
        gpaDiv.animate(@[
            JsObject{ cstring"width": cstring"275px", cstring"opacity": cstring"1"}
        ], JsObject{cstring"duration": 400, cstring"iterations": 1}).onfinish = proc ()=
            gpaDiv.style.opacity = cstring"1"
            gpaDiv.style.width = cstring"275px"
        

    if not calculating:
        return
    if isNaN(gpa):
        document.querySelector("#loading").remove()
        return
    discard setTimeout(doAnimate, 1000)

proc initalCalculate()=
    if (calculating):
        return
    calculating = true
    if not document.querySelector("#gpa").isNil():
        document.querySelector("#gpa").remove()
    let prsr = newDomParser()
    let loadingDOM = prsr.parseFromString(loading, "text/html".cstring)
    document.querySelector("p[class='sectionTitle']").appendChild(loadingDOM.documentElement)
    var (gpa, unweightedgpa) = calculateGpaNum(courses,grades)
    echo gpa, unweightedgpa
    displayGpa(gpa, unweightedgpa)

proc main() {.exportc.}=
    var ogTable = document.querySelector("table[class='list']")
    if ogTable.isNil():
        return
    var grades_and_classes = document.querySelector("table[class='list']").rows
    if document.querySelector("p[class='sectionTitle']").isNil():
        return
    if document.querySelector("#loadingStyles").isNil():
        var styledom = document.createElement("style")
        styledom.id = "loadingStyles"
        styledom.textContent = loadingStyles
        document.querySelector("p[class='sectionTitle']").appendChild(styledom)
    for i in 1..grades_and_classes.len-1:
        var name = $(grades_and_classes[i].cells[0].innerText)
        if grades_and_classes[i].cells.len < 3 or grades_and_classes[i].cells[2].isNil():
            return
        var grade = $(grades_and_classes[i].cells[2].innerText.replace(
            regex(cstring"[^A-F+-]", cstring"g"),
            cstring""
        ))
        if ifValid(name, grade):
            grades.add(grade)
            courses.add(name)
    if courses.len == 0 or grades.len == 0:
        return
    echo courses, grades

    if document.querySelector("#loading").isNil():
        initalCalculate()

if isMainModule:
    main()