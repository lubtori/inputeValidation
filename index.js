module.exports = class InputValidation {
  constructor(schema = null) {
    this.schema = schema;
    this.inputs = null;
    this.validatedObj = {
      status: true,
      fields: {},
    };

    try {
      if (this.schema === null) throw "Schema required";
      if (typeof this.schema !== "object") throw "Schema should be an object";
    } catch (err) {
      console.log(err);
    }
  }

  /* check invalid log */
  /* if schema has invalid log for certain key */
  checkInvalidLog(schemaKey, errorKey) {
    if (
      this.schema[schemaKey].invalidLog != undefined &&
      this.schema[schemaKey].invalidLog[errorKey] != undefined
    ) {
      this.validatedObj.fields[schemaKey].invalidLog = {
        [errorKey]: this.schema[schemaKey].invalidLog[errorKey],
      };
    }
  }

  /* check valid log */
  /* if schema has valid log for certain key */
  checkValidLog(schemaKey, validKey) {
    if (
      this.schema[schemaKey].validLog != undefined &&
      this.schema[schemaKey].validLog[validKey] != undefined
    ) {
      this.validatedObj.fields[schemaKey].validLog = {
        [validKey]: this.schema[schemaKey].validLog[validKey],
      };
    }
  }

  /* set invalid status for certain key */
  setInvalid(schemaKey, errorKey, value = false) {
    this.validatedObj.fields[schemaKey][errorKey] = value;
    this.validatedObj.fields[schemaKey].status = false;
    this.validatedObj.status = false;
    this.checkInvalidLog(schemaKey, errorKey);
  }

  /* set valid for certain key */
  setValid(schemaKey, validKey, value = true) {
    this.validatedObj.fields[schemaKey][validKey] = value;
    if (this.validatedObj.fields[schemaKey].status === undefined)
      this.validatedObj.fields[schemaKey].status = true;

    this.checkValidLog(schemaKey, validKey);
  }

  /* check minimum range of input */
  checkMinimum(schemaKey) {
    const inputSchema = this.schema[schemaKey];
    const input = this.inputs[schemaKey];

    if (inputSchema.min !== undefined && typeof inputSchema.min === "number") {
      if (input.length > inputSchema.min) {
        this.setValid(schemaKey, "min");
      } else {
        this.setInvalid(schemaKey, "min");
      }
    }
    return this.validatedObj.fields[schemaKey].status;
  }

  /* check maximum range of input */
  checkMaximum(schemaKey) {
    const inputSchema = this.schema[schemaKey];
    const input = this.inputs[schemaKey];

    if (inputSchema.max !== undefined && typeof inputSchema.max === "number") {
      if (input.length <= inputSchema.max) {
        this.validatedObj.fields[schemaKey].max = true;
      } else {
        this.setInvalid(schemaKey, "max");
      }
    }
    return this.validatedObj.fields[schemaKey].status;
  }

  /*check certain field is empty or not */
  checkEmpty(schemaKey) {
    const input = this.inputs[schemaKey];
    const inputSchema = this.schema[schemaKey];

    if (
      inputSchema.isRequired !== undefined &&
      inputSchema.isRequired !== false
    ) {
      if (!input || input === "") {
        this.setInvalid(schemaKey, "isRequired");
      } else {
        this.setValid(schemaKey, "isRequired");
      }

      return this.validatedObj.fields[schemaKey].status;
    }
    return true;
  }

  /* schema type = text validation */
  validateText(schemaKey) {
    /* checking if a given schema key is not not matching with given input key */
    if (this.inputs[schemaKey] !== null) {
      if (this.checkEmpty(schemaKey)) {
        /* validate maximum-minimum if string is not empty */
        this.checkMinimum(schemaKey);
        this.checkMaximum(schemaKey);
      }
    } else {
      this.validatedObj.fields[schemaKey] = {
        warning: "this field is not present in the given inputs field",
      };
    }
  }

  /* entry point of validation */
  /* after envoking this function validation will be start */
  validate(inputs = null) {
    this.inputs = inputs;

    /* inputs can not be null  */
    try {
      if (this.inputs === null) throw "no object provided for validation";
    } catch (err) {
      console.log(err);
    }

    /* iterate over all schema key and validate according to given inputs data*/
    for (let schemaKey in this.schema) {
      try {
        if (
          this.schema[schemaKey].type === null ||
          this.schema[schemaKey].type === undefined
        ) {
          throw `type field required for [${schemaKey}] `;
        } else {
          switch (this.schema[schemaKey].type) {
            case "text":
              this.validatedObj.fields[schemaKey] = {};
              this.validateText(schemaKey);
          }
        }
      } catch (err) {
        console.log(err);
        return;
      }
    }
    return this.validatedObj;
  }
};
