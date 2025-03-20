const joi = require("joi");

exports.registerUserValidator = (req, res, next) => {
    const schema = joi.object({
        fullName: joi.string().trim().min().pattern(/^[A-Za-z]+$/).required().messages({
            "any.required": "fullname is required",
            "string:empty": "FullName cannot be empty",
            "string.min": "fullname must be at leaset 5 character long",
            "string.pattern.base": "fullname cannnot contain number or special character"
        }),
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    const {error} = schema.validate(req.body, {abortEarly: false})
    if(error) {
        return res.status(400).json({
            message: error.message
        })
    }
    next()
}