$(document).ready(function () {
  let grades = [];
  let courses = [];
  let credits = [];
  let gpas = [];
  let unweightedgpas = [];
  let total_credits = 0;
  let qualityPoints = 0;
  let toggle = true;
  let calculating = false;
  let paid = false;

  // extpay.getUser().then((user) => {
    paid = true;

    if (paid) {
      $("div[class='studentTabBar']")
        .append(`<button id="darkModeSwitch" style="position: absolute; top: 15%; right: 5%; z-index: 100; background: transparent; border: none; cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="32" height="32" viewBox="0 0 256 256" xml:space="preserve">
      <defs>
      </defs>
      <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
        <path d="M 87.823 60.7 c -0.463 -0.423 -1.142 -0.506 -1.695 -0.214 c -15.834 8.398 -35.266 2.812 -44.232 -12.718 c -8.966 -15.53 -4.09 -35.149 11.101 -44.665 c 0.531 -0.332 0.796 -0.963 0.661 -1.574 c -0.134 -0.612 -0.638 -1.074 -1.259 -1.153 c -9.843 -1.265 -19.59 0.692 -28.193 5.66 C 13.8 12.041 6.356 21.743 3.246 33.35 S 1.732 57.08 7.741 67.487 c 6.008 10.407 15.709 17.851 27.316 20.961 C 38.933 89.486 42.866 90 46.774 90 c 7.795 0 15.489 -2.044 22.42 -6.046 c 8.601 -4.966 15.171 -12.43 18.997 -21.586 C 88.433 61.79 88.285 61.123 87.823 60.7 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,243,131); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
      </g>
      </svg></button>`);
      $("#darkModeSwitch").click(function () {
        chrome.storage.sync.get(["darkMode"], function (items) {
          chrome.storage.sync.set(
            { darkMode: !items.darkMode },
            function () {}
          );
          if (!items.darkMode) {
            $("table[role='main']").css("background-color", "#212121");
            $("body[class='parentsBody']").css("background-color", "#212121");
            $("p[class='sectionTitle']").css("color", "#ffffff");
            $("p").css("color", "#ffffff", "important");
            $("td[style='border: none;']").css("color", "#ffffff", "important");
            $("td[style='width: 100px; border: 0;']").css(
              "color",
              "#ffffff",
              "important"
            );
            $("div[style='text-align: center; padding: 3px 0 5px 0;']").css(
              "color",
              "#ffffff",
              "important"
            );
            $(
              "div[style='text-align: center;font-weight: bold;font-size: 14pt;']"
            ).css("color", "#ffffff", "important");
            $(
              "div[style='text-align: center;font-size: 12pt;padding:5px;']"
            ).css("color", "#ffffff", "important");
            $("label").css("color", "#ffffff", "important");
            $("table[class='list']").css("color", "#ffffff", "important");
            $(
              "div[style='padding: 4px; border: 1px solid #55ff55; width: 500px; margin: auto']"
            ).css("color", "#ffffff", "important");
            $(
              "p[style='font-size: 16px; font-weight: 500; color: #000; margin: 10px; width: 80px;']"
            ).css("color", "#ffffff", "important");
          }

          if (items.darkMode) {
            $("table[role='main']").css("background-color", "#ffffff");
            $("body[class='parentsBody']").css("background-color", "#ffffff");
            $("p[class='sectionTitle']").css("color", "#000000");

            $(
              "p[style='font-size: 16px; font-weight: 500; color: rgb(255, 255, 255); margin: 10px; width: 80px;']"
            ).css("color", "#000", "important");
          }
        });
      });
    }
  // });
  $(
    "div[class='studentTabBar']"
  ).append(`<div id="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">
<div style="background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 30%;">
  <span id="close-button" style="float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
  <h2 style="margin-top: 0; text-align: center;">Stay on top of your grades!</h2>
  <ul>
    <li>Check unweighted and weighted GPA</li>
    <li>Change grades to check your potential GPA</li>
    <li>Activate Dark/Light mode</li>
  </ul>
  <div style="text-align: center;">
    <button id="activate-button" style="background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; width: 100%;">Activate Pro</button>
  </div>
</div>
</div>`);
  $("#modal").hide();
  // Read it using the storage API
  chrome.storage.sync.get(["darkMode"], function (items) {
    if (items.darkMode) {
      $("table[role='main']").css("background-color", "#212121");
      $("body[class='parentsBody']").css("background-color", "#212121");
      $("p[class='sectionTitle']").css("color", "#ffffff");
      $("p").css("color", "#ffffff", "important");
      $("td[style='border: none;']").css("color", "#ffffff", "important");
      $("td[style='width: 100px; border: 0;']").css(
        "color",
        "#ffffff",
        "important"
      );
      $("div[style='text-align: center; padding: 3px 0 5px 0;']").css(
        "color",
        "#ffffff",
        "important"
      );

      $(
        "div[style='text-align: center;font-weight: bold;font-size: 14pt;']"
      ).css("color", "#ffffff", "important");
      $("div[style='text-align: center;font-size: 12pt;padding:5px;']").css(
        "color",
        "#ffffff",
        "important"
      );
      $("label").css("color", "#ffffff", "important");
      $("table[class='list']").css("color", "#ffffff", "important");
      $(
        "div[style='padding: 4px; border: 1px solid #55ff55; width: 500px; margin: auto']"
      ).css("color", "#ffffff", "important");
    }
  });

  let styles = `<style>.wrapper {
    width: 200px;
    height: 60px;
    position: relative;
    margin: 0 auto;
    top-margin: 40px;
    z-index: 1;
  }
  
  .circle {
    width: 20px;
    height: 20px;
    position: absolute;
    border-radius: 50%;
    background-color: rgb(1, 155, 198);
    left: 15%;
    transform-origin: 50%;
    animation: circle7124 .5s alternate infinite ease;
  }
  
  @keyframes circle7124 {
    0% {
      top: 60px;
      height: 5px;
      border-radius: 50px 50px 25px 25px;
      transform: scaleX(1.7);
    }
    
    40% {
      height: 20px;
      border-radius: 50%;
      transform: scaleX(1);
    }
    
    100% {
      top: 0%;
    }
  }
  
  .circle:nth-child(2) {
    left: 45%;
    animation-delay: .2s;
  }
  
  .circle:nth-child(3) {
    left: auto;
    right: 15%;
    animation-delay: .3s;
  }
  
  .shadow {
    width: 20px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.9);
    position: absolute;
    top: 62px;
    transform-origin: 50%;
    z-index: -1;
    left: 15%;
    filter: blur(1px);
    animation: shadow046 .5s alternate infinite ease;
  }
  
  @keyframes shadow046 {
    0% {
      transform: scaleX(1.5);
    }
    
    40% {
      transform: scaleX(1);
      opacity: .7;
    }
    
    100% {
      transform: scaleX(.2);
      opacity: .4;
    }
  }
  
  .shadow:nth-child(4) {
    left: 45%;
    animation-delay: .2s
  }
  
  .shadow:nth-child(5) {
    left: auto;
    right: 15%;
    animation-delay: .3s;
  }</style>`;
  $("p[class='sectionTitle']").append(styles);
  let loading = `<div id="loading" class="wrapper">
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="shadow"></div>
  <div class="shadow"></div>
  <div class="shadow"></div>
</div>`;

  // GPAs for each class type
  const gpaRegular = {
    "A+": "4.3",
    A: "4.0",
    "A-": "3.7",
    "B+": "3.3",
    B: "3.0",
    "B-": "2.7",
    "C+": "2.3",
    C: "2.0",
    "C-": "1.7",
    "D+": "1.3",
    D: "1.0",
    "D-": "0.7",
    F: "0.0",
  };
  const gpaHonors = {
    "A+": "4.8",
    A: "4.5",
    "A-": "4.2",
    "B+": "3.8",
    B: "3.5",
    "B-": "3.2",
    "C+": "2.8",
    C: "2.5",
    "C-": "2.2",
    "D+": "1.8",
    D: "1.5",
    "D-": "1.2",
    F: "0.0",
  };
  const gpaAp = {
    "A+": "5.3",
    A: "5.0",
    "A-": "4.7",
    "B+": "4.3",
    B: "4.0",
    "B-": "3.7",
    "C+": "3.3",
    C: "3.0",
    "C-": "2.7",
    "D+": "2.3",
    D: "2.0",
    "D-": "1.7",
    F: "0.0",
  };

  // Classes that are half year, labs, and semester
  const halfYear = [
    "Business Law",
    "Computer Applications",
    "Entrepreneurship",
    "Fashion Marketing",
    "Financial Literacy",
    "International Business",
    "Sports & Entertainment Management",
    "Computer Science",
    "Java Honors",
    "Advanced Java Honors",
    "Web Design",
    "Creative Writing I",
    "Creative Writing II Honors",
    "Film Study",
    "Forensics I",
    "Forensics II",
    "Parcc English",
    "Ceramics I",
    "Ceramics II",
    "Ceramics III",
    "Crafts I",
    "Crafts II",
    "Photography",
    "Advanced Photography",
    "Culinary Arts I",
    "Foods Around the World",
    "Culinary Arts II",
    "Child Development I",
    "Child Development II",
    "Child Development III",
    "Interior Design I",
    "Interior Design II",
    "Introduction to Technology",
    "Technology II",
    "Strategic Design",
    "Video and Broadcast Production I",
    "Video and Broadcast Production II",
    "Broadway Workshop",
    "Math Lab",
    "Parcc Mathematics",
    "Economics",
    "Economics Honors",
    "Psychology",
    "Advanced Psychology",
    "Sociology",
  ];
  const labs = [
    "Biology",
    "Biology Enriched",
    "Biology Honors",
    "Ap Biology",
    "Principles in Anatomy",
    "Anatomy & Physiology",
    "Research in Molecular Biology",
    "Chemistry",
    "Chemistry Enriched",
    "Chemistry Honors",
    "AP Chemistry",
    "Physics Enriched",
    "Physics Honors",
    "AP Physics C: Mechanics",
    "AP Physics C: Electricity & Magnetism",
    "AP Environmental Science",
    "Science Research Program I",
    "Science Research Program II",
    "Science Research Program III",
  ];
  const semester = ["Forensic Science", "Robotics Engineering"];

  // Get all the data inside the gradebook table
  const ogTable = $("table[class='list']");
  const grades_and_classes = $("table[class='list']")[0].rows;

  // A valid course must not be a non gpa class i.e gym, and have a valid grade
  const ifValid = (name, grade) => {
    return (
      name.indexOf("Physical Ed") == -1 &&
      name.indexOf("Health") == -1 &&
      grade.indexOf("No Grades") == -1 &&
      grade.indexOf("Not Graded") == -1 &&
      grade.length > 0
    );
  };

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

  // FUNCTIONS
  function raiseLetterGrade(letterGrade) {
    switch (letterGrade) {
      case "A":
        return "A+";
      case "A-":
        return "A";
      case "B+":
        return "A-";
      case "B":
        return "B+";
      case "B-":
        return "B";
      case "C+":
        return "B-";
      case "C":
        return "C+";
      case "C-":
        return "C";
      case "D+":
        return "C-";
      case "D":
        return "D+";
      case "D-":
        return "D";
      case "F":
        return "D-";
      default:
        return "A+";
    }
  }

  function lowerLetterGrade(letterGrade) {
    switch (letterGrade) {
      case "A+":
        return "A";
      case "A":
        return "A-";
      case "A-":
        return "B+";
      case "B+":
        return "B";
      case "B":
        return "B-";
      case "B-":
        return "C+";
      case "C+":
        return "C";
      case "C":
        return "C-";
      case "C-":
        return "D+";
      case "D+":
        return "D";
      case "D":
        return "D-";
      case "D-":
        return "F";
      case "F":
        return "F";
      default:
        return "F";
    }
  }

  function reCalculateGpa(id, direction) {
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
      qualityPoints += parseFloat(gpas[i]) * parseFloat(credits[i]);
    }
    createCustomTable();

    // Calculate Unweighted GPA, just use the regular gpa table
    for (let i = 0; i < gpas.length; i++) {
      unweightedgpas[i] = gpaRegular[grades[i]];
    }

    let gpa = qualityPoints / total_credits;
    let unweightedgpa = 0;
    let unweightedQualityPoints = 0;
    for (let i = 0; i < unweightedgpas.length; i++) {
      unweightedQualityPoints += parseFloat(unweightedgpas[i]) * credits[i];
    }
    unweightedgpa = unweightedQualityPoints / total_credits;

    $("#gpa").remove();
    let html =
      '<div id="gpa" style="height: 200px; opacity: 1; width: 200px; display: flex; justify-content: center; align-items: center; margin: auto;"><p class="gpa" style="color:#ffffff;background-color:#019BC6;text-align:center; width:150px;border-radius:25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px;"> Weighted <br />';
    html += gpa.toFixed(2);
    html += "</p>";
    html += `<p class="gpa" style="color:#ffffff;background-color:#019BC6;text-align:center; width:150px;border-radius:25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px;"> Unweighted <br />`;
    html += unweightedgpa.toFixed(2);
    html += "</p></div>";
    setTimeout(function () {
      $("#loading").remove();
      $('p[class="sectionTitle"]').append($(html));

      let gpaDiv = $("#gpa");
      gpaDiv.animate({ height: "100px", opacity: "0.6" }, "slow");
      gpaDiv.animate({ width: "250px", opacity: "1" }, "fast");
      calculating = false;

      $("#gpa").click(function () {
        activatePro();
      });
    }, 1500);
  }

  function createCustomTable() {
    $("div[id='customTable']").remove();
    let customTable = `<div id="customTable" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">`;

    // Check if darkmode is on
    chrome.storage.sync.get(["darkMode"], function (items) {
      if (items.darkMode) {
        $(
          "p[style='font-size: 16px; font-weight: 500; color: #000; margin: 10px; width: 80px;']"
        ).css("color", "#ffffff", "important");
      }
    });

    for (let i = 0; i < courses.length; i++) {
      customTable += `
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; padding: 10px; border-bottom: 1px solid #e0e0e0;">
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%;">
          <div style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; width: 100%;">
            <p style="font-size: 16px; font-weight: 500; color: #000; margin: 10px; width: 80px;">${courses[i]}</p>
            <button id="${i}" class="upGpa hover:bg-green-200" style="background-color: #019BC6; width: 30px; border: 1px solid #ffffff; border-radius: 5px; padding: 5px; color: #fff; font-size: 16px; font-weight: 500; cursor: pointer; margin: 10px;">+</button>
            <p style="font-size: 16px; font-weight: 500; color: #000; margin: 10px; width: 80px;">${grades[i]} | ${gpas[i]}</p>  
            <button id="${i}" class="downGpa hover:bg-green-200" style="background-color: #019BC6; width: 30px; border: 1px solid #ffffff; border-radius: 5px; padding: 5px; color: #fff; font-size: 16px; font-weight: 500; cursor: pointer; margin: 10px;">-</button>
          </div>
        </div>
      </div>
      `;
    }

    customTable += "</div>";
    $("td[colspan='2']").append(customTable);
  }

  // Get the gpas that would be higher grades than the current grade

  function activatePro() {
    if (!paid) {
      $("#modal").show();
      $("#close-button, #modal").click(function () {
        $("#modal").hide();
      });

      return;
    }
    if (toggle) {
      $("table[class='list']").remove();

      createCustomTable();
      $(document).on("click", ".upGpa", function (event) {
        reCalculateGpa(event.target.id, "up");
      });
      $(document).on("click", ".downGpa", function (event) {
        reCalculateGpa(event.target.id, "down");
      });
      toggle = false;
    } else if (!toggle) {
      $("div[id='customTable']").remove();
      $("td[colspan='2']").append(ogTable);
      toggle = true;
    }
  }

  function calculateGpa() {
    if (calculating) return;
    calculating = true;
    $("#gpa").remove();
    $("p[class='sectionTitle']").append(loading);
    // Filter classes by credits
    for (let i = 0; i < courses.length; i += 1) {
      if (halfYear.indexOf(courses[i]) > -1) {
        credits.push("2.5");
        total_credits += 2.5;
      } else if (labs.indexOf(courses[i]) > -1) {
        credits.push("6");
        total_credits += 6;
      } else if (semester.indexOf(courses[i]) > -1) {
        credits.push("3");
        total_credits += 3;
      } else {
        credits.push("5");
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
    if (isNaN(gpa)) {
      $("#loading").remove();
      return;
    }
    $("#gpa").remove();

    let html = "";
    
      if (true) {
        for (let i = 0; i < gpas.length; i++) {
          unweightedgpas[i] = gpaRegular[grades[i]];
        }
        let unweightedgpa = 0;
        let unweightedQualityPoints = 0;
        for (let i = 0; i < unweightedgpas.length; i++) {
          unweightedQualityPoints += parseFloat(unweightedgpas[i]) * credits[i];
        }
        unweightedgpa = unweightedQualityPoints / total_credits;
        html +=
          '<div id="gpa" style="height: 200px; opacity: 1; width: 200px; display: flex; justify-content: center; align-items: center; margin: auto;"><p class="gpa" style="color:#ffffff;background-color:#019BC6;text-align:center; width:150px;border-radius:25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px;"> Weighted <br />';
        html += gpa.toFixed(2);
        html += "</p>";
        html += `<p class="gpa" style="color:#ffffff;background-color:#019BC6;text-align:center; width:150px;border-radius:25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px;"> Unweighted <br />`;
        html += unweightedgpa.toFixed(2);
        html += "</p></div>";
      } else {
        html +=
          '<div id="gpa" style="height: 200px; opacity: 1; width: 200px; display: flex; justify-content: center; align-items: center; margin: auto;"><p class="gpa" style="color:#ffffff;background-color:#019BC6;text-align:center; width:150px;border-radius:25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px;"> Weighted <br />';
        html += gpa.toFixed(2);
        html += "</p>";
        html += `<p class="gpa" style="color:#ffffff;background-color:#019BC6;text-align:center; width:150px;border-radius:25px;margin:0 auto;margin-top:10px; height:50px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .4); line-height:25px;"> Unweighted <br />`;
        html += "???";
        html += "</p></div>";
      }

    setTimeout(function () {
      $("#loading").remove();
      $('p[class="sectionTitle"]').append($(html));

      let gpaDiv = $("#gpa");
      gpaDiv.animate({ height: "100px", opacity: "0.6" }, "slow");
      gpaDiv.animate({ width: "250px", opacity: "1" }, "fast");
      calculating = false;

      $("#gpa").click(function () {
        activatePro();
      });
      $("#get-pro-button").click(function () {
        activatePro();
      });
    }, 1500);
  }
  calculateGpa();
});
