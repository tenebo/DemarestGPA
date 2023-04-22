import std/dom
import std/jsffi
import std/strutils
import std/tables
import std/strformat
import std/math

proc rows*(n: Node): seq[Node] {.importcpp: "#.rows", nodecl.}
proc cells*(n: Node): seq[Node] {.importcpp: "#.cells", nodecl.}


proc animate*(n: Node, keyframes: seq[JsObject],
        options: JsObject): Node {.importcpp: "#.animate(#,#)", nodecl.}
proc `onfinish=`*(n: Node; x: proc) {.importcpp: "#.onfinish = #", nodecl.}

proc replace*(n: cstring, regex: JsObject,
        opt: cstring): cstring {.importcpp: "#.replace(#,#)", nodecl.}
proc replace*(n: cstring, regex: cstring,
        opt: cstring): cstring {.importcpp: "#.replace(#,#)", nodecl.}
proc regex*(reg: cstring, opt: cstring): JsObject {.importcpp: "new RegExp(#,#)", constructor.}

const gradeLetters = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+",
        "D", "D-", "F"]
const gpaRegular = {"A+": 4.33, "A": 4.0, "A-": 3.67, "B+": 3.33, "B": 3.0,
        "B-": 2.67,
"C+": 2.33, "C": 2.0, "C-": 1.67, "D+": 1.33, "D": 1.0, "D-": 0.67, "F": 0.0
}.toTable

const gpaWeighted = {
    "Enriched": 0.25, "Honors": 1.0, "AP": 1.25
}.toTable

const halfYear = ["Business Law", "Computer Applications", "Entrepreneurship",
    "Fashion Marketing", "Financial Literacy",
    "International Business", "Sports & Entertainment Management",
    "Computer Science", "Java Honors", "Advanced Java Honors",
    "Web Design", "Creative Writing I", "Creative Writing II Honors",
    "Film Study", "Forensics I", "Forensics II",
    "Parcc English", "Ceramics I", "Ceramics II", "Ceramics III", "Crafts I",
    "Crafts II", "Photography", "Advanced Photography",
    "Culinary Arts I", "Foods Around the World", "Culinary Arts II",
    "Child Development I", "Child Development II",
    "Child Development III", "Interior Design I", "Interior Design II",
    "Introduction to Technology", "Technology II",
    "Strategic Design", "Video and Broadcast Production I",
    "Video and Broadcast Production II", "Broadway Workshop",
    "Math Lab", "Parcc Mathematics", "Economics", "Economics Honors",
    "Psychology", "Advanced Psychology", "Sociology"]

const labs = ["Biology", "Biology Enriched", "Biology Honors", "Ap Biology",
    "Principles in Anatomy", "Anatomy & Physiology",
    "Research in Molecular Biology", "Chemistry", "Chemistry Enriched",
    "Chemistry Honors", "AP Chemistry", "Physics Enriched",
    "Physics Honors", "AP Physics C: Mechanics",
    "AP Physics C: Electricity & Magnetism", "AP Environmental Science",
    "Science Research Program I", "Science Research Program II", "Science Research Program III"]

const semester = ["Forensic Science", "Robotics Engineering"]

proc ifValid(name: string, grade: string): bool =
    return not name.contains("Physical Ed") and
            not name.contains("Health") and
            gradeLetters.contains(grade)

proc raiseLetterGrade(letterGrade: string): string =
    for i in 0..gradeLetters.len-1:
        if gradeLetters[i] == letterGrade:
            if i <= 0:
                return "A+"
            return gradeLetters[i-1]
    return "A+"

proc lowerLetterGrade(letterGrade: string): string =
    for i in 0..gradeLetters.len-1:
        if gradeLetters[i] == letterGrade:
            if i >= gradeLetters.len-1:
                return "F"
            return gradeLetters[i+1]
    return "F"

proc main() =
    const loadingStyles = cstring""".demarest-gpa-loading { margin: 0 auto; top-margin: 40px; position: relative; width: 80px; height: 100px; z-index: 1; } .demarest-gpa-loading div { position: absolute; top: 33px; width: 13px; height: 13px; border-radius: 50%; background-color: #1565c0; animation-timing-function: cubic-bezier(0, 1, 1, 0); } .demarest-gpa-loading div:nth-child(1) { left: 8px; animation: demarest-gpa-loading1 0.6s infinite; } .demarest-gpa-loading div:nth-child(2) { left: 8px; animation: demarest-gpa-loading2 0.6s infinite; } .demarest-gpa-loading div:nth-child(3) { left: 32px; animation: demarest-gpa-loading2 0.6s infinite; } .demarest-gpa-loading div:nth-child(4) { left: 56px; animation: demarest-gpa-loading3 0.6s infinite; } @keyframes demarest-gpa-loading1 { 0% { transform: scale(0); } 100% { transform: scale(1); } } @keyframes demarest-gpa-loading3 { 0% { transform: scale(1); } 100% { transform: scale(0); } } @keyframes demarest-gpa-loading2 { 0% { transform: translate(0, 0); } 100% { transform: translate(24px, 0); } }
        .demarest-gpa-selection {
            display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; padding: 10px; border-bottom: 1px solid #e0e0e0;
        }
        .demarest-gpa-selection div {
            display: flex; flex-direction: row; width: 100%;
        }
        .demarest-gpa-selection div:nth-child(1) {
            justify-content: space-between; align-items: center;
        }
        .demarest-gpa-selection div:nth-child(2) {
            justify-content: center; align-items: flex-start;
        }
        .demarest-gpa-change-button {
            background-color: #1565c0; width: 30px; border: 1px solid #ffffff; border-radius: 5px; padding: 5px; color: #fff; font-size: 16px; font-weight: 500; cursor: pointer; margin: 10px;
        }
        .demarest-gpa-table-text {
            font-size: 16px; font-weight: 500; color: #000; margin: 10px; width: 80px;
        }
    """
    let loadingDOM = document.createElement("div")
    loadingDOM.setAttribute("id", "loading")
    loadingDOM.setAttribute("class", "demarest-gpa-loading")
    loadingDOM.appendChild(document.createElement("div"))
    loadingDOM.appendChild(document.createElement("div"))
    loadingDOM.appendChild(document.createElement("div"))
    loadingDOM.appendChild(document.createElement("div"))

    var grades: seq[string] = newSeq[string]()
    var courses: seq[string] = newSeq[string]()
    var gpas: seq[float64] = newSeq[float64]()
    var toggle = true
    var calculating = false
    var ogTable: Node

    proc displayGpa(gpa, unweightedgpa: float64)
    proc activateToggle(e: Event)
    proc createTable()

    proc calculateGpaNum(ccourses, cgrades: seq[string]): (float64, float64) =
        var credits: seq[float64] = newSeq[float64]()
        var total_credits: float64 = 0.0

        var qualityPoints: float64 = 0

        var unweightedgpas = newSeq[float64]()
        var unweightedgpa = 0.0
        var unweightedQualityPoints = 0.0

        for course in ccourses:
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
        gpas = @[]
        for i in 0..ccourses.len-1:
            if ccourses[i].contains("AP"):
                gpas.add(gpaRegular[cgrades[i]]+gpaWeighted["AP"])
            elif ccourses[i].contains("Honors"):
                gpas.add(gpaRegular[cgrades[i]]+gpaWeighted["Honors"])
            elif ccourses[i].contains("(E)"):
                gpas.add(gpaRegular[cgrades[i]]+gpaWeighted["Enriched"])
            else:
                gpas.add(gpaRegular[cgrades[i]])
        for i in 0..ccourses.len-1:
            qualityPoints += gpas[i] * credits[i]
        var gpa = qualityPoints / total_credits
        for i in 0..cgrades.len-1:
            unweightedgpas.add(gpaRegular[cgrades[i]])

        for i in 0..cgrades.len-1:
            unweightedQualityPoints += unweightedgpas[i] * credits[i]

        unweightedgpa = unweightedQualityPoints / total_credits
        return (gpa, unweightedgpa)

    proc reCalcGpa(e: Event) =
        if (calculating):
            return
        calculating = true
        if not document.querySelector("#gpa").isNil():
            document.querySelector("#gpa").remove()
        document.querySelector("p[class='sectionTitle']").appendChild(
                loadingDOM)
        let direction = $(e.target.value)
        let current = parseInt($(e.target.id))
        if direction == "up":
            grades[current] = raiseLetterGrade(grades[current])
        elif direction == "down":
            grades[current] = lowerLetterGrade(grades[current])
        var (gpa, unweightedgpa) = calculateGpaNum(courses, grades)
        displayGpa(gpa, unweightedgpa)
        createTable()

    proc createTable() =
        if not document.querySelector("div[id='demarestGpaCustomTable']").isNil():
            document.querySelector("div[id='demarestGpaCustomTable']").remove()
        var table = document.createElement("div")
        table.id = cstring"demarestGpaCustomTable"
        table.setAttribute("style", "display:flex; flex-direction:column; justify-content:center; width:100%")

        for i in 0..courses.len-1:
            let selection = document.createElement("div")
            selection.setAttribute("class", "demarest-gpa-selection")
            let selection1 = document.createElement("div")
            let selection2 = document.createElement("div")

            let title = document.createElement("p")
            title.setAttribute("class", "demarest-gpa-table-text")
            title.innerText = cstring(courses[i])
            selection2.appendChild(title)

            let upButton = document.createElement("button")
            upButton.setAttribute("id", cstring($(i)))
            upButton.setAttribute("class", "demarest-gpa-change-button")
            upButton.innerText = "+"
            upButton.value = "up"
            upButton.onclick = reCalcGpa
            selection2.appendChild(upButton)

            let gpaState = document.createElement("p")
            gpaState.setAttribute("class", "demarest-gpa-table-text")
            gpaState.innerText = fmt"{grades[i]} | {gpas[i]}".cstring
            selection2.appendChild(gpaState)

            let downButton = document.createElement("button")
            downButton.setAttribute("id", cstring($(i)))
            downButton.setAttribute("class", "demarest-gpa-change-button")
            downButton.innerText = "-"
            downButton.value = "down"
            downButton.onclick = reCalcGpa


            selection2.appendChild(downButton)
            selection1.appendChild(selection2)
            selection.appendChild(selection1)
            table.appendChild(selection)
        document.querySelector("td[colspan='2']").appendChild(table)


    proc displayGpa(gpa, unweightedgpa: float64) =
        proc doAnimate() =
            let gpaDOM = document.createElement("div")
            gpaDOM.setAttribute("id", "gpa")
            gpaDOM.setAttribute("style", "height: 100px; opacity: 1; width: 200px; display: flex; justify-content: center; align-items: center; margin: auto;")
            let left = document.createElement("p")
            left.setAttribute("class", "gpa")
            left.setAttribute("style", "color:#ffffff;background-color:#1565c0;text-align:center; width:150px;border-radius:25px 0px 0px 25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px; border-color: rgb(187, 187, 187);border-right-style: solid;")
            left.innerHTML = fmt"Weighted<br />{round(gpa,2)}".cstring
            let right = document.createElement("p")
            right.setAttribute("class", "gpa")
            right.setAttribute("style", "color:#ffffff;background-color:#1565c0;text-align:center; width:150px;border-radius:0px 25px 25px 0px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px; border-color: rgb(187, 187, 187);border-left-style: solid;")
            right.innerHTML = fmt"Unweighted<br />{round(unweightedgpa,2)}".cstring
            gpaDOM.appendChild(left)
            gpaDOM.appendChild(right)

            if not document.querySelector("#loading").isNil():
                document.querySelector("#loading").remove()
            document.querySelector("p[class='sectionTitle']").appendChild(gpaDOM)

            var gpaDiv = document.querySelector("#gpa")
            gpaDiv.style.opacity = cstring"0.6"
            gpaDiv.animate(@[
                JsObject{cstring"width": cstring"275px",
                        cstring"opacity": cstring"1"}
            ], JsObject{cstring"duration": 400,
                    cstring"iterations": 1}).onfinish = proc () =
                gpaDiv.style.opacity = cstring"1"
                gpaDiv.style.width = cstring"275px"
            calculating = false;
            gpaDiv.onclick = activateToggle

        if not calculating:
            return
        if isNaN(gpa):
            document.querySelector("#loading").remove()
            return
        discard setTimeout(doAnimate, 1000)

    proc activateToggle(e: Event) =
        if toggle:
            if not document.querySelector("table[class='list']").isNil():
                document.querySelector("table[class='list']").remove()
            createTable()
            toggle = false
        else:
            if not document.querySelector(
                    "div[id='demarestGpaCustomTable']").isNil():
                document.querySelector("div[id='demarestGpaCustomTable']").remove()
            document.querySelector("td[colspan='2']").appendChild(ogTable)
            toggle = true

    proc initalCalculate() =
        if (calculating):
            return
        calculating = true
        if not document.querySelector("#gpa").isNil():
            document.querySelector("#gpa").remove()
        document.querySelector("p[class='sectionTitle']").appendChild(
                loadingDOM)
        var (gpa, unweightedgpa) = calculateGpaNum(courses, grades)
        displayGpa(gpa, unweightedgpa)

    if document.querySelector("table[class='list']").isNil():
        return
    ogTable = document.querySelector("table[class='list']").cloneNode(true)
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
        if grades_and_classes[i].cells.len < 3 or grades_and_classes[i].cells[
                2].isNil():
            return
        var mgrade =  grades_and_classes[i].cells[2].innerText
        # echo mgrade.replace(cstring"*PROJECTED",cstring"")
        var grade = $(mgrade.replace(cstring"*PROJECTED",cstring"").replace(
            regex(cstring"[^A-F+-]", cstring"g"),
            cstring""
        ))
        if ifValid(name, grade):
            grades.add(grade)
            courses.add(name)
    when not defined(release):
        echo courses, grades
    if courses.len == 0 or grades.len == 0:
        return

    if document.querySelector("#loading").isNil():
        initalCalculate()

if isMainModule:
    main()
