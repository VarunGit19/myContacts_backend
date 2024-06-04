const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")

// @desc Get all contacts
// @route GET /api/contacts
// @access public
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts)
})


// @desc Create a contact
// @route POST /api/contacts
// @access public
const createContact = asyncHandler(async (req, res) => {
    const { name, email, number } = req.body;
    if (!name || !email || !number) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    const userAvailable = await Contact.findOne({email})
    if(userAvailable) {        
        res.status(400);
        throw new Error("User already registered!")
    }

    const contact = await Contact.create({
        name,
        email,
        number,
        user_id: req.user.id
    })
    res.status(201).json(contact)
})

// @desc Get contact with id
// @route GET /api/contacts/:id
// @access public
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(404)
        throw new Error("contact not found")
    }
    res.status(200).json(contact)
})


// @desc Update contact with id
// @route PUT /api/contacts/:id
// @access public
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(404)
        throw new Error("contact not found")
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.send(403)
        throw new Error("User is not authorized")
    }

    const updatedContact = Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: True}
    )
    res.status(200).json({ message: `Update Contact for ${req.params.id}` })
})


// @desc Delete contact with id
// @route DELETE /api/contacts/:id
// @access public
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(404)
        throw new Error("contact not found")
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.send(403)
        throw new Error("User is not authorized")
    }

    await contact.deleteOne();

    res.status(200).json(contact)
})



module.exports = { getContacts, createContact, getContact, updateContact, deleteContact }