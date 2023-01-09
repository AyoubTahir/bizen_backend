import mongoose from "mongoose";

export const validate = (data, rules) => {
  let errors = {};

  Object.keys(rules).forEach(function (key) {
    //console.log(key, data[key]);
    errors[key] = [];
    if (Object.keys(data).includes(key)) {
      const rulesArray = rules[key].split("|");
      rulesArray.forEach((rule) => {
        if (rule.includes(":")) {
          const errMessage = rulesHandler(
            rule.split(":")[0],
            rule.split(":")[1],
            data,
            key
          );
          !!errMessage && errors[key].push(errMessage);
        } else {
          const errMessage = rulesHandler(rule, null, data, key);
          !!errMessage && errors[key].push(errMessage);
        }
      });
    } else {
      errors[key].push(`${key} is required`);
    }
  });

  let isValid = Object.values(errors).every((error) => error.length === 0);
  let cleanErrors = {};
  Object.keys(errors).forEach((key) => {
    if (errors[key].length > 0) {
      cleanErrors[key] = errors[key];
    }
  });
  return [isValid, cleanErrors];
};

export const validateID = (res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "Invalid ID" });
};

const rulesHandler = (rule, value, data, key) => {
  switch (rule) {
    case "min":
      if (data[key].length < parseInt(value)) {
        return `${key} should be more then ${value}`;
      }
      return "";
      break;
    case "max":
      if (data[key].length > parseInt(value)) {
        return `${key} should be less then ${value}`;
      }
      return "";
      break;
    case "required":
      if (data[key] === "") {
        return `${key} is required`;
      }
      return "";
      break;
    case "email":
      if (!emailValidation(data[key])) {
        return `${key} is not valid`;
      }
      return "";
      break;
    case "number":
      if (!isNumeric(data[key])) {
        return `${key} it's not a number`;
      }
      return "";
      break;
    case "array":
      if (!Array.isArray(data[key])) {
        return `${key} it's not an array`;
      }
      return "";
      break;
    case "array.full":
      if (!Array.isArray(data[key])) {
        return `${key} it's not an array`;
      } else if (data[key].length <= 0) {
        return `${key} array is empty`;
      }
      return "";
      break;
    default:
    // code block
  }
};

const emailValidation = (email) => {
  let filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test(email)) {
    return true;
  } else {
    return false;
  }
};

const isNumeric = (num) => typeof num === "number" && !isNaN(num);
