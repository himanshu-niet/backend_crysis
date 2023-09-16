const asyncHandler = require("express-async-handler");

const generateToken = require("../config/generateToken");
const Agency = require("../models/agencyModel");

const registerAgency = asyncHandler(async (req, res) => {
    const {
        agencyName,
        agencyType,
        email,
        contactInformation,
        headquartersLocation,
        address,
        agencyID,
        specialization,
        coverageArea,
        hoursOfOperation,
        emergencyResponseHistory,
        trainingAndCertifications,
        password,
    } = req.body;

    if (!agencyName,
        !agencyType,
        !email,
        !contactInformation,
        !headquartersLocation,
        !address,
        !agencyID,
        !specialization,
        !coverageArea,
        !hoursOfOperation,
        !emergencyResponseHistory,
        !trainingAndCertifications,
        !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    
    const agencyExists = await Agency.findOne({ email });

    if (agencyExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const agency = await Agency.create({
        agencyName,
        agencyType,
        email,
        contactInformation,
        headquartersLocation,
        address,
        agencyID,
        specialization,
        coverageArea,
        hoursOfOperation,
        emergencyResponseHistory,
        trainingAndCertifications,
        password
    });

    if (agency) {
        res.status(201).json(
            { message: 'Agency registered successfully' }
        );
    } else {
        res.status(400);
        throw new Error("Agency not found");
    }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public

const authAgency = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body;

    const agency = await Agency.findOne({ email });
    console.log(agency)

    if (agency && (await agency.matchPassword(password))) {

        const agencyData = { ...agency.toObject() };
        delete agencyData.password;

        res.status(200).json({
            agencyData,
            token: generateToken(agency._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});









module.exports = { registerAgency, authAgency };