//global usage
let educationForm = document.getElementById("studentEducation");
let studentDataForm = document.getElementById("studentDataForm");
let educationFormTotalChildresns = educationForm.childElementCount;
let studentFullData = JSON.parse(localStorage.getItem("data")) || [];
let submitBTN = document.getElementById("submit-form-btn");
let formSubmitted = false;
let isEditMode = false;
let selectedStuID;
const addEducationBtn = document.getElementById("addEducationBtn");
//regex
let charOnlyRegex = /^[a-zA-Z\s]+$/;
let emailRegex = /^([a-zA-Z0-9]{6,})@[a-zA-Z]{3,}\.[a-z]{2,10}$/;

// form submit
const handleStudentFormSubmit = (e) => {
  e.preventDefault();
  formSubmitted = true;

  let id = studentFullData.length;
  let firstName = document.getElementById("firstNameInput");
  let lastName = document.getElementById("lastNameInput");
  let birthDate = document.getElementById("birthDateInput");
  let email = document.getElementById("emailInput");
  let address = document.getElementById("addressInput");
  let gradYear = document.getElementById("gradYearInput");

  let isValid = checkValidations();
  if (isValid) {
    let personalDetails = {
      id: isEditMode ? selectedStuID : id,
      firstName: firstName.value,
      lastName: lastName.value,
      birthDate: birthDate.value,
      email: email.value,
      address: address.value,
      gradYear: gradYear.value,
    };

    let educationDetails = [];
    for (let i = 0; i < educationFormTotalChildresns; i++) {
      let degree =
        educationForm.children[i].querySelector(".degree-class").value;
      let schClg =
        educationForm.children[i].querySelector(".schclg-class").value;
      let startDate =
        educationForm.children[i].querySelector(".startdate-class").value;
      let passoutYear =
        educationForm.children[i].querySelector(".passout-class").value;
      let percentage =
        educationForm.children[i].querySelector(".percentage-class").value;
      let backLog =
        educationForm.children[i].querySelector(".backlog-class").value;

      educationDetails.push({
        degree,
        schClg,
        startDate,
        passoutYear,
        percentage,
        backLog,
      });
    }

    if (isEditMode) {
      studentFullData.splice(selectedStuID, 1, {
        personalDetails,
        educationDetails,
      });
      isEditMode = false;
    } else {
      studentFullData.push({
        personalDetails,
        educationDetails,
      });
    }

    // studentFullData.push({
    //   personalDetails,
    //   educationDetails,
    // });
    // isEditMode = false;
    console.log(selectedStuID, isEditMode);

    localStorage.setItem("data", JSON.stringify(studentFullData));
    studentDataForm.reset();
    for (let i = educationFormTotalChildresns; i > 2; i--) {
      educationForm.lastElementChild.remove();
    }

    let modalElement = document.getElementById("studentdetailsmodal");
    let modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    showStudentData();
  } else {
    console.log("Failed");
  }
  // formSubmitted = false;
  // console.log(studentFullData, "handleStudentFormSubmit");
};

//creting new education fields
const handleEducationDetails = () => {
  //   showStudentData();
  let newEducationField = document.createElement("div");
  newEducationField.setAttribute("class", "row mt-4");
  newEducationField.setAttribute(
    "id",
    `eduField${educationFormTotalChildresns + 1}`
  );
  newEducationField.innerHTML = `
            <div class="col form-group">
                        <label id="degree${
                          educationFormTotalChildresns + 1
                        }" class="form-label">Degree/Board*</label>
                        <input type="text" class="degree-class form-control" id="degree${
                          educationFormTotalChildresns + 1
                        }Input" placeholder="Degree/Board" />
                    </div>
                    <div class="col form-group">
                        <label id="schClg${
                          educationFormTotalChildresns + 1
                        }" class="form-label">School/College*</label>
                        <input type="text" class="schclg-class form-control" id="schClg${
                          educationFormTotalChildresns + 1
                        }Input"
                            placeholder="School/College" />
                    </div>
                    <div class="col form-group">
                        <label id="startDate${
                          educationFormTotalChildresns + 1
                        }" class="form-label">Start date*</label>
                        <input type="date" class="startdate-class form-control" id="startDate${
                          educationFormTotalChildresns + 1
                        }Input" />
                    </div>
                    <div class="col form-group">
                        <label id="passoutYear${
                          educationFormTotalChildresns + 1
                        }" class="form-label">Passout Year*</label>
                        <input type="month" class="passout-class form-control" id="passoutYear${
                          educationFormTotalChildresns + 1
                        }Input" />
                    </div>
                    <div class="col form-group">
                        <label id="percentage${
                          educationFormTotalChildresns + 1
                        }" class="form-label">Percentage*</label>
                        <input type="number" min="1" max="100" class="percentage-class form-control" placeholder="Percentage"
                            id="percentage${
                              educationFormTotalChildresns + 1
                            }Input" />
                    </div>
                    <div class="col form-group">
                        <label id="backLog${
                          educationFormTotalChildresns + 1
                        }" class="form-label">Backlog*</label>
                        <input type="number" min="0" max="20" class="backlog-class form-control" placeholder="Backlog"
                            id="backLog${
                              educationFormTotalChildresns + 1
                            }Input" />
                    </div>
                    <div class="col form-group" style="display: flex; flex-direction: column;">
                        <label class="form-label">Remove</label>
                        <i id="remove${
                          educationFormTotalChildresns + 1
                        }" class="fa-solid fa-trash fa-xl text-dark mx-3"
                            style="margin-top: 18px; cursor:pointer;" onclick="removeEducationField(${
                              educationFormTotalChildresns + 1
                            })"></i>
                    </div>
            `;
  educationForm.appendChild(newEducationField);
  // console.log(educationForm, "called from add");
  educationFormTotalChildresns = educationForm.childElementCount;
  // console.log(educationFormTotalChildresns);
};

//removing education fields
const removeEducationField = (index) => {
  let selectedField = document.getElementById(`eduField${index}`);
  selectedField.remove();
  educationFormTotalChildresns = educationForm.childElementCount;
};

//show data in table
const showStudentData = () => {
  let tableKaBody = document.getElementById("tableBody");
  const arr = JSON.parse(localStorage.getItem("data"));

  tableKaBody.innerHTML = "";
  let NO_DATA_TR = document.getElementById("noData");

  if (arr && arr.length > 0) {
    if (NO_DATA_TR) {
      NO_DATA_TR.remove();
    }
    let idCounter = 1;

    arr?.map((value) => {
      let newTR = document.createElement("tr");
      newTR.innerHTML = `
      <td>${idCounter++}</td>
      <td>${value.personalDetails.firstName}</td>
      <td>${value.personalDetails.lastName}</td>
      <td>${new Date(value.personalDetails.birthDate).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )}</td>
      <td>${value.personalDetails.email}</td>
      <td>${value.personalDetails.address}</td>
      <td>${new Date(value.personalDetails.gradYear).toLocaleDateString(
        "en-IN",
        {
          month: "short",
          year: "numeric",
        }
      )}</td>
      
      <td>
      <i
      data-bs-toggle="modal"
                data-bs-target="#studentdetailsmodal"
      class="fa-solid fa-pen-to-square fa-xl text-dark" 
      onclick="editStudent(${value.personalDetails.id})" 
      style="cursor:pointer;"
      ></i>
      <i class="fa-solid fa-trash fa-xl text-dark "
      onclick="removeStudentFromTable(${value.personalDetails.id})" 
      style="cursor:pointer; margin-left:10px"></i></td>
        `;
      tableKaBody.appendChild(newTR);
    });

    // arr?.map((value) => console.log(value.personalDetails));
  } else {
    let noDataTR = document.createElement("tr");
    noDataTR.innerHTML = `
      <td colspan="8" id="noData" class="text-center fw-bold">No Data Available</td>
      `;
    tableKaBody.appendChild(noDataTR);
  }
};
showStudentData();

//removeStudentFromTable
const removeStudentFromTable = (id) => {
  let idCounter = 0;
  let arr = JSON.parse(localStorage.getItem("data"));
  if (arr.length > 0) {
    let tempArr = arr
      .filter((val) => val.personalDetails.id != id)
      .map((val) => {
        val.personalDetails.id = idCounter++;
        return val;
      });
    if (window.confirm("Are you sure you want to delete data?")) {
      localStorage.removeItem("data");
      localStorage.setItem("data", JSON.stringify(tempArr));
      studentFullData = [];
      studentFullData = tempArr;
      if (tempArr.length < 1) {
        localStorage.removeItem("data");
      }
    }
  }
  showStudentData();
  // console.log(studentFullData, "removeStudentFromTable");
  // window.open("index.html", "_self");
  // window.location.href = "index.html";
};

//validations
const checkValidations = () => {
  if (formSubmitted) {
    let fieldCheck = true;
    let currentDate = new Date();
    let fNameError = document.getElementById("fNameError");
    let lNameError = document.getElementById("lNameError");
    let bDateError = document.getElementById("bDateError");
    let emailError = document.getElementById("emailError");
    let addressError = document.getElementById("addressError");
    let gradYearError = document.getElementById("gradYearError");
    let allInputTags = document.getElementsByTagName("input");

    Array.from(allInputTags)?.forEach((values) => {
      switch (values.id) {
        case "firstNameInput":
          if (values.value.trim() == "") {
            customError(fNameError, values, "Required 🫥");
            fieldCheck = false;
          } else if (charOnlyRegex.test(values.value.trim()) == false) {
            customError(fNameError, values, "Only Characters 😒");
            fieldCheck = false;
          } else {
            clearError(values, fNameError);
          }
          break;
        case "lastNameInput":
          if (/^[a-zA-Z\s]*$/.test(values.value.trim()) == false) {
            customError(lNameError, values, "Only Characters 😒");
            fieldCheck = false;
          } else {
            clearError(values, lNameError);
          }
          break;
        case "birthDateInput":
          let selectedDate = new Date(values.value);
          if (values.value == "") {
            customError(bDateError, values, "Required 🫥");
            fieldCheck = false;
          } else if (selectedDate > currentDate) {
            customError(bDateError, values, "Invalid Date 🫡");
            fieldCheck = false;
          } else {
            clearError(values, bDateError);
          }
          break;
        case "emailInput":
          if (values.value.trim() == "") {
            customError(emailError, values, "Required 🫥");
            fieldCheck = false;
          } else if (emailRegex.test(values.value) == false) {
            customError(emailError, values, "Invalid Email 🤣");
            fieldCheck = false;
          } else {
            clearError(values, emailError);
          }
          break;
        case "addressInput":
          if (values.value.trim() == "") {
            customError(addressError, values, "Required 🫥");
            fieldCheck = false;
          } else if (values.value.length > 100) {
            customError(addressError, values, "Too Long(Max 100)");
            fieldCheck = false;
          } else {
            clearError(values, addressError);
          }
          break;
        case "gradYearInput":
          let selectedDOB = new Date(
            document.getElementById("birthDateInput")?.value
          );
          let selectedDate2 = new Date(values.value);

          if (values.value.trim() == "") {
            customError(gradYearError, values, "Required 🫥");
            fieldCheck = false;
          } else {
            let gap = findGapBetweenDates(selectedDOB, selectedDate2);
            if (gap <= 18) {
              customError(gradYearError, values, "Min 18 Years Gap Needed 🫠");
              fieldCheck = false;
            } else {
              clearError(values, gradYearError);
            }
          }
          break;

        default:
          // console.log(values);
          break;
      }
    });

    //education details
    for (let i = 0; i < educationFormTotalChildresns; i++) {
      let degree = educationForm.children[i].querySelector(".degree-class");
      let schClg = educationForm.children[i].querySelector(".schclg-class");
      let startDate =
        educationForm.children[i].querySelector(".startdate-class");
      let passoutYear =
        educationForm.children[i].querySelector(".passout-class");
      let percentage =
        educationForm.children[i].querySelector(".percentage-class");
      let backLog = educationForm.children[i].querySelector(".backlog-class");

      //degreee
      if (degree.value.trim() == "") {
        eduFieldCustomError(degree, "Required 🫥");
        fieldCheck = false;
      } else if (charOnlyRegex.test(degree.value.trim()) == false) {
        eduFieldCustomError(degree, "Only Characters 😒");
        fieldCheck = false;
      } else {
        degree.nextElementSibling && eduFieldClearError(degree);
      }

      //schClg
      if (schClg.value.trim() == "") {
        eduFieldCustomError(schClg, "Required 🫥");
        fieldCheck = false;
      } else if (charOnlyRegex.test(schClg.value.trim()) == false) {
        eduFieldCustomError(schClg, "Only Characters 😒");
        fieldCheck = false;
      } else {
        schClg.nextElementSibling && eduFieldClearError(schClg);
      }

      //percentage
      if (percentage.value.trim() == "") {
        eduFieldCustomError(percentage, "Required 🫥");
        fieldCheck = false;
      } else {
        percentage.nextElementSibling && eduFieldClearError(percentage);
      }

      //backlog
      if (backLog.value.trim() == "") {
        eduFieldCustomError(backLog, "Required 🫥");
        fieldCheck = false;
      } else {
        backLog.nextElementSibling && eduFieldClearError(backLog);
      }

      //start-dare
      let selectedDate = new Date(startDate.value);
      let dobDate = new Date(document.getElementById("birthDateInput")?.value);
      let gradYearDate = new Date(
        document.getElementById("gradYearInput")?.value
      );
      let passoutYearDate = new Date(passoutYear?.value);

      if (startDate.value.trim() == "") {
        eduFieldCustomError(startDate, "Required 🫥");
        fieldCheck = false;
      } else {
        // console.log(selectedDate, " , ", dobDate, "sd,dob");
        // console.log(selectedDate > gradYearDate, "sd,gy");
        // console.log(selectedDate > passoutYearDate, "sd,py");
        if (selectedDate > dobDate) {
          let gap = findGapBetweenDates(dobDate, selectedDate);
          if (gap <= 12) {
            eduFieldCustomError(startDate, "Min 12 Years Gap Needed 🫠");
            fieldCheck = false;
          } else if (selectedDate > gradYearDate) {
            eduFieldCustomError(startDate, "Invalid Date (GY) 🫡");
            fieldCheck = false;
          } else if (selectedDate > passoutYearDate) {
            eduFieldCustomError(startDate, "Invalid Date (PY) 🫡");
            fieldCheck = false;
          } else {
            startDate.nextElementSibling && eduFieldClearError(startDate);
          }
        } else {
          eduFieldCustomError(startDate, "Born First!!! 😠");
          fieldCheck = false;
        }
      }

      //passout-year
      let selectedPassoutDate = new Date(passoutYear.value);
      if (passoutYear.value.trim() == "") {
        eduFieldCustomError(passoutYear, "Required 🫥");
        fieldCheck = false;
      } else {
        if (selectedPassoutDate > dobDate) {
          let gap = findGapBetweenDates(dobDate, selectedPassoutDate);
          if (gap <= 13) {
            eduFieldCustomError(passoutYear, "Min 13 Years Gap Needed 🫠");
            fieldCheck = false;
          } else if (passoutYearDate === gradYearDate) {
            passoutYear.nextElementSibling && eduFieldClearError(passoutYear);
          } else if (gradYearDate < selectedPassoutDate) {
            eduFieldCustomError(passoutYear, "Invalid Date (GY) 🫡");
            fieldCheck = false;
          } else if (selectedPassoutDate < selectedDate) {
            eduFieldCustomError(passoutYear, "Invalid Date (SD) 🫡");
            fieldCheck = false;
          } else {
            passoutYear.nextElementSibling && eduFieldClearError(passoutYear);
          }
        } else {
          eduFieldCustomError(passoutYear, "Born First!!! 😠");
          fieldCheck = false;
        }
      }
    }

    return fieldCheck;
  }
};

const customError = (inputName, values, errorMsg) => {
  inputName.innerText = "";
  inputName.innerText = errorMsg;
  values.style.border = "2px solid red";
};

const clearError = (values, inputName) => {
  values.hasAttribute("style") && values.removeAttribute("style");
  inputName.innerText = "";
};

const findGapBetweenDates = (dob, selected) => {
  return selected.getFullYear() - dob.getFullYear();
};

const eduFieldCustomError = (tagName, errorMsg) => {
  if (tagName.nextElementSibling) {
    tagName.nextElementSibling.remove();
  }
  let tempSpan = document.createElement("span");
  tempSpan.setAttribute("class", "form-error");
  tempSpan.innerText = errorMsg;
  tempSpan.style.color = "red";
  tagName.style.border = "2px solid red";
  tagName.after(tempSpan);
};

const eduFieldClearError = (tagName) => {
  tagName.nextElementSibling.remove();
  tagName.hasAttribute("style") && tagName.removeAttribute("style");
};

//clear all data on modal close click
const clearFormValuesOnBTNClick = () => {
  studentDataForm.reset();
  formSubmitted = false;
  let errorSpans = document.querySelectorAll(".form-error");
  errorSpans.forEach((span) => {
    span.innerText = "";
  });
  let inputFields = document.querySelectorAll("input");
  inputFields.forEach((input) => {
    input.hasAttribute("style") && input.removeAttribute("style");
  });

  for (let i = educationFormTotalChildresns; i > 2; i--) {
    educationForm.lastElementChild.remove();
  }
};

const editStudent = (id) => {
  isEditMode = true;
  selectedStuID = id;
  let selectedStudent = studentFullData.find(
    (student) => student.personalDetails.id === id
  );
  document.getElementById("firstNameInput").value =
    selectedStudent.personalDetails.firstName;
  document.getElementById("lastNameInput").value =
    selectedStudent.personalDetails.lastName;
  document.getElementById("birthDateInput").value =
    selectedStudent.personalDetails.birthDate;
  document.getElementById("emailInput").value =
    selectedStudent.personalDetails.email;
  document.getElementById("addressInput").value =
    selectedStudent.personalDetails.address;
  document.getElementById("gradYearInput").value =
    selectedStudent.personalDetails.gradYear;

  for (let i = 0; i < educationFormTotalChildresns; i++) {
    educationForm.children[i].querySelector(".degree-class").value =
      selectedStudent.educationDetails[i].degree;
    educationForm.children[i].querySelector(".schclg-class").value =
      selectedStudent.educationDetails[i].schClg;
    educationForm.children[i].querySelector(".startdate-class").value =
      selectedStudent.educationDetails[i].startDate;
    educationForm.children[i].querySelector(".passout-class").value =
      selectedStudent.educationDetails[i].passoutYear;
    educationForm.children[i].querySelector(".percentage-class").value =
      selectedStudent.educationDetails[i].percentage;
    educationForm.children[i].querySelector(".backlog-class").value =
      selectedStudent.educationDetails[i].backLog;
  }
};
