const InputValidation = require("./index");
const express = require("express");
const app = express();
app.get("/", function (req, res) {
  const schema = {
    name: {
      type: "text",
      min: 4,
      max: 10,
      isRequired: true,
      invalidLog: {
        isRequired: "Field Required",
      },

      validLog: {
        isRequired: "s",
      },
    },
    email: {
      isRequired: true,
      type: "text",
      min: 10,
      max: 12,
      invalidLog: {
        min: "Minimum 10 charecter",
        max: "Maximum 12 charecter",
      },
      validLog: {
        min: "success",
        max: "success",
      },
    },
  };
  const validation = new InputValidation(schema);

  res.send(
    validation.validate({
      name: "rifat",
      email: "rifat@sarker71@gmail.cmodfkdkf",
    })
  );
});

app.listen(3000, () => console.log("listening"));
