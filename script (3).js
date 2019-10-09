let disButton = document.getElementsByClassName("control-phone__formatted js-form-changes-skip linked-form__cf js-linked-pei text-input");
let getElemButton = document.getElementById("save_and_close_contacts_link");
let buttonsMenu = document.getElementsByClassName('card-fields__button-block')[0];
let controlButton = document.createElement('button');
controlButton.id = "ourButtonForCheckDoubles";
controlButton.style = "margin-left: auto; height: 40px; width: 80px; border: 1px solid blue; color: blue;";
controlButton.innerText = "Проверить данные";
buttonsMenu.append(controlButton);
controlButton = document.getElementById('ourButtonForCheckDoubles');
let l = disButton.length;
let b = document.getElementById('new_company');
var phoneNumber;
let trashFlag;
for (let i = 0; i < l; i++) {

    disButton[i].oninput = function () {
        if ($(b > disButton[i])) continue;
        if (disButton[i].value !== "") {
            getElemButton.setAttribute("disabled", "disabled");
            getElemButton.style = "background-color: red";
        } else {
            getElemButton.removeAttribute("disabled");
            getElemButton.style = "background-color: #4d85e6";
        }
    };
}

controlButton.onclick = function () {
    for (let i = 0; i < l; i++) {
        if ($(b > disButton[i])) continue;
        phoneNumber = disButton[i].value;
        if (phoneNumber == "") continue;
        phoneNumber = String(phoneNumber);
        phoneNumber = phoneNumber.match(/[0-9]/gi).join('');
        if (phoneNumber[0] == 8 || phoneNumber[0] == 7) {
            phoneNumber = phoneNumber.slice(1);
            usersPhoneValues = phoneNumber;
            fetch(`/api/v2/contacts?query=${phoneNumber}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    return result = result["_embedded"]["items"];
                })
                .then(function (result) {
                    for (let i = 0; i < result.length; i++) {
                        return result = result[i];
                    }
                })
                .then(function (result) {
                    for (let j = 0; j < result["custom_fields"].length; j++) {
                        return result = result["custom_fields"][j];
                    }
                })
                .then(function (result) {

                    return result = result["values"];

                })
                .then(function (result) {
                    for (let x = 0; x < result.length; x++) {
                        finallyResult = result[x]["value"];
                        trashFlag = usersPhoneValues == finallyResult.slice(1);
                        if (trashFlag) {
                            getElemButton.setAttribute("disabled", "disabled");
                            getElemButton.style = "background-color: red";
                            var message_params = {
                                header: "Внимание",
                                text: "Контакт уже существует",
                                icon: "https://img.icons8.com/color/48/000000/mongrol.png"
                            };
                            AMOCRM.notifications.show_message(message_params);
                            break;
                        } else {
                            getElemButton.removeAttribute("disabled");
                            getElemButton.style = "background-color: #4d85e6";
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    getElemButton.removeAttribute("disabled");
                    getElemButton.style = "background-color: #4d85e6";
                    return trashFlag = false;
                });
        }
        trashFlag = false;
    }
};
