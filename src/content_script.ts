$(document).ready(function () {
  let grades:string[] = [];
  let courses:string[] = [];
  let credits:number[] = [];
  let gpas:number[] = [];
  let unweightedgpas:number[] = [];
  let total_credits = 0;
  let qualityPoints = 0;
  let toggle = true;
  let calculating = false;

  // GPAs for each class type
  const GradeLetters = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
  const gpaRegular:Record<string,number> = {
    "A+": 4.3, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0
  };
  const gpaHonors:Record<string,number>  = {
    "A+": 4.8, "A": 4.5, "A-": 4.2, "B+": 3.8, "B": 3.5, "B-": 3.2,
    "C+": 2.8, "C": 2.5, "C-": 2.2, "D+": 1.8, "D": 1.5, "D-": 1.2, "F": 0.0
  };
  const gpaAp:Record<string,number>  = {
    "A+": 5.3, "A": 5.0, "A-": 4.7, "B+": 4.3, "B": 4.0, "B-": 3.7,
    "C+": 3.3, "C": 3.0, "C-": 2.7, "D+": 2.3, "D": 2.0, "D-": 1.7, "F": 0.0
  };

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

  let loadingStyles = `<style id="loadingStyles"> .lds-ellipsis { margin: 0 auto; top-margin: 40px; position: relative; width: 80px; height: 100px; z-index: 1; } .lds-ellipsis div { position: absolute; top: 33px; width: 13px; height: 13px; border-radius: 50%; background-color: #1565c0; animation-timing-function: cubic-bezier(0, 1, 1, 0); } .lds-ellipsis div:nth-child(1) { left: 8px; animation: lds-ellipsis1 0.6s infinite; } .lds-ellipsis div:nth-child(2) { left: 8px; animation: lds-ellipsis2 0.6s infinite; } .lds-ellipsis div:nth-child(3) { left: 32px; animation: lds-ellipsis2 0.6s infinite; } .lds-ellipsis div:nth-child(4) { left: 56px; animation: lds-ellipsis3 0.6s infinite; } @keyframes lds-ellipsis1 { 0% { transform: scale(0); } 100% { transform: scale(1); } } @keyframes lds-ellipsis3 { 0% { transform: scale(1); } 100% { transform: scale(0); } } @keyframes lds-ellipsis2 { 0% { transform: translate(0, 0); } 100% { transform: translate(24px, 0); } } </style>`;
  let loading = `<div id="loading" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

  // A valid course must not be a non gpa class i.e gym, and have a valid grade
  const ifValid = (name:string, grade:string) => {
    return (
      typeof name == "string" &&
      typeof grade == "string" &&
      name.indexOf("Physical Ed") == -1 &&
      name.indexOf("Health") == -1 &&
      grade.indexOf("No Grades") == -1 &&
      grade.indexOf("Not Graded") == -1 &&
      grade.length > 0
    );
  };

  // FUNCTIONS
  function raiseLetterGrade(letterGrade:string) {
    for (let i=0;GradeLetters.length>i;i++){
      if(GradeLetters[i]==letterGrade){
        if (i <= 0){
          return "A+"
        }
        return GradeLetters[i-1]
      }
    }
    return "A+"
  }

  function lowerLetterGrade(letterGrade:string) {
    for (let i=0;GradeLetters.length>i;i++){
      if(GradeLetters[i]==letterGrade){
        if (i >= GradeLetters.length-1){
          return "F"
        }
        return GradeLetters[i+1]
      }
    }
    return "F"
  }

  function reCalculateGpa(id:number, direction:string) {
    if (calculating) return;
    calculating = true;
    $("#gpa").remove();
    $("p[class='sectionTitle']").append(loading);

    if (courses[id].indexOf("AP") > -1) {
      if (direction == "up") {
        gpas[id] = gpaAp[raiseLetterGrade(grades[id])];
        grades[id] = raiseLetterGrade(grades[id]);
      } else if (direction == "down") {
        gpas[id] = gpaAp[lowerLetterGrade(grades[id])];
        grades[id] = lowerLetterGrade(grades[id]);
      }
    } else if (courses[id].indexOf("Honors") > -1) {
      if (direction == "up") {
        gpas[id] = gpaHonors[raiseLetterGrade(grades[id])];
        grades[id] = raiseLetterGrade(grades[id]);
      } else if (direction == "down") {
        gpas[id] = gpaHonors[lowerLetterGrade(grades[id])];
        grades[id] = lowerLetterGrade(grades[id]);
      }
    } else {
      if (direction == "up") {
        gpas[id] = gpaRegular[raiseLetterGrade(grades[id])];
        grades[id] = raiseLetterGrade(grades[id]);
      } else if (direction == "down") {
        gpas[id] = gpaRegular[lowerLetterGrade(grades[id])];
        grades[id] = lowerLetterGrade(grades[id]);
      }
    }
    qualityPoints = 0;
    for (let i = 0; i < gpas.length; i++) {
      qualityPoints += gpas[i] * credits[i];
    }

    // Calculate Unweighted GPA, just use the regular gpa table
    for (let i = 0; i < gpas.length; i++) {
      unweightedgpas[i] = gpaRegular[grades[i]];
    }

    let gpa = qualityPoints / total_credits;
    let unweightedgpa = 0;
    let unweightedQualityPoints = 0;
    for (let i = 0; i < unweightedgpas.length; i++) {
      unweightedQualityPoints += unweightedgpas[i] * credits[i];
    }
    unweightedgpa = unweightedQualityPoints / total_credits;

    createCustomTable();
    displayGpa(gpa,unweightedgpa);
  }

  function createCustomTable() {
    $("div[id='customTable']").remove();
    let customTable = `<div id="customTable" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">`;

    for (let i = 0; i < courses.length; i++) {
      customTable += `
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; padding: 10px; border-bottom: 1px solid #e0e0e0;">
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%;">
          <div style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; width: 100%;">
            <p style="font-size: 16px; font-weight: 500; color: #000; margin: 10px; width: 80px;">${courses[i]}</p>
            <button id="${i}" class="upGpa hover:bg-green-200" style="background-color: #1565c0; width: 30px; border: 1px solid #ffffff; border-radius: 5px; padding: 5px; color: #fff; font-size: 16px; font-weight: 500; cursor: pointer; margin: 10px;">+</button>
            <p style="font-size: 16px; font-weight: 500; color: #000; margin: 10px; width: 80px;">${grades[i]} | ${gpas[i]}</p>  
            <button id="${i}" class="downGpa hover:bg-green-200" style="background-color: #1565c0; width: 30px; border: 1px solid #ffffff; border-radius: 5px; padding: 5px; color: #fff; font-size: 16px; font-weight: 500; cursor: pointer; margin: 10px;">-</button>
          </div>
        </div>
      </div>
      `;
    }

    customTable += "</div>";
    $("td[colspan='2']").append(customTable);
    $(".upGpa").click(function (event) {
      reCalculateGpa(parseInt(event.target.id), "up");
    });
    $(".downGpa").click(function (event) {
      reCalculateGpa(parseInt(event.target.id), "down");
    });
  }

  // Get the gpas that would be higher grades than the current grade

  function activatePro() {
    if (toggle) {
      $("table[class='list']").remove();

      createCustomTable();
      toggle = false;
    } else if (!toggle) {
      $("div[id='customTable']").remove();
      $("td[colspan='2']").append(ogTable);
      toggle = true;
    }
  }

  function calculateGpaNum(){
    for (let i = 0; i < courses.length; i += 1) {
      if (halfYear.indexOf(courses[i]) > -1) {
        credits.push(2.5);
        total_credits += 2.5;
      } else if (labs.indexOf(courses[i]) > -1) {
        credits.push(6);
        total_credits += 6;
      } else if (semester.indexOf(courses[i]) > -1) {
        credits.push(3);
        total_credits += 3;
      } else {
        credits.push(5);
        total_credits += 5;
      }
    }

    for (let i = 0; i < courses.length; i += 1) {
      if (courses[i].indexOf("AP") > -1) {
        gpas.push(gpaAp[grades[i]]);
      } else if (courses[i].indexOf("Honors") > -1) {
        gpas.push(gpaHonors[grades[i]]);
      } else {
        gpas.push(gpaRegular[grades[i]]);
      }
    }

    for (let i = 0; i < courses.length; i += 1) {
      qualityPoints += gpas[i] * credits[i];
    }
    let gpa = qualityPoints / total_credits;

    for (let i = 0; i < gpas.length; i++) {
      unweightedgpas[i] = gpaRegular[grades[i]];
    }
    let unweightedgpa = 0;
    let unweightedQualityPoints = 0;
    for (let i = 0; i < unweightedgpas.length; i++) {
      unweightedQualityPoints += unweightedgpas[i] * credits[i];
    }
    unweightedgpa = unweightedQualityPoints / total_credits;
    return [gpa,unweightedgpa]
  }

  function displayGpa(gpa:number, unweightedgpa:number) {
    if (!calculating) return;

    if (isNaN(gpa)) {
      $("#loading").remove();
      return;
    }

    let html = `<div id="gpa" 
      style="height: 100px; opacity: 1; width: 200px; display: flex; justify-content: center; align-items: center; margin: auto;">
      <p class="gpa" style="color:#ffffff;background-color:#1565c0;text-align:center; width:150px;border-radius:25px 0px 0px 25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px; border-color: rgb(187, 187, 187);border-right-style: solid;"> Weighted <br />${gpa.toFixed(2)}</p>
      <p class="gpa" style="color:#ffffff;background-color:#1565c0;text-align:center; width:150px;border-radius:0px 25px 25px 0px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px; border-color: rgb(187, 187, 187);border-left-style: solid;"> Unweighted <br />${unweightedgpa.toFixed(2)}</p>
    <div>`;

    setTimeout(function () {
      $("#loading").remove();
      $('p[class="sectionTitle"]').append($(html));

      let gpaDiv = $("#gpa");
      gpaDiv.css({ opacity: "0.6" })
      gpaDiv.animate({ width: "250px", opacity: "1" }, 400);
      calculating = false;

      $("#gpa").click(function () {
        activatePro();
      });
    }, 1500);
  }

    // Get all the data inside the gradebook table
  const ogTable:JQuery<HTMLTableElement> = $("table[class='list']");
  if(!ogTable.length) return;
  const grades_and_classes = ogTable[0]?.rows || [];

  if (!$("#loadingStyles").length) $("p[class='sectionTitle']").append(loadingStyles);


  // Filter out through all courses for those that are valid
  for (let i = 1; i < grades_and_classes.length; i++) {
    let name = grades_and_classes[i].cells[0].innerText;
    if (!grades_and_classes[i].cells[2]) return;
    let grade = grades_and_classes[i].cells[2].innerText.replace(
      /[^A-F+-]/g,
      ""
    );
    if (ifValid(name, grade)) {
      courses.push(name);
      grades.push(grade);
    }
  }
  
  function initalCalculate(){

    if (calculating) return;
    calculating = true;
    $("#gpa").remove();
    $("p[class='sectionTitle']").append(loading);
    let [gpa,unweightedgpa] = calculateGpaNum();
    displayGpa(gpa,unweightedgpa);
  }
  if (!$("#loading").length) initalCalculate();
});
